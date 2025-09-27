import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting store (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || "900000"); // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "100");

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }

  // Check rate limit
  const current = rateLimitMap.get(ip);
  if (current) {
    if (now < current.resetTime) {
      if (current.count >= maxRequests) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
      current.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  }

  // CORS headers
  const origin = request.headers.get("origin");
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ];

  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
