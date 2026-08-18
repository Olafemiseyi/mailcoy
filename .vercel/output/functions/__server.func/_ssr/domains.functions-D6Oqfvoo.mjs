import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DcOdAUYM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, o as preprocessType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/domains.functions-D6Oqfvoo.js
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
var listDomains = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9dbf480395e65f2b24d417d733ef9c639e450ecef441396c9fc3d2ecdfd6a86b"));
var getDomain = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType() }).parse(data)).handler(createSsrRpc("cdfba61aaf6c6e394a9c84d179bd5d0d7222fc0d0b3d2c137875bd821654c1bb"));
var addDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => addSchema.parse(data)).handler(createSsrRpc("cc0e3538c1a0633c63103c5f66b03bb0389ec33e1be35246f0d51828eb0811ed"));
var deleteDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("97ca449724ce45f955329e26d90a7254b8199399f99eff5d8c57f628cda35984"));
/**
* Runs DNS lookups server-side using Cloudflare DoH, then updates the
* per-record statuses. Verified iff TXT ownership + both MX are OK.
*/
var verifyDomainNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("5f4641b06d4639562f9254a0497059dc0c2e6b233470378b45c674d4b77eb7ed"));
//#endregion
export { verifyDomainNow as a, listDomains as i, deleteDomain as n, getDomain as r, addDomain as t };
