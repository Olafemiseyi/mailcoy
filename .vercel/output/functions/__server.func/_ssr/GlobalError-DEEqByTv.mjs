import { o as __toESM } from "../_runtime.mjs";
import { g as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as RefreshCw, s as TriangleAlert, tt as House } from "../_libs/lucide-react.mjs";
import { n as Button } from "./AppShell-CbLCr2lg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlobalError-DEEqByTv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GlobalError({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		console.error("Global boundary caught error:", error);
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full w-full flex-col items-center justify-center p-8 text-center animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-xl font-semibold text-ink",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 max-w-md text-[14px] text-ink-3",
				children: error.message || "An unexpected error occurred while loading this page."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: () => {
						router.invalidate();
						reset();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Retry"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "mr-2 h-4 w-4" }), "Go to Dashboard"]
					})
				})]
			})
		]
	});
}
//#endregion
export { GlobalError as t };
