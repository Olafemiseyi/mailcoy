
-- Expand employee_state enum
ALTER TYPE employee_state ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE employee_state ADD VALUE IF NOT EXISTS 'opened';
ALTER TYPE employee_state ADD VALUE IF NOT EXISTS 'connected';
ALTER TYPE employee_state ADD VALUE IF NOT EXISTS 'suspended';
ALTER TYPE employee_state ADD VALUE IF NOT EXISTS 'inactive';
ALTER TYPE employee_state ADD VALUE IF NOT EXISTS 'deleted';

-- Invitations
CREATE TABLE IF NOT EXISTS public.employee_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  sent_via text,
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  accepted_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invites_org ON public.employee_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_invites_employee ON public.employee_invitations(employee_id);
CREATE INDEX IF NOT EXISTS idx_invites_token ON public.employee_invitations(token);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_invitations TO authenticated;
GRANT SELECT, UPDATE ON public.employee_invitations TO anon;
GRANT ALL ON public.employee_invitations TO service_role;
ALTER TABLE public.employee_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org members read invites" ON public.employee_invitations;
CREATE POLICY "org members read invites" ON public.employee_invitations FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS "org admins manage invites" ON public.employee_invitations;
CREATE POLICY "org admins manage invites" ON public.employee_invitations FOR ALL TO authenticated
  USING (public.has_org_role(organization_id,'owner'::app_role) OR public.has_org_role(organization_id,'admin'::app_role))
  WITH CHECK (public.has_org_role(organization_id,'owner'::app_role) OR public.has_org_role(organization_id,'admin'::app_role));

DROP POLICY IF EXISTS "public read active invite by token" ON public.employee_invitations;
CREATE POLICY "public read active invite by token" ON public.employee_invitations FOR SELECT TO anon
  USING (revoked_at IS NULL AND expires_at > now());

DROP POLICY IF EXISTS "public mark opened" ON public.employee_invitations;
CREATE POLICY "public mark opened" ON public.employee_invitations FOR UPDATE TO anon
  USING (revoked_at IS NULL AND expires_at > now())
  WITH CHECK (revoked_at IS NULL);

DROP TRIGGER IF EXISTS trg_invites_touch ON public.employee_invitations;
CREATE TRIGGER trg_invites_touch BEFORE UPDATE ON public.employee_invitations
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- SES / sending / signatures (future ready, empty)
CREATE TABLE IF NOT EXISTS public.ses_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain_id uuid NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  region text NOT NULL DEFAULT 'us-east-1',
  identity_status text NOT NULL DEFAULT 'pending',
  dkim_tokens text[] DEFAULT '{}',
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (domain_id, region)
);
GRANT SELECT ON public.ses_domains TO authenticated;
GRANT ALL ON public.ses_domains TO service_role;
ALTER TABLE public.ses_domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "org read ses_domains" ON public.ses_domains;
CREATE POLICY "org read ses_domains" ON public.ses_domains FOR SELECT TO authenticated USING (public.is_org_member(organization_id));

CREATE TABLE IF NOT EXISTS public.ses_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  access_key_id_ciphertext text NOT NULL,
  secret_access_key_ciphertext text NOT NULL,
  region text NOT NULL,
  configuration_set text,
  daily_quota int,
  send_rate int,
  reputation_score numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.ses_credentials TO service_role;
ALTER TABLE public.ses_credentials ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.sending_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  provider text NOT NULL,
  message_id text,
  from_address text,
  to_address text,
  subject text,
  status text NOT NULL,
  latency_ms int,
  smtp_response text,
  error text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sending_logs_org_time ON public.sending_logs(organization_id, created_at DESC);
GRANT SELECT ON public.sending_logs TO authenticated;
GRANT ALL ON public.sending_logs TO service_role;
ALTER TABLE public.sending_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "org read sending logs" ON public.sending_logs;
CREATE POLICY "org read sending logs" ON public.sending_logs FOR SELECT TO authenticated USING (public.is_org_member(organization_id));

CREATE TABLE IF NOT EXISTS public.ses_bounce_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sending_log_id uuid REFERENCES public.sending_logs(id) ON DELETE SET NULL,
  bounce_type text, bounce_subtype text, recipient text,
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ses_bounce_events TO authenticated;
GRANT ALL ON public.ses_bounce_events TO service_role;
ALTER TABLE public.ses_bounce_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "org read bounces" ON public.ses_bounce_events;
CREATE POLICY "org read bounces" ON public.ses_bounce_events FOR SELECT TO authenticated USING (public.is_org_member(organization_id));

CREATE TABLE IF NOT EXISTS public.ses_complaint_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sending_log_id uuid REFERENCES public.sending_logs(id) ON DELETE SET NULL,
  complaint_type text, recipient text,
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ses_complaint_events TO authenticated;
GRANT ALL ON public.ses_complaint_events TO service_role;
ALTER TABLE public.ses_complaint_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "org read complaints" ON public.ses_complaint_events;
CREATE POLICY "org read complaints" ON public.ses_complaint_events FOR SELECT TO authenticated USING (public.is_org_member(organization_id));

CREATE TABLE IF NOT EXISTS public.email_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  scope text NOT NULL DEFAULT 'global',
  scope_ref text,
  name text NOT NULL,
  html text NOT NULL,
  variables jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_signatures TO authenticated;
GRANT ALL ON public.email_signatures TO service_role;
ALTER TABLE public.email_signatures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "org read signatures" ON public.email_signatures;
CREATE POLICY "org read signatures" ON public.email_signatures FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));
DROP POLICY IF EXISTS "org admins manage signatures" ON public.email_signatures;
CREATE POLICY "org admins manage signatures" ON public.email_signatures FOR ALL TO authenticated
  USING (public.has_org_role(organization_id,'owner'::app_role) OR public.has_org_role(organization_id,'admin'::app_role))
  WITH CHECK (public.has_org_role(organization_id,'owner'::app_role) OR public.has_org_role(organization_id,'admin'::app_role));
