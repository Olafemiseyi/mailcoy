import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Logomark } from "./Logomark-BWOODGU3.mjs";
import { H as Mail, ot as Eye, st as EyeOff, t as Zap, v as Shield } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthShell-BS4W0Ajv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEATURES = [
	{
		icon: Mail,
		text: "Sync every employee's Gmail in minutes"
	},
	{
		icon: Shield,
		text: "Domain verification & DKIM/SPF managed for you"
	},
	{
		icon: Zap,
		text: "Real-time email analytics across your whole team"
	}
];
var PLATFORM_ASSURANCE = {
	headline: "Enterprise-Grade Reliability & Security",
	statement: "Automated SPF, DKIM & DMARC alignment guarantees sub-second inbox delivery directly through your custom domain with 99.99% uptime.",
	certifications: [
		"TLS 1.3 Encryption",
		"Zero Google Workspace Markup",
		"Always Free Tier"
	]
};
function AuthPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "auth-panel relative hidden lg:flex flex-col justify-between overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-cover bg-center",
				style: { backgroundImage: "url('/auth-panel.png')" },
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				style: { background: "linear-gradient(160deg, rgba(10,10,20,0.55) 0%, rgba(10,10,20,0.85) 100%)" },
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex flex-col justify-between h-full p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-6 w-6 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-[15px] font-semibold text-white tracking-tight",
							children: "Mailcoy"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-3xl font-bold text-white leading-tight",
							children: [
								"Professional email,",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"built for modern teams."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[14px] text-white/60 max-w-xs leading-relaxed",
							children: "One platform to route, authenticate and manage your custom domain email with existing Gmail inboxes."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3",
							children: FEATURES.map(({ icon: Icon, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 backdrop-blur-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-white" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[13px] text-white/80",
									children: text
								})]
							}, text))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[12.5px] font-bold text-white tracking-tight",
									children: PLATFORM_ASSURANCE.headline
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-white/80 leading-relaxed",
								children: PLATFORM_ASSURANCE.statement
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-1 flex flex-wrap items-center gap-2",
								children: PLATFORM_ASSURANCE.certifications.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-white/90 border border-white/15",
									children: tag
								}, tag))
							})
						]
					})
				]
			})
		]
	});
}
function AuthShell({ title, subtitle, children, footer, showPanel = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "auth-layout min-h-screen bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `min-h-screen grid ${showPanel ? "lg:grid-cols-[1fr_1fr]" : ""}`,
			children: [showPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col relative overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "flex items-center justify-between px-6 py-4 border-b border-line lg:border-none sticky top-0 bg-background/80 backdrop-blur-md z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-5 w-5" }), "Mailcoy"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex flex-1 items-center justify-center px-6 py-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-[400px] animate-fadeInUp",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-[26px] font-bold tracking-tight",
										children: title
									}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-[14px] text-ink-3 leading-relaxed",
										children: subtitle
									})]
								}),
								children,
								footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-7 text-center text-[13px] text-ink-3",
									children: footer
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "px-6 py-4 text-center text-[11.5px] text-ink-3",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Mailcoy ·",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "hover:text-ink transition-colors",
								children: "Privacy"
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								className: "hover:text-ink transition-colors",
								children: "Terms"
							})
						]
					})
				]
			})]
		})
	});
}
function AuthField({ label, type, hint, ...props }) {
	const [visible, setVisible] = (0, import_react.useState)(false);
	const isPassword = type === "password";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-[13px] font-medium text-ink-2",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					...props,
					type: isPassword ? visible ? "text" : "password" : type,
					className: `w-full h-10 rounded-lg border border-line bg-surface px-3 text-[14px] outline-none
            placeholder:text-ink-3/60
            focus:border-primary focus:ring-2 focus:ring-primary/15
            disabled:opacity-50 transition-all
            ${isPassword ? "pr-10" : ""}
            ${props.className ?? ""}`
				}), isPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": visible ? "Hide password" : "Show password",
					onClick: () => setVisible((v) => !v),
					className: "absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-ink-3 transition hover:bg-surface-muted hover:text-ink",
					children: visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
				})]
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-[11.5px] text-ink-3",
				children: hint
			})
		]
	});
}
function PrimaryButton(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...props,
		className: `w-full h-10 rounded-lg bg-primary text-primary-foreground text-[14px] font-semibold
        hover:opacity-90 active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed
        transition-all shadow-sm
        ${props.className ?? ""}`
	});
}
//#endregion
export { AuthShell as n, PrimaryButton as r, AuthField as t };
