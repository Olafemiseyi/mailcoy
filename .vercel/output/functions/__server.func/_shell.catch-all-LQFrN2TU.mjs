import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { i as getOrgSettings } from "./_ssr/analytics.functions-C05vrrnj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.catch-all-LQFrN2TU.js
var settingsOpts = queryOptions({
	queryKey: ["org-settings"],
	queryFn: async () => getOrgSettings(),
	staleTime: 3e4
});
//#endregion
export { settingsOpts as t };
