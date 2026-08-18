import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as MarketingShell } from "./MarketingShell-t0A5dd5p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MarketingPage-CIzb31Ej.js
var import_jsx_runtime = require_jsx_runtime();
function MarketingPage({ eyebrow, title, lede, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MarketingShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-5 pt-16 pb-10 md:pt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-4",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[52px]",
				children: title
			}),
			lede && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-3",
				children: lede
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-3xl px-5 pb-24",
		children
	})] });
}
//#endregion
export { MarketingPage as t };
