/** CaseStudy – Esettanulmány kiemelő kártya MDX cikkekhez
 *
 * Használat MDX-ben (import nélkül, auto-injektált):
 *   <CaseStudy name="Péter és Kata" location="Budaörs" year={2025}>
 *     140 m²-es téglaházat építettek...
 *   </CaseStudy>
 */

import type { ComponentChildren } from "preact";

interface CaseStudyProps {
  name: string;
  location: string;
  year: number;
  children: ComponentChildren;
}

export default function CaseStudy({
  name,
  location,
  year,
  children,
}: CaseStudyProps) {
  return (
    <div className="mdx-case-study">
      <div className="mdx-case-study-header">
        <span className="mdx-case-study-icon">{"\u{1F4CB}"}</span>
        <div>
          <strong className="mdx-case-study-name">{name}</strong>
          <span className="mdx-case-study-meta">
            {location}, {year}
          </span>
        </div>
      </div>
      <div className="mdx-case-study-body">{children}</div>
    </div>
  );
}
