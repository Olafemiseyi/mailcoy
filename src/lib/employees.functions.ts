// Employees + aliases server functions.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, resolveOrgContext, assertAdmin } from "@/server/orgContext.server";
import { toAppError } from "@/lib/errors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const addSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  local_part: z.string().trim().toLowerCase().min(1).max(64).regex(/^[a-z0-9._-]+$/, "Invalid local part"),
  domain: z.string().trim().toLowerCase().min(3).max(253),
  job_title: z.string().trim().max(120).optional(),
  department: z.string().trim().max(120).optional(),
  phone_number: z.string().trim().max(30).optional(),
});

export const listEmployees = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    
    const { data, error } = await context.supabase
      .from("employees")
      .select('*, gmail_connections(google_email, health_status)')
      .eq("organization_id", ctx.organizationId)
      .order("added_at", { ascending: false });
      
    if (error) throw error;
    
    return data.map((emp: any) => {
      const gmail = Array.isArray(emp.gmail_connections) ? emp.gmail_connections[0] : emp.gmail_connections;
      return {
        id: emp.id,
        full_name: emp.full_name,
        professional_email: emp.professional_email || emp.company_email,
        job_title: emp.job_title,
        department: emp.department,
        phone_number: emp.phone_number || null,
        status: emp.status,
        invited_at: emp.invited_at,
        connected_at: emp.connected_at,
        added_at: emp.added_at,
        user_id: emp.user_id,
        gmail_email: gmail?.google_email || null,
        gmail_health: gmail?.health_status || null,
        gmail_connected: !!gmail,
      };
    });
  });

export const addEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => addSchema.parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const profEmail = `${data.local_part}@${data.domain}`;
    const { data: row, error } = await context.supabase
      .from("employees")
      .insert({
        organization_id: ctx.organizationId,
        full_name: data.full_name,
        company_email: profEmail,
        professional_email: profEmail,
        personal_email: profEmail,
        job_title: data.job_title || null,
        department: data.department || null,
        status: "invited"
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: row.id, professional_email: profEmail };
  });

export const bulkAddEmployees = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      domain: z.string().trim().toLowerCase().min(3).max(253),
      rows: z.array(z.object({
        full_name: z.string().trim().min(1).max(120),
        local_part: z.string().trim().toLowerCase().min(1).max(64).regex(/^[a-z0-9._-]+$/),
      })).min(1).max(200),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    
    const inserts = data.rows.map(r => {
      const email = `${r.local_part}@${data.domain}`;
      return {
        organization_id: ctx.organizationId,
        full_name: r.full_name,
        company_email: email,
        professional_email: email,
        personal_email: email,
        status: "invited" as const
      };
    });
    
    const { error } = await context.supabase.from("employees").insert(inserts);
    if (error) throw error;
    return { inserted: data.rows.map(r => `${r.local_part}@${data.domain}`), skipped: [] };
  });

export const updateEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({
    id: z.string(),
    full_name: z.string().trim().min(1).max(120).optional(),
    job_title: z.string().trim().max(120).nullable().optional(),
    department: z.string().trim().max(120).nullable().optional(),
    status: z.enum(["invited", "active", "suspended"]).optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    
    const updatePayload: any = {};
    if (data.full_name !== undefined) updatePayload.full_name = data.full_name;
    if (data.job_title !== undefined) updatePayload.job_title = data.job_title;
    if (data.department !== undefined) updatePayload.department = data.department;
    if (data.status !== undefined) updatePayload.status = data.status;

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await context.supabase
        .from("employees")
        .update(updatePayload)
        .eq("organization_id", ctx.organizationId)
        .eq("id", data.id);
      if (error) throw error;
    }
    return { ok: true };
  });

export const deleteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { error } = await context.supabase
      .from("employees")
      .delete()
      .eq("organization_id", ctx.organizationId)
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export interface EmployeeDetail {
  employee: {
    id: string; full_name: string | null; professional_email: string | null;
    personal_email: string | null; company_email: string | null;
    job_title: string | null; department: string | null; status: string;
    added_at: string; connected_at: string | null;
  };
  aliases: Array<{ id: string; address: string; is_primary: boolean }>;
  gmail: { google_email: string; connected_at: string; last_health_check_at: string | null; health_status: string } | null;
  stats: { sent: number; received: number; bounceRate: number; lastActivity: string | null };
  messages: Array<{
    id: string;
    direction: string;
    sender: string;
    receiver: string;
    subject: string | null;
    snippet: string | null;
    status: string;
    timestamp: string;
  }>;
}

export const getEmployeeDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }): Promise<EmployeeDetail> => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    
    // Fetch employee
    const { data: emp, error: empErr } = await context.supabase
      .from("employees")
      .select("*")
      .eq("organization_id", ctx.organizationId)
      .eq("id", data.id)
      .single();
    if (empErr) throw empErr;

    // Fetch aliases
    const { data: aliases } = await context.supabase
      .from("aliases")
      .select("id, address, is_primary")
      .eq("employee_id", data.id)
      .order("created_at", { ascending: true });

    // Fetch gmail
    const { data: gmail } = await context.supabase
      .from("gmail_connections")
      .select("google_email, connected_at, last_health_check_at, health_status")
      .eq("employee_id", data.id)
      .maybeSingle();

    // Fetch message counts
    const { count: sentCount } = await context.supabase
      .from("outgoing_messages")
      .select("*", { count: 'exact', head: true })
      .eq("employee_id", data.id);

    const { count: receivedCount } = await context.supabase
      .from("incoming_messages")
      .select("*", { count: 'exact', head: true })
      .eq("employee_id", data.id);
      
    // Fetch recent messages
    const { data: recentOut } = await context.supabase
      .from("outgoing_messages")
      .select("id, to_addr, sent_at")
      .eq("employee_id", data.id)
      .order("sent_at", { ascending: false })
      .limit(20);
      
    const { data: recentInc } = await context.supabase
      .from("incoming_messages")
      .select("id, from_addr, received_at")
      .eq("employee_id", data.id)
      .order("received_at", { ascending: false })
      .limit(20);

    const mappedOut = (recentOut || []).map((m: any) => ({
      id: m.id,
      direction: "outbound",
      sender: emp.company_email,
      receiver: m.to_addr,
      subject: null,
      snippet: null,
      status: "delivered",
      timestamp: m.sent_at,
    }));
    
    const mappedInc = (recentInc || []).map((m: any) => ({
      id: m.id,
      direction: "inbound",
      sender: m.from_addr,
      receiver: emp.company_email,
      subject: null,
      snippet: null,
      status: "received",
      timestamp: m.received_at,
    }));
    
    const messages = [...mappedOut, ...mappedInc].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 50);

    return {
      employee: {
        id: emp.id, 
        full_name: emp.full_name, 
        professional_email: emp.professional_email || emp.company_email,
        personal_email: emp.personal_email, 
        company_email: emp.company_email,
        job_title: emp.job_title, 
        department: emp.department, 
        status: emp.status,
        added_at: emp.added_at, 
        connected_at: emp.connected_at,
      },
      aliases: aliases || [],
      gmail: gmail as any,
      stats: { 
        sent: sentCount || 0, 
        received: receivedCount || 0, 
        bounceRate: 0, 
        lastActivity: messages[0]?.timestamp || null 
      },
      messages,
    };
  });

