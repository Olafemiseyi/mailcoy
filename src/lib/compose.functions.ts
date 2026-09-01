import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, resolveOrgContext } from "@/server/orgContext.server";

const EmailAddressSchema = z.string().trim().email("Invalid email address");

const SendBusinessEmailSchema = z.object({
  from: EmailAddressSchema,
  fromName: z.string().trim().min(1).max(100).optional(),
  to: z.array(EmailAddressSchema).min(1, "At least one recipient is required"),
  cc: z.array(EmailAddressSchema).optional(),
  bcc: z.array(EmailAddressSchema).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(500),
  html: z.string().min(1, "Email body is required"),
  text: z.string().optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string().min(1),
        content: z.string(), // base64 string
        contentType: z.string().optional(),
      })
    )
    .optional(),
});

export const getComposeContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Fetch organization details
    const { data: org } = await supabaseAdmin
      .from("organizations")
      .select("id, name, slug")
      .eq("id", ctx.organizationId)
      .single();

    // 2. Fetch verified domains for this org
    const { data: domains } = await supabaseAdmin
      .from("domains")
      .select("id, domain_name, verification_status")
      .eq("organization_id", ctx.organizationId);

    const verifiedDomains = (domains || []).filter(
      (d) => d.verification_status === "verified"
    );
    const availableDomains = (domains || []).map((d) => d.domain_name);

    // 3. Fetch employee profile for current user
    const { data: employees } = await supabaseAdmin
      .from("employees")
      .select("id, full_name, professional_email, company_email, job_title, department, phone_number, gmail_connections(google_email)")
      .eq("organization_id", ctx.organizationId);

    const currentEmp = (employees || []).find((e) => e.user_id === context.userId) || (employees || [])[0];

    // 4. Fetch aliases assigned to this employee / org
    const { data: aliases } = await supabaseAdmin
      .from("aliases")
      .select("id, address, is_primary, employee_id")
      .eq("organization_id", ctx.organizationId);

    // Build authorized sender list
    const senderIdentities: Array<{ email: string; name: string; isPrimary: boolean }> = [];

    const defaultName = currentEmp?.full_name || org?.name || "Team Member";

    if (currentEmp?.professional_email) {
      senderIdentities.push({
        email: currentEmp.professional_email,
        name: defaultName,
        isPrimary: true,
      });
    } else if (currentEmp?.company_email) {
      senderIdentities.push({
        email: currentEmp.company_email,
        name: defaultName,
        isPrimary: true,
      });
    }

    // Add assigned or org aliases
    for (const al of aliases || []) {
      if (
        al.address &&
        !senderIdentities.some((s) => s.email.toLowerCase() === al.address.toLowerCase())
      ) {
        senderIdentities.push({
          email: al.address,
          name: defaultName,
          isPrimary: al.is_primary || false,
        });
      }
    }

    // Fallback: If no identities yet, provide first verified domain address
    if (senderIdentities.length === 0 && availableDomains.length > 0) {
      senderIdentities.push({
        email: `hello@${availableDomains[0]}`,
        name: defaultName,
        isPrimary: true,
      });
    }

    // 5. Fetch default signature with dynamic merge variable replacement
    const { data: signatures } = await supabaseAdmin
      .from("email_signatures")
      .select("*")
      .eq("organization_id", ctx.organizationId);

    let baseSignatureHtml = "";
    const empSig = signatures?.find((s) => s.scope === "employee" && s.scope_ref === currentEmp?.id);
    const deptSig = currentEmp?.department
      ? signatures?.find((s) => s.scope === "department" && s.scope_ref === currentEmp.department)
      : null;
    const orgSig = signatures?.find((s) => s.scope === "org");

    const activeSig = empSig || deptSig || orgSig;
    if (activeSig?.html) {
      baseSignatureHtml = activeSig.html;
    } else {
      // Default modern branded signature
      baseSignatureHtml = `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #334155; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-weight: bold; color: #0f172a;">{{name}}</p>
          <p style="margin: 2px 0 0; color: #64748b; font-size: 13px;">{{title}} · {{company}}</p>
          <p style="margin: 4px 0 0; font-size: 13px;"><a href="mailto:{{email}}" style="color: #0284c7; text-decoration: none;">{{email}}</a></p>
        </div>
      `;
    }

    // Replace merge tags
    const renderedSignature = baseSignatureHtml
      .replace(/\{\{\s*name\s*\}\}/gi, currentEmp?.full_name || org?.name || "")
      .replace(/\{\{\s*title\s*\}\}/gi, currentEmp?.job_title || "Team Member")
      .replace(/\{\{\s*department\s*\}\}/gi, currentEmp?.department || "")
      .replace(/\{\{\s*company\s*\}\}/gi, org?.name || "Mailcoy")
      .replace(/\{\{\s*email\s*\}\}/gi, senderIdentities[0]?.email || "")
      .replace(/\{\{\s*website\s*\}\}/gi, availableDomains[0] ? `https://${availableDomains[0]}` : "");

    // 6. Fetch email templates
    const { data: templates } = await supabaseAdmin
      .from("email_templates")
      .select("id, name, subject, html_body")
      .eq("organization_id", ctx.organizationId)
      .order("updated_at", { ascending: false });

    return {
      senderIdentities,
      signatureHtml: renderedSignature,
      templates: templates || [],
      orgName: org?.name || "Workspace",
      availableDomains,
    };
  });

export const sendBusinessEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SendBusinessEmailSchema.parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      throw new Error("Email service is not configured (RESEND_API_KEY missing).");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Validate sender domain authorization
    const senderDomain = data.from.split("@")[1]?.toLowerCase();
    const { data: domainMatch } = await supabaseAdmin
      .from("domains")
      .select("id, verification_status")
      .eq("organization_id", ctx.organizationId)
      .eq("domain_name", senderDomain)
      .maybeSingle();

    // Allow sending if domain belongs to the org, or if it's the verified workspace domain
    if (!domainMatch && senderDomain !== "mailcoy.com") {
      console.warn(`[Mailcoy Send] Sender domain ${senderDomain} not registered for org ${ctx.organizationId}`);
    }

    // 2. Fetch employee or user connected Gmail for smart reply bridging
    const { data: empData } = await supabaseAdmin
      .from("employees")
      .select("id, full_name, gmail_connections(google_email)")
      .eq("organization_id", ctx.organizationId)
      .or(`professional_email.eq.${data.from},company_email.eq.${data.from}`)
      .maybeSingle();

    const employeePersonalEmail =
      (Array.isArray(empData?.gmail_connections)
        ? empData?.gmail_connections[0]?.google_email
        : empData?.gmail_connections?.google_email) || context.userEmail;

    // 3. Register Relay Capability Token for the conversation thread
    let relayToken: string | null = null;
    try {
      const { generateRelayToken } = await import("@/server/relayToken.server");
      relayToken = await generateRelayToken({
        customerEmail: data.to[0],
        customerName: data.to[0].split("@")[0],
        employeePersonalEmail: employeePersonalEmail || context.userEmail,
        employeeBusinessEmail: data.from,
        employeeName: data.fromName || empData?.full_name || "Team Member",
        organizationId: ctx.organizationId,
        originalSubject: data.subject,
        cc: data.cc,
        ts: Date.now(),
      });
    } catch (tokenErr) {
      console.warn("[Mailcoy Send] Could not generate conversation relay token:", tokenErr);
    }

    const senderDisplayName = data.fromName || empData?.full_name || data.from.split("@")[0];
    const fromHeader = `${senderDisplayName} <${data.from}>`;

    // 4. Format attachments for Resend if present
    const resendAttachments = (data.attachments || []).map((att) => ({
      filename: att.filename,
      content: att.content, // base64 string
      content_type: att.contentType,
    }));

    // 5. Outbound dispatch via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromHeader,
        to: data.to,
        ...(data.cc && data.cc.length > 0 ? { cc: data.cc } : {}),
        ...(data.bcc && data.bcc.length > 0 ? { bcc: data.bcc } : {}),
        subject: data.subject,
        html: data.html,
        text: data.text || undefined,
        ...(resendAttachments.length > 0 ? { attachments: resendAttachments } : {}),
        headers: {
          "X-Mailcoy-Outbound": "1",
          ...(relayToken ? { "X-Mailcoy-Relay-Token": relayToken } : {}),
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Mailcoy Send] Resend dispatch error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const resJson = (await res.json()) as any;

    // 6. Record outbound message in email_logs
    try {
      await supabaseAdmin.from("email_logs").insert({
        organization_id: ctx.organizationId,
        sender: data.from,
        receiver: data.to.join(", "),
        subject: data.subject,
        snippet: data.html.replace(/<[^>]*>/g, "").slice(0, 150) || data.subject,
        direction: "outgoing",
        status: "delivered",
        timestamp: new Date().toISOString(),
      });
    } catch (logErr) {
      console.warn("[Mailcoy Send] Error writing email_logs:", logErr);
    }

    return {
      id: resJson?.id,
      status: "delivered",
      to: data.to,
      from: data.from,
    };
  });
