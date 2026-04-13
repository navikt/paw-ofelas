import { type NextRequest, NextResponse } from "next/server";
import { getLangFromPath, LANGUAGE_HEADER } from "@/lib/language";

export function proxy(request: NextRequest) {
  const lang = getLangFromPath(request.nextUrl.pathname);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LANGUAGE_HEADER, lang);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

