import { decryptConnectionKey } from "./connectionKeyCrypto-SELLRwlC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/appUserConnections.server-BeN-oFLv.js
async function getConnectionKeyForUser(userId, connectorId) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data, error } = await supabaseAdmin.from("app_user_connections").select("connection_key_ciphertext").eq("user_id", userId).eq("connector_id", connectorId).maybeSingle();
	if (error) throw error;
	return data ? decryptConnectionKey(data.connection_key_ciphertext) : null;
}
async function deleteConnectionKeyForUser(userId, connectorId) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error } = await supabaseAdmin.from("app_user_connections").delete().eq("user_id", userId).eq("connector_id", connectorId);
	if (error) throw error;
}
//#endregion
export { deleteConnectionKeyForUser, getConnectionKeyForUser };
