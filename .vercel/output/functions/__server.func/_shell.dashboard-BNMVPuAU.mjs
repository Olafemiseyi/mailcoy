import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { At as ArrowRight, E as Rocket, H as Mail, Mt as ArrowDownLeft, St as Check, kt as ArrowUpRight, r as Users, rt as Globe, y as ShieldCheck } from "./_libs/lucide-react.mjs";
import { c as PageHeader, l as StatusPill, n as Button, r as Card } from "./_ssr/AppShell-CbLCr2lg.mjs";
import { n as getDashboardSummary, t as dashOpts } from "./_shell.dashboard-ckcgzWQW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.dashboard-BNMVPuAU.js
var import_jsx_runtime = require_jsx_runtime();
function DashboardRoute() {
	useServerFn(getDashboardSummary);
	const { data } = useSuspenseQuery(dashOpts);
	const setupIncomplete = data.domainsTotal === 0 || data.employeesTotal === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dashboard",
			subtitle: "Deliverability, team status, and recent activity at a glance.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/domains",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					children: "Add domain"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Globe,
					label: "Domains",
					value: data.domainsTotal.toLocaleString(),
					sub: data.domainsTotal === 0 ? "No domains yet" : `${data.domainsVerified} verified · ${data.domainsTotal - data.domainsVerified} pending`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Users,
					label: "Employees",
					value: data.employeesTotal.toLocaleString(),
					sub: data.employeesTotal === 0 ? "No employees yet" : `${data.employeesConnected} active · ${data.employeesTotal - data.employeesConnected} pending`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: ArrowUpRight,
					label: "24h email",
					value: data.sentToday.toLocaleString(),
					sub: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "h-3 w-3" }),
							" ",
							data.receivedToday.toLocaleString(),
							" received"
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: ShieldCheck,
					label: "Deliverability",
					value: `${data.deliverabilityPct}%`,
					sub: data.bouncedToday === 0 ? "No bounces in 24h" : `${data.bouncedToday} bounced`,
					tone: data.deliverabilityPct >= 95 ? "good" : data.deliverabilityPct >= 85 ? "warn" : "bad"
				})
			]
		}),
		!data.hasOrganization && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-6 mb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold",
						children: "Create your workspace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[13.5px] text-ink-3",
						children: "Start with your company profile, then add domains and teammates."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/onboarding",
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: ["Continue setup ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })] })
				})]
			})
		}),
		data.hasOrganization && setupIncomplete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GettingStarted, { data }),
		data.hasOrganization && !setupIncomplete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-0 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-3 border-b border-line text-[13px] font-medium flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recent activity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/logs",
						className: "text-[12px] text-ink-3 hover:text-ink",
						children: "View all →"
					})]
				}), data.recentLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-[13px] text-ink-3",
					children: "No recent logs."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line",
					children: data.recentLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-5 py-3 flex items-center justify-between gap-4 text-[13.5px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: log.subject || "(No subject)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[12px] text-ink-3 truncate mt-0.5",
								children: [
									log.sender,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-1 opacity-50",
										children: "→"
									}),
									" ",
									log.receiver
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end gap-1.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: log.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
								className: "text-[11.5px] text-ink-3",
								children: relativeTime(log.timestamp)
							})]
						})]
					}, log.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocsCard, {})]
		})
	] });
}
function StatCard({ icon: Icon, label, value, sub, tone }) {
	const toneCls = tone === "bad" ? "text-red-600" : tone === "warn" ? "text-amber-600" : "text-ink-3";
	const iconCls = tone === "bad" ? "text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] bg-red-500/10" : tone === "good" ? "text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] bg-emerald-500/10" : "text-ink-4";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "group relative overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/40 cursor-default",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 text-ink-3 text-[11px] uppercase tracking-wider font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "whitespace-nowrap font-mono",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `p-1.5 rounded-md ${iconCls.includes("bg-") ? iconCls : "bg-surface-muted"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3.5 w-3.5 ${iconCls.includes("bg-") ? "" : iconCls}` })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 font-display text-2xl font-bold tracking-tight text-ink",
					children: value
				}),
				sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `mt-1.5 text-[11.5px] font-medium ${toneCls}`,
					children: sub
				})
			]
		})]
	});
}
function GettingStarted({ data }) {
	const steps = [
		{
			done: data.domainsTotal > 0,
			label: "Add your sending domain",
			to: "/domains",
			cta: "Add domain"
		},
		{
			done: data.domainsVerified > 0,
			label: "Verify DNS records",
			to: "/domains",
			cta: "Verify"
		},
		{
			done: data.employeesTotal > 0,
			label: "Add employees",
			to: "/employees",
			cta: "Add employee"
		},
		{
			done: data.employeesConnected > 0,
			label: "Connect their Gmail",
			to: "/gmail",
			cta: "Connect Gmail"
		},
		{
			done: false,
			label: "Start sending business email",
			to: "/logs",
			cta: "View logs"
		}
	];
	const nextIdx = steps.findIndex((s) => !s.done);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 lg:col-span-2 flex flex-col justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-[15px] font-bold text-ink",
				children: "Getting started"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[13px] text-ink-3",
				children: "Complete these steps to activate your workspace email routing."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 space-y-1.5",
				children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-center justify-between gap-3 p-2 rounded-xl transition ${i === nextIdx ? "bg-surface-muted/60 border border-line" : "hover:bg-ink/[0.02]"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${s.done ? "bg-emerald-500/15 text-emerald-600" : "bg-ink/[0.08] text-ink-3"}`,
							children: s.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[13px] truncate ${s.done ? "text-ink-4 line-through" : "text-ink font-medium"}`,
							children: s.label
						})]
					}), !s.done && i === nextIdx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: s.to,
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							className: "h-7 px-2.5 text-[12px]",
							children: s.cta
						})
					})]
				}, s.label))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocsCard, {})]
	});
}
function DocsCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-0 flex flex-col justify-between overflow-hidden shadow-xs border-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 py-3.5 border-b border-line bg-surface-muted/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-[14.5px] font-bold text-ink",
				children: "Documentation"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[12px] text-ink-3",
				children: "Quick guides for running email on Mailcoy."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-2.5 grid gap-1 flex-1",
			children: [
				{
					label: "Domain setup guide",
					hash: "domains",
					icon: Globe,
					desc: "DNS records, SPF, DKIM, & DMARC"
				},
				{
					label: "Gmail connection guide",
					hash: "gmail",
					icon: Mail,
					desc: "Link employee Google inboxes"
				},
				{
					label: "Employee invitation guide",
					hash: "employees",
					icon: Users,
					desc: "Onboard staff to send/receive mail"
				},
				{
					label: "Quickstart & Setup FAQ",
					hash: "quickstart",
					icon: Rocket,
					desc: "Step-by-step setup order"
				}
			].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/help",
				hash: l.hash,
				className: "flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-muted/60 transition group min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-8 w-8 rounded-lg bg-ink/[0.04] group-hover:bg-primary/10 group-hover:text-primary transition grid place-items-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(l.icon, { className: "h-4 w-4 text-ink-3 group-hover:text-primary transition" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12.5px] font-semibold text-ink truncate group-hover:text-primary transition",
							children: l.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-ink-4 shrink-0 group-hover:text-ink-2 transition -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-ink-3 truncate leading-normal",
						children: l.desc
					})]
				})]
			}, l.label))
		})]
	});
}
function relativeTime(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const s = Math.floor(diff / 1e3);
	if (s < 60) return `${s}s ago`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 30) return `${d}d ago`;
	return new Date(iso).toLocaleDateString();
}
//#endregion
export { DashboardRoute as component };
