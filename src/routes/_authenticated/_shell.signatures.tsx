import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, useMutation, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { listSignatures, upsertSignature, deleteSignature } from "@/lib/signatures.functions";
import {
  PageHeader,
  Card,
  Button,
  Field,
  Input,
  ConfirmDeleteModal,
  CustomSelect,
} from "@/components/app/AppShell";
import { Trash2, Plus, User, Building2, Check, Sparkles } from "lucide-react";

const opts = queryOptions({
  queryKey: ["signatures"],
  queryFn: async () => listSignatures(),
  staleTime: 15_000,
});

export const Route = createFileRoute("/_authenticated/_shell/signatures")({
  head: () => ({ meta: [{ title: "Email Signatures — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(opts),
  component: SignatureRoute,
});

type EmpSig = {
  id: string;
  scope_ref: string;
  name: string;
  html: string;
  employee_name: string | null;
  professional_email: string | null;
  department: string | null;
  job_title: string | null;
};
type Emp = {
  id: string;
  full_name: string | null;
  professional_email: string | null;
  department: string | null;
  job_title: string | null;
};

function SignatureRoute() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts);
  const org = data.org as { name: string; html: string } | null;
  const employeeSigs = (data.employees ?? []) as EmpSig[];
  const allEmployees = (data.allEmployees ?? []) as Emp[];

  const save = useServerFn(upsertSignature);
  const del = useServerFn(deleteSignature);

  const saveM = useMutation({
    mutationFn: (v: {
      scope: "org" | "employee";
      scope_ref: string | null;
      name: string;
      html: string;
    }) => save({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["signatures"] }),
  });
  const delM = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["signatures"] }),
  });

  const [pendingDeleteSig, setPendingDeleteSig] = useState<{ id: string; name: string } | null>(
    null,
  );

  const usedEmpIds = useMemo(() => new Set(employeeSigs.map((s) => s.scope_ref)), [employeeSigs]);
  const availableEmployees = allEmployees.filter((e) => !usedEmpIds.has(e.id));

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        title="Signatures & Templates"
        subtitle="Configure company-wide email signatures and individual employee overrides."
      />

      {/* Main Card: Org Default */}
      <OrgSignatureCard
        initial={org}
        onSave={(v) => saveM.mutate({ scope: "org", scope_ref: null, name: v.name, html: v.html })}
        saving={saveM.isPending}
      />

      {/* Per-Employee Overrides Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[16.5px] font-semibold flex items-center gap-2 text-ink">
              <User className="h-4.5 w-4.5 text-emerald-600" />
              Per-Employee Signature Overrides
            </h2>
            <p className="text-[12.5px] text-ink-3 mt-0.5">
              Overrides the company default signature for specific employees.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {employeeSigs.map((s) => (
            <EmployeeSignatureCard
              key={s.id}
              sig={s}
              onSave={(v) =>
                saveM.mutate({
                  scope: "employee",
                  scope_ref: s.scope_ref,
                  name: v.name,
                  html: v.html,
                })
              }
              onDelete={() =>
                setPendingDeleteSig({
                  id: s.id,
                  name: s.employee_name ?? s.professional_email ?? "Employee",
                })
              }
              saving={saveM.isPending}
              deleting={delM.isPending}
            />
          ))}

          <AddEmployeeSignature
            employees={availableEmployees}
            onCreate={(v) =>
              saveM.mutate({
                scope: "employee",
                scope_ref: v.employee_id,
                name: v.name,
                html: v.html,
              })
            }
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
          onConfirm={() => {
            delM.mutate(pendingDeleteSig.id);
            setPendingDeleteSig(null);
          }}
          onCancel={() => setPendingDeleteSig(null)}
        />
      )}
    </div>
  );
}

function OrgSignatureCard({
  initial,
  onSave,
  saving,
}: {
  initial: { name: string; html: string } | null;
  onSave: (v: { name: string; html: string }) => void;
  saving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "Company Wide Default");
  const [html, setHtml] = useState(
    initial?.html ??
      `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5; color: #334155; border-left: 3px solid #10b981; padding-left: 12px;">\n  <strong style="color: #0f172a; font-size: 14px;">{{full_name}}</strong><br/>\n  <span style="color: #64748b;">{{job_title}} · Olatunbosun Group</span><br/>\n  <span style="color: #10b981;">✉ {{professional_email}}</span> | <span>📞 {{phone_number}}</span><br/>\n  <span style="font-size: 11px; color: #94a3b8;">Sent via Mailcoy Cloud Business Email</span>\n</div>`,
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "Company Wide Default");
    setHtml(
      initial?.html ??
        `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5; color: #334155; border-left: 3px solid #10b981; padding-left: 12px;">\n  <strong style="color: #0f172a; font-size: 14px;">{{full_name}}</strong><br/>\n  <span style="color: #64748b;">{{job_title}} · Olatunbosun Group</span><br/>\n  <span style="color: #10b981;">✉ {{professional_email}}</span> | <span>📞 {{phone_number}}</span><br/>\n  <span style="font-size: 11px; color: #94a3b8;">Sent via Mailcoy Cloud Business Email</span>\n</div>`,
    );
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, html });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4.5 w-4.5 text-primary" />
          <h3 className="font-display text-[15.5px] font-semibold text-ink">
            Company Default Template
          </h3>
        </div>
        <span className="text-[11px] font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
          Default for all staff
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <Field label="Template Title">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field
            label="Signature HTML / Text"
            hint="Placeholders: {{full_name}}, {{job_title}}, {{department}}, {{company}}, {{professional_email}}, {{phone_number}}"
          >
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={8}
              placeholder={
                '<div style="border-left: 3px solid #10b981; padding-left: 10px;">\n  <strong>{{full_name}}</strong><br/>\n  <span>{{job_title}}</span>\n</div>'
              }
              className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-[12.5px] font-mono text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save default template"}
            </Button>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                <Check className="h-3.5 w-3.5" /> Saved!
              </span>
            )}
          </div>
        </div>
        <PreviewCard html={html} title="Live Preview" inline />
      </form>
    </Card>
  );
}

function EmployeeSignatureCard({
  sig,
  onSave,
  onDelete,
  saving,
  deleting,
}: {
  sig: EmpSig;
  onSave: (v: { name: string; html: string }) => void;
  onDelete: () => void;
  saving: boolean;
  deleting: boolean;
}) {
  const [name, setName] = useState(sig.name);
  const [html, setHtml] = useState(sig.html);

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-line pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600" />
            <h3 className="font-display text-[15px] font-semibold text-ink truncate">
              {sig.employee_name ?? sig.professional_email ?? "Employee"}
            </h3>
          </div>
          <div className="mt-0.5 text-[12px] text-ink-3 font-mono truncate">
            {sig.professional_email} {sig.department ? `· ${sig.department}` : ""}
          </div>
        </div>
        <button
          onClick={onDelete}
          disabled={deleting}
          type="button"
          className="p-1.5 text-ink-3 hover:text-danger rounded-md transition"
          title="Remove override"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ name, html });
        }}
        className="grid gap-6 lg:grid-cols-[1.1fr_1fr]"
      >
        <div className="space-y-4">
          <Field label="Override Title">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Signature HTML">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-[12.5px] font-mono text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save override"}
          </Button>
        </div>
        <PreviewCard
          html={html}
          title="Employee Override Preview"
          sampleEmployee={{
            full_name: sig.employee_name || "Employee",
            job_title: sig.job_title || "Team Member",
            department: sig.department || "General",
            professional_email: sig.professional_email || "employee@olatunbosun.com",
            phone_number: "+234 802 345 6789",
          }}
          inline
        />
      </form>
    </Card>
  );
}

function AddEmployeeSignature({
  employees,
  onCreate,
  saving,
}: {
  employees: Emp[];
  onCreate: (v: { employee_id: string; name: string; html: string }) => void;
  saving: boolean;
}) {
  const [empId, setEmpId] = useState<string>("");
  const [name, setName] = useState("Personal signature");
  const [html, setHtml] = useState(
    `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5; color: #334155; border-left: 3px solid #6366f1; padding-left: 12px;">\n  <strong style="color: #0f172a; font-size: 14px;">{{full_name}}</strong><br/>\n  <span style="color: #6366f1; font-weight: 600;">{{job_title}}</span><br/>\n  <span>📞 {{phone_number}} | ✉ {{professional_email}}</span>\n</div>`,
  );

  if (employees.length === 0) return null;

  return (
    <Card className="p-5 border-dashed bg-surface-muted/20">
      <div className="mb-4 flex items-center gap-2">
        <Plus className="h-4.5 w-4.5 text-emerald-600" />
        <h3 className="font-display text-[15px] font-semibold text-ink">
          Add Individual Employee Signature Override
        </h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!empId) return;
          onCreate({ employee_id: empId, name, html });
          setEmpId("");
        }}
        className="grid gap-4 md:grid-cols-2"
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
        <Field label="Override Title">
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <div className="md:col-span-2">
          <Field label="Signature HTML">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={4}
              placeholder={"--\n{{full_name}} | {{job_title}}\n{{company}}"}
              className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-[12.5px] font-mono text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={saving || !empId}>
            {saving ? "Saving…" : "Create employee override"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function PreviewCard({
  html,
  title,
  sampleEmployee,
  inline,
}: {
  html: string;
  title: string;
  sampleEmployee?: {
    full_name: string;
    job_title: string;
    department: string;
    professional_email: string;
    phone_number: string;
  };
  inline?: boolean;
}) {
  const emp = sampleEmployee || {
    full_name: "Femi Olatunbosun",
    job_title: "Chief Executive Officer",
    department: "Executive",
    professional_email: "femi@olatunbosun.com",
    phone_number: "+234 803 123 4567",
  };

  const rendered = (
    html ||
    `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5; color: #334155; border-left: 3px solid #10b981; padding-left: 12px;">\n  <strong style="color: #0f172a; font-size: 14px;">{{full_name}}</strong><br/>\n  <span style="color: #64748b;">{{job_title}} · Olatunbosun Group</span><br/>\n  <span style="color: #10b981;">✉ {{professional_email}}</span> | <span>📞 {{phone_number}}</span><br/>\n  <span style="font-size: 11px; color: #94a3b8;">Sent via Mailcoy Cloud Business Email</span>\n</div>`
  )
    .replace(/\{\{?full_name\}\}?/gi, emp.full_name)
    .replace(/\{\{?name\}\}?/gi, emp.full_name)
    .replace(/\{\{?job_title\}\}?/gi, emp.job_title)
    .replace(/\{\{?title\}\}?/gi, emp.job_title)
    .replace(/\{\{?department\}\}?/gi, emp.department)
    .replace(/\{\{?company\}\}?/gi, "Olatunbosun Group")
    .replace(/\{\{?company_name\}\}?/gi, "Olatunbosun Group")
    .replace(/\{\{?professional_email\}\}?/gi, emp.professional_email)
    .replace(/\{\{?company_email\}\}?/gi, emp.professional_email)
    .replace(/\{\{?email\}\}?/gi, emp.professional_email)
    .replace(/\{\{?phone_number\}\}?/gi, emp.phone_number)
    .replace(/\{\{?phone\}\}?/gi, emp.phone_number);

  const isHtml = /<[a-z][\s\S]*>/i.test(rendered);
  const formattedHtml = isHtml ? rendered : rendered.replace(/\n/g, "<br/>");

  const body = (
    <div className="rounded-xl border border-line bg-background p-4 sm:p-5 min-h-[160px] text-[13.5px] text-ink leading-relaxed font-sans shadow-xs flex flex-col justify-center">
      <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
    </div>
  );

  if (inline) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-3 mb-2 font-mono">
          <Sparkles className="h-3 w-3 text-primary" /> {title}
        </div>
        <div className="flex-1">{body}</div>
      </div>
    );
  }

  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-3 mb-2 font-mono">
        <Sparkles className="h-3 w-3 text-primary" /> {title}
      </div>
      <div className="flex-1">{body}</div>
    </Card>
  );
}
