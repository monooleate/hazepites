/**
 * ErdeirekaInArticle — STATIKUS (0 JS) cikk-alji house-ad szekció.
 *
 * A `RelatedProductSection` vizuális helyét veszi át: a tartalmi oldalak
 * markdown-ja után, felső elválasztóval. Az `ErdeirekaBanner`-t kereteli
 * (large-rectangle desktop / rectangle mobil), "Hirdetés" címkével.
 */

import ErdeirekaBanner from "./ErdeirekaBanner.tsx";
import type { ErdeirekaCreative } from "../../data/erdeireka-ads.ts";

interface ErdeirekaInArticleProps {
  /** Desktop kreatív (large-rectangle 336×280). */
  creative: ErdeirekaCreative;
  /** Mobil kreatív (rectangle 300×250). */
  creativeMobile?: ErdeirekaCreative;
  targetUrl: string;
  source: string;
}

export default function ErdeirekaInArticle({
  creative,
  creativeMobile,
  targetUrl,
  source,
}: ErdeirekaInArticleProps) {
  return (
    <section
      class="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700 min-w-0 flex flex-col items-center"
      aria-label="Hirdetés"
    >
      <ErdeirekaBanner
        creative={creative}
        creativeMobile={creativeMobile}
        targetUrl={targetUrl}
        source={source}
        label
      />
    </section>
  );
}
