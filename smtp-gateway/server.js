/**
 * Mailcoy Central Inbound SMTP Gateway
 * ─────────────────────────────────────
 * Listens on port 25 (SMTP) as mx1.mailcoy.com
 * Receives mail for ANY customer domain pointing MX here.
 * Resolves the recipient employee in Supabase → relays to their Gmail via Resend.
 *
 * Customers only need to:
 *   1. Add their domain in Mailcoy dashboard
 *   2. Set MX record → mx1.mailcoy.com (priority 10)
 *   That's it. No Cloudflare email routing, no manual forwarding rules.
 */

import 'dotenv/config';
import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import { createClient } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PORT = parseInt(process.env.SMTP_PORT || '25', 10);
const GATEWAY_DOMAIN = process.env.GATEWAY_DOMAIN || 'mx1.mailcoy.com';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY) {
  console.error('[Mailcoy SMTP] Missing required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolve the personal Gmail for an incoming recipient address.
 * Lookup order:
 *   1. employees.professional_email / employees.company_email
 *   2. aliases table → employee → gmail_connections
 *   3. Domain catch-all → first employee of that org
 */
async function resolveDestination(recipientEmail) {
  const email = recipientEmail.trim().toLowerCase();
  const domain = email.split('@')[1];

  // 1. Direct employee match
  const { data: emp } = await supabase
    .from('employees')
    .select('id, organization_id, full_name, personal_gmail, personal_email')
    .or(`professional_email.eq.${email},company_email.eq.${email}`)
    .maybeSingle();

  if (emp) {
    // Prefer verified connected Gmail
    const { data: conn } = await supabase
      .from('gmail_connections')
      .select('google_email')
      .eq('employee_id', emp.id)
      .is('revoked_at', null)
      .maybeSingle();

    const targetGmail = conn?.google_email || (emp.personal_gmail !== email ? emp.personal_gmail : null) || emp.personal_email;

    if (targetGmail) {
      return { targetGmail, orgId: emp.organization_id, employeeName: emp.full_name || 'Team Member' };
    }
  }

  // 2. Alias match
  const { data: alias } = await supabase
    .from('aliases')
    .select('id, organization_id, employee_id')
    .eq('alias_email', email)
    .maybeSingle();

  if (alias?.employee_id) {
    const { data: aliasEmp } = await supabase
      .from('employees')
      .select('id, full_name, personal_gmail, personal_email')
      .eq('id', alias.employee_id)
      .maybeSingle();

    if (aliasEmp) {
      const { data: conn } = await supabase
        .from('gmail_connections')
        .select('google_email')
        .eq('employee_id', aliasEmp.id)
        .is('revoked_at', null)
        .maybeSingle();

      const targetGmail = conn?.google_email || aliasEmp.personal_gmail || aliasEmp.personal_email;
      if (targetGmail) {
        return { targetGmail, orgId: alias.organization_id, employeeName: aliasEmp.full_name || 'Team Member' };
      }
    }
  }

  // 3. Domain catch-all: find the org that owns this domain, then first employee
  const { data: dom } = await supabase
    .from('domains')
    .select('organization_id')
    .eq('domain_name', domain)
    .maybeSingle();

  if (dom?.organization_id) {
    const { data: ownerEmp } = await supabase
      .from('employees')
      .select('id, full_name, personal_gmail, personal_email')
      .eq('organization_id', dom.organization_id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (ownerEmp) {
      const { data: conn } = await supabase
        .from('gmail_connections')
        .select('google_email')
        .eq('employee_id', ownerEmp.id)
        .is('revoked_at', null)
        .maybeSingle();

      const targetGmail = conn?.google_email || ownerEmp.personal_gmail || ownerEmp.personal_email;
      if (targetGmail) {
        return { targetGmail, orgId: dom.organization_id, employeeName: ownerEmp.full_name || 'Team Member' };
      }
    }
  }

  return null;
}

/**
 * Forward parsed email to destination Gmail via Resend.
 */
async function forwardEmail({ parsed, recipientEmail, destination }) {
  const { targetGmail, orgId, employeeName } = destination;
  const fromAddress = parsed.from?.text || 'Unknown Sender';
  const subject = parsed.subject || '(No Subject)';
  const html = parsed.html || `<pre style="font-family:inherit;white-space:pre-wrap">${parsed.text || ''}</pre>`;
  const recipientDomain = recipientEmail.split('@')[1];

  const forwardHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;
                border-radius:8px;margin-bottom:20px;font-size:13px;color:#475569;">
      <div style="font-weight:600;color:#0f172a;margin-bottom:4px;">📬 Mailcoy Inbound — ${recipientEmail}</div>
      <div>From: <strong>${fromAddress}</strong></div>
      <div style="margin-top:4px;font-size:12px;color:#64748b;">
        Reply to this email to respond directly to the sender.
      </div>
    </div>
    <div>${html}</div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Mailcoy Router <router@${recipientDomain}>`,
      to: [targetGmail],
      reply_to: fromAddress,
      subject: subject,
      html: forwardHtml,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(`Resend error: ${JSON.stringify(result)}`);
  }

  console.log(`[Mailcoy SMTP] ✅ Relayed ${recipientEmail} → ${targetGmail} (id: ${result.id})`);

  // Log to Supabase email_logs
  if (orgId) {
    await supabase.from('email_logs').insert({
      organization_id: orgId,
      sender: fromAddress,
      receiver: recipientEmail,
      subject,
      snippet: (parsed.text || subject || '').slice(0, 150),
      direction: 'incoming',
      status: 'delivered',
      timestamp: new Date().toISOString(),
    });
  }

  return result;
}

// ─── SMTP Server ──────────────────────────────────────────────────────────────

const server = new SMTPServer({
  // Accept all connections (no auth required for inbound)
  authOptional: true,
  // Allow connections from any IP (external senders)
  disabledCommands: ['STARTTLS'],
  // For production add TLS cert:
  // secure: true,
  // key: fs.readFileSync('/etc/letsencrypt/live/mx1.mailcoy.com/privkey.pem'),
  // cert: fs.readFileSync('/etc/letsencrypt/live/mx1.mailcoy.com/fullchain.pem'),

  onConnect(session, callback) {
    console.log(`[Mailcoy SMTP] Connection from ${session.remoteAddress}`);
    callback(); // Accept all connections
  },

  onMailFrom(address, session, callback) {
    console.log(`[Mailcoy SMTP] MAIL FROM: ${address.address}`);
    callback(); // Accept all senders
  },

  onRcptTo(address, session, callback) {
    const recipient = address.address.toLowerCase();
    const domain = recipient.split('@')[1];

    // Quick domain check — only accept mail for domains we manage
    supabase
      .from('domains')
      .select('id')
      .eq('domain_name', domain)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          console.log(`[Mailcoy SMTP] Accepting RCPT TO: ${recipient}`);
          callback(); // Accept
        } else {
          // Also check employees table for mailcoy.com native addresses
          supabase
            .from('employees')
            .select('id')
            .or(`professional_email.eq.${recipient},company_email.eq.${recipient}`)
            .maybeSingle()
            .then(({ data: emp }) => {
              if (emp) {
                console.log(`[Mailcoy SMTP] Accepting native RCPT TO: ${recipient}`);
                callback();
              } else {
                console.warn(`[Mailcoy SMTP] Rejecting unknown RCPT TO: ${recipient}`);
                callback(new Error('5.1.1 User not found'));
              }
            });
        }
      });
  },

  onData(stream, session, callback) {
    const chunks = [];

    stream.on('data', (chunk) => chunks.push(chunk));

    stream.on('end', async () => {
      const rawEmail = Buffer.concat(chunks);
      let parsed;

      try {
        parsed = await simpleParser(rawEmail);
      } catch (err) {
        console.error('[Mailcoy SMTP] Failed to parse email:', err);
        return callback(new Error('Failed to parse email'));
      }

      const recipients = session.envelope.rcptTo.map((r) => r.address.toLowerCase());
      console.log(`[Mailcoy SMTP] Processing email for: ${recipients.join(', ')}`);

      // Process each recipient in parallel
      const results = await Promise.allSettled(
        recipients.map(async (recipientEmail) => {
          const destination = await resolveDestination(recipientEmail);

          if (!destination) {
            console.warn(`[Mailcoy SMTP] No Gmail destination found for ${recipientEmail}`);
            return;
          }

          await forwardEmail({ parsed, recipientEmail, destination });
        })
      );

      // Log any failures
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[Mailcoy SMTP] Failed to relay to ${recipients[i]}:`, r.reason);
        }
      });

      callback(); // Acknowledge to sender's mail server — email accepted
    });

    stream.on('error', (err) => {
      console.error('[Mailcoy SMTP] Stream error:', err);
      callback(err);
    });
  },

  onError(err) {
    console.error('[Mailcoy SMTP] Server error:', err);
  },
});

server.on('error', (err) => {
  console.error('[Mailcoy SMTP] Fatal error:', err);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Mailcoy SMTP Inbound Gateway running`);
  console.log(`   Port  : ${PORT}`);
  console.log(`   Domain: ${GATEWAY_DOMAIN}`);
  console.log(`   Ready to receive mail for all verified customer domains\n`);
});
