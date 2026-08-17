
-- 1. Remove overly broad anon policies on employee_invitations.
-- The public invite flow uses service-role reads (see invitations.functions.ts),
-- so anon SELECT/UPDATE via PostgREST is not needed and leaks tokens/IDs.
DROP POLICY IF EXISTS "public read active invite by token" ON public.employee_invitations;
DROP POLICY IF EXISTS "public mark opened" ON public.employee_invitations;

-- 2. app_user_connections: add owner-scoped policies (defense-in-depth
-- alongside service-role storage helpers).
CREATE POLICY "app_user_conn_owner_select" ON public.app_user_connections
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "app_user_conn_owner_modify" ON public.app_user_connections
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. gmail_connections: admins/owners of the org may manage rows.
CREATE POLICY "gmail_conn_admin_manage" ON public.gmail_connections
  FOR ALL TO authenticated
  USING (has_org_role(organization_id, 'owner'::app_role) OR has_org_role(organization_id, 'admin'::app_role))
  WITH CHECK (has_org_role(organization_id, 'owner'::app_role) OR has_org_role(organization_id, 'admin'::app_role));

-- 4. incoming/outgoing message logs: admins/owners may delete (retention);
-- inserts remain service-role only via the mail pipeline.
CREATE POLICY "incoming_msg_admin_delete" ON public.incoming_messages
  FOR DELETE TO authenticated
  USING (has_org_role(organization_id, 'owner'::app_role) OR has_org_role(organization_id, 'admin'::app_role));
CREATE POLICY "outgoing_msg_admin_delete" ON public.outgoing_messages
  FOR DELETE TO authenticated
  USING (has_org_role(organization_id, 'owner'::app_role) OR has_org_role(organization_id, 'admin'::app_role));

-- 5. ses_credentials: owners/admins may read encrypted metadata.
CREATE POLICY "ses_creds_admin_read" ON public.ses_credentials
  FOR SELECT TO authenticated
  USING (has_org_role(organization_id, 'owner'::app_role) OR has_org_role(organization_id, 'admin'::app_role));
CREATE POLICY "ses_creds_admin_manage" ON public.ses_credentials
  FOR ALL TO authenticated
  USING (has_org_role(organization_id, 'owner'::app_role) OR has_org_role(organization_id, 'admin'::app_role))
  WITH CHECK (has_org_role(organization_id, 'owner'::app_role) OR has_org_role(organization_id, 'admin'::app_role));

-- 6. Replace the always-true INSERT policy on organizations with a real check
-- that ties the row to the creating user.
DROP POLICY IF EXISTS "any user create org" ON public.organizations;
CREATE POLICY "auth users create own org" ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- 7. Restrict SECURITY DEFINER helpers so anon/PUBLIC can't call them via RPC.
-- RLS policy evaluation still works for authenticated because the helpers stay
-- executable to that role where needed.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_platform_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_org_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated;
