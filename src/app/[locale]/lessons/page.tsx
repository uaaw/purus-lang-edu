import Link from "next/link";
import { lessons } from "@/lib/lessons";
import { t, type Locale } from "@/lib/i18n";

export default async function LessonsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  return (
    <div
      className="h-full overflow-auto px-6 py-10"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--color-text)" }}
        >
          {t(l, "lessons")}
        </h1>
        <p
          className="mb-8"
          style={{ color: "var(--color-text-muted)" }}
        >
          {l === "ja"
            ? "ハンズオンコーディングでPurusをステップバイステップで学びましょう。"
            : "Learn Purus step by step through hands-on coding exercises."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/${locale}/lessons/${lesson.id}`}
              className="block rounded-lg border p-5 transition-colors"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                borderColor: "var(--color-border)",
              }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-accent)" }}
              >
                Lesson {String(lesson.number).padStart(2, "0")}
              </span>
              <h2
                className="text-lg font-semibold mt-1"
                style={{ color: "var(--color-text)" }}
              >
                {locale === "ja" ? lesson.titleJa : lesson.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
