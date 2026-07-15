export type Locale = "ja" | "en";

export const locales: Locale[] = ["ja", "en"];

export const defaultLocale: Locale = "ja";

type TranslationMap = Record<string, string>;

const translations: Record<Locale, TranslationMap> = {
  ja: {
    siteTitle: "Purus Education",
    startLearning: "学習を始める",
    lessons: "レッスン",
    run: "実行",
    reset: "リセット",
    showSolution: "解答を表示",
    hideSolution: "解答を隠す",
    output: "出力",
    errors: "エラー",
    pressCtrlEnter: "Ctrl+Enterで実行",
    running: "実行中...",
    noErrors: "エラーなし",
    noOutput: "コードは正常に実行されましたが、出力がありません。console.log[] で出力してください。",
    loadingEditor: "エディタ読み込み中...",
    lessonNotFound: "レッスンが見つかりません",
    backToLessons: "レッスン一覧に戻る",
    learnPurusLang: "Purus Langを学ぶ",
    heroSubtitle: "Purus Langの基礎をハンズオン形式で学ぼう！",
    documentation: "ドキュメント",
    viewSolution: "解答を見る",
    tests: "テスト",
    testsPassed: "{passed}/{total} 通過",
    allTestsPassed: "全テスト通過！",
    runToCheck: "コードを実行して解答を確認",
    expected: "期待値",
    actual: "実際値",
    lessonCompleted: "レッスン合格！",
    shareOnX: "Xで修了を共有",
    passed: "合格",
    failed: "不合格",
  },
  en: {
    siteTitle: "Purus Education",
    startLearning: "Start Learning",
    lessons: "Lessons",
    run: "Run",
    reset: "Reset",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
    output: "Output",
    errors: "Errors",
    pressCtrlEnter: "Press Ctrl+Enter to run",
    running: "Running...",
    noErrors: "No errors",
    noOutput: "Code ran successfully but produced no output. Use console.log[] to print values.",
    loadingEditor: "Loading editor...",
    lessonNotFound: "Lesson not found",
    backToLessons: "Back to Lessons",
    learnPurusLang: "Learn Purus Lang",
    heroSubtitle: "Learn the basics of Purus Lang through hands-on practice!",
    documentation: "Documentation",
    viewSolution: "View Solution",
    tests: "Tests",
    testsPassed: "{passed}/{total} passed",
    allTestsPassed: "All tests passed!",
    runToCheck: "Run the code to check your solution",
    expected: "Expected",
    actual: "Actual",
    lessonCompleted: "Lesson passed!",
    shareOnX: "Share completion on X",
    passed: "Passed",
    failed: "Failed",
  },
};

export type TranslationKey = keyof typeof translations.ja;

export function getTranslations(locale: Locale): TranslationMap {
  return translations[locale] ?? translations[defaultLocale];
}

export function t(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const map = translations[locale] ?? translations[defaultLocale];
  let result = map[key] ?? key;

  if (vars) {
    for (const [varKey, varValue] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{${varKey}\\}`, "g"), String(varValue));
    }
  }

  return result;
}
