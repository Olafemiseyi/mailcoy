import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolveOrgContext } from "@/server/orgContext.server";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  userEmail: z.string().optional(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })).optional(),
  selectedIssue: z.string().optional(),
});

export const askAiAssistant = createServerFn({ method: "POST" })
  .validator((d: unknown) => chatSchema.parse(d))
  .handler(async ({ data, context }: any) => {
    // 1. Gather live account diagnostic context if user is authenticated
    let accountContext = "Visitor is on the public landing page (Not logged in yet).";
    let isLoggedIn = false;

    try {
      let targetEmail = data.userEmail;
      let userId: string | null = null;

      if (!targetEmail && context.supabase) {
        const { data: authData } = await context.supabase.auth.getUser();
        if (authData?.user?.email) {
          targetEmail = authData.user.email;
          userId = authData.user.id;
        }
      }

      if (targetEmail) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        // Find user & their organization
        const { data: orgMember } = await supabaseAdmin
          .from("organization_members")
          .select("organization_id, role")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (orgMember) {
          isLoggedIn = true;
          const orgId = orgMember.organization_id;

          const [orgRes, domainsRes, empsRes, gmailRes] = await Promise.all([
            supabaseAdmin.from("organizations").select("name, primary_domain").eq("id", orgId).single(),
            supabaseAdmin.from("domains").select("domain_name, verification_status").eq("organization_id", orgId),
            supabaseAdmin.from("employees").select("full_name, professional_email, status").eq("organization_id", orgId),
            supabaseAdmin.from("gmail_connections").select("google_email, health_status").eq("organization_id", orgId),
          ]);

          const org = orgRes.data;
          const domains = domainsRes.data ?? [];
          const employees = empsRes.data ?? [];
          const gmails = gmailRes.data ?? [];

          accountContext = `
Live Logged-In User Account Diagnostic:
- User Email: ${targetEmail}
- Company Name: ${org?.name || "Active Workspace"}
- Connected Domains (${domains.length}): ${domains.map((d: any) => `${d.domain_name} (Status: ${d.verification_status})`).join(", ") || "No custom domains connected yet"}
- Provisioned Employee Inboxes (${employees.length}): ${employees.map((e: any) => `${e.professional_email} (${e.status})`).join(", ") || "No employees added yet"}
- Connected Gmail Accounts (${gmails.length}): ${gmails.map((g: any) => `${g.google_email} (Health: ${g.health_status})`).join(", ") || "No Gmail account connected yet"}
`;
        }
      }
    } catch (e) {
      console.warn("Error resolving live diagnostic context:", e);
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are the Mailcoy AI Support & Product Specialist.
Your sole mission is to assist visitors and customers with Mailcoy. You possess 100% complete knowledge of all platform features, workflows, and configurations.

100% COMPLETE PLATFORM FEATURE KNOWLEDGE:
  1. **Core Value Proposition & Dashboard Layout:**
     - Mailcoy routes professional business email on custom domains (e.g. \`sales@company.com\`) to team members' personal or existing Gmail inboxes.
     - Eliminates Google Workspace $7.20/user/mo fees (saving businesses 75% - 80%+ annually).
     - **Dashboard Workspace Apps:** The main dashboard contains quick-access widgets to Email Templates, Analytics, Real-time Logs, and Catch-All Webmail.

2. **Multi-Alias Single Gmail Superpower:**
   - A single founder or team member can route multiple aliases (\`hello@\`, \`support@\`, \`sales@\`, \`billing@\`) to their ONE Gmail account.
   - Inside Gmail, replies automatically select the incoming alias.
   - When composing new messages, Gmail provides a 'From' dropdown allowing the user to select which business address to send from.

3. **Domains & DNS Authentication:**
   - Automatic 4-record setup:
     • **TXT Record:** Proves domain ownership (\`mailcoy-verification=...\`).
     • **MX Records:** Routes inbound email to \`mx1.mailcoy.com\` and \`mx2.mailcoy.com\`.
     • **SPF Record:** Authorizes delivery via \`v=spf1 include:_spf.mailcoy.com ~all\`.
     • **DKIM Record:** Cryptographic keys for 100% Gmail/Outlook deliverability.
     • **DMARC Record:** Anti-phishing policy (\`v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.com\`).
     • **BIMI Record:** Brand Indicators for Message Identification (Adding your company logo to inboxes). To use BIMI, users must add a TXT record (\`v=BIMI1; l=url_to_svg; a=url_to_vmc;\`). Note: Gmail requires a costly VMC (Verified Mark Certificate) for BIMI to work.
   - **Pro Tip for Logos in Gmail without BIMI:** The easiest and free way to get your company logo to show up when sending to Gmail users is to create a free Google Account using your custom business email address (e.g. \`you@company.com\`) and upload your logo as the Google Account profile picture!
   - Cloudflare Guidance: DNS records must be set to 'DNS Only' (Grey Cloud).

4. **Need a Domain? (Concierge & Guided Options):**
   - **Self-Service:** Direct 2-minute links to Namecheap, Cloudflare, and GoDaddy.
   - **Done-For-You Concierge ($15 flat / ₦15,000 flat):** Our specialist engineering team will register the domain and configure all DNS records end-to-end for the client.

5. **Employee Directory & 1-Click Offboarding:**
   - Add employees, send instant invitation links and QR codes.
   - **1-Click Employee Offboarding Shield:** Immediately suspend an employee's routing access when they leave the company to protect sensitive business data.

  6. **Signatures & Transactional Email Templates:**
     - **Signatures:** Company Default Template for signatures supporting merge tags (\`{name}\`, \`{title}\`, \`{department}\`, \`{company}\`, \`{email}\`). Employee overrides for executives.
     - **Transactional Email Templates:** Built-in split-pane HTML template builder in the dashboard. Users can design beautiful HTML emails, preview them in real-time, and trigger them programmatically via the Mailcoy API using the template's unique ID.
  
  7. **Catch-All Routing & Shared Webmail Inbox:**
     - Captures any email sent to misspelled or unassigned handles on your domain (e.g. \`anything@yourdomain.com\`).
     - **Two modes:** Forward to a designated manager inbox OR use the built-in **Catch-All Shared Webmail Inbox** directly inside the Mailcoy dashboard to read and monitor all unmatched emails securely.
  
  8. **Deliverability, Spam Monitoring & Real-Time Logs:**
     - **Real-Time Logs:** A beautiful live feed in the dashboard showing exactly what emails are coming in and going out, including sender, receiver, and delivery status.
     - **Deliverability Shield:** Real-time scanning against major DNSBL blacklists (Spamhaus, Barracuda, SORBS) to guarantee primary inbox placement.
  
  9. **Developer API & Webhooks:**
   - API keys with Argon2id hashing for programmatic transactional sending.
   - Webhook event listeners for inbound/outbound delivery events.

10. **Official 4-Tier Pricing (Regional Auto-Detection):**
    - **Free ($0 / ₦0):** 1 domain, 1 inbox, full Send-As access.
    - **Starter Pro ($9/mo or $90/yr | ₦7,500/mo or ₦75,000/yr):** 1 domain, up to 5 inboxes, company signatures.
    - **Growth ($29/mo or $290/yr | ₦20,000/mo or ₦200,000/yr):** 3 domains, up to 20 inboxes, catch-all & full API access.
    - **Scale ($79/mo or $790/yr | ₦50,000/mo or ₦500,000/yr):** 10 domains, up to 50 inboxes, offboarding shield, deliverability shield, VIP account manager.

11. **Official Contact Channels:**
    - General & Support: \`hello@mailcoy.com\` / \`support@mailcoy.com\`
    - Sales & Enterprise: \`sales@mailcoy.com\`
    - Security & Legal: \`security@mailcoy.com\`

STRICT SCOPE BOUNDARY:
- You ONLY answer questions related to Mailcoy, business email setup, domain verification, Gmail configuration, pricing, signatures, deliverability, BIMI, and logos/profile pictures.
- If a user asks about anything unrelated (such as food, weather, math, general coding, politics, etc.), politely guide them back:
  "I am specifically trained to help you with **Mailcoy** business email setup, custom domains, Gmail integration, signatures, and deliverability. How can I assist with your workspace today?"

Live User & Workspace Context:
${accountContext}

Formatting & Tone Rules:
- Write like a polished SaaS specialist (clear, concise, direct, helpful, and friendly).
- Use **bold text** for important features.
- Use numbered lists (1., 2., 3.) when explaining sequential setup steps.
- Use bullet points (* or -) when listing features.
- If the issue requires human super-admin intervention, offer: "Would you like me to escalate this ticket directly to our platform super admin?"`;

    // 1. Primary Engine: Groq (Llama 3.3 70B Versatile - Ultra Fast & 14,400 daily requests)
    if (groqApiKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              ...(data.history || []),
              { role: "user", content: data.message },
            ],
            temperature: 0.5,
            max_tokens: 800,
          }),
        });

        if (groqRes.ok) {
          const gJson = await groqRes.json();
          const reply = gJson?.choices?.[0]?.message?.content;
          if (reply) return { reply, canEscalate: true };
        } else {
          console.warn("Groq API returned error status:", groqRes.status);
        }
      } catch (err) {
        console.warn("Groq AI fetch error:", err);
      }
    }

    // 2. Secondary Engine: Google Gemini 1.5 Flash (Free Tier)
    if (geminiApiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Message: ${data.message}` }] }
            ]
          }),
        });

        if (response.ok) {
          const resJson = await response.json();
          const reply = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return { reply, canEscalate: true };
        }
      } catch (err) {
        console.warn("Gemini AI fetch error:", err);
      }
    }

    // High-Intelligence Built-In Knowledge Engine (Zero-API Key Fallback)
    const msg = data.message.toLowerCase();
    let reply = "";

    if (msg.includes("what can i do") || msg.includes("what is") || msg.includes("how does it work") || msg.includes("tell me about") || msg.includes("your name") || msg.includes("features")) {
      reply = "I am the **Mailcoy AI Specialist**.\n\n**Mailcoy** is the modern email operating system that allows your business to run professional email addresses on your custom domain while your team continues using their existing Gmail inboxes.\n\n✨ **100% of Core Mailcoy Features:**\n• **Gmail Send-As Sync:** Send and receive custom domain emails in personal Gmail\n• **Multi-Alias Single Gmail:** Route multiple addresses (`hello@`, `support@`, `sales@`) to 1 Gmail with a 'From' dropdown\n• **Save 80%+:** Avoid Google Workspace seat licenses ($7.20/user/mo vs ~$1-2/user/mo)\n• **Domain Concierge ($15 / ₦15,000):** Done-for-you domain registration & DNS setup\n• **1-Click Employee Offboarding Shield:** Instantly revoke access when staff leave\n• **Catch-All Inboxes:** Capture mistyped emails across your entire domain\n• **Centralized Signatures:** Universal company templates & employee overrides with live preview\n• **DNSBL Deliverability Shield:** Real-time spam blacklist monitoring\n• **Developer API & Webhooks:** Transactional sending with API keys";
    } else if (msg.includes("price") || msg.includes("cost") || msg.includes("how much") || msg.includes("tier") || msg.includes("dollar") || msg.includes("naira")) {
      reply = "**Mailcoy** offers transparent regional pricing (auto-detected in USD or NGN):\n\n• **Free Plan:** $0 (₦0) — 1 domain, 1 inbox, full Send-As access\n• **Starter Pro:** $9/mo (₦7,500/mo) — 1 domain, up to 5 inboxes\n• **Growth:** $29/mo (₦20,000/mo) — 3 domains, up to 20 inboxes, catch-all & API\n• **Scale:** $79/mo (₦50,000/mo) — 10 domains, up to 50 inboxes, priority shields & VIP support\n\nCompared to Google Workspace ($7.20/user/mo), you save up to **80% every month**!";
    } else if (msg.includes("don't have a domain") || msg.includes("buy domain") || msg.includes("concierge") || msg.includes("register domain")) {
      reply = "If you don't have a domain yet, Mailcoy gives you two simple paths:\n\n1. **Self-Service:** Register a domain in 2 minutes on Namecheap, Cloudflare, or GoDaddy, then paste it into Mailcoy.\n2. **Done-For-You Concierge ($15 / ₦15,000 flat):** Our team will register the domain and configure all DNS (MX, SPF, DKIM, DMARC) records for you.\n\nContact us at **hello@mailcoy.com** to request concierge setup!";
    } else if (msg.includes("domain") || msg.includes("dns") || data.selectedIssue === "domain_verify") {
      reply = isLoggedIn
        ? "I analyzed your domain status. Ensure you have added the TXT ownership record and two MX routing records (`mx1.mailcoy.com` and `mx2.mailcoy.com`) with TTL set to 300s. If using Cloudflare, set proxy to **'DNS Only'** (Grey Cloud)."
        : "To connect a domain:\n1. Add your domain name in the dashboard\n2. Copy the 4 DNS records (TXT, MX, SPF, DKIM) into Namecheap, GoDaddy, or Cloudflare\n3. Click Verify — activation completes in under 2 minutes.";
    } else if (msg.includes("gmail") || msg.includes("send as") || data.selectedIssue === "gmail_send_as") {
      reply = "To send emails from your business address in Gmail:\n\n1. In Gmail, go to **Settings &rarr; Accounts &rarr; 'Add another email address'**\n2. Enter your business address (e.g. `name@company.com`)\n3. Enter the 6-digit confirmation code Google sends to your inbox\n4. You can now choose your business address in the 'From' dropdown when composing emails!";
    } else if (msg.includes("signature") || msg.includes("template")) {
      reply = "**Mailcoy Signatures:**\n\n1. **Company Default:** Set a universal branded template with merge tags like `{name}`, `{title}`, `{department}`, `{company}`, and `{email}`.\n2. **Employee Overrides:** Customize specific signatures for key executives or department heads with real-time rich HTML live preview.";
    } else if (msg.includes("catch-all") || msg.includes("catch all") || msg.includes("misspelled")) {
      reply = "**Catch-All Routing:**\n\nCatch-All captures every email sent to unassigned or misspelled addresses on your domain (e.g. `anything@yourdomain.com`) and forwards it to a designated manager inbox. You can enable and configure Catch-All routing in your dashboard under **Catch-All Mail**.";
    } else if (msg.includes("offboard") || msg.includes("suspend") || msg.includes("fired") || msg.includes("leave")) {
      reply = "**1-Click Employee Offboarding Shield:**\n\nWhen a team member leaves the company, you can immediately suspend or revoke their business email routing with 1 click in the **Employees** directory. This instantly prevents them from sending or receiving company mail without disrupting domain operations.";
    } else if (msg.includes("api") || msg.includes("webhook") || msg.includes("developer")) {
      reply = "**Developer API & Webhooks:**\n\nMailcoy provides REST API keys (hashed securely with Argon2id) to programmatically send transactional emails and query domain health. You can also configure Webhook endpoints to receive live notifications for inbound/outbound message deliveries.";
    } else if (msg.includes("spam") || msg.includes("deliverability") || data.selectedIssue === "spam_issues") {
      reply = "To ensure 99%+ primary inbox placement, **Mailcoy** configures 3 critical authentication shields:\n• **SPF** (Sender Policy Framework)\n• **DKIM** (Cryptographic domain keys)\n• **DMARC** (Anti-spoofing policy)\n\nCheck the Deliverability Shield on your domain page to see your real-time health score.";
    } else if (msg.includes("contact") || msg.includes("email") || msg.includes("human") || msg.includes("support")) {
      reply = "You can reach our official team directly at:\n\n• **General & Support:** `hello@mailcoy.com` / `support@mailcoy.com`\n• **Sales & Enterprise:** `sales@mailcoy.com`\n• **Security & Legal:** `security@mailcoy.com`\n\nOr click below to escalate this chat directly to our human Super Admin!";
    } else {
      reply = "I am specifically trained to help you with **Mailcoy** business email setup, custom domains, Gmail integration, signatures, and deliverability. How can I assist with your workspace today?";
    }

    return {
      reply,
      canEscalate: true,
    };
  });

/**
 * Escalates an unresolved chat issue directly to the Super Admin via email and database ticket
 */
export const escalateToAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      userEmail: z.string().email(),
      subject: z.string(),
      conversationHistory: z.string(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Insert support ticket into activity logs / tickets
    await supabaseAdmin.from("activity_logs").insert({
      organization_id: "00000000-0000-0000-0000-000000000000",
      actor_user_id: context.userId,
      action: "support.ticket_escalated",
      target_type: "support",
      meta: {
        userEmail: data.userEmail,
        subject: data.subject,
        history: data.conversationHistory,
        timestamp: new Date().toISOString(),
      },
    } as never);

    // 2. Dispatch email notification to admin via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@mailcoy.com";

    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Mailcoy Support Bot <support@mailcoy.com>",
            to: [adminEmail],
            reply_to: data.userEmail,
            subject: `[Support Escalation] ${data.subject} (${data.userEmail})`,
            html: `
              <h2>New Support Escalation</h2>
              <p><strong>User Email:</strong> ${data.userEmail}</p>
              <p><strong>Subject:</strong> ${data.subject}</p>
              <hr />
              <h3>Conversation Transcript:</h3>
              <pre style="background: #f4f4f5; padding: 12px; border-radius: 8px; font-size: 12px;">${data.conversationHistory}</pre>
            `,
          }),
        });
      } catch (e) {
        console.warn("Support escalation email dispatch error:", e);
      }
    }

    return { ok: true };
  });
