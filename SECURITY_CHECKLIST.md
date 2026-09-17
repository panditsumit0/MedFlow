# 🔐 MedFlow — App Launch Security Checklist

A 20-point security checklist to run through **before going live** with any web application.
Adapted for the MedFlow Regional Medicine Shortage Intelligence System.

---

## 🗝️ Secrets & Credentials

- [ ] **1. Hide API Keys**
  - Move ALL API keys out of source code
  - Store them in `.env.local` (never committed)
  - Verify `.env*.local` is listed in `.gitignore`
  - Use environment variables in deployment platform (e.g. Vercel → Settings → Environment Variables)

- [ ] **2. Purge Git Secrets**
  - Run `git log --all --full-history -- "**/.env*"` to check if secrets were ever committed
  - If yes, use [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or `git filter-repo` to scrub history
  - Rotate any keys that were ever exposed — treat them as compromised

- [ ] **3. Use Public DB Key (Not Private)**
  - For Supabase: use the `anon` (public) key in frontend code, never the `service_role` key
  - The `service_role` key bypasses Row Level Security — only use server-side

---

## 🗄️ Database Security

- [ ] **4. Enable Row-Level Security (RLS)**
  - In Supabase: `ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;`
  - Write explicit policies for SELECT, INSERT, UPDATE, DELETE
  - Test with a non-admin user to confirm restrictions work

- [ ] **5. Encrypt Sensitive Data**
  - Personally Identifiable Information (PII) and health data must be encrypted at rest
  - Use Supabase's built-in encryption or `pgcrypto` extension for sensitive columns
  - Never store raw patient data in plaintext

- [ ] **6. Parameterize All Queries**
  - Never concatenate user input into SQL strings
  - Use parameterized queries or ORM methods (Prisma, Supabase client) that handle escaping
  - Test for SQL injection using tools like [sqlmap](https://sqlmap.org/) on staging

---

## 🔑 Authentication & Sessions

- [ ] **7. Enforce Server-Side Auth**
  - Never trust client-side auth state alone — verify tokens server-side on every protected request
  - In Next.js: check session in `middleware.ts` or in Server Components using `getServerSession()`

- [ ] **8. Lock Record Access**
  - Users should only be able to read/write their own data
  - Implement ownership checks: `WHERE user_id = auth.uid()` in RLS policies
  - Test by logging in as User A and trying to access User B's records via the API

- [ ] **9. Block Field Tampering**
  - Never let the client set sensitive fields like `is_admin`, `role`, `user_id` directly
  - Strip or ignore unexpected fields on the server before inserting into DB

- [ ] **10. Secure Session Cookies**
  - Set `HttpOnly`, `Secure`, and `SameSite=Strict` flags on all session cookies
  - Use short expiry times for session tokens
  - Implement logout that actually invalidates the server-side session

- [ ] **11. Hash Passwords**
  - Never store plain-text passwords
  - Use `bcrypt` (cost factor ≥ 12) or `argon2id`
  - If using Supabase Auth — this is handled for you ✅

---

## 🛡️ Request & Input Protection

- [ ] **12. Rate Limit Login**
  - Add rate limiting to `/api/auth/login` — e.g. max 5 attempts per IP per minute
  - Use packages like `next-rate-limit` or middleware on Vercel Edge
  - Return `429 Too Many Requests` with a `Retry-After` header

- [ ] **13. Add Bot Protection**
  - Add CAPTCHA (e.g. Cloudflare Turnstile — free) to login and signup forms
  - Block known bad IPs using Cloudflare WAF rules

- [ ] **14. Validate All Input (Server-Side)**
  - Validate every API input on the server — never trust the client
  - Use a schema validation library like `zod` or `yup`
  - Reject requests with missing or wrong-type fields with `400 Bad Request`

- [ ] **15. Escape User Content**
  - Any user-generated content rendered as HTML must be escaped or sanitized
  - Use `DOMPurify` on the client, or `sanitize-html` on the server
  - Never use `dangerouslySetInnerHTML` with unescaped user data

- [ ] **16. Restrict File Uploads**
  - Whitelist allowed MIME types (e.g. only `image/png`, `image/jpeg`)
  - Enforce max file size (e.g. 5MB)
  - Store uploads in object storage (S3/Supabase Storage), never in the app filesystem
  - Scan uploads for malware using a service like VirusTotal API

---

## 🌐 Network & Response Security

- [ ] **17. Trim API Responses**
  - Only return fields the client actually needs
  - Never return raw DB rows that include `password_hash`, internal IDs, or admin flags
  - Audit each API response shape before launch

- [ ] **18. Add Security Headers**
  Add these to `next.config.ts`:
  ```ts
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',          value: 'DENY' },
        { key: 'X-Content-Type-Options',   value: 'nosniff' },
        { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Content-Security-Policy',  value: "default-src 'self'; script-src 'self' 'unsafe-inline'" },
      ],
    },
  ]
  ```

- [ ] **19. Force HTTPS**
  - On Vercel: HTTPS is enforced automatically ✅
  - On custom servers: redirect all HTTP → HTTPS in your reverse proxy (Nginx/Caddy)
  - Set `HSTS` header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

- [ ] **20. Scan Dependencies**
  - Run `npm audit` before every deployment
  - Fix all `high` and `critical` severity vulnerabilities
  - Use [Snyk](https://snyk.io/) or GitHub's Dependabot for automated scanning
  - Remove unused packages to reduce attack surface

---

## ✅ Quick Pre-Launch Commands

```bash
# Check for secrets accidentally committed
git log --all --oneline | head -20
grep -r "sk-" src/         # OpenAI keys
grep -r "supabase" src/    # Supabase URLs/keys
grep -rE "password\s*=" src/

# Audit npm dependencies
npm audit

# Check environment variables are loaded
node -e "console.log(!!process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

---

## 📋 Summary Table

| # | Category | Check | Status |
|---|---|---|---|
| 1 | Secrets | Hide API keys in `.env.local` | ⬜ |
| 2 | Secrets | Purge Git secrets from history | ⬜ |
| 3 | Secrets | Use public DB key only | ⬜ |
| 4 | Database | Enable Row-Level Security | ⬜ |
| 5 | Database | Encrypt sensitive/health data | ⬜ |
| 6 | Database | Parameterize all queries | ⬜ |
| 7 | Auth | Enforce server-side auth | ⬜ |
| 8 | Auth | Lock record access per user | ⬜ |
| 9 | Auth | Block field tampering | ⬜ |
| 10 | Auth | Secure session cookies | ⬜ |
| 11 | Auth | Hash passwords (bcrypt/argon2) | ⬜ |
| 12 | Requests | Rate limit login endpoint | ⬜ |
| 13 | Requests | Add bot protection (CAPTCHA) | ⬜ |
| 14 | Requests | Validate all input server-side | ⬜ |
| 15 | Requests | Escape user-generated content | ⬜ |
| 16 | Requests | Restrict file uploads | ⬜ |
| 17 | Network | Trim API response fields | ⬜ |
| 18 | Network | Add security headers | ⬜ |
| 19 | Network | Force HTTPS | ⬜ |
| 20 | Dependencies | Scan with `npm audit` | ⬜ |

---

*Generated for MedFlow Hackathon Project — Manipal University Jaipur 2026*
