import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RouteTransition } from "@/components/route-transition";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shwash.co"),
  title: {
    default: "SHWASH Mobile Car Detailing",
    template: "%s | SHWASH",
  },
  description:
    "Professional mobile car detailing at home, work, or wherever your car is parked. Explore services, transparent pricing, and booking preparation.",
  openGraph: {
    title: "SHWASH Mobile Car Detailing",
    description: "A professional detail, brought to your door.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <RouteTransition>
          <SiteHeader />
          {children}
          <SiteFooter />
        </RouteTransition>
      </body>
    </html>
  );
}
