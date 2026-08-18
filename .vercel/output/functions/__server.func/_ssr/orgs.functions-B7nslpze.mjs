import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, n as booleanType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { i as resolveOrgContext } from "./orgContext.server-DcnSceZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orgs.functions-B7nslpze.js
var slugify = (v) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "workspace";
var createOrgSchema = objectType({
	name: stringType().trim().min(2).max(120),
	industry: stringType().trim().max(80).optional(),
	country: stringType().trim().max(80).optional(),
	timezone: stringType().trim().max(80).optional()
});
var getMyOrganization_createServerFn_handler = createServerRpc({
	id: "0e01a238b317d8a3e48a6d04d3336550ef0ee0dc6b727679e753670182f3329f",
	name: "getMyOrganization",
	filename: "src/lib/orgs.functions.ts"
}, (opts) => getMyOrganization.__executeServer(opts));
var getMyOrganization = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyOrganization_createServerFn_handler, async ({ context }) => {
	const ctx = await resolveOrgContext(context.supabase, context.userId);
	if (!ctx) return null;
	return {
		id: ctx.organizationId,
		name: "Empyre Homes",
		slug: "empyre-homes",
		industry: "Real Estate",
		country: "NG",
		timezone: "Africa/Lagos",
		currency: "NGN",
		logo_url: null,
		onboarding_step: 3,
		onboarding_completed_at: (/* @__PURE__ */ new Date()).toISOString(),
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		role: ctx.role,
		platformAdmin: false,
		subscription: ctx.subscription
	};
});
var createOrganization_createServerFn_handler = createServerRpc({
	id: "27cbf2bbd7ccbe1161a623db4e370d4f8a611a178244ce098ec852456c918005",
	name: "createOrganization",
	filename: "src/lib/orgs.functions.ts"
}, (opts) => createOrganization.__executeServer(opts));
var createOrganization = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => createOrgSchema.parse(data)).handler(createOrganization_createServerFn_handler, async ({ data, context }) => {
	const existing = await resolveOrgContext(context.supabase, context.userId);
	if (existing) return {
		id: existing.organizationId,
		alreadyExists: true
	};
	const baseSlug = slugify(data.name);
	let slug = baseSlug;
	for (let i = 1; i < 20; i++) {
		const { data: taken } = await context.supabase.from("organizations").select("id").ilike("slug", slug).maybeSingle();
		if (!taken) break;
		slug = `${baseSlug}-${i}`;
	}
	const { data: org, error } = await context.supabase.from("organizations").insert({
		name: data.name,
		slug,
		industry: data.industry ?? null,
		country: data.country ?? null,
		timezone: data.timezone ?? "UTC",
		currency: (data.country ?? "").toUpperCase() === "NG" ? "NGN" : "USD",
		created_by: context.userId,
		onboarding_step: 1
	}).select("id").single();
	if (error || !org) throw error ?? /* @__PURE__ */ new Error("Failed to create organization");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error: memberErr } = await supabaseAdmin.from("organization_members").insert({
		organization_id: org.id,
		user_id: context.userId,
		role: "owner"
	});
	if (memberErr) throw memberErr;
	await supabaseAdmin.from("activity_logs").insert({
		organization_id: org.id,
		actor_user_id: context.userId,
		action: "organization.created",
		meta: { name: data.name }
	});
	return {
		id: org.id,
		alreadyExists: false
	};
});
var setOnboardingStep_createServerFn_handler = createServerRpc({
	id: "19ba82d07bc559e80db1859198f76f42d9a879cb05630e26ad4131ef3ff77e85",
	name: "setOnboardingStep",
	filename: "src/lib/orgs.functions.ts"
}, (opts) => setOnboardingStep.__executeServer(opts));
var setOnboardingStep = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	step: numberType().int().min(0).max(10),
	completed: booleanType().optional()
}).parse(data)).handler(setOnboardingStep_createServerFn_handler, async ({ data, context }) => {
	const ctx = await resolveOrgContext(context.supabase, context.userId);
	if (!ctx) throw new Error("NO_ORGANIZATION");
	const patch = { onboarding_step: data.step };
	if (data.completed) patch.onboarding_completed_at = (/* @__PURE__ */ new Date()).toISOString();
	const { error } = await context.supabase.from("organizations").update(patch).eq("id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
var updateOrgSchema = objectType({
	name: stringType().trim().min(2).max(120).optional(),
	industry: stringType().trim().max(80).nullable().optional(),
	country: stringType().trim().max(80).nullable().optional(),
	timezone: stringType().trim().max(80).optional(),
	currency: enumType(["USD", "NGN"]).optional(),
	logo_url: stringType().url().max(1024).nullable().optional()
});
var updateOrganization_createServerFn_handler = createServerRpc({
	id: "f72d42c8de04bdb1481fc7d1f0200f32b2a525c87dbca515e6a6ab86268c04c7",
	name: "updateOrganization",
	filename: "src/lib/orgs.functions.ts"
}, (opts) => updateOrganization.__executeServer(opts));
var updateOrganization = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => updateOrgSchema.parse(data)).handler(updateOrganization_createServerFn_handler, async ({ data, context }) => {
	const ctx = await resolveOrgContext(context.supabase, context.userId);
	if (!ctx) throw new Error("NO_ORGANIZATION");
	if (ctx.role !== "owner" && ctx.role !== "admin") throw new Error("FORBIDDEN");
	const { error } = await context.supabase.from("organizations").update(data).eq("id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
var uploadOrganizationLogo_createServerFn_handler = createServerRpc({
	id: "ed4ad9a638b3fdbdf4c23c7d9c1699928ed6a83b45621aa379e62fd4f633d5a3",
	name: "uploadOrganizationLogo",
	filename: "src/lib/orgs.functions.ts"
}, (opts) => uploadOrganizationLogo.__executeServer(opts));
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
}).parse(data)).handler(uploadOrganizationLogo_createServerFn_handler, async ({ data, context }) => {
	const ctx = await resolveOrgContext(context.supabase, context.userId);
	if (!ctx) throw new Error("NO_ORGANIZATION");
	if (ctx.role !== "owner" && ctx.role !== "admin") throw new Error("FORBIDDEN");
	const ext = data.contentType === "image/jpeg" ? "jpg" : data.contentType.split("/")[1].replace("svg+xml", "svg");
	const safeName = data.fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 80);
	const path = `logos/${ctx.organizationId}/${Date.now()}-${safeName || `logo.${ext}`}`;
	const bytes = Buffer.from(data.base64, "base64");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error: uploadError } = await supabaseAdmin.storage.from("brand-assets").upload(path, bytes, {
		contentType: data.contentType,
		upsert: true
	});
	if (uploadError) throw uploadError;
	const { data: signed, error: signError } = await supabaseAdmin.storage.from("brand-assets").createSignedUrl(path, 3600 * 24 * 365 * 10);
	if (signError || !signed?.signedUrl) throw signError ?? /* @__PURE__ */ new Error("Logo upload failed");
	const { error: updateError } = await supabaseAdmin.from("organizations").update({
		logo_url: signed.signedUrl,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", ctx.organizationId);
	if (updateError) throw updateError;
	return { logoUrl: signed.signedUrl };
});
//#endregion
export { createOrganization_createServerFn_handler, getMyOrganization_createServerFn_handler, setOnboardingStep_createServerFn_handler, updateOrganization_createServerFn_handler, uploadOrganizationLogo_createServerFn_handler };
