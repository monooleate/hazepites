/**
 * ErdeirekaAnchor — site-wide tapadó (anchor) house-ad banner az erdeireka.hu-hoz,
 * AdSense "anchor ad" mintára. Felül VAGY alul úszik be.
 *
 * ÖSSZECSUKHATÓ (nem eltűnő): a nyílra kattintva a banner ki-/lekúszik és egy
 * kis "Hirdetés ▼" fül marad az él közepén; a fülre kattintva visszanyílik.
 * Az állapotot (nyitva/csukva) `sessionStorage` őrzi POZÍCIÓNKÉNT, ezért:
 *   - ha összecsukod, MINDEN oldalon csukva marad (nem ugrik fel újra),
 *   - ha nyitva hagyod, nyitva marad — és az újra-megjelenéskor NEM animál
 *     (a becsúszó animáció csak a munkamenet első megjelenésekor / kézi
 *     nyitáskor fut), így nincs zavaró "minden oldalon újra felkúszik" hatás.
 *
 * Helyfoglalás (CLS-barát, nem takar tartalmat): nyitott állapotban a banner
 * valós magasságát megmérve a tartalmat lejjebb tolja (top: body padding-top +
 * a viewport-tetejéhez pinelt elemek — köztük a docs-fejléc `lg:fixed top-0` —
 * eltolása; bottom: body padding-bottom). Csukott állapotban (kis fül) NINCS
 * helyfoglalás. Az eltolást injektált <style> végzi, amit összecsukáskor/
 * unmountkor törlünk.
 */

import { useEffect, useRef, useState } from "preact/hooks";
import ErdeirekaCreativeBox from "../../components/erdeireka/ErdeirekaCreativeBox.tsx";
import { type ErdeirekaCreative, erdeirekaHref } from "../../data/erdeireka-ads.ts";
import {
  trackErdeirekaClick,
  trackErdeirekaDismiss,
  trackErdeirekaImpression,
} from "../../utils/analytics.ts";

interface ErdeirekaAnchorProps {
  position: "top" | "bottom";
  /** Desktop kreatív (leaderboard). */
  creative: ErdeirekaCreative;
  /** Mobil kreatív (mobile-banner). */
  creativeMobile: ErdeirekaCreative;
  targetUrl: string;
  source: string;
  /** Késleltetett megjelenés (ms). SSOT: data/erdeireka-config.json. */
  showDelayMs?: number;
}

const SLIDE_MS = 300;

export default function ErdeirekaAnchor({
  position,
  creative,
  creativeMobile,
  targetUrl,
  source,
  showDelayMs = 1200,
}: ErdeirekaAnchorProps) {
  const isTop = position === "top";
  const collapsedKey = `hk-erd-anchor-${position}-collapsed`;
  const seenKey = `hk-erd-anchor-${position}-seen`;
  const styleId = `hk-erd-anchor-${position}-style`;

  const [ready, setReady] = useState(false); // kliens-oldali init lezajlott (SSR-guard)
  const [collapsed, setCollapsed] = useState(false); // kis fül vs teljes banner
  const [bannerIn, setBannerIn] = useState(false); // teljes banner a DOM-ban + helyfoglalás
  const [slideIn, setSlideIn] = useState(false); // becsúszó animáció (translate-0)
  const barRef = useRef<HTMLDivElement>(null);
  const impressionSent = useRef(false);

  // ── Kliens-oldali init: állapot a sessionStorage-ból ──
  useEffect(() => {
    let isCollapsed = false;
    let seen = false;
    try {
      isCollapsed = sessionStorage.getItem(collapsedKey) === "1";
      seen = sessionStorage.getItem(seenKey) === "1";
    } catch {
      // privát mód — default: nyitva
    }
    setReady(true);
    if (isCollapsed) {
      setCollapsed(true);
      return;
    }
    if (seen) {
      // már láttuk ebben a session-ben → azonnal, animáció NÉLKÜL
      setBannerIn(true);
      setSlideIn(true);
    } else {
      const t = setTimeout(() => {
        try {
          sessionStorage.setItem(seenKey, "1");
        } catch { /* */ }
        setBannerIn(true); // slideIn=false → becsúszik
      }, showDelayMs);
      return () => clearTimeout(t);
    }
  }, []);

  // ── bannerIn → helyfoglalás + becsúszás + impresszió ──
  useEffect(() => {
    if (!bannerIn) return;
    let ro: ResizeObserver | undefined;
    // Helyfoglalás + ResizeObserver csatolása. Késleltetett újrapróbákkal, mert
    // a handle→banner váltáskor (expand) a barRef / elrendezés csak pár tick
    // múlva áll be — enélkül a mérés 0-t foghatna és nem jönne létre a reserve.
    const attach = () => {
      const el = barRef.current;
      if (!el) return;
      applyReserve();
      if (!ro && "ResizeObserver" in globalThis) {
        ro = new ResizeObserver(() => applyReserve());
        ro.observe(el);
      }
    };
    attach();
    const t1 = setTimeout(attach, 100);
    const t2 = setTimeout(attach, 400);
    const onResize = () => applyReserve();
    globalThis.addEventListener("resize", onResize);
    const t3 = !slideIn ? setTimeout(() => setSlideIn(true), 40) : undefined;
    if (!impressionSent.current) {
      impressionSent.current = true;
      trackErdeirekaImpression(`anchor-${position}`, creative.format);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (t3) clearTimeout(t3);
      ro?.disconnect();
      globalThis.removeEventListener("resize", onResize);
      clearReserve();
    };
  }, [bannerIn]);

  function applyReserve() {
    const h = barRef.current?.offsetHeight ?? 0;
    if (!h) return;
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }
    if (position === "top") {
      // A viewport-tetejéhez pinelt elemeket eltoljuk a sáv magasságával.
      // FONTOS: a docs-fejléc `lg:fixed top-0`-t használ (nem sima `fixed`),
      // ezért a `.lg\:fixed.top-0` is kell. A dekoratív `absolute top-0`
      // elemeket NEM érintjük (nincs rajtuk fixed/sticky/lg:fixed osztály).
      el.textContent =
        `body{padding-top:${h}px!important}` +
        `.fixed.top-0,.sticky.top-0,.lg\\:fixed.top-0{top:${h}px!important}` +
        `.fixed.top-24,.sticky.top-24,.lg\\:fixed.top-24{top:calc(6rem + ${h}px)!important}`;
    } else {
      el.textContent = `body{padding-bottom:${h}px!important}`;
    }
  }

  function clearReserve() {
    document.getElementById(styleId)?.remove();
  }

  // ── Összecsukás (nyíl): kikúszik, majd kis fül marad, állapot mentve ──
  function collapse() {
    setSlideIn(false); // kifelé csúszik
    try {
      sessionStorage.setItem(collapsedKey, "1");
    } catch { /* */ }
    trackErdeirekaDismiss(`anchor-${position}`, creative.format);
    setTimeout(() => {
      clearReserve();
      setBannerIn(false);
      setCollapsed(true);
    }, SLIDE_MS - 20);
  }

  // ── Visszanyitás (fül): becsúszik, állapot mentve ──
  function expand() {
    try {
      sessionStorage.setItem(collapsedKey, "0");
      sessionStorage.setItem(seenKey, "1");
    } catch { /* */ }
    impressionSent.current = false;
    setCollapsed(false);
    setSlideIn(false); // kiindulás kint → az effect becsúsztatja
    setBannerIn(true);
  }

  if (!ready) return null;

  // ── Csukott állapot: kis "Hirdetés" fül az él közepén (nincs helyfoglalás) ──
  if (collapsed) {
    return (
      <div
        class="fixed inset-x-0 z-[60] flex justify-center pointer-events-none"
        style={isTop ? { top: 0 } : { bottom: 0 }}
      >
        <button
          type="button"
          onClick={expand}
          aria-label="Hirdetés megnyitása"
          class={`pointer-events-auto flex items-center gap-1.5 px-3 py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200 dark:border-gray-700 shadow text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition ${
            isTop ? "rounded-b-lg border-t-0" : "rounded-t-lg border-b-0"
          }`}
        >
          <span class="text-[10px] uppercase tracking-wider">Hirdetés</span>
          <span aria-hidden="true" class="text-xs leading-none">
            {isTop ? "▼" : "▲"}
          </span>
        </button>
      </div>
    );
  }

  if (!bannerIn) return null;

  // ── Nyitott banner ──
  const href = erdeirekaHref(targetUrl, source);
  const posStyle = isTop ? { top: 0 } : { bottom: 0 };
  const translateClass = slideIn
    ? "translate-y-0"
    : isTop
    ? "-translate-y-full"
    : "translate-y-full";
  const borderClass = isTop
    ? "border-b border-gray-200 dark:border-gray-700"
    : "border-t border-gray-200 dark:border-gray-700";

  return (
    <div
      ref={barRef}
      class={`fixed inset-x-0 z-[60] transition-transform duration-300 ease-out ${translateClass}`}
      style={posStyle}
      role="complementary"
      aria-label="Hirdetés"
    >
      <div
        class={`relative bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-lg ${borderClass}`}
      >
        <div class="mx-auto max-w-screen-xl flex items-center justify-center py-2 px-4">
          <a
            href={href}
            target="_blank"
            rel="sponsored noopener"
            aria-label={creative.alt}
            onClick={() => trackErdeirekaClick(`anchor-${position}`, creative.format)}
            class="block transition hover:opacity-95"
          >
            <div class="hidden md:block">
              <ErdeirekaCreativeBox creative={creative} />
            </div>
            <div class="md:hidden">
              <ErdeirekaCreativeBox creative={creativeMobile} />
            </div>
          </a>
        </div>
        {/* Összecsukó fül a banner BELSŐ élének KÖZEPÉN (AdSense-mintára):
            felső banner → alul lóg le (▲, felfelé csuk); alsó banner → felül áll
            ki (▼, lefelé csuk). Abszolút pozíció → NEM növeli a sáv magasságát,
            így a helyfoglalást nem befolyásolja. */}
        <button
          type="button"
          onClick={collapse}
          aria-label="Hirdetés összecsukása"
          title="Összecsukás"
          class={`absolute left-1/2 -translate-x-1/2 flex items-center justify-center px-5 py-0.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200 dark:border-gray-700 shadow text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition text-xs leading-none ${
            isTop ? "top-full rounded-b-lg border-t-0" : "bottom-full rounded-t-lg border-b-0"
          }`}
        >
          {isTop ? "▲" : "▼"}
        </button>
      </div>
    </div>
  );
}
