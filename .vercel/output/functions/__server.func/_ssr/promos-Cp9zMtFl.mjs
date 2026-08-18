import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQuery, n as queryOptions, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { $ as Infinity$1, M as Plus, P as Pencil, d as ToggleRight, f as ToggleLeft, m as Tag, n as X, u as Trash2, vt as CircleCheck, yt as CircleAlert } from "../_libs/lucide-react.mjs";
import { n as Button, o as Field, r as Card, s as Input } from "./AppShell-CbLCr2lg.mjs";
import { createPromoCode, deletePromoCode, listPromoCodes, updatePromoCode } from "./promo.functions-DSRL09aD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/promos-Cp9zMtFl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var promoOpts = queryOptions({
	queryKey: ["admin-promo-codes"],
	queryFn: async () => listPromoCodes(),
	staleTime: 1e4
});
var EMPTY_FORM = {
	code: "",
	description: "",
	discount_pct: 20,
	max_uses: 100,
	duration: "once",
	is_active: true,
	expires_at: ""
};
function AdminPromosPage() {
	const qc = useQueryClient();
	const { data: codes = [], isLoading } = useQuery(promoOpts);
	const createFn = useServerFn(createPromoCode);
	const updateFn = useServerFn(updatePromoCode);
	const deleteFn = useServerFn(deletePromoCode);
	const [modal, setModal] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY_FORM);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	function openCreate() {
		setForm(EMPTY_FORM);
		setErr(null);
		setModal("create");
	}
	function openEdit(p) {
		setForm({
			code: p.code,
			description: p.description ?? "",
			discount_pct: p.discount_pct,
			max_uses: p.max_uses,
			duration: p.duration,
			is_active: p.is_active,
			expires_at: p.expires_at ? p.expires_at.slice(0, 10) : ""
		});
		setErr(null);
		setModal(p);
	}
	async function handleSubmit(e) {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			const payload = {
				code: form.code.trim().toUpperCase(),
				description: form.description || void 0,
				discount_pct: form.discount_pct,
				max_uses: form.max_uses,
				duration: form.duration,
				is_active: form.is_active,
				expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : void 0
			};
			if (modal === "create") await createFn({ data: payload });
			else if (modal && typeof modal === "object") await updateFn({ data: {
				id: modal.id,
				...payload
			} });
			await qc.invalidateQueries({ queryKey: ["admin-promo-codes"] });
			setModal(null);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function handleDelete() {
		if (!pendingDelete) return;
		setDeleting(true);
		try {
			await deleteFn({ data: { id: pendingDelete.id } });
			await qc.invalidateQueries({ queryKey: ["admin-promo-codes"] });
			setPendingDelete(null);
		} finally {
			setDeleting(false);
		}
	}
	async function toggleActive(p) {
		await updateFn({ data: {
			id: p.id,
			is_active: !p.is_active
		} });
		await qc.invalidateQueries({ queryKey: ["admin-promo-codes"] });
	}
	const totalRedemptions = codes.reduce((s, c) => s + c.current_uses, 0);
	const activeCodes = codes.filter((c) => c.is_active).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-bold text-ink",
					children: "Promo Codes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[13.5px] text-ink-3",
					children: "Create and manage discount codes for marketing campaigns."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openCreate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1.5" }), " Create Code"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					{
						label: "Total codes",
						value: codes.length
					},
					{
						label: "Active codes",
						value: activeCodes
					},
					{
						label: "Total redemptions",
						value: totalRedemptions
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] uppercase tracking-wider text-ink-4",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-display text-2xl font-bold text-ink",
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-0 overflow-hidden",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-[13px] text-ink-3",
					children: "Loading codes…"
				}) : codes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center flex flex-col items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-6 w-6 text-ink-3" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13.5px] text-ink-3",
							children: "No promo codes yet. Create your first one to start a campaign."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: openCreate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1.5" }), " Create Code"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-[13px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line text-[11px] uppercase tracking-wider text-ink-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Discount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Duration"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Usage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Expires"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-5 py-3 font-medium",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-line",
							children: codes.map((p) => {
								const usagePct = p.max_uses > 0 ? Math.min(100, p.current_uses / p.max_uses * 100) : 0;
								const isExhausted = p.max_uses > 0 && p.current_uses >= p.max_uses;
								const isExpired = p.expires_at && new Date(p.expires_at) < /* @__PURE__ */ new Date();
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-ink/[0.01]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-3.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold bg-ink/[0.05] px-2 py-0.5 rounded-md",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3 text-ink-3" }),
													" ",
													p.code
												]
											}), p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-[11.5px] text-ink-3 max-w-[200px] truncate",
												children: p.description
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-primary",
												children: [p.discount_pct, "% off"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${p.duration === "forever" ? "bg-violet-500/10 text-violet-600" : "bg-sky-500/10 text-sky-600"}`,
												children: p.duration === "forever" ? "Forever" : "First month"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-3.5 min-w-[140px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex-1 h-1.5 bg-ink/[0.06] rounded-full overflow-hidden",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `h-full rounded-full transition-all ${isExhausted ? "bg-danger" : "bg-primary"}`,
														style: { width: p.max_uses === 0 ? "0%" : `${usagePct}%` }
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[12px] font-mono text-ink-3 shrink-0",
													children: [
														p.current_uses,
														" / ",
														p.max_uses === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "h-3 w-3 inline" }) : p.max_uses
													]
												})]
											}), isExhausted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-danger font-medium",
												children: "Limit reached"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 text-ink-3 text-[12px]",
											children: p.expires_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: isExpired ? "text-danger font-medium" : "",
												children: [new Date(p.expires_at).toLocaleDateString(), isExpired && " (expired)"]
											}) : "Never"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => toggleActive(p),
												className: "flex items-center gap-1.5 text-[12px] font-medium",
												title: p.is_active ? "Click to pause" : "Click to activate",
												children: p.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-600",
													children: "Active"
												})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "h-4 w-4 text-ink-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-ink-3",
													children: "Paused"
												})] })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 justify-end",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => openEdit(p),
													className: "p-1.5 rounded text-ink-3 hover:text-ink hover:bg-ink/[0.05]",
													title: "Edit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setPendingDelete(p),
													className: "p-1.5 rounded text-ink-3 hover:text-danger hover:bg-danger/[0.05]",
													title: "Delete",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})]
											})
										})
									]
								}, p.id);
							})
						})]
					})
				})
			}),
			modal !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "w-full max-w-md shadow-2xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold",
							children: modal === "create" ? "Create Promo Code" : "Edit Promo Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setModal(null),
							className: "p-1 rounded text-ink-3 hover:text-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Code",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.code,
									onChange: (e) => setForm((f) => ({
										...f,
										code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "")
									})),
									placeholder: "NAIJASTART",
									required: true,
									disabled: modal !== "create",
									className: "font-mono uppercase"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11.5px] text-ink-3 mt-1",
									children: "Letters, numbers, - and _ only. Cannot be changed after creation."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Internal description (optional)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.description,
									onChange: (e) => setForm((f) => ({
										...f,
										description: e.target.value
									})),
									placeholder: "Twitter launch campaign Q3"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Discount %",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										max: 100,
										value: form.discount_pct,
										onChange: (e) => setForm((f) => ({
											...f,
											discount_pct: parseInt(e.target.value) || 1
										})),
										required: true
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Max uses (0 = unlimited)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: form.max_uses,
										onChange: (e) => setForm((f) => ({
											...f,
											max_uses: parseInt(e.target.value) || 0
										})),
										required: true
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Discount duration",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.duration,
									onChange: (e) => setForm((f) => ({
										...f,
										duration: e.target.value
									})),
									className: "h-10 w-full rounded-md border border-line bg-background px-3 text-[13px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "once",
										children: "First month only"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "forever",
										children: "Forever (every renewal)"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Expiry date (optional)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: form.expires_at,
									onChange: (e) => setForm((f) => ({
										...f,
										expires_at: e.target.value
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "is_active",
									checked: form.is_active,
									onChange: (e) => setForm((f) => ({
										...f,
										is_active: e.target.checked
									})),
									className: "h-4 w-4 rounded accent-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "is_active",
									className: "text-[13px] font-medium",
									children: "Active (users can redeem this code)"
								})]
							}),
							form.code && form.discount_pct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-3 flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[12.5px] text-emerald-700 dark:text-emerald-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: form.code }),
										" gives ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [form.discount_pct, "% off"] }),
										" — ",
										form.duration === "forever" ? "every renewal" : "first month only",
										".",
										form.max_uses > 0 ? ` Max ${form.max_uses} uses.` : " Unlimited uses."
									]
								})]
							}),
							err && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/5 p-3 text-[12.5px] text-danger",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }),
									" ",
									err
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									onClick: () => setModal(null),
									disabled: busy,
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy,
									children: busy ? modal === "create" ? "Creating…" : "Saving…" : modal === "create" ? "Create Code" : "Save Changes"
								})]
							})
						]
					})]
				})
			}),
			pendingDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "w-full max-w-sm shadow-2xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 shrink-0 grid place-items-center rounded-md bg-danger/10 text-danger",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-semibold text-lg",
							children: "Delete code?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[13px] text-ink-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-semibold",
									children: pendingDelete.code
								}),
								" will be permanently deleted. All ",
								pendingDelete.current_uses,
								" existing redemptions will remain in the audit log."
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setPendingDelete(null),
							disabled: deleting,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "danger",
							onClick: handleDelete,
							disabled: deleting,
							children: deleting ? "Deleting…" : "Delete"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminPromosPage as component };
