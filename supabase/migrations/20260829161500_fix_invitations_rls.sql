-- Migration: Secure employee_invitations RLS & prevent anonymous bulk harvesting
-- Date: 2026-08-29

-- 1. Drop dangerous anon SELECT and UPDATE policies
DROP POLICY IF EXISTS "public read active invite by token" ON public.employee_invitations;
DROP POLICY IF EXISTS "public mark opened" ON public.employee_invitations;

-- 2. Revoke table-level anon access to employee_invitations
REVOKE ALL ON public.employee_invitations FROM anon;

-- 3. Create secure, single-token lookup RPC function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_invitation_by_token(_token text)
RETURNS TABLE (
  id uuid,
  organization_id uuid,
  employee_id uuid,
  token text,
  sent_via text,
  sent_at timestamptz,
  opened_at timestamptz,
  accepted_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.organization_id,
    i.employee_id,
    i.token,
    i.sent_via,
    i.sent_at,
    i.opened_at,
    i.accepted_at,
    i.revoked_at,
    i.expires_at,
    i.created_at
  FROM public.employee_invitations i
  WHERE i.token = _token
    AND i.revoked_at IS NULL
    AND i.expires_at > now()
  LIMIT 1;
END;
$func$;

-- 4. Create secure open-marking RPC function
CREATE OR REPLACE FUNCTION public.mark_invitation_opened(_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
DECLARE
  v_updated boolean := false;
BEGIN
  UPDATE public.employee_invitations
  SET opened_at = COALESCE(opened_at, now())
  WHERE token = _token
    AND revoked_at IS NULL
    AND expires_at > now();
  
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$func$;

-- 5. Grant RPC execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_invitation_by_token(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mark_invitation_opened(text) TO anon, authenticated, service_role;
