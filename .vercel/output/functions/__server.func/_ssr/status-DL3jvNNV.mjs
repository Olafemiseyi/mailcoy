import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as RefreshCw, gt as CircleX, s as TriangleAlert, vt as CircleCheck } from "../_libs/lucide-react.mjs";
import { r as Card } from "./AppShell-CbLCr2lg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-DL3jvNNV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Icon({ s }) {
	if (s === "operational") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-600" });
	if (s === "degraded") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-amber-600" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5 text-red-600" });
}
function AdminStatus() {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	async function load() {
		setLoading(true);
		try {
			const res = await fetch("/api/public/status", { cache: "no-store" });
			setData(await res.json());
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
		const t = setInterval(load, 15e3);
		return () => clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: "System status"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[13.5px] text-ink-3 mt-1",
				children: [
					"Live probes against production services. The same data powers the public status page at ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-ink-2",
						children: "/status"
					}),
					"."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: load,
				disabled: loading,
				className: "inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-line text-[13px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }), " Refresh"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-0 mb-8",
			children: [(data?.probes ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-5 py-4 border-b border-line last:border-b-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { s: p.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: p.name
					}), p.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12.5px] text-ink-3 mt-0.5",
						children: p.message
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[12.5px] text-ink-3 font-mono",
					children: [p.latency_ms, " ms"]
				})]
			}, p.id)), !data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-ink-3 text-[13.5px]",
				children: "Loading…"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-line pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold tracking-tight text-ink",
					children: "Master Routing Engine (Resend & Amazon SES)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-ink-3",
					children: "Switch the underlying platform delivery engine globally. Customers and employees are unaffected."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20",
					children: "Invisible to Users"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5 border-line bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[14px] text-ink font-semibold",
								children: "Resend Free Engine"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10.5px] font-medium uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
								children: "Active Default"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-ink-3 leading-relaxed",
							children: "Requires zero credit card setup. All initial users and domains route smoothly through the built-in Resend delivery pipeline."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-line bg-surface-muted/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[14px] text-ink font-semibold",
								children: "Amazon SES ($0.10/10k)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10.5px] font-medium uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600",
								children: "High Volume Ready"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-ink-3 leading-relaxed",
							children: "When you gain hundreds of users, plug in your AWS SES credentials to lower costs by 95% at massive scale."
						})]
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-line pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold tracking-tight text-ink mb-1",
					children: "Global Email & Delivery Audit Search"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-ink-3 mb-4",
					children: "Trace any inbound or outbound email across all tenant organizations in real time."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "admin-email-search-input",
							placeholder: "Search by sender, receiver, subject, or domain...",
							className: "flex-1 h-9 px-3 rounded-lg border border-line bg-background text-[13px] outline-none focus:border-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								const input = document.getElementById("admin-email-search-input");
								const resultDiv = document.getElementById("admin-email-search-results");
								if (!input || !resultDiv) return;
								resultDiv.innerHTML = "<div class='py-4 text-center text-[12px] text-ink-3'>Searching logs...</div>";
								try {
									const { searchGlobalEmailLogs } = await import("./admin.functions-UZyOER8E.mjs").then((n) => n.t).then((n) => n.t);
									const logs = await searchGlobalEmailLogs({ data: {
										query: input.value,
										limit: 15
									} });
									if (logs.length === 0) {
										resultDiv.innerHTML = "<div class='py-4 text-center text-[12px] text-ink-3'>No matching emails found.</div>";
										return;
									}
									resultDiv.innerHTML = `
                    <div class="divide-y divide-line border border-line rounded-lg overflow-hidden text-[12.5px]">
                      ${logs.map((l) => `
                        <div class="p-3 bg-surface hover:bg-surface-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div class="min-w-0">
                            <div class="font-medium text-ink truncate">${l.subject || "No Subject"}</div>
                            <div class="text-[11.5px] text-ink-3 font-mono truncate">${l.from_addr} &rarr; ${l.to_addr}</div>
                          </div>
                          <div class="flex items-center gap-2 shrink-0">
                            <span class="px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase ${l.status === "sent" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}">${l.status}</span>
                            <span class="text-[11px] text-ink-4">${new Date(l.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      `).join("")}
                    </div>
                  `;
								} catch (e) {
									resultDiv.innerHTML = `<div class='py-4 text-center text-[12px] text-rose-600'>${e.message || "Failed to query logs"}</div>`;
								}
							},
							className: "px-4 h-9 rounded-lg bg-primary text-primary-foreground font-medium text-[13px] hover:bg-primary-focus transition",
							children: "Search"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "admin-email-search-results" })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-line pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold tracking-tight text-ink mb-1",
					children: "Platform Broadcast Announcement"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-ink-3 mb-4",
					children: "Broadcast a top-level announcement or maintenance banner to all logged-in customer organizations."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "admin-broadcast-msg",
						rows: 2,
						placeholder: "e.g. Scheduled maintenance in 15 minutes. Outbound routing will remain uninterrupted.",
						className: "w-full text-[13px] p-3 rounded-lg border border-line bg-background text-ink outline-none focus:border-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12px] text-ink-3",
							children: "Banner will render at top of all tenant workspaces"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									const { setPlatformBroadcast } = await import("./admin.functions-UZyOER8E.mjs").then((n) => n.t).then((n) => n.t);
									await setPlatformBroadcast({ data: {
										message: "",
										enabled: false,
										level: "info"
									} });
									alert("Broadcast cleared from all customer dashboards.");
								},
								className: "px-3 h-8 rounded-md border border-line text-[12px] text-ink-3 hover:text-danger transition",
								children: "Clear Banner"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									const msg = document.getElementById("admin-broadcast-msg")?.value;
									if (!msg) return;
									const { setPlatformBroadcast } = await import("./admin.functions-UZyOER8E.mjs").then((n) => n.t).then((n) => n.t);
									await setPlatformBroadcast({ data: {
										message: msg,
										enabled: true,
										level: "info"
									} });
									alert("Broadcast successfully published to all workspaces!");
								},
								className: "px-4 h-8 rounded-md bg-primary text-primary-foreground font-medium text-[12px] hover:bg-primary-focus transition",
								children: "Publish Broadcast"
							})]
						})]
					})]
				})
			]
		}),
		data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-6 text-[12px] text-ink-3",
			children: ["Last checked ", new Date(data.checked_at).toLocaleString()]
		})
	] });
}
//#endregion
export { AdminStatus as component };
