import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { i as useQuery, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { G as Lock } from "./_libs/lucide-react.mjs";
import { c as PageHeader, f as getMyOrganization, r as Card } from "./_ssr/AppShell-B0jIXsQK.mjs";
import { t as analyticsOpts } from "./_shell.analytics-BByr8XuO.mjs";
import { a as CartesianGrid, c as Legend, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.analytics-TiQiiy1G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsRoute() {
	const fetchOrg = useServerFn(getMyOrganization);
	const { data: org } = useQuery({
		queryKey: ["my-org"],
		queryFn: async () => fetchOrg(),
		staleTime: 6e4
	});
	const isFreePlan = org?.subscription?.planCode === "free";
	const [range, setRange] = (0, import_react.useState)("today");
	const effectiveRange = isFreePlan ? "today" : range;
	const { data } = useSuspenseQuery(analyticsOpts(effectiveRange));
	const ranges = [
		{
			key: "today",
			label: "Today"
		},
		{
			key: "week",
			label: "7 days"
		},
		{
			key: "month",
			label: "30 days"
		},
		{
			key: "year",
			label: "12 months"
		}
	];
	const stats = [
		{
			label: "Sent",
			value: data?.sent ?? 0
		},
		{
			label: "Received",
			value: data?.received ?? 0
		},
		{
			label: "Delivered",
			value: data?.delivered ?? 0
		},
		{
			label: "Bounced",
			value: data?.bounced ?? 0
		},
		{
			label: "Failed",
			value: data?.failed ?? 0
		},
		{
			label: "Deliverability",
			value: `${data?.deliverability ?? 0}%`
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Analytics",
			subtitle: "Message volume, delivery health, and bounce trends across your organization.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-full overflow-x-auto no-scrollbar pb-1 -mb-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex rounded-md border border-line bg-surface p-0.5 min-w-max",
					children: ranges.map((r) => {
						const isLocked = isFreePlan && r.key !== "today";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								if (isLocked) window.location.href = "/settings/billing";
								else setRange(r.key);
							},
							className: `h-8 px-3 rounded text-[12.5px] font-medium whitespace-nowrap transition flex items-center gap-1.5 ${effectiveRange === r.key ? "bg-primary text-primary-foreground" : "text-ink-3 hover:text-ink"} ${isLocked ? "opacity-60" : ""}`,
							title: isLocked ? "Upgrade to Growth Pro for historical data" : "",
							children: [isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), r.label]
						}, r.key);
					})
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6",
			children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] uppercase tracking-wider text-ink-3",
					children: s.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 font-display text-2xl font-semibold tabular-nums",
					children: s.value
				})]
			}, s.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 text-[13.5px] font-medium",
				children: "Volume over time"
			}), (data?.series?.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-12 text-center text-[13px] text-ink-3",
				children: "No data in this window."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-72 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: data.series,
						margin: {
							top: 10,
							right: 10,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gSent",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "var(--primary)",
									stopOpacity: .35
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "var(--primary)",
									stopOpacity: 0
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gRecv",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "var(--ink-3)",
									stopOpacity: .22
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "var(--ink-3)",
									stopOpacity: 0
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "var(--line)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								tick: {
									fontSize: 11,
									fill: "var(--ink-3)"
								},
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								tick: {
									fontSize: 11,
									fill: "var(--ink-3)"
								},
								tickLine: false,
								axisLine: false,
								width: 32
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									fontSize: 12,
									borderRadius: 8,
									border: "1px solid var(--line)",
									background: "var(--surface)",
									color: "var(--foreground)"
								},
								labelStyle: { color: "var(--foreground)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
								fontSize: 11,
								color: "var(--ink-3)"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "sent",
								name: "Sent",
								stroke: "var(--primary)",
								strokeWidth: 2,
								fill: "url(#gSent)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "received",
								name: "Received",
								stroke: "var(--ink-3)",
								strokeOpacity: .9,
								strokeWidth: 2,
								fill: "url(#gRecv)"
							})
						]
					})
				})
			})]
		})
	] });
}
//#endregion
export { AnalyticsRoute as component };
