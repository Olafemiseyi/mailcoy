import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { r as getAnalytics } from "./_ssr/analytics.functions-Dak22_l7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.analytics-DOi2iQSt.js
var analyticsOpts = (range) => queryOptions({
	queryKey: ["analytics", range],
	queryFn: async () => getAnalytics({ data: { range } }),
	staleTime: 3e4
});
//#endregion
export { analyticsOpts as t };
