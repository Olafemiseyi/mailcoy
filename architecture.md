# LightOrb Connect — Architecture

## System
- Frontend: React 19 + TanStack Start on Vite 7, Tailwind v4.
- Backend: TanStack `createServerFn` (Cloudflare Workers runtime) + Supabase Postgres.
- Auth: Supabase Auth (email + Google via Lovable broker).
- Payments: Paystack (live keys stored as secrets).
- Delivery (planned): Amazon SES for send + inbound.

## Authentication flow
1. User signs in on `/auth` (Supabase Auth).
2. `handle_new_user` trigger auto-joins them to the Empyre Homes demo org as owner.
3. `_authenticated` layout (`ssr: false`) gates the protected subtree client-side.
4. Client bearer middleware attaches the Supabase JWT to every server-fn call.
5. Server fns run `requireSupabaseAuth` -> `resolveOrgContext` for tenant scoping.

## Email routing flow (target)
1. Domain owner adds `company.com` in `/domains`.
2. LightOrb issues DNS records (MX, SPF, DKIM, DMARC).
3. Verification poller flips `verification_status` to verified.
4. Employee joins, connects Gmail (`gmail_connections`).
5. Inbound mail arrives at SES -> matched against `aliases` -> forwarded into Gmail.
6. Outbound reply is rewritten so the customer only sees the business address.
7. Every event lands in `email_logs`.

## Data model (public schema)
organizations, organization_members, user_roles, profiles, domains, employees, aliases, gmail_connections, email_logs, incoming_messages, outgoing_messages, delivery_status, activity_logs, audit_logs, api_keys, webhooks, webhook_deliveries, routing_rules, settings, subscriptions, billing_events, plans, contact_messages, app_user_connections.

RLS enforces tenant isolation via `is_org_member` / `has_org_role`. Service-role writes only inside verified server fns.

## Third-party integrations
- Google OAuth (Lovable broker) — social sign-in.
- Google Mail (App User Connector) — Gmail send/read for employees.
- Paystack — subscription billing.
- Amazon SES — planned inbound + outbound MTA.

## Roadmap
- SES production wiring under `/api/public/ses/*` with signature verification.
- Registrar detection via DNS-over-HTTPS + WHOIS.
- Smart alias suggestions when adding employees.
- QR-code invite flow with mobile Gmail hand-off.
