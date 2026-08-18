import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { i as resolveOrgContext } from "./orgContext.server-DcnSceZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.functions-CmlkjcNq.js
var EMPTY_DASHBOARD = {
	hasOrganization: false,
	domainsTotal: 0,
	domainsVerified: 0,
	employeesTotal: 0,
	employeesConnected: 0,
	sentToday: 0,
	receivedToday: 0,
	bouncedToday: 0,
	deliverabilityPct: 100,
	activity: [],
	recentLogs: []
};
var getDashboardSummary_createServerFn_handler = createServerRpc({
	id: "28aa4566b749882446c5a87c8cda74ed6b85fd544aa67cdf3d0d14ad32634d59",
	name: "getDashboardSummary",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => getDashboardSummary.__executeServer(opts));
var getDashboardSummary = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getDashboardSummary_createServerFn_handler, async ({ context }) => {
	const ctx = await resolveOrgContext(context.supabase, context.userId);
	if (!ctx) return EMPTY_DASHBOARD;
	ctx.organizationId;
	context.supabase;
	(/* @__PURE__ */ new Date(Date.now() - 24 * 3600 * 1e3)).toISOString();
	return {
		hasOrganization: true,
		domainsTotal: 2,
		domainsVerified: 1,
		employeesTotal: 12,
		employeesConnected: 12,
		sentToday: 1284,
		receivedToday: 420,
		bouncedToday: 3,
		deliverabilityPct: 99.7,
		recentLogs: [
			{
				id: "1",
				sender: "sales@mailcoy.com",
				receiver: "akin@gmail.com",
				subject: "Invoice #1024",
				status: "delivered",
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			},
			{
				id: "2",
				sender: "john@mailcoy.com",
				receiver: "john.doe@gmail.com",
				subject: "Meeting Notes",
				status: "delivered",
				timestamp: (/* @__PURE__ */ new Date(Date.now() - 12e4)).toISOString()
			},
			{
				id: "3",
				sender: "support@mailcoy.com",
				receiver: "team@gmail.com",
				subject: "Customer Inquiry",
				status: "delivered",
				timestamp: (/* @__PURE__ */ new Date(Date.now() - 3e5)).toISOString()
			}
		]
	};
});
//#endregion
export { getDashboardSummary_createServerFn_handler };
