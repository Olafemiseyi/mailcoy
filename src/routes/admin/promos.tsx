import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  listPromoCodes, createPromoCode, updatePromoCode, deletePromoCode,
  type PromoCode,
} from "@/lib/promo.functions";
import { Card, Button, Input, Field } from "@/components/app/AppShell";
import { Plus, Pencil, Trash2, Tag, ToggleLeft, ToggleRight, X, AlertCircle, CheckCircle2, Infinity } from "lucide-react";

const promoOpts = queryOptions({
  queryKey: ["admin-promo-codes"],
  queryFn: async () => listPromoCodes(),
  staleTime: 10_000,
});

export const Route = createFileRoute("/admin/promos")({
  head: () => ({ meta: [{ title: "Promo Codes — Admin" }] }),
  component: AdminPromosPage,
});

const EMPTY_FORM = {
  code: "",
  description: "",
  discount_pct: 20,
  max_uses: 100,
  duration: "once" as "once" | "forever",
  is_active: true,
  expires_at: "",
};

function AdminPromosPage() {
  const qc = useQueryClient();
  const { data: codes = [], isLoading } = useQuery(promoOpts);

  const createFn = useServerFn(createPromoCode);
  const updateFn = useServerFn(updatePromoCode);
  const deleteFn = useServerFn(deletePromoCode);

  const [modal, setModal] = useState<null | "create" | PromoCode>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PromoCode | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setErr(null);
    setModal("create");
  }

  function openEdit(p: PromoCode) {
    setForm({
      code: p.code,
      description: p.description ?? "",
      discount_pct: p.discount_pct,
      max_uses: p.max_uses,
      duration: p.duration,
      is_active: p.is_active,
      expires_at: p.expires_at ? p.expires_at.slice(0, 10) : "",
    });
    setErr(null);
    setModal(p);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description || undefined,
        discount_pct: form.discount_pct,
        max_uses: form.max_uses,
        duration: form.duration,
        is_active: form.is_active,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : undefined,
      };
      if (modal === "create") {
        await createFn({ data: payload });
      } else if (modal && typeof modal === "object") {
        await updateFn({ data: { id: modal.id, ...payload } });
      }
      await qc.invalidateQueries({ queryKey: ["admin-promo-codes"] });
      setModal(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteFn({ data: { id: pendingDelete.id } });
      await qc.invalidateQueries({ queryKey: ["admin-promo-codes"] });
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  async function toggleActive(p: PromoCode) {
    await updateFn({ data: { id: p.id, is_active: !p.is_active } });
    await qc.invalidateQueries({ queryKey: ["admin-promo-codes"] });
  }

  const totalRedemptions = codes.reduce((s, c) => s + c.current_uses, 0);
  const activeCodes = codes.filter((c) => c.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Promo Codes</h1>
          <p className="mt-1 text-[13.5px] text-ink-3">Create and manage discount codes for marketing campaigns.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Create Code
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total codes", value: codes.length },
          { label: "Active codes", value: activeCodes },
          { label: "Total redemptions", value: totalRedemptions },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-ink-4">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-bold text-ink">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[13px] text-ink-3">Loading codes…</div>
        ) : codes.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center">
              <Tag className="h-6 w-6 text-ink-3" />
            </div>
            <p className="text-[13.5px] text-ink-3">No promo codes yet. Create your first one to start a campaign.</p>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" /> Create Code</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
                  <th className="text-left px-5 py-3 font-medium">Code</th>
                  <th className="text-left px-5 py-3 font-medium">Discount</th>
                  <th className="text-left px-5 py-3 font-medium">Duration</th>
                  <th className="text-left px-5 py-3 font-medium">Usage</th>
                  <th className="text-left px-5 py-3 font-medium">Expires</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {codes.map((p) => {
                  const usagePct = p.max_uses > 0 ? Math.min(100, (p.current_uses / p.max_uses) * 100) : 0;
                  const isExhausted = p.max_uses > 0 && p.current_uses >= p.max_uses;
                  const isExpired = p.expires_at && new Date(p.expires_at) < new Date();
                  return (
                    <tr key={p.id} className="hover:bg-ink/[0.01]">
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold bg-ink/[0.05] px-2 py-0.5 rounded-md">
                          <Tag className="h-3 w-3 text-ink-3" /> {p.code}
                        </span>
                        {p.description && (
                          <p className="mt-0.5 text-[11.5px] text-ink-3 max-w-[200px] truncate">{p.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-primary">{p.discount_pct}% off</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium }>
                          {p.duration === "forever" ? "Forever" : "First month"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-ink/[0.06] rounded-full overflow-hidden">
                            <div
                              className={h-full rounded-full transition-all }
                              style={{ width: p.max_uses === 0 ? "0%" : ${usagePct}% }}
                            />
                          </div>
                          <span className="text-[12px] font-mono text-ink-3 shrink-0">
                            {p.current_uses} / {p.max_uses === 0 ? <Infinity className="h-3 w-3 inline" /> : p.max_uses}
                          </span>
                        </div>
                        {isExhausted && <span className="text-[11px] text-danger font-medium">Limit reached</span>}
                      </td>
                      <td className="px-5 py-3.5 text-ink-3 text-[12px]">
                        {p.expires_at ? (
                          <span className={isExpired ? "text-danger font-medium" : ""}>
                            {new Date(p.expires_at).toLocaleDateString()}
                            {isExpired && " (expired)"}
                          </span>
                        ) : "Never"}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleActive(p)}
                          className="flex items-center gap-1.5 text-[12px] font-medium"
                          title={p.is_active ? "Click to pause" : "Click to activate"}
                        >
                          {p.is_active ? (
                            <><ToggleRight className="h-4 w-4 text-emerald-500" /><span className="text-emerald-600">Active</span></>
                          ) : (
                            <><ToggleLeft className="h-4 w-4 text-ink-3" /><span className="text-ink-3">Paused</span></>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded text-ink-3 hover:text-ink hover:bg-ink/[0.05]" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setPendingDelete(p)} className="p-1.5 rounded text-ink-3 hover:text-danger hover:bg-danger/[0.05]" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold">{modal === "create" ? "Create Promo Code" : "Edit Promo Code"}</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded text-ink-3 hover:text-ink"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Code">
                <Input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "") }))}
                  placeholder="NAIJASTART"
                  required
                  disabled={modal !== "create"}
                  className="font-mono uppercase"
                />
                <p className="text-[11.5px] text-ink-3 mt-1">Letters, numbers, - and _ only. Cannot be changed after creation.</p>
              </Field>

              <Field label="Internal description (optional)">
                <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Twitter launch campaign Q3" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Discount %">
                  <Input
                    type="number"
                    min={1} max={100}
                    value={form.discount_pct}
                    onChange={(e) => setForm((f) => ({ ...f, discount_pct: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </Field>
                <Field label="Max uses (0 = unlimited)">
                  <Input
                    type="number"
                    min={0}
                    value={form.max_uses}
                    onChange={(e) => setForm((f) => ({ ...f, max_uses: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </Field>
              </div>

              <Field label="Discount duration">
                <select
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value as "once" | "forever" }))}
                  className="h-10 w-full rounded-md border border-line bg-background px-3 text-[13px]"
                >
                  <option value="once">First month only</option>
                  <option value="forever">Forever (every renewal)</option>
                </select>
              </Field>

              <Field label="Expiry date (optional)">
                <Input type="date" value={form.expires_at} onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))} />
              </Field>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded accent-primary"
                />
                <label htmlFor="is_active" className="text-[13px] font-medium">Active (users can redeem this code)</label>
              </div>

              {/* Live preview */}
              {form.code && form.discount_pct > 0 && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-3 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[12.5px] text-emerald-700 dark:text-emerald-400">
                    <strong>{form.code}</strong> gives <strong>{form.discount_pct}% off</strong> — {form.duration === "forever" ? "every renewal" : "first month only"}.
                    {form.max_uses > 0 ?  Max  uses. : " Unlimited uses."}
                  </p>
                </div>
              )}

              {err && (
                <div className="flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/5 p-3 text-[12.5px] text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {err}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setModal(null)} disabled={busy}>Cancel</Button>
                <Button type="submit" disabled={busy}>
                  {busy ? (modal === "create" ? "Creating…" : "Saving…") : (modal === "create" ? "Create Code" : "Save Changes")}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 shrink-0 grid place-items-center rounded-md bg-danger/10 text-danger">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg">Delete code?</h2>
                <p className="mt-1 text-[13px] text-ink-3">
                  <span className="font-mono font-semibold">{pendingDelete.code}</span> will be permanently deleted.
                  All {pendingDelete.current_uses} existing redemptions will remain in the audit log.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setPendingDelete(null)} disabled={deleting}>Cancel</Button>
              <Button type="button" variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
