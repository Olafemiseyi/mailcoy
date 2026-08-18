import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { a as listApiKeys } from "./_ssr/platform.functions-BMsYct3C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.api-keys-BtSO_0CD.js
var opts = queryOptions({
	queryKey: ["api-keys"],
	queryFn: async () => listApiKeys(),
	staleTime: 15e3
});
//#endregion
export { opts as t };
