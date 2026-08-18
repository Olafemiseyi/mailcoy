import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { i as listDomains } from "./_ssr/domains.functions-WRjXBdX3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.domains-uk6M_T8o.js
var opts = queryOptions({
	queryKey: ["domains"],
	queryFn: async () => listDomains(),
	staleTime: 1e4
});
//#endregion
export { opts as t };
