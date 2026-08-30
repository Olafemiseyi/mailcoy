import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, useMutation, queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { listSignatures, upsertSignature, deleteSignature } from "@/lib/signatures.functions";
import { getMyOrganization } from "@/lib/orgs.functions";
import {
  PageHeader,
  Card,
  Button,
  Field,
  Input,
  ConfirmDeleteModal,
  CustomSelect,
} from "@/components/app/AppShell";
import { Trash2, Plus, User, Building2, Check, Eye, Sun, Moon, Copy } from "lucide-react";

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

  const fetchOrg = useServerFn(getMyOrganization);
  const { data: myOrg } = useQuery({
    queryKey: ["my-org"],
    queryFn: async () => fetchOrg(),
    staleTime: 60_000,
  });

  const orgName = myOrg?.name || "Your Company";
  const primaryDomain = (myOrg?.slug ? `${myOrg.slug}.com` : null) || "yourcompany.com";

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

  const sampleEmployee = allEmployees[0]
    ? {
        full_name: allEmployees[0].full_name || "Team Member",
        job_title: allEmployees[0].job_title || "Executive",
        department: allEmployees[0].department || "General",
        professional_email: allEmployees[0].professional_email || `hello@${primaryDomain}`,
        phone_number: "+1 (555) 019-2834",
      }
    : {
        full_name: "Alex Morgan",
        job_title: "Head of Operations",
        department: "Operations",
        professional_email: `alex@${primaryDomain}`,
        phone_number: "+1 (555) 019-2834",
      };

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        title="Signatures & Templates"
        subtitle="Configure company-wide email signatures and individual employee overrides."
      />

      {/* Main Card: Org Default */}
      <OrgSignatureCard
        initial={org}
        companyName={orgName}
        sampleEmployee={sampleEmployee}
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
              companyName={orgName}
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
            companyName={orgName}
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

function MergeTagPills({ onInsert }: { onInsert: (tag: string) => void }) {
  const tags = [
    { label: "Name", tag: "{{full_name}}" },
    { label: "Title", tag: "{{job_title}}" },
    { label: "Dept", tag: "{{department}}" },
    { label: "Company", tag: "{{company}}" },
    { label: "Email", tag: "{{professional_email}}" },
    { label: "Phone", tag: "{{phone_number}}" },
  ];

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-ink-3 mr-0.5 font-medium">Insert:</span>
      {tags.map((t) => (
        <button
          key={t.tag}
          type="button"
          onClick={() => onInsert(t.tag)}
          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-muted/60 hover:bg-primary/10 hover:text-primary border border-line text-ink transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
          title={`Click to insert ${t.tag}`}
        >
          +{t.label}
        </button>
      ))}
    </div>
  );
}

function OrgSignatureCard({
  initial,
  companyName,
  sampleEmployee,
  onSave,
  saving,
}: {
  initial: { name: string; html: string } | null;
  companyName: string;
  sampleEmployee: {
    full_name: string;
    job_title: string;
    department: string;
    professional_email: string;
    phone_number: string;
  };
  onSave: (v: { name: string; html: string }) => void;
  saving: boolean;
}) {
  const defaultHtml = `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5; color: #334155; border-left: 3px solid #10b981; padding-left: 12px;">\n  <strong style="color: #0f172a; font-size: 14px;">{{full_name}}</strong><br/>\n  <span style="color: #64748b;">{{job_title}} · {{company}}</span><br/>\n  <span style="color: #10b981;">✉ {{professional_email}}</span> | <span>📞 {{phone_number}}</span><br/>\n  <span style="font-size: 11px; color: #94a3b8;">Sent via Mailcoy Cloud Business Email</span>\n</div>`;

  const [name, setName] = useState(initial?.name ?? "Company Wide Default");
  const [html, setHtml] = useState(initial?.html ?? defaultHtml);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "Company Wide Default");
    setHtml(initial?.html ?? defaultHtml);
  }, [initial, defaultHtml]);

  const handleInsertTag = (tag: string) => {
    setHtml((prev) => `${prev} ${tag}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, html });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <Card className="p-4 sm:p-6 min-w-0">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-line pb-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="h-4.5 w-4.5 text-primary shrink-0" />
          <h3 className="font-display text-[14.5px] sm:text-[15.5px] font-semibold text-ink truncate">
            Company Default Template
          </h3>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap self-start sm:self-auto">
          Default for all staff
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[1.1fr_1fr] min-w-0">
        <div className="space-y-4 min-w-0">
          <Field label="Template Title">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Signature HTML / Text">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={7}
              placeholder={
                '<div style="border-left: 3px solid #10b981; padding-left: 10px;">\n  <strong>{{full_name}}</strong><br/>\n  <span>{{job_title}}</span>\n</div>'
              }
              className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-[12.5px] font-mono text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <MergeTagPills onInsert={handleInsertTag} />
          </Field>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
            <Button type="submit" disabled={saving} className="w-full sm:w-auto whitespace-nowrap justify-center">
              {saving ? "Saving…" : "Save default template"}
            </Button>
            {savedSuccess && (
              <span className="inline-flex items-center justify-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg whitespace-nowrap">
                <Check className="h-3.5 w-3.5" /> Saved!
              </span>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <PreviewCard
            html={html}
            title="Live Preview"
            companyName={companyName}
            sampleEmployee={sampleEmployee}
            inline
          />
        </div>
      </form>
    </Card>
  );
}

function EmployeeSignatureCard({
  sig,
  companyName,
  onSave,
  onDelete,
  saving,
  deleting,
}: {
  sig: EmpSig;
  companyName: string;
  onSave: (v: { name: string; html: string }) => void;
  onDelete: () => void;
  saving: boolean;
  deleting: boolean;
}) {
  const [name, setName] = useState(sig.name);
  const [html, setHtml] = useState(sig.html);

  const handleInsertTag = (tag: string) => {
    setHtml((prev) => `${prev} ${tag}`);
  };

  return (
    <Card className="p-4 sm:p-5 min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <User className="h-4 w-4 text-emerald-600 shrink-0" />
            <h3 className="font-display text-[14.5px] sm:text-[15px] font-semibold text-ink truncate">
              {sig.employee_name ?? sig.professional_email ?? "Employee"}
            </h3>
          </div>
          <div className="mt-0.5 text-[11.5px] sm:text-[12px] text-ink-3 font-mono truncate">
            {sig.professional_email} {sig.department ? `· ${sig.department}` : ""}
          </div>
        </div>
        <button
          onClick={onDelete}
          disabled={deleting}
          type="button"
          className="p-1.5 text-ink-3 hover:text-danger rounded-md transition shrink-0 cursor-pointer"
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
        className="grid gap-5 lg:grid-cols-[1.1fr_1fr] min-w-0"
      >
        <div className="space-y-4 min-w-0">
          <Field label="Override Title">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Signature HTML">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-[12.5px] font-mono text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <MergeTagPills onInsert={handleInsertTag} />
          </Field>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto whitespace-nowrap justify-center">
            {saving ? "Saving…" : "Save override"}
          </Button>
        </div>
        <div className="min-w-0">
          <PreviewCard
            html={html}
            title="Employee Override Preview"
            companyName={companyName}
            sampleEmployee={{
              full_name: sig.employee_name || "Team Member",
              job_title: sig.job_title || "Staff",
              department: sig.department || "General",
              professional_email: sig.professional_email || `member@yourcompany.com`,
              phone_number: "+1 (555) 019-2834",
            }}
            inline
          />
        </div>
      </form>
    </Card>
  );
}

function AddEmployeeSignature({
  employees,
  companyName,
  onCreate,
  saving,
}: {
  employees: Emp[];
  companyName: string;
  onCreate: (v: { employee_id: string; name: string; html: string }) => void;
  saving: boolean;
}) {
  const [empId, setEmpId] = useState<string>("");
  const [name, setName] = useState("Personal signature");
  const [html, setHtml] = useState(
    `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5; color: #334155; border-left: 3px solid #6366f1; padding-left: 12px;">\n  <strong style="color: #0f172a; font-size: 14px;">{{full_name}}</strong><br/>\n  <span style="color: #6366f1; font-weight: 600;">{{job_title}} · {{company}}</span><br/>\n  <span>📞 {{phone_number}} | ✉ {{professional_email}}</span>\n</div>`,
  );

  const handleInsertTag = (tag: string) => {
    setHtml((prev) => `${prev} ${tag}`);
  };

  if (employees.length === 0) return null;

  return (
    <Card className="p-4 sm:p-5 border-dashed bg-surface-muted/20 min-w-0">
      <div className="mb-4 flex items-center gap-2 min-w-0">
        <Plus className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
        <h3 className="font-display text-[14.5px] sm:text-[15px] font-semibold text-ink truncate">
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
        className="grid gap-4 md:grid-cols-2 min-w-0"
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
        <div className="md:col-span-2 min-w-0">
          <Field label="Signature HTML">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={4}
              placeholder={"--\n{{full_name}} | {{job_title}}\n{{company}}"}
              className="w-full rounded-xl border border-line bg-background px-3.5 py-2.5 text-[12.5px] font-mono text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <MergeTagPills onInsert={handleInsertTag} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={saving || !empId} className="w-full sm:w-auto whitespace-nowrap justify-center">
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
  companyName,
  sampleEmployee,
  inline,
}: {
  html: string;
  title: string;
  companyName?: string;
  sampleEmployee?: {
    full_name: string;
    job_title: string;
    department: string;
    professional_email: string;
    phone_number: string;
  };
  inline?: boolean;
}) {
  const [inboxMode, setInboxMode] = useState<"light" | "dark">("light");
  const [copied, setCopied] = useState(false);

  const emp = sampleEmployee || {
    full_name: "Alex Morgan",
    job_title: "Head of Operations",
    department: "Operations",
    professional_email: "alex@yourcompany.com",
    phone_number: "+1 (555) 019-2834",
  };

  const comp = companyName || "Your Company";

  const rendered = (
    html ||
    `<div style="font-family: sans-serif; font-size: 13px; line-height: 1.5; color: #334155; border-left: 3px solid #10b981; padding-left: 12px;">\n  <strong style="color: #0f172a; font-size: 14px;">{{full_name}}</strong><br/>\n  <span style="color: #64748b;">{{job_title}} · {{company}}</span><br/>\n  <span style="color: #10b981;">✉ {{professional_email}}</span> | <span>📞 {{phone_number}}</span><br/>\n  <span style="font-size: 11px; color: #94a3b8;">Sent via Mailcoy Cloud Business Email</span>\n</div>`
  )
    .replace(/\{\{?company_name\}\}?/gi, comp)
    .replace(/\{\{?company\}\}?/gi, comp)
    .replace(/\{\{?professional_email\}\}?/gi, emp.professional_email)
    .replace(/\{\{?company_email\}\}?/gi, emp.professional_email)
    .replace(/\{\{?email\}\}?/gi, emp.professional_email)
    .replace(/\{\{?full_name\}\}?/gi, emp.full_name)
    .replace(/\{\{?name\}\}?/gi, emp.full_name)
    .replace(/\{\{?job_title\}\}?/gi, emp.job_title)
    .replace(/\{\{?title\}\}?/gi, emp.job_title)
    .replace(/\{\{?department\}\}?/gi, emp.department)
    .replace(/\{\{?phone_number\}\}?/gi, emp.phone_number)
    .replace(/\{\{?phone\}\}?/gi, emp.phone_number);

  const isHtml = /<[a-z][\s\S]*>/i.test(rendered);
  const rawHtml = isHtml ? rendered : rendered.replace(/\n/g, "<br/>");
  // Basic safe sanitization against scripts and event handlers in preview
  const formattedHtml = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/javascript:/gi, "");

  const handleCopy = async () => {
    try {
      const plainText = formattedHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const blobHtml = new Blob([formattedHtml], { type: "text/html" });
      const blobText = new Blob([plainText], { type: "text/plain" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const plainText = formattedHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canvasClass =
    inboxMode === "light"
      ? "bg-white text-slate-900 border-slate-200/90 shadow-xs"
      : "bg-[#18181b] text-zinc-100 border-zinc-700/60 shadow-xs [&_*]:!text-zinc-100 [&_span]:!text-zinc-300 [&_strong]:!text-white";

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-3">
        <Eye className="h-3 w-3 text-primary shrink-0" /> {title}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[10.5px] font-sans font-medium px-2 py-0.5 rounded-md border border-line bg-surface hover:bg-ink/[0.04] text-ink transition-colors cursor-pointer"
          title="Copy signature to paste into Gmail / Outlook settings"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-ink-3" />
              <span>Copy</span>
            </>
          )}
        </button>
        <div className="flex items-center gap-1 bg-surface-muted/80 p-0.5 rounded-lg border border-line">
          <button
            type="button"
            onClick={() => setInboxMode("light")}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer ${
              inboxMode === "light"
                ? "bg-surface text-ink shadow-xs font-bold"
                : "text-ink-3 hover:text-ink"
            }`}
            title="Simulate Light Email Inbox"
          >
            <Sun className="h-3 w-3 text-amber-500" /> Light
          </button>
          <button
            type="button"
            onClick={() => setInboxMode("dark")}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer ${
              inboxMode === "dark"
                ? "bg-surface text-ink shadow-xs font-bold"
                : "text-ink-3 hover:text-ink"
            }`}
            title="Simulate Dark Email Inbox"
          >
            <Moon className="h-3 w-3 text-indigo-400" /> Dark
          </button>
        </div>
      </div>
    </div>
  );

  const body = (
    <div
      className={`rounded-xl border p-4 sm:p-5 min-h-[140px] text-[13px] sm:text-[13.5px] leading-relaxed font-sans flex flex-col justify-center overflow-x-auto break-words min-w-0 max-w-full transition-colors duration-200 ${canvasClass}`}
    >
      <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
    </div>
  );

  if (inline) {
    return (
      <div className="flex flex-col h-full min-w-0">
        {header}
        <div className="flex-1 min-w-0">{body}</div>
      </div>
    );
  }

  return (
    <Card className="p-4 sm:p-5 flex flex-col h-full min-w-0">
      {header}
      <div className="flex-1 min-w-0">{body}</div>
    </Card>
  );
}
