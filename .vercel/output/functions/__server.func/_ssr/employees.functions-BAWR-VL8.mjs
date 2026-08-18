import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employees.functions-BAWR-VL8.js
var addSchema = objectType({
	full_name: stringType().trim().min(1).max(120),
	local_part: stringType().trim().toLowerCase().min(1).max(64).regex(/^[a-z0-9._-]+$/, "Invalid local part"),
	domain: stringType().trim().toLowerCase().min(3).max(253),
	job_title: stringType().trim().max(120).optional(),
	department: stringType().trim().max(120).optional(),
	phone_number: stringType().trim().max(30).optional()
});
var listEmployees_createServerFn_handler = createServerRpc({
	id: "74a58c73313e14de3edc4f89c650c0ce6c794292f220878d6039341c993f975f",
	name: "listEmployees",
	filename: "src/lib/employees.functions.ts"
}, (opts) => listEmployees.__executeServer(opts));
var listEmployees = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listEmployees_createServerFn_handler, async ({ context }) => {
	return [{
		id: "mock-emp-1",
		full_name: "Chisom Okoye",
		professional_email: "chisom@mailcoy.com",
		job_title: "Head of Operations",
		department: "Operations",
		phone_number: null,
		status: "connected",
		invited_at: (/* @__PURE__ */ new Date()).toISOString(),
		connected_at: (/* @__PURE__ */ new Date()).toISOString(),
		added_at: (/* @__PURE__ */ new Date()).toISOString(),
		user_id: "mock-user-123",
		gmail_email: "chisom.okoye@gmail.com",
		gmail_health: "healthy",
		gmail_connected: true
	}, {
		id: "mock-emp-2",
		full_name: "Akin",
		professional_email: "akin@mailcoy.com",
		job_title: "Sales Lead",
		department: "Sales",
		phone_number: null,
		status: "pending",
		invited_at: (/* @__PURE__ */ new Date()).toISOString(),
		connected_at: null,
		added_at: (/* @__PURE__ */ new Date()).toISOString(),
		user_id: null,
		gmail_email: null,
		gmail_health: null,
		gmail_connected: false
	}];
});
var addEmployee_createServerFn_handler = createServerRpc({
	id: "0d6123ccc4773173059345f1fbee447a607e80201fb97460cd0320d01470a1c8",
	name: "addEmployee",
	filename: "src/lib/employees.functions.ts"
}, (opts) => addEmployee.__executeServer(opts));
var addEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => addSchema.parse(data)).handler(addEmployee_createServerFn_handler, async ({ data, context }) => {
	return {
		id: "mock-emp-3",
		professional_email: `${data.local_part}@${data.domain}`
	};
});
var bulkAddEmployees_createServerFn_handler = createServerRpc({
	id: "047ac3e83bd342d570f5078dfa55dfb025616fad6eb3f38bb684d39cd238741a",
	name: "bulkAddEmployees",
	filename: "src/lib/employees.functions.ts"
}, (opts) => bulkAddEmployees.__executeServer(opts));
var bulkAddEmployees = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	domain: stringType().trim().toLowerCase().min(3).max(253),
	rows: arrayType(objectType({
		full_name: stringType().trim().min(1).max(120),
		local_part: stringType().trim().toLowerCase().min(1).max(64).regex(/^[a-z0-9._-]+$/)
	})).min(1).max(200)
}).parse(data)).handler(bulkAddEmployees_createServerFn_handler, async ({ data, context }) => {
	return {
		inserted: data.rows.map((r) => `${r.local_part}@${data.domain}`),
		skipped: []
	};
});
var updateEmployee_createServerFn_handler = createServerRpc({
	id: "4b74317408ec145028807a51446d80200494215783a445d65ad5e8087d2c4422",
	name: "updateEmployee",
	filename: "src/lib/employees.functions.ts"
}, (opts) => updateEmployee.__executeServer(opts));
var updateEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType(),
	full_name: stringType().trim().min(1).max(120).optional(),
	job_title: stringType().trim().max(120).nullable().optional(),
	department: stringType().trim().max(120).nullable().optional(),
	status: enumType([
		"pending",
		"connected",
		"suspended",
		"inactive"
	]).optional()
}).parse(data)).handler(updateEmployee_createServerFn_handler, async ({ data, context }) => {
	return { ok: true };
});
var deleteEmployee_createServerFn_handler = createServerRpc({
	id: "6994abae10ce20c1c7ee0082e1fceeab981ef11dfcbeb83f7f67977b158c28c0",
	name: "deleteEmployee",
	filename: "src/lib/employees.functions.ts"
}, (opts) => deleteEmployee.__executeServer(opts));
var deleteEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType() }).parse(data)).handler(deleteEmployee_createServerFn_handler, async ({ data, context }) => {
	return { ok: true };
});
var getEmployeeDetail_createServerFn_handler = createServerRpc({
	id: "255290ba80a309426ead09476d3045a7b52f029ce4cfced3b5859a1d93ef1a76",
	name: "getEmployeeDetail",
	filename: "src/lib/employees.functions.ts"
}, (opts) => getEmployeeDetail.__executeServer(opts));
var getEmployeeDetail = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType() }).parse(d)).handler(getEmployeeDetail_createServerFn_handler, async ({ data, context }) => {
	return {
		employee: {
			id: data.id,
			full_name: "Chisom Okoye",
			professional_email: "chisom@mailcoy.com",
			personal_email: "chisom.okoye@gmail.com",
			company_email: "chisom@mailcoy.com",
			job_title: "Head of Operations",
			department: "Operations",
			status: "connected",
			added_at: (/* @__PURE__ */ new Date()).toISOString(),
			connected_at: (/* @__PURE__ */ new Date()).toISOString()
		},
		aliases: [{
			id: "alias-1",
			address: "chisom@mailcoy.com",
			is_primary: true
		}],
		gmail: {
			google_email: "chisom.okoye@gmail.com",
			connected_at: (/* @__PURE__ */ new Date()).toISOString(),
			last_health_check_at: (/* @__PURE__ */ new Date()).toISOString(),
			health_status: "healthy"
		},
		stats: {
			sent: 120,
			received: 45,
			bounceRate: .5,
			lastActivity: (/* @__PURE__ */ new Date()).toISOString()
		},
		messages: []
	};
});
//#endregion
export { addEmployee_createServerFn_handler, bulkAddEmployees_createServerFn_handler, deleteEmployee_createServerFn_handler, getEmployeeDetail_createServerFn_handler, listEmployees_createServerFn_handler, updateEmployee_createServerFn_handler };
