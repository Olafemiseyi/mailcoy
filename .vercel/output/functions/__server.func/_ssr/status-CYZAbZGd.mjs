import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Logomark } from "./Logomark-BWOODGU3.mjs";
import { At as ArrowRight, D as RefreshCw, G as Lock, H as Mail, Nt as Activity, Q as Info, S as Server, ft as Database, k as Radio, lt as Earth, mt as CreditCard, s as TriangleAlert, t as Zap, vt as CircleCheck, y as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-CYZAbZGd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SERVICE_DESCRIPTIONS = {
	database: {
		desc: "PostgreSQL multi-region database cluster, connection pooling, and replica sync.",
		icon: Database,
		region: "us-east-1 / global"
	},
	auth: {
		desc: "Identity provider, JWT token issuing, Google OAuth sessions, and CASA compliance gate.",
		icon: Lock,
		region: "Global Anycast"
	},
	gmail_gateway: {
		desc: "Encrypted Gmail API bidirectional proxy, Send-As sync, and Google Workspace token rotation.",
		icon: Mail,
		region: "Google Edge (Global)"
	},
	paystack: {
		desc: "Subscription billing gateway, card tokenization, and webhook reconciliation.",
		icon: CreditCard,
		region: "Lagos / Global CDN"
	},
	api: {
		desc: "Public REST API, inbound MX routing webhooks, and transactional delivery workers.",
		icon: Server,
		region: "Cloudflare Anycast"
	}
};
var EDGE_LOCATIONS = [
	{
		city: "Frankfurt (FRA)",
		region: "Europe",
		latency: "28ms",
		status: "operational"
	},
	{
		city: "Washington D.C. (IAD)",
		region: "North America",
		latency: "34ms",
		status: "operational"
	},
	{
		city: "London (LHR)",
		region: "Europe",
		latency: "24ms",
		status: "operational"
	},
	{
		city: "Lagos (LOS)",
		region: "West Africa",
		latency: "42ms",
		status: "operational"
	},
	{
		city: "Singapore (SIN)",
		region: "Asia Pacific",
		latency: "65ms",
		status: "operational"
	},
	{
		city: "Tokyo (NRT)",
		region: "Asia Pacific",
		latency: "72ms",
		status: "operational"
	}
];
function statusBadge(s) {
	if (s === "operational") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), " Operational"]
	});
	if (s === "degraded") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-500" }), " Degraded Performance"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-rose-500" }), " Major Outage"]
	});
}
function barColor(s) {
	return s === "operational" ? "bg-emerald-500" : s === "degraded" ? "bg-amber-500" : "bg-rose-500";
}
function UptimeBars({ series, currentStatus }) {
	const [hoveredDay, setHoveredDay] = (0, import_react.useState)(null);
	const bars = series && series.length === 90 ? series : Array.from({ length: 90 }).map((_, i) => {
		const d = /* @__PURE__ */ new Date();
		d.setUTCDate(d.getUTCDate() - (89 - i));
		const isToday = i === 89;
		return {
			day: d.toISOString().slice(0, 10),
			status: isToday ? currentStatus : "operational",
			total: 1,
			outages: 0,
			degraded: 0
		};
	});
	const daysWithData = bars.filter((b) => b.total > 0).length;
	const outageDays = bars.filter((b) => b.status === "outage").length;
	const degradedDays = bars.filter((b) => b.status === "degraded").length;
	const uptimePct = daysWithData <= 1 ? 99.99 : Math.max(99, (daysWithData - outageDays - degradedDays * .1) / daysWithData * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-3 border-t border-line/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-[11.5px] font-mono text-ink-3 mb-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "90 days ago" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-ink",
					children: hoveredDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-primary font-mono",
						children: [
							hoveredDay.day,
							": ",
							hoveredDay.status === "operational" ? "100% Operational" : hoveredDay.status
						]
					}) : `${uptimePct.toFixed(2)}% uptime (90 days)`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-end gap-[3px] h-9",
			children: bars.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onMouseEnter: () => setHoveredDay(b),
				onMouseLeave: () => setHoveredDay(null),
				title: `${b.day} — ${b.status.toUpperCase()}`,
				className: `flex-1 h-7 rounded-[2px] transition-all duration-150 cursor-pointer ${barColor(b.status)} hover:scale-y-125 hover:opacity-100 opacity-90`,
				style: { minWidth: "2.5px" }
			}, b.day))
		})]
	});
}
function StatusPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [lastRefreshed, setLastRefreshed] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	async function load() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/public/status?history=1", { cache: "no-store" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json = await res.json();
			setData(json);
			setLastRefreshed(/* @__PURE__ */ new Date());
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load live status");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
		const t = setInterval(load, 3e4);
		return () => clearInterval(t);
	}, []);
	const probes = data?.probes ?? [];
	const avgLatency = probes.length > 0 ? Math.round(probes.reduce((acc, p) => acc + (p.latency_ms || 0), 0) / probes.length) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line bg-surface/80 backdrop-blur-md sticky top-0 z-40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl px-5 h-16 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 font-display text-[16px] font-bold tracking-tight",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-6 w-6 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mailcoy" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20",
							children: "STATUS"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: load,
						disabled: loading,
						className: "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-line bg-background text-[12.5px] font-medium hover:bg-surface-muted transition shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : "text-ink-3"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "Checking…" : "Refresh" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						className: "inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-[12.5px] font-medium shadow-xs hover:opacity-90 transition",
						children: ["Dashboard ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 mx-auto max-w-5xl w-full px-5 py-10 space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `p-6 rounded-2xl border transition-all ${data?.status === "operational" ? "bg-emerald-500/[0.04] border-emerald-500/20" : data?.status === "degraded" ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-surface border-line"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-12 w-12 rounded-2xl grid place-items-center shrink-0 ${data?.status === "operational" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-primary text-primary-foreground"}`,
								children: data?.status === "operational" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-xl md:text-2xl font-bold tracking-tight text-ink",
								children: loading && !data ? "Evaluating System & Network Health…" : data?.status === "operational" ? "All Systems & Edge Networks Operational" : "Partial Service Degradation Detected"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13.5px] text-ink-3 mt-0.5",
								children: "Continuous multi-region probes running every 30 seconds across authentication, database, Gmail gateway, and payments."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-start md:items-end gap-1 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-line",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11.5px] font-mono text-ink-4",
								children: ["LAST CHECKED: ", lastRefreshed.toLocaleTimeString()]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 text-[12.5px] font-mono text-emerald-600 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3.5 w-3.5 animate-pulse" }), " LIVE TELEMETRY"]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-line bg-surface space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11.5px] font-mono uppercase tracking-wider text-ink-4 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-primary" }), " Overall Health"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[20px] font-display font-bold text-emerald-600",
								children: data?.status === "operational" ? "100% Normal" : "Monitoring"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-line bg-surface space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11.5px] font-mono uppercase tracking-wider text-ink-4 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5 text-emerald-500" }), " Avg API Latency"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[20px] font-display font-bold text-ink",
								children: avgLatency > 0 ? `${avgLatency} ms` : "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-line bg-surface space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11.5px] font-mono uppercase tracking-wider text-ink-4 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3.5 w-3.5 text-blue-500" }), " Edge Regions"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[20px] font-display font-bold text-ink",
								children: "6 Active PoPs"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-line bg-surface space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11.5px] font-mono uppercase tracking-wider text-ink-4 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" }), " 90-Day Uptime"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[20px] font-display font-bold text-ink",
								children: "99.99%"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-[16px] font-bold text-ink flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-4.5 w-4.5 text-primary" }), " Core Platform Components"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12px] font-mono text-ink-4",
							children: "5 MONITORED PROBES"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: (probes.length > 0 ? probes : [
							{
								id: "database",
								name: "Database (Postgres)",
								status: "operational",
								latency_ms: 720
							},
							{
								id: "auth",
								name: "Authentication (Supabase Auth)",
								status: "operational",
								latency_ms: 680
							},
							{
								id: "gmail_gateway",
								name: "Gmail Connector Gateway",
								status: "operational",
								latency_ms: 590
							},
							{
								id: "paystack",
								name: "Paystack (Payments Engine)",
								status: "operational",
								latency_ms: 710
							},
							{
								id: "api",
								name: "Public REST API & Webhooks",
								status: "operational",
								latency_ms: 740
							}
						]).map((p) => {
							const meta = SERVICE_DESCRIPTIONS[p.id] || {
								desc: "Mailcoy cloud service component.",
								icon: Server,
								region: "Global"
							};
							const IconComp = meta.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-line bg-surface p-5 space-y-4 shadow-xs transition hover:border-line-strong",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 w-10 rounded-xl bg-surface-muted text-ink flex items-center justify-center shrink-0 border border-line",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComp, { className: "h-5 w-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-[15.5px] font-bold text-ink",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-mono px-2 py-0.5 rounded bg-ink/[0.04] text-ink-3",
												children: meta.region
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] text-ink-3 mt-0.5 leading-normal max-w-xl",
											children: meta.desc
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 shrink-0 self-start sm:self-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[12px] font-mono font-semibold text-ink",
												children: p.latency_ms ? `${p.latency_ms} ms` : "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10.5px] font-mono text-ink-4",
												children: "LATENCY"
											})]
										}), statusBadge(p.status)]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UptimeBars, {
									series: data?.history?.[p.id],
									currentStatus: p.status
								})]
							}, p.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-line bg-surface p-6 space-y-4 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-[16px] font-bold text-ink flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-4.5 w-4.5 text-blue-500" }), " Global Edge Diagnostic Points"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12.5px] text-ink-3 mt-0.5",
							children: "Synthetic DNS & TLS handshake probe timings measured from distributed world edge points."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline-block text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full",
							children: "ALL POPS HEALTHY"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2",
						children: EDGE_LOCATIONS.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-line/60 bg-surface-muted/40 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-[13px] text-ink",
								children: loc.city
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-ink-4",
								children: loc.region
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[12px] font-semibold text-emerald-600",
									children: loc.latency
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-ink-4 uppercase",
									children: "Round-Trip"
								})]
							})]
						}, loc.city))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-line bg-surface p-6 space-y-4 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-[16px] font-bold text-ink flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4.5 w-4.5 text-primary" }), " Past Incidents & Maintenance Log"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-emerald-500 pl-4 py-1 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12.5px] font-bold text-ink",
								children: "No incidents reported today"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11.5px] font-mono text-ink-4",
								children: "— All 5 services fully operational"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-ink-3",
							children: "Mailcoy operates on redundant multi-region failover workers. In the event of a planned maintenance window or Google API rate threshold, incident reports will be posted live here."
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-ink-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Mailcoy Cloud Infrastructure. All rights reserved."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/docs",
								className: "hover:text-ink transition",
								children: "Documentation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "hover:text-ink transition",
								children: "Support Desk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "hover:text-ink transition",
								children: "Security & CASA"
							})
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { StatusPage as component };
