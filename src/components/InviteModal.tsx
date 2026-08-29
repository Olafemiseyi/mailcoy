import { useState, useEffect } from "react";
import { useQueryClient, useSuspenseQuery, queryOptions, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, Button } from "@/components/app/AppShell";
import { X, Send, Copy, QrCode, RefreshCw, Check, Mail, MessageSquare, Link2 } from "lucide-react";
import { createInvite, revokeInvite, listInvitesForEmployee } from "@/lib/invitations.functions";
import QRCode from "qrcode";

export type EmpRef = {
  id: string;
  full_name: string | null;
  professional_email: string | null;
  job_title?: string | null;
  department?: string | null;
  status: string;
  gmail_connected?: boolean;
};

type SendChannel = "link" | "email" | "whatsapp";

export function InviteModal({ employee, onClose }: { employee: EmpRef; onClose: () => void }) {
  const qc = useQueryClient();
  const create = useServerFn(createInvite);
  const revoke = useServerFn(revokeInvite);

  const invitesQ = useSuspenseQuery(queryOptions({
    queryKey: ["invites", employee.id],
    queryFn: async () => listInvitesForEmployee({ data: { employeeId: employee.id } }),
  }));

  const activeInvite = (invitesQ.data as Array<{ id: string; token: string; sent_at: string; revoked_at: string | null; accepted_at: string | null; expires_at: string; opened_at: string | null }>)
    .find((i) => !i.revoked_at && !i.accepted_at && new Date(i.expires_at) > new Date());

  const newInvite = useMutation({
    mutationFn: () => create({ data: { employeeId: employee.id, sentVia: "link" } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invites", employee.id] }),
  });

  const revokeM = useMutation({
    mutationFn: (id: string) => revoke({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invites", employee.id] }),
  });

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [sentVia, setSentVia] = useState<SendChannel | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = activeInvite ? `${origin}/invite/${activeInvite.token}` : "";

  useEffect(() => {
    if (url && showQR) {
      QRCode.toDataURL(url, { width: 200, margin: 2, color: { dark: "#0f172a", light: "#ffffff" } })
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(null));
    }
  }, [url, showQR]);

  async function copy() {
    if (!url) return;
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setSentVia("link");
    setTimeout(() => setCopied(false), 1800);
  }

  function openEmail() {
    if (!url) return;
    const name = employee.full_name ?? "there";
    const addr = employee.professional_email ?? "";
    const subj = encodeURIComponent(`Connect your Gmail to ${addr}`);
    const body = encodeURIComponent(
      `Hi ${name},\n\nYour professional email address ${addr} is ready on Mailcoy.\n\nClick the link below to connect your Gmail account — it only takes about 2 minutes:\n\n${url}\n\nThis link expires on ${activeInvite ? new Date(activeInvite.expires_at).toLocaleDateString() : ""}. If you have any trouble, reply to this email.\n\nWelcome aboard!`
    );
    window.open(`mailto:${addr}?subject=${subj}&body=${body}`);
    setSentVia("email");
  }

  function openWhatsapp() {
    if (!url) return;
    const name = employee.full_name ?? "";
    const addr = employee.professional_email ?? "";
    const msg = encodeURIComponent(
      `Hi ${name}! 👋\n\nYour professional email *${addr}* is ready. Connect your Gmail here:\n${url}\n\nLink expires ${activeInvite ? new Date(activeInvite.expires_at).toLocaleDateString() : ""}.`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
    setSentVia("whatsapp");
  }

  const expiresLabel = activeInvite
    ? `Expires ${new Date(activeInvite.expires_at).toLocaleDateString()}`
    : "";
  const openedLabel = activeInvite?.opened_at
    ? ` · Opened ${new Date(activeInvite.opened_at).toLocaleDateString()}`
    : "";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <Card className="w-full max-w-lg p-0 overflow-hidden shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold">Invite {employee.full_name ?? "employee"}</h2>
            <p className="text-[12.5px] text-ink-3 mt-0.5">
              They'll connect their own Google account to{" "}
              <span className="font-mono text-ink-2">{employee.professional_email}</span>
            </p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-ink/[0.05]" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {!activeInvite ? (
            /* No active invite */
            <div className="py-4 text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 grid place-items-center">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <p className="text-[13.5px] text-ink-2">No active invite link. Generate one to share with {employee.full_name ?? "this employee"}.</p>
              <Button onClick={() => newInvite.mutate()} disabled={newInvite.isPending} className="w-full">
                <Send className="h-4 w-4 mr-1.5" />
                {newInvite.isPending ? "Generating…" : "Generate invite link"}
              </Button>
              {newInvite.isError && (
                <p className="text-[13px] text-red-600">{(newInvite.error as Error).message}</p>
              )}
            </div>
          ) : (
            <>
              {/* Invite link display */}
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-1.5 font-medium">Invite link</div>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={url}
                    onFocus={(e) => e.currentTarget.select()}
                    className="flex-1 h-10 rounded-md border border-line bg-surface-muted px-3 text-[12px] font-mono truncate outline-none"
                  />
                  <button
                    onClick={copy}
                    className={`inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-[13px] transition ${
                      copied ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700" : "border-line hover:bg-ink/[0.04]"
                    }`}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-1.5 text-[11.5px] text-ink-3">{expiresLabel}{openedLabel}</p>
              </div>

              {/* Send channels */}
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-2 font-medium">Send via</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={openEmail}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-[12.5px] hover:bg-ink/[0.04] transition ${sentVia === "email" ? "border-primary/40 bg-primary/5 text-primary" : "border-line"}`}
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </button>
                  <button
                    onClick={openWhatsapp}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-[12.5px] hover:bg-ink/[0.04] transition ${sentVia === "whatsapp" ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700" : "border-line"}`}
                  >
                    <MessageSquare className="h-5 w-5" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => { setShowQR((v) => !v); setSentVia("link"); }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-[12.5px] hover:bg-ink/[0.04] transition ${showQR ? "border-primary/40 bg-primary/5 text-primary" : "border-line"}`}
                  >
                    <QrCode className="h-5 w-5" />
                    QR Code
                  </button>
                </div>
              </div>

              {/* Sent feedback */}
              {sentVia && sentVia !== "link" && (
                <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-2 text-[12.5px] text-emerald-700">
                  <Check className="h-4 w-4 shrink-0" />
                  {sentVia === "email"
                    ? `Pre-filled email opened for ${employee.professional_email}`
                    : "WhatsApp message opened — paste and send!"}
                </div>
              )}

              {/* QR Code */}
              {showQR && (
                <div className="grid place-items-center rounded-xl border border-line bg-white p-5">
                  {qrDataUrl ? (
                    <img
                      alt="Invite QR code"
                      width={180}
                      height={180}
                      src={qrDataUrl}
                    />
                  ) : (
                    <div className="h-[180px] w-[180px] flex items-center justify-center text-ink-3 text-xs">
                      Generating QR...
                    </div>
                  )}
                  <p className="mt-2 text-[11.5px] text-ink-3">Scan with a phone camera</p>
                </div>
              )}

              {/* Footer actions */}
              <div className="flex items-center justify-between border-t border-line pt-4">
                <button
                  onClick={() => newInvite.mutate()}
                  disabled={newInvite.isPending}
                  className="inline-flex h-9 items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${newInvite.isPending ? "animate-spin" : ""}`} />
                  Regenerate link
                </button>
                <button
                  onClick={() => revokeM.mutate(activeInvite.id)}
                  disabled={revokeM.isPending}
                  className="text-[13px] text-danger hover:underline disabled:opacity-50"
                >
                  {revokeM.isPending ? "Revoking…" : "Revoke invite"}
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
