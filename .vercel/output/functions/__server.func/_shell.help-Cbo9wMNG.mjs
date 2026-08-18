import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { Ct as ChartColumn, E as Rocket, Et as Bot, F as PenLine, H as Mail, Ot as AtSign, T as ScrollText, Z as KeyRound, et as Inbox, mt as CreditCard, r as Users, rt as Globe, x as Settings, y as ShieldCheck } from "./_libs/lucide-react.mjs";
import { c as PageHeader, r as Card } from "./_ssr/AppShell-CbLCr2lg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.help-Cbo9wMNG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SECTIONS = [
	{
		id: "quickstart",
		icon: Rocket,
		title: "Quickstart Guide",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Follow these steps in order to set up your company's business email on ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mailcoy" }),
				" without confusion:"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "list-decimal list-inside space-y-1.5 text-ink-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Add your company domain in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Domains" }),
						" (e.g. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "yourcompany.com" }),
						")."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Copy the DNS records (TXT ownership and 2 MX routes) into your registrar and wait for instant green verification." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Add your employees under ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Employees" }),
						" so each team member gets a business address (e.g. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "sales@yourcompany.com" }),
						")."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Each employee connects their existing personal Gmail inbox with 1 click or QR code to send and receive directly in Gmail." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Configure optional catch-all routing, centralized company signatures, or invite team admins in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Settings" }),
						"."
					] })
				]
			})]
		})
	},
	{
		id: "domains",
		icon: Globe,
		title: "Domains & DNS",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Connecting your domain proves company ownership and unlocks custom business email addresses for your team." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "After adding a domain, Mailcoy generates 4 critical authentication records:" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc list-inside space-y-1 text-ink-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "MX Records:" }), " Route incoming customer emails to Mailcoy's high-speed delivery servers."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "SPF:" }), " Authorizes mail delivery and protects against email spoofing."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DKIM:" }), " Cryptographically signs every outgoing email so Gmail and Outlook trust your domain."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DMARC:" }), " Specifies anti-phishing policies to ensure 99%+ primary inbox placement."] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Copy each record into Namecheap, GoDaddy, or Cloudflare, then click ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Verify Domain" }),
					"."
				] })
			]
		})
	},
	{
		id: "employees",
		icon: Users,
		title: "Employee Inboxes",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Employees are your team members who send and receive professional email under your domain." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Click on any employee to review their connection health, alias routing, total sent/received stats, and delivery history." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Status Breakdown:" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc list-inside space-y-1 text-ink-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-amber-600 font-semibold",
							children: "Pending:"
						}), " Employee invite sent, awaiting Gmail connection."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-600 font-semibold",
							children: "Connected:"
						}), " Gmail linked and actively sending/receiving."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-red-600 font-semibold",
							children: "Suspended:"
						}), " 1-Click offboarding shield active; employee cannot access company routing."] })
					]
				})
			]
		})
	},
	{
		id: "gmail",
		icon: Mail,
		title: "Gmail Integration",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mailcoy links an employee's existing Gmail mailbox to their custom business email. No new app or password to remember." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "How it works:" }),
				" Inbound emails sent to ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "name@yourcompany.com" }),
				" land immediately in their Gmail inbox. Replies sent from Gmail go out with the business address and verified DKIM signature."
			] })]
		})
	},
	{
		id: "aliases",
		icon: AtSign,
		title: "Aliases & Department Routing",
		body: "Create shared team addresses like sales@, support@, or billing@. Route each alias to one or multiple employees simultaneously with round-robin or fan-out distribution."
	},
	{
		id: "signatures",
		icon: PenLine,
		title: "Company Signatures",
		body: "Deploy a consistent, branded email signature template across your entire company. Smart merge tags ({name}, {title}, {phone}, {company}) populate dynamically per employee."
	},
	{
		id: "catch-all",
		icon: Inbox,
		title: "Catch-All Routing",
		body: "Capture emails sent to misspelled or unassigned addresses on your domain (e.g. info@, help@). Forward them to a designated manager inbox so you never miss an inquiry."
	},
	{
		id: "analytics",
		icon: ChartColumn,
		title: "Analytics & Health",
		body: "Track live outbound/inbound email volume, deliverability rates, and DNSBL spam blacklist health across 7-day and 30-day windows in real time."
	},
	{
		id: "logs",
		icon: ScrollText,
		title: "Email Logs",
		body: "Searchable delivery audit log showing direction, recipient, timestamp, and real-time delivery status for full organizational compliance."
	},
	{
		id: "api-keys",
		icon: KeyRound,
		title: "API & Developers",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "API keys allow your CRM, website, or backend services to programmatically send transactional emails or query domain health." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Generate keys in ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Settings → API & Developers" }),
				". Keep your API key private in your server environment variables."
			] })]
		})
	},
	{
		id: "billing",
		icon: CreditCard,
		title: "Billing & Plans",
		body: "Manage your subscription, upgrade employee seat tiers, switch between NGN (₦) and USD ($), download receipts, and update payment cards powered securely by Paystack."
	},
	{
		id: "security",
		icon: ShieldCheck,
		title: "Security & Encryption",
		body: "All Gmail connections use OAuth 2.0 with AES-256 token encryption at rest. Inbound and outbound transmission is secured with TLS 1.3 encryption. We never access your private email credentials."
	},
	{
		id: "settings",
		icon: Settings,
		title: "Workspace & Team Admins",
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Customize your workspace name, default timezone, and upload your official company logo." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Invite co-founders, IT administrators, or managers under ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Settings → Team Admins & Members" }),
				" to grant dashboard management access."
			] })]
		})
	}
];
function DocsRoute() {
	const [active, setActive] = (0, import_react.useState)(SECTIONS[0].id);
	(0, import_react.useEffect)(() => {
		const fromHash = () => {
			const id = window.location.hash.replace("#", "");
			if (id) setActive(id);
		};
		fromHash();
		window.addEventListener("hashchange", fromHash);
		const obs = new IntersectionObserver((entries) => {
			const visible = entries.find((entry) => entry.isIntersecting);
			if (visible?.target.id) setActive(visible.target.id);
		}, {
			rootMargin: "-20% 0px -65% 0px",
			threshold: .01
		});
		SECTIONS.forEach((s) => {
			const el = document.getElementById(s.id);
			if (el) obs.observe(el);
		});
		return () => {
			window.removeEventListener("hashchange", fromHash);
			obs.disconnect();
		};
	}, []);
	const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Documentation",
			subtitle: "Everything you need to run your team's email on Mailcoy."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:hidden mb-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: active,
				onChange: (e) => {
					setActive(e.target.value);
					window.location.hash = e.target.value;
				},
				className: "w-full h-10 rounded-md border border-line bg-background px-3 text-[13.5px]",
				children: SECTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: s.id,
					children: s.title
				}, s.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden lg:block sticky top-14 z-10 -mx-6 px-6 py-3 mb-6 bg-background/85 backdrop-blur border-b border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: SECTIONS.map(({ id, icon: Icon, title }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `#${id}`,
					onClick: () => setActive(id),
					className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] transition border ${active === id ? "bg-primary text-primary-foreground border-primary" : "bg-surface text-ink-2 border-line hover:bg-ink/[0.04] hover:text-ink"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
						" ",
						title
					]
				}, id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto space-y-10 min-w-0",
			children: [
				SECTIONS.map(({ id, icon: Icon, title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id,
					className: "scroll-mt-[220px] lg:scroll-mt-[180px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-9 w-9 rounded-lg bg-ink/[0.04] grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5 text-ink-2" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-[19px] font-semibold tracking-tight",
								children: title
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[14px] text-ink-2 leading-relaxed space-y-2.5",
							children: typeof body === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: body }) : body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 border-b border-line" })
					]
				}, id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-transparent space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-emerald-600 font-semibold text-[15px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Need Instant Help or Account Diagnostics?" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13.5px] text-ink-3 leading-relaxed",
							children: [
								"Click the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "AI Support button" }),
								" in the bottom right corner of your screen anytime to ask technical questions, debug DNS verification, or calculate pricing in real time."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-line text-[12.5px] text-ink-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Prefer human assistance? Email ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "underline font-mono text-ink font-medium hover:text-primary",
								href: "mailto:support@mailcoy.com",
								children: "support@mailcoy.com"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-ink-4",
								children: "Response time: ~2 hours"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-ink-4 text-center",
					children: ["Currently reading: ", activeSection.title]
				})
			]
		})
	] });
}
//#endregion
export { DocsRoute as component };
