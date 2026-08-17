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
          <Button onClick={() => setOpenModal(true)} className="gap-2 shrink-0">
            <UserPlus className="h-4 w-4" /> Invite Admin
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

      {/* Invite Admin Dialog Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <UserPlus className="h-5 w-5 text-primary" /> Invite Workspace Admin
              </div>
              <button
                onClick={() => {
                  setOpenModal(false);
                  setResult(null);
                  setEmail("");
                }}
                className="text-ink-4 hover:text-ink transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {result ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[13px] leading-relaxed">
                  {result.message}
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
                      <Button onClick={copyLink} className="gap-1.5 shrink-0 h-10 px-3">
                        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setOpenModal(false);
                    setResult(null);
                    setEmail("");
                  }}
                  className="w-full mt-2"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4 pt-2">
                <label className="grid gap-1.5 text-[13px] font-semibold text-ink-2">
                  Admin Email Address
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="co-founder@company.com"
                    className="h-10 rounded-xl border border-line bg-background px-3 text-[14px] text-ink outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1.5 text-[13px] font-semibold text-ink-2">
                  Permission Role
                  <CustomSelect
                    options={[
                      { value: "admin", label: "Workspace Admin (DNS, Inboxes, Signatures)" },
                      { value: "member", label: "Workspace Member (Staff)" },
                    ]}
                    value={role}
                    onChange={(val) => setRole(val as any)}
                  />
                </label>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={busy} className="gap-2">
                    {busy ? "Sending…" : "Send Admin Invite"}
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
