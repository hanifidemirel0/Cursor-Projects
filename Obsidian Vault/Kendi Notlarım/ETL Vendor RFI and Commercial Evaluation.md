---
title: ETL Vendor RFI and Commercial Evaluation
created: 2026-09-28
status: draft-for-bank-review
tags: [dwh, etl, rfi, procurement, tco]
---

# ETL Vendor RFI and Commercial Evaluation

Parent: [[ETL Tool Evaluation]]. This document is ready for the bank to adapt into an RFI. No vendor has been contacted and no response or quotation is assumed.

## 1. Required response format

The offered solution must keep **runtime, management/control plane, metadata and logs on premises**. Do not propose a local agent attached to mandatory cloud management as equivalent. Identify every component and optional dependency.

Respond to each question with: question ID; exact product/edition/version; **included / separately licensed / custom-built / unsupported / not applicable with rationale**; configuration and limitations; documentation link; PoC evidence commitment; commercial line item; responsible support organization. Mark future roadmap features separately from available capability. Give the bank permission to retain all evaluation evidence locally.

For community/open-source compositions, the bank's proposed implementation/support team completes the same response. Absence of a commercial vendor does not remove support, security or lifecycle questions.

## 2. Common questions for all five solutions

### Deployment boundary and lifecycle

- **R01:** Provide a complete component and data-flow diagram showing where business data, schemas, SQL, metadata, credentials, logs, crash dumps and backups are stored or transmitted.
- **R02:** Identify all required and optional external connections, endpoints, telemetry, login, license checks, marketplace/package downloads and diagnostics. Demonstrate disconnected execution, restart, administration and upgrade using local media.
- **R03:** Provide the exact supported combination of tool, OS, database, Oracle client/JDBC driver, JDK/Python, cluster manager and plugins. Attach applicable certification/support matrices; distinguish tested compatibility from contracted support.
- **R04:** State purchase availability, support periods, patch policy, upgrade path, vulnerability response, and any required migration to another edition. Provide a contractual remedy if the offered solution cannot remain fully local during the agreed term.

### Source integration and processing

- **R05:** List required Oracle/Exadata versions and privileges. Explain snapshot consistency, cross-table consistency, extraction from an approved replica, source impact and abort controls.
- **R06:** Describe initial load, incremental inserts/updates/deletes, transaction ordering, rolled-back transactions, historical updates and schema evolution. Name the CDC product and licenses where proposed. Explain log retention exhaustion and reseed.
- **R07:** List supported files, encodings, SFTP/transfer and API patterns, authentication, pagination, rate limiting, retries, manifests and quarantine. Identify custom code and third-party connectors.
- **R08:** Show where each representative transformation runs. Quantify pushdown/fallback, generated SQL, network traffic and staging. Identify which optimizations change semantics, privileges, licensing or recovery.
- **R09:** Describe history, business/system time, backdated corrections, idempotent merge and reprocessing. Identify limitations for exact decimals, timezones, Turkish characters, LOBs and repeated message fields.

### Controls and operation

- **R10:** Explain atomic publication across dependent tables, stale/incomplete-state indicators, failed quality gates, rollback and correction/reissue.
- **R11:** Demonstrate restart after partial writes and ambiguous acknowledgements. State exactly what any “exactly once” claim covers, with required source and sink conditions.
- **R12:** Provide deployment-specific HA/DR, repository and checkpoint backup, recovery procedures and RPO/RTO evidence through usable validated output.
- **R13:** Describe scheduler/Automic integration, dependencies, business-calendar signals, overlapping runs, alerts, log retention and API/CLI administration. State ownership of the complete service.
- **R14:** Provide lineage coverage from source column through custom SQL/code, history, marts and MicroStrategy/API/files. Identify unsupported hops and metadata export formats. Keep the catalogue local.
- **R15:** Show role separation, privileged administration, secret rotation, enterprise identity integration, encryption, member isolation and audit integration. Identify controls implemented by the platform versus those the bank must build.
- **R16:** Demonstrate Git/code review or equivalent auditable version control, testing, promotion, configuration separation, dependency pinning, offline package mirrors, rollback and release evidence.
- **R17:** Identify staff roles and estimated effort to install, patch, monitor, recover, develop, onboard a new source and perform an upgrade. State assumptions and provide evidence from the PoC rather than generic staffing claims.
- **R18:** Explain incident escalation across all components, response/support hours, severity definitions, remote access restrictions and local handling of support diagnostics. State which organization owns a cross-product defect.

### Commercial scope and exit

- **R19:** Provide the full bill of materials and quantities for production, development, testing, performance testing, HA, backup and DR. State licensing metrics, minimum commitments, growth triggers and audit rules.
- **R20:** Separate software, connectors/CDC, hardware, implementation, migration, training, operations, support, upgrades and exit. State bundled inclusions to prevent double counting.
- **R21:** Quote years 0–5, currency, validity, payment timing, taxes, indexation, FX treatment and renewal caps. Identify nonbinding estimates and optional scope. Do not hide required components in optional pricing.
- **R22:** Describe extraction of mappings, code, schemas, metadata, lineage, control evidence and historical data at termination. State proprietary dependencies, migration assistance, residual license needs and deletion obligations.
- **R23:** Accept the common PoC charter, bank-owned expected results and recorded failures. State any inability to perform a test before work starts.

## 3. Option-specific questions

### Informatica

- **I01:** Quote a fully on-premises PowerCenter edition and its supportable upgrade path. Explicitly distinguish it from IDMC and cloud-managed CDI-PC. Confirm all license and administration functions within the local boundary.
- **I02:** List Integration Service, Repository Service, clients, connectors, PowerExchange, pushdown/partition/grid options, quality and lineage products included in the quote. State entitlements separately; existing TDM is not evidence of ETL rights.
- **I03:** Demonstrate each selected Oracle mapping with engine execution and applicable target pushdown. Explain fallback and differences in update order/precision. Include all intermediate movement and infrastructure.
- **I04:** Prove supported source/target/driver combinations, migration of existing logic, repository recovery and bank-operated troubleshooting. Provide written continuity terms for the proposed on-premises edition.

### ODI

- **O01:** List ODI release, repositories, agent type, JDK/application-server dependencies and all entitlements. Which agents, HA/DR instances and non-production environments require licensing?
- **O02:** Identify every knowledge module and customization. Who maintains generated/custom SQL through upgrades? Demonstrate review, promotion and rollback.
- **O03:** Separate batch extraction, any journal-based mechanism, and log-based CDC. If GoldenGate is included, identify deployment, source privileges, licenses and operational ownership. Do not represent it as inherent in an ODI license.
- **O04:** Demonstrate source-safe extraction, Exadata execution plans, resource controls, restart after partial commits and repository recovery. Confirm the supported local lifecycle in writing.

### dbt with Oracle Exadata

- **D01:** Pin the engine distribution/version, dbt-oracle, Python, Oracle driver/client and database release. Demonstrate the non-Autonomous/on-premises Exadata configuration actually proposed. Do not infer production certification from a successful connection.
- **D02:** Identify who contractually supports engine, adapter, Oracle-specific macros and packages. Explain how the Oracle setup page's stated support boundary is addressed and how an adapter defect is escalated.
- **D03:** Demonstrate required materializations, incremental merges, historical correction, schema changes, grants, DDL/restart behaviour and package compatibility. State unsupported features and proposed replacements.
- **D04:** Price and name ingestion/CDC, scheduler, CI/Git, local package mirror, test evidence, catalogue/lineage, logs, secrets, monitoring, DR and operating staff. Do not count hosted platform capabilities as available locally.
- **D05:** Show telemetry configuration and network proof for the pinned engine. Explain engine/adapter upgrade continuity, including whether any proposed v2/OSS path is separately supported for Oracle.

### Cloudera

- **C01:** Identify exact on-premises product names/releases, Base services, optional Data Services, cluster manager, storage/table format and container-platform requirements. Separate cloud services from local services.
- **C02:** Identify ingestion/CDC and each connector. If NiFi, streaming services or third-party products are proposed, state separate subscriptions, hosts, governance integration and support.
- **C03:** Provide minimum and recommended production/DR topology, shared service databases, redundancy, storage replication/erasure-coding assumptions, capacity headroom and operating staff. Distinguish existing reusable infrastructure from new investment.
- **C04:** Prove the complete Oracle-to-cluster-to-Exadata path, including type fidelity, movement, load-back, reconciliation and common report query. If recommending a different EDW target, submit a separately scoped architecture/cost case.
- **C05:** Demonstrate local Ranger/Atlas or equivalent coverage for the actual pipeline and explain gaps at Oracle, custom code and MicroStrategy boundaries. Prove offline updates and all optional service dependencies.

### Apache Spark

- **S01:** Provide the complete supported stack around Spark: cluster manager, storage/table format, ingestion/CDC, orchestration, catalogue/lineage, quality, security, logs, secrets, packages and DR.
- **S02:** Who builds, patches and supports each component and its interfaces? Provide named operating ownership, support-hour coverage and a vulnerability/upgrade process.
- **S03:** Demonstrate Oracle JDBC concurrency limits, extraction consistency, precision/LOB handling, skew/spill, target loading, merge semantics and sink-side idempotency after executor/driver failure.
- **S04:** State which streaming guarantees hold for the chosen source and Oracle sink. Show failure/replay evidence instead of a generic engine-level exactly-once claim.
- **S05:** Quantify framework code and operator effort that the bank will maintain. Explain the business case versus executing the same transformations inside Exadata.

## 4. Bill-of-materials template

```text
Candidate / offer ID / version / date:
Component / purpose / edition / pinned version:
Runs and stores state where:
Dependencies and data/metadata/log flows:
Production quantity / non-production quantity / HA / DR:
License or subscription metric / price line / included bundle:
Infrastructure allocation and measured capacity basis:
Responsible bank owner / vendor or internal support owner:
Support hours / term / upgrade and end-of-support evidence:
Offline install/update and local diagnostics procedure:
Required custom code / maintenance owner:
Security acceptance / gate evidence / open limitations:
```

Every mandatory component has a row and cost treatment. A zero price is allowed only when included elsewhere, an existing entitlement is verified, or there is genuinely no charge; identify which case applies. A zero software price does not imply zero implementation or operating effort.

## 5. Five-year cost method

The workbook's Costs sheet is an **incremental nominal cash/committed-cost model**, with initial setup in Year 0 and five operating years. Currency is deliberately unassigned until Procurement/Finance choose a common basis. All numeric inputs start blank. A completed line requires six yearly amounts and a quote/estimate reference; blank is unknown, whereas zero is a verified zero.

Include the ten categories provided for every option. Allocate cost once:

- Software subscriptions/licenses and maintenance clearly distinguished from support services.
- Required connectors and CDC, including source and target licensing consequences.
- New compute and incremental Exadata resources, including any capacity step triggered by concurrency.
- Storage, staging, retention, replication, backup and DR capacity.
- Incremental network/facilities and an agreed treatment of shared resources.
- Implementation, migration, testing and parallel running.
- Operating personnel, on-call coverage, contracted support and routine administration.
- Security, catalogue/lineage, observability and other required control components.
- Training, patching/upgrade rehearsal and regression testing.
- Exit, decommissioning and required archival service.

For personnel, use recorded FTE effort × agreed fully loaded annual cost, identifying whether it is new hiring, external spend or reassigned capacity. Put the approved annual amounts and calculation reference in the workbook; avoid pretending existing staff have unlimited spare time. A vendor administrator estimate must include the surrounding stack.

Keep a separate reconciliation of **economic/shared-resource cost** to this incremental view. Existing hardware purchase is a sunk cost, but capacity use, support, energy, staff and displaced workloads matter. Do not add the same database capacity cost once as hardware and again as an internal charge without explaining the allocation. Treat grants/discounts and taxes consistently; do not assume values.

Define a common sizing and retention basis before comparing totals. Include production, non-production, HA and DR in every relevant line. Record quote exclusions, growth tiers, currency and support-renewal assumptions. Optional CDC is either consistently included for an agreed requirement or shown as a separately scoped option for every solution.

### Sensitivity

Recalculate with panel-approved alternatives for data growth, peak concurrency, retained history, staffing, subscription renewal, FX and required Exadata/cluster expansion. Model realistic capacity steps rather than assuming all costs vary linearly. Save scenario evidence externally with its assumptions and restore the agreed base inputs in the workbook.

No candidate is “cheapest” until complete comparable costs exist. No prices or headcounts have been estimated in this pack.

## 6. Procurement acceptance and decision handoff

Procurement checks entitlement, quotes, term, exclusions and support. Legal/security review contract terms within their mandates. Architecture confirms scope equivalence; Finance validates the cost basis; the service owner confirms that staffing and support hours match the intended service. These checks feed the relevant gates and C11/C12 ratings.

Submit the selected exact configuration and alternatives through [[ETL Selection Decision Record]]. A broader future platform proposal should have its own business case if its value depends on capabilities outside the bank's agreed ETL workload.
