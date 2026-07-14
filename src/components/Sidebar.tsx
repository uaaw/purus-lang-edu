import { type Locale, t } from "@/lib/i18n";

interface LessonEntry {
  title: string;
  titleJa: string;
}

const LESSONS: LessonEntry[] = [
  { title: "01 - Hello World", titleJa: "01 - Hello World" },
  { title: "02 - Variables", titleJa: "02 - 変数" },
  { title: "03 - Data Types", titleJa: "03 - データ型" },
  { title: "04 - Operators", titleJa: "04 - 演算子" },
  { title: "05 - Conditionals", titleJa: "05 - 条件分岐" },
  { title: "06 - Loops", titleJa: "06 - ループ" },
  { title: "07 - Functions", titleJa: "07 - 関数" },
  { title: "08 - Arrays", titleJa: "08 - 配列" },
  { title: "09 - Strings", titleJa: "09 - 文字列" },
  { title: "10 - Error Handling", titleJa: "10 - エラー処理" },
  { title: "11 - Structs", titleJa: "11 - 構造体" },
  { title: "12 - Enums", titleJa: "12 - 列挙型" },
  { title: "13 - Pattern Matching", titleJa: "13 - パターンマッチング" },
  { title: "14 - Modules", titleJa: "14 - モジュール" },
  { title: "15 - Generics", titleJa: "15 - ジェネリクス" },
  { title: "16 - Traits", titleJa: "16 - トレイト" },
  { title: "17 - Collections", titleJa: "17 - コレクション" },
];

interface SidebarProps {
  activeIndex?: number;
  onSelect?: (index: number) => void;
  locale: Locale;
}

export function Sidebar({ activeIndex = 0, onSelect, locale }: SidebarProps) {
  const sectionLabel = t(locale, "lessons");

  return (
    <aside
      className="flex flex-col w-60 h-full overflow-y-auto shrink-0"
      style={{
        backgroundColor: "var(--color-sidebar-bg)",
        borderRight: "1px solid var(--color-border)",
      }}
      aria-label={t(locale, "lessons")}
    >
      <div
        className="px-4 py-3 text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-text-muted)" }}
      >
        {sectionLabel}
      </div>
      <nav className="flex flex-col gap-0.5 px-2 pb-4">
        {LESSONS.map((lesson, index) => {
          const isActive = index === activeIndex;
          const displayTitle = locale === "ja" ? lesson.titleJa : lesson.title;

          return (
            <button
              key={lesson.title}
              onClick={() => onSelect?.(index)}
              className={`text-left px-3 py-2 text-sm rounded-md transition-colors w-full ${
                isActive ? "" : "hover:bg-[var(--color-bg-secondary)]"
              }`}
              style={{
                backgroundColor: isActive ? "var(--color-accent-muted)" : "transparent",
                color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {displayTitle}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
