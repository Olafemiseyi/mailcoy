import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { At as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as MarketingPage } from "./MarketingPage-CIzb31Ej.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-BgolSid0.js
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "getting-started",
		t: "1. Quickstart & Account Setup",
		d: "Create your workspace, add your company profile, and open the dashboard.",
		steps: [
			"Sign up with your work email or personal Google account.",
			"Complete the 1-minute onboarding wizard by entering your company name and country.",
			"You'll arrive on the Mailcoy Dashboard with real-time setup metrics and checklist."
		]
	},
	{
		id: "domain",
		t: "2. Connect & Verify Your Domain",
		d: "Add TXT ownership records, MX mail routes, and configure SPF, DKIM, and DMARC.",
		steps: [
			"Navigate to Domains → Click 'Add Domain' (e.g. yourcompany.com).",
			"Copy the generated TXT ownership record into your registrar DNS (Namecheap, GoDaddy, or Cloudflare).",
			"Add the two MX routing records (mx1.mailcoy.com and mx2.mailcoy.com) with TTL set to 300s.",
			"Click 'Verify Domain' for instant DoH verification check."
		]
	},
	{
		id: "team",
		t: "3. Onboard Employees & Team Inboxes",
		d: "Add teammates, assign professional identities, and generate mobile QR codes.",
		steps: [
			"Go to Employees → Click 'Add Employee' or 'Bulk CSV Import'.",
			"Assign their business address (e.g. sales@yourcompany.com) and their personal Gmail.",
			"Employees can scan the 1-click QR code or click the invite link to connect their Gmail inbox in seconds."
		]
	},
	{
		id: "delivery",
		t: "4. Gmail Send-As Configuration",
		d: "How to send and reply from your custom domain directly inside standard Gmail.",
		steps: [
			"Open Gmail → Go to Settings → Accounts and Import → 'Add another email address'.",
			"Enter your business email address (e.g. john@yourcompany.com).",
			"Check your inbox for the 6-digit confirmation code and verify.",
			"When composing emails in Gmail, select your custom domain in the 'From' dropdown."
		]
	},
	{
		id: "bimi-logo",
		t: "5. $0 Startup Logo & BIMI Strategy",
		d: "Display your official company logo next to your emails in Gmail, Yahoo!, and Apple Mail.",
		steps: [
			"For Gmail: Set your company logo as the Google Account profile picture on your connected Gmail address.",
			"For Yahoo! & Fastmail: Add the free Self-Asserted BIMI record in your Domain settings with your hosted SVG logo URL.",
			"Deliverability Shield will verify logo readiness automatically."
		]
	}
];
function Docs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MarketingPage, {
		eyebrow: "Knowledge Base",
		title: "Mailcoy Documentation & Guides",
		lede: "Everything you need to configure custom domains, Gmail Send-As, and 99.9% deliverability in under 15 minutes.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2",
				children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `#${s.id}`,
					className: "p-5 rounded-2xl border border-line bg-surface hover:border-primary/40 hover:bg-surface transition shadow-xs flex flex-col justify-between group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-[16px] font-bold text-ink group-hover:text-primary transition-colors",
						children: s.t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-[13px] text-ink-3 leading-relaxed",
						children: s.d
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-4 text-[12px] font-semibold text-primary inline-flex items-center gap-1",
						children: "Read setup guide →"
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 space-y-8",
				children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					id: s.id,
					className: "scroll-mt-20 rounded-2xl border border-line bg-surface p-7 shadow-xs space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-mono uppercase tracking-wider text-ink-4",
							children: "Documentation Step"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[22px] font-bold tracking-tight text-ink mt-0.5",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[13.5px] text-ink-3",
							children: s.d
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-3 pt-2",
						children: s.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-[13.5px] text-ink-2 leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-6 w-6 rounded-full bg-primary/10 text-primary font-mono text-[12px] font-bold grid place-items-center shrink-0 mt-0.5",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
						}, step))
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 p-6 rounded-2xl border border-line bg-surface-muted/30 text-center space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-display font-bold text-ink text-[16px]",
						children: "Need Personal Assistance?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-ink-3 max-w-md mx-auto",
						children: "Our engineering team is happy to walk you through your DNS records over live chat."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contact",
						className: "inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline pt-1",
						children: ["Open Support Ticket ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				]
			})
		]
	});
}
//#endregion
export { Docs as component };
