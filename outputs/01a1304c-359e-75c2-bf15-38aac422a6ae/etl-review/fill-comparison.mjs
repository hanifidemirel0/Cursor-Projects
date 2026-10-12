import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {FileBlob, SpreadsheetFile} from '@oai/artifact-tool';
const root='C:/Users/hanif/Cursor-Projects';
const path=root+'/outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Comparison.xlsx';
const dir=root+'/outputs/01a1304c-359e-75c2-bf15-38aac422a6ae/etl-review';
const backup=dir+'/original-workbook.bin';
try {await fs.access(backup);} catch {await fs.copyFile(path,backup);}
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(backup));
const s=wb.worksheets.getItem('Scorecard'), c=wb.worksheets.getItem('Comparison'), src=wb.worksheets.getItem('Sources');
const edits=[];
function set(sh,cell,v){sh.getRange(cell).values=[[v]];edits.push([sh.name,cell]);}
function row(sh,r,arr,start='C',end='G'){sh.getRange(`${start}${r}:${end}${r}`).values=[arr];edits.push([sh.name,`${start}${r}:${end}${r}`]);}
function merged(sh,r,last,text){sh.getRange(`B${r}:${last}${r}`).merge();set(sh,`B${r}`,text);sh.getRange(`B${r}:${last}${r}`).format.wrapText=true;}
const ratings=[
 [4,4,2,3,2],
 [3,4,4,2,2],
 [3,3.5,3,2.5,2.5],
 [3.5,4,2.5,2.5,2],
 [3,3,2.5,3.5,2],
 [2.5,3,4,3,3.5],
 [3,4,2,2,1.5],
 [null,null,null,null,null],
 [2,2,3,3,3],
 [2,2,4,3,4],
];
s.getRange('D13:H22').values=ratings;
s.getRange('D13:H22').setNumberFormat('0.0');
set(s,'B2','ETL tool evaluation — provisional architecture assessment');
set(s,'B3','12 October 2026 | Oracle Exadata EDW and operational reporting | Documentation review; no bank performance tests.');
set(s,'B4','Desk scale: 0 unsuitable · 1 major gaps · 2 material extra work · 3 credible fit · 4 strong fit · 5 requires demonstrated superiority.');
set(s,'B5','Top score excludes unquoted cost (8.5%) and rescales the other 91.5% to 100. Ratings are architect judgment, not acceptance results.');
set(s,'B8','Provisional fit / 100\n(excludes cost)');
set(s,'B10','Desk ratings entered / 10');
set(s,'B20','10  Five-year cost and exit effort\nUnassessed: comparable quotes missing');
set(s,'B31','Desk evidence and rating rationale');
set(s,'B32','Gate approvals: not provided');
row(s,31,['Comparison C29:C180; C187:C192; Sources','Comparison D29:D180; D187:D192; Sources','Comparison E29:E180; E187:E192; Sources','Comparison F29:F180; F187:F192; Sources','Comparison G29:G180; G187:G192; Sources'],'D','H');
set(s,'B34','Nine provisional ratings per candidate are explained in Comparison. Cost and gate approval records are unavailable; blanks are not zero.');
set(s,'B35','All gates remain Pending. Desk scores prioritize proof-of-concept work; they do not establish product acceptance or a procurement winner.');
set(s,'B36','Assess the complete local solution: runtime, control plane, metadata, logs, CI, packages, support diagnostics and optional AI services.');
set(s,'B39','The existing acceptance rubric still applies after testing. This review adds a separate, explicitly provisional desk-assessment basis.');
s.getRange('B41:H49').copyFrom(s.getRange('B25:H33'),'all');
s.getRange('B41:H49').clear({applyTo:'contents'});
s.getRange('B41:H49').dataValidation=null;
merged(s,41,'H','Architect recommendation and outstanding evidence');
s.getRange('B41:H41').format={fill:'#243957',font:{name:'Arial',bold:true,color:'#FFFFFF'},rowHeight:26};
set(s,'B42','Full weighted score / 100\n(cost still missing)');
set(s,'B43','Proof-of-concept priority');
set(s,'B44','Main selection condition');
row(s,43,['Shortlist\nCommercial challenger','Lead shortlist\nOracle EDW baseline','Conditional shortlist\nSQL transformation','Defer as primary ETL\nRevisit for wider platform need','Specialist complement\nDefer as primary ETL'],'D','H');
row(s,44,['Prove pushdown, recovery and fully local support; new licenses required.','Prove safe replica ingestion, recovery and target capacity; quote CDC separately.','Secure Oracle adapter support and ingestion/scheduler ownership.','Justify a second platform and its operations; no optional AI-service credit.','Name a platform/support team and prove idempotent Oracle publication.'],'D','H');
merged(s,46,'H','Cost could change the order. Obtain comparable five-year quotes, staffing and capacity estimates before using the full weighted score.');
merged(s,47,'H','Bank basis: Oracle-heavy sources, Kale load reduction, late historical updates, many operational reports, existing Informatica TDM only.');
merged(s,48,'H','Assumption: retain Exadata as the common target. Existing notes inform requirements; no particular core/ODS/history design is mandated here.');
merged(s,49,'H','Recommendation is architectural judgment. Confirm team capacity, report SLAs, source-read permissions and release support in the proof of concept.');
s.getRange('B42:H44').format.wrapText=true;
s.getRange('B42:H42').format.rowHeight=40;
s.getRange('B43:H43').format.rowHeight=65;
s.getRange('B44:H44').format.rowHeight=92;
s.getRange('B46:H49').format.rowHeight=34;
s.getRange('B46:H49').format.font={name:'Arial',size:10,color:'#344966'};
s.getRange('D31:H32').format.wrapText=true;
s.getRange('B31:H31').format.rowHeight=60;
s.getRange('B20:H20').format.rowHeight=55;
const cols=['D','E','F','G','H'];
for(const col of cols){
 const full=s.getRange(`${col}8`).formulas[0][0];
 s.getRange(`${col}42`).formulas=[[full]];
 const valid=`AND(COUNT($C$13:$C$22)=10,ABS($C$23-100)<0.000001,MIN($C$13:$C$22)>=0,COUNT(${col}13:${col}19,${col}21:${col}22)=9,MIN(${col}13:${col}19,${col}21:${col}22)>=0,MAX(${col}13:${col}19,${col}21:${col}22)<=5,${col}31<>\"\",SUM($C$13:$C$19,$C$21:$C$22)>0)`;
 s.getRange(`${col}8`).formulas=[[`=IF(${valid},(SUMPRODUCT($C$13:$C$19,${col}13:${col}19)+SUMPRODUCT($C$21:$C$22,${col}21:${col}22))/SUM($C$13:$C$19,$C$21:$C$22)*20,\"\")`]];
 s.getRange(`${col}9`).formulas=[[`=IF(COUNTIFS(${col}26:${col}28,\"Fail\")>0,\"Excluded\",IF(OR(COUNTIFS(${col}26:${col}28,\"Pass\")<>3,${col}32=\"\"),\"Gates pending\",IF(ISNUMBER(${col}42),\"Review provisional ratings\",\"Rating / evidence missing\")))`]];
}
s.getRange('D8:H8').setNumberFormat('0.0');
s.getRange('D42:H42').setNumberFormat('0.0');
set(c,'B3','Official documents support capability statements; numbered desk ratings and recommendations are architect judgments for this bank.');
set(c,'B4','12 October 2026 | Nine provisional ratings; cost unassessed. Source register distinguishes direct review, index evidence and unverified references.');
set(c,'B7','Assumption for a fair comparison: retain Oracle Exadata for the EDW and report-serving target. This does not mandate the repository’s layer/model design.');
row(c,11,[
 'Shortlist as a commercial challenger. TDM is the only Informatica entitlement recorded; do not assume reusable PowerCenter licenses, skills or CDC rights. [B2, I10]',
 'Lead shortlist for an Oracle-heavy estate: keep relational transformations near Exadata data. This is architectural fit, not a measured performance or price advantage. [B2, O1, O5]',
 'Conditional SQL-transformation candidate, not a complete ingestion and operations suite. The Oracle adapter documentation/support boundary is a material decision issue. [D1, D4]',
 'Defer as the primary ETL platform unless lake, nonrelational or distributed AI workloads justify the extra estate. Do not assume those requirements from data size alone. [B2, B3, C1]',
 'Retain for specialist distributed processing if a workload proves its value. A bare Spark engine is not a supported bank integration service. [S1, S3, S4]'
]);
const rationale={
29:[
 '4/5 | Broad packaged relational/file integration suits the mixed sources. Oracle redo capture remains an extra licensed component; existing TDM brings no assumed entitlement. Confirm web-service/file flows and replica access. [I10, I5, B2, B3]',
 '4/5 | Oracle/file KMs fit Kale, archive and cheque feeds. GoldenGate remains separate. The Update Date JKM still uses triggers; it is not a trigger-free escape route. Use only approved source paths. [O5, B2]',
 '2/5 | Good transformation after Oracle landing, but CDC, files and API ingestion need an owned service. Seeds cover small reference CSVs only. This is a solution-completeness gap for the bank. [D1, D8, B3]',
 '3/5 | Spark JDBC/files cover basic movement; Flow Management and Oracle capture are separately scoped. Additional hops and the Oracle return path increase control requirements. [C3, S1, B2]',
 '2/5 | JDBC/files are useful primitives; Oracle CDC, API handling and source protection require engineering. Cap connections and establish a common read-consistency point. [S1, S2, B2]'
],
38:[
 '3/5 | Oracle pushdown is documented, but mapping/function coverage and different reject/recovery behavior must be tested. No assumption of a fully pushed-down production workload. [I1, I8]',
 '4/5 | Target-side SQL/KMs are a strong fit for Oracle joins, aggregates and existing SQL knowledge. Verify execution plans and concurrency with reports on sur; no throughput result is claimed. [O1, O5, B2]',
 '4/5 | SQL models execute in Oracle, offering a direct route for relational EDW work. Validate adapter SQL/materializations on the exact local Exadata database; do not infer Python support from Autonomous examples. [D1, D4]',
 '2/5 | An additional cluster may help selected workloads, but most bank data is relational and the target stays Oracle. Extraction, shuffle and return loading need a demonstrated benefit. [C1, S1, B2]',
 '2/5 | Distributed processing is useful only when it beats a tuned Oracle path end to end. JDBC pushdown is selective; source and target contention still apply. [S1, B2]'
],
47:[
 '3/5 | Mapping/SCD patterns provide building blocks; bank controls remain custom. Full pushdown ignores rejected rows rather than writing a reject file, so add explicit reconciliation/quarantine. [I1, I5, B2]',
 '3.5/5 | CKM checks and Oracle upsert/SCD KMs reduce common plumbing. Backdated corrections, cross-market member identities and controlled republication still require explicit rules and tests. [O5, B2, B3]',
 '3/5 | SQL tests and snapshots support quality/history development. They do not capture all between-run source changes or automatically preserve business-effective history. Gate publication after tests. [D2, D3, D6, B2]',
 '2.5/5 | SQL/Spark can implement bank rules, but cluster-to-Oracle handoff adds reconciliation work. Table transactions alone cannot establish correct final report balances. [S1, S2, B3]',
 '2.5/5 | Flexible transformation code; business keys, late-data logic and target publication are engineered. foreachBatch is at-least-once by default; persist deduplication/run state. [S2, B2]'
],
56:[
 '3.5/5 | Workflows and recovery suit scheduled reporting. Full pushdown cannot use incremental session recovery; test rollback/rerun and published data separately. Business calendars/readiness still need integration. [I6, I8, B2]',
 '4/5 | Load Plans provide conditional/parallel steps and restart options. Integrate business-date readiness rather than a fixed 03:00 trigger; limit concurrent runs and validate partially committed work. [O2, O4, B2]',
 '2.5/5 | CLI/DAG execution is straightforward, but readiness, calendars, alerts, HA and report publication need external operations. A model rebuild is not a complete service recovery. [D1, D9, B2]',
 '2.5/5 | Manager helps platform health; business scheduling and final Oracle publication remain separate. More services and queues increase the recovery surface for critical reports. [C7, S4, B3]',
 '2/5 | Task retries/checkpoints are not bank scheduling or DR. Orchestration, calendar handling and business-safe replay are custom or additional components. [S2, S4, B2]'
],
65:[
 '3/5 | Central repository and workflow records are useful. Confirm roles/secrets and price source-to-MicroStrategy lineage separately; TDM use does not establish these capabilities. [I9, I10, B2]',
 '3/5 | Repository controls and execution records give a workable base. PowerDesigner ownership, custom PL/SQL lineage and MicroStrategy endpoints still require integration. [O1, O4, B4]',
 '2.5/5 | Versioned code and artifacts support review; identity, secrets, audit retention and cross-tool lineage are external responsibilities. Disable usage statistics and inspect all package/MCP connections. [D5, A2, B4]',
 '3.5/5 | Ranger/Atlas/Manager provide useful platform services where deployed. Credit is limited to covered services; Oracle/report lineage and sensitive-field controls must be demonstrated. [C3, C4, C7, B4]',
 '2/5 | Security is not enabled by default. Assemble IAM, secret handling, audit and lineage across engine/cluster/target; core Spark alone is insufficient. [S3, S6, B4]'
],
74:[
 '2.5/5 | Visual mappings are approachable, but repository exports/versioning need a demonstrated review and deployment workflow. Git storage alone does not provide meaningful mapping merges. [I4, I5]',
 '3/5 | Documented Git integration plus scenarios/contexts provide a credible release path. Review generated SQL and custom KMs; test conflict handling and rollback. [O3, O4]',
 '4/5 | SQL/YAML/Jinja suit local Git review and automated SQL tests. Pin Core v1, adapter and packages; prove offline CI and separate code rollback from data restoration. [D3, D4, D9]',
 '3/5 | Spark applications can use conventional code review/testing; mixed notebooks, flows and service configurations need consistent release standards. Do not credit unselected developer services. [S4, C3]',
 '3.5/5 | Text Python/Scala/SQL applications support strong software-engineering workflows. Frameworks, test harnesses and deployment automation remain bank-owned work. [S4, S5]'
],
83:[
 '3/5 | A commercial support route is plausible, but exact local-product lifecycle, specialist staffing and CDC ownership are unconfirmed. Existing TDM administration is not proof of PowerCenter readiness. [I10, B2]',
 '4/5 | Best alignment with the recorded Oracle/SQL estate, subject to validation of actual team capacity. Assign ODI/KM ownership and obtain release, middleware and CDC support terms. [O1, O4, B2]',
 '2/5 | Official setup lists dbt support as not supported; Oracle-maintained source is not an incident SLA. Require written adapter/full-stack support and a reproducible offline build. [D1, D4]',
 '2/5 | Commercial platform support helps, but the notes do not establish a staffed Cloudera operation. Cluster, storage, security and service upgrades add roles beyond the Oracle team. [C1, L5, B2]',
 '1.5/5 | No contractual incident service comes from the Apache engine. Platform engineering, dependencies and custom framework support need a named provider/team not evidenced in the notes. [S3, S4, B2]'
],
171:[
 '2/5 | Local model calls are an integration design; no verified native local PowerCenter assistant is credited. Cloud CLAIRE features earn no locality credit. Both bank use cases remain untested. [I6, A1]',
 '2/5 | Local assistants can work on SQL/KMs and external procedures can call a model, but no native on-prem ODI copilot is evidenced. Integration and audit controls must be built. [O1, O4]',
 '3/5 | Self-hosted MCP supports local Core v1 actions; a local assistant/model and inference companion remain separate. Credible integration path, not proof of a working bank deployment. [A2, D1]',
 '3/5 | Baseline credit is Spark MLlib and local code/API integration only. Cloudera AI Inference is an optional service with separate registry/GPU/platform prerequisites; no extra rating credit until scoped. [A3, A4]',
 '3/5 | MLlib and Python/Scala offer useful ML/inference integration paths. A local assistant and model server are still separate; throughput, audit and repeatability are untested. [A4, S4]'
],
180:[
 '2/5 | Proprietary core with mapping/command extension and export paths. The bank cannot assume rights to rebuild or patch the engine; confirm contract terms. [L1, I5, I6]',
 '2/5 | Editable KMs provide substantial extension of a proprietary engine. Agent/repository source and rights are separate from KM templates. [O1, L2]',
 '4/5 | Core v1 and dbt-oracle are Apache 2.0; SQL/macros and source can be maintained locally. Exact dependency rights and offline rebuild still need proof. Common Oracle target excluded from tool openness. [L3, D4]',
 '3/5 | Open-source components exist within a commercial distribution. Binary/update access, Manager and optional service terms require a component-level inventory. No blanket open-source claim. [L4, L5]',
 '4/5 | Apache 2.0 core permits source-based maintenance and extension. Dependency/connector rights and an offline rebuild remain to be validated; no maximum score without demonstration. [L6]'
]};
for(const [r,v] of Object.entries(rationale)){set(c,`B${r}`,'Provisional rating / bank rationale');row(c,+r,v);c.getRange(`B${r}:G${r}`).format.rowHeight=118;}
set(c,'B171','Provisional AI rating / rationale');
set(c,'B180','Provisional openness rating / rationale');
set(c,'B88','Cost rating is unassessed for every candidate. No comparable quotations, staffing estimates or validated capacity plan were found.');
row(c,90,[
 'UNASSESSED | New PowerCenter/CDC/connector rights, engine and repositories, support and staffing. Recorded TDM entitlement is not an offset to this price without written rights. [B2, T1]',
 'UNASSESSED | ODI, selected agent/middleware, CDC, repository, Oracle capacity and team effort. Existing Exadata is a shared resource, not free incremental capacity. [L2, T1]',
 'UNASSESSED | No assumed fee for Apache-licensed core; price ingestion, support, CI, scheduler, engineering and Oracle capacity. Zero core fee is not zero TCO. [L3, D4, T1]',
 'UNASSESSED | Base subscription plus any Flow Management/Data Services, nodes, storage, DR and cluster staff. Optional AI/GPU scope is separate. [L5, A3, T1]',
 'UNASSESSED | Core source license is not the service cost. Include cluster, ingestion, orchestration, controls, development, security patching, on-call and exit. [L6, T1]'
]);
c.getRange('B90:G90').format.rowHeight=106;
// Strengthen material capability qualifications using the documents actually reviewed.
set(c,'C37','Oracle Update Strategy supports full pushdown, but rejected rows are not written to reject files in that mode. Full pushdown also changes recovery behavior. Validate complete mappings, explicit reject checks and SQL/resource use. [I1, I8]');
set(c,'D28','JKM Oracle Simple, Consistent and Consistent (Update Date) use triggers. GoldenGate integration is a separate capture path. Do not propose trigger-based journalizing on a read-only replica; validate redo access and capture topology. [O5]');
set(c,'E37','Oracle setup lists ephemeral materialization as unsupported. The adapter repository emphasizes Autonomous Database; SQL compatibility on local Exadata and Python execution must be validated separately. [D1, D4]');
set(c,'C125','Implement | Explicitly retain/reconcile rejects. Full pushdown Update Strategy ignores rejected rows and does not write a reject file. [I1, I5]');
set(c,'D112','Add-on | GoldenGate is separate. Built-in Oracle Update Date journalizing still uses triggers; not a log-based capture substitute. [O5]');
set(c,'E120','Validate | dbt snapshots offer SCD2 patterns; prove snapshot and hard-delete behavior with the pinned Oracle adapter on local Exadata. [D6, D1, D4]');
set(c,'E18','Core v1 can run locally. Set send_anonymous_usage_stats: false, mirror packages/docs, restrict CI and MCP tools to local services, and verify blocked egress. [D5, A2]');
set(c,'D55','ODI does not retain open JDBC transaction state after failure. Restart from a boundary consistent with committed target data; use the Load Plan concurrency limit and a business-run lock. [O2, O4]');
set(c,'F151','Built-in | Cloudera Manager health tests/events/alerts; business-date readiness and report SLA checks still need design. [C7]');
set(c,'G46','Implement run/batch IDs, deduplication and staged Oracle MERGE/publication. foreachBatch defaults to at-least-once writes; neither task retry nor a checkpoint alone prevents duplicate committed rows. [S1, S2]');
set(c,'C13','I10, I1, I3');
set(c,'C31','I10, I5; capture offer required; B2, B3');
set(c,'D31','O1, O5, B2');
set(c,'F58','C1, C7, S4');
set(c,'F67','C3, C4, C7; B4');
set(c,'C85','I10, B2; written support offer required');
set(c,'B167','Desk AI ratings assess documented integration paths. Acceptance rating 3 still requires both agreed local use cases to pass the bank tests.');
set(c,'B176','Desk openness scores reflect documented source rights and extension paths. Score 5 requires a demonstrated rebuild/patch/replacement; target Oracle is common to all.');
// Fill a decision section in the existing comparison sheet; preserve its original 13 sections.
c.getRange('B184:G192').copyFrom(c.getRange('B6:G14'),'all');
c.getRange('B184:G192').clear({applyTo:'contents'});
set(c,'B184','14  Architect recommendation — proof-of-concept priorities');
set(c,'B185','Judgment for the current Oracle EDW requirement; no commercial winner or bank-tested performance result is declared.');
row(c,186,['Informatica PowerCenter','Oracle ODI','dbt Core v1 + Oracle','Cloudera Base with Spark','Apache Spark']);set(c,'B186','Decision dimension');
c.getRange('B184:G184').merge();
c.getRange('B185:G185').merge();
c.getRange('B184:G184').format={font:{name:'Arial',size:14,bold:true,color:'#243957'},rowHeight:30,wrapText:false,verticalAlignment:'center'};
c.getRange('B185:G185').format={font:{name:'Arial',size:11,color:'#243957'},rowHeight:28,wrapText:false,verticalAlignment:'center'};
c.getRange('B186:G186').format={fill:'#243957',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:40,wrapText:true,verticalAlignment:'center',horizontalAlignment:'center'};
row(c,187,[
 'SHORTLIST / CHALLENGER | Test against ODI using the same bank data. Strong integration coverage; purchase only with a fully local supported offer and demonstrated pushdown/recovery.',
 'LEAD SHORTLIST | Use as the baseline for Oracle EDW ELT. Prove ingestion topology, generated SQL, business-safe restart and actual staffing before selecting.',
 'CONDITIONAL SHORTLIST | Include if the bank will own or contract ingestion, scheduler and adapter support. A focused transformation POC can test whether simpler code offsets integration effort.',
 'DEFER AS PRIMARY ETL | Reopen if a separately justified lake/AI/distributed workload exists. This judgment is about the present scope, not general product capability.',
 'SPECIALIST COMPLEMENT | Use where distributed transformation/ML is demonstrably useful. Do not assemble a new primary bank ETL service without funded platform ownership.'
]);
row(c,188,[
 'PowerCenter local domain/repository/Integration Service; source connectors; separately quoted redo capture; local scheduler/monitor; controlled Oracle publication.',
 'ODI 14.1.2 documentation baseline; local agents/repositories; Oracle/file KMs; bank scheduler integration; separate capture only where required. Exact certified versions remain open.',
 'Pinned Core v1 + dbt-oracle + Python/driver; local Git/CI/packages; ingestion; scheduler; secrets/monitoring; Oracle staging and publication. Support owner mandatory.',
 'Pinned Base/Manager/Spark and security/metadata services; ingestion and Oracle loading; orchestration/monitoring. Flow Management and AI/Data Services remain explicit optional scope.',
 'Pinned Spark/JDK/Python/Oracle driver; selected cluster manager; ingestion; scheduler; storage/checkpoints; IAM/secrets; catalog/audit; support and publication framework.'
]);
row(c,189,[
 'Primary uncertainty: PowerCenter and required add-on entitlements, local release support, pushdown coverage and recovery of partially committed report sets.',
 'Primary uncertainty: source-readable replica design, log-capture access, actual Oracle headroom and safe restart of KM-generated SQL.',
 'Primary uncertainty: dbt-oracle behavior/support on the bank’s local Oracle release. No dbt Labs support is assumed; Autonomous examples are not local certification.',
 'Primary uncertainty: business justification for a second processing/storage estate, operator capacity and end-to-end Oracle delivery under cluster failure.',
 'Primary uncertainty: service ownership and bespoke engineering needed for correctness, security, DR and continued operation after staff changes.'
]);
row(c,190,[
 'POC: one complex SQL report mapping with full/partial pushdown; introduce a reject, duplicate and session outage. Reconcile final values and prove predictable rerun.',
 'POC: replica/file loading plus late correction and Load Plan interruption after a commit. Prove restart, unchanged totals on replay and no partially refreshed report set.',
 'POC: incremental model, snapshot/delete case and failing test on local Exadata; drive ingestion→dbt→publication from a local scheduler with egress blocked.',
 'POC only after scope justification: source→cluster→Oracle with a failed worker and target outage. Count every transfer and reconcile report output.',
 'POC only for justified workloads: executor failure during JDBC writes, retry and backlog. Demonstrate committed-key deduplication and atomic report visibility.'
]);
row(c,191,[
 'Confidence: medium for product capabilities; low for offered licensing/lifecycle and bank outcomes. Some official pages are accessible only through search indexing.',
 'Confidence: medium-high for Oracle ELT/Load Plan capability; medium for bank fit. Actual performance, licenses, support duration and gate acceptance remain open.',
 'Confidence: medium for local SQL tooling/source rights; low for contractual adapter support and bank operations. Compatibility evidence is required before critical-report adoption.',
 'Confidence: medium for managed-platform capabilities; low for the unpriced exact bundle and staffing. No unselected paid service is assumed included.',
 'Confidence: high for engine-level primitives/source rights; low for an assembled bank service. Scores reflect the documented base and necessary engineering.'
]);
row(c,192,[
 'Cost/acceptance: not available. All three gates remain Pending. Obtain a comparable production/test/DR offer and completed common tests.',
 'Cost/acceptance: not available. All three gates remain Pending. Existing Oracle assets do not prove ODI/CDC production rights or available compute.',
 'Cost/acceptance: not available. All three gates remain Pending. Secure a support route and cost the complete ingestion-to-report service.',
 'Cost/acceptance: not available. All three gates remain Pending. Price the exact component set and operational team before reevaluation.',
 'Cost/acceptance: not available. All three gates remain Pending. Cost internal or contracted platform engineering and incident coverage.'
]);
['Disposition','Evaluated solution boundary','Main unresolved decision risk','Discriminating proof of concept','Evidence confidence','Commercial and gate status'].forEach((t,i)=>set(c,`B${187+i}`,t));
c.getRange('B187:G192').format={wrapText:true,verticalAlignment:'top',rowHeight:112,font:{name:'Arial',size:11,color:'#243957'}};
c.getRange('B187:B192').format.fill='#EFF3F8';
merged(c,194,'G','15  Bank requirements and scoring interpretation');
c.getRange('B194:G194').format.font={name:'Arial',size:14,bold:true,color:'#243957'};
c.getRange('B194:G194').format.rowHeight=28;
const context=[
 'Observed context [B2, B3]: Kale dominates the source estate; archive/cheque databases and external files/web services also matter. Notes report late historical updates, overlapping member identities and many UG/Team Developer/web reports being moved toward MicroStrategy.',
 'Architect recommendation: maintain a reconciled historical EDW and purpose-built current/summary serving datasets with explicit freshness and report-ready state. Classify each report by latency, cutoff, owner and criticality. Transactional screens should move only after business acceptance; no single ETL tool creates this contract.',
 'Source protection: favor the approved replica/landing route and obtain DBA approval of snapshot consistency, read access and load limits. A read-only replica cannot host trigger journalizing. CDC source/log access and source-version support require a separate topology decision; do not infer them from a JDBC connection.',
 'Operational controls: use business date + source-ready signal + run/version ID. The notes describe manual end-of-day completion and inconsistent 03:00/06:00/07:00 timelines; those are observations, not an agreed SLA. Reject stale/missing feeds and block publication until every critical dependency and control passes.',
 'Common tests: insert/update/delete and late correction; initial-load-to-CDC handover; duplicate/late file; failed job after commit; target/agent outage; business-calendar exception; backup restore. Reconcile counts and monetary amounts by currency/business date/entity; test decimal precision, timestamps, encodings and null/key rules.',
 'Locality/security: keep runtime, administration, metadata, logs, backups and AI within the bank boundary. Link PowerDesigner ownership/sensitivity to deployed mappings and reports. Test least privilege, secret rotation, sensitive-value logging, restore and source-to-report traceability.',
 'Desk scoring: 0 unsuitable; 1 major gaps; 2 material integration work; 3 credible documented path; 4 strong architectural fit; 5 reserved for demonstrated superiority. Half points express judgment. These are not the repository’s bank-accepted test ratings. No numeric score certifies correctness, support or an SLA.',
 'Cost/scoring: preserve the ten existing weights (100%). The provisional fit score rescales the nine assessed criteria (91.5%); unquoted cost is excluded, not scored zero. The full total is suppressed until cost/evidence are supplied. At acceptance, replace desk ratings with test-supported ratings and record approvals.',
 'Architecture boundary: retaining Oracle Exadata is a comparison assumption based on the current estate. Revisit it if source diversity, workload tests or total cost justify another target. No bitemporal, Inmon, Kimball, Data Vault, ODS placement or specific ingestion product is imposed by this assessment.'
];
for(let i=0;i<context.length;i++){merged(c,195+i,'G',context[i]);c.getRange(`B${195+i}:G${195+i}`).format={wrapText:true,rowHeight:48,verticalAlignment:'center',font:{name:'Arial',size:11,color:'#243957'}};}
// Source verification is explicit; inherited links are not presented as newly checked.
set(src,'B3','Review date: 12 October 2026. Direct/index/retained status is stated per source. Documentation is not bank test, contract or price evidence.');
const direct=new Set(['O1','O2','O3','O4','O5','D1','D2','D3','D4','D5','D6','D8','C1','C2','C3','C4','S1','S2','S3','S4','S6','A2','A3','A4','L2','L3','L4','L5','L6']);
const index=new Set(['I1','I3','I8']);
const failed=new Set(['I4','I5','I6','A1']);
for(let r=6;r<=52;r++){
 const id=src.getRange(`B${r}`).values[0][0];
 const old=src.getRange(`E${r}`).values[0][0]??'';
 const state=direct.has(id)?'Direct official page reviewed 12 Oct 2026. ':index.has(id)?'Official search-index evidence rechecked 12 Oct 2026; direct access restricted. ':failed.has(id)?'Direct access failed/restricted 12 Oct 2026; inherited reference, not newly confirmed. ':['B1','A5','T1'].includes(id)?'Internal note; not vendor verification. ':'Retained reference; not independently reopened in this review. ';
 set(src,`E${r}`,state+old);
}
set(src,'E10','Official search-index evidence rechecked 12 Oct 2026; direct fetch failed. Oracle full pushdown is listed. Rejected rows are not written to a reject file in full-pushdown mode. Test ordering, mapping coverage and reconciliation.');
set(src,'E14','Direct official page reviewed 12 Oct 2026. Oracle-maintained; dbt support: Not Supported; minimum database 12c+. Ephemeral unsupported. Exact Core/adapter/driver/local Exadata compatibility remains unverified.');
set(src,'E17','Direct Oracle repository reviewed 12 Oct 2026. Apache 2.0; README focuses on Autonomous Database. Maintenance/source availability is not contractual support or certification for the bank’s local Exadata.');
set(src,'E28','Direct 14.1.2 official page reviewed 12 Oct 2026. Oracle Simple, Consistent and Update Date JKMs use triggers; GoldenGate is a distinct integration. CKM checks, merge/SCD and file-loading KMs documented.');
set(src,'E40','Retained Atlas configuration reference; it does not substantiate Cloudera Manager health/alert claims. Use C7 for Manager monitoring. Exact source-to-Oracle/report lineage remains unverified.');
set(src,'C40','Cloudera Atlas configuration');
set(src,'E44','Direct official 1.5.5 page reviewed 12 Oct 2026. Optional AI Inference requires local AI Registry, GPU-node setup and dedicated TLS. No credit as part of Base-only scope; quote and test disconnected service separately.');
set(src,'E49','Direct official roadmap reviewed 12 Oct 2026 (redirects to dbt-labs/dbt). Core v1 Apache 2.0 statement; archive exact release LICENSE/NOTICE. Do not apply this to other engines/distributions.');
const additional=[
 ['I10','PowerCenter component connectivity','https://docs.informatica.com/data-integration/common-content-for-data-integration/10-5-8/administrator-guide/appendix-c--informatica-platform-connectivity/powercenter-connectivity.html','Official search-index evidence reviewed 12 Oct 2026. Local repository/integration/client connectivity and native/ODBC/JDBC roles. Selected release, source connectors and licenses still require confirmation.'],
 ['C7','Cloudera Manager health, alerts and logs','https://docs.cloudera.com/cdp-private-cloud-base/7.1.9/monitoring-and-diagnostics/topics/cm-configuring-monitoring-settings.html','Official search-index page reviewed 12 Oct 2026. Health tests, alerts, events and log configuration. Version 7.1.9 reference; validate exact offered release. Business report SLAs are not supplied by this feature.'],
 ['B2','Bank estate, reporting and operating facts','Ortamlar hakkında (6 Sep 2026); Takasbank Genel Bilgilendirme (2 Sep 2026); Fiziksel Topoloji - Teknik Taraf (4 Sep 2026); Sistemler ve Servisler','Repository notes read 12 Oct 2026. Oracle/Exadata estate, late updates, manual EOD, TDM-only license statement and reporting migration. Capacity/timelines/team skills require bank confirmation; architectural opinions are not product evidence.'],
 ['B3','Operational-reporting source examples','Takasbank / Toplantı Notları / Banka Ug.md; Enerji UG.md','Repository notes read 12 Oct 2026. SWIFT/EFT history and nightly summaries; real-time monitoring needs; energy web-service files, modest row volumes and complex SQL. No measured platform benchmark or agreed SLA.'],
 ['B4','Data ownership and sensitivity metadata','Sistemler ve Servisler — section 5 PowerDesigner','Repository note read 12 Oct 2026. Source ownership, sensitivity flags, descriptions/keys and maintenance of table/column inventory. Does not prove automatic lineage through ETL and MicroStrategy.'],
 ['M1','Assessment method and judgment','Scorecard; Comparison sections 03–10, 12–15','Architect desk assessment, 12 Oct 2026. Nine ratings per candidate; cost excluded pending quotes. Ratings/shortlist are judgment, not vendor-certified scores, measured speed, bank acceptance or legal opinion.'],
 ['I11','PowerCenter Command task','https://docs.informatica.com/content/dam/source/GUID-7/GUID-7D547585-D0CF-4692-9CB1-9AEF344711E5/30/en/PC_102HF2_WorkflowBasicsGuide_en.pdf','Official search-index excerpt reviewed 12 Oct 2026. Command tasks execute shell scripts in the Integration Service environment. Older 10.2 HF2 evidence: validate the selected 10.5.x offer; local AI is a proposed integration, not a native copilot.'],
 ['I12','PowerCenter Type 2 dimension mappings','https://docs.informatica.com/content/dam/source/GUID-B/GUID-B54ED1F4-60B8-4F11-8E22-48C4BECE109A/25/en/PC_102HF2_DesignerGuide_en.pdf','Official search-index evidence reviewed 12 Oct 2026. Type 2 version, current-flag and effective-date mapping patterns. Older 10.2 HF2 source; confirm 10.5.x behavior. Does not establish business-effective correction handling automatically.'],
 ['I13','PowerCenter repository version-control entitlement','https://docs.informatica.com/data-engineering/data-engineering-integration/10-5-8/installation-for-data-engineering/part-4--after-you-install-the-services/create-and-configure-application-services/create-the-powercenter-repository-service/create-the-powercenter-repository-service.html','Official search-index excerpt reviewed 12 Oct 2026. Version control depends on the team-based-development license option. This is repository versioning, not evidence of native Git semantic merging.'],
 ['A6','CLAIRE GPT in IDMC release management','https://docs.informatica.com/content/dam/source/resources/inDesign/1772_IDMC_ReleaseReadiness_H2L_082025/1772_IDMC_ReleaseReadiness_H2L_082025.pdf','Official search-index evidence reviewed 12 Oct 2026. CLAIRE GPT appears within IDMC service release/upgrade scope. Corroborates cloud scope; it does not establish any local PowerCenter assistant entitlement.'],
];
src.getRange('B53:E62').values=additional;
src.getRange('B53:E62').format={font:{name:'Arial',size:11,color:'#243957'},verticalAlignment:'top',wrapText:true};
src.getRange('B6:E62').format.wrapText=true;
src.getRange('B6:E62').format.autofitRows();
set(src,'E13','Direct PDF access restricted 12 Oct 2026; inherited guide not newly confirmed. I13 independently corroborates repository-versioning entitlement. Confirm selected-release deployment and comparison behavior.');
set(src,'E29','Direct PDF access failed 12 Oct 2026; inherited 10.5.6 reference not newly confirmed. I12 corroborates older Type 2 mapping patterns; exact release and broader feature rights remain to verify.');
set(src,'E30','Direct PDF access returned 403 on 12 Oct 2026. I11 corroborates Command tasks in older 10.2 HF2 documentation. Confirm selected-release scheduler, CLI and workflow behavior.');
set(src,'E42','Direct PDF access returned 403 on 12 Oct 2026. A6 independently corroborates CLAIRE GPT within IDMC service scope. No evidence of a native local PowerCenter copilot is credited.');
set(c,'C120','Built-in | Type 2 mapping patterns documented; verify selected release and business-effective correction rules. [I12, I5]');
set(c,'C148','Limited | Licensed repository versioning; Git storage of exports is not native semantic merge support. [I13, I4]');
set(c,'C156','Validate | No verified native local PowerCenter assistant. CLAIRE GPT is in IDMC service scope; no on-prem copilot credit. [A6]');
set(c,'C157','Implement | Command task runs a local script calling an internal model; engineer authentication, bounded retries and batching. [I11]');
set(c,'C173','A6, I11, A5; A1 access restricted');
set(c,'C171',rationale[171][0].replace('[I6, A1]','[I11, A6]'));
set(c,'C74',rationale[74][0].replace('[I4, I5]','[I13, I4]'));
s.getRange('B42:H44').format.font={name:'Arial',size:11,color:'#243957'};
s.getRange('B42:H44').format.verticalAlignment='center';
s.getRange('B41:H41').format.verticalAlignment='center';
// Prevent long verification qualifications from clipping while retaining template widths.
for(let r=6;r<=62;r++)if(src.getRange(`B${r}:E${r}`).format.rowHeight<76)src.getRange(`B${r}:E${r}`).format.rowHeight=76;
for(const r of [11,28,37,46,55]) c.getRange(`B${r}:G${r}`).format.rowHeight=108;
for(const r of [112,120,125,151]) c.getRange(`B${r}:G${r}`).format.rowHeight=92;
// Verify independent math and gate behavior; restore every disposable test input.
const weights=s.getRange('C13:C22').values.map(x=>x[0]);
assert(Math.abs(weights.reduce((a,b)=>a+b,0)-100)<1e-8);
wb.recalculate();
const expected=cols.map((_,i)=>ratings.reduce((a,v,j)=>a+(j===7?0:weights[j]*v[i]),0)/(100-weights[7])*20);
for(let i=0;i<5;i++){
 assert(Math.abs(s.getRange(`${cols[i]}8`).values[0][0]-expected[i])<1e-8);
 assert.equal(s.getRange(`${cols[i]}10`).values[0][0],9);
 assert.equal(s.getRange(`${cols[i]}42`).values[0][0],'');
 assert.equal(s.getRange(`${cols[i]}9`).values[0][0],'Gates pending');
}
const originalD13=s.getRange('D13').values[0][0];
set(s,'D13',0);wb.recalculate();assert.equal(typeof s.getRange('D8').values[0][0],'number');
set(s,'D13',null);wb.recalculate();assert.equal(s.getRange('D8').values[0][0],'');
set(s,'D13',6);wb.recalculate();assert.equal(s.getRange('D8').values[0][0],'');
set(s,'D13',originalD13);
set(s,'D26','Fail');wb.recalculate();assert.equal(s.getRange('D9').values[0][0],'Excluded');set(s,'D26','Pending');
set(s,'D20',3);wb.recalculate();assert.equal(typeof s.getRange('D42').values[0][0],'number');set(s,'D20',null);
const savedWeight=weights[0];set(s,'C13',savedWeight+1);wb.recalculate();assert.equal(s.getRange('D8').values[0][0],'');set(s,'C13',savedWeight);
const evidence=s.getRange('D31').values[0][0];set(s,'D31',null);wb.recalculate();assert.equal(s.getRange('D8').values[0][0],'');set(s,'D31',evidence);
wb.recalculate();
console.log(JSON.stringify({provisionalScores:expected,ratings:45,costRatings:'unassessed',gates:'all pending',weights:weights.reduce((a,b)=>a+b,0)}));
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},summary:'Formula error scan'})).ndjson);
console.log((await wb.inspect({kind:'table',range:'Scorecard!B7:H10',include:'values,formulas',tableMaxRows:4,tableMaxCols:7,maxChars:2200})).ndjson);
for(const [sheetName,range,name] of [
 ['Scorecard','B2:H23','scorecard'],['Scorecard','B25:H49','decision'],
 ['Comparison','B24:G31','ingestion'],['Comparison','B166:G173','ai'],
 ['Comparison','B184:G192','recommendation'],['Comparison','B194:G203','bank-conditions'],
 ['Sources','B53:E62','sources']]){
 const p=await wb.render({sheetName,range,scale:1});await fs.writeFile(dir+'/'+name+'.png',new Uint8Array(await p.arrayBuffer()));
}
await fs.writeFile(dir+'/edited-values.json',JSON.stringify(Object.fromEntries(['Scorecard','Comparison','Sources'].map(n=>[n,wb.worksheets.getItem(n).getUsedRange().values])),null,2));
await fs.writeFile(dir+'/edit-manifest.json',JSON.stringify(edits,null,2));
await (await SpreadsheetFile.exportXlsx(wb)).save(path);
console.log('EXPORTED '+path);
