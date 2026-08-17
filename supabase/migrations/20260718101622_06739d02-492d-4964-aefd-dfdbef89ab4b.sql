ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'platform_admin';

CREATE POLICY "Workspace members can read brand assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'brand-assets'
  AND EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.user_id = auth.uid()
      AND (storage.foldername(name))[1] = om.organization_id::text
  )
);

CREATE POLICY "Workspace admins can upload brand assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'brand-assets'
  AND EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
      AND (storage.foldername(name))[1] = om.organization_id::text
  )
);

CREATE POLICY "Workspace admins can update brand assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'brand-assets'
  AND EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
      AND (storage.foldername(name))[1] = om.organization_id::text
  )
)
WITH CHECK (
  bucket_id = 'brand-assets'
  AND EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
      AND (storage.foldername(name))[1] = om.organization_id::text
  )
);

CREATE POLICY "Workspace admins can delete brand assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'brand-assets'
  AND EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
      AND (storage.foldername(name))[1] = om.organization_id::text
  )
);