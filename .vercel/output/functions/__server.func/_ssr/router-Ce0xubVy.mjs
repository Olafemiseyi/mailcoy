import { o as __toESM } from "../_runtime.mjs";
import { M as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as AppShell } from "./AppShell-B0jIXsQK.mjs";
import { t as GlobalError } from "./GlobalError-BL7NpUyC.mjs";
import { n as empOpts, t as aliasesOpts } from "../_shell.aliases-CW5YagI5.mjs";
import { t as analyticsOpts } from "../_shell.analytics-BByr8XuO.mjs";
import { t as settingsOpts } from "../_shell.catch-all-S05-kNLP.mjs";
import { t as dashOpts } from "../_shell.dashboard-DULoxDkM.mjs";
import { t as opts } from "../_shell.domains-uk6M_T8o.mjs";
import { i as Skeleton, n as EmployeesSkeleton, r as GmailSkeleton, t as DashboardSkeleton } from "./Skeleton-_cvfJ6Br.mjs";
import { t as Route$48 } from "../_shell.domains._id-BOzl0tJL.mjs";
import { n as empOpts$1, t as domOpts } from "../_shell.employees-BThKtYuD.mjs";
import { t as Route$49 } from "../_shell.employees._id-YisP_C6h.mjs";
import { r as empOpts$2, t as cfgOpts } from "../_shell.gmail-B1SlW0j6.mjs";
import { t as opts$1 } from "../_shell.settings.api-keys-CnfOryl3.mjs";
import { r as sesOpts } from "../_shell.settings.aws-CBSS0acj.mjs";
import { t as billingOpts } from "../_shell.settings.billing-DKS3mM4R.mjs";
import { t as opts$2 } from "../_shell.settings.index-1Je_NmEH.mjs";
import { t as opts$3 } from "../_shell.settings.members-VluvFdBZ.mjs";
import { t as opts$4 } from "../_shell.settings.webhooks-j-WgLsPZ.mjs";
import { n as opts$5 } from "../_shell.signatures-CSDwlGJB.mjs";
import { r as getPlatformAdminStatus } from "./admin.functions-CvrArqa1.mjs";
import { t as opts$6 } from "./admin-COyITX3s.mjs";
import { t as Route$50 } from "./invite._token-CgbQRZoM.mjs";
import { t as Route$51 } from "./mock-google-auth-RDFNIlH9.mjs";
import { t as opts$7 } from "./organizations-DS71nUkS.mjs";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Ce0xubVy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-S0_Nfhue.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
var Route$47 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Mailcoy — Business Email via Gmail" },
			{
				name: "description",
				content: "Mailcoy: Professional business email on your domain while your team keeps using Gmail."
			},
			{
				name: "author",
				content: "Mailcoy"
			},
			{
				property: "og:title",
				content: "Mailcoy — Business Email via Gmail"
			},
			{
				property: "og:description",
				content: "Professional business email on your domain while your team keeps using Gmail."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "alternate icon",
				href: "/favicon.ico"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: GlobalError
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$47.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		let mounted = true;
		import("./client-eqRSUGdj.mjs").then((n) => n.t).then((n) => n.t).then(({ supabase }) => {
			if (!mounted) return;
			const { data: sub } = supabase.auth.onAuthStateChange((event) => {
				if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
				router.invalidate();
				if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
			});
			window.__authSub = sub.subscription;
		});
		return () => {
			mounted = false;
			window.__authSub?.unsubscribe();
		};
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$39 = () => import("./terms-CyAT6XUN.mjs");
var Route$46 = createFileRoute("/terms")({
	head: () => ({ meta: [
		{ title: "Terms of Service — Mailcoy" },
		{
			name: "description",
			content: "Terms and conditions governing the use of Mailcoy business email routing platform."
		},
		{
			property: "og:title",
			content: "Terms of Service — Mailcoy"
		},
		{
			property: "og:description",
			content: "Understand your rights, responsibilities, and service commitments when using Mailcoy."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./status-CYZAbZGd.mjs");
var Route$45 = createFileRoute("/status")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "System Status & Network Diagnostics — Mailcoy" },
		{
			name: "description",
			content: "Real-time operational status, live latency diagnostics, edge node health, and 90-day uptime history for Mailcoy services."
		},
		{
			property: "og:title",
			content: "System Status & Network Diagnostics — Mailcoy"
		},
		{
			property: "og:description",
			content: "Real-time service health, latency diagnostics, and 90-day uptime history."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./privacy-BgAmX9Nl.mjs");
var Route$44 = createFileRoute("/privacy")({
	head: () => ({ meta: [
		{ title: "Privacy Policy — Mailcoy" },
		{
			name: "description",
			content: "Learn how Mailcoy collects, uses, and protects your personal and workspace data."
		},
		{
			property: "og:title",
			content: "Privacy Policy — Mailcoy"
		},
		{
			property: "og:description",
			content: "How we safeguard organization identities, domain records, and Gmail access."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./pricing-DP_r_kNh.mjs");
var Route$43 = createFileRoute("/pricing")({
	head: () => ({ meta: [
		{ title: "Pricing & ROI — Mailcoy" },
		{
			name: "description",
			content: "Simple monthly pricing for teams of any size. Save 80%+ vs Google Workspace."
		},
		{
			property: "og:title",
			content: "Pricing — Mailcoy"
		},
		{
			property: "og:description",
			content: "Simple monthly pricing for teams of any size."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./docs-DbnzeNLo.mjs");
var Route$42 = createFileRoute("/docs")({
	head: () => ({ meta: [
		{ title: "Documentation & Setup Guides — Mailcoy" },
		{
			name: "description",
			content: "Step-by-step guides for connecting your domain, configuring SPF/DKIM, and routing mail through Mailcoy."
		},
		{
			property: "og:title",
			content: "Documentation — Mailcoy"
		},
		{
			property: "og:description",
			content: "Everything you need to set up Mailcoy."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./contact-CHLAuJDk.mjs");
var Route$41 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact & Support — Mailcoy" },
		{
			name: "description",
			content: "Get in touch with the Mailcoy executive and engineering team."
		},
		{
			property: "og:title",
			content: "Contact — Mailcoy"
		},
		{
			property: "og:description",
			content: "Get in touch with the Mailcoy team."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./about-DLnC0VVD.mjs");
var Route$40 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About Us — Mailcoy" },
		{
			name: "description",
			content: "We believe business email should be as effortless as Gmail. That's why we built Mailcoy."
		},
		{
			property: "og:title",
			content: "About — Mailcoy"
		},
		{
			property: "og:description",
			content: "Business email that respects your team's existing workflow."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./route-Cy8p_7Z5.mjs");
var Route$39 = createFileRoute("/admin")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		if (location.pathname === "/admin/login") return;
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/admin/login" });
		try {
			if (!(await getPlatformAdminStatus()).isPlatformAdmin) throw redirect({ to: "/admin/login" });
		} catch (e) {
			if (e && typeof e === "object" && "to" in e) throw e;
			throw redirect({ to: "/admin/login" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./route-Di7iQBCH.mjs");
var Route$38 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		return { user: {
			id: "mock-user-123",
			email: "demo@mailcoy.com"
		} };
	},
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./routes-DjW2IVK4.mjs");
var Route$37 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Mailcoy — Professional business email on your domain via Gmail" },
		{
			name: "description",
			content: "Mailcoy gives your team professional business email on your domain — while they keep using the Gmail they already know."
		},
		{
			property: "og:title",
			content: "Mailcoy — Business Email via Gmail"
		},
		{
			property: "og:description",
			content: "Your company's email identity. Your team's Gmail workflow."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./admin-DWaYh2W1.mjs");
var $$splitErrorComponentImporter$5 = () => import("./admin-CEx1Ep13.mjs");
var Route$36 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Admin overview — Mailcoy" }, {
		name: "robots",
		content: "noindex"
	}] }),
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(opts$6);
	},
	pendingMs: 0,
	pendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-64 rounded bg-ink/[0.06] animate-pulse" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [...Array(3)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 rounded-lg bg-ink/[0.04] animate-pulse" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-4",
				children: [...Array(4)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 rounded-lg bg-ink/[0.04] animate-pulse" }, i))
			})
		]
	}),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$5, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./verify-DPXCZtVX.mjs");
var Route$35 = createFileRoute("/auth/verify")({
	ssr: false,
	head: () => ({ meta: [{ title: "Verifying email — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./signup-Blszuca8.mjs");
var Route$34 = createFileRoute("/auth/signup")({
	head: () => ({ meta: [{ title: "Create account — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./reset-password-OzaTZdA2.mjs");
var Route$33 = createFileRoute("/auth/reset-password")({
	ssr: false,
	head: () => ({ meta: [{ title: "Set new password — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./login-DfJiv2nd.mjs");
var Route$32 = createFileRoute("/auth/login")({
	head: () => ({ meta: [{ title: "Sign in — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./forgot-password-BT9TuQQj.mjs");
var Route$31 = createFileRoute("/auth/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var REGISTRAR_PATTERNS = [
	{
		id: "namecheap",
		name: "Namecheap",
		match: /namecheap|registrar-servers/i,
		helpUrl: "https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/",
		steps: [
			"Log in to Namecheap and go to Domain List",
			"Click Manage next to your domain",
			"Click the Advanced DNS tab",
			"Add the TXT, MX, and SPF records generated by Mailcoy",
			"Click the green checkmark to save"
		]
	},
	{
		id: "cloudflare",
		name: "Cloudflare",
		match: /cloudflare/i,
		helpUrl: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/",
		steps: [
			"Log in to Cloudflare Dashboard at dash.cloudflare.com",
			"Select your domain from the list",
			"Click DNS → Records",
			"Add each DNS record with Proxy set to 'DNS Only' (Grey Cloud)",
			"Save each record — takes effect instantly"
		]
	},
	{
		id: "godaddy",
		name: "GoDaddy",
		match: /godaddy|domaincontrol/i,
		helpUrl: "https://www.godaddy.com/help/add-a-txt-record-19232",
		steps: [
			"Log in to your GoDaddy account",
			"Go to My Products → Domains → DNS",
			"Click Add in the DNS Records section",
			"Add the TXT, MX, and SPF records",
			"Click Save to apply changes"
		]
	},
	{
		id: "hostinger",
		name: "Hostinger",
		match: /hostinger/i,
		helpUrl: "https://support.hostinger.com/en/articles/1583246",
		steps: [
			"Log in to hPanel at hpanel.hostinger.com",
			"Go to Domains → DNS / Nameservers",
			"Click Manage DNS Records → Add Record",
			"Enter the records and click Add"
		]
	},
	{
		id: "porkbun",
		name: "Porkbun",
		match: /porkbun/i,
		helpUrl: "https://kb.porkbun.com/article/68-how-to-edit-domain-dns-records",
		steps: [
			"Log in to Porkbun and go to Domain Management",
			"Click Details next to your domain, then click Edit DNS Records",
			"Add the TXT and MX records",
			"Submit changes"
		]
	},
	{
		id: "google",
		name: "Google Domains / Squarespace",
		match: /google|squarespace/i,
		helpUrl: "https://support.squarespace.com/hc/en-us/articles/205812348",
		steps: [
			"Log in to your Domains dashboard",
			"Navigate to DNS Settings → Custom Records",
			"Add each record and click Save"
		]
	}
];
async function lookupRdap(domain) {
	const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");
	const fallbackResult = {
		domain: cleanDomain,
		isRegistered: false,
		registrar: null,
		registrarId: null,
		nameservers: [],
		expiresAt: null,
		createdAt: null,
		status: []
	};
	if (!cleanDomain || !cleanDomain.includes(".")) return fallbackResult;
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 4e3);
		const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(cleanDomain)}`, {
			headers: { Accept: "application/rdap+json, application/json" },
			signal: controller.signal
		});
		clearTimeout(timeout);
		if (res.status === 404) return {
			...fallbackResult,
			isRegistered: false
		};
		if (!res.ok) return fallbackResult;
		const data = await res.json();
		let registrarName = null;
		if (Array.isArray(data.entities)) {
			const registrarEntity = data.entities.find((e) => Array.isArray(e.roles) && (e.roles.includes("registrar") || e.roles.includes("sponsor")));
			if (registrarEntity) {
				if (registrarEntity.vcardArray && Array.isArray(registrarEntity.vcardArray[1])) {
					const fn = registrarEntity.vcardArray[1].find((prop) => prop[0] === "fn");
					if (fn && fn[3]) registrarName = String(fn[3]);
				}
				if (!registrarName && registrarEntity.handle) registrarName = String(registrarEntity.handle);
			}
		}
		const nameservers = [];
		if (Array.isArray(data.nameservers)) {
			for (const ns of data.nameservers) if (ns.ldhName) nameservers.push(String(ns.ldhName).toLowerCase());
		}
		let expiresAt = null;
		let createdAt = null;
		if (Array.isArray(data.events)) for (const ev of data.events) {
			if (ev.eventAction === "expiration" && ev.eventDate) expiresAt = ev.eventDate;
			if (ev.eventAction === "registration" && ev.eventDate) createdAt = ev.eventDate;
		}
		let registrarId = null;
		const combinedSearch = `${registrarName || ""} ${nameservers.join(" ")}`;
		for (const pattern of REGISTRAR_PATTERNS) if (pattern.match.test(combinedSearch)) {
			registrarId = pattern.id;
			if (!registrarName) registrarName = pattern.name;
			break;
		}
		return {
			domain: cleanDomain,
			isRegistered: true,
			registrar: registrarName,
			registrarId,
			nameservers,
			expiresAt,
			createdAt,
			status: Array.isArray(data.status) ? data.status : []
		};
	} catch (err) {
		console.warn(`RDAP lookup failed for ${cleanDomain}:`, err);
		return fallbackResult;
	}
}
var REGISTRAR_MAP = [
	{
		id: "cloudflare",
		name: "Cloudflare",
		logo: "https://cdn.brandfetch.io/idXBxQqmFb/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
		patterns: [/\.cloudflare\.com$/, /ns\d+\.cloudflare\.com$/],
		helpUrl: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/",
		steps: [
			"Log in to Cloudflare Dashboard at dash.cloudflare.com",
			"Select your domain from the list",
			"Click DNS → Records",
			"Click Add record for each entry in the table below",
			"Set Proxy to 'DNS Only' (Grey Cloud) for MX and verification records",
			"Save each record — changes take effect within seconds"
		]
	},
	{
		id: "godaddy",
		name: "GoDaddy",
		logo: "https://cdn.brandfetch.io/idXYJoFMN4/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
		patterns: [/domaincontrol\.com$/, /ns\d+\.domaincontrol\.com$/],
		helpUrl: "https://www.godaddy.com/help/add-a-txt-record-19232",
		steps: [
			"Log in to your GoDaddy account",
			"Go to My Products → DNS → Manage Zones",
			"Select your domain",
			"Click Add in the DNS Records section",
			"Fill in the Type, Name, and Value fields for each record below",
			"Click Save — DNS propagation may take up to 48 hours"
		]
	},
	{
		id: "namecheap",
		name: "Namecheap",
		logo: "https://cdn.brandfetch.io/idZqGOLHxY/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
		patterns: [/registrar-servers\.com$/, /dns\d+\.registrar-servers\.com$/],
		helpUrl: "https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/",
		steps: [
			"Log in to Namecheap and go to Domain List",
			"Click Manage next to your domain",
			"Click the Advanced DNS tab",
			"Click Add New Record for each entry below",
			"Set the Host (use @ for the root) and Value fields",
			"Click the green checkmark to save each record"
		]
	},
	{
		id: "route53",
		name: "AWS Route 53",
		logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Amazon_Route_53_logo.svg",
		patterns: [/awsdns-\d+\.(com|net|org|co\.uk)$/, /\.awsdns-/],
		helpUrl: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/rrsets-working-with.html",
		steps: [
			"Open AWS Console → Route 53 → Hosted Zones",
			"Select the hosted zone for your domain",
			"Click Create record for each entry below",
			"Set the record type, Name (subdomain), and Value",
			"Click Create records — changes propagate within 60 seconds"
		]
	},
	{
		id: "hostinger",
		name: "Hostinger",
		logo: "https://cdn.brandfetch.io/id4Lom5kub/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
		patterns: [/hostinger\.(com|ro)$/, /ns\d+\.hostinger\.(com|ro)$/],
		helpUrl: "https://support.hostinger.com/en/articles/1583246",
		steps: [
			"Log in to hPanel at hpanel.hostinger.com",
			"Go to Domains → Manage → DNS / Nameservers",
			"Click Manage DNS Records → Add Record",
			"Select type, enter Name and Value for each record below",
			"Click Add to save — propagation takes 1–24 hours"
		]
	},
	{
		id: "porkbun",
		name: "Porkbun",
		logo: "https://cdn.brandfetch.io/idZqGOLHxY/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
		patterns: [/porkbun\.com$/, /ns\d+\.porkbun\.com$/],
		helpUrl: "https://kb.porkbun.com/article/68-how-to-edit-domain-dns-records",
		steps: [
			"Log in to Porkbun and go to Domain Management",
			"Click Details next to your domain, then click Edit DNS Records",
			"Add the TXT, MX, and SPF records",
			"Submit changes"
		]
	}
];
function detectRegistrar(nsRecords, registrarName) {
	const combined = `${registrarName || ""} ${nsRecords.join(" ")}`.toLowerCase();
	for (const reg of REGISTRAR_MAP) if (reg.patterns.some((p) => p.test(combined)) || combined.includes(reg.id)) return reg;
	return null;
}
var Route$30 = createFileRoute("/api/registrar-detect")({ server: { handlers: { GET: async ({ request }) => {
	const domain = new URL(request.url).searchParams.get("domain")?.trim().toLowerCase();
	if (!domain) return Response.json({ error: "Missing domain parameter" }, { status: 400 });
	async function queryDoh(dohUrl) {
		try {
			const res = await fetch(dohUrl, { headers: { accept: "application/dns-json" } });
			if (!res.ok) return null;
			const json = await res.json();
			if (json.Status !== 0 || !json.Answer?.length) return [];
			return json.Answer.map((r) => r.data.toLowerCase().replace(/\.$/, ""));
		} catch {
			return null;
		}
	}
	const encoded = encodeURIComponent(domain);
	const [dohRes, rdapRes] = await Promise.allSettled([queryDoh(`https://dns.google/resolve?name=${encoded}&type=NS`), lookupRdap(domain)]);
	const nsRecords = dohRes.status === "fulfilled" && dohRes.value ? dohRes.value : [];
	const rdap = rdapRes.status === "fulfilled" ? rdapRes.value : null;
	const allNameservers = Array.from(/* @__PURE__ */ new Set([...nsRecords, ...rdap?.nameservers || []]));
	const registrar = detectRegistrar(allNameservers, rdap?.registrar);
	return Response.json({
		domain,
		isRegistered: rdap ? rdap.isRegistered : allNameservers.length > 0,
		registrarName: rdap?.registrar || registrar?.name || null,
		registrar: registrar ? {
			id: registrar.id,
			name: registrar.name,
			logo: registrar.logo,
			helpUrl: registrar.helpUrl,
			steps: registrar.steps
		} : null,
		nameservers: allNameservers,
		expiresAt: rdap?.expiresAt || null,
		createdAt: rdap?.createdAt || null
	});
} } } });
async function queryDoh(url) {
	try {
		const res = await fetch(url, { headers: { accept: "application/dns-json" } });
		if (!res.ok) return null;
		const json = await res.json();
		if (json.Status !== 0 || !json.Answer?.length) return [];
		return json.Answer.map((r) => r.data);
	} catch {
		return null;
	}
}
var Route$29 = createFileRoute("/api/dns-resolve")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const name = url.searchParams.get("name")?.trim().toLowerCase();
	const type = url.searchParams.get("type")?.toUpperCase();
	if (!name || !type || ![
		"TXT",
		"MX",
		"A",
		"AAAA",
		"CNAME"
	].includes(type)) return Response.json({ error: "Invalid name or type" }, { status: 400 });
	const encoded = encodeURIComponent(name);
	const google = await queryDoh(`https://dns.google/resolve?name=${encoded}&type=${type}`);
	if (google !== null) return Response.json({ answers: google });
	const cf = await queryDoh(`https://cloudflare-dns.com/dns-query?name=${encoded}&type=${type}`);
	if (cf !== null) return Response.json({ answers: cf });
	return Response.json({
		answers: [],
		error: "All DoH resolvers failed"
	}, { status: 502 });
} } } });
var COMMON_ALIASES = [
	{
		address: "hello",
		label: "Hello / Welcome",
		reason: "First point of contact — great for inbound leads and general enquiries."
	},
	{
		address: "info",
		label: "Info",
		reason: "Standard address customers try first. Reduces missed messages."
	},
	{
		address: "support",
		label: "Support",
		reason: "Customers expect this for help requests. Boosts trust and response rates."
	},
	{
		address: "sales",
		label: "Sales",
		reason: "Routes sales enquiries to your team. Critical for revenue."
	},
	{
		address: "contact",
		label: "Contact",
		reason: "General contact alias — used widely on websites and business cards."
	},
	{
		address: "admin",
		label: "Admin",
		reason: "Internal and vendor communications often target admin@."
	},
	{
		address: "billing",
		label: "Billing",
		reason: "Finance and invoice queries — keep them separate from general mail."
	},
	{
		address: "careers",
		label: "Careers / HR",
		reason: "Recruiting and HR enquiries go here instead of an employee inbox."
	},
	{
		address: "press",
		label: "Press / Media",
		reason: "Journalists and media contacts expect a dedicated address."
	},
	{
		address: "noreply",
		label: "No-reply",
		reason: "Use for transactional system emails to set clear reply expectations."
	},
	{
		address: "newsletter",
		label: "Newsletter",
		reason: "Dedicate an address for outbound marketing campaigns."
	},
	{
		address: "legal",
		label: "Legal",
		reason: "Contracts, NDAs, and legal notices should go to a controlled mailbox."
	},
	{
		address: "partners",
		label: "Partners",
		reason: "Dedicated inbox for partnership and vendor discussions."
	},
	{
		address: "security",
		label: "Security",
		reason: "Responsible disclosure and security reports."
	},
	{
		address: "privacy",
		label: "Privacy / DPO",
		reason: "GDPR and privacy requests — legally required in many jurisdictions."
	}
];
var Route$28 = createFileRoute("/api/alias-suggestions")({ server: { handlers: { GET: async ({ request }) => {
	const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
	if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
	const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
	if (!url || !anonKey) return Response.json({ error: "Supabase not configured" }, { status: 500 });
	const supabase = createClient(url, anonKey, {
		global: { headers: { Authorization: `Bearer ${token}` } },
		auth: { persistSession: false }
	});
	const { data: { user }, error: userErr } = await supabase.auth.getUser();
	if (userErr || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const { data: membership } = await supabase.from("organization_members").select("organization_id").eq("user_id", user.id).maybeSingle();
	if (!membership) return Response.json({ suggestions: [] });
	const orgId = membership.organization_id;
	const [{ data: existingAliases }, { data: domains }, { data: employees }] = await Promise.all([
		supabase.from("aliases").select("address").eq("organization_id", orgId),
		supabase.from("domains").select("domain_name").eq("organization_id", orgId).eq("verification_status", "verified"),
		supabase.from("employees").select("id, full_name, professional_email, job_title, department, status").eq("organization_id", orgId).is("deleted_at", null).eq("status", "active")
	]);
	const existingLocal = new Set((existingAliases ?? []).map((a) => {
		return a.address.split("@")[0]?.toLowerCase() ?? "";
	}));
	const primaryDomain = (domains ?? [])[0]?.domain_name ?? null;
	const suggestions = COMMON_ALIASES.filter((alias) => !existingLocal.has(alias.address)).map((alias) => ({
		local_part: alias.address,
		label: alias.label,
		reason: alias.reason,
		suggested_address: primaryDomain ? `${alias.address}@${primaryDomain}` : null
	})).slice(0, 8);
	const empSuggestions = [];
	for (const emp of employees ?? []) {
		const name = emp.full_name ?? "";
		const email = emp.professional_email ?? "";
		const id = emp.id;
		if (!name || !primaryDomain) continue;
		if (!(existingAliases ?? []).some((a) => a.address !== email && (existingAliases ?? []).some((b) => b.address.includes(id)))) {
			const firstName = name.split(" ")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
			const lastName = name.split(" ").slice(-1)[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
			if (firstName && lastName && firstName !== lastName) {
				const shortAlias = `${firstName}.${lastName}`;
				if (!existingLocal.has(shortAlias)) empSuggestions.push({
					local_part: shortAlias,
					label: `${name} (Short address)`,
					reason: `Professional short-form alias for ${name} — easier to share on business cards.`,
					suggested_address: `${shortAlias}@${primaryDomain}`,
					employee_id: id
				});
			}
		}
	}
	return Response.json({
		suggestions,
		employee_suggestions: empSuggestions.slice(0, 4),
		primary_domain: primaryDomain
	});
} } } });
var $$splitComponentImporter$23 = () => import("./status-qrF8retH.mjs");
var Route$27 = createFileRoute("/admin/status")({
	head: () => ({ meta: [{ title: "System status — Admin — Mailcoy" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./promos-BrP-xSWm.mjs");
var Route$26 = createFileRoute("/admin/promos")({
	head: () => ({ meta: [{ title: "Promo Codes — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./organizations-DLdyT8yF.mjs");
var Route$25 = createFileRoute("/admin/organizations")({
	head: () => ({ meta: [{ title: "Organizations — Admin — Mailcoy" }, {
		name: "robots",
		content: "noindex"
	}] }),
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(opts$7("", "", 0));
	},
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./login-DHj0cr4n.mjs");
var Route$24 = createFileRoute("/admin/login")({
	ssr: false,
	head: () => ({ meta: [{ title: "Admin sign in — Mailcoy" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./onboarding-JWYl2wt7.mjs");
var Route$23 = createFileRoute("/_authenticated/onboarding")({
	ssr: false,
	head: () => ({ meta: [{ title: "Set up — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("../_shell-BqMm6w2M.mjs");
var $$splitErrorComponentImporter$4 = () => import("../_shell-38MnWRTk.mjs");
var Route$22 = createFileRoute("/_authenticated/_shell")({
	ssr: false,
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$4, "errorComponent"),
	pendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-1/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[300px] w-full rounded-xl" })]
	}) }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var PROBE_META = [
	{
		id: "database",
		name: "Database (Postgres)"
	},
	{
		id: "auth",
		name: "Authentication"
	},
	{
		id: "gmail_gateway",
		name: "Gmail connector gateway"
	},
	{
		id: "paystack",
		name: "Paystack (payments)"
	},
	{
		id: "api",
		name: "API"
	}
];
async function probeDatabase() {
	const started = Date.now();
	try {
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		const { error } = await supabaseAdmin.from("organizations").select("id", {
			head: true,
			count: "exact"
		}).limit(1);
		if (error) throw error;
		const latency = Date.now() - started;
		return {
			id: "database",
			name: "Database (Postgres)",
			status: latency < 3500 ? "operational" : "degraded",
			latency_ms: latency
		};
	} catch (e) {
		return {
			id: "database",
			name: "Database (Postgres)",
			status: "outage",
			latency_ms: Date.now() - started,
			message: e instanceof Error ? e.message : "Unavailable"
		};
	}
}
async function probeAuth() {
	const started = Date.now();
	try {
		const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/health`, { headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY } });
		const latency = Date.now() - started;
		if (!res.ok) return {
			id: "auth",
			name: "Authentication",
			status: "outage",
			latency_ms: latency,
			message: `HTTP ${res.status}`
		};
		return {
			id: "auth",
			name: "Authentication",
			status: latency < 3500 ? "operational" : "degraded",
			latency_ms: latency
		};
	} catch (e) {
		return {
			id: "auth",
			name: "Authentication",
			status: "outage",
			latency_ms: Date.now() - started,
			message: e instanceof Error ? e.message : "Unavailable"
		};
	}
}
async function probeGmailGateway() {
	const started = Date.now();
	try {
		const res = await fetch("https://connector-gateway.mailcoy.dev/", { method: "GET" });
		const latency = Date.now() - started;
		return {
			id: "gmail_gateway",
			name: "Gmail connector gateway",
			status: res.status >= 500 ? "outage" : latency < 3500 ? "operational" : "degraded",
			latency_ms: latency,
			message: res.status >= 500 ? `HTTP ${res.status}` : void 0
		};
	} catch (e) {
		return {
			id: "gmail_gateway",
			name: "Gmail connector gateway",
			status: "outage",
			latency_ms: Date.now() - started,
			message: e instanceof Error ? e.message : "Unavailable"
		};
	}
}
async function probePaystack() {
	const started = Date.now();
	try {
		const res = await fetch("https://api.paystack.co/", { method: "GET" });
		const latency = Date.now() - started;
		return {
			id: "paystack",
			name: "Paystack (payments)",
			status: res.status >= 500 ? "outage" : latency < 3500 ? "operational" : "degraded",
			latency_ms: latency
		};
	} catch (e) {
		return {
			id: "paystack",
			name: "Paystack (payments)",
			status: "outage",
			latency_ms: Date.now() - started,
			message: e instanceof Error ? e.message : "Unavailable"
		};
	}
}
function probeApi(localLatencyMs) {
	return {
		id: "api",
		name: "API",
		status: localLatencyMs < 2e3 ? "operational" : "degraded",
		latency_ms: Math.max(12, localLatencyMs)
	};
}
function overall(probes) {
	if (probes.some((p) => p.status === "outage")) return "outage";
	if (probes.some((p) => p.status === "degraded")) return "degraded";
	return "operational";
}
async function loadHistory() {
	const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
	const cutoff = /* @__PURE__ */ new Date();
	cutoff.setUTCDate(cutoff.getUTCDate() - 89);
	cutoff.setUTCHours(0, 0, 0, 0);
	const { data } = await supa.from("platform_status_checks").select("component, status, checked_at").gte("checked_at", cutoff.toISOString()).order("checked_at", { ascending: true }).limit(1e4);
	const grouped = {};
	for (const row of data ?? []) {
		const day = row.checked_at.slice(0, 10);
		const comp = row.component;
		if (!grouped[comp]) grouped[comp] = /* @__PURE__ */ new Map();
		const bucket = grouped[comp].get(day) ?? {
			total: 0,
			outages: 0,
			degraded: 0
		};
		bucket.total++;
		if (row.status === "outage") bucket.outages++;
		else if (row.status === "degraded") bucket.degraded++;
		grouped[comp].set(day, bucket);
	}
	const out = {};
	for (const meta of PROBE_META) {
		const series = [];
		for (let i = 89; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setUTCDate(d.getUTCDate() - i);
			d.setUTCHours(0, 0, 0, 0);
			const key = d.toISOString().slice(0, 10);
			const b = grouped[meta.id]?.get(key);
			let status = "operational";
			if (b) {
				if (b.outages > 0) status = "outage";
				else if (b.degraded > 0) status = "degraded";
			}
			series.push({
				day: key,
				status,
				total: b?.total ?? 0,
				outages: b?.outages ?? 0,
				degraded: b?.degraded ?? 0
			});
		}
		out[meta.id] = series;
	}
	return out;
}
async function recordProbes(probes) {
	try {
		await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } }).from("platform_status_checks").insert(probes.map((p) => ({
			component: p.id,
			status: p.status,
			latency_ms: p.latency_ms,
			detail: p.message ?? null
		})));
	} catch {}
}
var Route$21 = createFileRoute("/api/public/status")({ server: { handlers: { GET: async ({ request }) => {
	const wantHistory = new URL(request.url).searchParams.get("history") === "1";
	const apiStarted = Date.now();
	const [db, auth, gw, paystack] = await Promise.all([
		probeDatabase(),
		probeAuth(),
		probeGmailGateway(),
		probePaystack()
	]);
	const probes = [
		db,
		auth,
		gw,
		paystack,
		probeApi(Math.round((Date.now() - apiStarted) / 10))
	];
	await recordProbes(probes);
	const history = wantHistory ? await loadHistory() : void 0;
	const body = {
		status: overall(probes),
		checked_at: (/* @__PURE__ */ new Date()).toISOString(),
		probes,
		...history ? { history } : {}
	};
	return new Response(JSON.stringify(body), { headers: {
		"content-type": "application/json",
		"cache-control": "no-store"
	} });
} } } });
var $$splitComponentImporter$17 = () => import("../_shell.signatures-FcShnW9M.mjs");
var Route$20 = createFileRoute("/_authenticated/_shell/signatures")({
	head: () => ({ meta: [{ title: "Email Signatures — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(opts$5),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("../_shell.settings-xZEdZvWr.mjs");
var Route$19 = createFileRoute("/_authenticated/_shell/settings")({
	head: () => ({ meta: [{ title: "Settings — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("../_shell.logs-0bJlLg74.mjs");
var Route$18 = createFileRoute("/_authenticated/_shell/logs")({
	head: () => ({ meta: [{ title: "Email logs — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("../_shell.help-CKmlxM6J.mjs");
var Route$17 = createFileRoute("/_authenticated/_shell/help")({
	head: () => ({ meta: [{ title: "Help — Mailcoy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("../_shell.gmail-Cu24Fou4.mjs");
var $$splitErrorComponentImporter$3 = () => import("../_shell.gmail-DRcwGDz-.mjs");
var Route$16 = createFileRoute("/_authenticated/_shell/gmail")({
	head: () => ({ meta: [{ title: "Gmail — Mailcoy" }] }),
	loader: async ({ context }) => {
		await Promise.all([context.queryClient.ensureQueryData(empOpts$2), context.queryClient.ensureQueryData(cfgOpts)]);
	},
	pendingMs: 0,
	pendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GmailSkeleton, {}),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("../_shell.employees-BcltiJSK.mjs");
var $$splitErrorComponentImporter$2 = () => import("../_shell.employees-_UxFMmbs.mjs");
var Route$15 = createFileRoute("/_authenticated/_shell/employees")({
	head: () => ({ meta: [{ title: "Employees — Mailcoy" }] }),
	loader: async ({ context }) => {
		await Promise.all([context.queryClient.ensureQueryData(empOpts$1), context.queryClient.ensureQueryData(domOpts)]);
	},
	pendingMs: 0,
	pendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesSkeleton, {}),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("../_shell.domains-DiAc5ltZ.mjs");
var $$splitErrorComponentImporter$1 = () => import("../_shell.domains-iHyEedUO.mjs");
var Route$14 = createFileRoute("/_authenticated/_shell/domains")({
	head: () => ({ meta: [{ title: "Domains & DNS — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(opts),
	pendingMs: 0,
	pendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-start gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 w-full max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-32" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
			children: [...Array(4)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-line rounded-2xl p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-20" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-3/4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-1/2" })
				]
			}, i))
		})]
	}),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("../_shell.dashboard-C72djELM.mjs");
var $$splitErrorComponentImporter = () => import("../_shell.dashboard-CH_u7SNo.mjs");
var Route$13 = createFileRoute("/_authenticated/_shell/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(dashOpts),
	pendingMs: 0,
	pendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSkeleton, {}),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("../_shell.catch-all-BSbMRIz-.mjs");
var Route$12 = createFileRoute("/_authenticated/_shell/catch-all")({
	head: () => ({ meta: [{ title: "Catch-all & Shared Inboxes — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(settingsOpts),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("../_shell.analytics-TiQiiy1G.mjs");
var Route$11 = createFileRoute("/_authenticated/_shell/analytics")({
	head: () => ({ meta: [{ title: "Analytics — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(analyticsOpts("week")),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("../_shell.aliases-D88xclXU.mjs");
var Route$10 = createFileRoute("/_authenticated/_shell/aliases")({
	head: () => ({ meta: [{ title: "Aliases — Mailcoy" }] }),
	loader: async ({ context }) => {
		await Promise.all([context.queryClient.ensureQueryData(aliasesOpts), context.queryClient.ensureQueryData(empOpts)]);
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("../_shell.settings.index-C1ICOtxe.mjs");
var Route$9 = createFileRoute("/_authenticated/_shell/settings/")({
	loader: ({ context }) => context.queryClient.ensureQueryData(opts$2),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var Route$8 = createFileRoute("/api/public/webhooks/ses")({ server: { handlers: { POST: async ({ request }) => {
	const messageType = request.headers.get("x-amz-sns-message-type");
	if (!messageType) return new Response("Missing SNS headers", { status: 400 });
	const raw = await request.text();
	let payload;
	try {
		payload = JSON.parse(raw);
	} catch {
		return new Response("Bad JSON", { status: 400 });
	}
	if (payload.SubscribeURL && !payload.SubscribeURL.startsWith("https://sns.")) return new Response("Invalid SubscribeURL domain", { status: 403 });
	if (messageType === "SubscriptionConfirmation") {
		if (payload.SubscribeURL) try {
			const res = await fetch(payload.SubscribeURL);
			if (!res.ok) {
				console.error("[SES Webhook] Failed to confirm subscription", await res.text());
				return new Response("Failed to confirm", { status: 500 });
			}
			console.log("[SES Webhook] Subscription confirmed");
			return new Response("Confirmed", { status: 200 });
		} catch (err) {
			console.error("[SES Webhook] Error confirming subscription", err);
			return new Response("Error confirming", { status: 500 });
		}
		return new Response("No SubscribeURL provided", { status: 400 });
	}
	if (messageType === "Notification") {
		let sesEvent;
		try {
			sesEvent = JSON.parse(payload.Message);
		} catch {
			return new Response("Bad SES Message JSON", { status: 400 });
		}
		const notificationType = sesEvent.notificationType;
		if (!notificationType) return new Response("ok", { status: 200 });
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		const sesMessageId = sesEvent.mail?.messageId;
		if (!sesMessageId) {
			console.warn("[SES Webhook] No mail.messageId in payload");
			return new Response("ok", { status: 200 });
		}
		const { data: log, error: logError } = await supabaseAdmin.from("sending_logs").select("id, organization_id").eq("message_id", sesMessageId).maybeSingle();
		if (logError || !log) {
			console.warn(`[SES Webhook] Could not find sending_logs for message_id: ${sesMessageId}`);
			return new Response("ok", { status: 200 });
		}
		if (notificationType === "Bounce") {
			const bounce = sesEvent.bounce || {};
			const bounceType = bounce.bounceType;
			const bounceSubType = bounce.bounceSubType;
			const bouncedRecipients = bounce.bouncedRecipients || [];
			for (const recipient of bouncedRecipients) {
				const { error: insErr } = await supabaseAdmin.from("ses_bounce_events").insert({
					organization_id: log.organization_id,
					sending_log_id: log.id,
					bounce_type: bounceType,
					bounce_subtype: bounceSubType,
					recipient: recipient.emailAddress,
					raw: sesEvent
				});
				if (insErr) console.error("[SES Webhook] Bounce insert error:", insErr);
			}
			const { error: upErr } = await supabaseAdmin.from("sending_logs").update({
				status: "bounced",
				error: `${bounceType}: ${bounceSubType}`
			}).eq("id", log.id);
			if (upErr) console.error("[SES Webhook] sending_logs update error:", upErr);
		} else if (notificationType === "Complaint") {
			const complaint = sesEvent.complaint || {};
			const complaintType = complaint.complaintFeedbackType;
			const complainedRecipients = complaint.complainedRecipients || [];
			for (const recipient of complainedRecipients) {
				const { error: insErr } = await supabaseAdmin.from("ses_complaint_events").insert({
					organization_id: log.organization_id,
					sending_log_id: log.id,
					complaint_type: complaintType,
					recipient: recipient.emailAddress,
					raw: sesEvent
				});
				if (insErr) console.error("[SES Webhook] Complaint insert error:", insErr);
			}
			const { error: upErr } = await supabaseAdmin.from("sending_logs").update({
				status: "complained",
				error: `Complaint: ${complaintType}`
			}).eq("id", log.id);
			if (upErr) console.error("[SES Webhook] sending_logs update error:", upErr);
		} else if (notificationType === "Delivery") {
			const { error: upErr } = await supabaseAdmin.from("sending_logs").update({ status: "delivered" }).eq("id", log.id);
			if (upErr) console.error("[SES Webhook] sending_logs update error:", upErr);
		}
		return new Response("ok", { status: 200 });
	}
	return new Response("ok", { status: 200 });
} } } });
var Route$7 = createFileRoute("/api/public/webhooks/paystack")({ server: { handlers: { POST: async ({ request }) => {
	const secret = process.env.PAYSTACK_SECRET_KEY;
	if (!secret) return new Response("Server not configured", { status: 500 });
	const signature = request.headers.get("x-paystack-signature") ?? "";
	const raw = await request.text();
	const expected = createHmac("sha512", secret).update(raw).digest("hex");
	const a = Buffer.from(signature);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Invalid signature", { status: 401 });
	let event;
	try {
		event = JSON.parse(raw);
	} catch {
		return new Response("Bad JSON", { status: 400 });
	}
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const meta = event.data?.metadata ?? {};
	const orgId = meta.organization_id;
	const planCode = meta.plan_code ?? event.data?.plan?.plan_code ?? null;
	const reference = event.data?.reference ?? event.data?.subscription_code ?? event.data?.invoice_code ?? null;
	await supabaseAdmin.from("billing_events").insert({
		provider: "paystack",
		event_type: event.event,
		reference,
		payload: event,
		received_at: (/* @__PURE__ */ new Date()).toISOString(),
		organization_id: orgId ?? null,
		status: "received"
	});
	if (!orgId || !reference) return new Response("ok", { status: 200 });
	let status = null;
	switch (event.event) {
		case "charge.success":
		case "subscription.create":
			status = "active";
			break;
		case "invoice.payment_failed":
			status = "past_due";
			break;
		case "subscription.disable":
		case "subscription.not_renew":
			status = "canceled";
			break;
		default: status = null;
	}
	if (status) {
		const periodDays = meta.billing_interval === "yearly" ? 365 : 30;
		await supabaseAdmin.from("subscriptions").upsert({
			organization_id: orgId,
			provider: "paystack",
			provider_reference: reference,
			plan: planCode ?? "Paystack",
			plan_code: planCode,
			status,
			amount_kobo: event.data?.amount ?? null,
			current_period_end: status === "active" ? new Date(Date.now() + periodDays * 24 * 3600 * 1e3).toISOString() : null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "provider_reference" });
	}
	return new Response("ok", { status: 200 });
} } } });
var REQUIRED_MX = ["mx1.mailcoy.connect", "mx2.mailcoy.connect"];
async function doh(name, type) {
	try {
		const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, { headers: { accept: "application/dns-json" } });
		if (!res.ok) return [];
		const json = await res.json();
		if (json.Status !== 0 || !json.Answer) return [];
		return json.Answer.map((r) => {
			let s = r.data.trim();
			if (s.startsWith("\"") && s.endsWith("\"")) s = s.slice(1, -1);
			return s.replace(/"\s+"/g, "");
		});
	} catch {
		return [];
	}
}
var Route$6 = createFileRoute("/api/public/hooks/verify-domains")({ server: { handlers: { POST: async ({ request }) => {
	const key = request.headers.get("apikey") ?? "";
	const expected = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
	if (!expected || key !== expected) return new Response("Unauthorized", { status: 401 });
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: domains, error } = await supabaseAdmin.from("domains").select("id, domain_name, dkim_selector, txt_record_value, verified_at").in("verification_status", ["pending", "failed"]).limit(50);
	if (error) return new Response(error.message, { status: 500 });
	let processed = 0;
	for (const d of domains ?? []) {
		const name = d.domain_name;
		const selector = d.dkim_selector ?? "mailcoy";
		const expectedTxt = d.txt_record_value ?? "";
		const [txt, mx, dkim, dmarc] = await Promise.all([
			doh(name, "TXT"),
			doh(name, "MX"),
			doh(`${selector}._domainkey.${name}`, "TXT"),
			doh(`_dmarc.${name}`, "TXT")
		]);
		const txtOk = txt.some((r) => r.includes(expectedTxt));
		const mxOk = REQUIRED_MX.every((needle) => mx.some((r) => r.toLowerCase().includes(needle)));
		const spfOk = txt.some((r) => r.toLowerCase().startsWith("v=spf1") && r.toLowerCase().includes("_spf.mailcoy.connect"));
		const dkimOk = dkim.some((r) => r.toLowerCase().includes("v=dkim1"));
		const dmarcOk = dmarc.some((r) => r.toLowerCase().startsWith("v=dmarc1"));
		const verified = txtOk && mxOk;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await supabaseAdmin.from("domains").update({
			txt_status: txtOk ? "verified" : "failed",
			mx_status: mxOk ? "verified" : "failed",
			spf_status: spfOk ? "verified" : "failed",
			dkim_status: dkimOk ? "verified" : "failed",
			dmarc_status: dmarcOk ? "verified" : "failed",
			verification_status: verified ? "verified" : "failed",
			last_checked_at: now,
			verified_at: verified ? d.verified_at ?? now : d.verified_at
		}).eq("id", d.id);
		processed++;
	}
	return Response.json({
		ok: true,
		processed
	});
} } } });
var $$splitComponentImporter$5 = () => import("./auth.google.callback-owWYuwLh.mjs");
var Route$5 = createFileRoute("/api/auth/google/callback")({
	server: { handlers: { GET: async ({ request }) => {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const stateRaw = url.searchParams.get("state");
		const errorParam = url.searchParams.get("error");
		const redirectUri = `${url.origin}/api/auth/google/callback`;
		if (errorParam) return new Response(null, {
			status: 302,
			headers: { Location: buildInviteErrorUrl(stateRaw, "Google sign-in was denied.") }
		});
		if (!code || !stateRaw) return new Response(null, {
			status: 302,
			headers: { Location: buildInviteErrorUrl(stateRaw, "Invalid callback parameters.") }
		});
		let state;
		try {
			state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
			if (!state.token || !state.nonce) throw new Error("bad");
		} catch {
			return new Response("Invalid state parameter", { status: 400 });
		}
		try {
			const { exchangeGoogleCode } = await import("./googleOAuth.server-nkhxNtYg.mjs");
			const { refreshToken, email } = await exchangeGoogleCode(code, redirectUri);
			const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
			const { data: inv, error: invErr } = await supabaseAdmin.from("employee_invitations").select("id, employee_id, organization_id, revoked_at, expires_at, accepted_at").eq("token", state.token).maybeSingle();
			if (invErr || !inv) return new Response(null, {
				status: 302,
				headers: { Location: buildInviteErrorUrl(stateRaw, "Invite not found.") }
			});
			if (inv.revoked_at || new Date(inv.expires_at) < /* @__PURE__ */ new Date()) return new Response(null, {
				status: 302,
				headers: { Location: buildInviteErrorUrl(stateRaw, "Invite has expired or been revoked.") }
			});
			const { encryptConnectionKey } = await import("./connectionKeyCrypto-SELLRwlC.mjs");
			const encrypted = encryptConnectionKey(refreshToken);
			await supabaseAdmin.from("app_user_connections").upsert({
				user_id: inv.employee_id,
				connector_id: "google_mail",
				connection_key_ciphertext: encrypted,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "user_id,connector_id" });
			await supabaseAdmin.from("gmail_connections").upsert({
				organization_id: inv.organization_id,
				employee_id: inv.employee_id,
				google_email: email,
				connected_at: (/* @__PURE__ */ new Date()).toISOString(),
				health_status: "healthy",
				revoked_at: null
			}, { onConflict: "employee_id" });
			await supabaseAdmin.from("employees").update({
				status: "active",
				connected_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", inv.employee_id);
			await supabaseAdmin.from("employee_invitations").update({ accepted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", inv.id);
			try {
				const { data: empRow } = await supabaseAdmin.from("employees").select("professional_email, full_name").eq("id", inv.employee_id).maybeSingle();
				if (empRow?.professional_email) {
					const { addGmailSendAsAlias } = await import("./googleOAuth.server-nkhxNtYg.mjs");
					await addGmailSendAsAlias({
						refreshToken,
						sendAsEmail: empRow.professional_email,
						displayName: empRow.full_name ?? empRow.professional_email
					});
				}
			} catch (aliasErr) {
				console.warn("[SendAs] Could not register alias:", aliasErr instanceof Error ? aliasErr.message : aliasErr);
			}
			return new Response(null, {
				status: 302,
				headers: { Location: `/invite/${state.token}` }
			});
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Authentication failed";
			return new Response(null, {
				status: 302,
				headers: { Location: buildInviteErrorUrl(stateRaw, msg) }
			});
		}
	} } },
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
function buildInviteErrorUrl(stateRaw, msg) {
	if (!stateRaw) return `/?error=${encodeURIComponent(msg)}`;
	try {
		const token = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"))?.token ?? "";
		if (token) return `/invite/${token}?error=${encodeURIComponent(msg)}`;
	} catch {}
	return `/?error=${encodeURIComponent(msg)}`;
}
var $$splitComponentImporter$4 = () => import("../_shell.settings.webhooks-WecakPj-.mjs");
var Route$4 = createFileRoute("/_authenticated/_shell/settings/webhooks")({
	loader: ({ context }) => context.queryClient.ensureQueryData(opts$4),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("../_shell.settings.members-D7UKYsh9.mjs");
var Route$3 = createFileRoute("/_authenticated/_shell/settings/members")({
	head: () => ({ meta: [{ title: "Team Admins & Members — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(opts$3),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_shell.settings.billing-DyH3k32G.mjs");
var Route$2 = createFileRoute("/_authenticated/_shell/settings/billing")({
	head: () => ({ meta: [{ title: "Billing — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(billingOpts),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_shell.settings.aws-0UXwPVJ7.mjs");
var Route$1 = createFileRoute("/_authenticated/_shell/settings/aws")({
	head: () => ({ meta: [{ title: "Amazon SES — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(sesOpts),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_shell.settings.api-keys-Yo_KCdef.mjs");
var Route = createFileRoute("/_authenticated/_shell/settings/api-keys")({
	head: () => ({ meta: [{ title: "API & Developers — Mailcoy" }] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(opts$1),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var TermsRoute = Route$46.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$47
});
var StatusRoute = Route$45.update({
	id: "/status",
	path: "/status",
	getParentRoute: () => Route$47
});
var PrivacyRoute = Route$44.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$47
});
var PricingRoute = Route$43.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$47
});
var MockGoogleAuthRoute = Route$51.update({
	id: "/mock-google-auth",
	path: "/mock-google-auth",
	getParentRoute: () => Route$47
});
var DocsRoute = Route$42.update({
	id: "/docs",
	path: "/docs",
	getParentRoute: () => Route$47
});
var ContactRoute = Route$41.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$47
});
var AboutRoute = Route$40.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$47
});
var AdminRouteRoute = Route$39.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$47
});
var AuthenticatedRouteRoute = Route$38.update({
	id: "/_authenticated",
	getParentRoute: () => Route$47
});
var IndexRoute = Route$37.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$47
});
var AdminIndexRoute = Route$36.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRouteRoute
});
var InviteTokenRoute = Route$50.update({
	id: "/invite/$token",
	path: "/invite/$token",
	getParentRoute: () => Route$47
});
var AuthVerifyRoute = Route$35.update({
	id: "/auth/verify",
	path: "/auth/verify",
	getParentRoute: () => Route$47
});
var AuthSignupRoute = Route$34.update({
	id: "/auth/signup",
	path: "/auth/signup",
	getParentRoute: () => Route$47
});
var AuthResetPasswordRoute = Route$33.update({
	id: "/auth/reset-password",
	path: "/auth/reset-password",
	getParentRoute: () => Route$47
});
var AuthLoginRoute = Route$32.update({
	id: "/auth/login",
	path: "/auth/login",
	getParentRoute: () => Route$47
});
var AuthForgotPasswordRoute = Route$31.update({
	id: "/auth/forgot-password",
	path: "/auth/forgot-password",
	getParentRoute: () => Route$47
});
var ApiRegistrarDetectRoute = Route$30.update({
	id: "/api/registrar-detect",
	path: "/api/registrar-detect",
	getParentRoute: () => Route$47
});
var ApiDnsResolveRoute = Route$29.update({
	id: "/api/dns-resolve",
	path: "/api/dns-resolve",
	getParentRoute: () => Route$47
});
var ApiAliasSuggestionsRoute = Route$28.update({
	id: "/api/alias-suggestions",
	path: "/api/alias-suggestions",
	getParentRoute: () => Route$47
});
var AdminStatusRoute = Route$27.update({
	id: "/status",
	path: "/status",
	getParentRoute: () => AdminRouteRoute
});
var AdminPromosRoute = Route$26.update({
	id: "/promos",
	path: "/promos",
	getParentRoute: () => AdminRouteRoute
});
var AdminOrganizationsRoute = Route$25.update({
	id: "/organizations",
	path: "/organizations",
	getParentRoute: () => AdminRouteRoute
});
var AdminLoginRoute = Route$24.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRouteRoute
});
var AuthenticatedOnboardingRoute = Route$23.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedShellRoute = Route$22.update({
	id: "/_shell",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiPublicStatusRoute = Route$21.update({
	id: "/api/public/status",
	path: "/api/public/status",
	getParentRoute: () => Route$47
});
var AuthenticatedShellSignaturesRoute = Route$20.update({
	id: "/signatures",
	path: "/signatures",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellSettingsRoute = Route$19.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellLogsRoute = Route$18.update({
	id: "/logs",
	path: "/logs",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellHelpRoute = Route$17.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellGmailRoute = Route$16.update({
	id: "/gmail",
	path: "/gmail",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellEmployeesRoute = Route$15.update({
	id: "/employees",
	path: "/employees",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellDomainsRoute = Route$14.update({
	id: "/domains",
	path: "/domains",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellDashboardRoute = Route$13.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellCatchAllRoute = Route$12.update({
	id: "/catch-all",
	path: "/catch-all",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellAnalyticsRoute = Route$11.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellAliasesRoute = Route$10.update({
	id: "/aliases",
	path: "/aliases",
	getParentRoute: () => AuthenticatedShellRoute
});
var AuthenticatedShellSettingsIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedShellSettingsRoute
});
var ApiPublicWebhooksSesRoute = Route$8.update({
	id: "/api/public/webhooks/ses",
	path: "/api/public/webhooks/ses",
	getParentRoute: () => Route$47
});
var ApiPublicWebhooksPaystackRoute = Route$7.update({
	id: "/api/public/webhooks/paystack",
	path: "/api/public/webhooks/paystack",
	getParentRoute: () => Route$47
});
var ApiPublicHooksVerifyDomainsRoute = Route$6.update({
	id: "/api/public/hooks/verify-domains",
	path: "/api/public/hooks/verify-domains",
	getParentRoute: () => Route$47
});
var ApiAuthGoogleCallbackRoute = Route$5.update({
	id: "/api/auth/google/callback",
	path: "/api/auth/google/callback",
	getParentRoute: () => Route$47
});
var AuthenticatedShellSettingsWebhooksRoute = Route$4.update({
	id: "/webhooks",
	path: "/webhooks",
	getParentRoute: () => AuthenticatedShellSettingsRoute
});
var AuthenticatedShellSettingsMembersRoute = Route$3.update({
	id: "/members",
	path: "/members",
	getParentRoute: () => AuthenticatedShellSettingsRoute
});
var AuthenticatedShellSettingsBillingRoute = Route$2.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => AuthenticatedShellSettingsRoute
});
var AuthenticatedShellSettingsAwsRoute = Route$1.update({
	id: "/aws",
	path: "/aws",
	getParentRoute: () => AuthenticatedShellSettingsRoute
});
var AuthenticatedShellSettingsApiKeysRoute = Route.update({
	id: "/api-keys",
	path: "/api-keys",
	getParentRoute: () => AuthenticatedShellSettingsRoute
});
var AuthenticatedShellEmployeesIdRoute = Route$49.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedShellEmployeesRoute
});
var AuthenticatedShellDomainsRouteChildren = { AuthenticatedShellDomainsIdRoute: Route$48.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedShellDomainsRoute
}) };
var AuthenticatedShellDomainsRouteWithChildren = AuthenticatedShellDomainsRoute._addFileChildren(AuthenticatedShellDomainsRouteChildren);
var AuthenticatedShellEmployeesRouteChildren = { AuthenticatedShellEmployeesIdRoute };
var AuthenticatedShellEmployeesRouteWithChildren = AuthenticatedShellEmployeesRoute._addFileChildren(AuthenticatedShellEmployeesRouteChildren);
var AuthenticatedShellSettingsRouteChildren = {
	AuthenticatedShellSettingsApiKeysRoute,
	AuthenticatedShellSettingsAwsRoute,
	AuthenticatedShellSettingsBillingRoute,
	AuthenticatedShellSettingsMembersRoute,
	AuthenticatedShellSettingsWebhooksRoute,
	AuthenticatedShellSettingsIndexRoute
};
var AuthenticatedShellRouteChildren = {
	AuthenticatedShellAliasesRoute,
	AuthenticatedShellAnalyticsRoute,
	AuthenticatedShellCatchAllRoute,
	AuthenticatedShellDashboardRoute,
	AuthenticatedShellDomainsRoute: AuthenticatedShellDomainsRouteWithChildren,
	AuthenticatedShellEmployeesRoute: AuthenticatedShellEmployeesRouteWithChildren,
	AuthenticatedShellGmailRoute,
	AuthenticatedShellHelpRoute,
	AuthenticatedShellLogsRoute,
	AuthenticatedShellSettingsRoute: AuthenticatedShellSettingsRoute._addFileChildren(AuthenticatedShellSettingsRouteChildren),
	AuthenticatedShellSignaturesRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedShellRoute: AuthenticatedShellRoute._addFileChildren(AuthenticatedShellRouteChildren),
	AuthenticatedOnboardingRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var AdminRouteRouteChildren = {
	AdminLoginRoute,
	AdminOrganizationsRoute,
	AdminPromosRoute,
	AdminStatusRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AdminRouteRoute: AdminRouteRoute._addFileChildren(AdminRouteRouteChildren),
	AboutRoute,
	ContactRoute,
	DocsRoute,
	MockGoogleAuthRoute,
	PricingRoute,
	PrivacyRoute,
	StatusRoute,
	TermsRoute,
	ApiAliasSuggestionsRoute,
	ApiDnsResolveRoute,
	ApiRegistrarDetectRoute,
	AuthForgotPasswordRoute,
	AuthLoginRoute,
	AuthResetPasswordRoute,
	AuthSignupRoute,
	AuthVerifyRoute,
	InviteTokenRoute,
	ApiPublicStatusRoute,
	ApiAuthGoogleCallbackRoute,
	ApiPublicHooksVerifyDomainsRoute,
	ApiPublicWebhooksPaystackRoute,
	ApiPublicWebhooksSesRoute
};
var routeTree = Route$47._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
