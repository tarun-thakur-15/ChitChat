// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://chat-shat-backend.onrender.com";

// 🧹 Remove Domain=... from backend cookies
function cleanCookieDomain(setCookie: string) {
  return setCookie
    .split(";")
    .map((p) => p.trim())
    .filter((p) => !p.toLowerCase().startsWith("domain="))
    .join("; ");
}

async function handleProxy(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const targetPath = pathname.replace(/^\/api/, ""); // remove "/api" prefix
  const targetUrl = `${BACKEND_URL}/api${targetPath}${search || ""}`;

  const init: RequestInit = {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
  };

  const backendRes = await fetch(targetUrl, init);

  const res = new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: backendRes.headers,
  });

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", cleanCookieDomain(setCookie));

  return res;
}

// ✅ Only export the allowed HTTP methods (no custom names)
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const OPTIONS = handleProxy;
