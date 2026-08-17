import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Card, Button, StatusPill } from "@/components/app/AppShell";
import { CreditCard, ReceiptText, Globe } from "lucide-react";
import { initPaystackCheckout, verifyPaystackReference, getBillingOverview, cancelSubscription } from "@/lib/paystack.functions";
import { detectUserCurrency, Currency, PRICING_PLANS } from "@/lib/currency";

const billingOpts = queryOptions({ queryKey: ["billing-overview"], queryFn: async () => getBillingOverview(), staleTime: 30_000 });

export const Route = createFileRoute("/_authenticated/_shell/settings/billing")({
  head: () => ({ meta: [{ title: "Billing — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(billingOpts),
  component: BillingPage,
});

function BillingPage() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(billingOpts);
  const init = useServerFn(initPaystackCheckout);
  const verify = useServerFn(verifyPaystackReference);
  const cancel = useServerFn(cancelSubscription);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    setCurrency(detectUserCurrency());
  }, []);

  // On return from Paystack, ?reference=... appears in the URL.
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const returnedRef = params?.get("reference") ?? params?.get("trxref");
  const [verifyState, setVerifyState] = useState<"idle" | "checking" | "ok" | "fail">(
    returnedRef ? "checking" : "idle",
  );

  useEffect(() => {
    if (!returnedRef || verifyState !== "checking") return;
    let alive = true;
    verify({ data: { reference: returnedRef } })
      .then(async (r) => { if (alive) setVerifyState(r.ok ? "ok" : "fail"); await qc.invalidateQueries({ queryKey: ["billing-overview"] }); })
      .catch(() => { if (alive) setVerifyState("fail"); });
    return () => { alive = false; };
  }, [returnedRef, verify, verifyState, qc]);

  async function subscribe(planCode: string, amountKobo: number) {
    setErr(null);
    setBusy(planCode);
    try {
      const callback = `${window.location.origin}/settings/billing`;
      const { authorizationUrl } = await init({
        data: { planCode, interval, amountKobo, callbackUrl: callback },
      });
      window.location.href = authorizationUrl;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Checkout failed");
      setBusy(null);
    }
  }

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel your subscription? This cannot be undone.")) return;
    setBusy("cancel");
    setErr(null);
    try {
      await cancel();
      await qc.invalidateQueries({ queryKey: ["billing-overview"] });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to cancel");
    } finally {
      setBusy(null);
    }
  }

  const currentPlanCode = data.subscription?.plan_code ?? "free";
  const currentPlan = PRICING_PLANS.find((p) => p.code === currentPlanCode) ?? PRICING_PLANS[0];
  const { employees: empCount, domains: domCount } = data.usage;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold">Billing</h2>
            <p className="mt-0.5 text-[13.5px] text-ink-3">
              Subscriptions powered by Paystack. All prices in {currency === "NGN" ? "NGN (₦)" : "USD ($)"}.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-muted text-[11.5px] font-mono text-ink-3 border border-line">
            <Globe className="h-3 w-3 text-primary" />
            <span>Region: {currency === "NGN" ? "Nigeria (NGN)" : "International (USD)"}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-background p-3.5">
            <div className="text-[11px] uppercase tracking-wider text-ink-4">Current Plan</div>
            <div className="mt-1 text-[17px] font-bold text-ink capitalize">
              {data.subscription?.plan ?? (currentPlan ? currentPlan.name : "Free")}
            </div>
            <div className="text-[11.5px] text-ink-3 mt-0.5 font-mono">
              Max {currentPlan.limits.domains} domains · {currentPlan.limits.employees} staff
            </div>
          </div>
          <div className="rounded-xl border border-line bg-background p-3.5 flex flex-col justify-between">
            <div className="text-[11px] uppercase tracking-wider text-ink-4">Status</div>
            <div className="mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                  data.subscription?.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-primary/10 text-primary border border-primary/20"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    data.subscription?.status === "active" ? "bg-emerald-500" : "bg-primary animate-pulse"
                  }`}
                />
                {data.subscription?.status === "active" ? "Active Subscription" : "Free Mode Active"}
              </span>
            </div>
            <div className="text-[11.5px] text-ink-3 mt-1">
              {data.subscription?.status === "active" ? "Auto-renews enabled" : "Full access unlocked"}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-background p-3.5 flex flex-col justify-between">
            <div className="text-[11px] uppercase tracking-wider text-ink-4">Next Billing Date</div>
            <div className="mt-1 text-[14px] font-semibold text-ink">
              {data.subscription?.current_period_end
                ? new Date(data.subscription.current_period_end).toLocaleDateString()
                : "Always Free"}
            </div>
            {data.subscription?.status === "active" && (
              <button
                onClick={handleCancel}
                disabled={busy === "cancel"}
                className="mt-1 text-[11.5px] text-danger hover:underline text-left font-medium disabled:opacity-50"
              >
                {busy === "cancel" ? "Canceling…" : "Cancel subscription"}
              </button>
            )}
          </div>
        </div>
        
        {(empCount > currentPlan.limits.employees || domCount > currentPlan.limits.domains) && (
          <div className="mt-5 rounded-lg border border-danger/20 bg-danger/5 p-4">
            <h3 className="text-[14px] font-semibold text-danger">Plan limits exceeded</h3>
            <p className="mt-1 text-[13px] text-danger/80">
              Your workspace is currently using more resources than your {currentPlan.name} plan allows. 
              Please upgrade your subscription or remove excess domains and employees to restore full functionality.
            </p>
          </div>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold">Current Usage</h3>
            <div className="inline-flex rounded-md border border-line bg-background p-1">
              {(["monthly", "yearly"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setInterval(v)}
                  className={`h-7 rounded px-3 text-[12px] font-medium capitalize transition-colors ${interval === v ? "bg-primary text-primary-foreground shadow-sm" : "text-ink-3 hover:text-ink-2"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="font-medium text-ink-2">Employees</span>
                <span className="text-ink-3 font-mono">{empCount} <span className="text-ink-4">/</span> {currentPlan.limits.employees === Infinity ? "∞" : currentPlan.limits.employees}</span>
              </div>
              <div className="h-1.5 w-full bg-ink/[0.04] rounded-full overflow-hidden">
                <div className={`h-full ${empCount > currentPlan.limits.employees ? "bg-danger" : "bg-primary"}`} style={{ width: `${Math.min(100, (empCount / (currentPlan.limits.employees === Infinity ? Math.max(10, empCount) : currentPlan.limits.employees)) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="font-medium text-ink-2">Domains</span>
                <span className="text-ink-3 font-mono">{domCount} <span className="text-ink-4">/</span> {currentPlan.limits.domains === Infinity ? "∞" : currentPlan.limits.domains}</span>
              </div>
              <div className="h-1.5 w-full bg-ink/[0.04] rounded-full overflow-hidden">
                <div className={`h-full ${domCount > currentPlan.limits.domains ? "bg-danger" : "bg-primary"}`} style={{ width: `${Math.min(100, (domCount / (currentPlan.limits.domains === Infinity ? Math.max(10, domCount) : currentPlan.limits.domains)) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
        {verifyState === "ok" && (
          <p className="mt-4 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-[13px] text-success">
            Payment verified. Your subscription is active.
          </p>
        )}
        {verifyState === "fail" && (
          <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] text-danger">
            We couldn't verify that payment. If you were charged, the webhook will reconcile it shortly.
          </p>
        )}
        {err && <p className="mt-3 text-[13px] text-red-600">{err}</p>}
      </Card>

      <Card className="p-6 overflow-hidden">
        <div className="flex items-center gap-2 text-[13px] font-medium"><CreditCard className="h-4 w-4" /> Card details</div>
        {data.card?.last4 ? (
          <div className="mt-4 rounded-lg border border-line bg-ink text-background p-4">
            <div className="text-[11px] uppercase tracking-wider opacity-70">{data.card.brand ?? "Card"}</div>
            <div className="mt-5 font-mono text-lg tracking-widest">•••• •••• •••• {data.card.last4}</div>
            <div className="mt-3 text-[12px] opacity-75">Expires {data.card.expMonth ?? "—"}/{data.card.expYear ?? "—"}</div>
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-dashed border-line p-4 text-[13px] text-ink-3">
            No saved card yet. A card appears here after the first successful Paystack payment.
          </div>
        )}
      </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {PRICING_PLANS.map((p) => {
          const isActive = currentPlanCode === p.code;
          const isYearly = interval === "yearly";
          const amountKobo = isYearly ? p.ngnYearlyKobo : p.ngnMonthlyKobo;
          const displayPrice = currency === "NGN" 
            ? (isYearly ? p.ngnYearlyDisplay : p.ngnDisplay)
            : (isYearly ? p.usdYearlyDisplay : p.usdDisplay);

          return (
            <Card key={p.code} className={`p-5 flex flex-col justify-between transition-colors ${isActive ? "border-primary bg-primary/[0.02]" : "border-line hover:border-ink/20"}`}>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold">{p.name}</h3>
                  {isActive && <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium tracking-wide text-primary">CURRENT</span>}
                </div>
                <p className="mt-1 text-[12.5px] text-ink-3 min-h-[34px]">{p.blurb}</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-ink">
                    {displayPrice}
                  </span>
                  <span className="text-[12.5px] font-normal text-ink-3">
                    / {isYearly ? "yr" : "mo"}
                  </span>
                </div>
              </div>
              <Button
                variant={isActive ? "ghost" : "primary"}
                onClick={() => subscribe(p.code, amountKobo)}
                disabled={busy !== null || isActive || p.code === "free"}
                className="mt-5 w-full"
              >
                {busy === p.code ? "Redirecting…" : isActive ? "Current plan" : p.code === "free" ? "Default Plan" : "Subscribe"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-line flex items-center gap-2">
          <ReceiptText className="h-4 w-4 text-ink-3" />
          <h3 className="font-display text-[15px] font-semibold">Payment history</h3>
        </div>
        {data.events.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-ink-3">No payment records yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[13px]">
              <thead className="bg-ink/[0.03] text-[11px] uppercase tracking-wider text-ink-3">
                <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.events.map((e: { id: string; createdAt: string; reference: string | null; eventType: string; amountKobo: number | null; status: string | null; card: { brand: string | null; last4: string | null; expMonth: string | null; expYear: string | null } }) => (
                  <tr key={e.id}>
                    <td className="px-5 py-3 whitespace-nowrap">{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 font-mono text-[12px] text-ink-3">{e.reference ?? e.eventType}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {e.amountKobo ? (currency === "NGN" ? `₦${(e.amountKobo / 100).toLocaleString()}` : `$${Math.round((e.amountKobo / 100) / 1300)}`) : "—"}
                    </td>
                    <td className="px-5 py-3"><StatusPill status={e.status ?? "unknown"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
