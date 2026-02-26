/** ComparisonRow – Vizuális összehasonlító sor MDX cikkekhez
 *
 * Két mód:
 * 1. Összehasonlítás (winner megadva): két opció szembeállítása
 *    <ComparisonRow label="Építési idő" left="8-14 hó" right="2-5 hó" winner="right"
 *      leftHeader="Téglaház" rightHeader="Könnyűszerkezet" />
 *
 * 2. Adat megjelenítés (winner nélkül): címke + két oszlop adat
 *    <ComparisonRow label="Homlokzati fal"
 *      left="max 0,24 W/m²K" leftHeader="U-érték előírás"
 *      right="12-15 cm EPS" rightHeader="Szükséges vastagság" />
 */

interface ComparisonRowProps {
  label: string;
  left: string;
  right: string;
  leftHeader?: string;
  rightHeader?: string;
  winner?: "left" | "right" | "tie";
}

export default function ComparisonRow({
  label,
  left,
  right,
  leftHeader,
  rightHeader,
  winner,
}: ComparisonRowProps) {
  const hasWinner = winner && winner !== "tie";
  const isComparison = !!winner;

  return (
    <div className={`mdx-comparison-row ${isComparison ? "mdx-comparison-versus" : "mdx-comparison-data"}`}>
      <div className="mdx-comparison-label">{label}</div>
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
