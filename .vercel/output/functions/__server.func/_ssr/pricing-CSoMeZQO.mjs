import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { At as ArrowRight, St as Check, g as Sparkles, rt as Globe } from "../_libs/lucide-react.mjs";
import { n as detectUserCurrency } from "./currency-DDz1dxut.mjs";
import { t as MarketingPage } from "./MarketingPage-CIzb31Ej.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-CSoMeZQO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Pricing() {
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	(0, import_react.useEffect)(() => {
		setCurrency(detectUserCurrency());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MarketingPage, {
		eyebrow: "Transparent Pricing",
		title: "Save up to 80% on business email.",
		lede: "Stop paying $7/user/month for Google Workspace just to send email on your domain.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[14px] font-semibold text-emerald-700 dark:text-emerald-400",
					children: [
						"💡 Mailcoy charges ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "underline underline-offset-2",
							children: "per team"
						}),
						", not per user."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[13px] text-ink-3 max-w-xl mx-auto",
					children: [
						"Unlike Google Workspace or Zoho where costs multiply with every hire, your Mailcoy bill stays flat. A team of 20 on Growth pays ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink",
							children: "$29/month"
						}),
						" — the same as a team of 3. Your Gmail inboxes are untouched; we just power the professional layer on top."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center mb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-line bg-surface text-[12.5px] text-ink-3 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Prices shown in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink",
							children: currency === "NGN" ? "NGN (₦)" : "USD ($)"
						}),
						" based on your region"
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						name: "Free",
						usd: "$0",
						ngn: "₦0",
						priceNote: "/ month · whole team",
						perUserEq: null,
						gwSaving: null,
						tag: "Solopreneurs & Startups",
						desc: "For new ventures connecting their first custom domain.",
						features: [
							"1 Custom Domain",
							"1 Team Inbox",
							"Gmail Send-As Integration",
							"Automatic SPF & DKIM Setup",
							"Standard Email Support"
						],
						highlight: false,
						actionText: "Start For Free"
					},
					{
						name: "Starter Pro",
						usd: "$9",
						ngn: "₦7,500",
						priceNote: "/ month · whole team",
						perUserEq: {
							usd: "$1.80/user",
							ngn: "₦1,500/user",
							users: 5
						},
						gwSaving: {
							usd: "$26",
							ngn: "₦21,700"
						},
						tag: "Small Teams",
						desc: "Perfect for small teams who just need professional addresses.",
						features: [
							"1 Custom Domain",
							"Up to 5 Team Inboxes",
							"Gmail Send-As Integration",
							"Centralized Company Signatures",
							"Standard Email Support"
						],
						highlight: false,
						actionText: "Upgrade to Starter"
					},
					{
						name: "Growth",
						usd: "$29",
						ngn: "₦20,000",
						priceNote: "/ month · whole team",
						perUserEq: {
							usd: "$1.45/user",
							ngn: "₦1,000/user",
							users: 20
						},
						gwSaving: {
							usd: "$111",
							ngn: "₦91,000"
						},
						tag: "Growing Companies",
						desc: "Everything you need to eliminate Google Workspace markup.",
						features: [
							"3 Custom Domains",
							"Up to 20 Team Inboxes",
							"Catch-All Inboxes & Shared Mail",
							"Centralized Company Signatures",
							"DNSBL Blacklist Monitoring",
							"Full API Access",
							"Priority Support & Fast Setup"
						],
						highlight: true,
						actionText: "Upgrade to Growth"
					},
					{
						name: "Scale",
						usd: "$79",
						ngn: "₦50,000",
						priceNote: "/ month · whole team",
						perUserEq: {
							usd: "$1.58/user",
							ngn: "₦1,000/user",
							users: 50
						},
						gwSaving: {
							usd: "$271",
							ngn: "₦222,000"
						},
						tag: "Established Brands",
						desc: "For mid-to-large businesses managing heavy team volume.",
						features: [
							"10 Custom Domains",
							"Up to 50 Team Inboxes",
							"1-Click Employee Offboarding Shield",
							"CSV Bulk Onboarding Wizard",
							"Real-Time Deliverability Shield",
							"Full API Access & Webhooks",
							"Dedicated VIP Account Manager"
						],
						highlight: false,
						actionText: "Contact Sales"
					}
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative flex flex-col rounded-2xl p-6 transition ${p.highlight ? "border-2 border-primary bg-surface shadow-xl" : "border border-line bg-surface/70 hover:bg-surface"}`,
					children: [
						p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Most Popular"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-4",
								children: p.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display mt-1 text-[22px] font-bold tracking-tight text-ink",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[13px] text-ink-3 min-h-[36px]",
								children: p.desc
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline gap-1.5 whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-[30px] lg:text-[36px] font-bold tracking-tight text-ink",
										children: currency === "USD" ? p.usd : p.ngn
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[12px] lg:text-[13px] text-ink-4 whitespace-nowrap",
										children: p.priceNote
									})]
								}),
								p.perUserEq && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[11.5px] text-ink-3",
									children: [
										"≈ ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-emerald-600 dark:text-emerald-400",
											children: currency === "USD" ? p.perUserEq.usd : p.perUserEq.ngn
										}),
										" ",
										"for up to ",
										p.perUserEq.users,
										" users"
									]
								}),
								p.gwSaving && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400",
									children: [
										"Save ",
										currency === "USD" ? p.gwSaving.usd : p.gwSaving.ngn,
										"/mo vs Google Workspace"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-6 border-t border-line" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2.5 text-[13px] text-ink-2 flex-1",
							children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auth/signup",
							className: `mt-8 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl px-3 text-[12.5px] lg:text-[13.5px] font-semibold transition ${p.highlight ? "bg-primary text-primary-foreground hover:bg-primary-focus shadow-xs" : "border border-line bg-background text-ink hover:bg-surface-muted"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.actionText || "Start For Free" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3.5 w-3.5 shrink-0" })]
						})
					]
				}, p.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 rounded-2xl border border-line overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 py-4 border-b border-line bg-surface-muted/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display font-bold text-[15px] text-ink",
							children: "How Mailcoy stacks up"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12.5px] text-ink-3 mt-0.5",
							children: "All competitor prices are per user, per month. Mailcoy is flat per team."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-[13px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-line text-ink-3 text-[11.5px] uppercase tracking-wider",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-5 py-3 font-medium",
										children: "Platform"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-5 py-3 font-medium",
										children: "Pricing model"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-5 py-3 font-medium",
										children: "20-person team cost"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-5 py-3 font-medium",
										children: "Uses Gmail inbox?"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-line",
								children: [
									{
										name: "Mailcoy Growth",
										model: "Flat team",
										cost20: currency === "USD" ? "$29/mo" : "₦20,000/mo",
										usesGmail: "✅ Yes — your real inbox",
										highlight: true
									},
									{
										name: "Google Workspace",
										model: "Per user ($7)",
										cost20: currency === "USD" ? "$140/mo" : "₦114,800/mo",
										usesGmail: "✅ Yes",
										highlight: false
									},
									{
										name: "Zoho Mail",
										model: "Per user ($1)",
										cost20: currency === "USD" ? "$20/mo" : "₦16,400/mo",
										usesGmail: "❌ Separate inbox",
										highlight: false
									},
									{
										name: "Hostinger Mail",
										model: "Per user ($0.59)",
										cost20: currency === "USD" ? "$11.80/mo" : "₦9,676/mo",
										usesGmail: "❌ Separate inbox",
										highlight: false
									}
								].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: row.highlight ? "bg-emerald-500/[0.03]" : "",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 font-medium text-ink",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [row.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" }), row.name]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 text-ink-2",
											children: row.model
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: `px-5 py-3 font-mono font-semibold ${row.highlight ? "text-emerald-600 dark:text-emerald-400" : "text-ink-2"}`,
											children: row.cost20
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 text-ink-2",
											children: row.usesGmail
										})
									]
								}, row.name))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-3 border-t border-line bg-surface-muted/20 text-[11.5px] text-ink-3",
						children: "* Competitor costs at full 20-user capacity for fair comparison."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 p-6 rounded-2xl border border-line bg-surface-muted/30 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-display font-semibold text-[15px] text-ink",
						children: "Enterprise with 50+ Employees?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-ink-3 mt-1 max-w-xl mx-auto",
						children: "Need dedicated IP pools, custom SSO routing, or custom SLA agreements? Contact our executive team for custom invoicing."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						className: "mt-3 inline-block text-[13px] font-semibold text-primary hover:underline",
						children: "Contact Enterprise Sales →"
					})
				]
			})
		]
	});
}
//#endregion
export { Pricing as component };
