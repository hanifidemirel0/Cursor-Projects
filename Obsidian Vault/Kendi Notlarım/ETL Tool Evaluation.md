---
title: ETL Tool Evaluation
created: 2026-09-28
status: proposed-evaluation-framework
tags: [dwh, etl, procurement, architecture]
---

# ETL Tool Evaluation

## Decision and non-negotiable boundary

Select a supportable integration and transformation solution for the bank's on-premises EDW and operational reporting. Compare **complete deployable solutions**, including dependencies, people, support, and source-to-output controls.

**Confirmed user requirement, 28 September 2026:** runtime, management/control plane, metadata, and logs must remain on premises. A local execution agent attached to a cloud management service does not satisfy this requirement. Include developer tools, telemetry, catalogues, scheduler, CI/CD, secrets, licence validation, diagnostics, backups, and DR in the assessment. Installation/update media may be imported through an approved offline process; no bank metadata or logs are to leave the boundary.

No product has passed the bank's evaluation yet. Public documentation establishes candidate capabilities, not the performance, commercial entitlement, security approval, or operational acceptance of a specific deployment.

## Evaluation pack

- [Editable comparison, scorecard, gates, PoC results and five-year cost model](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Evaluation.xlsx).
- [[ETL Proof of Concept and Acceptance]] — workload definition, repeatable tests, thresholds and evidence.
- [[ETL Vendor RFI and Commercial Evaluation]] — common and option-specific questions, bill of materials, cost assumptions and support requirements.
- [[ETL Selection Decision Record]] — decision, evidence, dissent, conditions and approval template.
- [[DWH Ownership Operating Model]] — the bank roles that own definitions, service acceptance, security decisions and publication.

The workbook owns the comparison cells, proposed weights, score inputs, results, and cost inputs. This note owns the methodology and architectural interpretation. Actual programme actions belong in [[Proje Planı]]; institutional unknowns remain in [[Aktif Sorular]].

## 1. Bank context and assumptions to validate

The notes describe an Oracle/Exadata estate, operational reporting pressure, MicroStrategy usage, historical corrections, existing source ownership metadata, and several batch/intraday/file workloads. Informatica TDM availability does not establish an entitlement to PowerCenter, PowerExchange, or another Informatica integration product. Tool licenses, staffing, source volumes, topology and supported versions require current confirmation. See [[Fiziksel Topoloji - Teknik Taraf]], [[PowerDesigner Bilgilendirme]] and [[DWH Sunum Temmuz 2025]].

The existing [[Dataguard vs Goldengate]] note contains earlier positions on ingestion tools. Treat those recommendations as historical working assumptions for this evaluation. This pack neither approves their source-access routes nor assumes that an existing replica, package, or license is free or suitable.

Primary comparison assumption: the curated EDW and the common serving output remain on Oracle Exadata. The bank must confirm that target before benchmarking. A Cloudera-hosted lakehouse replacing the EDW is a separate architecture decision with different serving, migration and operating costs. Do not compare that redesign against a transformation-only replacement as if their scope were equal.

## 2. Normalize the five candidates

### O1 — Informatica PowerCenter on premises

**Comparison boundary:** an explicitly quoted, supported PowerCenter on-premises deployment. Cloud-managed IDMC and CDI-PC variants are excluded by the confirmed boundary. The official CDI-PC component description includes an IDMC service and a Secure Agent connection; an on-premises domain does not make that complete solution local. [CDI-PC components](https://docs.informatica.com/integration-cloud/cloud-data-integration-for-powercenter/current-version/installation-guide-for-cloud-data-integration-for-powercenter--c/appendix-a--cdi-pc-components/components.html).

**Minimum solution to specify:** repository and integration services, development/admin clients, required connectors, scheduler integration, secrets, logging, HA/DR, and CDC if required. Name any separate catalogue, quality, lineage or monitoring products rather than assuming the entire Informatica portfolio is included.

**Architect assessment:** credible direct EDW contender when heterogeneous connectivity, graphical development and vendor support are valuable. Test target-side pushdown versus engine execution. Oracle pushdown capability is transformation-dependent, and documented update behaviour requires careful comparison. [Pushdown guidance](https://docs.informatica.com/data-integration/powercenter/10-5-9/advanced-workflow-guide/pushdown-optimization-and-transformations/update-strategy-transformation.html).

**Main uncertainties:** commercially available fully local edition, contract support horizon, Oracle certification, actual pushdown coverage, connector scope, and total cost. Require a written roadmap for the offered edition. Do not assert a retirement date or assume an upgrade to cloud is permissible.

### O2 — Oracle Data Integrator on premises

**Comparison boundary:** named ODI release, local repositories, local agents, required knowledge modules, development/admin tools, bank scheduler integration, and monitoring. Include every dependent database, application-server component and license in the bill of materials.

Oracle describes an architecture using repositories, agents and technology-specific knowledge modules. Assess the actual module and execution plan selected for each mapping. [ODI architecture](https://docs.oracle.com/en/middleware/fusion-middleware/data-integrator/14.1.2/odiun/overview-oracle-data-integrator.html), [knowledge-module reference](https://docs.oracle.com/en/middleware/fusion-middleware/data-integrator/14.1.2/odikm/index.html).

**Architect assessment:** a strong baseline to test when sources, target, SQL expertise and operating practices are Oracle-oriented. Generated SQL must still meet the bank's concurrency, resource, correctness and maintainability requirements. Oracle branding is not performance evidence.

**Main uncertainties:** exact supported configuration, knowledge-module customization, repository/agent recovery, source extraction safety, CDC design and commercial entitlements. ODI and a log-based CDC product serve different roles. Do not assume GoldenGate or required middleware is included in the quote.

### O3 — Self-hosted dbt Core v1 with dbt-oracle on Exadata

**Comparison boundary:** a pinned, mutually compatible Core v1, Oracle adapter, Python, driver and Oracle database combination; an on-premises runner, scheduler, Git/CI, package mirror, secrets, logs and documentation hosting; and a separately specified ingestion/CDC path.

The Oracle setup page identifies Oracle as adapter maintainer, lists the v1 compatibility context, and labels dbt support as not supported. It lists materialization/test capabilities and an ephemeral-materialization limitation. Establish exact on-premises Exadata compatibility and a bank-acceptable support route through testing and written commitments. [Oracle adapter setup](https://docs.getdbt.com/docs/local/connect-data-platform/oracle-setup), [Oracle-maintained repository](https://github.com/oracle/dbt-oracle).

**Architect assessment:** a credible SQL transformation challenger with a code-oriented development model, especially if reliable ingestion and local CI/operations already exist. dbt is not a substitute for a complete ingestion, scheduling and production-service stack. Seeds are not a general bulk-ingestion service. Project dependency graphs are not automatically enterprise-wide column lineage.

**Version warning:** current product terminology distinguishes historical Core v1, dbt v2 and dbt OSS. The pack intentionally evaluates the v1 Oracle-adapter path, not an unspecified latest binary. A proposed v2/OSS path requires separate compatibility, licensing and egress evidence. Do not transfer adapter support assumptions between versions. [dbt licensing and distribution FAQ](https://www.getdbt.com/licenses-faq).

**Main uncertainties:** contractual support, upgrade continuity, Oracle-specific materialization behaviour, package compatibility, operational tooling and total engineering effort. Disable applicable telemetry and test blocked egress; configuration alone is not acceptance. [Usage-statistics configuration](https://docs.getdbt.com/reference/global-configs/usage-stats).

### O4 — Cloudera on-premises platform

**Comparison boundary:** exact on-premises edition and release, named Base services, storage, cluster management, security/catalogue services, integration jobs, and optional Data Services. “CDP” by itself is insufficient. Cloudera's reference architecture describes a platform including services such as Spark, Ranger and Atlas. Optional Data Services have their own deployment dependencies. [Base reference architecture](https://docs.cloudera.com/cdp-reference-architectures/latest/cdp-pvc-base-ra/topics/ra-cdpdc-abstract.html), [version-specific Data Services architecture](https://docs-archive.cloudera.com/cdp-private-cloud-data-services/1.5.3/overview/topics/cdppvc-ds-deployment-architecture.html).

**Minimum solution to specify:** source ingestion/CDC, supported connector/runtime, durable storage and table format, processing, workflow control, lineage to Oracle and MicroStrategy, and Exadata load/publication. If NiFi or another intake product is selected, identify its deployment, subscription and support explicitly. Do not assume it is included in Base.

**Architect assessment:** evaluate as a broader data-platform investment when there is justified distributed-storage/compute demand and operating ownership. If Exadata remains the serving target, measure the full extraction, processing and return path. Broader functionality earns points only where it meets an agreed requirement.

**Main uncertainties:** minimum production/DR footprint, staffing, component/license scope, Oracle load-back performance, lineage coverage and patch lifecycle. Air-gap installation documentation is useful evidence for a specific edition; it does not alone prove every selected service remains local. [Air-gap installation](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/installation/topics/cdppvc-installation-airgap.html).

### O5 — Apache Spark on an on-premises cluster

**Comparison boundary:** pinned Spark, supported cluster manager, local storage/table format, ingestion/CDC, orchestration, catalogue, quality checks, secrets, monitoring, logs, CI, backup/DR and named support providers. Spark is the processing engine within this solution.

Spark offers JDBC and file processing, but parallel JDBC configuration determines database connections and some pushdown operations are conditional. Benchmark source load and the return path to Exadata. [Spark JDBC documentation](https://spark.apache.org/docs/latest/sql-data-sources-jdbc.html).

**Architect assessment:** consider when measured workload characteristics justify distributed computation and the bank can staff the assembled platform. It is not intrinsically cheaper or faster than executing SQL on existing Exadata. Open-source licensing does not price the complete service.

**Main uncertainties:** engineering/operations effort, target write behaviour, custom framework maintenance, support escalation, security completeness and recovery. Streaming checkpoints do not by themselves establish exactly-once Oracle publication; prove source, transformation, sink and replay semantics together. [Structured Streaming](https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html), [Spark security](https://spark.apache.org/docs/latest/security.html).

## 3. Separate eligibility from preference

The workbook's eight gates are mandatory: all planes local; supportable bill of materials; business correctness; source safety and deadlines; replay/DR; security; controlled traceable publication; and staffed operations.

Gate states are **Unverified, Pass, Fail**. Any Fail excludes that exact offered configuration. Unverified blocks selection. A missing add-on may be remedied by changing the offered configuration, but the new cost and test scope must be included before reassessment. A high weighted score never compensates for a failed gate.

Public research has not established bank acceptance, so all candidate gates start Unverified. The Informatica column represents PowerCenter only. The separately excluded cloud-managed variants are not silently scored under the local product's name.

## 4. Weighted evaluation method

The twelve proposed criterion weights total 100. The workbook is their source of truth. Agree them before vendors see results. Do not tailor weights to favor a candidate after testing.

Use a score from 0 to 5 for each criterion, based on the **complete proposed solution**:

- **0:** demonstrably cannot satisfy the agreed criterion.
- **1:** major unresolved gaps or impractical recurring workarounds.
- **2:** partly meets; material manual work or limitations remain.
- **3:** meets the agreed requirement with supported, repeatable operation.
- **4:** demonstrates a pre-agreed useful improvement with limited additional complexity.
- **5:** demonstrates the pre-agreed superior outcome under representative stress and recovery conditions.

Blank means unassessed. Panel consensus may use fractional scores in range; evidence must explain them. A document claim can support capability discovery, but cannot justify a measured performance or recovery score. Record a result/evidence reference for every rating. The panel defines criterion-specific 3/4/5 anchors before the PoC: for example, delivery target, operator effort, resource envelope, upgrade effort or comparable cost bands.

Weighted score out of 100 = sum(weight × score) / 5. The workbook suppresses the total until all twelve ratings and evidence references are present, valid ratings are within 0–5, weights are numeric/nonnegative, and their total is 100. Criteria coverage measures the fraction of criteria with numeric inputs; it is not weighted confidence or proof of acceptance.

Gate approvals are manual decisions backed by evidence; entering an evidence reference does not cause Excel to validate its contents. The PoC-results sheet supports the review, and gate approvers must verify it. “Ready for decision” also requires a complete cost total for that candidate. It means ready for the selection meeting, not approved for production. The workbook has fixed five-candidate/twelve-criterion ranges; adding candidates or criteria requires updating and revalidating formulas, rather than inserting unreferenced rows.

Cost ratings use comparable complete quotes and the five-year model. Agree cost bands and budget treatment in advance; missing quotations remain unassessed. Do not score open source as zero cost or assume purchased Exadata has unlimited spare capacity.

### Sensitivity and selection

After baseline scoring, test reasonable panel-approved weight variations with the same evidence and gates. Record which tradeoffs change the preferred candidate. Preserve the baseline and changed weights/results in the decision record, restoring the approved baseline in the workbook. Also compare stressed volumes, staffing costs, support uplift and exit cost. A small numerical gap does not establish a meaningful winner when evidence is uncertain.

## 5. Fair comparison rules

1. Hold business definitions, inputs, source access, output grain, control requirements and serving contract constant.
2. Run a common relational workload and relevant file/correction/publication cases through every eligible full solution.
3. Record a normalized resource envelope and an appropriately sized proposed-production configuration. Identical node counts are not a fair comparison between an ELT tool and a cluster engine.
4. Include extraction, transfer, staging, transformation, checks and publication in elapsed time and cost. A fast transformation-only benchmark is insufficient.
5. Separate optional CDC evaluation from scheduled batch. Require CDC only where the chosen service class needs it; updates/deletes must still be captured correctly in a batch design.
6. Use the same approved scheduling interface where practical. Do not give one candidate free external services and require another to include them in its quote.
7. Include an optimized existing SQL/PLSQL baseline for comparison; it is a benchmark, not a sixth procurement candidate.
8. Allow equivalent expert tuning time, record customizations, and rerun after significant changes. Retain both vendor-assisted and bank-operated results.

## 6. Provisional evaluation order

**Architect recommendation, not final ranking:** test ODI and a fully local, supportable PowerCenter offer as direct EDW contenders. Test the dbt/Oracle composition as a challenger once adapter compatibility and operating support are resolved. Evaluate Cloudera and Spark against the same outcome, requiring a business case for their additional platform scope.

This order reflects the reported Oracle-oriented estate and the fixed on-premises boundary. It is not a performance, quality or price finding. A strong measured cluster case, weak commercial offer, or failed compatibility gate can change it.

## 7. Evaluation ownership and approval

Architecture owns scope equivalence and the technical recommendation. Source owners/DBAs approve source access and resource limits. Business data/report owners approve correctness and output acceptance. Security owns the on-premises and access gates. The end-to-end service owner accepts operability and recovery. Procurement validates quotes, entitlement, support and commercial comparability; Finance validates costing assumptions. The delegated investment authority selects the option using [[ETL Selection Decision Record]].

Use actual appointed people under [[DWH Ownership Operating Model]]. Vendors supply evidence and assist testing but do not approve their own gate results. No outreach, procurement, installation or production test has been performed by creating this pack.

## Evidence date and limitations

Public documentation reviewed on 28 September 2026. The workbook's evidence register contains source IDs, links and limitations. Documentation URLs may track newer releases or archived releases; pin the exact offered version and retain its supporting documentation during procurement. Confirm official support/availability matrices and contract terms directly. No bank workload measurements, prices, or final scores have been invented.

Workbook verification covered formula recalculation, failed gates, missing evidence, changed scores/weights, missing-versus-zero costs, exported file structure and visual rendering. Temporary test inputs were removed. These checks used the bundled spreadsheet engine; native Microsoft Excel execution has not been tested. They verify the evaluation workbook, not the five ETL products.
