"use client";

import { use, useState, useCallback, useRef, type MouseEvent } from "react";
import { notFound } from "next/navigation";
import { getLessonById, type Lesson } from "@/lib/lessons";
import { executePurus, executeAndTest, type TestResult } from "@/lib/purus";
import { t, type Locale } from "@/lib/i18n";
import { createLessonShareUrl } from "@/lib/share";
import Editor from "@/components/Editor";
import { OutputPane } from "@/components/OutputPane";

/* Simple markdown to HTML for lesson descriptions */
function mdToHtml(md: string): string {
  let html = md;
  const blocks: string[] = [];

  /* Preserve fenced code blocks with placeholders to protect from paragraph wrapping */
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, _lang, code) => {
      const idx = blocks.length;
      blocks.push(`<pre><code>${code}</code></pre>`);
      return `\n%%BLOCK_${idx}%%\n`;
    }
  );

  /* Tables */
  html = html.replace(
    /\n\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/g,
    (_match, header, body) => {
      const ths = header
        .split("|")
        .filter((c: string) => c.trim())
        .map((c: string) => `<th>${c.trim()}</th>`)
        .join("");
      const rows = body
        .trim()
        .split("\n")
        .map((row: string) => {
          const tds = row
            .split("|")
            .filter((c: string) => c.trim())
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${tds}</tr>`;
        })
        .join("");
      return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );

  /* Headers */
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  /* Inline code */
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  /* Bold */
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  /* Unordered lists */
  html = html.replace(
    /(?:^- .+\n?)+/gm,
    (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((line) => `<li>${line.replace(/^- /, "")}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }
  );

  /* Links */
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  /* Paragraphs - wrap remaining non-empty, non-HTML lines */
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, (match) => {
    if (match.trim() === "") return match;
    if (match.trim().startsWith("%%BLOCK_")) return match;
    return `<p>${match}</p>`;
  });

  /* Restore protected code blocks */
  blocks.forEach((block, i) => {
    html = html.replace(`%%BLOCK_${i}%%`, block);
  });

  /* Clean up excessive blank lines */
  html = html.replace(/\n{3,}/g, "\n\n");

  return html;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  const l = locale as Locale;
  const lesson = getLessonById(id);

  if (!lesson) {
    notFound();
  }

  return <LessonWorkspace key={`${lesson.id}:${l}`} lesson={lesson} l={l} />;
}

function LessonWorkspace({ lesson, l }: { lesson: Lesson; l: Locale }) {
  const [code, setCode] = useState(() => l === "ja" ? lesson.starterCode : lesson.starterCodeEn);
  const [stdout, setStdout] = useState<string[]>([]);
  const [stderr, setStderr] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | undefined>(undefined);
  const [allPassed, setAllPassed] = useState<boolean | undefined>(undefined);
  const descRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  const invalidateResult = useCallback(() => {
    requestIdRef.current += 1;
    setIsLoading(false);
    setHasRun(false);
    setTestResults(undefined);
    setAllPassed(undefined);
  }, []);

  const handleRun = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setStdout([]);
    setStderr([]);
    setTestResults(undefined);
    setAllPassed(undefined);
    try {
      if (lesson.tests.length > 0) {
        const result = await executeAndTest(code, lesson.id);
        if (requestId !== requestIdRef.current) return;
        setStdout(result.stdout);
        setStderr(result.stderr);
        setTestResults(result.testResults);
        setAllPassed(result.allPassed);
      } else {
        const result = await executePurus(code);
        if (requestId !== requestIdRef.current) return;
        setStdout(result.stdout);
        setStderr(result.stderr);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setStderr([
        err instanceof Error ? err.message : "Execution failed",
      ]);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
        setHasRun(true);
      }
    }
  }, [code, lesson]);

  const handleReset = useCallback(() => {
    invalidateResult();
    setCode(l === "ja" ? lesson.starterCode : lesson.starterCodeEn);
    setStdout([]);
    setStderr([]);
  }, [invalidateResult, lesson, l]);

  const handleToggleSolution = useCallback(() => {
    invalidateResult();
    setStdout([]);
    setStderr([]);
    if (!showSolution) {
      setCode(lesson.solution);
    } else {
      setCode(l === "ja" ? lesson.starterCode : lesson.starterCodeEn);
    }
    setShowSolution((prev) => !prev);
  }, [invalidateResult, showSolution, lesson, l]);

  const handleCodeChange = useCallback((value: string) => {
    invalidateResult();
    setCode(value);
  }, [invalidateResult]);

  const handleShare = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.href = createLessonShareUrl(l, lesson, window.location.href);
  }, [l, lesson]);

  const description = l === "ja" ? lesson.description : lesson.descriptionEn;

  return (
    <div className="flex flex-col lg:flex-row h-full" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Left panel: description + editor */}
      <div className="flex flex-col flex-1 min-w-0 lg:border-r" style={{ borderColor: "var(--color-border)" }}>
        {/* Toolbar */}
        <div
          className="flex items-center justify-between gap-2 px-4 py-2 border-b shrink-0"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-secondary)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="text-xs font-medium shrink-0"
              style={{ color: "var(--color-accent)" }}
            >
              Lesson {String(lesson.number).padStart(2, "0")}
            </span>
            <h1
              className="text-sm font-semibold truncate"
              style={{ color: "var(--color-text)" }}
            >
              {l === "ja" ? lesson.titleJa : lesson.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="px-2 py-1 text-xs rounded"
              style={{
                color: "var(--color-text-muted)",
                backgroundColor: "var(--color-bg-tertiary)",
              }}
            >
              {t(l, "reset")}
            </button>
            <button
              onClick={handleToggleSolution}
              className="px-2 py-1 text-xs rounded"
              style={{
                color: showSolution
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)",
                backgroundColor: showSolution
                  ? "var(--color-accent-muted)"
                  : "var(--color-bg-tertiary)",
              }}
            >
              {showSolution ? t(l, "hideSolution") : t(l, "showSolution")}
            </button>
            <button
              onClick={handleRun}
              disabled={isLoading}
              className="btn-accent px-3 py-1 text-xs font-medium rounded"
            >
              {isLoading ? t(l, "running") : t(l, "run")}
            </button>
          </div>
        </div>

        {/* Description */}
        <div
          ref={descRef}
          className="lesson-description overflow-auto px-5 py-4 border-b shrink-0 max-h-60 lg:max-h-72"
          style={{
            borderColor: "var(--color-border)",
            fontSize: "14px",
          }}
          dangerouslySetInnerHTML={{ __html: mdToHtml(description) }}
        />

        {/* Editor */}
        <div className="flex-1 min-h-[250px]">
          <Editor
            value={code}
            onChange={handleCodeChange}
            onRun={handleRun}
            height="100%"
          />
        </div>
      </div>

      {/* Right panel: output */}
      <div className="lg:w-[400px] xl:w-[480px] border-t lg:border-t-0 shrink-0 h-[40vh] lg:h-full flex flex-col" style={{ borderColor: "var(--color-border)" }}>
        {allPassed === true && (
          <div
            className="flex items-center justify-between gap-3 px-4 py-2 text-sm font-medium shrink-0"
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "#22c55e",
              borderBottom: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <span>{t(l, "lessonCompleted")}</span>
            <a
              href="https://twitter.com/intent/tweet"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleShare}
              className="rounded px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: "#111", color: "#fff" }}
            >
              {t(l, "shareOnX")}
            </a>
          </div>
        )}
        <div className="flex-1 min-h-0">
          <OutputPane stdout={stdout} stderr={stderr} isLoading={isLoading} locale={l} hasRun={hasRun} testResults={testResults} allPassed={allPassed} />
        </div>
      </div>
    </div>
  );
}
