import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  Toggle,
  computeDAGLayout,
  useCanvasState,
  useHostTheme,
  useMemo,
} from "cursor/canvas";
import type { CSSProperties, StackProps, TableRowTone } from "cursor/canvas";

type ReactNode = StackProps["children"];

type ToolId = "odi" | "pwc" | "dbt" | "cdp" | "spark";
type GateStatus = "Pass" | "Conditional" | "Fail";
type Tool = {
  id: ToolId;
  name: string;
  short: string;
  version: string;
  category: string;
  stack: string;
  licensing: string;
  lifecycle: string;
  strengths: string[];
  weaknesses: string[];
  fit: string;
};
type Criterion = { id: string; name: string; weight: number; what: string };
type Data = {
  asOf: string;
  tools: Tool[];
  criteria: Criterion[];
  scores: Record<ToolId, Record<string, { score: number; why: string }>>;
  gates: { id: string; name: string; results: Record<ToolId, { status: GateStatus; note: string }> }[];
  scenarios: { id: string; name: string; weights: Record<string, number> }[];
  latency: {
    id: string;
    name: string;
    example: string;
    recommended: string;
    support: Record<ToolId, { score: number; note: string }>;
  }[];
  useCases: { id: string; name: string; detail: string; scores: Record<ToolId, number> }[];
  tco: ({ driver: string } & Record<ToolId, string>)[];
  risks: { tool: string; risk: string; likelihood: string; impact: string; mitigation: string }[];
};

// Generated from outputs/etl-comparison-2026-10/comparison-data.json (python3 build_workbook.py --json).
const DATA: Data = {
"asOf":"2026-10-14",
"tools":[
{"id":"odi","name":"Oracle Data Integrator","short":"ODI","version":"ODI 14c (14.1.2.0.0)","category":"ELT suite (pushdown, E-LT)","stack":"ODI 14c agents + Knowledge Modules; GoldenGate JKM only for proven S0/S1 feeds; Automic calls ODI scenarios / load plans","licensing":"Per processor or Named User Plus on every host running an ODI agent (list ref. USD 30k/processor + 22% annual support). WebLogic EE + Coherence EE needed for clustered agent HA. GoldenGate licensed separately on capture/delivery hosts.","lifecycle":"FMW 14.1.2 Premier Support to Dec 2030, Extended to Dec 2033. ODI 12c Premier ends Dec 2026, Extended Dec 2027. Next FMW release targeted 2027.","strengths":["Generates set-based SQL that runs inside Exadata (Smart Scan, HCC, parallel DML, partition exchange) - no second compute tier","Knowledge Modules for SCD2, incremental merge, CDC and bulk load (external tables, SQL*Loader, DB link from standby)","Native GoldenGate journalizing (JKM) when a data product truly needs S0/S1","Repository-based lineage and impact analysis; load plans with restart from failure point","Already in the Turkish capital-markets ecosystem (Borsa Istanbul uses ODI); local partners exist"],"weaknesses":["GUI-centric development; Git integration exists but merge/branching is awkward compared to code-first tools","Licence follows agent hosts; HA topology adds WebLogic/Coherence licences","Real-time capability is borrowed from GoldenGate, which the DBA team distrusts and has no 24/7 cover for","14c requires Python 3 for custom KMs (Jython deprecated) - small learning item"],"fit":"Best structural fit: Oracle-only estate, Exadata already paid for, PL/SQL team, Kale-centric sources, files and BIDB pulls."},
{"id":"pwc","name":"Informatica PowerCenter","short":"PowerCenter","version":"PowerCenter 10.5.x (final on-prem line)","category":"ETL engine suite","stack":"PowerCenter Integration Service + Repository; PowerExchange CDC for Oracle (separate licence); Pushdown Optimization option","licensing":"Quote-based; on-prem PowerCenter no longer sold to new customers per the Informatica partner (BI Technology) - successor CDI-PC is IPU consumption-based via an internet-connected IDMC Secure Agent.","lifecycle":"Standard support ended 31 Mar 2026. Paid Extended Support to 31 Mar 2027, Sustaining Support (no new fixes / security patches) to 31 Mar 2029. Informatica acquired by Salesforce (Nov 2025).","strengths":["Very broad connectivity (files, FTP, web services, mainframe, all major RDBMS)","Mature workflow manager, restartability and operational monitoring","Metadata Manager lineage; large pool of PowerCenter developers in Turkey (MKK uses it)","Takasbank already has an Informatica relationship (TDM for non-prod masking)"],"weaknesses":["End-of-support product: buying it in 2026 for a 10-year DWH is buying a forced migration","Successor (CDI-PC / IDMC) puts the control plane in the cloud - conflicts with 'data and operations stay inside the bank'","Row-by-row engine by default; full pushdown to Exadata needs the PDO option and still leaves an ETL server tier","Repository-based development; weak Git/CI story"],"fit":"Fails the support-horizon gate. Only defensible as a short-term bridge for an existing PowerCenter estate - which Takasbank does not have."},
{"id":"dbt","name":"dbt (dbt-core + dbt-oracle)","short":"dbt","version":"dbt-core 1.12 + dbt-oracle 1.12 (dbt v2/Fusion has no Oracle adapter yet)","category":"In-warehouse SQL transformation framework","stack":"dbt-core + dbt-oracle on Linux runners; ingestion by PL/SQL + external tables/SQL*Loader (or ODI); Automic runs `dbt build`; Git + CI","licensing":"Apache 2.0, no licence fee. dbt platform (SaaS) is not usable on-prem; no vendor SLA for self-hosted Core. Fivetran + dbt Labs merger completed 1 Jun 2026.","lifecycle":"Minor releases roughly quarterly, one year of support each (1.12 critical support to Jul 2027). dbt-oracle maintained by Oracle; v2 parser does not recognise Oracle yet.","strengths":["Pure SQL pushdown on Exadata - same compute advantage as ODI","Code-first: Git, pull-request review, automated tests, environments, docs site","Built-in data tests, snapshots (SCD2), incremental merge and microbatch strategies","Zero licence cost and no procurement - can start the pilot immediately"],"weaknesses":["Transformation only: no extraction, file handling, web services or CDC - a landing framework must be built","Model-level lineage only in Core; column-level lineage is a dbt platform (SaaS) feature","No commercial support for on-prem Core; Oracle adapter lags the cloud-warehouse adapters","Jinja/YAML and Git workflow are new to a PL/SQL team"],"fit":"Strong transformation layer and the fastest start, but needs a separate, home-built ingestion and orchestration layer."},
{"id":"cdp","name":"Cloudera Data Platform (Base on premises)","short":"CDP","version":"Cloudera Base on premises 7.3.2 LTS + Cloudera Streaming (Kafka, Flink) + Flow Management (NiFi)","category":"Big-data platform (storage + compute + streaming)","stack":"Cloudera Base cluster (Ozone/HDFS, Iceberg, Hive/Impala, Spark), Cloudera Streaming (Kafka/Flink, Kafka Connect + Debezium), NiFi for files/web services, Atlas/Ranger (SDX)","licensing":"Subscription by Cloudera Compute Units (cores/6 + RAM GB/12) plus Data Under Management since Feb 2025; quote-based. Requires its own commodity-server cluster - cannot run on Exadata.","lifecycle":"7.3.2 LTS GA Mar 2026, supported to Mar 2032. 7.3.1 EoS Dec 2026, 7.1.9 Oct 2028.","strengths":["Strongest native streaming stack (Kafka, Flink, NiFi) for S0 event pipelines","SDX governance: Atlas lineage, Ranger policies, Kerberos - fully on-prem","NiFi handles FTP/CSV, EPIAS web services and API ingestion well","Scales to data sizes far beyond Takasbank's (~10 TB Kale)"],"weaknesses":["A second data platform beside three Exadata machines that are 77-90% free","Data must leave Exadata to be processed and come back for MSTR - double copies, double security perimeter","Hadoop/Kafka/Spark skills absent; needs a platform team and 24/7 operations","Oracle CDC still needs a log reader (Debezium LogMiner or GoldenGate) on the Kale side"],"fit":"Over-sized for a 10 TB Oracle-centric DWH. Revisit only for a future streaming/AI or unstructured-data mandate."},
{"id":"spark","name":"Apache Spark (self-managed)","short":"Spark","version":"Apache Spark 4.2.0 (Jul 2026) on Kubernetes/YARN","category":"Distributed processing engine","stack":"Spark 4.2 (SQL, Structured Streaming, Declarative Pipelines) + Kafka + Debezium + Airflow/Automic + Iceberg or JDBC write-back to Oracle; DIY security and lineage (OpenLineage)","licensing":"Apache 2.0, no licence fee. No vendor support unless bought from a third party.","lifecycle":"Feature release roughly every 6-7 months (4.0 May 2025, 4.1 Dec 2025, 4.2 Jul 2026); maintenance releases for a limited window per line.","strengths":["Most flexible engine: Python/Scala/SQL, ML, streaming (Real-time Mode), CDC APIs in 4.2","No licence cost; huge community","Code-first, testable, Git-native"],"weaknesses":["Everything around the engine is DIY: scheduling, security, lineage, monitoring, upgrades","Moves data off Exadata through JDBC - the slowest path for a 2-billion-row SWIFT table","Requires Python/Scala data engineers and a platform team Takasbank does not have","Real-time Mode is still marked experimental for parts of the API"],"fit":"Weakest fit: maximum engineering load, minimum use of existing Oracle investment."}
],
"criteria":[
{"id":"pushdown","name":"Exadata / Oracle pushdown and performance","weight":14,"what":"Runs set-based work inside Exadata (Smart Scan, HCC, parallel DML), handles 2B-row SWIFT and 20M/day takas volumes without a second compute tier."},
{"id":"realtime","name":"Real-time, CDC and operational reporting","weight":12,"what":"Supports S0 near-real-time and S1 micro-batch for izleme screens and intraday Fon Bilgilendirme without touching prod Kale."},
{"id":"security","name":"Security, on-prem and regulatory compliance","weight":10,"what":"Fully on-prem with no external control plane; BDDK/KVKK/SPK fit; TDE/VPD/redaction respected; security patches through the horizon."},
{"id":"governance","name":"Governance: lineage, metadata, audit, data quality","weight":10,"what":"Column-level source-to-report lineage, run lineage, audit trail and data-quality rules for regulatory reports."},
{"id":"skills","name":"Team skill fit and learning curve","weight":10,"what":"Usable by an Oracle DBA / PL/SQL team with no DWH/ETL background; hiring market in Turkey."},
{"id":"connectivity","name":"Source connectivity","weight":8,"what":"Kale standby, ARSIV, CekDB, BIST Replica BIDB / Borsa DWH, FTP/CSV, EPIAS web services, possible Postgres/MSSQL."},
{"id":"transform","name":"Transformation and modelling","weight":8,"what":"SCD2, bitemporal core, incremental merge, set-based logic, reuse of existing PL/SQL."},
{"id":"tco","name":"5-year total cost of ownership","weight":8,"what":"Licence + support + infrastructure + people over five years (higher score = lower cost)."},
{"id":"operations","name":"Operations and orchestration","weight":7,"what":"Automic integration, gün sonu event triggering, restart from failure, monitoring, without a 24/7 team."},
{"id":"devops","name":"DevOps: Git, CI/CD, automated tests","weight":6,"what":"Version control, code review, automated tests and promotion DEV -> TEST -> PREPROD -> PROD."},
{"id":"vendor","name":"Vendor viability, roadmap and local support","weight":7,"what":"Supported release horizon, roadmap risk, ownership changes, partners in Turkey."}
],
"scores":{
"odi":{"pushdown":{"score":5,"why":"E-LT by design: generated SQL runs in the target Exadata; Oracle KMs use external tables, parallel DML, MERGE and partition exchange."},"realtime":{"score":3,"why":"Batch and micro-batch natively; S0 only via GoldenGate JKM (separate licence, DBA concerns). ADG standby covers raw izleme screens."},"security":{"score":4,"why":"Fully on-prem; agents run inside the bank; credentials in the ODI repository/wallet; relies on Oracle DB security (TDE, VPD)."},"governance":{"score":4,"why":"Repository holds mappings, column lineage and impact analysis; run history per session. DQ needs custom checks or Oracle EDQ."},"skills":{"score":4,"why":"SQL-centric; PL/SQL developers become productive quickly. GUI and KM concepts need training."},"connectivity":{"score":4,"why":"Oracle, JDBC (Postgres/MSSQL), files, FTP, web-service tools; BIDB pull from Borsa DWH as Ondata described."},"transform":{"score":4,"why":"Built-in SCD2 and incremental IKMs; bitemporal patterns via custom KM; existing procedure SQL reusable."},"tco":{"score":3,"why":"Processor licences on agent hosts plus 22% annual support; HA adds WebLogic/Coherence. No extra compute (Exadata)."},"operations":{"score":4,"why":"Load plans with restart, agent HA, Automic triggers scenarios via command line or web service."},"devops":{"score":3,"why":"VCS/Git integration and deployment archives exist, but branching and merging repository objects is clumsy."},"vendor":{"score":4,"why":"Oracle; 14c supported to 2030/2033; Borsa Istanbul reference; local integrators."}},
"pwc":{"pushdown":{"score":3,"why":"Engine-based ETL; Pushdown Optimization (extra option) can push to Oracle, but an ETL server tier remains."},"realtime":{"score":3,"why":"PowerExchange CDC for Oracle (separate licence) gives log-based capture; real-time option exists."},"security":{"score":2,"why":"On-prem today, but security fixes stop after Extended Support (Mar 2027); successor needs an internet-connected Secure Agent and cloud control plane."},"governance":{"score":4,"why":"Metadata Manager lineage and mature audit; DQ via separate Informatica products."},"skills":{"score":3,"why":"No in-house ETL skills; PowerCenter developers available in the Turkish market (MKK)."},"connectivity":{"score":5,"why":"Broadest connector catalogue of the five: files, FTP, web services, all RDBMS, mainframe."},"transform":{"score":4,"why":"Rich transformation library, SCD wizards, lookups; logic lives in the engine, not in SQL."},"tco":{"score":2,"why":"Quote-based licence, extended-support premium, and a forced migration to IDMC within the 5-year window."},"operations":{"score":4,"why":"Workflow Manager/Monitor, restart and recovery are mature."},"devops":{"score":2,"why":"Repository-centric; XML export for Git; weak CI/CD."},"vendor":{"score":1,"why":"On-prem product at end of standard support; now part of Salesforce; partner reported no new on-prem sales."}},
"dbt":{"pushdown":{"score":5,"why":"Every model compiles to SQL executed in Exadata; incremental merge and microbatch strategies supported by dbt-oracle."},"realtime":{"score":2,"why":"No CDC or streaming; microbatch runs give S1 at best; S0 must come from ADG or GoldenGate."},"security":{"score":4,"why":"Self-hosted Core sends no data out; runs with DB accounts; secrets handled by the runner. Do not use dbt platform (SaaS)."},"governance":{"score":3,"why":"DAG lineage, docs site and built-in tests; column-level lineage only in the SaaS platform; run artifacts must be harvested."},"skills":{"score":4,"why":"SQL first; Jinja macros, YAML and Git are new but small steps for SQL people."},"connectivity":{"score":1,"why":"None: dbt only transforms what is already in the database; landing must be built separately."},"transform":{"score":4,"why":"Snapshots (SCD2), incremental models, tests, macros; bitemporal handled with custom macros."},"tco":{"score":5,"why":"No licence; people cost for building the ingestion/orchestration framework."},"operations":{"score":3,"why":"CLI runs from Automic; `dbt retry` for restarts; monitoring built from run_results artifacts."},"devops":{"score":5,"why":"Best-in-class: Git, pull requests, CI, environment targets, slim CI."},"vendor":{"score":2,"why":"Open source with no on-prem SLA; Oracle adapter community/Oracle-maintained and not yet on v2 engine; vendor focus is cloud."}},
"cdp":{"pushdown":{"score":2,"why":"Processing happens on the Cloudera cluster; Oracle is reached via JDBC/Sqoop-style pulls and results written back for MSTR."},"realtime":{"score":4,"why":"Kafka + Flink + NiFi give true streaming; Oracle CDC still needs Debezium/LogMiner or GoldenGate on Kale side."},"security":{"score":4,"why":"On-prem with Kerberos, Ranger, TLS; larger attack surface and second security perimeter."},"governance":{"score":4,"why":"Atlas lineage and Ranger audit across the cluster; lineage breaks at the Oracle boundary."},"skills":{"score":1,"why":"Hadoop, Kafka, Flink, Spark, Kerberos skills absent; scarce and expensive hires."},"connectivity":{"score":5,"why":"NiFi plus Kafka Connect cover files, FTP, web services, APIs and all databases."},"transform":{"score":3,"why":"Spark SQL / Hive / Iceberg MERGE are capable, but the integrated core would be split between two platforms."},"tco":{"score":1,"why":"CCU + data-under-management subscription, a new server cluster, and a platform team on top of Exadata."},"operations":{"score":2,"why":"Cloudera Manager helps, but a multi-service cluster needs 24/7 operations Takasbank lacks."},"devops":{"score":3,"why":"Code-based jobs are Git-friendly; platform configuration is not."},"vendor":{"score":4,"why":"7.3.2 LTS supported to 2032; established vendor with Turkish banking references."}},
"spark":{"pushdown":{"score":2,"why":"Reads and writes Oracle through JDBC; no use of Smart Scan; 2B-row SWIFT reload is the worst case."},"realtime":{"score":4,"why":"Structured Streaming and 4.x Real-time Mode with Kafka + Debezium; parts still experimental."},"security":{"score":2,"why":"Everything (Kerberos/TLS, secrets, authorisation) is self-built and self-patched."},"governance":{"score":2,"why":"Lineage via OpenLineage/DIY; no built-in catalogue or audit."},"skills":{"score":1,"why":"Python/Scala distributed-systems engineering; furthest from the PL/SQL team."},"connectivity":{"score":3,"why":"JDBC and files are fine; FTP/web services need custom code."},"transform":{"score":3,"why":"Unlimited logic, but core tables live in Oracle, so every load is a cross-system write."},"tco":{"score":2,"why":"No licence, but cluster hardware plus 3-5 platform/data engineers."},"operations":{"score":1,"why":"Scheduler, monitoring, restart and upgrades are all DIY."},"devops":{"score":4,"why":"Code-first and testable; CI/CD must be assembled."},"vendor":{"score":2,"why":"Community project; support only via third parties; fast release cadence to track."}}
},
"gates":[
{"id":"G1","name":"Runs fully on-prem with no external control plane or internet-connected agent","results":{"odi":{"status":"Pass","note":"All components inside the bank."},"pwc":{"status":"Conditional","note":"10.5 yes; the only supported successor (CDI-PC/IDMC) needs a cloud control plane."},"dbt":{"status":"Pass","note":"dbt-core only; dbt platform (SaaS) excluded."},"cdp":{"status":"Pass","note":"Cloudera Base on premises."},"spark":{"status":"Pass","note":"Self-managed."}}},
{"id":"G2","name":"Vendor-supported release with security fixes for 5+ years (to late 2031)","results":{"odi":{"status":"Pass","note":"14c Premier to Dec 2030, Extended to Dec 2033."},"pwc":{"status":"Fail","note":"Standard support ended Mar 2026; Extended to Mar 2027; Sustaining to 2029 without new fixes."},"dbt":{"status":"Conditional","note":"Apache 2.0 with indefinite OSS commitment, but no SLA; each minor line supported 1 year."},"cdp":{"status":"Pass","note":"7.3.2 LTS to Mar 2032."},"spark":{"status":"Conditional","note":"Community maintenance only; third-party support needed."}}},
{"id":"G3","name":"Production-grade support for Oracle Database 19c/23ai on Exadata","results":{"odi":{"status":"Pass","note":"Native Oracle KMs, Exadata-aware loading."},"pwc":{"status":"Pass","note":"Certified Oracle connectivity."},"dbt":{"status":"Pass","note":"dbt-oracle supports on-prem Oracle via python-oracledb."},"cdp":{"status":"Pass","note":"JDBC source/target."},"spark":{"status":"Pass","note":"JDBC source/target."}}}
],
"scenarios":[
{"id":"base","name":"Base (Takasbank profile)","weights":{"pushdown":14,"realtime":12,"security":10,"governance":10,"skills":10,"connectivity":8,"transform":8,"tco":8,"operations":7,"devops":6,"vendor":7}},
{"id":"oracle","name":"Oracle-team-first","weights":{"pushdown":16,"realtime":8,"security":10,"governance":8,"skills":16,"connectivity":6,"transform":8,"tco":8,"operations":8,"devops":6,"vendor":6}},
{"id":"realtime","name":"Real-time-first","weights":{"pushdown":10,"realtime":24,"security":10,"governance":8,"skills":8,"connectivity":10,"transform":6,"tco":6,"operations":8,"devops":4,"vendor":6}},
{"id":"cost","name":"Cost-first","weights":{"pushdown":12,"realtime":8,"security":10,"governance":8,"skills":10,"connectivity":6,"transform":8,"tco":22,"operations":6,"devops":5,"vendor":5}}
],
"latency":[
{"id":"S0","name":"Near real-time (seconds)","example":"Izleme screens, Team Developer current-state queries","recommended":"Kale ADG read-only standby on sur; GoldenGate -> LND -> ODS_ projection only for products with a proven SLA","support":{"odi":{"score":2,"note":"Only with GoldenGate JKM"},"pwc":{"score":3,"note":"PowerExchange CDC / real-time option"},"dbt":{"score":1,"note":"Not supported"},"cdp":{"score":5,"note":"Kafka/Flink/NiFi native"},"spark":{"score":4,"note":"Structured Streaming + Kafka"}}},
{"id":"S1","name":"Intraday micro-batch (5-30 min)","example":"Fon Bilgilendirme 08:00-17:45 with correction files","recommended":"Watermark/SCN-based micro-batch from the standby into LND, recompute affected funds only","support":{"odi":{"score":4,"note":"Scheduled load plans, CDC on watermark or GG"},"pwc":{"score":4,"note":"Scheduled workflows / CDC"},"dbt":{"score":3,"note":"Microbatch incremental, scheduled by Automic"},"cdp":{"score":5,"note":"Streaming or micro-batch"},"spark":{"score":4,"note":"Trigger-based micro-batch"}}},
{"id":"S2","name":"Gün sonu (T-1)","example":"BISTECH SPK 13 reports, SWIFT legal reports, takas positions","recommended":"SCN-consistent extract from standby after the machine-readable gün sonu event","support":{"odi":{"score":5,"note":"Core use case"},"pwc":{"score":4,"note":"Core use case, engine tier"},"dbt":{"score":5,"note":"Core use case once landed"},"cdp":{"score":3,"note":"Works, but off-Exadata"},"spark":{"score":3,"note":"Works, but off-Exadata"}}},
{"id":"S3","name":"Scheduled file / external feed","example":"FTP/CSV, EPIAS web services, Borsa DWH fund contracts, Verda file output","recommended":"Manifest + checksum landing; external tables for files; web-service pull into LND_FILE / LND_EPIAS","support":{"odi":{"score":4,"note":"File and web-service tools"},"pwc":{"score":5,"note":"Broadest connectors"},"dbt":{"score":1,"note":"Needs separate ingestion"},"cdp":{"score":5,"note":"NiFi"},"spark":{"score":3,"note":"Custom code"}}},
{"id":"S4","name":"Backfill / replay","example":"10-year fund history, 2013+ SWIFT history, ARSIV yearly rollovers","recommended":"Replay from immutable landing with a separate load_id; partition exchange for bulk history","support":{"odi":{"score":5,"note":"Set-based bulk + partition exchange"},"pwc":{"score":3,"note":"Engine throughput bound"},"dbt":{"score":5,"note":"full-refresh / microbatch backfill"},"cdp":{"score":4,"note":"Scales out, then write back"},"spark":{"score":4,"note":"Scales out, then write back"}}}
],
"useCases":[
{"id":"UC1","name":"SWIFT legal reports","detail":"2B rows / 170 GB since 2013, ~1M messages/day; collapse to ~24M one-row-per-message summary; free-text ID search; T-1.","scores":{"odi":5,"pwc":3,"dbt":5,"cdp":3,"spark":3}},
{"id":"UC2","name":"Fon Bilgilendirme platform","detail":"~60k fund notifications/day, recalculation 08:00-17:45 with correction files; 10-year history via CSV and web service.","scores":{"odi":4,"pwc":3,"dbt":3,"cdp":4,"spark":3}},
{"id":"UC3","name":"Fon islem defterleri","detail":"9M Borsa DWH fund contracts/day (deleted at source after 5 days), cleanse to ~600k, files twice a day per market to Borsa Verda.","scores":{"odi":4,"pwc":4,"dbt":2,"cdp":4,"spark":3}},
{"id":"UC4","name":"BISTECH SPK 13 reports","detail":"Kale NOMX + Replica BIDB, after Takas UG gün sonu; replace DB_ARSIV dblink views with PUB snapshots.","scores":{"odi":5,"pwc":4,"dbt":4,"cdp":2,"spark":2}},
{"id":"UC5","name":"EPIAS energy settlement feeds","detail":"Order/settlement files via web services, 5-10k records/day, collateral data, avans.takas table.","scores":{"odi":3,"pwc":4,"dbt":1,"cdp":5,"spark":2}},
{"id":"UC6","name":"Operational izleme screens (S0)","detail":"Intraday current-state queries now hitting prod Kale from Team Developer / React.","scores":{"odi":2,"pwc":2,"dbt":1,"cdp":4,"spark":3}},
{"id":"UC7","name":"Takas positions and history","detail":"~20M derivative and non-derivative positions/day; yearly banka -> banka_old -> arsiv rollover moves into DWH partitions.","scores":{"odi":5,"pwc":3,"dbt":4,"cdp":4,"spark":4}}
],
"tco":[
{"driver":"Software licence (5 yr)","odi":"Medium-High: list ref. USD 30k per processor on agent hosts (x86 core factor 0.5) + 22%/yr support","pwc":"High: quote-based; extended-support premium; migration to IPU billing within window","dbt":"None","cdp":"High: CCU + data-under-management subscription (quote-based)","spark":"None"},
{"driver":"CDC / real-time add-on","odi":"GoldenGate per processor on capture/delivery hosts, only for S0 products (licence includes ADG entitlement)","pwc":"PowerExchange CDC licence","dbt":"External (ADG / GoldenGate)","cdp":"Included in Cloudera Streaming subscription; Oracle log reader still needed","spark":"Kafka + Debezium (free) - operate yourself"},
{"driver":"Infrastructure","odi":"Low: 2 agent VMs; compute on existing Exadata","pwc":"Medium: integration-service servers + repository DB","dbt":"Low: runner VMs; compute on existing Exadata","cdp":"High: new multi-node cluster (storage, masters, Kafka brokers)","spark":"High: new Kubernetes/YARN cluster + Kafka"},
{"driver":"People (build + run)","odi":"2 data engineers + part-time ODI admin","pwc":"2 ETL developers + Informatica admin","dbt":"2-3 data engineers (incl. ingestion framework) + DevOps support","cdp":"Platform team 3-4 + 2 data engineers; 24/7 on-call","spark":"3-5 platform/data engineers; 24/7 on-call"},
{"driver":"Training / hiring risk","odi":"Low-Medium","pwc":"Medium","dbt":"Low-Medium","cdp":"High","spark":"High"},
{"driver":"Exit / migration cost","odi":"Medium: logic in KMs/mappings, SQL is visible","pwc":"High: forced re-platform before 2029","dbt":"Low: plain SQL in Git","cdp":"High","spark":"Medium"},
{"driver":"Overall 5-year band","odi":"Medium","pwc":"High","dbt":"Low","cdp":"Very high","spark":"High"}
],
"risks":[
{"tool":"ODI","risk":"GoldenGate operational burden if S0 products are approved","likelihood":"Medium","impact":"High","mitigation":"Serve raw izleme from ADG standby first; GoldenGate only per product with DBA on-call agreed; monitor lag in CTL."},
{"tool":"ODI","risk":"Licence scope creep (agents on more hosts, HA needs WebLogic EE)","likelihood":"Medium","impact":"Medium","mitigation":"Fix agent topology before the PO; standalone agents with Automic-level failover instead of WebLogic cluster."},
{"tool":"ODI","risk":"GUI development hides logic from code review","likelihood":"Medium","impact":"Medium","mitigation":"ODI VCS on Git, naming standards, scenario versioning, generated-SQL review in PR."},
{"tool":"PowerCenter","risk":"Product end-of-life forces a second migration","likelihood":"High","impact":"High","mitigation":"Do not select; if ever considered, price the IDMC migration and confirm on-prem control-plane options in writing."},
{"tool":"PowerCenter","risk":"Cloud control plane conflicts with data-residency rules","likelihood":"High","impact":"High","mitigation":"Legal/compliance review of CDI-PC Secure Agent connectivity before any further evaluation."},
{"tool":"dbt","risk":"Home-built ingestion framework becomes an unsupported product","likelihood":"Medium","impact":"High","mitigation":"Keep landing minimal (external tables, PL/SQL pulls from standby), documented and owned; or pair with ODI for ingestion."},
{"tool":"dbt","risk":"Oracle adapter lags dbt v2 / Fusion","likelihood":"High","impact":"Medium","mitigation":"Pin dbt-core 1.x + dbt-oracle; track adapter roadmap; avoid features exclusive to the SaaS platform."},
{"tool":"dbt","risk":"No vendor SLA for production incidents","likelihood":"Medium","impact":"Medium","mitigation":"Third-party support contract or internal runbooks; failure surface is small because SQL runs in Oracle."},
{"tool":"CDP","risk":"Second platform without a platform team","likelihood":"High","impact":"High","mitigation":"Do not adopt for the core DWH; reconsider only with a funded streaming/AI programme and team."},
{"tool":"CDP","risk":"Two copies of regulated data and two security perimeters","likelihood":"High","impact":"Medium","mitigation":"Ranger/Atlas + KVKK classification on both sides; avoid by keeping the DWH on Exadata."},
{"tool":"Spark","risk":"DIY platform with no vendor support","likelihood":"High","impact":"High","mitigation":"Not recommended; if needed, buy commercial support and limit to non-critical analytics."},
{"tool":"Spark","risk":"JDBC bottleneck for large Oracle loads","likelihood":"High","impact":"Medium","mitigation":"Partitioned parallel reads, or keep heavy SQL inside Exadata."},
{"tool":"All","risk":"No machine-readable gün sonu completion signal","likelihood":"High","impact":"High","mitigation":"Batch-control record (business date, run id, SCN) produced by operations before any S2 pipeline goes live."},
{"tool":"All","risk":"Historical rows updated in place break incremental loads","likelihood":"Medium","impact":"High","mitigation":"Profile change columns on the standby; fall back to SCN snapshots and hash-diff where no reliable timestamp exists."}
]
};

const TOOL_IDS: ToolId[] = ["odi", "pwc", "dbt", "cdp", "spark"];
const TOOL = Object.fromEntries(DATA.tools.map((t) => [t.id, t])) as Record<ToolId, Tool>;
const BASE_WEIGHTS: Record<string, number> = DATA.scenarios[0].weights;

const VERDICT: Record<ToolId, string> = {
  odi: "Select as enterprise ELT platform",
  pwc: "Exclude: fails support-horizon gate",
  dbt: "Qualified alternative; PoC head-to-head",
  cdp: "Do not use for the core DWH",
  spark: "Do not use for the core DWH",
};

const SHORT_CRITERION: Record<string, string> = {
  pushdown: "Exadata pushdown",
  realtime: "Real-time / CDC",
  security: "Security, on-prem",
  governance: "Governance, lineage",
  skills: "Team skill fit",
  connectivity: "Source connectivity",
  transform: "Transformation",
  tco: "5-year TCO",
  operations: "Operations",
  devops: "DevOps",
  vendor: "Vendor viability",
};

function weightedTotal(tool: ToolId, weights: Record<string, number>): number {
  const sumW = DATA.criteria.reduce((a, c) => a + (weights[c.id] ?? 0), 0);
  if (sumW === 0) return 0;
  const raw = DATA.criteria.reduce((a, c) => a + (weights[c.id] ?? 0) * DATA.scores[tool][c.id].score, 0);
  return Math.round((raw / (5 * sumW)) * 1000) / 10;
}

function gateOverall(tool: ToolId): GateStatus {
  const statuses = DATA.gates.map((g) => g.results[tool].status);
  if (statuses.includes("Fail")) return "Fail";
  if (statuses.includes("Conditional")) return "Conditional";
  return "Pass";
}

function avg(values: number[]): number {
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

const UC_AVG: Record<ToolId, number> = Object.fromEntries(
  TOOL_IDS.map((t) => [t, avg(DATA.useCases.map((u) => u.scores[t]))]),
) as Record<ToolId, number>;

const TCO_BAND: Record<ToolId, string> = Object.fromEntries(
  TOOL_IDS.map((t) => [t, DATA.tco[DATA.tco.length - 1][t]]),
) as Record<ToolId, string>;

function useStatusColor(): (s: GateStatus) => string {
  const theme = useHostTheme();
  return (s) =>
    s === "Pass" ? theme.chart.palette.green : s === "Conditional" ? theme.chart.palette.goldenYellow : theme.chart.palette.darkAmber;
}

function GateBadge({ status }: { status: GateStatus }) {
  const theme = useHostTheme();
  const color = useStatusColor();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: theme.text.primary }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color(status), flex: "none" }} />
      <span style={{ fontWeight: status === "Fail" ? 600 : 400 }}>{status}</span>
    </span>
  );
}

function HeatCell({
  score,
  selected,
  title,
  onClick,
}: {
  score: number;
  selected?: boolean;
  title?: string;
  onClick?: () => void;
}) {
  const theme = useHostTheme();
  const alpha = [0, 6, 16, 28, 42, 58][score] ?? 0;
  return (
    <div
      title={title}
      onClick={onClick}
      style={{
        background: `color-mix(in srgb, ${theme.accent.primary} ${alpha}%, transparent)`,
        border: `1px solid ${selected ? theme.accent.primary : "transparent"}`,
        borderRadius: 4,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 600,
        color: theme.text.primary,
        cursor: onClick ? "pointer" : "default",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {score}
    </div>
  );
}

type HeatRow = { key: string; lead: ReactNode[]; scores: number[]; notes?: string[] };

function HeatTable({
  leadHeaders,
  leadTemplate,
  rows,
  footer,
  selected,
  onSelect,
}: {
  leadHeaders: string[];
  leadTemplate: string;
  rows: HeatRow[];
  footer?: { lead: ReactNode[]; values: string[] };
  selected?: { row: string; col: number } | null;
  onSelect?: (row: string, col: number) => void;
}) {
  const theme = useHostTheme();
  const cols = `${leadTemplate} repeat(5, minmax(60px, 1fr))`;
  const head: CSSProperties = { fontSize: 12, color: theme.text.tertiary, padding: "0 4px" };
  const cellText: CSSProperties = { fontSize: 13, color: theme.text.primary, padding: "0 4px", minWidth: 0 };
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 4, alignItems: "center", minWidth: 640 }}>
        {leadHeaders.map((h) => (
          <div key={`h-${h}`} style={head}>
            {h}
          </div>
        ))}
        {TOOL_IDS.map((t) => (
          <div key={`h-${t}`} style={{ ...head, textAlign: "center" }}>
            {TOOL[t].short}
          </div>
        ))}
        {rows.map((r) => [
          ...r.lead.map((l, i) => (
            <div key={`${r.key}-l${i}`} style={cellText}>
              {l}
            </div>
          )),
          ...r.scores.map((s, i) => (
            <HeatCell
              key={`${r.key}-${i}`}
              score={s}
              title={r.notes ? `${TOOL[TOOL_IDS[i]].short}: ${r.notes[i]}` : undefined}
              selected={!!selected && selected.row === r.key && selected.col === i}
              onClick={onSelect ? () => onSelect(r.key, i) : undefined}
            />
          )),
        ])}
        {footer
          ? [
              ...footer.lead.map((l, i) => (
                <div
                  key={`f-l${i}`}
                  style={{ ...cellText, fontWeight: 600, borderTop: `1px solid ${theme.stroke.secondary}`, paddingTop: 6 }}
                >
                  {l}
                </div>
              )),
              ...footer.values.map((v, i) => (
                <div
                  key={`f-${i}`}
                  style={{
                    ...cellText,
                    textAlign: "center",
                    fontWeight: 600,
                    borderTop: `1px solid ${theme.stroke.secondary}`,
                    paddingTop: 6,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {v}
                </div>
              )),
            ]
          : null}
      </div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  const theme = useHostTheme();
  return (
    <ul style={{ margin: 0, paddingLeft: 18, color: theme.text.secondary, fontSize: 13, lineHeight: "20px" }}>
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

function Hero() {
  const rows = TOOL_IDS.map((t) => [
    TOOL[t].short,
    <GateBadge key={t} status={gateOverall(t)} />,
    weightedTotal(t, BASE_WEIGHTS).toFixed(1),
    UC_AVG[t].toFixed(2),
    TCO_BAND[t],
    VERDICT[t],
  ]);
  const tones: (TableRowTone | undefined)[] = TOOL_IDS.map((t) =>
    t === "odi" ? "success" : t === "dbt" ? "info" : gateOverall(t) === "Fail" ? "danger" : undefined,
  );
  return (
    <Stack gap={16}>
      <Grid columns="minmax(0, 1.7fr) minmax(0, 1fr)" gap={16} align="start">
        <Callout tone="success" title="Recommendation: Oracle Data Integrator 14c as the enterprise ELT platform">
          <Stack gap={6}>
            <Text>
              All transformation runs as set-based SQL inside the Exadata machines Takasbank already owns, built by the existing Oracle
              and PL/SQL team.
            </Text>
            <Text>
              S0 izleme screens read the Kale Active Data Guard standby on sur. GoldenGate (through the ODI journalizing KM) is added only
              for data products with a proven S0 SLA.
            </Text>
            <Text>
              dbt-core + dbt-oracle is the qualified alternative and procurement-free fallback; the PoC runs ODI and dbt head to head.
              PowerCenter is excluded (support horizon); Cloudera and Spark are not used for the core DWH.
            </Text>
          </Stack>
        </Callout>
        <Grid columns={2} gap={12}>
          <Stat value={weightedTotal("odi", BASE_WEIGHTS).toFixed(1)} label="ODI base score (of 100)" tone="success" />
          <Stat value={weightedTotal("dbt", BASE_WEIGHTS).toFixed(1)} label="dbt, runner-up" />
          <Stat value="3 of 4" label="weighting scenarios led by ODI" />
          <Stat value="1" label="tool fails a knock-out gate" tone="danger" />
        </Grid>
      </Grid>
      <Table
        headers={["Tool", "Knock-out gates", "Base score", "Use-case fit (1-5)", "5-year TCO band", "Verdict"]}
        rows={rows}
        rowTone={tones}
        columnAlign={["left", "left", "right", "right", "left", "left"]}
      />
    </Stack>
  );
}

function WeightExplorer() {
  const theme = useHostTheme();
  const [weights, setWeights] = useCanvasState<Record<string, number>>("weights", BASE_WEIGHTS);
  const [scenario, setScenario] = useCanvasState<string>("scenario", "base");
  const [applyGates, setApplyGates] = useCanvasState<boolean>("applyGates", true);

  const sumW = DATA.criteria.reduce((a, c) => a + (weights[c.id] ?? 0), 0);
  const totals = TOOL_IDS.map((t) => ({ t, v: weightedTotal(t, weights), excluded: applyGates && gateOverall(t) === "Fail" }));
  const ranked = [...totals].sort((a, b) => Number(a.excluded) - Number(b.excluded) || b.v - a.v);
  const eligible = ranked.filter((r) => !r.excluded);
  const leader = eligible[0];
  const second = eligible[1];

  const pickScenario = (id: string) => {
    const s = DATA.scenarios.find((x) => x.id === id);
    if (!s) return;
    setScenario(id);
    setWeights({ ...s.weights });
  };
  const setWeight = (id: string, v: number) => {
    setScenario("custom");
    setWeights((prev) => ({ ...prev, [id]: v }));
  };

  return (
    <Stack gap={12}>
      <Row gap={8} align="center" wrap>
        {DATA.scenarios.map((s) => (
          <Pill key={s.id} active={scenario === s.id} onClick={() => pickScenario(s.id)}>
            {s.name}
          </Pill>
        ))}
        <Pill active={scenario === "custom"} onClick={() => setScenario("custom")}>
          Custom
        </Pill>
        <Spacer />
        <Row gap={8} align="center">
          <Text size="small" tone="secondary">
            Apply knock-out gates
          </Text>
          <Toggle checked={applyGates} onChange={setApplyGates} />
        </Row>
      </Row>
      <Grid columns="minmax(0, 1fr) minmax(0, 1.1fr)" gap={20} align="start">
        <Stack gap={6}>
          <Row align="center">
            <Text size="small" weight="semibold">
              Criterion weights
            </Text>
            <Spacer />
            <Text size="small" tone={sumW === 100 ? "tertiary" : "secondary"}>
              Total {sumW}
              {sumW === 100 ? "" : " (scores normalised to 100)"}
            </Text>
          </Row>
          {DATA.criteria.map((c) => (
            <div
              key={c.id}
              title={c.what}
              style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr) 28px", gap: 8, alignItems: "center" }}
            >
              <span style={{ fontSize: 12, color: theme.text.secondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {SHORT_CRITERION[c.id]}
              </span>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={weights[c.id] ?? 0}
                onChange={(e: { target: { value: string } }) => setWeight(c.id, Number(e.target.value))}
                style={{ width: "100%", accentColor: theme.accent.primary }}
              />
              <span style={{ fontSize: 12, color: theme.text.primary, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {weights[c.id] ?? 0}
              </span>
            </div>
          ))}
        </Stack>
        <Stack gap={10}>
          <H3>Weighted score by tool under the selected weights</H3>
          <BarChart
            categories={TOOL_IDS.map((t) => TOOL[t].short)}
            series={[{ name: "Weighted score (0-100)", data: TOOL_IDS.map((t) => weightedTotal(t, weights)) }]}
            horizontal
            yMin={0}
            yMax={100}
            showValues
            height={200}
            referenceLines={leader ? [{ value: leader.v, label: `Leader ${TOOL[leader.t].short}` }] : undefined}
          />
          <Text size="small" tone="tertiary">
            Value axis: weighted score = sum(weight x score 1-5) / (5 x total weight) x 100. Category axis: tool. Source: comparison_data.py,
            scores as of {DATA.asOf}.
          </Text>
          {leader && second ? (
            <Callout tone={leader.t === "odi" ? "success" : "info"}>
              {`${TOOL[leader.t].short} leads with ${leader.v.toFixed(1)}, ${(leader.v - second.v).toFixed(1)} points ahead of ${TOOL[second.t].short}.`}
              {applyGates ? " PowerCenter is excluded by gate G2." : " Gates are off, so PowerCenter is ranked despite failing G2."}
            </Callout>
          ) : null}
          <Table
            headers={["Rank", "Tool", "Score", "Gap to leader", "Gates"]}
            rows={ranked.map((r, i) => [
              r.excluded ? "Excluded" : String(i + 1),
              TOOL[r.t].short,
              r.v.toFixed(1),
              r.excluded || !leader ? "-" : (r.v - leader.v).toFixed(1),
              <GateBadge key={r.t} status={gateOverall(r.t)} />,
            ])}
            rowTone={ranked.map((r) => (r.excluded ? "danger" : leader && r.t === leader.t ? "success" : undefined))}
            columnAlign={["left", "left", "right", "right", "left"]}
          />
        </Stack>
      </Grid>
    </Stack>
  );
}

function ScenarioChart() {
  return (
    <Stack gap={8}>
      <H3>Weighted score by tool in each weighting scenario</H3>
      <BarChart
        categories={DATA.scenarios.map((s) => s.name)}
        series={TOOL_IDS.map((t) => ({ name: TOOL[t].short, data: DATA.scenarios.map((s) => weightedTotal(t, s.weights)) }))}
        yMin={0}
        yMax={100}
        height={240}
      />
      <Text size="small" tone="tertiary">
        Value axis: weighted score (0-100). Category axis: weighting scenario. ODI leads three of four scenarios; dbt overtakes it only
        when 5-year TCO is weighted at 22% (cost-first: 76.2 vs 75.4).
      </Text>
    </Stack>
  );
}

function ScoringHeatmap() {
  const theme = useHostTheme();
  const [sel, setSel] = useCanvasState<{ row: string; col: number } | null>("heatSel", { row: "pushdown", col: 0 });
  const rows: HeatRow[] = DATA.criteria.map((c) => ({
    key: c.id,
    lead: [c.name, <span key="w" style={{ color: theme.text.tertiary }}>{c.weight}</span>],
    scores: TOOL_IDS.map((t) => DATA.scores[t][c.id].score),
  }));
  const selCrit = sel ? DATA.criteria.find((c) => c.id === sel.row) : undefined;
  const selTool = sel ? TOOL_IDS[sel.col] : undefined;
  return (
    <Grid columns="minmax(0, 1.8fr) minmax(0, 1fr)" gap={20} align="start">
      <Stack gap={8}>
        <HeatTable
          leadHeaders={["Criterion", "Weight"]}
          leadTemplate="minmax(0, 2.4fr) 52px"
          rows={rows}
          footer={{ lead: ["Weighted total (of 100)", "100"], values: TOOL_IDS.map((t) => weightedTotal(t, BASE_WEIGHTS).toFixed(1)) }}
          selected={sel}
          onSelect={(row, col) => setSel({ row, col })}
        />
        <Text size="small" tone="tertiary">
          Score 1 (poor) to 5 (excellent); darker cells score higher. Base weights. Click a cell to read the rationale.
        </Text>
      </Stack>
      {selCrit && selTool ? (
        <Card>
          <CardHeader trailing={<Text size="small">{`${DATA.scores[selTool][selCrit.id].score} / 5`}</Text>}>
            {`${TOOL[selTool].short} · ${SHORT_CRITERION[selCrit.id]}`}
          </CardHeader>
          <CardBody>
            <Stack gap={10}>
              <Text>{DATA.scores[selTool][selCrit.id].why}</Text>
              <Divider />
              <Text size="small" tone="secondary">
                {`What the criterion measures (weight ${selCrit.weight}): ${selCrit.what}`}
              </Text>
            </Stack>
          </CardBody>
        </Card>
      ) : null}
    </Grid>
  );
}

function Gates() {
  const theme = useHostTheme();
  return (
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.6fr) repeat(5, minmax(110px, 1fr))",
          gap: "8px 12px",
          minWidth: 760,
          alignItems: "start",
        }}
      >
        <div style={{ fontSize: 12, color: theme.text.tertiary }}>Gate</div>
        {TOOL_IDS.map((t) => (
          <div key={t} style={{ fontSize: 12, color: theme.text.tertiary }}>
            {TOOL[t].short}
          </div>
        ))}
        {DATA.gates.map((g) => [
          <div key={g.id} style={{ fontSize: 13, color: theme.text.primary }}>
            <span style={{ fontWeight: 600 }}>{g.id}</span> {g.name}
          </div>,
          ...TOOL_IDS.map((t) => (
            <div key={`${g.id}-${t}`} title={g.results[t].note} style={{ fontSize: 13 }}>
              <GateBadge status={g.results[t].status} />
              <div style={{ fontSize: 11, color: theme.text.tertiary, marginTop: 2 }}>{g.results[t].note}</div>
            </div>
          )),
        ])}
      </div>
    </div>
  );
}

function ToolProfiles() {
  const [sel, setSel] = useCanvasState<ToolId>("profile", "odi");
  const t = TOOL[sel];
  const fitTone = sel === "odi" ? "success" : sel === "dbt" ? "info" : sel === "pwc" ? "danger" : "warning";
  return (
    <Stack gap={12}>
      <Row gap={8} wrap>
        {TOOL_IDS.map((id) => (
          <Pill key={id} active={sel === id} onClick={() => setSel(id)}>
            {TOOL[id].short}
          </Pill>
        ))}
      </Row>
      <Grid columns="minmax(0, 1.5fr) minmax(0, 1fr)" gap={20} align="start">
        <Stack gap={10}>
          <H3>{t.name}</H3>
          <Text tone="secondary">{`${t.version} · ${t.category}`}</Text>
          <Grid columns={2} gap={16} align="start">
            <Stack gap={4}>
              <Text size="small" weight="semibold">
                Strengths
              </Text>
              <Bullets items={t.strengths} />
            </Stack>
            <Stack gap={4}>
              <Text size="small" weight="semibold">
                Weaknesses
              </Text>
              <Bullets items={t.weaknesses} />
            </Stack>
          </Grid>
          <Callout tone={fitTone} title="Takasbank fit">
            {t.fit}
          </Callout>
        </Stack>
        <Card>
          <CardHeader trailing={<GateBadge status={gateOverall(sel)} />}>Deployable stack</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <Row gap={20}>
                <Stat value={weightedTotal(sel, BASE_WEIGHTS).toFixed(1)} label="Base score" />
                <Stat value={UC_AVG[sel].toFixed(2)} label="Use-case fit" />
                <Stat value={TCO_BAND[sel]} label="5-year TCO" />
              </Row>
              <Divider />
              <Text size="small" weight="semibold">
                Stack
              </Text>
              <Text size="small" tone="secondary">
                {t.stack}
              </Text>
              <Text size="small" weight="semibold">
                Licensing
              </Text>
              <Text size="small" tone="secondary">
                {t.licensing}
              </Text>
              <Text size="small" weight="semibold">
                Lifecycle
              </Text>
              <Text size="small" tone="secondary">
                {t.lifecycle}
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}

function Latency() {
  const rows: HeatRow[] = DATA.latency.map((l) => ({
    key: l.id,
    lead: [
      <span key="n">
        <span style={{ fontWeight: 600 }}>{l.id}</span> {l.name}
      </span>,
      <span key="e" style={{ fontSize: 12 }}>
        {l.example}
      </span>,
    ],
    scores: TOOL_IDS.map((t) => l.support[t].score),
    notes: TOOL_IDS.map((t) => l.support[t].note),
  }));
  return (
    <Stack gap={12}>
      <HeatTable leadHeaders={["Latency class", "Takasbank workload"]} leadTemplate="minmax(0, 1.3fr) minmax(0, 1.6fr)" rows={rows} />
      <Text size="small" tone="tertiary">
        Support score 1-5 per tool and latency class; hover a cell for the note.
      </Text>
      <Table
        headers={["Class", "Recommended pattern (tool-independent)"]}
        rows={DATA.latency.map((l) => [l.id, l.recommended])}
        columnAlign={["left", "left"]}
      />
      <Callout tone="info" title="Real-time conclusion">
        CDP and Spark win only on S0. Most S0 demand is current-state reads that a read-only ADG standby serves with no ETL tool;
        GoldenGate through ODI covers the rest per approved product. A streaming platform would be a second platform for the smallest
        slice of the workload. This depends on ADG licence and apply lag, tracked in Aktif Sorular item 14.1.
      </Callout>
    </Stack>
  );
}

function UseCases() {
  const rows: HeatRow[] = DATA.useCases.map((u) => ({
    key: u.id,
    lead: [
      <span key="n" title={u.detail}>
        <span style={{ fontWeight: 600 }}>{u.id}</span> {u.name}
      </span>,
    ],
    scores: TOOL_IDS.map((t) => u.scores[t]),
  }));
  return (
    <Grid columns="minmax(0, 1.5fr) minmax(0, 1fr)" gap={20} align="start">
      <Stack gap={8}>
        <HeatTable
          leadHeaders={["Use case"]}
          leadTemplate="minmax(0, 2fr)"
          rows={rows}
          footer={{ lead: ["Average"], values: TOOL_IDS.map((t) => UC_AVG[t].toFixed(2)) }}
        />
        <Text size="small" tone="tertiary">
          Fit 1-5 per Takasbank workload; hover a use case for its volumes. dbt's low UC3/UC5 scores are ingestion gaps, not SQL gaps.
        </Text>
      </Stack>
      <Stack gap={8}>
        <H3>Average use-case fit by tool</H3>
        <BarChart
          categories={TOOL_IDS.map((t) => TOOL[t].short)}
          series={[{ name: "Average fit (1-5)", data: TOOL_IDS.map((t) => UC_AVG[t]) }]}
          yMin={0}
          yMax={5}
          height={200}
          showValues
        />
        <Text size="small" tone="tertiary">
          Value axis: mean fit score across UC1-UC7 (1-5). Category axis: tool.
        </Text>
      </Stack>
    </Grid>
  );
}

function Tco() {
  return (
    <Stack gap={8}>
      <Table
        headers={["Driver", ...TOOL_IDS.map((t) => TOOL[t].short)]}
        rows={DATA.tco.map((d) => [d.driver, ...TOOL_IDS.map((t) => d[t])])}
        rowTone={DATA.tco.map((_, i) => (i === DATA.tco.length - 1 ? "info" : undefined))}
      />
      <Text size="small" tone="tertiary">
        Cost bands, not quotes. Real figures need vendor quotes; Oracle figures depend on the agent topology.
      </Text>
    </Stack>
  );
}

const RISK_FILTERS = ["All tools", "ODI", "PowerCenter", "dbt", "CDP", "Spark", "Cross-cutting"];

function Risks() {
  const [filter, setFilter] = useCanvasState<string>("riskFilter", "All tools");
  const list = DATA.risks.filter((r) =>
    filter === "All tools" ? true : filter === "Cross-cutting" ? r.tool === "All" : r.tool === filter,
  );
  return (
    <Stack gap={10}>
      <Row gap={8} wrap>
        {RISK_FILTERS.map((f) => (
          <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Pill>
        ))}
      </Row>
      <Table
        headers={["Tool", "Risk", "Likelihood", "Impact", "Mitigation"]}
        rows={list.map((r) => [r.tool === "All" ? "All tools" : r.tool, r.risk, r.likelihood, r.impact, r.mitigation])}
        rowTone={list.map((r) =>
          r.likelihood === "High" && r.impact === "High" ? "danger" : r.likelihood === "High" || r.impact === "High" ? "warning" : undefined,
        )}
      />
    </Stack>
  );
}

type FlowKind = "plain" | "odi" | "gg";
const FLOW_NODES: { id: string; label: string; sub: string }[] = [
  { id: "kale", label: "Kale prod", sub: "kale Exadata" },
  { id: "other", label: "ARSIV, ÇekDB, BIDB", sub: "other Oracle sources" },
  { id: "files", label: "FTP/CSV, EPİAŞ", sub: "files, web services" },
  { id: "adg", label: "Kale ADG standby", sub: "read-only, on sur" },
  { id: "ops", label: "Operational projection", sub: "proven S0 only" },
  { id: "lnd", label: "Landing", sub: "immutable, load_id" },
  { id: "izl", label: "Izleme screens", sub: "S0 current state" },
  { id: "core", label: "Integrated core", sub: "history, SCD2" },
  { id: "pub", label: "Published marts", sub: "report snapshots" },
  { id: "mstr", label: "MSTR, SPK/MASAK/BDDK", sub: "T-1 reporting" },
  { id: "verda", label: "Files to Borsa Verda", sub: "twice a day" },
];
const FLOW_EDGES: { from: string; to: string; kind: FlowKind }[] = [
  { from: "kale", to: "adg", kind: "plain" },
  { from: "kale", to: "ops", kind: "gg" },
  { from: "adg", to: "lnd", kind: "plain" },
  { from: "other", to: "lnd", kind: "plain" },
  { from: "files", to: "lnd", kind: "plain" },
  { from: "adg", to: "izl", kind: "plain" },
  { from: "ops", to: "izl", kind: "plain" },
  { from: "lnd", to: "core", kind: "odi" },
  { from: "core", to: "pub", kind: "odi" },
  { from: "pub", to: "mstr", kind: "plain" },
  { from: "pub", to: "verda", kind: "plain" },
];

function TargetPattern() {
  const theme = useHostTheme();
  const W = 168;
  const H = 42;
  const layout = useMemo(
    () =>
      computeDAGLayout({
        nodes: FLOW_NODES.map((n) => ({ id: n.id })),
        edges: FLOW_EDGES.map((e) => ({ from: e.from, to: e.to })),
        direction: "vertical",
        nodeWidth: W,
        nodeHeight: H,
        rankGap: 34,
        nodeGap: 20,
        padding: 12,
      }),
    [],
  );
  const pos = Object.fromEntries(layout.nodes.map((n) => [n.id, n]));
  const kindOf = (from: string, to: string): FlowKind => FLOW_EDGES.find((e) => e.from === from && e.to === to)?.kind ?? "plain";
  const strokeFor = (k: FlowKind) => (k === "odi" ? theme.accent.primary : theme.text.tertiary);
  const legend: { k: FlowKind; label: string }[] = [
    { k: "odi", label: "ODI pushdown SQL inside Exadata" },
    { k: "gg", label: "GoldenGate via ODI JKM, per approved product" },
    { k: "plain", label: "Reads and feeds (S0 reads, S1/S2 SCN pulls, S3 files)" },
  ];
  return (
    <Stack gap={8}>
      <H3>Target integration pattern (sources at top, consumers at bottom)</H3>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} style={{ width: "100%", maxWidth: layout.width, height: "auto" }}>
        <defs>
          <marker id="arrow-plain" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill={theme.text.tertiary} />
          </marker>
          <marker id="arrow-accent" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill={theme.accent.primary} />
          </marker>
        </defs>
        {layout.edges.map((e) => {
          const k = kindOf(e.from, e.to);
          const dy = e.targetY - e.sourceY;
          const d = `M${e.sourceX},${e.sourceY} C${e.sourceX},${e.sourceY + dy / 2} ${e.targetX},${e.targetY - dy / 2} ${e.targetX},${e.targetY - 2}`;
          return (
            <path
              key={`${e.from}-${e.to}`}
              d={d}
              fill="none"
              stroke={strokeFor(k)}
              strokeWidth={k === "odi" ? 2 : 1.2}
              strokeDasharray={k === "gg" ? "5 4" : undefined}
              markerEnd={k === "odi" ? "url(#arrow-accent)" : "url(#arrow-plain)"}
            />
          );
        })}
        {FLOW_NODES.map((n) => {
          const p = pos[n.id];
          if (!p) return null;
          const dwh = ["lnd", "core", "pub", "ops"].includes(n.id);
          return (
            <g key={n.id}>
              <rect
                x={p.x}
                y={p.y}
                width={W}
                height={H}
                rx={6}
                fill={dwh ? theme.fill.secondary : theme.bg.editor}
                stroke={dwh ? theme.accent.primary : theme.stroke.primary}
                strokeWidth={1}
              />
              <text x={p.x + W / 2} y={p.y + 18} textAnchor="middle" fontSize={12} fontWeight={600} fill={theme.text.primary}>
                {n.label}
              </text>
              <text x={p.x + W / 2} y={p.y + 33} textAnchor="middle" fontSize={10.5} fill={theme.text.tertiary}>
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
      <Row gap={16} wrap>
        {legend.map((l) => (
          <Row key={l.k} gap={6} align="center">
            <svg width={26} height={8}>
              <line
                x1={0}
                y1={4}
                x2={26}
                y2={4}
                stroke={strokeFor(l.k)}
                strokeWidth={l.k === "odi" ? 2 : 1.2}
                strokeDasharray={l.k === "gg" ? "5 4" : undefined}
              />
            </svg>
            <Text size="small" tone="secondary">
              {l.label}
            </Text>
          </Row>
        ))}
      </Row>
      <Text size="small" tone="tertiary">
        Boxes outlined in accent live in the DWH on Exadata. Automic starts the S2 chain from the gün sonu batch-control record, not a clock.
      </Text>
    </Stack>
  );
}

function Principles() {
  const items: [string, string][] = [
    ["One engine, SQL inside Exadata", "ODI generates set-based SQL; no data leaves Exadata to be transformed."],
    ["Never batch-read prod Kale", "S1 and S2 read the standby at a recorded SCN."],
    ["Immutable, replayable landing", "Every run carries a load_id, so replay and backfill need no manual fixes."],
    ["The event starts S2, not the clock", "Automic waits for the gün sonu batch-control record."],
    ["Real-time is the exception", "ADG serves S0 reads first; GoldenGate per product only with a proven SLA and DBA on-call."],
    ["Same shape for the dbt fallback", "If dbt wins the PoC it replaces only the landing-to-core and core-to-published steps."],
  ];
  return (
    <Stack gap={10}>
      {items.map(([title, body], i) => (
        <Stack key={title} gap={2}>
          <Text weight="semibold">{`${i + 1}. ${title}`}</Text>
          <Text size="small" tone="secondary">
            {body}
          </Text>
        </Stack>
      ))}
      <Divider />
      <Text size="small" weight="semibold">
        PoC decision rule
      </Text>
      <Text size="small" tone="secondary">
        ODI and dbt build the same pilot slices (SWIFT, intraday Fon, Borsa contracts and Verda files, 3 SPK reports, replay, restart,
        lineage, Automic event, security, CI). ODI is confirmed if it passes T1-T10 with no Fail. dbt replaces it only if it passes the
        same tests and its home-built ingestion costs less than the ODI licence over 5 years.
      </Text>
    </Stack>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <Stack gap={10}>
      <Stack gap={2}>
        <H2>{title}</H2>
        {sub ? (
          <Text size="small" tone="tertiary">
            {sub}
          </Text>
        ) : null}
      </Stack>
      {children}
    </Stack>
  );
}

export default function TakasbankEtlComparison() {
  return (
    <Stack gap={28} style={{ padding: 4 }}>
      <Stack gap={4}>
        <H1>no earlier work Takasbank ETL tool comparison</H1>
        <Text tone="secondary">
          {`Oracle Data Integrator, Informatica PowerCenter, dbt, Cloudera Data Platform and Apache Spark for the on-prem enterprise DWH with operational and real-time reporting. Vendor facts as of ${DATA.asOf}.`}
        </Text>
      </Stack>
      <Hero />
      <Section
        title="Re-weight the criteria"
        sub="Pick a scenario or drag the weights; the ranking recomputes live. Each tool is scored as the deployable stack it needs, including CDC and orchestration."
      >
        <WeightExplorer />
      </Section>
      <ScenarioChart />
      <Section title="Scoring matrix" sub="11 weighted criteria, scores 1-5 with a written rationale per cell.">
        <ScoringHeatmap />
      </Section>
      <Section title="Knock-out gates" sub="Checked before scoring. A Fail removes the tool regardless of score.">
        <Gates />
      </Section>
      <Section title="Tool profiles">
        <ToolProfiles />
      </Section>
      <Section title="Real-time and operational reporting by latency class" sub="The latency class is chosen per data product before the tool.">
        <Latency />
      </Section>
      <Section title="Use-case fit" sub="Seven real Takasbank workloads from the meeting notes.">
        <UseCases />
      </Section>
      <Section title="Risks and mitigations" sub="Red dot: high likelihood and high impact. Amber dot: one of the two is high.">
        <Risks />
      </Section>
      <Section title="Recommendation and target pattern">
        <Grid columns="minmax(0, 1.2fr) minmax(0, 1fr)" gap={24} align="start">
          <TargetPattern />
          <Principles />
        </Grid>
      </Section>
      <CollapsibleSection title="Five-year TCO drivers">
        <Tco />
      </CollapsibleSection>
      <Text size="small" tone="tertiary">
        Source of all numbers: outputs/etl-comparison-2026-10/comparison_data.py. Full write-up: Obsidian Vault/Kendi Notlarım/ETL Araç
        Karşılaştırması - Ekim 2026.md. Workbook: Takasbank-ETL-Comparison.xlsx.
      </Text>
    </Stack>
  );
}
