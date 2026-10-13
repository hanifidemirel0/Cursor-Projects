---
title: ETL Tool Comparison Matrix
aliases: [ETL Karşılaştırma Matrisi, ETL Matrix]
created: 2026-10-13
updated: 2026-10-13
status: desk-assessment-no-bank-tests
language: en
tags: [dwh, etl, comparison, matrix, architecture, procurement]
---

# ETL Tool Comparison Matrix

Grid view of the five candidates — **Oracle Data Integrator (ODI)**, **Informatica PowerCenter (PC)**, **dbt Core v1 + dbt-oracle (dbt)**, **Cloudera Data Platform on premises (CDP)**, **Apache Spark on premises (Spark)** — for the Takasbank on-premises Exadata EDW.

This note **owns the matrix view only**. Reasoning and recommendation live in [[ETL Tool Comparison]]; method, weights and scale in [[ETL Tool Evaluation]]; cell-level evidence and source IDs in the workbook `outputs/.../etl-evaluation/ETL-Tool-Comparison.xlsx`; test protocol in [[ETL Proof of Concept and Acceptance]].

> [!warning] Status
> Desk assessment from official documentation and bank notes (sources rechecked 12 October 2026). No installation, test or quote at Takasbank. All mandatory gates **Pending**; cost **unassessed**. Ratings are architect judgment on the 0–5 desk scale, not acceptance results.

## Legend

| Symbol / label | Meaning |
|---|---|
| **0–5** | Desk rating: 0 unsuitable · 1 major gaps · 2 material extra work · 3 credible documented path · 4 strong architectural fit · 5 demonstrated superiority (never awarded on paper) |
| **Built-in** | Product capability; configuration required |
| **Limited** | Partial scope or partial coverage |
| **Implement** | Bank-specific SQL / code / design |
| **Add-on** | Another product, service or component is required |
| **Validate** | Insufficient evidence for the selected offer; must be proven |
| **Out of scope** | Absent from the baseline product |
| **H / M / L** | Risk or exposure: high / medium / low |

## Matrix A — Weighted scorecard

Rating per criterion and the **points it contributes** to the 100-point scale (weight × rating ÷ 5). Cost (8.5 points) is excluded, not scored zero; the provisional fit rescales the remaining 91.5 points to 100.

| # | Criterion | Weight | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|---|
| 03 | Source integration and data movement | 9.35 | **4** → 7.48 | **4** → 7.48 | **2** → 3.74 | **3** → 5.61 | **2** → 3.74 |
| 04 | Transformation and Exadata efficiency | 11.05 | **4** → 8.84 | **3** → 6.63 | **4** → 8.84 | **2** → 4.42 | **2** → 4.42 |
| 05 | Data correctness, history, reconciliation | 17.00 | **3.5** → 11.90 | **3** → 10.20 | **3** → 10.20 | **2.5** → 8.50 | **2.5** → 8.50 |
| 06 | Scheduling, operational reporting, recovery | 10.20 | **4** → 8.16 | **3.5** → 7.14 | **2.5** → 5.10 | **2.5** → 5.10 | **2** → 4.08 |
| 07 | Security, metadata, auditability | 13.60 | **3** → 8.16 | **3** → 8.16 | **2.5** → 6.80 | **3.5** → 9.52 | **2** → 5.44 |
| 08 | Development, testing, change management | 5.95 | **3** → 3.57 | **2.5** → 2.98 | **4** → 4.76 | **3** → 3.57 | **3.5** → 4.17 |
| 09 | Operating model, support, lifecycle | 9.35 | **4** → 7.48 | **3** → 5.61 | **2** → 3.74 | **2** → 3.74 | **1.5** → 2.81 |
| 10 | Five-year cost and exit effort | 8.50 | unassessed | unassessed | unassessed | unassessed | unassessed |
| 12 | AI integration (local only) | 8.00 | **2** → 3.20 | **2** → 3.20 | **3** → 4.80 | **3** → 4.80 | **3** → 4.80 |
| 13 | Open-source licensing and flexibility | 7.00 | **2** → 2.80 | **2** → 2.80 | **4** → 5.60 | **3** → 4.20 | **4** → 5.60 |
| | **Points earned / 91.5 (cost excluded)** | | **61.6** | **54.2** | **53.6** | **49.5** | **43.6** |
| | **Provisional fit / 100 (rescaled)** | | **67.3** | **59.2** | **58.6** | **54.1** | **47.6** |
| | Rank (provisional) | | 1 | 2 | 3 | 4 | 5 |
| | Criteria led or tied for lead (of 9) | | 5 | 1 | 4 | 2 | 2 |

### A.1 Cost sensitivity

Full weighted score = points earned + 1.7 × cost rating. The table shows how much **better** a challenger's cost rating must be than ODI's for the order to flip.

| Pair | Gap in points | Cost-rating advantage needed to overtake ODI | Reading |
|---|---|---|---|
| PC vs ODI | 7.4 | ≥ 4.4 of 5 | Only if ODI prices near-unacceptably and PC near-free: unlikely |
| dbt vs ODI | 8.0 | ≥ 4.7 of 5 | Zero licence fee alone does not close the gap; people and surrounding components count |
| CDP vs ODI | 12.1 | > 5 | Not reachable through cost |
| Spark vs ODI | 18.0 | > 5 | Not reachable through cost |
| dbt vs PC | 0.6 | ≥ 0.4 of 5 | **Cost decides this pair**; dbt likely overtakes PC once quotes exist |

Conclusion: cost can reorder the challengers but does not realistically dislodge the lead on desk ratings. PoC evidence (which can move 05, 06 and 09 by whole points) matters more than price for the top spot.

## Matrix B — Mandatory gates

Pass/fail, outside the score. A single Fail excludes the candidate.

| Gate | ODI | PC | dbt | CDP | Spark | Decisive evidence (P-test) |
|---|---|---|---|---|---|---|
| Fully on-premises operation | Pending | Pending — CDI-PC / IDMC control plane **fails** this gate; only a fully local PowerCenter offer is evaluable | Pending — telemetry off, package mirror, no cloud MCP tools | Pending — every optional service must be inspected, not just Base | Pending — every surrounding component must be inspected | P01 disconnected operation |
| Security, support and operating acceptance | Pending — exact-release support, DBA/ETL responsibility split | Pending — **written local-product roadmap** and support horizon | Pending — Oracle-maintained adapter is not an incident SLA; support route required | Pending — cluster team and on-call must exist | Pending — bank or provider must own every component | P11, P12 |
| Correctness, deadlines and recovery tests | Pending — restart after partial commit | Pending — full pushdown changes reject/recovery behaviour | Pending — ingestion + tests + publication, not only `dbt run` | Pending — cluster → Oracle handoff | Pending — at-least-once sinks must not duplicate publication | P04–P07, P09 |

## Matrix C — Capability matrix (F01–F36)

Labels copied from the workbook feature grid (section 11). They are **evidence for the ratings, not a score**; feature counts are never added to Matrix A.

### C.1 Connectivity and ingestion (criterion 03)

| # | Feature | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|
| F01 | Oracle read / write | Built-in | Built-in | Limited | Built-in | Built-in |
| F02 | Other relational sources | Built-in | Built-in | Add-on | Built-in | Built-in |
| F03 | File ingestion | Built-in | Built-in | Limited | Built-in | Built-in |
| F04 | REST / API ingestion | Implement | Validate | Add-on | Add-on | Implement |
| F05 | Oracle redo-log CDC | Add-on (GoldenGate) | Add-on (PowerExchange) | Add-on | Add-on | Add-on |

### C.2 Transformation (criterion 04; history under 05)

| # | Feature | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|
| F06 | Visual mapping designer | Built-in | Built-in | Out of scope | Add-on | Out of scope |
| F07 | Exadata SQL execution (pushdown) | Built-in | Built-in | Built-in | Limited | Limited |
| F08 | Distributed processing | Limited | Limited | Limited | Built-in | Built-in |
| F09 | Incremental upserts | Built-in | Built-in | Built-in | Implement | Implement |
| F10 | SCD type 2 history | Built-in | Built-in | Validate | Implement | Implement |

### C.3 Data correctness (criterion 05)

| # | Feature | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|
| F11 | Data quality rules | Built-in | Implement | Built-in | Implement | Implement |
| F12 | Reject quarantine | Built-in | Implement | Limited | Implement | Implement |
| F13 | Financial reconciliation | Implement | Implement | Implement | Implement | Implement |
| F14 | Schema changes | Limited | Limited | Limited | Limited | Limited |
| F15 | Backfill / late corrections | Implement | Implement | Implement | Implement | Implement |

### C.4 Orchestration and reporting (criterion 06)

| # | Feature | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|
| F16 | Dependency workflows | Built-in | Built-in | Limited | Add-on | Add-on |
| F17 | Calendar / event triggers | Limited | Limited | Add-on | Add-on | Add-on |
| F18 | Restart / checkpoint | Built-in | Built-in | Implement | Limited | Limited |
| F19 | Stream processing | Limited | Limited | Out of scope | Built-in | Built-in |
| F20 | Atomic report publication | Implement | Implement | Implement | Implement | Implement |

### C.5 Security and metadata (criterion 07)

| # | Feature | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|
| F21 | Role-based access | Built-in | Built-in | Add-on | Built-in | Limited |
| F22 | Secret management | Implement | Validate | Add-on | Validate | Add-on |
| F23 | Runtime audit / logs | Built-in | Built-in | Built-in | Built-in | Limited |
| F24 | Technical dependencies | Built-in | Built-in | Built-in | Built-in | Add-on |
| F25 | Source-to-report lineage | Add-on | Add-on | Add-on | Add-on | Add-on |

### C.6 Development and operations (criteria 08 and 09)

| # | Feature | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|
| F26 | Git / code review | Built-in | Limited | Built-in | Limited | Built-in |
| F27 | Environment promotion | Built-in | Built-in | Implement | Implement | Implement |
| F28 | CLI automation | Built-in | Built-in | Built-in | Built-in | Built-in |
| F29 | Monitoring / alerts | Limited | Built-in | Add-on | Built-in | Limited |
| F30 | HA / disaster recovery | Validate | Validate | Add-on | Validate | Add-on |

### C.7 AI integration (criterion 12)

| # | Feature | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|
| F31 | Local AI-assisted development | Implement | Validate | Add-on (self-hosted MCP) | Validate | Add-on |
| F32 | Call a local model endpoint | Implement | Implement | Add-on | Add-on (AI Inference service) | Implement |
| F33 | ML feature engineering / scoring | Implement | Implement | Limited | Built-in (MLlib) | Built-in (MLlib) |
| F34 | AI audit and repeatability | Implement | Implement | Implement | Implement | Implement |

### C.8 Open source and extensibility (criterion 13)

| # | Feature | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|---|
| F35 | Core licence / source access | Proprietary | Proprietary | Open source (Apache 2.0) | Mixed | Open source (Apache 2.0) |
| F36 | Extend / replace components | Limited | Limited | Built-in | Validate | Built-in |

### C.9 Label counts (F01–F34, F36; F35 is a licence label)

| Label | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|
| Built-in | 17 | 15 | 8 | 11 | 9 |
| Limited | 6 | 6 | 7 | 4 | 6 |
| Implement | 9 | 8 | 6 | 9 | 11 |
| Add-on | 2 | 2 | 11 | 7 | 8 |
| Validate | 1 | 4 | 1 | 4 | 0 |
| Out of scope | 0 | 0 | 2 | 0 | 1 |
| **Bank-built or bought (Implement + Add-on)** | **11** | **10** | **17** | **16** | **19** |

Reading: the two packaged ETL products come with the most out of the box; dbt, CDP and Spark each shift roughly half of the features onto the bank or onto additional components. Rows marked Implement for **everyone** (F13, F15, F20, F34) are bank intellectual property regardless of tool and should be designed once, tool-agnostically, in PL/SQL on Exadata ([[ETL Tool Comparison#6. Fit against the target architecture]]).

## Matrix D — Takasbank fit factors

Yes / No / Partly against the bank's situation, not against generic product merit.

| Fit factor | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|
| Transformation runs inside Exadata by default | Yes | Partly (pushdown coverage varies) | Yes | No (out and back) | No (out and back) |
| Needs a second compute estate | No | Partly (Integration Service domain) | No (small runner) | Yes (cluster + DR) | Yes (cluster + DR) |
| Readable / tunable by the Oracle DBA + PL/SQL team | Yes | Partly | Yes (SQL) | No | No |
| New skill profile required | ODI/KM developer | PC admin + developers | Python/CI owner | Cluster/platform team | Distributed-systems team |
| Can start Pilot A with zero procurement | No | No | **Yes** | No | Engine yes, service no |
| S2 batch from `sur` standby, SCN-consistent | Yes | Yes | Yes (bank ingestion) | Yes (+ consistency design) | Yes (+ consistency design) |
| S0 CDC without extra product | No | No | No | No | No |
| Trigger-free on prod Kale / read-only standby | Yes if JKMs avoided | Yes | Yes | Yes | Yes |
| Automic as house scheduler | Native CLI / Load Plan | Native CLI | Native CLI | Add-on / Build | Add-on / Build |
| Contractual support route exists today | Oracle | Informatica / partner (local roadmap unproven) | None | Cloudera (team does not exist) | None |
| Vendor product-direction risk | L | **H** | M (Core v1 vs Fusion) | L–M | L |
| Exit / migration effort | M | H | **L** | H | M |
| Existing bank entitlement | None (Oracle DB only) | TDM only — **no** PC rights | n/a | None | n/a |
| Disposition | **Lead shortlist** | **Challenger** | **Conditional** | **Defer** | **Specialist complement** |

## Matrix E — Risk heat map

Exposure of each candidate to the programme's main risk themes (H / M / L). Detail and mitigations in [[ETL Tool Comparison#8. Risk register by candidate]].

| Risk theme | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|
| Locality gate failed by telemetry, licence checks or assistants | L | **H** (cloud control plane) | M (telemetry, packages) | M (optional services) | M (components) |
| Hidden CDC dependency (GoldenGate / PowerExchange / connector) | **H** | **H** | M | M | M |
| Vendor discontinues or de-prioritises the on-prem product | L | **H** | M | L | L |
| No incident support path | L | M | **H** | M | **H** |
| Staffing gap vs team that exists | L | M | M | **H** | **H** |
| Second estate / data leaves Exadata | L | M | L | **H** | **H** |
| Correctness handoff (reject loss, duplicate publication) | M | **H** (full pushdown drops rejects) | M | M | **H** (at-least-once sinks) |
| In-house framework becomes unsupported product | L | L | M | M | **H** |
| Lock-in / exit cost | M | **H** | L | **H** | M |
| Tool purchase blocks first business result | **H** | **H** | L | **H** | M |
| **Count of H** | 2 | 6 | 1 | 4 | 5 |

## Matrix F — Proof-of-concept exposure

How much each P-test in [[ETL Proof of Concept and Acceptance]] can move a candidate's ratings or gate status (H = decisive, M = material, L = confirmatory). Use it to sequence the PoC: run the H cells first.

| Test | ODI | PC | dbt | CDP | Spark | Criterion / gate |
|---|---|---|---|---|---|---|
| P01 Disconnected deployment and operation | L | **H** | **H** | **H** | M | Gate 1 |
| P02 Oracle batch extraction and consistent loading | **H** (standby + SCN, no JKM triggers) | M | M (bank ingestion) | M | **H** (connection cap, consistency) | 03, 05 |
| P03 File and API ingestion | M | M | **H** | M | **H** | 03 |
| P04 Incremental changes and deletes | M | M | **H** (adapter strategies, hard deletes) | M | **H** (stage + MERGE) | 05 |
| P05 Historical correction and schema change | M | M | **H** (snapshot behaviour) | M | M | 05 |
| P06 Reconciliation and report semantics | M | **H** (pushdown reject loss) | M | **H** (cluster → Oracle) | **H** (duplicates) | 05, gate 3 |
| P07 Partial failure, restart and replay | **H** (Load Plan after partial commit) | **H** (pushdown vs recovery) | M | **H** | **H** | 06, gate 3 |
| P08 Restore and disaster recovery | M | M | **H** (no HA by default) | **H** (multi-service DR) | **H** | 06, 09 |
| P09 Controlled report, API and file delivery | M | M | M | **H** | **H** | 06 |
| P10 Concurrency, scale and cost of movement | **H** (headroom on `sur` with MSTR) | **H** (engine vs pushdown) | **H** (Exadata load) | **H** (out-and-back cost) | **H** | 04, 10 |
| P11 Security, entitlement and audit | M | M | **H** (secrets, roles external) | M | **H** (nothing on by default) | 07, gate 2 |
| P12 Release, upgrades, support and handover | M | **H** (local roadmap) | **H** (adapter owner) | **H** (cluster team) | **H** (service owner) | 09, gate 2 |
| **Decisive PoC (single run)** | Standby + file load, late correction, kill after partial commit, replay with unchanged totals | Complex report mapping under no/partial/full pushdown with reject, duplicate, outage | Incremental + snapshot + hard delete + failing test on local Exadata; Automic → ingestion → dbt → publish, egress blocked | Only after scope justification: source → cluster → Oracle with failed worker and target outage | Only for a justified workload: executor failure during JDBC writes; prove dedup and atomic visibility |

## Matrix G — Evidence confidence

| Dimension | ODI | PC | dbt | CDP | Spark |
|---|---|---|---|---|---|
| Product capability (documentation) | Medium–high | Medium (some pages reachable only via index) | Medium | Medium | High |
| Offered licensing / lifecycle | Medium (quote required) | **Low** | Medium (open source) | **Low** (bundle unpriced) | Medium |
| Bank fit / operations | Medium | Low | **Low** (adapter support, ops ownership) | Low (staffing) | **Low** (assembled service) |
| Cost | None | None | None | None | None |
| Gate status | Pending ×3 | Pending ×3 | Pending ×3 | Pending ×3 | Pending ×3 |

## How to update this matrix

1. Replace desk ratings in Matrix A with test-supported ratings after each P-test; recompute points as weight × rating ÷ 5 and fit as points ÷ 0.915. Keep the workbook as the system of record and copy from it.
2. Enter the cost rating only when comparable five-year quotes exist ([[ETL Vendor RFI and Commercial Evaluation#5. Five-year cost method]]); then publish the full weighted score and retire A.1.
3. Flip Matrix B cells from Pending to Pass/Fail with the acceptance evidence named in [[ETL Proof of Concept and Acceptance]]; a Fail removes the column from Matrices A, D and F.
4. Record the final decision in [[ETL Selection Decision Record]].

Related: [[ETL Tool Comparison]] · [[ETL Tool Evaluation]] · [[ETL Proof of Concept and Acceptance]] · [[ETL Vendor RFI and Commercial Evaluation]] · [[ETL Selection Decision Record]] · [[Başlangıç Yaklaşımı]] · [[Proje Planı]]
