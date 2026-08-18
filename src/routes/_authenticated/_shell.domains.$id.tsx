import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getDomain, verifyDomainNow, deleteDomain } from "@/lib/domains.functions";
import { PageHeader, Card, Button, StatusPill, ConfirmDeleteModal } from "@/components/app/AppShell";
import { CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Trash2, Copy, ExternalLink, Check, Award, Sparkles, ShieldCheck, Info } from "lucide-react";
import { DeliverabilityTester } from "@/components/DeliverabilityTester";
import { Skeleton } from "@/components/Skeleton";
import { friendlyError } from "@/lib/errors";

const detailOpts = (id: string) =>
  queryOptions({
    queryKey: ["domain", id],
    queryFn: async () => getDomain({ data: { id } }),
    staleTime: 5_000,
  });

export const Route = createFileRoute("/_authenticated/_shell/domains/$id")({
  head: () => ({ meta: [{ title: "Domain — Mailcoy" }] }),
  loader: ({ context, params }: any) => context.queryClient.ensureQueryData(detailOpts(params.id)),
  pendingMs: 0,
  pendingComponent: () => (
    <div className="space-y-6 pb-16">
      <Link to="/domains" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-3">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to domains
      </Link>
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 w-full max-w-sm"><Skeleton className="h-8 w-40" /><Skeleton className="h-4 w-60" /></div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => <Card key={i} className="p-5 h-48"><Skeleton className="h-5 w-32 mb-4" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></Card>)}
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-2">Unable to load domain</h1>
      <p className="text-[13px] text-ink-3 mb-4">{friendlyError(error, "Failed to load domain details.")}</p>
      <div className="flex items-center gap-3">
        <button onClick={reset} className="h-9 px-3 rounded-md border border-line text-[13px]">Retry</button>
        <Link to="/domains" className="text-[13px] text-ink-3 hover:text-ink">Go back</Link>
      </div>
    </div>
  ),
  component: DomainDetailRoute,
});

type RegistrarInfo = {
  id: string;
  name: string;
  logo: string;
  helpUrl: string;
  steps: string[];
} | null;

function useRegistrarDetect(domainName: string) {
  return useQuery({
    queryKey: ["registrar", domainName],
    queryFn: async (): Promise<{ registrar: RegistrarInfo; nsRecords: string[] }> => {
      const res = await fetch(`/api/registrar-detect?domain=${encodeURIComponent(domainName)}`);
      if (!res.ok) throw new Error("Failed to detect registrar");
      const json = await res.json();
      // API returns 'nameservers', normalise to 'nsRecords' for the component
      return {
        registrar: json.registrar ?? null,
        nsRecords: Array.isArray(json.nameservers) ? json.nameservers : (Array.isArray(json.nsRecords) ? json.nsRecords : []),
      };
    },
    staleTime: 5 * 60_000, // cache for 5 min — NS records rarely change
    retry: 1,
  });
}

function DomainDetailRoute() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ["domain", id],
      queryFn: async () => getDomain({ data: { id } }),
      staleTime: 5_000,
      refetchInterval: (q) => {
        const d = q.state.data as { verification_status?: string } | null | undefined;
        return d && d.verification_status !== "verified" ? 30_000 : false;
      },
    }),
  );
  const verify = useServerFn(verifyDomainNow);
  const del = useServerFn(deleteDomain);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!data) return <div className="p-8 text-ink-3">Not found. <Link to="/domains" className="underline">Back</Link></div>;

  const d = data as {
    id: string; domain_name: string; verification_status: string;
    txt_record_value: string; dkim_selector: string;
    spf_value: string | null; dkim_value: string | null;
    txt_status: string; mx_status: string; spf_status: string; dkim_status: string; dmarc_status: string;
    bimi_status?: string; bimi_selector?: string; bimi_svg_url?: string; bimi_vmc_url?: string;
    last_checked_at: string | null; errors: string[] | null;
  };

  const registrarQ = useRegistrarDetect(d.domain_name);
  const bimiSelector = d.bimi_selector || "default";
  const bimiSvgUrl = d.bimi_svg_url || `https://${d.domain_name}/logo.svg`;
  const bimiVmcUrl = d.bimi_vmc_url || "";
  const bimiRecordValue = `v=BIMI1; l=${bimiSvgUrl};${bimiVmcUrl ? ` a=${bimiVmcUrl};` : ""}`;

  const records = [
    { key: "TXT (Ownership)", type: "TXT", host: "@", value: d.txt_record_value, status: d.txt_status },
    { key: "MX (Primary)", type: "MX 10", host: "@", value: "mx1.mailcoy.com", status: d.mx_status },
    { key: "MX (Secondary)", type: "MX 20", host: "@", value: "mx2.mailcoy.com", status: d.mx_status },
    { key: "SPF", type: "TXT", host: "@", value: d.spf_value ?? "v=spf1 include:_spf.mailcoy.com ~all", status: d.spf_status },
    { key: "DKIM", type: "TXT", host: `${d.dkim_selector}._domainkey`, value: d.dkim_value ?? "v=DKIM1; k=rsa; p=<generated when SES is wired>", status: d.dkim_status },
    { key: "DMARC", type: "TXT", host: "_dmarc", value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.com", status: d.dmarc_status },
    { key: "BIMI (Brand Logo)", type: "TXT", host: `${bimiSelector}._bimi`, value: bimiRecordValue, status: d.bimi_status ?? "not_configured" },
  ];

  async function runVerify() {
    setBusy(true);
    try {
      await verify({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["domain", id] });
      await qc.invalidateQueries({ queryKey: ["domains"] });
    } finally {
      setBusy(false);
    }
  }

  async function runDelete() {
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await del({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["domains"] });
      navigate({ to: "/domains" });
    } catch (e: any) {
      setDeleteError(e.message || "Failed to delete domain");
      setDeleteBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={d.domain_name}
        subtitle={d.last_checked_at ? `Last checked ${new Date(d.last_checked_at).toLocaleString()}` : "Not checked yet"}
        actions={
          <div className="flex items-center gap-2">
            <StatusPill status={d.verification_status ?? "pending"} />
            <Button onClick={runVerify} disabled={busy || deleteBusy}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${busy ? "animate-spin" : ""}`} /> Re-check now
            </Button>
            <Button onClick={() => { setDeleteError(null); setShowDeleteModal(true); }} disabled={busy || deleteBusy} variant="ghost" className="text-danger hover:text-danger hover:bg-danger/5">
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete
            </Button>
          </div>
        }
      />

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          title={`Delete ${d.domain_name}?`}
          description={deleteError ?? "This will permanently remove the domain and all its DNS setup from your workspace. You cannot delete a domain that has active employee emails assigned to it."}
          confirmLabel="Yes, delete domain"
          busy={deleteBusy}
          onCancel={() => { setShowDeleteModal(false); setDeleteError(null); }}
          onConfirm={runDelete}
        />
      )}

      {/* Registrar Banner */}
      <RegistrarBanner query={registrarQ} domainName={d.domain_name} />

      {/* Deliverability & Spam Placement Shield Tester */}
      <DeliverabilityTester
        domainName={d.domain_name}
        spfStatus={d.spf_status}
        dkimStatus={d.dkim_status}
        dmarcStatus={d.dmarc_status}
        bimiStatus={d.bimi_status}
        mxStatus={d.mx_status}
      />

      {/* DNS Records List */}
      <Card className="p-0 mb-6">
        <div className="px-5 py-3 border-b border-line text-[13px] font-medium flex items-center justify-between">
          <span>DNS records to add</span>
          <span className="text-[11px] text-ink-3">Required: TXT & MX · Recommended: SPF, DKIM, DMARC, BIMI</span>
        </div>
        <ul className="divide-y divide-line">
          {records.map((r) => <RecordRow key={r.key} r={r} />)}
        </ul>
      </Card>

      {/* BIMI Brand Indicators Card */}
      <BimiConfigCard
        domainName={d.domain_name}
        bimiSelector={bimiSelector}
        bimiSvgUrl={bimiSvgUrl}
        bimiVmcUrl={bimiVmcUrl}
        status={d.bimi_status ?? "not_configured"}
      />

      {d.errors && d.errors.length > 0 && (
        <Card className="p-5 border-danger/40 bg-danger/[0.03] mb-6">
          <h3 className="text-[13px] font-medium text-danger mb-2">Verification notes</h3>
          <ul className="space-y-1 text-[13px] text-ink-2">
            {d.errors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
        </Card>
      )}
    </div>
  );
}

function RegistrarBanner({
  query,
  domainName,
}: {
  query: ReturnType<typeof useRegistrarDetect>;
  domainName: string;
}) {
  const [expanded, setExpanded] = useState(false);

  if (query.isLoading) {
    return (
      <div className="mb-6 rounded-2xl border border-line bg-surface-muted p-4 animate-pulse flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-ink/10 shrink-0" />
        <div className="h-4 w-48 rounded bg-ink/10" />
      </div>
    );
  }

  if (query.isError || !query.data?.registrar) {
    // Unknown registrar — show generic guidance
    return (
      <Card className="mb-6 p-4 flex items-start gap-3 border-amber-500/30 bg-amber-500/[0.04]">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <div className="text-[13px] font-medium">Add these records in your DNS provider</div>
          <p className="text-[12.5px] text-ink-3 mt-0.5">
            We couldn't auto-detect the registrar for <span className="font-mono">{domainName}</span>. Log in to wherever you purchased the domain and add the DNS records below. Changes can take up to 48 hours.
          </p>
        </div>
      </Card>
    );
  }

  const reg = query.data.registrar;
  const ns = query.data.nsRecords ?? [];

  return (
    <Card className="mb-6 p-0 overflow-hidden border-blue-500/20 bg-blue-500/[0.03]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-ink/[0.02] transition"
        aria-expanded={expanded}
      >
        <img
          src={reg.logo}
          alt={reg.name}
          width={32}
          height={32}
          className="rounded-lg border border-line object-cover shrink-0"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-medium">
            Detected registrar: <span className="text-blue-700 dark:text-blue-400">{reg.name}</span>
          </div>
          <div className="text-[12px] text-ink-3 truncate">
            Nameservers: {ns.slice(0, 2).join(", ")}{ns.length > 2 ? ` +${ns.length - 2} more` : ""}
          </div>
        </div>
        <div className="text-[12px] text-ink-3 shrink-0 pr-1">
          {expanded ? "Hide steps ↑" : "Show steps ↓"}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-blue-500/20 px-5 pb-5 pt-4">
          <h3 className="text-[13px] font-semibold mb-3 flex items-center gap-1.5">
            How to add DNS records in {reg.name}
            <a
              href={reg.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </h3>
          <ol className="space-y-2">
            {reg.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-ink-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-bold mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}

function RecordRow({ r }: { r: { key: string; type: string; host: string; value: string; status: string } }) {
  const [copied, setCopied] = useState(false);
  return (
    <li className="px-5 py-4 grid grid-cols-[130px_1fr_auto] gap-3 items-center">
      <div className="text-[12px] font-medium text-ink-2">{r.key}</div>
      <div className="min-w-0">
        <div className="text-[11px] text-ink-3">
          Type: <span className="font-mono text-ink">{r.type}</span> · Host: <span className="font-mono text-ink">{r.host}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <code className="text-[12.5px] font-mono truncate">{r.value}</code>
          <button
            onClick={() => { navigator.clipboard?.writeText(r.value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="text-ink-3 hover:text-ink"
            title="Copy"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <StatusPill status={r.status ?? "pending"} />
    </li>
  );
}

function BimiConfigCard({
  domainName,
  bimiSelector,
  bimiSvgUrl,
  bimiVmcUrl,
  status,
}: {
  domainName: string;
  bimiSelector: string;
  bimiSvgUrl: string;
  bimiVmcUrl: string;
  status: string;
}) {
  const [customSvg, setCustomSvg] = useState(bimiSvgUrl);
  const [customVmc, setCustomVmc] = useState(bimiVmcUrl);
  const [copied, setCopied] = useState(false);

  const generatedRecord = `v=BIMI1; l=${customSvg.trim()};${customVmc.trim() ? ` a=${customVmc.trim()};` : ""}`;
  const hostRecord = `${bimiSelector}._bimi`;

  return (
    <Card className="p-6 mb-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.02] to-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-display text-[15px] font-semibold text-ink">BIMI & Brand Logo Display</h3>
            <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Visual Trust & Badging
            </span>
          </div>
          <p className="text-[12.5px] text-ink-3">
            Display your official brand logo next to outbound emails in Gmail, Apple Mail, and Yahoo!
          </p>
        </div>
        <StatusPill status={status} />
      </div>

      {/* Startup Zero-Cost Logo Guide */}
      <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 text-[13px]">
        <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400 mb-1.5">
          <Sparkles className="h-4 w-4" />
          <span>Starting out? Show your logo for $0 on Gmail & Yahoo</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-ink-2 text-[12.5px] mt-2">
          <div className="p-3 rounded-lg border border-line bg-surface/70">
            <strong className="text-ink block mb-0.5">1. For Gmail Inboxes ($0)</strong>
            <span>Set your company logo as the Google Account avatar for your connected Gmail profile. Google will display this avatar next to all emails sent via Mailcoy.</span>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface/70">
            <strong className="text-ink block mb-0.5">2. For Yahoo! & Fastmail ($0)</strong>
            <span>Add the Self-Asserted BIMI DNS record below with your SVG logo URL. Yahoo & Fastmail do not require paid VMC certificates.</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11.5px] font-medium text-ink-2 uppercase tracking-wider mb-1.5">
              1. Brand Logo SVG URL (Free · Yahoo / Fastmail)
            </label>
            <input
              type="url"
              value={customSvg}
              onChange={(e) => setCustomSvg(e.target.value)}
              placeholder={`https://${domainName}/brand-logo.svg`}
              className="w-full text-[12.5px] font-mono px-3 py-2 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[11px] text-ink-3 mt-1">
              Formatted as <code>SVG Tiny Portable/Secure</code> (square aspect ratio, no embedded scripts).
            </p>
          </div>

          <div>
            <label className="block text-[11.5px] font-medium text-ink-2 uppercase tracking-wider mb-1.5">
              2. VMC / CMC Certificate URL (Optional · Gmail Blue Checkmark)
            </label>
            <input
              type="url"
              value={customVmc}
              onChange={(e) => setCustomVmc(e.target.value)}
              placeholder={`https://${domainName}/cert.pem`}
              className="w-full text-[12.5px] font-mono px-3 py-2 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[11px] text-ink-3 mt-1">
              Required for Google blue checkmarks. Issued by DigiCert or Entrust for registered trademarks.
            </p>
          </div>
        </div>

        {/* Live Generated Record */}
        <div className="rounded-xl border border-line bg-surface-muted p-3.5">
          <div className="flex items-center justify-between text-[11.5px] text-ink-3 font-medium mb-1.5">
            <span>Generated DNS Record:</span>
            <span>Host: <code className="font-mono text-ink">{hostRecord}</code></span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[12px] font-mono bg-surface px-3 py-2 rounded-md border border-line truncate text-ink">
              {generatedRecord}
            </code>
            <Button
              onClick={() => {
                navigator.clipboard?.writeText(generatedRecord);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              variant="ghost"
              className="h-9 px-3 shrink-0 border border-line"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              {copied ? "Copied" : "Copy Record"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
