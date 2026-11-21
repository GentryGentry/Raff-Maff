import { NextResponse, type NextRequest } from "next/server";
import { passcodeRequired } from "@/lib/server/config";
import { COOKIE, verifySessionValue } from "@/lib/server/session";

/** Sends visitors without a valid access-code cookie to /login. API routes enforce the same rule themselves (401). */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const open = path.startsWith("/login") || path.startsWith("/api/") || path.startsWith("/offline");
  if (open) return NextResponse.next();
  if (!passcodeRequired() && process.env.NODE_ENV !== "production") return NextResponse.next(); // local dev without a code
  if (passcodeRequired() && (await verifySessionValue(request.cookies.get(COOKIE)?.value))) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|manifest.webmanifest|sw.js|.*\\.(?:png|svg|jpg|ico|webp)$).*)"],
};
