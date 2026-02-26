/** Checklist – Natív HTML checkbox ellenőrzőlista MDX cikkekhez
 *
 * Interaktív JS nélkül: a <input type="checkbox"> nativ HTML elem,
 * a böngésző kezeli a be/kikapcsolást. CSS :checked állapottal vizuális
 * visszajelzést ad (áthúzás, szín, pipa).
 *
 * Használat MDX-ben (import nélkül, auto-injektált):
 *   <Checklist title="Kivitelező választás szempontjai" items={[
 *     "Referenciák ellenőrzése (min. 3 korábbi munka)",
 *     "Garanciális feltételek átnézése",
 *     "Szerződés ügyvédi ellenőrzése",
 *   ]} />
 */

interface ChecklistProps {
  items: string[];
  title?: string;
}

export default function Checklist({ items, title }: ChecklistProps) {
  return (
    <div className="mdx-checklist">
      {title && <div className="mdx-checklist-title">{title}</div>}
      <div className="mdx-checklist-items">
        {items.map((item, i) => (
          <label key={i} className="mdx-checklist-item">
            <input type="checkbox" className="mdx-checklist-input" />
            <span className="mdx-checklist-check">{"✓"}</span>
            <span className="mdx-checklist-text">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
