import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { o as useQueryClient, r as useSuspenseQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { X as Key, b as ShieldAlert, u as Trash2 } from "./_libs/lucide-react.mjs";
import { c as PageHeader, l as StatusPill, n as Button, r as Card } from "./_ssr/AppShell-B0jIXsQK.mjs";
import { n as saveSesCredentials, r as sesOpts, t as removeSesCredentials } from "./_shell.settings.aws-CBSS0acj.mjs";
import { t as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.aws-0UXwPVJ7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AwsSettingsRoute() {
	const queryClient = useQueryClient();
	const { data: creds } = useSuspenseQuery(sesOpts);
	const [accessKey, setAccessKey] = (0, import_react.useState)("");
	const [secretKey, setSecretKey] = (0, import_react.useState)("");
	const [region, setRegion] = (0, import_react.useState)(creds?.region || "us-east-1");
	const saveMutation = useMutation({
		mutationFn: async () => saveSesCredentials({ data: {
			accessKeyId: accessKey,
			secretAccessKey: secretKey,
			region
		} }),
		onSuccess: () => {
			toast.success("AWS Credentials securely saved and verified");
			setAccessKey("");
			setSecretKey("");
			queryClient.invalidateQueries({ queryKey: ["ses_credentials"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const removeMutation = useMutation({
		mutationFn: async () => removeSesCredentials(),
		onSuccess: () => {
			toast.success("AWS Credentials removed");
			queryClient.invalidateQueries({ queryKey: ["ses_credentials"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Amazon SES",
				subtitle: "Connect your AWS account to send transactional emails via Amazon Simple Email Service."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-medium text-ink",
						children: "AWS Connection Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-ink-3 mt-1",
						children: "Store your IAM credentials securely to enable bulk sending. We use AES-256-GCM encryption."
					})] }), creds ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: "healthy" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: "paused" })]
				}), creds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4 rounded-lg bg-surface p-4 border border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[12px] font-medium text-ink-3 uppercase tracking-wider mb-1",
								children: "Region"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[14px] text-ink font-mono",
								children: creds.region
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[12px] font-medium text-ink-3 uppercase tracking-wider mb-1",
								children: "Daily Quota"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[14px] text-ink",
								children: creds.daily_quota ? creds.daily_quota.toLocaleString() : "Unknown"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[12px] font-medium text-ink-3 uppercase tracking-wider mb-1",
								children: "Max Send Rate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[14px] text-ink",
								children: creds.send_rate ? `${creds.send_rate}/sec` : "Unknown"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[12px] font-medium text-ink-3 uppercase tracking-wider mb-1",
								children: "Last Updated"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[14px] text-ink",
								children: new Date(creds.updated_at).toLocaleDateString()
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3 mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200",
							onClick: () => {
								if (confirm("Are you sure you want to remove your AWS credentials?")) removeMutation.mutate();
							},
							disabled: removeMutation.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 mr-2" }), "Disconnect AWS"]
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						saveMutation.mutate();
					},
					className: "space-y-4 max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[13px] font-medium text-ink mb-1.5",
							children: "AWS Region"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "w-full h-9 rounded-md border border-line bg-background px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
							value: region,
							onChange: (e) => setRegion(e.target.value),
							required: true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "us-east-1",
									children: "US East (N. Virginia)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "us-west-2",
									children: "US West (Oregon)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "eu-west-1",
									children: "Europe (Ireland)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "eu-central-1",
									children: "Europe (Frankfurt)"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[13px] font-medium text-ink mb-1.5",
							children: "Access Key ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "AKIA...",
							className: "w-full h-9 rounded-md border border-line bg-background px-3 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
							value: accessKey,
							onChange: (e) => setAccessKey(e.target.value),
							required: true,
							minLength: 16
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[13px] font-medium text-ink mb-1.5",
							children: "Secret Access Key"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							placeholder: "••••••••••••••••••••••••••••••••",
							className: "w-full h-9 rounded-md border border-line bg-background px-3 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
							value: secretKey,
							onChange: (e) => setSecretKey(e.target.value),
							required: true,
							minLength: 32
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								variant: "primary",
								disabled: saveMutation.isPending || !accessKey || !secretKey,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-4 h-4 mr-2" }), saveMutation.isPending ? "Verifying..." : "Save Credentials"]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-[13px] text-blue-900 flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-5 h-5 text-blue-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium mb-1",
					children: "IAM User Permissions Required"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-blue-800/80",
					children: [
						"Ensure your IAM user has the ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "bg-blue-100 px-1 py-0.5 rounded text-blue-900",
							children: "AmazonSESFullAccess"
						}),
						" policy, or at minimum permissions for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "bg-blue-100 px-1 py-0.5 rounded text-blue-900",
							children: "ses:SendRawEmail"
						}),
						", ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "bg-blue-100 px-1 py-0.5 rounded text-blue-900",
							children: "ses:GetSendQuota"
						}),
						", and ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "bg-blue-100 px-1 py-0.5 rounded text-blue-900",
							children: "ses:VerifyDomainIdentity"
						}),
						"."
					]
				})] })]
			})
		]
	});
}
//#endregion
export { AwsSettingsRoute as component };
