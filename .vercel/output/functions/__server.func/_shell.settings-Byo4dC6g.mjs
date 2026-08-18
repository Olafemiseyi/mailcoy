import { f as Outlet, g as Link, l as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { c as PageHeader } from "./_ssr/AppShell-CbLCr2lg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings-Byo4dC6g.js
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		to: "/settings",
		label: "Organization Profile"
	},
	{
		to: "/settings/members",
		label: "Team Admins & Members"
	},
	{
		to: "/settings/billing",
		label: "Billing & Plans"
	},
	{
		to: "/settings/api-keys",
		label: "API & Developers"
	}
];
var SplitComponent = () => {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			subtitle: "Organization, team, integrations, and billing."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "mb-6 flex flex-wrap gap-1 border-b border-line",
			children: TABS.map((t) => {
				const active = path === t.to || t.to !== "/settings" && path.startsWith(t.to);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: t.to,
					className: `px-3 h-9 -mb-px inline-flex items-center border-b-2 text-[13px] ${active ? "border-primary text-ink" : "border-transparent text-ink-3 hover:text-ink"}`,
					children: t.label
				}, t.to);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	] });
};
//#endregion
export { SplitComponent as component };
