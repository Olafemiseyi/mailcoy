import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Globe, Plus, Trash2, ArrowRight, ArrowLeft, Mail, Check, Loader2, Zap } from "lucide-react";

interface WelcomePageProps {
  userName: string;
  onConnectDomain: (domain: string, initialEmployees?: { name: string; gmail: string; business: string }[], companyName?: string) => void | Promise<void>;
  onLogout: () => void;
  initialCompanyName?: string;
  initialDomainInput?: string;
}

interface EmployeeMapping {
  id: string;
  name: string;
  gmail: string;
  prefix: string;
}

export default function WelcomePage({ 
  userName, 
  onConnectDomain, 
  onLogout,
  initialCompanyName = 'Acme Corp',
  initialDomainInput = 'company.com'
}: WelcomePageProps) {
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [domainInput, setDomainInput] = useState('');
  const [companyName, setCompanyName] = useState(initialCompanyName === 'Acme Corp' ? '' : initialCompanyName);
  const [error, setError] = useState('');
  
  // Dynamic employee mapping list (Step 2)
  const [mappings, setMappings] = useState<EmployeeMapping[]>([
    { id: '1', name: '', gmail: '', prefix: '' }
  ]);

  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Handlers
  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domainInput)) {
      setError('Please enter a valid business domain (e.g., company.com).');
      return;
    }
    
    // Update mapping prefixes if default row
    if (mappings.length === 1 && mappings[0].id === '1' && mappings[0].prefix === 'john') {
      const userPrefix = userName ? userName.split(' ')[0].toLowerCase() : 'john';
      setMappings([
        { id: '1', name: userName, gmail: `${userPrefix}@gmail.com`, prefix: userPrefix }
      ]);
    }
    
    setWizardStep(2);
  };

  const handleAddRow = () => {
    const newId = Date.now().toString();
    setMappings(prev => [...prev, { id: newId, name: '', gmail: '', prefix: '' }]);
  };

  const handleRemoveRow = (id: string) => {
    if (mappings.length === 1) return; // Must have at least one mapping
    setMappings(prev => prev.filter(m => m.id !== id));
  };

  const handleMappingChange = (id: string, field: keyof EmployeeMapping, val: string) => {
    setMappings(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: val };
        // Auto-generate prefix if changing name and prefix is empty/matches old name
        if (field === 'name' && (!m.prefix || m.prefix === m.name.toLowerCase().replace(/\s+/g, ''))) {
          updated.prefix = val.toLowerCase().replace(/\s+/g, '');
        }
        return updated;
      }
      return m;
    }));
  };

  const handleStep2Submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    const hasInvalid = mappings.some(m => !m.name.trim() || !m.gmail.trim() || !m.prefix.trim());
    if (hasInvalid) {
      setError('Please fill in all names, Gmail addresses, and business email prefixes.');
      return;
    }

    const hasInvalidGmail = mappings.some(m => !m.gmail.toLowerCase().endsWith('@gmail.com'));
    if (hasInvalidGmail) {
      setError('All forwarding destinations must be valid @gmail.com addresses.');
      return;
    }

    setWizardStep(3);
  };

  const handleConnectGmailOAuth = () => {
    setIsConnectingGmail(true);
    setTimeout(() => {
      setIsConnectingGmail(false);
      setWizardStep(4);
    }, 1500); // Simple short loading feedback
  };

  const handleFinalLaunch = async () => {
    setError('');
    setIsLaunching(true);
    try {
      // Structure initial employees to pass to parent App state
      const formatted = mappings.map(m => ({
        name: m.name,
        gmail: m.gmail,
        business: `${m.prefix.toLowerCase()}@${domainInput}`
      }));
      await onConnectDomain(domainInput, formatted, companyName);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to complete workspace initialization. Please try again.');
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 antialiased font-sans select-none">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Onboarding Header */}
        <div className="flex justify-between items-center text-xs text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider px-1">
          <span>
            {wizardStep === 1 && 'Step 1: Domain'}
            {wizardStep === 2 && 'Step 2: Team Emails'}
            {wizardStep === 3 && 'Step 3: Access'}
            {wizardStep === 4 && 'Complete'}
          </span>
          <span className="font-mono text-[10px]">
            {wizardStep <= 3 ? `${wizardStep} of 3` : 'Ready'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-200 dark:bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-600 rounded-full"
            animate={{ width: `${(wizardStep / 4) * 100}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl shadow-xl p-6 sm:p-10 text-left">
          
            
            {/* STEP 1: Enter Business Domain */}
            {wizardStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Enter Business Domain
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                    What domain do you want to use for your team's professional identities?
                  </p>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="E.g. Acme Corp"
                      className="block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-zinc-950 outline-none text-slate-800 dark:text-zinc-100 focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Business Domain
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs text-slate-400 font-semibold font-mono">
                        https://
                      </span>
                      <input
                        type="text"
                        required
                        value={domainInput}
                        onChange={(e) => setDomainInput(e.target.value.toLowerCase().trim())}
                        placeholder="company.com"
                        className="pl-18 block w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-zinc-950 outline-none text-slate-800 dark:text-zinc-100 focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
                      {error}
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={onLogout}
                      className="px-4 py-3 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-slate-500 cursor-pointer"
                    >
                      Logout
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Create Team Emails */}
            {wizardStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Create Team Emails
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                    Map custom business aliases straight to their existing Gmail accounts.
                  </p>
                </div>

                <form onSubmit={handleStep2Submit} className="space-y-4">
                  
                  {/* Dynamic Mappings List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {mappings.map((mapping, idx) => (
                      <div 
                        key={mapping.id} 
                        className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200/65 dark:border-zinc-850 rounded-xl space-y-3 relative"
                      >
                        {mappings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(mapping.id)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            title="Remove row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
                            <input
                              type="text"
                              required
                              value={mapping.name}
                              onChange={(e) => handleMappingChange(mapping.id, 'name', e.target.value)}
                              placeholder="E.g. Sarah Jenkins"
                              className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 bg-white dark:bg-zinc-900 outline-none text-slate-800 dark:text-zinc-200 font-semibold"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Destination Gmail</span>
                            <input
                              type="email"
                              required
                              value={mapping.gmail}
                              onChange={(e) => handleMappingChange(mapping.id, 'gmail', e.target.value)}
                              placeholder="sarah@gmail.com"
                              className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 bg-white dark:bg-zinc-900 outline-none text-slate-800 dark:text-zinc-200 font-semibold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Business Address</span>
                          <div className="flex items-center">
                            <input
                              type="text"
                              required
                              value={mapping.prefix}
                              onChange={(e) => handleMappingChange(mapping.id, 'prefix', e.target.value.toLowerCase().replace(/\s+/g, ''))}
                              placeholder="sarah"
                              className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-l-lg px-2.5 py-1.5 bg-white dark:bg-zinc-900 outline-none text-slate-800 dark:text-zinc-200 font-semibold"
                            />
                            <span className="bg-slate-100 dark:bg-zinc-900 border border-l-0 border-slate-200 dark:border-zinc-800 px-3 py-1.5 rounded-r-lg text-[11px] font-mono font-bold text-slate-500 select-none">
                              @{domainInput}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="w-full py-2.5 border border-dashed border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Member</span>
                  </button>

                  {error && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
                      {error}
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-zinc-850">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-3 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-slate-500 cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Connect Gmail (OAuth) */}
            {wizardStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Connect Gmail
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    This allows employees to send and receive emails using their business identity inside Gmail.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-850 rounded-xl text-left text-xs leading-relaxed text-slate-500 space-y-1.5">
                  <p className="font-bold text-slate-700 dark:text-zinc-300">How this works securely:</p>
                  <p className="text-[11px]">
                    1. Mailcoy establishes a safe outbound SMTP relay for <strong className="font-semibold text-slate-700 dark:text-zinc-300">@{domainInput}</strong>.
                  </p>
                  <p className="text-[11px]">
                    2. By authorizing Gmail connection, your employees get instant aliases mapped perfectly to their inbox with zero config required.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-3 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-slate-500 cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleConnectGmailOAuth}
                    disabled={isConnectingGmail}
                    className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isConnectingGmail ? (
                      <span>Establishing secure handshake...</span>
                    ) : (
                      <>
                        <span>Connect Gmail</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Success Screen */}
            {wizardStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30">
                  <Check className="h-6 w-6" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Your team is ready
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    Your domain <strong className="text-slate-800 dark:text-zinc-300 font-bold">{domainInput}</strong> is mapped, employees are configured, and the Gmail gateway is initialized.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium max-w-sm mx-auto">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleFinalLaunch}
                  disabled={isLaunching}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLaunching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Initializing secure workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Control Center</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

          
        </div>
      </div>
    </div>
  );
}
