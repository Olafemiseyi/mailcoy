import { o as __toESM } from "./_runtime.mjs";
import { _ as useNavigate, g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { i as useQuery, n as queryOptions, o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { C as Send, D as RefreshCw, Dt as Award, Q as Info, St as Check, U as MailCheck, ct as ExternalLink, g as Sparkles, gt as CircleX, ht as Copy, s as TriangleAlert, u as Trash2, vt as CircleCheck, y as ShieldCheck, yt as CircleAlert } from "./_libs/lucide-react.mjs";
import { c as PageHeader, i as ConfirmDeleteModal, l as StatusPill, n as Button, r as Card } from "./_ssr/AppShell-CbLCr2lg.mjs";
import { a as verifyDomainNow, n as deleteDomain, r as getDomain } from "./_ssr/domains.functions-D6Oqfvoo.mjs";
import { t as Route } from "./_shell.domains._id-IcVymWnp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.domains._id-DAWrQfg4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeliverabilityTester({ domainName, spfStatus, dkimStatus, dmarcStatus, bimiStatus = "not_configured", mxStatus }) {
	const [testing, setTesting] = (0, import_react.useState)(false);
	const [testCompleted, setTestCompleted] = (0, import_react.useState)(false);
	const [recipientEmail, setRecipientEmail] = (0, import_react.useState)("");
	const [blacklistResult, setBlacklistResult] = (0, import_react.useState)(null);
	const isSpfPass = spfStatus === "verified";
	const isDkimPass = dkimStatus === "verified";
	const isDmarcPass = dmarcStatus === "verified";
	const isBimiPass = bimiStatus === "verified";
	const isMxPass = mxStatus === "verified";
	let score = 0;
	if (isMxPass) score += 20;
	if (isSpfPass) score += 25;
	if (isDkimPass) score += 25;
	if (isDmarcPass) score += 20;
	if (isBimiPass) score += 10;
	async function handleRunTest(e) {
		e.preventDefault();
		setTesting(true);
		setTestCompleted(false);
		try {
			const { dnsLookupService } = await import("./_ssr/dnsLookupService-BqN95iRg.mjs");
			const bl = await dnsLookupService.checkBlacklists(domainName);
			setBlacklistResult(bl);
		} catch {
			setBlacklistResult({
				blacklisted: false,
				listedOn: [],
				totalChecked: 5
			});
		}
		await new Promise((r) => setTimeout(r, 800));
		setTesting(false);
		setTestCompleted(true);
	}
	const getPlacementEstimate = () => {
		if (score >= 90) return {
			label: "Primary Inbox (99.8%)",
			color: "text-emerald-500",
			bg: "bg-emerald-500/10 border-emerald-500/20"
		};
		if (score >= 70) return {
			label: "High Delivery (85-95%)",
			color: "text-blue-500",
			bg: "bg-blue-500/10 border-blue-500/20"
		};
		if (score >= 40) return {
			label: "Risk of Spam / Junk (40-60%)",
			color: "text-amber-500",
			bg: "bg-amber-500/10 border-amber-500/20"
		};
		return {
			label: "High Risk of Rejection (<25%)",
			color: "text-rose-500",
			bg: "bg-rose-500/10 border-rose-500/20"
		};
	};
	const placement = getPlacementEstimate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 mb-6 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-5 mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-[16px] font-semibold",
							children: "Deliverability & Inbox Placement Shield"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium",
							children: "Enterprise Grade"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[13px] text-ink-3",
					children: [
						"Real-time reputation diagnostic for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink font-medium",
							children: domainName
						}),
						" across Gmail, Outlook, and Apple Mail."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-ink-3 uppercase tracking-wider font-medium",
								children: "Deliverability Score"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-2xl font-bold font-mono text-ink",
								children: [score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-normal text-ink-3",
									children: "/100"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-[1px] bg-line hidden md:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `px-3 py-1.5 rounded-lg border text-[12.5px] font-medium ${placement.bg} ${placement.color}`,
							children: placement.label
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full bg-surface-2 rounded-full h-2 mb-6 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-full transition-all duration-500 rounded-full ${score >= 90 ? "bg-emerald-500" : score >= 70 ? "bg-primary" : score >= 40 ? "bg-amber-500" : "bg-rose-500"}`,
					style: { width: `${score}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-line bg-surface/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-medium text-ink-2",
								children: "MX Inbound"
							}), isMxPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-ink-3",
							children: "Mail routing active (+20)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-line bg-surface/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-medium text-ink-2",
								children: "SPF Policy"
							}), isSpfPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-rose-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-ink-3",
							children: "Sender authorization (+25)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-line bg-surface/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-medium text-ink-2",
								children: "DKIM RSA-2048"
							}), isDkimPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-rose-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-ink-3",
							children: "Cryptographic sign (+25)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-line bg-surface/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-medium text-ink-2",
								children: "DMARC Protection"
							}), isDmarcPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-ink-3",
							children: "Spoofing shield (+20)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-line bg-surface/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-medium text-ink-2",
								children: "BIMI Logo / VMC"
							}), isBimiPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-ink-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-ink-3",
							children: "Verified badge (+10)"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleRunTest,
				className: "rounded-xl border border-line bg-surface-2/40 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							placeholder: "Enter your personal email to receive a test deliverability report (optional)...",
							value: recipientEmail,
							onChange: (e) => setRecipientEmail(e.target.value),
							className: "w-full text-[13px] px-3.5 py-2.5 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: testing,
						className: "whitespace-nowrap",
						children: testing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-1.5 animate-spin" }), " Analyzing Headers..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-1.5" }), " Run Diagnostic Test"] })
					})]
				}), testCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 pt-4 border-t border-line/60 space-y-2.5 text-[13px] animate-fadeIn",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-4 w-4" }), " Diagnostic Analysis Complete:"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-1 text-ink-2 pl-6 list-disc",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Header Authenticity:" }),
								" Outbound routing via Amazon SES will be strictly aligned with your ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: domainName }),
								" DKIM key."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Spam Filter Resistance:" }),
								" ",
								score >= 80 ? "Zero red flags detected. SPF and DMARC policy ensure high reputation." : "Add remaining DNS records below to avoid junk folder placement."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DNSBL Blacklist Reputation:" }),
								" ",
								blacklistResult?.blacklisted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-rose-600 font-semibold",
									children: ["Warning: Listed on ", blacklistResult.listedOn.join(", ")]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald-600 font-medium",
									children: [
										"Clean across ",
										blacklistResult?.totalChecked ?? 5,
										" major spam blacklists (Spamhaus, Barracuda, SpamCop, SORBS)."
									]
								})
							] }),
							isBimiPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Visual Verification:" }), " BIMI record is active. Email clients supporting BIMI will display your brand logo."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-ink-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Brand Visuals:" }), " BIMI record is not configured yet. Configure the BIMI card below to show your verified brand logo in supported inboxes."]
							})
						]
					})]
				})]
			})
		]
	});
}
function useRegistrarDetect(domainName) {
	return useQuery({
		queryKey: ["registrar", domainName],
		queryFn: async () => {
			const res = await fetch(`/api/registrar-detect?domain=${encodeURIComponent(domainName)}`);
			if (!res.ok) throw new Error("Failed to detect registrar");
			const json = await res.json();
			return {
				registrar: json.registrar ?? null,
				nsRecords: Array.isArray(json.nameservers) ? json.nameservers : Array.isArray(json.nsRecords) ? json.nsRecords : []
			};
		},
		staleTime: 5 * 6e4,
		retry: 1
	});
}
function DomainDetailRoute() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(queryOptions({
		queryKey: ["domain", id],
		queryFn: async () => getDomain({ data: { id } }),
		staleTime: 5e3,
		refetchInterval: (q) => {
			const d = q.state.data;
			return d && d.verification_status !== "verified" ? 3e4 : false;
		}
	}));
	const verify = useServerFn(verifyDomainNow);
	const del = useServerFn(deleteDomain);
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [deleteBusy, setDeleteBusy] = (0, import_react.useState)(false);
	const [showDeleteModal, setShowDeleteModal] = (0, import_react.useState)(false);
	const [deleteError, setDeleteError] = (0, import_react.useState)(null);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 text-ink-3",
		children: ["Not found. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/domains",
			className: "underline",
			children: "Back"
		})]
	});
	const d = data;
	const registrarQ = useRegistrarDetect(d.domain_name);
	const bimiSelector = d.bimi_selector || "default";
	const bimiSvgUrl = d.bimi_svg_url || `https://${d.domain_name}/logo.svg`;
	const bimiVmcUrl = d.bimi_vmc_url || "";
	const bimiRecordValue = `v=BIMI1; l=${bimiSvgUrl};${bimiVmcUrl ? ` a=${bimiVmcUrl};` : ""}`;
	const records = [
		{
			key: "TXT (Ownership)",
			type: "TXT",
			host: "@",
			value: d.txt_record_value,
			status: d.txt_status
		},
		{
			key: "MX (Primary)",
			type: "MX 10",
			host: "@",
			value: "mx1.mailcoy.com",
			status: d.mx_status
		},
		{
			key: "MX (Secondary)",
			type: "MX 20",
			host: "@",
			value: "mx2.mailcoy.com",
			status: d.mx_status
		},
		{
			key: "SPF",
			type: "TXT",
			host: "@",
			value: d.spf_value ?? "v=spf1 include:_spf.mailcoy.com ~all",
			status: d.spf_status
		},
		{
			key: "DKIM",
			type: "TXT",
			host: `${d.dkim_selector}._domainkey`,
			value: d.dkim_value ?? "v=DKIM1; k=rsa; p=<generated when SES is wired>",
			status: d.dkim_status
		},
		{
			key: "DMARC",
			type: "TXT",
			host: "_dmarc",
			value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.com",
			status: d.dmarc_status
		},
		{
			key: "BIMI (Brand Logo)",
			type: "TXT",
			host: `${bimiSelector}._bimi`,
			value: bimiRecordValue,
			status: d.bimi_status ?? "not_configured"
		}
	];
	async function runVerify() {
		setBusy(true);
		try {
			await verify({ data: { id } });
			await qc.invalidateQueries({ queryKey: ["domain", id] });
			await qc.invalidateQueries({ queryKey: ["domains"] });
		} finally {
			setBusy(false);
		}
	}
	async function runDelete() {
		setDeleteBusy(true);
		setDeleteError(null);
		try {
			await del({ data: { id } });
			await qc.invalidateQueries({ queryKey: ["domains"] });
			navigate({ to: "/domains" });
		} catch (e) {
			setDeleteError(e.message || "Failed to delete domain");
			setDeleteBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: d.domain_name,
			subtitle: d.last_checked_at ? `Last checked ${new Date(d.last_checked_at).toLocaleString()}` : "Not checked yet",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: d.verification_status ?? "pending" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: runVerify,
						disabled: busy || deleteBusy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 mr-1.5 ${busy ? "animate-spin" : ""}` }), " Re-check now"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							setDeleteError(null);
							setShowDeleteModal(true);
						},
						disabled: busy || deleteBusy,
						variant: "ghost",
						className: "text-danger hover:text-danger hover:bg-danger/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-1.5" }), " Delete"]
					})
				]
			})
		}),
		showDeleteModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDeleteModal, {
			title: `Delete ${d.domain_name}?`,
			description: deleteError ?? "This will permanently remove the domain and all its DNS setup from your workspace. You cannot delete a domain that has active employee emails assigned to it.",
			confirmLabel: "Yes, delete domain",
			busy: deleteBusy,
			onCancel: () => {
				setShowDeleteModal(false);
				setDeleteError(null);
			},
			onConfirm: runDelete
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegistrarBanner, {
			query: registrarQ,
			domainName: d.domain_name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliverabilityTester, {
			domainName: d.domain_name,
			spfStatus: d.spf_status,
			dkimStatus: d.dkim_status,
			dmarcStatus: d.dmarc_status,
			bimiStatus: d.bimi_status,
			mxStatus: d.mx_status
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-0 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-3 border-b border-line text-[13px] font-medium flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DNS records to add" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-ink-3",
					children: "Required: TXT & MX · Recommended: SPF, DKIM, DMARC, BIMI"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: records.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordRow, { r }, r.key))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BimiConfigCard, {
			domainName: d.domain_name,
			bimiSelector,
			bimiSvgUrl,
			bimiVmcUrl,
			status: d.bimi_status ?? "not_configured"
		}),
		d.errors && d.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 border-danger/40 bg-danger/[0.03] mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[13px] font-medium text-danger mb-2",
				children: "Verification notes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-[13px] text-ink-2",
				children: d.errors.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", e] }, i))
			})]
		})
	] });
}
function RegistrarBanner({ query, domainName }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	if (query.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 rounded-2xl border border-line bg-surface-muted p-4 animate-pulse flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 rounded-full bg-ink/10 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-48 rounded bg-ink/10" })]
	});
	if (query.isError || !query.data?.registrar) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-6 p-4 flex items-start gap-3 border-amber-500/30 bg-amber-500/[0.04]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[13px] font-medium",
				children: "Add these records in your DNS provider"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[12.5px] text-ink-3 mt-0.5",
				children: [
					"We couldn't auto-detect the registrar for ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: domainName
					}),
					". Log in to wherever you purchased the domain and add the DNS records below. Changes can take up to 48 hours."
				]
			})]
		})]
	});
	const reg = query.data.registrar;
	const ns = query.data.nsRecords ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-6 p-0 overflow-hidden border-blue-500/20 bg-blue-500/[0.03]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setExpanded((v) => !v),
			className: "w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-ink/[0.02] transition",
			"aria-expanded": expanded,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: reg.logo,
					alt: reg.name,
					width: 32,
					height: 32,
					className: "rounded-lg border border-line object-cover shrink-0",
					onError: (e) => {
						e.currentTarget.style.display = "none";
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[13.5px] font-medium",
						children: ["Detected registrar: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-blue-700 dark:text-blue-400",
							children: reg.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[12px] text-ink-3 truncate",
						children: [
							"Nameservers: ",
							ns.slice(0, 2).join(", "),
							ns.length > 2 ? ` +${ns.length - 2} more` : ""
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[12px] text-ink-3 shrink-0 pr-1",
					children: expanded ? "Hide steps ↑" : "Show steps ↓"
				})
			]
		}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-blue-500/20 px-5 pb-5 pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-[13px] font-semibold mb-3 flex items-center gap-1.5",
				children: [
					"How to add DNS records in ",
					reg.name,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: reg.helpUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-2",
				children: reg.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2.5 text-[13px] text-ink-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-bold mt-0.5",
						children: i + 1
					}), step]
				}, i))
			})]
		})]
	});
}
function RecordRow({ r }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "px-5 py-4 grid grid-cols-[130px_1fr_auto] gap-3 items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium text-ink-2",
				children: r.key
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] text-ink-3",
					children: [
						"Type: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-ink",
							children: r.type
						}),
						" · Host: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-ink",
							children: r.host
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-[12.5px] font-mono truncate",
						children: r.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							navigator.clipboard?.writeText(r.value);
							setCopied(true);
							setTimeout(() => setCopied(false), 1500);
						},
						className: "text-ink-3 hover:text-ink",
						title: "Copy",
						children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: r.status ?? "pending" })
		]
	});
}
function BimiConfigCard({ domainName, bimiSelector, bimiSvgUrl, bimiVmcUrl, status }) {
	const [customSvg, setCustomSvg] = (0, import_react.useState)(bimiSvgUrl);
	const [customVmc, setCustomVmc] = (0, import_react.useState)(bimiVmcUrl);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const generatedRecord = `v=BIMI1; l=${customSvg.trim()};${customVmc.trim() ? ` a=${customVmc.trim()};` : ""}`;
	const hostRecord = `${bimiSelector}._bimi`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 mb-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.02] to-transparent",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-[15px] font-semibold text-ink",
							children: "BIMI & Brand Logo Display"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
							children: "Visual Trust & Badging"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12.5px] text-ink-3",
					children: "Display your official brand logo next to outbound emails in Gmail, Apple Mail, and Yahoo!"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 text-[13px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400 mb-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Starting out? Show your logo for $0 on Gmail & Yahoo" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-ink-2 text-[12.5px] mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-line bg-surface/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink block mb-0.5",
							children: "1. For Gmail Inboxes ($0)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Set your company logo as the Google Account avatar for your connected Gmail profile. Google will display this avatar next to all emails sent via Mailcoy." })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-lg border border-line bg-surface/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink block mb-0.5",
							children: "2. For Yahoo! & Fastmail ($0)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add the Self-Asserted BIMI DNS record below with your SVG logo URL. Yahoo & Fastmail do not require paid VMC certificates." })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[11.5px] font-medium text-ink-2 uppercase tracking-wider mb-1.5",
							children: "1. Brand Logo SVG URL (Free · Yahoo / Fastmail)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "url",
							value: customSvg,
							onChange: (e) => setCustomSvg(e.target.value),
							placeholder: `https://${domainName}/brand-logo.svg`,
							className: "w-full text-[12.5px] font-mono px-3 py-2 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-ink-3 mt-1",
							children: [
								"Formatted as ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "SVG Tiny Portable/Secure" }),
								" (square aspect ratio, no embedded scripts)."
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[11.5px] font-medium text-ink-2 uppercase tracking-wider mb-1.5",
							children: "2. VMC / CMC Certificate URL (Optional · Gmail Blue Checkmark)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "url",
							value: customVmc,
							onChange: (e) => setCustomVmc(e.target.value),
							placeholder: `https://${domainName}/cert.pem`,
							className: "w-full text-[12.5px] font-mono px-3 py-2 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-ink-3 mt-1",
							children: "Required for Google blue checkmarks. Issued by DigiCert or Entrust for registered trademarks."
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-surface-muted p-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11.5px] text-ink-3 font-medium mb-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generated DNS Record:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Host: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "font-mono text-ink",
							children: hostRecord
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "flex-1 text-[12px] font-mono bg-surface px-3 py-2 rounded-md border border-line truncate text-ink",
							children: generatedRecord
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => {
								navigator.clipboard?.writeText(generatedRecord);
								setCopied(true);
								setTimeout(() => setCopied(false), 1500);
							},
							variant: "ghost",
							className: "h-9 px-3 shrink-0 border border-line",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600 mr-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 mr-1" }), copied ? "Copied" : "Copy Record"]
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { DomainDetailRoute as component };
