import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Loader2, Mail, Shield, Users, Globe, Sparkles } from "lucide-react";

type Status = "idle" | "pending" | "ok" | "fail";
type StepId = "org" | "domain" | "verify" | "invite" | "gmail" | "ready";

const STEPS: { id: StepId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "org", label: "Organization", icon: Sparkles },
  { id: "domain", label: "Domain", icon: Globe },
  { id: "verify", label: "Verify DNS", icon: Shield },
  { id: "invite", label: "Invite team", icon: Users },
  { id: "gmail", label: "Connect Gmail", icon: Mail },
  { id: "ready", label: "Ready", icon: Check },
];

export function OnboardingStepper() {
  const [current, setCurrent] = useState<StepId>("org");
  const [org, setOrg] = useState({ name: "", industry: "", size: "1-10" });
  const [domain, setDomain] = useState("");
  const [invites, setInvites] = useState("");
  const [dns, setDns] = useState<Record<string, Status>>({
    txt: "idle", mx: "idle", spf: "idle", dkim: "idle", dmarc: "idle",
  });
  const [gmailConnected, setGmailConnected] = useState(false);

  const idx = STEPS.findIndex((s) => s.id === current);

  function next() {
    if (idx < STEPS.length - 1) setCurrent(STEPS[idx + 1].id);
  }

  function runVerify() {
    setDns({ txt: "pending", mx: "pending", spf: "pending", dkim: "pending", dmarc: "pending" });
    // Simulated: real implementation calls domainVerificationService
    setTimeout(() => setDns({ txt: "ok", mx: "ok", spf: "ok", dkim: "ok", dmarc: "ok" }), 1500);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-16">
        <div className="mb-10 flex items-center justify-between">
          <Link to="/" className="font-display text-[15px] font-semibold tracking-tight flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-full bg-primary" /> Mailcoy
          </Link>
          <div className="text-[13px] text-ink-3">Setup {idx + 1} of {STEPS.length}</div>
        </div>

        {/* Stepper rail */}
        <ol className="mb-10 hidden md:flex items-center gap-2">
          {STEPS.map((s, i) => {
            const active = i === idx;
            const done = i < idx;
            return (
              <li key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`h-7 w-7 rounded-full border flex items-center justify-center text-[12px] font-medium
                  ${done ? "bg-primary border-primary text-primary-foreground" : active ? "border-primary text-primary" : "border-line text-ink-3"}`}>
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`text-[12.5px] ${active ? "text-ink" : "text-ink-3"}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className="h-px flex-1 bg-line" />}
              </li>
            );
          })}
        </ol>

        <div className="rounded-xl border border-line bg-background p-6 md:p-10">
          {current === "org" && (
            <StepShell title="Tell us about your company" subtitle="This becomes your workspace.">
              <Field label="Company name"><input value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} className={inputCls} placeholder="Acme Inc." /></Field>
              <Field label="Industry"><input value={org.industry} onChange={(e) => setOrg({ ...org, industry: e.target.value })} className={inputCls} placeholder="Software, Retail, …" /></Field>
              <Field label="Team size">
                <select value={org.size} onChange={(e) => setOrg({ ...org, size: e.target.value })} className={inputCls}>
                  <option>1-10</option><option>11-50</option><option>51-200</option><option>200+</option>
                </select>
              </Field>
              <Actions primary="Continue" onPrimary={next} disabled={!org.name} />
            </StepShell>
          )}

          {current === "domain" && (
            <StepShell title="Connect your domain" subtitle="Your team will send email from names on this domain.">
              <Field label="Domain">
                <input value={domain} onChange={(e) => setDomain(e.target.value)} className={inputCls} placeholder="acme.com" />
              </Field>
              <p className="text-[13px] text-ink-3">We'll generate DNS records for you in the next step.</p>
              <Actions primary="Continue" onPrimary={next} secondary="Back" onSecondary={() => setCurrent("org")} disabled={!domain} />
            </StepShell>
          )}

          {current === "verify" && (
            <StepShell title="Verify DNS" subtitle={`Add these records at your registrar for ${domain || "your domain"}.`}>
              <div className="rounded-lg border border-line divide-y divide-line">
                <DnsRow type="TXT" host="@" value={`mailcoy-verify=${btoa(domain || "x").slice(0, 12)}`} status={dns.txt} />
                <DnsRow type="MX" host="@" value="10 mx1.mailcoy.email" status={dns.mx} />
                <DnsRow type="TXT" host="@" value="v=spf1 include:_spf.mailcoy.email ~all" status={dns.spf} label="SPF" />
                <DnsRow type="TXT" host="mailcoy._domainkey" value="v=DKIM1; k=rsa; p=MIGfMA0GC…" status={dns.dkim} label="DKIM" />
                <DnsRow type="TXT" host="_dmarc" value="v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.email" status={dns.dmarc} label="DMARC" />
              </div>
              <p className="text-[12.5px] text-ink-3 mt-3">DNS can take a few minutes to propagate. We'll auto-recheck every 30 seconds.</p>
              <Actions
                primary={Object.values(dns).every((s) => s === "ok") ? "Continue" : "Re-check now"}
                onPrimary={Object.values(dns).every((s) => s === "ok") ? next : runVerify}
                secondary="Skip for now"
                onSecondary={next}
              />
            </StepShell>
          )}

          {current === "invite" && (
            <StepShell title="Invite your team" subtitle="Add teammates by email. They'll receive an invitation to activate their professional address.">
              <Field label="Emails (one per line)">
                <textarea rows={5} value={invites} onChange={(e) => setInvites(e.target.value)} className={inputCls + " h-auto py-2 font-mono text-[13px]"} placeholder={"sam@acme.com\njordan@acme.com"} />
              </Field>
              <Actions primary="Send invites" onPrimary={next} secondary="Skip" onSecondary={next} />
            </StepShell>
          )}

          {current === "gmail" && (
            <StepShell title="Connect Gmail" subtitle="Authorize Gmail so your team can send and receive from their professional address inside the Gmail they already use.">
              <div className="rounded-lg border border-line p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-ink/[0.04] flex items-center justify-center"><Mail className="h-5 w-5" /></div>
                  <div>
                    <div className="text-[14px] font-medium">Gmail workspace connection</div>
                    <div className="text-[12.5px] text-ink-3">Grants send + receive scopes via Google OAuth.</div>
                  </div>
                </div>
                <button
                  onClick={() => setGmailConnected(true)}
                  className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-[13px] font-medium hover:opacity-90"
                >
                  {gmailConnected ? "Connected" : "Connect"}
                </button>
              </div>
              <p className="text-[12.5px] text-ink-3 mt-3">Each teammate will connect their own Google account after accepting the invite.</p>
              <Actions primary={gmailConnected ? "Continue" : "Skip for now"} onPrimary={next} />
            </StepShell>
          )}

          {current === "ready" && (
            <div className="text-center py-8">
              <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">You're all set</h2>
              <p className="mt-2 text-[14px] text-ink-3 max-w-md mx-auto">
                Your workspace is ready. Head to the dashboard to start sending professional email.
              </p>
              <Link to="/dashboard" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-[14px] font-medium text-primary-foreground hover:opacity-90">
                Open dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full h-10 rounded-md border border-line bg-background px-3 text-[14px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block mb-4"><span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>{children}</label>;
}

function StepShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 mb-6 text-[14px] text-ink-3">{subtitle}</p>
      {children}
    </div>
  );
}

function Actions({ primary, onPrimary, secondary, onSecondary, disabled }: { primary: string; onPrimary: () => void; secondary?: string; onSecondary?: () => void; disabled?: boolean }) {
  return (
    <div className="mt-6 flex items-center gap-2 justify-end">
      {secondary && <button onClick={onSecondary} className="h-10 px-4 rounded-md border border-line text-[13.5px] font-medium hover:bg-ink/[0.03]">{secondary}</button>}
      <button onClick={onPrimary} disabled={disabled} className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-[13.5px] font-medium hover:opacity-90 disabled:opacity-50">{primary}</button>
    </div>
  );
}

function DnsRow({ type, host, value, status, label }: { type: string; host: string; value: string; status: Status; label?: string }) {
  return (
    <div className="grid grid-cols-[70px_1fr_auto] items-center gap-3 p-3">
      <span className="text-[11px] font-mono uppercase text-ink-3">{label ?? type}</span>
      <div className="min-w-0">
        <div className="text-[12px] text-ink-3">Host: <span className="font-mono text-ink">{host}</span> · Type: {type}</div>
        <div className="mt-0.5 flex items-center gap-2">
          <code className="text-[12.5px] font-mono truncate">{value}</code>
          <button onClick={() => navigator.clipboard?.writeText(value)} className="text-ink-3 hover:text-ink"><Copy className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <StatusPill status={status} />
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  if (status === "ok") return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700"><Check className="h-3 w-3" />Verified</span>;
  if (status === "pending") return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700"><Loader2 className="h-3 w-3 animate-spin" />Checking</span>;
  if (status === "fail") return <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-700">Not found</span>;
  return <span className="rounded-full bg-ink/[0.06] px-2 py-0.5 text-[11px] font-medium text-ink-3">Idle</span>;
}