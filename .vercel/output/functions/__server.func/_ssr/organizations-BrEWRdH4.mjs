import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { Nt as Activity, bt as ChevronRight, mt as CreditCard, n as X, r as Users, rt as Globe, w as Search, y as ShieldCheck, yt as CircleAlert } from "../_libs/lucide-react.mjs";
import { r as Card } from "./AppShell-Ct9NjhEH.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as opts } from "./organizations-DQR0shU-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/organizations-BrEWRdH4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminOrgs() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [plan, setPlan] = (0, import_react.useState)("");
	const [offset, setOffset] = (0, import_react.useState)(0);
	const { data } = useSuspenseQuery(opts(search, plan, offset));
	const [selectedOrg, setSelectedOrg] = (0, import_react.useState)(null);
	const getPlanBadge = (code, status) => {
		if (!code) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 text-[11px] font-medium",
			children: "Free"
		});
		if (status === "trialing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium",
			children: "Trial"
		});
		if (status === "past_due") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[11px] font-medium",
			children: "Past Due"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium uppercase tracking-wider",
			children: code
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: "Organizations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13.5px] text-ink-3 mt-1",
					children: "Manage and inspect every tenant on the platform."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-col sm:flex-row sm:items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => {
							setSearch(e.target.value);
							setOffset(0);
						},
						placeholder: "Search by company name...",
						className: "w-full h-9 pl-9 pr-3 rounded-lg border border-line bg-background text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: plan,
					onChange: (e) => {
						setPlan(e.target.value);
						setOffset(0);
					},
					className: "h-9 px-3 rounded-lg border border-line bg-background text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-ink-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All Plans"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "free",
							children: "Free Forever"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "starter",
							children: "Starter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "growth",
							children: "Growth"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "scale",
							children: "Scale"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "trialing",
							children: "Free Trial"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "past_due",
							children: "Past Due"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-0 overflow-hidden shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-[13px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-ink-3 border-b border-line bg-slate-50/50 dark:bg-zinc-900/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium whitespace-nowrap",
									children: "Organization"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium whitespace-nowrap",
									children: "Plan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium whitespace-nowrap",
									children: "Domains"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium whitespace-nowrap",
									children: "Employees"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium whitespace-nowrap",
									children: "Created"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [data.rows.map((r) => {
							const hasVerifiedDomain = r.domains?.some((d) => d.verification_status === "verified");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-line/60 hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group",
								onClick: () => setSelectedOrg(r),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-ink flex items-center gap-2",
											children: r.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-ink-3 mt-0.5",
											children: r.industry ?? "No industry"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: getPlanBadge(r.plan_code, r.plan_status)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-ink-2",
												children: r.domain_count
											}), r.domain_count > 0 && (hasVerifiedDomain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 text-amber-500" }))]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-ink-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5 text-ink-3" }), r.employee_count]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-ink-3 whitespace-nowrap",
										children: new Date(r.created_at).toLocaleDateString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity inline-block" })
									})
								]
							}, r.id);
						}), data.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-4 py-10 text-center text-ink-3",
							children: "No organizations match your filters."
						}) })] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between text-[12.5px] text-ink-3 pb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Showing ",
					data.rows.length,
					" of ",
					data.total
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: offset === 0,
						onClick: () => setOffset(Math.max(0, offset - 50)),
						className: "h-8 px-3 rounded-md border border-line disabled:opacity-40 hover:bg-surface transition-colors font-medium",
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: offset + data.rows.length >= data.total,
						onClick: () => setOffset(offset + 50),
						className: "h-8 px-3 rounded-md border border-line disabled:opacity-40 hover:bg-surface transition-colors font-medium",
						children: "Next"
					})]
				})]
			}),
			selectedOrg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-40",
				onClick: () => setSelectedOrg(null)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: { x: "100%" },
				animate: { x: 0 },
				exit: { x: "100%" },
				transition: {
					type: "spring",
					damping: 25,
					stiffness: 200
				},
				className: "fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-6 border-b border-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold",
							children: selectedOrg.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-ink-3 font-mono mt-1",
							children: selectedOrg.slug
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedOrg(null),
							className: "p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors text-ink-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto p-6 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl border border-line bg-slate-50/50 dark:bg-zinc-900/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-ink-3 mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold uppercase tracking-wider",
											children: "Plan"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: getPlanBadge(selectedOrg.plan_code, selectedOrg.plan_status) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl border border-line bg-slate-50/50 dark:bg-zinc-900/30 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-ink-3 mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold uppercase tracking-wider",
											children: "Created"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[13px] font-medium text-ink",
										children: new Date(selectedOrg.created_at).toLocaleDateString()
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-ink",
									children: "Metadata"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-line divide-y divide-line bg-white dark:bg-zinc-950",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between p-3 text-[13px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-ink-3",
												children: "Industry"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: selectedOrg.industry ?? "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between p-3 text-[13px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-ink-3",
												children: "Country"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: selectedOrg.country ?? "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between p-3 text-[13px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-ink-3",
												children: "Primary Domain"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-ink-2",
												children: selectedOrg.primary_domain ?? "—"
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-sm font-bold text-ink flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" }),
											" Domains (",
											selectedOrg.domain_count,
											")"
										]
									})
								}), selectedOrg.domains?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-line divide-y divide-line",
									children: selectedOrg.domains.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3 text-[13px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-ink-2 truncate max-w-[180px]",
											children: d.id
										}), d.verification_status === "verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Verified"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), " Pending"]
										})]
									}, d.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4 rounded-xl border border-line border-dashed text-center text-[13px] text-ink-3 bg-slate-50/50 dark:bg-zinc-900/30",
									children: "No domains connected yet."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-sm font-bold text-ink flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), " Subscription & Plan Override"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl border border-line bg-slate-50/50 dark:bg-zinc-900/30 space-y-3 text-[13px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-ink-3",
											children: "Current Plan:"
										}), getPlanBadge(selectedOrg.plan_code, selectedOrg.plan_status)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "plan-override-select",
											defaultValue: selectedOrg.plan_code || "starter",
											className: "flex-1 h-9 rounded-md border border-line bg-background px-2.5 text-[12.5px] outline-none",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "free",
													children: "Free (5 seats)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "starter",
													children: "Starter (25 seats)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "pro",
													children: "Pro (100 seats)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "enterprise",
													children: "Enterprise VIP (Unlimited)"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: async () => {
												const sel = document.getElementById("plan-override-select");
												if (!sel) return;
												try {
													const { overrideOrgPlan } = await import("./admin.functions-Bhxi-PnD.mjs").then((n) => n.t).then((n) => n.t);
													await overrideOrgPlan({ data: {
														organizationId: selectedOrg.id,
														planCode: sel.value,
														status: "active"
													} });
													alert(`Successfully upgraded ${selectedOrg.name} to ${sel.value.toUpperCase()}`);
													window.location.reload();
												} catch (e) {
													alert(e.message || "Failed to override plan");
												}
											},
											className: "px-3 h-9 rounded-md bg-primary text-primary-foreground font-medium text-[12px] hover:bg-primary-focus transition",
											children: "Apply Override"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-bold text-ink flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Employees"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl border border-line bg-slate-50/50 dark:bg-zinc-900/30 flex justify-between items-center text-[13px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-ink-3 font-medium",
										children: "Total Provisioned Seats"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-lg",
										children: selectedOrg.employee_count
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 border-t border-line bg-slate-50 dark:bg-zinc-950",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								localStorage.setItem("mailcoy_impersonating_org_id", selectedOrg.id);
								localStorage.setItem("mailcoy_impersonating_org_name", selectedOrg.name);
								window.location.href = "/dashboard";
							},
							className: "w-full py-2.5 rounded-lg border border-line bg-white dark:bg-zinc-900 text-ink text-[13px] font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), "Impersonate Organization (Ghost Mode)"]
						})
					})
				]
			})] })
		]
	});
}
//#endregion
export { AdminOrgs as component };
