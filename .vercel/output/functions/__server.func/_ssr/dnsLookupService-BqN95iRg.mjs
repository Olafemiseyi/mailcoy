//#region node_modules/.nitro/vite/services/ssr/assets/dnsLookupService-BqN95iRg.js
var dnsLookupService = {
	/**
	* Resolves DNS records of a given type for a domain.
	* Utilizes our backend proxy first, falling back to direct client queries.
	*/
	async resolve(name, type) {
		const cleanName = name.trim().toLowerCase();
		try {
			const response = await fetch(`/api/dns-resolve?name=${encodeURIComponent(cleanName)}&type=${type}`);
			if (response.ok) {
				const data = await response.json();
				if (data && Array.isArray(data.answers)) return data.answers.map((record) => this.cleanDnsData(typeof record === "string" ? record : record.data));
			}
		} catch (error) {
			console.warn("Backend proxy DNS resolve failed, trying direct direct client-side fallback", error);
		}
		try {
			const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(cleanName)}&type=${type}`);
			if (response.ok) {
				const json = await response.json();
				if (json.Status === 0 && json.Answer && json.Answer.length > 0) return json.Answer.map((record) => this.cleanDnsData(record.data));
			}
		} catch (error) {
			console.warn("Google DNS direct resolve failed, trying Cloudflare fallback", error);
		}
		try {
			const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanName)}&type=${type}`, { headers: { "accept": "application/dns-json" } });
			if (response.ok) {
				const json = await response.json();
				if (json.Status === 0 && json.Answer && json.Answer.length > 0) return json.Answer.map((record) => this.cleanDnsData(record.data));
			}
		} catch (error) {
			console.error("Cloudflare DNS direct resolve failed too", error);
		}
		return [];
	},
	/**
	* DoH responses often wrap TXT record strings in literal double-quotes (e.g. '"v=spf1..."')
	* or break them into segments. This utility cleans and merges them.
	*/
	cleanDnsData(data) {
		if (!data) return "";
		let cleaned = data.trim();
		if (cleaned.startsWith("\"") && cleaned.endsWith("\"")) cleaned = cleaned.slice(1, -1);
		cleaned = cleaned.replace(/"\s+"/g, "");
		cleaned = cleaned.replace(/\\"/g, "\"");
		return cleaned;
	},
	/**
	* Checks domain against common DNSBL spam blacklists
	*/
	async checkBlacklists(domainName) {
		const blacklists = [
			"zen.spamhaus.org",
			"bl.spamcop.net",
			"b.barracudacentral.org",
			"dnsbl.sorbs.net",
			"spam.dnsbl.sorbs.net"
		];
		const listedOn = [];
		for (const bl of blacklists) try {
			const queryName = `${domainName}.${bl}`;
			const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(queryName)}&type=A`);
			if (res.ok) {
				const json = await res.json();
				if (json.Status === 0 && json.Answer && json.Answer.length > 0) listedOn.push(bl);
			}
		} catch {}
		return {
			blacklisted: listedOn.length > 0,
			listedOn,
			totalChecked: blacklists.length
		};
	}
};
//#endregion
export { dnsLookupService };
