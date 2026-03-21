/** MdxLink – Intelligens link komponens MDX-hez
 *
 * Automatikusan hozzáadja a target="_blank" és rel="noopener noreferrer"
 * attribútumokat a külső (http/https) linkekhez.
 * Belső linkek (/docs/..., /koltsegek/... stb.) normálisan viselkednek.
 *
 * Az MDX pipeline-ban az `a` HTML elem override-jaként van regisztrálva,
 * tehát minden markdown link ([szöveg](url)) automatikusan ezen megy át.
 */

import type { ComponentChildren } from "preact";

interface MdxLinkProps {
  href?: string;
  children?: ComponentChildren;
  className?: string;
  [key: string]: unknown;
}

// Saját domain-ek ahol link juice-t akarunk átadni (nincs noreferrer/nofollow)
const DOFOLLOW_DOMAINS = ["matekmegoldasok.hu"];

export default function MdxLink({ href, children, ...rest }: MdxLinkProps) {
  const isExternal = href && /^https?:\/\//.test(href);

  if (isExternal) {
    const isDofollow = DOFOLLOW_DOMAINS.some((d) => href!.includes(d));
    return (
      <a
        href={href}
        target="_blank"
        rel={isDofollow ? "noopener" : "noopener noreferrer"}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
