# Supabase Migration Guide — LightOrb Connect

This document contains **everything you need to reproduce this project's Supabase backend on a fresh project**, on any platform that runs Postgres + Supabase-style Auth/Storage. Follow the sections in order.

---

## 1. Prerequisites on the destination

1. A fresh Supabase project (or self-hosted Postgres with the `supabase` schemas provisioned).
2. `postgres` and `pgcrypto` extensions available (they come with Supabase).
3. The following **project secrets** configured in the new environment before deploying application code:

| Secret                                            | Purpose                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `SUPABASE_URL`                                    | REST endpoint of the new project                                        |
| `SUPABASE_PUBLISHABLE_KEY`                        | Anon/publishable API key (server-side)                                  |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | Same values, exposed to the browser bundle |
| `SUPABASE_SERVICE_ROLE_KEY`                       | For admin-only server functions (never sent to browser)                 |
| `SUPABASE_DB_URL`                                 | For migrations & maintenance                                            |
| `LOVABLE_API_KEY`                                 | Connector Gateway workspace token                                       |
| `APP_USER_CONNECTION_KEY_SECRET`                  | 32-byte base64 AES-GCM key for encrypting user connector keys           |
| `GOOGLE_MAIL_APP_USER_CONNECTOR_CLIENT_API_KEY`   | Google Mail App User Connector client key                               |
| `PAYSTACK_PUBLIC_KEY`                             | Paystack (payments) publishable key                                     |
| `PAYSTACK_SECRET_KEY`                             | Paystack secret key (server-only)                                       |

> None of these values are embedded in code. The app reads them from the process environment (`process.env.*`) inside server functions and from `import.meta.env.VITE_*` in the browser.

---

## 2. Third-party integrations to (re)connect

The app is fully wired for the following third parties. On the new platform, only these external links need to be reattached — no code changes required:

- **Google Cloud (Gmail App User Connector)** — an OAuth Web Client whose *Authorized redirect URI* is `https://connector-gateway.lovable.dev/api/v1/app-users/oauth2/callback`. Store the client id/secret in the workspace connector settings; only `GOOGLE_MAIL_APP_USER_CONNECTOR_CLIENT_API_KEY` needs to be present in the runtime env.
- **Paystack** — plug in `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY`. Webhook endpoint: `/api/public/webhooks/paystack`.
- **Amazon SES (planned)** — the abstraction is in place in `src/lib/*` but no keys are required until you enable outbound sending. Add `AWS_SES_REGION`, `AWS_SES_ACCESS_KEY_ID`, `AWS_SES_SECRET_ACCESS_KEY` when ready.
- **Cron / uptime probes** — `/api/public/hooks/verify-domains` (domain verification loop) and `/api/public/status` (records status history) are already public and can be called by any scheduler. Recommended cadence: 5 min for status, 15 min for verification.

---

## 3. Full public-schema SQL

The rest of this section is the authoritative CREATE TABLE / RLS / GRANT / FUNCTION / TRIGGER / INDEX script for the `public` schema. Apply it in a single transaction on the destination.

```sql
--
-- PostgreSQL database dump
--

\restrict F8q9YgIOc7BQBJUQnms7TeTbLeFWgTtv0tOOlmJKSgfy3J6RCqOUhwj63w2oraj

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'owner',
    'admin',
    'member',
    'platform_admin'
);


--
-- Name: email_direction; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.email_direction AS ENUM (
    'incoming',
    'outgoing'
);


--
-- Name: email_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.email_status AS ENUM (
    'routed',
    'delivered',
    'sent',
    'failed',
    'bounced'
);


--
-- Name: employee_state; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.employee_state AS ENUM (
    'active',
    'pending_auth',
    'invited'
);


--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscription_status AS ENUM (
    'trialing',
    'active',
    'past_due',
    'canceled',
    'inactive'
);


--
-- Name: verification_state; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.verification_state AS ENUM (
    'pending',
    'verified',
    'failed'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;

  -- Auto-join everyone to demo organization as owner
  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES ('11111111-1111-1111-1111-111111111111'::uuid, NEW.id, 'owner'::app_role)
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  -- Grant platform_admin to the designated super-admin email
  IF lower(NEW.email) = 'lightorbinnovations@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'platform_admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;


--
-- Name: has_org_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_org_role(_org uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = _org AND user_id = auth.uid() AND role = _role
  );
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;


--
-- Name: is_org_member(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_org_member(_org uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = _org AND user_id = auth.uid()
  );
$$;


--
-- Name: is_platform_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_platform_admin(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'platform_admin'::app_role
  );
$$;


--
-- Name: tg_touch_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tg_touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    actor_user_id uuid,
    action text NOT NULL,
    target_type text,
    target_id text,
    meta jsonb DEFAULT '{}'::jsonb,
    at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: aliases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.aliases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    address text NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    prefix text NOT NULL,
    hash text NOT NULL,
    scopes text[] DEFAULT ARRAY[]::text[] NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone,
    revoked_at timestamp with time zone
);


--
-- Name: app_user_connections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_user_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    connector_id text NOT NULL,
    connection_key_ciphertext text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    actor_user_id uuid,
    action text NOT NULL,
    ip text,
    ua text,
    meta jsonb DEFAULT '{}'::jsonb,
    at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: billing_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    provider text NOT NULL,
    event_type text NOT NULL,
    reference text,
    payload jsonb NOT NULL,
    status text DEFAULT 'received'::text NOT NULL,
    received_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: delivery_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.delivery_status (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email_log_id uuid,
    organization_id uuid NOT NULL,
    event text NOT NULL,
    at timestamp with time zone DEFAULT now() NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb
);


--
-- Name: domains; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.domains (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    domain_name text NOT NULL,
    verification_status public.verification_state DEFAULT 'pending'::public.verification_state NOT NULL,
    verification_token text,
    verification_method text DEFAULT 'dns'::text,
    txt_record_key text,
    txt_record_value text,
    spf_value text,
    dkim_selector text DEFAULT 'lightorb'::text,
    dkim_value text,
    mx_status public.verification_state DEFAULT 'pending'::public.verification_state NOT NULL,
    spf_status public.verification_state DEFAULT 'pending'::public.verification_state NOT NULL,
    dkim_status public.verification_state DEFAULT 'pending'::public.verification_state NOT NULL,
    dmarc_status public.verification_state DEFAULT 'pending'::public.verification_state NOT NULL,
    verified_at timestamp with time zone,
    last_checked_at timestamp with time zone,
    verification_errors text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    txt_status text DEFAULT 'pending'::text,
    errors jsonb DEFAULT '[]'::jsonb,
    dkim_public_key text,
    dkim_private_key_enc text
);


--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    sender text NOT NULL,
    receiver text NOT NULL,
    subject text,
    snippet text,
    direction public.email_direction NOT NULL,
    status public.email_status NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    full_name text NOT NULL,
    company_email text NOT NULL,
    personal_email text NOT NULL,
    status public.employee_state DEFAULT 'pending_auth'::public.employee_state NOT NULL,
    added_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    job_title text,
    department text,
    professional_email text,
    invited_at timestamp with time zone DEFAULT now(),
    connected_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: gmail_connections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gmail_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    google_email text NOT NULL,
    connected_at timestamp with time zone DEFAULT now() NOT NULL,
    last_health_check_at timestamp with time zone,
    health_status text DEFAULT 'healthy'::text NOT NULL,
    revoked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT gmail_connections_health_status_check CHECK ((health_status = ANY (ARRAY['healthy'::text, 'degraded'::text, 'revoked'::text, 'error'::text])))
);


--
-- Name: incoming_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incoming_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    employee_id uuid,
    message_id text,
    from_addr text NOT NULL,
    to_addr text NOT NULL,
    size_bytes integer,
    spam_score numeric,
    received_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: organization_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_members (
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'member'::public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text,
    primary_domain text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    industry text,
    country text,
    timezone text DEFAULT 'UTC'::text,
    currency text DEFAULT 'USD'::text,
    logo_url text,
    onboarding_step integer DEFAULT 0,
    onboarding_completed_at timestamp with time zone,
    deleted_at timestamp with time zone,
    created_by uuid
);


--
-- Name: outgoing_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.outgoing_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    employee_id uuid,
    message_id text,
    from_addr text NOT NULL,
    to_addr text NOT NULL,
    size_bytes integer,
    sent_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    price_ngn integer DEFAULT 0 NOT NULL,
    price_usd integer DEFAULT 0 NOT NULL,
    seats_limit integer,
    domains_limit integer,
    features jsonb DEFAULT '{}'::jsonb NOT NULL,
    active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: platform_status_checks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_status_checks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    component text NOT NULL,
    status text NOT NULL,
    latency_ms integer,
    detail text,
    checked_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT platform_status_checks_status_check CHECK ((status = ANY (ARRAY['operational'::text, 'degraded'::text, 'partial_outage'::text, 'major_outage'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: routing_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.routing_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    priority integer DEFAULT 100 NOT NULL,
    match_pattern text NOT NULL,
    action text NOT NULL,
    target text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    organization_id uuid NOT NULL,
    routing_active boolean DEFAULT true NOT NULL,
    notify_email boolean DEFAULT true NOT NULL,
    notify_digest boolean DEFAULT false NOT NULL,
    security_mfa boolean DEFAULT false NOT NULL,
    dkim_enabled boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    company_signature text,
    catchall_mode text DEFAULT 'reject'::text NOT NULL,
    catchall_forward_to text,
    CONSTRAINT settings_catchall_mode_check CHECK ((catchall_mode = ANY (ARRAY['receive'::text, 'reject'::text, 'forward'::text])))
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    organization_id uuid NOT NULL,
    plan text DEFAULT 'Starter'::text NOT NULL,
    status public.subscription_status DEFAULT 'trialing'::public.subscription_status NOT NULL,
    trial_end timestamp with time zone DEFAULT (now() + '14 days'::interval),
    renewal_date timestamp with time zone DEFAULT (now() + '44 days'::interval),
    max_employees integer DEFAULT 15 NOT NULL,
    max_aliases integer DEFAULT 30 NOT NULL,
    max_domains integer DEFAULT 1 NOT NULL,
    storage_gb integer DEFAULT 5 NOT NULL,
    api_limit_monthly integer DEFAULT 1000 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    provider text,
    provider_reference text,
    plan_code text,
    amount_kobo bigint,
    current_period_end timestamp with time zone
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL
);


--
-- Name: webhook_deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhook_deliveries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    webhook_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    event text NOT NULL,
    payload jsonb NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    next_attempt_at timestamp with time zone,
    response_status integer,
    response_body text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: webhooks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    url text NOT NULL,
    secret_hash text NOT NULL,
    events text[] DEFAULT ARRAY[]::text[] NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: aliases aliases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aliases
    ADD CONSTRAINT aliases_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: app_user_connections app_user_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user_connections
    ADD CONSTRAINT app_user_connections_pkey PRIMARY KEY (id);


--
-- Name: app_user_connections app_user_connections_user_id_connector_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user_connections
    ADD CONSTRAINT app_user_connections_user_id_connector_id_key UNIQUE (user_id, connector_id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: billing_events billing_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_events
    ADD CONSTRAINT billing_events_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: delivery_status delivery_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_status
    ADD CONSTRAINT delivery_status_pkey PRIMARY KEY (id);


--
-- Name: domains domains_domain_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.domains
    ADD CONSTRAINT domains_domain_name_key UNIQUE (domain_name);


--
-- Name: domains domains_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.domains
    ADD CONSTRAINT domains_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: gmail_connections gmail_connections_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gmail_connections
    ADD CONSTRAINT gmail_connections_employee_id_key UNIQUE (employee_id);


--
-- Name: gmail_connections gmail_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gmail_connections
    ADD CONSTRAINT gmail_connections_pkey PRIMARY KEY (id);


--
-- Name: incoming_messages incoming_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incoming_messages
    ADD CONSTRAINT incoming_messages_pkey PRIMARY KEY (id);


--
-- Name: organization_members organization_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_pkey PRIMARY KEY (organization_id, user_id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_slug_key UNIQUE (slug);


--
-- Name: outgoing_messages outgoing_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outgoing_messages
    ADD CONSTRAINT outgoing_messages_pkey PRIMARY KEY (id);


--
-- Name: plans plans_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_code_key UNIQUE (code);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: platform_status_checks platform_status_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_status_checks
    ADD CONSTRAINT platform_status_checks_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: routing_rules routing_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.routing_rules
    ADD CONSTRAINT routing_rules_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (organization_id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (organization_id);


--
-- Name: subscriptions subscriptions_provider_reference_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_provider_reference_key UNIQUE (provider_reference);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: webhook_deliveries webhook_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: activity_logs_org_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activity_logs_org_time ON public.activity_logs USING btree (organization_id, at DESC);


--
-- Name: aliases_address_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX aliases_address_unique ON public.aliases USING btree (lower(address));


--
-- Name: aliases_employee_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX aliases_employee_idx ON public.aliases USING btree (employee_id);


--
-- Name: api_keys_org_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_keys_org_idx ON public.api_keys USING btree (organization_id);


--
-- Name: api_keys_prefix_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX api_keys_prefix_unique ON public.api_keys USING btree (prefix);


--
-- Name: audit_logs_org_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_org_time ON public.audit_logs USING btree (organization_id, at DESC);


--
-- Name: billing_events_org_received_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_events_org_received_idx ON public.billing_events USING btree (organization_id, received_at DESC);


--
-- Name: delivery_status_email_log; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX delivery_status_email_log ON public.delivery_status USING btree (email_log_id);


--
-- Name: delivery_status_org_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX delivery_status_org_time ON public.delivery_status USING btree (organization_id, at DESC);


--
-- Name: domains_organization_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX domains_organization_id_idx ON public.domains USING btree (organization_id);


--
-- Name: email_logs_organization_id_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_logs_organization_id_timestamp_idx ON public.email_logs USING btree (organization_id, "timestamp" DESC);


--
-- Name: employees_org_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX employees_org_status_idx ON public.employees USING btree (organization_id, status);


--
-- Name: employees_organization_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX employees_organization_id_idx ON public.employees USING btree (organization_id);


--
-- Name: employees_professional_email_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX employees_professional_email_unique ON public.employees USING btree (lower(professional_email)) WHERE ((professional_email IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: gmail_connections_org_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gmail_connections_org_idx ON public.gmail_connections USING btree (organization_id);


--
-- Name: idx_status_checks_component_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_status_checks_component_time ON public.platform_status_checks USING btree (component, checked_at DESC);


--
-- Name: incoming_messages_org_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX incoming_messages_org_time ON public.incoming_messages USING btree (organization_id, received_at DESC);


--
-- Name: organizations_slug_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX organizations_slug_unique ON public.organizations USING btree (lower(slug)) WHERE ((slug IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: outgoing_messages_org_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX outgoing_messages_org_time ON public.outgoing_messages USING btree (organization_id, sent_at DESC);


--
-- Name: platform_status_checks_component_checked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX platform_status_checks_component_checked_idx ON public.platform_status_checks USING btree (component, checked_at DESC);


--
-- Name: routing_rules_org_pri; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX routing_rules_org_pri ON public.routing_rules USING btree (organization_id, priority);


--
-- Name: webhook_deliveries_org_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX webhook_deliveries_org_time ON public.webhook_deliveries USING btree (organization_id, created_at DESC);


--
-- Name: webhook_deliveries_pending; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX webhook_deliveries_pending ON public.webhook_deliveries USING btree (next_attempt_at) WHERE (status = 'pending'::text);


--
-- Name: webhooks_org_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX webhooks_org_idx ON public.webhooks USING btree (organization_id);


--
-- Name: aliases trg_aliases_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_aliases_touch BEFORE UPDATE ON public.aliases FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: domains trg_domains_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_domains_touch BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: employees trg_employees_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_employees_touch BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: gmail_connections trg_gmail_conn_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_gmail_conn_touch BEFORE UPDATE ON public.gmail_connections FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: organizations trg_organizations_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_organizations_touch BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: organizations trg_orgs_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_orgs_touch BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: plans trg_plans_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_plans_touch BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: profiles trg_profiles_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: routing_rules trg_routing_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_routing_touch BEFORE UPDATE ON public.routing_rules FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: settings trg_settings_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_settings_touch BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: subscriptions trg_subs_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_subs_touch BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: webhooks trg_webhooks_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_webhooks_touch BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();


--
-- Name: activity_logs activity_logs_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: aliases aliases_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aliases
    ADD CONSTRAINT aliases_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: aliases aliases_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aliases
    ADD CONSTRAINT aliases_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: api_keys api_keys_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;


--
-- Name: billing_events billing_events_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_events
    ADD CONSTRAINT billing_events_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;


--
-- Name: delivery_status delivery_status_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_status
    ADD CONSTRAINT delivery_status_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: domains domains_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.domains
    ADD CONSTRAINT domains_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: email_logs email_logs_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: employees employees_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: gmail_connections gmail_connections_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gmail_connections
    ADD CONSTRAINT gmail_connections_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: gmail_connections gmail_connections_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gmail_connections
    ADD CONSTRAINT gmail_connections_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: incoming_messages incoming_messages_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incoming_messages
    ADD CONSTRAINT incoming_messages_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- Name: incoming_messages incoming_messages_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incoming_messages
    ADD CONSTRAINT incoming_messages_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: outgoing_messages outgoing_messages_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outgoing_messages
    ADD CONSTRAINT outgoing_messages_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- Name: outgoing_messages outgoing_messages_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outgoing_messages
    ADD CONSTRAINT outgoing_messages_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: routing_rules routing_rules_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.routing_rules
    ADD CONSTRAINT routing_rules_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: settings settings_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webhook_deliveries webhook_deliveries_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: webhook_deliveries webhook_deliveries_webhook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_webhook_id_fkey FOREIGN KEY (webhook_id) REFERENCES public.webhooks(id) ON DELETE CASCADE;


--
-- Name: webhooks webhooks_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: billing_events Admins read own org billing events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins read own org billing events" ON public.billing_events FOR SELECT TO authenticated USING (((organization_id IS NOT NULL) AND public.has_org_role(organization_id, 'admin'::public.app_role)));


--
-- Name: platform_status_checks Public can read status history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read status history" ON public.platform_status_checks FOR SELECT TO authenticated, anon USING (true);


--
-- Name: activity_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: activity_logs activity_logs_org_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY activity_logs_org_read ON public.activity_logs FOR SELECT TO authenticated USING (public.is_org_member(organization_id));


--
-- Name: aliases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.aliases ENABLE ROW LEVEL SECURITY;

--
-- Name: aliases aliases_admin_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY aliases_admin_write ON public.aliases TO authenticated USING ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role))) WITH CHECK ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role)));


--
-- Name: aliases aliases_org_members_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY aliases_org_members_read ON public.aliases FOR SELECT TO authenticated USING (public.is_org_member(organization_id));


--
-- Name: organizations any user create org; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "any user create org" ON public.organizations FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: api_keys; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

--
-- Name: api_keys api_keys_admin_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY api_keys_admin_read ON public.api_keys FOR SELECT TO authenticated USING ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role)));


--
-- Name: api_keys api_keys_admin_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY api_keys_admin_write ON public.api_keys TO authenticated USING ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role))) WITH CHECK ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role)));


--
-- Name: app_user_connections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_user_connections ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs audit_logs_admin_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY audit_logs_admin_read ON public.audit_logs FOR SELECT TO authenticated USING (((organization_id IS NOT NULL) AND (public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role))));


--
-- Name: billing_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_messages contact_messages_insert_any; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY contact_messages_insert_any ON public.contact_messages FOR INSERT TO authenticated, anon WITH CHECK (((char_length(name) >= 1) AND (char_length(name) <= 200) AND ((char_length(email) >= 3) AND (char_length(email) <= 320)) AND ((char_length(message) >= 1) AND (char_length(message) <= 5000))));


--
-- Name: delivery_status; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.delivery_status ENABLE ROW LEVEL SECURITY;

--
-- Name: delivery_status delivery_status_org_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY delivery_status_org_read ON public.delivery_status FOR SELECT TO authenticated USING (public.is_org_member(organization_id));


--
-- Name: domains; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

--
-- Name: email_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: employees; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

--
-- Name: gmail_connections gmail_conn_org_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY gmail_conn_org_read ON public.gmail_connections FOR SELECT TO authenticated USING (public.is_org_member(organization_id));


--
-- Name: gmail_connections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gmail_connections ENABLE ROW LEVEL SECURITY;

--
-- Name: incoming_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.incoming_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: incoming_messages incoming_msg_org_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY incoming_msg_org_read ON public.incoming_messages FOR SELECT TO authenticated USING (public.is_org_member(organization_id));


--
-- Name: organizations members read org; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "members read org" ON public.organizations FOR SELECT TO authenticated USING (public.is_org_member(id));


--
-- Name: organization_members members see own org rows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "members see own org rows" ON public.organization_members FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR public.is_org_member(organization_id)));


--
-- Name: subscriptions org members insert subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "org members insert subscription" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (public.is_org_member(organization_id));


--
-- Name: domains org members manage domains; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "org members manage domains" ON public.domains TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));


--
-- Name: employees org members manage employees; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "org members manage employees" ON public.employees TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));


--
-- Name: email_logs org members manage logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "org members manage logs" ON public.email_logs TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));


--
-- Name: settings org members manage settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "org members manage settings" ON public.settings TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));


--
-- Name: subscriptions org members read subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "org members read subscription" ON public.subscriptions FOR SELECT TO authenticated USING (public.is_org_member(organization_id));


--
-- Name: organization_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations orgs_owner_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY orgs_owner_delete ON public.organizations FOR DELETE TO authenticated USING (public.has_org_role(id, 'owner'::public.app_role));


--
-- Name: outgoing_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.outgoing_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: outgoing_messages outgoing_msg_org_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY outgoing_msg_org_read ON public.outgoing_messages FOR SELECT TO authenticated USING (public.is_org_member(organization_id));


--
-- Name: profiles own profile insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((id = auth.uid()));


--
-- Name: profiles own profile read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING ((id = auth.uid()));


--
-- Name: profiles own profile update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));


--
-- Name: organization_members owners delete members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners delete members" ON public.organization_members FOR DELETE TO authenticated USING (public.has_org_role(organization_id, 'owner'::public.app_role));


--
-- Name: organizations owners delete org; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners delete org" ON public.organizations FOR DELETE TO authenticated USING (public.has_org_role(id, 'owner'::public.app_role));


--
-- Name: organization_members owners manage members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners manage members" ON public.organization_members FOR UPDATE TO authenticated USING (public.has_org_role(organization_id, 'owner'::public.app_role)) WITH CHECK (public.has_org_role(organization_id, 'owner'::public.app_role));


--
-- Name: organizations owners update org; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners update org" ON public.organizations FOR UPDATE TO authenticated USING (public.has_org_role(id, 'owner'::public.app_role)) WITH CHECK (public.has_org_role(id, 'owner'::public.app_role));


--
-- Name: subscriptions owners update subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners update subscription" ON public.subscriptions FOR UPDATE TO authenticated USING (public.has_org_role(organization_id, 'owner'::public.app_role)) WITH CHECK (public.has_org_role(organization_id, 'owner'::public.app_role));


--
-- Name: plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

--
-- Name: plans plans_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY plans_public_read ON public.plans FOR SELECT TO authenticated, anon USING ((active = true));


--
-- Name: platform_status_checks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.platform_status_checks ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles read own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: routing_rules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;

--
-- Name: routing_rules routing_rules_admin_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY routing_rules_admin_write ON public.routing_rules TO authenticated USING ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role))) WITH CHECK ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role)));


--
-- Name: routing_rules routing_rules_org_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY routing_rules_org_read ON public.routing_rules FOR SELECT TO authenticated USING (public.is_org_member(organization_id));


--
-- Name: organization_members self insert membership; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "self insert membership" ON public.organization_members FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: webhook_deliveries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

--
-- Name: webhook_deliveries webhook_deliveries_admin_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY webhook_deliveries_admin_read ON public.webhook_deliveries FOR SELECT TO authenticated USING ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role)));


--
-- Name: webhooks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

--
-- Name: webhooks webhooks_admin_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY webhooks_admin_all ON public.webhooks TO authenticated USING ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role))) WITH CHECK ((public.has_org_role(organization_id, 'admin'::public.app_role) OR public.has_org_role(organization_id, 'owner'::public.app_role)));


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO sandbox_exec;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;
GRANT ALL ON FUNCTION public.handle_new_user() TO sandbox_exec;


--
-- Name: FUNCTION has_org_role(_org uuid, _role public.app_role); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.has_org_role(_org uuid, _role public.app_role) TO anon;
GRANT ALL ON FUNCTION public.has_org_role(_org uuid, _role public.app_role) TO authenticated;
GRANT ALL ON FUNCTION public.has_org_role(_org uuid, _role public.app_role) TO service_role;
GRANT ALL ON FUNCTION public.has_org_role(_org uuid, _role public.app_role) TO sandbox_exec;


--
-- Name: FUNCTION has_role(_user_id uuid, _role public.app_role); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO anon;
GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO authenticated;
GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO service_role;
GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO sandbox_exec;


--
-- Name: FUNCTION is_org_member(_org uuid); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.is_org_member(_org uuid) TO anon;
GRANT ALL ON FUNCTION public.is_org_member(_org uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_org_member(_org uuid) TO service_role;
GRANT ALL ON FUNCTION public.is_org_member(_org uuid) TO sandbox_exec;


--
-- Name: FUNCTION is_platform_admin(_user_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.is_platform_admin(_user_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.is_platform_admin(_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.is_platform_admin(_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_platform_admin(_user_id uuid) TO service_role;
GRANT ALL ON FUNCTION public.is_platform_admin(_user_id uuid) TO sandbox_exec;


--
-- Name: FUNCTION tg_touch_updated_at(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.tg_touch_updated_at() TO anon;
GRANT ALL ON FUNCTION public.tg_touch_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.tg_touch_updated_at() TO service_role;
GRANT ALL ON FUNCTION public.tg_touch_updated_at() TO sandbox_exec;


--
-- Name: TABLE activity_logs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.activity_logs TO anon;
GRANT ALL ON TABLE public.activity_logs TO authenticated;
GRANT ALL ON TABLE public.activity_logs TO service_role;
GRANT SELECT,INSERT ON TABLE public.activity_logs TO sandbox_exec;


--
-- Name: TABLE aliases; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.aliases TO anon;
GRANT ALL ON TABLE public.aliases TO authenticated;
GRANT ALL ON TABLE public.aliases TO service_role;
GRANT SELECT,INSERT ON TABLE public.aliases TO sandbox_exec;


--
-- Name: TABLE api_keys; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.api_keys TO anon;
GRANT ALL ON TABLE public.api_keys TO authenticated;
GRANT ALL ON TABLE public.api_keys TO service_role;
GRANT SELECT,INSERT ON TABLE public.api_keys TO sandbox_exec;


--
-- Name: TABLE app_user_connections; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.app_user_connections TO anon;
GRANT ALL ON TABLE public.app_user_connections TO authenticated;
GRANT ALL ON TABLE public.app_user_connections TO service_role;
GRANT SELECT,INSERT ON TABLE public.app_user_connections TO sandbox_exec;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;
GRANT SELECT,INSERT ON TABLE public.audit_logs TO sandbox_exec;


--
-- Name: TABLE billing_events; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.billing_events TO anon;
GRANT ALL ON TABLE public.billing_events TO authenticated;
GRANT ALL ON TABLE public.billing_events TO service_role;
GRANT SELECT,INSERT ON TABLE public.billing_events TO sandbox_exec;


--
-- Name: TABLE contact_messages; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.contact_messages TO anon;
GRANT ALL ON TABLE public.contact_messages TO authenticated;
GRANT ALL ON TABLE public.contact_messages TO service_role;
GRANT SELECT,INSERT ON TABLE public.contact_messages TO sandbox_exec;


--
-- Name: TABLE delivery_status; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.delivery_status TO anon;
GRANT ALL ON TABLE public.delivery_status TO authenticated;
GRANT ALL ON TABLE public.delivery_status TO service_role;
GRANT SELECT,INSERT ON TABLE public.delivery_status TO sandbox_exec;


--
-- Name: TABLE domains; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.domains TO anon;
GRANT ALL ON TABLE public.domains TO authenticated;
GRANT ALL ON TABLE public.domains TO service_role;
GRANT SELECT,INSERT ON TABLE public.domains TO sandbox_exec;


--
-- Name: TABLE email_logs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.email_logs TO anon;
GRANT ALL ON TABLE public.email_logs TO authenticated;
GRANT ALL ON TABLE public.email_logs TO service_role;
GRANT SELECT,INSERT ON TABLE public.email_logs TO sandbox_exec;


--
-- Name: TABLE employees; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.employees TO anon;
GRANT ALL ON TABLE public.employees TO authenticated;
GRANT ALL ON TABLE public.employees TO service_role;
GRANT SELECT,INSERT ON TABLE public.employees TO sandbox_exec;


--
-- Name: TABLE gmail_connections; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.gmail_connections TO anon;
GRANT ALL ON TABLE public.gmail_connections TO authenticated;
GRANT ALL ON TABLE public.gmail_connections TO service_role;
GRANT SELECT,INSERT ON TABLE public.gmail_connections TO sandbox_exec;


--
-- Name: TABLE incoming_messages; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.incoming_messages TO anon;
GRANT ALL ON TABLE public.incoming_messages TO authenticated;
GRANT ALL ON TABLE public.incoming_messages TO service_role;
GRANT SELECT,INSERT ON TABLE public.incoming_messages TO sandbox_exec;


--
-- Name: TABLE organization_members; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.organization_members TO anon;
GRANT ALL ON TABLE public.organization_members TO authenticated;
GRANT ALL ON TABLE public.organization_members TO service_role;
GRANT SELECT,INSERT ON TABLE public.organization_members TO sandbox_exec;


--
-- Name: TABLE organizations; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.organizations TO anon;
GRANT ALL ON TABLE public.organizations TO authenticated;
GRANT ALL ON TABLE public.organizations TO service_role;
GRANT SELECT,INSERT ON TABLE public.organizations TO sandbox_exec;


--
-- Name: TABLE outgoing_messages; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.outgoing_messages TO anon;
GRANT ALL ON TABLE public.outgoing_messages TO authenticated;
GRANT ALL ON TABLE public.outgoing_messages TO service_role;
GRANT SELECT,INSERT ON TABLE public.outgoing_messages TO sandbox_exec;


--
-- Name: TABLE plans; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.plans TO anon;
GRANT ALL ON TABLE public.plans TO authenticated;
GRANT ALL ON TABLE public.plans TO service_role;
GRANT SELECT,INSERT ON TABLE public.plans TO sandbox_exec;


--
-- Name: TABLE platform_status_checks; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.platform_status_checks TO anon;
GRANT ALL ON TABLE public.platform_status_checks TO authenticated;
GRANT ALL ON TABLE public.platform_status_checks TO service_role;
GRANT SELECT,INSERT ON TABLE public.platform_status_checks TO sandbox_exec;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT,INSERT ON TABLE public.profiles TO sandbox_exec;


--
-- Name: TABLE routing_rules; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.routing_rules TO anon;
GRANT ALL ON TABLE public.routing_rules TO authenticated;
GRANT ALL ON TABLE public.routing_rules TO service_role;
GRANT SELECT,INSERT ON TABLE public.routing_rules TO sandbox_exec;


--
-- Name: TABLE settings; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.settings TO anon;
GRANT ALL ON TABLE public.settings TO authenticated;
GRANT ALL ON TABLE public.settings TO service_role;
GRANT SELECT,INSERT ON TABLE public.settings TO sandbox_exec;


--
-- Name: TABLE subscriptions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.subscriptions TO anon;
GRANT ALL ON TABLE public.subscriptions TO authenticated;
GRANT ALL ON TABLE public.subscriptions TO service_role;
GRANT SELECT,INSERT ON TABLE public.subscriptions TO sandbox_exec;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_roles TO anon;
GRANT ALL ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;
GRANT SELECT,INSERT ON TABLE public.user_roles TO sandbox_exec;


--
-- Name: TABLE webhook_deliveries; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.webhook_deliveries TO anon;
GRANT ALL ON TABLE public.webhook_deliveries TO authenticated;
GRANT ALL ON TABLE public.webhook_deliveries TO service_role;
GRANT SELECT,INSERT ON TABLE public.webhook_deliveries TO sandbox_exec;


--
-- Name: TABLE webhooks; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.webhooks TO anon;
GRANT ALL ON TABLE public.webhooks TO authenticated;
GRANT ALL ON TABLE public.webhooks TO service_role;
GRANT SELECT,INSERT ON TABLE public.webhooks TO sandbox_exec;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES TO sandbox_exec;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO sandbox_exec;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT ON TABLES TO sandbox_exec;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict F8q9YgIOc7BQBJUQnms7TeTbLeFWgTtv0tOOlmJKSgfy3J6RCqOUhwj63w2oraj

```

---

## 4. Seed data & bootstrap users

Run this **after** section 3 to (a) create the default demo organization the sign-up trigger references and (b) seed the platform admin + a demo user. Passwords are bcrypt-hashed on insert; change them immediately in production.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.organizations (id, name, slug, primary_domain, industry, country)
VALUES ('11111111-1111-1111-1111-111111111111'::uuid,
        'Demo Organization', 'demo', 'demo.local', 'Software', 'NG')
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE admin_id uuid; demo_id uuid;
BEGIN
  -- ============ Platform admin ============
  SELECT id INTO admin_id FROM auth.users WHERE lower(email) = 'lightorbinnovations@gmail.com';
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
      'lightorbinnovations@gmail.com', crypt('12345678', gen_salt('bf')), now(),
      jsonb_build_object('provider','email','providers', jsonb_build_array('email')),
      jsonb_build_object('full_name','LightOrb Admin'),
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id, admin_id::text,
            jsonb_build_object('sub', admin_id::text, 'email', 'lightorbinnovations@gmail.com', 'email_verified', true),
            'email', now(), now(), now());
  END IF;
  INSERT INTO public.profiles (id, full_name) VALUES (admin_id, 'LightOrb Admin') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES ('11111111-1111-1111-1111-111111111111'::uuid, admin_id, 'owner'::app_role)
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'platform_admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

  -- ============ Demo user ============
  SELECT id INTO demo_id FROM auth.users WHERE lower(email) = 'femi@gmail.com';
  IF demo_id IS NULL THEN
    demo_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', demo_id, 'authenticated', 'authenticated',
      'femi@gmail.com', crypt('12345678', gen_salt('bf')), now(),
      jsonb_build_object('provider','email','providers', jsonb_build_array('email')),
      jsonb_build_object('full_name','Femi Demo'),
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), demo_id, demo_id::text,
            jsonb_build_object('sub', demo_id::text, 'email', 'femi@gmail.com', 'email_verified', true),
            'email', now(), now(), now());
  END IF;
  INSERT INTO public.profiles (id, full_name) VALUES (demo_id, 'Femi Demo') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES ('11111111-1111-1111-1111-111111111111'::uuid, demo_id, 'owner'::app_role)
    ON CONFLICT (organization_id, user_id) DO NOTHING;
END $$;
```

**Test credentials created:**

| Role           | Email                              | Password    |
| -------------- | ---------------------------------- | ----------- |
| Platform admin | `lightorbinnovations@gmail.com`    | `12345678`  |
| Demo user      | `femi@gmail.com`                   | `12345678`  |

Admin dashboard lives at `/admin/login` (isolated from customer sign-in). Regular users sign in at `/auth/login`.

---

## 5. Storage buckets

Recreate the bucket (private):

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', false)
ON CONFLICT (id) DO NOTHING;
```

Add policies matching the ones on the source project (org-scoped read/write). None of the existing brand-assets are copied — upload fresh assets in the destination.

---

## 6. Auth configuration

In the destination Supabase project's **Authentication → Providers**, enable:

- **Email** — leave "Confirm email" enabled for production; can be off for staging.
- **Google** (optional, recommended) — use Lovable Cloud managed OAuth **or** BYOK. Redirect URL is provided by the auth settings screen. The app calls `lovable.auth.signInWithOAuth("google", …)` in `src/routes/auth/login.tsx`.

Auth email rate limit: default is fine; the app uses `supabase--configure_auth` semantics.

---

## 7. Application env wiring

The generated `.env` on the destination should contain:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_PROJECT_ID=...
```

Server-only variables are supplied by the hosting platform (Vercel/Cloudflare secrets, etc.) — do **not** commit them.

---

## 8. Post-migration verification checklist

1. Sign in as `lightorbinnovations@gmail.com` → `/admin/login` → dashboard shows revenue cards.
2. Sign in as `femi@gmail.com` → `/dashboard` renders, `/employees`, `/domains`, `/gmail` all load.
3. Visit `/status` → 5 probes (Database, Auth, Gmail gateway, Paystack, API) all report Operational.
4. Trigger `POST /api/public/webhooks/paystack` with a signed test event and verify `billing_events` row inserts.
5. Add an employee, click **Connect Gmail** → popup completes → row inserted in `gmail_connections`.

If any step fails, check `activity_logs` and `audit_logs` first — every server action writes one of these two.

---

## 9. Files in this repo you should NOT edit after migration

Auto-generated / integration-managed. Regenerate them from the destination:

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/client.server.ts`
- `src/integrations/supabase/auth-middleware.ts`
- `src/integrations/supabase/auth-attacher.ts`
- `src/integrations/supabase/types.ts` — regenerate with `supabase gen types typescript --local > src/integrations/supabase/types.ts`
- `src/routeTree.gen.ts`
- `supabase/config.toml`
- `src/routes/_authenticated/route.tsx`

Everything else is portable application code.
