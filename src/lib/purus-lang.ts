import type * as Monaco from "monaco-editor";

/**
 * Register the Purus language definition and dark theme with Monaco Editor.
 */
export function registerPurusLanguage(monaco: typeof Monaco): void {
  /* Register language */
  monaco.languages.register({
    id: "purus",
    extensions: [".purus"],
    aliases: ["Purus", "purus"],
  });

  /* Monarch tokenizer */
  monaco.languages.setMonarchTokensProvider("purus", {
    defaultToken: "",
    tokenPostfix: ".purus",

    keywords: [
      "const", "let", "var", "be", "fn", "to", "return",
      "if", "elif", "else", "unless", "while", "until", "for", "in", "do",
      "switch", "case", "default", "match", "when",
      "class", "extends", "new", "this", "super", "private", "static",
      "async", "await", "try", "catch", "finally", "throw",
      "import", "from", "export", "public", "as", "use", "namespace",
      "typeof", "instanceof", "not", "and", "or", "pipe", "then",
    ],

    operators: [
      "add", "sub", "mul", "div", "mod", "pow",
      "eq", "neq", "lt", "gt", "le", "ge",
      "neg", "band", "bor", "bxor", "bnot", "shl", "shr", "coal",
    ],

    constants: [
      "true", "false", "null", "nil", "undefined", "nan", "infinity",
    ],

    builtins: [
      "console.log", "console.error", "Math", "JSON", "Date",
    ],

    /* eslint-disable-next-line no-useless-escape */
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    digits: /\d+(_+\d+)*/,
    hexdigits: /[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    tokenizer: {
      root: [
        /* Block comment --- ... --- */
        ["/---/", { token: "comment", next: "@blockComment" }],
        [/{---/, { token: "comment", next: "@blockComment" }],
        [/---/, { token: "comment", next: "@blockComment" }],

        /* Line comment -- */
        [/--/, "comment"],

        /* Triple-slash string ///.../// */
        [/\/\/\/;/, { token: "string", next: "@semiString" }],
        [/\/\/\//, { token: "string", next: "@tripleString" }],

        /* Numbers */
        [/0[xX][0-9a-fA-F]+n?/, "number.hex"],
        [/0[bB][01]+n?/, "number.binary"],
        [/\d+(\.\d+)?n?/, "number"],

        /* Keywords */
        [
          /[a-zA-Z_][a-zA-Z0-9_\-]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@operators": "operator",
              "@constants": "constant",
              "@builtins": "predefined",
              "@default": "identifier",
            },
          },
        ],

        /* Whitespace */
        { include: "@whitespace" },

        /* Delimiters and operators */
        [/[{}()\[\]]/, "delimiter.bracket"],
        [/[;,.]/, "delimiter"],
      ],

      blockComment: [
        [/---/, { token: "comment", next: "@pop" }],
        [/./, "comment"],
      ],

      tripleString: [
        [/\[expr\]/, "string.interpolation"],
        [/\\\\./, "string.escape"],
        [/\/\/\//, { token: "string", next: "@pop" }],
        [/./, "string"],
      ],

      semiString: [
        [/\[expr\]/, "string.interpolation"],
        [/\\\\./, "string.escape"],
        [/\/\/;/, { token: "string", next: "@pop" }],
        [/./, "string"],
      ],

      whitespace: [
        [/[ \t\r\n]+/, "white"],
      ],
    },
  } as Monaco.languages.IMonarchLanguage);

  /* Purus dark theme */
  monaco.editor.defineTheme("purus-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      /* comments - gray, italic */
      { token: "comment", foreground: "7f848e", fontStyle: "italic" },

      /* strings - green */
      { token: "string", foreground: "98c379" },
      { token: "string.escape", foreground: "56b6c2" },
      { token: "string.interpolation", foreground: "56b6c2" },

      /* keywords - purple */
      { token: "keyword", foreground: "c678dd" },

      /* operators - cyan */
      { token: "operator", foreground: "56b6c2" },

      /* numbers - orange */
      { token: "number", foreground: "d19a66" },
      { token: "number.hex", foreground: "d19a66" },
      { token: "number.binary", foreground: "d19a66" },

      /* constants - orange */
      { token: "constant", foreground: "d19a66" },

      /* builtins - blue */
      { token: "predefined", foreground: "61afef" },

      /* identifiers - default text */
      { token: "identifier", foreground: "abb2bf" },

      /* delimiters */
      { token: "delimiter", foreground: "abb2bf" },
      { token: "delimiter.bracket", foreground: "abb2bf" },
    ],
    colors: {
      "editor.background": "#18181b",
      "editor.foreground": "#e4e4e7",
      "editor.lineHighlightBackground": "#27272a",
      "editor.selectionBackground": "#3f3f4666",
      "editor.inactiveSelectionBackground": "#3f3f4633",
      "editorCursor.foreground": "#e4e4e7",
      "editorWhitespace.foreground": "#3f3f46",
      "editorIndentGuide.background": "#27272a",
      "editorIndentGuide.activeBackground": "#3f3f46",
      "editorLineNumber.foreground": "#52525b",
      "editorLineNumber.activeForeground": "#a1a1aa",
    },
  });
}
