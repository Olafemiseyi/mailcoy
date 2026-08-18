import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { r as getAnalytics } from "./_ssr/analytics.functions-C05vrrnj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.analytics-vKuplItf.js
var analyticsOpts = (range) => queryOptions({
	queryKey: ["analytics", range],
	queryFn: async () => getAnalytics({ data: { range } }),
	staleTime: 3e4
});
//#endregion
export { analyticsOpts as t };
