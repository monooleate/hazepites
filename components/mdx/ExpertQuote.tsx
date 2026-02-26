/** ExpertQuote – Szakértői idézet kiemelés MDX cikkekhez
 *
 * Használat MDX-ben (import nélkül, auto-injektált):
 *   <ExpertQuote name="Koji László" role="ÉVOSZ elnök" source="portfolio.hu">
 *     Az építőipar kapacitása évi 25 ezer lakás...
 *   </ExpertQuote>
 */

import type { ComponentChildren } from "preact";

interface ExpertQuoteProps {
  name: string;
  role?: string;
  source?: string;
  sourceUrl?: string;
  children: ComponentChildren;
}

export default function ExpertQuote({
  name,
  role,
  source,
  sourceUrl,
  children,
}: ExpertQuoteProps) {
  return (
    <blockquote className="mdx-expert-quote">
      <div className="mdx-expert-quote-text">{children}</div>
      <footer className="mdx-expert-quote-footer">
        <strong>{name}</strong>
        {role && <span className="mdx-expert-quote-role">, {role}</span>}
        {source && (
          <span className="mdx-expert-quote-source">
            {" "}
            (
            {sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                {source}
              </a>
            ) : (
              source
            )}
            )
          </span>
        )}
      </footer>
    </blockquote>
  );
}
