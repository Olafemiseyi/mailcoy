
-- =========================================================
-- Enums
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('owner','admin','member');
CREATE TYPE public.verification_state AS ENUM ('pending','verified','failed');
CREATE TYPE public.employee_state AS ENUM ('active','pending_auth','invited');
CREATE TYPE public.email_direction AS ENUM ('incoming','outgoing');
CREATE TYPE public.email_status AS ENUM ('routed','delivered','sent','failed','bounced');
CREATE TYPE public.subscription_status AS ENUM ('trialing','active','past_due','canceled','inactive');

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- =========================================================
-- organizations
-- =========================================================
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  primary_domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- organization_members
-- =========================================================
CREATE TABLE public.organization_members (
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT ALL ON public.organization_members TO service_role;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Security definer helper: is caller a member of an org? (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_org_member(_org UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = _org AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(_org UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = _org AND user_id = auth.uid() AND role = _role
  );
$$;

-- organization_members policies
CREATE POLICY "members see own org rows" ON public.organization_members
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_org_member(organization_id));
CREATE POLICY "self insert membership" ON public.organization_members
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "owners manage members" ON public.organization_members
  FOR UPDATE TO authenticated USING (public.has_org_role(organization_id,'owner')) WITH CHECK (public.has_org_role(organization_id,'owner'));
CREATE POLICY "owners delete members" ON public.organization_members
  FOR DELETE TO authenticated USING (public.has_org_role(organization_id,'owner'));

-- organizations policies (use helper)
CREATE POLICY "members read org" ON public.organizations
  FOR SELECT TO authenticated USING (public.is_org_member(id));
CREATE POLICY "any user create org" ON public.organizations
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "owners update org" ON public.organizations
  FOR UPDATE TO authenticated USING (public.has_org_role(id,'owner')) WITH CHECK (public.has_org_role(id,'owner'));
CREATE POLICY "owners delete org" ON public.organizations
  FOR DELETE TO authenticated USING (public.has_org_role(id,'owner'));

-- =========================================================
-- user_roles (global app roles, standard pattern)
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- =========================================================
-- domains
-- =========================================================
CREATE TABLE public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL UNIQUE,
  verification_status public.verification_state NOT NULL DEFAULT 'pending',
  verification_token TEXT,
  verification_method TEXT DEFAULT 'dns',
  txt_record_key TEXT,
  txt_record_value TEXT,
  spf_value TEXT,
  dkim_selector TEXT DEFAULT 'lightorb',
  dkim_value TEXT,
  mx_status public.verification_state NOT NULL DEFAULT 'pending',
  spf_status public.verification_state NOT NULL DEFAULT 'pending',
  dkim_status public.verification_state NOT NULL DEFAULT 'pending',
  dmarc_status public.verification_state NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  verification_errors TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.domains (organization_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domains TO authenticated;
GRANT ALL ON public.domains TO service_role;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members manage domains" ON public.domains
  FOR ALL TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));

-- =========================================================
-- employees
-- =========================================================
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  personal_email TEXT NOT NULL,
  status public.employee_state NOT NULL DEFAULT 'pending_auth',
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.employees (organization_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members manage employees" ON public.employees
  FOR ALL TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));

-- =========================================================
-- email_logs
-- =========================================================
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  receiver TEXT NOT NULL,
  subject TEXT,
  snippet TEXT,
  direction public.email_direction NOT NULL,
  status public.email_status NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.email_logs (organization_id, timestamp DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_logs TO authenticated;
GRANT ALL ON public.email_logs TO service_role;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members manage logs" ON public.email_logs
  FOR ALL TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));

-- =========================================================
-- settings
-- =========================================================
CREATE TABLE public.settings (
  organization_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  routing_active BOOLEAN NOT NULL DEFAULT true,
  notify_email BOOLEAN NOT NULL DEFAULT true,
  notify_digest BOOLEAN NOT NULL DEFAULT false,
  security_mfa BOOLEAN NOT NULL DEFAULT false,
  dkim_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members manage settings" ON public.settings
  FOR ALL TO authenticated USING (public.is_org_member(organization_id)) WITH CHECK (public.is_org_member(organization_id));

-- =========================================================
-- subscriptions
-- =========================================================
CREATE TABLE public.subscriptions (
  organization_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'Starter',
  status public.subscription_status NOT NULL DEFAULT 'trialing',
  trial_end TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days'),
  renewal_date TIMESTAMPTZ DEFAULT (now() + INTERVAL '44 days'),
  max_employees INT NOT NULL DEFAULT 15,
  max_aliases INT NOT NULL DEFAULT 30,
  max_domains INT NOT NULL DEFAULT 1,
  storage_gb INT NOT NULL DEFAULT 5,
  api_limit_monthly INT NOT NULL DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members read subscription" ON public.subscriptions
  FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "owners update subscription" ON public.subscriptions
  FOR UPDATE TO authenticated USING (public.has_org_role(organization_id,'owner')) WITH CHECK (public.has_org_role(organization_id,'owner'));
CREATE POLICY "org members insert subscription" ON public.subscriptions
  FOR INSERT TO authenticated WITH CHECK (public.is_org_member(organization_id));

-- =========================================================
-- updated_at trigger helper
-- =========================================================
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_orgs_touch BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_domains_touch BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_employees_touch BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_settings_touch BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_subs_touch BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- =========================================================
-- handle_new_user: create profile on signup
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
