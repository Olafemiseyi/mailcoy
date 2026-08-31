import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, ShieldCheck, Globe, Users, Check, Lock, Zap, ArrowLeft, BookOpen, Fingerprint, Menu, X } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [activeDoc, setActiveDoc] = useState<'privacy' | 'terms' | 'security' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderDocContent = () => {
    switch (activeDoc) {
      case 'privacy':
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-4.5 w-4.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Legal & Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
              Last Updated: July 8, 2026 • Version 2.1
            </p>

            <hr className="border-slate-100 dark:border-zinc-800" />

            <div className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 space-y-6 font-medium leading-relaxed">
              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">1. Our Commitment to Zero Data Retention</h3>
                <p>
                  Mailcoy functions exclusively as an active transit gateway. We implement in-memory packet stream translation. Unlike legacy mail servers, <strong>we never write, persist, or commit the raw body or content of your inbound or outbound emails to permanent storage disks</strong>.
                </p>
                <p>
                  Our server nodes ingest, sign, and instantly forward packages. Logs are limited to transaction metadata (envelope headers such as sender, receiver, subject, and transport timestamps) to guarantee diagnostic transparency for administrator dashboards.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">2. Scope of Collected Metadata</h3>
                <p>
                  We collect and record only the system metadata required to operate secure, verified domains:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Domain Records:</strong> DNS entries (MX, TXT SPF, DKIM keys) to verify brand ownership and block routing spoofing.</li>
                  <li><strong>Employee Maps:</strong> Secure relational records indicating authorized aliases and target destination paths.</li>
                  <li><strong>Activity Headers:</strong> Temporal records of routing events, delivery status codes (Delivered, Processing, Retrying), and SMTP transaction responses.</li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">3. Third-Party API Safeguards</h3>
                <p>
                  Mailcoy interfaces seamlessly with the Google Workspace and Gmail APIs on behalf of connected organization administrators. OAuth credentials, access keys, and authorization tokens are encrypted at rest using AES-256 standards, and are never exposed to browser endpoints or secondary entities.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">4. GDPR & CCPA Compliance</h3>
                <p>
                  Your corporate identity data belongs completely to your organization. You retain the absolute right to terminate authorization, purge verified domains, remove employee forward maps, and erase historical transaction logs instantly. PURGE operations take immediate effect across all distributed clusters.
                </p>
              </section>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="h-4.5 w-4.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Service Agreement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
              Last Updated: July 8, 2026 • Version 1.4
            </p>

            <hr className="border-slate-100 dark:border-zinc-800" />

            <div className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 space-y-6 font-medium leading-relaxed">
              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">1. Gateway Usage Authorization</h3>
                <p>
                  By creating an account and connecting your custom domain with Mailcoy, you authorize our mail nodes to handle inbound and outbound SMTP packet verification for your authorized employee aliases.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">2. Flat-Rate Billing & Limits</h3>
                <p>
                  Mailcoy is billed at a flat rate of $19 per month per connected custom domain. This flat rate provides your organization with unlimited employee routing maps. There are no secondary seat-based hosting costs. Failures to renew subscription payments will result in a temporary pause of active routing pathways after a 7-day grace period.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">3. Spam & Abuse Restriction</h3>
                <p>
                  Our services must not be utilized for unsolicited bulk email marketing (SPAM), email harvesting, phishing campaigns, or masquerading as unverified domains. Any detected spoofing attempts or critical delivery failures indicating bad-faith routing will result in the immediate and permanent suspension of your organization’s gateway nodes.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">4. SLA & Liability Boundaries</h3>
                <p>
                  Mailcoy guarantees a 99.99% core routing transport availability. In no event shall Mailcoy or Mailcoy Innovations be held liable for delayed delivery resulting from upstream Google API outages, misconfigured DNS MX records, or remote mailbox delivery rejections.
                </p>
              </section>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Fingerprint className="h-4.5 w-4.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Infrastructure & Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Security Policy
            </h1>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
              Last Updated: July 8, 2026 • Version 3.0
            </p>

            <hr className="border-slate-100 dark:border-zinc-800" />

            <div className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 space-y-6 font-medium leading-relaxed">
              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">1. Cryptographic Transit Signatures</h3>
                <p>
                  All email payloads routed through our service utilize robust cryptographic protections. We enforce:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>DKIM (DomainKeys Identified Mail):</strong> Full alignment signatures using 2048-bit RSA keys to sign outgoing envelopes and secure delivery.</li>
                  <li><strong>SPF (Sender Policy Framework):</strong> Verification of incoming IP ranges to prevent remote entities from impersonating corporate identifiers.</li>
                  <li><strong>DMARC (Domain-based Message Authentication):</strong> Complete alignment checking to reject fraudulent attempts before forwarding.</li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">2. Sandbox RAM-Only Routers</h3>
                <p>
                  To eliminate disk-persistence vectors, our distributed mail handling containers execute inside RAM-only sandbox structures. Email content streams remain inside transient memory during SPF authentication, header verification, and final SMTP dispatch, then are instantly scrubbed using standard garbage-collection routines.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">3. Intrusive Spoofing Blockers</h3>
                <p>
                  We employ system triggers that monitor domain verification and alias creations. Organizations are prevented from creating aliases matching domains they do not own or have not successfully validated through official TXT handshakes, neutralizing phishing vectors.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">4. Vulnerability Disclosures</h3>
                <p>
                  We partner with independent security researchers to audit our routing APIs regularly. Potential vulnerabilities should be reported directly to our Security response team at <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-855 rounded text-slate-800 dark:text-zinc-200">security@mailcoy.com</code>.
                </p>
              </section>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 antialiased font-sans flex flex-col justify-between selection:bg-emerald-500/10 overflow-x-hidden relative">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-radial from-emerald-500/5 to-transparent pointer-events-none dark:from-emerald-500/10" />
      
      {/* Navigation */}
      <header className="px-6 md:px-12 py-5 border-b border-slate-200/50 dark:border-zinc-900 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-colors">
        <div className="max-w-5xl mx-auto flex justify-between items-center relative">
          <div 
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={() => { setActiveDoc(null); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-8 h-8 bg-emerald-600 dark:bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/10 dark:shadow-emerald-500/10 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm text-white dark:text-zinc-950">L</span>
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white font-display">
              Mailcoy<span className="text-slate-400 dark:text-zinc-500 font-normal">Connect</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              id="landing-login-btn"
              onClick={onLogin}
              className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button 
              id="landing-signup-btn"
              onClick={onGetStarted}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5.5 w-5.5" />
              ) : (
                <Menu className="h-5.5 w-5.5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-100 dark:border-zinc-900/50 mt-4"
            >
              <div className="py-4 space-y-4 flex flex-col">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveDoc(null);
                    setTimeout(() => {
                      const el = document.getElementById('pricing');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-left text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-100 py-2 cursor-pointer"
                >
                  Flat Pricing Plan
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveDoc('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-100 py-2 cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveDoc('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-100 py-2 cursor-pointer"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveDoc('security');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-100 py-2 cursor-pointer"
                >
                  Security Standards
                </button>
                
                <hr className="border-slate-100 dark:border-zinc-900" />
                
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogin();
                    }}
                    className="flex-1 py-3 text-center text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onGetStarted();
                    }}
                    className="flex-1 py-3 text-center text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-28 pb-12 md:pt-36 md:pb-24 px-6 md:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {activeDoc ? (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => { setActiveDoc(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Homepage</span>
              </button>
              
              {/* Document Container */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-lg dark:shadow-zinc-950/40">
                {renderDocContent()}
              </div>
            </div>
          ) : (
            <div className="space-y-24">
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Copy (Headline, Explanation, CTA) */}
                <div className="lg:col-span-7 space-y-8 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-100/60 dark:border-emerald-900/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 rounded-full tracking-wide">
                    <Zap className="h-3 w-3" />
                    <span>Zero Migration Email Layer</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] font-display">
                    Create professional email identities without leaving <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">Gmail</span>
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-slate-550 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
                    Establish corporate email addresses (<span className="font-semibold text-slate-800 dark:text-zinc-200">name@company.com</span>) for your entire workforce instantly. Employees keep utilizing their existing private Gmail accounts with total deliverability alignment.
                  </p>

                  <div className="pt-2">
                    <button
                      id="hero-get-started-btn"
                      onClick={onGetStarted}
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2.5 group transition-all cursor-pointer shadow-md shadow-emerald-600/10 dark:shadow-emerald-500/5 hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                    >
                      <span>Get Started Instantly</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Product Screenshot / Premium Bento-style Mockup */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl rounded-full" />
                  <div className="relative bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-xl shadow-slate-200/45 dark:shadow-[0_24px_50px_rgba(0,0,0,0.5)] space-y-6 text-left transform lg:hover:scale-[1.01] transition-transform">
                    
                    {/* Simulated Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-zinc-500">company.com</span>
                      </div>
                      <span className="text-[9px] bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold px-2 py-0.5 rounded-full border border-slate-100 dark:border-zinc-700/50">
                        Active Gateway
                      </span>
                    </div>

                    {/* Simulated Map Visual */}
                    <div className="space-y-3.5">
                      <div className="p-3.5 bg-slate-50/50 dark:bg-zinc-950/55 border border-slate-150/60 dark:border-zinc-850 rounded-xl space-y-2 relative overflow-hidden group/item">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Alex Rivers</p>
                          <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 font-bold px-1.5 py-0.5 rounded border border-emerald-100/50 dark:border-emerald-900/30">Active</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-zinc-300">alex@company.com</span>
                          <span className="text-emerald-500">➔</span>
                          <span>alex.rivers@gmail.com</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50/50 dark:bg-zinc-950/55 border border-slate-150/60 dark:border-zinc-850 rounded-xl space-y-2 relative overflow-hidden">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Sarah Jenkins</p>
                          <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-455 font-bold px-1.5 py-0.5 rounded border border-emerald-100/50 dark:border-emerald-900/30">Active</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-zinc-300">sarah@company.com</span>
                          <span className="text-emerald-500">➔</span>
                          <span>sarah.jenkins.grow@gmail.com</span>
                        </div>
                      </div>
                    </div>

                    {/* Simple Trust Metrics inside the visual */}
                    <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 dark:text-zinc-500 font-mono font-bold">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>DKIM Aligned</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>99.99% Transit</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Value Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl text-left space-y-2.5 shadow-xs">
                  <div className="h-9 w-9 bg-emerald-50 dark:bg-emerald-950/55 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-white font-display font-bold">Cryptographic Privacy</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    In-memory transit pathways. We never write your email body text to permanent disk storage.
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl text-left space-y-2.5 shadow-xs">
                  <div className="h-9 w-9 bg-emerald-50 dark:bg-emerald-950/55 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Zap className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-white font-display font-bold">Instant Integration</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Connect and map team forwarders under 3 minutes. Clean setup with zero mail-server migrations.
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl text-left space-y-2.5 shadow-xs">
                  <div className="h-9 w-9 bg-emerald-50 dark:bg-emerald-950/55 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Globe className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-white font-display font-bold">Inbox Placement</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Fully SPF, DKIM and DMARC aligned relays to secure delivery straight to the main inbox.
                  </p>
                </div>
              </div>

              {/* Trust Section */}
              <div className="border-t border-slate-200/60 dark:border-zinc-900 pt-12 text-center space-y-5">
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  Securing High-Growth Teams Worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-55 dark:opacity-30">
                  {['AETHER', 'VERIDIAN', 'APEX', 'SENTRY', 'NOVUS'].map((brand) => (
                    <div key={brand} className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 dark:text-zinc-300 hover:opacity-100 transition-opacity">
                      <span className="font-mono text-slate-550 dark:text-zinc-500">◇</span>
                      <span>{brand}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Section */}
              <div id="pricing" className="border-t border-slate-200/60 dark:border-zinc-900 pt-20 max-w-2xl mx-auto space-y-10">
                <div className="text-center space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                    One Simple Flat Rate.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                    Bridge your domain, establish routing, and map users as your team grows.
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl p-8 sm:p-10 shadow-md dark:shadow-zinc-950/20 text-center space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-zinc-800 border border-emerald-100/50 dark:border-zinc-700 px-3 py-1 rounded-full w-fit mx-auto">
                    <Zap className="h-3 w-3" />
                    <span>UNLIMITED ROUTING MAPS</span>
                  </span>
                  
                  <div className="space-y-1">
                    <p className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">$19</p>
                    <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-extrabold tracking-widest uppercase">per month, flat fee</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto font-medium">
                    No complex per-seat hosting fees. Register your business domain name, establish unlimited employee routing profiles, and send/receive professional emails immediately.
                  </p>

                  <button 
                    onClick={onGetStarted}
                    className="w-full max-w-sm mx-auto py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400 text-xs font-bold rounded-xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm flex items-center justify-center gap-2 focus:outline-none min-h-[44px]"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/80 max-w-md mx-auto grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] text-slate-600 dark:text-zinc-400 font-bold text-left pl-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Unlimited Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>DKIM & SPF Aligned</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>No Seat Host Fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Secure Handshakes</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-16 pb-12 px-6 md:px-12 border-t border-slate-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950/70 text-slate-600 dark:text-zinc-400 transition-colors">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Main columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 text-left">
            
            {/* Left Brand Column */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="font-extrabold text-[11px] text-white dark:text-zinc-950">L</span>
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">
                  Mailcoy<span className="text-slate-400 dark:text-zinc-500 font-normal">Connect</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium max-w-sm">
                Zero-migration virtual email layers for high-performance teams. Mapping custom corporate domains to private Gmail assets with flawless security and deliverability standards.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SYSTEM STATUS: OPERATIONAL</span>
              </div>
            </div>

            {/* Middle Links Column 1: Product */}
            <div className="md:col-span-3 space-y-3 text-xs font-semibold">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-mono">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#pricing" onClick={() => { setActiveDoc(null); }} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Flat Pricing Plan
                  </a>
                </li>
                <li>
                  <button onClick={onGetStarted} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left font-semibold">
                    Direct Gateway Access
                  </button>
                </li>
                <li>
                  <button onClick={onLogin} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left font-semibold">
                    Administrator Hub
                  </button>
                </li>
              </ul>
            </div>

            {/* Middle Links Column 2: Governance & Trust */}
            <div className="md:col-span-3 space-y-3 text-xs font-semibold">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-mono">Governance</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => { setActiveDoc('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className={`transition-colors cursor-pointer text-left font-semibold ${activeDoc === 'privacy' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveDoc('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className={`transition-colors cursor-pointer text-left font-semibold ${activeDoc === 'terms' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveDoc('security'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className={`transition-colors cursor-pointer text-left font-semibold ${activeDoc === 'security' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                  >
                    Security Standards
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <hr className="border-slate-200/50 dark:border-zinc-900" />

          {/* Bottom Copyright and Powered-by Details */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 dark:text-zinc-500 font-semibold pt-2">
            <div>
              <span>© 2026 Mailcoy Inc. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-1.5 font-medium bg-slate-100/50 dark:bg-zinc-900 border border-slate-200/30 dark:border-zinc-800/80 px-3 py-1.5 rounded-full shadow-xs">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500">powered by</span>
              <span className="font-extrabold text-slate-700 dark:text-zinc-300 font-display hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Mailcoy Innovations
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
