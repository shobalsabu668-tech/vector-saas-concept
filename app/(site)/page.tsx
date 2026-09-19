import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { Integrations } from "@/components/home/integrations";
import { Closing } from "@/components/home/closing";
import { conceptJsonLd, jsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <HowItWorks />
      <Features />
      <Integrations />
      <Closing />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(conceptJsonLd()) }} />
    </main>
  );
}
