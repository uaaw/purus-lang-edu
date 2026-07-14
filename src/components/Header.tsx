import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { t, type Locale } from "@/lib/i18n";

export function Header({ locale }: { locale: Locale }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        backgroundColor: "var(--color-header-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-8">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          {t(locale, "siteTitle")}
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Link
            href={`/${locale}/lessons`}
            className="nav-link px-3 py-1.5 text-sm rounded-md"
          >
            {t(locale, "lessons")}
          </Link>
          <Link
            href={`/${locale}/dashboard`}
            className="nav-link px-3 py-1.5 text-sm rounded-md"
          >
            {t(locale, "dashboard")}
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/puruslang/purus"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
        <a
          href="https://www.npmjs.com/package/purus"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="npm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zM5.13 5.323l13.837.01c.889 0 1.197.661 1.197 1.197v10.96c0 .889-.661 1.197-1.197 1.197h-1.597V12.39h-2.395v6.298H9.023V12.39H6.574v6.478H5.13c-.889 0-1.197-.661-1.197-1.197V6.52c0-.536.308-1.197 1.197-1.197z" />
          </svg>
        </a>
        <LanguageSwitcher locale={locale} />
        <ThemeToggle />
      </div>
    </header>
  );
}
