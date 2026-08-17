import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Card, Button, StatusPill } from "@/components/app/AppShell";
import { getSesCredentials, saveSesCredentials, removeSesCredentials } from "@/lib/ses.functions";
import { toast } from "sonner";
import { useState } from "react";
import { Server, Key, Trash2, CheckCircle2, ShieldAlert } from "lucide-react";

const sesOpts = queryOptions({
  queryKey: ["ses_credentials"],
  queryFn: () => getSesCredentials(),
});

export const Route = createFileRoute("/_authenticated/_shell/settings/aws")({
  head: () => ({ meta: [{ title: "Amazon SES — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(sesOpts),
  component: AwsSettingsRoute,
});

function AwsSettingsRoute() {
  const queryClient = useQueryClient();
  const { data: creds } = useSuspenseQuery(sesOpts);
  
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState(creds?.region || "us-east-1");

  const saveMutation = useMutation({
    mutationFn: async () => saveSesCredentials({ data: { accessKeyId: accessKey, secretAccessKey: secretKey, region } }),
    onSuccess: () => {
      toast.success("AWS Credentials securely saved and verified");
      setAccessKey("");
      setSecretKey("");
      queryClient.invalidateQueries({ queryKey: ["ses_credentials"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const removeMutation = useMutation({
    mutationFn: async () => removeSesCredentials(),
    onSuccess: () => {
      toast.success("AWS Credentials removed");
      queryClient.invalidateQueries({ queryKey: ["ses_credentials"] });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Amazon SES"
        subtitle="Connect your AWS account to send transactional emails via Amazon Simple Email Service."
      />

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-ink">AWS Connection Status</h3>
            <p className="text-[13px] text-ink-3 mt-1">
              Store your IAM credentials securely to enable bulk sending. We use AES-256-GCM encryption.
            </p>
          </div>
          {creds ? (
            <StatusPill status="healthy" />
          ) : (
            <StatusPill status="paused" />
          )}
        </div>

        {creds ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-surface p-4 border border-line">
              <div>
                <span className="block text-[12px] font-medium text-ink-3 uppercase tracking-wider mb-1">Region</span>
                <span className="text-[14px] text-ink font-mono">{creds.region}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-ink-3 uppercase tracking-wider mb-1">Daily Quota</span>
                <span className="text-[14px] text-ink">{creds.daily_quota ? creds.daily_quota.toLocaleString() : "Unknown"}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-ink-3 uppercase tracking-wider mb-1">Max Send Rate</span>
                <span className="text-[14px] text-ink">{creds.send_rate ? `${creds.send_rate}/sec` : "Unknown"}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-ink-3 uppercase tracking-wider mb-1">Last Updated</span>
                <span className="text-[14px] text-ink">{new Date(creds.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => {
                  if (confirm("Are you sure you want to remove your AWS credentials?")) {
                    removeMutation.mutate();
                  }
                }}
                disabled={removeMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Disconnect AWS
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="space-y-4 max-w-lg"
          >
            <div>
              <label className="block text-[13px] font-medium text-ink mb-1.5">AWS Region</label>
              <select
                className="w-full h-9 rounded-md border border-line bg-background px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">Europe (Ireland)</option>
                <option value="eu-central-1">Europe (Frankfurt)</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-ink mb-1.5">Access Key ID</label>
              <input
                type="text"
                placeholder="AKIA..."
                className="w-full h-9 rounded-md border border-line bg-background px-3 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                required
                minLength={16}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-ink mb-1.5">Secret Access Key</label>
              <input
                type="password"
                placeholder="••••••••••••••••••••••••••••••••"
                className="w-full h-9 rounded-md border border-line bg-background px-3 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
                minLength={32}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" disabled={saveMutation.isPending || !accessKey || !secretKey}>
                <Key className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? "Verifying..." : "Save Credentials"}
              </Button>
            </div>
          </form>
        )}
      </Card>
      
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-[13px] text-blue-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">IAM User Permissions Required</p>
          <p className="text-blue-800/80">
            Ensure your IAM user has the <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900">AmazonSESFullAccess</code> policy, or at minimum permissions for <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900">ses:SendRawEmail</code>, <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900">ses:GetSendQuota</code>, and <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900">ses:VerifyDomainIdentity</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
