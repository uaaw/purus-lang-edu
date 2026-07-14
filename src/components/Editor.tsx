"use client";

import { useRef, useCallback } from "react";
import MonacoEditor, { type OnMount, type BeforeMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { registerPurusLanguage } from "@/lib/purus-lang";

interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  onRun?: () => void;
}

export default function Editor({
  value,
  onChange,
  language = "purus",
  readOnly = false,
  height = "100%",
  onRun,
}: EditorProps) {
  const monacoRef = useRef<typeof Monaco | null>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleBeforeMount: BeforeMount = useCallback(
    (monaco) => {
      if (language === "purus") {
        registerPurusLanguage(monaco);
      }
    },
    [language],
  );

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      if (onRun) {
        editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          () => onRun(),
        );
      }

      editor.focus();
    },
    [onRun],
  );

  const handleChange = useCallback(
    (val: string | undefined) => {
      onChange?.(val ?? "");
    },
    [onChange],
  );

  return (
    <div style={{ height, width: "100%" }}>
      <MonacoEditor
        height={height}
        language={language}
        theme={language === "purus" ? "purus-dark" : "vs-dark"}
        value={value}
        onChange={handleChange}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        loading={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#a1a1aa",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            Loading editor...
          </div>
        }
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          tabSize: 2,
          scrollBeyondLastLine: false,
          readOnly,
          lineNumbers: "on",
          renderLineHighlight: "line",
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12, bottom: 12 },
          fontFamily:
            "'Fira Code', 'Cascadia Code', var(--font-geist-mono), ui-monospace, monospace",
          fontLigatures: true,
        }}
      />
    </div>
  );
}
