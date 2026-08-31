import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createOrganization, setOnboardingStep } from "@/lib/orgs.functions";
import { addDomain } from "@/lib/domains.functions";
import { addEmployee } from "@/lib/employees.functions";
import { Card, Button, Input, Field } from "@/components/app/AppShell";
import { Logomark } from "@/components/brand/Logomark";
import { Check, Globe, ChevronRight, UserPlus, Zap } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  ssr: false,
  head: () => ({ meta: [{ title: "Set up — Mailcoy" }] }),
  component: OnboardingRoute,
});

type Step = "org" | "domain" | "employee" | "done";

const COUNTRIES = [
  { code: "", name: "Select country..." },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "NG", name: "Nigeria" },
  { code: "ZA", name: "South Africa" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "SG", name: "Singapore" },
];

interface RegistrarDetectResult {
  registrar: {
    id: string;
    name: string;
    logo: string;
    helpUrl: string;
    steps: string[];
  } | null;
  nsRecords: string[];
}

function OnboardingRoute() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const createOrg = useServerFn(createOrganization);
  const addDom = useServerFn(addDomain);
  const addEmp = useServerFn(addEmployee);
  const finish = useServerFn(setOnboardingStep);

  const [step, setStep] = useState<Step>("org");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Org state
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");

  // Domain state
  const [domain, setDomain] = useState("");

  // Employee state
  const [empName, setEmpName] = useState("");
  const [empLocal, setEmpLocal] = useState("");
  const [empEdited, setEmpEdited] = useState(false);

  const cleanDomain = domain.trim().toLowerCase();
  const isValidDomainCandidate = cleanDomain.length >= 4 && cleanDomain.includes(".");

  const { data: registrarData, isLoading: detectingRegistrar } = useQuery({
    queryKey: ["registrar-detect", cleanDomain],
    queryFn: async (): Promise<RegistrarDetectResult> => {
      const res = await fetch(`/api/registrar-detect?domain=${encodeURIComponent(cleanDomain)}`);
      if (!res.ok) throw new Error("Failed to detect registrar");
      return res.json();
    },
    enabled: isValidDomainCandidate,
    staleTime: 5 * 60_000,
  });

  async function submitOrg(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      await createOrg({ data: { name: orgName.trim(), industry: industry || undefined, country: country || undefined } });
      setStep("domain");
    } catch (e: any) {
      console.error("[Onboarding] submitOrg error:", e);
      setErr(e?.message || (typeof e === "string" ? e : "Failed to create workspace. Please try again."));
    } finally { setBusy(false); }
  }

  async function submitDomain(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      if (domain.trim()) await addDom({ data: { name: domain.trim().toLowerCase() } });
      setStep("employee");
    } catch (e: any) {
      console.error("[Onboarding] submitDomain error:", e);
      setErr(e?.message || (typeof e === "string" ? e : "Failed to add domain. Please check domain format and try again."));
    } finally { setBusy(false); }
  }

  async function skipDomain() {
    setStep("employee");
  }

  async function submitEmployee(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      if (cleanDomain && empName.trim() && empLocal.trim()) {
        await addEmp({
          data: {
            full_name: empName.trim(),
            local_part: empLocal.trim().toLowerCase(),
            domain: cleanDomain,
          },
        });
      }
      await completeOnboarding();
    } catch (e: any) {
      console.error("[Onboarding] submitEmployee error:", e);
      setErr(e?.message || (typeof e === "string" ? e : "Failed to add team member. Please try again."));
    } finally { setBusy(false); }
  }

  async function completeOnboarding() {
    setBusy(true);
    try {
      await finish({ data: { step: 6, completed: true } });
      await qc.invalidateQueries();
      setStep("done");
      setTimeout(() => nav({ to: "/dashboard" }), 1000);
    } catch (e: any) {
      console.error("[Onboarding] completeOnboarding error:", e);
      setErr(e?.message || (typeof e === "string" ? e : "Failed to complete setup."));
    } finally { setBusy(false); }
  }

  const stepIndex = step === "org" ? 1 : step === "domain" ? 2 : step === "employee" ? 3 : 4;

  const variants = {
    enter: { opacity: 0, y: 15 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      <div className="w-full max-w-lg relative z-10">
        
        {/* Header & Progress */}
        {step !== "done" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-display font-semibold">
                <Logomark className="h-5 w-5" /> Mailcoy
              </div>
              <div className="text-[12px] font-medium text-ink-3 tracking-wide uppercase">
                Step {stepIndex} of 3
              </div>
            </div>
            <div className="h-1.5 w-full bg-ink/[0.04] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(stepIndex / 3) * 100}%` }}
                transition={{ ease: "circOut", duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <div className="relative">
          
            {step === "org" && (
              <motion.div key="org" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <Card className="p-8">
                  <h1 className="font-display text-xl font-semibold">Create your workspace</h1>
                  <p className="mt-1 mb-6 text-[13.5px] text-ink-3">This becomes your organization's home in Mailcoy.</p>
                  <form onSubmit={submitOrg} className="space-y-4">
                    <Field label="Company name">
                      <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} required minLength={2} placeholder="Acme Inc." />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Industry (optional)">
                        <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Software, Retail, …" />
                      </Field>
                      <Field label="Country (optional)">
                        <select 
                          value={country} 
                          onChange={(e) => setCountry(e.target.value)} 
                          className="w-full h-10 rounded-md border border-line bg-background px-3 text-[14px] outline-none focus:border-primary"
                        >
                          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                      </Field>
                    </div>
                    {err && <p className="text-[13px] text-danger">{err}</p>}
                    <Button type="submit" disabled={busy} className="w-full mt-2">
                      {busy ? "Creating…" : "Continue"} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}

            {step === "domain" && (
              <motion.div key="domain" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <Card className="p-8">
                  <h1 className="font-display text-xl font-semibold">Add your sending domain</h1>
                  <p className="mt-1 mb-6 text-[13.5px] text-ink-3">Enter your company's domain name to automatically identify your DNS registrar.</p>
                  <form onSubmit={submitDomain} className="space-y-4">
                    <Field label="Domain">
                      <Input 
                        value={domain} 
                        onChange={(e) => setDomain(e.target.value)} 
                        placeholder="acme.com" 
                        required
                      />
                    </Field>

                    {/* Live Registrar Auto-Detect Feedback */}
                    {isValidDomainCandidate && (
                      <div className="mt-3 rounded-xl border border-line bg-surface-muted/40 p-3 text-[13px]">
                        {detectingRegistrar ? (
                          <div className="flex items-center gap-2 text-ink-3">
                            <Globe className="h-4 w-4 animate-spin text-primary" />
                            <span>Detecting DNS provider for <strong className="font-mono">{cleanDomain}</strong>…</span>
                          </div>
                        ) : registrarData?.registrar ? (
                          <div className="flex items-center gap-3">
                            <img 
                              src={registrarData.registrar.logo} 
                              alt={registrarData.registrar.name} 
                              className="h-7 w-7 rounded border border-line object-cover shrink-0 bg-white p-0.5" 
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} 
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-medium text-ink">
                                <Zap className="h-3.5 w-3.5 text-blue-600" />
                                <span>Detected: <strong className="text-blue-600 dark:text-blue-400">{registrarData.registrar.name}</strong></span>
                              </div>
                              <p className="text-[12px] text-ink-3 truncate">
                                Nameservers auto-matched. Tailored setup guide will load in DNS setup.
                              </p>
                            </div>
                          </div>
                        ) : registrarData?.nsRecords && registrarData.nsRecords.length > 0 ? (
                          <div className="flex items-center gap-2 text-ink-2">
                            <Globe className="h-4 w-4 text-emerald-600" />
                            <span>DNS records found ({registrarData.nsRecords.slice(0, 2).join(", ")}). Standard instructions ready.</span>
                          </div>
                        ) : (
                          <div className="text-ink-3 text-[12px]">
                            Enter a registered domain name (e.g. yourcompany.com) to load DNS setup instructions.
                          </div>
                        )}
                      </div>
                    )}

                    {err && <p className="text-[13px] text-danger">{err}</p>}

                    <div className="flex items-center gap-2 pt-4">
                      <Button type="submit" disabled={busy || !isValidDomainCandidate} className="flex-1">
                        {busy ? "Saving…" : "Continue"} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button type="button" variant="ghost" onClick={skipDomain} disabled={busy}>Skip</Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {step === "employee" && (
              <motion.div key="employee" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <Card className="p-8">
                  <h1 className="font-display text-xl font-semibold">Invite your first employee</h1>
                  <p className="mt-1 mb-6 text-[13.5px] text-ink-3">
                    Create a professional address for yourself or a teammate. 
                    {cleanDomain ? ` It will end in @${cleanDomain}.` : ""}
                  </p>
                  <form onSubmit={submitEmployee} className="space-y-4">
                    <Field label="Full name">
                      <Input 
                        value={empName} 
                        onChange={(e) => {
                          setEmpName(e.target.value);
                          if (!empEdited) {
                            const suggested = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '');
                            setEmpLocal(suggested);
                          }
                        }} 
                        placeholder="Jane Doe" 
                      />
                    </Field>
                    
                    <Field label="Email address">
                      <div className="flex">
                        <Input 
                          value={empLocal} 
                          onChange={(e) => {
                            setEmpLocal(e.target.value.toLowerCase().replace(/\s+/g, ""));
                            setEmpEdited(true);
                          }} 
                          placeholder="jane.doe" 
                          className="rounded-r-none" 
                        />
                        <div className="flex items-center h-10 border border-l-0 border-line rounded-r-md bg-surface-muted px-3 text-[13px] text-ink-2 truncate max-w-[150px]">
                          @{cleanDomain || "domain.com"}
                        </div>
                      </div>
                    </Field>

                    {err && <p className="text-[13px] text-danger">{err}</p>}

                    <div className="flex items-center gap-2 pt-4">
                      <Button type="submit" disabled={busy || (!!cleanDomain && !empName.trim() && !empLocal.trim())} className="flex-1">
                        <UserPlus className="h-4 w-4 mr-1.5" />
                        {busy ? "Finishing…" : cleanDomain && empName.trim() ? "Create & Finish" : "Finish Setup"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={completeOnboarding} disabled={busy}>Skip</Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div key="done" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <Card className="p-10 text-center">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5"
                  >
                    <Check className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-semibold">You're all set!</h2>
                  <p className="mt-2 text-[14px] text-ink-3">Redirecting to your dashboard…</p>
                </Card>
              </motion.div>
            )}
          
        </div>
      </div>
    </div>
  );
}
