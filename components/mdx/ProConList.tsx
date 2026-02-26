/** ProConList – Előnyök/Hátrányok két oszlopban MDX cikkekhez
 *
 * Használat MDX-ben (import nélkül, auto-injektált):
 *   <ProConList
 *     pros={["Gyors építés", "Jó szigetelés", "Olcsóbb"]}
 *     cons={["Gyengébb hangszigetelés", "Alacsonyabb értéktartás"]}
 *   />
 *
 * Opcionális: title prop a fejléchez
 *   <ProConList title="Könnyűszerkezetes ház" pros={[...]} cons={[...]} />
 */

interface ProConListProps {
  pros: string[];
  cons: string[];
  title?: string;
}

export default function ProConList({ pros, cons, title }: ProConListProps) {
  return (
    <div className="mdx-procon">
      {title && <div className="mdx-procon-title">{title}</div>}
      <div className="mdx-procon-grid">
        <div className="mdx-procon-col mdx-procon-pros">
          <div className="mdx-procon-header mdx-procon-header-pro">
            <span className="mdx-procon-icon">{"✅"}</span> Előnyök
          </div>
          <ul className="mdx-procon-list">
            {pros.map((item, i) => (
              <li key={i} className="mdx-procon-item mdx-procon-item-pro">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mdx-procon-col mdx-procon-cons">
          <div className="mdx-procon-header mdx-procon-header-con">
            <span className="mdx-procon-icon">{"❌"}</span> Hátrányok
          </div>
          <ul className="mdx-procon-list">
            {cons.map((item, i) => (
              <li key={i} className="mdx-procon-item mdx-procon-item-con">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
