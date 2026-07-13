/**
 * ErdeirekaBanner — STATIKUS (0 JS) house-ad banner az erdeireka.hu-hoz.
 *
 * A kreatív KÉP-elsődleges, szöveges fallbackkel (lásd ErdeirekaCreativeBox):
 * ha a `creative.img` létezik, képet renderel; ha nincs, a `headline`/`subline`/
 * `cta` + márkaszínekből generált szöveges bannert. (A user által választott
 * "Kép + szöveges fallback" mód.)
 *
 * Reszponzív: ha `creativeMobile` is meg van adva, desktopon a fő kreatív,
 * mobilon a `creativeMobile` jelenik meg (md breakpoint).
 *
 * Ezt a komponenst használja a sidebar (TOC alatt), a cikk-közép és — az
 * `ErdeirekaInArticle` kereten keresztül — a cikk vége is. A site-wide anchor
 * és a popup külön island (kell hozzá kliens-logika: dismiss, freq-cap).
 *
 * Minden link: `target="_blank" rel="sponsored noopener"` + UTM (erdeirekaHref).
 */

import ErdeirekaCreativeBox from "./ErdeirekaCreativeBox.tsx";
import { type ErdeirekaCreative, erdeirekaHref } from "../../data/erdeireka-ads.ts";

interface ErdeirekaBannerProps {
  /** A megjelenítendő kreatív (desktop / alapértelmezett). */
  creative: ErdeirekaCreative;
  /** Opcionális mobil-kreatív — ha van, md alatt ez jelenik meg. */
  creativeMobile?: ErdeirekaCreative;
  /** Kattintási cél-URL (UTM nélkül). */
  targetUrl: string;
  /** Placement-azonosító (utm_content + analytics), pl. "sidebar". */
  source: string;
  /** "Hirdetés" címke a banner fölött (AdSense-szerű disclosure). */
  label?: boolean;
  /** Extra class a külső wrapper-en. */
  className?: string;
}

export default function ErdeirekaBanner({
  creative,
  creativeMobile,
  targetUrl,
  source,
  label = false,
  className = "",
}: ErdeirekaBannerProps) {
  const href = erdeirekaHref(targetUrl, source, creative.campaign);

  return (
    <div class={`flex flex-col items-center ${className}`}>
      {label && (
        <div class="self-start text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
          Hirdetés
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener"
        f-client-nav={false}
        aria-label={creative.alt}
        class="block transition hover:opacity-95 hover:scale-[1.01]"
      >
        {creativeMobile
          ? (
            <>
              <div class="hidden md:block">
                <ErdeirekaCreativeBox creative={creative} />
              </div>
              <div class="md:hidden">
                <ErdeirekaCreativeBox creative={creativeMobile} />
              </div>
            </>
          )
          : <ErdeirekaCreativeBox creative={creative} />}
      </a>
    </div>
  );
}
