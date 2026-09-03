// Reusable Resend API Client for Mailcoy
// Features:
// 1. Exponential backoff retry on 429 and 5xx errors
// 2. Retry-After header parsing
// 3. Deterministic Idempotency-Key support
// 4. Safe logging without exposing API keys

export interface SendResendEmailOptions {
  from: string;
  to: string | string[];
  reply_to?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  headers?: Record<string, string>;
  attachments?: any[];
  idempotencyKey?: string;
  apiKey?: string;
  maxRetries?: number;
  timeoutMs?: number;
}

export interface ResendDispatchResult {
  ok: boolean;
  status: number;
  id?: string;
  data?: any;
  error?: string;
  attempts: number;
}

export async function sendResendEmail(options: SendResendEmailOptions): Promise<ResendDispatchResult> {
  const apiKey = options.apiKey || process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      error: "RESEND_API_KEY is not configured",
      attempts: 0,
    };
  }

  const maxRetries = options.maxRetries ?? 3;
  const timeoutMs = options.timeoutMs ?? 15000;
  const initialBackoffMs = 500;

  const requestHeaders: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  // Attach deterministic idempotency key if provided
  if (options.idempotencyKey) {
    requestHeaders["Idempotency-Key"] = options.idempotencyKey;
  }

  const requestBody = {
    from: options.from,
    to: Array.isArray(options.to) ? options.to : [options.to],
    ...(options.reply_to ? { reply_to: options.reply_to } : {}),
    ...(options.cc && options.cc.length > 0 ? { cc: options.cc } : {}),
    ...(options.bcc && options.bcc.length > 0 ? { bcc: options.bcc } : {}),
    subject: options.subject,
    ...(options.html ? { html: options.html } : {}),
    ...(options.text ? { text: options.text } : {}),
    ...(options.headers ? { headers: options.headers } : {}),
    ...(options.attachments && options.attachments.length > 0 ? { attachments: options.attachments } : {}),
  };

  let attempt = 0;
  let lastError: string = "";
  let lastStatus = 0;

  while (attempt < maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timer);
      lastStatus = response.status;

      if (response.ok) {
        const data = (await response.json().catch(() => ({}))) as any;
        return {
          ok: true,
          status: response.status,
          id: data?.id,
          data,
          attempts: attempt,
        };
      }

      // Permanent 4xx errors (e.g. 400 Bad Request, 401 Unauthorized, 422 Unprocessable) — DO NOT RETRY
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const errText = await response.text().catch(() => "");
        lastError = `Permanent Resend error (${response.status}): ${errText.slice(0, 200)}`;
        console.warn(`[ResendClient] Non-retryable error (${response.status}) on attempt ${attempt}:`, lastError);
        return {
          ok: false,
          status: response.status,
          error: lastError,
          attempts: attempt,
        };
      }

      // 429 Rate Limit or 5xx Server Error — eligible for retry
      const errText = await response.text().catch(() => "");
      lastError = `Resend API error (${response.status}): ${errText.slice(0, 200)}`;

      if (attempt < maxRetries) {
        // Check for standard Retry-After header
        const retryAfterHeader = response.headers.get("retry-after");
        let delayMs = initialBackoffMs * Math.pow(2, attempt - 1); // 500ms, 1000ms, 2000ms

        if (retryAfterHeader) {
          const parsedSeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
            delayMs = parsedSeconds * 1000;
          }
        }

        console.warn(
          `[ResendClient] Retryable error (${response.status}) on attempt ${attempt}/${maxRetries}. Backing off for ${delayMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (fetchErr: any) {
      clearTimeout(timer);
      lastStatus = 0;
      lastError = fetchErr?.name === "AbortError" ? "Request timeout (15s)" : (fetchErr?.message || "Network error");

      if (attempt < maxRetries) {
        const delayMs = initialBackoffMs * Math.pow(2, attempt - 1);
        console.warn(
          `[ResendClient] Network error on attempt ${attempt}/${maxRetries}: ${lastError}. Retrying in ${delayMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  return {
    ok: false,
    status: lastStatus,
    error: lastError || "Failed after maximum retries",
    attempts: attempt,
  };
}

/**
 * Fetches an inbound receiving email body from Resend with retry.
 */
export async function fetchReceivingEmailWithRetry(emailId: string, apiKey?: string, maxRetries = 3): Promise<any | null> {
  const key = apiKey || process.env.RESEND_API_KEY;
  if (!key) return null;

  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    try {
      const res = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        return await res.json();
      }

      if (res.status !== 429 && res.status < 500) {
        return null;
      }
    } catch {
      // Network retry
    }

    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt - 1)));
    }
  }

  return null;
}
