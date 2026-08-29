import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { GlobalError } from "@/components/GlobalError";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mailcoy — Professional Business Email Operating System for Gmail" },
      {
        name: "description",
        content:
          "Mailcoy connects your custom domain to your team's existing Gmail inboxes with automated SPF/DKIM verification, Google OAuth 2.0 security, centralized HTML signatures, and flat team billing saving up to 80% vs Google Workspace.",
      },
      { name: "author", content: "Mailcoy Technologies" },
      {
        name: "keywords",
        content:
          "business email, custom domain email, gmail send as, google workspace alternative, email routing proxy, SPF DKIM DMARC, zero workspace markup, team email identity",
      },
      { property: "og:title", content: "Mailcoy — Professional Business Email via Gmail" },
      {
        property: "og:description",
        content:
          "Keep your familiar Gmail workflow while sending and receiving from your verified custom domain. Save 80%+ with zero seat markup.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mailcoy.com" },
      { property: "og:site_name", content: "Mailcoy" },
      { property: "og:image", content: "https://mailcoy.com/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://mailcoy.com/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Mailcoy — Professional Business Email Operating System for Gmail" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@mailcoy" },
      { name: "twitter:title", content: "Mailcoy — Business Email via Gmail" },
      {
        name: "twitter:description",
        content: "Professional custom domain email without Google Workspace per-seat markup.",
      },
      { name: "twitter:image", content: "https://mailcoy.com/og-image.jpg" },
      { name: "twitter:image:alt", content: "Mailcoy — Professional Business Email Operating System for Gmail" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Mailcoy",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web, Cloud, iOS, Android (via Gmail)",
          description:
            "Mailcoy is an intelligent email identity and domain routing platform that allows businesses to send and receive verified custom domain emails directly inside their existing Gmail inboxes without paying per-seat Google Workspace licenses.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "PriceSpecification",
              description: "Free tier with 1 custom domain and 1 team inbox, plus flat-rate team plans from $9/month.",
            },
          },
          featureList: [
            "Custom Domain Email Verification (SPF, DKIM, DMARC)",
            "Native Gmail Send-As Integration via Google OAuth 2.0",
            "Centralized HTML Team Signatures",
            "Broadcast and Round-Robin Shared Inboxes",
            "1-Click Offboarding Deliverability Shield",
            "Sub-200ms Inbound Edge Routing",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: GlobalError,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    import("@/integrations/supabase/client").then(({ supabase }) => {
      if (!mounted) return;
      const { data: sub } = supabase.auth.onAuthStateChange((event) => {
        if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      });
      // store on window for cleanup on unmount
      (window as unknown as { __authSub?: { unsubscribe: () => void } }).__authSub =
        sub.subscription;
    });
    return () => {
      mounted = false;
      const w = window as unknown as { __authSub?: { unsubscribe: () => void } };
      w.__authSub?.unsubscribe();
    };
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

