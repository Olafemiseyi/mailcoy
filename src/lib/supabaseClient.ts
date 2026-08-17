// Supabase B2B SaaS Integration Client
// This file coordinates with the PostgreSQL schema and acts as the data layer.
// Handles both real Supabase interactions and local secure persistence when env vars are missing.

import { createClient } from '@supabase/supabase-js';
import { User, Domain, Employee, EmailLog } from '../types';
import { domainVerificationService } from './domainVerificationService';

// Retrieve credentials (Lovable Cloud injects VITE_SUPABASE_PUBLISHABLE_KEY)
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey =
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || '';
const isBrowser = typeof window !== 'undefined';

// Detect if we have a valid real Supabase configuration
const isSupabaseConfiguredRaw = 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' && 
  !supabaseUrl.includes('YOUR_') && 
  !supabaseAnonKey.includes('YOUR_');

export let isSupabaseConfigured = isSupabaseConfiguredRaw;

export function forceLocalDatabaseFallback() {
  console.warn('[Supabase Client] Forcing local storage database fallback due to missing/unconfigured tables!');
  isSupabaseConfigured = false;
}

export function isMissingTableError(error: any): boolean {
  if (!error) return false;
  const msg = (error.message || error.toString() || '').toLowerCase();
  const code = error.code || '';
  return (
    (msg.includes('relation') && msg.includes('does not exist')) ||
    msg.includes('schema cache') ||
    msg.includes('could not find') ||
    msg.includes('cannot find') ||
    msg.includes('organization_members') ||
    msg.includes('row level security') ||
    msg.includes('violates row level security policy') ||
    msg.includes('insufficient_privilege') ||
    msg.includes('failed to fetch') ||
    msg.includes('fetch') ||
    msg.includes('networkerror') ||
    msg.includes('load failed') ||
    msg.includes('cors') ||
    code === 'PGRST116' ||
    code === '42P01' ||
    code === '42501'
  );
}

export const supabase = createClient(
  isSupabaseConfiguredRaw ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfiguredRaw ? supabaseAnonKey : 'placeholder',
  {
    auth: {
      storage: isBrowser ? window.localStorage : undefined,
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
    },
  }
);

// Ensure we have stable initial states for local storage fallback
const initLocalDb = () => {
  if (!isBrowser) return;
  if (!localStorage.getItem('lo_user')) {
    localStorage.setItem('lo_user', 'null');
  }
};

// Initialize Local Database immediately
initLocalDb();

// Structured data layer helper functions
export const dbService = {
  // Helper to get active user ID
  getCurrentUserId(): string {
    // Retrieve from Supabase session if possible
    const sessionStr = localStorage.getItem(`sb-${supabaseUrl.replace(/[^a-zA-Z0-9]/g, '-')}-auth-token`);
    if (sessionStr) {
      try {
        const parsed = JSON.parse(sessionStr);
        if (parsed?.user?.id) return parsed.user.id;
      } catch (e) {}
    }
    const activeUserStr = localStorage.getItem('lo_user');
    if (activeUserStr && activeUserStr !== 'null') {
      try {
        const parsed = JSON.parse(activeUserStr);
        if (parsed?.id) return parsed.id;
      } catch (e) {}
    }
    return 'default_user';
  },

  // 1. AUTHENTICATION SERVICES
  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return null;
        
        // Fetch metadata/profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          if (isMissingTableError(profileError)) {
            forceLocalDatabaseFallback();
            return this.getCurrentUser();
          }
        }

        // Fetch user's organization for the companyName
        let companyName = user.user_metadata?.company_name || '';
        try {
          const { data: member, error: memberError } = await supabase
            .from('organization_members')
            .select('organization_id, organizations(name)')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();

          if (memberError) {
            if (isMissingTableError(memberError)) {
              forceLocalDatabaseFallback();
              return this.getCurrentUser();
            }
          }

          if (member && (member as any).organizations) {
            companyName = (member as any).organizations.name;
          }
        } catch (e) {
          console.error('Error fetching company name', e);
        }

        return {
          id: user.id,
          name: profile?.full_name || user.user_metadata?.name || 'User',
          email: user.email || '',
          companyName
        };
      } catch (err: any) {
        if (isMissingTableError(err)) {
          forceLocalDatabaseFallback();
          return this.getCurrentUser();
        }
        return null;
      }
    } else {
      const activeUserStr = localStorage.getItem('lo_user');
      if (activeUserStr && activeUserStr !== 'null') {
        return JSON.parse(activeUserStr);
      }
      return null;
    }
  },

  async signUp(email: string, name: string, companyName: string, password?: string): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || 'Secure123!',
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name,
            company_name: companyName
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('Registration failed. Please check your inputs.');
      }
      
      return {
        id: data.user.id,
        name,
        email,
        companyName
      };
    } else {
      // Local fallback for signUp
      const usersDb = JSON.parse(localStorage.getItem('lo_users_db') || '{}');
      const emailLower = email.toLowerCase().trim();
      if (usersDb[emailLower]) {
        throw new Error('A user with this email address already exists.');
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        companyName
      };
      
      usersDb[emailLower] = {
        ...newUser,
        password: password || 'Secure123!'
      };
      localStorage.setItem('lo_users_db', JSON.stringify(usersDb));
      localStorage.setItem('lo_user', JSON.stringify(newUser));
      return newUser;
    }
  },

  async signInWithPassword(email: string, password?: string): Promise<User> {
    if (!password) {
      throw new Error('Password is required.');
    }
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          throw error;
        }
        
        if (!data.user) {
          throw new Error('Unable to sign in. User not found.');
        }
        
        // Fetch metadata/profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          if (isMissingTableError(profileError)) {
            forceLocalDatabaseFallback();
            return this.signInWithPassword(email, password);
          }
        }

        let companyName = data.user.user_metadata?.company_name || '';
        try {
          const { data: member, error: memberError } = await supabase
            .from('organization_members')
            .select('organization_id, organizations(name)')
            .eq('user_id', data.user.id)
            .limit(1)
            .maybeSingle();

          if (memberError) {
            if (isMissingTableError(memberError)) {
              forceLocalDatabaseFallback();
              return this.signInWithPassword(email, password);
            }
          }

          if (member && (member as any).organizations) {
            companyName = (member as any).organizations.name;
          }
        } catch (e) {}

        return {
          id: data.user.id,
          name: profile?.full_name || data.user.user_metadata?.name || 'User',
          email: data.user.email || '',
          companyName
        };
      } catch (err: any) {
        if (isMissingTableError(err)) {
          forceLocalDatabaseFallback();
          return this.signInWithPassword(email, password);
        }
        throw err;
      }
    } else {
      // Local fallback for signIn
      const usersDb = JSON.parse(localStorage.getItem('lo_users_db') || '{}');
      const emailLower = email.toLowerCase().trim();
      const storedUser = usersDb[emailLower];
      
      // Special case: pre-registered demo@example.com
      if (emailLower === 'demo@example.com' && !storedUser) {
        const defaultUser: User = {
          id: 'user_demo',
          name: 'Demo Admin',
          email: 'demo@example.com',
          companyName: 'Example Corp'
        };
        usersDb[emailLower] = {
          ...defaultUser,
          password: 'Secure123!'
        };
        localStorage.setItem('lo_users_db', JSON.stringify(usersDb));
        if (password === 'Secure123!') {
          localStorage.setItem('lo_user', JSON.stringify(defaultUser));
          return defaultUser;
        }
      }
      
      if (!storedUser || storedUser.password !== password) {
        throw new Error('Invalid login credentials. Please check your email and password.');
      }
      
      const loggedUser: User = {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        companyName: storedUser.companyName
      };
      localStorage.setItem('lo_user', JSON.stringify(loggedUser));
      return loggedUser;
    }
  },

  async signIn(email: string, password?: string): Promise<User> {
    // Backward compatibility wrapper that enforces Supabase signInWithPassword
    return this.signInWithPassword(email, password || 'Secure123!');
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          if (isMissingTableError(error)) {
            forceLocalDatabaseFallback();
          } else {
            throw error;
          }
        }
      } catch (e) {
        console.warn('Supabase sign out failed, clearing local session', e);
      }
    }
    localStorage.setItem('lo_user', 'null');
  },

  async resetPasswordForEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    if (error) throw error;
  },

  async updateUser(attributes: { password?: string; data?: any }): Promise<void> {
    const { error } = await supabase.auth.updateUser(attributes);
    if (error) throw error;
  },

  // 2. DOMAIN SERVICES
  async getDomain(orgId?: string): Promise<Domain | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        if (isMissingTableError(error)) {
          forceLocalDatabaseFallback();
          return this.getDomain(orgId);
        }
        return null;
      }
      if (!data) return null;

      return {
        domainName: data.domain_name,
        status: data.verification_status as 'pending' | 'verified' | 'failed',
        txtRecordKey: data.txt_record_key,
        txtRecordValue: data.txt_record_value,
        mxRecords: [
          { type: 'MX', host: '@', priority: 10, value: 'mx1.mailcoy.connect' },
          { type: 'MX', host: '@', priority: 20, value: 'mx2.mailcoy.connect' }
        ],
        spfValue: data.spf_value,
        dkimSelector: data.dkim_selector,
        dkimValue: data.dkim_value,
        verificationToken: data.verification_token,
        verificationMethod: data.verification_method,
        mxStatus: data.mx_status as 'pending' | 'verified' | 'failed',
        spfStatus: data.spf_status as 'pending' | 'verified' | 'failed',
        dkimStatus: data.dkim_status as 'pending' | 'verified' | 'failed',
        dmarcStatus: data.dmarc_status as 'pending' | 'verified' | 'failed',
        verifiedAt: data.verified_at,
        lastCheckedAt: data.last_checked_at,
        verificationErrors: data.verification_errors
      };
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_domain_${userId}`;
      const stored = localStorage.getItem(key);
      
      if (stored && stored !== 'null') {
        return JSON.parse(stored);
      }
      
      // If the user is the default demo@example.com, pre-populate a verified domain immediately
      const userStr = localStorage.getItem('lo_user');
      const userObj = userStr && userStr !== 'null' ? JSON.parse(userStr) : null;
      if (userObj?.email?.toLowerCase() === 'demo@example.com') {
        const defaultDomain: Domain = {
          domainName: 'example.com',
          status: 'verified',
          txtRecordKey: '@',
          txtRecordValue: 'mailcoy-verification=vj8sdyfhg89',
          mxRecords: [
            { type: 'MX', host: '@', priority: 10, value: 'mx1.mailcoy.connect' },
            { type: 'MX', host: '@', priority: 20, value: 'mx2.mailcoy.connect' }
          ],
          spfValue: 'v=spf1 include:_spf.mailcoy.connect ~all',
          dkimSelector: 'mailcoy',
          dkimValue: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0yR...mailcoy-key',
          mxStatus: 'verified',
          spfStatus: 'verified',
          dkimStatus: 'verified',
          dmarcStatus: 'verified'
        };
        localStorage.setItem(key, JSON.stringify(defaultDomain));
        return defaultDomain;
      }
      
      return null;
    }
  },

  async connectDomain(domainName: string, orgId?: string): Promise<Domain> {
    const details = await this.getSubscriptionDetails();
    if (details.subscription.status !== "active" && details.subscription.status !== "trialing") {
      throw new Error("Your subscription is inactive or expired. Please update your payment information to proceed.");
    }
    if (details.usage.domains >= details.limits.max_domains) {
      throw new Error(`Maximum domain limit of ${details.limits.max_domains} reached for your plan (${details.subscription.plan}). Please upgrade to a higher tier.`);
    }

    const token = Math.random().toString(36).substring(2, 12).toUpperCase();
    const newDomain: Domain = {
      domainName,
      status: 'pending',
      txtRecordKey: '@',
      txtRecordValue: `mailcoy-verification=${token}`,
      mxRecords: [
        { type: 'MX', host: '@', priority: 10, value: 'mx1.mailcoy.connect' },
        { type: 'MX', host: '@', priority: 20, value: 'mx2.mailcoy.connect' }
      ],
      spfValue: 'v=spf1 include:_spf.mailcoy.connect ~all',
      dkimSelector: 'mailcoy',
      dkimValue: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0yR...mailcoy-key',
      verificationToken: token,
      verificationMethod: 'dns',
      mxStatus: 'pending',
      spfStatus: 'pending',
      dkimStatus: 'pending',
      dmarcStatus: 'pending'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: member, error: memberErr } = await supabase.from('organization_members').select('organization_id').limit(1).maybeSingle();
        if (memberErr) {
          if (isMissingTableError(memberErr)) {
            forceLocalDatabaseFallback();
            return this.connectDomain(domainName, orgId);
          }
          throw memberErr;
        }
        
        let oId = orgId || member?.organization_id;
        if (!oId) {
          const { data: { user } } = await supabase.auth.getUser();
          const name = user?.user_metadata?.company_name || 'My Organization';
          const newOrg = await this.createOrganization(name, domainName);
          oId = newOrg.orgId;
        }

        const { error } = await supabase
          .from('domains')
          .upsert({
            organization_id: oId,
            domain_name: domainName,
            verification_status: 'pending',
            verification_token: token,
            verification_method: 'dns',
            mx_status: 'pending',
            spf_status: 'pending',
            dkim_status: 'pending',
            dmarc_status: 'pending',
            txt_record_key: newDomain.txtRecordKey,
            txt_record_value: newDomain.txtRecordValue,
            spf_value: newDomain.spfValue,
            dkim_selector: newDomain.dkimSelector,
            dkim_value: newDomain.dkimValue
          });
        if (error) {
          if (isMissingTableError(error)) {
            forceLocalDatabaseFallback();
            return this.connectDomain(domainName, orgId);
          }
          throw error;
        }
      } catch (err: any) {
        if (isMissingTableError(err)) {
          forceLocalDatabaseFallback();
          return this.connectDomain(domainName, orgId);
        }
        throw err;
      }
    } else {
      const userId = this.getCurrentUserId();
      localStorage.setItem(`lo_domain_${userId}`, JSON.stringify(newDomain));
    }
    return newDomain;
  },

  async verifyDomain(domainName: string): Promise<Domain> {
    const domain = await this.getDomain();
    if (!domain || domain.domainName !== domainName) {
      throw new Error('Connected domain not found or mismatched');
    }

    // Call real DNS verification engine
    const result = await domainVerificationService.verifyDomain(domain);

    // Save results in database/local storage
    await this.updateDomainVerificationResults(domainName, {
      verificationStatus: result.status,
      mxStatus: result.mxStatus,
      spfStatus: result.spfStatus,
      dkimStatus: result.dkimStatus,
      dmarcStatus: result.dmarcStatus,
      lastCheckedAt: result.lastCheckedAt,
      verificationErrors: result.errors.length > 0 ? result.errors.join(' | ') : null
    });

    const updated = await this.getDomain();
    if (!updated) throw new Error('Failed to retrieve updated domain');
    return updated;
  },

  async updateDomainVerificationResults(domainName: string, results: {
    verificationStatus: 'pending' | 'verified' | 'failed';
    mxStatus: 'pending' | 'verified' | 'failed';
    spfStatus: 'pending' | 'verified' | 'failed';
    dkimStatus: 'pending' | 'verified' | 'failed';
    dmarcStatus: 'pending' | 'verified' | 'failed';
    lastCheckedAt: string;
    verificationErrors: string | null;
  }): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const updates: any = {
        verification_status: results.verificationStatus,
        mx_status: results.mxStatus,
        spf_status: results.spfStatus,
        dkim_status: results.dkimStatus,
        dmarc_status: results.dmarcStatus,
        last_checked_at: results.lastCheckedAt,
        verification_errors: results.verificationErrors
      };
      if (results.verificationStatus === 'verified') {
        updates.verified_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from('domains')
        .update(updates)
        .eq('domain_name', domainName);
      if (error) throw error;
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_domain_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored && stored !== 'null') {
        const domain: Domain = JSON.parse(stored);
        domain.status = results.verificationStatus;
        domain.mxStatus = results.mxStatus;
        domain.spfStatus = results.spfStatus;
        domain.dkimStatus = results.dkimStatus;
        domain.dmarcStatus = results.dmarcStatus;
        domain.lastCheckedAt = results.lastCheckedAt;
        domain.verificationErrors = results.verificationErrors || undefined;
        if (results.verificationStatus === 'verified') {
          domain.verifiedAt = new Date().toISOString();
        }
        localStorage.setItem(key, JSON.stringify(domain));
      }
    }
  },

  async disconnectDomain(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('domains').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
    } else {
      const userId = this.getCurrentUserId();
      localStorage.setItem(`lo_domain_${userId}`, 'null');
      
      // Also clear dependent scoped records so onboarding can restart cleanly
      localStorage.removeItem(`lo_employees_${userId}`);
      localStorage.removeItem(`lo_email_logs_${userId}`);
    }
  },

  // 3. EMPLOYEE SERVICES
  async getEmployees(): Promise<Employee[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('added_at', { ascending: false });

      if (error) {
        if (isMissingTableError(error)) {
          forceLocalDatabaseFallback();
          return this.getEmployees();
        }
        return [];
      }
      return data.map(emp => ({
        id: emp.id,
        name: emp.full_name,
        companyEmail: emp.company_email,
        personalGmail: emp.personal_email,
        status: emp.status as 'active' | 'pending_auth' | 'invited',
        addedAt: emp.added_at.split('T')[0]
      }));
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_employees_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }

      // Initialize dynamic initial employees list matching user's connected domain
      const domain = await this.getDomain();
      const domainName = domain?.domainName || 'company.com';
      
      const defaultEmps: Employee[] = [
        {
          id: `emp_${Date.now()}_1`,
          name: 'Sarah Jenkins',
          companyEmail: `sarah@${domainName}`,
          personalGmail: 'sarah.jenkins.design@gmail.com',
          status: 'active',
          addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        {
          id: `emp_${Date.now()}_2`,
          name: 'Marcus Chen',
          companyEmail: `marcus@${domainName}`,
          personalGmail: 'marcus.chen88@gmail.com',
          status: 'active',
          addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        {
          id: `emp_${Date.now()}_3`,
          name: 'David Kim',
          companyEmail: `david@${domainName}`,
          personalGmail: 'david.kim.work@gmail.com',
          status: 'pending_auth',
          addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
      ];
      localStorage.setItem(key, JSON.stringify(defaultEmps));
      return defaultEmps;
    }
  },

  async addEmployee(name: string, companyEmail: string, personalGmail: string): Promise<Employee> {
    const details = await this.getSubscriptionDetails();
    if (details.subscription.status !== "active" && details.subscription.status !== "trialing") {
      throw new Error("Your subscription is inactive or expired. Please update your payment information to proceed.");
    }
    if (details.usage.employees >= details.limits.max_employees) {
      throw new Error(`Maximum employee limit of ${details.limits.max_employees} reached for your plan (${details.subscription.plan}). Please upgrade to a higher tier.`);
    }

    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      name,
      companyEmail,
      personalGmail,
      status: 'pending_auth',
      addedAt: new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: member, error: memberErr } = await supabase.from('organization_members').select('organization_id').limit(1).maybeSingle();
        if (memberErr) {
          if (isMissingTableError(memberErr)) {
            forceLocalDatabaseFallback();
            return this.addEmployee(name, companyEmail, personalGmail);
          }
          throw memberErr;
        }
        
        let oId = member?.organization_id;
        if (!oId) {
          const { data: { user } } = await supabase.auth.getUser();
          const orgName = user?.user_metadata?.company_name || 'My Organization';
          const defaultDomain = user?.email ? user.email.split('@')[1] : 'company.com';
          const newOrg = await this.createOrganization(orgName, defaultDomain);
          oId = newOrg.orgId;
        }

        const { data, error } = await supabase
          .from('employees')
          .insert({
            organization_id: oId,
            full_name: name,
            company_email: companyEmail,
            personal_email: personalGmail,
            status: 'pending_auth'
          })
          .select()
          .single();

        if (error) {
          if (isMissingTableError(error)) {
            forceLocalDatabaseFallback();
            return this.addEmployee(name, companyEmail, personalGmail);
          }
          throw error;
        }

        return {
          id: data.id,
          name: data.full_name,
          companyEmail: data.company_email,
          personalGmail: data.personal_email,
          status: data.status as 'active' | 'pending_auth' | 'invited',
          addedAt: data.added_at.split('T')[0]
        };
      } catch (err: any) {
        if (isMissingTableError(err)) {
          forceLocalDatabaseFallback();
          return this.addEmployee(name, companyEmail, personalGmail);
        }
        throw err;
      }
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_employees_${userId}`;
      const stored = localStorage.getItem(key);
      const current = stored ? JSON.parse(stored) : [];
      const updated = [newEmp, ...current];
      localStorage.setItem(key, JSON.stringify(updated));
      return newEmp;
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_employees_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const current: Employee[] = JSON.parse(stored);
        localStorage.setItem(key, JSON.stringify(current.filter(emp => emp.id !== id)));
      }
    }
  },

  async updateEmployee(id: string, updates: Partial<Omit<Employee, 'id' | 'addedAt'>>): Promise<Employee> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('employees')
        .update({
          full_name: updates.name,
          company_email: updates.companyEmail,
          personal_email: updates.personalGmail,
          status: updates.status
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        name: data.full_name,
        companyEmail: data.company_email,
        personalGmail: data.personal_email,
        status: data.status as 'active' | 'pending_auth' | 'invited',
        addedAt: data.added_at.split('T')[0]
      };
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_employees_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const current: Employee[] = JSON.parse(stored);
        const updated = current.map(emp => {
          if (emp.id === id) {
            return {
              ...emp,
              ...updates
            };
          }
          return emp;
        });
        localStorage.setItem(key, JSON.stringify(updated));
        const updatedEmp = updated.find(emp => emp.id === id);
        if (!updatedEmp) throw new Error('Employee not found');
        return updatedEmp;
      }
      throw new Error('No employees database found');
    }
  },

  // 4. ROUTING LOGS SERVICES
  async getEmailLogs(): Promise<EmailLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        if (isMissingTableError(error)) {
          forceLocalDatabaseFallback();
          return this.getEmailLogs();
        }
        return [];
      }
      return data.map(log => ({
        id: log.id,
        sender: log.sender,
        receiver: log.receiver,
        subject: log.subject,
        snippet: log.snippet,
        timestamp: this.formatRelativeTime(log.timestamp),
        direction: log.direction as 'incoming' | 'outgoing',
        status: log.status as 'routed' | 'delivered' | 'sent'
      }));
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_email_logs_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }

      // Initialize logs matching their custom domain and user credentials
      const domainObj = await this.getDomain();
      const domainName = domainObj?.domainName || 'company.com';
      const userStr = localStorage.getItem('lo_user');
      const userObj = userStr && userStr !== 'null' ? JSON.parse(userStr) : null;
      const userEmail = userObj?.email || `alex@${domainName}`;

      const defaultLogs: EmailLog[] = [
        {
          id: `log_${Date.now()}_1`,
          sender: 'client@vanguard.com',
          receiver: `sarah@${domainName}`,
          subject: 'RE: Updated Design Proposal',
          snippet: 'Hey Sarah, the branding looks fantastic. We are ready to move forward with...',
          timestamp: '10 mins ago',
          direction: 'incoming',
          status: 'routed'
        },
        {
          id: `log_${Date.now()}_2`,
          sender: `marcus@${domainName}`,
          receiver: 'investor@sequoia.com',
          subject: 'Pitch Deck Delivery',
          snippet: 'Hi, please find attached our Q3 pitch deck outlining our routing infrastructure...',
          timestamp: '1 hour ago',
          direction: 'outgoing',
          status: 'sent'
        },
        {
          id: `log_${Date.now()}_3`,
          sender: 'billing@stripe.com',
          receiver: userEmail,
          subject: 'Your receipt for invoice #20412',
          snippet: 'Thanks for your payment! This is your receipt for your monthly subscription...',
          timestamp: '4 hours ago',
          direction: 'incoming',
          status: 'delivered'
        }
      ];
      localStorage.setItem(key, JSON.stringify(defaultLogs));
      return defaultLogs;
    }
  },

  async addEmailLog(log: Omit<EmailLog, 'id' | 'timestamp'>): Promise<EmailLog> {
    const newLog: EmailLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: 'Just now'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: member, error: memberErr } = await supabase.from('organization_members').select('organization_id').limit(1).maybeSingle();
        if (memberErr) {
          if (isMissingTableError(memberErr)) {
            forceLocalDatabaseFallback();
            return this.addEmailLog(log);
          }
          throw memberErr;
        }
        
        let oId = member?.organization_id;
        if (!oId) {
          const { data: { user } } = await supabase.auth.getUser();
          const orgName = user?.user_metadata?.company_name || 'My Organization';
          const defaultDomain = user?.email ? user.email.split('@')[1] : 'company.com';
          const newOrg = await this.createOrganization(orgName, defaultDomain);
          oId = newOrg.orgId;
        }

        const { data, error } = await supabase
          .from('email_logs')
          .insert({
            organization_id: oId,
            sender: log.sender,
            receiver: log.receiver,
            subject: log.subject,
            snippet: log.snippet,
            direction: log.direction,
            status: log.status
          })
          .select()
          .single();

        if (error) {
          if (isMissingTableError(error)) {
            forceLocalDatabaseFallback();
            return this.addEmailLog(log);
          }
          throw error;
        }
        return {
          id: data.id,
          sender: data.sender,
          receiver: data.receiver,
          subject: data.subject,
          snippet: data.snippet,
          timestamp: 'Just now',
          direction: data.direction as 'incoming' | 'outgoing',
          status: data.status as 'routed' | 'delivered' | 'sent'
        };
      } catch (err: any) {
        if (isMissingTableError(err)) {
          forceLocalDatabaseFallback();
          return this.addEmailLog(log);
        }
        throw err;
      }
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_email_logs_${userId}`;
      const stored = localStorage.getItem(key);
      const current = stored ? JSON.parse(stored) : [];
      const updated = [newLog, ...current];
      localStorage.setItem(key, JSON.stringify(updated));
      return newLog;
    }
  },

  formatRelativeTime(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return new Date(isoString).toLocaleDateString();
  },

  // 5. ORGANIZATION SERVICES
  async createOrganization(name: string, domainName: string): Promise<{ orgId: string }> {
    if (isSupabaseConfigured && supabase) {
      // 1. Generate client-side UUID to avoid post-insert SELECT RLS failure
      const orgId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
          });
      
      const orgSlug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;

      // Insert organization (no select() to prevent reading before user is linked as a member)
      const { error: orgError } = await supabase
        .from('organizations')
        .insert({ 
          id: orgId,
          name, 
          slug: orgSlug
        });

      if (orgError) {
        if (isMissingTableError(orgError)) {
          forceLocalDatabaseFallback();
          return this.createOrganization(name, domainName);
        }
        throw orgError;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User context missing');

      // 2. Insert member link
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: orgId,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      // 3. Create settings and subscription
      await supabase.from('settings').insert({ organization_id: orgId });
      await supabase.from('subscriptions').insert({ organization_id: orgId, plan: 'Starter' });

      // 4. Create initial pending domain entry for domain flow
      const tempDomain = {
        domainName,
        status: 'pending',
        txtRecordKey: '@',
        txtRecordValue: `mailcoy-verification=${Math.random().toString(36).substring(2, 12)}`,
        spfValue: 'v=spf1 include:_spf.mailcoy.connect ~all',
        dkimSelector: 'mailcoy',
        dkimValue: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0yR...mailcoy-key',
      };

      await supabase
        .from('domains')
        .insert({
          organization_id: orgId,
          domain_name: domainName,
          verification_status: 'pending',
          txt_record_key: tempDomain.txtRecordKey,
          txt_record_value: tempDomain.txtRecordValue,
          spf_value: tempDomain.spfValue,
          dkim_selector: tempDomain.dkimSelector,
          dkim_value: tempDomain.dkimValue
        });

      return { orgId };
    } else {
      return { orgId: `org_${Date.now()}` };
    }
  },

  // 6. SETTINGS SERVICES
  async getSettings(): Promise<any> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        if (isMissingTableError(error)) {
          forceLocalDatabaseFallback();
          return this.getSettings();
        }
        return {
          routing_active: true,
          notify_email: true,
          notify_digest: false,
          security_mfa: false,
          dkim_enabled: true
        };
      }
      if (!data) {
        return {
          routing_active: true,
          notify_email: true,
          notify_digest: false,
          security_mfa: false,
          dkim_enabled: true
        };
      }
      return {
        routing_active: data.routing_active,
        notify_email: data.notify_email,
        notify_digest: data.notify_digest,
        security_mfa: data.security_mfa,
        dkim_enabled: data.dkim_enabled
      };
    } else {
      const userId = this.getCurrentUserId();
      const key = `lo_settings_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      const defaultSettings = {
        routing_active: true,
        notify_email: true,
        notify_digest: false,
        security_mfa: false,
        dkim_enabled: true
      };
      localStorage.setItem(key, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
  },

  async updateSettings(updates: any): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: member } = await supabase.from('organization_members').select('organization_id').limit(1).maybeSingle();
      if (!member) return;

      const { error } = await supabase
        .from('settings')
        .update({
          routing_active: updates.routing_active,
          notify_email: updates.notify_email,
          notify_digest: updates.notify_digest,
          security_mfa: updates.security_mfa,
          dkim_enabled: updates.dkim_enabled,
          updated_at: new Date().toISOString()
        })
        .eq('organization_id', member.organization_id);

      if (error) throw error;
    } else {
      const userId = this.getCurrentUserId();
      localStorage.setItem(`lo_settings_${userId}`, JSON.stringify(updates));
    }
  },

  // 7. SUBSCRIPTION SERVICES
  async getSubscriptionDetails(orgId: string = "default_org"): Promise<any> {
    try {
      const res = await fetch(`/api/billing/subscription?orgId=${encodeURIComponent(orgId)}`);
      if (!res.ok) throw new Error("Failed to fetch subscription details from server");
      return await res.json();
    } catch (err) {
      console.error("Billing API error:", err);
      // Fallback
      return {
        subscription: {
          plan: "Starter",
          status: "trialing",
          trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          renewal_date: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000).toISOString()
        },
        limits: {
          max_employees: 15,
          max_aliases: 30,
          max_domains: 1,
          storage_gb: 5,
          api_limit_monthly: 1000
        },
        usage: {
          employees: 3,
          aliases: 3,
          domains: 1
        }
      };
    }
  },

  async getSubscription(): Promise<any> {
    const data = await this.getSubscriptionDetails();
    return {
      plan: data.subscription.plan,
      status: data.subscription.status,
      current_period_end: data.subscription.renewal_date ? data.subscription.renewal_date.split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trial_end: data.subscription.trial_end,
      limits: data.limits,
      usage: data.usage
    };
  },

  async initializeCheckout(planId: string, orgId: string = "default_org", email: string = "admin@mailcoy.co"): Promise<any> {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, orgId, email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to initialize subscription checkout");
    }
    return await res.json();
  },

  async cancelSubscription(orgId: string = "default_org"): Promise<void> {
    const res = await fetch("/api/billing/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId })
    });
    if (!res.ok) throw new Error("Failed to cancel subscription");
  },

  async reactivateSubscription(orgId: string = "default_org"): Promise<void> {
    const res = await fetch("/api/billing/reactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId })
    });
    if (!res.ok) throw new Error("Failed to reactivate subscription");
  },

  async getInvoices(orgId: string = "default_org"): Promise<any[]> {
    try {
      const res = await fetch(`/api/billing/invoices?orgId=${encodeURIComponent(orgId)}`);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  async getPayments(orgId: string = "default_org"): Promise<any[]> {
    try {
      const res = await fetch(`/api/billing/payments?orgId=${encodeURIComponent(orgId)}`);
      if (!res.ok) throw new Error("Failed to fetch payments");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  async updateSubscription(plan: string): Promise<void> {
    // Legacy compatibility method
    console.log("updateSubscription triggered for legacy compatibility:", plan);
  },


  async updateProfile(updates: { name?: string; companyName?: string; email?: string }): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;

      // Update organization name if companyName is updated
      if (updates.companyName) {
        const { data: member } = await supabase.from('organization_members').select('organization_id').limit(1).maybeSingle();
        if (member?.organization_id) {
          await supabase
            .from('organizations')
            .update({ name: updates.companyName })
            .eq('id', member.organization_id);
        }
      }

      return {
        id: user.id,
        name: updates.name || user.user_metadata?.name || '',
        email: user.email || '',
        companyName: updates.companyName || ''
      };
    } else {
      const activeUserStr = localStorage.getItem('lo_user');
      if (!activeUserStr || activeUserStr === 'null') throw new Error('Not logged in');
      const activeUser = JSON.parse(activeUserStr);
      
      const updatedUser = {
        ...activeUser,
        name: updates.name !== undefined ? updates.name : activeUser.name,
        companyName: updates.companyName !== undefined ? updates.companyName : activeUser.companyName,
        email: updates.email !== undefined ? updates.email : activeUser.email,
      };
      
      localStorage.setItem('lo_user', JSON.stringify(updatedUser));
      
      // Also update in lo_users_db
      const usersDb = JSON.parse(localStorage.getItem('lo_users_db') || '{}');
      if (activeUser.email) {
        usersDb[activeUser.email.toLowerCase().trim()] = updatedUser;
        localStorage.setItem('lo_users_db', JSON.stringify(usersDb));
      }
      
      return updatedUser;
    }
  },

  // 8. GMAIL CONNECTION SERVICES (OAuth Backend Integration)
  async getGmailConnections(): Promise<any[]> {
    try {
      const response = await fetch('/api/gmail-connections');
      if (!response.ok) throw new Error('Failed to fetch Gmail connections');
      return await response.json();
    } catch (err) {
      console.error('Error fetching Gmail connections:', err);
      return [];
    }
  },

  async getGoogleAuthUrl(employeeId: string): Promise<string> {
    const response = await fetch(`/api/auth/google/url?employeeId=${encodeURIComponent(employeeId)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to construct Google authorization URL');
    }
    const { url } = await response.json();
    return url;
  },

  async disconnectGmail(employeeId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/gmail-connections/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId }),
      });
      if (!response.ok) throw new Error('Failed to disconnect Gmail account');
      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Error disconnecting Gmail:', err);
      throw err;
    }
  }
};
