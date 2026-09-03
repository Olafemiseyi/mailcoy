// Currency auto-detection utility for Mailcoy
// Automatically displays NGN (₦) for visitors in Nigeria and USD ($) for international visitors.

export type Currency = "USD" | "NGN";

export function detectUserCurrency(): Currency {
  if (typeof window === "undefined") return "USD";
  try {
    // 1. Check URL query override if present (?currency=NGN or ?currency=USD)
    const params = new URLSearchParams(window.location.search);
    const queryCur = params.get("currency")?.toUpperCase();
    if (queryCur === "NGN" || queryCur === "USD") return queryCur;

    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
    const languages = navigator.languages || [navigator.language || ""];

    // 2. Check timezone for Nigeria / West Africa
    if (
      tz.includes("lagos") ||
      tz.includes("nigeria") ||
      tz === "africa/lagos" ||
      tz === "africa/port_harcourt" ||
      tz === "africa/kano" ||
      tz === "africa/abuja"
    ) {
      return "NGN";
    }

    // 3. Check browser languages & locales for Nigeria
    const isNgLocale = languages.some((lang) => {
      const l = lang.toLowerCase();
      return (
        l === "en-ng" ||
        l.endsWith("-ng") ||
        l.startsWith("yo") || // Yoruba
        l.startsWith("ig") || // Igbo
        l.startsWith("ha") || // Hausa
        l.startsWith("pcm")   // Nigerian Pidgin
      );
    });

    if (isNgLocale) {
      return "NGN";
    }
  } catch (e) {
    console.error("Currency detection error:", e);
  }
  return "USD";
}

export interface PlanPricing {
  code: string;
  name: string;
  usdMonthly: number;
  usdYearly: number;
  usdDisplay: string;
  usdYearlyDisplay: string;
  ngnMonthlyKobo: number;
  ngnYearlyKobo: number;
  ngnDisplay: string;
  ngnYearlyDisplay: string;
  blurb: string;
  limits: {
    employees: number;
    domains: number;
    aliases: number;
    monthlyMessages: number;
  };
  features: {
    canUseAliases: boolean;
    canUseCatchAll: boolean;
    canUseCustomSignatures: boolean;
    canUseCustomTemplates: boolean;
  };
}

export const PRICING_PLANS: PlanPricing[] = [
  {
    code: "free",
    name: "Free",
    usdMonthly: 0,
    usdYearly: 0,
    usdDisplay: "$0",
    usdYearlyDisplay: "$0",
    ngnMonthlyKobo: 0,
    ngnYearlyKobo: 0,
    ngnDisplay: "₦0",
    ngnYearlyDisplay: "₦0",
    blurb: "1 business email, 1 domain, 50 monthly messages",
    limits: { employees: 1, domains: 1, aliases: 0, monthlyMessages: 50 },
    features: {
      canUseAliases: false,
      canUseCatchAll: false,
      canUseCustomSignatures: false,
      canUseCustomTemplates: false,
    },
  },
  {
    code: "starter",
    name: "Starter Pro",
    usdMonthly: 9,
    usdYearly: 90,
    usdDisplay: "$9",
    usdYearlyDisplay: "$90",
    ngnMonthlyKobo: 7_500_00,
    ngnYearlyKobo: 75_000_00,
    ngnDisplay: "₦7,500",
    ngnYearlyDisplay: "₦75,000",
    blurb: "Up to 5 employees, 2,000 emails/mo, 2 aliases/seat",
    limits: { employees: 5, domains: 1, aliases: 10, monthlyMessages: 2000 },
    features: {
      canUseAliases: true,
      canUseCatchAll: false,
      canUseCustomSignatures: true,
      canUseCustomTemplates: true,
    },
  },
  {
    code: "growth",
    name: "Growth",
    usdMonthly: 29,
    usdYearly: 290,
    usdDisplay: "$29",
    usdYearlyDisplay: "$290",
    ngnMonthlyKobo: 20_000_00,
    ngnYearlyKobo: 200_000_00,
    ngnDisplay: "₦20,000",
    ngnYearlyDisplay: "₦200,000",
    blurb: "Up to 20 employees, 10,000 emails/mo, Catch-All",
    limits: { employees: 20, domains: 3, aliases: 30, monthlyMessages: 10000 },
    features: {
      canUseAliases: true,
      canUseCatchAll: true,
      canUseCustomSignatures: true,
      canUseCustomTemplates: true,
    },
  },
  {
    code: "scale",
    name: "Scale",
    usdMonthly: 79,
    usdYearly: 790,
    usdDisplay: "$79",
    usdYearlyDisplay: "$790",
    ngnMonthlyKobo: 50_000_00,
    ngnYearlyKobo: 500_000_00,
    ngnDisplay: "₦50,000",
    ngnYearlyDisplay: "₦500,000",
    blurb: "Up to 50 inboxes, 50,000 emails/mo, API & Webhooks",
    limits: { employees: 50, domains: 10, aliases: Infinity, monthlyMessages: 50000 },
    features: {
      canUseAliases: true,
      canUseCatchAll: true,
      canUseCustomSignatures: true,
      canUseCustomTemplates: true,
    },
  },
];
