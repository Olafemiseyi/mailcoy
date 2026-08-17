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
    return [
      {
        id: "mock-emp-1", full_name: "Chisom Okoye", professional_email: "chisom@mailcoy.com",
        job_title: "Head of Operations", department: "Operations", phone_number: null, status: "connected",
        invited_at: new Date().toISOString(), connected_at: new Date().toISOString(), added_at: new Date().toISOString(),
        user_id: "mock-user-123", gmail_email: "chisom.okoye@gmail.com", gmail_health: "healthy", gmail_connected: true,
      },
      {
        id: "mock-emp-2", full_name: "Akin", professional_email: "akin@mailcoy.com",
        job_title: "Sales Lead", department: "Sales", phone_number: null, status: "pending",
        invited_at: new Date().toISOString(), connected_at: null, added_at: new Date().toISOString(),
        user_id: null, gmail_email: null, gmail_health: null, gmail_connected: false,
      }
    ];
  });

export const addEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => addSchema.parse(data))
  .handler(async ({ data, context }) => {
    return { id: "mock-emp-3", professional_email: `${data.local_part}@${data.domain}` };
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
    return { inserted: data.rows.map(r => `${r.local_part}@${data.domain}`), skipped: [] };
  });

export const updateEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({
    id: z.string(),
    full_name: z.string().trim().min(1).max(120).optional(),
    job_title: z.string().trim().max(120).nullable().optional(),
    department: z.string().trim().max(120).nullable().optional(),
    status: z.enum(["pending", "connected", "suspended", "inactive"]).optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    return { ok: true };
  });

export const deleteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
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
    return {
      employee: {
        id: data.id, full_name: "Chisom Okoye", professional_email: "chisom@mailcoy.com",
        personal_email: "chisom.okoye@gmail.com", company_email: "chisom@mailcoy.com",
        job_title: "Head of Operations", department: "Operations", status: "connected",
        added_at: new Date().toISOString(), connected_at: new Date().toISOString(),
      },
      aliases: [{ id: "alias-1", address: "chisom@mailcoy.com", is_primary: true }],
      gmail: { google_email: "chisom.okoye@gmail.com", connected_at: new Date().toISOString(), last_health_check_at: new Date().toISOString(), health_status: "healthy" },
      stats: { sent: 120, received: 45, bounceRate: 0.5, lastActivity: new Date().toISOString() },
      messages: [],
    };
  });

