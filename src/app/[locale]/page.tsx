import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <section className="flex flex-col items-center text-center max-w-2xl gap-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="80"
          height="80"
          className="mb-2"
        >
          <defs>
            <linearGradient id="heroSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb347" />
              <stop offset="100%" stopColor="#fd7e14" />
            </linearGradient>
          </defs>
          <path d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z" fill="none" stroke="#6c757d" strokeWidth="8" strokeLinejoin="round" />
          <path d="M 50 25 Q 50 50 25 50 Q 50 50 50 75 Q 50 50 75 50 Q 50 50 50 25 Z" fill="url(#heroSparkGrad)" />
        </svg>
        <h1
          className="text-5xl font-bold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          {t(l, "learnPurusLang")}
        </h1>
        <p
          className="text-lg leading-relaxed max-w-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t(l, "heroSubtitle")}
        </p>
        <div className="flex gap-4 mt-4">
          <Link
            href={`/${locale}/lessons`}
            className="btn-accent px-6 py-3 text-sm font-medium rounded-lg"
          >
            {t(l, "startLearning")}
          </Link>
          <a
            href="https://purus.work"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-6 py-3 text-sm font-medium rounded-lg"
          >
            {t(l, "documentation")}
          </a>
        </div>
      </section>
    </div>
  );
}
