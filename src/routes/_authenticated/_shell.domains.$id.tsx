import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import {
  getDomain,
  verifyDomainNow,
  deleteDomain,
  autoConfigureCloudflareDNS,
} from "@/lib/domains.functions";
import {
  PageHeader,
  Card,
  Button,
  StatusPill,
  ConfirmDeleteModal,
} from "@/components/app/AppShell";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  Award,
  Sparkles,
  ShieldCheck,
  Info,
  Share2,
  Send,
  MessageSquare,
  LifeBuoy,
  X,
  ChevronRight,
  Globe,
  HelpCircle,
  Zap,
} from "lucide-react";
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
        <div className="space-y-2 w-full max-w-sm">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-5 h-48">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        ))}
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-2">Unable to load domain</h1>
      <p className="text-[13px] text-ink-3 mb-4">
        {friendlyError(error, "Failed to load domain details.")}
      </p>
      <div className="flex items-center gap-3">
        <button onClick={reset} className="h-9 px-3 rounded-md border border-line text-[13px]">
          Retry
        </button>
        <Link to="/domains" className="text-[13px] text-ink-3 hover:text-ink">
          Go back
        </Link>
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
        nsRecords: Array.isArray(json.nameservers)
          ? json.nameservers
          : Array.isArray(json.nsRecords)
            ? json.nsRecords
            : [],
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

  if (!data)
    return (
      <div className="p-8 text-ink-3">
        Not found.{" "}
        <Link to="/domains" className="underline">
          Back
        </Link>
      </div>
    );

  const d = data as {
    id: string;
    domain_name: string;
    verification_status: string;
    txt_record_value: string;
    dkim_selector: string;
    spf_value: string | null;
    dkim_value: string | null;
    txt_status: string;
    mx_status: string;
    spf_status: string;
    dkim_status: string;
    dmarc_status: string;
    bimi_status?: string;
    bimi_selector?: string;
    bimi_svg_url?: string;
    bimi_vmc_url?: string;
    last_checked_at: string | null;
    errors: string[] | null;
  };

  const registrarQ = useRegistrarDetect(d.domain_name);
  const bimiSelector = d.bimi_selector || "default";
  const bimiSvgUrl = d.bimi_svg_url || `https://${d.domain_name}/logo.svg`;
  const bimiVmcUrl = d.bimi_vmc_url || "";
  const [activeTab, setActiveTab] = useState<"required" | "recommended">("required");

  const requiredRecords = [
    {
      key: "TXT (Domain Ownership)",
      type: "TXT",
      host: "@",
      value: d.txt_record_value,
      priority: null,
      status: d.txt_status,
      hint: "Proves you own this domain",
    },
    {
      key: "MX (Primary Mail Route)",
      type: "MX",
      host: "@",
      value: "mx1.mailcoy.com",
      priority: 10,
      status: d.mx_status,
      hint: "Main email routing server",
    },
    {
      key: "MX (Secondary Backup Route)",
      type: "MX",
      host: "@",
      value: "mx2.mailcoy.com",
      priority: 20,
      status: d.mx_status,
      hint: "Redundant backup server",
    },
  ];

  const recommendedRecords = [
    {
      key: "SPF (Sender Authorization)",
      type: "TXT",
      host: "@",
      value: d.spf_value ?? "v=spf1 include:_spf.mailcoy.com ~all",
      priority: null,
      status: d.spf_status,
      hint: "Authorizes Mailcoy to send on your behalf",
    },
    {
      key: "DKIM (Email Signing)",
      type: "TXT",
      host: `${d.dkim_selector}._domainkey`,
      value: d.dkim_value ?? "v=DKIM1; k=rsa; p=<generated when SES is wired>",
      priority: null,
      status: d.dkim_status,
      hint: "Cryptographic signature preventing email tampering",
    },
    {
      key: "DMARC (Anti-Spoofing)",
      type: "TXT",
      host: "_dmarc",
      value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.com",
      priority: null,
      status: d.dmarc_status,
      hint: "Protects your brand against phishing & spam score drops",
    },
  ];

  const [autoChecking, setAutoChecking] = useState(false);

  // Real-time automatic background verifier (checks every 5s until verified)
  useEffect(() => {
    const isFullyVerified =
      d.verification_status === "verified" &&
      d.txt_status === "verified" &&
      d.mx_status === "verified";
    if (isFullyVerified) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      if (document.hidden) return; // Save resources if tab is backgrounded
      try {
        setAutoChecking(true);
        await verify({ data: { id } });
        if (isMounted) {
          await qc.invalidateQueries({ queryKey: ["domain", id] });
          await qc.invalidateQueries({ queryKey: ["domains"] });
        }
      } catch (err) {
        // silent background probe
      } finally {
        if (isMounted) setAutoChecking(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id, d.verification_status, d.txt_status, d.mx_status]);

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

  const [showShareModal, setShowShareModal] = useState(false);
  const [showVisualGuide, setShowVisualGuide] = useState(false);
  const [showConciergeModal, setShowConciergeModal] = useState(false);
  const [showCfModal, setShowCfModal] = useState(false);

  const isVerified = d.verification_status === "verified";

  return (
    <div>
      <PageHeader
        backTo="/domains"
        backLabel="Back to domains"
        title={d.domain_name}
        subtitle={
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span>
              {d.last_checked_at
                ? `Last checked ${new Date(d.last_checked_at).toLocaleTimeString()}`
                : "Checking DNS..."}
            </span>
            {!isVerified && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live auto-detecting DNS changes (5s)
              </span>
            )}
          </div>
        }
        actions={
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <StatusPill
              status={d.verification_status ?? "pending"}
              className="whitespace-nowrap shrink-0"
            />
            {!isVerified && (
              <Button
                onClick={() => setShowCfModal(true)}
                className="whitespace-nowrap shrink-0 text-[12.5px] h-9 px-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold border-amber-600 shadow-sm"
                title="Automatically configure all DNS records in 3 seconds via Cloudflare"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5 fill-current" /> 1-Click Cloudflare Setup
              </Button>
            )}
            <Button
              onClick={() => setShowShareModal(true)}
              variant="ghost"
              className="whitespace-nowrap shrink-0 text-[12.5px] h-9 px-3 border border-line bg-surface hover:bg-ink/5"
              title="Send DNS records to your webmaster, developer, or agency"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5 text-primary" /> Share with Webmaster
            </Button>
            <Button
              onClick={runVerify}
              disabled={busy || deleteBusy}
              className="whitespace-nowrap shrink-0 text-[12.5px] h-9 px-3.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${busy ? "animate-spin" : ""}`} /> Re-check
              now
            </Button>
            <Button
              onClick={() => {
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
              disabled={busy || deleteBusy}
              variant="ghost"
              className="whitespace-nowrap shrink-0 text-danger hover:text-danger hover:bg-danger/5 text-[12.5px] h-9 px-3"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        }
      />

      {/* 1-Click Cloudflare DNS Auto-Config Modal */}
      {showCfModal && (
        <CloudflareAutoConnectModal
          domainId={d.id}
          domainName={d.domain_name}
          onClose={() => setShowCfModal(false)}
          onSuccess={runVerify}
        />
      )}

      {/* Share with Webmaster Modal */}
      {showShareModal && (
        <ShareWithWebmasterModal
          domainName={d.domain_name}
          txtValue={d.txt_record_value}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Step-by-step Visual Walkthrough Modal */}
      {showVisualGuide && (
        <VisualGuideModal
          domainName={d.domain_name}
          txtValue={d.txt_record_value}
          onClose={() => setShowVisualGuide(false)}
        />
      )}

      {/* Free Concierge Setup Modal */}
      {showConciergeModal && (
        <ConciergeModal domainName={d.domain_name} onClose={() => setShowConciergeModal(false)} />
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          title={`Delete ${d.domain_name}?`}
          description={
            deleteError ??
            "This will permanently remove the domain and all its DNS setup from your workspace. You cannot delete a domain that has active employee emails assigned to it."
          }
          confirmLabel="Yes, delete domain"
          busy={deleteBusy}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeleteError(null);
          }}
          onConfirm={runDelete}
        />
      )}

      {/* Non-Technical Quick Assistant Banner */}
      <Card className="mb-6 p-4 border-emerald-500/20 bg-emerald-500/[0.03]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[13.5px] font-semibold text-ink">
                Not sure how to add these yourself?
              </h4>
              <p className="text-[12px] text-ink-3 mt-0.5">
                You don't need to be technical. Send these instructions to your developer with 1
                click, or follow our visual guide.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1.5 rounded-lg border border-line bg-surface text-ink text-[12px] font-semibold hover:bg-ink/5 transition flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5 text-primary" /> Send to Webmaster
            </button>
            <button
              onClick={() => setShowVisualGuide(true)}
              className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[12px] font-semibold hover:bg-emerald-500/20 transition flex items-center gap-1.5"
            >
              <HelpCircle className="h-3.5 w-3.5" /> Visual Guide
            </button>
          </div>
        </div>
      </Card>

      {/* Registrar Banner */}
      <RegistrarBanner query={registrarQ} domainName={d.domain_name} />

      {/* Cloudflare-Friendly DNS Records Card */}
      <Card className="p-0 mb-6 overflow-hidden">
        {/* Section Tabs */}
        <div className="p-3 sm:p-4 border-b border-line bg-surface-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="grid grid-cols-2 gap-1 p-1 bg-surface border border-line rounded-xl w-full sm:w-auto sm:flex sm:items-center">
            <button
              onClick={() => setActiveTab("required")}
              className={`flex items-center justify-center text-center px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-[12px] sm:text-[12.5px] font-semibold transition truncate ${
                activeTab === "required"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-ink-3 hover:text-ink hover:bg-ink/5"
              }`}
            >
              <span className="sm:hidden">1. Required (3)</span>
              <span className="hidden sm:inline">Step 1: Required (3 Records)</span>
            </button>
            <button
              onClick={() => setActiveTab("recommended")}
              className={`flex items-center justify-center text-center px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-[12px] sm:text-[12.5px] font-semibold transition truncate ${
                activeTab === "recommended"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-ink-3 hover:text-ink hover:bg-ink/5"
              }`}
            >
              <span className="sm:hidden">2. Deliverability (SPF)</span>
              <span className="hidden sm:inline">Step 2: Deliverability (SPF/DKIM)</span>
            </button>
          </div>

          <div className="text-[11.5px] sm:text-[12px] text-ink-3 font-medium flex items-center gap-1.5">
            {activeTab === "required" ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5 shrink-0" /> Just add these 3 to activate mail
                routing!
              </span>
            ) : (
              <span>Boosts inbox placement in Gmail & Outlook</span>
            )}
          </div>
        </div>

        {/* Cloudflare MX Helper Tip */}
        {activeTab === "required" && (
          <div className="mx-4 sm:mx-5 mt-4 p-3 rounded-lg border border-blue-500/20 bg-blue-500/[0.04] text-[12.5px] text-ink-2">
            <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1.5">
              <Info className="h-4 w-4 shrink-0" />
              Adding MX Records in Cloudflare:
            </div>
            <p className="text-[12px] text-ink-3 leading-relaxed">
              When adding MX in Cloudflare, enter <strong>Name</strong>:{" "}
              <code className="font-mono text-ink">@</code>, <strong>Mail server</strong>:{" "}
              <code className="font-mono text-ink">mx1.mailcoy.com</code>, and{" "}
              <strong>Priority</strong>:{" "}
              <code className="font-mono font-bold text-blue-700 dark:text-blue-400">10</code> (then
              repeat for <code>mx2.mailcoy.com</code> with Priority{" "}
              <code className="font-mono font-bold text-blue-700 dark:text-blue-400">20</code>).
            </p>
          </div>
        )}

        <ul className="divide-y divide-line mt-2">
          {activeRecords.map((r) => (
            <RecordRow key={r.key} r={r} />
          ))}
        </ul>
      </Card>

      {/* Deliverability & Spam Placement Shield Tester */}
      <DeliverabilityTester
        domainName={d.domain_name}
        spfStatus={d.spf_status}
        dkimStatus={d.dkim_status}
        dmarcStatus={d.dmarc_status}
        bimiStatus={d.bimi_status}
        mxStatus={d.mx_status}
      />

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
            {d.errors.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
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
            We couldn't auto-detect the registrar for{" "}
            <span className="font-mono">{domainName}</span>. Log in to wherever you purchased the
            domain and add the DNS records below. Changes can take up to 48 hours.
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
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 text-left hover:bg-ink/[0.02] transition"
        aria-expanded={expanded}
      >
        <img
          src={reg.logo}
          alt={reg.name}
          width={32}
          height={32}
          className="rounded-lg border border-line object-cover shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-medium truncate">
            Detected registrar:{" "}
            <span className="text-blue-700 dark:text-blue-400 font-semibold">{reg.name}</span>
          </div>
          <div className="text-[12px] text-ink-3 truncate">
            Nameservers: {ns.slice(0, 2).join(", ")}
            {ns.length > 2 ? ` +${ns.length - 2} more` : ""}
          </div>
        </div>
        <div className="text-[12px] text-ink-3 shrink-0 whitespace-nowrap pl-1">
          {expanded ? "Hide steps ↑" : "Show steps ↓"}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-blue-500/20 px-4 sm:px-5 pb-5 pt-4">
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

function RecordRow({
  r,
}: {
  r: {
    key: string;
    type: string;
    host: string;
    value: string;
    priority: number | null;
    status: string;
    hint?: string;
  };
}) {
  const [copiedValue, setCopiedValue] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);
  const [copiedPriority, setCopiedPriority] = useState(false);

  return (
    <li className="p-4 sm:px-5 sm:py-4.5 flex flex-col gap-3">
      {/* Top Header line */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13.5px] font-bold text-ink">{r.key}</span>
          {r.hint && <span className="text-[11.5px] text-ink-3 hidden sm:inline">· {r.hint}</span>}
        </div>
        <StatusPill status={r.status ?? "pending"} className="whitespace-nowrap shrink-0" />
      </div>

      {/* Grid of Cloudflare Fields */}
      <div className="grid grid-cols-1 md:grid-cols-[80px_minmax(180px,max-content)_1fr_auto] gap-2.5 sm:gap-3 items-center bg-surface-muted/50 p-3 rounded-xl border border-line/60 text-[12.5px]">
        {/* Type */}
        <div className="flex items-center justify-between md:block">
          <span className="text-[10.5px] font-semibold uppercase text-ink-3 tracking-wider md:block mb-0.5">
            Type
          </span>
          <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded inline-block">
            {r.type}
          </span>
        </div>

        {/* Name / Host */}
        <div className="min-w-0">
          <span className="text-[10.5px] font-semibold uppercase text-ink-3 tracking-wider block mb-0.5">
            Name (Host)
          </span>
          <div className="flex items-center gap-1.5 bg-surface border border-line px-2.5 py-1 rounded-lg">
            <code className="font-mono text-[12px] font-semibold text-ink whitespace-nowrap">
              {r.host}
            </code>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(r.host);
                setCopiedHost(true);
                setTimeout(() => setCopiedHost(false), 1500);
              }}
              className="text-ink-3 hover:text-ink p-0.5 rounded hover:bg-ink/5 shrink-0 transition"
              title="Copy host name"
            >
              {copiedHost ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Value / Mail Server */}
        <div className="min-w-0">
          <span className="text-[10.5px] font-semibold uppercase text-ink-3 tracking-wider block mb-0.5">
            {r.type === "MX" ? "Mail Server (Target)" : "Value / Content"}
          </span>
          <div className="flex items-center gap-1.5 bg-surface border border-line px-2.5 py-1 rounded-lg">
            <code className="font-mono text-[12px] truncate text-ink flex-1">{r.value}</code>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(r.value);
                setCopiedValue(true);
                setTimeout(() => setCopiedValue(false), 1500);
              }}
              className="text-ink-3 hover:text-ink p-1 rounded hover:bg-ink/5 shrink-0 transition"
              title="Copy value"
            >
              {copiedValue ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Priority (for MX) */}
        {r.priority !== null ? (
          <div className="flex items-center justify-between md:block border-t md:border-t-0 border-line/40 pt-2 md:pt-0">
            <span className="text-[10.5px] font-semibold uppercase text-ink-3 tracking-wider md:block mb-0.5">
              Priority
            </span>
            <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400 text-[13px]">
                {r.priority}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(String(r.priority));
                  setCopiedPriority(true);
                  setTimeout(() => setCopiedPriority(false), 1500);
                }}
                className="text-blue-600 hover:text-blue-800 p-0.5 rounded shrink-0"
                title="Copy Priority"
              >
                {copiedPriority ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:block w-4" />
        )}
      </div>
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
    <Card className="p-4 sm:p-6 mb-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.02] to-transparent overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h3 className="font-display text-[15px] font-semibold text-ink whitespace-nowrap">
              BIMI Brand Logo
            </h3>
            <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0">
              Verified Badge
            </span>
          </div>
          <p className="text-[12.5px] text-ink-3">
            Display your official brand logo next to outbound emails in Gmail, Apple Mail, and
            Yahoo!
          </p>
        </div>
        <StatusPill
          status={status}
          className="whitespace-nowrap shrink-0 self-start sm:self-center"
        />
      </div>

      {/* Startup Zero-Cost Logo Guide */}
      <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3.5 sm:p-4 text-[13px]">
        <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400 mb-1.5">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span className="text-[13px] font-semibold">
            Starting out? Show your logo for $0 on Gmail & Yahoo
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 text-ink-2 text-[12.5px] mt-2">
          <div className="p-3 rounded-lg border border-line bg-surface/70">
            <strong className="text-ink block mb-0.5">1. For Gmail Inboxes ($0)</strong>
            <span>
              Set your company logo as the Google Account avatar for your connected Gmail profile.
              Google will display this avatar next to all emails sent via Mailcoy.
            </span>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface/70">
            <strong className="text-ink block mb-0.5">2. For Yahoo! & Fastmail ($0)</strong>
            <span>
              Add the Self-Asserted BIMI DNS record below with your SVG logo URL. Yahoo & Fastmail
              do not require paid VMC certificates.
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11.5px] font-semibold text-ink-2 uppercase tracking-wider mb-1.5">
              1. Brand Logo SVG URL (Free · Yahoo / Fastmail)
            </label>
            <input
              type="url"
              value={customSvg}
              onChange={(e) => setCustomSvg(e.target.value)}
              placeholder={`https://${domainName}/brand-logo.svg`}
              className="w-full text-[12.5px] font-mono px-3.5 py-2.5 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[11px] text-ink-3 mt-1">
              Formatted as <code>SVG Tiny Portable/Secure</code> (square aspect ratio, no embedded
              scripts).
            </p>
          </div>

          <div>
            <label className="block text-[11.5px] font-semibold text-ink-2 uppercase tracking-wider mb-1.5">
              2. VMC Certificate URL (Optional · Blue Checkmark)
            </label>
            <input
              type="url"
              value={customVmc}
              onChange={(e) => setCustomVmc(e.target.value)}
              placeholder={`https://${domainName}/cert.pem`}
              className="w-full text-[12.5px] font-mono px-3.5 py-2.5 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[11px] text-ink-3 mt-1">
              Required for Google blue checkmarks. Issued by DigiCert or Entrust for registered
              trademarks.
            </p>
          </div>
        </div>

        {/* Live Generated Record */}
        <div className="rounded-xl border border-line bg-surface-muted p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-1 text-[11.5px] text-ink-3 font-medium mb-1.5">
            <span>Generated DNS Record:</span>
            <span>
              Host: <code className="font-mono text-ink font-semibold">{hostRecord}</code>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <code className="flex-1 text-[12px] font-mono bg-surface px-3 py-2.5 rounded-lg border border-line truncate text-ink">
              {generatedRecord}
            </code>
            <Button
              onClick={() => {
                navigator.clipboard?.writeText(generatedRecord);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              variant="ghost"
              className="h-10 px-4 shrink-0 border border-line justify-center whitespace-nowrap text-[12.5px]"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1.5" />
              )}
              {copied ? "Copied" : "Copy Record"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ShareWithWebmasterModal({
  domainName,
  txtValue,
  onClose,
}: {
  domainName: string;
  txtValue: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const instructionsText = `Hi! Please add the following DNS records for ${domainName} so our company email starts working on Mailcoy:

1. DOMAIN OWNERSHIP (TXT Record):
• Type: TXT
• Name / Host: @
• Value: ${txtValue}

2. PRIMARY MAIL SERVER (MX Record):
• Type: MX
• Name / Host: @
• Mail Server: mx1.mailcoy.com
• Priority: 10

3. BACKUP MAIL SERVER (MX Record):
• Type: MX
• Name / Host: @
• Mail Server: mx2.mailcoy.com
• Priority: 20

(Optional Deliverability SPF):
• Type: TXT
• Name / Host: @
• Value: v=spf1 include:_spf.mailcoy.com ~all

Please let me know once these records are saved so I can click verify. Thank you!`;

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(`DNS Records Setup for ${domainName}`)}&body=${encodeURIComponent(instructionsText)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(instructionsText)}`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="relative w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl border border-line bg-surface shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-[16px] font-bold text-ink">
                  Share with Webmaster or IT
                </h3>
                <p className="text-[12.5px] text-ink-3">
                  Send these pre-formatted instructions directly to your developer
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-ink/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-[11.5px] font-semibold text-ink-2 uppercase tracking-wider">
              Pre-written Instructions
            </label>
            <div className="relative">
              <textarea
                readOnly
                rows={10}
                value={instructionsText}
                className="w-full text-[12px] font-mono p-3 rounded-xl border border-line bg-surface-muted/60 text-ink resize-none focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-line">
            <Button
              onClick={() => {
                navigator.clipboard?.writeText(instructionsText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 h-10 text-[13px] font-semibold"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-1.5 text-emerald-300" />
              ) : (
                <Copy className="h-4 w-4 mr-1.5" />
              )}
              {copied ? "Copied to Clipboard!" : "Copy Full Message"}
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-[13px] hover:bg-emerald-500/20 transition whitespace-nowrap"
            >
              <MessageSquare className="h-4 w-4 mr-1.5" /> WhatsApp
            </a>
            <a
              href={mailtoUrl}
              className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-line bg-surface text-ink font-semibold text-[13px] hover:bg-ink/5 transition whitespace-nowrap"
            >
              <Send className="h-4 w-4 mr-1.5 text-primary" /> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualGuideModal({
  domainName,
  txtValue,
  onClose,
}: {
  domainName: string;
  txtValue: string;
  onClose: () => void;
}) {
  const [registrarTab, setRegistrarTab] = useState<
    "cloudflare" | "godaddy" | "namecheap" | "other"
  >("cloudflare");

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl border border-line bg-surface shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-[16px] font-bold text-ink">
                Visual DNS Setup Guide
              </h3>
              <p className="text-[12.5px] text-ink-3">
                Step-by-step walkthrough for your domain registrar
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-ink/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Registrar switcher */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-surface-muted rounded-xl border border-line">
            {[
              { id: "cloudflare", label: "Cloudflare" },
              { id: "godaddy", label: "GoDaddy" },
              { id: "namecheap", label: "Namecheap" },
              { id: "other", label: "Google / Other" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setRegistrarTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition ${
                  registrarTab === t.id
                    ? "bg-surface text-ink shadow-xs border border-line"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Guide steps */}
          {registrarTab === "cloudflare" && (
            <div className="space-y-3 text-[13px]">
              <div className="p-3.5 rounded-xl border border-line bg-surface/60 space-y-1.5">
                <div className="font-bold text-ink flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] grid place-items-center font-mono">
                    1
                  </span>
                  Open Cloudflare DNS
                </div>
                <p className="text-ink-3 text-[12px] pl-7">
                  Log into your Cloudflare dashboard, select{" "}
                  <strong className="text-ink">{domainName}</strong>, and click{" "}
                  <strong>"DNS" → "Records"</strong> on the left sidebar.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-line bg-surface/60 space-y-1.5">
                <div className="font-bold text-ink flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] grid place-items-center font-mono">
                    2
                  </span>
                  Add Ownership TXT Record
                </div>
                <p className="text-ink-3 text-[12px] pl-7">
                  Click the blue <strong>"Add record"</strong> button. Select Type:{" "}
                  <strong className="text-ink">TXT</strong>, Name:{" "}
                  <strong className="text-ink">@</strong>, Content:{" "}
                  <code className="font-mono text-[11px] bg-ink/5 px-1 py-0.5 rounded">
                    {txtValue}
                  </code>
                  , and click <strong>Save</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-line bg-surface/60 space-y-1.5">
                <div className="font-bold text-ink flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] grid place-items-center font-mono">
                    3
                  </span>
                  Add MX Records (With Priority 10 & 20)
                </div>
                <p className="text-ink-3 text-[12px] pl-7">
                  Click <strong>"Add record"</strong> again. Select Type:{" "}
                  <strong className="text-ink">MX</strong>, Name:{" "}
                  <strong className="text-ink">@</strong>, Mail server:{" "}
                  <code className="font-mono text-[11px]">mx1.mailcoy.com</code>, Priority:{" "}
                  <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                    10
                  </strong>
                  . Save, then repeat for{" "}
                  <code className="font-mono text-[11px]">mx2.mailcoy.com</code> with Priority{" "}
                  <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                    20
                  </strong>
                  .
                </p>
              </div>
            </div>
          )}

          {registrarTab === "godaddy" && (
            <div className="space-y-3 text-[13px]">
              <div className="p-3.5 rounded-xl border border-line bg-surface/60 space-y-1.5">
                <div className="font-bold text-ink flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] grid place-items-center font-mono">
                    1
                  </span>
                  Open GoDaddy DNS Management
                </div>
                <p className="text-ink-3 text-[12px] pl-7">
                  Go to "My Products", find <strong className="text-ink">{domainName}</strong>, and
                  click <strong>"DNS"</strong>.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-line bg-surface/60 space-y-1.5">
                <div className="font-bold text-ink flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] grid place-items-center font-mono">
                    2
                  </span>
                  Add New Records
                </div>
                <p className="text-ink-3 text-[12px] pl-7">
                  Click <strong>"Add New Record"</strong>. Enter Type: <strong>MX</strong>, Name:{" "}
                  <strong>@</strong>, Value: <strong>mx1.mailcoy.com</strong>, Priority:{" "}
                  <strong>10</strong>, TTL: <strong>1 Hour</strong>.
                </p>
              </div>
            </div>
          )}

          {registrarTab === "namecheap" && (
            <div className="space-y-3 text-[13px]">
              <div className="p-3.5 rounded-xl border border-line bg-surface/60 space-y-1.5">
                <div className="font-bold text-ink flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] grid place-items-center font-mono">
                    1
                  </span>
                  Namecheap Advanced DNS
                </div>
                <p className="text-ink-3 text-[12px] pl-7">
                  Go to Domain List → Manage → <strong>"Advanced DNS"</strong>.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-line bg-surface/60 space-y-1.5">
                <div className="font-bold text-ink flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] grid place-items-center font-mono">
                    2
                  </span>
                  Set Mail Settings to Custom MX
                </div>
                <p className="text-ink-3 text-[12px] pl-7">
                  Scroll down to <strong>"Mail Settings"</strong>, select{" "}
                  <strong>"Custom MX"</strong>, and add{" "}
                  <code className="font-mono">mx1.mailcoy.com</code> (Priority: 10).
                </p>
              </div>
            </div>
          )}

          {registrarTab === "other" && (
            <div className="space-y-3 text-[13px]">
              <div className="p-3.5 rounded-xl border border-line bg-surface/60 space-y-1.5">
                <p className="text-ink-2 leading-relaxed">
                  Every registrar (Hostinger, Bluehost, Google Domains / Squarespace) has a{" "}
                  <strong>DNS Zone Editor</strong>. Just look for <strong>"Add Record"</strong>,
                  choose <strong>TXT</strong> or <strong>MX</strong>, set Host to <strong>@</strong>
                  , and paste the values.
                </p>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-line flex justify-end">
            <Button onClick={onClose} className="h-9 px-5">
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConciergeModal({ domainName, onClose }: { domainName: string; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-line bg-surface shadow-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-[16px] font-bold text-ink">Free Concierge Setup</h3>
              <p className="text-[12px] text-ink-3">
                Let our support team handle DNS setup for you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-ink/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-ink text-[14px]">Request Received!</h4>
            <p className="text-[12.5px] text-ink-3">
              Our setup engineer will review <strong className="text-ink">{domainName}</strong> and
              send you a verification update within 2 hours.
            </p>
            <Button onClick={onClose} className="mt-2 h-9 px-4">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-3 text-[13px]">
            <p className="text-ink-2 leading-relaxed">
              Don't have time or prefer not to configure DNS records yourself? Our technical
              concierge can guide you over live chat or configure your registrar for free.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} className="h-9 px-3">
                Cancel
              </Button>
              <Button onClick={() => setSubmitted(true)} className="h-9 px-4">
                Request Free Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CloudflareAutoConnectModal({
  domainId,
  domainName,
  onClose,
  onSuccess,
}: {
  domainId: string;
  domainName: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const autoCf = useServerFn(autoConfigureCloudflareDNS);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleAutoConfig(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await autoCf({
        data: {
          domainId,
          cloudflareApiToken: token.trim(),
        },
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to auto-configure Cloudflare DNS");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-surface border border-line p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="h-5 w-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-display text-[16px] font-bold text-ink">
                1-Click Cloudflare DNS Setup
              </h3>
              <p className="text-[12px] text-ink-3">
                Automatically write all 5 records to {domainName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-ink/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-ink text-[14px]">Cloudflare DNS Configured!</h4>
            <p className="text-[12.5px] text-ink-3">
              All 5 records (TXT, MX 10, MX 20, SPF, DMARC) were written to Cloudflare.
              Auto-verifying now...
            </p>
          </div>
        ) : (
          <form onSubmit={handleAutoConfig} className="space-y-4 text-[13px]">
            <p className="text-ink-2 leading-relaxed">
              Mailcoy can instantly write your{" "}
              <strong>TXT verification, MX routers, SPF, and DMARC</strong> records directly to your
              Cloudflare account in seconds.
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-ink text-[12px]">Cloudflare API Token</label>
                <a
                  href="https://dash.cloudflare.com/profile/api-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-[11.5px] inline-flex items-center gap-1 font-medium"
                >
                  Create token on Cloudflare <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <input
                type="password"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. 7qX_... (with Zone:DNS:Edit permission)"
                className="w-full h-10 px-3 rounded-lg border border-line bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/20 text-[13px] font-mono text-ink"
              />
              <p className="text-[11.5px] text-ink-3">
                Tip: On Cloudflare, click <em>"Create Token"</em> ➔ use the pre-made{" "}
                <strong>"Edit zone DNS"</strong> template and select <strong>{domainName}</strong>.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg border border-danger/20 bg-danger/5 text-danger text-[12.5px]">
                {error}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose} className="h-9 px-3">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={busy || !token.trim()}
                className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                {busy ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Configuring DNS...
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5 mr-1.5 fill-current" /> Auto-Configure DNS Now
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
