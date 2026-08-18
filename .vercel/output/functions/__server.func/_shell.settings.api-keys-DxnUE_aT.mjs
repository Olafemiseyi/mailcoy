import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { M as Plus, St as Check, Z as KeyRound, ht as Copy, n as X, p as Terminal, s as TriangleAlert, st as EyeOff, u as Trash2 } from "./_libs/lucide-react.mjs";
import { i as ConfirmDeleteModal, n as Button, r as Card, s as Input } from "./_ssr/AppShell-CbLCr2lg.mjs";
import { l as revokeApiKey, t as createApiKey } from "./_ssr/platform.functions-BLN5TY1B.mjs";
import { t as opts } from "./_shell.settings.api-keys-BoJ3dKDV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.api-keys-DxnUE_aT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApiKeysRoute() {
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(opts);
	const create = useServerFn(createApiKey);
	const revoke = useServerFn(revokeApiKey);
	const [openCreateModal, setOpenCreateModal] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [scopes, setScopes] = (0, import_react.useState)(["email:send", "domains:read"]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [revealKey, setRevealKey] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [copiedSnippet, setCopiedSnippet] = (0, import_react.useState)(false);
	const [revokingId, setRevokingId] = (0, import_react.useState)(null);
	const [revokingBusy, setRevokingBusy] = (0, import_react.useState)(false);
	async function handleCreate(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setError(null);
		setBusy(true);
		try {
			const r = await create({ data: {
				name,
				scopes
			} });
			await qc.invalidateQueries({ queryKey: ["api-keys"] });
			setOpenCreateModal(false);
			setName("");
			setRevealKey(r.key);
		} catch (err) {
			setError(err?.message || "Failed to generate API key");
		} finally {
			setBusy(false);
		}
	}
	const copyKey = () => {
		if (revealKey) {
			navigator.clipboard.writeText(revealKey);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		}
	};
	async function handleConfirmRevoke() {
		if (!revokingId) return;
		setRevokingBusy(true);
		try {
			await revoke({ data: { id: revokingId } });
			await qc.invalidateQueries({ queryKey: ["api-keys"] });
			setRevokingId(null);
		} catch (err) {
			alert(err?.message || "Failed to revoke key");
		} finally {
			setRevokingBusy(false);
		}
	}
	const toggleScope = (s) => {
		setScopes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-display text-xl font-bold text-ink flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-5 w-5 text-primary" }), " API Keys"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[13px] text-ink-3",
					children: "Manage secret keys to authenticate automated requests to the Mailcoy REST API."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpenCreateModal(true),
					className: "gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Create new secret key"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-0 overflow-hidden shadow-xs border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-[13.5px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line bg-surface-muted/50 text-[11.5px] uppercase tracking-wider font-semibold text-ink-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3.5",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3.5",
									children: "Secret Key"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3.5",
									children: "Permissions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3.5",
									children: "Created"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3.5 text-right",
									children: "Action"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-line",
							children: data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 5,
								className: "px-5 py-10 text-center text-ink-3",
								children: [
									"No secret API keys yet. Click ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-ink",
										children: "\"Create new secret key\""
									}),
									" to generate one."
								]
							}) }) : data.map((k) => {
								const isRevoked = Boolean(k.revoked_at);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-surface-muted/30 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 font-semibold text-ink whitespace-nowrap",
											children: k.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 font-mono text-[12.5px] text-ink-2 whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-ink",
													children: k.prefix
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-ink-4 tracking-widest",
													children: "••••••••••••••••"
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [(k.scopes || ["email:send"]).slice(0, 2).map((sc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-2 py-0.5 rounded-md bg-ink/[0.04] text-[11px] font-mono text-ink-3",
													children: sc.replace(":", ".")
												}, sc)), (k.scopes || []).length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] text-ink-4 font-mono",
													children: ["+", k.scopes.length - 2]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 text-[12.5px] text-ink-3 whitespace-nowrap",
											children: new Date(k.created_at).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 text-right whitespace-nowrap",
											children: isRevoked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11.5px] font-mono uppercase text-danger/80 bg-danger/10 px-2 py-0.5 rounded",
												children: "Revoked"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "ghost",
												onClick: () => setRevokingId(k.id),
												className: "text-danger hover:bg-danger/10 text-[12px] h-7 px-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 mr-1" }), " Revoke"]
											})
										})
									]
								}, k.id);
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 bg-surface-muted/30 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-ink font-semibold text-[13.5px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-4 w-4 text-primary" }), " Integration Quickstart"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => {
								navigator.clipboard.writeText(`curl -X POST https://api.mailcoy.com/v1/send \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "from": "sales@yourcompany.com",\n    "to": "client@gmail.com",\n    "subject": "Quote Estimation",\n    "html": "<p>Hello! Here is your custom proposal.</p>"\n  }'`);
								setCopiedSnippet(true);
								setTimeout(() => setCopiedSnippet(false), 2500);
							},
							className: "h-8 px-2.5 text-[12px] gap-1.5 hover:bg-ink/[0.05]",
							children: [copiedSnippet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copiedSnippet ? "Copied" : "Copy snippet"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[12.5px] text-ink-3",
						children: [
							"Pass your secret key in the standard ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded",
								children: "Authorization: Bearer"
							}),
							" header:"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "p-4 rounded-xl bg-ink text-background text-[12px] font-mono overflow-x-auto leading-relaxed",
						children: `curl -X POST https://api.mailcoy.com/v1/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sales@yourcompany.com",
    "to": "client@gmail.com",
    "subject": "Quote Estimation",
    "html": "<p>Hello! Here is your custom proposal.</p>"
  }'`
					})
				]
			}),
			openCreateModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-display text-lg font-bold text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-5 w-5 text-primary" }), " Create new secret key"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpenCreateModal(false),
							className: "text-ink-4 hover:text-ink transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreate,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[13px] font-semibold text-ink-2",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										autoFocus: true,
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "e.g. Production Webhook Backend",
										className: "h-10"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11.5px] text-ink-3",
										children: "A descriptive name to distinguish this key."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[12.5px] font-semibold text-ink-2",
									children: "Permissions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 gap-2",
									children: [
										{
											id: "email:send",
											label: "Send Emails",
											desc: "Route outbound mail via custom domain"
										},
										{
											id: "domains:read",
											label: "Inspect Domains",
											desc: "Check DNS records and domain status"
										},
										{
											id: "logs:read",
											label: "Read Logs",
											desc: "Query message delivery events"
										}
									].map((sc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => toggleScope(sc.id),
										className: `p-3 text-left rounded-xl border transition flex items-center justify-between ${scopes.includes(sc.id) ? "border-primary bg-primary/5 text-primary" : "border-line bg-surface text-ink-3 hover:bg-surface-muted"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[13px] font-semibold text-ink",
											children: sc.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-ink-4 mt-0.5",
											children: sc.desc
										})] }), scopes.includes(sc.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary shrink-0" })]
									}, sc.id))
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-[12.5px] text-danger",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									onClick: () => setOpenCreateModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy || !name.trim(),
									children: busy ? "Creating…" : "Create secret key"
								})]
							})
						]
					})]
				})
			}),
			revealKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-bold text-ink",
								children: "Save your secret key"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12.5px] text-ink-3",
								children: "Please save this secret key somewhere safe and accessible."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[12.5px] flex items-start gap-2.5 leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-amber-600 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"For security reasons, ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "you won't be able to view this key again" }),
								" through your account. If you lose this key, you will need to generate a new one."
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[12px] font-semibold text-ink-3",
								children: "Secret Key"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									readOnly: true,
									value: revealKey,
									className: "h-10 flex-1 rounded-xl border border-line bg-surface-muted px-3 text-[13px] font-mono text-ink outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: copyKey,
									className: "gap-1.5 shrink-0 h-10 px-4",
									children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), copied ? "Copied" : "Copy"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									setRevealKey(null);
									setCopied(false);
								},
								className: "w-full sm:w-auto",
								children: "Done / I have saved this key"
							})
						})
					]
				})
			}),
			revokingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDeleteModal, {
				title: "Revoke API Key",
				description: "Are you sure you want to revoke this API key? Any applications, forms, or automated systems using it will immediately be denied access.",
				confirmLabel: "Revoke Key",
				busy: revokingBusy,
				onConfirm: handleConfirmRevoke,
				onCancel: () => setRevokingId(null)
			})
		]
	});
}
//#endregion
export { ApiKeysRoute as component };
