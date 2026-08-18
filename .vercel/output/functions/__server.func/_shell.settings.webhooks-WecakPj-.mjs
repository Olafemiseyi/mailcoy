import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { n as Button, o as Field, r as Card, s as Input } from "./_ssr/AppShell-B0jIXsQK.mjs";
import { n as createWebhook, r as deleteWebhook } from "./_ssr/platform.functions-CcitIfTc.mjs";
import { t as opts } from "./_shell.settings.webhooks-j-WgLsPZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.webhooks-WecakPj-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EVENTS = [
	"email.sent",
	"email.delivered",
	"email.bounced",
	"email.complained",
	"domain.verified",
	"employee.connected"
];
function WebhooksRoute() {
	const qc = useQueryClient();
	const { data } = useSuspenseQuery(opts);
	const create = useServerFn(createWebhook);
	const del = useServerFn(deleteWebhook);
	const [url, setUrl] = (0, import_react.useState)("");
	const [events, setEvents] = (0, import_react.useState)(["email.bounced"]);
	const [reveal, setReveal] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	function toggle(ev) {
		setEvents((prev) => prev.includes(ev) ? prev.filter((x) => x !== ev) : [...prev, ev]);
	}
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const r = await create({ data: {
				url,
				events
			} });
			await qc.invalidateQueries({ queryKey: ["webhooks"] });
			setReveal(r.secret);
			setUrl("");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Endpoint URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: url,
							onChange: (e) => setUrl(e.target.value),
							required: true,
							placeholder: "https://api.example.com/webhooks/mailcoy"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1.5 text-[13px] font-medium text-ink-2",
						children: "Events"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: EVENTS.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggle(ev),
							className: `h-8 px-3 rounded-md text-[12px] border ${events.includes(ev) ? "bg-primary text-primary-foreground border-primary" : "border-line text-ink-2 hover:bg-ink/[0.04]"}`,
							children: ev
						}, ev))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || events.length === 0,
						children: busy ? "Creating…" : "Create webhook"
					})
				]
			}), reveal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 p-3 rounded-md bg-emerald-500/10 text-[12.5px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium mb-1",
					children: "Signing secret — copy now, won't be shown again."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "font-mono break-all",
					children: reveal
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-0",
			children: data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-[13.5px] text-ink-3",
				children: "No webhooks configured."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: data.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "px-5 py-3 flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[12.5px] truncate",
							children: w.url
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 flex flex-wrap gap-1",
							children: w.events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10.5px] rounded bg-ink/[0.05] px-1.5 py-0.5",
								children: ev
							}, ev))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: async () => {
							if (confirm("Delete webhook?")) {
								await del({ data: { id: w.id } });
								qc.invalidateQueries({ queryKey: ["webhooks"] });
							}
						},
						children: "Delete"
					})]
				}, w.id))
			})
		})]
	});
}
//#endregion
export { WebhooksRoute as component };
