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

  return (
    // KÜLSŐ doboz = PONTOSAN az <img>-branch méretezése: display:block + explicit
    // width + max-w-full + aspect-ratio. NEM `flex` és NEM `w-full` — különben a
    // shrink-to-fit / center-igazított szülőben (anchor-sáv, TOC alatti sidebar
    // wrapper) a méret elcsúszik a kép-bannerhez képest. Így a placeholder minden
    // sloton a definiált banner-méretet foglalja (728×90, 300×600, ...), keskeny
    // konténerben pedig — akárcsak a kép — arányosan skálázódik.
    <div
      class="block max-w-full rounded-xl overflow-hidden text-white shadow-sm"
      style={{
        width: `${w}px`,
        aspectRatio: `${w} / ${h}`,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      <div
        class={`flex w-full h-full p-4 gap-3 ${
          wide
            ? "flex-row items-center justify-between text-left"
            : "flex-col items-center justify-center text-center"
        }`}
      >
        <div class={wide ? "min-w-0" : ""}>
          <div class="font-extrabold leading-tight text-lg sm:text-xl drop-shadow-sm">
            {creative.headline ?? "Erdei Réka"}
          </div>
          {creative.subline && (
            <div class="text-xs sm:text-sm text-white/85 mt-1 leading-snug">
              {creative.subline}
            </div>
          )}
        </div>
        <span
          class="inline-block flex-shrink-0 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shadow"
          style={{ background: accent, color: "#1a1a2e" }}
        >
          {creative.cta ?? "Tovább →"}
        </span>
      </div>
    </div>
  );
}
