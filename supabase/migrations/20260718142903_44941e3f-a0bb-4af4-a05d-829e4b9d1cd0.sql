
-- Helper: is_platform_admin
CREATE OR REPLACE FUNCTION public.is_platform_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'platform_admin'::app_role
  );
$$;

REVOKE ALL ON FUNCTION public.is_platform_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin(uuid) TO authenticated, service_role;

-- Update handle_new_user to auto-grant platform_admin to the super-admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Retro-grant if the super-admin email is already registered
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'platform_admin'::app_role FROM auth.users
WHERE lower(email) = 'lightorbinnovations@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Platform status checks (for public /status page)
CREATE TABLE IF NOT EXISTS public.platform_status_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component text NOT NULL,
  status text NOT NULL CHECK (status IN ('operational','degraded','partial_outage','major_outage')),
  latency_ms integer,
  detail text,
  checked_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.platform_status_checks TO anon, authenticated;
GRANT ALL ON public.platform_status_checks TO service_role;

ALTER TABLE public.platform_status_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read status history"
  ON public.platform_status_checks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_status_checks_component_time
  ON public.platform_status_checks (component, checked_at DESC);
