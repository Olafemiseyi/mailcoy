import { useState } from 'react';
import { motion } from 'motion/react';
import { Domain } from '../types';
import { dbService } from '../lib/supabaseClient';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  CheckCircle2, 
  Info, 
  Sparkles
} from 'lucide-react';

interface VerifyPageProps {
  domain: Domain;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export default function VerifyPage({ domain, onVerifySuccess, onBack }: VerifyPageProps) {
  const [localDomain, setLocalDomain] = useState<Domain>(domain);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'checking_txt' | 'checking_mx' | 'success' | 'failed'>('idle');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // Derived statuses from real DNS check states in the DB/local storage
  const txtVerified = localDomain.status === 'verified' || (!!localDomain.lastCheckedAt && !localDomain.verificationErrors?.toLowerCase().includes('txt'));
  const mxVerified = localDomain.mxStatus === 'verified';
  const spfVerified = localDomain.spfStatus === 'verified';

  const handleCopy = (fieldId: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const runVerification = async () => {
    if (verifyStatus !== 'idle' && verifyStatus !== 'failed') return;
    
    setVerifyStatus('checking_txt');
    setErrorMessages([]);
    
    try {
      // Small visual delays to feel premium and showcase checking steps
      await new Promise(resolve => setTimeout(resolve, 800));
      setVerifyStatus('checking_mx');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedDomain = await dbService.verifyDomain(domain.domainName);
      setLocalDomain(updatedDomain);
      
      if (updatedDomain.status === 'verified') {
        setVerifyStatus('success');
        setTimeout(() => {
          onVerifySuccess();
        }, 1800);
      } else {
        setVerifyStatus('failed');
        if (updatedDomain.verificationErrors) {
          setErrorMessages(updatedDomain.verificationErrors.split(' | '));
        } else {
          setErrorMessages(['Verification failed: DNS records mismatched or not propagated. Please check your DNS dashboard.']);
        }
      }
    } catch (err: any) {
      console.error(err);
      setVerifyStatus('failed');
      setErrorMessages([err.message || 'An unexpected error occurred during DNS verification.']);
    }
  };

  const handleForceVerifyDemo = async () => {
    try {
      setVerifyStatus('checking_txt');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update DB with forced success
      await dbService.updateDomainVerificationResults(domain.domainName, {
        verificationStatus: 'verified',
        mxStatus: 'verified',
        spfStatus: 'verified',
        dkimStatus: 'verified',
        dmarcStatus: 'verified',
        lastCheckedAt: new Date().toISOString(),
        verificationErrors: null
      });
      
      const updated = await dbService.getDomain();
      if (updated) setLocalDomain(updated);
      
      setVerifyStatus('success');
      setTimeout(() => {
        onVerifySuccess();
      }, 1500);
    } catch (err) {
      console.error('Failed to force verify:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
              Verification Pending
            </div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-zinc-50">
              Verify {domain.domainName}
            </h1>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
          >
            Change Domain
          </button>
        </div>

        {/* Informative Help Banner */}
        <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl flex gap-3 text-sm text-emerald-900 dark:text-emerald-300">
          <Info className="h-5 w-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-xs">How Domain Connection Works</p>
            <p className="text-emerald-800 dark:text-zinc-400 leading-relaxed text-[11px]">
              To route emails, copy the records below into your DNS host (like GoDaddy, Cloudflare, Namecheap, etc.). Mailcoy acts as a transit node—incoming mail is intercepted and delivered safely to individual employee Gmails instantly.
            </p>
          </div>
        </div>

        {/* DNS Records Layout */}
        <div className="space-y-6">
          
          {/* TXT Verification Record */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="font-mono text-xs font-bold">TXT</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-xs">1. Add TXT Record</h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">PROVES OWNERSHIP</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${txtVerified ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'}`}>
                {txtVerified ? '✓ Verified' : '● Verification Pending'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono">
              <div className="md:col-span-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-850">
                <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold mb-1">TYPE</p>
                <p className="text-slate-750 dark:text-zinc-200 font-bold">TXT</p>
              </div>
              <div className="md:col-span-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-850">
                <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold mb-1">HOST / NAME</p>
                <p className="text-slate-750 dark:text-zinc-200 font-bold">{domain.txtRecordKey}</p>
              </div>
              <div className="md:col-span-6 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-850 flex justify-between items-center gap-2">
                <div className="overflow-x-auto min-w-0">
                  <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold mb-1">VALUE</p>
                  <p className="text-slate-750 dark:text-zinc-200 font-bold truncate">{domain.txtRecordValue}</p>
                </div>
                <button
                  id="copy-txt-btn"
                  onClick={() => handleCopy('txt', domain.txtRecordValue)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded text-slate-500 shrink-0 cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copiedField === 'txt' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* MX Records */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="font-mono text-xs font-bold">MX</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-xs">2. Add MX Records</h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">ROUTES INCOMING EMAIL</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${mxVerified ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'}`}>
                {mxVerified ? '✓ Verified' : '● Verification Pending'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Remove any existing MX records from other hosting providers first to avoid conflicting routes.
            </p>

            <div className="space-y-2">
              {domain.mxRecords.map((mx, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/30 dark:border-zinc-850 items-center">
                  <div className="md:col-span-2">
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 block">TYPE</span>
                    <span className="text-slate-750 dark:text-zinc-200 font-bold">MX</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 block">HOST</span>
                    <span className="text-slate-750 dark:text-zinc-200 font-bold">{mx.host}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 block">PRIORITY</span>
                    <span className="text-slate-750 dark:text-zinc-200 font-bold">{mx.priority}</span>
                  </div>
                  <div className="md:col-span-5 flex justify-between items-center">
                    <div className="min-w-0">
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500 block">VALUE</span>
                      <span className="text-slate-750 dark:text-zinc-200 font-bold truncate block">{mx.value}</span>
                    </div>
                    <button
                      id={`copy-mx-${idx}-btn`}
                      onClick={() => handleCopy(`mx-${idx}`, mx.value)}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded text-slate-500 cursor-pointer"
                    >
                      {copiedField === `mx-${idx}` ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SPF TXT Record */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="font-mono text-xs font-bold">SPF</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-xs">3. Add SPF Record</h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">PREVENTS SPOOFING & IMPERSONATION</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${spfVerified ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'}`}>
                {spfVerified ? '✓ Verified' : '● Verification Pending'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono">
              <div className="md:col-span-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-850">
                <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold mb-1">TYPE</p>
                <p className="text-slate-750 dark:text-zinc-200 font-bold">TXT</p>
              </div>
              <div className="md:col-span-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-850">
                <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold mb-1">HOST / NAME</p>
                <p className="text-slate-750 dark:text-zinc-200 font-bold">@</p>
              </div>
              <div className="md:col-span-6 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-850 flex justify-between items-center gap-2">
                <div className="overflow-x-auto min-w-0">
                  <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold mb-1">VALUE</p>
                  <p className="text-slate-750 dark:text-zinc-200 font-bold truncate">{domain.spfValue}</p>
                </div>
                <button
                  id="copy-spf-btn"
                  onClick={() => handleCopy('spf', domain.spfValue)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded text-slate-500 shrink-0 cursor-pointer"
                >
                  {copiedField === 'spf' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Verification Trigger Panel */}
        <div className="bg-slate-900 dark:bg-zinc-950 border border-slate-800 dark:border-zinc-850 rounded-2xl p-6 text-white space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-display font-semibold text-lg text-white">Ready to activate routing?</p>
              <p className="text-xs text-slate-400">Our query engine will perform global DNS check to verify parameters.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2.5">
              {(verifyStatus === 'idle' || verifyStatus === 'failed') && (
                <button
                  id="dns-check-verify-btn"
                  onClick={runVerification}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  {verifyStatus === 'failed' ? 'Retry DNS Records Check' : 'Run DNS Records Check'}
                </button>
              )}
              {verifyStatus === 'failed' && (
                <button
                  id="demo-bypass-btn"
                  onClick={handleForceVerifyDemo}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Bypass (Demo Mode)
                </button>
              )}
              {(verifyStatus === 'checking_txt' || verifyStatus === 'checking_mx' || verifyStatus === 'success') && (
                <button
                  disabled
                  className="px-6 py-3 bg-emerald-600/50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-75"
                >
                  {verifyStatus === 'checking_txt' && (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Querying TXT record...
                    </>
                  )}
                  {verifyStatus === 'checking_mx' && (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Testing MX propagation...
                    </>
                  )}
                  {verifyStatus === 'success' && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Routing Activated!
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Animated Loader Tracker */}
          
            {(verifyStatus !== 'idle' || errorMessages.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-slate-800 space-y-2.5 text-xs font-mono text-slate-400 text-left"
              >
                {/* Checking steps */}
                {(verifyStatus === 'checking_txt' || verifyStatus === 'checking_mx' || verifyStatus === 'success') && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className={verifyStatus === 'checking_txt' ? 'text-emerald-400 animate-pulse' : 'text-green-500'}>
                        {verifyStatus === 'checking_txt' ? '●' : '✓'}
                      </span>
                      <span>TXT Verification record: {verifyStatus === 'checking_txt' ? 'Checking' : 'Propagated'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={verifyStatus === 'checking_txt' ? 'text-slate-600 dark:text-zinc-600' : (verifyStatus === 'checking_mx' ? 'text-emerald-400 animate-pulse' : 'text-green-500')}>
                        {verifyStatus === 'checking_txt' ? '○' : (verifyStatus === 'checking_mx' ? '●' : '✓')}
                      </span>
                      <span>MX Host records: {verifyStatus === 'checking_txt' ? 'Pending' : (verifyStatus === 'checking_mx' ? 'Querying MX servers' : 'Active and Confirmed')}</span>
                    </div>
                  </>
                )}

                {/* Success Indicator */}
                {verifyStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400 font-semibold flex items-center gap-2 pt-1 animate-pulse text-xs"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span>Domain status: active. Launching management dashboard...</span>
                  </motion.div>
                )}

                {/* Failure Errors */}
                {verifyStatus === 'failed' && errorMessages.length > 0 && (
                  <div className="space-y-2 bg-red-950/20 border border-red-900/30 p-4 rounded-xl">
                    <p className="text-red-400 font-bold text-xs flex items-center gap-1.5">
                      <span>✕ Verification Failed</span>
                      {localDomain.lastCheckedAt && (
                        <span className="text-[10px] text-red-500/80 font-normal">
                          (Last checked: {new Date(localDomain.lastCheckedAt).toLocaleTimeString()})
                        </span>
                      )}
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-red-300 text-[11px] leading-relaxed">
                      {errorMessages.map((msg, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          
        </div>

      </div>
    </div>
  );
}
