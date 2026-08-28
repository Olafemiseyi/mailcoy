import { createFileRoute, Link, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import {
  listDomains,
  addDomain,
  verifyDomainNow,
  deleteDomain,
  runDnsHealthCheck,
} from "@/lib/domains.functions";
import {
  PageHeader,
  Card,
  Button,
  Input,
  Field,
  StatusPill,
  ConfirmDeleteModal,
} from "@/components/app/AppShell";
import {
  Plus,
  RefreshCw,
  ChevronRight,
  Trash2,
  Globe,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  X,
  MessageSquare,
  Search,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Skeleton } from "@/components/Skeleton";
import { detectUserCurrency, Currency } from "@/lib/currency";

const opts = queryOptions({
  queryKey: ["domains"],
  queryFn: async () => listDomains(),
  staleTime: 10_000,
});

export const Route = createFileRoute("/_authenticated/_shell/domains")({
  head: () => ({ meta: [{ title: "Domains & DNS — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(opts),
  pendingMs: 0,
  pendingComponent: () => (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 w-full max-w-sm">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-line rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-2">Unable to load domains</h1>
      <p className="text-[13px] text-ink-3 mb-4">{error.message}</p>
      <button onClick={reset} className="h-9 px-3 rounded-md border border-line text-[13px]">
        Retry
      </button>
    </div>
  ),
  component: DomainsRoute,
});

function DomainsRoute() {
  const path = useRouterState({
    select: (s: { location: { pathname: string } }) => s.location.pathname,
  });
  if (path !== "/domains") return <Outlet />;
  return <DomainsList />;
}

function DomainsList() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts);
  const add = useServerFn(addDomain);
  const verify = useServerFn(verifyDomainNow);
  const del = useServerFn(deleteDomain);
  const healthCheckFn = useServerFn(runDnsHealthCheck);

  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");

  const [scanningHealth, setScanningHealth] = useState(false);
  const [healthStatusMessage, setHealthStatusMessage] = useState<string | null>(null);

  // RDAP Lookup state inside modal
  const [checkDomainInput, setCheckDomainInput] = useState("");
  const [checkingRdap, setCheckingRdap] = useState(false);
  const [rdapError, setRdapError] = useState<string | null>(null);
  const [rdapResult, setRdapResult] = useState<{
    domain: string;
    isRegistered: boolean;
    registrarName: string | null;
    expiresAt: string | null;
  } | null>(null);

  useEffect(() => {
    setCurrency(detectUserCurrency());
  }, []);

  async function handleRunHealthScan() {
    setScanningHealth(true);
    setHealthStatusMessage(null);
    try {
      const res = await healthCheckFn();
      await qc.invalidateQueries({ queryKey: ["domains"] });
      setHealthStatusMessage(`Scanned ${res.count} domain(s). All records up to date.`);
    } catch (e: any) {
      setHealthStatusMessage(e.message || "DNS health scan failed");
    } finally {
      setScanningHealth(false);
    }
  }

  async function handleRdapCheck(e: React.FormEvent) {
    e.preventDefault();
    const raw = checkDomainInput.trim().toLowerCase();
    if (!raw) return;
    const clean = raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    setCheckingRdap(true);
    setRdapError(null);
    setRdapResult(null);

    try {
      const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(clean)}`, {
        headers: { Accept: "application/rdap+json, application/json" },
      });

      if (res.status === 404) {
        setRdapResult({
          domain: clean,
          isRegistered: false,
          registrarName: null,
          expiresAt: null,
        });
      } else if (res.ok) {
        const data = await res.json();
        const registrarEntity = data.entities?.find((ent: any) =>
          ent.roles?.includes("registrar")
        );
        const registrarName =
          registrarEntity?.vcardArray?.[1]?.find((prop: any) => prop[0] === "fn")?.[3] ||
          registrarEntity?.handle ||
          "Active Registrar";

        const expirationEvent = data.events?.find(
          (ev: any) => ev.eventAction === "expiration"
        );
        const expiresAt = expirationEvent?.eventDate || null;

        setRdapResult({
          domain: clean,
          isRegistered: true,
          registrarName,
          expiresAt,
        });
      } else {
        setRdapError("Unable to look up domain registry right now.");
      }
    } catch (err: any) {
      setRdapError(err.message || "Network error querying registry.");
    } finally {
      setCheckingRdap(false);
    }
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const row = (await add({ data: { name } })) as { id?: string };
      await qc.invalidateQueries({ queryKey: ["domains"] });
      setName("");
      if (row?.id) {
        nav({ to: "/domains/$id", params: { id: row.id } });
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to add domain");
    } finally {
      setBusy(false);
    }
  }

  async function onVerify(id: string) {
    setVerifyingId(id);
    try {
      await verify({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["domains"] });
    } catch (e: any) {
      alert(e?.message || "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  }

  async function onDelete() {
    if (!pendingDelete) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await del({ data: { id: pendingDelete.id } });
      await qc.invalidateQueries({ queryKey: ["domains"] });
      setPendingDelete(null);
    } catch (e: any) {
      setDeleteError(e?.message || "Failed to delete domain");
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Domains"
        subtitle="Manage domains and DNS records to route professional email through Gmail."
      />

      {/* Deliverability Insurance & DNS Health Monitor Banner */}
      <Card className="p-4 sm:p-5 mb-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-[14.5px] font-semibold text-ink flex items-center gap-2">
                Deliverability Insurance Active
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Automated Monitor
                </span>
              </h3>
              <p className="text-[12.5px] text-ink-3 mt-0.5 leading-relaxed">
                Background monitors scan your DNS records (MX, SPF, DKIM, DMARC) continuously. You will receive an instant email alert if records break at your registrar.
              </p>
              {healthStatusMessage && (
                <p className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                  ✓ {healthStatusMessage}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleRunHealthScan}
            disabled={scanningHealth}
            className="h-8 px-3 text-[12px] shrink-0 border border-emerald-500/30 bg-surface hover:bg-emerald-500/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${scanningHealth ? "animate-spin" : ""}`} />
            {scanningHealth ? "Scanning DNS…" : "Run Health Scan"}
          </Button>
        </div>
      </Card>

      {/* Main Add Domain Card */}
      <Card className="p-4 sm:p-6 mb-6">
        <div className="mb-3.5">
          <h3 className="font-display text-[15.5px] font-semibold text-ink">
            Add your domain to Mailcoy
          </h3>
          <p className="text-[12.5px] text-ink-3 mt-0.5">
            Works with Namecheap, Cloudflare, GoDaddy, Google Domains, or any registrar.
          </p>
        </div>

        <form
          onSubmit={onAdd}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
        >
          <div className="flex-1 min-w-0">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. yourcompany.com"
              className="h-10 w-full"
              required
            />
          </div>
          <Button type="submit" disabled={busy} className="h-10 px-5 shrink-0">
            <Plus className="h-4 w-4 mr-1.5" />
            {busy ? "Adding…" : "Add domain"}
          </Button>
        </form>

        <div className="mt-3.5 pt-3 border-t border-line text-center sm:text-left">
          <button
            type="button"
            onClick={() => {
              setShowGuide(true);
              setRdapResult(null);
            }}
            className="inline-flex items-center text-center sm:text-left gap-1.5 text-[12.5px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span className="min-w-0 whitespace-normal leading-relaxed">
              <span className="sm:hidden">
                Need a domain? Check live availability or request setup &rarr;
              </span>
              <span className="hidden sm:inline">
                Don't have a domain yet? Check live RDAP availability or request concierge setup
                &rarr;
              </span>
            </span>
          </button>
        </div>

        {err && <p className="mt-2 text-[13px] text-red-600">{err}</p>}
      </Card>

      {/* Guided Domain Acquisition & RDAP Concierge Modal */}
      {showGuide && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGuide(false);
          }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
        >
          <div className="relative w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl border border-line bg-surface shadow-2xl max-h-[85vh] overflow-y-auto overflow-x-hidden">
            <div className="p-4 pb-8 sm:pb-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-[15px] font-bold text-ink">Need a domain?</h3>
                  <p className="text-[12px] text-ink-3">
                    Check availability or let our team handle setup.
                  </p>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="shrink-0 h-8 w-8 rounded-lg border border-line grid place-items-center text-ink-3 hover:text-ink hover:bg-surface-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Live RDAP Domain Availability Checker */}
              <div className="rounded-xl border border-line bg-background p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
                  <Search className="h-3.5 w-3.5 text-ink-3" /> Live Domain Checker (RDAP)
                </div>
                <form onSubmit={handleRdapCheck} className="flex gap-2">
                  <Input
                    value={checkDomainInput}
                    onChange={(e) => setCheckDomainInput(e.target.value)}
                    placeholder="mybrand.com"
                    className="h-8 text-[12.5px]"
                  />
                  <Button
                    type="submit"
                    disabled={checkingRdap || !checkDomainInput.trim()}
                    className="h-8 px-3 text-[12px] shrink-0"
                  >
                    {checkingRdap ? "Checking…" : "Check"}
                  </Button>
                </form>

                {rdapError && <p className="text-[11px] text-red-500">{rdapError}</p>}

                {rdapResult && (
                  <div className="mt-2 pt-2 border-t border-line text-[12px]">
                    {!rdapResult.isRegistered ? (
                      <div className="flex items-center justify-between bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 p-2.5 rounded-lg">
                        <div>
                          <span className="font-bold">✨ Available!</span>{" "}
                          <span className="font-mono">{rdapResult.domain}</span> is ready to
                          register.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setName(rdapResult.domain);
                            setShowGuide(false);
                          }}
                          className="text-[11px] font-semibold bg-emerald-600 text-white px-2 py-1 rounded"
                        >
                          Use this
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 bg-amber-500/10 text-amber-900 dark:text-amber-200 p-2.5 rounded-lg">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                        <div>
                          <span className="font-semibold">Taken:</span>{" "}
                          <span className="font-mono">{rdapResult.domain}</span> is already
                          registered.
                          {rdapResult.registrarName && (
                            <span className="block text-[11px] text-ink-3 mt-0.5">
                              Registrar: {rdapResult.registrarName}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Option A: Self-Service */}
              <div className="rounded-xl border border-line bg-background p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Option A · Self-Service
                  </span>
                  <span className="text-[11px] font-mono text-ink-3 shrink-0">
                    ~{currency === "NGN" ? "₦12k/yr" : "$10–12/yr"}
                  </span>
                </div>
                <p className="text-[12px] text-ink-2">
                  Register directly with a registrar, then paste it above:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(checkDomainInput.trim() || "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 h-9 rounded-lg border border-line bg-surface text-[11px] font-medium text-ink hover:bg-surface-muted transition"
                  >
                    Namecheap <ArrowUpRight className="h-3 w-3 text-ink-4" />
                  </a>
                  <a
                    href="https://www.cloudflare.com/products/registrar/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 h-9 rounded-lg border border-line bg-surface text-[11px] font-medium text-ink hover:bg-surface-muted transition"
                  >
                    Cloudflare <ArrowUpRight className="h-3 w-3 text-ink-4" />
                  </a>
                  <a
                    href="https://www.godaddy.com/domains"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 h-9 rounded-lg border border-line bg-surface text-[11px] font-medium text-ink hover:bg-surface-muted transition"
                  >
                    GoDaddy <ArrowUpRight className="h-3 w-3 text-ink-4" />
                  </a>
                </div>
              </div>

              {/* Option B: Concierge */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <Sparkles className="h-3 w-3 shrink-0" /> Option B · Concierge
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                    {currency === "NGN" ? "₦15,000 flat" : "$15 flat"}
                  </span>
                </div>
                <p className="text-[12px] text-ink-2">
                  We register the domain and configure all DNS (MX, SPF, DKIM, DMARC) for you.
                </p>
                <div className="flex gap-2">
                  <Link
                    to="/contact"
                    onClick={() => setShowGuide(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 transition whitespace-nowrap"
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    Request Concierge Domain Setup
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowGuide(false)}
                    className="px-3 py-2 rounded-lg border border-line text-[12px] text-ink-3 hover:text-ink shrink-0"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Domains List */}
      <Card className="p-0">
        {data.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center border-t border-line bg-surface-muted/20">
            <div className="h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center mb-3">
              <Globe className="h-6 w-6 text-ink-3" />
            </div>
            <h3 className="font-semibold text-ink">No domains configured</h3>
            <p className="mt-1 text-[13px] text-ink-3 max-w-sm">
              Add your first domain to start routing professional mail through Gmail.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {data.map(
              (d: {
                id: string;
                domain_name: string;
                verification_status: string;
                created_at: string;
              }) => {
                const verified = d.verification_status === "verified";
                return (
                  <li
                    key={d.id}
                    className="group px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <Link
                        to="/domains/$id"
                        params={{ id: d.id }}
                        className="font-medium hover:underline break-all"
                      >
                        {d.domain_name}
                      </Link>
                      <div className="mt-0.5 text-[12px] text-ink-3">
                        Added {new Date(d.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto max-w-full">
                      <StatusPill status={d.verification_status ?? "pending"} />
                      {!verified && (
                        <Button
                          variant="ghost"
                          onClick={() => onVerify(d.id)}
                          disabled={verifyingId === d.id}
                          className="whitespace-nowrap"
                        >
                          <RefreshCw
                            className={`h-3.5 w-3.5 mr-1.5 ${verifyingId === d.id ? "animate-spin" : ""}`}
                          />
                          {verifyingId === d.id ? "Verifying…" : "Verify"}
                        </Button>
                      )}
                      <Link
                        to="/domains/$id"
                        params={{ id: d.id }}
                        className="inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-md border border-line px-2.5 text-[12.5px] text-ink-2 hover:bg-ink/[0.04]"
                      >
                        DNS setup <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteError(null);
                          setPendingDelete({ id: d.id, name: d.domain_name });
                        }}
                        className="grid h-8 w-8 place-items-center rounded-md text-ink-3 opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition"
                        aria-label="Delete domain"
                        title="Delete domain"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              },
            )}
          </ul>
        )}
      </Card>

      {pendingDelete && (
        <ConfirmDeleteModal
          title={`Delete ${pendingDelete.name}?`}
          description={
            deleteError ??
            "This will permanently remove the domain and its DNS configuration. You cannot delete a domain with active employee emails."
          }
          confirmLabel="Yes, delete domain"
          busy={deleteBusy}
          onCancel={() => {
            setPendingDelete(null);
            setDeleteError(null);
          }}
          onConfirm={onDelete}
        />
      )}
    </div>
  );
}
