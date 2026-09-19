import type { Metadata, Viewport } from "next";
import { Mona_Sans, Martian_Mono } from "next/font/google";
import { author, getSiteUrl, site } from "@/lib/site";
import { ConceptBar } from "@/components/layout/concept-bar";
import "./globals.css";

const mona = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-mona", display: "swap" });
const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", display: "swap" });

const title = `${site.name} — ${site.tagline} (concept)`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: author.name, url: author.portfolio }],
  creator: author.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: site.name, title, description: site.description, locale: "en_IN" },
  twitter: { card: "summary_large_image", title, description: site.description },
  // A fictional product shouldn't appear in software searches: crawlable, not indexed.
  robots: { index: false, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0d12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${mona.variable} ${martian.variable}`} suppressHydrationWarning>
      <body className="flex min-h-[100svh] flex-col">
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a href="#main" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-mint px-4 py-3 font-[600] text-mint-ink transition-transform focus:translate-y-0">
          Skip to content
        </a>
        <ConceptBar />
        {children}
      </body>
    </html>
  );
}
