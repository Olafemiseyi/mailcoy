import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { r as requireOrgContext, t as assertAdmin } from "./orgContext.server-9xtCj_ME.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signatures.functions-d8HJ7M07.js
var listSignatures_createServerFn_handler = createServerRpc({
	id: "b22b12d19446d57457a66e2f3f0825b44db48e0928062c83eef30ee0acd5ee04",
	name: "listSignatures",
	filename: "src/lib/signatures.functions.ts"
}, (opts) => listSignatures.__executeServer(opts));
var listSignatures = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listSignatures_createServerFn_handler, async ({ context }) => {
	return {
		org: {
			id: "sig-org-1",
			scope: "org",
			scope_ref: "org",
			name: "Default Signature",
			html: "<p>Regards,<br/>Mailcoy Team</p>",
			is_default: true,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		},
		departments: [],
		employees: [],
		allEmployees: [{
			id: "mock-emp-1",
			full_name: "Chisom Okoye",
			professional_email: "chisom@mailcoy.com",
			department: "Operations",
			job_title: "Head of Operations"
		}]
	};
});
var upsertSchema = objectType({
	scope: enumType([
		"org",
		"department",
		"employee"
	]),
	scope_ref: stringType().nullable().optional(),
	name: stringType().trim().min(1).max(120),
	html: stringType().max(1e4)
});
var upsertSignature_createServerFn_handler = createServerRpc({
	id: "dafcb694db90dbfd83e672fdc9e15c2ddf49e3142e6ded00ebe3acc3b4e90845",
	name: "upsertSignature",
	filename: "src/lib/signatures.functions.ts"
}, (opts) => upsertSignature.__executeServer(opts));
var upsertSignature = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(upsertSignature_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	let scopeRef = "org";
	if (data.scope === "employee") {
		if (!data.scope_ref) throw new Error("scope_ref (employee_id) required for employee-scope signature");
		scopeRef = data.scope_ref;
	} else if (data.scope === "department") {
		if (!data.scope_ref) throw new Error("scope_ref (department name) required for department-scope signature");
		scopeRef = data.scope_ref;
	}
	const { data: existing } = await context.supabase.from("email_signatures").select("id").eq("organization_id", ctx.organizationId).eq("scope", data.scope).eq("scope_ref", scopeRef).maybeSingle();
	const payload = {
		organization_id: ctx.organizationId,
		scope: data.scope,
		scope_ref: scopeRef,
		name: data.name,
		html: data.html,
		variables: {},
		is_default: data.scope === "org"
	};
	if (existing) {
		const { error } = await context.supabase.from("email_signatures").update({
			name: payload.name,
			html: payload.html
		}).eq("id", existing.id);
		if (error) throw error;
		return { id: existing.id };
	}
	const { data: row, error } = await context.supabase.from("email_signatures").insert(payload).select("id").single();
	if (error || !row) throw error ?? /* @__PURE__ */ new Error("Insert failed");
	return { id: row.id };
});
var deleteSignature_createServerFn_handler = createServerRpc({
	id: "06a13a269101f2a550aa74ef052940e1fb8e3ec5c838acff8712f5edb9fe58c7",
	name: "deleteSignature",
	filename: "src/lib/signatures.functions.ts"
}, (opts) => deleteSignature.__executeServer(opts));
var deleteSignature = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteSignature_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("email_signatures").delete().eq("id", data.id).eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
//#endregion
export { deleteSignature_createServerFn_handler, listSignatures_createServerFn_handler, upsertSignature_createServerFn_handler };
