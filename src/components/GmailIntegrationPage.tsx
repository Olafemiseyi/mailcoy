import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Check, ShieldCheck, Layers, ExternalLink, ChevronRight, Info, Zap } from "lucide-react";

interface GmailIntegrationPageProps {
  onNavigate?: (page: 'landing' | 'auth' | 'welcome' | 'verify' | 'dashboard' | 'employees' | 'gmail' | 'settings') => void;
  userEmail?: string;
  domainName?: string;
}

export default function GmailIntegrationPage({ onNavigate, userEmail = 'john@gmail.com', domainName = 'company.com' }: GmailIntegrationPageProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast("Gmail workspace sync successfully refreshed!");
    }, 1000);
  };

  return (
    <div className="space-y-8 font-sans w-full max-w-5xl mx-auto pb-20 text-left antialiased">
      
      {/* Toast Notification */}
      
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-55 max-w-sm bg-slate-900 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 dark:border-zinc-200"
          >
            <div className="h-4 w-4 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">✓</div>
            <p className="text-xs font-semibold">{toast}</p>
          </motion.div>
        )}
      

      {/* Elegant Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-zinc-850">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-50 dark:bg-zinc-850 text-slate-500 font-mono border border-slate-200/50 dark:border-zinc-800">
              Gmail Active Connection
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Gmail Integration
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-400">
            Use your professional business identity seamlessly from your standard personal Gmail inbox.
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="py-2.5 px-4 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          {isSyncing ? 'Refreshing Bridge...' : 'Refresh Connection'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Connection Status Panel */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Status Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Connection status</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/35">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Gateway
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-50 dark:border-zinc-850">
                <span className="text-slate-400 font-semibold">Workspace Domain</span>
                <span className="font-mono text-slate-800 dark:text-zinc-200 font-bold">{domainName}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-50 dark:border-zinc-850">
                <span className="text-slate-400 font-semibold">Target Account</span>
                <span className="font-mono text-slate-800 dark:text-zinc-200 font-bold">{userEmail}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5">
                <span className="text-slate-400 font-semibold">SMTP Auth Gateway</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Encrypted SSL/TLS</span>
              </div>
            </div>
          </div>

          {/* Secure Routing explanation info box */}
          <div className="p-5 bg-slate-50 dark:bg-zinc-900/40 border border-slate-150/40 dark:border-zinc-850 rounded-2xl flex gap-3.5">
            <ShieldCheck className="h-5.5 w-5.5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-800 dark:text-zinc-200 block">Cryptographic Integrity</span>
              <p className="text-[11px] text-slate-400 dark:text-zinc-400 leading-relaxed font-medium">
                Mailcoy securely bridges your professional SMTP credentials into your Google Workspace token chain. Outbound emails maintain absolute SPF & DKIM validation.
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic Instructional Guide */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">How to use Mailcoy in Gmail</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Your identity mapping is instant. Follow these simple steps inside your standard Gmail client.</p>
            </div>

            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-zinc-800">
              
              {/* Step 1 */}
              <div className="flex gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 z-10 border border-emerald-100 dark:border-emerald-900/40">
                  1
                </div>
                <div className="space-y-1.5 text-xs pt-0.5">
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200">Open Gmail Compose</h4>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-400 font-medium leading-relaxed">
                    Click the "Compose" button as you normally do to start writing a new email message or replying to an active thread.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 z-10 border border-emerald-100 dark:border-emerald-900/40">
                  2
                </div>
                <div className="space-y-1.5 text-xs pt-0.5">
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200">Select Business Sender Identity</h4>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-400 font-medium leading-relaxed">
                    Click your email inside the <strong className="font-semibold text-slate-700 dark:text-zinc-300">"From"</strong> dropdown selector at the top of your composition panel. Your business identity <strong className="font-semibold text-slate-700 dark:text-zinc-300">name@{domainName}</strong> will appear automatically.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 z-10 border border-emerald-100 dark:border-emerald-900/40">
                  3
                </div>
                <div className="space-y-1.5 text-xs pt-0.5">
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200">Send & Receive Instantly</h4>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-400 font-medium leading-relaxed">
                    Write your message and click send. Receivers see your message as coming directly from your custom brand domain. Replies route straight back into Gmail.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
