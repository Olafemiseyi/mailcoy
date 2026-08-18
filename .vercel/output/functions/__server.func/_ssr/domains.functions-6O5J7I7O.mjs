import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, o as preprocessType, s as stringType } from "../_libs/zod.mjs";
import { n as toAppError } from "./errors-BQqOewcu.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { r as requireOrgContext, t as assertAdmin } from "./orgContext.server-DcnSceZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/domains.functions-6O5J7I7O.js
var DOMAIN_RE = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})+$/;
var cleanDomain = (val) => {
	if (typeof val !== "string") return val;
	try {
		return new URL(val.includes("://") ? val : `http://${val}`).hostname.replace(/^www\./, "");
	} catch {
		return val.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "").trim().toLowerCase();
	}
};
var addSchema = objectType({ name: preprocessType(cleanDomain, stringType().trim().toLowerCase().min(3).max(253).regex(DOMAIN_RE, "Invalid domain")) });
function randomNonce() {
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var listDomains_createServerFn_handler = createServerRpc({
	id: "9dbf480395e65f2b24d417d733ef9c639e450ecef441396c9fc3d2ecdfd6a86b",
	name: "listDomains",
	filename: "src/lib/domains.functions.ts"
}, (opts) => listDomains.__executeServer(opts));
var listDomains = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listDomains_createServerFn_handler, async ({ context }) => {
	return [{
		id: "mock-domain-1",
		organization_id: "mock-org",
		domain_name: "mailcoy.com",
		verification_status: "verified",
		txt_status: "verified",
		mx_status: "verified",
		spf_status: "verified",
		dkim_status: "verified",
		dmarc_status: "verified",
		txt_record_key: "@",
		txt_record_value: "mailcoy-verify=mock-1234",
		spf_value: "v=spf1 include:_spf.mailcoy.com ~all",
		dkim_selector: "mailcoy",
		dkim_value: "v=DKIM1; k=rsa; p=mock",
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	}, {
		id: "mock-domain-2",
		organization_id: "mock-org",
		domain_name: "example.org",
		verification_status: "pending",
		txt_status: "pending",
		mx_status: "pending",
		spf_status: "pending",
		dkim_status: "pending",
		dmarc_status: "pending",
		txt_record_key: "@",
		txt_record_value: "mailcoy-verify=mock-5678",
		spf_value: "v=spf1 include:_spf.mailcoy.com ~all",
		dkim_selector: "mailcoy",
		dkim_value: "v=DKIM1; k=rsa; p=mock",
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	}];
});
var getDomain_createServerFn_handler = createServerRpc({
	id: "cdfba61aaf6c6e394a9c84d179bd5d0d7222fc0d0b3d2c137875bd821654c1bb",
	name: "getDomain",
	filename: "src/lib/domains.functions.ts"
}, (opts) => getDomain.__executeServer(opts));
var getDomain = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType() }).parse(data)).handler(getDomain_createServerFn_handler, async ({ data, context }) => {
	return {
		id: data.id,
		organization_id: "mock-org",
		domain_name: data.id === "mock-domain-1" ? "mailcoy.com" : "example.org",
		verification_status: data.id === "mock-domain-1" ? "verified" : "pending",
		txt_status: data.id === "mock-domain-1" ? "verified" : "pending",
		mx_status: data.id === "mock-domain-1" ? "verified" : "pending",
		spf_status: data.id === "mock-domain-1" ? "verified" : "pending",
		dkim_status: data.id === "mock-domain-1" ? "verified" : "pending",
		dmarc_status: data.id === "mock-domain-1" ? "verified" : "pending",
		txt_record_key: "@",
		txt_record_value: "mailcoy-verify=mock-1234",
		spf_value: "v=spf1 include:_spf.mailcoy.com ~all",
		dkim_selector: "mailcoy",
		dkim_value: "v=DKIM1; k=rsa; p=mock",
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var addDomain_createServerFn_handler = createServerRpc({
	id: "cc0e3538c1a0633c63103c5f66b03bb0389ec33e1be35246f0d51828eb0811ed",
	name: "addDomain",
	filename: "src/lib/domains.functions.ts"
}, (opts) => addDomain.__executeServer(opts));
var addDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => addSchema.parse(data)).handler(addDomain_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { assertNotLocked } = await import("./orgContext.server-DcnSceZD.mjs").then((n) => n.n).then((n) => n.n);
	assertNotLocked(ctx.subscription);
	const { count: domainCount, error: countErr } = await context.supabase.from("domains").select("id", {
		count: "exact",
		head: true
	}).eq("organization_id", ctx.organizationId);
	if (countErr) throw countErr;
	if ((domainCount ?? 0) >= ctx.subscription.maxDomains) throw new Error(`Your current plan (${ctx.subscription.plan}) allows up to ${ctx.subscription.maxDomains} domain(s). Please upgrade your plan in Settings → Billing to add more domains.`);
	const nonce = randomNonce();
	const { data: row, error } = await context.supabase.from("domains").insert({
		organization_id: ctx.organizationId,
		domain_name: data.name,
		txt_record_key: "@",
		txt_record_value: `mailcoy-verify=${nonce}`,
		spf_value: "v=spf1 include:_spf.mailcoy.com ~all",
		dkim_selector: "mailcoy",
		dkim_value: "v=DKIM1; k=rsa; p=<generated when SES is wired>",
		verification_status: "pending",
		txt_status: "pending",
		mx_status: "pending",
		spf_status: "pending",
		dkim_status: "pending",
		dmarc_status: "pending"
	}).select("*").single();
	if (error || !row) {
		console.error("[addDomain] Error inserting domain:", error);
		throw new Error(toAppError(error, "Failed to add domain. Please try again."));
	}
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await supabaseAdmin.from("activity_logs").insert({
		organization_id: ctx.organizationId,
		actor_user_id: context.userId,
		action: "domain.added",
		target_type: "domain",
		target_id: row.id,
		meta: { domain: data.name }
	});
	return row;
});
var deleteDomain_createServerFn_handler = createServerRpc({
	id: "97ca449724ce45f955329e26d90a7254b8199399f99eff5d8c57f628cda35984",
	name: "deleteDomain",
	filename: "src/lib/domains.functions.ts"
}, (opts) => deleteDomain.__executeServer(opts));
var deleteDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deleteDomain_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { data: domain, error: fetchErr } = await context.supabase.from("domains").select("domain_name").eq("id", data.id).eq("organization_id", ctx.organizationId).single();
	if (fetchErr || !domain) throw new Error("Domain not found");
	const { count, error: empErr } = await context.supabase.from("employees").select("*", {
		count: "exact",
		head: true
	}).eq("organization_id", ctx.organizationId).ilike("professional_email", `%@${domain.domain_name}`).is("deleted_at", null);
	if (empErr) throw empErr;
	if (count && count > 0) throw new Error(`Cannot delete domain. There are ${count} employee(s) associated with ${domain.domain_name}.`);
	const { error } = await context.supabase.from("domains").delete().eq("id", data.id).eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
var verifyDomainNow_createServerFn_handler = createServerRpc({
	id: "5f4641b06d4639562f9254a0497059dc0c2e6b233470378b45c674d4b77eb7ed",
	name: "verifyDomainNow",
	filename: "src/lib/domains.functions.ts"
}, (opts) => verifyDomainNow.__executeServer(opts));
var verifyDomainNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(verifyDomainNow_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	const { data: domain, error } = await context.supabase.from("domains").select("*").eq("id", data.id).eq("organization_id", ctx.organizationId).maybeSingle();
	if (error) throw error;
	if (!domain) throw new Error("Domain not found");
	const name = domain.domain_name;
	const selector = domain.dkim_selector ?? "mailcoy";
	const expectedTxt = domain.txt_record_value ?? "";
	const [txtRecords, mxRecords, dkimRecords, dmarcRecords] = await Promise.all([
		doh(name, "TXT"),
		doh(name, "MX"),
		doh(`${selector}._domainkey.${name}`, "TXT"),
		doh(`_dmarc.${name}`, "TXT")
	]);
	const errors = [];
	const txtOk = txtRecords.some((r) => r.includes(expectedTxt));
	if (!txtOk) errors.push(`TXT ownership record not found (expected ${expectedTxt}).`);
	const hasMx1 = mxRecords.some((r) => r.toLowerCase().includes("mx1.mailcoy.com"));
	const hasMx2 = mxRecords.some((r) => r.toLowerCase().includes("mx2.mailcoy.com"));
	const mxOk = hasMx1 && hasMx2;
	if (!mxOk) errors.push("MX records must include mx1 and mx2.mailcoy.com.");
	const spfOk = txtRecords.some((r) => r.toLowerCase().startsWith("v=spf1") && r.toLowerCase().includes("_spf.mailcoy.com"));
	if (!spfOk) errors.push("SPF should include _spf.mailcoy.com.");
	const dkimOk = dkimRecords.some((r) => r.toLowerCase().includes("v=dkim1"));
	if (!dkimOk) errors.push(`DKIM TXT missing at ${selector}._domainkey.${name}.`);
	const dmarcOk = dmarcRecords.some((r) => r.toLowerCase().startsWith("v=dmarc1"));
	if (!dmarcOk) errors.push(`DMARC TXT missing at _dmarc.${name}.`);
	const verified = txtOk && mxOk;
	const patch = {
		txt_status: txtOk ? "verified" : "failed",
		mx_status: mxOk ? "verified" : "failed",
		spf_status: spfOk ? "verified" : "failed",
		dkim_status: dkimOk ? "verified" : "failed",
		dmarc_status: dmarcOk ? "verified" : "failed",
		verification_status: verified ? "verified" : "failed",
		last_checked_at: (/* @__PURE__ */ new Date()).toISOString(),
		verified_at: verified ? (/* @__PURE__ */ new Date()).toISOString() : domain.verified_at,
		errors
	};
	const { data: updated, error: uerr } = await context.supabase.from("domains").update(patch).eq("id", domain.id).select("*").single();
	if (uerr) throw uerr;
	return updated;
});
async function doh(name, type) {
	try {
		const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, { headers: { accept: "application/dns-json" } });
		if (!res.ok) return [];
		const json = await res.json();
		if (json.Status !== 0 || !json.Answer) return [];
		return json.Answer.map((r) => {
			let s = r.data.trim();
			if (s.startsWith("\"") && s.endsWith("\"")) s = s.slice(1, -1);
			s = s.replace(/"\s+"/g, "");
			return s;
		});
	} catch {
		return [];
	}
}
//#endregion
export { addDomain_createServerFn_handler, deleteDomain_createServerFn_handler, getDomain_createServerFn_handler, listDomains_createServerFn_handler, verifyDomainNow_createServerFn_handler };
