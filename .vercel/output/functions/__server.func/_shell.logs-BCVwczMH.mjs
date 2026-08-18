import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { i as useQuery } from "./_libs/tanstack__react-query.mjs";
import { K as LoaderCircle, et as Inbox } from "./_libs/lucide-react.mjs";
import { c as PageHeader, l as StatusPill, n as Button, r as Card } from "./_ssr/AppShell-Ct9NjhEH.mjs";
import { a as TableSkeleton } from "./_ssr/Skeleton-_cvfJ6Br.mjs";
import { o as listEmailLogs } from "./_ssr/platform.functions-BMsYct3C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.logs-BCVwczMH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE = 50;
function LogsRoute() {
	const [limit, setLimit] = (0, import_react.useState)(PAGE);
	const fetchLogs = useServerFn(listEmailLogs);
	const { data, isPending, isFetching } = useQuery({
		queryKey: ["email-logs", limit],
		queryFn: async () => fetchLogs({ data: {
			limit,
			offset: 0
		} }),
		staleTime: 1e4,
		placeholderData: (prev) => prev
	});
	const rows = data?.rows ?? [];
	const total = data?.total ?? 0;
	const hasMore = rows.length < total;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Email logs",
		subtitle: total ? `Showing ${rows.length} of ${total} events.` : "Delivery outcomes for inbound and outbound messages."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-0 overflow-hidden",
		children: [isPending && !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSkeleton, { rows: 8 })
		}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-16 text-center flex flex-col items-center justify-center border-t border-line bg-surface-muted/20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center mb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-6 w-6 text-ink-3" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-ink",
					children: "No logs yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[13px] text-ink-3 max-w-md",
					children: "Once mail starts routing through your MX endpoints, delivery events will land here in real time."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-[13.5px] min-w-[650px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-[11px] uppercase tracking-wider text-ink-3 border-b border-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Dir"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "From"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "To"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Subject"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Status"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-line",
					children: rows.map((row) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-[12px] text-ink-3 whitespace-nowrap",
								children: new Date(row.timestamp).toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-[12px]",
								children: row.direction === "outgoing" ? "→" : "←"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 font-mono text-[12px]",
								children: row.sender
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 font-mono text-[12px]",
								children: row.receiver
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 truncate max-w-[280px]",
								children: row.subject ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: row.status })
							})
						] }, row.id);
					})
				})]
			})
		}), hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 border-t border-line flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setLimit((l) => l + PAGE),
				disabled: isFetching,
				children: isFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }), " Loading…"] }) : `Load ${Math.min(PAGE, total - rows.length)} more`
			})
		})]
	})] });
}
//#endregion
export { LogsRoute as component };
