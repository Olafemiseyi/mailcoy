import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { a as listApiKeys } from "./_ssr/platform.functions-CcitIfTc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.api-keys-CnfOryl3.js
var opts = queryOptions({
	queryKey: ["api-keys"],
	queryFn: async () => listApiKeys(),
	staleTime: 15e3
});
//#endregion
export { opts as t };
