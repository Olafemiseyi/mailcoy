import { o as __toESM } from "../_runtime.mjs";
import { g as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Logomark } from "./Logomark-BWOODGU3.mjs";
import { J as LayoutDashboard, V as Menu, W as LogOut, n as X } from "../_libs/lucide-react.mjs";
import { u as SupportChatWidget } from "./AppShell-B0jIXsQK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MarketingShell-CJC_-SoJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/pricing",
		label: "Pricing"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/docs",
		label: "Docs"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function MarketingShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [user, setUser] = (0, import_react.useState)(null);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
		});
		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});
		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);
	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		router.navigate({
			to: "/",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center gap-6 px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-[15px] font-semibold tracking-tight",
								children: "Mailcoy"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-1 md:flex",
							children: NAV.slice(1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								className: "rounded-md px-2.5 py-1.5 text-[13.5px] text-ink-3 transition-colors hover:text-ink [&.active]:text-ink [&.active]:font-semibold",
								activeOptions: { exact: n.to === "/" },
								children: n.label
							}, n.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard",
								className: "hidden sm:inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-xs transition-transform hover:translate-y-[-1px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-3.5 w-3.5" }), " Dashboard"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleSignOut,
								className: "hidden sm:inline-flex text-[13px] text-ink-3 hover:text-danger px-2.5 py-1 transition-colors",
								children: "Log out"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth/login",
								className: "hidden text-[13.5px] text-ink-3 transition-colors hover:text-ink sm:inline-block",
								children: "Sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth/signup",
								className: "inline-flex h-8 items-center rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-[0_1px_0_0_oklch(1_0_0_/_0.08)_inset] transition-transform hover:translate-y-[-1px]",
								children: "Get started"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Menu",
								onClick: () => setOpen((v) => !v),
								className: "ml-1 grid h-8 w-8 place-items-center rounded-md border border-line md:hidden",
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
							})]
						})
					]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-line bg-background/95 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2 duration-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mx-auto flex max-w-6xl flex-col p-4 space-y-1",
						children: [NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							onClick: () => setOpen(false),
							className: "flex items-center justify-between rounded-xl px-4 py-3 text-[14.5px] font-medium text-ink-2 hover:bg-surface-muted transition [&.active]:bg-primary [&.active]:text-primary-foreground [&.active]:font-semibold shadow-xs",
							activeOptions: { exact: n.to === "/" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs opacity-70",
								children: "→"
							})]
						}, n.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3 mt-2 border-t border-line",
							children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/dashboard",
									onClick: () => setOpen(false),
									className: "flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }), " Dashboard"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setOpen(false);
										handleSignOut();
									},
									className: "flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface text-[13.5px] font-semibold text-danger hover:bg-danger/10 transition shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Log out"]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth/login",
									onClick: () => setOpen(false),
									className: "flex h-11 items-center justify-center rounded-xl border border-line bg-surface text-[13.5px] font-semibold text-ink shadow-xs",
									children: "Sign in"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth/signup",
									onClick: () => setOpen(false),
									className: "flex h-11 items-center justify-center rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground shadow-xs",
									children: "Get started"
								})]
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportChatWidget, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-28 border-t border-line bg-surface-muted/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-5 pt-16 pb-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-10 sm:grid-cols-2 md:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-6 w-6 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-lg font-bold tracking-tight text-ink",
												children: "Mailcoy"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-primary/10 text-primary border border-primary/20",
												children: "v2.4 Live"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "max-w-sm text-[13.5px] leading-relaxed text-ink-3",
										children: "The modern business email operating system. Connect your custom domain to your team's existing Gmail inboxes with zero Google Workspace markup."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5 pt-1 text-[13px] text-ink-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-ink-4 text-[11px] uppercase tracking-wider block",
											children: "Official Inquiries:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "mailto:hello@mailcoy.com",
											className: "font-mono text-ink hover:text-primary transition font-medium",
											children: "hello@mailcoy.com"
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/status",
										className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-surface text-[12px] text-ink-2 shadow-xs hover:border-primary/40 transition group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "group-hover:text-primary transition",
											children: "All Systems Operational (99.99%)"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-ink-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex items-center gap-1 font-mono",
												children: "🔒 TLS 1.3 Encryption"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex items-center gap-1 font-mono",
												children: "🛡️ 100% SPF/DKIM"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex items-center gap-1 font-mono",
												children: "⚡ Sub-Second Delivery"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[12px] font-semibold uppercase tracking-[0.14em] text-ink",
								children: "Product"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-2.5 text-[13px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/pricing",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Pricing & Plans"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth/signup",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Start Free Trial"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth/login",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Customer Sign In"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/dashboard",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Admin Dashboard"
									}) })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[12px] font-semibold uppercase tracking-[0.14em] text-ink",
								children: "Resources"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-2.5 text-[13px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/docs",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Documentation"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/help",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Setup Guide & FAQs"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/status",
										className: "text-ink-3 transition-colors hover:text-primary flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }), " System Status"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/contact",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Help & Support"
									}) })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[12px] font-semibold uppercase tracking-[0.14em] text-ink",
								children: "Legal & Trust"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-2.5 text-[13px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/privacy",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Privacy Policy"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/terms",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "Terms of Service"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/about",
										className: "text-ink-3 transition-colors hover:text-primary",
										children: "About Mailcoy"
									}) })
								]
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-ink-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Mailcoy Technologies. All rights reserved."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy",
									className: "hover:text-ink transition-colors",
									children: "Privacy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/terms",
									className: "hover:text-ink transition-colors",
									children: "Terms"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/status",
									className: "hover:text-ink transition-colors",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/docs",
									className: "hover:text-ink transition-colors",
									children: "Docs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "hover:text-ink transition-colors",
									children: "Support"
								})
							]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { MarketingShell as t };
