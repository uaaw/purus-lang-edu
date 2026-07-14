import { locales, type Locale } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 pt-14">{children}</main>
    </>
  );
}
