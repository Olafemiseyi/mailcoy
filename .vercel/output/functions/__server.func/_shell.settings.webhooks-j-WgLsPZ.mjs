import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { c as listWebhooks } from "./_ssr/platform.functions-CcitIfTc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.webhooks-j-WgLsPZ.js
var opts = queryOptions({
	queryKey: ["webhooks"],
	queryFn: async () => listWebhooks(),
	staleTime: 3e4
});
//#endregion
export { opts as t };
