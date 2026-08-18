import { f as Outlet, g as Link, l as useRouterState, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Logomark } from "./Logomark-BWOODGU3.mjs";
import { o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { J as LayoutDashboard, Nt as Activity, W as LogOut, m as Tag, wt as Building2, y as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-Cy8p_7Z5.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/admin",
		label: "Overview",
		icon: LayoutDashboard
	},
	{
		to: "/admin/organizations",
		label: "Organizations",
		icon: Building2
	},
	{
		to: "/admin/promos",
		label: "Promo Codes",
		icon: Tag
	},
	{
		to: "/admin/status",
		label: "System status & Infrastructure",
		icon: Activity
	}
];
function AdminLayout() {
	const router = useRouter();
	const qc = useQueryClient();
	const path = useRouterState({ select: (s) => s.location.pathname });
	if (path === "/admin/login") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		router.navigate({
			to: "/admin/login",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line bg-background/95 backdrop-blur sticky top-0 z-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: "flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-5 w-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mailcoy" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Admin"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "ml-6 hidden md:flex items-center gap-1",
						children: NAV.map((n) => {
							const active = path === n.to || n.to !== "/admin" && path.startsWith(n.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: n.to,
								className: `inline-flex items-center gap-2 h-8 px-3 rounded-md text-[13px] ${active ? "bg-ink/[0.06] text-ink" : "text-ink-3 hover:text-ink hover:bg-ink/[0.03]"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-3.5 w-3.5" }), n.label]
							}, n.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: signOut,
							className: "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[13px] text-ink-3 hover:text-ink hover:bg-ink/[0.03]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign out"]
						})
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-[1400px] px-5 py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AdminLayout as component };
