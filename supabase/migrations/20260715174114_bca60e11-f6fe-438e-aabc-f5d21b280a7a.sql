
-- 1. Extend subscriptions with Paystack billing fields
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS provider_reference text UNIQUE,
  ADD COLUMN IF NOT EXISTS plan_code text,
  ADD COLUMN IF NOT EXISTS amount_kobo bigint,
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz;

-- 2. Billing events (raw webhook log)
CREATE TABLE IF NOT EXISTS public.billing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  provider text NOT NULL,
  event_type text NOT NULL,
  reference text,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'received',
  received_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.billing_events TO authenticated;
GRANT ALL ON public.billing_events TO service_role;

ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read own org billing events"
  ON public.billing_events FOR SELECT
  TO authenticated
  USING (
    organization_id IS NOT NULL
    AND public.has_org_role(organization_id, 'admin'::app_role)
  );

CREATE INDEX IF NOT EXISTS billing_events_org_received_idx
  ON public.billing_events (organization_id, received_at DESC);

-- 3. Enable scheduling extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
