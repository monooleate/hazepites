/** InfoCard – Újrafelhasználható kiemelő doboz MDX cikkekhez
 *
 * Típusok:
 *   tip   – zöld, tipp/tanács
 *   info  – kék, háttér-információ
 *   warn  – narancs, figyelmeztetés
 *   case  – lila, esettanulmány
 *
 * Használat MDX-ben (import nélkül, auto-injektált):
 *   <InfoCard type="tip" title="Tudtad?">
 *     Szöveges tartalom ide.
 *   </InfoCard>
 */

import type { ComponentChildren } from "preact";

interface InfoCardProps {
  type: "tip" | "info" | "warn" | "case";
  title?: string;
  children: ComponentChildren;
}

const ICONS: Record<string, string> = {
  tip: "\u{1F4A1}",
  info: "\u{2139}\u{FE0F}",
  warn: "\u{26A0}\u{FE0F}",
  case: "\u{1F4CB}",
};

export default function InfoCard({ type, title, children }: InfoCardProps) {
  const icon = ICONS[type] ?? "";
  return (
    <div className={`mdx-callout mdx-callout-${type}`}>
      {title && (
        <strong>
          {icon} {title}
        </strong>
      )}
      <div>{children}</div>
    </div>
  );
}
