import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Button } from "@/components/app/AppShell";
import { useState, useEffect } from "react";
import { LayoutTemplate, Plus, Edit, Trash2, Save, X, Eye, Code, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listTemplates, saveTemplate, deleteTemplate } from "@/lib/templates.functions";
import { Skeleton } from "@/components/Skeleton";

export const Route = createFileRoute("/_authenticated/_shell/templates")({
  component: TemplatesPage,
});

interface Template {
  id?: string;
  name: string;
  subject: string;
  html_body: string;
  updated_at?: string;
}

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; color: #333; }
    .button { display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <h2>Welcome to Mailcoy!</h2>
  <p>This is a sample transactional email template.</p>
  <a href="#" class="button">Confirm Email</a>
</body>
</html>`;

function TemplatesPage() {
  const qc = useQueryClient();
  const fetchTemplates = useServerFn(listTemplates);
  const saveFn = useServerFn(saveTemplate);
  const delFn = useServerFn(deleteTemplate);
  
  const { data: templates = [], isPending } = useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => fetchTemplates(),
  });

  const [editing, setEditing] = useState<Template | null>(null);
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [busy, setBusy] = useState(false);

  const handleCreate = () => {
    setEditing({
      name: "New Template",
      subject: "Your Subject Here",
      html_body: DEFAULT_TEMPLATE,
    });
    setViewMode("code");
  };

  const handleSave = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      await saveFn({ data: { id: editing.id, name: editing.name, subject: editing.subject, html_body: editing.html_body } });
      await qc.invalidateQueries({ queryKey: ["email-templates"] });
      setEditing(null);
    } catch (e) {
      alert("Failed to save template");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await delFn({ data: { id } });
        await qc.invalidateQueries({ queryKey: ["email-templates"] });
      } catch (e) {
        alert("Failed to delete template");
      }
    }
  };

  if (editing) {
    return (
      <div className="p-6 lg:p-10 max-w-6xl mx-auto flex flex-col h-full animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(null)} className="p-2 hover:bg-ink/[0.05] rounded-full transition">
              <X className="h-5 w-5 text-ink-3" />
            </button>
            <h1 className="text-2xl font-display font-bold text-ink">Edit Template</h1>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button variant="ghost" className="flex-1 sm:flex-none justify-center" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-none gap-2 justify-center"><Save className="h-4 w-4" /> Save</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
          <div className="md:col-span-1 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-ink-2">Template Name</label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-[13px] focus:outline-none focus:border-primary"
                placeholder="e.g. Welcome Email"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-ink-2">Email Subject</label>
              <input
                value={editing.subject}
                onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-[13px] focus:outline-none focus:border-primary"
                placeholder="e.g. Welcome to our platform!"
              />
            </div>
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h3 className="text-[13px] font-semibold text-primary mb-2 flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4" /> API Trigger
              </h3>
              <p className="text-[12px] text-ink-3 mb-3">
                You can trigger this template via the API using its ID:
              </p>
              <code className="block p-2 rounded bg-ink/[0.05] text-[11px] font-mono text-ink overflow-x-auto">
                {editing.id}
              </code>
            </Card>
          </div>
          <div className="md:col-span-2 flex flex-col">
            <div className="flex bg-surface-muted border border-line rounded-t-lg p-1 gap-1">
              <button
                onClick={() => setViewMode("code")}
                className={"flex-1 py-1.5 text-[13px] font-medium rounded-md transition " + (viewMode === "code" ? "bg-surface shadow-sm text-ink" : "text-ink-3 hover:text-ink-2")}
              >
                <Code className="h-3.5 w-3.5 inline-block mr-1.5 -mt-0.5" /> HTML Code
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={"flex-1 py-1.5 text-[13px] font-medium rounded-md transition " + (viewMode === "preview" ? "bg-surface shadow-sm text-ink" : "text-ink-3 hover:text-ink-2")}
              >
                <Eye className="h-3.5 w-3.5 inline-block mr-1.5 -mt-0.5" /> Preview
              </button>
            </div>
            {viewMode === "code" ? (
              <textarea
                value={editing.html_body}
                onChange={(e) => setEditing({ ...editing, html_body: e.target.value })}
                className="flex-1 w-full p-4 border border-t-0 border-line rounded-b-lg font-mono text-[13px] text-ink bg-surface focus:outline-none resize-none"
                placeholder="Paste your HTML here..."
              />
            ) : (
              <div className="flex-1 w-full border border-t-0 border-line rounded-b-lg bg-white overflow-hidden">
                <iframe
                  title="Template Preview"
                  srcDoc={editing.html_body}
                  className="w-full h-full border-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Email Templates" 
          subtitle="Design, preview, and manage HTML templates for your transactional emails." 
        />
        <Button onClick={handleCreate} className="gap-2">
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
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <LayoutTemplate className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-ink mb-2">No templates yet</h3>
          <p className="text-ink-3 text-[14px] max-w-md mx-auto mb-6">
            Create reusable HTML templates for your welcome emails, password resets, and notifications.
          </p>
          <Button onClick={handleCreate}>Create your first template</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t: any) => (
            <Card key={t.id} className="p-5 flex flex-col group hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-surface-muted border border-line flex items-center justify-center">
                  <LayoutTemplate className="h-5 w-5 text-ink-3 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing(t)} className="p-1.5 text-ink-3 hover:text-primary hover:bg-primary/10 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-ink-3 hover:text-red-500 hover:bg-red-500/10 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-ink text-[15px] truncate">{t.name}</h3>
              <p className="text-[13px] text-ink-3 truncate mt-1 mb-4" title={t.subject}>{t.subject}</p>
              
              <div className="mt-auto pt-4 border-t border-line flex items-center justify-between text-[11px] text-ink-4">
                <span>Updated {t.updated_at ? new Date(t.updated_at).toLocaleDateString() : 'Just now'}</span>
                <span className="font-mono bg-ink/[0.04] px-1.5 py-0.5 rounded truncate max-w-[100px]">{t.id?.split('-')[0] ?? 'new'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
