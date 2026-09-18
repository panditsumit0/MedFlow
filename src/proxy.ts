import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate-limiting proxy (Next.js 16+ convention, replaces middleware).
 *
 * Strategy: lightweight in-memory token bucket per IP.
 * All thresholds are defined in RATE_LIMITS — never hardcoded inline.
 *
 * Note: In-memory state resets on each serverless cold start.
 * For production use, replace the store with Redis (e.g. Upstash).
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

// In-memory store: ip -> bucket
const store = new Map<string, Bucket>();

/**
 * RATE_LIMITS — all configurable thresholds in one place.
 *
 * capacity:    max burst requests
 * refillRate:  tokens added per second
 * windowMs:    cleanup window for the store
 */
const RATE_LIMITS = {
  auth: {
    // Strictest: login, signup, password reset
    capacity: 5,
    refillRate: 0.05, // 1 token per 20 seconds
  },
  api: {
    // Moderate: general API endpoints
    capacity: 30,
    refillRate: 1, // 1 token per second
  },
  page: {
    // Loose: authenticated page views
    capacity: 100,
    refillRate: 5,
  },
} as const;

type LimitKey = keyof typeof RATE_LIMITS;

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function pickLimit(pathname: string): LimitKey {
  if (pathname.startsWith('/api/auth')) return 'auth';
  if (pathname.startsWith('/api')) return 'api';
  return 'page';
}

function checkBucket(ip: string, limit: LimitKey): boolean {
  const { capacity, refillRate } = RATE_LIMITS[limit];
  const now = Date.now();
  const key = `${ip}:${limit}`;
  const bucket = store.get(key) ?? { tokens: capacity, lastRefill: now };

  // Refill tokens based on elapsed time
  const elapsed = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillRate);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    store.set(key, bucket);
    return false; // Rate limited
  }

  bucket.tokens -= 1;
  store.set(key, bucket);
  return true; // Allowed
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const ip = getIp(req);
  const limit = pickLimit(pathname);

  if (!checkBucket(ip, limit)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '30',
        'Content-Type': 'text/plain',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Apply to API routes only — pages are handled by Next.js caching
  matcher: ['/api/:path*'],
};
