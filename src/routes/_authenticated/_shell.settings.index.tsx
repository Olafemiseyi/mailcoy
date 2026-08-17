import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getMyOrganization, updateOrganization, uploadOrganizationLogo } from "@/lib/orgs.functions";
import { PageHeader, Card, Button, Input, Field, CustomSelect } from "@/components/app/AppShell";

const INDUSTRIES = [
  "Real estate", "Technology / SaaS", "E-commerce / Retail", "Finance / Fintech",
  "Healthcare", "Education", "Legal", "Marketing / Agency", "Media / Publishing",
  "Construction", "Hospitality / Travel", "Manufacturing", "Non-profit",
  "Consulting", "Other",
];

const COUNTRIES: Array<{ code: string; name: string }> = [
  { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" }, { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" }, { code: "AM", name: "Armenia" }, { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" }, { code: "AZ", name: "Azerbaijan" }, { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" }, { code: "BY", name: "Belarus" }, { code: "BE", name: "Belgium" },
  { code: "BJ", name: "Benin" }, { code: "BO", name: "Bolivia" }, { code: "BA", name: "Bosnia & Herzegovina" },
  { code: "BW", name: "Botswana" }, { code: "BR", name: "Brazil" }, { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" }, { code: "KH", name: "Cambodia" }, { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" }, { code: "CL", name: "Chile" }, { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" }, { code: "CR", name: "Costa Rica" }, { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatia" }, { code: "CU", name: "Cuba" }, { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" }, { code: "DK", name: "Denmark" }, { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" }, { code: "EG", name: "Egypt" }, { code: "SV", name: "El Salvador" },
  { code: "EE", name: "Estonia" }, { code: "ET", name: "Ethiopia" }, { code: "FI", name: "Finland" },
  { code: "FR", name: "France" }, { code: "GA", name: "Gabon" }, { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" }, { code: "GH", name: "Ghana" }, { code: "GR", name: "Greece" },
  { code: "GT", name: "Guatemala" }, { code: "HN", name: "Honduras" }, { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" }, { code: "IS", name: "Iceland" }, { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" }, { code: "IR", name: "Iran" }, { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" }, { code: "IL", name: "Israel" }, { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" }, { code: "JP", name: "Japan" }, { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" }, { code: "KE", name: "Kenya" }, { code: "KW", name: "Kuwait" },
  { code: "LA", name: "Laos" }, { code: "LV", name: "Latvia" }, { code: "LB", name: "Lebanon" },
  { code: "LY", name: "Libya" }, { code: "LT", name: "Lithuania" }, { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" }, { code: "MG", name: "Madagascar" }, { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" }, { code: "MV", name: "Maldives" }, { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" }, { code: "MR", name: "Mauritania" }, { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" }, { code: "MD", name: "Moldova" }, { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" }, { code: "MA", name: "Morocco" }, { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" }, { code: "NA", name: "Namibia" }, { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" }, { code: "NZ", name: "New Zealand" }, { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" }, { code: "NG", name: "Nigeria" }, { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" }, { code: "OM", name: "Oman" }, { code: "PK", name: "Pakistan" },
  { code: "PS", name: "Palestine" }, { code: "PA", name: "Panama" }, { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" }, { code: "PH", name: "Philippines" }, { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" }, { code: "QA", name: "Qatar" }, { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" }, { code: "RW", name: "Rwanda" }, { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" }, { code: "RS", name: "Serbia" }, { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" }, { code: "SI", name: "Slovenia" }, { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" }, { code: "KR", name: "South Korea" }, { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" }, { code: "SD", name: "Sudan" }, { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" }, { code: "SY", name: "Syria" }, { code: "TW", name: "Taiwan" },
  { code: "TZ", name: "Tanzania" }, { code: "TH", name: "Thailand" }, { code: "TG", name: "Togo" },
  { code: "TN", name: "Tunisia" }, { code: "TR", name: "Türkiye" }, { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" }, { code: "AE", name: "United Arab Emirates" }, { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" }, { code: "UY", name: "Uruguay" }, { code: "UZ", name: "Uzbekistan" },
  { code: "VE", name: "Venezuela" }, { code: "VN", name: "Vietnam" }, { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" }, { code: "ZW", name: "Zimbabwe" },
];

const opts = queryOptions({ queryKey: ["my-org"], queryFn: async () => getMyOrganization(), staleTime: 30_000 });

export const Route = createFileRoute("/_authenticated/_shell/settings/")({
  loader: ({ context }: any) => context.queryClient.ensureQueryData(opts),
  component: SettingsIndex,
});

function SettingsIndex() {
  const { data } = useSuspenseQuery(opts);
  const org = data && "name" in data ? data : null;
  const qc = useQueryClient();
  const save = useServerFn(updateOrganization);
  const uploadLogo = useServerFn(uploadOrganizationLogo);
  const [name, setName] = useState(org?.name ?? "");
  const [industry, setIndustry] = useState(org?.industry ?? "");
  const initialIndustry = org?.industry ?? "";
  const [industryChoice, setIndustryChoice] = useState<string>(
    INDUSTRIES.includes(initialIndustry) ? initialIndustry : (initialIndustry ? "Other" : "")
  );
  const [industryOther, setIndustryOther] = useState<string>(
    INDUSTRIES.includes(initialIndustry) ? "" : initialIndustry
  );
  const [country, setCountry] = useState(org?.country ?? "");
  const [logoUrl, setLogoUrl] = useState<string>(org?.logo_url ?? "");
  const [logoBusy, setLogoBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const finalIndustry = industryChoice === "Other" ? industryOther.trim() : industryChoice;
      await save({ data: {
        name,
        industry: finalIndustry || null,
        country: country || null,
        logo_url: logoUrl.trim() ? logoUrl.trim() : null,
      } });
      await qc.invalidateQueries({ queryKey: ["my-org"] });
      setToast("Saved");
      setTimeout(() => setToast(null), 1500);
    } finally { setBusy(false); }
  }

  async function onLogoFile(file: File | null) {
    if (!file) return;
    setLogoBusy(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await uploadLogo({ data: { fileName: file.name, contentType: file.type as never, base64 } });
      setLogoUrl(res.logoUrl);
      await qc.invalidateQueries({ queryKey: ["my-org"] });
      setToast("Logo uploaded");
      setTimeout(() => setToast(null), 1500);
    } finally { setLogoBusy(false); }
  }

  if (!org) {
    return (
      <Card className="p-6 max-w-xl">
        <h2 className="font-display text-lg font-semibold">Organization profile</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
          Create your workspace first, then this page will hold your organization name, country, timezone, currency, and logo.
        </p>
        <Link to="/onboarding" className="mt-5 inline-flex h-9 items-center rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground">
          Continue setup
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-xl">
      <h2 className="font-display text-lg font-semibold">Organization profile</h2>
      <p className="mt-1 mb-6 text-[13px] text-ink-3">Slug: <code className="font-mono">{org.slug}</code></p>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Industry">
          <CustomSelect
            options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
            value={industryChoice}
            placeholder="Select an industry…"
            onChange={(val) => {
              setIndustryChoice(val);
              setIndustry(val === "Other" ? industryOther : val);
            }}
          />
          {industryChoice === "Other" && (
            <Input
              className="mt-2"
              value={industryOther}
              onChange={(e) => { setIndustryOther(e.target.value); setIndustry(e.target.value); }}
              placeholder="Enter your industry"
            />
          )}
        </Field>
        <Field label="Country">
          <CustomSelect
            searchable
            options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
            value={country ?? ""}
            placeholder="Select a country…"
            onChange={(val) => setCountry(val)}
          />
        </Field>
        <Field label="Company logo" hint="Upload PNG, JPG, WEBP, GIF or SVG. No URL is required.">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-line px-4 text-[13px] font-medium hover:bg-ink/[0.04]">
              {logoBusy ? "Uploading…" : "Choose logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="sr-only"
                disabled={logoBusy}
                onChange={(e) => onLogoFile(e.currentTarget.files?.[0] ?? null)}
              />
            </label>
            <span className="text-[12px] text-ink-3">The uploaded image becomes the workspace logo.</span>
          </div>
          {logoUrl && (
            <div className="mt-2 flex items-center gap-2 text-[12px] text-ink-3">
              <img src={logoUrl} alt="Logo preview" className="h-8 w-8 rounded object-cover border border-line" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              Preview
            </div>
          )}
        </Field>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
          {toast && <span className="text-[13px] text-emerald-700">{toast}</span>}
        </div>
      </form>
    </Card>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error ?? new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}
