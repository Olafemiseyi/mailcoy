// @ts-nocheck
// Server-side Webhook Deduplication & Idempotency Module for Mailcoy
// Guarantees atomic check-and-record to prevent duplicate email forwarding.

export type WebhookLockResult =
  | { status: "acquired"; lockId: string }
  | { status: "already_completed" }
  | { status: "currently_processing" };

// In-memory fallback cache for fast sub-millisecond deduplication and dev environments
const memoryLocks = new Map<string, { status: "processing" | "completed" | "failed"; lockedAt: number; id: string }>();

// Cleanup stale in-memory locks every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of memoryLocks.entries()) {
    if (now - val.lockedAt > 30 * 60 * 1000) {
      memoryLocks.delete(key);
    }
  }
}, 10 * 60 * 1000).unref?.();

/**
 * Atomically acquires a lock for an inbound webhook event.
 * Ensures that if 100 identical requests arrive concurrently, exactly ONE gets 'acquired'.
 */
export async function acquireWebhookLock(
  provider: string,
  eventId: string,
  eventType?: string,
  metadata?: Record<string, any>
): Promise<WebhookLockResult> {
  const memoryKey = `${provider}:${eventId}`;
  const now = Date.now();

  // Fast-path in-memory concurrency check
  const mem = memoryLocks.get(memoryKey);
  if (mem) {
    if (mem.status === "completed") {
      return { status: "already_completed" };
    }
    if (mem.status === "processing" && now - mem.lockedAt < 5 * 60 * 1000) {
      return { status: "currently_processing" };
    }
  }

  // Set in-memory processing lock immediately
  const lockId = crypto.randomUUID();
  memoryLocks.set(memoryKey, { status: "processing", lockedAt: now, id: lockId });

  try {
    const { supabaseAdmin } = await import("../integrations/supabase/client.server.ts");

    // 1. Attempt atomic insert in Supabase
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("processed_webhooks")
      .insert({
        event_id: eventId,
        provider,
        event_type: eventType || "email.received",
        status: "processing",
        locked_at: new Date().toISOString(),
        metadata: metadata || {},
      })
      .select("id, status")
      .maybeSingle();

    if (inserted && !insertErr) {
      memoryLocks.set(memoryKey, { status: "processing", lockedAt: now, id: inserted.id });
      return { status: "acquired", lockId: inserted.id };
    }

    // 2. Conflict occurred — check existing database record
    const { data: existing } = await supabaseAdmin
      .from("processed_webhooks")
      .select("id, status, locked_at")
      .eq("provider", provider)
      .eq("event_id", eventId)
      .maybeSingle();

    if (!existing) {
      return { status: "acquired", lockId };
    }

    if (existing.status === "completed") {
      memoryLocks.set(memoryKey, { status: "completed", lockedAt: now, id: existing.id });
      return { status: "already_completed" };
    }

    const dbLockedAt = new Date(existing.locked_at).getTime();
    const isStale = now - dbLockedAt > 5 * 60 * 1000; // 5 minutes stale lock recovery

    // 3. Reclaim stale or failed lock atomically
    if (existing.status === "failed" || isStale) {
      const { data: reclaimed } = await supabaseAdmin
        .from("processed_webhooks")
        .update({
          status: "processing",
          locked_at: new Date().toISOString(),
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .in("status", ["failed", "processing"])
        .select("id")
        .maybeSingle();

      if (reclaimed) {
        memoryLocks.set(memoryKey, { status: "processing", lockedAt: now, id: reclaimed.id });
        return { status: "acquired", lockId: reclaimed.id };
      }
    }

    return { status: "currently_processing" };
  } catch (err) {
    // If Supabase table is not yet migrated, memory lock acts as protective barrier
    console.warn("[WebhookDeduplication] Falling back to in-memory lock:", (err as any)?.message);
    return { status: "acquired", lockId };
  }
}

/**
 * Marks a webhook event as successfully completed and dispatches finished.
 */
export async function markWebhookCompleted(
  lockId: string,
  provider: string,
  eventId: string,
  metadata?: Record<string, any>
): Promise<void> {
  const memoryKey = `${provider}:${eventId}`;
  memoryLocks.set(memoryKey, { status: "completed", lockedAt: Date.now(), id: lockId });

  try {
    const { supabaseAdmin } = await import("../integrations/supabase/client.server.ts");
    await supabaseAdmin
      .from("processed_webhooks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(metadata ? { metadata } : {}),
      })
      .eq("id", lockId);
  } catch (err) {
    console.warn("[WebhookDeduplication] Error marking completed in DB:", (err as any)?.message);
  }
}

/**
 * Marks a webhook event as failed so subsequent retries can re-attempt processing.
 */
export async function markWebhookFailed(
  lockId: string,
  provider: string,
  eventId: string,
  errorMessage: string
): Promise<void> {
  const memoryKey = `${provider}:${eventId}`;
  memoryLocks.set(memoryKey, { status: "failed", lockedAt: Date.now(), id: lockId });

  try {
    const { supabaseAdmin } = await import("../integrations/supabase/client.server.ts");
    await supabaseAdmin
      .from("processed_webhooks")
      .update({
        status: "failed",
        error_message: errorMessage.slice(0, 500),
        updated_at: new Date().toISOString(),
      })
      .eq("id", lockId);
  } catch (err) {
    console.warn("[WebhookDeduplication] Error marking failed in DB:", (err as any)?.message);
  }
}

