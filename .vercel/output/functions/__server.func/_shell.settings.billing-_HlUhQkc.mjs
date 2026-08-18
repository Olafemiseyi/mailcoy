import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { O as ReceiptText, m as Tag, mt as CreditCard, n as X, rt as Globe, vt as CircleCheck, yt as CircleAlert } from "./_libs/lucide-react.mjs";
import { l as StatusPill, n as Button, r as Card, s as Input } from "./_ssr/AppShell-Ct9NjhEH.mjs";
import { n as detectUserCurrency, t as PRICING_PLANS } from "./_ssr/currency-DDz1dxut.mjs";
import { validatePromoCode } from "./_ssr/promo.functions-B0fM6xXc.mjs";
import { i as verifyPaystackReference, n as cancelSubscription, r as initPaystackCheckout, t as billingOpts } from "./_shell.settings.billing-Dk_Swgue.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.billing-_HlUhQkc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BillingPage() {
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(billingOpts);
	const init = useServerFn(initPaystackCheckout);
	const verify = useServerFn(verifyPaystackReference);
	const cancel = useServerFn(cancelSubscription);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [interval, setInterval] = (0, import_react.useState)("monthly");
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	const [promoInput, setPromoInput] = (0, import_react.useState)("");
	const [promoExpanded, setPromoExpanded] = (0, import_react.useState)(false);
	const [promoChecking, setPromoChecking] = (0, import_react.useState)(false);
	const [promoResult, setPromoResult] = (0, import_react.useState)(null);
	const validateFn = useServerFn(validatePromoCode);
	async function applyPromoCode() {
		if (!promoInput.trim()) return;
		setPromoChecking(true);
		setPromoResult(null);
		try {
			const result = await validateFn({ data: { code: promoInput.trim().toUpperCase() } });
			setPromoResult(result);
		} catch {
			setPromoResult({
				valid: false,
				message: "Could not validate code. Please try again."
			});
		} finally {
			setPromoChecking(false);
		}
	}
	function clearPromo() {
		setPromoInput("");
		setPromoResult(null);
		setPromoExpanded(false);
	}
	const activePromo = promoResult?.valid ? promoResult : null;
	(0, import_react.useEffect)(() => {
		setCurrency(detectUserCurrency());
	}, []);
	const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
	const returnedRef = params?.get("reference") ?? params?.get("trxref");
	const [verifyState, setVerifyState] = (0, import_react.useState)(returnedRef ? "checking" : "idle");
	(0, import_react.useEffect)(() => {
		if (!returnedRef || verifyState !== "checking") return;
		let alive = true;
		verify({ data: { reference: returnedRef } }).then(async (r) => {
			if (alive) setVerifyState(r.ok ? "ok" : "fail");
			await qc.invalidateQueries({ queryKey: ["billing-overview"] });
		}).catch(() => {
			if (alive) setVerifyState("fail");
		});
		return () => {
			alive = false;
		};
	}, [
		returnedRef,
		verify,
		verifyState,
		qc
	]);
	async function subscribe(planCode, amountKobo) {
		setErr(null);
		setBusy(planCode);
		try {
			const callback = `${window.location.origin}/settings/billing`;
			const { authorizationUrl } = await init({ data: {
				planCode,
				interval,
				amountKobo,
				callbackUrl: callback,
				promoCode: activePromo?.code
			} });
			window.location.href = authorizationUrl;
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Checkout failed");
			setBusy(null);
		}
	}
	async function handleCancel() {
		if (!confirm("Are you sure you want to cancel your subscription? This cannot be undone.")) return;
		setBusy("cancel");
		setErr(null);
		try {
			await cancel();
			await qc.invalidateQueries({ queryKey: ["billing-overview"] });
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed to cancel");
		} finally {
			setBusy(null);
		}
	}
	const currentPlanCode = data.subscription?.plan_code ?? "free";
	const currentPlan = PRICING_PLANS.find((p) => p.code === currentPlanCode) ?? PRICING_PLANS[0];
	const { employees: empCount, domains: domCount } = data.usage;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Billing"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-[13.5px] text-ink-3",
								children: [
									"Subscriptions powered by Paystack. All prices in ",
									currency === "NGN" ? "NGN (₦)" : "USD ($)",
									"."
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-muted text-[11.5px] font-mono text-ink-3 border border-line",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Region: ", currency === "NGN" ? "Nigeria (NGN)" : "International (USD)"] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-line bg-background p-3.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] uppercase tracking-wider text-ink-4",
											children: "Current Plan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-[17px] font-bold text-ink capitalize",
											children: data.subscription?.plan ?? (currentPlan ? currentPlan.name : "Free")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11.5px] text-ink-3 mt-0.5 font-mono",
											children: [
												"Max ",
												currentPlan.limits.domains,
												" domains · ",
												currentPlan.limits.employees,
												" staff"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-line bg-background p-3.5 flex flex-col justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] uppercase tracking-wider text-ink-4",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${data.subscription?.status === "active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-primary/10 text-primary border border-primary/20"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${data.subscription?.status === "active" ? "bg-emerald-500" : "bg-primary animate-pulse"}` }), data.subscription?.status === "active" ? "Active Subscription" : "Free Mode Active"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11.5px] text-ink-3 mt-1",
											children: data.subscription?.status === "active" ? "Auto-renews enabled" : "Full access unlocked"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-line bg-background p-3.5 flex flex-col justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] uppercase tracking-wider text-ink-4",
											children: "Next Billing Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-[14px] font-semibold text-ink",
											children: data.subscription?.current_period_end ? new Date(data.subscription.current_period_end).toLocaleDateString() : "Always Free"
										}),
										data.subscription?.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: handleCancel,
											disabled: busy === "cancel",
											className: "mt-1 text-[11.5px] text-danger hover:underline text-left font-medium disabled:opacity-50",
											children: busy === "cancel" ? "Canceling…" : "Cancel subscription"
										})
									]
								})
							]
						}),
						(empCount > currentPlan.limits.employees || domCount > currentPlan.limits.domains) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 rounded-lg border border-danger/20 bg-danger/5 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[14px] font-semibold text-danger",
								children: "Plan limits exceeded"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[13px] text-danger/80",
								children: [
									"Your workspace is currently using more resources than your ",
									currentPlan.name,
									" plan allows. Please upgrade your subscription or remove excess domains and employees to restore full functionality."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 border-t border-line pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-[14px] font-semibold",
									children: "Current Usage"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex rounded-md border border-line bg-background p-1",
									children: ["monthly", "yearly"].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setInterval(v),
										className: `h-7 rounded px-3 text-[12px] font-medium capitalize transition-colors ${interval === v ? "bg-primary text-primary-foreground shadow-sm" : "text-ink-3 hover:text-ink-2"}`,
										children: v
									}, v))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[13px] mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-ink-2",
										children: "Employees"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-ink-3 font-mono",
										children: [
											empCount,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-ink-4",
												children: "/"
											}),
											" ",
											currentPlan.limits.employees === Infinity ? "∞" : currentPlan.limits.employees
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 w-full bg-ink/[0.04] rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full ${empCount > currentPlan.limits.employees ? "bg-danger" : "bg-primary"}`,
										style: { width: `${Math.min(100, empCount / (currentPlan.limits.employees === Infinity ? Math.max(10, empCount) : currentPlan.limits.employees) * 100)}%` }
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[13px] mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-ink-2",
										children: "Domains"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-ink-3 font-mono",
										children: [
											domCount,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-ink-4",
												children: "/"
											}),
											" ",
											currentPlan.limits.domains === Infinity ? "∞" : currentPlan.limits.domains
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 w-full bg-ink/[0.04] rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full ${domCount > currentPlan.limits.domains ? "bg-danger" : "bg-primary"}`,
										style: { width: `${Math.min(100, domCount / (currentPlan.limits.domains === Infinity ? Math.max(10, domCount) : currentPlan.limits.domains) * 100)}%` }
									})
								})] })]
							})]
						}),
						verifyState === "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-[13px] text-success",
							children: "Payment verified. Your subscription is active."
						}),
						verifyState === "fail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] text-danger",
							children: "We couldn't verify that payment. If you were charged, the webhook will reconcile it shortly."
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[13px] text-red-600",
							children: err
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[13px] font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), " Card details"]
					}), data.card?.last4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-lg border border-line bg-ink text-background p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider opacity-70",
								children: data.card.brand ?? "Card"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 font-mono text-lg tracking-widest",
								children: ["•••• •••• •••• ", data.card.last4]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 text-[12px] opacity-75",
								children: [
									"Expires ",
									data.card.expMonth ?? "—",
									"/",
									data.card.expYear ?? "—"
								]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-md border border-dashed border-line p-4 text-[13px] text-ink-3",
						children: "No saved card yet. A card appears here after the first successful Paystack payment."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-line bg-surface p-4",
				children: !promoExpanded && !activePromo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setPromoExpanded(true),
					className: "inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-primary transition-colors font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3.5 w-3.5" }), " Have a promo code?"]
				}) : activePromo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[13px] font-semibold text-emerald-700 dark:text-emerald-400",
							children: activePromo.code
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-[13px] text-ink-2",
							children: activePromo.message
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: clearPromo,
						className: "p-1 rounded text-ink-3 hover:text-ink",
						title: "Remove promo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: promoInput,
								onChange: (e) => setPromoInput(e.target.value.toUpperCase()),
								placeholder: "Enter promo code",
								className: "font-mono uppercase flex-1",
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										applyPromoCode();
									}
								},
								disabled: promoChecking,
								autoFocus: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: applyPromoCode,
								disabled: promoChecking || !promoInput.trim(),
								children: promoChecking ? "Checking…" : "Apply"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: clearPromo,
								className: "p-2 rounded text-ink-3 hover:text-ink",
								title: "Cancel",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					}), promoResult && !promoResult.valid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[12.5px] text-danger",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
							" ",
							promoResult.message
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: PRICING_PLANS.map((p) => {
					const isActive = currentPlanCode === p.code;
					const isYearly = interval === "yearly";
					const baseAmountKobo = isYearly ? p.ngnYearlyKobo : p.ngnMonthlyKobo;
					const baseDisplayPrice = currency === "NGN" ? isYearly ? p.ngnYearlyDisplay : p.ngnDisplay : isYearly ? p.usdYearlyDisplay : p.usdDisplay;
					const discountedAmountKobo = activePromo && p.code !== "free" ? Math.max(1e4, Math.round(baseAmountKobo * (1 - activePromo.discountPct / 100))) : baseAmountKobo;
					const discountedDisplayPrice = activePromo && p.code !== "free" ? currency === "NGN" ? `₦${(discountedAmountKobo / 100).toLocaleString()}` : `$${Math.round(discountedAmountKobo / 100 / 1300)}` : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: `p-5 flex flex-col justify-between transition-colors ${isActive ? "border-primary bg-primary/[0.02]" : "border-line hover:border-ink/20"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold",
									children: p.name
								}), isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium tracking-wide text-primary",
									children: "CURRENT"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[12.5px] text-ink-3 min-h-[34px]",
								children: p.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex items-baseline gap-1.5 flex-wrap",
								children: discountedDisplayPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-bold tracking-tight text-emerald-600",
										children: discountedDisplayPrice
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] line-through text-ink-4",
										children: baseDisplayPrice
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[12.5px] font-normal text-ink-3",
										children: ["/ ", isYearly ? "yr" : "mo"]
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-bold tracking-tight text-ink",
									children: baseDisplayPrice
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[12.5px] font-normal text-ink-3",
									children: ["/ ", isYearly ? "yr" : "mo"]
								})] })
							}),
							discountedDisplayPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-[11px] font-medium text-emerald-600",
								children: [
									activePromo.discountPct,
									"% off — ",
									activePromo.duration === "forever" ? "every month" : "first month only"
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: isActive ? "ghost" : "primary",
							onClick: () => subscribe(p.code, discountedAmountKobo),
							disabled: busy !== null || isActive || p.code === "free",
							className: "mt-5 w-full",
							children: busy === p.code ? "Redirecting…" : isActive ? "Current plan" : p.code === "free" ? "Default Plan" : "Subscribe"
						})]
					}, p.code);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 border-b border-line flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "h-4 w-4 text-ink-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-[15px] font-semibold",
						children: "Payment history"
					})]
				}), data.events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-[13px] text-ink-3",
					children: "No payment records yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-full text-left text-[13px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-ink/[0.03] text-[11px] uppercase tracking-wider text-ink-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Reference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Status"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-line",
							children: data.events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 whitespace-nowrap",
									children: new Date(e.createdAt).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 font-mono text-[12px] text-ink-3",
									children: e.reference ?? e.eventType
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 whitespace-nowrap",
									children: e.amountKobo ? currency === "NGN" ? `₦${(e.amountKobo / 100).toLocaleString()}` : `$${Math.round(e.amountKobo / 100 / 1300)}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: e.status ?? "unknown" })
								})
							] }, e.id))
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { BillingPage as component };
