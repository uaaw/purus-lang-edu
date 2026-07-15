import vm from "vm";
import { compile } from "purus";
import { getLessonById, type TestCase } from "./lessons";

const EXECUTION_TIMEOUT_MS = 5000;
const TEST_TIMEOUT_MS = 2000;

export interface TestResultEntry {
  id: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  error?: string;
}

export interface RunResult {
  stdout: string[];
  stderr: string[];
  runtimeError?: string;
}

export interface GradeResult extends RunResult {
  testResults: TestResultEntry[];
  allPassed: boolean;
}

interface ExecutionState extends RunResult {
  context: vm.Context;
  dispose: () => void;
}

export function compilePurus(code: string): string {
  return compile(code, { header: false, strict: false, type: "module" });
}

export function executeCompiled(compiled: string): RunResult {
  const state = createExecutionState(compiled);
  try {
    return {
      stdout: state.stdout,
      stderr: state.stderr,
      runtimeError: state.runtimeError,
    };
  } finally {
    state.dispose();
  }
}

export async function gradeLesson(code: string, lessonId: string): Promise<GradeResult> {
  const lesson = getLessonById(lessonId);
  if (!lesson) throw new Error("Unknown lesson");
  return gradeCompiledLesson(compilePurus(code), lesson.tests);
}

export async function gradeCompiledLesson(
  compiled: string,
  tests: readonly TestCase[]
): Promise<GradeResult> {
  const state = createExecutionState(compiled);
  try {
    if (state.runtimeError || state.stderr.length > 0) {
      return {
        stdout: state.stdout,
        stderr: state.stderr,
        runtimeError: state.runtimeError,
        testResults: tests.map((test) => failedResult(test, state.runtimeError ?? "stderr output")),
        allPassed: false,
      };
    }

    const testResults: TestResultEntry[] = [];
    for (const test of tests) {
      testResults.push(await runTest(state, test));
    }

    return {
      stdout: state.stdout,
      stderr: state.stderr,
      runtimeError: state.runtimeError,
      testResults,
      allPassed: state.stderr.length === 0 && testResults.length > 0 && testResults.every((result) => result.passed),
    };
  } finally {
    state.dispose();
  }
}

function createExecutionState(compiled: string): ExecutionState {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const sandbox = {
    console: {
      log: (...args: unknown[]) => stdout.push(args.map(formatValue).join(" ")),
      info: (...args: unknown[]) => stdout.push(args.map(formatValue).join(" ")),
      error: (...args: unknown[]) => stderr.push(args.map(formatValue).join(" ")),
      warn: (...args: unknown[]) => stderr.push(args.map(formatValue).join(" ")),
    },
    Math,
    JSON,
    Date,
    parseInt,
    parseFloat,
    String,
    Number,
    Boolean,
    Array,
    Object,
    Error,
    TypeError,
    RangeError,
    Promise,
    setTimeout: (fn: (...args: unknown[]) => void, ms = 0, ...args: unknown[]) => {
      const handle = globalThis.setTimeout(() => {
        timers.delete(handle);
        try {
          fn(...args);
        } catch (error: unknown) {
          stderr.push(errorMessage(error));
        }
      }, Math.min(Math.max(ms, 0), TEST_TIMEOUT_MS));
      timers.add(handle);
      return handle;
    },
    clearTimeout: (handle: ReturnType<typeof setTimeout>) => {
      globalThis.clearTimeout(handle);
      timers.delete(handle);
    },
    process: {
      env: {},
      stdout: { write: (value: unknown) => stdout.push(String(value)) },
      stderr: { write: (value: unknown) => stderr.push(String(value)) },
    },
  };

  const context = vm.createContext(sandbox);
  let runtimeError: string | undefined;
  try {
    const script = new vm.Script(compiled, { filename: "purus-run.js" });
    script.runInContext(context, { timeout: EXECUTION_TIMEOUT_MS });
  } catch (error: unknown) {
    runtimeError = errorMessage(error);
    stderr.push(runtimeError);
  }

  return {
    context,
    stdout,
    stderr,
    runtimeError,
    dispose: () => {
      for (const timer of timers) globalThis.clearTimeout(timer);
      timers.clear();
    },
  };
}

async function runTest(state: ExecutionState, test: TestCase): Promise<TestResultEntry> {
  try {
    if (test.type === "output") {
      const actual = state.stdout.join("\n");
      const expected = test.expectedOutput ?? "";
      return { id: test.id, passed: actual === expected, expected, actual };
    }

    const expression = test.type === "variable" ? test.variableName : test.callExpression;
    if (!expression) return failedResult(test, "Invalid server test");

    const outputStart = state.stdout.length;
    const evaluated = vm.runInContext(expression, state.context, { timeout: TEST_TIMEOUT_MS });
    const actual = await awaitWithTimeout(evaluated, TEST_TIMEOUT_MS);
    const expected = test.type === "variable" ? test.expectedValue : test.expectedReturnValue;
    const actualOutput = state.stdout.slice(outputStart).join("\n");
    const outputPassed = test.expectedOutput === undefined || actualOutput === test.expectedOutput;
    return {
      id: test.id,
      passed: compareValues(actual, expected) && outputPassed,
      expected: test.expectedOutput === undefined ? expected : { value: expected, output: test.expectedOutput },
      actual: test.expectedOutput === undefined ? actual : { value: actual, output: actualOutput },
    };
  } catch (error: unknown) {
    return failedResult(test, errorMessage(error));
  }
}

async function awaitWithTimeout(value: unknown, timeoutMs: number): Promise<unknown> {
  if (!isPromiseLike(value)) return value;

  let handle: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    handle = globalThis.setTimeout(() => reject(new Error("Test timed out")), timeoutMs);
  });
  try {
    return await Promise.race([Promise.resolve(value), timeout]);
  } finally {
    if (handle) globalThis.clearTimeout(handle);
  }
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    (typeof value === "object" && value !== null) || typeof value === "function"
  ) && typeof (value as PromiseLike<unknown>).then === "function";
}

function failedResult(test: TestCase, error: string): TestResultEntry {
  return {
    id: test.id,
    passed: false,
    expected: expectedValue(test),
    actual: undefined,
    error,
  };
}

function expectedValue(test: TestCase): unknown {
  if (test.type === "output") return test.expectedOutput;
  if (test.type === "variable") return test.expectedValue;
  return test.expectedReturnValue;
}

function compareValues(actual: unknown, expected: unknown): boolean {
  if (Object.is(actual, expected)) return true;
  if (typeof actual !== "object" || actual === null || typeof expected !== "object" || expected === null) {
    return false;
  }
  try {
    return JSON.stringify(actual) === JSON.stringify(expected);
  } catch {
    return false;
  }
}

function formatValue(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
