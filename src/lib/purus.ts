/**
 * Client-side helpers for compiling and executing Purus code.
 * The purus npm package uses child_process, so browser code must go through the API route.
 */

export interface TestResult {
  id: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  error?: string;
}

export interface ExecutionResult {
  stdout: string[];
  stderr: string[];
  testResults?: TestResult[];
  allPassed?: boolean;
}

/**
 * Compile Purus source to JavaScript via the /api/run endpoint.
 */
export async function compileViaApi(code: string): Promise<string> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, action: "compile" }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Compile request failed (${res.status})`);
  }

  const data = await res.json();
  return data.compiled as string;
}

/**
 * Execute Purus code via the /api/run endpoint.
 * Returns captured stdout, stderr, and optional test results.
 */
export async function executePurus(code: string): Promise<ExecutionResult> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, action: "run" }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Execution request failed (${res.status})`);
  }

  const data = await res.json();
  return {
    stdout: data.stdout ?? [],
    stderr: data.stderr ?? [],
    testResults: data.testResults as TestResult[] | undefined,
  };
}

/**
 * Execute Purus code and run test validations via the /api/run endpoint.
 */
export async function executeAndTest(
  code: string,
  lessonId: string
): Promise<ExecutionResult> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, action: "run-and-test", lessonId }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Execution request failed (${res.status})`);
  }

  const data = await res.json();
  return {
    stdout: data.stdout ?? [],
    stderr: data.stderr ?? [],
    testResults: data.testResults ?? [],
    allPassed: data.allPassed,
  };
}
