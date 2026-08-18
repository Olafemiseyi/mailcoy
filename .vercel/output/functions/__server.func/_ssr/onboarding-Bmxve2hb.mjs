import { o as __toESM } from "../_runtime.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Logomark } from "./Logomark-BWOODGU3.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { St as Check, a as UserPlus, bt as ChevronRight, g as Sparkles, rt as Globe } from "../_libs/lucide-react.mjs";
import { d as createOrganization, n as Button, o as Field, p as setOnboardingStep, r as Card, s as Input } from "./AppShell-Ct9NjhEH.mjs";
import { t as addEmployee } from "./employees.functions-Bh7q8BeL.mjs";
import { t as addDomain } from "./domains.functions-CNIeVJTl.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-Bmxve2hb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COUNTRIES = [
	{
		code: "",
		name: "Select country..."
	},
	{
		code: "US",
		name: "United States"
	},
	{
		code: "GB",
		name: "United Kingdom"
	},
	{
		code: "CA",
		name: "Canada"
	},
	{
		code: "AU",
		name: "Australia"
	},
	{
		code: "NG",
		name: "Nigeria"
	},
	{
		code: "ZA",
		name: "South Africa"
	},
	{
		code: "IN",
		name: "India"
	},
	{
		code: "DE",
		name: "Germany"
	},
	{
		code: "FR",
		name: "France"
	},
	{
		code: "SG",
		name: "Singapore"
	}
];
function OnboardingRoute() {
	const nav = useNavigate();
	const qc = useQueryClient();
	const createOrg = useServerFn(createOrganization);
	const addDom = useServerFn(addDomain);
	const addEmp = useServerFn(addEmployee);
	const finish = useServerFn(setOnboardingStep);
	const [step, setStep] = (0, import_react.useState)("org");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [orgName, setOrgName] = (0, import_react.useState)("");
	const [industry, setIndustry] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("");
	const [domain, setDomain] = (0, import_react.useState)("");
	const [empName, setEmpName] = (0, import_react.useState)("");
	const [empLocal, setEmpLocal] = (0, import_react.useState)("");
	const [empEdited, setEmpEdited] = (0, import_react.useState)(false);
	const cleanDomain = domain.trim().toLowerCase();
	const isValidDomainCandidate = cleanDomain.length >= 4 && cleanDomain.includes(".");
	const { data: registrarData, isLoading: detectingRegistrar } = useQuery({
		queryKey: ["registrar-detect", cleanDomain],
		queryFn: async () => {
			const res = await fetch(`/api/registrar-detect?domain=${encodeURIComponent(cleanDomain)}`);
			if (!res.ok) throw new Error("Failed to detect registrar");
			return res.json();
		},
		enabled: isValidDomainCandidate,
		staleTime: 5 * 6e4
	});
	async function submitOrg(e) {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			await createOrg({ data: {
				name: orgName.trim(),
				industry: industry || void 0,
				country: country || void 0
			} });
			setStep("domain");
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	async function submitDomain(e) {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			if (domain.trim()) await addDom({ data: { name: domain.trim().toLowerCase() } });
			setStep("employee");
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	async function skipDomain() {
		setStep("employee");
	}
	async function submitEmployee(e) {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			if (empName.trim() && empLocal.trim()) await addEmp({ data: {
				full_name: empName.trim(),
				local_part: empLocal.trim().toLowerCase(),
				domain: cleanDomain
			} });
			await completeOnboarding();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	async function completeOnboarding() {
		setBusy(true);
		try {
			await finish({ data: {
				step: 6,
				completed: true
			} });
			await qc.invalidateQueries();
			setStep("done");
			setTimeout(() => nav({ to: "/dashboard" }), 1e3);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	const stepIndex = step === "org" ? 1 : step === "domain" ? 2 : step === "employee" ? 3 : 4;
	const variants = {
		enter: {
			opacity: 0,
			y: 15
		},
		center: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -15
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg relative z-10",
			children: [step !== "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-display font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-5 w-5" }), " Mailcoy"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[12px] font-medium text-ink-3 tracking-wide uppercase",
						children: [
							"Step ",
							stepIndex,
							" of 3"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 w-full bg-ink/[0.04] rounded-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "h-full bg-primary",
						initial: { width: 0 },
						animate: { width: `${stepIndex / 3 * 100}%` },
						transition: {
							ease: "circOut",
							duration: .5
						}
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					step === "org" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants,
						initial: "enter",
						animate: "center",
						exit: "exit",
						transition: { duration: .3 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-xl font-semibold",
									children: "Create your workspace"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 mb-6 text-[13.5px] text-ink-3",
									children: "This becomes your organization's home in Mailcoy."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: submitOrg,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Company name",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: orgName,
												onChange: (e) => setOrgName(e.target.value),
												required: true,
												minLength: 2,
												placeholder: "Acme Inc."
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Industry (optional)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: industry,
													onChange: (e) => setIndustry(e.target.value),
													placeholder: "Software, Retail, …"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Country (optional)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													value: country,
													onChange: (e) => setCountry(e.target.value),
													className: "w-full h-10 rounded-md border border-line bg-background px-3 text-[14px] outline-none focus:border-primary",
													children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: c.code,
														children: c.name
													}, c.code))
												})
											})]
										}),
										err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] text-danger",
											children: err
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: busy,
											className: "w-full mt-2",
											children: [
												busy ? "Creating…" : "Continue",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 ml-1" })
											]
										})
									]
								})
							]
						})
					}, "org"),
					step === "domain" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants,
						initial: "enter",
						animate: "center",
						exit: "exit",
						transition: { duration: .3 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-xl font-semibold",
									children: "Add your sending domain"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 mb-6 text-[13.5px] text-ink-3",
									children: "Enter your company's domain name to automatically identify your DNS registrar."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: submitDomain,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Domain",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: domain,
												onChange: (e) => setDomain(e.target.value),
												placeholder: "acme.com",
												required: true
											})
										}),
										isValidDomainCandidate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 rounded-xl border border-line bg-surface-muted/40 p-3 text-[13px]",
											children: detectingRegistrar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-ink-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Detecting DNS provider for ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-mono",
														children: cleanDomain
													}),
													"…"
												] })]
											}) : registrarData?.registrar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: registrarData.registrar.logo,
													alt: registrarData.registrar.name,
													className: "h-7 w-7 rounded border border-line object-cover shrink-0 bg-white p-0.5",
													onError: (e) => {
														e.currentTarget.style.display = "none";
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 font-medium text-ink",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Detected: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-blue-600 dark:text-blue-400",
															children: registrarData.registrar.name
														})] })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[12px] text-ink-3 truncate",
														children: "Nameservers auto-matched. Tailored setup guide will load in DNS setup."
													})]
												})]
											}) : registrarData?.nsRecords && registrarData.nsRecords.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-ink-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"DNS records found (",
													registrarData.nsRecords.slice(0, 2).join(", "),
													"). Standard instructions ready."
												] })]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-ink-3 text-[12px]",
												children: "Enter a registered domain name (e.g. yourcompany.com) to load DNS setup instructions."
											})
										}),
										err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] text-danger",
											children: err
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 pt-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "submit",
												disabled: busy || !isValidDomainCandidate,
												className: "flex-1",
												children: [
													busy ? "Saving…" : "Continue",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 ml-1" })
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "ghost",
												onClick: skipDomain,
												disabled: busy,
												children: "Skip"
											})]
										})
									]
								})
							]
						})
					}, "domain"),
					step === "employee" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants,
						initial: "enter",
						animate: "center",
						exit: "exit",
						transition: { duration: .3 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-xl font-semibold",
									children: "Invite your first employee"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 mb-6 text-[13.5px] text-ink-3",
									children: ["Create a professional address for yourself or a teammate.", cleanDomain ? ` It will end in @${cleanDomain}.` : ""]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: submitEmployee,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Full name",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: empName,
												onChange: (e) => {
													setEmpName(e.target.value);
													if (!empEdited) {
														const suggested = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ".").replace(/\.+/g, ".").replace(/^\.+|\.+$/g, "");
														setEmpLocal(suggested);
													}
												},
												placeholder: "Jane Doe"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Email address",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: empLocal,
													onChange: (e) => {
														setEmpLocal(e.target.value.toLowerCase().replace(/\s+/g, ""));
														setEmpEdited(true);
													},
													placeholder: "jane.doe",
													className: "rounded-r-none"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center h-10 border border-l-0 border-line rounded-r-md bg-surface-muted px-3 text-[13px] text-ink-2 truncate max-w-[150px]",
													children: ["@", cleanDomain || "domain.com"]
												})]
											})
										}),
										err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] text-danger",
											children: err
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 pt-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "submit",
												disabled: busy || !empName && !empLocal,
												className: "flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4 mr-1.5" }), busy ? "Finishing…" : "Create & Finish"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "ghost",
												onClick: completeOnboarding,
												disabled: busy,
												children: "Skip"
											})]
										})
									]
								})
							]
						})
					}, "employee"),
					step === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants,
						initial: "enter",
						animate: "center",
						exit: "exit",
						transition: { duration: .4 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									initial: { scale: 0 },
									animate: { scale: 1 },
									transition: {
										type: "spring",
										bounce: .5,
										delay: .2
									},
									className: "mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-8 w-8 text-emerald-600" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-semibold",
									children: "You're all set!"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[14px] text-ink-3",
									children: "Redirecting to your dashboard…"
								})
							]
						})
					}, "done")
				]
			})]
		})
	});
}
//#endregion
export { OnboardingRoute as component };
