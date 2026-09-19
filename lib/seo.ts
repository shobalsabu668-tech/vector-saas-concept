import { author, getSiteUrl, site } from "./site";

/**
 * Structured data describes this site as what it is — a concept website
 * (CreativeWork) by a named developer — not as a SoftwareApplication. Marking up a
 * fictional product as a real one would put software that doesn't exist into
 * search results.
 */
export function conceptJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: `${site.name} — concept website`,
        description: site.description,
        inLanguage: "en-IN",
        creator: { "@id": `${url}/#author` },
      },
      {
        "@type": "CreativeWork",
        name: `${site.name}: a self-initiated concept website`,
        description: site.description,
        url,
        genre: "Concept SaaS website",
        creator: { "@id": `${url}/#author` },
      },
      {
        "@type": "Person",
        "@id": `${url}/#author`,
        name: author.name,
        jobTitle: author.role,
        url: author.portfolio,
      },
    ],
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
