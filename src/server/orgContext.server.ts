// Server-only helper: resolve the caller's active organization + role.
// Used by every protected server function.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type OrgRole = "owner" | "admin" | "member";

export interface SubscriptionInfo {
  plan: string;
  planCode: string;
  status: "active" | "trialing" | "past_due" | "canceled" | "expired";
  isTrial: boolean;
  trialDaysLeft: number;
  isLocked: boolean;
  maxDomains: number;
  maxEmployees: number;
  currentPeriodEnd: string | null;
}

export interface OrgContext {
  organizationId: string;
  role: OrgRole;
  subscription: SubscriptionInfo;
}

const PLAN_LIMITS: Record<string, { maxDomains: number; maxEmployees: number; name: string }> = {
  free: { maxDomains: 1, maxEmployees: 1, name: "Free" },
  starter: { maxDomains: 1, maxEmployees: 5, name: "Starter Pro" },
  growth: { maxDomains: 3, maxEmployees: 20, name: "Growth" },
  scale: { maxDomains: 10, maxEmployees: 50, name: "Scale" },
  custom: { maxDomains: 50, maxEmployees: 500, name: "Enterprise" },
};

/**
 * Returns the caller's first membership and resolved subscription status.
 */
export async function resolveOrgContext(
  supabase: SupabaseClient<Database>,
  userId: string,
  preferredOrgId?: string | null,
): Promise<OrgContext | null> {
  // First, find the user's organization membership
  let query = supabase.from("organization_members").select("organization_id, role").eq("user_id", userId);
  
  if (preferredOrgId) {
    query = query.eq("organization_id", preferredOrgId);
  } else {
    // If no preferred org, just get the first one (most users only have 1 anyway)
    query = query.limit(1);
  }
  
  const { data: members, error: memberErr } = await query;
  
  if (memberErr || !members || members.length === 0) {
    return null; // No organization found for this user
  }
  
  const member = members[0];
  const orgId = member.organization_id;
  
  // Now fetch the subscription for this org
  const { data: subData, error: subErr } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("organization_id", orgId)
    .single();
    
  let planCode = "free";
  let status = "active";
  let isTrial = false;
  let isLocked = false;
  let currentPeriodEnd = null;
  
  if (subData) {
    planCode = subData.plan_code || "free";
    status = subData.status || "active";
    currentPeriodEnd = subData.current_period_end;
    if (status !== "active" && status !== "trialing") {
      isLocked = true;
    }
  }

  const limits = PLAN_LIMITS[planCode] || PLAN_LIMITS.free;

  const subscription: SubscriptionInfo = {
    plan: limits.name,
    planCode,
    status: status as any,
    isTrial,
    trialDaysLeft: 0,
    isLocked,
    maxDomains: limits.maxDomains,
    maxEmployees: limits.maxEmployees,
    currentPeriodEnd,
  };

  return { 
    organizationId: orgId, 
    role: member.role as OrgRole, 
    subscription 
  };
}

export async function requireOrgContext(
  supabase: SupabaseClient<Database>,
  userId: string,
  preferredOrgId?: string | null,
): Promise<OrgContext> {
  const ctx = await resolveOrgContext(supabase, userId, preferredOrgId);
  if (!ctx) throw new Error("NO_ORGANIZATION");
  return ctx;
}

export function assertAdmin(role: OrgRole) {
  if (role !== "owner" && role !== "admin") throw new Error("FORBIDDEN");
}

export function assertNotLocked(subscription: SubscriptionInfo) {
  if (subscription.isLocked) {
    throw new Error(
      "Your subscription is past due or canceled. Please visit Settings → Billing to activate your plan."
    );
  }
}
