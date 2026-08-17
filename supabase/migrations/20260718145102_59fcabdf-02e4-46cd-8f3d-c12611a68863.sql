GRANT SELECT ON public.platform_status_checks TO anon, authenticated;
GRANT ALL ON public.platform_status_checks TO service_role;
CREATE INDEX IF NOT EXISTS platform_status_checks_component_checked_idx
  ON public.platform_status_checks (component, checked_at DESC);