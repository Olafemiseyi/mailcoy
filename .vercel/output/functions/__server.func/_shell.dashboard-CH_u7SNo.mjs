import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.dashboard-CH_u7SNo.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error, reset }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "p-6",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-lg font-semibold mb-2",
			children: "Unable to load dashboard"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] text-ink-3 mb-4",
			children: error.message
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: reset,
			className: "h-9 px-3 rounded-md border border-line text-[13px]",
			children: "Retry"
		})
	]
});
//#endregion
export { SplitErrorComponent as errorComponent };
