import { NextRequest, NextResponse } from "next/server";

const locales = ["ja", "en"] as const;
const defaultLocale = "ja";

function hasLocalePrefix(pathname: string): boolean {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

function getPreferredLocale(request: NextRequest): string {
  const accept = request.headers.get("accept-language") ?? "";
  if (accept.startsWith("en")) {
    return "en";
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  const preferred = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|robots.txt|sitemap.xml).*)",
  ],
};
