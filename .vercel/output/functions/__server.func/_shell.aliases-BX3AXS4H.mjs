import { o as __toESM } from "./_runtime.mjs";
import { n as supabase } from "./_ssr/client-eqRSUGdj.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { i as useQuery, o as useQueryClient, r as useSuspenseQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { M as Plus, P as Pencil, St as Check, g as Sparkles, n as X, u as Trash2, w as Search, xt as ChevronDown } from "./_libs/lucide-react.mjs";
import { a as CustomSelect, c as PageHeader, i as ConfirmDeleteModal, n as Button, o as Field, r as Card, s as Input } from "./_ssr/AppShell-CbLCr2lg.mjs";
import { n as deleteAlias, o as updateAliasEmployee, t as createAlias } from "./_ssr/analytics.functions-C05vrrnj.mjs";
import { n as empOpts, t as aliasesOpts } from "./_shell.aliases-CDnvotUB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.aliases-BX3AXS4H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useSuggestions() {
	return useQuery({
		queryKey: ["alias-suggestions"],
		queryFn: async () => {
			const { data: { session } } = await supabase.auth.getSession();
			const token = session?.access_token ?? "";
			const res = await fetch("/api/alias-suggestions", { headers: { Authorization: `Bearer ${token}` } });
			if (!res.ok) throw new Error("Failed to load suggestions");
			return res.json();
		},
		staleTime: 5 * 6e4,
		retry: 1
	});
}
function AliasesRoute() {
	const qc = useQueryClient();
	const { data: aliases } = useSuspenseQuery(aliasesOpts);
	const { data: employees } = useSuspenseQuery(empOpts);
	const create = useServerFn(createAlias);
	const del = useServerFn(deleteAlias);
	const updateEmp = useServerFn(updateAliasEmployee);
	const suggestionsQ = useSuggestions();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [showSuggestions, setShowSuggestions] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem("mailcoy_aliases_suggestions") === "true";
	});
	const [address, setAddress] = (0, import_react.useState)("");
	const [employeeId, setEmployeeId] = (0, import_react.useState)(employees[0]?.id ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [dismissedSuggestions, setDismissedSuggestions] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [filterText, setFilterText] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editEmployeeId, setEditEmployeeId] = (0, import_react.useState)("");
	const [savingId, setSavingId] = (0, import_react.useState)(null);
	async function submit(e) {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			await create({ data: {
				address,
				employee_id: employeeId
			} });
			await qc.invalidateQueries({ queryKey: ["aliases"] });
			await qc.invalidateQueries({ queryKey: ["alias-suggestions"] });
			setAddress("");
			setOpen(false);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	async function remove(id) {
		setDeleting(true);
		try {
			await del({ data: { id } });
			await qc.invalidateQueries({ queryKey: ["aliases"] });
			await qc.invalidateQueries({ queryKey: ["alias-suggestions"] });
		} finally {
			setDeleting(false);
			setPendingDelete(null);
		}
	}
	const quickCreate = useMutation({
		mutationFn: async ({ address, empId }) => {
			await create({ data: {
				address,
				employee_id: empId
			} });
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["aliases"] });
			qc.invalidateQueries({ queryKey: ["alias-suggestions"] });
		}
	});
	const empName = (id) => employees.find((e) => e.id === id)?.full_name ?? "—";
	const primaryEmployee = employees[0]?.id ?? "";
	const filteredAliases = aliases.filter((a) => {
		const emp = empName(a.employee_id).toLowerCase();
		const q = filterText.toLowerCase();
		return a.address.toLowerCase().includes(q) || emp.includes(q);
	});
	async function saveEmployee(id) {
		if (!editEmployeeId) return;
		setSavingId(id);
		try {
			await updateEmp({ data: {
				id,
				employee_id: editEmployeeId
			} });
			await qc.invalidateQueries({ queryKey: ["aliases"] });
			setEditingId(null);
		} catch (err) {
			console.error(err);
		} finally {
			setSavingId(null);
		}
	}
	const suggestions = (suggestionsQ.data?.suggestions ?? []).filter((s) => !dismissedSuggestions.has(s.local_part));
	const empSuggestions = (suggestionsQ.data?.employee_suggestions ?? []).filter((s) => !dismissedSuggestions.has(s.local_part));
	const hasSuggestions = suggestions.length > 0 || empSuggestions.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Aliases",
			subtitle: "Temporary and role-based addresses like sales@, support@, or promo@ that route to real employees.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setOpen((v) => !v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " New alias"]
			})
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-5 mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: address,
							onChange: (e) => setAddress(e.target.value),
							placeholder: "promo@company.com",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Routes to employee",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomSelect, {
							options: employees.map((e) => ({
								value: e.id,
								label: e.full_name
							})),
							value: employeeId,
							placeholder: "Select employee…",
							onChange: (val) => setEmployeeId(val)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy || !employeeId,
							children: busy ? "Creating…" : "Create"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setOpen(false),
							children: "Cancel"
						})]
					}),
					err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-3 text-[12.5px] text-danger",
						children: err
					})
				]
			})
		}),
		!suggestionsQ.isLoading && hasSuggestions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6 p-0 overflow-hidden border-emerald-500/20 bg-emerald-500/[0.03]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowSuggestions((s) => {
					const next = !s;
					localStorage.setItem("mailcoy_aliases_suggestions", next ? "true" : "false");
					return next;
				}),
				className: "w-full flex items-center gap-2 px-5 py-3 border-b border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-colors",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13px] font-medium text-emerald-700 dark:text-emerald-300",
						children: "Suggested aliases for your workspace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto flex items-center gap-2 text-[11.5px] text-ink-3",
						children: [
							suggestions.length + empSuggestions.length,
							" ideas",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${showSuggestions ? "rotate-180" : ""}` })
						]
					})
				]
			}), showSuggestions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pt-4 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] uppercase tracking-wider text-ink-3 mb-3",
					children: "Role-based"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
					children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex items-start gap-3 rounded-xl border border-line bg-surface p-3 hover:border-emerald-400/40 hover:bg-emerald-500/[0.04] transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5 flex-wrap",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-[13px] font-mono font-medium text-emerald-700 dark:text-emerald-300",
									children: s.suggested_address ?? s.local_part
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-[11.5px] text-ink-3 leading-relaxed",
								children: s.reason
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									if (s.suggested_address && primaryEmployee) quickCreate.mutate({
										address: s.suggested_address,
										empId: primaryEmployee
									});
									else {
										setAddress(s.suggested_address ?? `${s.local_part}@`);
										setOpen(true);
									}
								},
								disabled: quickCreate.isPending,
								className: "inline-flex h-7 items-center gap-1 rounded-md bg-emerald-600 px-2.5 text-[12px] text-white hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " Add"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDismissedSuggestions((prev) => /* @__PURE__ */ new Set([...prev, s.local_part])),
								className: "inline-flex h-7 items-center justify-center rounded-md text-ink-3 hover:bg-ink/[0.05]",
								title: "Dismiss",
								"aria-label": "Dismiss suggestion",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})]
						})]
					}, s.local_part))
				})]
			}), empSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pt-3 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] uppercase tracking-wider text-ink-3 mb-3",
					children: "Employee short-form"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
					children: empSuggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex items-start gap-3 rounded-xl border border-line bg-surface p-3 hover:border-emerald-400/40 hover:bg-emerald-500/[0.04] transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-[13px] font-mono font-medium text-emerald-700 dark:text-emerald-300",
								children: s.suggested_address ?? s.local_part
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-[11.5px] text-ink-3 leading-relaxed",
								children: s.reason
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									if (s.suggested_address) quickCreate.mutate({
										address: s.suggested_address,
										empId: s.employee_id
									});
								},
								disabled: quickCreate.isPending,
								className: "inline-flex h-7 items-center gap-1 rounded-md bg-emerald-600 px-2.5 text-[12px] text-white hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " Add"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDismissedSuggestions((prev) => /* @__PURE__ */ new Set([...prev, s.local_part])),
								className: "inline-flex h-7 items-center justify-center rounded-md text-ink-3 hover:bg-ink/[0.05]",
								title: "Dismiss",
								"aria-label": "Dismiss suggestion",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})]
						})]
					}, s.local_part))
				})]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-0 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 border-b border-line bg-surface-muted/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: filterText,
						onChange: (e) => setFilterText(e.target.value),
						placeholder: "Search address or employee...",
						className: "w-full h-9 pl-9 pr-3 rounded-md border border-line bg-background text-[13px] outline-none focus:border-primary transition-colors"
					})]
				})
			}), filteredAliases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-10 text-center text-[13.5px] text-ink-3",
				children: filterText ? "No matching aliases found." : "No aliases yet. Create role-based addresses to route inbound mail flexibly."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: filteredAliases.map((row) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[13.5px] truncate",
								children: row.address
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[12px] text-ink-3 mt-0.5",
								children: row.is_primary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Primary · routes to ", empName(row.employee_id)] }) : editingId === row.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mt-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-ink-2",
										children: "Alias · routes to"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: editEmployeeId,
										onChange: (e) => setEditEmployeeId(e.target.value),
										className: "h-7 rounded-md border border-line bg-background px-2 text-[12px] outline-none focus:border-primary max-w-[200px]",
										disabled: savingId === row.id,
										children: employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: e.id,
											children: e.full_name
										}, e.id))
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Alias · routes to ", empName(row.employee_id)] })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto max-w-full mt-2 sm:mt-0",
							children: editingId === row.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => saveEmployee(row.id),
								disabled: savingId === row.id || editEmployeeId === row.employee_id,
								className: "inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] text-primary-fg hover:bg-primary/90 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Save"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditingId(null),
								disabled: savingId === row.id,
								className: "inline-flex h-8 items-center justify-center rounded-md px-3 text-[12px] text-ink-2 hover:bg-ink/[0.05]",
								children: "Cancel"
							})] }) : !row.is_primary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setEditingId(row.id);
									setEditEmployeeId(row.employee_id);
								},
								"aria-label": "Edit routing",
								className: "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] text-ink-3 hover:text-ink hover:bg-ink/[0.05] transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), " Edit"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setPendingDelete({
									id: row.id,
									address: row.address
								}),
								"aria-label": "Delete alias",
								className: "grid h-8 w-8 place-items-center rounded-md text-ink-3 hover:text-danger hover:bg-danger/10 transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})] })
						})]
					}, row.id);
				})
			})]
		}),
		pendingDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDeleteModal, {
			title: "Delete alias?",
			description: `${pendingDelete.address} will be permanently removed.`,
			busy: deleting,
			onConfirm: () => remove(pendingDelete.id),
			onCancel: () => setPendingDelete(null)
		})
	] });
}
//#endregion
export { AliasesRoute as component };
