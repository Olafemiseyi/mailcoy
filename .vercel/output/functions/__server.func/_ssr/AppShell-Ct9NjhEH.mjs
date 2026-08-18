import { o as __toESM } from "../_runtime.mjs";
import { g as Link, l as useRouterState, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { n as supabase } from "./client-eqRSUGdj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Cw6_vrZ_.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { t as Logomark } from "./Logomark-BWOODGU3.mjs";
import { a as objectType, i as numberType, n as booleanType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as Send, Ct as ChartColumn, Et as Bot, F as PenLine, H as Mail, J as LayoutDashboard, L as PanelLeftOpen, Ot as AtSign, R as PanelLeftClose, St as Check, T as ScrollText, V as Menu, W as LogOut, Y as Laptop, _t as CircleQuestionMark, et as Inbox, g as Sparkles, h as Sun, i as User, kt as ArrowUpRight, n as X, r as Users, rt as Globe, u as Trash2, w as Search, x as Settings, xt as ChevronDown, yt as CircleAlert, z as Moon } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-Ct9NjhEH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createOrgSchema = objectType({
	name: stringType().trim().min(2).max(120),
	industry: stringType().trim().max(80).optional(),
	country: stringType().trim().max(80).optional(),
	timezone: stringType().trim().max(80).optional()
});
var getMyOrganization = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0e01a238b317d8a3e48a6d04d3336550ef0ee0dc6b727679e753670182f3329f"));
var createOrganization = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => createOrgSchema.parse(data)).handler(createSsrRpc("27cbf2bbd7ccbe1161a623db4e370d4f8a611a178244ce098ec852456c918005"));
var setOnboardingStep = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	step: numberType().int().min(0).max(10),
	completed: booleanType().optional()
}).parse(data)).handler(createSsrRpc("19ba82d07bc559e80db1859198f76f42d9a879cb05630e26ad4131ef3ff77e85"));
var updateOrgSchema = objectType({
	name: stringType().trim().min(2).max(120).optional(),
	industry: stringType().trim().max(80).nullable().optional(),
	country: stringType().trim().max(80).nullable().optional(),
	timezone: stringType().trim().max(80).optional(),
	currency: enumType(["USD", "NGN"]).optional(),
	logo_url: stringType().url().max(1024).nullable().optional()
});
var updateOrganization = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => updateOrgSchema.parse(data)).handler(createSsrRpc("f72d42c8de04bdb1481fc7d1f0200f32b2a525c87dbca515e6a6ab86268c04c7"));
var uploadOrganizationLogo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	fileName: stringType().trim().min(1).max(160),
	contentType: enumType([
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/gif",
		"image/svg+xml"
	]),
	base64: stringType().min(10).max(7e6)
}).parse(data)).handler(createSsrRpc("ed4ad9a638b3fdbdf4c23c7d9c1699928ed6a83b45621aa379e62fd4f633d5a3"));
var chatSchema = objectType({
	message: stringType().min(1).max(2e3),
	userEmail: stringType().optional(),
	history: arrayType(objectType({
		role: enumType([
			"user",
			"assistant",
			"system"
		]),
		content: stringType()
	})).optional(),
	selectedIssue: stringType().optional()
});
var askAiAssistant = createServerFn({ method: "POST" }).validator((d) => chatSchema.parse(d)).handler(createSsrRpc("2594a9aee0947eae7d17c39ffb7316fd32d02250f8327943c90ec6fb3b9f3fec"));
/**
* Escalates an unresolved chat issue directly to the Super Admin via email and database ticket
*/
var escalateToAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	userEmail: stringType().email(),
	subject: stringType(),
	conversationHistory: stringType()
}).parse(d)).handler(createSsrRpc("405f762909f51d4be9fee89d7213dbacf506ad5ba8d9a83fd8c56f0091ceced6"));
var COMMON_ISSUES = [
	{
		id: "domain_verify",
		label: "🌐 Domain not verifying"
	},
	{
		id: "gmail_send_as",
		label: "✉️ Gmail Send-As setup"
	},
	{
		id: "spam_issues",
		label: "🛡️ Emails landing in spam"
	},
	{
		id: "bimi_logo",
		label: "✨ Show my logo in Gmail"
	},
	{
		id: "other",
		label: "💬 Other question / issue"
	}
];
function SupportChatWidget({ userEmail }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "assistant",
		content: "Hi there! I'm your AI Support Assistant. Select a common issue below or type your question and I'll analyze your account in real-time."
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [selectedIssue, setSelectedIssue] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [loadingStatus, setLoadingStatus] = (0, import_react.useState)("Thinking...");
	const [escalated, setEscalated] = (0, import_react.useState)(false);
	const [escalating, setEscalating] = (0, import_react.useState)(false);
	const ask = useServerFn(askAiAssistant);
	const escalate = useServerFn(escalateToAdmin);
	const messagesEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, open]);
	function getDynamicLoadingStatus(text) {
		const lower = text.toLowerCase();
		if (lower.includes("logged in") || lower.includes("account") || lower.includes("user")) return "Checking your account session...";
		if (lower.includes("domain") || lower.includes("dns") || lower.includes("mx") || lower.includes("spf") || lower.includes("txt")) return "Inspecting DNS & domain configuration...";
		if (lower.includes("gmail") || lower.includes("inbox") || lower.includes("send as")) return "Checking Gmail routing status...";
		if (lower.includes("price") || lower.includes("cost") || lower.includes("save") || lower.includes("workspace")) return "Calculating pricing & savings...";
		if (lower.includes("deliverability") || lower.includes("spam") || lower.includes("blacklist")) return "Scanning deliverability metrics...";
		if (lower.includes("bimi") || lower.includes("logo")) return "Reviewing BIMI & logo guidelines...";
		return "Composing response...";
	}
	async function handleSend(customText) {
		const query = customText || input;
		if (!query.trim()) return;
		const newMsgs = [...messages, {
			role: "user",
			content: query
		}];
		setMessages(newMsgs);
		if (!customText) setInput("");
		setLoadingStatus(getDynamicLoadingStatus(query));
		setBusy(true);
		try {
			const res = await ask({ data: {
				message: query,
				userEmail: userEmail || void 0,
				selectedIssue: selectedIssue || void 0
			} });
			setMessages([...newMsgs, {
				role: "assistant",
				content: res.reply
			}]);
		} catch {
			setMessages([...newMsgs, {
				role: "assistant",
				content: "I ran into a temporary issue connecting. Would you like me to send your message directly to our human support team?"
			}]);
		} finally {
			setBusy(false);
		}
	}
	async function handleEscalate() {
		setEscalating(true);
		try {
			const transcript = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
			await escalate({ data: {
				userEmail: userEmail || "customer@mailcoy.com",
				subject: selectedIssue ? `Support Request: ${selectedIssue}` : "Support Chat Escalation",
				conversationHistory: transcript
			} });
			setEscalated(true);
			setMessages((prev) => [...prev, {
				role: "system",
				content: "✅ Ticket created! Your issue has been forwarded to our platform Super Admin. We will reach out to your email shortly."
			}]);
		} catch {
			alert("Failed to escalate. Please try again.");
		} finally {
			setEscalating(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-5 right-5 z-50",
		children: [!open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setOpen(true),
			className: "group relative flex items-center justify-center rounded-full bg-primary h-12 w-12 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5 text-primary-foreground shadow-2xl hover:bg-primary-focus transition-all duration-200 hover:scale-105",
			"aria-label": "Open support chat",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline text-[13px] font-semibold",
						children: "AI Support"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-1 -right-1 sm:static h-2 w-2 rounded-full bg-emerald-400 border border-primary sm:border-0 animate-pulse" })
				]
			})
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "fixed inset-x-3 bottom-3 sm:static sm:w-[400px] h-[520px] max-h-[85vh] p-0 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 border-line z-50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3.5 bg-primary text-primary-foreground flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-8 w-8 rounded-full bg-white/20 grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-[14.5px] font-semibold",
							children: "Mailcoy AI Specialist"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-primary-foreground/80 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400" }), " Online · Diagnostic Active"]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						className: "p-1 rounded-md hover:bg-white/10 text-primary-foreground/80 hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 p-4 overflow-y-auto space-y-3 bg-surface-muted/30 text-[13px]",
					children: [
						messages.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`,
							children: [m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-7 w-7 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0 mt-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `rounded-2xl px-3.5 py-2.5 max-w-[82%] leading-relaxed prose prose-sm dark:prose-invert text-[12.5px] ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-none whitespace-pre-wrap font-medium" : m.role === "system" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[12px]" : "bg-surface border border-line text-ink rounded-bl-none shadow-sm space-y-1.5"}`,
								children: m.role === "user" || m.role === "system" ? m.content : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormattedMessage, { content: m.content })
							})]
						}, idx)),
						messages.length === 1 && !selectedIssue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-ink-3 uppercase font-medium tracking-wider block mb-1",
								children: "Quick Select Your Issue:"
							}), COMMON_ISSUES.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setSelectedIssue(issue.id);
									handleSend(`I need help with: ${issue.label}`);
								},
								className: "w-full text-left p-2 rounded-lg border border-line bg-surface hover:bg-ink/[0.03] text-[12.5px] text-ink transition flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: issue.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5 text-ink-3" })]
							}, issue.id))]
						}),
						busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 items-center text-[12px] text-ink-3 italic",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4 animate-spin text-primary" }),
								" ",
								loadingStatus
							]
						}),
						messages.length > 2 && !escalated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleEscalate,
								disabled: escalating,
								className: "text-[12px] text-primary hover:underline font-medium inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), escalating ? "Connecting to admin..." : "Can't resolve? Escalate to Human Super Admin"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleSend();
					},
					className: "p-3 border-t border-line bg-surface flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "Ask a question or explain your issue...",
						className: "flex-1 text-[12.5px] px-3 py-2 rounded-lg border border-line bg-background text-ink placeholder:text-ink-4 outline-none focus:border-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || !input.trim(),
						className: "h-9 px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					})]
				})
			]
		})]
	});
}
function FormattedMessage({ content }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1 text-[12.5px] leading-relaxed",
		children: content.split("\n").map((line, i) => {
			const trimmed = line.trim();
			if (!trimmed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5" }, i);
			if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
				const text = trimmed.replace(/^[\*\-•]\s*/, "");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 items-start pl-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary font-bold",
						children: "•"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: renderInlineFormatting(text)
					})]
				}, i);
			}
			const numMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
			if (numMatch) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 items-start pl-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold text-primary",
					children: [numMatch[1], "."]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1",
					children: renderInlineFormatting(numMatch[2])
				})]
			}, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderInlineFormatting(line) }, i);
		})
	});
}
function renderInlineFormatting(text) {
	return text.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, index) => {
		if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-ink",
			children: part.slice(2, -2)
		}, index);
		if (part.startsWith("`") && part.endsWith("`")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "px-1 py-0.5 rounded bg-ink/[0.06] font-mono text-[11.5px] text-ink",
			children: part.slice(1, -1)
		}, index);
		return part;
	});
}
function CustomSelect({ options, value, onChange, placeholder = "Select...", className = "", align = "left", searchable = false }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const containerRef = (0, import_react.useRef)(null);
	const normalizedOptions = options.map((opt) => {
		if (typeof opt === "string") return {
			value: opt,
			label: opt
		};
		return opt;
	});
	const filteredOptions = query.trim() ? normalizedOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : normalizedOptions;
	const selectedOption = normalizedOptions.find((opt) => opt.value === value);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative w-full text-left ${className}`,
		ref: containerRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setIsOpen(!isOpen),
			className: "w-full flex h-10 items-center justify-between gap-2 bg-background hover:bg-surface-muted border border-line text-ink rounded-xl px-3.5 text-[13.5px] font-medium transition-all cursor-pointer outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 select-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `truncate ${!selectedOption ? "text-ink-3" : "text-ink"}`,
				children: selectedOption ? selectedOption.label : placeholder
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 text-ink-3 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}` })]
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `absolute z-50 mt-1.5 min-w-[200px] w-full max-h-64 overflow-y-auto bg-surface border border-line rounded-xl shadow-xl p-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${align === "right" ? "right-0" : "left-0"}`,
			children: [searchable && normalizedOptions.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-1 mb-1 border-b border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-2 py-1 rounded-lg bg-surface-muted text-ink-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search options…",
						className: "w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-4"
					})]
				})
			}), filteredOptions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3.5 py-3 text-center text-[12.5px] text-ink-3 select-none",
				children: "No matching options"
			}) : filteredOptions.map((opt) => {
				const isSelected = opt.value === value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onChange(opt.value);
						setIsOpen(false);
						setQuery("");
					},
					className: `w-full flex items-center justify-between gap-3 px-3 py-2 text-[13px] rounded-lg text-left cursor-pointer transition-colors ${isSelected ? "bg-primary/10 text-primary font-semibold" : "text-ink-2 hover:bg-surface-muted hover:text-ink"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: opt.label
					}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary shrink-0" })]
				}, opt.value);
			})]
		})]
	});
}
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/domains",
		label: "Domains",
		icon: Globe
	},
	{
		to: "/employees",
		label: "Employees",
		icon: Users
	},
	{
		to: "/gmail",
		label: "Gmail",
		icon: Mail
	},
	{
		to: "/aliases",
		label: "Aliases",
		icon: AtSign
	},
	{
		to: "/signatures",
		label: "Signatures",
		icon: PenLine
	},
	{
		to: "/catch-all",
		label: "Catch-all",
		icon: Inbox
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/logs",
		label: "Logs",
		icon: ScrollText
	},
	{
		to: "/help",
		label: "Help & Docs",
		icon: CircleQuestionMark
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
var COLLAPSED_KEY = "mailcoy:sidebar-collapsed";
function useTheme() {
	const [theme, setTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("mailcoy_theme");
		if (stored === "dark" || !stored && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setTheme("dark");
			document.documentElement.classList.add("dark");
		} else {
			setTheme("light");
			document.documentElement.classList.remove("dark");
		}
	}, []);
	const toggle = () => {
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			localStorage.setItem("mailcoy_theme", next);
			if (next === "dark") document.documentElement.classList.add("dark");
			else document.documentElement.classList.remove("dark");
			return next;
		});
	};
	return {
		theme,
		toggle
	};
}
function AppShell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const router = useRouter();
	const qc = useQueryClient();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const fetchOrg = useServerFn(getMyOrganization);
	const { data: org } = useQuery({
		queryKey: ["my-org"],
		queryFn: async () => fetchOrg(),
		staleTime: 6e4
	});
	const { theme, toggle: toggleTheme } = useTheme();
	(0, import_react.useEffect)(() => {
		try {
			setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "1");
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
		} catch {}
	}, [collapsed]);
	(0, import_react.useEffect)(() => {
		setMobileOpen(false);
	}, [path]);
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		router.navigate({
			to: "/auth/login",
			replace: true
		});
	}
	const navItems = NAV;
	const isActive = (to) => path === to || path.startsWith(to + "/");
	const currentLabel = navItems.find((n) => isActive(n.to))?.label ?? "Workspace";
	const orgName = org?.name ?? "";
	const orgLogo = org?.logo_url ?? null;
	const orgInitial = orgName ? orgName.charAt(0).toUpperCase() : "•";
	const [userEmail, setUserEmail] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? ""));
	}, []);
	const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "•";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `min-h-screen bg-background text-foreground grid grid-cols-1 grid-rows-[auto_1fr] md:grid-rows-none ${collapsed ? "md:grid-cols-[64px_1fr]" : "md:grid-cols-[220px_1fr]"} transition-[grid-template-columns] duration-200`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden md:flex flex-col border-r border-line bg-background sticky top-0 h-screen",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-14 flex items-center ${collapsed ? "justify-center px-2" : "px-5"} border-b border-line`,
						children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							title: "Mailcoy",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-6 w-6" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							className: "flex items-center gap-2.5 font-display font-bold text-ink hover:opacity-90 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[15px] leading-tight",
									children: "Mailcoy"
								}), orgName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-sans font-normal text-ink-4 truncate max-w-[130px]",
									children: orgName
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "px-2 py-3 flex-1 space-y-0.5",
						children: navItems.map((item) => {
							const active = isActive(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								title: collapsed ? item.label : void 0,
								"aria-label": item.label,
								className: `group relative flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} h-9 rounded-md text-[13.5px] whitespace-nowrap transition ${active ? "bg-primary text-primary-foreground" : "text-ink-2 hover:bg-ink/[0.04]"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
									!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.label
									}),
									collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pointer-events-none absolute left-full ml-2 z-40 hidden group-hover:block whitespace-nowrap rounded-md border border-line bg-surface px-2 py-1 text-[12px] text-ink shadow-sm",
										children: item.label
									})
								]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-line p-2 space-y-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setCollapsed((v) => !v),
								"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
								title: collapsed ? "Expand sidebar" : "Collapse sidebar",
								className: `w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} h-9 rounded-md text-[13px] text-ink-3 hover:bg-ink/[0.04] transition`,
								children: [collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-4 w-4" }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Collapse" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: toggleTheme,
								"aria-label": "Toggle theme",
								title: "Toggle theme",
								className: `w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} h-9 rounded-md text-[13px] text-ink-3 hover:bg-ink/[0.04] transition`,
								children: [theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: theme === "dark" ? "Light mode" : "Dark mode" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: signOut,
								"aria-label": "Sign out",
								title: "Sign out",
								className: `w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} h-9 rounded-md text-[13px] text-ink-3 hover:text-danger hover:bg-danger/10 transition`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out" })]
							}),
							orgName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `mt-2 flex items-center ${collapsed ? "justify-center" : "gap-2 px-2"} h-10 rounded-md bg-ink/[0.03] border border-line`,
								children: [orgLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: orgLogo,
									alt: "",
									className: "h-6 w-6 rounded object-cover shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-6 w-6 rounded bg-primary text-primary-foreground grid place-items-center text-[11px] font-semibold shrink-0",
									children: orgInitial
								}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[12px] font-medium truncate",
										children: orgName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-ink-3 truncate",
										children: "Workspace"
									})]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "md:hidden sticky top-0 z-30 border-b border-line bg-background/90 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14 items-center justify-between px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						className: "flex items-center gap-2 font-display font-bold text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-5 w-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[15px]",
								children: "Mailcoy"
							}),
							orgName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-ink-4 font-normal",
								children: ["/ ", orgName]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileOpen(true),
							"aria-label": "Open menu",
							className: "grid h-9 w-9 place-items-center rounded-md border border-line text-ink-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						})]
					})]
				})
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden fixed inset-0 z-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/40 backdrop-blur-sm",
					onClick: () => setMobileOpen(false),
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "absolute inset-y-0 left-0 w-72 max-w-[85%] bg-background border-r border-line flex flex-col animate-in slide-in-from-left duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-14 px-4 flex items-center justify-between border-b border-line",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-display font-bold text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logomark, { className: "h-5 w-5" }), " Mailcoy"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileOpen(false),
								"aria-label": "Close menu",
								className: "grid h-9 w-9 place-items-center rounded-md text-ink-3 hover:bg-ink/[0.04]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex-1 p-3 space-y-0.5",
							children: navItems.map((item) => {
								const active = isActive(item.to);
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: `flex items-center gap-3 px-3 h-11 rounded-md text-[14px] whitespace-nowrap transition ${active ? "bg-primary text-primary-foreground" : "text-ink-2 hover:bg-ink/[0.04]"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: signOut,
							className: "m-3 flex items-center gap-3 px-3 h-11 rounded-md text-[13.5px] text-ink-3 border border-line hover:text-danger hover:bg-danger/10 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign out"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-w-0",
				children: [
					typeof window !== "undefined" && localStorage.getItem("mailcoy_impersonating_org_name") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-amber-500 text-amber-950 px-4 py-2 text-[12.5px] font-medium flex items-center justify-between shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-amber-950 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Super Admin Ghost Mode:" }),
								" Viewing as ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: localStorage.getItem("mailcoy_impersonating_org_name") })
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								localStorage.removeItem("mailcoy_impersonating_org_id");
								localStorage.removeItem("mailcoy_impersonating_org_name");
								window.location.href = "/admin/organizations";
							},
							className: "px-2.5 py-1 bg-amber-950 text-amber-100 rounded text-[11.5px] font-semibold hover:bg-black transition",
							children: "Exit Impersonation"
						})]
					}),
					org?.subscription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: org.subscription.isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-rose-500 text-white px-4 py-2.5 text-[13px] font-medium flex flex-wrap items-center justify-between gap-2 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-white animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Subscription Inactive:" }), " Your workspace features are locked. Please activate your subscription to continue routing email and managing domains."] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings/billing",
							className: "px-3 py-1 bg-white text-rose-600 rounded-lg text-[12px] font-bold shadow-xs hover:bg-rose-50 transition whitespace-nowrap",
							children: "Activate Plan & Unlock →"
						})]
					}) : null }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden md:flex sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur px-5 md:px-10 h-14 items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[13px] text-ink-3 truncate",
							children: currentLabel
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserChip, {
								email: userEmail,
								initial: userInitial,
								onSignOut: signOut
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 md:px-10 py-6 md:py-8 max-w-6xl",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportChatWidget, { userEmail })
				]
			})
		]
	});
}
var THEME_KEY = "mailcoy:theme";
function applyTheme(mode) {
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	if (mode === "system") {
		const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		root.classList.add(dark ? "dark" : "light");
	} else root.classList.add(mode);
}
function ThemeToggle() {
	const [mode, setMode] = (0, import_react.useState)("system");
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = typeof window !== "undefined" && localStorage.getItem(THEME_KEY) || "system";
		setMode(saved);
		applyTheme(saved);
		if (saved === "system") {
			const mq = window.matchMedia("(prefers-color-scheme: dark)");
			const fn = () => applyTheme("system");
			mq.addEventListener("change", fn);
			return () => mq.removeEventListener("change", fn);
		}
	}, []);
	function pick(m) {
		setMode(m);
		applyTheme(m);
		try {
			localStorage.setItem(THEME_KEY, m);
		} catch {}
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setOpen((v) => !v),
			"aria-label": "Toggle theme",
			className: "grid h-9 w-9 place-items-center rounded-md border border-line text-ink-2 hover:bg-ink/[0.04]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(mode === "dark" ? Moon : mode === "light" ? Sun : Laptop, { className: "h-4 w-4" })
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-30",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute right-0 mt-1.5 w-36 rounded-md border border-line bg-surface p-1 shadow-lg z-40",
			children: [
				"system",
				"light",
				"dark"
			].map((m) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => pick(m),
					className: `w-full flex items-center gap-2 px-2 h-8 rounded text-[13px] capitalize hover:bg-ink/[0.05] ${mode === m ? "text-ink font-medium" : "text-ink-2"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m === "dark" ? Moon : m === "light" ? Sun : Laptop, { className: "h-3.5 w-3.5" }),
						" ",
						m
					]
				}, m);
			})
		})] })]
	});
}
function UserChip({ email, initial, onSignOut }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setOpen((v) => !v),
			"aria-label": "Account",
			className: "grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-[12px] font-semibold",
			children: initial
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-30",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 mt-1.5 w-56 rounded-md border border-line bg-surface p-1 shadow-lg z-40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-2.5 py-2 border-b border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] text-ink-3",
						children: "Signed in as"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-medium truncate",
						children: email || "—"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/settings",
					onClick: () => setOpen(false),
					className: "w-full flex items-center gap-2 px-2 h-8 rounded text-[13px] text-ink-2 hover:bg-ink/[0.05]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }), " Account settings"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onSignOut,
					className: "w-full flex items-center gap-2 px-2 h-8 rounded text-[13px] text-danger hover:bg-danger/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign out"]
				})
			]
		})] })]
	});
}
function PageHeader({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl md:text-[28px] font-semibold tracking-tight truncate",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[14px] text-ink-3",
				children: subtitle
			})]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 shrink-0",
			children: actions
		})]
	});
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-xl border border-line bg-surface ${className}`,
		children
	});
}
function Button({ variant = "primary", className = "", ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: `inline-flex items-center justify-center h-9 px-4 rounded-md text-[13px] font-medium whitespace-nowrap transition disabled:opacity-50 ${variant === "primary" ? "bg-primary text-primary-foreground hover:opacity-90" : variant === "danger" ? "bg-danger text-white hover:opacity-90" : "border border-line hover:bg-ink/[0.04]"} ${className}`,
		...rest
	});
}
function Input(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: `w-full h-10 rounded-xl border border-line bg-background px-3 text-[14px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition ${props.className ?? ""}`
	});
}
function Field({ label, children, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-[13px] font-medium text-ink-2",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-[12px] text-ink-3",
				children: hint
			})
		]
	});
}
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${{
			verified: "bg-emerald-500/10 text-emerald-700",
			connected: "bg-emerald-500/10 text-emerald-700",
			active: "bg-emerald-500/10 text-emerald-700",
			healthy: "bg-emerald-500/10 text-emerald-700",
			delivered: "bg-emerald-500/10 text-emerald-700",
			pending: "bg-amber-500/10 text-amber-700",
			pending_auth: "bg-amber-500/10 text-amber-700",
			invited: "bg-amber-500/10 text-amber-700",
			failed: "bg-red-500/10 text-red-700",
			bounced: "bg-red-500/10 text-red-700",
			inactive: "bg-ink/[0.06] text-ink-3",
			suspended: "bg-ink/[0.06] text-ink-3",
			deleted: "bg-ink/[0.06] text-ink-3"
		}[status] ?? "bg-ink/[0.06] text-ink-3"}`,
		children: status.replace(/_/g, " ")
	});
}
function ConfirmDeleteModal({ title, description, confirmLabel = "Delete", busy = false, onConfirm, onCancel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm",
		role: "dialog",
		"aria-modal": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md p-5 shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-md bg-danger/10 text-danger",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: title
					}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[13.5px] text-ink-3",
						children: description
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onCancel,
					disabled: busy,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "danger",
					onClick: onConfirm,
					disabled: busy,
					children: busy ? "Deleting…" : confirmLabel
				})]
			})]
		})
	});
}
//#endregion
export { CustomSelect as a, PageHeader as c, createOrganization as d, getMyOrganization as f, uploadOrganizationLogo as h, ConfirmDeleteModal as i, StatusPill as l, updateOrganization as m, Button as n, Field as o, setOnboardingStep as p, Card as r, Input as s, AppShell as t, SupportChatWidget as u };
