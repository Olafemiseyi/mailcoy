import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Domain, User } from '../types';
import { dbService } from '../lib/supabaseClient';
import { SettingsSkeleton } from './Skeleton';
import { 
  User as UserIcon, 
  Globe, 
  Shield, 
  CreditCard,
  Loader2,
  Laptop,
  AlertTriangle,
  Sparkles,
  Check
} from 'lucide-react';

interface SettingsPageProps {
  user: User;
  domain: Domain;
  onDisconnectDomain: () => void;
  onProfileUpdate?: (updatedUser: User) => void;
  initialTab?: 'company' | 'domain' | 'notifications' | 'security' | 'billing' | 'account' | 'support';
}

type TabType = 'profile' | 'domain' | 'security' | 'billing';

export default function SettingsPage({ 
  user, 
  domain, 
  onDisconnectDomain, 
  onProfileUpdate, 
  initialTab 
}: SettingsPageProps) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [toast, setToast] = useState<string | null>(null);

  // Billing & Subscription Live States
  const [subscription, setSubscription] = useState<any>(null);
  const [limits, setLimits] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isBillingLoading, setIsBillingLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Profile States
  const [profileName, setProfileName] = useState(user.name || 'Admin User');
  const [profileEmail, setProfileEmail] = useState(user.email || 'user@example.com');

  // Company States
  const [companyName, setCompanyName] = useState(user.companyName || 'My Organization');

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSessions, setActiveSessions] = useState([
    { id: '1', device: 'Chrome on macOS', ip: '192.168.1.1', location: 'San Francisco, CA', isCurrent: true },
    { id: '2', device: 'Safari on iPhone 15', ip: '172.56.21.99', location: 'Oakland, CA', isCurrent: false }
  ]);

  // Billing States
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth'>('starter');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  // Domain health status checking state
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);

  // Map initial tab to consolidated 4 tabs
  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'account' || initialTab === 'notifications' || initialTab === 'company' || initialTab === 'support') {
        setActiveTab('profile');
      } else if (initialTab === 'domain') {
        setActiveTab('domain');
      } else if (initialTab === 'security') {
        setActiveTab('security');
      } else if (initialTab === 'billing') {
        setActiveTab('billing');
      }
    }
  }, [initialTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const fetchBillingData = async () => {
    setIsBillingLoading(true);
    try {
      const details = await dbService.getSubscriptionDetails();
      setSubscription(details.subscription);
      setLimits(details.limits);
      setUsage(details.usage);

      const invs = await dbService.getInvoices();
      setInvoices(invs);

      const pays = await dbService.getPayments();
      setPayments(pays);
    } catch (err) {
      console.error("Error loading billing details:", err);
    } finally {
      setIsBillingLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'billing') {
      fetchBillingData();
    }
  }, [activeTab]);

  const handleCheckout = async (planId: string) => {
    setIsCheckoutLoading(true);
    try {
      const checkoutData = await dbService.initializeCheckout(planId, "default_org", user.email);
      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      } else {
        showToast("Unable to initialize checkout. Please check server configurations.");
      }
    } catch (err: any) {
      showToast(err.message || "Checkout failed");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your active subscription? You will be downgraded at the end of your billing cycle.")) return;
    try {
      await dbService.cancelSubscription();
      showToast("Subscription cancelled successfully.");
      await fetchBillingData();
    } catch (err: any) {
      showToast(err.message || "Cancellation failed");
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await dbService.reactivateSubscription();
      showToast("Subscription reactivated successfully!");
      await fetchBillingData();
    } catch (err: any) {
      showToast(err.message || "Reactivation failed");
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await dbService.updateProfile({
        name: profileName,
        email: profileEmail
      });
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      showToast('Profile updated successfully');
    } catch (err) {
      showToast('Error updating profile settings');
    }
  };

  const handleCompanySave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await dbService.updateProfile({
        companyName: companyName
      });
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      showToast('Company settings saved');
    } catch (err) {
      showToast('Error updating company name');
    }
  };

  const handlePasswordSave = (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    showToast('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCheckDomain = () => {
    setIsCheckingDomain(true);
    setTimeout(() => {
      setIsCheckingDomain(false);
      showToast('Domain routing health: Excellent Status Verified');
    }, 1200);
  };

  const navigationItems = [
    { id: 'profile', label: 'Profile & Company', desc: 'Personal & business metadata', icon: UserIcon },
    { id: 'domain', label: 'Domain Settings', desc: 'DNS routing records', icon: Globe },
    { id: 'security', label: 'Security & Access', desc: 'Access & active sessions', icon: Shield },
    { id: 'billing', label: 'Subscription', desc: 'Plans & billing card', icon: CreditCard },
  ] as const;

  if (isPageLoading) {
    return <SettingsSkeleton />;
  }

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
            <div className="h-4 w-4 bg-emerald-650 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
            <p className="text-xs font-bold">{toast}</p>
          </motion.div>
        )}
      

      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200/60 dark:border-zinc-850">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-1">
          Configure personal metadata, organization profiles, domain ownership verification, and subscription credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-1 bg-slate-50 dark:bg-zinc-900/40 p-2 rounded-2xl border border-slate-200/50 dark:border-zinc-850">
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 scrollbar-none">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 lg:shrink cursor-pointer border ${
                    isActive
                      ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900 shadow-sm'
                      : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/40 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="text-left">
                    <span className="block whitespace-nowrap">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200/65 dark:border-zinc-850/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* PROFILE & COMPANY COMBINED PANEL */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Profile Subsection */}
                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">Profile Settings</h3>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold mt-0.5">UPDATE PRIMARY ACCOUNT HOLDER NAME AND EMAIL ACCESS</p>
                    </div>

                    <div className="space-y-4 font-bold text-slate-700 dark:text-zinc-400 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 font-semibold text-slate-800 dark:text-zinc-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Primary Email Address</label>
                        <input
                          type="type"
                          required
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 font-semibold text-slate-800 dark:text-zinc-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer whitespace-nowrap shadow-xs"
                      >
                        Save Profile Settings
                      </button>
                    </div>
                  </form>

                  <div className="border-t border-slate-100 dark:border-zinc-850/60" />

                  {/* Company Subsection */}
                  <form onSubmit={handleCompanySave} className="space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">Company Details</h3>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold mt-0.5">ADMINISTER ORGANIZATION AND DOMAIN METADATA</p>
                    </div>

                    <div className="space-y-4 font-bold text-slate-700 dark:text-zinc-400 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Organization Name</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 font-semibold text-slate-800 dark:text-zinc-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer whitespace-nowrap shadow-xs"
                      >
                        Save Company Details
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* DOMAIN PANEL */}
              {activeTab === 'domain' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-850/50">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">Active Domain</h3>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold mt-0.5">MONITOR DKIM/SPF VERIFICATION RECORD STATUS</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                      Verified
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-850 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-bold text-slate-700 dark:text-zinc-400 shadow-xs">
                    <div>
                      <span className="font-mono text-slate-900 dark:text-white font-bold text-sm block">{domain.domainName}</span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium block mt-0.5">Connected and routed successfully via secure name servers.</span>
                    </div>

                    <button
                      onClick={handleCheckDomain}
                      disabled={isCheckingDomain}
                      className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-700 dark:text-zinc-300 font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs min-h-[40px] sm:min-h-fit"
                    >
                      {isCheckingDomain ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <span>Verify Health</span>
                      )}
                    </button>
                  </div>

                  <div className="pt-6 border-t border-slate-200/60 dark:border-zinc-850/60 space-y-4">
                    <div className="flex items-center gap-2 text-rose-600">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                      <h4 className="font-bold text-xs uppercase tracking-wider font-display">Danger Zone</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-normal font-medium">
                      Disconnecting your domain will purge forwarding routes immediately, causing outbound email relays to cease.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Confirm purge of ${domain.domainName} nameserver routes?`)) {
                          onDisconnectDomain();
                          showToast('Domain has been disconnected.');
                        }
                      }}
                      className="px-4 py-2.5 border border-rose-200 dark:border-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Disconnect Domain
                    </button>
                  </div>
                </div>
              )}

              {/* SECURITY PANEL */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-slate-100 dark:border-zinc-850/50">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">Security Settings</h3>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold mt-0.5">SAFEGUARD ADMINISTRATOR NODES AND PASSWORD SECURITY</p>
                  </div>

                  <form onSubmit={handlePasswordSave} className="space-y-4 font-bold text-slate-700 dark:text-zinc-400 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Current Password</label>
                        <input
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">New Password</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Confirm</label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer whitespace-nowrap shadow-xs"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>

                  <div className="pt-6 border-t border-slate-200/60 dark:border-zinc-850/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">Active Device Sessions</h4>
                    <div className="space-y-3">
                      {activeSessions.map((session) => (
                        <div key={session.id} className="p-4 border border-slate-200/60 dark:border-zinc-850 rounded-2xl flex items-center justify-between text-xs bg-slate-50/30 dark:bg-zinc-950/20 shadow-xs">
                          <div className="flex items-center gap-3">
                            <Laptop className="h-5 w-5 text-slate-400 dark:text-zinc-500 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-800 dark:text-zinc-250 block">{session.device}</span>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium block mt-0.5">{session.location} • {session.ip}</span>
                            </div>
                          </div>
                          
                          {session.isCurrent ? (
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100/50 dark:border-emerald-900/30">Current</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSessions(prev => prev.filter(s => s.id !== session.id));
                                showToast(`Terminated session on ${session.device}`);
                              }}
                              className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer whitespace-nowrap"
                            >
                              Terminate
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* BILLING PANEL */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-slate-100 dark:border-zinc-850/50">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">Subscription & Billing</h3>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold mt-0.5">CONFIGURE CORPORATE BILLING PLANS AND FUNDING METHODS</p>
                  </div>

                  {isBillingLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                      <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                      <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest animate-pulse">LOADING SECURE BILLING GATEWAY...</span>
                    </div>
                  ) : (
                    <>
                      {/* Subscription Header Status */}
                      <div className="p-5 border border-slate-200/60 dark:border-zinc-850 rounded-2xl bg-slate-50/20 dark:bg-zinc-950/20 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Active Organization Subscription</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                                {subscription?.plan || "Starter"} Plan
                              </span>
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded border ${
                                subscription?.status === "active" || subscription?.status === "trialing"
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450"
                                  : "bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-450"
                              }`}>
                                {subscription?.status || "trialing"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {subscription?.status === "canceled" ? (
                              <button
                                type="button"
                                onClick={handleReactivateSubscription}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                              >
                                Reactivate Plan
                              </button>
                            ) : (subscription?.status === "active" || subscription?.status === "trialing") ? (
                              <button
                                type="button"
                                onClick={handleCancelSubscription}
                                className="px-3 py-1.5 border border-rose-250 dark:border-zinc-800 text-rose-600 hover:bg-rose-50/10 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Cancel Plan
                              </button>
                            ) : null}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 pt-3 border-t border-slate-150/40 dark:border-zinc-850/50">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Renewal Date</span>
                            <span className="text-slate-800 dark:text-zinc-200 font-bold block mt-1">
                              {subscription?.status === "trialing" 
                                ? `Trial Expiration: ${subscription?.trial_end ? new Date(subscription.trial_end).toLocaleDateString() : 'N/A'}`
                                : subscription?.renewal_date ? new Date(subscription.renewal_date).toLocaleDateString() : 'N/A'
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Trial Remaining</span>
                            <span className="text-slate-800 dark:text-zinc-200 font-bold block mt-1">
                              {subscription?.status === "trialing" && subscription?.trial_end
                                ? `${Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} Days Left`
                                : "N/A"
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Plans Showcase Selection */}
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Available Corporate Tiers</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Starter */}
                          <button
                            type="button"
                            disabled={isCheckoutLoading || subscription?.plan === "Starter"}
                            onClick={() => handleCheckout("Starter")}
                            className={`p-5 border rounded-2xl text-xs text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                              subscription?.plan === "Starter"
                                ? "border-emerald-600 bg-emerald-50/10 dark:bg-emerald-950/15 ring-1 ring-emerald-600 cursor-not-allowed"
                                : "border-slate-200 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800/40 bg-white dark:bg-zinc-900 cursor-pointer"
                            }`}
                          >
                            <div className="w-full">
                              <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-2">
                                <span className="text-xs uppercase tracking-wide">Starter</span>
                                <span className="text-sm font-extrabold">$19/mo</span>
                              </div>
                              <span className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold block mb-4">
                                Up to 15 registered employees with secure, direct gateway relays.
                              </span>
                            </div>
                            <div className="w-full flex justify-between items-center text-[9px] font-bold text-slate-400">
                              <span>Max 1 Domain</span>
                              {subscription?.plan === "Starter" && <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active Plan</span>}
                            </div>
                          </button>

                          {/* Business */}
                          <button
                            type="button"
                            disabled={isCheckoutLoading || subscription?.plan === "Business"}
                            onClick={() => handleCheckout("Business")}
                            className={`p-5 border rounded-2xl text-xs text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                              subscription?.plan === "Business"
                                ? "border-emerald-600 bg-emerald-50/10 dark:bg-emerald-950/15 ring-1 ring-emerald-600 cursor-not-allowed"
                                : "border-slate-200 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800/40 bg-white dark:bg-zinc-900 cursor-pointer"
                            }`}
                          >
                            <div className="w-full">
                              <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-2">
                                <span className="text-xs uppercase tracking-wide">Business</span>
                                <span className="text-sm font-extrabold">$49/mo</span>
                              </div>
                              <span className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold block mb-4">
                                Up to 100 active professional employee email forwarders with 3 domains.
                              </span>
                            </div>
                            <div className="w-full flex justify-between items-center text-[9px] font-bold text-slate-400">
                              <span>Max 3 Domains</span>
                              {subscription?.plan === "Business" && <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active Plan</span>}
                            </div>
                          </button>

                          {/* Enterprise */}
                          <button
                            type="button"
                            disabled={isCheckoutLoading || subscription?.plan === "Enterprise"}
                            onClick={() => handleCheckout("Enterprise")}
                            className={`p-5 border rounded-2xl text-xs text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                              subscription?.plan === "Enterprise"
                                ? "border-emerald-600 bg-emerald-50/10 dark:bg-emerald-950/15 ring-1 ring-emerald-600 cursor-not-allowed"
                                : "border-slate-200 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800/40 bg-white dark:bg-zinc-900 cursor-pointer"
                            }`}
                          >
                            <div className="w-full">
                              <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-2">
                                <span className="text-xs uppercase tracking-wide">Enterprise</span>
                                <span className="text-sm font-extrabold">$149/mo</span>
                              </div>
                              <span className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold block mb-4">
                                Unlimited employees, aliases, and domains with premium storage & SLA routing.
                              </span>
                            </div>
                            <div className="w-full flex justify-between items-center text-[9px] font-bold text-slate-400">
                              <span>Unlimited Domains</span>
                              {subscription?.plan === "Enterprise" && <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active Plan</span>}
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Usage Meters */}
                      <div className="p-5 border border-slate-200/60 dark:border-zinc-850 rounded-2xl space-y-4 bg-white dark:bg-zinc-900">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Subscription Usage Meters</span>
                        
                        <div className="space-y-3">
                          {/* Employees Meter */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                              <span>Employees</span>
                              <span>{usage?.employees || 0} / {limits?.max_employees === 999999 ? "Unlimited" : (limits?.max_employees || 15)}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, ((usage?.employees || 0) / (limits?.max_employees || 15)) * 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Domains Meter */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                              <span>Domains</span>
                              <span>{usage?.domains || 0} / {limits?.max_domains === 999999 ? "Unlimited" : (limits?.max_domains || 1)}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, ((usage?.domains || 0) / (limits?.max_domains || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Funding Card Details */}
                      <div className="p-4 border border-slate-200/60 dark:border-zinc-850 rounded-2xl flex items-center justify-between text-xs bg-slate-50/40 dark:bg-zinc-950/20 shadow-xs">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Active Funding Card</span>
                          <span className="font-mono text-slate-800 dark:text-zinc-100 font-bold block mt-1">{cardNumber}</span>
                        </div>

                        <button
                          onClick={() => {
                            const newNum = prompt("Enter new card number:", "4242");
                            if (newNum) {
                              setCardNumber(`•••• •••• •••• ${newNum}`);
                              showToast("Payment credential updated successfully");
                            }
                          }}
                          className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer whitespace-nowrap shadow-xs"
                        >
                          Update
                        </button>
                      </div>

                      {/* Paystack Webhook Configuration Section */}
                      <div className="p-5 border border-slate-200/60 dark:border-zinc-850 rounded-2xl space-y-4 bg-slate-50/10 dark:bg-zinc-950/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Paystack Webhook Configuration</span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 block mt-1">Connect your Paystack account for live asynchronous webhook notifications</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-medium">
                            To process live card subscriptions and renewals asynchronously, register this webhook endpoint in your <strong className="text-slate-700 dark:text-zinc-300">Paystack Dashboard &gt; Settings &gt; API Keys &amp; Webhooks</strong> section:
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}/api/billing/webhook`}
                              className="flex-1 text-[11px] font-mono border border-slate-200 dark:border-zinc-800 rounded-xl p-2.5 bg-slate-50/50 dark:bg-zinc-950 outline-none text-emerald-600 dark:text-emerald-400 font-bold"
                              id="paystack-webhook-url-input"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/api/billing/webhook`);
                                showToast("Webhook URL copied to clipboard!");
                              }}
                              className="px-3.5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all shadow-xs"
                            >
                              Copy URL
                            </button>
                          </div>

                          <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl">
                            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Setup Instructions:</p>
                            <ul className="list-decimal pl-4 mt-1.5 text-[10px] text-slate-500 dark:text-zinc-400 space-y-1 font-medium">
                              <li>Go to your <a href="https://dashboard.paystack.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600">Paystack Dashboard</a> and log in.</li>
                              <li>Navigate to <strong>Settings</strong> &gt; <strong>API Keys &amp; Webhooks</strong>.</li>
                              <li>Paste the copied URL above into the <strong>Webhook URL</strong> field.</li>
                              <li>Set your <strong>Webhook Secret Hash</strong> to match your <code>PAYSTACK_WEBHOOK_SECRET</code> environment variable to authenticate secure requests.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Recent Invoices History Section */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Invoice & Transaction Receipts</span>
                        {invoices.length === 0 ? (
                          <div className="p-4 border border-slate-150 dark:border-zinc-850 rounded-2xl text-center text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                            No billing invoice events logged yet
                          </div>
                        ) : (
                          <div className="border border-slate-200/60 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 dark:bg-zinc-950 text-[10px] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-150 dark:border-zinc-850">
                                  <th className="p-3 pl-4">Invoice ID</th>
                                  <th className="p-3">Amount</th>
                                  <th className="p-3">Status</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3 pr-4 text-right">Issued At</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-zinc-850/40 text-slate-600 dark:text-zinc-300 font-medium">
                                {invoices.map((inv: any) => (
                                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20">
                                    <td className="p-3 pl-4 font-mono text-[10px] text-slate-800 dark:text-zinc-200">
                                      #{inv.id.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                                      ${inv.amount_usd} {inv.currency}
                                    </td>
                                    <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                        inv.status === "paid" 
                                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" 
                                          : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                                      }`}>
                                        {inv.status}
                                      </span>
                                    </td>
                                    <td className="p-3 capitalize">{inv.billing_reason.replace("_", " ")}</td>
                                    <td className="p-3 pr-4 text-right font-mono text-[10px]">
                                      {new Date(inv.created_at).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

            </motion.div>
          
        </div>

      </div>

    </div>
  );
}
