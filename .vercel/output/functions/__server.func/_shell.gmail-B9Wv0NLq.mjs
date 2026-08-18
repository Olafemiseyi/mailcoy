import { o as __toESM } from "./_runtime.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { C as Send, H as Mail, I as Pause, N as Play, Ot as AtSign, q as Link2Off, vt as CircleCheck, y as ShieldCheck } from "./_libs/lucide-react.mjs";
import { c as PageHeader, l as StatusPill, n as Button, r as Card } from "./_ssr/AppShell-CbLCr2lg.mjs";
import { t as InviteModal } from "./_ssr/InviteModal-C8Yfo0p4.mjs";
import { a as resumeGmailConnection, i as pauseGmailConnection, n as disconnectGoogleMail, o as triggerSendAsSetup, r as empOpts, t as cfgOpts } from "./_shell.gmail-Dgae8J28.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.gmail-B9Wv0NLq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GmailRoute() {
	const qc = useQueryClient();
	const { data: employees } = useSuspenseQuery(empOpts);
	const { data: cfg } = useSuspenseQuery(cfgOpts);
	const disc = useServerFn(disconnectGoogleMail);
	const pause = useServerFn(pauseGmailConnection);
	const resume = useServerFn(resumeGmailConnection);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [inviteFor, setInviteFor] = (0, import_react.useState)(null);
	const onErr = (e) => setNotice(e instanceof Error ? e.message : "Failed");
	const onOk = () => qc.invalidateQueries({ queryKey: ["employees"] });
	const discM = useMutation({
		mutationFn: (id) => disc({ data: { employeeId: id } }),
		onSuccess: onOk,
		onError: onErr
	});
	const pauseM = useMutation({
		mutationFn: (id) => pause({ data: { employeeId: id } }),
		onSuccess: onOk,
		onError: onErr
	});
	const resumeM = useMutation({
		mutationFn: (id) => resume({ data: { employeeId: id } }),
		onSuccess: onOk,
		onError: onErr
	});
	const sendAsM = useMutation({
		mutationFn: (id) => triggerSendAsSetup({ data: { employeeId: id } }),
		onSuccess: (_data, id) => setNotice(`Send As setup triggered for employee. They'll receive a verification email at their professional address.`),
		onError: onErr
	});
	const list = employees.filter((e) => e.gmail_connected || e.invited_at || e.connected_at || e.status === "suspended");
	const connected = list.filter((e) => e.gmail_connected && e.gmail_health !== "paused").length;
	const paused = list.filter((e) => e.gmail_health === "paused").length;
	const awaiting = list.filter((e) => !e.gmail_connected).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Gmail Connections",
			subtitle: "Monitor employees who have been invited or connected. Send invites from the Employees page."
		}),
		!cfg.configured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-5 mb-6 border-amber-400/40 bg-amber-50/40 dark:bg-amber-500/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13.5px] text-ink-2",
				children: "The Google Mail connector isn't provisioned in this workspace yet. Invitation links will still generate, but Google sign-in inside them will fail until the workspace client is configured."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "In lifecycle",
					value: list.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Connected",
					value: connected
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Paused",
					value: paused
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Awaiting connection",
					value: awaiting
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4 mb-5 border-emerald-500/20 bg-emerald-500/[0.02]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0 mt-0.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[13px] text-ink-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-ink font-semibold",
						children: "Pro Tip for Showing Your Company Logo in Gmail ($0):"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-ink-3 leading-relaxed",
						children: "When employees connect their Google account, setting their company logo as their Google Account profile avatar will automatically display the logo next to all sent business emails in Gmail for desktop, iPhone, and Android without requiring a paid VMC certificate."
					})]
				})]
			})
		}),
		notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 text-[13px] text-red-600",
			children: notice
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-0",
			children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-10 text-center text-[13.5px] text-ink-3",
				children: [
					"No employees invited yet. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/employees",
						className: "underline",
						children: "Go to employees"
					}),
					" to send invite links."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: list.map((e) => {
					const paused = e.gmail_connected && e.gmail_health === "paused";
					const statusLabel = e.gmail_connected ? paused ? "paused" : e.gmail_health ?? "connected" : e.invited_at ? "invited" : e.status ?? "pending";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-8 w-8 rounded-md bg-ink/[0.05] flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: e.full_name ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[12px] text-ink-3 font-mono truncate",
										children: e.gmail_connected && e.gmail_email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											e.professional_email,
											" · via ",
											e.gmail_email
										] }) : e.professional_email ?? ""
									}),
									!e.gmail_connected && e.invited_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11.5px] text-ink-3 mt-0.5",
										children: ["Invited ", new Date(e.invited_at).toLocaleDateString()]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 pt-2 sm:pt-0 sm:justify-end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: statusLabel }),
								e.gmail_connected && !paused && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									onClick: () => pauseM.mutate(e.id),
									disabled: pauseM.isPending && pauseM.variables === e.id,
									className: "whitespace-nowrap h-8 px-2.5 text-[12.5px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5 mr-1" }), " Pause"]
								}),
								e.gmail_connected && paused && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									onClick: () => resumeM.mutate(e.id),
									disabled: resumeM.isPending && resumeM.variables === e.id,
									className: "whitespace-nowrap h-8 px-2.5 text-[12.5px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 mr-1" }), " Resume"]
								}),
								e.gmail_connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => sendAsM.mutate(e.id),
									disabled: sendAsM.isPending && sendAsM.variables === e.id,
									title: "Re-trigger Gmail Send As alias setup",
									className: "whitespace-nowrap h-8 px-2.5 text-[12.5px]",
									children: sendAsM.isPending && sendAsM.variables === e.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "h-3.5 w-3.5 mr-1 animate-pulse" }), " Setting up…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "h-3.5 w-3.5 mr-1" }), " Send As Setup"] })
								}),
								e.gmail_connected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									onClick: () => discM.mutate(e.id),
									disabled: discM.isPending && discM.variables === e.id,
									className: "whitespace-nowrap h-8 px-2.5 text-[12.5px] text-danger hover:text-red-700 hover:bg-danger/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2Off, { className: "h-3.5 w-3.5 mr-1" }), " Disconnect"]
								}),
								!e.gmail_connected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										onClick: () => setInviteFor(e),
										className: "whitespace-nowrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5 mr-1.5" }), " Resend invite"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/employees/$id",
										params: { id: e.id },
										className: "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-2.5 text-[12.5px] text-ink-2 hover:bg-ink/[0.04]",
										children: "View"
									})]
								})
							]
						})]
					}, e.id);
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex items-start gap-2 text-[12px] text-ink-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium text-ink-2 mb-0.5",
				children: "Privacy & Security note"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "When an employee connects their Google Account, they grant standard delegated sending permissions to the system. The system acts as an SMTP bridge to dispatch messages safely from their professional address. You do not have the ability to sign into their actual Gmail inbox or read personal messages." })] })]
		}),
		inviteFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteModal, {
			employee: inviteFor,
			onClose: () => setInviteFor(null)
		})
	] });
}
function StatCard({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3 sm:p-5 min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold truncate",
			children: value
		})]
	});
}
//#endregion
export { GmailRoute as component };
