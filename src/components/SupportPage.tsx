import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Search, ChevronDown, MessageSquare, FileText, Activity, Send, CheckCircle2, AlertCircle, Zap } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: 'routing' | 'security' | 'billing' | 'gmail';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'routing',
    question: "How fast are employee emails routed or forwarded?",
    answer: "Mailcoy utilizes ultra-low latency direct SMTP edge relays. Forwarded emails arrive at designated personal Gmail inboxes in sub-seconds (typically under 180ms), with absolute delivery reliability and header alignment."
  },
  {
    category: 'routing',
    question: "Do you keep or store permanent copies of forwarded email bodies?",
    answer: "No. Your email contents are cryptographically verified and streamed in-memory to target targets. We never cache, store, or write email bodies on permanent disk databases. Only basic meta logs (sender, recipient, status, byte size) are logged."
  },
  {
    category: 'gmail',
    question: "Why do employee devices require a Google OAuth Connection?",
    answer: "Google's security rules prevent sending custom business domain aliases from personal Gmail. The Mailcoy OAuth proxy authorises our SMTP servers to securely relay replies as 'sender@yourdomain.com' without exposing credentials."
  },
  {
    category: 'security',
    question: "What is DKIM and SPF and why are they necessary?",
    answer: "SPF registers Mailcoy as an authorized sender for your domain. DKIM signs messages digitally, preventing spoofing. Together they ensure 100% inbox placement rates in Gmail and Office 365, avoiding spam filters."
  },
  {
    category: 'billing',
    question: "Can I upgrade or downgrade my routing subscription plan anytime?",
    answer: "Yes. In the Billing section of your Settings console, you can switch between Starter and Growth plans. Changes are calculated on pro-rata billing cycles; unused routes are credited automatically."
  },
  {
    category: 'gmail',
    question: "What happens if an employee revokes their Google account invite?",
    answer: "The email forwarding router will immediately halt outbound replies for that handle. Incoming messages will still be delivered, but replies will default to their personal Gmail alias until re-authenticated."
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'routing' | 'security' | 'billing' | 'gmail'>('all');
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  
  // Ticket form states
  const [ticketCategory, setTicketCategory] = useState('DNS Records & DKIM');
  const [ticketSeverity, setTicketSeverity] = useState('Standard Query (24h response)');
  const [ticketMessage, setTicketMessage] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Diagnostic states
  const [diagnostics, setDiagnostics] = useState({
    smtpRelays: 'operational',
    mxRecords: 'healthy',
    dkimSignature: 'active',
    latency: '142ms'
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleTicketSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;
    
    showToast("Support ticket successfully submitted to our engineering queue!");
    setTicketMessage('');
  };

  // Filter FAQs
  const filteredFAQs = FAQ_DATA.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16 text-left font-sans antialiased">
      
      {/* Toast Alert */}
      
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-55 max-w-sm bg-slate-900 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 dark:border-zinc-200"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-xs font-semibold">{toast}</p>
          </motion.div>
        )}
      

      {/* Page Header */}
      <div className="pb-6 border-b border-slate-100 dark:border-zinc-850 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Support Desk
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 font-medium">
            Browse guides, check live system diagnostic layers, and open service tickets with engineering teams.
          </p>
        </div>

        {/* Live Diagnostics Widget */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold bg-slate-50 dark:bg-zinc-950 p-2 border border-slate-150 dark:border-zinc-850 rounded-xl">
          <span className="text-slate-400 dark:text-zinc-500 uppercase px-1">SYSTEMS:</span>
          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 px-2 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SMTP RELAYS ACTIVE
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 px-2 py-1 rounded-lg">
            <span>PING: {diagnostics.latency}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: FAQ & Documentation Browser */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Troubleshooting & Knowledge Base</h2>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 px-2 py-0.5 rounded-md">
                {filteredFAQs.length} Articles
              </span>
            </div>

            {/* Elegant search bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search queries, DKIM setups, Gmail authorization codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 dark:text-zinc-100 shadow-sm"
              />
            </div>

            {/* Quick Category Filtering Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Articles' },
                { id: 'routing', label: 'Email Routing' },
                { id: 'gmail', label: 'Gmail / OAuth' },
                { id: 'security', label: 'SPF & Security' },
                { id: 'billing', label: 'Plans & Billing' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setOpenFAQIndex(null);
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-slate-550 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion FAQ List */}
          <div className="space-y-2">
            {filteredFAQs.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl text-center space-y-2">
                <AlertCircle className="h-6 w-6 text-slate-400 dark:text-zinc-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">No troubleshooting documentation found</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">Try adjusting your filters or search phrases above.</p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => {
                const isOpen = openFAQIndex === index;
                return (
                  <div 
                    key={index}
                    className="border border-slate-150 dark:border-zinc-850 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 dark:text-zinc-200 text-left cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-950/20 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 dark:text-zinc-500 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`} />
                    </button>

                    
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-100 dark:border-zinc-850/60"
                        >
                          <div className="p-4 bg-slate-50/40 dark:bg-zinc-950/20 text-[11px] leading-relaxed text-slate-550 dark:text-zinc-400 font-medium">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Contact Help Ticket Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-zinc-850">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Contact Help Agent</h3>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Transmit support ticket straight to engineering queues.</p>
              </div>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Inquiry Category</label>
                <select 
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-zinc-850 rounded-xl p-3 bg-slate-50/70 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                >
                  <option>DNS Records & DKIM</option>
                  <option>Gmail Integration / OAuth</option>
                  <option>Billing & Plan Adjustments</option>
                  <option>Security / Account Access</option>
                  <option>General Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Severity Priority</label>
                <select 
                  value={ticketSeverity}
                  onChange={(e) => setTicketSeverity(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-zinc-850 rounded-xl p-3 bg-slate-50/70 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                >
                  <option>Standard Query (24h response)</option>
                  <option>Critical Bug (4h response)</option>
                  <option>System Blocked / Domain Offline (Immediate)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Message details</label>
                <textarea
                  required
                  placeholder="Explain your technical question or routing setup issue in detail..."
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-zinc-850 rounded-xl p-3 bg-slate-50/70 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          </div>

          {/* Quick SLA / Security Notice */}
          <div className="p-4 border border-slate-150 dark:border-zinc-850 rounded-xl bg-slate-50/50 dark:bg-zinc-950/25 flex items-start gap-3">
            <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-left">
              <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300 block">SLA Response Commitment</span>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed font-medium">
                Our support agents are active 24/7/365. Severe infrastructure disruptions receive instant routing escalations globally.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
