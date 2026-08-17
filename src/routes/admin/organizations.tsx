import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listAllOrganizations } from "@/lib/admin.functions";
import { Card } from "@/components/app/AppShell";
import { Search, X, ShieldCheck, AlertCircle, Users, Globe, CreditCard, ChevronRight, Activity } from "lucide-react";
import { motion } from "motion/react";

const opts = (search: string, plan: string, offset: number) =>
  queryOptions({
    queryKey: ["admin-orgs", search, plan, offset],
    queryFn: async () => listAllOrganizations({ data: { search: search || undefined, plan: plan || undefined, limit: 50, offset } }),
    staleTime: 15_000,
  });

export const Route = createFileRoute("/admin/organizations")({
  head: () => ({
    meta: [
      { title: "Organizations — Admin — Mailcoy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async ({ context }: any) => {
    await context.queryClient.ensureQueryData(opts("", "", 0));
  },
  component: AdminOrgs,
});

function AdminOrgs() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [offset, setOffset] = useState(0);
  const { data } = useSuspenseQuery(opts(search, plan, offset));
  
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  const getPlanBadge = (code: string | null, status: string | null) => {
    if (!code) return <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 text-[11px] font-medium">Free</span>;
    if (status === 'trialing') return <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">Trial</span>;
    if (status === 'past_due') return <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[11px] font-medium">Past Due</span>;
    return <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium uppercase tracking-wider">{code}</span>;
  };

  return (
    <div className="relative min-h-screen">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Organizations</h1>
        <p className="text-[13.5px] text-ink-3 mt-1">Manage and inspect every tenant on the platform.</p>
      </div>
      
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
            placeholder="Search by company name..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-line bg-background text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
        
        <select
          value={plan}
          onChange={(e) => { setPlan(e.target.value); setOffset(0); }}
          className="h-9 px-3 rounded-lg border border-line bg-background text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-ink-2"
        >
          <option value="">All Plans</option>
          <option value="free">Free Forever</option>
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
          <option value="scale">Scale</option>
          <option value="trialing">Free Trial</option>
          <option value="past_due">Past Due</option>
        </select>
      </div>

      <Card className="p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-ink-3 border-b border-line bg-slate-50/50 dark:bg-zinc-900/30">
                <th className="px-4 py-3 font-medium whitespace-nowrap">Organization</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Plan</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Domains</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Employees</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => {
                const hasVerifiedDomain = r.domains?.some((d: any) => d.verification_status === 'verified');
                return (
                  <tr 
                    key={r.id} 
                    className="border-b border-line/60 hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedOrg(r)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink flex items-center gap-2">
                        {r.name}
                      </div>
                      <div className="text-[11px] text-ink-3 mt-0.5">{r.industry ?? "No industry"}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getPlanBadge(r.plan_code, r.plan_status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-ink-2">{r.domain_count}</span>
                        {r.domain_count > 0 && (
                          hasVerifiedDomain ? 
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> : 
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-ink-2">
                        <Users className="h-3.5 w-3.5 text-ink-3" />
                        {r.employee_count}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-3 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight className="h-4 w-4 text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity inline-block" />
                    </td>
                  </tr>
                );
              })}
              {data.rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-3">No organizations match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="mt-4 flex items-center justify-between text-[12.5px] text-ink-3 pb-8">
        <span>Showing {data.rows.length} of {data.total}</span>
        <div className="flex gap-2">
          <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 50))} className="h-8 px-3 rounded-md border border-line disabled:opacity-40 hover:bg-surface transition-colors font-medium">Previous</button>
          <button disabled={offset + data.rows.length >= data.total} onClick={() => setOffset(offset + 50)} className="h-8 px-3 rounded-md border border-line disabled:opacity-40 hover:bg-surface transition-colors font-medium">Next</button>
        </div>
      </div>

      {/* Organization Details Drawer */}
      
        {selectedOrg && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setSelectedOrg(null)}
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-line">
                <div>
                  <h2 className="font-display text-lg font-bold">{selectedOrg.name}</h2>
                  <p className="text-xs text-ink-3 font-mono mt-1">{selectedOrg.slug}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrg(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors text-ink-3"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-line bg-slate-50/50 dark:bg-zinc-900/30 space-y-1">
                    <div className="flex items-center gap-2 text-ink-3 mb-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Plan</span>
                    </div>
                    <div>{getPlanBadge(selectedOrg.plan_code, selectedOrg.plan_status)}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-line bg-slate-50/50 dark:bg-zinc-900/30 space-y-1">
                    <div className="flex items-center gap-2 text-ink-3 mb-2">
                      <Activity className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Created</span>
                    </div>
                    <div className="text-[13px] font-medium text-ink">{new Date(selectedOrg.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-ink">Metadata</h3>
                  <div className="rounded-xl border border-line divide-y divide-line bg-white dark:bg-zinc-950">
                    <div className="flex justify-between p-3 text-[13px]">
                      <span className="text-ink-3">Industry</span>
                      <span className="font-medium">{selectedOrg.industry ?? "—"}</span>
                    </div>
                    <div className="flex justify-between p-3 text-[13px]">
                      <span className="text-ink-3">Country</span>
                      <span className="font-medium">{selectedOrg.country ?? "—"}</span>
                    </div>
                    <div className="flex justify-between p-3 text-[13px]">
                      <span className="text-ink-3">Primary Domain</span>
                      <span className="font-mono text-ink-2">{selectedOrg.primary_domain ?? "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Domains ({selectedOrg.domain_count})
                    </h3>
                  </div>
                  {selectedOrg.domains?.length > 0 ? (
                    <div className="rounded-xl border border-line divide-y divide-line">
                      {selectedOrg.domains.map((d: any) => (
                        <div key={d.id} className="flex items-center justify-between p-3 text-[13px]">
                          <span className="font-mono text-ink-2 truncate max-w-[180px]">{d.id}</span>
                          {d.verification_status === 'verified' ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                              <ShieldCheck className="h-3.5 w-3.5" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-medium">
                              <AlertCircle className="h-3.5 w-3.5" /> Pending
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-line border-dashed text-center text-[13px] text-ink-3 bg-slate-50/50 dark:bg-zinc-900/30">
                      No domains connected yet.
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Subscription & Plan Override
                    </h3>
                  </div>
                  <div className="p-4 rounded-xl border border-line bg-slate-50/50 dark:bg-zinc-900/30 space-y-3 text-[13px]">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-3">Current Plan:</span>
                      {getPlanBadge(selectedOrg.plan_code, selectedOrg.plan_status)}
                    </div>
                    <div className="flex gap-2">
                      <select
                        id="plan-override-select"
                        defaultValue={selectedOrg.plan_code || "starter"}
                        className="flex-1 h-9 rounded-md border border-line bg-background px-2.5 text-[12.5px] outline-none"
                      >
                        <option value="free">Free (5 seats)</option>
                        <option value="starter">Starter (25 seats)</option>
                        <option value="pro">Pro (100 seats)</option>
                        <option value="enterprise">Enterprise VIP (Unlimited)</option>
                      </select>
                      <button
                        onClick={async () => {
                          const sel = document.getElementById("plan-override-select") as HTMLSelectElement;
                          if (!sel) return;
                          try {
                            const { overrideOrgPlan } = await import("@/lib/admin.functions");
                            await overrideOrgPlan({
                              data: {
                                organizationId: selectedOrg.id,
                                planCode: sel.value as any,
                                status: "active",
                              },
                            });
                            alert(`Successfully upgraded ${selectedOrg.name} to ${sel.value.toUpperCase()}`);
                            window.location.reload();
                          } catch (e: any) {
                            alert(e.message || "Failed to override plan");
                          }
                        }}
                        className="px-3 h-9 rounded-md bg-primary text-primary-foreground font-medium text-[12px] hover:bg-primary-focus transition"
                      >
                        Apply Override
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                    <Users className="h-4 w-4" /> Employees
                  </h3>
                  <div className="p-4 rounded-xl border border-line bg-slate-50/50 dark:bg-zinc-900/30 flex justify-between items-center text-[13px]">
                    <span className="text-ink-3 font-medium">Total Provisioned Seats</span>
                    <span className="font-bold text-lg">{selectedOrg.employee_count}</span>
                  </div>
                </div>

              </div>
              
              <div className="p-6 border-t border-line bg-slate-50 dark:bg-zinc-950">
                <button
                  onClick={() => {
                    localStorage.setItem("mailcoy_impersonating_org_id", selectedOrg.id);
                    localStorage.setItem("mailcoy_impersonating_org_name", selectedOrg.name);
                    window.location.href = "/dashboard";
                  }}
                  className="w-full py-2.5 rounded-lg border border-line bg-white dark:bg-zinc-900 text-ink text-[13px] font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Impersonate Organization (Ghost Mode)
                </button>
              </div>
            </motion.div>
          </>
        )}
      
    </div>
  );
}
