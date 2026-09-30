---
title: ETL Selection Decision Record
created: 2026-09-28
status: uncompleted-decision-template
tags: [dwh, etl, decision, governance]
---

# ETL Selection Decision Record

Parent: [[ETL Tool Evaluation]]. This template contains no approved selection. Complete it after reviewing the workbook, [[ETL Proof of Concept and Acceptance]], and [[ETL Vendor RFI and Commercial Evaluation]].

## 1. Decision identity

```text
Decision ID / version / date:
Accountable investment/selection authority:
Architecture recommendation owner:
Business sponsor / data product owner / service owner:
Participants and independent reviewers:
Decision status: Proposed / Approved / Rejected / Deferred
Scope and workload charter version:
Expected service term and business outcome:
Evidence repository / workbook version or hash:
```

## 2. Mandatory boundary

Runtime, management/control plane, metadata and logs remain on premises, as required by the user. Record security acceptance of the exact solution, including optional components, CI/developer tools, telemetry, package/license management, backups and DR. A change to this requirement is a separate business decision and must not be hidden inside a score adjustment.

## 3. Alternatives actually evaluated

For each O1–O5, record the offered edition/version, bill of materials, common workload coverage, test configuration, support route, cost basis and any scope differences. Identify rejected variants separately, such as cloud-managed Informatica offerings. Do not use a pass for one edition to endorse a different one.

```text
Candidate ID / configuration revision:
Scope equivalent to common charter? Evidence:
Mandatory gate results and approval references:
Excluded or unresolved limitations:
Weighted score / criteria coverage / evidence completeness:
Five-year incremental cost / currency / quote validity:
Economic/shared-resource cost reconciliation:
Sensitivity outcomes / residual uncertainty:
```

## 4. Recommendation and rationale

State the proposed option and exact configuration, what it improves for the bank, and the measurements supporting that conclusion. Explain the two or three decisive tradeoffs rather than repeating the entire matrix.

Record reasons for not selecting each alternative. Distinguish a failed requirement, incomplete evidence, higher cost, unacceptable operating burden, and a strategic scope mismatch. Do not call an untested option technically incapable.

If no option satisfies all mandatory gates, defer selection and commission specific remediation or a revised offer. Do not choose the highest-scoring failed option.

## 5. Evidence of correctness and service fitness

Reference accepted business definitions, expected outputs, reconciliation, historical corrections, source resource measurements, concurrency, deadlines, recovery, local operation and security tests. Include failed attempts and subsequent fixes. State any material extrapolation beyond the tested workload and who accepted its uncertainty.

Confirm that the bank team, not only vendor specialists, operated and diagnosed the proposed solution. Record remaining training and support commitments.

## 6. Scoring, cost and sensitivity

```text
Baseline criteria and weights approval:
Completed scores and evidence reviewer:
Closest eligible alternative and meaningful tradeoff:
Weight sensitivity cases / whether preference changes:
Volume, staffing, currency and renewal sensitivities:
Assumed reusable entitlements / verification evidence:
Required new components / procurement lead time:
Budget approval and exclusions:
```

The workbook calculates scores and readiness from entered values. The panel verifies the underlying evidence and approves the recommendation. A numerical lead alone does not establish superiority when differences are within measurement uncertainty.

## 7. Risks, conditions and exceptions

For each unresolved non-gate issue, record impact, accountable owner, mitigation, due date, funding and verification evidence. Name any risk-acceptance authority and mandate. An unpassed mandatory gate cannot be recorded as an ordinary post-selection action.

Differentiate procurement conditions, pilot rollout conditions and production acceptance. Selection authorizes only the scope explicitly approved below; it does not itself authorize a production change or external submission.

## 8. Transition and exit

Record first delivery scope, required appointments, source access approvals, environments, procurement dependencies, migration sequencing, parallel running, rollback, old-job retirement, operator training and support handover. Link actual tasks to [[Proje Planı]].

Record exit rights, export/rebuild evidence, retained records, replacement effort and dependencies that would make switching difficult. Assign ownership under [[DWH Ownership Operating Model]].

## 9. Approval record

Each reviewer signs their own decision scope rather than implying joint accountability for every issue:

- Business data/report owners: meaning, correctness and fitness for the agreed outputs.
- Source owners/DBAs: source safety and extraction contract.
- Security authority: local deployment boundary and required security controls.
- Service/platform owners: operating coverage, dependencies and recovery.
- Architecture: technical equivalence, evidence and recommendation.
- Procurement/Finance: entitlement, support and comparable cost/budget basis.
- Delegated investment authority: selection and authorized spend/scope.

Record person, role, decision, conditions, timestamp and evidence reference. Record dissent and its disposition. Leave unassigned appointments unapproved.

## 10. Revisit triggers

Reassess when a support/lifecycle change, mandatory cloud dependency, unsupported Oracle/adapter combination, material growth, persistent missed SLO, unexpected cost step, security issue or change of EDW target invalidates the assumptions. Assign a review owner and date without treating a future roadmap promise as current capability.
