import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as friendlyError } from "./_ssr/errors-BQqOewcu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.employees._id-CjbXvxhb.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error, reset }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "p-6",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-lg font-semibold mb-2",
			children: "Unable to load employee"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] text-ink-3 mb-4",
			children: friendlyError(error, "Failed to load employee details.")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: reset,
				className: "h-9 px-3 rounded-md border border-line text-[13px]",
				children: "Retry"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/employees",
				className: "text-[13px] text-ink-3 hover:text-ink",
				children: "Go back"
			})]
		})
	]
});
//#endregion
export { SplitErrorComponent as errorComponent };
