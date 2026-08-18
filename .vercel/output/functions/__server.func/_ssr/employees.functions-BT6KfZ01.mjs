import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DcOdAUYM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employees.functions-BT6KfZ01.js
var addSchema = objectType({
	full_name: stringType().trim().min(1).max(120),
	local_part: stringType().trim().toLowerCase().min(1).max(64).regex(/^[a-z0-9._-]+$/, "Invalid local part"),
	domain: stringType().trim().toLowerCase().min(3).max(253),
	job_title: stringType().trim().max(120).optional(),
	department: stringType().trim().max(120).optional(),
	phone_number: stringType().trim().max(30).optional()
});
var listEmployees = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("74a58c73313e14de3edc4f89c650c0ce6c794292f220878d6039341c993f975f"));
var addEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => addSchema.parse(data)).handler(createSsrRpc("0d6123ccc4773173059345f1fbee447a607e80201fb97460cd0320d01470a1c8"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	domain: stringType().trim().toLowerCase().min(3).max(253),
	rows: arrayType(objectType({
		full_name: stringType().trim().min(1).max(120),
		local_part: stringType().trim().toLowerCase().min(1).max(64).regex(/^[a-z0-9._-]+$/)
	})).min(1).max(200)
}).parse(data)).handler(createSsrRpc("047ac3e83bd342d570f5078dfa55dfb025616fad6eb3f38bb684d39cd238741a"));
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
}).parse(data)).handler(createSsrRpc("4b74317408ec145028807a51446d80200494215783a445d65ad5e8087d2c4422"));
var deleteEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType() }).parse(data)).handler(createSsrRpc("6994abae10ce20c1c7ee0082e1fceeab981ef11dfcbeb83f7f67977b158c28c0"));
var getEmployeeDetail = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType() }).parse(d)).handler(createSsrRpc("255290ba80a309426ead09476d3045a7b52f029ce4cfced3b5859a1d93ef1a76"));
//#endregion
export { updateEmployee as a, listEmployees as i, deleteEmployee as n, getEmployeeDetail as r, addEmployee as t };
