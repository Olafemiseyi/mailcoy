import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./mock-google-auth-RDFNIlH9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-google-auth-Bj_R4_Zb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MockGoogleAuthRoute() {
	const token = Route.useSearch({ select: (s) => s.token });
	function handleLogin() {
		if (window.opener) {
			window.opener.postMessage({
				type: "LovableConnectorComplete",
				connectionAPIKey: "mock-key-for-" + token
			}, window.location.origin);
			window.close();
		} else alert("This window was not opened as a popup. Cannot complete authentication.");
	}
	(0, import_react.useEffect)(() => {}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh grid place-items-center bg-[#F1F5F9] px-4 font-sans",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EA4335]/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "h-8 w-8 text-[#EA4335]",
						viewBox: "0 0 24 24",
						fill: "currentColor",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-2 text-xl font-semibold text-slate-900",
					children: "Sign in with Google"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-8 text-sm text-slate-500",
					children: [
						"(Mock Environment) ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						" Choose an account to continue to Mailcoy."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleLogin,
					className: "w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow hover:bg-blue-700 transition",
					children: "Mock Login"
				})
			]
		})
	});
}
//#endregion
export { MockGoogleAuthRoute as component };
