// Automated Background Verification Scheduler
// Periodically re-checks the health of connected domains and updates their status in the database.

import { dbService } from './supabaseClient';
import { domainVerificationService } from './domainVerificationService';

export class VerificationScheduler {
  private static instance: VerificationScheduler | null = null;
  private intervalId: any | null = null;
  private isRunning: boolean = false;
  private checkIntervalMs: number = 5 * 60 * 1000; // 5 minutes standard interval
  private lastRunTime: Date | null = null;

  private constructor() {}

  public static getInstance(): VerificationScheduler {
    if (!VerificationScheduler.instance) {
      VerificationScheduler.instance = new VerificationScheduler();
    }
    return VerificationScheduler.instance;
  }

  /**
   * Starts the periodic background domain check daemon.
   */
  public start(onCheckComplete?: (results: any) => void) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('[VerificationScheduler] Daemon initialized. Re-checking domains every 5 minutes.');

    // Run once immediately on startup
    this.runCheck(onCheckComplete);

    // Setup interval
    this.intervalId = setInterval(() => {
      this.runCheck(onCheckComplete);
    }, this.checkIntervalMs);
  }

  /**
   * Stops the periodic background domain check daemon.
   */
  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[VerificationScheduler] Daemon stopped.');
  }

  /**
   * Performs the verification audit on the currently active domain.
   */
  public async runCheck(callback?: (results: any) => void) {
    this.lastRunTime = new Date();
    console.log(`[VerificationScheduler] Starting domain health check at ${this.lastRunTime.toLocaleTimeString()}`);
    
    try {
      const domain = await dbService.getDomain();
      if (!domain) {
        console.log('[VerificationScheduler] No domain currently connected. Skipping check.');
        return;
      }

      console.log(`[VerificationScheduler] Re-verifying DNS records for: ${domain.domainName}`);
      const result = await domainVerificationService.verifyDomain(domain);
      
      // Update DB with results
      await dbService.updateDomainVerificationResults(domain.domainName, {
        verificationStatus: result.status,
        mxStatus: result.mxStatus,
        spfStatus: result.spfStatus,
        dkimStatus: result.dkimStatus,
        dmarcStatus: result.dmarcStatus,
        lastCheckedAt: result.lastCheckedAt,
        verificationErrors: result.errors.length > 0 ? result.errors.join(' | ') : null
      });

      console.log(`[VerificationScheduler] Health check complete for ${domain.domainName}. Status: ${result.status}`);
      
      if (callback) {
        callback(result);
      }
    } catch (error) {
      console.error('[VerificationScheduler] Error running background domain health check:', error);
    }
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      lastRunTime: this.lastRunTime,
      nextRunTime: this.lastRunTime ? new Date(this.lastRunTime.getTime() + this.checkIntervalMs) : null
    };
  }
}

export const verificationScheduler = VerificationScheduler.getInstance();
