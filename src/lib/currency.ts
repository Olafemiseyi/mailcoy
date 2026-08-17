// Currency auto-detection utility for Mailcoy
// Automatically displays NGN (₦) for visitors in Nigeria and USD ($) for international visitors.

export type Currency = "USD" | "NGN";

export function detectUserCurrency(): Currency {
  if (typeof window === "undefined") return "USD";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const languages = navigator.languages || [navigator.language || ""];

    // Check timezone for Nigeria
    if (tz.toLowerCase().includes("lagos") || tz.toLowerCase().includes("nigeria")) {
      return "NGN";
    }

    // Check browser languages for NG locale
    const isNgLocale = languages.some(
      (lang) => lang.toLowerCase() === "en-ng" || lang.toLowerCase().endsWith("-ng") || lang.toLowerCase() === "ng"
    );
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
  limits: { employees: number; domains: number };
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
    blurb: "Up to 1 employee inbox, 1 domain",
    limits: { employees: 1, domains: 1 },
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
    blurb: "Up to 5 employee inboxes, 1 domain",
    limits: { employees: 5, domains: 1 },
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
    blurb: "Up to 20 employee inboxes, 3 domains",
    limits: { employees: 20, domains: 3 },
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
    blurb: "Up to 50 employee inboxes, 10 domains",
    limits: { employees: 50, domains: 10 },
  },
];
