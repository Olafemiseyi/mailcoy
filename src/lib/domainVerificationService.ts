// Domain Verification Service
// Coordinates DNS lookup and validates retrieved records against expected configurations.

import { dnsLookupService } from './dnsLookupService';
import { Domain } from '../types';

export interface VerificationResult {
  status: 'verified' | 'failed' | 'pending';
  mxStatus: 'verified' | 'failed' | 'pending';
  spfStatus: 'verified' | 'failed' | 'pending';
  dkimStatus: 'verified' | 'failed' | 'pending';
  dmarcStatus: 'verified' | 'failed' | 'pending';
  bimiStatus: 'verified' | 'failed' | 'not_configured';
  errors: string[];
  lastCheckedAt: string;
}

export const domainVerificationService = {
  /**
   * Performs real DNS checks for all record types (Ownership TXT, MX, SPF, DKIM, DMARC, BIMI).
   */
  async verifyDomain(domain: Domain): Promise<VerificationResult> {
    const domainName = domain.domainName.trim().toLowerCase();
    const expectedTxt = domain.txtRecordValue.trim();
    const dkimSelector = domain.dkimSelector || 'mailcoy';
    const bimiSelector = domain.bimiSelector || 'default';
    
    const errors: string[] = [];
    let txtVerified = false;
    let mxVerified = false;
    let spfVerified = false;
    let dkimVerified = false;
    let dmarcVerified = false;
    let bimiVerified = false;

    // 1. Ownership TXT Record check
    try {
      const txtRecords = await dnsLookupService.resolve(domainName, 'TXT');
      const match = txtRecords.some(r => r.includes(expectedTxt) || r === expectedTxt);
      if (match) {
        txtVerified = true;
      } else {
        errors.push(`TXT ownership record not found. Expected: "${expectedTxt}". Found: ${txtRecords.length > 0 ? txtRecords.map(r => `"${r}"`).join(', ') : 'None'}`);
      }
    } catch (e: any) {
      errors.push(`TXT query failed: ${e.message}`);
    }

    // 2. MX Records Check
    try {
      const mxRecords = await dnsLookupService.resolve(domainName, 'MX');
      // MX records usually contain priority and domain, e.g. "10 mx1.mailcoy.connect"
      const hasMx1 = mxRecords.some(r => r.toLowerCase().includes('mx1.mailcoy.connect'));
      const hasMx2 = mxRecords.some(r => r.toLowerCase().includes('mx2.mailcoy.connect'));

      if (hasMx1 && hasMx2) {
        mxVerified = true;
      } else {
        const foundStr = mxRecords.length > 0 ? mxRecords.map(r => `"${r}"`).join(', ') : 'None';
        errors.push(`MX records missing or misconfigured. Expected: "10 mx1.mailcoy.connect" and "20 mx2.mailcoy.connect". Found: ${foundStr}`);
      }
    } catch (e: any) {
      errors.push(`MX query failed: ${e.message}`);
    }

    // 3. SPF Check (TXT record on root domain containing 'v=spf1')
    try {
      const txtRecords = await dnsLookupService.resolve(domainName, 'TXT');
      const spfRecords = txtRecords.filter(r => r.toLowerCase().startsWith('v=spf1'));
      const matchesSpf = spfRecords.some(r => r.toLowerCase().includes('include:_spf.mailcoy.connect'));
      
      if (matchesSpf) {
        spfVerified = true;
      } else {
        const foundStr = spfRecords.length > 0 ? spfRecords.map(r => `"${r}"`).join(', ') : 'None';
        errors.push(`SPF record misconfigured. Expected to include "_spf.mailcoy.connect". Found SPF records: ${foundStr}`);
      }
    } catch (e: any) {
      errors.push(`SPF query failed: ${e.message}`);
    }

    // 4. DKIM Check (TXT record at selector._domainkey.domain)
    try {
      const dkimSubdomain = `${dkimSelector}._domainkey.${domainName}`;
      const dkimRecords = await dnsLookupService.resolve(dkimSubdomain, 'TXT');
      const matchesDkim = dkimRecords.some(r => r.toLowerCase().includes('v=dkim1') && (r.includes('p=') || r.includes('mailcoy-key')));

      if (matchesDkim) {
        dkimVerified = true;
      } else {
        const foundStr = dkimRecords.length > 0 ? dkimRecords.map(r => `"${r}"`).join(', ') : 'None';
        errors.push(`DKIM record not found at ${dkimSubdomain}. Expected public key content. Found: ${foundStr}`);
      }
    } catch (e: any) {
      errors.push(`DKIM query failed: ${e.message}`);
    }

    // 5. DMARC Check (TXT record at _dmarc.domain)
    try {
      const dmarcSubdomain = `_dmarc.${domainName}`;
      const dmarcRecords = await dnsLookupService.resolve(dmarcSubdomain, 'TXT');
      const matchesDmarc = dmarcRecords.some(r => r.toLowerCase().startsWith('v=dmarc1'));

      if (matchesDmarc) {
        dmarcVerified = true;
      } else {
        const foundStr = dmarcRecords.length > 0 ? dmarcRecords.map(r => `"${r}"`).join(', ') : 'None';
        errors.push(`DMARC record not found at ${dmarcSubdomain}. Expected record starting with "v=DMARC1". Found: ${foundStr}`);
      }
    } catch (e: any) {
      errors.push(`DMARC query failed: ${e.message}`);
    }

    // 6. BIMI Check (TXT record at default._bimi.domain)
    try {
      const bimiSubdomain = `${bimiSelector}._bimi.${domainName}`;
      const bimiRecords = await dnsLookupService.resolve(bimiSubdomain, 'TXT');
      const matchesBimi = bimiRecords.some(r => r.toLowerCase().startsWith('v=bimi1'));

      if (matchesBimi) {
        bimiVerified = true;
      }
    } catch {
      // BIMI is optional/premium; non-blocking
    }

    const isVerified = txtVerified && mxVerified;

    return {
      status: isVerified ? 'verified' : (errors.length > 0 ? 'failed' : 'pending'),
      mxStatus: mxVerified ? 'verified' : 'failed',
      spfStatus: spfVerified ? 'verified' : 'failed',
      dkimStatus: dkimVerified ? 'verified' : 'failed',
      dmarcStatus: dmarcVerified ? 'verified' : 'failed',
      bimiStatus: bimiVerified ? 'verified' : 'not_configured',
      errors,
      lastCheckedAt: new Date().toISOString()
    };
  }
};
