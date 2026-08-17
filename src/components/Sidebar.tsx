import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  Settings, 
  LogOut, 
  Globe,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PageId } from '../types';

interface SidebarProps {
  activePage: PageId;
  onChangePage: (page: PageId) => void;
  domainName: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  adminName?: string;
}

export default function Sidebar({ 
  activePage, 
  onChangePage, 
  domainName, 
  onLogout,
  isCollapsed,
  onToggleCollapse,
  adminName = 'John Doe'
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'gmail', label: 'Gmail Connections', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const extraItems = [
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ] as const;

  const initials = adminName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <aside 
      className={`hidden md:flex flex-col justify-between shrink-0 font-sans bg-slate-50/70 dark:bg-zinc-950/70 border-r border-slate-200/80 dark:border-zinc-900/80 h-screen sticky top-0 transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      
      {/* Collapse Toggle trigger tab */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-6 -right-3 h-6 w-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 shadow-xs cursor-pointer z-20 transition-all"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Top Branding Section */}
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center shrink-0">
            <span className="font-display font-black text-sm text-white dark:text-zinc-900">L</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-zinc-100 font-display transition-opacity duration-200">
              Mailcoy
            </span>
          )}
        </div>

        {/* Connected Domain indicator */}
        <div className="p-3 bg-white/65 dark:bg-zinc-900/65 rounded-xl border border-slate-200/60 dark:border-zinc-800/60 flex items-center gap-2.5 overflow-hidden">
          <Globe className="h-4 w-4 text-emerald-500 shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden text-left">
              <p className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Active Domain</p>
              <p className="text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 truncate">{domainName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Nav List */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'settings'
            ? ['settings', 'company', 'domain', 'notifications', 'security', 'account'].includes(activePage)
            : activePage === item.id;
          
          return (
            <button
              key={item.id}
              id={`sidebar-${item.id}-btn`}
              onClick={() => onChangePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all relative group cursor-pointer ${
                isActive 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold shadow-xs' 
                  : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white dark:text-zinc-900' : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300'}`} />
              
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-5 border-t border-slate-200/60 dark:border-zinc-900"></div>

        {/* Extra Nav links (Billing, Support) */}
        {extraItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold shadow-xs' 
                  : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white dark:text-zinc-900' : 'text-slate-400 dark:text-zinc-500'}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile/Action Panel */}
      <div className="p-4 border-t border-slate-200/60 dark:border-zinc-900 space-y-3 bg-slate-100/50 dark:bg-zinc-950/30">
        <div className="flex items-center gap-3 px-2 py-1 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-zinc-800 text-white dark:text-zinc-100 flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200 dark:border-zinc-850">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate">{adminName}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">Administrator</p>
            </div>
          )}
        </div>

        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-2 py-2 text-xs font-semibold text-slate-400 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-950/20 rounded-lg transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0 text-slate-400 dark:text-zinc-400 group-hover:text-rose-500" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

    </aside>
  );
}
