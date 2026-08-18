import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { i as listAllOrganizations } from "./admin.functions-Bhxi-PnD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/organizations-DQR0shU-.js
var opts = (search, plan, offset) => queryOptions({
	queryKey: [
		"admin-orgs",
		search,
		plan,
		offset
	],
	queryFn: async () => listAllOrganizations({ data: {
		search: search || void 0,
		plan: plan || void 0,
		limit: 50,
		offset
	} }),
	staleTime: 15e3
});
//#endregion
export { opts as t };
