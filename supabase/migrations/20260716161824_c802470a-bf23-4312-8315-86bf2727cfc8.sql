
-- ============ Empyre Homes demo organization ============
DO $$
DECLARE
  v_org uuid := '11111111-1111-1111-1111-111111111111';
  v_dom uuid := '22222222-2222-2222-2222-222222222222';
  v_e1  uuid := '33333333-3333-3333-3333-333333330001';
  v_e2  uuid := '33333333-3333-3333-3333-333333330002';
  v_e3  uuid := '33333333-3333-3333-3333-333333330003';
BEGIN
  INSERT INTO public.organizations (id, name, slug, primary_domain, industry, country, timezone, currency, onboarding_step, onboarding_completed_at)
  VALUES (v_org, 'Empyre Homes', 'empyre-homes', 'empyrehomes.com', 'Real Estate', 'NG', 'Africa/Lagos', 'NGN', 6, now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.domains (
    id, organization_id, domain_name, verification_status,
    mx_status, spf_status, dkim_status, dmarc_status,
    verified_at, last_checked_at
  ) VALUES (
    v_dom, v_org, 'empyrehomes.com', 'verified',
    'verified', 'verified', 'verified', 'verified',
    now() - interval '3 days', now() - interval '2 hours'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.employees (id, organization_id, full_name, company_email, personal_email, professional_email, status, job_title, department, added_at, connected_at)
  VALUES
    (v_e1, v_org, 'John Doe',    'john@empyrehomes.com',  'john.doe.demo@gmail.com',  'john@empyrehomes.com',  'active',       'Sales Manager', 'Sales',   now() - interval '20 days', now() - interval '19 days'),
    (v_e2, v_org, 'Mary Smith',  'mary@empyrehomes.com',  'mary.smith.demo@gmail.com','mary@empyrehomes.com',  'active',       'HR Manager',    'People',  now() - interval '18 days', now() - interval '17 days'),
    (v_e3, v_org, 'David James', 'david@empyrehomes.com', 'd.james.demo@gmail.com',   'david@empyrehomes.com', 'pending_auth', 'Support Lead',  'Support', now() - interval '4 days',  NULL)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.aliases (organization_id, employee_id, address, is_primary)
  VALUES
    (v_org, v_e1, 'john@empyrehomes.com',    true),
    (v_org, v_e1, 'sales@empyrehomes.com',   false),
    (v_org, v_e2, 'mary@empyrehomes.com',    true),
    (v_org, v_e2, 'hr@empyrehomes.com',      false),
    (v_org, v_e3, 'david@empyrehomes.com',   true),
    (v_org, v_e3, 'support@empyrehomes.com', false)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.gmail_connections (organization_id, employee_id, google_email, connected_at, last_health_check_at, health_status)
  VALUES
    (v_org, v_e1, 'john.doe.demo@gmail.com',   now() - interval '19 days', now() - interval '10 minutes', 'healthy'),
    (v_org, v_e2, 'mary.smith.demo@gmail.com', now() - interval '17 days', now() - interval '15 minutes', 'healthy')
  ON CONFLICT DO NOTHING;

  -- Sample email logs (last 24h + few older)
  INSERT INTO public.email_logs (organization_id, sender, receiver, subject, snippet, direction, status, timestamp)
  SELECT v_org,
    CASE (i % 3) WHEN 0 THEN 'john@empyrehomes.com' WHEN 1 THEN 'mary@empyrehomes.com' ELSE 'sales@empyrehomes.com' END,
    'lead' || i || '@example.com',
    CASE (i % 4) WHEN 0 THEN 'Property viewing confirmed' WHEN 1 THEN 'Re: Ikoyi apartment inquiry' WHEN 2 THEN 'Payment plan attached' ELSE 'Welcome to Empyre Homes' END,
    'Thanks for reaching out — attaching the details you requested.',
    'outgoing'::email_direction,
    CASE WHEN i % 17 = 0 THEN 'bounced'::email_status WHEN i % 11 = 0 THEN 'failed'::email_status ELSE 'delivered'::email_status END,
    now() - (i || ' hours')::interval
  FROM generate_series(1, 24) i;

  INSERT INTO public.email_logs (organization_id, sender, receiver, subject, snippet, direction, status, timestamp)
  SELECT v_org,
    'client' || i || '@example.com',
    CASE (i % 2) WHEN 0 THEN 'sales@empyrehomes.com' ELSE 'support@empyrehomes.com' END,
    CASE (i % 3) WHEN 0 THEN 'Question about 3-bedroom listing' WHEN 1 THEN 'Site visit request' ELSE 'Documents received' END,
    'Hi team, quick question about your recent listing.',
    'incoming'::email_direction, 'delivered'::email_status,
    now() - ((i * 2) || ' hours')::interval
  FROM generate_series(1, 18) i;

  INSERT INTO public.activity_logs (organization_id, action, target_type, target_id, meta, at)
  VALUES
    (v_org, 'domain.verified',      'domain',   v_dom::text, jsonb_build_object('domain', 'empyrehomes.com'),   now() - interval '3 days'),
    (v_org, 'employee.added',       'employee', v_e1::text,  jsonb_build_object('name', 'John Doe'),            now() - interval '20 days'),
    (v_org, 'employee.added',       'employee', v_e2::text,  jsonb_build_object('name', 'Mary Smith'),          now() - interval '18 days'),
    (v_org, 'gmail.connected',      'employee', v_e1::text,  jsonb_build_object('email', 'john.doe.demo@gmail.com'), now() - interval '19 days'),
    (v_org, 'gmail.connected',      'employee', v_e2::text,  jsonb_build_object('email', 'mary.smith.demo@gmail.com'), now() - interval '17 days'),
    (v_org, 'employee.added',       'employee', v_e3::text,  jsonb_build_object('name', 'David James'),         now() - interval '4 days'),
    (v_org, 'alias.created',        'alias',    NULL,        jsonb_build_object('address', 'support@empyrehomes.com'), now() - interval '2 days'),
    (v_org, 'email.received',       'email',    NULL,        jsonb_build_object('from', 'client4@example.com'), now() - interval '3 hours'),
    (v_org, 'email.sent',           'email',    NULL,        jsonb_build_object('to', 'lead1@example.com'),     now() - interval '1 hour');
END $$;

-- ============ Auto-join new signups to the demo org ============
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

  -- Auto-join everyone to Empyre Homes demo organization as owner
  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES ('11111111-1111-1111-1111-111111111111'::uuid, NEW.id, 'owner'::app_role)
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists on auth.users (Supabase may have set this up; recreate defensively)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: attach any EXISTING auth users to the demo org
INSERT INTO public.organization_members (organization_id, user_id, role)
SELECT '11111111-1111-1111-1111-111111111111'::uuid, u.id, 'owner'::app_role
FROM auth.users u
ON CONFLICT (organization_id, user_id) DO NOTHING;
