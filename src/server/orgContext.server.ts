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
  maxAliases: number;
  maxAliasesPerEmployee: number;
  maxMonthlyMessages: number;
  maxDailyMessages: number;
  maxRecipientsPerMessage: number;
  maxAttachmentBytes: number;
  canUseAliases: boolean;
  canUseCatchAll: boolean;
  canUseCustomSignatures: boolean;
  canUseCustomTemplates: boolean;
  currentPeriodEnd: string | null;
}

export interface OrgContext {
  organizationId: string;
  role: OrgRole;
  subscription: SubscriptionInfo;
}

export const PLAN_LIMITS: Record<
  string,
  {
    maxDomains: number;
    maxEmployees: number;
    maxAliases: number;
    maxAliasesPerEmployee: number;
    maxMonthlyMessages: number;
    maxDailyMessages: number;
    maxRecipientsPerMessage: number;
    maxAttachmentBytes: number;
    canUseAliases: boolean;
    canUseCatchAll: boolean;
    canUseCustomSignatures: boolean;
    canUseCustomTemplates: boolean;
    name: string;
  }
> = {
  free: {
    maxDomains: 1,
    maxEmployees: 1,
    maxAliases: 0,
    maxAliasesPerEmployee: 0,
    maxMonthlyMessages: 50,
    maxDailyMessages: 10,
    maxRecipientsPerMessage: 3,
    maxAttachmentBytes: 5 * 1024 * 1024,
    canUseAliases: false,
    canUseCatchAll: false,
    canUseCustomSignatures: false,
    canUseCustomTemplates: false,
    name: "Free",
  },
  starter: {
    maxDomains: 1,
    maxEmployees: 5,
    maxAliases: 10,
    maxAliasesPerEmployee: 2,
    maxMonthlyMessages: 2000,
    maxDailyMessages: 150,
    maxRecipientsPerMessage: 10,
    maxAttachmentBytes: 10 * 1024 * 1024,
    canUseAliases: true,
    canUseCatchAll: false,
    canUseCustomSignatures: true,
    canUseCustomTemplates: true,
    name: "Starter Pro",
  },
  growth: {
    maxDomains: 3,
    maxEmployees: 20,
    maxAliases: 30,
    maxAliasesPerEmployee: 5,
    maxMonthlyMessages: 10000,
    maxDailyMessages: 500,
    maxRecipientsPerMessage: 25,
    maxAttachmentBytes: 25 * 1024 * 1024,
    canUseAliases: true,
    canUseCatchAll: true,
    canUseCustomSignatures: true,
    canUseCustomTemplates: true,
    name: "Growth",
  },
  scale: {
    maxDomains: 10,
    maxEmployees: 50,
    maxAliases: Infinity,
    maxAliasesPerEmployee: Infinity,
    maxMonthlyMessages: 50000,
    maxDailyMessages: 2500,
    maxRecipientsPerMessage: 50,
    maxAttachmentBytes: 25 * 1024 * 1024,
    canUseAliases: true,
    canUseCatchAll: true,
    canUseCustomSignatures: true,
    canUseCustomTemplates: true,
    name: "Scale",
  },
  custom: {
    maxDomains: 50,
    maxEmployees: 500,
    maxAliases: Infinity,
    maxAliasesPerEmployee: Infinity,
    maxMonthlyMessages: Infinity,
    maxDailyMessages: Infinity,
    maxRecipientsPerMessage: 100,
    maxAttachmentBytes: 25 * 1024 * 1024,
    canUseAliases: true,
    canUseCatchAll: true,
    canUseCustomSignatures: true,
    canUseCustomTemplates: true,
    name: "Enterprise",
  },
};

/**
 * Returns the caller's first membership and resolved subscription status.
 */
export async function resolveOrgContext(
  supabase: SupabaseClient<Database>,
  userId: string,
  preferredOrgId?: string | null,
): Promise<OrgContext | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { getRequest } = await import("@tanstack/react-start/server");

  let actualPreferredOrgId = preferredOrgId;
  if (!actualPreferredOrgId) {
    try {
      const req = getRequest();
      const cookieHeader = req?.headers?.get("cookie") || "";
      const match = cookieHeader.match(/mailcoy_impersonating_org_id=([^;]+)/);
      if (match) actualPreferredOrgId = match[1];
    } catch {
      // Ignore errors if outside request context
    }
  }

  let isSuperAdminImpersonating = false;
  if (actualPreferredOrgId) {
    // If an impersonation cookie is set, verify if they are a platform admin.
    const { data: isAdmin } = await supabaseAdmin.rpc("is_platform_admin", { _user_id: userId });
    if (isAdmin) {
      isSuperAdminImpersonating = true;
    }
  }

  if (!userId && !isSuperAdminImpersonating) {
    return null; // No authenticated user provided
  }

  // First, find the user's organization membership using supabaseAdmin to bypass RLS
  let query = supabaseAdmin.from("organization_members").select("organization_id, role");

  if (actualPreferredOrgId) {
    query = query.eq("organization_id", actualPreferredOrgId);
    // If they are a super admin in ghost mode, don't restrict to their own membership records.
    // We just want to get ANY member to verify the org exists and get a role (defaulting to owner).
    if (!isSuperAdminImpersonating) {
      query = query.eq("user_id", userId);
    }
  } else {
    query = query.eq("user_id", userId).limit(1);
  }

  const { data: members } = await query;
  let member = members?.[0];

  // If super admin impersonating an empty org with zero members (edge case), fake the membership
  if (isSuperAdminImpersonating && !member) {
    member = { organization_id: actualPreferredOrgId, role: "owner" } as any;
  } else if (isSuperAdminImpersonating) {
    // Elevate super admin to owner role in the UI for the impersonated org
    member = { ...member, role: "owner" } as any;
  }

  if (!member) {
    return null; // No organization found for this user
  }

  const orgId = member.organization_id;

  // Now fetch the subscription for this org
  const { data: subData } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("organization_id", orgId)
    .maybeSingle();

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
    maxAliases: limits.maxAliases,
    maxAliasesPerEmployee: limits.maxAliasesPerEmployee,
    maxMonthlyMessages: limits.maxMonthlyMessages,
    maxDailyMessages: limits.maxDailyMessages,
    maxRecipientsPerMessage: limits.maxRecipientsPerMessage,
    maxAttachmentBytes: limits.maxAttachmentBytes,
    canUseAliases: limits.canUseAliases,
    canUseCatchAll: limits.canUseCatchAll,
    canUseCustomSignatures: limits.canUseCustomSignatures,
    canUseCustomTemplates: limits.canUseCustomTemplates,
    currentPeriodEnd,
  };

  return {
    organizationId: orgId,
    role: member.role as OrgRole,
    subscription,
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
      "Your subscription is past due or canceled. Please visit Settings → Billing to activate your plan.",
    );
  }
}
