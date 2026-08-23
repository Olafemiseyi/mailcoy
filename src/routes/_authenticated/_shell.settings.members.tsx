import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listMembers, inviteMember } from "@/lib/platform.functions";
import { Card, Button, CustomSelect } from "@/components/app/AppShell";
import { ShieldCheck, UserPlus, Crown, Mail, Copy, Check, X } from "lucide-react";

const opts = queryOptions({ queryKey: ["members"], queryFn: async () => listMembers(), staleTime: 15_000 });

export const Route = createFileRoute("/_authenticated/_shell/settings/members")({
  head: () => ({ meta: [{ title: "Team Admins & Members — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(opts),
  component: MembersRoute,
});

function MembersRoute() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts);
  const inviteFn = useServerFn(inviteMember);

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("admin");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ message: string; inviteUrl?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await inviteFn({ data: { email, role } });
      setResult(res);
      await qc.invalidateQueries({ queryKey: ["members"] });
    } catch (err: any) {
      alert(err?.message || "Failed to send invitation");
    } finally {
      setBusy(false);
    }
  };

  const copyLink = () => {
    if (result?.inviteUrl) {
      navigator.clipboard.writeText(result.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Team Admins & Dashboard Access</h3>
            <p className="mt-1 text-[13px] text-ink-3">
              People who have administrative login access to manage this Mailcoy workspace, domains, and billing.
            </p>
          </div>
          <Button 
            onClick={() => {
              setResult(null);
              setEmail("");
              setRole("admin");
              setOpenModal(true);
            }} 
            className="gap-2 shrink-0"
          >
            <UserPlus className="h-4 w-4" /> Invite Member
          </Button>
        </div>

        {data.length === 0 ? (
          <div className="p-8 text-center text-[13.5px] text-ink-3">No members found.</div>
        ) : (
          <ul className="divide-y divide-line mt-2">
            {data.map((m: any) => {
              const displayName = m.full_name || m.email?.split("@")[0] || "Workspace Admin";
              const displayEmail = m.email || `User (${m.user_id.slice(0, 8)}...)`;
              const isOwner = m.role === "owner";

              return (
                <li key={m.user_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary font-bold text-sm grid place-items-center shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[14px] text-ink truncate">{displayName}</span>
                        {m.is_current_user && (
                          <span className="text-[10.5px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[12.5px] text-ink-3 truncate mt-0.5">{displayEmail}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold capitalize ${
                        isOwner
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                          : "bg-surface-muted text-ink-2 border border-line"
                      }`}
                    >
                      {isOwner && <Crown className="h-3.5 w-3.5 text-amber-600" />}
                      {m.role}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Invite User Dialog Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <UserPlus className="h-5 w-5 text-primary" /> Invite Team Member
              </div>
              <button
                onClick={() => {
                  setOpenModal(false);
                  setResult(null);
                  setEmail("");
                }}
                className="p-1 text-ink-3 hover:text-ink hover:bg-ink/[0.04] rounded-md transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {result ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-line bg-surface-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-500/10 p-1.5 mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-ink-2">
                      {result.message}
                    </p>
                  </div>
                </div>

                {result.inviteUrl && (
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-ink-3">Invite Link</label>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={result.inviteUrl}
                        className="h-10 flex-1 rounded-xl border border-line bg-surface-muted px-3 text-[12px] font-mono text-ink outline-none"
                      />
                      <Button variant="ghost" onClick={copyLink} className="w-10 px-0 shrink-0">
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                      <p className="text-[12px] text-ink-4">Send this link to the user to let them sign up and join your workspace.</p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button 
                          type="button"
                          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Join my Mailcoy workspace! Here is your invite link:\n' + result.inviteUrl)}`, '_blank')}
                          className="flex items-center gap-2 h-8 px-3 rounded-lg border border-line bg-surface hover:bg-surface-muted transition text-[12px] font-medium text-ink-2"
                        >
                          <svg className="h-3.5 w-3.5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                          </svg>
                          WhatsApp
                        </button>

                        <button 
                          type="button"
                          onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent('Invitation to join Mailcoy workspace')}&body=${encodeURIComponent('Hello,\n\nYou have been invited to join my workspace on Mailcoy.\n\nPlease click the link below to sign up and join:\n\n' + result.inviteUrl + '\n\nBest,')}`}
                          className="flex items-center gap-2 h-8 px-3 rounded-lg border border-line bg-surface hover:bg-surface-muted transition text-[12px] font-medium text-ink-2"
                        >
                          <Mail className="h-3.5 w-3.5 text-ink-3" />
                          Email
                        </button>
                      </div>
                    </div>
                  )}

                <Button className="w-full mt-2" onClick={() => setOpenModal(false)}>Done</Button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4 pt-2">
                <label className="grid gap-1.5 text-[13px] font-semibold text-ink-2">
                  Email Address
                  <input
                    required
                    type="email"
                    placeholder="e.g. jane@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-xl border border-line bg-surface px-3 text-[13px] outline-none transition focus:border-primary"
                  />
                </label>

                <label className="grid gap-1.5 text-[13px] font-semibold text-ink-2">
                  Role
                  <CustomSelect
                    options={[
                      { value: "admin", label: "Workspace Admin (DNS, Inboxes, Signatures)" },
                      { value: "member", label: "Workspace Member (Staff)" },
                    ]}
                    value={role}
                    onChange={(val) => setRole(val as any)}
                  />
                </label>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={busy} className="gap-2">
                    {busy ? "Sending..." : "Send Invite"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
