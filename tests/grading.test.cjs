/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

process.env.NODE_PATH = path.resolve("node_modules");
Module._initPaths();

const ts = require("typescript");
const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), "purus-grading-"));

function transpile(sourcePath, outputName, transform = (source) => source) {
  const source = transform(fs.readFileSync(sourcePath, "utf8"));
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: sourcePath,
  }).outputText;
  fs.writeFileSync(path.join(buildDir, outputName), output);
}

transpile("src/lib/lessons.ts", "lessons.js");
transpile("src/lib/grading.ts", "grading.js");
transpile("src/app/api/run/route.ts", "route.js", (source) =>
  source
    .replace('"@/lib/lessons"', '"./lessons"')
    .replace('"@/lib/grading"', '"./grading"')
);

const { lessons } = require(path.join(buildDir, "lessons.js"));
const {
  compilePurus,
  executeCompiled,
  gradeCompiledLesson,
  gradeLesson,
} = require(path.join(buildDir, "grading.js"));
const { POST } = require(path.join(buildDir, "route.js"));
const { NextRequest } = require("next/server");

function request(body) {
  return new NextRequest("http://localhost/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("all solutions pass and all starters fail", async () => {
  assert.equal(lessons.length, 17);
  for (const lesson of lessons) {
    const solution = await gradeLesson(lesson.solution, lesson.id);
    assert.equal(solution.allPassed, true, `${lesson.id} solution`);

    let starterPassed = false;
    try {
      starterPassed = (await gradeLesson(lesson.starterCode, lesson.id)).allPassed;
    } catch {
      starterPassed = false;
    }
    assert.equal(starterPassed, false, `${lesson.id} starter`);
  }
});

test("representative incorrect lessons fail exact server tests", async () => {
  const cases = [
    {
      lessonId: "10-switch",
      code: "fn greet-in lang\n  switch lang\n    case //;en;// then console.log[//;Hello;//]\n    case blank then console.log[//;Unknown language;//]",
    },
    {
      lessonId: "14-async",
      code: "async fn slow-double x\n  return x mul 2\n\nasync fn compute x\n  return 0",
    },
    {
      lessonId: "16-generators",
      code: "fn count-up limit\n  yield 1\n  yield 3\n\nfor v in count-up[3]\n  console.log[v]",
    },
    {
      lessonId: "17-fizzbuzz",
      code: "fn fizzbuzz n to return //;FizzBuzz;//\n\nconsole.log[//;FizzBuzz;//]",
    },
  ];

  for (const item of cases) {
    const result = await gradeLesson(item.code, item.lessonId);
    assert.equal(result.allPassed, false, item.lessonId);
  }
});

test("errors and timeouts cannot pass", async () => {
  const outputTest = [{
    id: "output",
    type: "output",
    label: "output",
    labelJa: "output",
    expectedOutput: "",
  }];
  const stderr = await gradeCompiledLesson('console.error("bad")', outputTest);
  assert.equal(stderr.allPassed, false);

  const runtime = await gradeCompiledLesson('throw new Error("boom")', outputTest);
  assert.equal(runtime.allPassed, false);
  assert.match(runtime.runtimeError, /boom/);

  const runtimeTimeout = await gradeCompiledLesson("while (true) {}", outputTest);
  assert.equal(runtimeTimeout.allPassed, false);
  assert.match(runtimeTimeout.runtimeError, /timed out/);

  const asyncTimeout = await gradeCompiledLesson(
    "async function waitForever() { return new Promise(() => {}); }",
    [{
      id: "async-timeout",
      type: "function",
      label: "async timeout",
      labelJa: "async timeout",
      callExpression: "waitForever()",
      expectedReturnValue: 1,
    }]
  );
  assert.equal(asyncTimeout.allPassed, false);
  assert.equal(asyncTimeout.testResults[0].error, "Test timed out");

  assert.throws(() => compilePurus("use unknown as x"));
  await assert.rejects(() => gradeLesson("console.log[//;ok;//]", "unknown"));
});

test("compile and run actions remain available", () => {
  const compiled = compilePurus("console.log[//;ok;//]");
  assert.match(compiled, /console\.log/);
  const result = executeCompiled(compiled);
  assert.deepEqual(result.stdout, ["ok"]);
  assert.deepEqual(result.stderr, []);
});

test("run-and-test rejects client tests and invalid lesson IDs", async () => {
  const tampered = await POST(request({
    code: "console.log[//;wrong;//]",
    action: "run-and-test",
    lessonId: "01-hello-world",
    tests: [{ type: "output", expectedOutput: "wrong" }],
  }));
  assert.equal(tampered.status, 400);

  const unknown = await POST(request({
    code: "console.log[//;ok;//]",
    action: "run-and-test",
    lessonId: "unknown",
  }));
  assert.equal(unknown.status, 400);

  const invalidAction = await POST(request({
    code: "console.log[//;ok;//]",
    action: "grade",
  }));
  assert.equal(invalidAction.status, 400);

  const valid = await POST(request({
    code: lessons[0].solution,
    action: "run-and-test",
    lessonId: lessons[0].id,
  }));
  assert.equal(valid.status, 200);
  assert.equal((await valid.json()).allPassed, true);
});
