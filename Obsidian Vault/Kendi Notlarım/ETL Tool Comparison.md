---
title: ETL Tool Comparison
aliases: [ETL Araç Karşılaştırması, ETL Comparison Document]
created: 2026-10-13
updated: 2026-10-13
status: desk-assessment-no-bank-tests
language: en
tags: [dwh, etl, comparison, architecture, procurement]
---

# ETL Tool Comparison

Comprehensive comparison of five candidate solutions for the Takasbank on-premises enterprise data warehouse: **Oracle Data Integrator (ODI)**, **Informatica PowerCenter**, **dbt (Core + dbt-oracle)**, **Cloudera Data Platform (on premises)** and **Apache Spark (on premises)**.

This note **owns the narrative comparison and the architect's reasoning**. It does not replace:

- [[ETL Tool Evaluation]] — owns the scoring method, weights and rating scale.
- The scoring workbook `outputs/.../etl-evaluation/ETL-Tool-Comparison.xlsx` — owns the cell-level comparison grid (sections 01–15, 36 features × 5 products) and the current provisional ratings. Ratings quoted below are copied from it.
- [[ETL Proof of Concept and Acceptance]] — owns the test protocol (P01–P12, workloads W1–W4).
- [[ETL Vendor RFI and Commercial Evaluation]] — owns vendor questions and the five-year cost method.
- [[ETL Selection Decision Record]] — owns the final decision once evidence exists.

> [!warning] Status of the evidence
> Everything here is a **desk assessment from official documentation and the bank's own notes** (official sources rechecked 12 October 2026). No candidate has been installed, tested or quoted at Takasbank. All three mandatory gates are *Pending* for every candidate; the cost criterion is *unassessed*. Numbers are architect judgment on the 0–5 desk scale, not acceptance results and not a procurement ranking.

## 1. Executive summary

- **The decision is not "which ETL tool is best"; it is "which complete, supportable, fully on-premises service moves and transforms Oracle-heavy data into an Exadata EDW with the team Takasbank has".** Framed that way, the field splits into two groups: tools that run SQL *inside* Exadata (ODI, dbt, and PowerCenter with pushdown) and platforms that move data *out* to a second compute estate and back (Cloudera, Spark).
- **Lead shortlist: Oracle Data Integrator.** Best architectural fit for an estate that is ~90% Oracle, with a DBA/PL-SQL team, Exadata as the common target, and a need for Load Plan restart and Oracle-native SCD/merge/check knowledge modules. Weaknesses: licence cost, no log-based CDC without GoldenGate, trigger-based journalising unusable on a read-only replica, and a thin "native" Git/DevOps story.
- **Challenger: Informatica PowerCenter.** Broadest packaged connectivity and the most mature visual ETL workflow, but the product's on-premises future is the single biggest risk: BI Technology told Takasbank in 2024 that Informatica no longer sells on-prem, Informatica's strategic product is cloud-managed IDMC/CDI-PC (which fails the locality gate), and the only Informatica entitlement the bank holds is TDM (masking), not PowerCenter.
- **Conditional: dbt Core + dbt-oracle.** The right *transformation discipline* (SQL in Git, tests, documentation, lineage graph, zero licence fee) and the only candidate that can start **without procurement**, which matters given slow purchasing. It is not a complete ETL service: no ingestion, no scheduler, no HA, and the Oracle adapter is community/Oracle-maintained with "dbt support: not supported" on the official setup page.
- **Defer as primary ETL: Cloudera Data Platform.** A capable, well-governed platform (Ranger, Atlas, NiFi, Spark) that solves problems Takasbank does not have: 10 TB of relational data, an Oracle target, and no lake, streaming or distributed AI workload with a business case. It adds a second estate, a cluster team and a round trip back into Exadata.
- **Specialist complement only: Apache Spark.** Excellent engine primitives and open source, but on its own it is not an integration service: everything around it (ingestion, CDC, orchestration, catalog, security, DR, support) is bank-built or bank-contracted. At-least-once sink semantics to Oracle require engineering to avoid duplicate publication.
- **Recommended path (consistent with [[Başlangıç Yaklaşımı]]):** start Pilot A with no-procurement tooling (PL/SQL framework or dbt Core, Git, Automic), run the ODI and PowerCenter commercial/PoC track in parallel, and close the selection at the Pilot B exit gate with measured evidence. Do not let the tool purchase block the first delivered business outcome.

## 2. What Takasbank actually needs from the tool

Derived from the vault, not from vendor material. Every statement below is a requirement the comparison must answer.

### 2.1 Hard constraints (mandatory gates)

- **Fully on premises.** Runtime, control plane, metadata, logs, CI, packages, licence checks, support diagnostics and any AI assistant must stay inside the bank ([[ETL Tool Evaluation#Three mandatory requirement groups]]). Regulated FMI; data cannot leave.
- **Oracle Exadata remains the EDW and serving target.** Three Exadatas with ample disk and idle CPU already exist ([[Fiziksel Topoloji - Teknik Taraf]]). Any candidate that needs a second compute estate must justify moving data out and back.
- **No touching prod Kale.** No triggers, no MV logs, no dblinks on the production OLTP. Every Oracle read goes through the `sur` standby replica ([[Sistemler ve Servisler#2.8 Araç ne olursa olsun yapılmayacaklar]]).
- **Supportable by the team that exists.** 1 BI manager + 2 MSTR developers, strong Oracle DBAs and PL/SQL, UG analysts who know the tables; no DWH/ETL, Python-platform or Kafka team; no 24/7 operations team for replication ([[Firmalarla Yapılan DWH Görüşmeleri]], [[Obase Takasbank Değerlendirme Raporu Ağustos 2024]]).

### 2.2 Workload shape

- **Sources:** Kale (~10 TB, ~7,000 main + ~3,000 backup tables, no ERD), ARSIV, CEKDB (cheque images in CLOBs), BIST Replica BIDB (200 tables/200 procedures, 90% of EOD flow is Replica → Kale), FTP/CSV member and fund files, EPİAŞ web services. Mostly relational, modest volumes: SWIFT ~1M messages/day (2bn rows history), fund contracts ~9M rows/day (deleted at source after 5 days), energy 5–10k rows/day ([[DWH Sunum Temmuz 2025]], [[Enerji UG]]).
- **Latency classes:** S2 end-of-day dominates; S1 intraday for a few products (fund corrections 08:00–17:45); S0 near-real-time not yet proven for any product; S3 scheduled files; S4 backfill/replay ([[DWH Hedef Mimarisi v2#Veri alma ve gecikme sınıfları]]).
- **Correctness demands:** historic rows get updated in place; T+2 → T+1 settlement change by end-2026; regulatory outputs need "as originally reported" and corrected versions; business reconciliation against UG reports is already standard practice ([[Aktif Sorular]], [[Takasbank Genel Bilgilendirme]]).
- **Operations:** Automic is the house scheduler; end-of-day completion is currently a manual email; two conflicting EOD timelines ([[Ortamlar hakkında]], [[Takasbank Genel Bilgilendirme 2]]).
- **Procurement:** slow. A tool that needs a purchase before the first pilot delays the first business result by the procurement cycle.

### 2.3 What this rules out before scoring

- Any **SaaS or cloud-managed** ingestion/transform plane (IDMC, CDI-PC with cloud control plane, dbt platform/cloud, Fivetran, Matillion, Airbyte Cloud).
- Any tool whose **only** Oracle change capture is trigger-based or watermark-based on prod Kale.
- Any architecture that **requires a streaming platform** (Kafka) as a prerequisite, since no team owns one.

## 3. Evaluation frame

Weights and scale are owned by [[ETL Tool Evaluation]]; summarised here for readability.

| # | Criterion | Weight |
|---|---|---|
| 03 | Source integration and data movement | 9.35% |
| 04 | Transformation and Exadata efficiency | 11.05% |
| 05 | Data correctness, history and reconciliation | 17.00% |
| 06 | Scheduling, operational reporting and recovery | 10.20% |
| 07 | Security, metadata and auditability | 13.60% |
| 08 | Development, testing and change management | 5.95% |
| 09 | Operating model, support and lifecycle | 9.35% |
| 10 | Five-year cost and exit effort | 8.50% |
| 12 | AI integration (local only) | 8.00% |
| 13 | Open-source licensing and flexibility | 7.00% |

Mandatory gates (pass/fail, outside the score): fully on-premises operation; security, support and operating acceptance; correctness, deadlines and recovery tests.

Desk scale: 0 unsuitable · 1 major gaps · 2 material extra work · 3 credible documented path · 4 strong architectural fit · 5 reserved for demonstrated superiority (never awarded on paper).

## 4. Candidate profiles

Each profile answers the same questions: what it is, how it would be deployed at Takasbank, what it does well here, where it falls short here, licensing/support/exit, and the decisive proof-of-concept.

### 4.1 Oracle Data Integrator (ODI)

**What it is.** Oracle's ELT tool. Metadata lives in master/work repositories (Oracle schemas); runtime agents (standalone, colocated or Java EE) orchestrate code that **executes on the source or target database** according to Knowledge Modules (LKM load, IKM integrate, CKM check, JKM journalise, SKM service). Documentation baseline 14.1.2. Load Plans give serial/parallel/conditional steps with restart points. Version control integrates with external Git/Subversion.

**Deployment at Takasbank.** Repositories in the DWH database; one standalone agent colocated with the DWH (the July 2025 deck already argued ETL should sit with the ODS/DWH, [[DWH Sunum Temmuz 2025#Slayt 4 — Önceki toplantı özeti]]); LKMs reading from the `sur` standby via dblink-from-DWH or JDBC; IKMs generating `MERGE`/SCD SQL on Exadata; CKMs feeding the `CTL_` quality tables; Load Plans invoked from Automic after the EOD completion event. Files via File technology KMs; Replica BIDB via Oracle KMs; EPİAŞ web services via procedures or a landing service.

**Strengths here.**
- Pushdown is the default, not an option: transformation SQL runs on Exadata, which is exactly where the bank has bought compute and skills. The DBA team can read, tune and `EXPLAIN PLAN` everything ODI generates.
- Oracle-native KMs cover the bank's bread and butter: incremental merge, SCD type 2, constraint checking with error tables, file loading, partition exchange patterns.
- Load Plans with restart boundaries map cleanly onto the `CTL_yukleme` / replay design. The agent can be driven by Automic.
- Single vendor with the database; support boundaries between ODI, agent, JDBC and Oracle incidents are at least within one escalation path.
- Lowest retraining cost for a PL/SQL team: generated code is SQL they already understand.

**Weaknesses here.**
- **No log-based CDC without GoldenGate.** The built-in Oracle JKMs (Simple, Consistent, Update Date) all use triggers, which are forbidden on prod Kale and impossible on a read-only standby. So for S0/S1 ODI needs GoldenGate (separate licence, separate operations burden the DBAs explicitly fear) or a snapshot/diff approach.
- **Licence and middleware.** New licence (Ondata: priced on target database cores). Repository, agent, JDK and possibly WebLogic for Java EE agents are lifecycle items. Non-prod/DR entitlements must be explicit.
- **DevOps maturity is adequate, not great.** Git integration exists but object-level merging, automated testing and CI are weaker than code-first tools; custom KMs are a maintenance liability across upgrades.
- **Transaction state is not retained after agent failure**; restart must align with committed target state. Fine if the `CTL_` design is idempotent, dangerous if someone assumes the tool handles it.
- Visual mappings slow down bulk pattern work (hundreds of near-identical landing tables) unless generation/scripting (ODI SDK, Groovy) is used.

**Licensing, support, exit.** Proprietary; priced via Oracle licence metrics; support through Oracle. Exit: generated SQL is reusable, but KMs, scenarios, topology and Load Plan dependencies are proprietary metadata that must be re-expressed in another tool.

**Provisional desk ratings (workbook):** 03 → 4 · 04 → 4 · 05 → 3.5 · 06 → 4 · 07 → 3 · 08 → 3 · 09 → 4 · 12 → 2 · 13 → 2 · 10 → unassessed.

**Decisive PoC.** Load from the `sur` standby with a defined SCN boundary plus a file feed; inject a late backdated correction; kill the Load Plan after a partial commit; prove restart with unchanged totals on replay and no partially refreshed report set. Confirm Automic ↔ Load Plan invocation and status exchange. Quote CDC separately.

### 4.2 Informatica PowerCenter

**What it is.** The classic enterprise ETL suite: a domain with Repository Service and Integration Service, Designer/Workflow Manager clients, visual mappings and workflows, broad native connectors, optional pushdown optimisation (source, target or full), partitioning/grid, recovery strategies, and add-ons (PowerExchange for CDC, Data Quality, Enterprise Data Catalog). Takasbank already runs **Informatica TDM** for masking, so the vendor relationship exists.

**Deployment at Takasbank.** Fully local PowerCenter 10.5.x domain on its own servers near the DWH; mappings reading the standby and files; target pushdown to Exadata for set-based work, engine processing for transformations Oracle pushdown does not cover; workflows triggered by Automic; PowerExchange only if an S0 product is proven.

**Strengths here.**
- Most mature visual ETL workflow in the market; large Turkish talent pool (MKK uses it, per [[DWH Sunum Eylül 2024]]).
- Broadest packaged connectivity: Oracle, flat files, XML/JSON, web services, other RDBMS, with reject handling, session logs and a central Workflow Monitor out of the box.
- Repository-based team development, deployment groups and metadata that lineage/catalog products can scan.
- An existing vendor relationship (TDM) may simplify commercial negotiation, though it gives **no** PowerCenter rights.

**Weaknesses here.**
- **Product direction.** Informatica's strategic platform is cloud-managed IDMC; CDI-PC is PowerCenter runtime with cloud control plane, which **fails the locality gate**. BI Technology stated in the 2024 meeting that Informatica no longer sells on-prem and that "Informatica ETL investment stopped" ([[Firmalarla Yapılan DWH Görüşmeleri#Sayfa 1 — BI Technology / Ahmet Kaplan görüşmesi]]). Informatica's corporate ownership changed in 2025; the written lifecycle commitment for a fully local PowerCenter release is the first question to ask, and the deal-breaker if the answer is weak.
- **Pushdown is partial and changes behaviour.** Full pushdown of the Oracle Update Strategy does not write rejected rows to reject files and does not support incremental session recovery; mapping/function coverage must be tested one by one. Without pushdown, data flows through the Integration Service: a second compute path next to an idle Exadata.
- **Second engine to run.** Domain, services, clients, repository DB, patching, HA licensing. Operations burden sits between ODI and Cloudera.
- Git-based review is weak: repository versioning is an entitlement, and committing XML exports to Git does not give semantic diffs or merges.
- CDC is an extra licensed product (PowerExchange) with its own log access and operations.

**Licensing, support, exit.** Proprietary; licence metrics per CPU/core and per connector/option; support via Informatica or partner (BI Technology). Exit: mappings/workflows/repository metadata are proprietary; an XML export is not a runnable pipeline elsewhere.

**Provisional desk ratings (workbook):** 03 → 4 · 04 → 3 · 05 → 3 · 06 → 3.5 · 07 → 3 · 08 → 2.5 · 09 → 3 · 12 → 2 · 13 → 2 · 10 → unassessed.

**Decisive PoC.** One complex SQL report mapping run with no, partial and full pushdown; inject a reject, a duplicate and a session outage; reconcile final values and prove predictable rerun. Before any test: a written, fully local product offer with support horizon.

### 4.3 dbt (dbt Core v1 + dbt-oracle)

**What it is.** A SQL-first transformation framework. Models are `SELECT` statements in Jinja-templated SQL with YAML metadata; dbt compiles them into DDL/DML executed **in the target database** (here Oracle via the Apache-2.0 `dbt-oracle` adapter maintained by Oracle). It brings a dependency DAG, incremental materialisations, snapshots (SCD2), data tests, documentation and lineage graph, packages, and a CLI that fits Git/CI. dbt Core v1 is Apache 2.0. dbt is **not** an ingestion tool, scheduler, or runtime service. Newer dbt engines (Fusion) and the dbt platform are under different licences/terms and are outside this candidate.

**Deployment at Takasbank.** A local Python runtime (pinned Core v1 + dbt-oracle + Oracle driver) on a small server or container; project in the bank's Git; Automic calls `dbt run`/`dbt test` per layer after the EOD event; models build `STG_` → `CORE_` → `DM_` → `PUB_` on Exadata; tests feed `CTL_kalite_sonuc`; `dbt docs` artifacts give model-level lineage. **Ingestion is a separate component**: SCN-consistent extraction from the standby via PL/SQL/dblink, external tables for files, a small landing service for web services.

**Strengths here.**
- **Zero licence, zero procurement.** Can start in week one of Pilot A. This is the only candidate that satisfies the "do not let the purchase block the first business result" principle.
- **Pushdown by construction.** 100% of transformation SQL runs on Exadata; nothing moves through a middle tier.
- **Engineering discipline that the bank lacks today**: version control, code review, automated data tests, environment promotion, generated documentation, dependency graph. The team gets this for free instead of inventing it.
- Readable artefact for a PL/SQL team: it is SQL. Macros reduce the hundreds-of-landing-tables problem to a template.
- Open source: the bank can fork, patch and rebuild; no exit lock-in beyond Oracle SQL itself.

**Weaknesses here.**
- **Not a complete ETL service.** No connectors, no CDC, no file intake, no scheduler, no monitoring, no HA. These are real workstreams the bank must own (the vault's `CTL_`/`LND_` design already describes most of them, so the gap is smaller than for Spark, but it is not zero).
- **Support boundary.** The official Oracle setup page labels dbt support as *not supported*; the adapter README emphasises Autonomous Database. Oracle maintaining the code on GitHub is not an incident SLA. Ephemeral materialisation is unsupported on Oracle; incremental strategies and snapshot/hard-delete behaviour must be proven on the bank's exact Exadata release.
- **Python runtime in an Oracle shop.** Someone must own Python, pip mirrors, driver versions and upgrades. The engine roadmap (Core v1 vs Fusion) adds lifecycle risk.
- Snapshots capture state at run time, not every intermediate change; row-level bitemporal correction logic is still written by the bank.
- Telemetry must be disabled (`send_anonymous_usage_stats: false`) and egress proven blocked.

**Licensing, support, exit.** Apache 2.0 core and adapter; Oracle/Exadata remains proprietary. Support: none contractual unless a partner is engaged. Exit: SQL and Git files move anywhere; macros/materialisations and the orchestration wrapper need rework.

**Provisional desk ratings (workbook):** 03 → 2 · 04 → 4 · 05 → 3 · 06 → 2.5 · 07 → 2.5 · 08 → 4 · 09 → 2 · 12 → 3 · 13 → 4 · 10 → unassessed (but licence fee is zero; cost is people and surrounding components).

**Decisive PoC.** Incremental model + snapshot + hard-delete case + failing test on local Exadata; drive scheduler → ingestion → dbt → tests → publication from Automic with egress blocked; rebuild from a local package mirror; name who fixes an adapter defect.

### 4.4 Cloudera Data Platform (Private Cloud Base, on premises)

**What it is.** A commercial distribution of the Hadoop/Spark ecosystem: Cloudera Manager, HDFS/Ozone storage, Hive/Impala/Spark engines, Iceberg table format, Ranger (authorisation/audit), Atlas (catalog/lineage), Kafka and NiFi (Flow Management) as optional services, plus Data Services (containerised ML/AI inference, data engineering) on Kubernetes. Subscription per node; air-gapped installation is documented.

**Deployment at Takasbank.** A new cluster (production + DR, minimum 5–10 nodes realistically), NiFi or Spark JDBC pulling from the standby and files into Iceberg/HDFS, Spark/Hive transformations, then **loading results back into Exadata** for MSTR and operational serving. Ranger/Atlas for governance inside the cluster; separate integration for lineage into Oracle and MSTR.

**Strengths here.**
- Mature, supported governance stack (Ranger policies, Atlas lineage, audit) out of the box inside the platform.
- Horizontally scalable for genuinely large or semi-structured data; native streaming (Kafka, Flink, Structured Streaming); ML/AI services on premises.
- One commercial support contract for the whole distribution; Cloudera Manager for health, alerts and rolling upgrades.
- If Takasbank ever needs a lake for cheque images, SWIFT raw messages, or AI feature stores, this is the standard answer.

**Weaknesses here.**
- **Solves a problem the bank does not have.** 10 TB relational, Oracle target, Oracle team, no streaming/lake requirement with a business owner. Data would leave Exadata, be transformed, and be loaded back: two transfers, two copies, two security models, two capacity plans.
- **Second estate, second team.** Cluster, storage, Kubernetes (for Data Services), Kerberos/Ranger administration, multi-service upgrade sequencing. None of these roles exist today ([[DWH Sunum Aralık 2024#Slayt 8 — Takasbank: çalışılması gereken yönlerimiz]] already flags the staffing gap for a plain DWH).
- Cost: per-node subscription + hardware + DR + staff, while three Exadatas sit mostly idle.
- Oracle CDC still needs a separate connector/product; NiFi is a separately scoped service.
- Correctness across the cluster → Oracle handoff needs reconciliation by load id; Iceberg transactions do not make the Oracle report set atomic.

**Licensing, support, exit.** Mixed (open-source components under commercial distribution terms); subscription-dependent binary/update access; exit means migrating table formats, policies, flows and code. Component-level licence inventory required.

**Provisional desk ratings (workbook):** 03 → 3 · 04 → 2 · 05 → 2.5 · 06 → 2.5 · 07 → 3.5 · 08 → 3 · 09 → 2 · 12 → 3 · 13 → 3 · 10 → unassessed.

**Decisive PoC (only after a scope justification).** Source → cluster → Oracle with a failed worker and a target outage; count every byte transferred; reconcile report output; price the exact bundle and the operating team.

### 4.5 Apache Spark (standalone, on premises)

**What it is.** The open-source distributed processing engine (Apache 2.0): driver/executors on a cluster manager (standalone, YARN or Kubernetes), DataFrame/SQL APIs in Scala/Python/Java, Structured Streaming, MLlib, JDBC and file data sources. On its own it is an engine, not a platform: ingestion, CDC, orchestration, catalog, lineage, security, metrics, DR and support are all separate choices.

**Deployment at Takasbank.** A Spark cluster (Kubernetes or standalone), Spark JDBC reads from the standby, Python/Scala transformation jobs, staged writes to Oracle followed by a controlled `MERGE`, an external orchestrator (Automic or Airflow), a secrets store, a catalog/lineage listener, and a bank-written framework for run ids, idempotency and publication gates.

**Strengths here.**
- Open source, fully inspectable, no licence fee; largest community of any candidate.
- Strong software-engineering workflow for code-first teams (tests, packaging, CI).
- Distributed compute and MLlib where a workload genuinely exceeds a single Oracle instance; Structured Streaming where a true S0 requirement exists.
- Flexible enough to handle semi-structured data (SWIFT raw text, JSON from web services) that is awkward in pure SQL.

**Weaknesses here.**
- **Everything else is bank-built.** No connectors beyond JDBC/files, no Oracle CDC, no scheduler, no business calendar, no reject quarantine, no lineage, no security by default, no incident SLA. The "framework" the bank would write is, in effect, an in-house ETL product with a maintenance tail that outlives the people who wrote it.
- **Wrong skill profile.** The team is Oracle/PL-SQL; Spark needs JVM/Python distributed-systems engineering and cluster operations.
- JDBC pushdown is selective; most work happens in executors, so data leaves Exadata and comes back, with connection-count and consistency management on the source side.
- `foreachBatch`/JDBC writes are at-least-once by default; task retries can duplicate committed rows unless sink-side idempotency is engineered.
- For 10 TB of relational data, a tuned Oracle path will usually beat extract → shuffle → load end to end.

**Licensing, support, exit.** Apache 2.0 core; dependency and connector licences separate; support only via a contracted provider or an internal platform team. Exit is cheap for code, expensive for the surrounding bespoke framework.

**Provisional desk ratings (workbook):** 03 → 2 · 04 → 2 · 05 → 2.5 · 06 → 2 · 07 → 2 · 08 → 3.5 · 09 → 1.5 · 12 → 3 · 13 → 4 · 10 → unassessed.

**Decisive PoC (only for a justified workload).** Executor failure during JDBC writes, retry and backlog; prove committed-key deduplication and atomic report visibility; name the service owner for a 03:00 incident.

## 5. Head-to-head by criterion

Ratings are the workbook's provisional desk values (0–5). Commentary is the architect's reading for Takasbank.

### 5.1 Scorecard summary

| Criterion (weight) | ODI | PowerCenter | dbt Core | Cloudera | Spark |
|---|---|---|---|---|---|
| 03 Source integration (9.35) | 4 | 4 | 2 | 3 | 2 |
| 04 Transformation & Exadata efficiency (11.05) | 4 | 3 | 4 | 2 | 2 |
| 05 Correctness, history, reconciliation (17.0) | 3.5 | 3 | 3 | 2.5 | 2.5 |
| 06 Scheduling, ops reporting, recovery (10.2) | 4 | 3.5 | 2.5 | 2.5 | 2 |
| 07 Security, metadata, audit (13.6) | 3 | 3 | 2.5 | 3.5 | 2 |
| 08 Development, testing, change (5.95) | 3 | 2.5 | 4 | 3 | 3.5 |
| 09 Operating model, support, lifecycle (9.35) | 4 | 3 | 2 | 2 | 1.5 |
| 10 Five-year cost & exit (8.5) | unassessed | unassessed | unassessed | unassessed | unassessed |
| 12 AI integration, local only (8.0) | 2 | 2 | 3 | 3 | 3 |
| 13 Open-source licensing & flexibility (7.0) | 2 | 2 | 4 | 3 | 4 |
| **Provisional fit / 100, cost excluded (workbook formula)** | **67.3** | **59.2** | **58.6** | **54.1** | **47.6** |

The fit score rescales the nine assessed criteria (91.5%) to 100 and excludes the unquoted cost criterion. Per-criterion point contributions, the capability grid F01–F36, risk heat map and PoC exposure are in the comparison matrix workbook [ETL-Tool-Comparison-Matrix.xlsx](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Comparison-Matrix.xlsx) (sheets A–G), the self-contained [HTML page](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Comparison-Matrix.html) and the interactive [canvas view](https://cursor.com/canvas/store-c51f9d48-85cf-4b41-b001-38182c25e2b0/f187495b-c946-4d33-9346-09a13473eda3). Cost **can change the order between PowerCenter and dbt** (0.6 points apart) but would need a near-maximal cost-rating gap to displace ODI (sheet *A1 Cost sensitivity*), which is why the selection waits for quotes and PoC evidence rather than price alone. The spread between Cloudera/Spark and the top three is not a cost artefact; it comes from solution completeness and operating model.

### 5.2 Criterion-by-criterion reading

**03 Source integration and data movement.** ODI and PowerCenter lead through packaged Oracle and file connectivity; both still need a separately licensed CDC product for redo-log capture (GoldenGate / PowerExchange). dbt scores low because it has no ingestion at all; the bank's own `LND_` design must supply it. Cloudera covers movement through NiFi/Spark JDBC but adds hops. Spark has JDBC/file primitives only. **For Takasbank the real question is S2 batch from the standby plus files; all five can do that, and only ODI/PowerCenter do it without bank-written code.**

**04 Transformation and Exadata efficiency.** ODI and dbt execute SQL on Exadata by design and tie at 4. PowerCenter can push down but coverage and reject/recovery behaviour change under full pushdown. Cloudera and Spark move data out and back, which only pays off when the transformation does not fit Oracle, and nothing in the inventory suggests that.

**05 Data correctness, history and reconciliation (the heaviest weight).** No tool delivers the bank's rules (bitemporal corrections, cross-market party identity, authority matrix, publication gating); all of them provide building blocks. ODI's CKM/SCD/merge KMs slightly lead; dbt's tests and snapshots are strong for *detection* but the correction logic is hand-written; PowerCenter's full pushdown silently drops rejects; Cloudera/Spark add a cluster → Oracle handoff to reconcile. **This criterion is decided by the `CTL_`/reconciliation design, not by the tool.**

**06 Scheduling, operational reporting and recovery.** ODI Load Plans and PowerCenter workflows have native restart semantics; dbt reruns models idempotently but has no calendar, alerting or HA; Cloudera Manager helps platform health but not business-date readiness; Spark has task retries, not scheduling. **Automic is the house scheduler regardless of tool**, so the native scheduler matters less than clean CLI/API invocation and status return, which all five offer.

**07 Security, metadata and auditability.** Cloudera leads on paper because Ranger/Atlas ship with it, but only for objects inside the cluster; lineage into Oracle and MSTR is integration work for everyone. ODI/PowerCenter have repository-level security and execution logs. dbt gives a dependency graph and artefacts, not column lineage or IAM. Spark has no security enabled by default. **PowerDesigner ownership/sensitivity, VPD/redaction in Oracle and MSTR entitlements do most of the real work in every scenario.**

**08 Development, testing and change management.** dbt is the clear leader: text SQL/YAML in Git, automated tests, CI. Spark is strong for code-first teams. ODI has documented Git integration and scenarios/contexts. PowerCenter's repository versioning is an entitlement and does not merge semantically. Cloudera depends on which tools are chosen (notebooks vs code vs flows).

**09 Operating model, support and lifecycle.** ODI leads: one vendor with the database, SQL output the DBAs can own. PowerCenter plausible but with product-direction risk. dbt has no contractual support path for the Oracle adapter. Cloudera needs a cluster team. Spark has no incident service at all. **This criterion is where Cloudera and Spark lose for Takasbank specifically, independent of their technical merit.**

**12 AI integration (local only).** Nobody has a credited native on-prem copilot. dbt's self-hosted MCP server, Spark MLlib and Cloudera's optional AI Inference service give credible local paths (3); ODI and PowerCenter rely on command tasks/procedures calling an internal model (2). Cloud assistants (CLAIRE GPT) earn zero. Low differentiation; the model host and audit design matter more than the ETL tool.

**13 Open-source licensing and flexibility.** dbt Core and Spark are Apache 2.0 (4); Cloudera is mixed (3); ODI and PowerCenter are proprietary with extension points (2). Oracle/Exadata is proprietary for everyone and excluded from tool openness.

## 6. Fit against the target architecture

How each candidate maps onto the layers in [[Başlangıç Yaklaşımı]] and [[DWH Hedef Mimarisi v2]]. "Native" means the tool does it with configuration; "Build" means bank SQL/code/design; "Add-on" means another product.

| Architecture element | ODI | PowerCenter | dbt Core | Cloudera | Spark |
|---|---|---|---|---|---|
| Read from `sur` standby, SCN-consistent (S2) | Native (LKM + `AS OF SCN` SQL) | Native (source qualifier SQL) | Build (PL/SQL/dblink ingestion) | Native (JDBC) + Build consistency | Native (JDBC) + Build consistency |
| File intake with manifest/quarantine | Native KMs + Build controls | Native + Build controls | Build (external tables) | Add-on NiFi + Build | Build |
| Web-service / API intake | Build (procedure) | Native/Validate connector | Build (landing service) | Add-on NiFi | Build |
| S0 redo-log CDC | Add-on GoldenGate | Add-on PowerExchange | Add-on | Add-on connector | Add-on connector |
| `CTL_` batch control, EOD event, replay by load id | Build on Load Plan variables | Build on workflow params | Build (macros + Automic) | Build | Build |
| `LND_` immutable landing | Native load, Build metadata | Native load, Build metadata | Build | Native (Iceberg) + Build Oracle copy | Build |
| `CORE_` bitemporal merge | Native IKM + Build correction rules | Native SCD + Build rules | Native incremental/snapshot + Build rules | Build | Build |
| `DM_` star schemas on Exadata | Native | Native | Native | Load-back + Build | Load-back + Build |
| `PUB_` versioned regulatory snapshots, hashes | Build | Build | Build | Build | Build |
| Quality tests → `CTL_kalite_sonuc` | Native CKM + Build | Build | Native tests + Build persistence | Build | Build |
| Automic orchestration | Native CLI/Load Plan | Native CLI | Native CLI | Add-on/Build | Add-on/Build |
| Column lineage source → MSTR | Add-on catalog | Add-on catalog | Add-on catalog | Atlas inside cluster + Add-on | Add-on |
| Runs with zero procurement | No | No | **Yes** | No | Yes (engine), No (service) |
| Fits Oracle/PL-SQL team skills | **Yes** | Partly | Yes (SQL) + Python runtime | No | No |

Observation: the rows marked "Build" for everyone (control plane, publication, reconciliation) are the bank's intellectual property regardless of tool. They should be designed once, tool-agnostically, in PL/SQL on Exadata, so that the tool decision at the Pilot B gate does not force a rewrite.

## 7. Total cost of ownership structure

No prices exist. This section fixes **what must be priced** so that the five-year comparison ([[ETL Vendor RFI and Commercial Evaluation#5. Five-year cost method]]) is like-for-like.

| Cost line | ODI | PowerCenter | dbt Core | Cloudera | Spark |
|---|---|---|---|---|---|
| Software licence / subscription | New Oracle licence (per target core); non-prod/DR rights | New PowerCenter licence + options (pushdown, partitioning, HA); connectors | None (Apache 2.0) | Per-node subscription, Base + optional services | None (Apache 2.0) |
| CDC (only if S0 proven) | GoldenGate licence | PowerExchange licence | Third-party CDC | Connector/service | Connector/service |
| Infrastructure | Agent host(s), repository schemas on existing Exadata | Domain servers, repository DB, HA pair | Small runner host/container | New cluster: prod + DR nodes, storage, K8s for Data Services | New cluster: prod + DR, storage |
| Incremental Exadata capacity | Transformation load on DWH DB | Lower if engine-side, higher if pushdown | Transformation load on DWH DB | Load-back only | Load-back only |
| Implementation | KM/Load Plan build; medium | Mapping build; medium | SQL/macro build + ingestion/scheduler wrappers; medium | Platform build + pipelines + Oracle return path; high | Framework + pipelines; highest |
| Operating staff | ODI developer + DBA share | PowerCenter admin + developers + DBA share | SQL engineers + Python/CI owner | Cluster/platform team (new) + data engineers | Platform/distributed-systems team (new) + data engineers |
| Support contract | Oracle | Informatica/partner | Partner or none | Cloudera | Provider or none |
| Training | Low for PL/SQL team | Medium | Low (SQL) + Git/CI | High | High |
| Exit / migration effort | Medium (SQL reusable, metadata not) | High (proprietary mappings) | Low (SQL + Git) | High (formats, policies, flows) | Medium (code portable, framework not) |

Expected shape (to be confirmed by quotes): dbt has the lowest *software* cost and a moderate *people* cost; ODI has a meaningful licence cost but the lowest *delta staffing*; PowerCenter sits between them on licence with higher platform operations; Cloudera and Spark carry a new-team cost that dwarfs any licence saving at Takasbank's scale.

## 8. Risk register by candidate

| Candidate | Top risk | Mitigation / evidence required |
|---|---|---|
| ODI | GoldenGate assumed "included" or required for pilot; trigger JKMs proposed on replica | Scope CDC separately; batch from standby with SCN; written confirmation that no S0 product is in Pilots A/B |
| ODI | Custom KMs become unmaintained after upgrades | Minimise custom KMs; prefer standard Oracle KMs + PL/SQL procedures |
| PowerCenter | Vendor discontinues or de-prioritises fully local PowerCenter; only cloud control plane offered | Written lifecycle/support horizon before PoC; reject CDI-PC/IDMC at the gate |
| PowerCenter | Full pushdown silently discards rejects; non-pushdown runs through a second engine | Explicit reject reconciliation; test pushdown coverage per mapping |
| dbt | Adapter defect on local Exadata with no support path | Pin versions; partner support or accept internal ownership; PoC on exact release |
| dbt | "Transformation works" mistaken for "ETL service works" | Scope ingestion, scheduler, monitoring, HA explicitly in Pilot A |
| dbt | Engine roadmap (Core v1 vs Fusion) and Python runtime ownership | Stay on Core v1 LTS line; name a Python/CI owner |
| Cloudera | Second estate without a workload that needs it | Require a business owner for a lake/streaming/AI use case before any PoC |
| Cloudera | Cluster team does not exist | Staffing plan and cost in the business case, not in the tool score |
| Spark | Bespoke framework becomes an unsupported in-house ETL product | Only as a complement for a proven distributed workload; never primary |
| All | Oracle locality gate failed by telemetry, licence checks or assistants | P01 disconnected-operation test with egress blocked |
| All | Tool selection blocks the first business result | Start Pilot A tool-agnostically; decide at Pilot B exit |

## 9. Recommendation

1. **Shortlist ODI (lead) and PowerCenter (challenger) for the commercial/PoC track.** Issue the RFI in [[ETL Vendor RFI and Commercial Evaluation]] to Oracle and to Informatica/BI Technology now, so quotes and written support horizons arrive while Pilot A is being built.
2. **Use dbt Core (or a PL/SQL framework) to build Pilot A without waiting for procurement.** Treat it as a working transformation layer and a live benchmark: if the team is productive and the Oracle adapter behaves on the bank's Exadata release, dbt stays as a credible low-cost option at the gate; if not, the SQL it produced is still reusable under ODI.
3. **Design the control plane tool-agnostically in Oracle**: `CTL_` tables, EOD completion event, load ids, replay, publication gate, reconciliation and quality results live in PL/SQL and are called by whichever tool wins.
4. **Defer Cloudera; keep Spark as a specialist option.** Reopen only if a business owner brings a lake, streaming or distributed AI workload with its own case and staffing.
5. **Decide at the Pilot B exit gate** using the workbook scorecard with test-supported ratings, comparable five-year costs and all three mandatory gates passed. Record the decision in [[ETL Selection Decision Record]].
6. **CDC is a separate decision**, triggered only by a product that proves an S0/S1 SLA; it is priced for every finalist consistently (GoldenGate / PowerExchange / third-party) and not bundled into the ETL score.

## 10. What would change this assessment

- Written confirmation that **GoldenGate is already licensed** and the DBA team will operate it: raises ODI's integration score and lowers its cost; makes S0 products feasible earlier.
- Informatica providing a **contractual, fully local PowerCenter roadmap** through the programme horizon: PowerCenter becomes a genuine co-lead.
- A **supported dbt-oracle path** (partner contract or Oracle-backed support) and a positive Pilot A experience: dbt moves from conditional to lead on cost.
- A funded **lake/streaming/AI workload** with a business owner: Cloudera re-enters as a platform decision, separate from the ETL decision.
- A decision to **change the EDW target away from Exadata**: invalidates the comparison frame; restart with [[ETL Tool Evaluation]].

## 11. Sources

Official documentation per product is registered on the workbook's *Sources* sheet (IDs O1–O5, I1–I13, D1–D9, C1–C7, S1–S6, A1–A6, L1–L6; rechecked 12 October 2026). Principal references:

- [ODI 14.1.2 concepts and architecture](https://docs.oracle.com/en/middleware/fusion-middleware/data-integrator/14.1.2/odiun/understanding-oracle-data-integrator-concepts.html) · [Oracle Knowledge Modules](https://docs.oracle.com/en/middleware/fusion-middleware/data-integrator/14.1.2/odikm/oracle-database.html) · [Load Plans](https://docs.oracle.com/en/middleware/fusion-middleware/data-integrator/14.1.2/odidg/using-load-plans.html)
- [PowerCenter pushdown and Update Strategy](https://docs.informatica.com/data-integration/powercenter/10-5-9/advanced-workflow-guide/pushdown-optimization-and-transformations/update-strategy-transformation.html) · [PowerCenter connectivity](https://docs.informatica.com/data-integration/common-content-for-data-integration/10-5-8/administrator-guide/appendix-c--informatica-platform-connectivity/powercenter-connectivity.html)
- [dbt Oracle setup](https://docs.getdbt.com/docs/local/connect-data-platform/oracle-setup) · [dbt-oracle adapter](https://github.com/oracle/dbt-oracle) · [dbt incremental models](https://docs.getdbt.com/docs/build/incremental-models) · [dbt snapshots](https://docs.getdbt.com/docs/build/snapshots) · [dbt usage statistics](https://docs.getdbt.com/reference/global-configs/usage-stats)
- [Cloudera Private Cloud Base reference architecture](https://docs.cloudera.com/cdp-reference-architectures/latest/cdp-pvc-base-ra/topics/ra-cdpdc-abstract.html) · [Air-gap installation](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/installation/topics/cdppvc-installation-airgap.html) · [Flow Management dependencies](https://docs.cloudera.com/cfm/4.10.0/deployment/topics/cfm-install-cdp.html)
- [Spark JDBC data source](https://spark.apache.org/docs/latest/sql-data-sources-jdbc.html) · [Structured Streaming](https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html) · [Spark security](https://spark.apache.org/docs/latest/security.html)

Bank context: [[Fiziksel Topoloji - Teknik Taraf]] · [[Sistemler ve Servisler]] · [[Firmalarla Yapılan DWH Görüşmeleri]] · [[DWH Sunum Eylül 2024]] · [[DWH Sunum Aralık 2024]] · [[DWH Sunum Temmuz 2025]] · [[Obase Takasbank Değerlendirme Raporu Ağustos 2024]] · [[Başlangıç Yaklaşımı]].

Related: [ETL-Tool-Comparison-Matrix.xlsx](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Comparison-Matrix.xlsx) · [[ETL Tool Evaluation]] · [[ETL Proof of Concept and Acceptance]] · [[ETL Vendor RFI and Commercial Evaluation]] · [[ETL Selection Decision Record]] · [[Proje Planı]] · [[Aktif Sorular]]
