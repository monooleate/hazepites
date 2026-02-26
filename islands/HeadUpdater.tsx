import { useEffect } from "preact/hooks";

interface Heading {
  id: string;
  html: string;
  level: number;
}

interface HeadUpdaterProps {
  title: string;
  description: string;
  canonical: string;
  schemas: Record<string, string>;
  headings: Heading[];
}

const SCHEMA_IDS = ["Article", "FAQ", "HowTo", "Software", "Main", "BreadCrumb"];

// ── CSS class constants for sidebar/header active state toggling ──
const SIDEBAR_LINK_ACTIVE =
  "flex items-center gap-2 py-1.5 px-3 text-[13px] rounded-lg transition-all duration-150 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/40 font-medium";
const SIDEBAR_LINK_INACTIVE =
  "flex items-center gap-2 py-1.5 px-3 text-[13px] rounded-lg transition-all duration-150 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50";
const SIDEBAR_ICON_ACTIVE = "w-3.5 h-3.5 shrink-0 text-primary-500 dark:text-primary-400";
const SIDEBAR_ICON_INACTIVE = "w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500";
const SUMMARY_ACTIVE =
  "flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden transition-colors text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/30";
const SUMMARY_INACTIVE =
  "flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50";
const HEADER_NAV_ACTIVE =
  "px-3 py-2 text-sm font-medium rounded-lg transition-colors text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50";
const HEADER_NAV_INACTIVE =
  "px-3 py-2 text-sm font-medium rounded-lg transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800";

// ═══════════════════════════════════════════════════════════════
// Module-level state — persists across HeadUpdater re-creations
// (Fresh Partial swap destroys + recreates islands)
// ═══════════════════════════════════════════════════════════════
let _prevPath: string | null = null;
let _popstateFlag = false;
let _listenersRegistered = false;

/**
 * Register global listeners once (survives component re-mounts).
 * - Click capture: saves scrollY BEFORE Fresh starts the Partial fetch
 * - Popstate: saves scrollY for the leaving page + sets back/forward flag
 */
function ensureGlobalListeners() {
  if (_listenersRegistered) return;
  _listenersRegistered = true;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // ── Save scroll on link click (capture phase — runs BEFORE Fresh) ──
  document.addEventListener(
    "click",
    (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href");
      // Skip anchors, external, mailto, tel
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      // Skip links that opt out of client-nav
      if (link.closest("[f-client-nav=\"false\"]")) return;
      // Save current scroll for current path
      try {
        sessionStorage.setItem(`scroll:${location.pathname}`, String(window.scrollY));
      } catch { /* quota exceeded */ }
    },
    true, // capture phase!
  );

  // ── Popstate: save leaving page's scroll + flag ──
  window.addEventListener("popstate", () => {
    // _prevPath still holds the page we're leaving (location already changed)
    if (_prevPath) {
      try {
        sessionStorage.setItem(`scroll:${_prevPath}`, String(window.scrollY));
      } catch { /* quota exceeded */ }
    }
    _popstateFlag = true;
  });
}

export default function HeadUpdater({ title, description, canonical, schemas, headings }: HeadUpdaterProps) {
  // Mount: register global listeners + set initial path
  useEffect(() => {
    ensureGlobalListeners();
    if (_prevPath === null) {
      _prevPath = location.pathname;
    }
  }, []);

  // Update on every prop change (= every Partial swap or initial render)
  useEffect(() => {
    const currentPath = location.pathname;
    const isNavigation = _prevPath !== null && _prevPath !== currentPath;

    // ── Scroll kezelés ──
    if (isNavigation) {
      if (_popstateFlag) {
        // Back/forward → restore saved position
        const saved = sessionStorage.getItem(`scroll:${currentPath}`);
        if (saved) {
          // Double rAF: ensure DOM has laid out after Partial swap
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo(0, parseInt(saved));
            });
          });
        }
        _popstateFlag = false;
      } else {
        // Forward navigation → scroll to top
        window.scrollTo(0, 0);
      }

      // ── Close mobile sidebar + TOC dropdown ──
      const sidebarToggle = document.getElementById("docs_sidebar") as HTMLInputElement | null;
      if (sidebarToggle?.checked) {
        sidebarToggle.checked = false;
      }
      const tocToggle = document.getElementById("header-toc-toggle") as HTMLInputElement | null;
      if (tocToggle?.checked) {
        tocToggle.checked = false;
      }

      _prevPath = currentPath;
    } else if (_prevPath === null) {
      // First ever render
      _prevPath = currentPath;
    }

    // ── Title ──
    if (document.title !== title) {
      document.title = title;
    }

    // ── Meta description ──
    const descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (descMeta) {
      descMeta.content = description;
    } else if (description) {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // ── OG metas ──
    updateMetaProperty("og:title", title);
    updateMetaProperty("og:description", description);
    updateMetaProperty("og:url", canonical);

    // ── Canonical ──
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalLink) {
      canonicalLink.href = canonical;
    } else if (canonical) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonical;
      document.head.appendChild(link);
    }

    // ── JSON-LD schemas ──
    for (const id of SCHEMA_IDS) {
      const existing = document.getElementById(id);
      if (schemas[id]) {
        if (existing) {
          existing.textContent = schemas[id];
        } else {
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.id = id;
          script.textContent = schemas[id];
          document.head.appendChild(script);
        }
      } else {
        if (existing) {
          existing.remove();
        }
      }
    }

    // ── Navigation active state ──
    updateNavigation(canonical);

    // ── Mobile TOC panel ──
    updateTocPanel(headings);
  }, [title, description, canonical, schemas, headings]);

  return null;
}

// ═══════════════════════════════════════════════════════════════
// DOM update helpers
// ═══════════════════════════════════════════════════════════════

/**
 * Update the mobile TOC dropdown in the header.
 * Shows/hides the wrapper and rebuilds panel content.
 */
function updateTocPanel(headings: Heading[]) {
  const wrapper = document.getElementById("header-toc-wrapper");
  const panel = document.getElementById("header-toc-panel");

  if (!wrapper) return;

  if (!headings || headings.length === 0) {
    wrapper.hidden = true;
    return;
  }

  wrapper.hidden = false;

  if (!panel) return;

  // Rebuild panel content
  let html =
    '<div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-2">Tartalomjegyzék</div>';
  for (const h of headings) {
    const paddingClass = h.level === 3 ? " pl-6" : h.level === 4 ? " pl-9" : "";
    const safeId = h.id.replace(/"/g, "&quot;");
    html += `<a href="#${safeId}" class="block py-1.5 px-3 text-sm rounded-lg truncate text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors${paddingClass}">${h.html}</a>`;
  }
  panel.innerHTML = html;
}

/**
 * Update sidebar and header nav active states based on the current canonical URL.
 */
function updateNavigation(canonical: string) {
  let pathname: string;
  try {
    pathname = new URL(canonical).pathname;
  } catch {
    pathname = canonical;
  }

  // ── 1. Sidebar entry links ──
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>("[data-sidebar-entry]");
  sidebarLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isActive = href === pathname || (href.length > 1 && pathname.includes(href) && href.split("/").length > 2);

    link.className = isActive ? SIDEBAR_LINK_ACTIVE : SIDEBAR_LINK_INACTIVE;

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

    const svg = link.querySelector("svg");
    if (svg) {
      svg.setAttribute("class", isActive ? SIDEBAR_ICON_ACTIVE : SIDEBAR_ICON_INACTIVE);
    }
  });

  // ── 2. Sidebar category <details> + <summary> ──
  const catDetails = document.querySelectorAll<HTMLDetailsElement>("[data-sidebar-cat]");
  catDetails.forEach((details) => {
    const hasActiveLink = details.querySelector("[aria-current='page']") !== null;
    const summary = details.querySelector("summary");

    if (hasActiveLink) {
      details.open = true;
      if (summary) summary.className = SUMMARY_ACTIVE;
    } else {
      if (summary) summary.className = SUMMARY_INACTIVE;
    }
  });

  // ── 3. Header nav links ──
  const firstSegment = "/" + pathname.split("/").filter(Boolean)[0];
  const headerLinks = document.querySelectorAll<HTMLAnchorElement>("[data-header-nav]");
  headerLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isActive = href === firstSegment;
    link.className = isActive ? HEADER_NAV_ACTIVE : HEADER_NAV_INACTIVE;
  });
}

function updateMetaProperty(property: string, content: string) {
  const meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (meta) {
    meta.content = content;
  } else if (content) {
    const el = document.createElement("meta");
    el.setAttribute("property", property);
    el.content = content;
    document.head.appendChild(el);
  }
}
