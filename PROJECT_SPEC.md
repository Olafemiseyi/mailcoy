# LightOrb Connect — Project Specification

> Single source of truth for the LightOrb Connect product. This document defines what the product is, who it serves, how it behaves, and every rule that governs its implementation. Any future engineer or agent must be able to build the product end‑to‑end from this file plus `ARCHITECTURE.md`. `progress.md` tracks execution against it.

---

## 1. Vision

LightOrb Connect is an **Email Routing Platform**. It lets any organization that owns a domain give every employee a professional business email address (`name@company.com`) **without buying Google Workspace or Microsoft 365 seats**. Employees keep using the personal Gmail account they already know. The professional identity lives *on top of* Gmail through routing plus a Google Workspace Add‑on.

Explicitly, LightOrb Connect is **not**:

- an email host or inbox
- a Gmail / Outlook clone
- a Google Workspace / Microsoft 365 competitor on productivity (docs, sheets, meet, drive)
- a marketing / transactional email API (Resend, SendGrid)

It **is**: identity, routing, deliverability, and a Gmail-native reply-as experience for SMEs, schools, churches, NGOs, agencies, and enterprises worldwide — with a particular focus on markets where per‑seat Workspace/365 pricing is prohibitive.

## 2. Problem

Workspace and Microsoft 365 charge per employee per month. A 50-person company pays a significant recurring bill mostly for a professional email identity — the docs, drives, and meet suites are unused by most staff. LightOrb Connect strips the offer down to what SMEs actually need: **the identity + reliable routing + a familiar Gmail workflow**, at a fraction of the cost.

## 3. Target Customers

Small, medium, and large businesses globally. Priority verticals: real estate, schools, churches, law firms, hospitals, consulting, construction, accounting, retail chains, NGOs, government contractors. Requirement: the organization owns (or can register) a domain.

## 4. Value Proposition

- Employees continue to use Gmail — zero migration, zero training.
- The business owns and controls all professional identities.
- Outbound mail is sent as `name@company.com` with SPF / DKIM / DMARC.
- Inbound mail to `name@company.com` is delivered into the employee's existing Gmail inbox.
- Massive cost reduction vs Workspace / 365 per‑seat pricing.

## 5. Core User Flow (Product-Level)

```
Landing → Sign up → Verify email → Create organization → Choose name + slug →
Add domain → DNS verification (TXT, MX, SPF, DKIM, DMARC) → Create first employee →
Invite team → Each employee signs up → Employee connects personal Gmail (Google OAuth) →
Professional email activated → Employee sends & receives business email from within Gmail.
```

### 5.1 Inbound Routing

```
client@gmail.com → john@company.com → MX (LightOrb) → Routing Engine →
Alias/Employee lookup → Employee's connected Gmail → Delivered to Gmail inbox.
```

### 5.2 Outbound Reply-As

```
Employee in Gmail → LightOrb Add-on → "Reply as john@company.com" →
LightOrb API → SMTP relay (SPF/DKIM/DMARC aligned) → Recipient sees From: john@company.com.
```

The employee never leaves Gmail. The experience must feel invisible.

---

## 6. Major Systems (Product Surface)

Authentication · Organizations · Members & Roles · Domains · DNS Verification · Employees · Aliases · Google OAuth (per employee) · Gmail Add‑on · Routing Engine · Queues · Email Logs · Activity Logs · Audit Logs · Billing (Paystack, Stripe‑ready) · Dashboard · Settings · Public API · Admin Console.

## 7. Authentication

Supabase Auth. Supported methods:

- Email + password (with HIBP leaked-password check enabled)
- Google OAuth (Lovable managed provider; used both for **sign-in** and — separately — per-employee **Gmail connection** via Google App User Connector)
- Password reset with `/auth/reset-password` route honouring `type=recovery`
- Email verification with `emailRedirectTo = window.location.origin`

Session handling uses `onAuthStateChange` for reactive UI; `getUser()` for any trust-sensitive check. Bearer tokens attached to server functions via `attachSupabaseAuth` middleware.

### 7.1 Route Access Model

- **Public routes**: `/`, `/pricing`, `/about`, `/docs`, `/contact`, `/auth/*`
- **Protected routes**: everything under `/app/*`, gated by `_authenticated/route.tsx`
- **Onboarding gate**: authenticated users whose active organization has no `onboarding_completed_at` are forced to `/app/onboarding`
- **Role-gated routes**: settings/billing/danger‑zone gated by org roles (`owner`, `admin`)

## 8. Multi-Tenancy

- One user may belong to many organizations.
- All tenant data (domains, employees, aliases, logs, subscriptions) is scoped by `organization_id`.
- Every table with tenant data has RLS policies keyed by `organization_members` membership via `is_org_member(org)` / `has_org_role(org, role)` SECURITY DEFINER helpers.
- Cross-organization reads/writes are impossible from client SDK; only server functions using the service role may cross tenants and only for platform operations.

### 8.1 Roles

- `owner` — full control incl. billing and danger zone; exactly one per org (transferable).
- `admin` — manage domains, employees, integrations, billing view.
- `member` — read‑only org view; manages only their own employee profile + Gmail connection.

## 9. Organizations

Fields: `id`, `name`, `slug` (unique, url‑safe), `industry`, `country`, `timezone`, `currency` (NGN/USD auto-detected, overridable), `logo_url`, `onboarding_step`, `onboarding_completed_at`, `created_by`, `created_at`, `updated_at`.

Rules:
- Slug is immutable after 7 days.
- Deleting an org soft-deletes and schedules hard delete after 30 days.
- Currency drives Paystack initialization currency.

## 10. Domain Management

### 10.1 Data
`domains`: `id`, `organization_id`, `domain_name` (unique globally), `verification_status` (`pending|verified|failed`), `txt_record_value` (per-domain nonce, prefixed `lightorb-verify=`), `dkim_selector` (default `lightorb`), per-record status columns (`txt_status`, `mx_status`, `spf_status`, `dkim_status`, `dmarc_status`), `last_checked_at`, `verified_at`, `errors jsonb`, timestamps.

### 10.2 Required DNS Records

| Purpose | Type | Host | Value |
|---|---|---|---|
| Ownership | TXT | `@` | `lightorb-verify=<nonce>` |
| Inbound MX #1 | MX 10 | `@` | `mx1.lightorb.connect` |
| Inbound MX #2 | MX 20 | `@` | `mx2.lightorb.connect` |
| SPF | TXT | `@` | `v=spf1 include:_spf.lightorb.connect ~all` |
| DKIM | TXT | `lightorb._domainkey` | `v=DKIM1; k=rsa; p=<public key>` |
| DMARC | TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@lightorb.connect` |

### 10.3 Verification

- Resolution uses DoH via `/api/dns-resolve` (server), falling back to Google (`dns.google/resolve`) and Cloudflare (`cloudflare-dns.com/dns-query`) directly from the client.
- Verification service (`domainVerificationService`) evaluates all five records, sets per-record status, and marks the domain `verified` iff **TXT ownership AND both MX records** pass. SPF/DKIM/DMARC failures do not block activation but surface as warnings on the deliverability score.
- Scheduler auto‑rechecks pending domains every 30 s for the first 15 min, then every 5 min for the first 24 h, then hourly for 7 days, then paused with a "Re-check now" button.
- Registrar detection (from NS records) surfaces registrar-specific setup guides (Cloudflare, GoDaddy, Namecheap, Squarespace, Google Domains, Route 53, others → generic).

## 11. Employee Management

`employees`: `id`, `organization_id`, `user_id` (nullable until they accept invite), `full_name`, `job_title`, `department`, `professional_email` (`local@domain`), `status` (`pending|connected|suspended|inactive|deleted`), `invited_at`, `connected_at`, timestamps.

`aliases`: `id`, `employee_id`, `address`, `is_primary`, `created_at`. Enforce one primary alias per employee.

Flows:
- Add single employee (name + local part + domain).
- Bulk invite (comma / newline).
- CSV import (`full_name,email,job_title,department`).
- Suspend / restore / delete (soft) / hard-delete after 30 days.
- Re-send invite. Invites expire in 14 days.
- Role management inside `organization_members`, not on `employees`.

## 12. Gmail Integration

Per-employee OAuth via the **Google App User Connector** (connector id `google_mail`). The `lovack_*` connection key is stored encrypted (AES‑256‑GCM using `APP_USER_CONNECTION_KEY_SECRET`) in `app_user_connections`, keyed by `(user_id, connector_id)`.

Scopes requested:
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/gmail.compose`
- `https://www.googleapis.com/auth/gmail.readonly` (for the Add-on identity picker & thread context)
- `https://www.googleapis.com/auth/gmail.settings.basic` (register send‑as aliases)

Behaviours:
- On successful connection, LightOrb calls `users.settings.sendAs` to register the employee's professional address as a verified send-as alias so replies from the Add-on carry the correct From header.
- Health check endpoint pings the connection every hour; failures surface as "Reconnect Gmail" banners.
- Disconnect calls `disconnectAppUser` then deletes the `app_user_connections` row.

## 13. Gmail Add-on

Google Workspace Add-on (Apps Script + CardService) published in the Marketplace. Features:
- Sidebar with identity selector across all professional addresses granted to the user.
- Compose action: "Compose as <address>".
- Reply / Reply-All action: rewrites the From via LightOrb API.
- Draft support persists drafts back to Gmail.
- Thread awareness so replies stay in-thread.
- All sends go through LightOrb API which invokes Gmail `users.messages.send` on the employee's connection — no browser hacks, no cookie theft, fully Google-compliant.

## 14. Routing Engine

### 14.1 Inbound

Postfix (or equivalent) MTAs at `mx1/mx2.lightorb.connect` accept mail, hand off to the routing worker:
1. Look up recipient in `aliases` → `employees` → `gmail_connections`.
2. If employee `connected`, use Gmail API `users.messages.insert` (or SMTP relay) to place the message in the employee's inbox with original headers preserved.
3. If unknown recipient / suspended / disconnected, bounce with SMTP 550 and log to `email_logs` with `status='bounced'`.
4. All events written to `incoming_messages` and `email_logs`.

### 14.2 Outbound

Add-on / API call → LightOrb `sendAs` server function → validate the caller owns the From alias → sign DKIM → hand to SMTP provider (default: Amazon SES; abstracted so Postmark / SendGrid can be swapped) → capture provider message id → write to `outgoing_messages` + `email_logs`.

### 14.3 Queue & Retries

- BullMQ-style queue backed by Postgres (`pgmq`) so no extra infra in MVP.
- Exponential backoff: 30 s, 2 min, 10 min, 1 h, 6 h, 24 h; then dead-letter.
- Bounce classification (hard/soft) using SMTP reply codes; hard bounces mark alias unhealthy.

## 15. Email Logs

`email_logs`: `id`, `organization_id`, `direction` (`in|out`), `employee_id`, `from_addr`, `to_addr`, `subject`, `status` (`queued|sent|delivered|bounced|failed|complained`), `provider`, `provider_message_id`, `latency_ms`, `error`, `created_at`.

UI filters: date range, direction, employee, domain, status, free‑text subject/recipient. CSV export.

## 16. Dashboard

Minimal, Resend-inspired. Widgets:
- Organization health score (weighted by DNS state, connection state, bounce rate).
- Domain status card.
- Employees connected / pending.
- Emails today (sent, received, bounced) with 7‑day sparkline.
- Delivery rate (30 d).
- Recent activity (last 20 audit events).
- First-run checklist (add domain → verify DNS → invite team → connect Gmail → send test).

No fake terminals. No decorative gradients. Typography- and whitespace-led.

## 17. Settings

Sections:
- **Organization**: name, slug (locked after 7d), logo, industry, country, timezone, currency.
- **Members**: invite, role change, remove, transfer ownership.
- **Domains**: list, add, remove, re-verify.
- **Security**: 2FA (TOTP), active sessions, sign‑out‑all.
- **Billing**: plan, seats, invoices, payment method (Paystack).
- **API Keys**: create, revoke, scope selection.
- **Webhooks**: URL, secret, event subscriptions, delivery log.
- **Danger Zone**: delete organization.

## 18. Billing

Provider: **Paystack** (primary; supports NGN + USD + card + bank transfer). Architecture abstracted behind a `PaymentProvider` interface so Stripe can be wired without refactor.

Plans (illustrative — final numbers per pricing page):
- **Starter** — up to 5 employees, 1 domain.
- **Growth** — up to 25 employees, 3 domains.
- **Scale** — up to 100 employees, 10 domains.
- **Enterprise** — custom.

Currency auto-detected from org country (NGN for NG, USD elsewhere), overridable. Monthly and annual (2 months free) toggle. Free 14-day trial with card on file.

Server functions: `initializeTransaction`, `verifyTransaction`, `createSubscription`, `cancelSubscription`, `changePlan`.
Public route: `POST /api/public/webhooks/paystack` verifies HMAC signature (`x-paystack-signature`) using the secret from `PAYSTACK_SECRET_KEY` before mutating `subscriptions`.

## 19. Public API (v1)

Base URL: `https://api.lightorb.connect/v1`. Bearer auth using API keys (`lok_live_*` / `lok_test_*`). Rate limit: 60 req/min per key, 1000 req/min per org.

Endpoints:
- `GET /organizations/me`
- `GET /domains` · `POST /domains` · `GET /domains/{id}` · `DELETE /domains/{id}` · `POST /domains/{id}/verify`
- `GET /employees` · `POST /employees` · `PATCH /employees/{id}` · `DELETE /employees/{id}` · `POST /employees/{id}/reinvite`
- `GET /aliases` · `POST /aliases` · `DELETE /aliases/{id}`
- `GET /email-logs`
- `POST /messages/send` (server-to-server send via a verified alias)
- `GET /webhooks` · `POST /webhooks` · `DELETE /webhooks/{id}`

Every response envelope: `{ data, error, request_id }`. Errors follow RFC 7807.

## 20. Admin Console

Internal `/staff/*` app for LightOrb operators (role `staff`). Impersonation with audit trail, org search, DNS re-verification, subscription overrides, bounce forensics, feature flags.

## 21. Design System

Reference bar: Resend, Stripe, Vercel, Linear, Clerk. Named **Paper & Ink**.

- Typography: Space Grotesk (display), Inter (body). No serif.
- Palette: near-white paper, near-black ink, single accent (indigo `#4F46E5`), semantic status (success `#059669`, warn `#D97706`, danger `#DC2626`).
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Radius: 8 (inputs, cards), 12 (surfaces), full (pills, avatars).
- Elevation: single soft shadow (`0 1px 2px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.04)`); no heavy drop shadows.
- Motion: 150–250 ms ease-out; no bouncy springs.
- Iconography: `lucide-react`, 16/20 px, 1.5 stroke.
- Empty states: single illustration + one primary action.
- Explicitly banned: purple→pink gradients, glassmorphism, bento overload, oversized emoji, generic dashboard stock icons, fake terminals, fake charts, decorative particles.

## 22. Responsive Rules

Breakpoints: 320, 360, 375, 390, 430, 768, 1024, 1440. Tables collapse to card lists < 768. Nav collapses to sheet < 768. Touch targets ≥ 44 px. No horizontal scroll ever except intentional data grids with sticky columns.

## 23. Coding Standards

- TypeScript strict everywhere.
- Server logic in `createServerFn` (TanStack Start). Public webhooks under `src/routes/api/public/*`.
- No client-side Supabase writes for sensitive data — go through server functions.
- No hardcoded colors in components; only design tokens from `styles.css`.
- No `useEffect` + `fetch` for initial data — use TanStack Query in loader + `useSuspenseQuery` in component.
- All new tables include `organization_id`, RLS, and explicit `GRANT`s.
- ESLint + Prettier enforced; commits blocked on typecheck failure.

## 24. Security

- Encrypted at rest for Gmail tokens (AES-256-GCM), Paystack customer refs, and API key hashes (Argon2id, only prefix visible after creation).
- RLS on every user-facing table; `service_role` used only in server code, never in the browser bundle.
- CSRF: server functions are same-origin; public webhooks verify HMAC.
- Rate limits on auth endpoints (5/min/IP), password reset (3/hour/email), API keys.
- HIBP leaked-password check enabled.
- Audit logs (`audit_logs`) for every privileged action; append-only, 400-day retention.
- Security headers via TanStack Start (CSP, HSTS, X-Content-Type-Options, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy minimal).

## 25. Observability

- Structured JSON logs from server functions with `request_id`.
- Metrics: emails sent/received/bounced, verification success rate, OAuth failures, API latency (p50/p95/p99).
- Uptime pings on `/healthz` and DoH proxy.
- Alerting on bounce rate > 3 %, delivery latency p95 > 5 s, verification failures > 5 %.

## 26. MVP Scope (v1.0)

Auth · Organizations · Domains · DNS Verification · Employees · Google OAuth · Gmail Add-on · Inbound + Outbound Routing · Dashboard · Billing (Paystack) · Settings · Email Logs.

## 27. Roadmap (Post-MVP)

Outlook Add-in · Apple Mail profile · Public API GA + SDKs (TS, Python) · Webhooks · Mobile app (identity + logs) · Analytics workspace · Admin Console GA · Enterprise SSO (SAML, OIDC) · SCIM provisioning · Shared inboxes · Signature manager · Compliance packs (SOC 2, ISO 27001) · Regional routing (EU, US, AF).

## 28. Business Model

Per-seat monthly subscription with volume discounts. Optional annual (17 % off). Add-ons: extra domains, dedicated IP, priority support. Free 14-day trial. No free forever tier in v1 (revisit after PMF).

## 29. Non-Goals

- No shared inbox / helpdesk in MVP.
- No docs/sheets/drive.
- No marketing email blasts.
- No AI writing assistants.
- No calendar.

These are explicitly out of scope so we do not drift into being another suite.

## 30. Definitions

- **Organization**: the tenant. Owns domains, employees, subscription.
- **Employee**: a professional identity inside an org. May or may not have an accepted invite / connected Gmail.
- **Alias**: an email address that resolves to an employee. Every employee has ≥ 1 primary alias.
- **Connection**: an encrypted `lovack_*` credential linking one employee to one Google account for the `google_mail` connector.
- **Routing**: the act of taking an inbound message addressed to an alias and delivering it into the employee's connected Gmail, or of taking an outbound message and relaying it as the alias.

---

_This document is authoritative. If code diverges from this spec, the code is wrong or the spec must be updated — never both left inconsistent. See `ARCHITECTURE.md` for the technical blueprint and `progress.md` for execution status._
