import { NextRequest, NextResponse } from "next/server";
import { getLessonById } from "@/lib/lessons";
import {
  compilePurus,
  executeCompiled,
  gradeCompiledLesson,
} from "@/lib/grading";

const MAX_CODE_LENGTH = 50000;
const ACTIONS = new Set(["compile", "run", "run-and-test"]);
const GRADING_KEYS = new Set(["code", "action", "lessonId"]);

type RunAction = "compile" | "run" | "run-and-test";

interface RunRequest {
  code: string;
  action: RunAction;
  lessonId?: string;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const validationError = validateRequest(body);
  if (validationError) {
    return badRequest(validationError);
  }

  const { code, action, lessonId } = body as RunRequest;
  let compiled: string;
  try {
    compiled = compilePurus(code);
  } catch (error: unknown) {
    return badRequest(`Compilation error: ${errorMessage(error)}`);
  }

  if (action === "compile") {
    return NextResponse.json({ compiled });
  }

  if (action === "run") {
    return NextResponse.json({ compiled, ...executeCompiled(compiled) });
  }

  const lesson = getLessonById(lessonId as string);
  if (!lesson) {
    return badRequest("Unknown lesson");
  }

  const result = await gradeCompiledLesson(compiled, lesson.tests);
  return NextResponse.json({ compiled, ...result });
}

function validateRequest(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return "Invalid request body";
  }

  const value = body as Record<string, unknown>;
  if (typeof value.code !== "string" || value.code.length === 0) {
    return "Code is required";
  }
  if (value.code.length > MAX_CODE_LENGTH) {
    return `Code too large (max ${MAX_CODE_LENGTH} characters)`;
  }
  if (typeof value.action !== "string" || !ACTIONS.has(value.action)) {
    return "Invalid action";
  }

  if (value.action === "run-and-test") {
    if (typeof value.lessonId !== "string" || value.lessonId.length === 0) {
      return "Lesson ID is required";
    }
    if (Object.keys(value).some((key) => !GRADING_KEYS.has(key))) {
      return "Invalid grading request";
    }
  }

  return undefined;
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
