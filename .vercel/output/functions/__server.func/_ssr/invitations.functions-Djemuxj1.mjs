import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./createSsrRpc-_y7YRLGO.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invitations.functions-Djemuxj1.js
var listInvitesForEmployee = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ employeeId: stringType().uuid().or(stringType()) }).parse(d)).handler(createSsrRpc("e27dfc909f46fb2a31eec4fbb2ae12e704b25ee83a989918bf38f7c1b117d8fa"));
var createInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	employeeId: stringType().uuid(),
	sentVia: enumType([
		"link",
		"email",
		"whatsapp",
		"qr"
	]).default("link")
}).parse(d)).handler(createSsrRpc("e669b038ad0805514a2adf5d25fc43ae8c17ba6712fb539aee2509f7e30ac854"));
var revokeInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("505a8804d7a40b7c9a50e103dbd5ab3ac3d4c604cba803e56c6b91bb07a656b8"));
var getInviteByToken = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ token: stringType().min(10) }).parse(d)).handler(createSsrRpc("101bff38e2c7723c57dd6b0693e19b1fe2c7aceb0fe40fb46d525f77f8d58e10"));
var startGmailByInvite = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	token: stringType().min(10),
	redirectOrigin: stringType().url()
}).parse(d)).handler(createSsrRpc("9f1658659ad1637558292bb46b38b84b77731e76dc2e053d2ae3cbce8c0fc115"));
//#endregion
export { startGmailByInvite as a, revokeInvite as i, getInviteByToken as n, listInvitesForEmployee as r, createInvite as t };
