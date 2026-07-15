export type ShareLocale = "ja" | "en";

export interface ShareLesson {
  number: number;
  title: string;
  titleJa: string;
}

export function createLessonShareUrl(
  locale: ShareLocale,
  lesson: ShareLesson,
  lessonUrl: string
): string {
  const cleanLessonUrl = new URL(lessonUrl);
  cleanLessonUrl.search = "";
  cleanLessonUrl.hash = "";
  const text = locale === "ja"
    ? `purusレッスン#${lesson.number}[${lesson.titleJa}]を修了しました！\nみんなも学んでみない？\n${cleanLessonUrl.toString()}`
    : `I completed purus Lesson #${lesson.number} [${lesson.title}]!\nWhy don't you learn purus too?\n${cleanLessonUrl.toString()}`;
  const intentUrl = new URL("https://twitter.com/intent/tweet");
  intentUrl.searchParams.set("text", text);
  return intentUrl.toString();
}
