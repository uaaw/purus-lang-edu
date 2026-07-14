export type Locale = "ja" | "en";

export const locales: Locale[] = ["ja", "en"];

export const defaultLocale: Locale = "ja";

type TranslationMap = Record<string, string>;

const translations: Record<Locale, TranslationMap> = {
  ja: {
    siteTitle: "Purus Education",
    startLearning: "学習を始める",
    lessons: "レッスン",
    dashboard: "ダッシュボード",
    signIn: "GitHubでサインイン",
    signInToTrack: "サインインして進捗を記録",
    lessonsCompleted: "{completed} / {total} レッスン完了",
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
    heroSubtitle: "Purus Langの基礎をインタラクティブに学びましょう",
    documentation: "ドキュメント",
    viewSolution: "解答を見る",
  },
  en: {
    siteTitle: "Purus Education",
    startLearning: "Start Learning",
    lessons: "Lessons",
    dashboard: "Dashboard",
    signIn: "Sign in with GitHub",
    signInToTrack: "Sign in to track your progress",
    lessonsCompleted: "{completed} / {total} lessons completed",
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
    heroSubtitle: "Learn the basics of Purus Lang interactively",
    documentation: "Documentation",
    viewSolution: "View Solution",
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
