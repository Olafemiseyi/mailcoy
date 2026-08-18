import { o as __toESM } from "../_runtime.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as AuthShell, r as PrimaryButton, t as AuthField } from "./AuthShell-BS4W0Ajv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-OzaTZdA2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPage() {
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (password !== confirm) return setError("Passwords do not match");
		setLoading(true);
		const { error } = await supabase.auth.updateUser({ password });
		setLoading(false);
		if (error) return setError(error.message);
		navigate({ to: "/auth/login" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Set a new password",
		subtitle: "Choose a strong password you haven't used before.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					label: "New password",
					type: "password",
					required: true,
					minLength: 8,
					value: password,
					onChange: (e) => setPassword(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					label: "Confirm password",
					type: "password",
					required: true,
					minLength: 8,
					value: confirm,
					onChange: (e) => setConfirm(e.target.value)
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-red-600",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					type: "submit",
					disabled: loading,
					children: loading ? "Updating…" : "Update password"
				})
			]
		})
	});
}
//#endregion
export { ResetPage as component };
