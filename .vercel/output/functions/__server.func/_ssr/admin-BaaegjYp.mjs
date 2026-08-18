import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { n as getAdminOverview } from "./admin.functions-UZyOER8E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BaaegjYp.js
var opts = queryOptions({
	queryKey: ["admin-overview"],
	queryFn: async () => getAdminOverview(),
	staleTime: 3e4
});
//#endregion
export { opts as t };
