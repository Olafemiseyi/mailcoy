import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { i as listEmployees } from "./_ssr/employees.functions-CrDlWPNj.mjs";
import { i as listDomains } from "./_ssr/domains.functions-WRjXBdX3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.employees-BThKtYuD.js
var empOpts = queryOptions({
	queryKey: ["employees"],
	queryFn: async () => listEmployees(),
	staleTime: 15e3
});
var domOpts = queryOptions({
	queryKey: ["domains"],
	queryFn: async () => listDomains(),
	staleTime: 3e4
});
//#endregion
export { empOpts as n, domOpts as t };
