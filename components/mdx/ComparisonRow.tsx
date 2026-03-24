/** ComparisonRow – Vizuális összehasonlító sor MDX cikkekhez
 *
 * Három mód:
 * 1. Összehasonlítás (winner megadva): két opció szembeállítása
 *    <ComparisonRow label="Építési idő" left="8-14 hó" right="2-5 hó" winner="right"
 *      leftHeader="Téglaház" rightHeader="Könnyűszerkezet" />
 *
 * 2. Adat megjelenítés (winner nélkül): címke + két oszlop adat
 *    <ComparisonRow label="Homlokzati fal"
 *      left="max 0,24 W/m²K" leftHeader="U-érték előírás"
 *      right="12-15 cm EPS" rightHeader="Szükséges vastagság" />
 *
 * 3. Lista mód (leftItems/rightItems): két oszlopban felsorolás
 *    <ComparisonRow left="Előnyök" right="Hátrányok"
 *      leftItems={["Gyors", "Olcsó"]} rightItems={["Drága", "Lassú"]} />
 */

interface ComparisonRowProps {
  label?: string;
  left: string;
  right: string;
  leftHeader?: string;
  rightHeader?: string;
  winner?: "left" | "right" | "tie";
  leftItems?: string[];
  rightItems?: string[];
}

export default function ComparisonRow({
  label,
  left,
  right,
  leftHeader,
  rightHeader,
  winner,
  leftItems,
  rightItems,
}: ComparisonRowProps) {
  const hasWinner = winner && winner !== "tie";
  const isComparison = !!winner;
  const isList = !!(leftItems?.length || rightItems?.length);

  // Lista mód – két oszlopos felsorolás
  if (isList) {
    return (
      <div className="mdx-comparison-list">
        <div className="mdx-comparison-list-cols">
          <div className="mdx-comparison-list-col mdx-comparison-list-left">
            <div className="mdx-comparison-list-heading">{left}</div>
            {leftItems && (
              <ul className="mdx-comparison-list-items">
                {leftItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="mdx-comparison-list-col mdx-comparison-list-right">
            <div className="mdx-comparison-list-heading">{right}</div>
            {rightItems && (
              <ul className="mdx-comparison-list-items">
                {rightItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  // String mód – eredeti viselkedés
  return (
    <div className={`mdx-comparison-row ${isComparison ? "mdx-comparison-versus" : "mdx-comparison-data"}`}>
      {label && <div className="mdx-comparison-label">{label}</div>}
      <div className="mdx-comparison-cells">
        <div
          className={`mdx-comparison-cell mdx-comparison-left ${winner === "left" ? "mdx-comparison-winner" : ""}`}
        >
          {leftHeader && <span className="mdx-comparison-header">{leftHeader}</span>}
          <span className="mdx-comparison-value">{left}</span>
          {winner === "left" && <span className="mdx-comparison-badge">✓</span>}
        </div>
        {right && (
          <div
            className={`mdx-comparison-cell mdx-comparison-right ${winner === "right" ? "mdx-comparison-winner" : ""}`}
          >
            {rightHeader && <span className="mdx-comparison-header">{rightHeader}</span>}
            <span className="mdx-comparison-value">{right}</span>
            {winner === "right" && <span className="mdx-comparison-badge">✓</span>}
          </div>
        )}
      </div>
    </div>
  );
}
