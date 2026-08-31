import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Employee, EmailLog } from '../types';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, Sliders, Play, Ban, X, Gauge, ExternalLink, MailWarning, Flame, ArrowUpRight, Zap } from "lucide-react";

interface EmailHealthMonitorProps {
  employees: Employee[];
  emailLogs: EmailLog[];
  onAddEmailLog?: (log: Omit<EmailLog, 'id' | 'timestamp'>) => void;
  onNavigateToEmployees?: () => void;
  domainName: string;
}

interface AlertItem {
  id: string;
  alias: string;
  type: 'bounce_spike' | 'delivery_failure' | 'spam_limit' | 'authentication_mismatch';
  severity: 'critical' | 'warning';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export default function EmailHealthMonitor({
  employees,
  emailLogs,
  onAddEmailLog,
  onNavigateToEmployees,
  domainName
}: EmailHealthMonitorProps) {
  // Live Alert State
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'alert_1',
      alias: `david@${domainName}`,
      type: 'delivery_failure',
      severity: 'warning',
      message: 'Initial workspace authorization handshake pending; incoming messages currently delayed.',
      timestamp: '5 mins ago',
      resolved: false
    }
  ]);

  // Alert Threshold State
  const [bounceThreshold, setBounceThreshold] = useState<number>(5); // 5%
  const [failureThreshold, setFailureThreshold] = useState<number>(3); // 3 consecutive failures
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [simulationStatus, setSimulationStatus] = useState<string>('');
  const [activeAlertFilter, setActiveAlertFilter] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');

  // Alias Specific Live Stat Overrides
  const [statOverrides, setStatOverrides] = useState<Record<string, { total: number; success: number; bounces: number; latency: number }>>({});

  // Compile calculations of Success Rate & Latency
  const aliasPerformanceList = employees.map(emp => {
    const email = emp.companyEmail;
    const overrides = statOverrides[email];

    // Compute stats from logs + any manual simulator overrides
    const matchingLogs = emailLogs.filter(log => log.receiver.toLowerCase() === email.toLowerCase());
    const totalLogs = (matchingLogs.length) + (overrides?.total || 0);
    const totalBounces = (matchingLogs.filter(l => l.status === 'failed' || l.status === 'bounced').length) + (overrides?.bounces || 0);
    
    const calculatedSuccessCount = totalLogs - totalBounces;
    const successRate = totalLogs > 0 ? (calculatedSuccessCount / totalLogs) * 100 : 100;
    
    // Determine status badge
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    const bouncePercentage = totalLogs > 0 ? (totalBounces / totalLogs) * 100 : 0;

    if (emp.status === 'pending_auth') {
      status = 'warning';
    } else if (bouncePercentage >= bounceThreshold || (totalLogs > 2 && successRate < 90)) {
      status = 'critical';
    } else if (bouncePercentage > 0 && bouncePercentage < bounceThreshold) {
      status = 'warning';
    }

    return {
      id: emp.id,
      name: emp.name,
      email: emp.companyEmail,
      personal: emp.personalGmail,
      total: totalLogs === 0 ? 12 : totalLogs, // default mock numbers if empty
      successRate: totalLogs === 0 ? 100 : successRate,
      bounces: totalLogs === 0 ? 0 : totalBounces,
      latency: overrides?.latency || (emp.status === 'active' ? 142 : 1240), // ms
      status
    };
  });

  // Calculate Aggregated Metrics
  const totalEmailsProcessed = aliasPerformanceList.reduce((acc, curr) => acc + curr.total, 0);
  const overallSuccessCount = aliasPerformanceList.reduce((acc, curr) => acc + Math.round(curr.total * (curr.successRate / 100)), 0);
  const overallSuccessRate = totalEmailsProcessed > 0 ? (overallSuccessCount / totalEmailsProcessed) * 100 : 99.8;
  const currentTotalBounces = aliasPerformanceList.reduce((acc, curr) => acc + curr.bounces, 0);

  // Trigger Refresh Simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSimulationStatus('Diagnostic sweep complete. SMTP connections are fully optimal.');
      setTimeout(() => setSimulationStatus(''), 4000);
    }, 1200);
  };

  // Run Simulator event
  const runSimulator = (mode: 'healthy' | 'bounce' | 'block') => {
    if (employees.length === 0) {
      setSimulationStatus('Please register at least one employee/alias to simulate traffic.');
      setTimeout(() => setSimulationStatus(''), 3000);
      return;
    }

    const randomEmp = employees[Math.floor(Math.random() * employees.length)];
    const email = randomEmp.companyEmail;

    if (mode === 'healthy') {
      setSimulationStatus(`Processing SMTP payload relay for ${email}...`);
      
      // Simulate addition in overrides
      setStatOverrides(prev => {
        const curr = prev[email] || { total: 12, success: 12, bounces: 0, latency: 135 };
        return {
          ...prev,
          [email]: {
            total: curr.total + 1,
            success: curr.success + 1,
            bounces: curr.bounces,
            latency: Math.floor(Math.random() * 80) + 110
          }
        };
      });

      if (onAddEmailLog) {
        onAddEmailLog({
          sender: 'external-client@apexcorp.com',
          receiver: email,
          subject: 'Project Milestones Status update',
          snippet: 'Relayed via SMTP and forwarded successfully to destination targets.',
          direction: 'incoming',
          status: 'delivered'
        });
      }

      setTimeout(() => {
        setSimulationStatus(`✓ SMTP delivery succeeded for ${email}. Routing latency was optimal (124ms).`);
        setTimeout(() => setSimulationStatus(''), 3000);
      }, 1000);

    } else if (mode === 'bounce') {
      setSimulationStatus(`Relaying incoming message to ${email}... [TEST BOUNCE TRIGGERED]`);

      setStatOverrides(prev => {
        const curr = prev[email] || { total: 12, success: 12, bounces: 0, latency: 150 };
        return {
          ...prev,
          [email]: {
            total: curr.total + 1,
            success: curr.success,
            bounces: curr.bounces + 1,
            latency: 2800 // high latency on error
          }
        };
      });

      // Append failing email log
      if (onAddEmailLog) {
        onAddEmailLog({
          sender: 'mailer-daemon@google.com',
          receiver: email,
          subject: 'Delivery Status Notification (Failure)',
          snippet: 'Your message could not be delivered to the target gmail inbox. Error code: 550 5.1.1 User Unknown.',
          direction: 'incoming',
          status: 'failed'
        });
      }

      // Add Realtime Alert
      const newAlert: AlertItem = {
        id: `alert_${Date.now()}`,
        alias: email,
        type: 'bounce_spike',
        severity: 'critical',
        message: `High bounce rate detected on ${email}. Target Inbox returned '550 User Unknown' or was unverified.`,
        timestamp: 'Just now',
        resolved: false
      };

      setAlerts(prev => [newAlert, ...prev]);

      setTimeout(() => {
        setSimulationStatus(`⚠ Critical: Delivery failure recorded on forwarding path of ${email}. Bounce logged.`);
        setTimeout(() => setSimulationStatus(''), 3000);
      }, 1000);

    } else if (mode === 'block') {
      setSimulationStatus(`Scanning message signature for ${email}...`);

      const newAlert: AlertItem = {
        id: `alert_${Date.now()}`,
        alias: email,
        type: 'spam_limit',
        severity: 'warning',
        message: `Frequent burst traffic detected targeting ${email}. Inbound connection rate-limited to avoid throttling.`,
        timestamp: 'Just now',
        resolved: false
      };

      setAlerts(prev => [newAlert, ...prev]);

      if (onAddEmailLog) {
        onAddEmailLog({
          sender: 'suspicious-lead-finder@spamcorp.net',
          receiver: email,
          subject: '[SPAM BLOCK] Win a $1000 Gift card immediately!',
          snippet: 'Connection blocked based on domain threat intelligence scoring filters.',
          direction: 'incoming',
          status: 'failed'
        });
      }

      setTimeout(() => {
        setSimulationStatus(`✓ Threat isolated. Suspicious incoming burst was successfully blocked and categorized.`);
        setTimeout(() => setSimulationStatus(''), 3500);
      }, 1200);
    }
  };

  // Resolve Alert action
  const resolveAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => alert.id === id ? { ...alert, resolved: true } : alert)
    );
  };

  // Clear Resolved Alerts
  const clearResolved = () => {
    setAlerts(prev => prev.filter(alert => !alert.resolved));
  };

  // Filtered Alerts
  const filteredAlerts = alerts.filter(alert => {
    if (activeAlertFilter === 'all') return true;
    if (activeAlertFilter === 'critical') return alert.severity === 'critical' && !alert.resolved;
    if (activeAlertFilter === 'warning') return alert.severity === 'warning' && !alert.resolved;
    if (activeAlertFilter === 'resolved') return alert.resolved;
    return true;
  });

  return (
    <div id="email-health-monitor" className="bg-slate-50/50 dark:bg-zinc-950/30 border border-slate-200/60 dark:border-zinc-850/70 rounded-2xl p-6 md:p-8 space-y-8 text-left font-sans transition-all">
      
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-850/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Activity className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              Email Routing Health Engine
            </h2>
            <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 text-[9px] px-2 py-0.5 rounded-full font-bold">
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Analyze relay metrics, configure delivery alerting thresholds, and diagnose forwarding logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-350 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 rounded-xl flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 min-h-[38px]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Diagnostic Sweep</span>
          </button>
        </div>
      </div>

      {/* Grid of aggregated health gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric Card 1: Success Delivery Rate */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850/70 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Success Relay Ratio</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                {overallSuccessRate.toFixed(1)}%
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">Optimal</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              {overallSuccessCount} of {totalEmailsProcessed} messages forwarded
            </span>
          </div>
          <div className="relative w-14 h-14">
            {/* Custom SVG Radial progress indicator */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-zinc-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-600 dark:text-emerald-400"
                strokeWidth="3.5"
                strokeDasharray={`${overallSuccessRate}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Gauge className="h-4.5 w-4.5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Metric Card 2: Bounces & Delivery Failures */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850/70 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Bounce incidents</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                {currentTotalBounces}
              </span>
              {currentTotalBounces > 0 ? (
                <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-0.5">
                  <AlertTriangle className="h-3 w-3" /> Warning
                </span>
              ) : (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">None</span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              Inbound blocks or client address mismatches
            </span>
          </div>
          <div className="h-10 w-10 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
            <MailWarning className="h-5 w-5" />
          </div>
        </div>

        {/* Metric Card 3: Alert Status */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850/70 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Alert Threshold Status</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                {alerts.filter(a => !a.resolved).length} Active
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              Configured threshold limits: {bounceThreshold}% bounces
            </span>
          </div>
          <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <Sliders className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Simulator + Threshold Setting Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Threshold Adjustment Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850/70 rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-slate-400 dark:text-zinc-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
              Configure Delivery Alerting Thresholds
            </h3>
          </div>

          <div className="space-y-5 text-xs text-slate-600 dark:text-zinc-400 font-medium">
            {/* Bounce Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700 dark:text-zinc-300">Max Acceptable Bounce Rate</span>
                <span className="text-emerald-600 dark:text-emerald-400">{bounceThreshold}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={bounceThreshold}
                onChange={(e) => setBounceThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-normal">
                Trigger a critical alert if any active forwarding alias registers bounces exceeding this percentage.
              </p>
            </div>

            {/* Failure Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700 dark:text-zinc-300">Consecutive Relay Failures limit</span>
                <span className="text-emerald-600 dark:text-emerald-400">{failureThreshold} Failures</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={failureThreshold}
                onChange={(e) => setFailureThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-normal">
                Triggers security warnings if downstream Google workspace destination blocks incoming flows consecutively.
              </p>
            </div>
          </div>
        </div>

        {/* Live Traffic Simulator */}
        <div className="bg-emerald-900/5 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-350 uppercase tracking-wide">
                SMTP Relay Event Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
              Run simulated delivery tests to generate real-time routing traffic logs, trigger spam filter blocks, or test bounce threshold alerts.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => runSimulator('healthy')}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer text-center min-h-[58px] shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simulate Success</span>
            </button>
            <button
              onClick={() => runSimulator('bounce')}
              className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-500 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer text-center min-h-[58px] shadow-xs animate-pulse"
            >
              <Flame className="h-4 w-4" />
              <span>Trigger Bounce</span>
            </button>
            <button
              onClick={() => runSimulator('block')}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer text-center min-h-[58px] shadow-xs"
            >
              <Ban className="h-4 w-4" />
              <span>Trigger Spam</span>
            </button>
          </div>

          
            {simulationStatus ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-2.5 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-lg text-[10px] text-slate-600 dark:text-zinc-400 font-mono flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="truncate">{simulationStatus}</span>
              </motion.div>
            ) : (
              <div className="p-2.5 bg-transparent border border-dashed border-slate-200/60 dark:border-zinc-850 rounded-lg text-[10px] text-slate-400 dark:text-zinc-500 font-mono text-center select-none">
                Waiting for simulation injection event...
              </div>
            )}
          
        </div>

      </div>

      {/* Real-time Alerts Panel & Filter */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850/70 rounded-xl p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-850/50 pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Real-Time Alert Feed
            </h3>
            <span className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {alerts.filter(a => !a.resolved).length} Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex bg-slate-100 dark:bg-zinc-950 border border-slate-200/30 dark:border-zinc-800 rounded-lg p-0.5 text-[10px] font-bold">
              {(['all', 'critical', 'warning', 'resolved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveAlertFilter(f)}
                  className={`px-2.5 py-1 rounded-md capitalize cursor-pointer transition-all ${
                    activeAlertFilter === f 
                      ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {alerts.some(a => a.resolved) && (
              <button
                onClick={clearResolved}
                className="px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg cursor-pointer"
              >
                Clear Resolved
              </button>
            )}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3.5 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors ${
                    alert.resolved 
                      ? 'bg-slate-50/50 dark:bg-zinc-950/20 border-slate-150 dark:border-zinc-900 opacity-60' 
                      : alert.severity === 'critical'
                        ? 'bg-rose-50/40 dark:bg-rose-950/10 border-rose-100 dark:border-rose-950/30'
                        : 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-100 dark:border-amber-950/30'
                  }`}
                >
                  <div className="flex gap-2.5">
                    {alert.resolved ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : alert.severity === 'critical' ? (
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {alert.alias}
                        </span>
                        <span className={`text-[8px] uppercase tracking-wide font-extrabold px-1.5 py-0.5 rounded-md ${
                          alert.resolved 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                            : alert.severity === 'critical'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                        }`}>
                          {alert.resolved ? 'Resolved' : alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-medium">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 dark:border-zinc-800 pt-2 sm:pt-0">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                      {alert.timestamp}
                    </span>
                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg text-emerald-600 dark:text-emerald-400 shadow-xs whitespace-nowrap cursor-pointer"
                      >
                        Acknowledge & Fix
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
                No alerts logged matching the selection filters.
              </div>
            )}
          
        </div>
      </div>

      {/* Active Routing Performance table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850/70 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-4.5 w-4.5 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Alias Performance Diagnostics
            </h3>
          </div>
          {onNavigateToEmployees && (
            <button
              onClick={onNavigateToEmployees}
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Rules</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-medium border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800/80 text-slate-400 dark:text-zinc-500 uppercase font-extrabold tracking-wider">
                <th className="pb-2.5">Alias Email</th>
                <th className="pb-2.5 text-center">Total Relay</th>
                <th className="pb-2.5 text-center">Bounces</th>
                <th className="pb-2.5 text-right">Success Rate</th>
                <th className="pb-2.5 text-right">Relay Latency</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850/50">
              {aliasPerformanceList.length > 0 ? (
                aliasPerformanceList.map((perf) => (
                  <tr key={perf.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/20">
                    <td className="py-3 pr-2">
                      <div className="font-bold text-slate-800 dark:text-zinc-200 truncate max-w-[200px]" title={perf.email}>
                        {perf.email}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[200px]" title={perf.personal}>
                        ⟶ {perf.personal}
                      </div>
                    </td>
                    <td className="py-3 text-center text-slate-600 dark:text-zinc-400 font-mono">
                      {perf.total}
                    </td>
                    <td className="py-3 text-center font-mono">
                      <span className={perf.bounces > 0 ? 'text-rose-500 font-bold' : 'text-slate-400'}>
                        {perf.bounces}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-800 dark:text-zinc-200">
                      {perf.successRate.toFixed(1)}%
                    </td>
                    <td className="py-3 text-right font-mono text-slate-500 dark:text-zinc-400">
                      {perf.latency}ms
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        perf.status === 'healthy' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : perf.status === 'warning'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          perf.status === 'healthy' ? 'bg-emerald-500' : perf.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        {perf.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 dark:text-zinc-500 font-medium">
                    No configured team forwarders detected. Create routing aliases to audit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
