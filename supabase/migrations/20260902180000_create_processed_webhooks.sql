-- Migration: 20260902180000_create_processed_webhooks.sql
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'resend',
  event_type TEXT,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  locked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_processed_webhooks_provider_event UNIQUE (provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_processed_webhooks_lookup 
ON public.processed_webhooks (provider, event_id);

CREATE INDEX IF NOT EXISTS idx_processed_webhooks_status 
ON public.processed_webhooks (status, locked_at);

CREATE INDEX IF NOT EXISTS idx_billing_events_relay_lookup 
ON public.billing_events (event_type, reference) 
WHERE event_type = 'relay.thread';

ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on processed_webhooks'
  ) THEN
    CREATE POLICY "Service role full access on processed_webhooks"
    ON public.processed_webhooks
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;
