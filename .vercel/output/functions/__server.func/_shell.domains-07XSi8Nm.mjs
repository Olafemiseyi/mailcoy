import { o as __toESM } from "./_runtime.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { B as MessageSquare, D as RefreshCw, M as Plus, _t as CircleQuestionMark, bt as ChevronRight, g as Sparkles, kt as ArrowUpRight, n as X, rt as Globe, u as Trash2, vt as CircleCheck, w as Search, yt as CircleAlert } from "./_libs/lucide-react.mjs";
import { c as PageHeader, i as ConfirmDeleteModal, l as StatusPill, n as Button, o as Field, r as Card, s as Input } from "./_ssr/AppShell-Ct9NjhEH.mjs";
import { a as verifyDomainNow, n as deleteDomain, t as addDomain } from "./_ssr/domains.functions-CNIeVJTl.mjs";
import { t as opts } from "./_shell.domains-TlBVp0Ab.mjs";
import { n as detectUserCurrency } from "./_ssr/currency-DDz1dxut.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.domains-07XSi8Nm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DomainsRoute() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/domains") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainsList, {});
}
function DomainsList() {
	const nav = useNavigate();
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(opts);
	const add = useServerFn(addDomain);
	const verify = useServerFn(verifyDomainNow);
	const del = useServerFn(deleteDomain);
	const [name, setName] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [verifyingId, setVerifyingId] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [deleteBusy, setDeleteBusy] = (0, import_react.useState)(false);
	const [deleteError, setDeleteError] = (0, import_react.useState)(null);
	const [showGuide, setShowGuide] = (0, import_react.useState)(false);
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	const [checkDomainInput, setCheckDomainInput] = (0, import_react.useState)("");
	const [checkingRdap, setCheckingRdap] = (0, import_react.useState)(false);
	const [rdapError, setRdapError] = (0, import_react.useState)(null);
	const [rdapResult, setRdapResult] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setCurrency(detectUserCurrency());
	}, []);
	async function handleRdapCheck(e) {
		e.preventDefault();
		const raw = checkDomainInput.trim().toLowerCase();
		if (!raw) return;
		if (!raw.includes(".") || raw.split(".").pop().length < 2) {
			setRdapError("Please enter a full domain name including the extension, e.g. mailcoy.com");
			setRdapResult(null);
			return;
		}
		setRdapError(null);
		setCheckingRdap(true);
		setRdapResult(null);
		try {
			const json = await (await fetch(`/api/registrar-detect?domain=${encodeURIComponent(raw)}`)).json();
			setRdapResult({
				domain: json.domain || raw,
				isRegistered: Boolean(json.isRegistered),
				registrarName: json.registrarName || json.registrar?.name || null,
				expiresAt: json.expiresAt || null
			});
		} catch {
			setRdapResult({
				domain: raw,
				isRegistered: false,
				registrarName: null,
				expiresAt: null
			});
		} finally {
			setCheckingRdap(false);
		}
	}
	async function onAdd(e) {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			const row = await add({ data: { name: name.trim().toLowerCase() } });
			await qc.invalidateQueries({ queryKey: ["domains"] });
			setName("");
			nav({
				to: "/domains/$id",
				params: { id: row.id }
			});
		} catch (e) {
			console.error("Add domain error:", e);
			setErr(e?.message || e?.details || (typeof e === "string" ? e : "Failed to add domain"));
		} finally {
			setBusy(false);
		}
	}
	async function onVerify(id) {
		setVerifyingId(id);
		try {
			await verify({ data: { id } });
			await qc.invalidateQueries({ queryKey: ["domains"] });
		} finally {
			setVerifyingId(null);
		}
	}
	async function onDelete() {
		if (!pendingDelete) return;
		setDeleteBusy(true);
		setDeleteError(null);
		try {
			await del({ data: { id: pendingDelete.id } });
			await qc.invalidateQueries({ queryKey: ["domains"] });
			setPendingDelete(null);
		} catch (e) {
			setDeleteError(e.message || "Failed to delete domain");
		} finally {
			setDeleteBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Domains",
			subtitle: "Add your sending domains and verify DNS."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onAdd,
					className: "flex flex-col md:flex-row gap-3 md:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Add your domain to Mailcoy",
							hint: "Works with Namecheap, Cloudflare, GoDaddy, Google Domains, or any registrar.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "e.g. yourcompany.com",
								required: true
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1.5" }), busy ? "Adding…" : "Add domain"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3.5 pt-3 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setShowGuide(true);
							setRdapResult(null);
						},
						className: "inline-flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Don't have a domain yet? Click here for free RDAP availability check & concierge options →" })]
					})
				}),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[13px] text-red-600",
					children: err
				})
			]
		}),
		showGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-xl rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-[17px] font-bold text-ink",
								children: "Need a domain for your business?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12.5px] text-ink-3",
								children: "Check live ICANN availability or let our team handle setup."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowGuide(false),
							className: "h-8 w-8 rounded-lg border border-line grid place-items-center text-ink-3 hover:text-ink hover:bg-surface-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-line bg-background p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold uppercase tracking-wider text-ink-4 block",
								children: "⚡ Instant ICANN RDAP Domain Check"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleRdapCheck,
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: checkDomainInput,
									onChange: (e) => {
										setCheckDomainInput(e.target.value);
										setRdapError(null);
									},
									placeholder: "e.g. mailcoy.com or acmebrand.ng",
									className: "flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-ink-4 outline-none focus:border-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: checkingRdap || !checkDomainInput.trim(),
									className: "h-9 px-3 text-[12.5px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 mr-1" }), checkingRdap ? "Checking..." : "Check"]
								})]
							}),
							rdapError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-[12px] text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }), rdapError]
							}),
							rdapResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-3 rounded-lg border text-[12.5px] animate-in fade-in duration-150 ${!rdapResult.isRegistered ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300" : "bg-surface-muted border-line text-ink-2"}`,
								children: !rdapResult.isRegistered ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										"🎉 ",
										rdapResult.domain,
										" is available!"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11.5px] opacity-90",
										children: "You can register this domain now below or request concierge setup."
									})] })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
											"🔒 ",
											rdapResult.domain,
											" is already registered"
										] }),
										rdapResult.registrarName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-[11.5px] text-ink-3",
											children: ["Registrar: ", rdapResult.registrarName]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11.5px] text-ink-3",
											children: "If you own this domain, you can add it directly to Mailcoy!"
										})
									] })]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-line bg-background p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full",
									children: "Option A · Self-Service (2 mins)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[12px] font-mono text-ink-3",
									children: ["~", currency === "NGN" ? "₦12,000 / yr" : "$10 - $12 / yr"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-ink-2 leading-relaxed",
								children: "Register a domain directly with any accredited domain registrar, then paste it into the box above:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(checkDomainInput.trim() || "")}`,
										target: "_blank",
										rel: "noreferrer",
										className: "flex items-center justify-center gap-1 h-9 rounded-lg border border-line bg-surface text-[12px] font-medium text-ink hover:bg-surface-muted transition",
										children: ["Namecheap ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3 text-ink-4" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://www.cloudflare.com/products/registrar/",
										target: "_blank",
										rel: "noreferrer",
										className: "flex items-center justify-center gap-1 h-9 rounded-lg border border-line bg-surface text-[12px] font-medium text-ink hover:bg-surface-muted transition",
										children: ["Cloudflare ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3 text-ink-4" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://www.godaddy.com/domains",
										target: "_blank",
										rel: "noreferrer",
										className: "flex items-center justify-center gap-1 h-9 rounded-lg border border-line bg-surface text-[12px] font-medium text-ink hover:bg-surface-muted transition",
										children: ["GoDaddy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3 text-ink-4" })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Option B · Done-For-You Concierge"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[12px] font-mono font-bold text-emerald-700 dark:text-emerald-300",
									children: currency === "NGN" ? "₦15,000 flat" : "$15 flat"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-ink-2 leading-relaxed",
								children: "Not sure how to configure DNS, SPF, DKIM, or MX records? Our specialist team will register your domain and configure 100% of the DNS records for you."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/contact",
									onClick: () => setShowGuide(false),
									className: "flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-emerald-600 text-white text-[12.5px] font-semibold hover:bg-emerald-700 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5" }), "Request Concierge Domain Setup"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowGuide(false),
									className: "px-3 h-9 rounded-lg border border-line text-[12px] text-ink-3 hover:text-ink",
									children: "Close"
								})]
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-0",
			children: data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center flex flex-col items-center justify-center border-t border-line bg-surface-muted/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-6 w-6 text-ink-3" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-ink",
						children: "No domains configured"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[13px] text-ink-3 max-w-sm",
						children: "Add your first domain to start routing professional mail through Gmail."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: data.map((d) => {
					const verified = d.verification_status === "verified";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "group px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/domains/$id",
								params: { id: d.id },
								className: "font-medium hover:underline break-all",
								children: d.domain_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-[12px] text-ink-3",
								children: ["Added ", new Date(d.created_at).toLocaleDateString()]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto max-w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: d.verification_status ?? "pending" }),
								!verified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									onClick: () => onVerify(d.id),
									disabled: verifyingId === d.id,
									className: "whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 mr-1.5 ${verifyingId === d.id ? "animate-spin" : ""}` }), verifyingId === d.id ? "Verifying…" : "Verify"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/domains/$id",
									params: { id: d.id },
									className: "inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-md border border-line px-2.5 text-[12.5px] text-ink-2 hover:bg-ink/[0.04]",
									children: ["DNS setup ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.preventDefault();
										setDeleteError(null);
										setPendingDelete({
											id: d.id,
											name: d.domain_name
										});
									},
									className: "grid h-8 w-8 place-items-center rounded-md text-ink-3 opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition",
									"aria-label": "Delete domain",
									title: "Delete domain",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							]
						})]
					}, d.id);
				})
			})
		}),
		pendingDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDeleteModal, {
			title: `Delete ${pendingDelete.name}?`,
			description: deleteError ?? "This will permanently remove the domain and its DNS configuration. You cannot delete a domain with active employee emails.",
			confirmLabel: "Yes, delete domain",
			busy: deleteBusy,
			onCancel: () => {
				setPendingDelete(null);
				setDeleteError(null);
			},
			onConfirm: onDelete
		})
	] });
}
//#endregion
export { DomainsRoute as component };
