import { useEffect, useRef, useState } from "preact/hooks";
import type { MarkdownHeading } from "../utils/markdown.ts";

export interface TableOfContentsProps {
  headings: MarkdownHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>("");

  // Scroll-based active heading detection (stable, no jumping)
  useEffect(() => {
    if (!headings.length) return;

    let rafId = 0;

    const update = () => {
      // A header magassága + kis offset
      const offset = 100;
      let currentId = headings[0].id;

      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= offset) {
            currentId = h.id;
          } else {
            break;
          }
        }
      }

      setActiveId(currentId);
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    globalThis.addEventListener("scroll", handleScroll, { passive: true });
    update(); // kezdeti állapot

    return () => {
      globalThis.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [headings]);

  // Update blue marker position with smooth cubic-bezier animation
  useEffect(() => {
    if (!containerRef.current || !markerRef.current || !activeId) return;
    const escapedId = activeId.replace(/"/g, '\\"');
    const link = containerRef.current.querySelector(`a[href="#${escapedId}"]`) as HTMLElement;
    if (!link) return;
    const marker = markerRef.current;
    const top = link.offsetTop;
    marker.style.transform = `translateY(${top}px)`;
    marker.style.height = `${link.offsetHeight}px`;
    marker.style.opacity = "1";
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <div ref={containerRef}>
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        Tartalom
      </div>
      <div class="relative">
        {/* Animated blue stripe marker */}
        <div
          ref={markerRef}
          class="absolute left-0 w-[3px] rounded-full opacity-0"
          style={{
            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s ease, opacity 0.2s ease",
            background: "linear-gradient(180deg, #3b82f6, #2563eb)",
            boxShadow: "0 0 8px rgba(59, 130, 246, 0.4)",
          }}
        />
        {/* Static border line */}
        <div class="border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-0.5">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              class={`block py-1 text-[13px] leading-snug truncate transition-all duration-200 ${
                h.level === 3 ? "pl-3" : h.level === 4 ? "pl-6" : ""
              } ${
                activeId === h.id
                  ? "text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              dangerouslySetInnerHTML={{ __html: h.html }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
