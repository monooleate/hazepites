import toc from "../content/toc.ts";

export interface TableOfContentsEntry {
  slug: string;
  title: string;
  category?: string;
  href: string;
  file: string;
  hidden?: boolean;
}

export interface TableOfContentsCategory {
  slug: string;
  title: string;
  href: string;
  entries: Array<TableOfContentsCategory | TableOfContentsEntry>;
}

interface RawTableOfContentsEntry {
  title: string;
  link?: string;
  pages?: Array<
    | [type: "page", id: string, title: string]
    | [type: "page", id: string, title: string, hidden: boolean]
    | [type: "subcategory", key: string]
  >;
  subcategories?: Record<string, RawTableOfContentsEntry>;
}

export const TABLE_OF_CONTENTS: Record<string, TableOfContentsEntry> = {};
export const CATEGORIES: TableOfContentsCategory[] = [];

function processEntry(
  parentSlug: string,
  entry: RawTableOfContentsEntry,
  category: TableOfContentsCategory,
) {
  entry.pages?.forEach((item) => {
    if (item[0] === "page") {
      const [_, id, title, hidden = false] = item;
      const slug = `${parentSlug}/${id}`;
      const href = `/${slug}`;
      // .md és .mdx is kereshető — a route handler dönti el
      const file = `content/${parentSlug}/${id}`;

      if (!hidden) {
        category.entries.push({ title, href, slug, file, category: parentSlug, hidden });
      }

      TABLE_OF_CONTENTS[slug] = {
        slug,
        title,
        category: parentSlug,
        href,
        file,
        hidden,
      };
    } else if (item[0] === "subcategory") {
      const [_, key] = item;
      const subEntry = entry.subcategories?.[key];
      if (subEntry) {
        const subCategorySlug = `${parentSlug}/${key}`;
        const subCategoryHref = `/${subCategorySlug}`;
        const subCategoryFile = `content/${parentSlug}/${key}/index`;

        const subCategory: TableOfContentsCategory = {
          slug: subCategorySlug,
          title: subEntry.title,
          href: subCategoryHref,
          entries: [],
        };

        category.entries.push(subCategory);
        TABLE_OF_CONTENTS[subCategorySlug] = {
          slug: subCategorySlug,
          title: subEntry.title,
          category: parentSlug,
          href: subCategoryHref,
          file: subCategoryFile,
        };

        processEntry(subCategorySlug, subEntry, subCategory);
      }
    }
  });
}

// Process main categories
for (const parent in toc.content) {
  const rawEntry = toc.content[parent];

  const category: TableOfContentsCategory = {
    slug: parent,
    title: rawEntry.title,
    href: `/${parent}`,
    entries: [],
  };

  processEntry(parent, rawEntry, category);
  CATEGORIES.push(category);
}

export function getFirstPageUrl() {
  for (const slug in TABLE_OF_CONTENTS) {
    return TABLE_OF_CONTENTS[slug].href;
  }
  throw new Error("Could not find any pages in TABLE_OF_CONTENTS");
}
