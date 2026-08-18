import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { f as getMyOrganization } from "./_ssr/AppShell-B0jIXsQK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.index-1Je_NmEH.js
var opts = queryOptions({
	queryKey: ["my-org"],
	queryFn: async () => getMyOrganization(),
	staleTime: 3e4
});
//#endregion
export { opts as t };
