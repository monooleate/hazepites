import { createDefine } from "fresh";

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
}

export const define = createDefine<State>();
