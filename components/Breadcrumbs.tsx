import { CATEGORIES } from "../data/docs.ts";

interface BreadcrumbProps {
  slug: string;
}

export default function Breadcrumbs({ slug }: BreadcrumbProps) {
  const parts = slug.split("/").filter(Boolean);
  const categorySlug = parts[0];

  // Find category title from CATEGORIES
  const category = CATEGORIES.find((cat) =>
    cat.entries.some((entry) => {
      if ("entries" in entry) return false;
      return ("slug" in entry) && (entry as { slug: string }).slug.startsWith(categorySlug + "/");
    })
  );

  const categoryTitle = category?.title ??
    categorySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
      <a href="/" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </a>
      <svg class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
      <span class="text-slate-600 dark:text-slate-400 font-medium">{categoryTitle}</span>
    </nav>
  );
}
