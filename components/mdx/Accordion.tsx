/** Accordion – Összecsukható FAQ / részletek elem MDX cikkekhez
 *
 * Két mód:
 *
 * 1) Többelemű FAQ mód (items prop):
 *   <Accordion items={[
 *     { q: "Első kérdés?", a: "Első válasz." },
 *     { q: "Második kérdés?", a: "Második válasz." }
 *   ]} />
 *
 * 2) Egyedi mód (title + children):
 *   <Accordion title="Kérdés szövege?">
 *     Válasz szövege itt.
 *   </Accordion>
 */

import type { ComponentChildren } from "preact";

interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  title?: string;
  children?: ComponentChildren;
  items?: AccordionItem[];
}

function AccordionEntry({
  question,
  children,
}: {
  question: string;
  children: ComponentChildren;
}) {
  return (
    <details className="mdx-accordion">
      <summary className="mdx-accordion-summary">
        <span className="mdx-accordion-icon">&#9654;</span>
        <span>{question}</span>
      </summary>
      <div className="mdx-accordion-content">{children}</div>
    </details>
  );
}

export default function Accordion({ title, children, items }: AccordionProps) {
  // Többelemű FAQ mód
  if (items && items.length > 0) {
    return (
      <div className="mdx-accordion-group">
        {items.map((item, i) => (
          <AccordionEntry key={i} question={item.q}>
            {item.a}
          </AccordionEntry>
        ))}
      </div>
    );
  }

  // Egyedi mód (title + children)
  if (title) {
    return (
      <AccordionEntry question={title}>
        {children}
      </AccordionEntry>
    );
  }

  return null;
}
