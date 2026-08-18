import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { D as RefreshCw, H as Mail, c as TrendingUp, dt as DollarSign, r as Users, rt as Globe, s as TriangleAlert, vt as CircleCheck, wt as Building2 } from "../_libs/lucide-react.mjs";
import { r as Card } from "./AppShell-B0jIXsQK.mjs";
import { t as opts } from "./admin-COyITX3s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DWaYh2W1.js
var import_jsx_runtime = require_jsx_runtime();
function ngn(kobo) {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0
	}).format(kobo / 100);
}
function AdminOverview() {
	const { data, refetch, isFetching } = useSuspenseQuery(opts);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: "Platform overview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13.5px] text-ink-3 mt-1",
				children: "Revenue, growth, and system health across every tenant."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => refetch(),
				disabled: isFetching,
				className: "inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-line text-[13px] hover:bg-ink/[0.03]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}` }), "Refresh"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-[12px] uppercase tracking-wider text-ink-3 font-medium",
				children: "Revenue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: DollarSign,
						label: "Total collected",
						value: ngn(data.revenue.totalKobo),
						hint: "All successful subscription charges to date",
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: TrendingUp,
						label: "Last 30 days",
						value: ngn(data.revenue.kobo30d),
						hint: "Rolling 30-day revenue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: DollarSign,
						label: "MRR",
						value: ngn(data.revenue.mrrKobo),
						hint: "Monthly recurring — sum of active subscription prices"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-[12px] uppercase tracking-wider text-ink-3 font-medium",
				children: "Growth"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Building2,
						label: "Organizations",
						value: data.growth.organizations.total.toString(),
						hint: `+${data.growth.organizations.week} this week · +${data.growth.organizations.month} this month`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Users,
						label: "Users",
						value: data.growth.users.total.toString(),
						hint: `+${data.growth.users.week} this week`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Users,
						label: "Employees",
						value: data.growth.employees.total.toString(),
						hint: `${data.growth.employees.active} active`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Mail,
						label: "Gmail connections",
						value: data.growth.gmail.connected.toString(),
						hint: `${data.growth.gmail.revoked} revoked`
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-[12px] uppercase tracking-wider text-ink-3 font-medium",
				children: "Subscriptions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-1 grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							label: "Active",
							value: data.subscriptions.active.toString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							label: "Trialing",
							value: data.subscriptions.trialing.toString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							label: "Past due",
							value: data.subscriptions.pastDue.toString(),
							tone: data.subscriptions.pastDue > 0 ? "warn" : "default"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							label: "Cancelled",
							value: data.subscriptions.cancelled.toString()
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 text-[13px] font-medium",
						children: "Breakdown by plan"
					}), data.subscriptions.byPlan.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-ink-3",
						children: "No subscriptions yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-[13px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-ink-3 border-b border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Plan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Active"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Trialing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Past due"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Cancelled"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.subscriptions.byPlan.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 font-mono",
									children: row.plan
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: row.active
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: row.trialing
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: row.past_due
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-ink-3",
									children: row.canceled
								})
							]
						}, row.plan)) })]
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-[12px] uppercase tracking-wider text-ink-3 font-medium",
				children: "System health"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Mail,
						label: "Emails sent today",
						value: data.health.emailsToday.toString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: TriangleAlert,
						label: "Bounced (7d)",
						value: data.health.bouncedThisWeek.toString(),
						tone: data.health.bouncedThisWeek > 0 ? "warn" : "default"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Mail,
						label: "Gmail revoked",
						value: data.health.gmailRevoked.toString(),
						tone: data.health.gmailRevoked > 0 ? "warn" : "default"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Globe,
						label: "Failing domains",
						value: data.health.domainsFailing.toString(),
						tone: data.health.domainsFailing > 0 ? "warn" : "default"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-medium",
						children: "Recent activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11.5px] text-ink-3",
						children: "Last 20"
					})]
				}), data.recentActivity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-ink-3",
					children: "No activity yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-[13px]",
					children: data.recentActivity.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-ink-2 truncate",
							children: a.action
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink-3 text-[11.5px] shrink-0",
							children: new Date(a.at).toLocaleString()
						})]
					}, a.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-medium",
						children: "Recent billing events"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11.5px] text-ink-3",
						children: "Last 10"
					})]
				}), data.recentBilling.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-ink-3",
					children: "No billing events yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-[13px]",
					children: data.recentBilling.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 min-w-0",
							children: [b.status === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink-2 truncate",
								children: b.event_type
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink-3 text-[11.5px] shrink-0",
							children: new Date(b.created_at).toLocaleString()
						})]
					}, b.id))
				})]
			})]
		})
	] });
}
function MetricCard({ icon: Icon, label, value, hint, tone, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: `p-5 ${accent ? "bg-primary/[0.04] border-primary/30" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-[12px] uppercase tracking-wider text-ink-3 font-medium",
				children: [
					Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
					" ",
					label
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-2 font-display text-2xl font-semibold tracking-tight ${tone === "warn" ? "text-amber-700" : ""}`,
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-[12px] text-ink-3",
				children: hint
			})
		]
	});
}
//#endregion
export { AdminOverview as component };
