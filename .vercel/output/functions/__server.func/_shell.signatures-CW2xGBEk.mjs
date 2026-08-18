import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { M as Plus, i as User, u as Trash2, wt as Building2 } from "./_libs/lucide-react.mjs";
import { a as CustomSelect, c as PageHeader, i as ConfirmDeleteModal, n as Button, o as Field, r as Card, s as Input } from "./_ssr/AppShell-Ct9NjhEH.mjs";
import { n as opts, r as upsertSignature, t as deleteSignature } from "./_shell.signatures-d_z5jg_3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.signatures-CW2xGBEk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignatureRoute() {
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(opts);
	const org = data.org;
	const employeeSigs = data.employees ?? [];
	const allEmployees = data.allEmployees ?? [];
	const save = useServerFn(upsertSignature);
	const del = useServerFn(deleteSignature);
	const saveM = useMutation({
		mutationFn: (v) => save({ data: v }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["signatures"] })
	});
	const delM = useMutation({
		mutationFn: (id) => del({ data: { id } }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["signatures"] })
	});
	const [pendingDeleteSig, setPendingDeleteSig] = (0, import_react.useState)(null);
	const usedEmpIds = (0, import_react.useMemo)(() => new Set(employeeSigs.map((s) => s.scope_ref)), [employeeSigs]);
	const availableEmployees = allEmployees.filter((e) => !usedEmpIds.has(e.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Signatures & Templates",
			subtitle: "Configure company-wide email signatures and individual employee overrides."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgSignatureCard, {
				initial: org,
				onSave: (v) => saveM.mutate({
					scope: "org",
					scope_ref: null,
					name: v.name,
					html: v.html
				}),
				saving: saveM.isPending
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex items-center justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-[16.5px] font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4.5 w-4.5 text-emerald-600" }), "Per-Employee Signature Overrides"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12.5px] text-ink-3 mt-0.5",
					children: "Overrides company default for specific employees."
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [employeeSigs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeSignatureCard, {
					sig: s,
					onSave: (v) => saveM.mutate({
						scope: "employee",
						scope_ref: s.scope_ref,
						name: v.name,
						html: v.html
					}),
					onDelete: () => setPendingDeleteSig({
						id: s.id,
						name: s.employee_name ?? s.professional_email ?? "Employee"
					}),
					saving: saveM.isPending,
					deleting: delM.isPending
				}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddEmployeeSignature, {
					employees: availableEmployees,
					onCreate: (v) => saveM.mutate({
						scope: "employee",
						scope_ref: v.employee_id,
						name: v.name,
						html: v.html
					}),
					saving: saveM.isPending
				})]
			})]
		}),
		pendingDeleteSig && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDeleteModal, {
			title: "Remove custom signature?",
			description: `The custom signature template for ${pendingDeleteSig.name} will be deleted.`,
			confirmLabel: "Remove",
			busy: delM.isPending,
			onConfirm: () => {
				delM.mutate(pendingDeleteSig.id);
				setPendingDeleteSig(null);
			},
			onCancel: () => setPendingDeleteSig(null)
		})
	] });
}
function OrgSignatureCard({ initial, onSave, saving }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "Company default");
	const [html, setHtml] = (0, import_react.useState)(initial?.html ?? "");
	(0, import_react.useEffect)(() => {
		setName(initial?.name ?? "Company default");
		setHtml(initial?.html ?? "");
	}, [initial]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-[15px] font-semibold",
				children: "Company Default Template"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				onSave({
					name,
					html
				});
			},
			className: "grid gap-4 lg:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Template Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Signature HTML / Text",
						hint: "Placeholders: {name}, {title}, {department}, {company}, {email}",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: html,
							onChange: (e) => setHtml(e.target.value),
							rows: 7,
							placeholder: "--\n{name} | {title}\n{department} at {company}\n{email}",
							className: "w-full rounded-md border border-line bg-background px-3 py-2.5 text-[13px] font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: saving,
						children: saving ? "Saving…" : "Save default template"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewCard, {
				html,
				title: "Live Preview",
				inline: true
			})]
		})]
	});
}
function EmployeeSignatureCard({ sig, onSave, onDelete, saving, deleting }) {
	const [name, setName] = (0, import_react.useState)(sig.name);
	const [html, setHtml] = (0, import_react.useState)(sig.html);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-[15px] font-semibold truncate",
						children: sig.employee_name ?? sig.professional_email ?? "Employee"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-0.5 text-[12px] text-ink-3 font-mono truncate",
					children: [
						sig.professional_email,
						" ",
						sig.department ? `· ${sig.department}` : ""
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onDelete,
				disabled: deleting,
				type: "button",
				className: "p-1.5 text-ink-3 hover:text-danger",
				title: "Remove override",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				onSave({
					name,
					html
				});
			},
			className: "grid gap-4 lg:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Override Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Signature HTML",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: html,
							onChange: (e) => setHtml(e.target.value),
							rows: 5,
							className: "w-full rounded-md border border-line bg-background px-3 py-2.5 text-[13px] font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: saving,
						children: saving ? "Saving…" : "Save override"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewCard, {
				html,
				title: "Employee Override Preview",
				inline: true
			})]
		})]
	});
}
function AddEmployeeSignature({ employees, onCreate, saving }) {
	const [empId, setEmpId] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("Personal signature");
	const [html, setHtml] = (0, import_react.useState)("");
	if (employees.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 border-dashed bg-surface-muted/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-[15px] font-semibold",
				children: "Add Individual Employee Signature Override"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				if (!empId) return;
				onCreate({
					employee_id: empId,
					name,
					html
				});
				setEmpId("");
				setHtml("");
			},
			className: "grid gap-3 md:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Employee",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomSelect, {
						value: empId,
						onChange: (val) => setEmpId(val),
						placeholder: "Select employee…",
						options: employees.map((e) => ({
							value: e.id,
							label: `${e.full_name ?? e.professional_email} (${e.department ?? "General"})`
						}))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Override Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Signature HTML",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: html,
							onChange: (e) => setHtml(e.target.value),
							rows: 4,
							placeholder: "--\n{name} | {job_title}\n{company}",
							className: "w-full rounded-md border border-line bg-background px-3 py-2.5 text-[13px] font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: saving || !empId,
						children: saving ? "Saving…" : "Create employee override"
					})
				})
			]
		})]
	});
}
function PreviewCard({ html, title, inline }) {
	const rendered = (html || "Regards,<br/><strong>{name}</strong><br/>{title} at {company}<br/><span style='color: #64748b;'>{email}</span>").replace(/\{name\}/g, "John Doe").replace(/\{title\}/g, "Sales Director").replace(/\{department\}/g, "Sales").replace(/\{company\}/g, "Mailcoy Technologies").replace(/\{email\}/g, "john@mailcoy.com");
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-md border border-line bg-background p-4 min-h-[160px] text-[13.5px] text-ink leading-relaxed font-sans space-y-1 shadow-xs",
		dangerouslySetInnerHTML: { __html: /<[a-z][\s\S]*>/i.test(rendered) ? rendered : rendered.replace(/\n/g, "<br/>") }
	});
	if (inline) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-wider text-ink-3 mb-2",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1",
			children: body
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 flex flex-col h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-wider text-ink-3 mb-2",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1",
			children: body
		})]
	});
}
//#endregion
export { SignatureRoute as component };
