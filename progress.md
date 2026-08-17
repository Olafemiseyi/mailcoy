# LightOrb Connect — Progress

## Shipped this pass
- Fixed mobile grid layout: authenticated pages with short content (Employees, Logs, Aliases, Gmail, Settings, Domains) no longer show a giant gap above the title. Added `grid-rows-[auto_1fr] md:grid-rows-none` to the AppShell grid so the sticky mobile header stops stretching to fill leftover space.
- Added seeded members: `femi@gmail.com` is now an owner of Empyre Homes with 8 employees (5 active, 3 pending/invited), verified `empyrehomes.com` domain, 42 email logs, and rich activity history so every page in the app has content to show.
- Added workspace identity in sidebar: company name + logo tile appears under the Sign out button (uses the org's `logo_url` if set, otherwise an initial-letter chip). Owners upload a logo from Settings → Organization.
- Added `/help` route (Docs) to the sidebar — one card per feature explaining what it does and how to use it, plus a 5-step getting-started checklist.
- Added `/admin` route (Admin) — owner/admin-only overview page with workspace metadata, member roster, and domain status pills.
- Fixed a runtime bug: `listEmployees` was selecting `created_at` (column doesn't exist — it's `added_at`), which was throwing on the Employees page.

## Signatures page — what it does
The Signatures page lets the workspace **owner** define a **single company-wide** signature template. Placeholders `{name}`, `{title}`, `{company}` are substituted per sender at send time, so **yes — once the owner configures it, it applies to every employee's outgoing mail automatically**. There is no per-employee override yet (per-employee custom signatures + role-based variants are on the backlog below).

## Backlog (not shipped — deliberately deferred to keep this pass focused)
- **QR-code teammate invites** — needs a signed invite-token table + QR generation + accept flow. Sketched in `architecture.md`.
- **Registrar auto-detect** on domain onboarding — needs a WHOIS/NS-lookup edge function + provider fingerprint map (GoDaddy, Namecheap, Cloudflare, Route53, etc.) and per-provider walk-throughs.
- **Amazon SES send + bounce webhook** wiring — needs SES creds, an SNS bounce/complaint endpoint under `/api/public/webhooks/ses`, and log ingestion into `email_logs`/`delivery_status`.
- **Smart email suggestions** (aliases + signatures) — needs a lightweight ranker over `email_logs` history + org settings.
- **Split-layout auth pages** (login / signup / reset) — premium editorial redesign with imagery panel.
- **Admin page for the *platform* builder** (cross-org visibility) — the shipped `/admin` is workspace-scoped; a super-admin surface across all orgs is a separate build.
- **Per-employee signature overrides** and role-based templates.
