import { o as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { r as getPlatformAdminStatus } from "./admin.functions-CvrArqa1.mjs";
import { n as AuthShell, r as PrimaryButton, t as AuthField } from "./AuthShell-BS4W0Ajv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DHj0cr4n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const { error: signInErr } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (signInErr) {
			setLoading(false);
			return setError(signInErr.message);
		}
		try {
			if (!(await getPlatformAdminStatus()).isPlatformAdmin) {
				await supabase.auth.signOut();
				setLoading(false);
				return setError("This account does not have platform admin access.");
			}
			navigate({ to: "/admin" });
		} catch {
			await supabase.auth.signOut();
			setLoading(false);
			setError("Unable to verify admin access.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthShell, {
		title: "Platform admin",
		subtitle: "Restricted access — super admins only",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/auth/login",
			className: "text-ink-3 hover:text-ink",
			children: "← Back to user sign in"
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-center gap-2 rounded-md border border-line bg-ink/[0.02] px-3 py-2 text-[12.5px] text-ink-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), "Isolated from customer sign-in."]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					label: "Admin email",
					type: "email",
					required: true,
					value: email,
					onChange: (e) => setEmail(e.target.value),
					placeholder: "admin@mailcoy.com",
					autoComplete: "username"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					label: "Password",
					type: "password",
					required: true,
					value: password,
					onChange: (e) => setPassword(e.target.value),
					autoComplete: "current-password"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-red-600",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					type: "submit",
					disabled: loading,
					children: loading ? "Signing in…" : "Sign in to admin"
				})
			]
		})]
	});
}
//#endregion
export { AdminLoginPage as component };
