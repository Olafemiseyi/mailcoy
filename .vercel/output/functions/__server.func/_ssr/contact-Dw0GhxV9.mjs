import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Send, H as Mail, b as ShieldAlert, vt as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as MarketingPage } from "./MarketingPage-CIzb31Ej.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-Dw0GhxV9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingPage, {
		eyebrow: "Direct Support",
		title: "Talk to our engineering team.",
		lede: "Questions about DNS setup, Google Workspace migration, or enterprise billing? We respond to every inquiry within 2 hours.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-line bg-surface p-6 shadow-xs",
				children: submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-12 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-12 w-12 text-emerald-600 mx-auto animate-bounce" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold text-ink",
							children: "Message Received!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13.5px] text-ink-3 max-w-sm mx-auto",
							children: "Our support team has received your ticket and will email you back shortly."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						setSubmitted(true);
					},
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-[13px] font-medium text-ink-2",
							children: ["Full name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "text",
								className: "h-10 rounded-xl border border-line bg-background px-3 text-[14px] text-ink outline-none focus:border-primary",
								placeholder: "Ada Obi"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-[13px] font-medium text-ink-2",
							children: ["Work email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								className: "h-10 rounded-xl border border-line bg-background px-3 text-[14px] text-ink outline-none focus:border-primary",
								placeholder: "ada@company.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-[13px] font-medium text-ink-2",
							children: ["Message & inquiry", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								required: true,
								rows: 5,
								className: "rounded-xl border border-line bg-background p-3 text-[14px] text-ink outline-none focus:border-primary leading-relaxed",
								placeholder: "Tell us about your custom domain, current team size, and what you'd like to set up..."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[13.5px] font-semibold text-primary-foreground shadow-xs hover:bg-primary-focus transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Send Direct Message"]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary font-semibold text-[14px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }), " General & Support"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13px] text-ink-3 leading-relaxed",
							children: [
								"For general inquiries, account setup, or help: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "mailto:hello@mailcoy.com",
									className: "font-mono text-ink font-semibold hover:text-primary underline",
									children: "hello@mailcoy.com"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-emerald-600 font-semibold text-[14px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }), " Enterprise & Sales"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13px] text-ink-3 leading-relaxed",
							children: [
								"Teams with 50+ members and custom billing: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "mailto:sales@mailcoy.com",
									className: "font-mono text-ink font-semibold hover:text-primary underline",
									children: "sales@mailcoy.com"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-emerald-600 font-semibold text-[14px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }), " Security & Privacy"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13px] text-ink-3 leading-relaxed",
							children: [
								"For compliance, legal inquiries, or security reports: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "mailto:security@mailcoy.com",
									className: "font-mono text-ink font-semibold hover:text-primary underline",
									children: "security@mailcoy.com"
								})
							]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { Contact as component };
