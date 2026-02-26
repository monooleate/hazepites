/** StepByStep – Lépésenkénti folyamat vizualizáció MDX cikkekhez
 *
 * Használat MDX-ben (import nélkül, auto-injektált):
 *   <StepByStep steps={[
 *     { title: "Talajvizsgálat", desc: "Fúrás, labor, szakvélemény" },
 *     { title: "Tervezés", desc: "Statikus + építész terv" },
 *     { title: "Kivitelezés", desc: "Ásás, vasalás, betonozás" },
 *   ]} />
 */

interface Step {
  title: string;
  desc?: string;
}

interface StepByStepProps {
  steps: Step[];
  title?: string;
}

export default function StepByStep({ steps, title }: StepByStepProps) {
  return (
    <div className="mdx-steps">
      {title && <div className="mdx-steps-title">{title}</div>}
      <div className="mdx-steps-list">
        {steps.map((step, i) => (
          <div key={i} className="mdx-steps-item">
            <div className="mdx-steps-number">{i + 1}</div>
            <div className="mdx-steps-connector" />
            <div className="mdx-steps-content">
              <div className="mdx-steps-step-title">{step.title}</div>
              {step.desc && (
                <div className="mdx-steps-desc">{step.desc}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
