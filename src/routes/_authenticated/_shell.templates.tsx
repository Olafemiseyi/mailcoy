import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Button, Input, Field, ConfirmDeleteModal } from "@/components/app/AppShell";
import { useState, useMemo } from "react";
import {
  LayoutTemplate,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Code,
  Check,
  Copy,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listTemplates, saveTemplate, deleteTemplate } from "@/lib/templates.functions";
import { getMyOrganization } from "@/lib/orgs.functions";
import { Skeleton } from "@/components/Skeleton";

export const Route = createFileRoute("/_authenticated/_shell/templates")({
  head: () => ({ meta: [{ title: "Email Templates — Mailcoy" }] }),
  component: TemplatesPage,
});

interface Template {
  id?: string;
  name: string;
  subject: string;
  html_body: string;
  updated_at?: string;
}

const DEFAULT_TEMPLATE = (company: string) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; max-width: 540px; margin: 0 auto; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .logo { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
    h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">${company}</div>
    <h2>Welcome, {{first_name}}!</h2>
    <p>We're thrilled to have you with us. Click the button below to get started with your new account.</p>
    <a href="{{action_url}}" class="button">Get Started</a>
    <div class="footer">
      Sent with care by ${company} · If you didn't request this email, you can safely ignore it.
    </div>
  </div>
</body>
</html>`;

function TemplatesPage() {
  const qc = useQueryClient();
  const fetchTemplates = useServerFn(listTemplates);
  const saveFn = useServerFn(saveTemplate);
  const delFn = useServerFn(deleteTemplate);
  const fetchOrg = useServerFn(getMyOrganization);

  const { data: myOrg } = useQuery({
    queryKey: ["my-org"],
    queryFn: async () => fetchOrg(),
    staleTime: 60_000,
  });

  const companyName = myOrg?.name || "Your Company";

  const { data: templates = [], isPending } = useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => fetchTemplates(),
  });

  const [editing, setEditing] = useState<Template | null>(null);
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [busy, setBusy] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditing({
      name: "New Template",
      subject: `Notification from ${companyName}`,
      html_body: DEFAULT_TEMPLATE(companyName),
    });
    setViewMode("code");
  };

  const handleSave = async () => {
    if (!editing || !editing.name.trim()) return;
    setBusy(true);
    try {
      await saveFn({
        data: {
          id: editing.id,
          name: editing.name,
          subject: editing.subject,
          html_body: editing.html_body,
        },
      });
      await qc.invalidateQueries({ queryKey: ["email-templates"] });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditing(null);
      }, 1000);
    } catch {
      alert("Failed to save template. Please check all fields.");
    } finally {
      setBusy(false);
    }
  };

  const handleInsertTag = (tag: string) => {
    if (!editing) return;
    setEditing((prev) => (prev ? { ...prev, html_body: `${prev.html_body} ${tag}` } : null));
  };

  const mergeTags = [
    { label: "Company", tag: "{{company_name}}" },
    { label: "First Name", tag: "{{first_name}}" },
    { label: "Email", tag: "{{email}}" },
    { label: "Action URL", tag: "{{action_url}}" },
    { label: "Support Email", tag: "{{support_email}}" },
  ];

  const renderedPreviewHtml = useMemo(() => {
    if (!editing) return "";
    return (editing.html_body || "")
      .replace(/\{\{?company_name\}\}?/gi, companyName)
      .replace(/\{\{?company\}\}?/gi, companyName)
      .replace(/\{\{?first_name\}\}?/gi, "Alex")
      .replace(/\{\{?name\}\}?/gi, "Alex Morgan")
      .replace(/\{\{?email\}\}?/gi, "alex@yourdomain.com")
      .replace(/\{\{?action_url\}\}?/gi, "https://mailcoy.com")
      .replace(/\{\{?support_email\}\}?/gi, "support@mailcoy.com");
  }, [editing, companyName]);

  if (editing) {
    return (
      <div className="space-y-6 max-w-5xl min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-line">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setEditing(null)}
              type="button"
              className="p-2 hover:bg-ink/[0.05] rounded-lg transition text-ink-3 cursor-pointer shrink-0"
              title="Back to templates"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-ink truncate">
                {editing.id ? "Edit Template" : "New Template"}
              </h1>
              <p className="text-[12px] sm:text-[13px] text-ink-3 truncate">
                {editing.name || "Untitled"}
              </p>
            </div>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button
              variant="ghost"
              className="flex-1 sm:flex-none justify-center whitespace-nowrap"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={busy || !editing.name.trim()}
              className="flex-1 sm:flex-none gap-1.5 justify-center whitespace-nowrap"
            >
              {busy ? (
                "Saving…"
              ) : savedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-white" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save template
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          {/* Form Side */}
          <div className="lg:col-span-1 space-y-4 min-w-0">
            <Field label="Template Name">
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Welcome Email"
                required
              />
            </Field>

            <Field label="Email Subject">
              <Input
                value={editing.subject}
                onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
                placeholder="e.g. Welcome to our platform!"
                required
              />
            </Field>

            <div>
              <label className="text-[11.5px] font-medium text-ink-3 mb-1.5 block">
                Quick Insert Variable:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {mergeTags.map((t) => (
                  <button
                    key={t.tag}
                    type="button"
                    onClick={() => handleInsertTag(t.tag)}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-muted border border-line text-ink hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition whitespace-nowrap active:scale-95 cursor-pointer"
                    title={`Click to insert ${t.tag}`}
                  >
                    +{t.label}
                  </button>
                ))}
              </div>
            </div>

            {editing.id && (
              <Card className="p-4 bg-surface-muted/40 border-line">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-[12.5px] font-semibold text-ink flex items-center gap-1.5">
                    <LayoutTemplate className="h-4 w-4 text-primary shrink-0" /> API Template ID
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (editing.id) {
                        navigator.clipboard.writeText(editing.id);
                        setCopiedId(true);
                        setTimeout(() => setCopiedId(false), 2000);
                      }
                    }}
                    className="text-[10.5px] text-ink-3 hover:text-primary flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedId ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copiedId ? "Copied" : "Copy"}
                  </button>
                </div>
                <code className="block p-2 rounded-lg bg-surface border border-line text-[11px] font-mono text-ink overflow-x-auto select-all">
                  {editing.id}
                </code>
              </Card>
            )}
          </div>

          {/* Editor & Preview Side */}
          <div className="lg:col-span-2 flex flex-col min-w-0 min-h-[450px]">
            <div className="flex items-center justify-between bg-surface-muted border border-line rounded-t-xl p-1 gap-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("code")}
                  className={`px-3 py-1.5 text-[12.5px] font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "code"
                      ? "bg-surface shadow-xs text-ink font-semibold"
                      : "text-ink-3 hover:text-ink"
                  }`}
                >
                  <Code className="h-3.5 w-3.5" /> HTML Code
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1.5 text-[12.5px] font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "preview"
                      ? "bg-surface shadow-xs text-ink font-semibold"
                      : "text-ink-3 hover:text-ink"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> Live Preview
                </button>
              </div>

              {viewMode === "preview" && (
                <div className="flex items-center gap-1 bg-surface/80 p-0.5 rounded-lg border border-line mr-1">
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("light")}
                    className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold transition flex items-center gap-1 cursor-pointer ${
                      previewTheme === "light"
                        ? "bg-surface text-ink shadow-xs"
                        : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    <Sun className="h-3 w-3 text-amber-500" /> Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("dark")}
                    className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold transition flex items-center gap-1 cursor-pointer ${
                      previewTheme === "dark"
                        ? "bg-surface text-ink shadow-xs"
                        : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    <Moon className="h-3 w-3 text-indigo-400" /> Dark
                  </button>
                </div>
              )}
            </div>

            {viewMode === "code" ? (
              <textarea
                value={editing.html_body}
                onChange={(e) => setEditing({ ...editing, html_body: e.target.value })}
                className="flex-1 w-full min-h-[380px] p-4 border border-t-0 border-line rounded-b-xl font-mono text-[12.5px] text-ink bg-surface focus:outline-none focus:ring-1 focus:ring-primary/20 resize-y"
                placeholder="Paste your HTML template code here..."
              />
            ) : (
              <div
                className={`flex-1 w-full min-h-[380px] border border-t-0 border-line rounded-b-xl p-4 overflow-auto transition-colors ${
                  previewTheme === "light"
                    ? "bg-slate-100"
                    : "bg-zinc-900"
                }`}
              >
                <div className="max-w-xl mx-auto rounded-xl overflow-hidden shadow-sm bg-white">
                  <iframe
                    title="Template Live Preview"
                    srcDoc={renderedPreviewHtml}
                    className="w-full min-h-[360px] border-none block"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader
          title="Email Templates"
          subtitle="Design, preview, and manage HTML templates for your transactional emails."
        />
        <Button
          onClick={handleCreate}
          className="w-full sm:w-auto gap-1.5 whitespace-nowrap justify-center shrink-0"
        >
          <Plus className="h-4 w-4" /> Create Template
        </Button>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 flex flex-col border-transparent">
              <Skeleton className="h-10 w-10 mb-4 rounded-lg" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-6" />
              <div className="mt-auto pt-4 border-t border-line flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center border-dashed">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-ink mb-1.5">
            No templates created yet
          </h3>
          <p className="text-ink-3 text-[13px] sm:text-[14px] max-w-md mx-auto mb-6">
            Create reusable HTML templates for your onboarding emails, password resets, and receipts.
          </p>
          <Button
            onClick={handleCreate}
            className="w-full sm:w-auto whitespace-nowrap justify-center"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Create your first template
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t: any) => (
            <Card
              key={t.id}
              onClick={() => setEditing(t)}
              className="p-5 flex flex-col group hover:border-primary/40 transition-colors cursor-pointer min-w-0"
            >
              <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <LayoutTemplate className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(t);
                    }}
                    className="p-1.5 text-ink-3 hover:text-primary hover:bg-primary/10 rounded-md transition cursor-pointer"
                    title="Edit template"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteId(t.id);
                    }}
                    className="p-1.5 text-ink-3 hover:text-danger hover:bg-danger/10 rounded-md transition cursor-pointer"
                    title="Delete template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-ink text-[15px] truncate">{t.name}</h3>
              <p
                className="text-[12.5px] sm:text-[13px] text-ink-3 truncate mt-1 mb-4"
                title={t.subject}
              >
                {t.subject || "No subject set"}
              </p>

              <div className="mt-auto pt-3.5 border-t border-line flex items-center justify-between text-[11px] text-ink-4 min-w-0">
                <span>
                  Updated {t.updated_at ? new Date(t.updated_at).toLocaleDateString() : "Recently"}
                </span>
                <span className="font-mono bg-ink/[0.05] px-1.5 py-0.5 rounded text-ink truncate max-w-[90px]">
                  {t.id?.split("-")[0] ?? "id"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pendingDeleteId && (
        <ConfirmDeleteModal
          title="Delete Email Template?"
          description="Are you sure you want to delete this template? Transactional API calls using this template ID will fail."
          confirmLabel="Delete template"
          onConfirm={async () => {
            try {
              await delFn({ data: { id: pendingDeleteId } });
              await qc.invalidateQueries({ queryKey: ["email-templates"] });
            } finally {
              setPendingDeleteId(null);
            }
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
