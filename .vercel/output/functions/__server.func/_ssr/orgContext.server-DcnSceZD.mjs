import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orgContext.server-DcnSceZD.js
var orgContext_server_DcnSceZD_exports = /* @__PURE__ */ __exportAll({
	i: () => resolveOrgContext,
	n: () => orgContext_server_exports,
	r: () => requireOrgContext,
	t: () => assertAdmin
});
var orgContext_server_exports = /* @__PURE__ */ __exportAll$1({
	assertAdmin: () => assertAdmin,
	assertNotLocked: () => assertNotLocked,
	requireOrgContext: () => requireOrgContext,
	resolveOrgContext: () => resolveOrgContext
});
var PLAN_LIMITS = {
	free: {
		maxDomains: 1,
		maxEmployees: 1,
		name: "Free"
	},
	starter: {
		maxDomains: 1,
		maxEmployees: 5,
		name: "Starter Pro"
	},
	growth: {
		maxDomains: 3,
		maxEmployees: 20,
		name: "Growth"
	},
	scale: {
		maxDomains: 10,
		maxEmployees: 50,
		name: "Scale"
	},
	custom: {
		maxDomains: 50,
		maxEmployees: 500,
		name: "Enterprise"
	}
};
/**
* Returns the caller's first membership and resolved subscription status.
*/
async function resolveOrgContext(supabase, userId, preferredOrgId) {
	const planCode = "free";
	const limits = PLAN_LIMITS[planCode] || PLAN_LIMITS.free;
	const subscription = {
		plan: limits.name,
		planCode,
		status: "active",
		isTrial: false,
		trialDaysLeft: 0,
		isLocked: false,
		maxDomains: limits.maxDomains,
		maxEmployees: limits.maxEmployees,
		currentPeriodEnd: null
	};
	return {
		organizationId: preferredOrgId || "mock-org-123",
		role: "owner",
		subscription
	};
}
async function requireOrgContext(supabase, userId, preferredOrgId) {
	const ctx = await resolveOrgContext(supabase, userId, preferredOrgId);
	if (!ctx) throw new Error("NO_ORGANIZATION");
	return ctx;
}
function assertAdmin(role) {
	if (role !== "owner" && role !== "admin") throw new Error("FORBIDDEN");
}
function assertNotLocked(subscription) {
	if (subscription.isLocked) throw new Error("Your subscription is past due or canceled. Please visit Settings → Billing to activate your plan.");
}
//#endregion
export { resolveOrgContext as i, orgContext_server_DcnSceZD_exports as n, requireOrgContext as r, assertAdmin as t };
