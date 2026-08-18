import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { s as listMembers } from "./_ssr/platform.functions-BMsYct3C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.members-C-xXc1ey.js
var opts = queryOptions({
	queryKey: ["members"],
	queryFn: async () => listMembers(),
	staleTime: 15e3
});
//#endregion
export { opts as t };
