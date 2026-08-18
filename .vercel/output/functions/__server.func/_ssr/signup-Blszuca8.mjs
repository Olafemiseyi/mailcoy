import { o as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as AuthShell, r as PrimaryButton, t as AuthField } from "./AuthShell-BS4W0Ajv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-Blszuca8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignupPage() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (password !== confirmPassword) {
			setError("Passwords do not match. Please re-enter your password.");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}
		setLoading(true);
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: window.location.origin + "/auth/verify",
					data: {
						name,
						full_name: name
					}
				}
			});
			setLoading(false);
			if (error) {
				if (error.message === "Failed to fetch" || error.message.includes("network") || error.message.includes("fetch")) return setError("Unable to reach authentication server. Please check your internet connection and try again.");
				return setError(error.message);
			}
			if (data?.session) navigate({ to: "/onboarding" });
			else setSent(true);
		} catch {
			setLoading(false);
			setError("Network error. Please check your internet connection.");
		}
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Check your email",
		subtitle: `We sent a verification link to ${email}.`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-ink-3 leading-relaxed",
				children: "Click the link in the email to activate your account, then sign in."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				onClick: () => navigate({ to: "/auth/login" }),
				children: "Back to sign in"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Create your workspace",
		subtitle: "Start sending professional email in minutes",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Already have an account?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/auth/login",
				className: "text-ink underline underline-offset-2 font-medium",
				children: "Sign in"
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			id: "signup-form",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					id: "signup-name",
					label: "Full name",
					required: true,
					autoComplete: "name",
					placeholder: "Jane Doe",
					value: name,
					onChange: (e) => setName(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					id: "signup-email",
					label: "Work email",
					type: "email",
					required: true,
					autoComplete: "email",
					placeholder: "you@company.com",
					value: email,
					onChange: (e) => setEmail(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					id: "signup-password",
					label: "Password",
					type: "password",
					required: true,
					minLength: 8,
					autoComplete: "new-password",
					hint: "At least 8 characters",
					value: password,
					onChange: (e) => setPassword(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthField, {
					id: "signup-confirm-password",
					label: "Confirm password",
					type: "password",
					required: true,
					minLength: 8,
					autoComplete: "new-password",
					placeholder: "••••••••",
					value: confirmPassword,
					onChange: (e) => setConfirmPassword(e.target.value)
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-[13px] text-danger font-medium",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					id: "signup-submit",
					type: "submit",
					disabled: loading,
					children: loading ? "Creating account…" : "Create account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11.5px] text-ink-3 text-center",
					children: [
						"By continuing you agree to our",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/terms",
							target: "_blank",
							className: "underline hover:text-ink transition-colors font-medium",
							children: "Terms of Service"
						}),
						" ",
						"and",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							target: "_blank",
							className: "underline hover:text-ink transition-colors font-medium",
							children: "Privacy Policy"
						}),
						"."
					]
				})
			]
		})
	});
}
//#endregion
export { SignupPage as component };
