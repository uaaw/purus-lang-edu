import { NextRequest, NextResponse } from "next/server";
import vm from "vm";
import { compile } from "purus";

const TIMEOUT_MS = 5000;

interface RunRequest {
  code: string;
  action: "compile" | "run";
}

export async function POST(request: NextRequest) {
  try {
    const body: RunRequest = await request.json();
    const { code, action } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    if (code.length > 50000) {
      return NextResponse.json(
        { error: "Code too large (max 50000 characters)" },
        { status: 400 }
      );
    }

    let compiled: string;
    try {
      compiled = compile(code, { header: false, strict: false, type: "module" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `Compilation error: ${message}` },
        { status: 400 }
      );
    }

    if (action === "compile") {
      return NextResponse.json({ compiled });
    }

    const stdout: string[] = [];
    const stderr: string[] = [];

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
      setTimeout: (fn: () => void, ms: number) =>
        globalThis.setTimeout(() => {
          try {
            fn();
          } catch (asyncErr: unknown) {
            const msg = asyncErr instanceof Error ? asyncErr.message : String(asyncErr);
            stderr.push(msg);
          }
        }, Math.min(ms, 2000)),
      process: {
        env: {},
        stdout: { write: (s: string) => stdout.push(s) },
        stderr: { write: (s: string) => stderr.push(s) },
      },
    };

    const context = vm.createContext(sandbox);

    try {
      const script = new vm.Script(compiled, { filename: "purus-run.js" });
      script.runInContext(context, { timeout: TIMEOUT_MS });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      stderr.push(message);
    }

    return NextResponse.json({ compiled, stdout, stderr });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Server error: ${message}` },
      { status: 500 }
    );
  }
}

function formatValue(v: unknown): string {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  }
  return String(v);
}
