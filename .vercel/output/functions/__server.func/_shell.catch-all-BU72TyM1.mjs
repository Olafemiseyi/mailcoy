import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { i as useQuery, o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { G as Lock, et as Inbox, it as Forward, j as Power, yt as CircleAlert } from "./_libs/lucide-react.mjs";
import { c as PageHeader, f as getMyOrganization, n as Button, o as Field, r as Card, s as Input } from "./_ssr/AppShell-Ct9NjhEH.mjs";
import { s as updateCatchAll } from "./_ssr/analytics.functions-Dak22_l7.mjs";
import { t as settingsOpts } from "./_shell.catch-all-CxyTP79J.mjs";
import { n as SwitchThumb, t as Switch } from "./_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.catch-all-BU72TyM1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatchAllRoute() {
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(settingsOpts);
	const save = useServerFn(updateCatchAll);
	const fetchOrg = useServerFn(getMyOrganization);
	const { data: org } = useQuery({
		queryKey: ["my-org"],
		queryFn: async () => fetchOrg(),
		staleTime: 6e4
	});
	const isFreePlan = org?.subscription?.planCode === "free";
	const [enabled, setEnabled] = (0, import_react.useState)((data?.catchall_mode ?? "reject") !== "reject");
	const [activeMode, setActiveMode] = (0, import_react.useState)(data?.catchall_mode === "forward" ? "forward" : "receive");
	const [forwardTo, setForwardTo] = (0, import_react.useState)(data?.catchall_forward_to ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const m = data?.catchall_mode ?? "reject";
		setEnabled(m !== "reject");
		if (m !== "reject") setActiveMode(m);
		setForwardTo(data?.catchall_forward_to ?? "");
	}, [data]);
	async function submit(e) {
		if (e) e.preventDefault();
		setErr(null);
		setSaved(false);
		setBusy(true);
		const finalMode = enabled ? activeMode : "reject";
		try {
			await save({ data: {
				catchall_mode: finalMode,
				catchall_forward_to: finalMode === "forward" ? forwardTo : null
			} });
			await qc.invalidateQueries({ queryKey: ["org-settings"] });
			setSaved(true);
			setTimeout(() => setSaved(false), 2e3);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	const options = [{
		key: "receive",
		label: "Receive to Shared Inbox",
		desc: "Unknown mail is collected and visible in your workspace logs.",
		icon: Inbox
	}, {
		key: "forward",
		label: "Forward to Address",
		desc: "Instantly forward unknown mail to a specific external inbox.",
		icon: Forward
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Catch-all mail",
		subtitle: "Manage what happens when someone sends mail to an address that doesn't match any employee or alias."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-0 max-w-2xl overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `p-6 border-b border-line flex items-center justify-between transition-colors ${enabled ? "bg-primary/[0.02]" : "bg-surface-muted"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-10 w-10 rounded-full flex items-center justify-center transition-colors ${enabled ? "bg-primary/10 text-primary" : "bg-ink/10 text-ink-3"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-[15px] font-semibold text-ink",
						children: ["Catch-all is ", enabled ? "Active" : "Disabled"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12.5px] text-ink-3 mt-0.5",
						children: enabled ? "Unknown mail is being processed." : "Unknown mail is automatically rejected (bounced)."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: enabled,
					disabled: isFreePlan,
					onCheckedChange: (c) => {
						setEnabled(c);
						setSaved(false);
					},
					className: `w-[42px] h-[24px] rounded-full relative transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 inline-flex items-center ${enabled ? "bg-primary" : "bg-ink-3/40"} ${isFreePlan ? "opacity-50 cursor-not-allowed" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: `block w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 ${enabled ? "translate-x-[21px]" : "translate-x-[3px]"}` })
				})]
			}),
			isFreePlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-10 flex flex-col items-center justify-center text-center bg-surface-muted/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold",
						children: "Catch-all is a Growth Pro feature"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13.5px] text-ink-3 mt-2 max-w-md",
						children: "Upgrade to route misaddressed emails to a shared inbox or forward them to an external address automatically."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6",
						onClick: () => {
							window.location.href = "/settings/billing";
						},
						children: "Upgrade to Growth Pro"
					})
				]
			}) : enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: options.map((o) => {
								const Icon = o.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${activeMode === o.key ? "border-primary bg-primary/[0.03]" : "border-line hover:bg-ink/[0.02]"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "catchall-mode",
										checked: activeMode === o.key,
										onChange: () => {
											setActiveMode(o.key);
											setSaved(false);
										},
										className: "mt-1 accent-primary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${activeMode === o.key ? "text-primary" : "text-ink-3"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[13.5px] font-semibold",
												children: o.label
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[12.5px] text-ink-3 mt-1 leading-relaxed",
											children: o.desc
										})]
									})]
								}, o.key);
							})
						}),
						activeMode === "receive" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-line bg-surface-muted/50 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-[12.5px] font-medium text-ink-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-4 w-4 text-ink-3" }), " Shared Inbox Route"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[12.5px] text-ink-3",
								children: [
									"Mail sent to unknown addresses (like ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-ink text-[11.5px] bg-ink/[0.05] px-1 py-0.5 rounded",
										children: "anything@your-domain.com"
									}),
									") will be stored silently. You can view these messages in the Email Logs."
								]
							})]
						}),
						activeMode === "forward" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "Forward to address",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: forwardTo,
								onChange: (e) => {
									setForwardTo(e.target.value);
									setSaved(false);
								},
								placeholder: "support@empyrehomes.com",
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11.5px] text-ink-3 mt-1.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), " Forwarded mail will appear as coming from the original sender."]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy || activeMode === "forward" && !forwardTo,
									children: busy ? "Saving…" : "Save configuration"
								}),
								saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[12.5px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded",
									children: "Saved"
								}),
								err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[12.5px] text-danger",
									children: err
								})
							]
						})
					]
				})
			}),
			!isFreePlan && !enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => submit(),
							disabled: busy,
							children: busy ? "Saving…" : "Save as Disabled"
						}),
						saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12.5px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded",
							children: "Saved"
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12.5px] text-danger",
							children: err
						})
					]
				})
			})
		]
	})] });
}
//#endregion
export { CatchAllRoute as component };
