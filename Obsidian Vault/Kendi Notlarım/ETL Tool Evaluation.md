---
title: ETL Tool Evaluation
aliases: [ETL Araç Değerlendirmesi]
created: 2026-09-28
updated: 2026-10-12
status: proposed-evaluation-framework
tags: [dwh, etl, procurement, architecture]
---

# ETL Tool Evaluation

Compare five complete solutions against the same requirements for the bank’s on-premises enterprise data warehouse and operational reporting. Include the product, dependent components, staffing, support and total cost.

**[Open the current English evaluation workbook](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Comparison.xlsx).**

## Agreed structure

Keep the comparison detailed and the scoring at section level. The workbook has three sheets:

- **Scorecard:** ten criteria, weights, ratings for five candidates, mandatory requirements and calculated results.
- **Comparison:** thirteen sections: the original ten evaluations, a feature-by-feature matrix, AI integration, and open-source licensing and flexibility. Product descriptions identify dependencies, limitations and required evidence.
- **Sources:** official documentation links, version/access limitations and internal references.

The agreed sections are:

1. **Solution scope and architecture:** product, release, components, execution location and accountability boundaries. Not scored.
2. **Mandatory requirements:** local operation, supportable/secure operations and accepted data delivery. Pass/fail, outside the weighted score.
3. **Source integration and data movement:** initial loads, change capture, deletes, files/APIs and source protection.
4. **Transformation and Exadata efficiency:** SQL/engine execution, movement, total time and resource contention.
5. **Data correctness, history and reconciliation:** late corrections, duplicates, business dates, amounts and controlled republication.
6. **Scheduling, operational reporting and recovery:** calendars, readiness signals, delivery deadlines, restart and disaster recovery.
7. **Security, metadata and auditability:** access, secrets, sensitive data, audit and source-to-report traceability.
8. **Development, testing and change management:** review, Git, automated tests, environment promotion and rollback.
9. **Operating model, support and lifecycle:** staffing, on-call coverage, incident ownership, patching/upgrades and handover.
10. **Five-year cost and exit effort:** comparable complete costs and dependencies when moving to another solution.
11. **Product feature comparison:** 36 features across all five products, including connectivity, transformation, data correctness, orchestration, security, development/operations, AI and open source. This is supporting evidence, not a separate weighted total.
12. **AI integration:** locally hosted development assistance, model integration, ML workloads and controlled, traceable inference. Weight **8%**.
13. **Open-source licensing and flexibility:** core/component licensing, source access, extension rights and practical ability to rebuild, maintain or replace components. Weight **7%**.

Sections 03–10, 12 and 13 receive weighted ratings. The user approved AI at 8% and open-source licensing and flexibility at 7% on 12 October 2026. The previous eight weights are multiplied by 0.85, preserving their relative importance and allocating them 85% in total. All ten weights sum to 100%. The workbook owns the current values; user agreement does not substitute for the bank's selection-committee approval.

A strong subfeature must not conceal a critical gap. Section 02 owns minimum acceptance conditions. Section 08 assesses the ability to implement changes; section 09 assesses the people and support sustaining the service. Section 06 evaluates recovery/delivery capability; section 10 evaluates cost. Do not reward the same finding twice for the same reason.

The workbook owns current weights, ratings and comparison content. This note owns the method. The [original detailed English workbook](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Evaluation.xlsx) remains a reference for detailed test and cost templates. The earlier Turkish file is a superseded language version. Files do not synchronize automatically; use **ETL-Tool-Comparison.xlsx** for the current evaluation.

## How to use it

1. **Fix the scope.** Compare the same sources, data, business rules, deadlines and outputs. This evaluation assumes the common EDW/serving target remains Oracle Exadata. Changing that target is a separate architecture decision.
2. **Approve weights before testing.** Amber weight cells are editable. They must total 100 and apply equally to every candidate.
3. **Enter a rating from 0 to 5 per criterion.** Blank means unassessed. Do not invent a rating when prices or test results are missing.
4. **Reference the evidence record.** Use one record per candidate containing the rationale for all ten ratings, test results, component/license assessment and a comparable cost calculation. Enter its filename, record ID or internal link.
5. **Resolve mandatory requirements.** Select Pending, Pass or Fail for each group. The approval record must identify the relevant approvers and dates.
6. **Compare eligible candidates.** Test whether reasonable weight changes alter the preference, then record the decision and rationale.

Rating scale:

- **0:** demonstrably does not meet the requirement.
- **1:** major gaps or unsustainable workarounds.
- **2:** partially meets; significant manual work or constraints remain.
- **3:** meets the requirement through supported, repeatable operation.
- **4:** demonstrates a useful, measurable improvement agreed in advance.
- **5:** demonstrates the pre-agreed superior result under representative load and failure conditions.

Fractional ratings are allowed when the evidence explains them. For cost, a higher rating means lower total cost for the same scope. Agree cost bands before evaluation.

**Weighted score = Σ(weight × rating) / 5.** If every rating is 3, the result is 60/100. Excel suppresses the total until all ten ratings are valid, valid weights total 100 and an evidence reference is present. Zero is a real rating, not a missing value. Weight cells accept decimals; a small numerical tolerance handles spreadsheet arithmetic.

“Ready to compare” requires all three requirement groups to pass, an approval reference and complete ratings/evidence. Excel does not inspect record contents; reviewers must do so. This status is not procurement approval or production acceptance.

## Three mandatory requirement groups

**1. Fully on-premises operation.** The user confirmed on 28 September 2026 that runtime, management/control plane, metadata and logs must remain on premises. Assess telemetry, developer tools, scheduler, catalog, CI/CD, secrets, license validation, diagnostics, backup and DR as well. A local agent connected to cloud management does not meet this boundary.

**2. Security, support and operating acceptance.** The exact product/release/component inventory and licensing, written support scope, access/audit controls, operating team, accountable owners and runbooks must be accepted. This groups original gates G02, G06 and G08.

**3. Correctness, deadlines and recovery tests.** Accept business reconciliation, historical corrections, source-load limits, delivery deadlines, replay, DR and traceable/controlled publication. This groups original gates G03, G04, G05 and G07. Test that publication stops when required quality checks fail.

Select Pass only when **every subcondition** in a group is satisfied. A failed subcondition makes the group Fail; an unresolved subcondition keeps it Pending. A high weighted score never compensates for a failed mandatory requirement.

## Using the feature comparison

Section 11 of Comparison contains **180 product-feature assessments**: 36 features for five candidates. Each cell has a classification, a concise explanation and source IDs. Read the qualifications together with the classification:

- **Built-in:** the selected product provides the capability; normal configuration and testing are still required.
- **Implement:** the solution needs bank-specific SQL, code or workflow design.
- **Add-on:** another component or service is required; include its license, infrastructure, operation and support.
- **Limited:** the capability covers only part of the stated feature.
- **Validate:** evidence is insufficient to confirm the selected offer.
- **Out of scope:** the baseline product does not provide the feature.

Licensing uses **Open source**, **Proprietary** or **Mixed**, with explicit component qualifications. These labels are architectural classifications informed by documentation, not vendor certifications, test outcomes or numeric ratings. A configurable built-in function may still fail the bank's requirements. A well-supported integration may meet them.

Use the feature IDs to reference demonstrations and gaps in the candidate evidence record. Feed the resulting evidence into the relevant section rating. Do not count built-in features or average these classifications to generate a second score.

## AI integration and open-source evaluation

**AI integration (8%).** Test two distinct use cases: an assistant helps develop/review/test a pipeline change, and a production pipeline calls a model hosted inside the bank. Also assess feature engineering and ML scoring where required. The model, assistant/client, MCP server if used, orchestration, prompts, data, metadata, model artifacts and logs must stay on premises. A local process that calls a cloud model does not meet the locality gate. A cloud-only optional feature receives no credit; a solution that requires it fails the gate.

Run a common demonstration with outbound access blocked. Pin the model and software versions. Measure accepted developer output, integration effort, throughput, resource consumption and operational effort. Exercise model timeout, throttling, authentication failure and retries; prove that reruns cannot duplicate published results. Retain the model/prompt version and accepted output because repeated inference may not reproduce the same response. Require review and testing before AI-generated changes reach production.

An AI rating of **3** requires both agreed local use cases to pass with repeatable operation. Define measurable improvements for **4** and **5** before demonstrations. **0** applies when no eligible local solution is available; incomplete evidence stays blank. Generic API access alone does not establish a working AI integration. Section 12 records each candidate's proposed approach and dependencies. In particular, [dbt's self-hosted MCP](https://docs.getdbt.com/docs/dbt-ai/about-mcp) and [Cloudera's on-premises inference service](https://docs.cloudera.com/machine-learning/1.5.5/setup-cloudera-ai-inference/topics/ml-caii-prerequisites-set-up.html) are separate integration/service components to validate, while [Spark MLlib](https://spark.apache.org/docs/latest/ml-guide.html) addresses ML workloads rather than LLM serving.

**Open-source licensing and flexibility (7%).** Review the exact processing engine, adapter/connectors, scheduler, catalog, AI runtime/models and other required components. Record source availability, license, modification/redistribution rights, dependency notices, access to binaries/security fixes and any commercial dependency. Core v1 and its Oracle adapter are open source, but the fixed Oracle/Exadata target remains proprietary. Cloudera must be assessed component by component rather than classified as one wholly open or closed product. See the workbook's L1–L6 and D4 sources.

Use these anchors consistently: **0** for a closed core with no meaningful supported extension/export path; **1** for a closed core with limited extension; **2** for substantial documented extension of a closed core; **3** when main processing source is accessible but material closed dependencies or replacement limits remain; **4** for open core/connectors with reproducible builds and substantial replacement options, with a material proprietary dependency remaining; **5** when open critical processing components can demonstrably be rebuilt, patched and replaced under the documented rights. Incomplete license evidence stays blank. Treat the fixed Oracle target consistently for every option, documenting it separately from the tool-specific components.

Demonstrate an offline installation/rebuild and a representative extension or component replacement. Open-source status alone earns no automatic maximum score. Assess rights and practical flexibility here, staffing/support in section 09, and price plus migration effort in section 10. This prevents the same cost saving or support benefit from earning points twice.

## Boundaries of the five candidates

- **Informatica:** a fully local PowerCenter offer. Cloud-managed products are outside scope. Existing Informatica TDM usage does not establish PowerCenter or CDC entitlements.
- **ODI:** local agents/repositories and selected Knowledge Modules. Price CDC separately where needed; do not assume GoldenGate is included.
- **dbt + Exadata:** the dbt Core v1 and dbt-oracle path established in the research. Define ingestion, scheduling and operations separately. Verify exact-release compatibility and support ownership; assess other dbt distributions separately.
- **Cloudera:** the exact on-premises product bundle and services. Include additional distributed-platform costs and loading into the Oracle target.
- **Spark:** the local processing engine plus all required ingestion, orchestration, storage, security, monitoring and support components.

Use Comparison for the detailed analysis. “Bank implications” rows are architectural assessments; dependency and test rows specify the proposed solution/evidence required. They are not measured product results. No bank acceptance results, prices or final ratings have been assigned.

## Evidence records and section ratings

Each candidate’s evaluation record should contain:

- Exact product/release/component inventory and production/test/DR resources used.
- Section ID, bank requirement and 3/4/5 rating thresholds agreed before testing.
- Test or quotation reference, observed result, limitations, section rating and rationale.
- Outcome, approver and date for every mandatory subcondition.
- Open gaps, remediation plans and affected tests/costs if proposed components change.

Hold business data, source access, output definitions and deadlines constant in common tests. Changes and recovery exercises performed by the bank’s own team also provide evidence. A vendor presentation does not replace measured performance or bank acceptance. Thresholds remain to be agreed; this matrix does not declare a winner.

## Fair comparison and accountability

Include ingestion, transfer, transformation, checks and publication in elapsed time and cost. Do not compare transformation time alone. Give each candidate equivalent expert tuning time and align production, test and DR scope.

Total cost includes initial implementation plus five years of licenses, connectors/CDC, infrastructure, staffing, support, security, training, upgrades and exit. Use a common currency and assumptions. Open-source licensing does not mean zero service cost; existing Exadata capacity is not unlimited.

Architecture owns scope equivalence and the technical recommendation. Business/data owners approve correctness. Source owners and DBAs approve source impact. Security assesses locality and access. The service owner accepts operations/recovery. Procurement and Finance validate quotations/costs. The delegated decision authority approves the selection. Use [[DWH Ownership Operating Model]] for roles and [[Fiziksel Topoloji - Teknik Taraf]] and [[PowerDesigner Bilgilendirme]] for bank context.

## Supporting documents

Use the existing detailed appendices when carrying out tests and procurement. This note and the current English workbook define the current comparison and scoring structure.

- [[ETL Tool Comparison]] — narrative comparison of the five candidates and the architect's recommendation.
- [[ETL Proof of Concept and Acceptance]] — test scenarios and acceptance conditions.
- [[ETL Vendor RFI and Commercial Evaluation]] — vendor questions and cost scope.
- [[ETL Selection Decision Record]] — decision, rationale and approvals.

Programme actions belong in [[Proje Planı]]; institutional open questions belong in [[Aktif Sorular]].

## Sources and verification

Official sources were **rechecked on 12 October 2026**. Some PowerCenter pages returned 403 on direct access and were checked through the search index; the source register records this limitation. Older-release documents and “latest” links do not establish support for the exact offered version. Require official support matrices and written commercial terms. Section/candidate source IDs refer to the workbook’s Sources sheet. Principal references include:

- [ODI architecture](https://docs.oracle.com/en/middleware/fusion-middleware/data-integrator/14.1.2/odiun/overview-oracle-data-integrator.html).
- [PowerCenter Oracle transformation behaviour](https://docs.informatica.com/data-integration/powercenter/10-5-9/advanced-workflow-guide/pushdown-optimization-and-transformations/update-strategy-transformation.html).
- [dbt Oracle setup](https://docs.getdbt.com/docs/local/connect-data-platform/oracle-setup), [Oracle adapter](https://github.com/oracle/dbt-oracle).
- [Cloudera on-premises reference architecture](https://docs.cloudera.com/cdp-reference-architectures/latest/cdp-pvc-base-ra/topics/ra-cdpdc-abstract.html).
- [Spark JDBC](https://spark.apache.org/docs/latest/sql-data-sources-jdbc.html).

The feature update preserves the original ten comparison sections, existing ratings and evidence records. It adds section 11 with 36 features and sections 12–13 with the two new weighted criteria; their ratings remain unassessed. The original weights are scaled to 85%, with 8% for AI and 7% for openness. Formula checks cover all five candidates, the new weight contributions, missing evidence/approval, missing or out-of-range new ratings, zero ratings and failed gates. Temporary test values were removed. Checks use the authoring tool's calculation engine; native Microsoft Excel execution has not been tested. Documentation review does not constitute bank product testing or commercial verification.
