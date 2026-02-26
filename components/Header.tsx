import ThemeToggle from "../islands/ThemeToggle.tsx";

interface HeaderProps {
  active?: string;
  showNav?: boolean;
  /** Ha true, megjelenik a sidebar toggle gomb (mobil + tablet) */
  showSidebarToggle?: boolean;
  /** TOC headings — ha van, megjelenik a TOC gomb a headerben (csak mobilon) */
  headings?: { id: string; html: string; level: number }[];
}

const NAV_ITEMS = [
  { name: "Alapok", href: "/alapok" },
  { name: "Háztípusok", href: "/haztipusok" },
  { name: "Költségek", href: "/koltsegek" },
  { name: "Támogatások", href: "/tamogatasok" },
  { name: "Energia", href: "/energia" },
  { name: "Eszközök", href: "/eszkozok" },
];

export default function Header({ active, showNav = true, showSidebarToggle = false, headings }: HeaderProps) {
  const hasToc = headings && headings.length > 0;

  return (
    <header class="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Left side: logo + sidebar toggle (mobile) */}
          <div class="flex items-center gap-2">
            {/* Logo — full page navigation (nem Partial) */}
            <a href="/" class="flex items-center gap-3 shrink-0 group" aria-label="Főoldal" f-client-nav={false}>
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              {/* Text hidden below md when sidebar toggle is present (docs pages) */}
              <div class={showSidebarToggle ? "hidden sm:flex flex-col" : "flex flex-col"}>
                <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Házépítési<span class="text-primary-600 dark:text-primary-400"> Kalauz</span>
                </span>
              </div>
            </a>

            {/* Sidebar toggle — visible below lg, after logo icon */}
            {showSidebarToggle && (
              <label
                for="docs_sidebar"
                class="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Navigáció megnyitása"
                title="Navigáció"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              </label>
            )}
          </div>

          {/* Desktop nav — visible on lg+ */}
          {showNav && (
            <nav class="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                // Active: current page's first URL segment matches the nav item href
                const activeSegment = active ? "/" + active.split("/")[0] : "";
                const isActive = activeSegment === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    data-header-nav
                    class={[
                      "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                    ].join(" ")}
                  >
                    {item.name}
                  </a>
                );
              })}
            </nav>
          )}

          {/* Right side controls */}
          <div class="flex items-center gap-1.5">
            {/*
              TOC button — mobile/tablet only (xl:hidden), always in DOM for HeadUpdater.
              `hidden` attribute hides it when there are no headings (SSR).
              HeadUpdater toggles `hidden` + rebuilds panel content on Partial nav.
            */}
            <div class="relative xl:hidden" id="header-toc-wrapper" hidden={!hasToc || undefined}>
              <input type="checkbox" id="header-toc-toggle" class="hidden peer" />
              <label
                for="header-toc-toggle"
                class="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Tartalomjegyzék"
                title="Tartalomjegyzék"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </label>
              {/* TOC dropdown panel — content rebuilt by HeadUpdater on Partial nav */}
              <div class="absolute right-0 top-12 z-50 w-72 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-3 hidden peer-checked:block" id="header-toc-panel">
                <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-2">
                  Tartalomjegyzék
                </div>
                {headings?.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    class={`block py-1.5 px-3 text-sm rounded-lg truncate text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      h.level === 3 ? "pl-6" : h.level === 4 ? "pl-9" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: h.html }}
                  />
                ))}
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
