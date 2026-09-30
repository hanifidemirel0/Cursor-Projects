---
title: DWH Document Register
created: 2026-09-28
status: proposed-for-review
document_owner_role: Principal DWH Architect and Programme Manager
language: en
tags:
  - dwh
  - documentation
  - delivery
  - governance
---

# DWH Document Register

A proposed lifecycle register for an on-premises enterprise data warehouse and the bank's operational reporting, MicroStrategy, APIs, member files and regulated outputs. It covers **84 document/record types**: **24 DWH delivery**, **20 cross-team**, **22 process**, and **18 management**.

This is a list of documents to establish and maintain, not 84 completed documents and not an assertion that all are missing. Existing notes are discovery evidence or draft design inputs until their current accuracy and approval status are established. Roles and gates below are proposed; appoint actual people through the bank's authority structure.

## How to use the register

- **Baseline** means the proposed programme should cover the subject. It does not mean a separate file or a statutory requirement. Reuse an existing bank policy and record DWH applicability instead of duplicating it.
- **Conditional** entries identify their trigger. Record applicability and rationale before marking an item not applicable; do not omit a control merely because delivery is difficult.
- **First needed** is when drafting/establishing the document starts. Baseline designs before dependent implementation; record test, acceptance and operational evidence when executed. The gates below specify when evidence is needed.
- **Scope** distinguishes enterprise, source, product, output and release records. A per-source contract repeats for each source; one enterprise architecture is maintained across waves.
- **Owner** means accountable document maintainer. Contributors can come from several teams. **Review/approval** separates decisions when different authorities are involved; the programme manager cannot replace business, security or service acceptance.
- Every substantive decision must identify the approved version, evidence, named approver, decision date, conditions and any expiry. Approval states are proposed, draft, in review, approved, superseded and retired.
- Keep **one authoritative source** for each definition and rule. Manager slides summarize and link evidence; they do not create a second specification. Code, catalogue entries, tickets, signed records, diagrams and automated test reports all count as documentation.
- This register owns document requirements only. Execution dates/actions belong in [[Proje Planı]], ownership policy in [[DWH Ownership Operating Model]], open bank questions in [[Aktif Sorular]], and environment facts in [[Fiziksel Topoloji - Teknik Taraf]].

## Lifecycle and the meaning of finished

- **P0 — Day 0 — mandate and mobilization:** Authorize discovery and delivery; establish scope, owners, funding, working controls and reporting.
- **P1 — Discovery and requirements:** Validate business processes, reports, sources, ownership, semantics, risks and service expectations.
- **P2 — Architecture, detailed design and foundations:** Approve an implementable design and contracts; provision and secure the on-premises platform.
- **P3 — Build and verification:** Implement the source-to-output slice and collect functional, security, performance and recovery evidence.
- **P4 — Migration, parallel running and cutover:** Reconcile history and outputs, prove readiness, authorize deployment/publication and execute migration.
- **P5 — Stabilization and operational handover:** Prove service stability, complete knowledge transfer and retire approved replaced workloads.
- **P6 — Programme completion and closure:** Accept all agreed scope, close financial/control obligations and transfer funded residual work to named owners.

Repeat P1–P5 for subsequent domains and report families. First pilot completion is not whole-programme completion. A warehouse remains an operated service after project closure; recurring access reviews, quality controls, recovery tests, cost reviews and new-demand prioritization continue in BAU (business as usual).

The programme is finished when its agreed scope and success criteria are met, every scoped service/output is accepted, receiving teams own operations, agreed legacy changes are complete, costs and evidence are closed, and remaining actions/risks are explicitly accepted with funded owners. Future enhancements can become a new backlog; unfinished committed scope cannot be relabelled as an enhancement to manufacture closure.

## Approval gates

### G0 — Mobilization authorized (P0)

Sponsor authorizes a scoped programme, discovery spend and staffing; owners, decision rights and controls exist. Estimates may be provisional and labelled.

**Evidence index:** [M01](#m01), [M02](#m02), [M03](#m03), [M07](#m07), [M08](#m08), [M09](#m09), [M11](#m11), [M13](#m13), [P01](#p01), [P02](#p02), [P03](#p03), [P22](#p22). Conditional records apply only when their trigger is present.

### G1 — Scope and requirements accepted (P1)

Relevant business/source owners accept pilot or wave scope, meaning, authority, finality, service targets and acceptance criteria. Conditional regulatory requirements are resolved.

**Evidence index:** [D01](#d01), [D02](#d02), [D03](#d03), [D04](#d04), [D05](#d05), [D06](#d06), [X01](#x01), [X02](#x02), [X04](#x04), [X10](#x10), [X11](#x11), [X15](#x15), [M04](#m04), [M06](#m06). Conditional records apply only when their trigger is present.

### G2 — Design and platform ready for implementation (P2)

Architecture, data, security and platform authorities approve their parts. Source/consumer contracts and planned test, migration and recovery methods support implementation. Applicable procedures P04–P22 are established by first use.

**Evidence index:** [D07](#d07), [D08](#d08), [D09](#d09), [D10](#d10), [D11](#d11), [D12](#d12), [D13](#d13), [D14](#d14), [D15](#d15), [D16](#d16), [D18](#d18), [D19](#d19), [D21](#d21), [X03](#x03), [X05](#x05), [X06](#x06), [X07](#x07), [X08](#x08), [X09](#x09), [X12](#x12), [X14](#x14), [X16](#x16), [X18](#x18), [M05](#m05), [M10](#m10). Conditional records apply only when their trigger is present.

### G3 — Production readiness demonstrated (P3–P4)

Passed tests, business reconciliation, appropriate parallel cycles, migration proof, operational monitoring, access checks and recovery evidence support separate business, technical and service acceptance.

**Evidence index:** [D17](#d17), [D20](#d20), [D21](#d21), [D22](#d22), [D23](#d23), [D24](#d24), [X13](#x13), [X15](#x15), [X16](#x16), [X17](#x17), [X19](#x19), [M15](#m15). Conditional records apply only when their trigger is present.

### G4 — Cutover and publication authorized (P4)

Release-specific runbook, rollback triggers, communications and authority are recorded. Deployment authorization and permission to publish are separate. Legacy retirement is planned, not automatic at cutover.

**Evidence index:** [M15](#m15), [P10](#p10), [P11](#p11), [P14](#p14), [P19](#p19), [X14](#x14), [X20](#x20). Conditional records apply only when their trigger is present.

### G5 — Stable service accepted (P5)

Agreed hypercare exit criteria pass; receiving operations can support and recover the service. Approved legacy retirements have evidence and consumers are protected.

**Evidence index:** [D23](#d23), [X15](#x15), [X16](#x16), [X17](#x17), [X19](#x19), [X20](#x20), [P20](#p20), [P21](#p21), [M16](#m16). Conditional records apply only when their trigger is present.

### G6 — Scoped programme closed (P6)

All committed scope is accepted or formally changed, final costs and benefits evidence are recorded, residual risks/actions have authorized funded owners, and the evidence archive is handed over.

**Evidence index:** [M03](#m03), [M16](#m16), [M17](#m17), [M18](#m18), [D24](#d24), [X20](#x20). Conditional records apply only when their trigger is present.


M15 is the decision cover sheet for each gate; underlying evidence remains with its owner. Source access or procurement may need to precede the general schedule, with the relevant controls applied before that activity. Passing a stage does not waive outstanding mandatory controls.

## Detailed register

Every entry lists minimum contents, not an instruction to produce lengthy prose. Reuse a template and scale depth to the report's business impact.

## DWH team — engineering and delivery

<a id="d01"></a>
### D01 — Enterprise domain and business-process map

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Enterprise.
- **Owner:** Data architect.
- **Review/approval:** Business data owners validate domains; architect accepts structure.
- **Minimum contents:** Domains, processes, shared dimensions, system boundaries and reuse opportunities; include markets, members, settlement, funds and payments.
- **Update/evidence timing:** At discovery and each new domain.
- **Applicability:** Baseline.

<a id="d02"></a>
### D02 — Source-system and dataset inventory

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per source.
- **Owner:** Data analyst.
- **Review/approval:** Source application owner validates facts.
- **Minimum contents:** Systems, schemas, tables, keys, volumes, change rates, retention, sensitivity, ownership and external-feed provenance; seed from PowerDesigner and verify.
- **Update/evidence timing:** At onboarding and source change.
- **Applicability:** Baseline.

<a id="d03"></a>
### D03 — Report and output inventory with placement decisions

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per output.
- **Owner:** BI analyst.
- **Review/approval:** Report owner accepts purpose; architect accepts routing.
- **Minimum contents:** Team Developer, web, MicroStrategy, API and file outputs; users, usage, cost, logic, deadlines, staleness, dependencies and proposed source/replica/ODS/EDW route.
- **Update/evidence timing:** Discovery; each migration wave.
- **Applicability:** Baseline.

<a id="d04"></a>
### D04 — Data profiling and source-behaviour assessment

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per dataset.
- **Owner:** Data engineer.
- **Review/approval:** Engineering lead; source and business owners resolve findings.
- **Minimum contents:** Keys, duplicates, nulls, distributions, delete/update patterns, late changes, source history and observed data defects; reproducible queries and measurement dates.
- **Update/evidence timing:** Before modelling; material source changes.
- **Applicability:** Baseline.

<a id="d05"></a>
### D05 — Data-product business requirements and acceptance criteria

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per product.
- **Owner:** Business/data analyst.
- **Review/approval:** Data product owner and relevant report owner approve their scope.
- **Minimum contents:** Purpose, consumers, business questions, grain, measures, examples, scope exclusions and measurable acceptance criteria linked to report inventory.
- **Update/evidence timing:** Before implementation; requirements changes.
- **Applicability:** Baseline.

<a id="d06"></a>
### D06 — Non-functional requirements specification

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per service/product.
- **Owner:** Data architect.
- **Review/approval:** Service owner accepts targets; affected platform/security owners accept commitments.
- **Minimum contents:** Freshness, business-date completeness, publication deadline, concurrency, latency, throughput, growth, availability, RPO/RTO and recoverability; separate each measure.
- **Update/evidence timing:** Before design baseline; service changes.
- **Applicability:** Baseline.

<a id="d07"></a>
### D07 — Target logical architecture and architecture decision records

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Enterprise.
- **Owner:** Principal DWH architect.
- **Review/approval:** Designated architecture authority.
- **Minimum contents:** Ingestion, operational serving, historical integration, marts, semantic and publication boundaries; alternatives, decisions, consequences and dependencies.
- **Update/evidence timing:** Baseline before build; material decisions.
- **Applicability:** Baseline.

<a id="d08"></a>
### D08 — Physical architecture, environment and capacity design

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Enterprise/platform.
- **Owner:** Platform architect.
- **Review/approval:** Infrastructure owner accepts resources; architecture authority accepts design.
- **Minimum contents:** On-prem topology, resource isolation, storage, network, HA/DR, dev/test/prod, source coexistence and capacity including indexes, temp, staging, replay, backup and growth.
- **Update/evidence timing:** Before provisioning; measured capacity changes.
- **Applicability:** Baseline.

<a id="d09"></a>
### D09 — Conceptual and logical data models

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Enterprise plus domain.
- **Owner:** Data modeller.
- **Review/approval:** Business owners validate meaning; architect accepts integration.
- **Minimum contents:** Entities, relationships, keys, grain, cardinality, shared dimensions and domain boundaries; model incrementally without blocking delivery on a complete bank model.
- **Update/evidence timing:** Each domain and semantic change.
- **Applicability:** Baseline.

<a id="d10"></a>
### D10 — Physical data models and database object specifications

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per product/database.
- **Owner:** Data modeller.
- **Review/approval:** Engineering lead and DBA approve their technical scope.
- **Minimum contents:** Tables, columns, constraints, partitioning, indexes, precision, surrogate keys and DDL; include deployment version and performance rationale.
- **Update/evidence timing:** Each schema release.
- **Applicability:** Baseline.

<a id="d11"></a>
### D11 — Technical data dictionary and metadata catalogue

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per dataset.
- **Owner:** Data steward.
- **Review/approval:** Technical owner validates implementation; business owner validates linked meaning.
- **Minimum contents:** Column definitions, types, null rules, owners, classifications and links to business glossary; generate from deployed metadata where possible.
- **Update/evidence timing:** Each schema release; periodic stewardship.
- **Applicability:** Baseline.

<a id="d12"></a>
### D12 — Source-to-target mappings and transformation specifications

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per pipeline/product.
- **Owner:** Data engineer.
- **Review/approval:** Engineering lead accepts code logic; business owner approves business rules.
- **Minimum contents:** Column mappings, joins, filters, derivations, rounding, currency/unit handling, effective dates and rule versions; links to source contracts and tests.
- **Update/evidence timing:** Before coding; each rule change.
- **Applicability:** Baseline.

<a id="d13"></a>
### D13 — Ingestion and pipeline technical designs

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per feed/pipeline.
- **Owner:** Data engineer.
- **Review/approval:** Engineering lead; source owner accepts extraction boundary.
- **Minimum contents:** Batch/CDC/file approach, consistent initial load, checkpointing, transactions, deletes, deduplication, retry, schema drift, quarantine and replay metadata.
- **Update/evidence timing:** Before implementation; feed changes.
- **Applicability:** Baseline.

<a id="d14"></a>
### D14 — Identity, reference-data and history design

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per domain.
- **Owner:** Data modeller.
- **Review/approval:** Business data owner approves matching/correction rules; architect approves implementation.
- **Minimum contents:** Crosswalks, member roles, reference versions, slowly changing attributes, business/system time where needed, late facts, reversals and restatement behaviour.
- **Update/evidence timing:** Before first history load; rule changes.
- **Applicability:** Baseline.

<a id="d15"></a>
### D15 — Orchestration and batch dependency specification

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per service.
- **Owner:** Data engineer.
- **Review/approval:** Service owner and source operations accept dependencies.
- **Minimum contents:** Schedules, Automic or approved scheduler chains, end-of-day signals, business dates, cutoffs, restart boundaries, upstream watermarks and escalation.
- **Update/evidence timing:** Each new chain or dependency change.
- **Applicability:** Baseline.

<a id="d16"></a>
### D16 — Data-quality and reconciliation rule catalogue

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per product/control.
- **Owner:** Data quality lead.
- **Review/approval:** Business owner approves thresholds and authority; engineer validates execution.
- **Minimum contents:** Completeness, uniqueness, relationship and financial controls; control totals by grain/date/currency, tolerance, severity, action, evidence and owner.
- **Update/evidence timing:** Before testing; rule/threshold changes.
- **Applicability:** Baseline.

<a id="d17"></a>
### D17 — End-to-end lineage and impact map

- **First needed:** P3 — Build and verification.
- **Scope:** Per product/output.
- **Owner:** Data engineer.
- **Review/approval:** Engineering lead validates technical lineage; steward checks completeness.
- **Minimum contents:** Source columns through transformations, history, marts, semantic formulas and publication; link rules, code versions and downstream consumers.
- **Update/evidence timing:** Each deployment; generated where possible.
- **Applicability:** Baseline.

<a id="d18"></a>
### D18 — Semantic model and output implementation specifications

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per model/output.
- **Owner:** BI/semantic lead.
- **Review/approval:** Report owner approves presentation semantics; technical lead accepts design.
- **Minimum contents:** MicroStrategy facts/attributes, joins, aggregation, filters, entitlements, drill paths; API/file implementation refers to the agreed consumer contract.
- **Update/evidence timing:** Before output build; each change.
- **Applicability:** Baseline.

<a id="d19"></a>
### D19 — Test strategy, test cases and requirements traceability

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Programme plus product.
- **Owner:** Test lead.
- **Review/approval:** Engineering lead and business test owner accept their coverage.
- **Minimum contents:** Requirements-to-test links; unit, integration, regression, reconciliation, negative, security, concurrency, performance, recovery and correction scenarios.
- **Update/evidence timing:** Before build completes; each release.
- **Applicability:** Baseline.

<a id="d20"></a>
### D20 — Test execution, defects and verification evidence

- **First needed:** P3 — Build and verification.
- **Scope:** Per release.
- **Owner:** Test lead.
- **Review/approval:** Independent reviewer verifies results; acceptance owners decide residual defects.
- **Minimum contents:** Executed cases, expected/actual results, datasets, environment, build version, defects, retests and evidence of control operation.
- **Update/evidence timing:** Every test cycle and release.
- **Applicability:** Baseline.

<a id="d21"></a>
### D21 — Historical backfill and data migration plan with evidence

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per migration.
- **Owner:** Data engineering lead.
- **Review/approval:** Source owner and receiving product owner approve migration scope.
- **Minimum contents:** History availability, archives, mapping, consistent cutoffs, bulk/incremental overlap, throttling, reconciliation, restart, provenance and missing-history treatment.
- **Update/evidence timing:** Plan before migration; evidence before acceptance.
- **Applicability:** Conditional: historical data or legacy datasets are migrated.

<a id="d22"></a>
### D22 — Build, configuration and as-built technical dossier

- **First needed:** P3 — Build and verification.
- **Scope:** Per platform/release.
- **Owner:** Engineering lead.
- **Review/approval:** Technical service owner accepts maintainable baseline.
- **Minimum contents:** Version-controlled code, DDL, scheduler/config exports, infrastructure settings, release manifests, dependencies, environment differences and deployed diagrams; reference secrets without embedding them.
- **Update/evidence timing:** Each deployment; complete at handover.
- **Applicability:** Baseline.

<a id="d23"></a>
### D23 — Technical operating runbooks

- **First needed:** P3 — Build and verification.
- **Scope:** Per pipeline/service.
- **Owner:** Engineering lead.
- **Review/approval:** Receiving support lead demonstrates execution.
- **Minimum contents:** Start/stop, rerun, checkpoint repair, restore, late-source handling, quarantine, manual recovery, validation, escalation and rollback; include tested commands and prerequisites.
- **Update/evidence timing:** Before go-live; after incidents and changes.
- **Applicability:** Baseline.

<a id="d24"></a>
### D24 — Technical debt, limitations and maintainability register

- **First needed:** P3 — Build and verification.
- **Scope:** Enterprise plus product.
- **Owner:** Engineering lead.
- **Review/approval:** Service/product owners accept disposition within authority.
- **Minimum contents:** Unsupported cases, known limits, workarounds, expiry, remediation owner, estimates and linked risks; distinguish technical debt from defects and accepted risk.
- **Update/evidence timing:** Each release; handover and closure.
- **Applicability:** Baseline.

## Other teams — agreements and acceptance

<a id="x01"></a>
### X01 — Source onboarding and data-supply contract

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per source/feed.
- **Owner:** Source application owner.
- **Review/approval:** Source and receiving product owners accept their respective obligations.
- **Minimum contents:** With UG/application teams: fields, keys, semantics, business ownership, extraction permissions, frequency, completeness, deletes, corrections, contacts and support boundary.
- **Update/evidence timing:** Before source integration; every contract version.
- **Applicability:** Baseline.

<a id="x02"></a>
### X02 — Business-day, calendar and completion-signal contract

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per market/service.
- **Owner:** Source operations owner.
- **Review/approval:** Business operations owner approves business finality; service owner accepts dependency.
- **Minimum contents:** Market calendars, holidays, timezone, cutoff, end-of-day run ID, completion flag, snapshot/SCN where applicable, reruns and late completion; resolve conflicting environment descriptions.
- **Update/evidence timing:** Before scheduling; calendar or close-process changes.
- **Applicability:** Baseline.

<a id="x03"></a>
### X03 — DBA extraction, replication and source-impact agreement

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per database feed.
- **Owner:** Source DBA lead.
- **Review/approval:** Source service owner accepts impact; DBA accepts supported configuration.
- **Minimum contents:** CDC/read-replica feasibility, required privileges/logging, log retention, initial load, supported types, source-load limits, replication lag and failover behaviour.
- **Update/evidence timing:** Before extraction starts; technical changes.
- **Applicability:** Baseline.

<a id="x04"></a>
### X04 — Business glossary, metric definitions and authority matrix

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per domain/metric.
- **Owner:** Business data owner.
- **Review/approval:** Named owner approves each definition; cross-domain conflicts use governance process.
- **Minimum contents:** Definitions, formula, grain, time basis, currency, exclusions and authoritative evidence per metric; clarify transaction versus obligation versus movement.
- **Update/evidence timing:** Before mappings and UAT; definition changes.
- **Applicability:** Baseline.

<a id="x05"></a>
### X05 — Master/reference-data stewardship agreement

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per shared entity.
- **Owner:** Data governance lead.
- **Review/approval:** Relevant business owners approve stewardship and domain rules.
- **Minimum contents:** Member identifiers, account relationships, instruments, markets, calendars and FX/reference sources; matching authority, exception queue, effective dates and service obligations.
- **Update/evidence timing:** Before shared data is published; stewardship changes.
- **Applicability:** Baseline.

<a id="x06"></a>
### X06 — Upstream change-notification and compatibility agreement

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per source.
- **Owner:** Source application owner.
- **Review/approval:** Source and downstream technical owners accept notice/testing commitments.
- **Minimum contents:** Schema, semantic and batch-time changes; notice period, versioning, compatibility window, test feeds, emergency changes and retirement notifications.
- **Update/evidence timing:** Before source production use; agreement changes.
- **Applicability:** Baseline.

<a id="x07"></a>
### X07 — Infrastructure provisioning and platform acceptance pack

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per environment.
- **Owner:** Infrastructure owner.
- **Review/approval:** Platform service owner accepts delivery; architect verifies requirements.
- **Minimum contents:** Build requests and delivered compute/storage/database capacity, HA, environment isolation, patch/support baseline, monitoring hooks and acceptance results.
- **Update/evidence timing:** Before platform use; expansion and refresh.
- **Applicability:** Baseline.

<a id="x08"></a>
### X08 — Network connectivity and service-account implementation pack

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per connection/service.
- **Owner:** Network/platform lead.
- **Review/approval:** Security approves access design; network/IAM owners approve implementation.
- **Minimum contents:** Connectivity matrix, firewall requests, DNS, certificates, ports, transfer channels, service identities, credential rotation and connection tests; exclude passwords.
- **Update/evidence timing:** Before connectivity; access or network changes.
- **Applicability:** Baseline.

<a id="x09"></a>
### X09 — Security architecture and threat assessment

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Enterprise plus product.
- **Owner:** Security architect.
- **Review/approval:** Authorized security authority.
- **Minimum contents:** Trust boundaries, threats, encryption, keys, privileged access, segregation of duties, row/column controls, audit logging, security tests and residual-risk routing.
- **Update/evidence timing:** Before design acceptance; material threat changes.
- **Applicability:** Baseline.

<a id="x10"></a>
### X10 — Data classification, privacy and retention assessment

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per dataset/use.
- **Owner:** Data governance/privacy lead.
- **Review/approval:** Authorized privacy/security/legal owners approve their respective controls.
- **Minimum contents:** Sensitive fields, approved purpose, minimization, non-prod masking, transfer recipients, retention/hold/disposal obligations and evidence requirements; complete formal privacy assessment when applicable.
- **Update/evidence timing:** Before sensitive-data use; purpose or data changes.
- **Applicability:** Baseline; formal assessment depth depends on applicable bank policy.

<a id="x11"></a>
### X11 — Regulatory and external-report obligation specification

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per regulated output.
- **Owner:** Compliance/report owner.
- **Review/approval:** Authorized compliance/legal authority validates applicability; authorized report signatory approves submission rules.
- **Minimum contents:** Applicable obligations and interpretation, population, format, deadline, retention, evidence, resubmission and acknowledgement; no assumed statutory periods.
- **Update/evidence timing:** Before regulated-output design; obligation changes.
- **Applicability:** Conditional: regulatory or legally mandated outputs are in scope.

<a id="x12"></a>
### X12 — Business reconciliation and control-total agreement

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per product/output.
- **Owner:** Business control/finance owner.
- **Review/approval:** Business data owner approves authoritative totals; report owner approves output checks.
- **Minimum contents:** Expected totals and authoritative evidence, granularity, period/currency, rounding/tolerance, investigation ownership and criteria for accepting discrepancies.
- **Update/evidence timing:** Before parallel run; authoritative-source changes.
- **Applicability:** Baseline.

<a id="x13"></a>
### X13 — Business UAT and parallel-run acceptance pack

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per product/release.
- **Owner:** Business test owner.
- **Review/approval:** Report/product owner signs acceptance for the tested version.
- **Minimum contents:** Business scenarios, expected outputs, representative cycles, old/new comparisons, differences, results and acceptance; plan early and complete evidence before cutover.
- **Update/evidence timing:** Plan at requirements baseline; sign at release.
- **Applicability:** Baseline.

<a id="x14"></a>
### X14 — Consumer interface and delivery contract

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per API/file/report interface.
- **Owner:** Consuming application/report owner.
- **Review/approval:** Consumer and provider owners accept interface and service responsibilities.
- **Minimum contents:** Schema, semantics, version, entitlements, pagination/limits where relevant, file naming, transport, recipients, delivery/acknowledgement, retry and compatibility.
- **Update/evidence timing:** Before output implementation; interface changes.
- **Applicability:** Baseline.

<a id="x15"></a>
### X15 — Service catalogue, SLA/OLA and support agreement

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per end-to-end service.
- **Owner:** End-to-end service owner.
- **Review/approval:** Business owner accepts service; component owners accept dependency commitments.
- **Minimum contents:** Service hours, freshness, completeness, response time, deadline, availability, RPO/RTO, support coverage, on-call, escalation and ownership across teams.
- **Update/evidence timing:** Draft in discovery; baseline before go-live.
- **Applicability:** Baseline.

<a id="x16"></a>
### X16 — Backup, HA/DR and business-continuity evidence pack

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per service/platform.
- **Owner:** Continuity/platform owner.
- **Review/approval:** Service owner accepts demonstrated recovery; authorized continuity authority reviews.
- **Minimum contents:** Failure scenarios, backup coverage, isolated recovery, dependencies, source/warehouse checkpoints, restore/failover/failback, reconciliation and measured RPO/RTO; link business fallback.
- **Update/evidence timing:** Design early; prove before production and periodically.
- **Applicability:** Baseline.

<a id="x17"></a>
### X17 — Monitoring and service-desk integration acceptance

- **First needed:** P3 — Build and verification.
- **Scope:** Per service.
- **Owner:** Operations lead.
- **Review/approval:** Receiving service-desk/support owner.
- **Minimum contents:** Business and technical alerts, lag/completeness checks, ticket routing, severity, contact coverage, dashboards, synthetic checks and tested notification paths.
- **Update/evidence timing:** Before go-live; monitoring changes.
- **Applicability:** Baseline.

<a id="x18"></a>
### X18 — Supplier, licence and support acceptance pack

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per supplier/product.
- **Owner:** Procurement/vendor manager.
- **Review/approval:** Procurement/legal/security approve terms within authority; bank service owner accepts deliverables.
- **Minimum contents:** Entitlements, supported versions, capacity/DR rights, dependencies, support SLA, deliverable acceptance, knowledge transfer and exit arrangements.
- **Update/evidence timing:** Before purchase/use; renewals and supplier exit.
- **Applicability:** Conditional: third-party products or delivery/support services are used.

<a id="x19"></a>
### X19 — Training, user guides and adoption acceptance

- **First needed:** P3 — Build and verification.
- **Scope:** Per audience/product.
- **Owner:** Business change/training lead.
- **Review/approval:** Business and support owners accept readiness of their audiences.
- **Minimum contents:** Consumer guides, semantic definitions, safe usage, freshness labels, operational runbook training, materials, attendance, exercises and help route.
- **Update/evidence timing:** Before rollout; new users/features and handover.
- **Applicability:** Baseline.

<a id="x20"></a>
### X20 — Legacy retirement and dependency-clearance pack

- **First needed:** P4 — Migration, parallel running and cutover.
- **Scope:** Per replaced component/output.
- **Owner:** Legacy application owner.
- **Review/approval:** Affected consumers accept replacement; legacy service owner authorizes retirement.
- **Minimum contents:** Queries, PL/SQL jobs, reports, feeds, DB links and contracts to retire; dependency checks, parallel-run exit, fallback expiry, archival, access removal and saved-resource evidence.
- **Update/evidence timing:** Prepare before cutover; execute after stability and approvals.
- **Applicability:** Conditional: existing workloads or components are replaced.

## Processes — standards, procedures and reusable records

<a id="p01"></a>
### P01 — Ownership operating model and RACI register

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Enterprise plus asset.
- **Owner:** Data governance lead.
- **Review/approval:** Executive sponsor establishes mandates; each delegated authority retains its decisions.
- **Minimum contents:** Named business, source, product, report, service and technical owners/deputies; decision rights, escalation and handover. Reuse DWH Ownership Operating Model rather than create a competing policy.
- **Update/evidence timing:** At mobilization; every ownership change.
- **Applicability:** Baseline.

<a id="p02"></a>
### P02 — Document, configuration and evidence-control procedure

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Enterprise.
- **Owner:** Delivery/PMO lead.
- **Review/approval:** Programme manager and records-control authority.
- **Minimum contents:** Authoritative locations, IDs, versions, review/approval states, baselines, access, evidence links, retention and superseded records; distinguish draft from approved.
- **Update/evidence timing:** At mobilization; governance changes.
- **Applicability:** Baseline.

<a id="p03"></a>
### P03 — Demand intake, prioritization and scope-change procedure

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Enterprise.
- **Owner:** Data product/delivery lead.
- **Review/approval:** Sponsor approves priority and funding authority.
- **Minimum contents:** Request form, business value, source readiness, dependencies, risk, scoring, capacity allocation, scope control and decisions; avoid queueing every report as a separate project.
- **Update/evidence timing:** At mobilization; each demand cycle.
- **Applicability:** Baseline.

<a id="p04"></a>
### P04 — Source and data-product onboarding procedure

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per onboarding.
- **Owner:** Data engineering lead.
- **Review/approval:** Data governance and engineering leads accept their checks.
- **Minimum contents:** Entry checklist, owner appointment, contract, profiling, sensitivity, authority, service criteria, modelling, testing and production gates with reusable templates.
- **Update/evidence timing:** Before first source; repeat for every product.
- **Applicability:** Baseline.

<a id="p05"></a>
### P05 — Data modelling and business-definition change standard

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Enterprise.
- **Owner:** Data architect.
- **Review/approval:** Architecture authority approves technical standards; business owners approve definitions.
- **Minimum contents:** Grain, naming, keys, precision, history, conformed dimensions, metric approval, versioning, impact review and effective dates.
- **Update/evidence timing:** Before first model; controlled standards changes.
- **Applicability:** Baseline.

<a id="p06"></a>
### P06 — Development, testing and peer-review procedure

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Enterprise.
- **Owner:** Engineering/test lead.
- **Review/approval:** Engineering authority.
- **Minimum contents:** Repository workflow, coding rules, unit/integration/security tests, independent review, environment promotion, test-data controls and definition of done.
- **Update/evidence timing:** Before first implementation; process changes.
- **Applicability:** Baseline.

<a id="p07"></a>
### P07 — Source/interface change and schema-drift procedure

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Enterprise plus source.
- **Owner:** Source integration lead.
- **Review/approval:** Source and DWH change authorities approve their boundaries.
- **Minimum contents:** Detect/notify changes, assess impacted consumers, quarantine unsafe changes, compatibility tests, contract version and emergency path; uses source-specific X06 agreements.
- **Update/evidence timing:** Before ingestion; every source change.
- **Applicability:** Baseline.

<a id="p08"></a>
### P08 — Data-quality issue, reconciliation and disputed-number procedure

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Enterprise plus product.
- **Owner:** Data governance lead.
- **Review/approval:** Business control/data owners approve business decision rights.
- **Minimum contents:** Detect, classify, contain, investigate, identify authoritative evidence, assign cause, resolve disagreement, fix and verify; prohibit unapproved tolerance changes.
- **Update/evidence timing:** Before first reconciliation; every issue.
- **Applicability:** Baseline.

<a id="p09"></a>
### P09 — Historical correction, restatement and manual-adjustment procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per affected product.
- **Owner:** Business control owner.
- **Review/approval:** Authorized data/report owner; separate preparer and checker where required.
- **Minimum contents:** Backdated facts, reversals, rule changes, adjustment reason/evidence, maker-checker approval, immutable audit, impact on prior outputs and authorized republication.
- **Update/evidence timing:** Before historical/correctable data goes live; each correction.
- **Applicability:** Baseline.

<a id="p10"></a>
### P10 — Release, deployment, cutover and rollback procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per release.
- **Owner:** Release manager.
- **Review/approval:** Bank change authority and accountable release owner.
- **Minimum contents:** Release records, dependencies, approvals, ordered cutover, checkpoints, rollback triggers, decision authority, communication and post-deployment validation.
- **Update/evidence timing:** Before first release; every release.
- **Applicability:** Baseline.

<a id="p11"></a>
### P11 — Publication, delivery and acknowledgement procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per output.
- **Owner:** Report/publication owner.
- **Review/approval:** Authorized publication authority.
- **Minimum contents:** Validate completeness, authorize release under standing mandate or explicit approval, preserve version, deliver, confirm receipt, manage rejection/retry/withdrawal and correction.
- **Update/evidence timing:** Before first output publication; each publication.
- **Applicability:** Baseline.

<a id="p12"></a>
### P12 — Access, privilege, masking and security-event procedure

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Enterprise plus product.
- **Owner:** Security/IAM owner.
- **Review/approval:** Authorized security and data-access authorities.
- **Minimum contents:** Request/approve/provision/review/revoke access, service identities, privileged access, segregation, masked test data and escalation into bank security incident handling.
- **Update/evidence timing:** Before environment access; periodic reviews.
- **Applicability:** Baseline.

<a id="p13"></a>
### P13 — Retention, archive, legal-hold and disposal procedure

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Enterprise plus dataset.
- **Owner:** Records/data governance owner.
- **Review/approval:** Authorized records/legal/privacy authorities.
- **Minimum contents:** Approved schedules, purpose limits, hold precedence, raw replay versus history retention, archives/backups and evidence of authorized disposal.
- **Update/evidence timing:** Before retention configured; holds and scheduled reviews.
- **Applicability:** Baseline.

<a id="p14"></a>
### P14 — Incident, escalation and business-fallback procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per service.
- **Owner:** Service owner.
- **Review/approval:** Operations authority; business owner approves fallback use.
- **Minimum contents:** Severity, incident command, late/missing output response, source isolation, customer/regulator communications ownership and safe fallback criteria; link security incidents separately.
- **Update/evidence timing:** Before go-live; every incident.
- **Applicability:** Baseline.

<a id="p15"></a>
### P15 — Problem management and root-cause procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Enterprise.
- **Owner:** Operations/problem manager.
- **Review/approval:** Service owner.
- **Minimum contents:** Root cause, contributing controls, corrective actions, owners/dates, verification and learning from recurring defects or missed deadlines.
- **Update/evidence timing:** Before steady-state support; material/recurrent incidents.
- **Applicability:** Baseline.

<a id="p16"></a>
### P16 — Backup, restore and disaster-recovery exercise procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per service.
- **Owner:** Continuity/platform owner.
- **Review/approval:** Service owner and continuity authority.
- **Minimum contents:** Exercise cadence, scenarios, restore/failover/failback steps, dependency coordination, validation and evidence; refers to actual topology in X16.
- **Update/evidence timing:** Before production; planned exercises and topology changes.
- **Applicability:** Baseline.

<a id="p17"></a>
### P17 — Service-level, freshness, capacity and cost-review procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per service.
- **Owner:** Service owner.
- **Review/approval:** Business and platform owners accept actions in their scope.
- **Minimum contents:** Measure SLA/OLA, lag, finality, batch duration, source impact, capacity headroom and cost; trend review, thresholds and remediation decisions.
- **Update/evidence timing:** Before go-live; recurring operational reviews.
- **Applicability:** Baseline.

<a id="p18"></a>
### P18 — Metadata, lineage and catalogue stewardship procedure

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Enterprise.
- **Owner:** Data governance lead.
- **Review/approval:** Governance authority.
- **Minimum contents:** Mandatory metadata, generation versus manual stewardship, certification, stale-entry checks, lineage review and owner recertification.
- **Update/evidence timing:** Before catalogue publication; each release and review.
- **Applicability:** Baseline.

<a id="p19"></a>
### P19 — Backfill, replay and exceptional rerun procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per execution.
- **Owner:** Data engineering lead.
- **Review/approval:** Data/service owner authorizes impact; technical owner controls execution.
- **Minimum contents:** Scope, source retention, consistent checkpoints, approved rerun window, throttling, idempotency, duplicate prevention, reconciliation and publication isolation.
- **Update/evidence timing:** Before first rerun/backfill; each exceptional execution.
- **Applicability:** Baseline.

<a id="p20"></a>
### P20 — Knowledge transfer and service-handover procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per service/team.
- **Owner:** Service transition lead.
- **Review/approval:** Receiving support/service owner.
- **Minimum contents:** Training, shadow/reverse-shadow support, runbook execution, access readiness, support capacity, evidence and explicit operational acceptance.
- **Update/evidence timing:** Plan before go-live; execute at transition.
- **Applicability:** Baseline.

<a id="p21"></a>
### P21 — Data-product and legacy retirement procedure

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per retirement.
- **Owner:** Service/product owner.
- **Review/approval:** Affected owners approve dependencies; designated authority approves disposal.
- **Minimum contents:** Usage/dependency checks, consumer notice, migration acceptance, fallback expiry, archival/hold checks, access/job shutdown and evidence.
- **Update/evidence timing:** Before first planned retirement; every retirement.
- **Applicability:** Baseline.

<a id="p22"></a>
### P22 — Risk exception and control-waiver procedure

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Enterprise.
- **Owner:** Risk/control owner.
- **Review/approval:** Designated bank risk-acceptance authority.
- **Minimum contents:** Justification, impact, compensating controls, accountable approver, expiry, review and remediation; a project manager cannot waive obligations outside their mandate.
- **Update/evidence timing:** At mobilization; every exception.
- **Applicability:** Baseline.

## Manager and steering committee — decisions and assurance

<a id="m01"></a>
### M01 — Programme mandate and sponsor appointment

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** Sponsor/programme lead.
- **Review/approval:** Executive authority under bank delegation.
- **Minimum contents:** Problem to solve, executive sponsor, decision authority, discovery funding and immediate constraints; authorizes initiation.
- **Update/evidence timing:** Day 0; mandate changes.
- **Applicability:** Baseline.

<a id="m02"></a>
### M02 — Business case and benefits measurement plan

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** Programme lead with finance.
- **Review/approval:** Investment/funding authority.
- **Minimum contents:** Options, value, cost assumptions, source-load baseline, reporting/control benefits, measures, benefits owners and review dates; avoid unsupported savings.
- **Update/evidence timing:** Initial funding; material scope/cost changes.
- **Applicability:** Baseline.

<a id="m03"></a>
### M03 — Project charter and scoped completion criteria

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** Programme manager.
- **Review/approval:** Sponsor and scoped business owners.
- **Minimum contents:** Objectives, in/out scope, deliverables, constraints, sponsor, escalation, acceptance boundaries and explicit definition of project finished.
- **Update/evidence timing:** Before execution funding; approved scope changes.
- **Applicability:** Baseline.

<a id="m04"></a>
### M04 — Current-state assessment and gap briefing

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Programme.
- **Owner:** Principal DWH architect.
- **Review/approval:** Sponsor acknowledges priorities; fact owners validate supporting findings.
- **Minimum contents:** Systems/reporting landscape, measurable pain, operational risks, staffing/tooling gaps and evidence confidence; distinguish facts, old proposals and assumptions.
- **Update/evidence timing:** After discovery; major new findings.
- **Applicability:** Baseline.

<a id="m05"></a>
### M05 — Target-state recommendation and decision paper

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Programme.
- **Owner:** Principal DWH architect.
- **Review/approval:** Architecture authority decides architecture; sponsor decides funding within remit.
- **Minimum contents:** Recommended architecture, alternatives, tradeoffs, source/ODS/EDW placement, cost and operating consequences; links detailed D07/D08 evidence.
- **Update/evidence timing:** Before architecture investment; material changes.
- **Applicability:** Baseline.

<a id="m06"></a>
### M06 — Prioritized roadmap and pilot-selection paper

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Programme.
- **Owner:** Data product/programme lead.
- **Review/approval:** Sponsor with business priority owners.
- **Minimum contents:** Ranked use cases, scoring, reuse, dependencies, readiness, risk and bounded pilot; show why a candidate is first and what makes it succeed.
- **Update/evidence timing:** After discovery; every planning wave.
- **Applicability:** Baseline.

<a id="m07"></a>
### M07 — Integrated delivery and dependency plan

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** Programme manager.
- **Review/approval:** Sponsor baselines scope/milestones; delivery owners accept commitments.
- **Minimum contents:** Work breakdown, milestones, critical path, access/procurement/business dependencies, staffing, gates and realistic estimates; refine rolling waves.
- **Update/evidence timing:** Initial mobilization; weekly updates.
- **Applicability:** Baseline.

<a id="m08"></a>
### M08 — Organization, staffing and capability plan

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** DWH/delivery manager.
- **Review/approval:** Sponsor and line managers commit capacity.
- **Minimum contents:** Roles, named assignments/deputies, skills, hiring/vendor needs, training, business participation and sustainable production support.
- **Update/evidence timing:** Before delivery; capacity changes.
- **Applicability:** Baseline.

<a id="m09"></a>
### M09 — Budget, procurement and total-cost plan

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** Programme manager with finance/procurement.
- **Review/approval:** Delegated funding authority.
- **Minimum contents:** Capex/opex, licences, compute/storage/network, DR, staffing, support, renewals, contingency and forecast-versus-actual; separate delivery from recurring costs.
- **Update/evidence timing:** Initial estimate; monthly forecast.
- **Applicability:** Baseline.

<a id="m10"></a>
### M10 — Sourcing/RFP, evaluation and award recommendation

- **First needed:** P2 — Architecture, detailed design and foundations.
- **Scope:** Per procurement.
- **Owner:** Procurement lead with architect.
- **Review/approval:** Procurement/funding authorities.
- **Minimum contents:** Requirements, scored evaluation, representative proof-of-capability, support/exit obligations, commercial comparisons and award rationale.
- **Update/evidence timing:** Before supplier selection.
- **Applicability:** Conditional: procurement or contracted delivery is needed.

<a id="m11"></a>
### M11 — RAID, dependency and action register

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** Programme manager.
- **Review/approval:** Each named owner accepts actions; sponsor escalates material items.
- **Minimum contents:** Risks, assumptions, issues, dependencies, probability/impact, mitigation, owner, due date and status; reference detailed defects rather than duplicate them.
- **Update/evidence timing:** From day 0; weekly and event-driven.
- **Applicability:** Baseline.

<a id="m12"></a>
### M12 — Management decision and scope-change log

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** Programme manager.
- **Review/approval:** Named delegated decision-maker for each entry.
- **Minimum contents:** Decision/request, alternatives, impact on cost/schedule/risk/benefits, evidence, approver, date and actions; detailed architectural rationale stays in D07.
- **Update/evidence timing:** Every material management decision.
- **Applicability:** Baseline.

<a id="m13"></a>
### M13 — Stakeholder and communication plan

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Programme.
- **Owner:** Programme/change manager.
- **Review/approval:** Sponsor and communication owners.
- **Minimum contents:** Audiences, concerns, forums, cadence, escalation, release/change messages and accountable senders; external communication follows existing bank authority.
- **Update/evidence timing:** At mobilization; stakeholder changes.
- **Applicability:** Baseline.

<a id="m14"></a>
### M14 — Weekly manager status and monthly steering pack

- **First needed:** P0 — Day 0 — mandate and mobilization.
- **Scope:** Recurring management cycle.
- **Owner:** Programme manager with architect.
- **Review/approval:** Manager reviews; steering decision-makers resolve requested decisions.
- **Minimum contents:** Progress against baseline, delivered value, forecast, spend, top risks/dependencies, control readiness and explicit decisions needed with deadlines.
- **Update/evidence timing:** Weekly manager; monthly steering, adaptable to bank cadence.
- **Applicability:** Baseline.

<a id="m15"></a>
### M15 — Stage-gate, investment and go/no-go decision pack

- **First needed:** P1 — Discovery and requirements.
- **Scope:** Per gate/release.
- **Owner:** Programme/release manager.
- **Review/approval:** Business, technical, service and risk authorities decide their respective gates.
- **Minimum contents:** Evidence index, criteria/results, blockers, scoped exceptions, cutover/rollback readiness and separately recorded acceptance, risk and deployment decisions.
- **Update/evidence timing:** At each gate; before each production release.
- **Applicability:** Baseline.

<a id="m16"></a>
### M16 — Benefits realization and adoption report

- **First needed:** P4 — Migration, parallel running and cutover.
- **Scope:** Per wave plus programme.
- **Owner:** Benefits owner with programme analyst.
- **Review/approval:** Business benefit owners validate achieved outcomes.
- **Minimum contents:** Measured KALE load reduction, deadlines, quality, report delivery lead time, adoption, costs and retired workload; compare to M02 baseline.
- **Update/evidence timing:** After each stable wave; agreed benefits reviews.
- **Applicability:** Baseline.

<a id="m17"></a>
### M17 — Project closure and final acceptance report

- **First needed:** P6 — Programme completion and closure.
- **Scope:** Programme.
- **Owner:** Programme manager.
- **Review/approval:** Sponsor accepts scoped closure; business and service owners accept deliverables/operations.
- **Minimum contents:** Scope completion, final finances, residual risks and actions, accepted handover, legacy disposition, evidence archive, lessons and remaining obligations with funded owners.
- **Update/evidence timing:** After stabilization and scoped completion.
- **Applicability:** Baseline.

<a id="m18"></a>
### M18 — Post-implementation review and improvement backlog

- **First needed:** P6 — Programme completion and closure.
- **Scope:** Programme/BAU transition.
- **Owner:** Service/benefits owner.
- **Review/approval:** Sponsor or receiving service authority accepts follow-up ownership.
- **Minimum contents:** Actual versus expected outcomes, incidents, adoption, lessons, debt, improvement priorities and benefits-review dates; distinguish future enhancement from unfinished committed scope.
- **Update/evidence timing:** At closure review and scheduled follow-up.
- **Applicability:** Baseline.

## Package the records without creating paperwork overload

Use approximately these 12 controlled packs. A pack is an index of authoritative records and can span a repository, catalogue and ticket system; it is not necessarily a single document.

1. **Programme and business-case pack:** M01–M03, M06–M09, M11–M14. Charter, scope, staffing, schedule, budget and ongoing management.
2. **Discovery and reporting portfolio:** D01–D06, M04. Source and output inventories, profiling, requirements and measurable service needs.
3. **Architecture and platform pack:** D07–D08, M05, X07–X09. Design decisions, physical capacity, connectivity and security.
4. **Data model and metadata catalogue:** D09–D11, D14, D17, X04–X05. Business and technical meaning, keys, history and lineage.
5. **Source and consumer contract pack:** X01–X03, X06, X14–X15. Accountable handoffs and measurable dependency/consumer commitments.
6. **Engineering implementation pack:** D12–D13, D15–D18, D22, D24. Mapping, ingestion, controls, semantics, deployment and known limits.
7. **Governance and compliance pack:** P01–P05, P07–P09, P12–P13, P18, P22, X10–X12. Link actual bank policies; maintain product-specific applicability.
8. **Test and migration pack:** D19–D21, X13, P06, P19. Plans and executed evidence remain distinguishable.
9. **Production operations and continuity pack:** D23, X16–X17, P14–P17. Runbooks, monitoring, incident/problem handling and demonstrated recovery.
10. **Release, publication and transition pack:** M15, X19–X20, P10–P11, P20–P21. Release records, business delivery, training, handover and retirement.
11. **Supplier and procurement pack, where applicable:** M10, X18. Requirements, selection, contracts, entitlements, support and acceptance.
12. **Benefits and closure pack:** M16–M18. Measured value, final acceptance and continuing improvement ownership.

Overlapping references mean reuse of the same record, not duplicate copies.

## The first documents I would open on day 0

Start these as short working drafts, not fully populated fiction:

1. M01 mandate and named sponsor.
2. M03 charter with scope boundaries and provisional finish criteria.
3. P01 ownership register using [[DWH Ownership Operating Model]].
4. M07 initial delivery plan, M08 staffing plan and M09 initial cost assumptions.
5. M11 RAID/action register and M12 decision log.
6. M13 communication plan and M14 first manager update.
7. P02 document control and P03 request/prioritization process.
8. M02 business-case skeleton and benefits-baseline measurement plan.

Then open D02 source inventory, D03 report inventory and the first D05 requirements record during discovery. Do not defer documenting authority, sensitive-data handling or supported extraction until after ingestion has started.

## What repeats for each source, product and release

- **Each source/feed:** D02, D04, D13; X01–X03 and X06; relevant access/security/classification records.
- **Each data product/report family:** D05–D06, D09–D18 and the relevant business glossary, consumer contract, reconciliation and service agreement.
- **Each production release:** change/deployment record under P10; D20 evidence; versioned D22 dossier; X13 business acceptance; updated D23 runbook; M15 go/no-go; publication authorization under P11.
- **Each historical migration:** D21 plan and executed evidence, authorized replay/backfill records under P19, before/after reconciliation and rollback/containment arrangements.
- **Each new support handover:** X15–X19 and executed acceptance under P20.
- **Each legacy retirement:** X20 executed evidence under P21.
- **Each recurring management cycle:** M11–M14 updates and M16 once measurable benefits are available.

Requirements D05/D06 lead to contracts X01/X04/X12/X14, design D09–D18, traceability D19, evidence D20/X13, decision M15 and operational acceptance X15/P20. Preserve those links through change.

## Practical register metadata

For live tracking, each record should have: ID; title; scope/asset ID; named owner and deputy; accountable approver per decision; status; version; authoritative link; first-needed phase; due milestone; dependencies; last/next review; information classification; approval evidence; applicability/rationale; and retention category.

Leave unknown owners/dates explicitly unassigned in the live register until appointed. This proposal assigns responsibility to roles without claiming bank appointments or inventing approvals.

## Tailoring to this bank

- Include Team Developer and web reports, MicroStrategy, scheduled database jobs, external files and APIs in D03. A count of MicroStrategy reports alone understates the scope.
- Resolve end-of-day signals and historical-update behaviour in X02/D04; source notes describe timing differences that have not been reconciled.
- Use PowerDesigner metadata to seed D02/D11 and ownership discovery; verify completeness and currency rather than assume table ownership proves metric authority.
- Treat member identifiers, accounts and market participation in X04/X05 as shared business agreements.
- Measure source-load benefit and shared-hardware contention in D08/X03/M16. A new database name is not proof of resource isolation.
- Review any short source-retention window before planning history capture. The July 2025 notes describe a five-day contract-retention example; verify whether that remains current.
- For member/regulatory outputs, control published versions, delivery evidence and corrections in X11/X14/P09/P11.
- Neither prior vendor proposals nor the existing architecture draft substitutes for bank approval. This register does not adopt a particular ODS/EDW topology or pilot by implication.

## Existing repository material to reuse

- [[DWH Ownership Operating Model]] — proposed owner/RACI/process baseline for P01 and related procedures; assess and approve instead of duplicating.
- [[Proje Planı]] — implementation planning input for M06/M07; this register adds document coverage rather than rewriting execution tasks.
- [[DWH Hedef Mimarisi v2]] and [[DWH Logical Data Model]] — design inputs for D07/D09; reassess against approved requirements.
- [[Fiziksel Topoloji - Teknik Taraf]] — environment discovery input for D02/D08.
- [[Aktif Sorular]] — unresolved questions feeding M11 and discovery.
- [[Takasbank Genel Bilgilendirme]], [[Takasbank Genel Bilgilendirme 2]], [[Ortamlar hakkında]] and [[PowerDesigner Bilgilendirme]] — reported current-state context, subject to validation.
- [[DWH Sunum Temmuz 2025]] — candidate use cases and historical proposals, not production acceptance evidence.

The register is an architect's proposed delivery standard, not a jurisdiction-specific legal checklist. The bank's compliance, security and records authorities determine applicable obligations and retention requirements in X10/X11 and the linked policies.

