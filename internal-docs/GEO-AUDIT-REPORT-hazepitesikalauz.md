# GEO Audit Report: HazepitesiKalauz.hu

**Audit Date:** 2026-03-22
**URL:** https://hazepitesikalauz.hu/
**Business Type:** Educational / Decision-Support Platform (House Building Guide)
**Language:** Hungarian
**Pages in Sitemap:** 37 URLs
**Framework:** Deno Fresh (SSR with Islands Architecture)
**Founder:** Meszaros Janos

---

## Executive Summary

**Overall GEO Score: 48/100 (Poor)**

HazepitesiKalauz.hu is a young Hungarian house building guide with **surprisingly strong content citability** (78/100 — the highest first-audit citability score in the portfolio). The site contains genuinely useful, data-rich comparison tables with 2026 Hungarian construction costs, CSOK Plus subsidy details, and insulation material specifications that AI systems would readily cite.

However, the site is severely limited by **critical legal gaps** (no impresszum, no privacy policy — both legally required in Hungary), **minimal schema markup** (~30/100 — no Person, no sameAs, no Article, no speakable), **zero brand authority** (5/100), and a **Cloudflare robots.txt conflict** that may prevent AI crawlers from accessing content despite explicit Allow directives.

**Biggest strengths:** Exceptional content citability (78/100), data-rich comparison tables, 2026-specific cost data, authoritative external citations (KSH, EVOSZ, Portfolio.hu).

**Most critical gaps:** No impresszum (legal violation), no privacy policy (GDPR violation), Cloudflare robots.txt conflict, no Person schema, no sameAs, no llms.txt, OAI-SearchBot not listed, zero brand authority.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability & Visibility | 62/100 | 25% | 15.4 |
| Brand Authority | 5/100 | 20% | 1.0 |
| Content E-E-A-T | 62/100 | 20% | 12.4 |
| Technical Foundations | 72/100 | 15% | 10.8 |
| Schema & Structured Data | ~30/100 | 10% | 3.0 |
| Platform Optimization | 55/100 | 10% | 5.5 |
| **Overall GEO Score** | | | **48/100** |

### Sub-Score Details

| Component | Score | Notes |
|---|---|---|
| AI Citability (passage quality) | **78** | Highest first-audit citability in portfolio; CSOK table scored 88 |
| AI Crawler Access | 75 | 7 crawlers allowed via override; OAI-SearchBot missing; Cloudflare conflict |
| llms.txt | 0 | Does not exist (404) |
| Brand Mentions | 5 | Zero external presence |
| Platform: Google AIO | 68 | Best platform; excellent content structure |
| Platform: Perplexity | 58 | Good source directness |
| Platform: Gemini | 52 | No Google ecosystem |
| Platform: ChatGPT | 50 | OAI-SearchBot missing |
| Platform: Bing Copilot | 38 | No IndexNow, no Bing WMT |
| E-E-A-T: Experience | ~14/25 | Case studies present but no author identity |
| E-E-A-T: Expertise | ~14/25 | Strong technical data but no credentials |
| E-E-A-T: Authoritativeness | ~10/25 | New domain, no external recognition |
| E-E-A-T: Trustworthiness | ~15/25 | Missing impresszum and privacy policy! |
| Technical: SSR | ~90 | Deno Fresh SSR excellent |
| Technical: Security | ~95 | Full security header suite |
| Technical: Meta Tags | ~55 | Missing OG tags, Twitter Cards |
| Schema | ~30 | Only Organization, WebSite, WebPage, BreadcrumbList |

---

## Critical Issues (Fix Immediately)

### 1. Missing Impresszum (Legal Violation)
- **Impact:** Hungarian E-commerce Act (Ekertv.) requires operator identification for commercial websites. Legal exposure.
- **Fix:** Create /impresszum with operator name, address, registration number, tax number, hosting info.

### 2. Missing Privacy Policy (GDPR Violation)
- **Impact:** Site has a contact/quote request form that collects personal data. GDPR requires a privacy policy.
- **Fix:** Create /adatvedelmi-nyilatkozat with data controller ID, processing purposes, legal basis, user rights, NAIH contact.

### 3. Cloudflare Robots.txt Conflict
- **Impact:** Cloudflare-managed section at top Disallows GPTBot, ClaudeBot, Google-Extended etc. Site section below Allows them. Crawlers may honor the first Disallow and never reach the Allow override.
- **Fix:** Configure Cloudflare's AI bot settings to not inject the blocking rules, OR ensure the site-specific Allow directives come FIRST in the file, OR disable Cloudflare's bot management and handle all rules manually.

### 4. OAI-SearchBot Not Listed
- **Impact:** ChatGPT's dedicated search crawler is not in the Allow overrides. May inherit Cloudflare's default block.
- **Fix:** Add `User-agent: OAI-SearchBot` / `Allow: /` to robots.txt.

---

## High Priority Issues

### 5. No llms.txt File
- **Fix:** Create /llms.txt with site description, main guides, comparison pages, calculators. Template provided in AI Visibility report.

### 6. No Person Schema / Author Identity
- **Impact:** Founder Meszaros Janos is named on homepage but has no bio, no credentials, no Person schema. For YMYL-adjacent financial content (CSOK loans up to 50M Ft), this is a major E-E-A-T gap.
- **Fix:** Create standalone Person schema with jobTitle, knowsAbout, sameAs, alumniOf. Add author bylines to all articles.

### 7. Organization sameAs Empty
- **Impact:** Zero entity linking. AI models cannot verify the brand exists.
- **Fix:** Create LinkedIn, GitHub profiles. Add to Organization sameAs array.

### 8. No Article/FAQPage Schema on Content Pages
- **Impact:** Rich FAQ content exists but isn't in FAQPage schema. Educational articles have no Article/TechArticle schema.
- **Fix:** Add Article schema with author, dates, speakable. Add FAQPage schema to pages with FAQ sections.

### 9. No Open Graph or Twitter Card Tags
- **Impact:** Poor social sharing previews; some AI systems use OG metadata.
- **Fix:** Add og:title, og:description, og:image, og:url + twitter:card, twitter:title, twitter:description, twitter:image site-wide.

### 10. No Bing Webmaster Tools / IndexNow
- **Impact:** Bing Copilot score is 38/100 (Critical).
- **Fix:** Register with Bing WMT, implement IndexNow.

---

## Medium Priority Issues

11. Add speakable property to Article schemas
12. Add SoftwareApplication schema for 5 calculators
13. Link to government primary sources (Magyar Allamkincstar) on CSOK pages
14. Create Terms of Service page
15. Add visible author bylines with credentials on all articles
16. Strengthen introductory paragraphs with quotable summary statistics
17. Consider unblocking CCBot for Common Crawl inclusion
18. Add real photographs alongside SVG illustrations
19. Complete placeholder pages (/gyik, /alapok showing "under preparation")
20. Create YouTube channel with house building content

---

## Platform Readiness

| Platform | Score | Key Factor |
|---|---|---|
| Google AIO | 68 | Excellent content structure; FAQ schema would help |
| Perplexity | 58 | Good source directness; zero community validation |
| Gemini | 52 | No Google ecosystem (YouTube, GBP) |
| ChatGPT | 50 | OAI-SearchBot missing; no entity recognition |
| Bing Copilot | 38 | No IndexNow, no Bing WMT, no Microsoft ecosystem |

---

## 30-Day Action Plan

### Week 1: Legal & Critical Fixes
- [ ] Create impresszum page (Hungarian law requirement)
- [ ] Create privacy policy page (GDPR requirement)
- [ ] Fix Cloudflare robots.txt conflict
- [ ] Add OAI-SearchBot to robots.txt
- [ ] Create /llms.txt file
- [ ] Add OG tags and Twitter Cards to page template
- [ ] Complete placeholder pages (/gyik, /alapok)

### Week 2: Schema & Identity
- [ ] Create Person schema for founder with credentials
- [ ] Add Article schema to all content pages
- [ ] Add FAQPage schema to pages with FAQ content
- [ ] Add speakable property
- [ ] Add SoftwareApplication schema for calculators
- [ ] Populate Organization sameAs (create LinkedIn, GitHub profiles)
- [ ] Add author bylines with credentials

### Week 3: Content & Technical
- [ ] Add government primary source links (CSOK, housing regulations)
- [ ] Strengthen intro paragraphs with quotable statistics
- [ ] Create Terms of Service page
- [ ] Register with Bing Webmaster Tools + IndexNow
- [ ] Add visible "last updated" dates to articles
- [ ] Add real photographs to complement SVG illustrations

### Week 4: Authority Building
- [ ] Create YouTube channel (house building content)
- [ ] Begin Reddit participation (r/hungary, construction forums)
- [ ] Seek listings on Hungarian construction portals
- [ ] Create Wikidata entity
- [ ] Pursue guest posts on epitesijog.hu, epiteszforum.hu

---

## Projected Score Path

| Timeframe | Actions | Projected Score |
|---|---|---|
| Current | -- | **48/100 (Poor)** |
| After Week 1 | Legal pages, robots.txt fix, llms.txt, OG tags | **58/100 (Fair)** |
| After Week 2 | Person/Article/FAQ schema, sameAs, speakable | **66/100 (Fair)** |
| After Week 3 | Citations, Bing WMT, content improvements | **70/100 (Fair-Good)** |
| After Week 4 | YouTube, Reddit, directories | **74/100 (Fair-Good)** |
| 3-6 months | Community, Wikipedia, established authority | **80-85/100 (Good)** |

---

## Full Portfolio Comparison (All 5 Sites)

| Rank | Site | Latest Score | Content | Technical | Schema | Brand | Citability |
|---|---|---|---|---|---|---|---|
| 1 | **MatekMegoldasok** | **63** | 72 | 90 | 72 | 8 | 72 |
| 2 | **CutOptim** | **63** | 73 | 82 | 62 | 22 | 74 |
| 3 | **Konvertalo** | **58** | 62 | 77 | 78 | 8 | 62 |
| 4 | **SEOTudas** | **54** | 75 | 75 | ~68 | 5 | 71 |
| 5 | **HazepitesiKalauz** | **48** | 62 | 72 | ~30 | 5 | **78** |

**Notable:** HazepitesiKalauz has the **highest content citability** (78) of any site in the portfolio despite having the lowest overall GEO score. The gap is entirely in infrastructure (schema, legal pages, brand authority) — not content quality. This site has the highest improvement potential with the fastest payoff if the critical issues are addressed.

---

*Report generated by GEO Audit Tool | 2026-03-22*
*Methodology: 6-category weighted scoring with 3 parallel analysis agents*
