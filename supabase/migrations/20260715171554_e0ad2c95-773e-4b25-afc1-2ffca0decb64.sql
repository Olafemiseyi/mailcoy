
-- =============================================================
-- LightOrb Connect — Batch 1: Control Plane Schema
-- Adds missing tables + extends existing ones per PROJECT_SPEC.md
-- Idempotent: safe to re-run.
-- =============================================================

-- ---------- 0. EXTENSIONS ----------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- 1. HELPERS ----------
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;

-- ---------- 2. EXTEND ORGANIZATIONS ----------
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS onboarding_step int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_by uuid;

CREATE UNIQUE INDEX IF NOT EXISTS organizations_slug_unique
  ON public.organizations (lower(slug)) WHERE slug IS NOT NULL AND deleted_at IS NULL;

DROP TRIGGER IF EXISTS trg_organizations_touch ON public.organizations;
CREATE TRIGGER trg_organizations_touch BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ---------- 3. EXTEND DOMAINS ----------
ALTER TABLE public.domains
  ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending'
    CHECK (verification_status IN ('pending','verified','failed')),
  ADD COLUMN IF NOT EXISTS txt_record_value text,
  ADD COLUMN IF NOT EXISTS dkim_selector text DEFAULT 'lightorb',
  ADD COLUMN IF NOT EXISTS txt_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS mx_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS spf_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS dkim_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS dmarc_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS last_checked_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS errors jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS dkim_public_key text,
  ADD COLUMN IF NOT EXISTS dkim_private_key_enc text;

DROP TRIGGER IF EXISTS trg_domains_touch ON public.domains;
CREATE TRIGGER trg_domains_touch BEFORE UPDATE ON public.domains
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ---------- 4. EXTEND EMPLOYEES ----------
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS job_title text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS professional_email text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending'
    CHECK (status IN ('pending','connected','suspended','inactive','deleted')),
  ADD COLUMN IF NOT EXISTS invited_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS connected_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS employees_professional_email_unique
  ON public.employees (lower(professional_email))
  WHERE professional_email IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS employees_org_status_idx
  ON public.employees (organization_id, status);

DROP TRIGGER IF EXISTS trg_employees_touch ON public.employees;
CREATE TRIGGER trg_employees_touch BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ---------- 5. ALIASES ----------
CREATE TABLE IF NOT EXISTS public.aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  address text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS aliases_address_unique ON public.aliases (lower(address));
CREATE INDEX IF NOT EXISTS aliases_employee_idx ON public.aliases (employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aliases TO authenticated;
GRANT ALL ON public.aliases TO service_role;
ALTER TABLE public.aliases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "aliases_org_members_read" ON public.aliases;
CREATE POLICY "aliases_org_members_read" ON public.aliases FOR SELECT
  TO authenticated USING (public.is_org_member(organization_id));
DROP POLICY IF EXISTS "aliases_admin_write" ON public.aliases;
CREATE POLICY "aliases_admin_write" ON public.aliases FOR ALL
  TO authenticated
  USING (public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner'))
  WITH CHECK (public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner'));
DROP TRIGGER IF EXISTS trg_aliases_touch ON public.aliases;
CREATE TRIGGER trg_aliases_touch BEFORE UPDATE ON public.aliases
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ---------- 6. GMAIL CONNECTIONS (metadata) ----------
CREATE TABLE IF NOT EXISTS public.gmail_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  google_email text NOT NULL,
  connected_at timestamptz NOT NULL DEFAULT now(),
  last_health_check_at timestamptz,
  health_status text NOT NULL DEFAULT 'healthy'
    CHECK (health_status IN ('healthy','degraded','revoked','error')),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id)
);
CREATE INDEX IF NOT EXISTS gmail_connections_org_idx ON public.gmail_connections (organization_id);
GRANT SELECT ON public.gmail_connections TO authenticated;
GRANT ALL ON public.gmail_connections TO service_role;
ALTER TABLE public.gmail_connections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gmail_conn_org_read" ON public.gmail_connections;
CREATE POLICY "gmail_conn_org_read" ON public.gmail_connections FOR SELECT
  TO authenticated USING (public.is_org_member(organization_id));
DROP TRIGGER IF EXISTS trg_gmail_conn_touch ON public.gmail_connections;
CREATE TRIGGER trg_gmail_conn_touch BEFORE UPDATE ON public.gmail_connections
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ---------- 7. APP USER CONNECTIONS (secret material, service_role only) ----------
CREATE TABLE IF NOT EXISTS public.app_user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  connector_id text NOT NULL,
  connection_key_ciphertext text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, connector_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_user_connections TO service_role;
ALTER TABLE public.app_user_connections ENABLE ROW LEVEL SECURITY;
-- no policies for authenticated/anon — service_role only

-- ---------- 8. PLANS ----------
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  price_ngn integer NOT NULL DEFAULT 0,
  price_usd integer NOT NULL DEFAULT 0,
  seats_limit integer,
  domains_limit integer,
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plans TO anon, authenticated;
GRANT ALL ON public.plans TO service_role;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "plans_public_read" ON public.plans;
CREATE POLICY "plans_public_read" ON public.plans FOR SELECT
  TO anon, authenticated USING (active = true);
DROP TRIGGER IF EXISTS trg_plans_touch ON public.plans;
CREATE TRIGGER trg_plans_touch BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

INSERT INTO public.plans (code, name, price_ngn, price_usd, seats_limit, domains_limit, features, sort_order)
VALUES
  ('starter','Starter',15000,10,5,1,'{"support":"community"}',10),
  ('growth','Growth',60000,40,25,3,'{"support":"email"}',20),
  ('scale','Scale',200000,140,100,10,'{"support":"priority"}',30),
  ('enterprise','Enterprise',0,0,NULL,NULL,'{"support":"dedicated","sso":true}',40)
ON CONFLICT (code) DO NOTHING;

-- ---------- 9. INCOMING / OUTGOING MESSAGES ----------
CREATE TABLE IF NOT EXISTS public.incoming_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  message_id text,
  from_addr text NOT NULL,
  to_addr text NOT NULL,
  size_bytes integer,
  spam_score numeric,
  received_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS incoming_messages_org_time
  ON public.incoming_messages (organization_id, received_at DESC);
GRANT SELECT ON public.incoming_messages TO authenticated;
GRANT ALL ON public.incoming_messages TO service_role;
ALTER TABLE public.incoming_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "incoming_msg_org_read" ON public.incoming_messages;
CREATE POLICY "incoming_msg_org_read" ON public.incoming_messages FOR SELECT
  TO authenticated USING (public.is_org_member(organization_id));

CREATE TABLE IF NOT EXISTS public.outgoing_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  message_id text,
  from_addr text NOT NULL,
  to_addr text NOT NULL,
  size_bytes integer,
  sent_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS outgoing_messages_org_time
  ON public.outgoing_messages (organization_id, sent_at DESC);
GRANT SELECT ON public.outgoing_messages TO authenticated;
GRANT ALL ON public.outgoing_messages TO service_role;
ALTER TABLE public.outgoing_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "outgoing_msg_org_read" ON public.outgoing_messages;
CREATE POLICY "outgoing_msg_org_read" ON public.outgoing_messages FOR SELECT
  TO authenticated USING (public.is_org_member(organization_id));

-- ---------- 10. ROUTING RULES ----------
CREATE TABLE IF NOT EXISTS public.routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  priority integer NOT NULL DEFAULT 100,
  match_pattern text NOT NULL,
  action text NOT NULL,
  target text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS routing_rules_org_pri
  ON public.routing_rules (organization_id, priority);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routing_rules TO authenticated;
GRANT ALL ON public.routing_rules TO service_role;
ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "routing_rules_org_read" ON public.routing_rules;
CREATE POLICY "routing_rules_org_read" ON public.routing_rules FOR SELECT
  TO authenticated USING (public.is_org_member(organization_id));
DROP POLICY IF EXISTS "routing_rules_admin_write" ON public.routing_rules;
CREATE POLICY "routing_rules_admin_write" ON public.routing_rules FOR ALL
  TO authenticated
  USING (public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner'))
  WITH CHECK (public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner'));
DROP TRIGGER IF EXISTS trg_routing_touch ON public.routing_rules;
CREATE TRIGGER trg_routing_touch BEFORE UPDATE ON public.routing_rules
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ---------- 11. DELIVERY STATUS ----------
CREATE TABLE IF NOT EXISTS public.delivery_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_log_id uuid,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  event text NOT NULL,
  at timestamptz NOT NULL DEFAULT now(),
  meta jsonb DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS delivery_status_email_log ON public.delivery_status (email_log_id);
CREATE INDEX IF NOT EXISTS delivery_status_org_time ON public.delivery_status (organization_id, at DESC);
GRANT SELECT ON public.delivery_status TO authenticated;
GRANT ALL ON public.delivery_status TO service_role;
ALTER TABLE public.delivery_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "delivery_status_org_read" ON public.delivery_status;
CREATE POLICY "delivery_status_org_read" ON public.delivery_status FOR SELECT
  TO authenticated USING (public.is_org_member(organization_id));

-- ---------- 12. ACTIVITY LOGS ----------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_user_id uuid,
  action text NOT NULL,
  target_type text,
  target_id text,
  meta jsonb DEFAULT '{}'::jsonb,
  at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS activity_logs_org_time
  ON public.activity_logs (organization_id, at DESC);
GRANT SELECT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activity_logs_org_read" ON public.activity_logs;
CREATE POLICY "activity_logs_org_read" ON public.activity_logs FOR SELECT
  TO authenticated USING (public.is_org_member(organization_id));

-- ---------- 13. AUDIT LOGS (append-only, service_role writes) ----------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  actor_user_id uuid,
  action text NOT NULL,
  ip text,
  ua text,
  meta jsonb DEFAULT '{}'::jsonb,
  at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_org_time
  ON public.audit_logs (organization_id, at DESC);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs FOR SELECT
  TO authenticated USING (
    organization_id IS NOT NULL AND (
      public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner')
    )
  );

-- ---------- 14. API KEYS ----------
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  prefix text NOT NULL,
  hash text NOT NULL,
  scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS api_keys_org_idx ON public.api_keys (organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS api_keys_prefix_unique ON public.api_keys (prefix);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "api_keys_admin_read" ON public.api_keys;
CREATE POLICY "api_keys_admin_read" ON public.api_keys FOR SELECT
  TO authenticated USING (
    public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner')
  );
DROP POLICY IF EXISTS "api_keys_admin_write" ON public.api_keys;
CREATE POLICY "api_keys_admin_write" ON public.api_keys FOR ALL
  TO authenticated
  USING (public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner'))
  WITH CHECK (public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner'));

-- ---------- 15. WEBHOOKS ----------
CREATE TABLE IF NOT EXISTS public.webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret_hash text NOT NULL,
  events text[] NOT NULL DEFAULT ARRAY[]::text[],
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS webhooks_org_idx ON public.webhooks (organization_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.webhooks TO authenticated;
GRANT ALL ON public.webhooks TO service_role;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "webhooks_admin_all" ON public.webhooks;
CREATE POLICY "webhooks_admin_all" ON public.webhooks FOR ALL
  TO authenticated
  USING (public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner'))
  WITH CHECK (public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner'));
DROP TRIGGER IF EXISTS trg_webhooks_touch ON public.webhooks;
CREATE TRIGGER trg_webhooks_touch BEFORE UPDATE ON public.webhooks
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  event text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz,
  response_status integer,
  response_body text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS webhook_deliveries_pending
  ON public.webhook_deliveries (next_attempt_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS webhook_deliveries_org_time
  ON public.webhook_deliveries (organization_id, created_at DESC);
GRANT SELECT ON public.webhook_deliveries TO authenticated;
GRANT ALL ON public.webhook_deliveries TO service_role;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "webhook_deliveries_admin_read" ON public.webhook_deliveries;
CREATE POLICY "webhook_deliveries_admin_read" ON public.webhook_deliveries FOR SELECT
  TO authenticated USING (
    public.has_org_role(organization_id, 'admin') OR public.has_org_role(organization_id, 'owner')
  );

-- ---------- 16. CONTACT MESSAGES (public form) ----------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_messages_insert_any" ON public.contact_messages;
CREATE POLICY "contact_messages_insert_any" ON public.contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (
    char_length(name) BETWEEN 1 AND 200 AND
    char_length(email) BETWEEN 3 AND 320 AND
    char_length(message) BETWEEN 1 AND 5000
  );

-- ---------- 17. HARDEN ORG POLICIES (idempotent adds) ----------
-- Owner-only delete on organizations
DROP POLICY IF EXISTS "orgs_owner_delete" ON public.organizations;
CREATE POLICY "orgs_owner_delete" ON public.organizations FOR DELETE
  TO authenticated USING (public.has_org_role(id, 'owner'));

-- ---------- 18. EMPLOYEE-USER TRIGGER (link user_id when a user with matching email accepts invite) ----------
-- (Handled in application code; no DB trigger needed here.)

-- =============================================================
-- END OF BATCH 1
-- =============================================================
