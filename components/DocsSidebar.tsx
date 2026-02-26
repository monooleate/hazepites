import type {
  TableOfContentsCategory,
  TableOfContentsEntry,
} from "../data/docs.ts";

const CATEGORY_ICONS: Record<string, string> = {
  "Alapok": "M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  "Háztípusok": "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  "Háztípus összehasonlítások": "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  "Költségek": "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "Támogatások és finanszírozás": "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  "Energia és üzemeltetés": "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  "Tervezés": "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
  "Jog és adminisztráció": "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z",
  "Kivitelezés és szakemberek": "M11.42 15.17l-5.648-3.014m0 0a2.25 2.25 0 01-2.36-3.516l5.507-2.937a2.25 2.25 0 012.467.096l6.174 4.29a2.25 2.25 0 01.434 3.334l-5.134 6.16a2.25 2.25 0 01-3.148.272l-4.292-3.652z",
  "Telek és helyszín": "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
  "Gyakori kérdések": "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
  "Eszközök": "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z",
};

// Kis ikon az egyes oldalakhoz (entry szintű)
const ENTRY_ICON = "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z";

// Áttekintés ikon (list bullets)
const OVERVIEW_ICON = "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z";

function getPathname(url: string): string {
  try { return new URL(url).pathname; }
  catch { return url; }
}

export function SidebarCategory(props: {
  category: TableOfContentsCategory;
  url: string;
}) {
  const { category, url } = props;
  const pathname = getPathname(url);
  const icon = CATEGORY_ICONS[category.title];

  // Category overview link active state (exact match)
  const isOverviewActive = category.href ? pathname === category.href : false;

  const hasActiveChild = isOverviewActive || category.entries.some((entry) => {
    if ("entries" in entry) return false;
    return url.includes((entry as TableOfContentsEntry).href);
  });

  return (
    <details class="mb-1 group/cat" open={hasActiveChild || undefined} data-sidebar-cat>
      <summary class={[
        "flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden transition-colors",
        hasActiveChild
          ? "text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/30"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50",
      ].join(" ")}>
        {/* Chevron */}
        <svg
          class="w-3 h-3 shrink-0 transition-transform group-open/cat:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        {icon && (
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d={icon} />
          </svg>
        )}
        <span class="truncate">{category.title}</span>
      </summary>

      <ul class="mt-0.5 space-y-0.5 pl-2 pb-1">
        {/* Category overview link — "Áttekintés" */}
        {category.href && (
          <li>
            <a
              href={category.href}
              class={[
                "flex items-center gap-2 py-1.5 px-3 text-[13px] rounded-lg transition-all duration-150",
                isOverviewActive
                  ? "text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/40 font-medium"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50",
              ].join(" ")}
              aria-current={isOverviewActive ? "page" : undefined}
              data-sidebar-entry
            >
              <svg class={[
                "w-3.5 h-3.5 shrink-0",
                isOverviewActive ? "text-primary-500 dark:text-primary-400" : "text-slate-400 dark:text-slate-500",
              ].join(" ")} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d={OVERVIEW_ICON} />
              </svg>
              <span class="truncate">Áttekintés</span>
            </a>
          </li>
        )}

        {category.entries.map((entry) => {
          if ("entries" in entry) {
            return (
              <li key={(entry as TableOfContentsCategory).href}>
                <SidebarCategory
                  category={entry as TableOfContentsCategory}
                  url={url}
                />
              </li>
            );
          }
          const e = entry as TableOfContentsEntry;
          const isActive = url.includes(e.href);
          return (
            <li key={e.href}>
              <a
                href={e.href}
                class={[
                  "flex items-center gap-2 py-1.5 px-3 text-[13px] rounded-lg transition-all duration-150",
                  isActive
                    ? "text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/40 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
                data-sidebar-entry
              >
                <svg class={[
                  "w-3.5 h-3.5 shrink-0",
                  isActive ? "text-primary-500 dark:text-primary-400" : "text-slate-400 dark:text-slate-500",
                ].join(" ")} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d={ENTRY_ICON} />
                </svg>
                <span class="truncate">{e.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
