import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as AuthShell, r as PrimaryButton } from "./AuthShell-BS4W0Ajv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-DPXCZtVX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyPage() {
	const [state, setState] = (0, import_react.useState)("loading");
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setState(data.user ? "ok" : "error"));
	}, []);
	if (state === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Verifying…",
		subtitle: "Just a moment.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1 w-full bg-line rounded-full overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-1/2 bg-primary animate-pulse" })
		})
	});
	if (state === "ok") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Email confirmed",
		subtitle: "You're all set. Let's finish setting up your workspace.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, { children: "Continue" })
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Link expired",
		subtitle: "This verification link is no longer valid.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/auth/login",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, { children: "Back to sign in" })
		})
	});
}
//#endregion
export { VerifyPage as component };
