# GSC → BigQuery analytics pipeline — hazepitesikalauz.hu (hazepites)

GSC bulk export → BigQuery turns Search Console data into keyword / title / content decisions.
Master methodology (shared): `monooleate/opticut` → `internal-docs/seo/GSC-BIGQUERY-PIPELINE.md`.

## Connection

| Item | Value |
|---|---|
| Project (data + billing) | `grabit-495706` · Region **EU** |
| Raw table | `grabit-495706.searchconsole_hazepites.searchdata_url_impression` (from 2026-08-10, **no backfill**) |
| Snapshot table | `grabit-495706.searchconsole_hazepites.weekly_report` (created + seeded 2026-08-17) |

## Site config

- **Dimension** = first URL path segment = category (`/koltsegek/`, `/jog/`, `/energia/`,
  `/haztipusok/`, `/tamogatasok/`). Single-language (hu).
- **Brand exclusion**: none.
- Ranks well already (top pages pos 5–10) — expect R3/R4 to surface refinements, not big gaps.

## Method

Position = `SUM(sum_position)/SUM(impressions) + 1` (column `sum_position`, 0-indexed → `+1`);
impression-weighted; anonymized (`query = NULL`) excluded from query reports; always filter
`data_date` (partitioned).

## Reports (`weekly_report.report`)

`R1_category` (per-category scorecard) · `R2_bucket` (known vs anonymized) · `R3_striking` (pos 8–20,
keyword/title wins) · `R4_ctr_outlier` (ranks pos ≤8, low CTR → title/meta).

## Weekly scheduled query

Console → Scheduled queries → Create → paste SELECT → Destination
`searchconsole_hazepites.weekly_report`, **Append**, Region **EU**, **Weekly**.

```sql
WITH base AS (
  SELECT REGEXP_EXTRACT(url, r'https?://[^/]+/([^/]+)') AS category,
    REGEXP_REPLACE(url,r'#.*$','') AS page,
    query, is_anonymized_query, impressions, clicks, sum_position
  FROM `grabit-495706.searchconsole_hazepites.searchdata_url_impression`
  WHERE data_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY)
)
SELECT CURRENT_DATE() AS run_date, 'R1_category' AS report, category AS dim1, CAST(NULL AS STRING) AS dim2,
  SUM(impressions) AS impr, SUM(clicks) AS clicks,
  ROUND(SAFE_DIVIDE(SUM(clicks),SUM(impressions))*100,2) AS ctr_pct,
  ROUND(SUM(sum_position)/SUM(impressions)+1,1) AS pos
FROM base GROUP BY category
UNION ALL
SELECT CURRENT_DATE(),'R2_bucket',IF(is_anonymized_query,'anonymized','known'),CAST(NULL AS STRING),
  SUM(impressions),SUM(clicks),ROUND(SAFE_DIVIDE(SUM(clicks),SUM(impressions))*100,2),ROUND(SUM(sum_position)/SUM(impressions)+1,1)
FROM base GROUP BY 3
UNION ALL
SELECT CURRENT_DATE(),'R3_striking',category,query,
  SUM(impressions),SUM(clicks),ROUND(SAFE_DIVIDE(SUM(clicks),SUM(impressions))*100,2),ROUND(SUM(sum_position)/SUM(impressions)+1,1)
FROM base WHERE is_anonymized_query=FALSE GROUP BY category,query
HAVING SUM(impressions)>=10 AND SUM(sum_position)/SUM(impressions)+1 BETWEEN 8 AND 20.5
UNION ALL
SELECT CURRENT_DATE(),'R4_ctr_outlier',page,CAST(NULL AS STRING),
  SUM(impressions),SUM(clicks),ROUND(SAFE_DIVIDE(SUM(clicks),SUM(impressions))*100,2),ROUND(SUM(sum_position)/SUM(impressions)+1,1)
FROM base GROUP BY page
HAVING SUM(impressions)>=40 AND SUM(sum_position)/SUM(impressions)+1<=8;
```

## From data to change

- **R4** → title/description rewrite, keyword verbatim at the front, ≤60 chars.
- **R3** → add the missing word — but ONLY after reading the target page's real title/keywords. Word
  already present + poor position = competition, not a missing word → don't churn a working page.
- Never invent a keyword or number; measure the page source first.
