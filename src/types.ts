export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
}

export interface Domain {
  domainName: string;
  status: 'pending' | 'verified' | 'failed';
  txtRecordKey: string;
  txtRecordValue: string;
  mxRecords: {
    type: string;
    host: string;
    priority: number;
    value: string;
  }[];
  spfValue: string;
  dkimSelector: string;
  dkimValue: string;

  // Real Domain Verification Engine fields
  verificationToken?: string;
  verificationMethod?: string;
  verifiedAt?: string;
  lastCheckedAt?: string;
  mxStatus?: 'pending' | 'verified' | 'failed';
  spfStatus?: 'pending' | 'verified' | 'failed';
  dkimStatus?: 'pending' | 'verified' | 'failed';
  dmarcStatus?: 'pending' | 'verified' | 'failed';
  bimiStatus?: 'pending' | 'verified' | 'failed' | 'not_configured';
  bimiSelector?: string;
  bimiSvgUrl?: string;
  bimiVmcUrl?: string;
  verificationErrors?: string;
}

export interface Employee {
  id: string;
  name: string;
  companyEmail: string; // e.g. john@company.com
  personalGmail: string; // e.g. john.doe@gmail.com
  status: 'active' | 'pending_auth' | 'invited';
  addedAt: string;
}

export type PageId =
  | 'landing'
  | 'auth'
  | 'welcome'
  | 'verify'
  | 'dashboard'
  | 'employees'
  | 'gmail'
  | 'settings'
  | 'billing'
  | 'support';

export interface EmailLog {
  id: string;
  sender: string;
  receiver: string;
  subject: string;
  snippet: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
  status: 'routed' | 'delivered' | 'sent' | 'failed' | 'bounced';
}
