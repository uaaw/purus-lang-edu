import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lessons } from "@/lib/lessons";
import { t, type Locale } from "@/lib/i18n";
import Link from "next/link";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
          {t(l, "signInToTrack")}
        </p>
        <Link
          href="/api/auth/signin"
          className="btn-accent px-6 py-2 rounded-lg"
        >
          {t(l, "signIn")}
        </Link>
      </div>
    );
  }

  const progress = await prisma.progress.findMany({
    where: { userId: session.user.id },
  });

  const completedCount = progress.filter((p: { completed: boolean }) => p.completed).length;
  const totalCount = lessons.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{session.user.name}</h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            {t(l, "lessonsCompleted", { completed: completedCount, total: totalCount })}
          </p>
        </div>
      </div>

      <div className="w-full rounded-full h-3 mb-8" style={{ backgroundColor: "var(--color-border)" }}>
        <div
          className="h-3 rounded-full transition-all"
          style={{
            backgroundColor: "var(--color-accent)",
            width: `${(completedCount / totalCount) * 100}%`,
          }}
        />
      </div>

      <div className="grid gap-3">
        {lessons.map((lesson) => {
          const p = progress.find((pr: { lessonId: string }) => pr.lessonId === lesson.id);
          const isCompleted = p?.completed ?? false;

          return (
            <Link
              key={lesson.id}
              href={`/${locale}/lessons/${lesson.id}`}
              className="flex items-center gap-4 p-4 rounded-lg border transition-colors"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg-secondary)",
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono"
                style={{
                  backgroundColor: isCompleted ? "var(--color-accent)" : "var(--color-border)",
                  color: isCompleted ? "var(--color-bg)" : "var(--color-text-muted)",
                }}
              >
                {isCompleted ? "✓" : lesson.number}
              </span>
              <span className="font-medium">{l === "ja" ? lesson.titleJa : lesson.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
