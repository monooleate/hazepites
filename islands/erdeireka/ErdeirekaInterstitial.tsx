/**
 * ErdeirekaInterstitial — felugró (interstitial / vignette) house-ad az
 * erdeireka.hu-hoz, AdSense-mintára, de KONZERVATÍV (SEO-biztos) beállítással:
 *
 *   - csak a munkamenet 2. oldalletöltésétől jelenik meg (nem belépéskor),
 *   - késleltetve (SHOW_DELAY_MS),
 *   - munkamenetenként EGYSZER (sessionStorage),
 *   - bezárható (✕ vagy háttérre kattintás),
 *   - desktopon középre igazított modal, MOBILON alsó kártya (nem teljes
 *     képernyős blokkolás) — így nem esünk a Google "intrusive interstitial"
 *     mobil-irányelvébe.
 *
 * A kreatív (large-rectangle 336×280) propként érkezik a szervertől.
 */

import { useEffect, useState } from "preact/hooks";
import ErdeirekaCreativeBox from "../../components/erdeireka/ErdeirekaCreativeBox.tsx";
import { type ErdeirekaCreative, erdeirekaHref } from "../../data/erdeireka-ads.ts";
import {
  trackErdeirekaClick,
  trackErdeirekaDismiss,
  trackErdeirekaImpression,
} from "../../utils/analytics.ts";

interface ErdeirekaInterstitialProps {
  creative: ErdeirekaCreative;
  targetUrl: string;
  source: string;
  /** Csak ennyiedik oldalletöltéstől (session). SSOT: data/erdeireka-config.json. */
  minPageviews?: number;
  /** Késleltetés a megjelenés előtt (ms). SSOT: data/erdeireka-config.json. */
  delayMs?: number;
}

const SHOWN_KEY = "hk-erdeireka-interstitial-shown";
const PV_KEY = "hk-erdeireka-pv";

export default function ErdeirekaInterstitial({
  creative,
  targetUrl,
  source,
  minPageviews = 2,
  delayMs = 4000,
}: ErdeirekaInterstitialProps) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false); // animáció

  useEffect(() => {
    let pv = 1;
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return; // már láttuk ebben a session-ben
      pv = parseInt(sessionStorage.getItem(PV_KEY) ?? "0", 10) + 1;
      sessionStorage.setItem(PV_KEY, String(pv));
    } catch {
      // privát mód → pv marad 1, nem erőltetjük
    }
    if (pv < minPageviews) return; // első oldalletöltésen még nem

    let showT: ReturnType<typeof setTimeout> | undefined;
    const t = setTimeout(() => {
      setVisible(true);
      // setTimeout (nem rAF) — háttérben lévő tabon is animál; a rAF ott nem fut
      showT = setTimeout(() => setShown(true), 30);
      try {
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch { /* ignore */ }
      trackErdeirekaImpression("interstitial", creative.format, creative.campaign);
    }, delayMs);
    return () => {
      clearTimeout(t);
      if (showT) clearTimeout(showT);
    };
  }, []);

  function close() {
    setShown(false);
    // a kilépő animáció után rejtjük el ténylegesen
    setTimeout(() => setVisible(false), 200);
    trackErdeirekaDismiss("interstitial", creative.format, creative.campaign);
  }

  if (!visible) return null;

  const href = erdeirekaHref(targetUrl, source, creative.campaign);

  return (
    <div
      class={`fixed inset-0 z-[70] flex items-end md:items-center justify-center transition-opacity duration-200 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Hirdetés"
    >
      {/* Háttér — kattintásra zár. Mobilon halványabb (kevésbé tolakodó). */}
      <button
        type="button"
        aria-label="Hirdetés bezárása"
        onClick={close}
        class="absolute inset-0 w-full h-full bg-black/30 md:bg-black/50 cursor-default"
      />

      <div
        class={`relative m-3 md:m-0 w-full max-w-sm md:max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 p-4 transition-transform duration-200 ${
          shown ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Hirdetés
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Bezárás"
            class="w-8 h-8 -mr-1 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            ✕
          </button>
        </div>

        <a
          href={href}
          target="_blank"
          rel="sponsored noopener"
          aria-label={creative.alt}
          onClick={() => trackErdeirekaClick("interstitial", creative.format, creative.campaign)}
          class="block transition hover:opacity-95"
        >
          <ErdeirekaCreativeBox creative={creative} />
        </a>
      </div>
    </div>
  );
}
