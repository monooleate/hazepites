# GEO Audit Report: hazepitesikalauz.hu

**Audit Date:** 2026-03-22
**Domain:** hazepitesikalauz.hu
**Business Type:** Publisher / Educational Resource
**Language:** Hungarian
**Topic:** Residential construction guidance for Hungarian families
**Tech Stack:** Deno Fresh (SSR, Island Architecture)
**Pages in Sitemap:** 34
**Founder:** Meszaros Janos

---

## Composite GEO Score: 59/100 — Fair

The site has exceptional content quality and technical foundations, but near-zero brand presence severely limits AI discoverability.

### Score Breakdown

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| AI Citability & Visibility | 25% | 81/100 | 20.3 |
| Brand Authority Signals | 20% | 5/100 | 1.0 |
| Content Quality & E-E-A-T | 20% | 74/100 | 14.8 |
| Technical Foundations | 15% | 82/100 | 12.3 |
| Structured Data | 10% | 50/100 | 5.0 |
| Platform Optimization | 10% | 58/100 | 5.8 |
| **TOTAL** | **100%** | | **59.2** |

### Score Interpretation

- 0-20: Critical — Invisible to AI search
- 21-40: Poor — Minimal AI discoverability
- **41-60: Fair — Some AI visibility but significant gaps**
- 61-80: Good — Solid AI presence with room for improvement
- 81-100: Excellent — Strong AI search visibility

---

## Executive Summary

Hazepitesikalauz.hu is a well-built Hungarian construction guidance site with **excellent content** (data-rich articles, case studies, cost calculators) and **near-perfect AI crawler access** (all 9 major AI bots explicitly allowed). The Deno Fresh SSR architecture ensures AI crawlers see complete content without JavaScript dependency.

However, the site suffers from a critical **"great content, invisible entity"** problem. With virtually zero brand mentions on external platforms (no Wikipedia, no Reddit, no YouTube, no LinkedIn company page), AI models have no way to recognize "Hazepitesi Kalauz" as an authoritative entity — even if they've crawled the content.

The schema markup has solid foundations (JSON-LD on every page) but two critical gaps: Organization lacks sameAs links for entity resolution, and Articles use Organization instead of Person as author, losing E-E-A-T signals.

**Bottom line:** The content deserves to be cited by AI. The infrastructure to make that happen is incomplete.

---

## Detailed Results by Category

### 1. AI Citability & Visibility — 81/100

| Sub-component | Score |
|---------------|-------|
| Passage Citability | 76/100 |
| AI Crawler Access | 95/100 |
| llms.txt Compliance | 72/100 |

**Strengths:**
- Cost data tables score 91/100 for citability — directly answer "how much does it cost to build a house in Hungary in 2026" with exact HUF ranges
- CSOK Plus subsidy tables score 88/100 — specific loan amounts by child count, fixed 3% rate
- All 9 named AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Google-Extended, Applebot-Extended, CCBot, cohere-ai) explicitly allowed
- llms.txt present and well-structured with content taxonomy across all 6 categories
- FAQ sections on every page provide highly quotable Q&A pairs

**Weaknesses:**
- Homepage has low citability (52/100) — generic marketing language, no data blocks
- No llms-full.txt for comprehensive AI content ingestion
- Content is Hungarian-only, limiting citability to Hungarian-language AI queries

### 2. Brand Authority Signals — 5/100

**This is the critical weakness.**

| Platform | Status |
|----------|--------|
| Wikipedia (HU/EN) | Absent |
| Reddit | Absent |
| YouTube | Absent |
| LinkedIn (Company) | Absent |
| Trustpilot | Absent |
| Hungarian forums | Unverified |
| News/media mentions | Absent |
| Wikidata | Absent |

Only signal: Founder has personal LinkedIn and GitHub profiles with site reference.

**Impact:** AI models build entity awareness through cross-platform corroboration. Without external mentions, the brand is effectively invisible to AI entity graphs regardless of content quality.

### 3. Content Quality & E-E-A-T — 74/100

| Dimension | Score |
|-----------|-------|
| Experience | 17/25 |
| Expertise | 15/25 |
| Authoritativeness | 13/25 |
| Trustworthiness | 19/25 |
| Content Depth | 13/15 |
| AI Content Assessment | 7/10 |
| Topical Authority | 7/10 |
| Content Freshness | 4/5 |

**Strengths:**
- Case studies on every content page with named individuals, locations, exact costs, and itemized breakdowns
- Deep technical data: lambda values, U-values, regulatory codes (7/2006 TNM, 9/2023 EKM)
- 3,400 words average per article with strong heading hierarchy
- 25-35 internal links per page building topical authority
- Source citations on every page (KSH, EVOSZ, Portfolio.hu)
- Clear independence positioning

**Weaknesses:**
- Founder credentials are in web development, not construction — significant E-E-A-T gap
- Site launched February 2026 with all 17 articles published in a 3-day window
- No editorial standards page or correction policy
- No expert reviewers or advisory board listed
- The "Szemelyre szabott arajanlat kell?" (need a quote?) CTA appears on every page without disclosing the commercial model
- ~60-65% topical coverage; missing foundation types, windows/doors, roof comparison, building permits

### 4. Technical Foundations — 82/100

**Strengths:**
- Fresh/Deno SSR delivers full HTML to all crawlers — ideal for GEO
- Clean 2-level URL hierarchy (`/category/descriptive-slug`), all under 70 characters
- XML sitemap with 37 well-structured URLs, accurate lastmod dates
- Article + FAQPage + BreadcrumbList JSON-LD on every content page
- robots.txt explicitly allows 9 AI crawlers

**Issues:**
- **[HIGH]** Missing homepage canonical tag — duplicate content risk
- **[HIGH]** No image alt attributes on any page — accessibility and SEO gap
- **[HIGH]** No Twitter Card meta tags — poor social/AI previews
- **[HIGH]** Security headers unverified (HSTS, CSP, X-Frame-Options)
- **[MEDIUM]** Incomplete Open Graph tags on homepage
- **[MEDIUM]** No resource hints (preload, preconnect, dns-prefetch)

### 5. Structured Data — 50/100

**Current Implementation:**
- 16 schema blocks across 6 pages, all valid JSON-LD with no syntax errors
- Server-side rendered (no JS rendering risk)
- BreadcrumbList on every page
- Article + FAQPage on all content pages
- SoftwareApplication with Offer on calculator page
- Person schema for founder with knowsAbout and 3 sameAs links

**Critical Gaps:**
1. **Organization has ZERO sameAs links** — entity resolution impossible for AI models
2. **All Articles list Organization as author instead of Person** — loses E-E-A-T signals; Google Article rich result requirements only partially met
3. No `speakable` property anywhere
4. No `logo` on Organization
5. `dateModified` always equals `datePublished`
6. No `SearchAction` on WebSite schema
7. No `GovernmentService` schema for CSOK Plus subsidy page
8. No `HowTo` schema for step-by-step processes

**Impact:** Fixing just sameAs on Organization + Person as article author would raise score from 50 to ~72.

### 6. Platform Optimization — 58/100

| Platform | Score | Key Issue |
|----------|-------|-----------|
| Google AI Overviews | 70/100 | Good content structure; needs HowTo schema, tighter answer paragraphs |
| Perplexity AI | 60/100 | Strong source directness; zero community validation |
| ChatGPT Web Search | 55/100 | Good factual content; no entity recognition (no Wikidata) |
| Google Gemini | 52/100 | Excellent content quality; zero Google ecosystem presence |
| Bing Copilot | 40/100 | No IndexNow, no LinkedIn company page, no Twitter Cards |

**Core pattern:** Content quality scores at/near maximum on every platform. Entity recognition and ecosystem presence scores 3-8 out of 20-35 on every platform. Classic "invisible entity" problem.

---

## The Core Problem

```
Content Quality:  ████████████████████░░░░░ 81% (Excellent)
Technical Setup:  ████████████████████░░░░░ 82% (Good)
Brand/Entity:     █░░░░░░░░░░░░░░░░░░░░░░░  5% (Critical)
```

The site produces content worthy of AI citation but has not built the external presence needed for AI models to discover and trust it as an entity.

---

## Prioritized Action Plan

### Phase 1: Quick Wins (This Week, ~6 hours)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | **Add sameAs to Organization schema** (Wikidata, LinkedIn, YouTube once created) | All 5 AI platforms | 15 min |
| 2 | **Switch Article author from Organization to Person** (founder with credentials) | Google AIO, ChatGPT, Perplexity, Gemini | 30 min |
| 3 | **Create Wikidata entry** for "Hazepitesi Kalauz" (instance of: website, country: Hungary, language: Hungarian, main subject: residential construction) | ChatGPT, Gemini, Perplexity, Bing | 1-2 hrs |
| 4 | **Create LinkedIn company page** | Bing Copilot, ChatGPT, Gemini | 1 hr |
| 5 | **Add canonical tags** to all pages (starting with homepage) | Technical SEO | 30 min |
| 6 | **Add image alt text** to all images site-wide | Accessibility, AIO, Bing | 1-2 hrs |
| 7 | **Add Twitter Card + OG meta tags** to HTML template | Bing Copilot, ChatGPT, social sharing | 30 min |

**Estimated GEO Score after Phase 1: 68-72/100**

### Phase 2: Short-Term (This Month)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 8 | **Create llms-full.txt** with full content of top 10 pages | ChatGPT, Perplexity, Gemini | 2 hrs |
| 9 | **Implement IndexNow protocol** for Bing | Bing Copilot | 2-3 hrs |
| 10 | **Add HowTo schema** to CSOK Plus application steps | Google AIO | 1 hr |
| 11 | **Add "Roviden" (In Brief) summary boxes** at top of each article (3-5 bullet key facts) | AIO, Perplexity, ChatGPT | 3-4 hrs |
| 12 | **Add GovernmentService schema** to CSOK Plus and Falusi CSOK pages | Schema, AIO | 1 hr |
| 13 | **Add SearchAction to WebSite schema** | Search engines | 30 min |
| 14 | **Add Organization logo** to schema | Knowledge panels | 15 min |
| 15 | **Publish editorial standards page** explaining research methodology, fact-checking, update policy | E-E-A-T, Trustworthiness | 2-3 hrs |
| 16 | **Add hreflang="hu" with x-default** to all pages | AIO, Gemini | 30 min |
| 17 | **Decouple dateModified from datePublished** on content reviews | Perplexity, AIO | 30 min |
| 18 | **Disclose commercial model** behind /ajanlatkeres CTA | Trustworthiness | 1 hr |

**Estimated GEO Score after Phase 2: 74-78/100**

### Phase 3: Strategic (Next Quarter)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 19 | **Create YouTube channel** with 5-10 short videos summarizing key articles | Gemini, AIO, brand authority | High |
| 20 | **Seed Reddit/forum discussions** sharing original data authentically | Perplexity, brand mentions | Medium (ongoing) |
| 21 | **Secure press/guest-post mentions** on Portfolio.hu, Penzcentrum, Ingatlan.com | All platforms, brand authority | Medium |
| 22 | **Recruit construction industry advisor** as content reviewer | E-E-A-T expertise | Medium |
| 23 | **Apply to Google News Publisher Center** | Gemini | Medium |
| 24 | **Expand content to fill topical gaps** (foundations, windows/doors, roof comparison, building permits, heating comparison) | Topical authority | High |
| 25 | **Create original research** (homebuilder survey, regional contractor pricing) | Experience, Expertise, brand authority | High |
| 26 | **Add English-language summary blocks** to key pages for international AI citation | ChatGPT, Perplexity (EN queries) | Medium |

**Estimated GEO Score after Phase 3: 82-88/100**

---

## AI Crawler Access Map

| Crawler | Purpose | Status |
|---------|---------|--------|
| GPTBot | OpenAI training | Allowed |
| OAI-SearchBot | ChatGPT web search | Allowed |
| ChatGPT-User | ChatGPT browsing | Allowed |
| ClaudeBot | Anthropic Claude | Allowed |
| PerplexityBot | Perplexity search | Allowed |
| Google-Extended | Gemini training | Allowed |
| Applebot-Extended | Apple Intelligence | Allowed |
| cohere-ai | Cohere models | Allowed |
| CCBot | Common Crawl | Allowed |
| Googlebot | Google Search | Allowed (wildcard) |
| Bingbot | Bing Search | Allowed (wildcard) |

**Blocked:** `/_fresh/` (framework internals), `/api/` (API endpoints) — both appropriate.

---

## Platform Readiness Dashboard

| Platform | Score | Bar |
|----------|-------|-----|
| Google AI Overviews | 70/100 | ██████████████░░░░░░ |
| Perplexity AI | 60/100 | ████████████░░░░░░░░ |
| ChatGPT Web Search | 55/100 | ███████████░░░░░░░░░ |
| Google Gemini | 52/100 | ██████████░░░░░░░░░░ |
| Bing Copilot | 40/100 | ████████░░░░░░░░░░░░ |

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Pages analyzed | 34 (sitemap) / 7 (deep analysis) |
| Average word count | ~3,400 per article |
| Internal links per page | 25-35 |
| External citations per page | 3-5 |
| Schema blocks detected | 16 across 6 pages |
| AI crawlers allowed | 9 explicitly + all via wildcard |
| llms.txt | Present (72/100 compliance) |
| Content freshness | All published Feb 2026 |
| Image alt text | Missing on all pages |
| Canonical tags | Missing on homepage |

---

## Methodology

This audit was conducted on 2026-03-22 using 5 parallel analysis subagents:

1. **AI Visibility Agent** — citability scoring, crawler access, llms.txt, brand mentions
2. **Platform Analysis Agent** — Google AIO, ChatGPT, Perplexity, Gemini, Bing Copilot readiness
3. **Technical SEO Agent** — crawlability, performance, security, SSR, mobile optimization
4. **Content Quality Agent** — E-E-A-T assessment, content depth, readability, AI content detection
5. **Schema Markup Agent** — structured data detection, validation, missing opportunities

### Scoring Formula

```
GEO Score = (AI Citability × 0.25) + (Brand Authority × 0.20) + (Content Quality × 0.20)
           + (Technical SEO × 0.15) + (Structured Data × 0.10) + (Platform Optimization × 0.10)
```

---

*Report generated by GEO Audit Tool — Claude Code*
*Analysis date: 2026-03-22*
