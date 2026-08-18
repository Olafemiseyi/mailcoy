import { o as __toESM } from "../_runtime.mjs";
import { v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { H as Mail, K as LoaderCircle, St as Check, _ as Smartphone, ht as Copy, s as TriangleAlert, vt as CircleCheck, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { a as startGmailByInvite, n as getInviteByToken } from "./invitations.functions-inHC0CeB.mjs";
import { t as Route } from "./invite._token-BHW95o2O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invite._token-mU_fG9oX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InvitePage() {
	const { token } = Route.useParams();
	const search = useSearch({ from: "/invite/$token" });
	const start = useServerFn(startGmailByInvite);
	const [redirecting, setRedirecting] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const isMobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);
	const query = useQuery({
		queryKey: ["invite", token],
		queryFn: () => getInviteByToken({ data: { token } }),
		staleTime: 15e3
	});
	const connect = useMutation({
		mutationFn: async () => {
			setRedirecting(true);
			const { authorizationUrl } = await start({ data: {
				token,
				redirectOrigin: window.location.origin
			} });
			window.location.href = authorizationUrl;
		},
		onError: () => setRedirecting(false)
	});
	if (query.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-center gap-2 text-ink-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading invite…"]
	}) });
	if (query.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: query.error.message }) });
	const res = query.data;
	if (!res || !res.ok) {
		const reason = res?.reason;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: reason === "expired" ? "This invitation has expired. Ask your admin to send a new one." : reason === "revoked" ? "This invitation has been revoked." : "This invitation link is not valid." }) });
	}
	const orgName = res.organization?.name ?? "your workspace";
	const emp = res.employee;
	const gmail = res.gmail;
	const alreadyDone = !!gmail;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-grid place-items-center h-14 w-14 rounded-2xl bg-ink text-white mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Connect your Gmail"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[13.5px] text-ink-3",
					children: [orgName, " invited you to send business email from a professional address using your own Google account."]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-line bg-white/60 dark:bg-white/[0.02] p-5 mb-5 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					label: "You are",
					value: emp?.full_name ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					label: "Business email",
					value: emp?.professional_email ?? "—",
					mono: true
				}),
				emp?.job_title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					label: "Role",
					value: emp.job_title + (emp.department ? " · " + emp.department : "")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					label: "Organization",
					value: orgName
				})
			]
		}),
		alreadyDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: "Gmail connected"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[13px] text-ink-3 mt-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: gmail.google_email
								}),
								" is now linked to",
								" ",
								emp?.professional_email,
								". You can now receive emails."
							]
						})]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line bg-white/60 dark:bg-white/[0.02] overflow-hidden shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-line bg-surface-muted/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-semibold text-[14px] flex items-center gap-2",
						children: ["Final Step: Send as ", emp?.professional_email]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12.5px] text-ink-3 mt-1.5",
						children: "To remove the \"via gmail.com\" warning so your emails look 100% professional to clients, configure your Gmail to send through our secure servers."
					})]
				}), isMobile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 text-center bg-orange-500/5 border-b border-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-6 w-6 text-orange-500 mx-auto mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] font-medium text-orange-700 dark:text-orange-400",
							children: "Mobile Device Detected"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12.5px] text-orange-600/80 dark:text-orange-400/80 mt-1 mb-3",
							children: "Google does not allow changing these settings from a phone."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-[13px] font-medium bg-white dark:bg-ink border border-line px-4 py-2 rounded-lg shadow-sm w-full",
							onClick: () => alert("We will email you a reminder link to finish this on your computer!"),
							children: "Email me these instructions"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5 space-y-5 text-[13px] text-ink-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5",
									children: "1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "leading-relaxed",
									children: [
										"Open your",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "https://mail.google.com/mail/u/0/#settings/accounts",
											target: "_blank",
											rel: "noreferrer",
											className: "font-medium text-primary hover:underline",
											children: "Gmail Settings"
										}),
										" ",
										"(we'll open it in a new tab)."
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5",
									children: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "leading-relaxed",
									children: [
										"In the \"Send mail as\" section, find ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: emp?.professional_email }),
										" (we already added it for you!) and click ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-600 font-medium",
											children: "edit info"
										}),
										"."
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5",
									children: "3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "leading-relaxed w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2",
										children: "Paste these exact credentials into the popup and click Save:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-line bg-surface-muted overflow-hidden",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 text-[12px] divide-x divide-line border-b border-line",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-2.5 px-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider",
														children: "SMTP Server"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-medium",
														children: "smtp.resend.com"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-2.5 px-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider",
														children: "Port"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-medium",
														children: "465"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 px-3 border-b border-line",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider",
													children: "Username"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: "resend"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 px-3 bg-white dark:bg-ink flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider",
													children: "Password"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium text-ink-3 italic",
													children: "re_YourGeneratedKeyHere..."
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														navigator.clipboard.writeText("re_YourGeneratedKeyHere...");
														setCopied(true);
														setTimeout(() => setCopied(false), 2e3);
													},
													className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink text-white text-[12px] font-medium hover:bg-ink/90 transition-colors",
													children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copied!" : "Copy"]
												})]
											})
										]
									})]
								})]
							})
						]
					})
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			search.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-700 dark:text-red-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: search.error })]
			}),
			connect.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-700 dark:text-red-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: connect.error?.message ?? "Something went wrong" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => connect.mutate(),
				disabled: redirecting || connect.isPending,
				className: "w-full h-11 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 disabled:opacity-60 inline-flex items-center justify-center gap-2 whitespace-nowrap",
				children: redirecting || connect.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Redirecting to Google…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleGlyph, {}), " Continue with Google"] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start gap-2 text-[12px] text-ink-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "You will be taken to Google to sign in. Mailcoy never sees your Google password. You can disconnect at any time." })]
			})
		] })
	] });
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh grid place-items-center px-4 py-10 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md",
			children
		})
	});
}
function InfoRow({ label, value, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11.5px] uppercase tracking-wider text-ink-3",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `text-[13.5px] truncate ${mono ? "font-mono" : "font-medium"}`,
			children: value
		})]
	});
}
function ErrorState({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6 text-red-600 mx-auto mb-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[14px] font-medium",
				children: "Invitation unavailable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[13px] text-ink-3",
				children: message
			})
		]
	});
}
function GoogleGlyph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#EA4335",
			d: "M12 10.2v3.9h5.5c-.24 1.4-1.63 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.15.8 3.88 1.5l2.65-2.55C16.9 3.3 14.7 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c6.9 0 9.5-4.85 9.5-8.3 0-.55-.05-.98-.13-1.4H12z"
		})
	});
}
//#endregion
export { InvitePage as component };
