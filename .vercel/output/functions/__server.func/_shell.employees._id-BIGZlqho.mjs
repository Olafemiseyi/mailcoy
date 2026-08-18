import { o as __toESM } from "./_runtime.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { H as Mail, Mt as ArrowDownLeft, Nt as Activity, jt as ArrowLeft, kt as ArrowUpRight, n as X, ot as Eye, v as Shield } from "./_libs/lucide-react.mjs";
import { c as PageHeader, l as StatusPill, n as Button, r as Card } from "./_ssr/AppShell-CbLCr2lg.mjs";
import { a as updateEmployee } from "./_ssr/employees.functions-BT6KfZ01.mjs";
import { i as Area, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "./_libs/recharts+[...].mjs";
import { t as InviteModal } from "./_ssr/InviteModal-C8Yfo0p4.mjs";
import { n as detailOpts, t as Route } from "./_shell.employees._id-CclAB98G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.employees._id-BIGZlqho.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmployeeDetailRoute() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(detailOpts(id));
	const emp = data.employee;
	const aliases = data.aliases;
	const gmail = data.gmail;
	const stats = data.stats;
	const [selectedMessage, setSelectedMessage] = (0, import_react.useState)(null);
	const [showInvite, setShowInvite] = (0, import_react.useState)(false);
	const [offboarding, setOffboarding] = (0, import_react.useState)(false);
	const offboardFn = useServerFn(updateEmployee);
	const chartData = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (let i = 6; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - i);
			const label = d.toLocaleDateString(void 0, { weekday: "short" });
			const key = d.toISOString().split("T")[0];
			map.set(key, {
				label,
				sent: 0,
				received: 0
			});
		}
		data.messages.forEach((m) => {
			const dateKey = new Date(m.timestamp).toISOString().split("T")[0];
			const entry = map.get(dateKey);
			if (entry) if (m.direction === "outgoing") entry.sent++;
			else entry.received++;
		});
		return Array.from(map.values());
	}, [data.messages]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/employees",
			className: "mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to employees"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: emp.full_name ?? emp.professional_email ?? "Employee",
			subtitle: emp.job_title ? `${emp.job_title}${emp.department ? " · " + emp.department : ""}` : void 0,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: emp.status })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-2 sm:gap-4 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate",
						children: "Total sent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold truncate",
						children: stats.sent.toLocaleString()
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate",
						children: "Total received"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold truncate",
						children: stats.received.toLocaleString()
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate",
						children: "Total messages"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold truncate",
						children: (stats.sent + stats.received).toLocaleString()
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-display text-[15px] font-semibold mb-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-ink-3" }), " 7-Day Activity"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-ink-3 mb-4",
					children: "Message volume over the last week based on available logs."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-40 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: chartData,
							margin: {
								top: 5,
								right: 0,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "colorSent",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "5%",
										stopColor: "var(--primary)",
										stopOpacity: .3
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "95%",
										stopColor: "var(--primary)",
										stopOpacity: 0
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "colorRecv",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "5%",
										stopColor: "var(--ink-3)",
										stopOpacity: .2
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "95%",
										stopColor: "var(--ink-3)",
										stopOpacity: 0
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: {
										fontSize: 11,
										fill: "var(--ink-3)"
									},
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									fontSize: 12,
									borderRadius: 8,
									border: "1px solid var(--line)",
									background: "var(--surface)",
									color: "var(--foreground)"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "sent",
									stroke: "var(--primary)",
									fillOpacity: 1,
									fill: "url(#colorSent)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "received",
									stroke: "var(--ink-3)",
									fillOpacity: 1,
									fill: "url(#colorRecv)"
								})
							]
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-[15px] font-semibold mb-3",
						children: "Profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-2.5 text-[13.5px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Full name",
								value: emp.full_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Position",
								value: emp.job_title ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Department",
								value: emp.department ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Professional email",
								value: emp.professional_email ?? "—",
								mono: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Personal Gmail",
								value: gmail?.google_email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-600 font-medium",
									children: gmail.google_email
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ink-3",
									children: "Not connected"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Added",
								value: new Date(emp.added_at).toLocaleDateString()
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-[15px] font-semibold mb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-ink-3" }), " Gmail connection"]
					}), gmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-2.5 text-[13.5px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Connected as",
								value: gmail.google_email,
								mono: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Since",
								value: new Date(gmail.connected_at).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Last check",
								value: gmail.last_health_check_at ? new Date(gmail.last_health_check_at).toLocaleString() : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Health",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: gmail.health_status })
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-6 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-ink-3",
							children: "Gmail not connected yet."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "mt-3",
							onClick: () => setShowInvite(true),
							children: "Send connection invite"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-[15px] font-semibold mb-3",
						children: "Aliases"
					}), aliases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-ink-3",
						children: "No aliases."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line",
						children: aliases.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-2 flex items-center justify-between text-[13.5px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[12.5px]",
								children: a.address
							}), a.is_primary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] uppercase tracking-wider text-ink-3",
								children: "Primary"
							})]
						}, a.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-[15px] font-semibold mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-ink-3" }), " Security & Access"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-2.5 text-[13.5px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Account status",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: emp.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Last activity",
									value: stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Connected devices",
									value: gmail ? "1 (Gmail)" : "0"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-4 border-t border-line",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[12px] text-ink-3 mb-2",
								children: "Leaving the company? Revoking identity severs Gmail send-as privileges immediately and reroutes inbound mail to the workspace catch-all."
							}), emp.status !== "inactive" && emp.status !== "revoked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								className: "w-full h-8 text-[12.5px]",
								disabled: offboarding,
								onClick: async () => {
									if (confirm(`Revoke professional email access for ${emp.full_name ?? emp.professional_email}? This will immediately sever Gmail send-as permissions.`)) {
										setOffboarding(true);
										try {
											await offboardFn({ data: {
												id: emp.id,
												status: "inactive"
											} });
											await qc.invalidateQueries({ queryKey: ["employee", id] });
											await qc.invalidateQueries({ queryKey: ["employees"] });
										} finally {
											setOffboarding(false);
										}
									}
								},
								children: offboarding ? "Offboarding…" : "1-Click Offboard Employee"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] text-danger font-medium block text-center py-1",
								children: "Access Revoked & Offboarded"
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-0 mt-6 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 py-4 border-b border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-[15px] font-semibold",
						children: "Message snapshot"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[12.5px] text-ink-3",
						children: "Read-only record of this employee's latest sent and received messages."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[12px] text-ink-3",
						children: [
							stats.sent.toLocaleString(),
							" sent · ",
							stats.received.toLocaleString(),
							" received"
						]
					})]
				})
			}), data.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-[13px] text-ink-3",
				children: "No messages recorded for this employee yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: data.messages.map((m) => {
					const outgoing = m.direction === "outgoing";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-5 py-4 grid gap-3 md:grid-cols-[150px_1fr_170px] md:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-[12.5px] font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid h-7 w-7 place-items-center rounded-md ${outgoing ? "bg-primary/10 text-ink" : "bg-ink/[0.05] text-ink-2"}`,
									children: outgoing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "h-3.5 w-3.5" })
								}), outgoing ? "Sent" : "Received"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-[13.5px] font-medium",
										children: m.subject ?? "No subject"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 truncate text-[12px] text-ink-3 font-mono",
										children: outgoing ? `To ${m.receiver}` : `From ${m.sender}`
									}),
									m.snippet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-[12.5px] text-ink-3",
										children: m.snippet
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 md:justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelectedMessage(m),
									className: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-2.5 text-[12px] text-ink-2 hover:bg-ink/[0.04]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " Read more"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left md:text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: m.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
										className: "mt-1 block text-[11.5px] text-ink-3",
										children: new Date(m.timestamp).toLocaleDateString()
									})]
								})]
							})
						]
					}, m.id);
				})
			})]
		}),
		selectedMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "message-modal-title",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "w-full max-w-2xl overflow-hidden shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4 border-b border-line px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: selectedMessage.direction === "outgoing" ? "sent" : "received" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "message-modal-title",
								className: "font-display text-lg font-semibold truncate",
								children: selectedMessage.subject ?? "No subject"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[12.5px] text-ink-3 font-mono",
								children: selectedMessage.direction === "outgoing" ? `From ${selectedMessage.sender} to ${selectedMessage.receiver}` : `From ${selectedMessage.sender} to ${selectedMessage.receiver}`
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSelectedMessage(null),
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-ink/[0.05]",
						"aria-label": "Close message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 grid gap-3 text-[12.5px] sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
								label: "Status",
								value: selectedMessage.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
								label: "Direction",
								value: selectedMessage.direction
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
								label: "Date",
								value: new Date(selectedMessage.timestamp).toLocaleString()
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-line bg-background p-4 text-[14px] leading-6 text-ink-2",
						children: selectedMessage.snippet ?? "No message preview available."
					})]
				})]
			})
		}),
		showInvite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteModal, {
			employee: {
				id: emp.id,
				full_name: emp.full_name,
				professional_email: emp.professional_email,
				job_title: emp.job_title,
				department: emp.department,
				status: emp.status,
				gmail_connected: !!gmail
			},
			onClose: () => setShowInvite(false)
		})
	] });
}
function Info$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-line bg-background px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-wider text-ink-3",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 truncate font-medium",
			children: value
		})]
	});
}
function Row({ label, value, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-ink-3 text-[12.5px]",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `text-right truncate max-w-[60%] ${mono ? "font-mono text-[12.5px]" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { EmployeeDetailRoute as component };
