import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"]; // only for logged-out users
const protectedRoutes = ["/dashboard","/notifications", "/friend-requests", "/my-profile", "/profile/", "/search", "/user/"];

export const config = {
  matcher: [
    "/((?!_next|api|service|.*\\..*).*)", // skip internals/static
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  // 🔑 FIX: use the same cookie name as in loginUser()
  const token = req.cookies.get("accessToken")?.value; 

  // 1) Protected routes → block if not logged in
  const isProtected = protectedRoutes.some((p) => path.startsWith(p));
  if (!token && isProtected) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 2) Public routes → block if already logged in
  const isPublic = publicRoutes.some((p) => path === p);
  if (token && isPublic) {

    // fallback if logged in but no onboarding status
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 3) Everything else → let through
  return NextResponse.next();
}
