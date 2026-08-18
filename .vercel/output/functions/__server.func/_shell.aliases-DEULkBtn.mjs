import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { a as listAliases } from "./_ssr/analytics.functions-Dak22_l7.mjs";
import { i as listEmployees } from "./_ssr/employees.functions-Bh7q8BeL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.aliases-DEULkBtn.js
var aliasesOpts = queryOptions({
	queryKey: ["aliases"],
	queryFn: async () => listAliases(),
	staleTime: 2e4
});
var empOpts = queryOptions({
	queryKey: ["employees"],
	queryFn: async () => listEmployees(),
	staleTime: 3e4
});
//#endregion
export { empOpts as n, aliasesOpts as t };
