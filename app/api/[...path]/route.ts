// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://chat-shat-backend.onrender.com";

function cleanCookieDomain(setCookie: string) {
  return setCookie
    .split(";")
    .map((part) => part.trim())
    .filter((p) => !p.toLowerCase().startsWith("domain="))
    .join("; ");
}

// ✅ Handles all HTTP methods (GET, POST, PUT, DELETE)
export async function middlewareProxy(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const path = pathname.replace(/^\/api/, ""); // remove "/api" prefix
  const targetUrl = `${BACKEND_URL}/api${path}${search || ""}`;

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

  // Copy cookies from backend (removing Domain)
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", cleanCookieDomain(setCookie));
  }

  return res;
}

// Alias all HTTP verbs to the same handler
export const GET = middlewareProxy;
export const POST = middlewareProxy;
export const PUT = middlewareProxy;
export const DELETE = middlewareProxy;
export const PATCH = middlewareProxy;
