
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS company_signature text,
  ADD COLUMN IF NOT EXISTS catchall_mode text NOT NULL DEFAULT 'reject',
  ADD COLUMN IF NOT EXISTS catchall_forward_to text;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'settings_catchall_mode_check') THEN
    ALTER TABLE public.settings ADD CONSTRAINT settings_catchall_mode_check
      CHECK (catchall_mode IN ('receive','reject','forward'));
  END IF;
END $$;

-- Ensure a settings row exists for the demo org
INSERT INTO public.settings (organization_id) VALUES ('11111111-1111-1111-1111-111111111111')
ON CONFLICT (organization_id) DO NOTHING;

UPDATE public.settings
SET company_signature = 'Empyre Homes — Real Estate Made Simple\n123 Marina Ave, Lagos, NG\nempyrehomes.com',
    catchall_mode = 'forward',
    catchall_forward_to = 'support@empyrehomes.com'
WHERE organization_id = '11111111-1111-1111-1111-111111111111';
