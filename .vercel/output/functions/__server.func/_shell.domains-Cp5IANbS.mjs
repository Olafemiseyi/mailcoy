import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { i as listDomains } from "./_ssr/domains.functions-D6Oqfvoo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.domains-Cp5IANbS.js
var opts = queryOptions({
	queryKey: ["domains"],
	queryFn: async () => listDomains(),
	staleTime: 1e4
});
//#endregion
export { opts as t };
