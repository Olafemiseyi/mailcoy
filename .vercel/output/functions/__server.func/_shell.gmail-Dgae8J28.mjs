import { c as createServerFn } from "./_ssr/createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-DcOdAUYM.mjs";
import { t as requireSupabaseAuth } from "./_ssr/auth-middleware-BwdutfJC.mjs";
import { a as objectType, s as stringType } from "./_libs/zod.mjs";
import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { i as listEmployees } from "./_ssr/employees.functions-BT6KfZ01.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.gmail-Dgae8J28.js
var isGoogleMailConnectorConfigured = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("7312e8661c9bb9217e9dd6507d0d9def3f7cad9701dcae3138a40e61474fa709"));
var disconnectGoogleMail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ employeeId: stringType().uuid() }).parse(data)).handler(createSsrRpc("27b9c6a2f9fcf67db8ccb022583e6dcb45e7c1e87183c701ca2ec4a46ecb41e6"));
var pauseGmailConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ employeeId: stringType().uuid() }).parse(data)).handler(createSsrRpc("84394eee066f094a19916406f9bba4d3ecdeec066eb74b28fdf2dd0b5124374e"));
var resumeGmailConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ employeeId: stringType().uuid() }).parse(data)).handler(createSsrRpc("791401ad0af8edcb2b4d7b0e19cd174b3519d8c932b10798135b90abd327c110"));
/**
* Manually re-trigger Gmail Send As alias setup for an employee.
* Useful for employees who connected before the automation was added,
* or if the first attempt failed due to a temporary Gmail API error.
*/
var triggerSendAsSetup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ employeeId: stringType().uuid() }).parse(data)).handler(createSsrRpc("b5adde9c68bc1eb32a0f596ae0509784831264249f79139af4811e82f33aa6ae"));
var empOpts = queryOptions({
	queryKey: ["employees"],
	queryFn: async () => listEmployees(),
	staleTime: 15e3
});
var cfgOpts = queryOptions({
	queryKey: ["gmail-cfg"],
	queryFn: async () => isGoogleMailConnectorConfigured(),
	staleTime: 6e4
});
//#endregion
export { resumeGmailConnection as a, pauseGmailConnection as i, disconnectGoogleMail as n, triggerSendAsSetup as o, empOpts as r, cfgOpts as t };
