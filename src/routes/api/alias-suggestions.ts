import { createFileRoute } from "@tanstack/react-router";

// Common role-based alias patterns found in most businesses.
// Ordered by usage frequency / business importance.
const COMMON_ALIASES = [
  { address: "hello", label: "Hello / Welcome", reason: "First point of contact — great for inbound leads and general enquiries." },
  { address: "info", label: "Info", reason: "Standard address customers try first. Reduces missed messages." },
  { address: "support", label: "Support", reason: "Customers expect this for help requests. Boosts trust and response rates." },
  { address: "sales", label: "Sales", reason: "Routes sales enquiries to your team. Critical for revenue." },
  { address: "contact", label: "Contact", reason: "General contact alias — used widely on websites and business cards." },
  { address: "admin", label: "Admin", reason: "Internal and vendor communications often target admin@." },
  { address: "billing", label: "Billing", reason: "Finance and invoice queries — keep them separate from general mail." },
  { address: "careers", label: "Careers / HR", reason: "Recruiting and HR enquiries go here instead of an employee inbox." },
  { address: "press", label: "Press / Media", reason: "Journalists and media contacts expect a dedicated address." },
  { address: "noreply", label: "No-reply", reason: "Use for transactional system emails to set clear reply expectations." },
  { address: "newsletter", label: "Newsletter", reason: "Dedicate an address for outbound marketing campaigns." },
  { address: "legal", label: "Legal", reason: "Contracts, NDAs, and legal notices should go to a controlled mailbox." },
  { address: "partners", label: "Partners", reason: "Dedicated inbox for partnership and vendor discussions." },
  { address: "security", label: "Security", reason: "Responsible disclosure and security reports." },
  { address: "privacy", label: "Privacy / DPO", reason: "GDPR and privacy requests — legally required in many jurisdictions." },
];

export const Route = createFileRoute("/api/alias-suggestions")({
  server: {
    handlers: {
      GET: async ({ request }: any) => {
        // Authenticate + get org context
        const authHeader = request.headers.get("Authorization") ?? "";
        const token = authHeader.replace(/^Bearer\s+/i, "");
        if (!token) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { createClient } = await import("@supabase/supabase-js");
        const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const anonKey =
          process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!url || !anonKey) {
          return Response.json({ error: "Supabase not configured" }, { status: 500 });
        }

        const supabase = createClient(url, anonKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false },
        });

        // Get user
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get org membership
        const { data: membership } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!membership) {
          return Response.json({ suggestions: [] });
        }

        const orgId = membership.organization_id;

        // Fetch existing aliases and verified domains in parallel
        const [{ data: existingAliases }, { data: domains }, { data: employees }] = await Promise.all([
          supabase
            .from("aliases")
            .select("address")
            .eq("organization_id", orgId),
          supabase
            .from("domains")
            .select("domain_name")
            .eq("organization_id", orgId)
            .eq("verification_status", "verified"),
          supabase
            .from("employees")
            .select("id, full_name, professional_email, job_title, department, status")
            .eq("organization_id", orgId)
            .is("deleted_at", null)
            .eq("status", "active"),
        ]);

        const existingLocal = new Set(
          (existingAliases ?? []).map((a) => {
            const parts = a.address.split("@");
            return parts[0]?.toLowerCase() ?? "";
          })
        );

        const primaryDomain = (domains ?? [])[0]?.domain_name ?? null;

        // Score each common alias pattern
        const suggestions = COMMON_ALIASES
          .filter((alias) => !existingLocal.has(alias.address))
          .map((alias) => ({
            local_part: alias.address,
            label: alias.label,
            reason: alias.reason,
            suggested_address: primaryDomain ? `${alias.address}@${primaryDomain}` : null,
          }))
          .slice(0, 8); // top 8 suggestions

        // Also generate name-based suggestions for active employees
        // who don't yet have any alias
        const empSuggestions: Array<{
          local_part: string;
          label: string;
          reason: string;
          suggested_address: string | null;
          employee_id: string;
        }> = [];

        for (const emp of (employees ?? [])) {
          const name = (emp as { full_name?: string | null }).full_name ?? "";
          const email = (emp as { professional_email?: string | null }).professional_email ?? "";
          const id = (emp as { id: string }).id;

          if (!name || !primaryDomain) continue;

          // Check if they already have an alias
          const hasAlias = (existingAliases ?? []).some((a) => a.address !== email && (existingAliases ?? []).some((b) => b.address.includes(id)));

          if (!hasAlias) {
            const firstName = name.split(" ")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
            const lastName = name.split(" ").slice(-1)[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
            if (firstName && lastName && firstName !== lastName) {
              const shortAlias = `${firstName}.${lastName}`;
              if (!existingLocal.has(shortAlias)) {
                empSuggestions.push({
                  local_part: shortAlias,
                  label: `${name} (Short address)`,
                  reason: `Professional short-form alias for ${name} — easier to share on business cards.`,
                  suggested_address: `${shortAlias}@${primaryDomain}`,
                  employee_id: id,
                });
              }
            }
          }
        }

        return Response.json({
          suggestions,
          employee_suggestions: empSuggestions.slice(0, 4),
          primary_domain: primaryDomain,
        });
      },
    },
  },
});
