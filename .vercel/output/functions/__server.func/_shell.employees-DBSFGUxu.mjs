import { o as __toESM } from "./_runtime.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { C as Send, M as Plus, Tt as BriefcaseBusiness, at as FileSpreadsheet, bt as ChevronRight, n as X, o as Upload, r as Users, u as Trash2, ut as Download, vt as CircleCheck } from "./_libs/lucide-react.mjs";
import { c as PageHeader, l as StatusPill, n as Button, o as Field, r as Card, s as Input } from "./_ssr/AppShell-Ct9NjhEH.mjs";
import { n as deleteEmployee, t as addEmployee } from "./_ssr/employees.functions-Bh7q8BeL.mjs";
import { n as clsx, t as cva } from "./_libs/class-variance-authority+clsx.mjs";
import { n as empOpts, t as domOpts } from "./_shell.employees-BdtPL3zJ.mjs";
import { t as InviteModal } from "./_ssr/InviteModal-DFrkCaIB.mjs";
import { t as twMerge } from "./_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.employees-DBSFGUxu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function BulkImportModal({ domain, onClose }) {
	const qc = useQueryClient();
	const add = useServerFn(addEmployee);
	const [csvText, setCsvText] = (0, import_react.useState)("");
	const [parsedList, setParsedList] = (0, import_react.useState)([]);
	const [importing, setImporting] = (0, import_react.useState)(false);
	const [importDone, setImportDone] = (0, import_react.useState)(false);
	const [successCount, setSuccessCount] = (0, import_react.useState)(0);
	function parseCSV(text) {
		const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
		const results = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (i === 0 && (line.toLowerCase().includes("name") || line.toLowerCase().includes("email"))) continue;
			const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
			if (parts.length >= 1 && parts[0]) {
				const fullName = parts[0];
				let localPart = parts[1] || "";
				if (!localPart) localPart = fullName.toLowerCase().replace(/[^a-z0-9]/g, ".").replace(/\.+/g, ".").replace(/^\.+|\.+$/g, "");
				const department = parts[2] || void 0;
				const jobTitle = parts[3] || void 0;
				const phone = parts[4] || void 0;
				results.push({
					fullName,
					localPart: localPart.toLowerCase(),
					department,
					jobTitle,
					phone,
					status: "ready"
				});
			}
		}
		setParsedList(results);
	}
	function handleFileUpload(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result;
			setCsvText(content);
			parseCSV(content);
		};
		reader.readAsText(file);
	}
	async function handleImport() {
		if (parsedList.length === 0) return;
		setImporting(true);
		let count = 0;
		for (const emp of parsedList) try {
			await add({ data: {
				full_name: emp.fullName,
				local_part: emp.localPart,
				domain,
				job_title: emp.jobTitle,
				department: emp.department,
				phone_number: emp.phone
			} });
			count++;
		} catch {}
		await qc.invalidateQueries({ queryKey: ["employees"] });
		setSuccessCount(count);
		setImporting(false);
		setImportDone(true);
	}
	const sampleCsvTemplate = "Full Name,Username,Department,Job Title,Phone\nJane Doe,jane.doe,Sales,Account Executive,+15550123\nAlex Smith,alex.smith,Engineering,Senior Developer,+15550124";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm",
		role: "dialog",
		"aria-modal": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-xl p-0 overflow-hidden shadow-2xl animate-fadeIn",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-line px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[16px] font-semibold text-ink",
						children: "Bulk Import Employees"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] text-ink-3",
						children: "Upload a CSV or spreadsheet to create multiple accounts at once"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "text-ink-3 hover:text-ink p-1 rounded-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-6 space-y-5",
				children: !importDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border-2 border-dashed border-line hover:border-primary/40 bg-surface-muted/40 p-6 text-center transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-8 w-8 text-primary mx-auto mb-2 opacity-80" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[13px] font-medium text-ink mb-1",
								children: "Upload employee roster (.csv)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11.5px] text-ink-3 mb-3",
								children: ["Columns: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "Full Name, Username, Department, Job Title, Phone" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-3.5 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary-focus transition",
								children: ["Choose CSV File", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: ".csv,text/csv",
									onChange: handleFileUpload,
									className: "hidden"
								})]
							})
						]
					}),
					parsedList.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[12px] font-medium text-ink-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Preview (",
							parsedList.length,
							" employees found):"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-primary font-mono font-normal",
							children: ["@", domain]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-48 overflow-y-auto rounded-lg border border-line bg-surface divide-y divide-line",
						children: parsedList.map((emp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3.5 py-2 text-[12px] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-ink font-medium",
								children: emp.fullName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-ink-3 font-mono ml-2",
								children: [
									emp.localPart,
									"@",
									domain
								]
							})] }), emp.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] bg-ink/[0.04] px-2 py-0.5 rounded text-ink-3",
								children: emp.department
							})]
						}, i))
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11.5px] text-ink-3 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Or paste CSV text:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setCsvText(sampleCsvTemplate);
								parseCSV(sampleCsvTemplate);
							},
							className: "text-primary hover:underline inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), " Load sample CSV"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: csvText,
						onChange: (e) => {
							setCsvText(e.target.value);
							parseCSV(e.target.value);
						},
						placeholder: "Jane Doe, jane.doe, Sales, Account Executive, +15550123",
						className: "w-full text-[12px] font-mono p-3 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2 pt-3 border-t border-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: onClose,
							disabled: importing,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleImport,
							disabled: importing || parsedList.length === 0,
							children: importing ? "Importing Roster…" : `Import ${parsedList.length || 0} Employees`
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-6 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-[16px] font-semibold text-ink",
							children: "Import Complete!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13px] text-ink-3",
							children: [
								"Successfully created ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: successCount }),
								" professional employee accounts under ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: ["@", domain] }),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: onClose,
							className: "mt-2",
							children: "Done"
						})
					]
				})
			})]
		})
	});
}
function EmployeesRoute() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/employees") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesList, {});
}
function EmployeesList() {
	const qc = useQueryClient();
	const { data: employees } = useSuspenseQuery(empOpts);
	const { data: domains } = useSuspenseQuery(domOpts);
	const add = useServerFn(addEmployee);
	const del = useServerFn(deleteEmployee);
	const [openAdd, setOpenAdd] = (0, import_react.useState)(false);
	const [openBulk, setOpenBulk] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [local, setLocal] = (0, import_react.useState)("");
	const [jobTitle, setJobTitle] = (0, import_react.useState)("");
	const [department, setDepartment] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [dom, setDom] = (0, import_react.useState)(domains[0]?.domain_name ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [inviteFor, setInviteFor] = (0, import_react.useState)(null);
	const [localEdited, setLocalEdited] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!localEdited && name) {
			const suggested = name.toLowerCase().replace(/[^a-z0-9]/g, ".").replace(/\.+/g, ".").replace(/^\.+|\.+$/g, "");
			if (suggested) setLocal(suggested);
		} else if (!localEdited && !name) setLocal("");
	}, [name, localEdited]);
	const allEmps = employees;
	const uniqueDepts = Array.from(new Set(allEmps.map((e) => e.department).filter(Boolean)));
	const uniquePositions = Array.from(new Set(allEmps.map((e) => e.job_title).filter(Boolean)));
	async function submit(e) {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			await add({ data: {
				full_name: name,
				local_part: local.toLowerCase(),
				domain: dom,
				job_title: jobTitle || void 0,
				department: department || void 0,
				phone_number: phone || void 0
			} });
			await qc.invalidateQueries({ queryKey: ["employees"] });
			setName("");
			setLocal("");
			setJobTitle("");
			setDepartment("");
			setPhone("");
			setLocalEdited(false);
			setOpenAdd(false);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!pendingDelete) return;
		setDeleting(true);
		try {
			await del({ data: { id: pendingDelete.id } });
			await qc.invalidateQueries({ queryKey: ["employees"] });
			setPendingDelete(null);
		} finally {
			setDeleting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Employees",
			subtitle: "Create professional addresses. Each employee connects their own Gmail via an invite link — you never sign in for them.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: () => setOpenBulk(true),
					className: "border border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 mr-1.5" }), " Bulk CSV import"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpenAdd((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1.5" }), " Add employee"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: openAdd,
			onOpenChange: setOpenAdd,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
				className: "w-full sm:max-w-md overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Add Employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Create a new professional email address and signature profile." })]
				}), domains.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-ink-3",
					children: "Add a domain first."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Jane Doe",
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Professional address",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: local,
									onChange: (e) => {
										setLocal(e.target.value.toLowerCase().replace(/\s+/g, ""));
										setLocalEdited(true);
									},
									placeholder: "jane.doe",
									required: true,
									className: "rounded-r-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: dom,
									onChange: (e) => setDom(e.target.value),
									className: "h-10 border border-l-0 border-line rounded-r-md bg-surface-muted px-2 text-[13px]",
									children: domains.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: d.domain_name,
										children: ["@", d.domain_name]
									}, d.id))
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Department",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: department,
									onChange: (e) => setDepartment(e.target.value),
									placeholder: "Sales",
									list: "dept-list"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "dept-list",
									children: uniqueDepts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: d }, d))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Position",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: jobTitle,
									onChange: (e) => setJobTitle(e.target.value),
									placeholder: "Account Executive",
									list: "pos-list"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "pos-list",
									children: uniquePositions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: p }, p))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone number (optional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								placeholder: "+1 555 0123",
								type: "tel"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetFooter, {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setOpenAdd(false),
								disabled: busy,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy,
								children: busy ? "Adding…" : "Add employee"
							})]
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-red-600 mt-2",
							children: err
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-0",
			children: employees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center flex flex-col items-center justify-center border-t border-line bg-surface-muted/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6 text-ink-3" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-ink",
						children: "No employees yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[13px] text-ink-3 max-w-sm",
						children: "Add your staff to generate their professional email addresses."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setOpenAdd(true),
						className: "mt-5",
						children: "Add employee"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-5 py-4 hover:bg-ink/[0.02] transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/employees/$id",
						params: { id: emp.id },
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium truncate",
								children: emp.full_name ?? "—"
							}), (emp.job_title || emp.department) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex w-fit items-center gap-1 rounded-md bg-ink/[0.04] px-2 py-0.5 text-[11.5px] text-ink-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { className: "h-3 w-3" }), [emp.job_title, emp.department].filter(Boolean).join(" · ")]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[12.5px] text-ink-3 font-mono truncate",
							children: emp.professional_email ?? "—"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto max-w-full mt-2 sm:mt-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: emp.status ?? "pending" }),
							!emp.gmail_connected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: (e) => {
									e.preventDefault();
									e.stopPropagation();
									setInviteFor(emp);
								},
								className: "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-2.5 text-[12.5px] text-ink-2 hover:bg-ink/[0.04]",
								title: "Send invite",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Invite"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: (e) => {
									e.preventDefault();
									e.stopPropagation();
									setPendingDelete({
										id: emp.id,
										name: emp.full_name ?? "Employee",
										email: emp.professional_email ?? "—"
									});
								},
								className: "p-1.5 text-ink-3 hover:text-danger",
								title: "Delete",
								"aria-label": "Delete employee",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-ink-3 opacity-0 group-hover:opacity-100 transition" })
						]
					})]
				}, emp.id))
			})
		}),
		pendingDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm",
			role: "dialog",
			"aria-modal": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "w-full max-w-md p-5 shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-md bg-danger/10 text-danger",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold",
							children: "Delete employee?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[13.5px] text-ink-3",
							children: [
								pendingDelete.name,
								" (",
								pendingDelete.email,
								") will be removed from the active employee list."
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => setPendingDelete(null),
						disabled: deleting,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "danger",
						onClick: remove,
						disabled: deleting,
						children: deleting ? "Deleting…" : "Delete"
					})]
				})]
			})
		}),
		inviteFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteModal, {
			employee: inviteFor,
			onClose: () => {
				setInviteFor(null);
				qc.invalidateQueries({ queryKey: ["employees"] });
			}
		}),
		openBulk && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkImportModal, {
			domain: dom || "company.com",
			onClose: () => setOpenBulk(false)
		})
	] });
}
//#endregion
export { EmployeesRoute as component };
