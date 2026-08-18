import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { c as listWebhooks } from "./_ssr/platform.functions-BMsYct3C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.webhooks-Co3r9S8y.js
var opts = queryOptions({
	queryKey: ["webhooks"],
	queryFn: async () => listWebhooks(),
	staleTime: 3e4
});
//#endregion
export { opts as t };
