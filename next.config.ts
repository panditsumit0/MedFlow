import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable source maps in production so your code is not exposed
  productionBrowserSourceMaps: false,

  // Security headers applied to every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable browser features not needed
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Force HTTPS for 1 year (enable when on a real domain with HTTPS)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js needs unsafe-inline for its inline scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Allow styles from self and inline (Tailwind)
              "style-src 'self' 'unsafe-inline'",
              // Allow images from self + OpenStreetMap tiles
              "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.openstreetmap.org",
              // Allow tile requests for Leaflet
              "connect-src 'self' https://*.tile.openstreetmap.org",
              // Fonts from self only (no Google Fonts)
              "font-src 'self'",
              // No frames ever
              "frame-src 'none'",
              // No object embeds
              "object-src 'none'",
              // Base URI locked to self
              "base-uri 'self'",
              // Forms only submit to self
              "form-action 'self'",
            ].join("; "),
          },
          // Remove the X-Powered-By header
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
