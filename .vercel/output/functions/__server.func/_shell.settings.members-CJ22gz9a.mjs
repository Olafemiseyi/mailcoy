import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { St as Check, a as UserPlus, ht as Copy, n as X, pt as Crown } from "./_libs/lucide-react.mjs";
import { a as CustomSelect, n as Button, r as Card } from "./_ssr/AppShell-Ct9NjhEH.mjs";
import { i as inviteMember } from "./_ssr/platform.functions-BMsYct3C.mjs";
import { t as opts } from "./_shell.settings.members-C-xXc1ey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.members-CJ22gz9a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MembersRoute() {
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(opts);
	const inviteFn = useServerFn(inviteMember);
	const [openModal, setOpenModal] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("admin");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const handleInvite = async (e) => {
		e.preventDefault();
		if (!email) return;
		setBusy(true);
		setResult(null);
		try {
			const res = await inviteFn({ data: {
				email,
				role
			} });
			setResult(res);
			await qc.invalidateQueries({ queryKey: ["members"] });
		} catch (err) {
			alert(err?.message || "Failed to send invitation");
		} finally {
			setBusy(false);
		}
	};
	const copyLink = () => {
		if (result?.inviteUrl) {
			navigator.clipboard.writeText(result.inviteUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-bold text-ink",
					children: "Team Admins & Dashboard Access"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[13px] text-ink-3",
					children: "People who have administrative login access to manage this Mailcoy workspace, domains, and billing."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpenModal(true),
					className: "gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), " Invite Admin"]
				})]
			}), data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-[13.5px] text-ink-3",
				children: "No members found."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line mt-2",
				children: data.map((m) => {
					const displayName = m.full_name || m.email?.split("@")[0] || "Workspace Admin";
					const displayEmail = m.email || `User (${m.user_id.slice(0, 8)}...)`;
					const isOwner = m.role === "owner";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-xl bg-primary/10 text-primary font-bold text-sm grid place-items-center shrink-0",
								children: displayName.charAt(0).toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-[14px] text-ink truncate",
										children: displayName
									}), m.is_current_user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10.5px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md",
										children: "You"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[12.5px] text-ink-3 truncate mt-0.5",
									children: displayEmail
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold capitalize ${isOwner ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" : "bg-surface-muted text-ink-2 border border-line"}`,
								children: [isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3.5 w-3.5 text-amber-600" }), m.role]
							})
						})]
					}, m.user_id);
				})
			})]
		}), openModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-display text-lg font-bold text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-5 w-5 text-primary" }), " Invite Workspace Admin"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setOpenModal(false);
							setResult(null);
							setEmail("");
						},
						className: "text-ink-4 hover:text-ink transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}), result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[13px] leading-relaxed",
							children: result.message
						}),
						result.inviteUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[12px] font-semibold text-ink-3",
								children: "Invite Link"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									readOnly: true,
									value: result.inviteUrl,
									className: "h-10 flex-1 rounded-xl border border-line bg-surface-muted px-3 text-[12px] font-mono text-ink outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: copyLink,
									className: "gap-1.5 shrink-0 h-10 px-3",
									children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), copied ? "Copied" : "Copy"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								setOpenModal(false);
								setResult(null);
								setEmail("");
							},
							className: "w-full mt-2",
							children: "Done"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleInvite,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-[13px] font-semibold text-ink-2",
							children: ["Admin Email Address", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "co-founder@company.com",
								className: "h-10 rounded-xl border border-line bg-background px-3 text-[14px] text-ink outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-[13px] font-semibold text-ink-2",
							children: ["Permission Role", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomSelect, {
								options: [{
									value: "admin",
									label: "Workspace Admin (DNS, Inboxes, Signatures)"
								}, {
									value: "member",
									label: "Workspace Member (Staff)"
								}],
								value: role,
								onChange: (val) => setRole(val)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setOpenModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy,
								className: "gap-2",
								children: busy ? "Sending…" : "Send Admin Invite"
							})]
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { MembersRoute as component };
