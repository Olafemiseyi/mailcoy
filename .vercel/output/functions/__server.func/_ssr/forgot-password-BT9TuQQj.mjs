import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as AuthShell, r as PrimaryButton, t as AuthField } from "./AuthShell-BS4W0Ajv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-BT9TuQQj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/auth/reset-password" });
		setLoading(false);
		if (error) return setError(error.message);
		setSent(true);
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Check your inbox",
		subtitle: `If an account exists for ${email}, we sent a reset link.`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/auth/login",
			className: "text-[13px] text-ink underline underline-offset-2 font-medium",
			children: "← Back to sign in"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Forgot your password?",
		subtitle: "Enter your email and we'll send you a reset link.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/auth/login",
			className: "text-ink underline underline-offset-2 font-medium",
			children: "← Back to sign in"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			id: "forgot-form",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					id: "forgot-email",
					label: "Work email",
					type: "email",
					required: true,
					autoComplete: "email",
					placeholder: "you@company.com",
					value: email,
					onChange: (e) => setEmail(e.target.value)
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-[13px] text-danger",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					id: "forgot-submit",
					type: "submit",
					disabled: loading,
					children: loading ? "Sending…" : "Send reset link"
				})
			]
		})
	});
}
//#endregion
export { ForgotPage as component };
