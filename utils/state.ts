import { createDefine } from "fresh";
import type { ErdeirekaConfig } from "./erdeireka.ts";

export interface State {
  title?: string;
  description?: string;
  keywords?: string;
  cleanUrl?: string;
  articleSchema?: string;
  faqPageSchema?: string;
  howToSchema?: string;
  mainSchema?: string;
  softwareSchema?: string;
  breadcrumbSchema?: string;
  ogImage?: string;
  noIndex?: boolean;
  /** erdeireka.hu house-ad config — a _middleware.ts tölti ki minden requestnél.
   * Requestenként EGYSZER sorsol kampányt → az egész oldal egy hirdetőt mutat. */
  erdeireka?: ErdeirekaConfig;
}

export const define = createDefine<State>();
