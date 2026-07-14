"use client";

import { useState, useEffect } from "react";
import { type Locale, t } from "@/lib/i18n";

interface OutputPaneProps {
  stdout: string[];
  stderr: string[];
  isLoading: boolean;
  locale: Locale;
  hasRun?: boolean;
}

type Tab = "output" | "errors";

export function OutputPane({
  stdout,
  stderr,
  isLoading,
  locale,
  hasRun = false,
}: OutputPaneProps) {
  const [activeTab, setActiveTab] = useState<Tab>("output");

  const hasOutput = stdout.length > 0;
  const hasErrors = stderr.length > 0;

  useEffect(() => {
    if (hasErrors) {
      setActiveTab("errors");
    }
  }, [hasErrors]);

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
        <button
          onClick={() => setActiveTab("output")}
          style={{
            padding: "6px 16px",
            background: activeTab === "output" ? "var(--color-border)" : "transparent",
            color: activeTab === "output" ? "var(--color-text)" : "var(--color-text-muted)",
            border: "none",
            borderBottom:
              activeTab === "output"
                ? "2px solid var(--color-accent)"
                : "2px solid transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {t(locale, "output")}
        </button>
        <button
          onClick={() => setActiveTab("errors")}
          style={{
            padding: "6px 16px",
            background: activeTab === "errors" ? "var(--color-border)" : "transparent",
            color: activeTab === "errors" ? "var(--color-text)" : "var(--color-text-muted)",
            border: "none",
            borderBottom:
              activeTab === "errors"
                ? "2px solid var(--color-accent)"
                : "2px solid transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 500,
            position: "relative",
          }}
        >
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
        ) : hasErrors ? (
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
        )}
      </div>

    </div>
  );
}
