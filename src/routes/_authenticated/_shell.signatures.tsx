import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, useMutation, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { listSignatures, upsertSignature, deleteSignature } from "@/lib/signatures.functions";
import { PageHeader, Card, Button, Field, Input, ConfirmDeleteModal, CustomSelect } from "@/components/app/AppShell";
import { Trash2, Plus, User, Building2 } from "lucide-react";

const opts = queryOptions({ queryKey: ["signatures"], queryFn: async () => listSignatures(), staleTime: 15_000 });

export const Route = createFileRoute("/_authenticated/_shell/signatures")({
  head: () => ({ meta: [{ title: "Email Signatures — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(opts),
  component: SignatureRoute,
});

type EmpSig = { id: string; scope_ref: string; name: string; html: string; employee_name: string | null; professional_email: string | null; department: string | null; job_title: string | null };
type Emp = { id: string; full_name: string | null; professional_email: string | null; department: string | null; job_title: string | null };

function SignatureRoute() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts);
  const org = data.org as { name: string; html: string } | null;
  const employeeSigs = (data.employees ?? []) as EmpSig[];
  const allEmployees = (data.allEmployees ?? []) as Emp[];

  const save = useServerFn(upsertSignature);
  const del = useServerFn(deleteSignature);

  const saveM = useMutation({
    mutationFn: (v: { scope: "org" | "employee"; scope_ref: string | null; name: string; html: string }) => save({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["signatures"] }),
  });
  const delM = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["signatures"] }),
  });

  const [pendingDeleteSig, setPendingDeleteSig] = useState<{ id: string; name: string } | null>(null);

  const usedEmpIds = useMemo(() => new Set(employeeSigs.map((s) => s.scope_ref)), [employeeSigs]);
  const availableEmployees = allEmployees.filter((e) => !usedEmpIds.has(e.id));

  return (
    <div>
      <PageHeader
        title="Signatures & Templates"
        subtitle="Configure company-wide email signatures and individual employee overrides."
      />

      {/* Main Grid: Org Default */}
      <div className="mb-8">
        <OrgSignatureCard
          initial={org}
          onSave={(v) => saveM.mutate({ scope: "org", scope_ref: null, name: v.name, html: v.html })}
          saving={saveM.isPending}
        />
      </div>

      {/* Per-Employee Overrides Section */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[16.5px] font-semibold flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-emerald-600" />
              Per-Employee Signature Overrides
            </h2>
            <p className="text-[12.5px] text-ink-3 mt-0.5">Overrides company default for specific employees.</p>
          </div>
        </div>

        <div className="space-y-4">
          {employeeSigs.map((s) => (
            <EmployeeSignatureCard
              key={s.id}
              sig={s}
              onSave={(v) => saveM.mutate({ scope: "employee", scope_ref: s.scope_ref, name: v.name, html: v.html })}
              onDelete={() => setPendingDeleteSig({ id: s.id, name: s.employee_name ?? s.professional_email ?? "Employee" })}
              saving={saveM.isPending}
              deleting={delM.isPending}
            />
          ))}

          <AddEmployeeSignature
            employees={availableEmployees}
            onCreate={(v) => saveM.mutate({ scope: "employee", scope_ref: v.employee_id, name: v.name, html: v.html })}
            saving={saveM.isPending}
          />
        </div>
      </div>

      {pendingDeleteSig && (
        <ConfirmDeleteModal
          title="Remove custom signature?"
          description={`The custom signature template for ${pendingDeleteSig.name} will be deleted.`}
          confirmLabel="Remove"
          busy={delM.isPending}
          onConfirm={() => { delM.mutate(pendingDeleteSig.id); setPendingDeleteSig(null); }}
          onCancel={() => setPendingDeleteSig(null)}
        />
      )}
    </div>
  );
}

function OrgSignatureCard({ initial, onSave, saving }: { initial: { name: string; html: string } | null; onSave: (v: { name: string; html: string }) => void; saving: boolean }) {
  const [name, setName] = useState(initial?.name ?? "Company default");
  const [html, setHtml] = useState(initial?.html ?? "");
  useEffect(() => { setName(initial?.name ?? "Company default"); setHtml(initial?.html ?? ""); }, [initial]);

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" />
        <h3 className="font-display text-[15px] font-semibold">Company Default Template</h3>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave({ name, html }); }} className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Field label="Template Title"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <Field label="Signature HTML / Text" hint="Placeholders: {name}, {title}, {department}, {company}, {email}">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={7}
              placeholder={"--\n{name} | {title}\n{department} at {company}\n{email}"}
              className="w-full rounded-md border border-line bg-background px-3 py-2.5 text-[13px] font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save default template"}</Button>
        </div>
        <PreviewCard html={html} title="Live Preview" inline />
      </form>
    </Card>
  );
}

function EmployeeSignatureCard({ sig, onSave, onDelete, saving, deleting }: { sig: EmpSig; onSave: (v: { name: string; html: string }) => void; onDelete: () => void; saving: boolean; deleting: boolean }) {
  const [name, setName] = useState(sig.name);
  const [html, setHtml] = useState(sig.html);

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600" />
            <h3 className="font-display text-[15px] font-semibold truncate">{sig.employee_name ?? sig.professional_email ?? "Employee"}</h3>
          </div>
          <div className="mt-0.5 text-[12px] text-ink-3 font-mono truncate">{sig.professional_email} {sig.department ? `· ${sig.department}` : ""}</div>
        </div>
        <button onClick={onDelete} disabled={deleting} type="button" className="p-1.5 text-ink-3 hover:text-danger" title="Remove override">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave({ name, html }); }} className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Field label="Override Title"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <Field label="Signature HTML">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-line bg-background px-3 py-2.5 text-[13px] font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save override"}</Button>
        </div>
        <PreviewCard html={html} title="Employee Override Preview" inline />
      </form>
    </Card>
  );
}

function AddEmployeeSignature({ employees, onCreate, saving }: { employees: Emp[]; onCreate: (v: { employee_id: string; name: string; html: string }) => void; saving: boolean }) {
  const [empId, setEmpId] = useState<string>("");
  const [name, setName] = useState("Personal signature");
  const [html, setHtml] = useState("");

  if (employees.length === 0) return null;

  return (
    <Card className="p-5 border-dashed bg-surface-muted/20">
      <div className="mb-3 flex items-center gap-2">
        <Plus className="h-4 w-4 text-emerald-600" />
        <h3 className="font-display text-[15px] font-semibold">Add Individual Employee Signature Override</h3>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); if (!empId) return; onCreate({ employee_id: empId, name, html }); setEmpId(""); setHtml(""); }}
        className="grid gap-3 md:grid-cols-2"
      >
        <Field label="Employee">
          <CustomSelect
            value={empId}
            onChange={(val) => setEmpId(val)}
            placeholder="Select employee…"
            options={employees.map((e) => ({
              value: e.id,
              label: `${e.full_name ?? e.professional_email} (${e.department ?? "General"})`,
            }))}
          />
        </Field>
        <Field label="Override Title"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <div className="md:col-span-2">
          <Field label="Signature HTML">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={4}
              placeholder={"--\n{name} | {job_title}\n{company}"}
              className="w-full rounded-md border border-line bg-background px-3 py-2.5 text-[13px] font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={saving || !empId}>{saving ? "Saving…" : "Create employee override"}</Button>
        </div>
      </form>
    </Card>
  );
}

function PreviewCard({ html, title, inline }: { html: string; title: string; inline?: boolean }) {
  const rendered = (html || "Regards,<br/><strong>{name}</strong><br/>{title} at {company}<br/><span style='color: #64748b;'>{email}</span>")
    .replace(/\{name\}/g, "John Doe")
    .replace(/\{title\}/g, "Sales Director")
    .replace(/\{department\}/g, "Sales")
    .replace(/\{company\}/g, "Mailcoy Technologies")
    .replace(/\{email\}/g, "john@mailcoy.com");

  const isHtml = /<[a-z][\s\S]*>/i.test(rendered);
  const formattedHtml = isHtml ? rendered : rendered.replace(/\n/g, "<br/>");

  const body = (
    <div 
      className="rounded-md border border-line bg-background p-4 min-h-[160px] text-[13.5px] text-ink leading-relaxed font-sans space-y-1 shadow-xs"
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
  if (inline) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-2">{title}</div>
        <div className="flex-1">
          {body}
        </div>
      </div>
    );
  }
  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-2">{title}</div>
      <div className="flex-1">
        {body}
      </div>
    </Card>
  );
}
