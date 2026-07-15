/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const sourcePath = process.env.SHARE_SOURCE ?? "src/lib/share.ts";
const outputPath = path.join(os.tmpdir(), `purus-share-${process.pid}.cjs`);
const output = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
  fileName: sourcePath,
}).outputText;
fs.writeFileSync(outputPath, output);
const { createLessonShareUrl } = require(outputPath);

const lesson = { number: 2, title: "Variables", titleJa: "変数" };
const rawLessonUrl = "https://learn.example/en/lessons/02-variables?from=dashboard#result";
const cleanLessonUrl = "https://learn.example/en/lessons/02-variables";

function assertIntent(actual, expectedText) {
  const intent = new URL(actual);
  assert.equal(intent.origin, "https://twitter.com");
  assert.equal(intent.pathname, "/intent/tweet");
  assert.deepEqual([...intent.searchParams.keys()], ["text"]);
  assert.equal(intent.searchParams.get("text"), expectedText);
  assert.equal(decodeURIComponent(intent.search.slice("?text=".length).replace(/\+/g, " ")), expectedText);
}

test("Japanese share intent matches the completion format", () => {
  assertIntent(
    createLessonShareUrl("ja", lesson, rawLessonUrl),
    `purusレッスン#2[変数]を修了しました！\nみんなも学んでみない？\n${cleanLessonUrl}`
  );
});

test("English share intent matches the completion format", () => {
  assertIntent(
    createLessonShareUrl("en", lesson, rawLessonUrl),
    `I completed purus Lesson #2 [Variables]!\nWhy don't you learn purus too?\n${cleanLessonUrl}`
  );
});
