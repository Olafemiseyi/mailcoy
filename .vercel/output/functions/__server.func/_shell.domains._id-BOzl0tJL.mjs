import { g as Link, m as createFileRoute, p as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { jt as ArrowLeft } from "./_libs/lucide-react.mjs";
import { r as Card } from "./_ssr/AppShell-B0jIXsQK.mjs";
import { r as getDomain } from "./_ssr/domains.functions-WRjXBdX3.mjs";
import { i as Skeleton } from "./_ssr/Skeleton-_cvfJ6Br.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.domains._id-BOzl0tJL.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./_shell.domains._id-CZUjMzvB.mjs");
var $$splitErrorComponentImporter = () => import("./_shell.domains._id-PY1MCKsp.mjs");
var detailOpts = (id) => queryOptions({
	queryKey: ["domain", id],
	queryFn: async () => getDomain({ data: { id } }),
	staleTime: 5e3
});
var Route = createFileRoute("/_authenticated/_shell/domains/$id")({
	head: () => ({ meta: [{ title: "Domain — Mailcoy" }] }),
	loader: ({ context, params }) => context.queryClient.ensureQueryData(detailOpts(params.id)),
	pendingMs: 0,
	pendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/domains",
				className: "mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to domains"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-60" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-24 rounded-md" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [...Array(2)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 h-48",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-32 mb-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-3/4" })
					]
				}, i))
			})
		]
	}),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
