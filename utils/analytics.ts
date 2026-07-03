/**
 * analytics.ts — könnyű, kliens-biztos event-küldő az erdeireka.hu house-ad
 * réteghez. Ha az oldalon fut GA4 (`window.gtag`) vagy Plausible
 * (`window.plausible`), oda küldi az eseményt; ha egyik sincs, csendben no-op.
 *
 * Szándékosan függőségmentes: az island-ek (ErdeirekaAnchor, ErdeirekaInterstitial)
 * importálhatják hydration-gond nélkül. Szerver-oldalon (SSR) minden hívás no-op,
 * mert nincs `window`.
 */

// deno-lint-ignore no-explicit-any
type AnyWindow = any;

interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

/** Egy esemény elküldése a jelen lévő trackernek (GA4 / Plausible), különben no-op. */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", event.name, event.params ?? {});
    }
    if (typeof w.plausible === "function") {
      w.plausible(event.name, { props: event.params ?? {} });
    }
  } catch {
    // A méréshiba sosem törhet meg felhasználói interakciót.
  }
}

// ── erdeireka.hu house-ad eventek ────────────────────────────────────────────

/** Banner megjelent (impresszió). */
export function trackErdeirekaImpression(
  placement: string,
  format: string,
): void {
  trackEvent({ name: "erdeireka_impression", params: { placement, format } });
}

/** Banner kattintás. */
export function trackErdeirekaClick(placement: string, format: string): void {
  trackEvent({ name: "erdeireka_click", params: { placement, format } });
}

/** Banner bezárás / összecsukás. */
export function trackErdeirekaDismiss(placement: string, format: string): void {
  trackEvent({ name: "erdeireka_dismiss", params: { placement, format } });
}
