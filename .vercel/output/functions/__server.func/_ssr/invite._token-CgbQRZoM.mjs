import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invite._token-CgbQRZoM.js
var $$splitComponentImporter = () => import("./invite._token-CnLk5ukt.mjs");
var Route = createFileRoute("/invite/$token")({
	head: () => ({ meta: [{ title: "Connect Gmail — Mailcoy" }] }),
	validateSearch: (search) => ({ error: typeof search.error === "string" ? search.error : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
