import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions, useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listAliases, createAlias, deleteAlias, updateAliasEmployee } from "@/lib/analytics.functions";
import { listEmployees } from "@/lib/employees.functions";
import { PageHeader, Card, Button, Input, Field, CustomSelect, ConfirmDeleteModal } from "@/components/app/AppShell";
import { Plus, Trash2, Sparkles, X, Search, Pencil, Check, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const aliasesOpts = queryOptions({ queryKey: ["aliases"], queryFn: async () => listAliases(), staleTime: 20_000 });
const empOpts = queryOptions({ queryKey: ["employees"], queryFn: async () => listEmployees(), staleTime: 30_000 });

export const Route = createFileRoute("/_authenticated/_shell/aliases")({
  head: () => ({ meta: [{ title: "Aliases — Mailcoy" }] }),
  loader: async ({ context }: any) => {
    await Promise.all([
      context.queryClient.ensureQueryData(aliasesOpts),
      context.queryClient.ensureQueryData(empOpts),
    ]);
  },
  component: AliasesRoute,
});

type Suggestion = {
  local_part: string;
  label: string;
  reason: string;
  suggested_address: string | null;
};

type EmpSuggestion = Suggestion & { employee_id: string };

function useSuggestions() {
  return useQuery({
    queryKey: ["alias-suggestions"],
    queryFn: async (): Promise<{
      suggestions: Suggestion[];
      employee_suggestions: EmpSuggestion[];
      primary_domain: string | null;
    }> => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? "";
      const res = await fetch("/api/alias-suggestions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load suggestions");
      return res.json();
    },
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

function AliasesRoute() {
  const qc = useQueryClient();
  const { data: aliases } = useSuspenseQuery(aliasesOpts);
  const { data: employees } = useSuspenseQuery(empOpts);
  const create = useServerFn(createAlias);
  const del = useServerFn(deleteAlias);
  const updateEmp = useServerFn(updateAliasEmployee);
  const suggestionsQ = useSuggestions();

  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("mailcoy_aliases_suggestions") === "true";
  });
  const [address, setAddress] = useState("");
  const [employeeId, setEmployeeId] = useState<string>((employees[0] as { id?: string })?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<{ id: string; address: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmployeeId, setEditEmployeeId] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await create({ data: { address, employee_id: employeeId } });
      await qc.invalidateQueries({ queryKey: ["aliases"] });
      await qc.invalidateQueries({ queryKey: ["alias-suggestions"] });
      setAddress("");
      setOpen(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setDeleting(true);
    try {
      await del({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["aliases"] });
      await qc.invalidateQueries({ queryKey: ["alias-suggestions"] });
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  const quickCreate = useMutation({
    mutationFn: async ({ address, empId }: { address: string; empId: string }) => {
      await create({ data: { address, employee_id: empId } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["aliases"] });
      qc.invalidateQueries({ queryKey: ["alias-suggestions"] });
    },
  });

  const empName = (id: string) =>
    (employees as Array<{ id: string; full_name: string }>).find((e) => e.id === id)?.full_name ?? "—";

  const primaryEmployee = (employees[0] as { id?: string })?.id ?? "";

  type AliasRow = { id: string; address: string; is_primary: boolean; employee_id: string };
  const filteredAliases = (aliases as unknown as AliasRow[]).filter((a) => {
    const emp = empName(a.employee_id).toLowerCase();
    const q = filterText.toLowerCase();
    return a.address.toLowerCase().includes(q) || emp.includes(q);
  });

  async function saveEmployee(id: string) {
    if (!editEmployeeId) return;
    setSavingId(id);
    try {
      await updateEmp({ data: { id, employee_id: editEmployeeId } });
      await qc.invalidateQueries({ queryKey: ["aliases"] });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  }

  const suggestions = (suggestionsQ.data?.suggestions ?? []).filter(
    (s) => !dismissedSuggestions.has(s.local_part)
  );
  const empSuggestions = (suggestionsQ.data?.employee_suggestions ?? []).filter(
    (s) => !dismissedSuggestions.has(s.local_part)
  );
  const hasSuggestions = suggestions.length > 0 || empSuggestions.length > 0;

  return (
    <div>
      <PageHeader
        title="Aliases"
        subtitle="Temporary and role-based addresses like sales@, support@, or promo@ that route to real employees."
        actions={<Button onClick={() => setOpen((v) => !v)}><Plus className="h-4 w-4 mr-1" /> New alias</Button>}
      />

      {open && (
        <Card className="p-5 mb-6">
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <Field label="Address">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="promo@company.com" required />
            </Field>
            <Field label="Routes to employee">
              <CustomSelect
                options={(employees as Array<{ id: string; full_name: string }>).map((e) => ({
                  value: e.id,
                  label: e.full_name,
                }))}
                value={employeeId}
                placeholder="Select employee…"
                onChange={(val) => setEmployeeId(val)}
              />
            </Field>
            <div className="flex gap-2">
              <Button type="submit" disabled={busy || !employeeId}>{busy ? "Creating…" : "Create"}</Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
            {err && <div className="md:col-span-3 text-[12.5px] text-danger">{err}</div>}
          </form>
        </Card>
      )}

      {/* Smart Suggestions Panel */}
      {!suggestionsQ.isLoading && hasSuggestions && (
        <Card className="mb-6 p-0 overflow-hidden border-emerald-500/20 bg-emerald-500/[0.03]">
          <button
            onClick={() => setShowSuggestions((s) => {
              const next = !s;
              localStorage.setItem("mailcoy_aliases_suggestions", next ? "true" : "false");
              return next;
            })}
            className="w-full flex items-center gap-2 px-5 py-3 border-b border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-colors"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[13px] font-medium text-emerald-700 dark:text-emerald-300">
              Suggested aliases for your workspace
            </span>
            <span className="ml-auto flex items-center gap-2 text-[11.5px] text-ink-3">
              {suggestions.length + empSuggestions.length} ideas
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showSuggestions ? "rotate-180" : ""}`} />
            </span>
          </button>

          {showSuggestions && (
            <>

          {/* Role-based suggestions */}
          {suggestions.length > 0 && (
            <div className="px-5 pt-4 pb-2">
              <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-3">Role-based</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((s) => (
                  <div
                    key={s.local_part}
                    className="group relative flex items-start gap-3 rounded-xl border border-line bg-surface p-3 hover:border-emerald-400/40 hover:bg-emerald-500/[0.04] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <code className="text-[13px] font-mono font-medium text-emerald-700 dark:text-emerald-300">
                          {s.suggested_address ?? s.local_part}
                        </code>
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-ink-3 leading-relaxed">{s.reason}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => {
                          if (s.suggested_address && primaryEmployee) {
                            quickCreate.mutate({ address: s.suggested_address, empId: primaryEmployee });
                          } else {
                            setAddress(s.suggested_address ?? `${s.local_part}@`);
                            setOpen(true);
                          }
                        }}
                        disabled={quickCreate.isPending}
                        className="inline-flex h-7 items-center gap-1 rounded-md bg-emerald-600 px-2.5 text-[12px] text-white hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                      <button
                        onClick={() => setDismissedSuggestions((prev) => new Set([...prev, s.local_part]))}
                        className="inline-flex h-7 items-center justify-center rounded-md text-ink-3 hover:bg-ink/[0.05]"
                        title="Dismiss"
                        aria-label="Dismiss suggestion"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employee-specific suggestions */}
          {empSuggestions.length > 0 && (
            <div className="px-5 pt-3 pb-4">
              <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-3">Employee short-form</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {empSuggestions.map((s) => (
                  <div
                    key={s.local_part}
                    className="group relative flex items-start gap-3 rounded-xl border border-line bg-surface p-3 hover:border-emerald-400/40 hover:bg-emerald-500/[0.04] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <code className="text-[13px] font-mono font-medium text-emerald-700 dark:text-emerald-300">
                        {s.suggested_address ?? s.local_part}
                      </code>
                      <p className="mt-0.5 text-[11.5px] text-ink-3 leading-relaxed">{s.reason}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => {
                          if (s.suggested_address) {
                            quickCreate.mutate({ address: s.suggested_address, empId: s.employee_id });
                          }
                        }}
                        disabled={quickCreate.isPending}
                        className="inline-flex h-7 items-center gap-1 rounded-md bg-emerald-600 px-2.5 text-[12px] text-white hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                      <button
                        onClick={() => setDismissedSuggestions((prev) => new Set([...prev, s.local_part]))}
                        className="inline-flex h-7 items-center justify-center rounded-md text-ink-3 hover:bg-ink/[0.05]"
                        title="Dismiss"
                        aria-label="Dismiss suggestion"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>
          )}
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-line bg-surface-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search address or employee..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-line bg-background text-[13px] outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        {filteredAliases.length === 0 ? (
          <div className="p-10 text-center text-[13.5px] text-ink-3">
            {filterText ? "No matching aliases found." : "No aliases yet. Create role-based addresses to route inbound mail flexibly."}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filteredAliases.map((row) => {
              return (
                <li key={row.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[13.5px] truncate">{row.address}</div>
                    <div className="text-[12px] text-ink-3 mt-0.5">
                      {row.is_primary ? (
                        <span>Primary · routes to {empName(row.employee_id)}</span>
                      ) : editingId === row.id ? (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="shrink-0 text-ink-2">Alias · routes to</span>
                          <select
                            value={editEmployeeId}
                            onChange={(e) => setEditEmployeeId(e.target.value)}
                            className="h-7 rounded-md border border-line bg-background px-2 text-[12px] outline-none focus:border-primary max-w-[200px]"
                            disabled={savingId === row.id}
                          >
                            {(employees as Array<{ id: string; full_name: string }>).map((e) => (
                              <option key={e.id} value={e.id}>{e.full_name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span>Alias · routes to {empName(row.employee_id)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto max-w-full mt-2 sm:mt-0">
                    {editingId === row.id ? (
                      <>
                        <button
                          onClick={() => saveEmployee(row.id)}
                          disabled={savingId === row.id || editEmployeeId === row.employee_id}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] text-primary-fg hover:bg-primary/90 disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={savingId === row.id}
                          className="inline-flex h-8 items-center justify-center rounded-md px-3 text-[12px] text-ink-2 hover:bg-ink/[0.05]"
                        >
                          Cancel
                        </button>
                      </>
                    ) : !row.is_primary && (
                      <>
                        <button
                          onClick={() => { setEditingId(row.id); setEditEmployeeId(row.employee_id); }}
                          aria-label="Edit routing"
                          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] text-ink-3 hover:text-ink hover:bg-ink/[0.05] transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setPendingDelete({ id: row.id, address: row.address })}
                          aria-label="Delete alias"
                          className="grid h-8 w-8 place-items-center rounded-md text-ink-3 hover:text-danger hover:bg-danger/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {pendingDelete && (
        <ConfirmDeleteModal
          title="Delete alias?"
          description={`${pendingDelete.address} will be permanently removed.`}
          busy={deleting}
          onConfirm={() => remove(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}