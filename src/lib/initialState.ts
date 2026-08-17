import { User, Domain, Employee, EmailLog } from '../types';

export const INITIAL_USER = (
  email: string = 'user@example.com',
  name: string = 'Admin User',
  companyName: string = 'My Company'
): User => ({
  id: 'usr_new',
  name,
  email,
  companyName,
});

export const INITIAL_DOMAIN = (domainName: string = 'example.com'): Domain => ({
  domainName,
  status: 'pending' as const,
  txtRecordKey: '@',
  txtRecordValue: `mailcoy-verification=${Math.random().toString(36).substring(2, 12)}`,
  mxRecords: [
    { type: 'MX', host: '@', priority: 10, value: 'mx1.mailcoy.connect' },
    { type: 'MX', host: '@', priority: 20, value: 'mx2.mailcoy.connect' }
  ],
  spfValue: 'v=spf1 include:_spf.mailcoy.connect ~all',
  dkimSelector: 'mailcoy',
  dkimValue: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0yR...mailcoy-key',
});

export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_EMAIL_LOGS: EmailLog[] = [];

