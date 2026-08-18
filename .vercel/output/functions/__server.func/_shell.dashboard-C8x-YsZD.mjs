import { c as createServerFn } from "./_ssr/createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-Cw6_vrZ_.mjs";
import { t as requireSupabaseAuth } from "./_ssr/auth-middleware-BwdutfJC.mjs";
import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.dashboard-C8x-YsZD.js
var getDashboardSummary = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("28aa4566b749882446c5a87c8cda74ed6b85fd544aa67cdf3d0d14ad32634d59"));
var dashOpts = queryOptions({
	queryKey: ["dashboard-summary"],
	queryFn: async () => getDashboardSummary(),
	staleTime: 15e3
});
//#endregion
export { getDashboardSummary as n, dashOpts as t };
