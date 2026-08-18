import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { F as PenLine, G as Lock, St as Check, et as Inbox, g as Sparkles, k as Radio, kt as ArrowUpRight, l as TrendingDown, r as Users, t as Zap, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as MarketingShell } from "./MarketingShell-t0A5dd5p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DzCOF933.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MarketingShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logos, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavingsCalculator, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureGrid, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoutingDiagram, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {})
	] });
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "paper-grain relative",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 pt-16 pb-14 md:pt-24 md:pb-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-success" }), "Now in early access"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display mt-6 text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px] md:text-[68px]",
						children: [
							"Professional email.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ink-3",
								children: "Gmail workflow."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-3",
						children: "Give your team business email on your domain — sales@, support@, everyone@ — while they keep using the Gmail they already know. Set up in minutes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auth/signup",
							className: "inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-[14px] font-medium text-primary-foreground transition-transform hover:translate-y-[-1px]",
							children: ["Start free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pricing",
							className: "inline-flex h-10 items-center rounded-md border border-line-strong bg-surface px-4 text-[14px] font-medium text-ink transition-colors hover:bg-surface-muted",
							children: "See pricing"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-[12.5px] text-ink-4",
						children: "No credit card. Connect your domain in under 5 minutes."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto mt-14 max-w-5xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-12 -bottom-10 h-32 rounded-full bg-primary/20 blur-3xl opacity-75 transition duration-500 group-hover:opacity-100" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-tilt-card group relative overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_25px_70px_-20px_oklch(0.12_0_0_/_0.25)] hover:border-primary/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-11 items-center justify-between border-b border-line bg-surface-muted/70 px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-rose-500/80" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-amber-500/80" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-emerald-500/80" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 px-3 py-1 rounded-md bg-background/80 border border-line text-[11.5px] font-mono text-ink-3 shadow-2xs max-w-xs truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "app.mailcoy.com/dashboard" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-mono text-ink-4 hidden sm:block",
								children: "Mailcoy v2.4 Live"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardStill, {})]
				})]
			})]
		})
	});
}
function DashboardStill() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 p-4 sm:p-6 md:p-8 md:grid-cols-[200px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden flex-col justify-between border-r border-line/60 pr-5 md:flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pb-4 mb-2 border-b border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-[14px] font-bold text-ink tracking-tight",
						children: "Mailcoy OS"
					})]
				}), [
					{
						label: "Overview",
						active: true
					},
					{
						label: "Domains & DNS",
						active: false
					},
					{
						label: "Employees (12)",
						active: false
					},
					{
						label: "Gmail Sync",
						active: false
					},
					{
						label: "Routing & Aliases",
						active: false
					},
					{
						label: "Delivery Logs",
						active: false
					},
					{
						label: "Settings",
						active: false
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-lg px-3 py-2 text-[12.5px] font-medium transition cursor-default flex items-center justify-between ${item.active ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-ink-3 hover:text-ink hover:bg-surface-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), item.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-white animate-pulse" })]
				}, item.label))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 rounded-xl border border-line bg-surface-muted/50 space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10.5px] font-mono uppercase tracking-wider text-ink-4",
						children: "Workspace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-[13px] font-bold text-ink truncate",
						children: "Mailcoy Inc"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-emerald-600 font-medium",
						children: "● Enterprise Plan"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-line/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg sm:text-xl font-bold tracking-tight text-ink",
						children: "Executive Overview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12.5px] text-ink-3",
						children: "Live mail delivery and custom domain routing status."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-mono font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), " mailcoy.com Active"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						{
							label: "Primary Domain",
							value: "mailcoy.com",
							note: "100% SPF/DKIM Pass",
							isGood: true
						},
						{
							label: "Active Team",
							value: "12 Inboxes",
							note: "Gmail Send-As Connected",
							isGood: false
						},
						{
							label: "Routed Today",
							value: "1,284 Emails",
							note: "0.2s Avg Delivery",
							isGood: true
						}
					].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-xl border border-line bg-background/80 p-4 space-y-1.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] uppercase tracking-wider font-mono text-ink-4",
									children: card.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[17px] font-display font-bold text-ink mt-1",
									children: [card.isGood && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" }), card.value]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11.5px] text-ink-3 mt-0.5 font-medium",
									children: card.note
								})
							]
						})]
					}, card.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-background/80 overflow-hidden shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-line bg-surface-muted/40 px-4 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12.5px] font-semibold text-ink",
							children: "Real-Time Routing Stream"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), " LIVE"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line text-[12.5px]",
						children: [
							{
								from: "sales@mailcoy.com",
								to: "akin@gmail.com",
								time: "Just now",
								status: "Delivered (0.1s)"
							},
							{
								from: "john@mailcoy.com",
								to: "john.doe@gmail.com",
								time: "2m ago",
								status: "Delivered (0.2s)"
							},
							{
								from: "support@mailcoy.com",
								to: "team@gmail.com",
								time: "5m ago",
								status: "Delivered (0.1s)"
							}
						].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "group flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 hover:bg-surface-muted/30 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 truncate",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold text-ink truncate group-hover:text-primary transition-colors",
										children: row.from
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-ink-4",
										children: "→"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-ink-3 truncate",
										children: row.to
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 shrink-0 self-start sm:self-auto text-[11.5px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ink-4 font-mono",
									children: row.time
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-mono font-semibold border border-emerald-500/20 shadow-xs",
									children: row.status
								})]
							})]
						}, row.from))
					})]
				})
			]
		})]
	});
}
function Logos() {
	const companies = [
		{
			name: "Mailcoy Innovations",
			tag: "AI & Cloud Tech"
		},
		{
			name: "SmartTable",
			tag: "SaaS Productivity"
		},
		{
			name: "PharmIQ",
			tag: "HealthTech Systems"
		},
		{
			name: "Kalu & Co",
			tag: "Financial Services"
		},
		{
			name: "Northline Dynamics",
			tag: "Logistics"
		},
		{
			name: "Portway Logistics",
			tag: "Global Freight"
		},
		{
			name: "Empire Homes",
			tag: "Real Estate"
		},
		{
			name: "Ovate Media",
			tag: "Digital Agency"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-y border-line bg-surface-muted/30 py-8 overflow-hidden relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-5 mb-4 flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-3",
					children: "Trusted by fast-growing modern teams worldwide"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-max animate-[marquee_35s_linear_infinite] gap-6 hover:[animation-play-state:paused]",
				children: [...companies, ...companies].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 px-4 py-2 rounded-xl border border-line bg-surface/80 shadow-xs hover:border-primary/40 hover:bg-surface transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-7 w-7 rounded-lg bg-primary/10 text-primary font-bold text-xs grid place-items-center font-display",
						children: c.name.charAt(0)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-[13.5px] font-semibold text-ink tracking-tight",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-ink-4 uppercase tracking-wider",
							children: c.tag
						})]
					})]
				}, i))
			})
		]
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-5 py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center max-w-2xl mx-auto mb-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-[11.5px] font-semibold text-primary uppercase tracking-widest mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Frictionless Architecture"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-[32px] font-bold tracking-tight sm:text-[44px] text-ink leading-tight",
					children: [
						"Three effortless steps. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink-3",
							children: "Zero new software to learn."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[15px] text-ink-3",
					children: "Everything happens behind the scenes. Your team stays in Gmail; your customers see an enterprise custom domain."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 md:grid-cols-3",
			children: [
				{
					n: "01",
					t: "Connect Your Domain",
					d: "Add your domain in 60 seconds. Mailcoy auto-configures your DNS with 1-click SPF, DKIM, and DMARC verification.",
					badge: "Zero Downtime",
					icon: ShieldCheck
				},
				{
					n: "02",
					t: "Provision Team Inboxes",
					d: "Create custom addresses (sales@yourdomain.com, team@) and link them to teammates' existing Gmail inboxes.",
					badge: "No Passwords Needed",
					icon: Users
				},
				{
					n: "03",
					t: "Send & Reply from Gmail",
					d: "Teammates receive and send professional branded emails straight from their standard Gmail mobile or web apps.",
					badge: "Zero Workspace Markup",
					icon: Zap
				}
			].map((s) => {
				const Icon = s.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "group relative rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[12px] font-bold tracking-widest text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20",
								children: ["STEP ", s.n]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-ink-4 bg-surface-muted px-2.5 py-1 rounded-md border border-line",
								children: s.badge
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-xl bg-surface-muted border border-line flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-primary/40 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-ink" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-[20px] font-bold tracking-tight text-ink mb-2",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[14px] leading-relaxed text-ink-3",
							children: s.d
						})
					] })
				}, s.n);
			})
		})]
	});
}
function FeatureGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-line bg-surface-muted/30 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl mb-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Built for Scale"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-[32px] font-bold tracking-tight sm:text-[42px] text-ink leading-tight",
						children: [
							"Engineered to replace ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Google Workspace seat markup."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[15px] text-ink-3",
						children: "All the professional features you need to manage your business identity, with none of the bloated licensing fees."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-3",
				children: [
					{
						title: "Google CASA-Compliant Security",
						desc: "End-to-end TLS 1.3 encryption with OAuth 2.0 token security. No access to employee personal files or emails.",
						tag: "Security First",
						colSpan: "md:col-span-2",
						icon: Lock
					},
					{
						title: "Sub-Second Inbound Routing",
						desc: "Real-time edge proxies deliver incoming customer inquiries into Gmail within ~350 milliseconds.",
						tag: "Edge Speed",
						colSpan: "md:col-span-1",
						icon: Zap
					},
					{
						title: "Centralized HTML Signatures",
						desc: "Standardize your company's email signatures across all employees with department tokens and live previews.",
						tag: "Brand Identity",
						colSpan: "md:col-span-1",
						icon: PenLine
					},
					{
						title: "Shared Inboxes & Catch-Alls",
						desc: "Route sales@, support@, or billing@ to multiple teammates simultaneously without paying extra seat fees.",
						tag: "Zero Seat Fees",
						colSpan: "md:col-span-2",
						icon: Inbox
					}
				].map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${item.colSpan} rounded-2xl border border-line bg-surface p-8 shadow-xs hover:border-line-strong hover:shadow-md transition-all duration-200 flex flex-col justify-between`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-xl bg-surface-muted border border-line flex items-center justify-center text-ink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-mono font-medium uppercase tracking-wider text-ink-4 px-2.5 py-1 rounded-md bg-background border border-line",
									children: item.tag
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-[20px] font-bold text-ink mb-2",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[14px] leading-relaxed text-ink-3",
								children: item.desc
							})
						] })
					}, item.title);
				})
			})]
		})
	});
}
function RoutingDiagram() {
	const [activeScenario, setActiveScenario] = (0, import_react.useState)("inbound");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-5 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-12 lg:grid-cols-2 lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11.5px] font-semibold text-primary uppercase tracking-wider mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3.5 w-3.5 animate-pulse" }), " Live Routing Telemetry"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-[32px] font-bold leading-tight tracking-tight sm:text-[44px] text-ink",
					children: [
						"Your custom domain. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Their favorite inbox."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[15.5px] leading-relaxed text-ink-3",
					children: "When clients email your branded business address, Mailcoy instantly delivers it to your staff's existing Gmail inbox. When they hit reply, the client sees your verified company email address."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-3.5",
					children: [
						"100% compatible with Gmail personal (@gmail.com) and company inboxes",
						"Automatic SPF, DKIM, and DMARC alignment for maximum deliverability",
						"Zero mailbox migrations or downtime required"
					].map((text) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-[14px] text-ink-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text })]
					}, text))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveScenario("inbound"),
						className: `px-4 py-2 rounded-xl text-[13px] font-semibold transition ${activeScenario === "inbound" ? "bg-primary text-primary-foreground shadow-xs" : "border border-line bg-surface text-ink-3 hover:text-ink"}`,
						children: "1. Customer Sends Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveScenario("reply"),
						className: `px-4 py-2 rounded-xl text-[13px] font-semibold transition ${activeScenario === "reply" ? "bg-primary text-primary-foreground shadow-xs" : "border border-line bg-surface text-ink-3 hover:text-ink"}`,
						children: "2. Staff Replies in Gmail"
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-lg space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-line pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-[15px] font-bold text-ink",
						children: activeScenario === "inbound" ? "Inbound Routing Flow" : "Outbound Reply Flow"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11.5px] font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold",
						children: "● Verified 0.3s"
					})]
				}), activeScenario === "inbound" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 animate-in fade-in duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowRow, {
							from: "client@acme.com",
							to: "sales@yourcompany.com",
							label: "Step 1: Customer inquiry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 ml-6 h-6 w-0.5 bg-primary/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary/30 bg-primary/[0.04] p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-[11.5px] font-mono uppercase tracking-wider text-primary font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5" }), " Mailcoy Gateway Routing"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-mono text-[13px] font-semibold text-ink",
								children: "sales@yourcompany.com ➔ john.doe@gmail.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 ml-6 h-6 w-0.5 bg-primary/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowRow, {
							from: "Mailcoy Relay",
							to: "john.doe@gmail.com",
							label: "Step 2: Instant Gmail Inbox Delivery"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 animate-in fade-in duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowRow, {
							from: "john.doe@gmail.com",
							to: "client@acme.com",
							label: "Step 1: John composes in Gmail"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 ml-6 h-6 w-0.5 bg-emerald-500/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-[11.5px] font-mono uppercase tracking-wider text-emerald-600 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Send-As Domain Header Masking"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-mono text-[13px] font-semibold text-ink",
								children: "From: John Doe <sales@yourcompany.com>"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 ml-6 h-6 w-0.5 bg-emerald-500/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowRow, {
							from: "sales@yourcompany.com",
							to: "client@acme.com",
							label: "Step 2: Customer sees branded domain reply"
						})
					]
				})]
			})]
		})
	});
}
function FlowRow({ from, to, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-line bg-background p-3.5 shadow-2xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate font-mono text-[12.5px] font-medium text-ink",
				children: from
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-surface-muted px-2.5 py-0.5 text-[10.5px] font-mono uppercase tracking-wider text-ink-3 border border-line",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate text-right font-mono text-[12.5px] font-medium text-ink",
				children: to
			})
		]
	});
}
function CTA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-5 pb-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-3xl border border-line-strong bg-ink px-6 py-16 text-center text-primary-foreground md:px-12 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "relative font-display text-[34px] font-bold leading-tight tracking-tight sm:text-[48px]",
					children: "Ready to save 80% on business email?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "relative mx-auto mt-4 max-w-lg text-[15.5px] text-primary-foreground/80 leading-relaxed",
					children: "Set up in less than 5 minutes. No credit card required. Keep the exact Gmail workflow your staff already loves."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-8 flex flex-wrap items-center justify-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/auth/signup",
						className: "inline-flex h-11 items-center gap-2 rounded-xl bg-white text-ink px-6 text-[14px] font-bold shadow-lg hover:bg-slate-100 transition",
						children: ["Start For Free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/pricing",
						className: "inline-flex h-11 items-center rounded-xl border border-white/25 bg-white/10 px-6 text-[14px] font-semibold text-white hover:bg-white/15 transition",
						children: "View Pricing Plans"
					})]
				})
			]
		})
	});
}
function SavingsCalculator() {
	const [employees, setEmployees] = (0, import_react.useState)(15);
	const workspaceCost = employees * 84;
	const mailcoyCost = employees * 24;
	const annualSavings = workspaceCost - mailcoyCost;
	const percentageSaved = Math.round(annualSavings / workspaceCost * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-line bg-surface py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-2xl mx-auto mb-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11.5px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Instant Cost Reduction"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[32px] font-semibold tracking-tight sm:text-[40px] text-ink",
						children: "See how much you save vs. Google Workspace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[15px] text-ink-3",
						children: "Stop paying per-seat subscriptions for office software your team doesn't use."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-line-strong bg-background p-8 md:p-10 shadow-lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[13.5px] font-semibold text-ink uppercase tracking-wider",
								children: "Team Size (Employees)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-2xl font-bold text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20",
								children: [
									employees,
									" ",
									employees === 1 ? "person" : "people"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: "3",
							max: "100",
							value: employees,
							onChange: (e) => setEmployees(Number(e.target.value)),
							className: "w-full h-2.5 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-primary my-4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-[11.5px] text-ink-4 font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3 employees" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "25 employees" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "50 employees" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100+ employees" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 space-y-3 text-[13px] text-ink-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-2 border-b border-line",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Google Workspace ($7/seat/mo):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-medium text-ink-2",
									children: [
										"$",
										workspaceCost.toLocaleString(),
										" / year"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-2 border-b border-line",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mailcoy ($2/seat/mo):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-medium text-emerald-600",
									children: [
										"$",
										mailcoyCost.toLocaleString(),
										" / year"
									]
								})]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 text-center space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11.5px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold",
								children: "Your Estimated Savings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-[48px] md:text-[56px] font-bold text-emerald-600 tracking-tight leading-none",
								children: [
									"$",
									annualSavings.toLocaleString(),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[18px] text-ink-3 font-normal font-sans",
										children: " / year"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4" }),
									" Save ",
									percentageSaved,
									"% every year"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12px] text-ink-3 max-w-xs mx-auto pt-2",
								children: "Keep the exact same professional domain identity and familiar Gmail experience."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auth/signup",
								className: "mt-4 inline-flex w-full h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 text-white font-medium text-[13.5px] hover:bg-emerald-700 transition",
								children: ["Claim your savings ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
							})
						]
					})]
				})
			})]
		})
	});
}
var SplitComponent = LandingPage;
//#endregion
export { SplitComponent as component };
