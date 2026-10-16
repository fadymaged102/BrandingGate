import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Alexandria, Geist_Mono, Work_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Constellation, SiteMotion } from "@/components/Constellation";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.brandinggate.com"),
  title: {
    default: "Branding Gate",
    template: "%s | Branding Gate",
  },
  description:
    "Branding Gate is a 360 agency in Cairo, founded in 2018: event management, media production, digital marketing, 3D design, giveaways and web development.",
  icons: { icon: "/brand/logo.png" },
  openGraph: {
    siteName: "Branding Gate",
    type: "website",
    images: ["/work/hero-poster.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#050a24",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${alexandria.variable} ${workSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh">
        <div id="atmosphere" aria-hidden className="atmosphere-layer" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <SiteMotion>
            {/* One backdrop for every page, behind the content. */}
            <Constellation />
            <Suspense fallback={<div className="h-[var(--header-h)]" aria-hidden />}>
              <SiteHeader />
            </Suspense>
            <main id="main">{children}</main>
            <SiteFooter />
          </SiteMotion>
        </SmoothScroll>
      </body>
    </html>
  );
}
