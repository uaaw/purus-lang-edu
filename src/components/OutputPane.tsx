"use client";

import { useState } from "react";
import { type Locale, t } from "@/lib/i18n";

export interface TestResult {
  id: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  error?: string;
}

interface OutputPaneProps {
  stdout: string[];
  stderr: string[];
  isLoading: boolean;
  locale: Locale;
  hasRun?: boolean;
  testResults?: TestResult[];
  allPassed?: boolean;
}

type Tab = "output" | "errors" | "tests";

interface TabSelection {
  tab: Tab;
  stdout: string[];
  stderr: string[];
  testResults?: TestResult[];
}

export function OutputPane({
  stdout,
  stderr,
  isLoading,
  locale,
  hasRun = false,
  testResults,
  allPassed,
}: OutputPaneProps) {
  const [selection, setSelection] = useState<TabSelection | null>(null);

  const hasOutput = stdout.length > 0;
  const hasErrors = stderr.length > 0;
  const hasTests = testResults !== undefined && testResults.length > 0;

  const selectionMatchesResult =
    selection?.stdout === stdout &&
    selection.stderr === stderr &&
    selection.testResults === testResults;
  const activeTab = selectionMatchesResult
    ? selection.tab
    : hasErrors
      ? "errors"
      : hasTests
        ? "tests"
        : "output";

  const selectTab = (tab: Tab) => {
    setSelection({ tab, stdout, stderr, testResults });
  };

  const passedCount = hasTests ? testResults.filter((r) => r.passed).length : 0;
  const totalCount = hasTests ? testResults.length : 0;

  const tabButtonStyle = (tab: Tab) => ({
    padding: "6px 16px",
    background: activeTab === tab ? "var(--color-border)" : "transparent",
    color: activeTab === tab ? "var(--color-text)" : "var(--color-text-muted)",
    border: "none",
    borderBottom:
      activeTab === tab
        ? "2px solid var(--color-accent)"
        : "2px solid transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 500,
    position: "relative" as const,
  });

  const formatValue = (v: unknown): string => {
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    if (typeof v === "string") return v;
    try {
      return JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text)",
        fontFamily:
          "'Fira Code', 'Cascadia Code', var(--font-geist-mono), ui-monospace, monospace",
        fontSize: 13,
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <button onClick={() => selectTab("output")} style={tabButtonStyle("output")}>
          {t(locale, "output")}
        </button>
        <button onClick={() => selectTab("errors")} style={tabButtonStyle("errors")}>
          {t(locale, "errors")}
          {hasErrors && (
            <span
              style={{
                marginLeft: 6,
                background: "var(--color-error)",
                color: "#fff",
                borderRadius: 8,
                padding: "0 6px",
                fontSize: 10,
                lineHeight: "16px",
              }}
            >
              {stderr.length}
            </span>
          )}
        </button>
        <button onClick={() => selectTab("tests")} style={tabButtonStyle("tests")}>
          {t(locale, "tests")}
          {hasTests && (
            <span
              style={{
                marginLeft: 6,
                background: allPassed ? "#22c55e" : "var(--color-error)",
                color: "#fff",
                borderRadius: 8,
                padding: "0 6px",
                fontSize: 10,
                lineHeight: "16px",
              }}
            >
              {passedCount}/{totalCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "12px 16px",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--color-text-muted)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                border: "2px solid var(--color-border)",
                borderTopColor: "var(--color-accent)",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }}
            />
            {t(locale, "running")}
          </div>
        ) : activeTab === "output" ? (
          hasOutput ? (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {stdout.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </pre>
          ) : hasRun ? (
            <div style={{ color: "var(--color-text-muted)" }}>
              {t(locale, "noOutput")}
            </div>
          ) : (
            <div style={{ color: "var(--color-text-muted)" }}>
              {t(locale, "pressCtrlEnter")}
            </div>
          )
        ) : activeTab === "errors" ? (
          hasErrors ? (
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                color: "var(--color-error)",
              }}
            >
              {stderr.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </pre>
          ) : (
            <div style={{ color: "var(--color-text-muted)" }}>{t(locale, "noErrors")}</div>
          )
        ) :
        hasTests ? (
          <div>
            <div
              style={{
                marginBottom: 12,
                padding: "8px 12px",
                borderRadius: 6,
                background: allPassed ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${allPassed ? "#22c55e" : "#ef4444"}`,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: allPassed ? "#22c55e" : "#ef4444",
                }}
              >
                {allPassed
                  ? t(locale, "allTestsPassed")
                  : t(locale, "testsPassed", { passed: passedCount, total: totalCount })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {testResults.map((result) => (
                <div
                  key={result.id}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: result.passed
                      ? "rgba(34,197,94,0.06)"
                      : "rgba(239,68,68,0.06)",
                    border: `1px solid ${result.passed ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: result.passed ? "#22c55e" : "#ef4444",
                        color: "#fff",
                        borderRadius: 4,
                        padding: "2px 5px",
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {t(locale, result.passed ? "passed" : "failed")}
                    </span>
                    <span style={{ fontWeight: 500 }}>{result.id}</span>
                  </div>
                  {!result.passed && (
                    <div style={{ marginTop: 6, paddingLeft: 26, fontSize: 12 }}>
                      {result.error ? (
                        <div style={{ color: "#ef4444" }}>{result.error}</div>
                      ) : (
                        <>
                          <div>
                            <span style={{ color: "var(--color-text-muted)" }}>
                              {t(locale, "expected")}:
                            </span>{" "}
                            <span style={{ color: "#22c55e" }}>{formatValue(result.expected)}</span>
                          </div>
                          <div>
                            <span style={{ color: "var(--color-text-muted)" }}>
                              {t(locale, "actual")}:
                            </span>{" "}
                            <span style={{ color: "#ef4444" }}>{formatValue(result.actual)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--color-text-muted)" }}>
            {t(locale, "runToCheck")}
          </div>
        )}
      </div>
    </div>
  );
}
