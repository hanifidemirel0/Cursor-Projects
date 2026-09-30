---
title: ETL Proof of Concept and Acceptance
created: 2026-09-28
status: proposed-test-protocol
tags: [dwh, etl, poc, acceptance]
---

# ETL Proof of Concept and Acceptance

Parent: [[ETL Tool Evaluation]]. Results are recorded in its workbook. This is a test protocol, not evidence that any test has run.

## 1. Freeze the test charter before execution

Record exact candidate and component versions, deployment topology, license/edition, CPU/RAM/storage/network allocation, source/target database releases and patches, connector/driver versions, scheduler, security controls, and support owner. Record tuning time and custom code. Candidate O1–O5 and test P01–P12 identifiers match the workbook.

Use approved masked or synthetic bank-shaped data in authorized test environments. Production sampling/load tests need the source owner's agreed window and safeguards. An unapproved source-access shortcut invalidates the comparison. Preserve the same input data, change sequence, business expectations and baseline output across candidates.

No thresholds are assumed approved. Before starting, complete and sign the following measurement contract:

```text
Workload / business owner / source owner / service owner:
Business date / timezone / relevant calendar / finality signal:
Rows, bytes, row width, LOB share, change/delete rate and skew:
Concurrent ingestion/reporting jobs and users:
Peak and growth case, derived from measured demand:
Maximum source CPU/I/O/redo/lag/connections and abort conditions:
Target resource envelope and concurrent-reporting response target:
Batch completion and capture-to-publication freshness limits:
Record/count/key correctness: exact / approved exceptions:
Financial precision, currency, rounding and approved tolerance:
RPO / RTO / recovery and business validation deadline:
Support hours / operator-effort target:
Repetitions / warm-up / cache treatment / acceptance statistic:
Approvers / date / evidence location:
```

Do not estimate a credible tail percentile from a few runs. For a small PoC, report each run and median/max with the sample count. Use p95/p99 only when the sample design supports it. Distinguish warm and cold cache results and infrastructure contention.

## 2. Workload bundle

**W1 — Oracle relational EDW.** A source transaction table, member/reference tables, an effective-dated dimension and a daily fact at an explicit grain. Include inserts, updates, deletes, nulls, precise amounts, late changes, multiple source transactions and business-date boundaries. Produce a reconciled Oracle serving table and the same report query for all candidates.

**W2 — Fund/member file intake.** Use approved representative files or synthetic equivalents. Include a corrected submission, duplicate file, malformed row, invalid identifier, out-of-order delivery, encoding/decimal variations, and a manifest/control total. Produce accepted and quarantined populations with a deterministic publication version. Do not assume a corrected submission replaces the entire prior file unless its contract says so.

**W3 — Historical SWIFT-style enquiry.** Preserve repeated message fields and details; derive the same approved search projection. Use a controlled expected-match set and false-positive cases. The workload proves correctness and performance, not a claim that one row per message contains all relevant information. Agree the query parameters and authorization rules with the report owner.

**W4 — Intraday corrections and publication.** Replay a defined event/change sequence into the common serving target. Include delays, cancellation, source rollback, repeated delivery and target failure. If near-real-time CDC is required, include the proposed CDC product in every solution and its full cost. Otherwise demonstrate a correct scheduled-change path within the approved freshness window.

The source presentation notes inform workload selection; current formats, volumes and business rules must come from owners. Do not use historical slide numbers as a sizing commitment. See [[DWH Sunum Temmuz 2025]].

## 3. Repeatable test cases

### P01 — Disconnected deployment and operation

**Exercise:** install from approved locally mirrored media; block external egress; create/modify a job; execute, schedule, restart, rotate credentials, inspect lineage/logs, restore configuration and apply a test patch using the offline process. Observe attempted as well as successful outbound traffic. Include IDE plugins, license checks, agents, crash reporting and support bundles.

**Pass:** runtime, management, metadata and logs remain local; required functions remain available without a cloud service. Explain every attempted destination. Document any time-limited license dependency. No automatic upload of bank diagnostics is allowed.

**Evidence:** component/network map, configuration, firewall/DNS/proxy observations, operation log, offline package inventory and security approval. Supports G01/C07. Cloud-managed IDMC/CDI-PC is excluded before this test unless a materially different fully local offer is documented.

### P02 — Oracle batch extraction and consistent loading

**Exercise:** load W1 from the approved source/replica with a defined consistency boundary while permitted source changes occur. Verify cross-table consistency, partition boundaries, Oracle data types, NLS/character handling, timestamps/timezones, LOBs and NUMBER precision. Measure source and target impact and all movement.

**Pass:** matches the agreed cutoff, exact population and numerical rules; stays inside the source resource envelope and delivery deadline. Mere row counts are insufficient evidence of cross-table consistency.

**Evidence:** snapshot/SCN or equivalent consistency proof, SQL plans, row/control totals, elapsed stages, bytes moved, source/target CPU/I/O and connection counts. Supports G03/G04, C01/C02.

### P03 — File and API ingestion

**Exercise:** process W2 plus an approved paginated API simulation if that source is in scope. Inject duplicates, partial files, missing pages, timeouts, expired credentials, bad encodings and invalid rows. Record retries and quarantine.

**Pass:** no silent omissions or double processing; restart resumes safely; schema and content validations distinguish accepted and rejected populations. Invalid data cannot reach a certified output without its approved exception path.

**Evidence:** manifests/hashes, API page/sequence records, quarantine, retry state and end-to-end output comparison. Supports C02/C10 and G03/G07.

### P04 — Incremental changes and deletes

**Exercise:** initial load followed by insert, update, delete, primary-key change where supported, rollback, repeated event, late commit and downtime/backlog. Include a change older than a naive recent-timestamp window. For a CDC proposal, test capture restart and retention exhaustion/reseed. For batch, prove the chosen snapshot/diff or reliable change mechanism.

**Pass:** every committed in-scope change is represented correctly; rollback does not become a business event; deletes and replays are handled; no unbounded gap is hidden. Meet the approved freshness target.

**Evidence:** source transaction oracle, target states, watermarks/checkpoints, retained change boundary, reseed procedure and latency samples. Supports G03, C03. A streaming engine without a capture source does not pass this test.

### P05 — Historical correction and schema change

**Exercise:** apply a backdated correction and an effective-dated reference change; rebuild an affected historical period; add a compatible column and introduce an incompatible type change. Validate dbt adapter/materialization/package behaviour or equivalent tool mapping on the exact release.

**Pass:** both originally published and corrected interpretations can be traced according to the contract; no accidental rewriting of unaffected history. Incompatible schema changes stop or quarantine with a clear diagnostic. DDL transaction behaviour and rollback limits are understood.

**Evidence:** before/after history, publication linkage, change records, code diff, tests and rollback/rebuild result. Supports C03/C04/C08 and G03.

### P06 — Reconciliation and report semantics

**Exercise:** compare atomic and aggregate results against business-approved expectations. Include many-to-many join traps, cancelled/reversed records, balance snapshots, gross/net distinctions, currency/rounding and late reference records. Deliberately introduce a discrepancy.

**Pass:** agreed exact/control-tolerance results; mismatch is detected and assigned; incomplete or inconclusive controls cannot appear passed. Failed controls prevent the affected certified publication.

**Evidence:** expected/actual results at matching grain/time, discrepancy record, rule definition and acceptance by the business owner. Supports G03/G07, C04/C06.

### P07 — Partial failure, restart and replay

**Exercise:** terminate processing after extraction, after a partial target write, during a multi-table update, and between publication and delivery acknowledgement. Repeat the same run identifier and input. Test scheduler retry overlap and concurrent duplicate submissions.

**Pass:** no lost or duplicate business facts or externally duplicated delivery; a coherent validated version is exposed. Operator effort and recovery fit the contract. Prove sink-side idempotency rather than assuming checkpoints provide it.

**Evidence:** failure timestamps, durable state/checkpoints, target transaction state, idempotency controls, recovery actions and reconciled result. Supports G05, C05/C09.

### P08 — Restore and disaster recovery

**Exercise:** restore repositories/configuration, secrets dependencies, source position, processing checkpoints, staging/history and serving state in the intended DR arrangement. Recover an intentionally inconsistent backup/checkpoint scenario safely.

**Pass:** accepted RPO/RTO measured through business-validated service availability, not merely database startup. No untraceable state or duplicate publication after replay. Document dependencies that prevent independent recovery.

**Evidence:** backup boundary, recovery timings, operator runbook, reconciliation and service-owner approval. Supports G05/C05.

### P09 — Controlled report, API and file delivery

**Exercise:** publish the same certified data to the common Oracle serving contract, run the report, and create an agreed member-file/API output. Test failed validation, unavailable recipient, rejection, timeout after delivery and reissue.

**Pass:** explicit business cutoff/version and freshness; no partially refreshed output; entitlement respected; acknowledgement/rejection retained; retries and corrections are traceable. Trace a selected output field back through every source/transformation hop.

**Evidence:** source-to-report lineage, output hash/version, gate results, authorization, delivery/receipt and reissue relationship. Supports G07, C02/C06.

### P10 — Concurrency, scale and cost of movement

**Exercise:** run agreed batch, intraday and reporting concurrency at baseline, peak and growth volumes/skew. Compare tuning under the allocated envelope and proposed production sizing. Include network transfer, staging and loading back to Exadata for cluster candidates.

**Pass:** deadlines and query targets met within source/target limits, without starvation or an unpriced resource increase. Record degradation and bottlenecks rather than extrapolating linear scalability.

**Evidence:** repeated timings, query responses, CPU/I/O/temp/spill, network bytes, connection counts, concurrency, sizing and per-run resource consumption. Supports G04, C01/C10 and TCO inputs.

### P11 — Security, entitlement and audit

**Exercise:** unauthorized user and cross-member access attempts; secret rotation; disabled user/service account; role separation; audit export to the local bank service; backup protection; masked non-production access. Inspect logs for sensitive values.

**Pass:** least privilege and required authentication/encryption; no cross-member leakage; meaningful local audit; secrets absent from code/logs; access removal and recovery follow policy. Prove controls across files and APIs as well as the database.

**Evidence:** security test results, entitlement matrix, local audit samples, approval and unresolved findings. Supports G06/C07.

### P12 — Release, upgrades, support and handover

**Exercise:** a bank engineer reproduces build and deploys a reviewed change from internal repositories, promotes it, rolls back or restores safely, and diagnoses an injected failure using the runbook. Validate an upgrade in a disposable environment and export definitions/code/metadata needed for exit.

**Pass:** deployment and operations are repeatable without undocumented vendor assistance; complete support matrix, contracts, escalation, component owners and offline update process exist. Upgrade and exit limitations are explicit and accepted.

**Evidence:** lockfiles/BOM, review and deployment records, operator effort, export/rebuild result, lifecycle evidence and named support ownership. Supports G02/G08, C08/C09/C11.

## 4. Results and acceptance

For each option/test, record measured result, threshold, Pass/Fail/Blocked/Not run, evidence URI, reviewer and date in the workbook. Its 60 initial result records are unexecuted. Record reruns as new evidence; do not erase failed attempts or materially different configurations.

Evidence references resolve to a controlled local repository containing inputs, expected outputs, configurations, run IDs, logs, metrics and approval. A vendor slide or checkbox is not a successful PoC run. A test may contribute to several criteria but its business benefit must not be counted repeatedly under unrelated criteria.

Gate approvers review the results and additional contractual/operating evidence. A blocked test is unresolved, not a pass or automatic technical failure. Preserve causes and next actions. If a capability is out of scope, the panel changes the common charter before scoring; a vendor cannot claim unilateral N/A.

Before recommendation, ensure identical output semantics, comparable resource/cost scope, complete gates, criterion evidence, five-year cost basis and sensitivity. Complete [[ETL Selection Decision Record]]. Production rollout still requires the bank's normal change and service-acceptance process.
