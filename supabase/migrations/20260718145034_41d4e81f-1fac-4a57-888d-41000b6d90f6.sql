
-- Ensure crypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure demo org exists (referenced by handle_new_user trigger)
INSERT INTO public.organizations (id, name, slug, primary_domain, industry, country)
VALUES ('11111111-1111-1111-1111-111111111111'::uuid,
        'Demo Organization', 'demo', 'demo.local', 'Software', 'NG')
ON CONFLICT (id) DO NOTHING;

-- Helper to insert an auth user idempotently with confirmed email + bcrypt password.
DO $$
DECLARE
  admin_id uuid;
  demo_id  uuid;
BEGIN
  -- Admin
  SELECT id INTO admin_id FROM auth.users WHERE lower(email) = 'lightorbinnovations@gmail.com';
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
      'lightorbinnovations@gmail.com', crypt('12345678', gen_salt('bf')),
      now(),
      jsonb_build_object('provider','email','providers', jsonb_build_array('email')),
      jsonb_build_object('full_name','LightOrb Admin'),
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id, admin_id::text,
            jsonb_build_object('sub', admin_id::text, 'email', 'lightorbinnovations@gmail.com', 'email_verified', true),
            'email', now(), now(), now());
  ELSE
    UPDATE auth.users SET encrypted_password = crypt('12345678', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()), updated_at = now()
      WHERE id = admin_id;
  END IF;

  -- Ensure profile + membership + platform_admin role even if trigger was skipped
  INSERT INTO public.profiles (id, full_name) VALUES (admin_id, 'LightOrb Admin')
    ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES ('11111111-1111-1111-1111-111111111111'::uuid, admin_id, 'owner'::app_role)
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'platform_admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

  -- Demo user
  SELECT id INTO demo_id FROM auth.users WHERE lower(email) = 'femi@gmail.com';
  IF demo_id IS NULL THEN
    demo_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', demo_id, 'authenticated', 'authenticated',
      'femi@gmail.com', crypt('12345678', gen_salt('bf')),
      now(),
      jsonb_build_object('provider','email','providers', jsonb_build_array('email')),
      jsonb_build_object('full_name','Femi Demo'),
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), demo_id, demo_id::text,
            jsonb_build_object('sub', demo_id::text, 'email', 'femi@gmail.com', 'email_verified', true),
            'email', now(), now(), now());
  ELSE
    UPDATE auth.users SET encrypted_password = crypt('12345678', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()), updated_at = now()
      WHERE id = demo_id;
  END IF;

  INSERT INTO public.profiles (id, full_name) VALUES (demo_id, 'Femi Demo')
    ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES ('11111111-1111-1111-1111-111111111111'::uuid, demo_id, 'owner'::app_role)
    ON CONFLICT (organization_id, user_id) DO NOTHING;
END $$;
