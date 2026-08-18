import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as queryOptions, o as useQueryClient, r as useSuspenseQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as QrCode, B as MessageSquare, C as Send, D as RefreshCw, H as Mail, St as Check, ht as Copy, n as X } from "../_libs/lucide-react.mjs";
import { n as Button, r as Card } from "./AppShell-Ct9NjhEH.mjs";
import { i as revokeInvite, r as listInvitesForEmployee, t as createInvite } from "./invitations.functions-inHC0CeB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/InviteModal-DFrkCaIB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InviteModal({ employee, onClose }) {
	const qc = useQueryClient();
	const create = useServerFn(createInvite);
	const revoke = useServerFn(revokeInvite);
	const activeInvite = useSuspenseQuery(queryOptions({
		queryKey: ["invites", employee.id],
		queryFn: async () => listInvitesForEmployee({ data: { employeeId: employee.id } })
	})).data.find((i) => !i.revoked_at && !i.accepted_at && new Date(i.expires_at) > /* @__PURE__ */ new Date());
	const newInvite = useMutation({
		mutationFn: () => create({ data: {
			employeeId: employee.id,
			sentVia: "link"
		} }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["invites", employee.id] })
	});
	const revokeM = useMutation({
		mutationFn: (id) => revoke({ data: { id } }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["invites", employee.id] })
	});
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [showQR, setShowQR] = (0, import_react.useState)(false);
	const [sentVia, setSentVia] = (0, import_react.useState)(null);
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const url = activeInvite ? `${origin}/invite/${activeInvite.token}` : "";
	async function copy() {
		if (!url) return;
		await navigator.clipboard?.writeText(url);
		setCopied(true);
		setSentVia("link");
		setTimeout(() => setCopied(false), 1800);
	}
	function openEmail() {
		if (!url) return;
		const name = employee.full_name ?? "there";
		const addr = employee.professional_email ?? "";
		const subj = encodeURIComponent(`Connect your Gmail to ${addr}`);
		const body = encodeURIComponent(`Hi ${name},\n\nYour professional email address ${addr} is ready on Mailcoy.\n\nClick the link below to connect your Gmail account — it only takes about 2 minutes:\n\n${url}\n\nThis link expires on ${activeInvite ? new Date(activeInvite.expires_at).toLocaleDateString() : ""}. If you have any trouble, reply to this email.\n\nWelcome aboard!`);
		window.open(`mailto:${addr}?subject=${subj}&body=${body}`);
		setSentVia("email");
	}
	function openWhatsapp() {
		if (!url) return;
		const name = employee.full_name ?? "";
		const addr = employee.professional_email ?? "";
		const msg = encodeURIComponent(`Hi ${name}! 👋\n\nYour professional email *${addr}* is ready. Connect your Gmail here:\n${url}\n\nLink expires ${activeInvite ? new Date(activeInvite.expires_at).toLocaleDateString() : ""}.`);
		window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
		setSentVia("whatsapp");
	}
	const expiresLabel = activeInvite ? `Expires ${new Date(activeInvite.expires_at).toLocaleDateString()}` : "";
	const openedLabel = activeInvite?.opened_at ? ` · Opened ${new Date(activeInvite.opened_at).toLocaleDateString()}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm",
		role: "dialog",
		"aria-modal": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-lg p-0 overflow-hidden shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 border-b border-line px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-lg font-semibold",
						children: ["Invite ", employee.full_name ?? "employee"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[12.5px] text-ink-3 mt-0.5",
						children: [
							"They'll connect their own Google account to",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink-2",
								children: employee.professional_email
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-ink/[0.05]",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5 space-y-5",
				children: !activeInvite ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-4 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto h-12 w-12 rounded-full bg-primary/10 grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-5 w-5 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13.5px] text-ink-2",
							children: [
								"No active invite link. Generate one to share with ",
								employee.full_name ?? "this employee",
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => newInvite.mutate(),
							disabled: newInvite.isPending,
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-1.5" }), newInvite.isPending ? "Generating…" : "Generate invite link"]
						}),
						newInvite.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-red-600",
							children: newInvite.error.message
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wider text-ink-3 mb-1.5 font-medium",
							children: "Invite link"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								readOnly: true,
								value: url,
								onFocus: (e) => e.currentTarget.select(),
								className: "flex-1 h-10 rounded-md border border-line bg-surface-muted px-3 text-[12px] font-mono truncate outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: copy,
								className: `inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-[13px] transition ${copied ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700" : "border-line hover:bg-ink/[0.04]"}`,
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), copied ? "Copied!" : "Copy"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 text-[11.5px] text-ink-3",
							children: [expiresLabel, openedLabel]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] uppercase tracking-wider text-ink-3 mb-2 font-medium",
						children: "Send via"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openEmail,
								className: `flex flex-col items-center gap-1.5 rounded-xl border p-3 text-[12.5px] hover:bg-ink/[0.04] transition ${sentVia === "email" ? "border-primary/40 bg-primary/5 text-primary" : "border-line"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5" }), "Email"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openWhatsapp,
								className: `flex flex-col items-center gap-1.5 rounded-xl border p-3 text-[12.5px] hover:bg-ink/[0.04] transition ${sentVia === "whatsapp" ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700" : "border-line"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-5 w-5" }), "WhatsApp"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setShowQR((v) => !v);
									setSentVia("link");
								},
								className: `flex flex-col items-center gap-1.5 rounded-xl border p-3 text-[12.5px] hover:bg-ink/[0.04] transition ${showQR ? "border-primary/40 bg-primary/5 text-primary" : "border-line"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-5 w-5" }), "QR Code"]
							})
						]
					})] }),
					sentVia && sentVia !== "link" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-2 text-[12.5px] text-emerald-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 shrink-0" }), sentVia === "email" ? `Pre-filled email opened for ${employee.professional_email}` : "WhatsApp message opened — paste and send!"]
					}),
					showQR && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid place-items-center rounded-xl border border-line bg-white p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							alt: "Invite QR code",
							width: 180,
							height: 180,
							src: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11.5px] text-ink-3",
							children: "Scan with a phone camera"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-t border-line pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => newInvite.mutate(),
							disabled: newInvite.isPending,
							className: "inline-flex h-9 items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${newInvite.isPending ? "animate-spin" : ""}` }), "Regenerate link"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => revokeM.mutate(activeInvite.id),
							disabled: revokeM.isPending,
							className: "text-[13px] text-danger hover:underline disabled:opacity-50",
							children: revokeM.isPending ? "Revoking…" : "Revoke invite"
						})]
					})
				] })
			})]
		})
	});
}
//#endregion
export { InviteModal as t };
