// utils/schema.ts — Házépítési Kalauz schema generálás

const BASE_URL = "https://hazepitesikalauz.hu";

export function generateFullSchema() {
  const org: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "Házépítési Kalauz",
    "alternateName": "HazepitesiKalauz",
    "url": BASE_URL,
    "description":
      "A Házépítési Kalauz független döntéstámogató tudástár családok számára, akik házépítésre készülnek. Objektív összehasonlítások, költségkalkulátorok és szakértői útmutatók.",
    "foundingDate": "2025",
    "founder": { "@type": "Person", "name": "Mészáros János" },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "support",
      "email": "info@hazepitesikalauz.hu",
      "availableLanguage": ["hu"],
    },
  };

  const website: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "name": "Házépítési Kalauz",
    "url": `${BASE_URL}/`,
    "inLanguage": "hu",
    "publisher": { "@id": `${BASE_URL}/#organization` },
  };

  const webpage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    "url": `${BASE_URL}/`,
    "inLanguage": "hu",
    "about": { "@id": `${BASE_URL}/#organization` },
    "publisher": { "@id": `${BASE_URL}/#organization` },
    "name": "Házépítési Kalauz | Független útmutató házépítőknek",
    "description":
      "Készülsz házat építeni? A Házépítési Kalauz objektív összehasonlításokkal, költségkalkulátorokkal és szakértői útmutatókkal segít a legjobb döntés meghozatalában.",
  };

  const bread: Record<string, unknown> = {
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}/#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Főoldal",
        "item": BASE_URL,
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [org, website, webpage, bread],
  };
}

export function generateBreadcrumbSchema(
  slug: string,
  tocLookup: Record<string, { title: string }>,
) {
  const parts = slug.split("/");

  const items = [
    {
      "@type": "ListItem" as const,
      "position": 1,
      "name": "Főoldal",
      "item": BASE_URL,
    },
  ];

  let currentPath = "";
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    const tocEntry = tocLookup[currentPath.slice(1)];
    const name = tocEntry?.title || formatBreadcrumbName(part);

    items.push({
      "@type": "ListItem" as const,
      "position": index + 2,
      "name": name,
      "item": `${BASE_URL}${currentPath}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items,
  };
}

function formatBreadcrumbName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
