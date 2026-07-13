/**
 * ErdeirekaCreativeBox — egyetlen kreatív vizuális doboza: KÉP vagy szöveges
 * fallback. Megosztott a statikus `ErdeirekaBanner` és a kliens-oldali
 * island-ek (ErdeirekaAnchor, ErdeirekaInterstitial) között.
 *
 * KLIENS-BIZTOS: csak a `data/erdeireka-ads.ts`-t importálja (nincs Deno).
 */

import {
  ERDEIREKA_DIM,
  type ErdeirekaCreative,
  isWideFormat,
} from "../../data/erdeireka-ads.ts";

export default function ErdeirekaCreativeBox(
  { creative }: { creative: ErdeirekaCreative },
) {
  const { w, h } = ERDEIREKA_DIM[creative.format];

  if (creative.img) {
    return (
      <img
        src={creative.img}
        srcset={creative.img2x
          ? `${creative.img} 1x, ${creative.img2x} 2x`
          : undefined}
        width={w}
        height={h}
        alt={creative.alt}
        loading="eager"
        decoding="async"
        class="block h-auto max-w-full rounded-xl"
        style={{ width: `${w}px`, aspectRatio: `${w} / ${h}` }}
      />
    );
  }

  // ── Szöveges fallback (ha nincs kép) ──
  const from = creative.bgFrom ?? "#6d28d9";
  const to = creative.bgTo ?? "#db2777";
  const accent = creative.accent ?? "#f59e0b";
  const wide = isWideFormat(creative.format);
  const headline = creative.headline ?? "Erdei Réka";
  const cta = creative.cta ?? "Tovább →";

  // Betűméretek a formátum-dimenzióból (a viewBox koordináta-rendszerben fixek,
  // a <svg> az egészet a kép-bannerrel AZONOSAN skálázza).
  const hFS = wide ? Math.round(h * 0.24) : Math.round(w * 0.11);
  const sFS = wide ? Math.round(h * 0.15) : Math.round(w * 0.072);
  const cFS = sFS;
  const pad = Math.round(Math.min(w, h) * 0.1);
  const gap = Math.round(Math.min(w, h) * 0.06);

  // FONTOS: a fallback ROOTja egy <svg> (REPLACED elem) — pontosan úgy méreteződik,
  // mint a kép-branch <img>-e: `max-w-full` a shrink-to-fit / center-igazított
  // szülőben is a valódi oszlopszélességre zsugorodik (nem lóg ki a TOC-alatti
  // sidebarból, sem az anchor-sávból). Egy sima block <div> explicit `width`-tel
  // ott merev maradna és túlnyúlna. A tényleges kártyát `<foreignObject>` HTML-je
  // rendereli — a <svg> a w×h koordináta-rendszert a megjelenített méretre skálázza
  // (a szöveg is arányosan), a HTML-szöveg pedig természetesen tördel.
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={creative.alt}
      class="block h-auto max-w-full rounded-xl shadow-sm"
      style={{ width: `${w}px`, aspectRatio: `${w} / ${h}` }}
    >
      <foreignObject x="0" y="0" width={w} height={h}>
        <div
          style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: wide ? "space-between" : "center",
            flexDirection: wide ? "row" : "column",
            textAlign: wide ? "left" : "center",
            gap: `${gap}px`,
            padding: `${pad}px`,
            borderRadius: "12px",
            overflow: "hidden",
            color: "#fff",
            background: `linear-gradient(135deg, ${from}, ${to})`,
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: `${hFS}px`, lineHeight: 1.1 }}>
              {headline}
            </div>
            {creative.subline && (
              <div
                style={{
                  fontSize: `${sFS}px`,
                  opacity: 0.85,
                  marginTop: `${Math.round(gap / 2)}px`,
                  lineHeight: 1.2,
                }}
              >
                {creative.subline}
              </div>
            )}
          </div>
          <div
            style={{
              flexShrink: 0,
              background: accent,
              color: "#1a1a2e",
              fontWeight: 700,
              fontSize: `${cFS}px`,
              padding: `${Math.round(cFS * 0.5)}px ${Math.round(cFS * 0.85)}px`,
              borderRadius: `${Math.round(cFS * 0.5)}px`,
              whiteSpace: "nowrap",
            }}
          >
            {cta}
          </div>
        </div>
      </foreignObject>
    </svg>
  );
}
