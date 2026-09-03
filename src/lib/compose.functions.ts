// @ts-nocheck
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
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Guard: Check Organization Membership
    if (!ctx) {
      return {
        status: "no_org" as const,
        hasOrg: false,
        hasVerifiedDomain: false,
        hasGmailConnection: false,
        message: "Your account is not associated with any organization. Please contact your administrator.",
        orgName: null,
        orgLogo: null,
        isAdmin: false,
        employee: null,
        authUrl: null,
        primarySender: null,
        senderIdentities: [],
        availableDomains: [],
        signaturePlainText: "",
        signatureHtml: "",
        customTemplates: [],
      };
    }

    // 2. Fetch organization details
    const { data: org } = await supabaseAdmin
      .from("organizations")
      .select("id, name, slug, logo_url")
      .eq("id", ctx.organizationId)
      .single();

    // 3. Guard: Check Verified Domains for this org
    const { data: domains } = await supabaseAdmin
      .from("domains")
      .select("id, domain_name, verification_status")
      .eq("organization_id", ctx.organizationId);

    const verifiedDomains = (domains || []).filter(
      (d) => d.verification_status === "verified"
    );

    if (verifiedDomains.length === 0) {
      return {
        status: "no_verified_domain" as const,
        hasOrg: true,
        hasVerifiedDomain: false,
        hasGmailConnection: false,
        message: "Your organization does not have any verified email domains yet. Please verify a domain first in the dashboard.",
        orgName: org?.name || "Your Organization",
        orgLogo: org?.logo_url || null,
        isAdmin: ctx.role === "owner" || ctx.role === "admin",
        employee: null,
        authUrl: null,
        primarySender: null,
        senderIdentities: [],
        availableDomains: (domains || []).map((d) => d.domain_name),
        signaturePlainText: "",
        signatureHtml: "",
        customTemplates: [],
      };
    }

    // 4. Fetch direct Google connection if any
    const { data: directConn } = await supabaseAdmin
      .from("app_user_connections")
      .select("config")
      .eq("user_id", context.userId)
      .eq("connector_id", "google_mail")
      .maybeSingle();

    const connectedGoogleEmail = (directConn?.config as any)?.email || null;

    // 5. Fetch employee profile for current user
    const { data: employees } = await supabaseAdmin
      .from("employees")
      .select("id, full_name, professional_email, company_email, personal_email, job_title, department, phone_number, user_id, status, gmail_connections(id, google_email, revoked_at)")
      .eq("organization_id", ctx.organizationId);

    const userEmailLower = context.userEmail?.toLowerCase() || "";
    const googleEmailLower = connectedGoogleEmail?.toLowerCase() || "";

    // Strictly find matching employee by user_id or emails
    const currentEmp = (employees || []).find((e) => {
      const gEmail = Array.isArray(e.gmail_connections)
        ? e.gmail_connections[0]?.google_email?.toLowerCase()
        : (e.gmail_connections as any)?.google_email?.toLowerCase();

      return (
        (e.user_id && e.user_id === context.userId) ||
        (googleEmailLower && (
          e.personal_email?.toLowerCase() === googleEmailLower ||
          e.company_email?.toLowerCase() === googleEmailLower ||
          e.professional_email?.toLowerCase() === googleEmailLower ||
          gEmail === googleEmailLower
        )) ||
        (userEmailLower && (
          e.personal_email?.toLowerCase() === userEmailLower ||
          e.company_email?.toLowerCase() === userEmailLower ||
          e.professional_email?.toLowerCase() === userEmailLower ||
          gEmail === userEmailLower
        ))
      );
    });

    // Guard 5b: Active Dashboard Employee Connection Required for Members
    // As long as the active mail is connected to the owner dashboard, any other email
    // that is not connected to the owner dashboard is strictly barred from accessing compose.
    if (ctx.role === "member" && (!currentEmp || currentEmp.status !== "active")) {
      return {
        status: "unauthorized_employee" as const,
        hasOrg: true,
        hasVerifiedDomain: true,
        hasGmailConnection: false,
        message:
          "This account is not connected to an active employee profile in the workspace dashboard. Please contact your employer.",
        orgName: org?.name || "Your Organization",
        orgLogo: org?.logo_url || null,
        isAdmin: false,
        employee: null,
        authUrl: null,
        primarySender: null,
        senderIdentities: [],
        availableDomains: verifiedDomains.map((d) => d.domain_name),
        signaturePlainText: "",
        signatureHtml: "",
        customTemplates: [],
      };
    }

    // 6. Check if user has an active, verified Gmail connection
    const gconns: any[] = Array.isArray(currentEmp?.gmail_connections)
      ? (currentEmp.gmail_connections as any[])
      : currentEmp?.gmail_connections
      ? [currentEmp.gmail_connections]
      : [];

    const hasActiveGmailConnection = Boolean(
      directConn ||
      gconns.some((g: any) => !g?.revoked_at)
    );

    // If user is a regular member (not owner/admin) and not connected to Gmail yet, require connection
    const isOwnerOrAdmin = ctx.role === "owner" || ctx.role === "admin";
    if (!isOwnerOrAdmin && !hasActiveGmailConnection) {
      let authUrl: string | null = null;
      try {
        const { getRequest } = await import("@tanstack/react-start/server");
        const req = getRequest();
        const origin = req?.headers?.get("origin") || req?.headers?.get("referer") || "http://localhost:3000";
        const cleanOrigin = new URL(origin).origin;
        const redirectUri = `${cleanOrigin}/api/auth/google/callback`;

        const nonce = crypto.randomUUID();
        const jsonStr = JSON.stringify({
          type: "login",
          orgId: ctx.organizationId,
          userId: context.userId,
          userEmail: context.userEmail,
          targetUrl: "/compose",
          nonce,
        });
        const state = Buffer.from(jsonStr).toString("base64url");
        const { buildGoogleAuthUrl } = await import("@/server/googleOAuth.server");
        authUrl = await buildGoogleAuthUrl(redirectUri, state);
      } catch (err) {
        console.error("[getComposeContext] Error building Google auth URL:", err);
      }

      return {
        status: "not_connected" as const,
        hasOrg: true,
        hasVerifiedDomain: true,
        hasGmailConnection: false,
        authUrl,
        employee: currentEmp ? {
          id: currentEmp.id,
          fullName: currentEmp.full_name,
          professionalEmail: currentEmp.professional_email || currentEmp.company_email,
          personalEmail: currentEmp.personal_email,
        } : null,
        message: "You must connect your authorized employee Gmail account via your company invitation to access Mailcoy Compose.",
        orgName: org?.name || "Your Organization",
        orgLogo: org?.logo_url || null,
        isAdmin: ctx.role === "owner" || ctx.role === "admin",
        primarySender: null,
        senderIdentities: [],
        availableDomains: verifiedDomains.map((d) => d.domain_name),
        signaturePlainText: "",
        signatureHtml: "",
        customTemplates: [],
      };
    }

    // 7. Fetch aliases assigned to this org
    const { data: aliases } = await supabaseAdmin
      .from("aliases")
      .select("id, address, is_primary, employee_id")
      .eq("organization_id", ctx.organizationId);

    // Build authorized sender list strictly for THIS user
    const senderIdentities: Array<{ email: string; name: string; isPrimary: boolean }> = [];
    const displayName =
      currentEmp?.full_name ||
      context.userEmail?.split("@")[0] ||
      org?.name ||
      "Team Member";

    // Primary Identity
    const primaryEmail =
      currentEmp?.professional_email ||
      currentEmp?.company_email ||
      (currentEmp?.gmail_connections as any)?.[0]?.google_email ||
      connectedGoogleEmail ||
      (verifiedDomains.length > 0 ? `support@${verifiedDomains[0].domain_name}` : "team@mailcoy.com");

    senderIdentities.push({
      email: primaryEmail,
      name: currentEmp?.full_name || displayName,
      isPrimary: true,
    });

    if (isOwnerOrAdmin) {
      // 1. Add all employee professional emails in the org so owner/admin can send as them
      for (const emp of (employees || [])) {
        const empEmail = emp.professional_email || emp.company_email;
        if (
          empEmail &&
          !senderIdentities.some((s) => s.email.toLowerCase() === empEmail.toLowerCase())
        ) {
          senderIdentities.push({
            email: empEmail,
            name: `${emp.full_name} (${empEmail})`,
            isPrimary: false,
          });
        }
      }

      // 2. Add all aliases in the org
      if (aliases && aliases.length > 0) {
        for (const al of aliases) {
          if (
            al.address &&
            !senderIdentities.some((s) => s.email.toLowerCase() === al.address.toLowerCase())
          ) {
            senderIdentities.push({
              email: al.address,
              name: `${displayName} · Alias (${al.address})`,
              isPrimary: false,
            });
          }
        }
      }

      // 3. Add standard department channels for all verified domains
      for (const vd of verifiedDomains) {
        for (const prefix of ["support", "sales", "contact", "info"]) {
          const genericAddr = `${prefix}@${vd.domain_name}`;
          if (!senderIdentities.some((s) => s.email.toLowerCase() === genericAddr.toLowerCase())) {
            senderIdentities.push({
              email: genericAddr,
              name: `${org?.name || "Company"} ${prefix.charAt(0).toUpperCase() + prefix.slice(1)} <${genericAddr}>`,
              isPrimary: false,
            });
          }
        }
      }
    } else {
      // Member / Employee: Add only aliases assigned to THIS employee or shared org-wide
      if (aliases && aliases.length > 0) {
        const myAliases = aliases.filter(
          (a) =>
            (currentEmp && a.employee_id === currentEmp.id) ||
            !a.employee_id // Shared / org-wide aliases
        );

        for (const al of myAliases) {
          if (
            al.address &&
            !senderIdentities.some((s) => s.email.toLowerCase() === al.address.toLowerCase())
          ) {
            senderIdentities.push({
              email: al.address,
              name: `${displayName} (${al.address.split("@")[0]})`,
              isPrimary: false,
            });
          }
        }
      }
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

    // Comprehensive replacement of dynamic signature merge tags
    const fullName = currentEmp?.full_name || org?.name || "Team Member";
    const jobTitle = currentEmp?.job_title || "Team Member";
    const department = currentEmp?.department || "";
    const company = org?.name || "Mailcoy";
    const email = senderIdentities[0]?.email || currentEmp?.professional_email || currentEmp?.company_email || "";
    const phone = currentEmp?.phone_number || "";
    const website = verifiedDomains[0]?.domain_name ? `https://${verifiedDomains[0].domain_name}` : "";

    const renderedSignature = baseSignatureHtml
      .replace(/\|\s*<span>📞\s*\{\{?phone(?:_number)?\}\}?\s*<\/span>/gi, phone ? `| <span>📞 ${phone}</span>` : "")
      .replace(/<span>📞\s*\{\{?phone(?:_number)?\}\}?\s*<\/span>\s*\|?/gi, phone ? `<span>📞 ${phone}</span>` : "")
      .replace(/Olatunbosun Group/gi, company)
      .replace(/\{\{?\s*(?:full_)?name\s*\}\}?/gi, fullName)
      .replace(/\{\{?\s*(?:job_)?title\s*\}\}?/gi, jobTitle)
      .replace(/\{\{?\s*department\s*\}\}?/gi, department)
      .replace(/\{\{?\s*(?:company(?:_name)?|organization|org_name)\s*\}\}?/gi, company)
      .replace(/\{\{?\s*(?:professional_email|company_email|email)\s*\}\}?/gi, email)
      .replace(/\{\{?\s*phone(?:_number)?\s*\}\}?/gi, phone)
      .replace(/\{\{?\s*website\s*\}\}?/gi, website);

    // 6. Fetch email templates
    const { data: templates } = await supabaseAdmin
      .from("email_templates")
      .select("id, name, subject, html_body")
      .eq("organization_id", ctx.organizationId)
      .order("updated_at", { ascending: false });

    const defaultTemplates = [
      {
        id: "tpl_intro",
        name: "Introduction & Greeting",
        subject: `Introduction from ${org?.name || "our team"}`,
        html_body: "Hi there,\n\nI hope this email finds you well.\n\nI'm reaching out to introduce myself and connect regarding our business solutions. Let me know if you have a few minutes this week for a brief chat.\n\nBest regards,",
      },
      {
        id: "tpl_meeting",
        name: "Meeting Confirmation",
        subject: "Meeting Confirmation & Discussion Points",
        html_body: "Hi,\n\nThank you for scheduling time to speak. I am looking forward to our discussion.\n\nPlease let me know if there are any specific topics you would like to prioritize during our call.\n\nBest regards,",
      },
      {
        id: "tpl_followup",
        name: "Client Follow-up",
        subject: "Following up on our conversation",
        html_body: "Hi,\n\nJust wanted to follow up on our previous conversation to see if you had any questions or if there is any additional information I can provide.\n\nLooking forward to hearing from you,\n\nBest regards,",
      },
      {
        id: "tpl_status",
        name: "Quick Status Update",
        subject: "Project & Deliverable Status Update",
        html_body: "Hi Team,\n\nHere is a quick update on current progress:\n\n• Milestone 1: Completed\n• Milestone 2: In review\n• Next steps: Scheduled for this week\n\nFeel free to reply if you need any clarification.\n\nBest regards,",
      },
    ];

    // Clean plain text version of signature for compose draft
    const senderName = currentEmp?.full_name || org?.name || "Team Member";
    const senderTitle = currentEmp?.job_title ? `${currentEmp.job_title} · ${org?.name || "Mailcoy"}` : org?.name || "";
    const senderEmail = senderIdentities[0]?.email || "";
    const signaturePlainText = `--\n${senderName}${senderTitle ? `\n${senderTitle}` : ""}${senderEmail ? `\n${senderEmail}` : ""}`;

    const finalTemplates = [
      ...(templates || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        subject: t.subject || "",
        html_body: t.html_body || "",
      })),
      ...defaultTemplates,
    ];

    let monthlyEmailCount = 0;
    if (ctx.subscription.maxMonthlyMessages !== Infinity) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: mCount } = await supabaseAdmin
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", ctx.organizationId)
        .gte("timestamp", startOfMonth.toISOString());

      monthlyEmailCount = mCount || 0;
    }

    return {
      status: "ready" as const,
      hasOrg: true,
      hasVerifiedDomain: true,
      hasGmailConnection: true,
      senderIdentities,
      signatureHtml: renderedSignature,
      signaturePlainText,
      templates: finalTemplates,
      orgName: org?.name || "Workspace",
      orgLogo: org?.logo_url || null,
      availableDomains: verifiedDomains.map((d) => d.domain_name),
      role: ctx.role,
      isAdmin: ctx.role === "owner" || ctx.role === "admin",
      subscription: {
        plan: ctx.subscription.plan,
        planCode: ctx.subscription.planCode,
        canUseAliases: ctx.subscription.canUseAliases,
        canUseCatchAll: ctx.subscription.canUseCatchAll,
        maxMonthlyMessages: ctx.subscription.maxMonthlyMessages,
        maxDailyMessages: ctx.subscription.maxDailyMessages,
        maxRecipientsPerMessage: ctx.subscription.maxRecipientsPerMessage,
        maxAttachmentBytes: ctx.subscription.maxAttachmentBytes,
        monthlyEmailCount,
      },
      currentEmployee: currentEmp
        ? {
            id: currentEmp.id,
            name: currentEmp.full_name,
            email: currentEmp.professional_email || currentEmp.company_email,
            title: currentEmp.job_title,
            department: currentEmp.department,
          }
        : null,
    };
  });

export const sendBusinessEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => SendBusinessEmailSchema.parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      throw new Error("Email service is not configured (RESEND_API_KEY missing).");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 0. Recipient Blast Protection (Anti-Spam Safeguard)
    const totalRecipients = data.to.length + (data.cc?.length || 0) + (data.bcc?.length || 0);
    if (totalRecipients > (ctx.subscription.maxRecipientsPerMessage || 10)) {
      throw new Error(
        `Your ${ctx.subscription.plan} plan allows up to ${ctx.subscription.maxRecipientsPerMessage} recipients per email (found ${totalRecipients}). Upgrade to Growth in Settings → Billing to send to larger recipient lists.`,
      );
    }

    // 0.1 Attachment Size Enforcement (Storage & Bandwidth Safeguard)
    if (data.attachments && data.attachments.length > 0) {
      let totalAttachmentBytes = 0;
      for (const att of data.attachments) {
        const rawBase64 = att.content.replace(/^data:[^;]+;base64,/, "");
        totalAttachmentBytes += Math.ceil((rawBase64.length * 3) / 4);
      }

      if (totalAttachmentBytes > (ctx.subscription.maxAttachmentBytes || 10 * 1024 * 1024)) {
        const maxMb = Math.round((ctx.subscription.maxAttachmentBytes || 10 * 1024 * 1024) / (1024 * 1024));
        const currentMb = (totalAttachmentBytes / (1024 * 1024)).toFixed(1);
        throw new Error(
          `Total attachment size (${currentMb}MB) exceeds the ${maxMb}MB limit for your ${ctx.subscription.plan} plan. Upgrade to Growth in Settings → Billing for 25MB attachment allowances.`,
        );
      }
    }

    // 0.2 Daily Velocity / Anti-Spam Blast Check
    if (ctx.subscription.maxDailyMessages !== Infinity) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count: dailyCount } = await supabaseAdmin
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", ctx.organizationId)
        .eq("direction", "outgoing")
        .gte("timestamp", startOfDay.toISOString());

      if ((dailyCount ?? 0) >= ctx.subscription.maxDailyMessages) {
        throw new Error(
          `Daily sending limit reached (${dailyCount}/${ctx.subscription.maxDailyMessages} outbound emails today) on your ${ctx.subscription.plan} plan. This safeguard protects domain sender reputation. Upgrade to Growth in Settings → Billing to increase daily volume.`,
        );
      }
    }

    // 0.3 Monthly Quota Enforcement
    if (ctx.subscription.maxMonthlyMessages !== Infinity) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyCount } = await supabaseAdmin
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", ctx.organizationId)
        .gte("timestamp", startOfMonth.toISOString());

      if ((monthlyCount ?? 0) >= ctx.subscription.maxMonthlyMessages) {
        const nextPlan = ctx.subscription.planCode === "free" ? "Starter Pro" : "Growth";
        throw new Error(
          `Monthly email limit reached (${(monthlyCount ?? 0).toLocaleString()}/${ctx.subscription.maxMonthlyMessages.toLocaleString()} emails) on your ${ctx.subscription.plan} plan. Please upgrade to ${nextPlan} in Settings → Billing to increase your monthly volume.`,
        );
      }
    }

    // 1. Validate sender domain authorization
    const senderDomain = data.from.split("@")[1]?.toLowerCase();
    const { data: domainMatch } = await supabaseAdmin
      .from("domains")
      .select("id, verification_status")
      .eq("organization_id", ctx.organizationId)
      .eq("domain_name", senderDomain)
      .maybeSingle();

    if (!domainMatch && senderDomain !== "mailcoy.com") {
      throw new Error(`Sender domain ${senderDomain} is not registered or verified for this workspace.`);
    }

    // 2. Multi-Employee Isolation: Strictly verify that non-admin member is authorized to send as data.from
    if (ctx.role === "member") {
      const userEmailLower = context.userEmail?.toLowerCase() || "";
      const { data: myEmps } = await supabaseAdmin
        .from("employees")
        .select("id, professional_email, company_email, personal_email, user_id, status")
        .eq("organization_id", ctx.organizationId)
        .or(`user_id.eq.${context.userId},personal_email.ilike.${userEmailLower},company_email.ilike.${userEmailLower},professional_email.ilike.${userEmailLower}`);

      const myEmp = myEmps?.[0];
      if (!myEmp || myEmp.status !== "active") {
        throw new Error("Access Denied: Your account is not connected to an active employee profile in the owner dashboard.");
      }
      const allowedEmails = new Set<string>();
      if (myEmp?.professional_email) allowedEmails.add(myEmp.professional_email.toLowerCase());
      if (myEmp?.company_email) allowedEmails.add(myEmp.company_email.toLowerCase());
      if (myEmp?.personal_email) allowedEmails.add(myEmp.personal_email.toLowerCase());

      if (myEmp?.id) {
        const { data: myAliases } = await supabaseAdmin
          .from("aliases")
          .select("address")
          .eq("organization_id", ctx.organizationId)
          .or(`employee_id.eq.${myEmp.id},employee_id.is.null`);

        (myAliases || []).forEach((a) => {
          if (a.address) allowedEmails.add(a.address.toLowerCase());
        });
      }

      if (!allowedEmails.has(data.from.toLowerCase())) {
        throw new Error(`Access Denied: You are not authorized to send emails as ${data.from}.`);
      }
    }

    // 3. Fetch employee or user connected Gmail for smart reply bridging
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

    // 5. Outbound dispatch via ResendClient with retries and Idempotency-Key
    const { sendResendEmail } = await import("@/server/resendClient.server");
    const outboundIdempotencyKey = `compose_${relayToken || `${data.from}_${data.to[0]}_${Date.now()}`}`;

    const sendResult = await sendResendEmail({
      from: fromHeader,
      to: data.to,
      cc: data.cc && data.cc.length > 0 ? data.cc : undefined,
      bcc: data.bcc && data.bcc.length > 0 ? data.bcc : undefined,
      subject: data.subject,
      html: data.html,
      text: data.text || undefined,
      attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
      headers: {
        "X-Mailcoy-Outbound": "1",
        ...(relayToken ? { "X-Mailcoy-Relay-Token": relayToken } : {}),
      },
      idempotencyKey: outboundIdempotencyKey,
      apiKey: resendApiKey,
    });

    if (!sendResult.ok) {
      console.error("[Mailcoy Send] Resend dispatch error:", sendResult.error);
      throw new Error(`Failed to send email: ${sendResult.error}`);
    }

    const resJson = sendResult.data || { id: sendResult.id };

    // 6. Sent Sync: Dispatch a synced copy to the employee's personal Gmail so they see what was sent in their Gmail thread!
    if (employeePersonalEmail && !data.to.map((t) => t.toLowerCase()).includes(employeePersonalEmail.toLowerCase())) {
      try {
        await sendResendEmail({
          from: `${senderDisplayName} via Mailcoy <router@${senderDomain || "mailcoy.com"}>`,
          to: employeePersonalEmail,
          reply_to: relayToken ? `reply+${relayToken}@mailcoy.com` : undefined,
          subject: `[Sent] ${data.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
              <div style="padding: 10px 14px; background-color: #f1f5f9; border-radius: 6px; border-left: 3px solid #0284c7; margin-bottom: 16px; font-size: 12px; color: #475569;">
                📤 <strong>Sent as ${data.from}</strong> to <strong>${data.to.join(", ")}</strong>${data.cc && data.cc.length > 0 ? ` (CC: ${data.cc.join(", ")})` : ""}
              </div>
              ${data.html}
            </div>
          `,
          attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
          idempotencyKey: `sync_${outboundIdempotencyKey}`,
          apiKey: resendApiKey,
        });
      } catch (syncErr) {
        console.warn("[Mailcoy Send] Sent sync copy delivery error:", syncErr);
      }
    }

    // 7. Record outbound message in email_logs
    try {
      await supabaseAdmin.from("email_logs").insert({
        organization_id: ctx.organizationId,
        sender: data.from,
        receiver: data.to.join(", "),
        subject: data.subject,
        snippet: data.text || data.html.replace(/<[^>]*>/g, "").trim().slice(0, 4000) || data.subject,
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

const PolishEmailSchema = z.object({
  body: z.string().min(1).max(5000),
  tone: z.enum(["professional", "friendly", "concise", "sales", "fix_grammar"]).default("professional"),
});

export const polishEmailBody = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => PolishEmailSchema.parse(data))
  .handler(async ({ data }) => {
    const groqApiKey = process.env.GROQ_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    const toneInstructions: Record<string, string> = {
      professional: "Polished, clear, executive, polite, and confident.",
      friendly: "Warm, approachable, engaging, and appreciative.",
      concise: "Short, direct, bulleted if helpful, saving the reader time.",
      sales: "Persuasive, value-focused, engaging with a clear call to action.",
      fix_grammar: "Fix all typos, punctuation, capitalization, and grammatical issues without changing voice.",
    };

    const instruction = toneInstructions[data.tone] || toneInstructions.professional;
    const prompt = `You are an elite business communication assistant for Mailcoy. 
Please rewrite and polish the following draft email body.
Tone requirement: ${instruction}

Draft:
"""
${data.body}
"""

Important Rules:
1. Output ONLY the rewritten email body text.
2. Do not add conversational intro or outro text (e.g. "Here is your email:").
3. Do not add subject lines or signatures unless requested.`;

    if (groqApiKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (groqRes.ok) {
          const gJson = await groqRes.json();
          const polished = gJson?.choices?.[0]?.message?.content?.trim();
          if (polished) return { polishedBody: polished };
        }
      } catch (err) {
        console.warn("[Mailcoy AI] Groq polish error:", err);
      }
    }

    if (geminiApiKey) {
      try {
        const gemRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
            }),
          }
        );

        if (gemRes.ok) {
          const gemJson = await gemRes.json();
          const polished = gemJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (polished) return { polishedBody: polished };
        }
      } catch (err) {
        console.warn("[Mailcoy AI] Gemini polish error:", err);
      }
    }

    // Fallback if no AI keys configured: Clean up capitalization and trim
    return {
      polishedBody: data.body
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n\n"),
    };
  });

export const checkAdminComposeAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      redirectOrigin: z.string().url(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const userEmailLower = context.userEmail?.toLowerCase() || "";

    // 1. Check if user has an existing active connection in app_user_connections
    const { data: directConn } = await supabaseAdmin
      .from("app_user_connections")
      .select("id")
      .eq("user_id", context.userId)
      .eq("connector_id", "google_mail")
      .maybeSingle();

    if (directConn) {
      return { hasGmail: true, authorizationUrl: null };
    }

    // 2. Check if an employee record matching this user or email has a gmail_connection
    const { data: emps } = await supabaseAdmin
      .from("employees")
      .select("id, gmail_connections(id, google_email)")
      .eq("organization_id", ctx.organizationId)
      .or(`user_id.eq.${context.userId},personal_email.ilike.${userEmailLower},company_email.ilike.${userEmailLower}`);

    const hasLinkedEmp = emps?.some((e) => (e.gmail_connections as any)?.length > 0);
    if (hasLinkedEmp) {
      return { hasGmail: true, authorizationUrl: null };
    }

    // 3. User does not have a linked Gmail yet. Build Google OAuth authorization URL.
    const nonce = crypto.randomUUID();
    const jsonStr = JSON.stringify({
      type: "login",
      orgId: ctx.organizationId,
      userId: context.userId,
      userEmail: context.userEmail,
      targetUrl: "/compose",
      nonce,
    });
    const state = btoa(jsonStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const origin = data.redirectOrigin.replace(/\/+$/, "");
    const redirectUri = `${origin}/api/auth/google/callback`;

    const hasGoogleKeys = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    if (!hasGoogleKeys) {
      return { hasGmail: false, authorizationUrl: "/compose" };
    }

    const { buildGoogleAuthUrl } = await import("@/server/googleOAuth.server");
    const authorizationUrl = await buildGoogleAuthUrl(redirectUri, state);
    return { hasGmail: false, authorizationUrl };
  });

export const listComposeMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).max(10000).default(0),
        direction: z.enum(["incoming", "outgoing"]).optional(),
        search: z.string().max(120).optional(),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Resolve employee profile & authorized email identities for the current caller
    const userEmailLower = context.userEmail?.toLowerCase() || "";
    const { data: emps } = await supabaseAdmin
      .from("employees")
      .select("id, professional_email, company_email, personal_email, user_id, status, gmail_connections(google_email)")
      .eq("organization_id", ctx.organizationId)
      .or(`user_id.eq.${context.userId},personal_email.ilike.${userEmailLower},company_email.ilike.${userEmailLower},professional_email.ilike.${userEmailLower}`);

    const myEmp = emps?.[0];
    if (ctx.role === "member" && (!myEmp || myEmp.status !== "active")) {
      return { rows: [], total: 0 };
    }

    const myEmails = new Set<string>();

    if (myEmp) {
      if (myEmp.professional_email) myEmails.add(myEmp.professional_email.toLowerCase());
      if (myEmp.company_email) myEmails.add(myEmp.company_email.toLowerCase());
      if (myEmp.personal_email) myEmails.add(myEmp.personal_email.toLowerCase());
      const gconns = Array.isArray(myEmp.gmail_connections)
        ? myEmp.gmail_connections
        : myEmp.gmail_connections
        ? [myEmp.gmail_connections]
        : [];
      gconns.forEach((g: any) => {
        if (g?.google_email) myEmails.add(g.google_email.toLowerCase());
      });

      // Also get aliases strictly assigned to THIS employee
      const { data: aliases } = await supabaseAdmin
        .from("aliases")
        .select("address")
        .eq("organization_id", ctx.organizationId)
        .eq("employee_id", myEmp.id);

      (aliases || []).forEach((a) => {
        if (a.address) myEmails.add(a.address.toLowerCase());
      });
    }

    // Direct app_user_connection for this user (e.g. if owner or direct Gmail connection)
    const { data: directConn } = await supabaseAdmin
      .from("app_user_connections")
      .select("config")
      .eq("user_id", context.userId)
      .eq("connector_id", "google_mail")
      .maybeSingle();

    if (directConn?.config && typeof directConn.config === "object" && (directConn.config as any).email) {
      myEmails.add(String((directConn.config as any).email).toLowerCase());
    }

    if (userEmailLower) {
      myEmails.add(userEmailLower);
    }

    const isOwnerOrAdmin = ctx.role === "owner" || ctx.role === "admin";
    const emailList = Array.from(myEmails);

    let q = supabaseAdmin
      .from("email_logs")
      .select("id, sender, receiver, subject, snippet, direction, status, timestamp", {
        count: "exact",
      })
      .eq("organization_id", ctx.organizationId);

    // 2. Strict Per-Employee Mailbox Isolation for Members:
    // A regular employee can ONLY see emails where their address is sender or receiver.
    // Workspace Owner / Admin can monitor all organization email activity.
    if (!isOwnerOrAdmin) {
      if (emailList.length === 0) {
        return { rows: [], total: 0 };
      }
      const orFilter = emailList
        .map((e) => `sender.eq."${e}",receiver.ilike."%${e}%"`)
        .join(",");
      q = q.or(orFilter);
    }

    q = q
      .order("timestamp", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);

    if (data.direction) {
      q = q.eq("direction", data.direction as never);
    }

    if (data.search) {
      q = q.ilike("subject", `%${data.search}%`);
    }

    const { data: rows, count, error } = await q;
    if (error) {
      console.error("[listComposeMessages error]", error);
      throw error;
    }

    return { rows: rows || [], total: count || 0 };
  });

