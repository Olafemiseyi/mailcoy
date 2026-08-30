import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions, useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { listAliases, createAlias, deleteAlias, updateAliasEmployee } from "@/lib/analytics.functions";
import { listEmployees } from "@/lib/employees.functions";
import { PageHeader, Card, Button, Input, Field, CustomSelect, ConfirmDeleteModal } from "@/components/app/AppShell";
import { Plus, Trash2, Lightbulb, X, Search, Pencil, Check, ChevronDown } from "lucide-react";
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

  type RawAlias = {
    id: string;
    address: string;
    is_primary: boolean;
    employee_id: string;
    employees?: { id: string; full_name: string; professional_email?: string } | null;
  };

  // Group aliases by address for Multi-Recipient Shared Inboxes
  const groupedAliases = useMemo(() => {
    const map = new Map<
      string,
      {
        address: string;
        is_primary: boolean;
        recipients: Array<{
          aliasId: string;
          employeeId: string;
          name: string;
          email?: string;
        }>;
      }
    >();

    for (const a of aliases as unknown as RawAlias[]) {
      const addr = a.address.toLowerCase();
      if (!map.has(addr)) {
        map.set(addr, {
          address: a.address,
          is_primary: a.is_primary,
          recipients: [],
        });
      }
      const item = map.get(addr)!;
      if (a.is_primary) item.is_primary = true;
      const empData = a.employees || (employees as Array<{ id: string; full_name: string; professional_email?: string }>).find((e) => e.id === a.employee_id);
      item.recipients.push({
        aliasId: a.id,
        employeeId: a.employee_id,
        name: empData?.full_name || "Unknown",
        email: empData?.professional_email,
      });
    }

    return Array.from(map.values());
  }, [aliases, employees]);

  const filteredAliases = groupedAliases.filter((group) => {
    const q = filterText.toLowerCase();
    const matchesAddr = group.address.toLowerCase().includes(q);
    const matchesEmp = group.recipients.some(
      (r) => r.name.toLowerCase().includes(q) || (r.email && r.email.toLowerCase().includes(q)),
    );
    return matchesAddr || matchesEmp;
  });

  const [addingToAddress, setAddingToAddress] = useState<string | null>(null);
  const [addMemberId, setAddMemberId] = useState<string>("");
  const [addingMember, setAddingMember] = useState(false);

  async function handleAddRecipient(targetAddress: string) {
    if (!addMemberId) return;
    setAddingMember(true);
    try {
      await create({ data: { address: targetAddress, employee_id: addMemberId } });
      await qc.invalidateQueries({ queryKey: ["aliases"] });
      setAddingToAddress(null);
      setAddMemberId("");
    } catch (err: any) {
      alert(err?.message || "Failed to add team member");
    } finally {
      setAddingMember(false);
    }
  }

  const suggestions = (suggestionsQ.data?.suggestions ?? []).filter(
    (s) => !dismissedSuggestions.has(s.local_part),
  );
  const empSuggestions = (suggestionsQ.data?.employee_suggestions ?? []).filter(
    (s) => !dismissedSuggestions.has(s.local_part),
  );
  const hasSuggestions = suggestions.length > 0 || empSuggestions.length > 0;

  return (
    <div>
      <PageHeader
        title="Shared Inboxes & Aliases"
        subtitle="Role-based addresses (sales@, support@, team@) that automatically fan out and route inbound emails to one or multiple team members."
        actions={
          <Button onClick={() => setOpen((v) => !v)}>
            <Plus className="h-4 w-4 mr-1" /> New shared alias
          </Button>
        }
      />

      {open && (
        <Card className="p-5 mb-6">
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <Field label="Alias / Shared Address">
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="sales@company.com"
                required
              />
            </Field>
            <Field label="Assign initial team member">
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
              <Button type="submit" disabled={busy || !employeeId}>
                {busy ? "Creating…" : "Create"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
            {err && <div className="md:col-span-3 text-[12.5px] text-danger">{err}</div>}
          </form>
        </Card>
      )}

      {/* Smart Suggestions Panel */}
      {!suggestionsQ.isLoading && hasSuggestions && (
        <Card className="mb-6 p-0 overflow-hidden border-emerald-500/20 bg-emerald-500/[0.03]">
          <button
            onClick={() =>
              setShowSuggestions((s) => {
                const next = !s;
                localStorage.setItem("mailcoy_aliases_suggestions", next ? "true" : "false");
                return next;
              })
            }
            className="w-full flex items-center justify-between gap-2 px-3.5 sm:px-5 py-3 border-b border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-colors text-left"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
              <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-[12.5px] sm:text-[13px] font-medium text-emerald-700 dark:text-emerald-300 truncate">
                <span className="sm:hidden">Suggested inboxes</span>
                <span className="hidden sm:inline">
                  Suggested shared inboxes for your workspace
                </span>
              </span>
            </div>
            <span className="shrink-0 flex items-center gap-1.5 text-[11px] sm:text-[11.5px] text-ink-3">
              <span>{suggestions.length + empSuggestions.length} ideas</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 shrink-0 ${showSuggestions ? "rotate-180" : ""}`}
              />
            </span>
          </button>

          {showSuggestions && (
            <>
              {/* Role-based suggestions */}
              {suggestions.length > 0 && (
                <div className="px-5 pt-4 pb-2">
                  <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-3">
                    Shared Role Inboxes
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions.map((s) => (
                      <div
                        key={s.local_part}
                        className="group relative flex items-start gap-3 rounded-xl border border-line bg-surface p-3 hover:border-emerald-400/40 hover:bg-emerald-500/[0.04] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <code className="text-[13px] font-mono font-medium text-emerald-700 dark:text-emerald-300">
                            {s.suggested_address ?? s.local_part}
                          </code>
                          <p className="mt-0.5 text-[11.5px] text-ink-3 leading-relaxed">
                            {s.reason}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => {
                              if (s.suggested_address && primaryEmployee) {
                                quickCreate.mutate({
                                  address: s.suggested_address,
                                  empId: primaryEmployee,
                                });
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
                            onClick={() =>
                              setDismissedSuggestions((prev) => new Set([...prev, s.local_part]))
                            }
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
                  <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-3">
                    Employee short-form aliases
                  </div>
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
                          <p className="mt-0.5 text-[11.5px] text-ink-3 leading-relaxed">
                            {s.reason}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => {
                              if (s.suggested_address) {
                                quickCreate.mutate({
                                  address: s.suggested_address,
                                  empId: s.employee_id,
                                });
                              }
                            }}
                            disabled={quickCreate.isPending}
                            className="inline-flex h-7 items-center gap-1 rounded-md bg-emerald-600 px-2.5 text-[12px] text-white hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
                          >
                            <Plus className="h-3 w-3" /> Add
                          </button>
                          <button
                            onClick={() =>
                              setDismissedSuggestions((prev) => new Set([...prev, s.local_part]))
                            }
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

      {/* Main Aliases List */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-line bg-surface-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search shared inbox or team member..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-line bg-background text-[13px] outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        {filteredAliases.length === 0 ? (
          <div className="p-10 text-center text-[13.5px] text-ink-3">
            {filterText
              ? "No matching shared inboxes found."
              : "No shared inboxes yet. Create role-based addresses (like sales@ or support@) to route emails to your team."}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filteredAliases.map((group) => {
              const isMulti = group.recipients.length > 1;
              const isAdding = addingToAddress === group.address;

              // Filter out employees who are already assigned to this alias
              const unassignedEmployees = (
                employees as Array<{ id: string; full_name: string }>
              ).filter((e) => !group.recipients.some((r) => r.employeeId === e.id));

              return (
                <li
                  key={group.address}
                  className="p-4 sm:p-5 flex flex-col gap-3 transition-colors hover:bg-ink/[0.01]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[14px] font-semibold text-ink truncate">
                        {group.address}
                      </span>
                      {group.is_primary ? (
                        <span className="text-[10.5px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                          Primary
                        </span>
                      ) : isMulti ? (
                        <span className="text-[10.5px] uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-medium">
                          Shared Inbox ({group.recipients.length} team members)
                        </span>
                      ) : (
                        <span className="text-[10.5px] uppercase tracking-wider bg-ink/[0.05] text-ink-3 px-2 py-0.5 rounded font-medium">
                          Single Routing
                        </span>
                      )}
                    </div>

                    {!group.is_primary && (
                      <button
                        type="button"
                        onClick={() =>
                          setPendingDelete({
                            id: group.recipients[0]?.aliasId || "",
                            address: group.address,
                          })
                        }
                        aria-label={`Delete shared inbox ${group.address}`}
                        className="self-end sm:self-auto text-ink-3 hover:text-danger p-1 rounded-md hover:bg-danger/10 transition-colors text-[12px] flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete alias
                      </button>
                    )}
                  </div>

                  {/* Team Member Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[12px] text-ink-3 mr-1">Routes to:</span>
                    {group.recipients.map((r) => (
                      <div
                        key={r.aliasId}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[12px] font-medium text-ink shadow-xs"
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>{r.name}</span>
                        {group.recipients.length > 1 && !group.is_primary && (
                          <button
                            type="button"
                            onClick={() => remove(r.aliasId)}
                            disabled={deleting}
                            className="text-ink-3 hover:text-danger transition-colors ml-0.5"
                            title={`Remove ${r.name} from ${group.address}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* "+ Add team member" to shared alias */}
                    {!group.is_primary && unassignedEmployees.length > 0 && (
                      <>
                        {isAdding ? (
                          <div className="inline-flex items-center gap-1.5 bg-ink/[0.02] p-1 rounded-lg border border-line">
                            <select
                              value={addMemberId}
                              onChange={(e) => setAddMemberId(e.target.value)}
                              className="h-7 rounded-md border border-line bg-background px-2 text-[12px] outline-none focus:border-primary"
                            >
                              <option value="">Select team member…</option>
                              {unassignedEmployees.map((e) => (
                                <option key={e.id} value={e.id}>
                                  {e.full_name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleAddRecipient(group.address)}
                              disabled={addingMember || !addMemberId}
                              className="h-7 px-2.5 rounded-md bg-primary text-primary-fg text-[12px] font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                              {addingMember ? "Adding…" : "Add"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAddingToAddress(null);
                                setAddMemberId("");
                              }}
                              className="h-7 px-2 text-ink-3 hover:text-ink text-[12px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAddingToAddress(group.address);
                              setAddMemberId("");
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-2.5 py-1 text-[12px] text-ink-3 hover:text-primary hover:border-primary transition-colors"
                          >
                            <Plus className="h-3 w-3" /> Add team member
                          </button>
                        )}
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
          title={`Delete ${pendingDelete.address}?`}
          description="Inbound emails to this alias will no longer be forwarded to assigned team members."
          busy={deleting}
          onConfirm={() => remove(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}