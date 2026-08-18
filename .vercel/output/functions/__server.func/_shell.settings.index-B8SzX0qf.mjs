import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { f as getMyOrganization } from "./_ssr/AppShell-Ct9NjhEH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.index-B8SzX0qf.js
var opts = queryOptions({
	queryKey: ["my-org"],
	queryFn: async () => getMyOrganization(),
	staleTime: 3e4
});
//#endregion
export { opts as t };
