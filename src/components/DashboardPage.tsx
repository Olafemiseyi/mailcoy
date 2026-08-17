import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Domain, Employee, EmailLog } from '../types';
import { 
  Globe, 
  Users, 
  ShieldCheck, 
  Plus, 
  Settings, 
  X,
  Sparkles,
  ArrowRight,
  Database,
  Terminal,
  Activity
} from 'lucide-react';
import EmailHealthMonitor from './EmailHealthMonitor';

interface DashboardPageProps {
  domain: Domain | null;
  employees: Employee[];
  emailLogs: EmailLog[];
  onAddEmailLog?: (log: Omit<EmailLog, 'id' | 'timestamp'>) => void;
  onNavigateToEmployees: () => void;
  onNavigateToSettings?: () => void;
  onAddEmployee: (name: string, companyEmail: string, personalGmail: string) => void;
  user: any;
}

export default function DashboardPage({
  domain,
  employees,
  emailLogs,
  onAddEmailLog,
  onNavigateToEmployees,
  onNavigateToSettings,
  onAddEmployee,
  user
}: DashboardPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form Fields
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpGmail, setNewEmpGmail] = useState('');
  const [newEmpPrefix, setNewEmpPrefix] = useState('');
  const [addError, setAddError] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddEmployeeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newEmpName.trim() || !newEmpGmail.trim() || !newEmpPrefix.trim()) {
      setAddError('Please fill out all fields.');
      return;
    }

    if (!newEmpGmail.toLowerCase().endsWith('@gmail.com')) {
      setAddError('Destination target must be a valid @gmail.com address.');
      return;
    }

    const domainName = domain?.domainName || 'company.com';
    const companyEmail = `${newEmpPrefix.toLowerCase().replace(/\s+/g, '')}@${domainName}`;

    if (employees.some(emp => emp.companyEmail.toLowerCase() === companyEmail.toLowerCase())) {
      setAddError(`Business address ${companyEmail} is already allocated.`);
      return;
    }

    onAddEmployee(newEmpName, companyEmail, newEmpGmail);
    showToast(`Successfully created email route for ${newEmpName}`);
    setIsAddModalOpen(false);

    // Reset Form
    setNewEmpName('');
    setNewEmpGmail('');
    setNewEmpPrefix('');
  };

  const domainName = domain?.domainName || 'company.com';
  const domainStatus = domain?.status || 'pending';

  return (
    <div className="space-y-8 pb-16 text-left font-sans antialiased max-w-4xl mx-auto">
      
      {/* Toast Alert */}
      
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-55 max-w-sm bg-slate-900 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 dark:border-zinc-200"
          >
            <div className="h-4 w-4 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
            <p className="text-xs font-bold">{toast}</p>
          </motion.div>
        )}
      

      {/* Control Center Welcome Header */}
      <div className="pb-6 border-b border-slate-200/60 dark:border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Monitor and administer professional Gmail gateway and team mapping parameters.
          </p>
        </div>

        {/* Live Active Status indicator */}
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 px-3 py-1.5 rounded-xl text-[10px] font-bold w-fit">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>SMTP RELAYS SECURE</span>
        </div>
      </div>

      {/* Grid of Minimal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Domain Status */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-850/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Domain Connection</span>
            <Globe className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
          </div>
          <div>
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-zinc-200 block truncate">
              {domainName}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`w-1.5 h-1.5 rounded-full ${domainStatus === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${domainStatus === 'verified' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {domainStatus === 'verified' ? 'Active & Aligned' : 'Verification Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Number of Employees */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-850/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Registered Seats</span>
            <Users className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight block font-display">
              {employees.length}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase block mt-1 tracking-wider">
              Outbound Forwarders Mapped
            </span>
          </div>
        </div>

        {/* Card 3: Connection Status */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-850/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Relay Integrity</span>
            <ShieldCheck className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
          </div>
          <div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block truncate font-mono">
              99.99% Up-time Verified
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase block mt-2 tracking-wider">
              Cryptographic In-Memory Flow
            </span>
          </div>
        </div>

      </div>

      {/* Main Action Panel */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-md shadow-slate-100/30 dark:shadow-zinc-950/20 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-md mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/30 rounded-full text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Workspace Gateway Initialized</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Manage Active Forwarding Rules</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
            Link additional custom prefix addresses to team personal targets, or verify DNS SPF/DKIM verification structures.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-sm mx-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px] transition-all hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
          
          <button
            onClick={onNavigateToSettings}
            className="w-full py-2.5 px-5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px]"
          >
            <Settings className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <span>Manage Domain</span>
          </button>
        </div>
      </div>

      {/* Email Health Monitor Panel */}
      <EmailHealthMonitor 
        employees={employees}
        emailLogs={emailLogs}
        onAddEmailLog={onAddEmailLog}
        onNavigateToEmployees={onNavigateToEmployees}
        domainName={domainName}
      />

      {/* Quick Add Employee Modal */}
      
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setAddError('');
              }}
              className="absolute inset-0 bg-slate-950"
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 space-y-5 border border-slate-200 dark:border-zinc-800 text-left"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Provision Email Route</h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">Link a business address to their personal Gmail target.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setAddError('');
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-850 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleAddEmployeeSubmit} className="space-y-4 text-xs font-bold text-slate-700 dark:text-zinc-400">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    placeholder="E.g. Sarah Jenkins"
                    className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Professional Email Name</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      value={newEmpPrefix}
                      onChange={(e) => setNewEmpPrefix(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="sarah"
                      className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-l-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                    />
                    <span className="bg-slate-100 dark:bg-zinc-950 border border-l-0 border-slate-200 dark:border-zinc-800 px-4 py-3 rounded-r-xl text-xs font-mono text-slate-500 select-none">
                      @{domainName}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Recipient Personal Gmail</label>
                  <input
                    type="email"
                    required
                    value={newEmpGmail}
                    onChange={(e) => setNewEmpGmail(e.target.value)}
                    placeholder="sarah.jenkins.design@gmail.com"
                    className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                  />
                </div>

                {addError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl font-medium">
                    {addError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setAddError('');
                    }}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-slate-500 dark:text-zinc-400 cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    Provision Route
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      

    </div>
  );
}
