/** CostRange – Költségtartomány kijelző MDX cikkekhez
 *
 * Használat MDX-ben (import nélkül, auto-injektált):
 *   <CostRange min={500000} max={850000} unit="Ft/m²" label="Téglaház kulcsrakész, 2026" />
 */

interface CostRangeProps {
  min: number;
  max: number;
  unit?: string;
  label?: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return k % 1 === 0 ? `${k}e` : `${Math.round(k)}e`;
  }
  return String(n);
}

export default function CostRange({
  min,
  max,
  unit = "Ft",
  label,
}: CostRangeProps) {
  return (
    <div className="mdx-cost-range">
      {label && <div className="mdx-cost-range-label">{label}</div>}
      <div className="mdx-cost-range-track">
        <div className="mdx-cost-range-endpoint mdx-cost-range-start">
          <span className="mdx-cost-range-amount">
            {formatNumber(min)} {unit}
          </span>
          <span className="mdx-cost-range-tag">alsó határ</span>
        </div>
        <div className="mdx-cost-range-line">
          <span className="mdx-cost-range-arrow">→</span>
        </div>
        <div className="mdx-cost-range-endpoint mdx-cost-range-end">
          <span className="mdx-cost-range-amount">
            {formatNumber(max)} {unit}
          </span>
          <span className="mdx-cost-range-tag">felső határ</span>
        </div>
      </div>
    </div>
  );
}
