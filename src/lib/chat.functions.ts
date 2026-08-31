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
      let targetEmail: string | null = null;
      let userId: string | null = null;

      if (context.supabase) {
        const { data: authData } = await context.supabase.auth.getUser();
        if (authData?.user) {
          targetEmail = authData.user.email ?? null;
          userId = authData.user.id;
        }
      }

      if (userId && targetEmail) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        // Find user & their organization strictly for this authenticated userId
        const { data: orgMember } = await supabaseAdmin
          .from("organization_members")
          .select("organization_id, role")
          .eq("user_id", userId)
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
Your sole mission is to assist visitors and customers with Mailcoy. You possess 100% complete knowledge of all platform features, workflows, architecture, and configurations.

100% COMPLETE PLATFORM FEATURE & ARCHITECTURAL KNOWLEDGE:
  1. **Core Value Proposition & Architecture:**
     - Mailcoy is an intelligent identity and custom domain routing operating system for modern teams.
     - **The Decoupling Superpower:** Mailcoy deliberately decouples domain identity and routing from bloated mailbox storage. By routing incoming messages to staff's existing Gmail inboxes, companies keep 15GB+ free Google Cloud storage and standard Gmail apps without paying $7/user/month per-seat fees.
     - Eliminates Google Workspace $7.20/user/mo fees (saving businesses 75% - 80%+ annually).
     - **Dashboard Workspace Apps:** The main dashboard contains quick-access widgets to Email Templates, Analytics, Real-time Logs, and Catch-All Webmail.

  2. **Security, Privacy & Zero Credential Storage:**
     - **Zero Password Storage:** Mailcoy never asks for or stores Google passwords.
     - **CASA Compliance & Google OAuth:** All authentication uses Google OAuth 2.0 with restricted scopes.
     - **AES-256-GCM Encryption:** All access tokens are cryptographically encrypted at rest with AES-256-GCM.
     - **Google API Limited Use Adherence:** Strict compliance with Google User Data Policies. Zero AI training on customer emails.

  3. **Multi-Alias Single Gmail Superpower:**
     - A single founder or team member can route multiple aliases (\`hello@\`, \`support@\`, \`sales@\`, \`billing@\`, \`ceo@\`) to their ONE Gmail account.
     - Inside Gmail, replies automatically select the incoming alias.
     - When composing new messages, Gmail provides a 'From' dropdown allowing the user to select which business address to send from.

  4. **Domains & DNS Authentication:**
     - Automatic 4-record setup:
       • **TXT Record:** Proves domain ownership (\`mailcoy-verification=...\`).
       • **MX Records:** Routes inbound email to \`mx1.mailcoy.com\` (Priority 10) and \`mx2.mailcoy.com\` (Priority 20).
       • **SPF Record:** Authorizes delivery via \`v=spf1 include:_spf.mailcoy.com ~all\`.
       • **DKIM Record:** Cryptographic keys (1024/2048-bit) for 100% Gmail/Outlook deliverability.
       • **DMARC Record:** Anti-phishing policy (\`v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.com\`).
       • **BIMI & Brand Logos:**
          - **Method 1 ($0 Free & Instant for Gmail):** Upload the company logo as the Google Account Profile Picture at \`myaccount.google.com\` for the connected Gmail account. Gmail automatically attaches this logo avatar next to every email sent via Mailcoy!
          - **Method 2 ($0 Free for Apple Mail, Outlook & CRMs):** Register the business email (\`you@yourdomain.com\`) on \`gravatar.com\` and upload the company logo.
          - **Method 3 (Official BIMI DNS):** Add a TXT record at \`default._bimi.domain.com\` (\`v=BIMI1; l=url_to_svg;\`). Free on Yahoo/Fastmail; Google/Apple require a paid $1,500/yr VMC certificate. Always recommend Method 1 & 2 for fast, free setup!

  5. **High Availability & MX Fallback Queues:**
     - Mailcoy operates redundant multi-region Anycast fallback MX proxies (\`mx1\` and \`mx2\`).
     - If Google or an upstream destination experiences transient latency or downtime, Mailcoy buffers the message in secondary queues with exponential retry intervals until delivery completes. Zero email loss.

  6. **Shared Department Aliases & Smart Routing:**
     - **Broadcast Routing:** Fans out incoming inquiries to multiple team members simultaneously (e.g. \`sales@\` sends to 5 sales reps).
     - **Round-Robin Routing:** Sequentially rotates incoming inquiries among team members for balanced workload.

  7. **Employee Directory, Onboarding & 1-Click Offboarding Shield:**
     - **Onboarding:** Instant QR code scan or magic onboarding email links for 3-minute Gmail integration.
     - **1-Click Offboarding Shield:** When an employee leaves, instantly revoke routing from the dashboard. Customer emails automatically redirect to a designated manager, protecting company data and leads.

  8. **Signatures & Transactional Email Templates:**
     - **Signatures:** Company Default Template for signatures supporting dynamic merge tags (\`{name}\`, \`{title}\`, \`{department}\`, \`{company}\`, \`{email}\`). Employee overrides for executives.
     - **Transactional Email Templates:** Split-pane HTML template builder in the dashboard. Design responsive HTML emails, preview them live, and trigger them programmatically via the Mailcoy REST API using unique template IDs.

  9. **Catch-All Routing & Shared Webmail Inbox:**
     - Captures any email sent to misspelled or unassigned handles on your domain (e.g. \`anything@yourdomain.com\`).
     - **Two modes:** Forward to a designated manager inbox OR view inside the built-in **Catch-All Shared Webmail Inbox** in the dashboard.

  10. **Deliverability, Spam Monitoring & Real-Time Logs:**
      - **Real-Time Logs:** Live telemetry feed in the dashboard showing sender, receiver, direction, and delivery latency (sub-200ms).
      - **Deliverability Shield:** Continuous monitoring against major DNSBL blacklists (Spamhaus, Barracuda, SORBS).

  11. **Developer API & Webhooks:**
      - API keys with Argon2id hashing for programmatic transactional sending.
      - Webhook event listeners for inbound/outbound delivery events.

  12. **Official 4-Tier Flat Team Pricing (Auto-Detected by Region):**
      - **Free ($0 / ₦0):** 1 domain, 1 inbox, full Send-As access.
      - **Starter Pro ($9/mo or $90/yr | ₦7,500/mo or ₦75,000/yr):** 1 domain, up to 5 inboxes, company signatures.
      - **Growth ($29/mo or $290/yr | ₦20,000/mo or ₦200,000/yr):** 3 domains, up to 20 inboxes, catch-all & full API access.
      - **Scale ($79/mo or $790/yr | ₦50,000/mo or ₦500,000/yr):** 10 domains, up to 50 inboxes, offboarding shield, deliverability shield, VIP account manager.

  13. **Official Contact Channels:**
      - General & Support: \`hello@mailcoy.com\` / \`support@mailcoy.com\`
      - Sales & Enterprise: \`sales@mailcoy.com\`
      - Security & Legal: \`security@mailcoy.com\` / \`privacy@mailcoy.com\`

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

    // 1. Buying / Registering a New Domain
    if (
      msg.includes("buy a domain") ||
      msg.includes("buy domain") ||
      msg.includes("purchase domain") ||
      msg.includes("register domain") ||
      msg.includes("get a domain") ||
      msg.includes("don't have a domain") ||
      msg.includes("need a domain") ||
      msg.includes("where to buy")
    ) {
      reply = `To get a new custom domain for your business email, you have two great options:

1. **Self-Service Registration (Recommended):**
   • Buy your domain directly on **Namecheap**, **Cloudflare Registrar**, or **Porkbun** (usually ~$9–$12/year for a \`.com\`).
   • Once purchased, simply go to **Domains** in Mailcoy, type your domain name, and we'll generate the 4 DNS records to paste into your registrar.

2. **Done-For-You Domain Concierge ($15 / ₦15,000 flat):**
   • Don't want to deal with registrars or DNS settings? Our engineering team will register your chosen domain and configure all DNS records (MX, SPF, DKIM, DMARC) end-to-end for you.
   • Contact us at **hello@mailcoy.com** to request Concierge domain setup!`;

    // 2. Linking / Connecting an Existing Domain
    } else if (
      msg.includes("link domain") ||
      msg.includes("link my domain") ||
      msg.includes("connect domain") ||
      msg.includes("connect my domain") ||
      msg.includes("add domain") ||
      msg.includes("verify domain") ||
      msg.includes("dns setup") ||
      msg.includes("dns records") ||
      data.selectedIssue === "domain_verify"
    ) {
      reply = isLoggedIn
        ? `To link your domain to Mailcoy:

1. Go to **Domains** in your dashboard and click **'+ Add domain'**.
2. Enter your domain name (e.g. \`yourcompany.com\`).
3. Open your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) & navigate to **DNS Management / Advanced DNS**.
4. Add the 4 Mailcoy authentication records:
   • **TXT Record:** Host \`@\`, Value = \`mailcoy-verification=...\`
   • **MX Records:** Host \`@\`, Value = \`mx1.mailcoy.com\` & \`mx2.mailcoy.com\` (Priority 10 & 20)
   • **SPF Record:** Host \`@\`, Value = \`v=spf1 include:_spf.mailcoy.com ~all\`
   • **DKIM Record:** CNAME / TXT key provided in your dashboard
5. Click **'Verify'** on the domain page — verification takes less than 2 minutes!`
        : `To link an existing domain you already own:

1. In your Mailcoy dashboard, navigate to **Domains** and enter your domain name.
2. Mailcoy provides 4 DNS records (TXT ownership, 2 MX routing records, SPF, and DKIM).
3. Log into your registrar (Namecheap, Cloudflare, GoDaddy, Hostinger, etc.) and add these records to your DNS settings.
4. Click **'Verify'** in Mailcoy to activate instant business email routing!`;

    // 3. Gmail Send-As / SMTP Setup
    } else if (
      msg.includes("gmail") ||
      msg.includes("send as") ||
      msg.includes("smtp") ||
      msg.includes("send from gmail") ||
      data.selectedIssue === "gmail_send_as"
    ) {
      reply = `To send emails from your custom business address directly inside your personal Gmail:

1. Open Gmail on desktop & click the **Gear Icon (Settings) → See all settings**.
2. Go to the **Accounts and Import** tab.
3. In the *"Send mail as"* section, click **'Add another email address'**.
4. Enter your name and your professional email address (e.g. \`you@company.com\`). Keep *"Treat as an alias"* checked.
5. In the SMTP Server settings:
   • **SMTP Server:** \`smtp.resend.com\`
   • **Port:** \`465\` (SSL) or \`587\` (TLS)
   • **Username:** \`resend\`
   • **Password:** *(Use the credentials sent to your inbox in your employee invite email)*
6. Click **Add Account**, then enter the confirmation code Google emails to you.
7. You're done! When composing emails in Gmail, you can now click the **'From'** dropdown to choose your custom business email.`;

    // 4. Multi-Alias Single Gmail
    } else if (
      msg.includes("alias") ||
      msg.includes("multiple addresses") ||
      msg.includes("multiple emails") ||
      msg.includes("shared inbox")
    ) {
      reply = `**Multi-Alias Single Gmail Superpower:**

Mailcoy allows a single person or team member to route multiple department addresses (e.g. \`sales@company.com\`, \`support@company.com\`, \`billing@company.com\`, \`hello@company.com\`) to **ONE** personal Gmail inbox!

• **Incoming:** All emails land cleanly in your single Gmail inbox.
• **Outgoing:** When replying or composing, use Gmail's 'From' dropdown to pick whichever alias you want to send from.
• **Team Fan-out:** You can also route 1 alias (like \`team@company.com\`) to multiple employees simultaneously!`;

    // 5. Signatures & Templates
    } else if (msg.includes("signature") || msg.includes("template")) {
      reply = `**Mailcoy Signatures & Templates:**

1. **Centralized Signatures:**
   • Create a universal Company Default signature with dynamic merge tags: \`{name}\`, \`{title}\`, \`{department}\`, \`{company}\`, \`{phone}\`, \`{email}\`.
   • Set department-level variants or individual executive overrides with instant rich-text live preview.

2. **Transactional Email Templates:**
   • Design and preview responsive HTML email templates directly inside your dashboard under **Templates**.
   • Trigger templates programmatically via the Mailcoy REST API using template IDs.`;

    // 6. Pricing & Plans
    } else if (
      msg.includes("price") ||
      msg.includes("pricing") ||
      msg.includes("cost") ||
      msg.includes("how much") ||
      msg.includes("plan") ||
      msg.includes("tier") ||
      msg.includes("naira") ||
      msg.includes("dollar")
    ) {
      reply = `**Mailcoy Regional Pricing (Auto-detected in USD & NGN):**

• **Free Tier ($0 / ₦0):** 1 domain, 1 inbox, full Send-As routing.
• **Starter Pro ($9/mo or $90/yr | ₦7,500/mo or ₦75,000/yr):** 1 domain, up to 5 inboxes, company signatures.
• **Growth ($29/mo or $290/yr | ₦20,000/mo or ₦200,000/yr):** 3 domains, up to 20 inboxes, catch-all & full API access.
• **Scale ($79/mo or $790/yr | ₦50,000/mo or ₦500,000/yr):** 10 domains, up to 50 inboxes, offboarding shield, deliverability shield, VIP account manager.

💡 Compared to Google Workspace ($7.20/user/month), Mailcoy saves businesses over **80% on email costs**!`;

    // 7. Catch-All & Webmail
    } else if (msg.includes("catch-all") || msg.includes("catch all") || msg.includes("misspelled") || msg.includes("unknown email")) {
      reply = `**Catch-All Routing & Shared Webmail Inbox:**

Catch-All ensures you never lose a business lead due to a typo or unassigned address (e.g. \`contactus@yourdomain.com\` instead of \`contact@yourdomain.com\`).

• **Receive Mode:** Unmatched emails are collected into the built-in **Catch-All Shared Webmail Inbox** in your dashboard.
• **Forward Mode:** Automatically forwards all unmatched emails to a designated manager or admin email address.
• **Reject Mode:** Bounces unmatched messages cleanly with standard SMTP 550 codes.`;

    // 8. Employee Offboarding
    } else if (msg.includes("offboard") || msg.includes("suspend") || msg.includes("fired") || msg.includes("leave") || msg.includes("employee leaves")) {
      reply = `**1-Click Employee Offboarding Shield:**

When an employee departs your organization:
1. Open **Employees** in your Mailcoy dashboard.
2. Click the employee row and select **'Offboard / Suspend'**.
3. Mailcoy immediately purges routing tokens and blocks all inbound/outbound company email access from their personal Gmail without affecting their personal inbox or disrupting the rest of your domain.`;

    // 9. Brand Logo & BIMI Setup ($0 Free Guide)
    } else if (
      msg.includes("logo") ||
      msg.includes("bimi") ||
      msg.includes("avatar") ||
      msg.includes("profile picture") ||
      msg.includes("picture") ||
      data.selectedIssue === "bimi_logo"
    ) {
      reply = `**How to Display Your Company Logo in Emails ($0 Free & No Stress):**

Here are the 2 fastest, free ways to show your brand logo in customer inboxes without paying for $1,500/yr BIMI certificates:

1. **For Gmail Inboxes ($0 · Takes 30 Seconds):**
   • Go to **[myaccount.google.com](https://myaccount.google.com)** for the Gmail account connected to Mailcoy.
   • Click the **Profile Picture** icon at the top and upload your company logo (PNG or JPG).
   • Whenever you send an email as \`you@yourdomain.com\` via Mailcoy, Google automatically attaches your logo avatar to all Gmail recipients!

2. **For Apple Mail, Outlook & CRMs ($0 · Takes 1 Minute):**
   • Go to **[gravatar.com](https://gravatar.com)** and create a free profile.
   • Add your custom business email (\`you@yourdomain.com\`) and upload your logo.
   • Email clients and CRMs that query Gravatar will automatically display your brand avatar.

3. **Official BIMI DNS Record (Yahoo! & Fastmail):**
   • Open your domain details in Mailcoy, copy the generated \`default._bimi\` TXT record, and add it to your DNS registrar with your square SVG URL.

💡 *Recommendation:* Use **Method 1 & 2** for instant, 100% free logo coverage across all major inboxes!`;

    // 10. Deliverability & Spam
    } else if (msg.includes("spam") || msg.includes("deliverability") || msg.includes("inbox") || data.selectedIssue === "spam_issues") {
      reply = `**Deliverability Shield & DNSBL Monitoring:**


Mailcoy configures 3 industry-standard authentication shields to guarantee 99%+ inbox placement:
• **SPF:** Authorizes Mailcoy servers to send on your behalf.
• **DKIM:** Cryptographically signs each message to prove it hasn't been altered in transit.
• **DMARC:** Protects your domain from spoofing and phishing.

Our automated monitors scan major DNSBL blacklists (Spamhaus, Barracuda, SORBS) continuously to keep your domain reputation pristine.`;

    // 10. General Features & Overview
    } else if (
      msg.includes("what can i do") ||
      msg.includes("what is") ||
      msg.includes("how does it work") ||
      msg.includes("tell me about") ||
      msg.includes("features") ||
      msg.includes("your name")
    ) {
      reply = `I am the **Mailcoy AI Specialist**!

**Mailcoy** is the modern email operating system that lets you create professional custom domain email addresses (e.g. \`hello@yourbrand.com\`) and use them directly inside your personal Gmail inbox.

✨ **Core Superpowers:**
• **Use Personal Gmail:** Send and receive custom domain emails without switching apps.
• **Multi-Alias Single Gmail:** Connect multiple aliases (\`sales@\`, \`support@\`, \`billing@\`) to 1 Gmail with a 'From' dropdown.
• **Save 80%+:** Eliminate expensive $7.20/user/mo Google Workspace seat fees.
• **Domain Concierge ($15 / ₦15,000):** Done-for-you domain registration & DNS setup.
• **1-Click Offboarding Shield:** Revoke business email access instantly when staff leave.
• **Catch-All Webmail:** Capture every mistyped email in a shared dashboard inbox.
• **Universal Signatures:** Branded templates with live preview and merge tags.
• **Developer API:** Send transactional emails programmatically with API keys.`;

    // 11. Contact & Escalation
    } else if (msg.includes("contact") || msg.includes("human") || msg.includes("support") || msg.includes("help")) {
      reply = `You can reach our official team directly at:

• **General & Support:** \`hello@mailcoy.com\` / \`support@mailcoy.com\`
• **Sales & Enterprise:** \`sales@mailcoy.com\`
• **Security & Legal:** \`security@mailcoy.com\`

You can also click the button below to escalate this conversation directly to our platform Super Admin!`;

    // 12. Friendly Default
    } else {
      reply = `I am the **Mailcoy AI Specialist**. I can help you with:

• **Buying a new domain** vs **Linking your existing domain**
• **Gmail Send-As & SMTP setup**
• **Multi-alias inboxes & team routing**
• **Signatures, templates & catch-all mail**
• **Plans, pricing & promo codes**

What would you like to set up today?`;
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
  .validator((d: unknown) =>
    z.object({
      userEmail: z.string().email(),
      subject: z.string(),
      conversationHistory: z.string(),
    }).parse(d),
  )
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let userId = null;
    if (context?.supabase) {
      const { data: authData } = await context.supabase.auth.getUser();
      if (authData?.user) userId = authData.user.id;
    }

    // 1. Insert support ticket into activity logs / tickets if logged in
    if (userId) {
      await supabaseAdmin.from("activity_logs").insert({
        organization_id: "00000000-0000-0000-0000-000000000000",
        actor_user_id: userId,
        action: "support.ticket_escalated",
        target_type: "support",
        meta: {
          userEmail: data.userEmail,
          subject: data.subject,
          history: data.conversationHistory,
          timestamp: new Date().toISOString(),
        },
      } as never);
    }

    // 2. Dispatch email notification to admin via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@mailcoy.com";

    if (resendApiKey) {
      try {
        const escapeHtml = (str: string) =>
          str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

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
            subject: `[Support Escalation] ${data.subject.replace(/[\r\n]/g, " ")} (${data.userEmail})`,
            html: `
              <h2>New Support Escalation</h2>
              <p><strong>User Email:</strong> ${escapeHtml(data.userEmail)}</p>
              <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
              <hr />
              <h3>Conversation Transcript:</h3>
              <pre style="background: #f4f4f5; padding: 12px; border-radius: 8px; font-size: 12px; white-space: pre-wrap;">${escapeHtml(data.conversationHistory)}</pre>
            `,
          }),
        });
      } catch (e) {
        console.warn("Support escalation email dispatch error:", e);
      }
    }

    return { ok: true };
  });
