import { o as __toESM } from "./_runtime.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { a as CustomSelect, h as uploadOrganizationLogo, m as updateOrganization, n as Button, o as Field, r as Card, s as Input } from "./_ssr/AppShell-CbLCr2lg.mjs";
import { t as opts } from "./_shell.settings.index-B3hZXWHE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.index-Cz5W3Mzz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INDUSTRIES = [
	"Real estate",
	"Technology / SaaS",
	"E-commerce / Retail",
	"Finance / Fintech",
	"Healthcare",
	"Education",
	"Legal",
	"Marketing / Agency",
	"Media / Publishing",
	"Construction",
	"Hospitality / Travel",
	"Manufacturing",
	"Non-profit",
	"Consulting",
	"Other"
];
var COUNTRIES = [
	{
		code: "AF",
		name: "Afghanistan"
	},
	{
		code: "AL",
		name: "Albania"
	},
	{
		code: "DZ",
		name: "Algeria"
	},
	{
		code: "AR",
		name: "Argentina"
	},
	{
		code: "AM",
		name: "Armenia"
	},
	{
		code: "AU",
		name: "Australia"
	},
	{
		code: "AT",
		name: "Austria"
	},
	{
		code: "AZ",
		name: "Azerbaijan"
	},
	{
		code: "BH",
		name: "Bahrain"
	},
	{
		code: "BD",
		name: "Bangladesh"
	},
	{
		code: "BY",
		name: "Belarus"
	},
	{
		code: "BE",
		name: "Belgium"
	},
	{
		code: "BJ",
		name: "Benin"
	},
	{
		code: "BO",
		name: "Bolivia"
	},
	{
		code: "BA",
		name: "Bosnia & Herzegovina"
	},
	{
		code: "BW",
		name: "Botswana"
	},
	{
		code: "BR",
		name: "Brazil"
	},
	{
		code: "BG",
		name: "Bulgaria"
	},
	{
		code: "BF",
		name: "Burkina Faso"
	},
	{
		code: "KH",
		name: "Cambodia"
	},
	{
		code: "CM",
		name: "Cameroon"
	},
	{
		code: "CA",
		name: "Canada"
	},
	{
		code: "CL",
		name: "Chile"
	},
	{
		code: "CN",
		name: "China"
	},
	{
		code: "CO",
		name: "Colombia"
	},
	{
		code: "CR",
		name: "Costa Rica"
	},
	{
		code: "CI",
		name: "Côte d'Ivoire"
	},
	{
		code: "HR",
		name: "Croatia"
	},
	{
		code: "CU",
		name: "Cuba"
	},
	{
		code: "CY",
		name: "Cyprus"
	},
	{
		code: "CZ",
		name: "Czechia"
	},
	{
		code: "DK",
		name: "Denmark"
	},
	{
		code: "DO",
		name: "Dominican Republic"
	},
	{
		code: "EC",
		name: "Ecuador"
	},
	{
		code: "EG",
		name: "Egypt"
	},
	{
		code: "SV",
		name: "El Salvador"
	},
	{
		code: "EE",
		name: "Estonia"
	},
	{
		code: "ET",
		name: "Ethiopia"
	},
	{
		code: "FI",
		name: "Finland"
	},
	{
		code: "FR",
		name: "France"
	},
	{
		code: "GA",
		name: "Gabon"
	},
	{
		code: "GE",
		name: "Georgia"
	},
	{
		code: "DE",
		name: "Germany"
	},
	{
		code: "GH",
		name: "Ghana"
	},
	{
		code: "GR",
		name: "Greece"
	},
	{
		code: "GT",
		name: "Guatemala"
	},
	{
		code: "HN",
		name: "Honduras"
	},
	{
		code: "HK",
		name: "Hong Kong"
	},
	{
		code: "HU",
		name: "Hungary"
	},
	{
		code: "IS",
		name: "Iceland"
	},
	{
		code: "IN",
		name: "India"
	},
	{
		code: "ID",
		name: "Indonesia"
	},
	{
		code: "IR",
		name: "Iran"
	},
	{
		code: "IQ",
		name: "Iraq"
	},
	{
		code: "IE",
		name: "Ireland"
	},
	{
		code: "IL",
		name: "Israel"
	},
	{
		code: "IT",
		name: "Italy"
	},
	{
		code: "JM",
		name: "Jamaica"
	},
	{
		code: "JP",
		name: "Japan"
	},
	{
		code: "JO",
		name: "Jordan"
	},
	{
		code: "KZ",
		name: "Kazakhstan"
	},
	{
		code: "KE",
		name: "Kenya"
	},
	{
		code: "KW",
		name: "Kuwait"
	},
	{
		code: "LA",
		name: "Laos"
	},
	{
		code: "LV",
		name: "Latvia"
	},
	{
		code: "LB",
		name: "Lebanon"
	},
	{
		code: "LY",
		name: "Libya"
	},
	{
		code: "LT",
		name: "Lithuania"
	},
	{
		code: "LU",
		name: "Luxembourg"
	},
	{
		code: "MO",
		name: "Macao"
	},
	{
		code: "MG",
		name: "Madagascar"
	},
	{
		code: "MW",
		name: "Malawi"
	},
	{
		code: "MY",
		name: "Malaysia"
	},
	{
		code: "MV",
		name: "Maldives"
	},
	{
		code: "ML",
		name: "Mali"
	},
	{
		code: "MT",
		name: "Malta"
	},
	{
		code: "MR",
		name: "Mauritania"
	},
	{
		code: "MU",
		name: "Mauritius"
	},
	{
		code: "MX",
		name: "Mexico"
	},
	{
		code: "MD",
		name: "Moldova"
	},
	{
		code: "MN",
		name: "Mongolia"
	},
	{
		code: "ME",
		name: "Montenegro"
	},
	{
		code: "MA",
		name: "Morocco"
	},
	{
		code: "MZ",
		name: "Mozambique"
	},
	{
		code: "MM",
		name: "Myanmar"
	},
	{
		code: "NA",
		name: "Namibia"
	},
	{
		code: "NP",
		name: "Nepal"
	},
	{
		code: "NL",
		name: "Netherlands"
	},
	{
		code: "NZ",
		name: "New Zealand"
	},
	{
		code: "NI",
		name: "Nicaragua"
	},
	{
		code: "NE",
		name: "Niger"
	},
	{
		code: "NG",
		name: "Nigeria"
	},
	{
		code: "MK",
		name: "North Macedonia"
	},
	{
		code: "NO",
		name: "Norway"
	},
	{
		code: "OM",
		name: "Oman"
	},
	{
		code: "PK",
		name: "Pakistan"
	},
	{
		code: "PS",
		name: "Palestine"
	},
	{
		code: "PA",
		name: "Panama"
	},
	{
		code: "PY",
		name: "Paraguay"
	},
	{
		code: "PE",
		name: "Peru"
	},
	{
		code: "PH",
		name: "Philippines"
	},
	{
		code: "PL",
		name: "Poland"
	},
	{
		code: "PT",
		name: "Portugal"
	},
	{
		code: "QA",
		name: "Qatar"
	},
	{
		code: "RO",
		name: "Romania"
	},
	{
		code: "RU",
		name: "Russia"
	},
	{
		code: "RW",
		name: "Rwanda"
	},
	{
		code: "SA",
		name: "Saudi Arabia"
	},
	{
		code: "SN",
		name: "Senegal"
	},
	{
		code: "RS",
		name: "Serbia"
	},
	{
		code: "SG",
		name: "Singapore"
	},
	{
		code: "SK",
		name: "Slovakia"
	},
	{
		code: "SI",
		name: "Slovenia"
	},
	{
		code: "SO",
		name: "Somalia"
	},
	{
		code: "ZA",
		name: "South Africa"
	},
	{
		code: "KR",
		name: "South Korea"
	},
	{
		code: "ES",
		name: "Spain"
	},
	{
		code: "LK",
		name: "Sri Lanka"
	},
	{
		code: "SD",
		name: "Sudan"
	},
	{
		code: "SE",
		name: "Sweden"
	},
	{
		code: "CH",
		name: "Switzerland"
	},
	{
		code: "SY",
		name: "Syria"
	},
	{
		code: "TW",
		name: "Taiwan"
	},
	{
		code: "TZ",
		name: "Tanzania"
	},
	{
		code: "TH",
		name: "Thailand"
	},
	{
		code: "TG",
		name: "Togo"
	},
	{
		code: "TN",
		name: "Tunisia"
	},
	{
		code: "TR",
		name: "Türkiye"
	},
	{
		code: "UG",
		name: "Uganda"
	},
	{
		code: "UA",
		name: "Ukraine"
	},
	{
		code: "AE",
		name: "United Arab Emirates"
	},
	{
		code: "GB",
		name: "United Kingdom"
	},
	{
		code: "US",
		name: "United States"
	},
	{
		code: "UY",
		name: "Uruguay"
	},
	{
		code: "UZ",
		name: "Uzbekistan"
	},
	{
		code: "VE",
		name: "Venezuela"
	},
	{
		code: "VN",
		name: "Vietnam"
	},
	{
		code: "YE",
		name: "Yemen"
	},
	{
		code: "ZM",
		name: "Zambia"
	},
	{
		code: "ZW",
		name: "Zimbabwe"
	}
];
function SettingsIndex() {
	const { data } = useSuspenseQuery(opts);
	const org = data && "name" in data ? data : null;
	const qc = useQueryClient();
	const save = useServerFn(updateOrganization);
	const uploadLogo = useServerFn(uploadOrganizationLogo);
	const [name, setName] = (0, import_react.useState)(org?.name ?? "");
	const [industry, setIndustry] = (0, import_react.useState)(org?.industry ?? "");
	const initialIndustry = org?.industry ?? "";
	const [industryChoice, setIndustryChoice] = (0, import_react.useState)(INDUSTRIES.includes(initialIndustry) ? initialIndustry : initialIndustry ? "Other" : "");
	const [industryOther, setIndustryOther] = (0, import_react.useState)(INDUSTRIES.includes(initialIndustry) ? "" : initialIndustry);
	const [country, setCountry] = (0, import_react.useState)(org?.country ?? "");
	const [logoUrl, setLogoUrl] = (0, import_react.useState)(org?.logo_url ?? "");
	const [logoBusy, setLogoBusy] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)(null);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const finalIndustry = industryChoice === "Other" ? industryOther.trim() : industryChoice;
			await save({ data: {
				name,
				industry: finalIndustry || null,
				country: country || null,
				logo_url: logoUrl.trim() ? logoUrl.trim() : null
			} });
			await qc.invalidateQueries({ queryKey: ["my-org"] });
			setToast("Saved");
			setTimeout(() => setToast(null), 1500);
		} finally {
			setBusy(false);
		}
	}
	async function onLogoFile(file) {
		if (!file) return;
		setLogoBusy(true);
		try {
			const base64 = await fileToBase64(file);
			const res = await uploadLogo({ data: {
				fileName: file.name,
				contentType: file.type,
				base64
			} });
			setLogoUrl(res.logoUrl);
			await qc.invalidateQueries({ queryKey: ["my-org"] });
			setToast("Logo uploaded");
			setTimeout(() => setToast(null), 1500);
		} finally {
			setLogoBusy(false);
		}
	}
	if (!org) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: "Organization profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[13px] leading-relaxed text-ink-3",
				children: "Create your workspace first, then this page will hold your organization name, country, timezone, currency, and logo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/onboarding",
				className: "mt-5 inline-flex h-9 items-center rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground",
				children: "Continue setup"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: "Organization profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 mb-6 text-[13px] text-ink-3",
				children: ["Slug: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "font-mono",
					children: org.slug
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Industry",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomSelect, {
							options: INDUSTRIES.map((i) => ({
								value: i,
								label: i
							})),
							value: industryChoice,
							placeholder: "Select an industry…",
							onChange: (val) => {
								setIndustryChoice(val);
								setIndustry(val === "Other" ? industryOther : val);
							}
						}), industryChoice === "Other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2",
							value: industryOther,
							onChange: (e) => {
								setIndustryOther(e.target.value);
								setIndustry(e.target.value);
							},
							placeholder: "Enter your industry"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Country",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomSelect, {
							searchable: true,
							options: COUNTRIES.map((c) => ({
								value: c.code,
								label: c.name
							})),
							value: country ?? "",
							placeholder: "Select a country…",
							onChange: (val) => setCountry(val)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Company logo",
						hint: "Upload PNG, JPG, WEBP, GIF or SVG. No URL is required.",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-line px-4 text-[13px] font-medium hover:bg-ink/[0.04]",
								children: [logoBusy ? "Uploading…" : "Choose logo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
									className: "sr-only",
									disabled: logoBusy,
									onChange: (e) => onLogoFile(e.currentTarget.files?.[0] ?? null)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] text-ink-3",
								children: "The uploaded image becomes the workspace logo."
							})]
						}), logoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2 text-[12px] text-ink-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logoUrl,
								alt: "Logo preview",
								className: "h-8 w-8 rounded object-cover border border-line",
								onError: (e) => {
									e.target.style.display = "none";
								}
							}), "Preview"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: busy ? "Saving…" : "Save"
						}), toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] text-emerald-700",
							children: toast
						})]
					})
				]
			})
		]
	});
}
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
		reader.onerror = () => reject(reader.error ?? /* @__PURE__ */ new Error("File read failed"));
		reader.readAsDataURL(file);
	});
}
//#endregion
export { SettingsIndex as component };
