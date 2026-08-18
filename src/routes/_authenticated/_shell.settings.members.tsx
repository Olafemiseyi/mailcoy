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
                      <Button variant="secondary" onClick={copyLink} className="w-10 px-0 shrink-0">
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-[12px] text-ink-4">Send this link to the user to let them sign up and join your workspace.</p>
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
