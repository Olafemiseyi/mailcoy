// DNS Lookup Service using DNS-over-HTTPS (DoH) API
// Resolves actual DNS records using the public Google and Cloudflare DNS JSON APIs.

export interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface DnsResolveResponse {
  Status: number;
  Answer?: DnsRecord[];
  Comment?: string;
}

export const dnsLookupService = {
  /**
   * Resolves DNS records of a given type for a domain.
   * Utilizes our backend proxy first, falling back to direct client queries.
   */
  async resolve(name: string, type: 'TXT' | 'MX'): Promise<string[]> {
    const cleanName = name.trim().toLowerCase();
    
    // 1. Try backend proxy first
    try {
      const response = await fetch(`/api/dns-resolve?name=${encodeURIComponent(cleanName)}&type=${type}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.answers)) {
          return data.answers.map((record: DnsRecord | string) =>
            this.cleanDnsData(typeof record === 'string' ? record : record.data),
          );
        }
      }
    } catch (error) {
      console.warn('Backend proxy DNS resolve failed, trying direct direct client-side fallback', error);
    }

    // 2. Direct Fallback to Google DNS
    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(cleanName)}&type=${type}`);
      if (response.ok) {
        const json: DnsResolveResponse = await response.json();
        if (json.Status === 0 && json.Answer && json.Answer.length > 0) {
          return json.Answer.map(record => this.cleanDnsData(record.data));
        }
      }
    } catch (error) {
      console.warn('Google DNS direct resolve failed, trying Cloudflare fallback', error);
    }

    // 3. Direct Fallback to Cloudflare DNS
    try {
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanName)}&type=${type}`,
        {
          headers: {
            'accept': 'application/dns-json'
          }
        }
      );
      if (response.ok) {
        const json: DnsResolveResponse = await response.json();
        if (json.Status === 0 && json.Answer && json.Answer.length > 0) {
          return json.Answer.map(record => this.cleanDnsData(record.data));
        }
      }
    } catch (error) {
      console.error('Cloudflare DNS direct resolve failed too', error);
    }

    return [];
  },

  /**
   * DoH responses often wrap TXT record strings in literal double-quotes (e.g. '"v=spf1..."')
   * or break them into segments. This utility cleans and merges them.
   */
  cleanDnsData(data: string): string {
    if (!data) return '';
    let cleaned = data.trim();
    
    // Remove outer double quotes if present
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }
    
    // Sometimes DNS-over-HTTPS splits TXT strings with internal double quotes (e.g. '"part1" "part2"')
    // Replace all literal escaped or raw quotes separating segments
    cleaned = cleaned.replace(/"\s+"/g, '');
    cleaned = cleaned.replace(/\\"/g, '"');
    
    return cleaned;
  },

  /**
   * Checks domain against common DNSBL spam blacklists
   */
  async checkBlacklists(domainName: string): Promise<{ blacklisted: boolean; listedOn: string[]; totalChecked: number }> {
    const blacklists = [
      "zen.spamhaus.org",
      "bl.spamcop.net",
      "b.barracudacentral.org",
      "dnsbl.sorbs.net",
      "spam.dnsbl.sorbs.net"
    ];

    const listedOn: string[] = [];

    // Check each DNSBL list using DoH
    for (const bl of blacklists) {
      try {
        const queryName = `${domainName}.${bl}`;
        const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(queryName)}&type=A`);
        if (res.ok) {
          const json = await res.json();
          // If Status is 0 and has an Answer, it is listed
          if (json.Status === 0 && json.Answer && json.Answer.length > 0) {
            listedOn.push(bl);
          }
        }
      } catch {
        // network failure or non-existent record (safe)
      }
    }

    return {
      blacklisted: listedOn.length > 0,
      listedOn,
      totalChecked: blacklists.length
    };
  }
};
