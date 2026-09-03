import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import React, { useState, useDeferredValue, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Search,
  PenSquare,
  Mail,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Reply,
  Forward,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Inbox,
  Sparkles,
  ArrowLeft,
  Trash2,
  X,
  ExternalLink,
  Camera,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Settings,
  HelpCircle,
  Signature,
  Bell,
  BellOff,
  Calendar,
  Filter,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { getComposeContext, listComposeMessages } from "@/lib/compose.functions";
import { QuickComposeModal } from "@/components/app/QuickComposeModal";
import { PwaInstallBanner } from "@/components/app/PwaInstallBanner";
import { PwaInstallButton } from "@/components/PwaInstallButton";
import { Logomark } from "@/components/brand/Logomark";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/compose")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  beforeLoad: async ({ location }: { location: { href: string } }) => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        throw redirect({
          to: "/auth/login",
          search: { redirect: location.href },
        });
      }
      return { user: data.session.user };
    } catch (err: any) {
      if (err?.to) throw err;
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Mailcoy Compose — Messages & Business Mail" },
      { name: "theme-color", content: "#090d16" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Mailcoy Compose" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/logo.png" },
    ],
  }),
  component: MailcoyComposeApp,
});

type ThemeMode = "light" | "dark" | "system";

function useComposeTheme() {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  const applyTheme = (mode: ThemeMode) => {
    if (typeof document === "undefined") return;
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (mode === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isSystemDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mailcoy_theme") as ThemeMode | null;
      const initialMode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
      setThemeModeState(initialMode);
      applyTheme(initialMode);
    } catch {
      applyTheme("system");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentStored = localStorage.getItem("mailcoy_theme") as ThemeMode | null;
      if (!currentStored || currentStored === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem("mailcoy_theme", mode);
    } catch {
      /* noop */
    }
    applyTheme(mode);
  };

  return { themeMode, setThemeMode };
}

function MailcoyComposeApp() {
  const { themeMode, setThemeMode } = useComposeTheme();
  const qc = useQueryClient();
  const fetchContextFn = useServerFn(getComposeContext);
  const fetchLogsFn = useServerFn(listComposeMessages);

  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [filterDirection, setFilterDirection] = useState<"all" | "incoming" | "outgoing">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "delivered" | "opened" | "bounced">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeDefaults, setComposeDefaults] = useState<{ to?: string; subject?: string; from?: string }>({});
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  // Notification & Audio Alert State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeToast, setActiveToast] = useState<{ id: string; sender: string; subject: string } | null>(null);

  // Profile Menu & Avatar Upload State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showAvatarInfo, setShowAvatarInfo] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Synthesize pleasant audio chime for new emails
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      /* noop */
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          const perm = await Notification.requestPermission();
          if (perm === "granted") {
            setNotificationsEnabled(true);
            playChime();
          }
        } else if (Notification.permission === "granted") {
          setNotificationsEnabled(true);
          playChime();
        } else {
          alert("Notifications are blocked in your browser settings. Please enable notifications for this site.");
        }
      } else {
        setNotificationsEnabled(true);
        playChime();
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  // Load stored avatar from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mailcoy:user_avatar");
      if (saved) setProfilePhoto(saved);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        setNotificationsEnabled(true);
      }
    } catch {
      /* noop */
    }
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isProfileMenuOpen]);

  // Active session user
  const [sessionUser, setSessionUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setSessionUser(data.session.user);
      }
    });
    const { data: authSub } = supabase.auth.onAuthStateChange((_, session) => {
      setSessionUser(session?.user || null);
    });
    return () => authSub.subscription.unsubscribe();
  }, []);

  // Fetch Compose Context (identities, signatures, templates)
  const {
    data: composeCtx,
    isLoading: isCtxLoading,
    isError: isCtxError,
    refetch: refetchCtx,
  } = useQuery({
    queryKey: ["compose-context"],
    queryFn: async () => fetchContextFn(),
    staleTime: 15_000,
  });

  // Fetch Message Logs (Inbox & Sent)
  const {
    data: logsData,
    isLoading: isLogsLoading,
    isFetching: isLogsFetching,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["compose-messages", deferredSearch, filterDirection],
    queryFn: async () =>
      fetchLogsFn({
        data: {
          limit: 50,
          offset: 0,
          search: deferredSearch.trim() || undefined,
          direction: filterDirection !== "all" ? filterDirection : undefined,
        },
      }),
    staleTime: 10_000,
  });

  const messages = logsData?.rows || [];
  const primarySender = composeCtx?.senderIdentities?.[0];

  const userDisplayName =
    primarySender?.name ||
    sessionUser?.user_metadata?.full_name ||
    sessionUser?.user_metadata?.name ||
    (sessionUser?.email ? sessionUser.email.split("@")[0] : "") ||
    "Team Member";

  const userEmailDisplay =
    primarySender?.email ||
    sessionUser?.email ||
    "";

  const userInitial = (
    userDisplayName && userDisplayName !== "Team Member"
      ? userDisplayName[0]
      : userEmailDisplay
      ? userEmailDisplay[0]
      : "•"
  ).toUpperCase();

  // Real-time incoming email detector
  const prevCountRef = useRef<number | null>(null);
  useEffect(() => {
    if (logsData?.rows && logsData.rows.length > 0) {
      if (prevCountRef.current !== null && logsData.rows.length > prevCountRef.current) {
        const newest = logsData.rows[0];
        if (newest && newest.direction === "incoming") {
          setActiveToast({
            id: newest.id,
            sender: newest.sender,
            subject: newest.subject || "(No Subject)",
          });
          if (notificationsEnabled) {
            playChime();
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              try {
                new Notification(`📩 New email from ${newest.sender}`, {
                  body: newest.subject || "Tap to read message in Mailcoy Compose",
                  icon: "/logo.png",
                });
              } catch {
                /* noop */
              }
            }
          }
          setTimeout(() => setActiveToast(null), 5000);
        }
      }
      prevCountRef.current = logsData.rows.length;
    }
  }, [logsData?.rows, notificationsEnabled]);

  // Client-side status & date filtering
  const filteredMessages = messages.filter((msg: any) => {
    if (statusFilter !== "all" && msg.status?.toLowerCase() !== statusFilter) {
      return false;
    }
    if (dateFilter !== "all") {
      const msgDate = new Date(msg.timestamp);
      const now = new Date();
      if (dateFilter === "today") {
        const isToday =
          msgDate.getDate() === now.getDate() &&
          msgDate.getMonth() === now.getMonth() &&
          msgDate.getFullYear() === now.getFullYear();
        if (!isToday) return false;
      } else if (dateFilter === "week") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (msgDate < sevenDaysAgo) return false;
      } else if (dateFilter === "month") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (msgDate < thirtyDaysAgo) return false;
      }
    }
    return true;
  });

  const sub = (composeCtx as any)?.subscription;
  const isFreeTier = sub?.planCode === "free";
  const monthlyCount = sub?.monthlyEmailCount ?? 0;
  const maxMonthly = sub?.maxMonthlyMessages ?? (isFreeTier ? 50 : Infinity);
  const isLimitReached = isFreeTier && monthlyCount >= maxMonthly;

  const handleOpenCompose = (to?: string, subject?: string, from?: string) => {
    if (isLimitReached) {
      alert("You have reached your free plan limit of 50 emails this month. Please upgrade to Starter Pro in Settings → Billing for unlimited email sending.");
      return;
    }
    setComposeDefaults({ to, subject, from });
    setIsComposeOpen(true);
  };

  const handleQuickReply = (msg: any) => {
    const targetEmail = msg.direction === "incoming" ? msg.sender : msg.receiver;
    const cleanSubject = msg.subject?.startsWith("Re:") ? msg.subject : `Re: ${msg.subject || ""}`;
    // If incoming message was sent to an alias, auto-reply from that exact alias!
    const replyFrom = msg.direction === "incoming" ? msg.receiver : undefined;
    handleOpenCompose(targetEmail, cleanSubject, replyFrom);
  };

  const handleForward = (msg: any) => {
    const cleanSubject = msg.subject?.startsWith("Fwd:") ? msg.subject : `Fwd: ${msg.subject || ""}`;
    handleOpenCompose("", cleanSubject);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please select a profile photo smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setProfilePhoto(base64);
      try {
        localStorage.setItem("mailcoy:user_avatar", base64);
      } catch {
        /* noop */
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDisconnect = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      /* noop */
    }
    window.location.href = "/auth/login";
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return ts;
    }
  };

  const formatFullTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  // Connection error boundary
  if (isCtxError && !composeCtx) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto grid place-items-center">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-ink">Unable to Load Compose Session</h2>
            <p className="text-xs text-ink-3 leading-relaxed">
              We encountered a connection hiccup while loading your sender identities. Click retry to reconnect.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => refetchCtx()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-muted hover:bg-surface border border-line text-ink font-semibold text-xs transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GATED ACCESS STATE 1: NO ACTIVE ORGANIZATION FOUND
  // =========================================================================
  if (composeCtx && composeCtx.status === "no_org") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-500 mx-auto grid place-items-center">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-ink">No Organization Linked</h2>
            <p className="text-xs text-ink-3 leading-relaxed">
              This account is not associated with any active company workspace. Please accept your employee invitation link or sign in with your authorized work email.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleDisconnect}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-background font-semibold text-xs hover:opacity-90 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Switch Account / Sign In</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GATED ACCESS STATE 1B: NOT CONNECTED IN OWNER DASHBOARD
  // =========================================================================
  if (composeCtx && (composeCtx as any).status === "unauthorized_employee") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-surface border border-red-500/30 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-500 mx-auto grid place-items-center ring-1 ring-red-500/20">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink">Account Not Connected</h2>
            <p className="text-xs text-ink-3 leading-relaxed">
              This account or email address is not connected to an active employee profile in your company's dashboard.
            </p>
            <p className="text-[12.5px] text-amber-600 dark:text-amber-400 font-medium pt-1">
              Please contact your employer to receive an official invitation.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleDisconnect}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-background font-semibold text-xs hover:opacity-90 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out / Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GATED ACCESS STATE 2: NO VERIFIED DOMAIN IN THIS ORGANIZATION
  // =========================================================================
  if (composeCtx && composeCtx.status === "no_verified_domain") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto grid place-items-center">
            <Globe className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-ink">Verified Custom Domain Required</h2>
            <p className="text-xs text-ink-3 leading-relaxed">
              <strong>{composeCtx.orgName}</strong> has not completed domain DNS verification yet. Sending and receiving business emails requires at least one verified custom domain.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {composeCtx.isAdmin ? (
              <Link
                to="/domains"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                <Globe className="h-4 w-4" />
                <span>Verify Domain in Dashboard</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleDisconnect}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-muted hover:bg-surface border border-line text-ink font-semibold text-xs transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GATED ACCESS STATE 3: EMPLOYEE GMAIL NOT CONNECTED VIA INVITE / OAUTH
  // =========================================================================
  if (composeCtx && composeCtx.status === "not_connected") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto grid place-items-center">
            <Mail className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-ink">Connect Your Employee Gmail</h2>
            <p className="text-xs text-ink-3 leading-relaxed">
              {composeCtx.employee ? (
                <span>
                  Welcome <strong>{composeCtx.employee.fullName}</strong>! To send and receive business emails for <strong>{composeCtx.orgName}</strong> ({composeCtx.employee.professionalEmail || composeCtx.availableDomains?.[0]}), your personal Gmail must be connected via your employee invitation.
                </span>
              ) : (
                <span>
                  To access Mailcoy Compose for <strong>{composeCtx.orgName}</strong>, please connect your authorized employee Google account.
                </span>
              )}
            </p>
          </div>
          
          <div className="p-3 rounded-xl bg-surface-muted/60 border border-line text-left text-[11.5px] space-y-1.5">
            <div className="flex items-center gap-2 text-ink font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Zero Password Disclosure</span>
            </div>
            <p className="text-ink-4 pl-6 text-[10.5px]">
              Direct OAuth 2.0 encrypted relay. Emails route directly into your standard Gmail inbox without third-party exposure.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {composeCtx.isAdmin && (
              <Link
                to="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-background font-semibold text-xs hover:opacity-90 transition cursor-pointer shadow-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Return to Owner Dashboard</span>
              </Link>
            )}

            {composeCtx.authUrl ? (
              <a
                href={composeCtx.authUrl}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>⚡ Connect Employee Gmail Account</span>
              </a>
            ) : (
              <Link
                to="/employees"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                <span>View Employee Invites</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleDisconnect}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-ink-3 hover:text-ink hover:bg-surface-muted transition cursor-pointer text-xs font-medium"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Switch Account / Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased overflow-x-hidden w-full max-w-full select-none sm:select-auto">
      {/* Hidden File Input for Profile Photo Upload */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarUpload}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
      />

      {/* Gmail-Style Guaranteed Fixed Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 sm:h-16 bg-surface/95 backdrop-blur-md border-b border-line px-3 sm:px-6 flex items-center justify-between gap-3 safe-top shadow-2xs">
        {selectedMessage ? (
          /* Reader Top Bar (When an email is opened) */
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Back to messages"
                className="p-2 rounded-full text-ink-3 hover:text-ink hover:bg-ink/[0.06] transition cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-ink-4">Message Details</span>
                <span className="text-sm font-bold text-ink truncate max-w-[200px] sm:max-w-md">
                  {selectedMessage.subject || "(No Subject)"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickReply(selectedMessage)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-xs cursor-pointer"
              >
                <Reply className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Inbox Top Bar */
          <>
            <div className="flex items-center gap-2.5 shrink-0 min-w-0">
              {composeCtx?.isAdmin && (
                <Link
                  to="/dashboard"
                  title="Return to Owner Dashboard"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-line bg-surface hover:bg-surface-muted text-ink font-semibold text-xs transition cursor-pointer shadow-xs mr-1"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              )}
              {composeCtx?.orgLogo ? (
                <img
                  src={composeCtx.orgLogo}
                  alt={composeCtx?.orgName || "Company"}
                  className="h-8 w-8 rounded-lg object-contain bg-surface border border-line p-0.5 shadow-xs shrink-0"
                />
              ) : (
                <Logomark className="h-7 w-7 shrink-0" />
              )}
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-[13.5px] font-bold text-ink leading-tight truncate max-w-[130px] md:max-w-[180px]">
                  {composeCtx?.orgName || "Mailcoy"}
                </span>
                <span className="text-[10px] text-primary font-medium tracking-wide truncate max-w-[130px] md:max-w-[180px]">
                  {composeCtx?.availableDomains?.[0] ? `@${composeCtx.availableDomains[0]}` : "Business Mail"}
                </span>
              </div>
            </div>

            {/* Gmail Search Pill Input */}
            <div className="flex-1 max-w-xl mx-2">
              <div className="relative flex items-center w-full bg-surface-muted border border-line rounded-full px-3.5 h-10 transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
                <Search className="h-4 w-4 text-ink-4 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search in mail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-ink placeholder:text-ink-4 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-ink-4 hover:text-ink cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Actions & Account Avatar Dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* PWA Install Button (Standby Mode) */}
              <PwaInstallButton />

              {/* Notification Alert Toggle */}
              <button
                type="button"
                onClick={toggleNotifications}
                title={notificationsEnabled ? "Email alerts active (Click to silence)" : "Enable real-time email alerts"}
                className={`p-2 rounded-full transition cursor-pointer ${
                  notificationsEnabled
                    ? "text-primary bg-primary/10 hover:bg-primary/20 ring-1 ring-primary/30"
                    : "text-ink-3 hover:text-ink hover:bg-ink/[0.05]"
                }`}
              >
                {notificationsEnabled ? <Bell className="h-4 w-4 text-primary" /> : <BellOff className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => refetchLogs()}
                title="Refresh messages"
                className="p-2 rounded-full text-ink-3 hover:text-ink hover:bg-ink/[0.05] transition cursor-pointer"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLogsFetching ? "animate-spin text-primary" : ""}`}
                />
              </button>

              {/* User Avatar & Google-Style Dropdown Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  title={`Account: ${userDisplayName}`}
                  className="relative h-8.5 w-8.5 rounded-full overflow-hidden border-2 border-primary/40 hover:border-primary transition focus:outline-none cursor-pointer group shadow-xs"
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary text-primary-foreground text-xs font-bold grid place-items-center">
                      {userInitial}
                    </div>
                  )}
                </button>

                {/* Account Dropdown Card */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-line bg-surface p-4 shadow-2xl z-50 animate-in fade-in duration-150 text-xs select-none">
                    {/* Header: User Profile Details & Photo Change */}
                    <div className="flex flex-col items-center text-center pb-3 border-b border-line space-y-2">
                      <div className="relative group">
                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-line bg-surface-muted grid place-items-center shadow-inner">
                          {profilePhoto ? (
                            <img
                              src={profilePhoto}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-primary">
                              {userInitial}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          title="Upload profile photo"
                          className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <Camera className="h-4 w-4 mb-0.5" />
                          <span className="text-[9px] font-semibold">Change</span>
                        </button>
                      </div>

                      <div className="space-y-0.5 min-w-0 max-w-full">
                        <h4 className="text-sm font-bold text-ink truncate">
                          {userDisplayName}
                        </h4>
                        <p className="font-mono text-[11px] text-ink-3 truncate">
                          {userEmailDisplay || "Connecting..."}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-medium">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Connected & Verified Relay</span>
                      </div>
                    </div>

                    {/* Quick Avatar Upload Button */}
                    <div className="py-2.5 border-b border-line">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-surface-muted/60 hover:bg-surface-muted text-ink transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-primary" />
                          <span className="font-medium text-xs">
                            {profilePhoto ? "Update Profile Picture" : "Add Profile Picture"}
                          </span>
                        </div>
                        <span className="text-[10px] text-ink-4">JPG/PNG</span>
                      </button>
                    </div>

                    {/* Theme & Appearance: Light, Dark, System Default */}
                    <div className="py-2.5 border-b border-line space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-semibold text-ink-3">Theme & Appearance</span>
                        <span className="text-[10px] text-ink-4 font-mono">
                          {themeMode === "system" ? "Default (System)" : `${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode`}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 bg-surface-muted/70 p-1 rounded-xl border border-line">
                        <button
                          type="button"
                          onClick={() => setThemeMode("light")}
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            themeMode === "light"
                              ? "bg-surface text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-500/30 font-bold"
                              : "text-ink-3 hover:text-ink hover:bg-surface/50"
                          }`}
                        >
                          <Sun className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Light</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setThemeMode("dark")}
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            themeMode === "dark"
                              ? "bg-surface text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-500/30 font-bold"
                              : "text-ink-3 hover:text-ink hover:bg-surface/50"
                          }`}
                        >
                          <Moon className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Dark</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setThemeMode("system")}
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            themeMode === "system"
                              ? "bg-surface text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-500/30 font-bold"
                              : "text-ink-3 hover:text-ink hover:bg-surface/50"
                          }`}
                        >
                          <Laptop className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Default</span>
                        </button>
                      </div>
                    </div>

                    {/* Navigation Options with RBAC */}
                    <div className="py-2 space-y-1 border-b border-line">
                      {composeCtx?.isAdmin && (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink-2 hover:text-ink hover:bg-ink/[0.05] transition cursor-pointer"
                          >
                            <LayoutDashboard className="h-4 w-4 text-ink-4" />
                            <span className="font-medium">Open Admin Dashboard</span>
                          </Link>

                          <Link
                            to="/settings"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink-2 hover:text-ink hover:bg-ink/[0.05] transition cursor-pointer"
                          >
                            <Settings className="h-4 w-4 text-ink-4" />
                            <span className="font-medium">Settings & Domain Rules</span>
                          </Link>
                        </>
                      )}

                      {/* For All Employees: View / Preview My Signature */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSigModalOpen(true);
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink-2 hover:text-ink hover:bg-ink/[0.05] transition cursor-pointer text-left"
                      >
                        <Signature className="h-4 w-4 text-primary" />
                        <span className="font-medium">My Email Signature</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAvatarInfo(!showAvatarInfo)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-ink-2 hover:text-ink hover:bg-ink/[0.05] transition cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <HelpCircle className="h-4 w-4 text-ink-4" />
                          <span className="font-medium">How Recipient Avatars Work</span>
                        </div>
                        <span className="text-[10px] text-primary font-semibold">
                          {showAvatarInfo ? "Hide" : "Info"}
                        </span>
                      </button>

                      {showAvatarInfo && (
                        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-[11px] text-ink-3 leading-relaxed space-y-1">
                          <p className="font-medium text-ink">💡 <strong>Email Avatars:</strong></p>
                          <p>
                            • In <strong>Mailcoy</strong>: Your uploaded photo displays across your messages and signature blocks.
                          </p>
                          <p>
                            • In <strong>Gmail Inboxes</strong>: Gmail displays sender avatars linked via Google Account profile photo or Gravatar.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Disconnect / Sign Out */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleDisconnect}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-danger hover:bg-danger/10 transition cursor-pointer font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Disconnect & Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Container with top padding for fixed navbar */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-16 sm:pt-20 pb-8 flex flex-col">
        {selectedMessage ? (
          /* ========================================================================= */
          /* 2. GMAIL-STYLE EMAIL READER SCREEN (WHEN A MESSAGE IS CLICKED)            */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-150">
            {/* Subject Title */}
            <div className="space-y-1 pb-2 border-b border-line/60">
              <h1 className="text-lg sm:text-xl font-bold text-ink leading-snug">
                {selectedMessage.subject || "(No Subject)"}
              </h1>
              <div className="flex items-center gap-2 text-xs text-ink-4">
                <span className="capitalize font-medium text-ink-3">
                  {selectedMessage.direction === "incoming" ? "📥 Received" : "📤 Sent"}
                </span>
                <span>•</span>
                <span>{formatFullTimestamp(selectedMessage.timestamp)}</span>
              </div>
            </div>

            {/* Sender & Recipient Information Card */}
            <div className="p-4 rounded-2xl bg-surface border border-line flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm grid place-items-center shrink-0">
                  {(selectedMessage.sender || "M")[0].toUpperCase()}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-ink truncate">
                      {selectedMessage.sender}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        selectedMessage.status === "delivered"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : selectedMessage.status === "opened"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : selectedMessage.status === "bounced"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      ● {selectedMessage.status || "delivered"}
                    </span>
                  </div>
                  <div className="text-xs text-ink-3">
                    <span className="text-ink-4">To: </span>
                    <span className="font-mono text-ink-2">{selectedMessage.receiver || selectedMessage.recipient}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickReply(selectedMessage)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs cursor-pointer shrink-0"
              >
                <Reply className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reply</span>
              </button>
            </div>

            {/* Full Formatted Email Content Card */}
            <div className="flex-1 p-5 sm:p-6 rounded-2xl bg-surface border border-line shadow-xs text-xs sm:text-[13.5px] leading-relaxed text-ink whitespace-pre-wrap min-h-[220px]">
              {selectedMessage.snippet || "No additional body text available for this dispatch."}
            </div>

            {/* Bottom Quick Action Bar: Reply & Forward */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuickReply(selectedMessage)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm cursor-pointer"
              >
                <Reply className="h-4 w-4" />
                <span>Reply</span>
              </button>

              <button
                type="button"
                onClick={() => handleForward(selectedMessage)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-medium border border-line bg-surface hover:bg-surface-muted text-ink transition shadow-2xs cursor-pointer"
              >
                <Forward className="h-4 w-4 text-ink-3" />
                <span>Forward</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 1. GMAIL-STYLE MESSAGE LIST (MAIN INBOX SCREEN)                           */
          /* ========================================================================= */
          <>
            {/* Filter Tabs & Desktop Compose Button */}
            <div className="space-y-2.5 pb-3 border-b border-line/60">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Direction Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: "all", label: "All Mail", icon: Mail },
                    { id: "outgoing", label: "Sent", icon: ArrowUpRight },
                    { id: "incoming", label: "Received", icon: ArrowDownLeft },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = filterDirection === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilterDirection(tab.id as any)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                          isActive
                            ? "bg-emerald-600 text-white font-semibold shadow-xs"
                            : "bg-surface text-ink-3 hover:text-ink hover:bg-ink/[0.05] border border-line"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  {isFreeTier && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-line bg-surface shadow-2xs shrink-0">
                      <span className="text-ink-4">Monthly:</span>
                      <span
                        className={`font-semibold ${
                          isLimitReached
                            ? "text-red-600 dark:text-red-400"
                            : monthlyCount >= 40
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-ink"
                        }`}
                      >
                        {monthlyCount}/{maxMonthly}
                      </span>
                      {isLimitReached && (
                        <Link
                          to="/settings/billing"
                          className="ml-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          Upgrade
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Desktop Compose Action Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenCompose()}
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer"
                  >
                    <PenSquare className="h-4 w-4" />
                    <span>New Message</span>
                  </button>
                </div>
              </div>

              {/* Secondary Status & Date Range Filters */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
                <div className="flex items-center gap-1 bg-surface-muted/60 p-1 rounded-lg border border-line shrink-0">
                  <Filter className="h-3 w-3 text-ink-4 ml-1" />
                  {[
                    { id: "all", label: "All Status" },
                    { id: "delivered", label: "Delivered" },
                    { id: "opened", label: "Opened" },
                    { id: "bounced", label: "Bounced" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStatusFilter(st.id as any)}
                      className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                        statusFilter === st.id
                          ? "bg-background text-ink shadow-2xs font-semibold"
                          : "text-ink-4 hover:text-ink"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-surface-muted/60 p-1 rounded-lg border border-line shrink-0">
                  <Calendar className="h-3 w-3 text-ink-4 ml-1" />
                  {[
                    { id: "all", label: "All Time" },
                    { id: "today", label: "Today" },
                    { id: "week", label: "Past 7 Days" },
                    { id: "month", label: "Past 30 Days" },
                  ].map((dt) => (
                    <button
                      key={dt.id}
                      type="button"
                      onClick={() => setDateFilter(dt.id as any)}
                      className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                        dateFilter === dt.id
                          ? "bg-background text-ink shadow-2xs font-semibold"
                          : "text-ink-4 hover:text-ink"
                      }`}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Limit Banner for Free Tier */}
            {isLimitReached && (
              <div className="p-3.5 mb-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    Monthly free tier limit reached ({monthlyCount}/{maxMonthly} emails). Upgrade to Starter Pro for unlimited monthly emails.
                  </span>
                </div>
                <Link
                  to="/settings/billing"
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold whitespace-nowrap shadow-2xs text-center"
                >
                  Upgrade to Starter Pro
                </Link>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 mt-3">
              {isLogsLoading ? (
                <div className="space-y-2 py-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl bg-surface border border-line animate-pulse flex items-center px-4 gap-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-ink/5 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-32 bg-ink/5 rounded" />
                        <div className="h-3 w-64 bg-ink/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink">No messages found</h3>
                  <p className="text-xs text-ink-3 leading-relaxed">
                    {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                      ? "No messages match your active search and filter criteria."
                      : "Your outbound dispatches and incoming replies will appear here in real-time."}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenCompose()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm cursor-pointer"
                  >
                    <PenSquare className="h-3.5 w-3.5" />
                    <span>Send First Email</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 pb-20 sm:pb-8">
                  {filteredMessages.map((msg: any) => {
                    const isIncoming = msg.direction === "incoming";
                    const correspondent = isIncoming ? msg.sender : msg.receiver;
                    const statusColor =
                      msg.status === "delivered"
                        ? "text-emerald-500"
                        : msg.status === "opened"
                        ? "text-blue-500"
                        : msg.status === "bounced"
                        ? "text-red-500"
                        : "text-amber-500";

                    return (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-line hover:border-primary/40 hover:bg-surface-muted/60 transition cursor-pointer select-none"
                      >
                        {/* Left: Direction Icon / Avatar */}
                        <div
                          className={`h-8 w-8 rounded-full text-xs font-bold grid place-items-center shrink-0 ${
                            isIncoming
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {isIncoming ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </div>

                        {/* Middle: Correspondent, Subject, Snippet */}
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-ink truncate max-w-[160px] sm:max-w-[240px]">
                              {correspondent}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider ${statusColor}`}
                            >
                              ● {msg.status || "delivered"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-ink-3 truncate mt-0.5">
                            <span className="font-semibold text-ink truncate">
                              {msg.subject || "(No Subject)"}
                            </span>
                            <span className="text-ink-4 shrink-0">—</span>
                            <span className="text-ink-4 truncate">
                              {msg.snippet || "No preview body"}
                            </span>
                          </div>
                        </div>

                        {/* Right: Timestamp & Quick Reply Button */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono text-ink-4">
                            {formatTimestamp(msg.timestamp)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickReply(msg);
                            }}
                            title="Quick Reply in Compose"
                            className="p-1.5 rounded-lg text-ink-3 hover:text-primary hover:bg-primary/10 transition cursor-pointer opacity-80 group-hover:opacity-100"
                          >
                            <Reply className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Real-time Email Toast Notification Alert */}
      {activeToast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-32px)] animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="p-3.5 rounded-2xl border border-primary/30 bg-surface/95 backdrop-blur-md shadow-2xl flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-xs">
              <Mail className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">New Email</span>
                <button
                  type="button"
                  onClick={() => setActiveToast(null)}
                  className="text-ink-4 hover:text-ink p-0.5 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-semibold text-ink truncate">{activeToast.sender}</h4>
              <p className="text-[11.5px] text-ink-3 truncate">{activeToast.subject}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) for Mobile "+ Compose" (Gmail Style) */}
      {!selectedMessage && (
        <div className="fixed bottom-5 right-5 sm:hidden z-30">
          <button
            type="button"
            onClick={() => handleOpenCompose()}
            className="flex items-center gap-2 px-5 h-13 rounded-full bg-emerald-600 text-white font-semibold text-sm shadow-2xl hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
          >
            <PenSquare className="h-5 w-5" />
            <span>Compose</span>
          </button>
        </div>
      )}

      {/* Gmail-Style Compose Drawer / Docked Window */}
      <QuickComposeModal
        isOpen={isComposeOpen}
        onClose={() => {
          setIsComposeOpen(false);
          setComposeDefaults({});
        }}
        defaultTo={composeDefaults.to}
        defaultSubject={composeDefaults.subject}
        defaultFrom={composeDefaults.from}
        composeCtx={composeCtx}
      />

      {/* Employee Signature Preview Modal */}
      {isSigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-ink">Your Business Signature</h3>
                <p className="text-xs text-ink-3">
                  This verified signature is automatically attached to all your outbound emails.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSigModalOpen(false)}
                className="p-1 rounded-lg text-ink-4 hover:text-ink cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Rendered Live Signature Preview */}
            <div className="p-4 rounded-xl border border-line bg-surface-muted/40 space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-4 block">
                Live Preview
              </span>
              <div
                className="text-xs text-ink leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    composeCtx?.signatureHtml ||
                    `<div style="font-family: Arial, sans-serif; font-size: 13px; color: #334155; margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                      <strong>${userDisplayName}</strong><br/>
                      <span style="color: #64748b;">${composeCtx?.orgName || "Mailcoy"}</span><br/>
                      <span style="color: #0284c7;">${userEmailDisplay}</span>
                    </div>`,
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
              <span className="text-ink-4">Managed by Workspace Admin</span>
              <button
                type="button"
                onClick={() => setIsSigModalOpen(false)}
                className="px-4 py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Banner (Active strictly on /compose) */}
      <PwaInstallBanner />
    </div>
  );
}
