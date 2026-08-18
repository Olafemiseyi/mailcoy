import { o as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as AuthShell, r as PrimaryButton, t as AuthField } from "./AuthShell-BS4W0Ajv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DfJiv2nd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			navigate({ to: "/dashboard" });
		}, 500);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Welcome back",
		subtitle: "Sign in to your Mailcoy workspace",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"New here?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/auth/signup",
				className: "text-ink underline underline-offset-2 font-medium",
				children: "Create an account"
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			id: "login-form",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					id: "login-email",
					label: "Work email",
					type: "email",
					required: true,
					autoComplete: "email",
					value: email,
					onChange: (e) => setEmail(e.target.value),
					placeholder: "you@company.com"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					id: "login-password",
					label: "Password",
					type: "password",
					required: true,
					autoComplete: "current-password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					placeholder: "........"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth/forgot-password",
						className: "text-[12.5px] text-ink-3 hover:text-ink transition-colors",
						children: "Forgot password?"
					})
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-[13px] text-danger",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					id: "login-submit",
					type: "submit",
					disabled: loading,
					children: loading ? "Signing in…" : "Sign in"
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
