import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  computeDAGLayout,
  useCanvasState,
  useHostTheme,
  useMemo,
} from "cursor/canvas";
import type { CSSProperties, TableRowTone } from "cursor/canvas";

type Mode = ScenarioId | "custom";
type Score = [number, string];
type Criterion = { id: string; name: string; d: string; s: Record<ToolId, Score> };
type Category = { id: string; name: string; d: string; w: Record<ScenarioId, number>; c: Criterion[] };

type Rating = "Strong" | "Adequate" | "Gap";
type Level = "High" | "Medium" | "Low";
const LEVEL_VALUE: Record<Level, number> = { Low: 1, Medium: 2, High: 3 };
type Coverage = { label: string; cells: Record<ToolId, string>; green?: ToolId[]; red?: ToolId[] };

// <generated-data> Generated from data/etl_comparison.json by scripts/canvas_data.py. Do not edit by hand.
const DOC_VERSION = "2.7";
const DOC_DATE = "2026-11-12";

type ToolId = "odi" | "ipc" | "dbt" | "cdp" | "spark";
type ScenarioId = "baseline" | "realtime" | "ai" | "regulatory" | "portability" | "modern";
const TOOL_IDS: ToolId[] = ["odi", "ipc", "dbt", "cdp", "spark"];

const TOOLS: Record<ToolId, {
  short: string; name: string; version: string; type: string; architecture: string; execution: string;
  licence: string; strengths: string[]; weaknesses: string[]; bestFit: string; notSuited: string;
}> = {
  odi: {
    short: "ODI", name: "Oracle Data Integrator", version: "ODI 14c (14.1.2) / 12c (12.2.1.4)", type: "ELT integration tool (commercial)",
    architecture: "Declarative mappings stored in a master/work repository on Exadata; Java agents (standalone, colocated or WebLogic) orchestrate; Knowledge Modules generate native SQL executed inside Exadata.",
    execution: "ELT pushdown - transformation runs inside Exadata. Near-real-time via native GoldenGate integration (journalizing / CDC KMs).",
    licence: "Not covered by the Takasbank ULA - a new licence with a USD 1.5M purchase price and USD 330k annual support (USD 3.15M over 5 years, with support paid from the first year). ODI EE is normally licensed per processor (core factor) or Named User Plus plus annual support; the assumed fee holds only if Oracle does not count the Exadata target cores - obtain a written licensing position.",
    strengths: ["Best-in-class pushdown into Exadata (parallel DML, partition exchange, external tables)", "Native integration with the ULA-covered GoldenGate for low-latency ODS feeds", "Mature SCD2, constraint checking (CKM) and error-table patterns", "Runs the existing PL/SQL reports unchanged as ODI procedures and load-plan steps", "Strong Oracle Türkiye and partner ecosystem; vendor-supported"],
    weaknesses: ["New licence outside the ULA: USD 1.5M purchase and USD 330k annual support; the fee could rise if Oracle counts Exadata cores", "Mappings live in a proprietary repository, so the local LLM can help only through SDK/Groovy scripts", "Weak Git / CI-CD and automated testing compared with code-first tools", "Steep learning curve (topology, contexts, Knowledge Modules, load plans)", "Its advantages are Oracle-specific; a later move to PostgreSQL would leave a new Oracle licence with little value"],
    bestFit: "Vendor-supported, GUI-driven ELT into Exadata with native GoldenGate integration, if the EDW is expected to stay on Oracle.",
    notSuited: "AI-assisted, code-first development; sub-second stream processing; minimising new licence spend; a likely move to PostgreSQL.",
  },
  ipc: {
    short: "Informatica", name: "Informatica", version: "Informatica 10.5.x on-premises (PowerCenter product line; Salesforce-owned)", type: "Engine-based ETL tool (commercial)",
    architecture: "Domain with repository service, integration service and optional grid; GUI Designer/Workflow Manager; transformations executed in the Informatica engine, optional pushdown optimisation.",
    execution: "ETL in a dedicated engine, partitioned pipelines; CDC via Informatica PowerExchange (separately licensed) or by reading GoldenGate-replicated staging; limited real-time (JMS/MQ sessions).",
    licence: "Per core / edition with options (PowerExchange, Pushdown, HA, Grid) licensed separately; not covered by any existing agreement; vendor strategy is migration to cloud IDMC.",
    strengths: ["Most mature GUI ETL with very broad connectivity (mainframe, MQ, files, SWIFT, DBs)", "Robust restartability, error handling and operational tooling", "Large pool of experienced developers in Turkish banking", "Engine-based logic is database-neutral, so a later move to PostgreSQL mainly changes connections"],
    weaknesses: ["Strategic roadmap is cloud (IDMC); on-prem Informatica is in maintenance mode - verify support dates", "Generative AI (CLAIRE GPT / CLAIRE Copilot) exists only in cloud IDMC, not on-prem Informatica", "Highest licence cost; many capabilities are paid options", "Processes data in its own engine instead of Exadata unless pushdown is bought; existing PL/SQL reports gain little from it"],
    bestFit: "Existing Informatica estates and heterogeneous batch integration.",
    notSuited: "A new long-lived on-prem build; AI-assisted development; cost-sensitive programmes.",
  },
  dbt: {
    short: "dbt", name: "dbt Core (data build tool)", version: "dbt Core 1.x (OSS, Apache 2.0) with the Oracle-maintained dbt-oracle adapter", type: "SQL transformation framework (open source)",
    architecture: "CLI that compiles Jinja-templated SQL models into a DAG and runs them inside Exadata; code, tests and documentation in Git; orchestration by the in-house developer scheduler.",
    execution: "In-database ELT on Exadata. Oracle sources are landed by the ULA-covered GoldenGate into Exadata staging/ODS, files via Exadata external tables; dbt incremental models transform from there.",
    licence: "dbt Core is free (Apache 2.0). dbt Cloud is SaaS and not acceptable for on-prem / data residency. Budget for a support contract with a local SI.",
    strengths: ["SQL-first: every model is an Oracle SQL SELECT, so the team's SQL skills apply directly and the learning curve is short", "Plain-text SQL and YAML in Git is the format a local LLM generates, documents and reviews best, including converting PL/SQL reports into models", "All processing inside Exadata - no second compute platform; built-in tests, CI and docs", "Most portable option: the same project can later target PostgreSQL through the first-party dbt-postgres adapter", "No licence cost; reuses the ULA-covered GoldenGate and the existing Exadata"],
    weaknesses: ["No extraction or streaming of its own; depends on GoldenGate and Exadata external tables, and MQ/API sources need a loader", "No vendor support for dbt Core on-prem; a company in Türkiye provides dbt support, but it must be contracted to satisfy BDDK outsourcing expectations", "Existing PL/SQL procedures run only as hooks or scheduler steps beside the model DAG until they are refactored", "Relies on the in-house scheduler for calendars, cross-job dependencies and alerting, and needs a secrets vault; frequent releases need version pinning", "dbt-oracle lags the cloud adapters, and the new dbt Fusion engine does not support Oracle yet - verify"],
    bestFit: "Single ELT tool on Exadata, with GoldenGate landing source changes into staging and the ODS.",
    notSuited: "Sub-second stateful stream processing; teams expecting a vendor-supported GUI product.",
  },
  cdp: {
    short: "CDP", name: "Cloudera Data Platform (on-premises)", version: "Cloudera on-premises: Private Cloud Base 7.1.9-7.3.x, optional Private Cloud Data Services", type: "Integrated data platform (commercial distribution of OSS)",
    architecture: "On-prem cluster bundling HDFS/Ozone, Iceberg, Hive, Impala, Kudu, Spark, NiFi (CFM), Kafka (CSM), Flink (CSA), with SDX: Ranger, Atlas, Knox; managed by Cloudera Manager.",
    execution: "Batch with Spark/Hive, ingestion with NiFi, streaming with Kafka + Flink / Spark Structured Streaming. Results are loaded into Exadata over JDBC, or served from Impala/Kudu.",
    licence: "Annual subscription per node / compute capacity; includes enterprise support. Hardware for a separate cluster at both sites comes on top of Exadata.",
    strengths: ["Only option with supported sub-second stream processing on-prem (Kafka + Flink)", "SDX security: Kerberos, Ranger RBAC/ABAC, masking, row filters, central audit", "Code-first SQL (Hive, Impala, Spark SQL, Flink SQL) suits AI assistance; Cloudera AI can host models on-prem", "Atlas lineage across NiFi, Hive, Spark, Impala"],
    weaknesses: ["With Exadata as the EDW, CDP is a second large platform and transformations run outside Exadata", "Highest combined subscription and hardware cost", "SQL dialects differ from Oracle; the existing PL/SQL reports must be rewritten", "Needs a dedicated platform team; steepest learning curve and highest maintenance effort"],
    bestFit: "Real-time and big-data workloads where sub-second streaming is a hard requirement.",
    notSuited: "A single ELT tool for an Exadata EDW; teams without platform engineering capacity.",
  },
  spark: {
    short: "Spark", name: "Apache Spark (open source)", version: "Apache Spark 4.x on Kubernetes or YARN (on-prem)", type: "Distributed compute engine (open source)",
    architecture: "Engine only - requires a cluster manager (Kubernetes/YARN), storage (S3-compatible/HDFS/Iceberg), an orchestrator, a metastore/catalog and security integration.",
    execution: "Batch DataFrame/SQL processing and Structured Streaming in Scala, Python, SQL; results written to Exadata over JDBC.",
    licence: "Free (Apache 2.0); cost is engineering, infrastructure and optional third-party support.",
    strengths: ["Highest scalability and flexibility for complex logic (risk, netting, simulations)", "Unified batch and streaming APIs", "Code in Git is LLM-friendly", "No licence cost and no vendor lock-in"],
    weaknesses: ["Not a product: security, governance, lineage, monitoring are DIY", "No vendor support - a concern for BDDK/SPK critical systems", "Processes data outside Exadata and needs its own cluster", "Production pipelines usually need PySpark/Scala, not only SQL; PL/SQL reports must be rewritten"],
    bestFit: "Custom high-volume or streaming computation built by a strong engineering team.",
    notSuited: "A SQL team building a supported, governed EDW on Exadata.",
  },
};

const SCENARIOS: { id: ScenarioId; name: string; d: string }[] = [
  { id: "baseline", name: "Takasbank Baseline", d: "Single tool on the existing Exadata, with AI adoption and SQL-team fit weighted as stated decision criteria, balanced against batch, real-time and regulatory needs." },
  { id: "realtime", name: "Real-time first", d: "Sub-second margin, collateral and settlement monitoring is the primary driver." },
  { id: "ai", name: "AI and SQL productivity first", d: "Using the local LLM and the team's SQL skills to deliver faster dominates the decision." },
  { id: "regulatory", name: "Regulatory and vendor support first", d: "Security controls, vendor support contracts and operability dominate, as for a conservative supervisory view." },
  { id: "portability", name: "Portability first (future PostgreSQL)", d: "A move of the EDW from Exadata to PostgreSQL within the tool's lifetime is likely, so portability and avoiding Oracle lock-in dominate." },
  { id: "modern", name: "Modern data stack", d: "Modernity of the tooling dominates: AI-assisted engineering with the local LLM, Git-native development with CI/CD and automated tests, code-first and open tooling, lineage and documentation generated from code, and an active ecosystem. On-prem constraints, Oracle-specific fit and vendor support carry less weight." },
];

const CATS: Category[] = [
  { id: "BATCH", name: "Batch ETL/ELT capability", d: "Loading and transforming large daily/T+1 volumes into the Exadata EDW.", w: { baseline: 13, realtime: 5, ai: 6, regulatory: 8, portability: 7, modern: 5 }, c: [
    { id: "B1", name: "Source connectivity breadth", d: "Oracle, MSSQL, DB2/mainframe, flat files, MQ, SWIFT/ISO 20022 files, APIs.", s: { odi: [4, "Broad JDBC/file/JMS technologies via KMs; mainframe needs extra adapters."], ipc: [5, "Widest catalogue incl. PowerExchange for mainframe/MQ; proven in banks."], dbt: [2, "No extractors of its own."], cdp: [4, "NiFi offers 300+ processors plus Kafka Connect; output must still be loaded into Exadata."], spark: [3, "JDBC and file sources; anything else is custom code."] } },
    { id: "B2", name: "Set-based pushdown into Exadata", d: "Execute transformations inside the EDW engine to exploit Exadata parallelism.", s: { odi: [5, "ELT by design; KMs generate native Oracle SQL incl. parallel DML."], ipc: [3, "Pushdown Optimisation is a paid option with partial coverage."], dbt: [5, "Every model compiles to Oracle SQL executed inside Exadata."], cdp: [2, "Transformations run on the Cloudera cluster; Exadata only receives the results."], spark: [2, "Processes data in its own engine; only predicate pushdown via JDBC."] } },
    { id: "B3", name: "High-volume batch throughput", d: "End-of-day settlement, position and trade volumes (100M+ rows/day).", s: { odi: [4, "Throughput scales with Exadata; agent is not a bottleneck."], ipc: [4, "Partitioning and grid scale well but need dedicated hardware."], dbt: [4, "As fast as Exadata executes the SQL."], cdp: [4, "Cluster scales horizontally, but loading results into Exadata over JDBC is the bottleneck."], spark: [4, "Scales horizontally; JDBC writes into Exadata are the bottleneck."] } },
    { id: "B4", name: "EDW patterns (SCD2, merge, surrogate keys)", d: "History tracking, incremental loads, late-arriving data, bitemporal needs.", s: { odi: [5, "Built-in SCD2, incremental update and merge IKMs."], ipc: [5, "Mature SCD wizards and lookup caching."], dbt: [4, "Snapshots and incremental merge models; bitemporal needs macros."], cdp: [3, "Iceberg MERGE available; patterns are hand-coded."], spark: [3, "Iceberg MERGE; everything hand-coded."] } },
    { id: "B5", name: "Restartability and error handling", d: "Restart from failure point, reject handling, reconciliation after aborted EOD runs.", s: { odi: [4, "Load Plan restart and CKM error tables."], ipc: [5, "Session recovery, reject files and workflow restart are good."], dbt: [3, "Model-level 'dbt retry'; reject handling is custom (DML error logging macros)."], cdp: [4, "Checkpointing and orchestrator retries; per-job design."], spark: [3, "Checkpointing exists; restart logic is custom."] } },
  ] },
  { id: "CDC", name: "CDC and real-time ingestion", d: "Capturing changes from core systems with low latency and minimal source impact, using GoldenGate (ULA-covered for Oracle sources) where possible, and handling batch and streaming in one design.", w: { baseline: 8, realtime: 28, ai: 9, regulatory: 7, portability: 11, modern: 6 }, c: [
    { id: "C1", name: "Log-based CDC from Oracle and non-Oracle sources", d: "Redo-log and transaction-log capture without triggers or source performance impact, from Oracle and from MSSQL, DB2 and other non-Oracle sources. GoldenGate for Oracle sources is in the ULA; GoldenGate for non-Oracle sources is not, but can be added to the package.", s: { odi: [1, "Needs GoldenGate."], ipc: [4, "PowerExchange CDC covers Oracle, DB2, mainframe and MSSQL natively, but is a separate Informatica licence; can also read GoldenGate-replicated staging."], dbt: [1, "Needs GoldenGate."], cdp: [4, "Debezium reads the Oracle redo logs and the non-Oracle source logs into Kafka under the Cloudera subscription, so no GoldenGate is needed; GoldenGate for Distributed Applications and Analytics, with the add-on for non-Oracle sources, remains an alternative (confirm ULA coverage and supported connectors)."], spark: [2, "Needs an external CDC tool feeding Kafka, such as self-supported Debezium or GoldenGate with the non-Oracle add-on; self-supported."] } },
    { id: "C2", name: "Event streaming and message ingestion", d: "Kafka/MQ topics from trading, clearing and payment systems.", s: { odi: [2, "JMS KMs only; no native stream processing."], ipc: [4, "Real-time sessions read JMS, IBM MQ and Kafka through PowerExchange adapters (separately licensed); no stream processing of its own."], dbt: [1, "Needs GoldenGate."], cdp: [5, "Kafka, NiFi and Flink included and supported."], spark: [4, "Structured Streaming consumer; broker is separate and self-supported."] } },
    { id: "C3", name: "Unified batch + streaming design", d: "One codebase/semantics for both batch and real-time (Kappa/Lambda).", s: { odi: [2, "Separate batch and GoldenGate paths."], ipc: [2, "Separate batch and real-time sessions."], dbt: [2, "Batch and micro-batch only."], cdp: [5, "Spark and Flink unify batch and streaming."], spark: [5, "Same DataFrame API for batch and streaming."] } },
  ] },
  { id: "META", name: "Metadata, lineage and data quality", d: "Lineage for regulatory reports, impact analysis, data quality.", w: { baseline: 4, realtime: 3, ai: 4, regulatory: 6, portability: 4, modern: 8 }, c: [
    { id: "M1", name: "Lineage and impact analysis", d: "Report-to-source lineage, change impact.", s: { odi: [4, "Repository lineage and impact analysis."], ipc: [4, "Metadata Manager/EDC (separately licensed)."], dbt: [4, "Model DAG lineage; column-level via OpenLineage-type tooling."], cdp: [4, "Atlas captures lineage automatically across services."], spark: [2, "OpenLineage add-on required."] } },
    { id: "M2", name: "Data quality rules and reconciliation", d: "Validation, reconciliation of control totals.", s: { odi: [3, "CKM constraint checks with error tables; no built-in control-total reconciliation, and EDQ is separate."], ipc: [4, "Basic in Informatica; IDQ separate."], dbt: [5, "Built-in data tests and unit tests."], cdp: [3, "No native DQ engine; Great Expectations/Deequ."], spark: [3, "Deequ/Great Expectations libraries."] } },
    { id: "M3", name: "Catalogue and business glossary", d: "Business terms linked to technical assets.", s: { odi: [3, "Needs external catalogue."], ipc: [4, "Axon/EDC (separate products)."], dbt: [3, "Docs site with descriptions; no glossary."], cdp: [4, "Atlas glossary and classifications."], spark: [2, "Needs external catalogue."] } },
    { id: "M4", name: "Automatic documentation", d: "Generated, always-current technical docs.", s: { odi: [2, "Documentation only through repository reports; nothing is generated and kept current from the code."], ipc: [3, "Repository reports."], dbt: [5, "dbt docs generated from code."], cdp: [3, "Atlas entities; not documentation."], spark: [2, "Manual."] } },
  ] },
  { id: "SEC", name: "Security and regulatory compliance", d: "KVKK, SPK VII-128.9, BDDK information-systems controls.", w: { baseline: 8, realtime: 9, ai: 8, regulatory: 17, portability: 8, modern: 4 }, c: [
    { id: "S1", name: "Authentication and authorisation", d: "LDAP/AD, Kerberos, RBAC, least privilege.", s: { odi: [5, "OPSS/LDAP integration and ODI security profiles."], ipc: [5, "LDAP and granular repository permissions."], dbt: [2, "No RBAC of its own; relies on Exadata roles and Git permissions."], cdp: [5, "Kerberos, Knox SSO, Ranger RBAC/ABAC."], spark: [2, "DIY Kerberos/Ranger/K8s RBAC integration."] } },
    { id: "S2", name: "Masking and KVKK personal-data controls", d: "Dynamic masking, row filtering, anonymised non-production copies.", s: { odi: [3, "Relies on Oracle Data Redaction/VPD (DB options)."], ipc: [4, "Masking inside mappings and transformations; Persistent Data Masking for non-production copies is a separately licensed product."], dbt: [3, "Masking macros and Exadata policies; no central engine."], cdp: [5, "Ranger tag-based masking and row filters with Atlas classifications."], spark: [2, "Custom implementation."] } },
    { id: "S3", name: "Audit trail and segregation of duties", d: "Change and execution logs, dev/test/prod separation for audit.", s: { odi: [5, "Repository versioning, execution logs, separate work repositories."], ipc: [5, "Repository versioning, deployment groups, session logs."], dbt: [4, "Git provides full change history; access audit relies on Exadata. dbt also provides all logs as artifacts which can be used for auditing."], cdp: [5, "Centralised Ranger audit plus Atlas."], spark: [2, "Must be engineered."] } },
    { id: "S4", name: "Encryption in transit and at rest", d: "TLS everywhere, TDE, key management.", s: { odi: [4, "TLS and Oracle TDE."], ipc: [4, "TLS and secure repository."], dbt: [4, "Inherits Exadata encryption."], cdp: [5, "Auto-TLS, HDFS/Ozone encryption zones, Ranger KMS."], spark: [3, "Supported but must be configured end to end."] } },
    { id: "S5", name: "Vulnerability and patch management", d: "Vendor security patch cadence and supply-chain assurance.", s: { odi: [4, "Quarterly Oracle Critical Patch Updates."], ipc: [3, "Patches for 10.5.x; roadmap focus shifted to cloud."], dbt: [3, "OSS dependency tree needs SCA scanning."], cdp: [4, "Certified, patched builds from Cloudera."], spark: [3, "Community releases; self-patching."] } },
    { id: "S6", name: "Vendor support contract and SLAs", d: "Contracted vendor or partner support with SLAs for a critical service, as BDDK outsourcing rules expect.", s: { odi: [5, "Oracle support contract with severity-based response targets."], ipc: [5, "Informatica support contract with severity-based SLAs."], dbt: [2, "No vendor contract for dbt Core; SLAs only through a contract with the Turkish dbt support company."], cdp: [4, "Cloudera subscription includes support with SLAs; vendor support is remote."], spark: [1, "No vendor; SLAs only by buying third-party support."] } },
  ] },
  { id: "OPS", name: "Operations and maintenance", d: "Availability, DR site, monitoring and scheduling, and the ongoing effort to keep the platform and the pipeline estate running and changing over the EDW's life. Higher score = more resilient and less effort.", w: { baseline: 10, realtime: 11, ai: 9, regulatory: 12, portability: 10, modern: 7 }, c: [
    { id: "H1", name: "Runtime high availability", d: "No single point of failure in ETL runtime.", s: { odi: [5, "Multiple agents, load balancing, WebLogic cluster."], ipc: [5, "HA/Grid options (separately licensed)."], dbt: [4, "Stateless; HA delegated to the scheduler."], cdp: [5, "Native HA across HDFS, YARN, Kafka, Flink."], spark: [4, "HA via Kubernetes/YARN."] } },
    { id: "H2", name: "DR site support", d: "Primary/secondary site operation required by BDDK and SPK.", s: { odi: [5, "Repository on Exadata with Data Guard."], ipc: [5, "Repository DB replication and standby domain."], dbt: [4, "Code in Git; redeployable at the DR site."], cdp: [4, "Replication Manager and Streams Replication Manager."], spark: [3, "DIY replication of storage and state."] } },
    { id: "H3", name: "Monitoring and alerting", d: "Integration with operations centre tooling.", s: { odi: [4, "ODI Console and Enterprise Manager plug-in."], ipc: [5, "Workflow Monitor and operational insights."], dbt: [3, "Several open-source packages (for example Elementary and dbt_artifacts) turn run artefacts into monitoring and alerting; job alerts come from the scheduler."], cdp: [5, "Cloudera Manager with metrics and alerts."], spark: [3, "Spark UI plus Prometheus/Grafana engineering."] } },
    { id: "H4", name: "Scheduling and orchestration", d: "Dependencies, calendars, retries and alerting, with the in-house developer scheduler as the primary scheduler.", s: { odi: [5, "Load Plans give native dependencies and restart; the in-house scheduler starts scenarios from the command line or REST, so ODI's own scheduler goes unused."], ipc: [5, "Workflows give native dependencies and restart; the in-house scheduler starts them with pmcmd, so Informatica's own scheduler goes unused."], dbt: [3, "dbt resolves flow dependencies itself and can run them, but it cannot schedule, alert or retry automatically."], cdp: [3, "Oozie or Airflow are included but would duplicate the in-house scheduler, which must start and track jobs across several services."], spark: [3, "The in-house scheduler can start jobs with spark-submit or Livy, but cross-job dependencies and restart logic are custom."] } },
    { id: "H5", name: "Platform upkeep", d: "Servers, services, patching and upgrades the tool itself needs.", s: { odi: [3, "Agents, WebLogic if used, repository upgrades and quarterly CPUs; major upgrades (12c to 14c) need a repository migration."], ipc: [2, "Domain, services, repository database and hotfixes; upgrades are projects in their own right."], dbt: [4, "A pinned Python environment and adapter on a few runner VMs; nothing else to patch."], cdp: [1, "Large multi-service cluster with rolling upgrades and continuous tuning."], spark: [2, "Cluster, storage, catalogue and container images to maintain."] } },
    { id: "H6", name: "Changing pipelines and impact analysis", d: "Effort to change logic safely across the estate (~1,500 models, ~200 reports).", s: { odi: [3, "Repository impact analysis helps, but each mapping is edited by hand in the GUI."], ipc: [3, "Impact analysis exists; edits are made object by object in the GUI."], dbt: [5, "Search-and-refactor in code, state-based selection of changed models and CI on everything downstream; the local LLM drafts changes."], cdp: [2, "Code can be refactored, but logic is spread across several engines."], spark: [1, "Code refactoring; regression tests must be written."] } },
    { id: "H7", name: "Operational support", d: "Handling failures, reruns and data fixes during EOD and intraday runs.", s: { odi: [4, "Operator console and restartable load plans."], ipc: [4, "Workflow Monitor and session recovery."], dbt: [3, "dbt retry and idempotent models; logs surface through the scheduler."], cdp: [2, "Failures span several services and teams."], spark: [2, "Custom monitoring and restart logic."] } },
    { id: "H8", name: "Upgrade and compatibility churn", d: "How often upgrades force changes to pipelines.", s: { odi: [4, "Infrequent major releases, certified by Oracle."], ipc: [3, "Stable on-prem releases, but future versions are cloud-oriented."], dbt: [3, "Frequent dbt Core releases, the adapter can lag, and the Fusion transition must be watched; pin versions."], cdp: [2, "Component version matrix and platform upgrades every one to two years."], spark: [3, "Frequent releases; API changes between major versions."] } },
    { id: "H9", name: "Infrastructure footprint and complexity", d: "Number of servers/services to run.", s: { odi: [3, "Agents, Studio clients and a repository schema on Exadata to operate and patch."], ipc: [3, "Domain, repository and integration services, grid nodes."], dbt: [5, "Lightweight CLI plus scheduler."], cdp: [3, "Multi-service cluster, but Cloudera Manager gives one management plane for install and upgrade."], spark: [2, "Kubernetes or YARN, storage, catalog and orchestrator all have to be built and run in-house."] } },
  ] },
  { id: "EXA", name: "Exadata and Oracle estate fit", d: "Alignment with the existing Exadata EDW target and the Oracle estate.", w: { baseline: 5, realtime: 5, ai: 4, regulatory: 7, portability: 2, modern: 2 }, c: [
    { id: "O1", name: "Native Exadata feature use", d: "Partition exchange, parallel DML, external tables, HCC compression, Smart Scan-friendly SQL.", s: { odi: [5, "Oracle-specific KMs use all of these."], ipc: [4, "Good Oracle connectivity; bulk mode and pushdown."], dbt: [3, "dbt-oracle covers merge/append incremental and snapshots; partition exchange and parallel DML need macros or hooks."], cdp: [2, "JDBC-level integration only."], spark: [2, "JDBC-level integration only."] } },
    { id: "O3", name: "Runs on Exadata without a second compute platform", d: "Uses the Exadata investment instead of adding new processing infrastructure.", s: { odi: [5, "Only lightweight agents; all processing in Exadata."], ipc: [4, "Runs either in its own engine on application servers or inside Exadata through Pushdown Optimisation (a paid option); neither needs a second data platform, and Exadata stays the only data store."], dbt: [5, "Only a CLI runner; all processing in Exadata."], cdp: [1, "Separate multi-node cluster at both sites; Exadata becomes only a target."], spark: [2, "Separate Kubernetes/YARN cluster and storage."] } },
  ] },
  { id: "MIGR", name: "Migration effort: converting PL/SQL report queries", d: "Effort to convert the existing PL/SQL report queries into the tool's pipelines and prove they return the same results, and how well the tool runs the unconverted reports in the meantime. Higher score means less effort. The person-day estimate is on the TCO sheet.", w: { baseline: 9, realtime: 6, ai: 8, regulatory: 7, portability: 7, modern: 5 }, c: [
    { id: "G1", name: "Report SQL convertibility to the target ETL tool", d: "How readily each report's SQL (joins, analytic functions, Oracle built-ins, hints) converts into the tool's own mappings, jobs or models.", s: { odi: [3, "Still runs on Exadata, so Oracle functions work, but each query is broken into mapping components or pasted into a procedure where ODI cannot see it."], ipc: [2, "Each report has to be rebuilt as a graphical mapping in the Designer (Source Qualifier, Joiner, Expression, Aggregator, Lookup). Oracle analytic functions, CONNECT BY, (+) outer joins, DECODE and hints have no direct equivalent and are re-expressed in the Informatica expression language, so little of the SQL carries over in a graphical rebuild. A SQL override in the Source Qualifier can keep a report's query as it is, because it still runs on Oracle, but it hides the logic from the graphical design."], dbt: [5, "Each report SELECT becomes a model almost verbatim; Oracle functions, analytics and hints keep working because it still runs on Exadata."], cdp: [2, "Spark SQL and Hive accept standard SELECTs, joins and many analytic functions, so part of each query carries over, but Oracle functions, CONNECT BY, (+) outer joins, DECODE, date arithmetic and hints must be rewritten."], spark: [2, "As for Cloudera: Spark SQL takes standard SELECTs, but Oracle-specific functions and syntax must be rewritten, or the logic moved into PySpark."] } },
    { id: "G2", name: "Procedural PL/SQL logic", d: "Converting cursors, loops, temporary tables, dynamic SQL and exception handling into set-based pipelines.", s: { odi: [3, "Procedural steps either stay as ODI procedures (still PL/SQL) or are redesigned by hand as mappings and packages."], ipc: [2, "Cursor and loop logic has to be redesigned by hand as graphical mappings and workflows (lookups, routers, update strategies, mapplets). There is no procedural construct, so dynamic SQL, temporary tables and exception handling become workflow design and reusable components."], dbt: [3, "Models have no procedural control flow: loops become set-based SQL and temporary tables become intermediate models; leftovers stay as macros or scheduler steps."], cdp: [2, "Rewrite in Spark SQL or Python; PL/SQL transaction and exception semantics do not carry over."], spark: [2, "As for Cloudera."] } },
    { id: "G3", name: "LLM-assisted conversion", d: "Use the local LLM to translate PL/SQL report logic into the tool's format, with output a reviewer can read and diff.", s: { odi: [2, "The LLM can explain PL/SQL, but the target is GUI mappings, so conversion stays manual."], ipc: [1, "Same as ODI, with no on-prem AI support."], dbt: [5, "Text-to-text conversion from PL/SQL to SQL models plus tests and YAML docs; reviewed in pull requests and proven by parity tests."], cdp: [3, "The LLM can translate to Spark SQL, but dialect and procedural differences need heavy review."], spark: [3, "The LLM can translate to PySpark or Spark SQL; heavy review needed."] } },
    { id: "G4", name: "Parity testing of converted reports", d: "Prove that each converted report returns the same results as the PL/SQL original.", s: { odi: [3, "ODI has a test framework, so parity checks can be automated inside the tool. The old PL/SQL output and the new mapping output still have to be compared with comparison tests built per report, which is less direct than dbt."], ipc: [3, "Informatica has a test framework (for example Data Validation Option, a separately licensed add-on) that compares source and target tables and reports differences. Comparison tests still have to be built per report, so it is less direct than dbt."], dbt: [5, "Old and new outputs sit in the same Exadata database, so dbt tests and comparison macros check them on every parallel run."], cdp: [2, "Outputs live on two platforms, so reconciliation needs cross-platform jobs."], spark: [2, "As for Cloudera; comparisons are custom code."] } },
    { id: "G5", name: "Report-by-report cut-over and rollback", d: "Switch one converted report at a time while the rest keep running, and fall back to the PL/SQL original if needed.", s: { odi: [4, "Load plans mix procedures and mappings, so each report is switched in one place, and the PL/SQL original stays callable as a procedure step, so rollback is a switch back."], ipc: [3, "Workflows can swap a procedure call for a mapping per report, and the original call stays in the workflow for rollback. Each switch is promoted between environments as a deployment group, so it is a release step."], dbt: [5, "One model per report; the scheduler step changes and the PL/SQL original stays available for rollback."], cdp: [2, "Each cut-over moves logic and data to another platform, and results must be written back to Exadata for BI. Rollback means pointing BI back at the PL/SQL output, which works only while the original keeps running in parallel."], spark: [2, "As for Cloudera."] } },
    { id: "G6", name: "Run existing PL/SQL reports unchanged", d: "Call and orchestrate the current PL/SQL packages and procedures from day one, with restart and logging.", s: { odi: [5, "ODI procedures and load-plan steps call PL/SQL natively on Exadata, with restart, logging and operator monitoring."], ipc: [3, "Stored Procedure transformation or pre/post-session SQL; the engine adds little around the call."], dbt: [3, "Callable through hooks, run-operation or a custom materialisation, or as scheduler steps beside dbt; the procedures sit outside the model DAG."], cdp: [2, "Procedures stay on Exadata and can only be triggered over JDBC from the cluster or the scheduler."], spark: [1, "Procedures can only be triggered over JDBC; the tool adds nothing."] } },
  ] },
  { id: "PORT", name: "Portability to a future PostgreSQL EDW", d: "Effort and risk if the EDW target later moves from Exadata to PostgreSQL (community, Citus or an Oracle-compatible distribution such as EDB).", w: { baseline: 3, realtime: 3, ai: 4, regulatory: 3, portability: 12, modern: 5 }, c: [
    { id: "F1", name: "PostgreSQL supported as the EDW target", d: "Native, supported ability to run the same pipelines against PostgreSQL.", s: { odi: [2, "Mostly designed with Oracle in mind: PostgreSQL works only through generic SQL KMs, and the Oracle-optimised KMs (partition exchange, parallel DML) have no PostgreSQL equivalent."], ipc: [5, "Fully supported target; the logic runs in the engine, so the target database does not change it."], dbt: [5, "dbt-postgres is a mature first-party adapter maintained by dbt Labs."], cdp: [4, "Writes to PostgreSQL over JDBC; transformations stay on the cluster."], spark: [4, "Writes to PostgreSQL over JDBC."] } },
    { id: "F2", name: "Effort to convert pipeline code", d: "Work needed to change Oracle-specific pipeline logic for PostgreSQL.", s: { odi: [2, "Logical mappings survive, but Oracle-specific expressions and KMs are changed mapping by mapping in the GUI."], ipc: [4, "Logic runs in the engine; only SQL overrides and pushdown change."], dbt: [4, "Models are written in the Oracle dialect (NVL, DECODE, CONNECT BY, MERGE, date functions); conversion can be done with the local LLM and tools such as SQLGlot, plus cross-database macros."], cdp: [4, "Logic is already in Spark or Flink SQL; only the sinks change."], spark: [4, "Logic is already in Spark; only the sinks change."] } },
    { id: "F3", name: "Proving parity during the move", d: "Show that every report returns the same results on the new target.", s: { odi: [3, "Built-in testing features, so parity checks between the old and new targets can be automated inside the tool; comparison tests are still built per report."], ipc: [3, "Built-in testing features (Data Validation Option, a separately licensed add-on) compare tables on the old and new targets and report differences; comparison tests are still built per report."], dbt: [3, "dbt tests and comparison macros run against both targets, but they are also written in the Oracle dialect and must be converted with the models; comparison tests are still built per report."], cdp: [3, "Per-engine test frameworks."], spark: [3, "pytest-based comparisons."] } },
    { id: "F4", name: "Tool stays strategic after leaving Oracle", d: "Value of the tool investment once the EDW is no longer on Oracle.", s: { odi: [2, "Works with PostgreSQL, but its main advantages are Oracle-specific; a new Oracle licence bought before leaving Oracle is hard to justify."], ipc: [4, "Database-neutral, so the investment carries over to PostgreSQL; the on-prem roadmap risk remains."], dbt: [5, "Database-neutral; PostgreSQL is one of its most widely used targets."], cdp: [4, "Database-neutral, but still a second platform."], spark: [5, "Database-neutral."] } },
    { id: "F5", name: "Moving PL/SQL report logic off Oracle", d: "How much of the existing PL/SQL report estate is already portable when the move starts.", s: { odi: [2, "Reports kept as ODI procedures stay PL/SQL and must be rewritten in PL/pgSQL."], ipc: [2, "Stored-procedure logic must be rewritten in PL/pgSQL."], dbt: [4, "Reports already refactored into dbt models move with the project; the remaining PL/SQL must be rewritten or run on an Oracle-compatible PostgreSQL such as EDB - verify."], cdp: [3, "Reports rewritten to Spark SQL are already target-independent, but that rewrite is the up-front cost."], spark: [3, "As for Cloudera."] } },
  ] },
  { id: "TEAM", name: "Fit with a SQL-strong team", d: "How directly the team's strong SQL skills turn into delivered pipelines.", w: { baseline: 8, realtime: 4, ai: 9, regulatory: 4, portability: 6, modern: 5 }, c: [
    { id: "Q1", name: "Pipelines are written in SQL", d: "Share of pipeline logic the team writes as SQL rather than GUI objects or general-purpose code.", s: { odi: [3, "Mappings are designed in a GUI; SQL appears in expressions, filters and procedures, and KMs generate the rest."], ipc: [2, "GUI transformations with Informatica's expression language; SQL only in overrides."], dbt: [5, "Every model is a SQL SELECT; Jinja is used only for reuse."], cdp: [4, "Hive/Impala, Spark SQL and Flink SQL cover most work; some Python/Scala and NiFi flows."], spark: [3, "Spark SQL is available, but production pipelines usually need PySpark or Scala."] } },
    { id: "Q2", name: "Reuse of Oracle SQL skills and DBA know-how", d: "Oracle SQL, tuning and DBA knowledge carry over unchanged.", s: { odi: [5, "Generates and runs Oracle SQL on Exadata; existing tuning knowledge applies."], ipc: [3, "Separate engine; Oracle SQL only in overrides and pushdown."], dbt: [5, "Models are Oracle SQL executed on Exadata; existing tuning knowledge applies."], cdp: [2, "HiveQL/Impala/Spark SQL dialects and cluster tuning differ from Oracle."], spark: [2, "Spark SQL dialect and Spark tuning differ from Oracle."] } },
  ] },
  { id: "LEARN", name: "Learning curve", d: "Effort for the current SQL-strong team to become productive, then proficient, and how fast they build and change pipelines once they are. Higher score = shorter learning curve and faster delivery.", w: { baseline: 7, realtime: 6, ai: 8, regulatory: 4, portability: 6, modern: 9 }, c: [
    { id: "N1", name: "New concepts beyond SQL", d: "How much the team must learn that it does not already know.", s: { odi: [2, "Topology, logical and physical schemas, contexts, models, Knowledge Modules, load plans and agents."], ipc: [3, "Mappings, sessions, workflows, transformation types and the expression language; intuitive GUI."], dbt: [4, "ref/source, materialisations, Jinja macros, YAML tests, Git and the CLI."], cdp: [1, "HDFS/Ozone, Iceberg, Hive, Impala, Spark, NiFi, Kafka, Flink, Ranger, Atlas and Kerberos."], spark: [2, "Distributed execution, partitioning, PySpark or Scala and cluster tuning."] } },
    { id: "N2", name: "Time to productivity and proficiency", d: "How quickly existing staff deliver their first production pipeline, then master performance tuning and advanced patterns.", s: { odi: [4, "Simple mappings in weeks because the logic is still SQL on Exadata; writing or customising KMs remains a specialist skill."], ipc: [3, "Simple mappings in weeks, but with a new GUI and expression language; partitioning, caching and pushdown tuning need experience."], dbt: [5, "SQL developers are productive within weeks; Git and Jinja are the main new skills, and advanced macros, incremental strategies and Oracle hints build on SQL the team already knows."], cdp: [3, "Hive and Impala let SQL developers start quickly, but several components must be learned before the first supported pipeline, and tuning spans several engines and the cluster."], spark: [2, "Distributed-systems and programming skills are needed before the first pipeline, and Spark tuning (shuffles, skew, memory) is a specialist skill."] } },
    { id: "N3", name: "Training, community and LLM help", d: "Courses, documentation, community answers, and how much the local LLM already knows about the tool.", s: { odi: [3, "Oracle University and documentation; small online community; LLMs know little ODI."], ipc: [4, "Informatica University and a large body of material; LLMs know the concepts but not the repository format."], dbt: [5, "Free official courses, extensive docs and a very large community; LLMs are trained on a lot of public dbt code."], cdp: [3, "Cloudera training; component communities are fragmented."], spark: [4, "Abundant courses and community answers; LLMs know Spark well."] } },
    { id: "N4", name: "Developer productivity", d: "Time to build and change a typical mapping.", s: { odi: [4, "Declarative GUI mappings."], ipc: [5, "Most mature GUI designer."], dbt: [4, "Fast for SQL developers; boilerplate is generated."], cdp: [3, "Code-first across several tools."], spark: [3, "Code-first; slower for simple mappings."] } },
  ] },
  { id: "AI", name: "AI-assisted engineering with the local LLM", d: "How well the bank's self-hosted LLM can generate, document, test and review pipelines, with no data or code leaving the bank.", w: { baseline: 8, realtime: 5, ai: 15, regulatory: 4, portability: 7, modern: 16 }, c: [
    { id: "A1", name: "Pipeline definitions an LLM can read and write", d: "Pipelines are plain text in Git, so the LLM can generate new ones and change existing ones.", s: { odi: [2, "Mappings live in the repository; exports are verbose XML, and generation is possible only via the ODI Java/Groovy SDK."], ipc: [1, "Proprietary repository objects and XML exports."], dbt: [5, "SQL and YAML files in Git - the format LLMs generate and review best."], cdp: [4, "Spark/Flink SQL and Python in Git; NiFi flows are JSON."], spark: [4, "PySpark/Scala/SQL code in Git."] } },
    { id: "A2", name: "Works with a self-hosted LLM", d: "AI assistance runs against the bank's own model endpoint with no cloud dependency.", s: { odi: [2, "No generative-AI assistant in on-prem ODI; the LLM can help only outside the tool (SDK scripts, SQL)."], ipc: [1, "CLAIRE GPT / Copilot are cloud IDMC only; nothing for on-prem Informatica."], dbt: [4, "Any IDE assistant pointed at the local model's OpenAI-compatible endpoint; the open-source dbt MCP server exposes the project to the LLM. dbt Copilot itself is dbt Cloud only."], cdp: [4, "Hue SQL AI Assistant can use a private model endpoint, and Cloudera AI (Private Cloud Data Services) can host models on-prem - verify versions."], spark: [3, "Open libraries; integration is DIY."] } },
    { id: "A3", name: "Metadata to ground the LLM", d: "Machine-readable models, columns, tests and lineage the LLM can use as context.", s: { odi: [3, "Repository is queryable via SQL/SDK; context must be extracted."], ipc: [2, "Repository and Metadata Manager queries; proprietary."], dbt: [5, "manifest.json, catalog.json and YAML descriptions give full model, column, test and lineage context."], cdp: [4, "Atlas and Hive Metastore metadata via API."], spark: [2, "Needs an external catalogue."] } },
    { id: "A4", name: "Controlled adoption of AI output", d: "AI-generated changes are reviewed, tested and auditable before production (SoD).", s: { odi: [2, "Generated objects land in the repository; review and testing are manual."], ipc: [2, "Same as ODI."], dbt: [5, "Generated SQL goes through pull-request review, dbt tests and CI before deployment."], cdp: [3, "Code is reviewable; testing differs per engine."], spark: [4, "Code review plus pytest."] } },
  ] },
  { id: "DEVOPS", name: "DevOps and engineering practice", d: "Version control, CI/CD, testing, environment promotion.", w: { baseline: 3, realtime: 2, ai: 5, regulatory: 2, portability: 3, modern: 14 }, c: [
    { id: "D1", name: "Git-based version control", d: "Branching, merging, code review.", s: { odi: [3, "Git integration exists but merging is clunky."], ipc: [2, "Repository-based; XML exports to Git."], dbt: [5, "Git-native."], cdp: [4, "Code-first jobs; NiFi Registry for flows."], spark: [5, "Git-native code."] } },
    { id: "D2", name: "CI/CD and automated deployment", d: "Pipeline-driven promotion.", s: { odi: [3, "Deployment archives and ODI SDK scripting."], ipc: [2, "Deployment groups and pmrep scripting."], dbt: [5, "Standard CI pipelines."], cdp: [4, "Standard pipelines; multiple artefact types."], spark: [4, "Standard build pipelines."] } },
    { id: "D3", name: "Automated testing", d: "Unit, regression and data tests.", s: { odi: [2, "Little native support."], ipc: [2, "Little native support."], dbt: [5, "Data tests and unit tests built in."], cdp: [3, "Per-engine frameworks."], spark: [4, "pytest/ScalaTest with local Spark."] } },
    { id: "D4", name: "Environment promotion and SoD", d: "Dev/test/prod with controlled releases.", s: { odi: [4, "Topology contexts separate environments."], ipc: [4, "Folder/repository-based promotion."], dbt: [4, "Targets and profiles per environment."], cdp: [4, "Separate clusters/namespaces."], spark: [3, "Must be designed."] } },
  ] },
  { id: "VENDOR", name: "Vendor viability and roadmap", d: "Long-term product direction, commitment to on-prem, lock-in, ecosystem momentum and vendor reputation.", w: { baseline: 6, realtime: 6, ai: 6, regulatory: 10, portability: 9, modern: 9 }, c: [
    { id: "V1", name: "On-prem product roadmap", d: "Investment in the on-prem product over a 7-10 year EDW life.", s: { odi: [4, "14c released; Oracle continues on-prem ODI alongside OCI services."], ipc: [2, "Maintenance mode; migration to IDMC promoted; Salesforce ownership - verify."], dbt: [3, "dbt Labs focuses mostly on cloud data platforms, and its new Fusion engine has no Oracle support yet - verify. Oracle itself develops and supports the dbt-oracle adapter, and Core stays Apache 2.0."], cdp: [4, "Cloudera committed to on-premises."], spark: [5, "Vendor-neutral Apache project with active 4.x releases."] } },
    { id: "V2", name: "Lock-in and exit cost", d: "Effort to move away in future.", s: { odi: [2, "Proprietary repository and Oracle-specific KMs."], ipc: [2, "Proprietary mappings; migration tooling mainly to IDMC."], dbt: [4, "Plain SQL in Git, but written in the Oracle dialect; conversion to another dialect can be automated with SQLGlot."], cdp: [3, "OSS engines but distribution-specific tooling."], spark: [4, "Open source and open formats, but the SQL is written in the Spark dialect; conversion to another dialect can be automated with SQLGlot."] } },
    { id: "V3", name: "Community and ecosystem momentum", d: "Innovation, integrations, community knowledge.", s: { odi: [3, "Stable but niche community."], ipc: [3, "Large legacy community, shrinking for on-prem Informatica."], dbt: [5, "Very strong momentum."], cdp: [3, "Moderate."], spark: [5, "Largest data-engineering community."] } },
    { id: "V4", name: "Vendor reputation in Turkish enterprises", d: "Standing of the vendor among Turkish enterprises, especially banks and other regulated institutions: references, installed base and perceived stability.", s: { odi: [5, "Oracle is the established database and middleware vendor in Turkish banking, capital markets and the public sector, including Takasbank's own estate."], ipc: [4, "Long-established data integration brand in Turkish banks and telecoms; the push to cloud IDMC and the Salesforce ownership raise questions for on-prem customers."], dbt: [2, "dbt Labs is a young US company with little presence in Turkish enterprises; dbt use in Türkiye is mostly in technology and e-commerce companies rather than regulated finance."], cdp: [3, "Known from the Hadoop platforms at large Turkish banks and telecoms; the Hortonworks merger, private-equity ownership and the decline of Hadoop have weakened its standing."], spark: [3, "No vendor behind it; Apache Spark itself is well regarded and widely used in Turkish banks and telecoms, mostly inside vendor distributions."] } },
    { id: "V5", name: "Strategic on-prem support", d: "On-prem is a first-class, long-term deployment model.", s: { odi: [5, "ODI is on-prem software with a current 14c release."], ipc: [3, "Vendor strategy is cloud IDMC; on-prem Informatica is in maintenance mode."], dbt: [4, "dbt Core runs anywhere; commercial focus is dbt Cloud."], cdp: [5, "Cloudera on-premises (Private Cloud Base) is a core, long-term offering."], spark: [5, "Runs anywhere."] } },
  ] },
  { id: "SKILLS", name: "Talent market and local support in Türkiye", d: "Hiring market, local partners and support language.", w: { baseline: 3, realtime: 2, ai: 2, regulatory: 6, portability: 3, modern: 1 }, c: [
    { id: "K1", name: "Talent availability in Türkiye", d: "Hiring and contractor market.", s: { odi: [4, "Common in Turkish banks and telecoms."], ipc: [4, "Widely used in Turkish banking."], dbt: [3, "Growing; SQL skills transfer easily."], cdp: [3, "Hadoop-era skills declining."], spark: [4, "Popular with data engineers."] } },
    { id: "K2", name: "Local vendor and partner support", d: "Turkish-speaking support and system integrators.", s: { odi: [5, "Oracle Türkiye and many certified partners."], ipc: [4, "Established local partners."], dbt: [3, "No vendor support for dbt Core, but a company in Türkiye provides dbt support; it must be contracted."], cdp: [3, "Some local partners; vendor support remote."], spark: [2, "Community only unless a distribution is bought."] } },
  ] },
  { id: "TCO", name: "5-year total cost of ownership", d: "Higher score = lower expected 5-year cost (see TCO sheet).", w: { baseline: 5, realtime: 5, ai: 3, regulatory: 3, portability: 5, modern: 4 }, c: [
    { id: "X1", name: "Licence / subscription cost", d: "Software licences, options and support (GoldenGate and Exadata excluded - already owned).", s: { odi: [2, "New ODI EE licence outside the ULA: USD 1.5M purchase and USD 330k annual support (USD 3.15M over 5 years); above Informatica, below Cloudera and far above dbt."], ipc: [1, "Highest; many paid options."], dbt: [5, "dbt Core is free; only an SI support contract."], cdp: [2, "Per-node subscription."], spark: [5, "Free; optional third-party support."] } },
    { id: "X2", name: "Infrastructure cost", d: "Servers, storage, DR replica beyond the existing Exadata.", s: { odi: [4, "Small agent servers; processing on Exadata."], ipc: [2, "Dedicated ETL servers/grid."], dbt: [5, "Two small runner VMs per site; processing on Exadata."], cdp: [2, "Separate ~20-node cluster at both sites, on top of Exadata."], spark: [1, "Kubernetes cluster and object storage at both sites."] } },
    { id: "X3", name: "People and operations cost", d: "FTEs to build and run.", s: { odi: [3, "Standard ETL team."], ipc: [2, "Standard ETL team plus admins."], dbt: [4, "Small SQL team, made faster by the local LLM."], cdp: [2, "Dedicated platform team."], spark: [2, "Platform plus data engineering team."] } },
  ] },
];

const CONSTRAINTS: string[] = [
  "Target database: the existing Oracle Exadata is the EDW target and hosts staging, ODS, core and marts.",
  "Licensing: the Oracle ULA covers GoldenGate for Oracle sources only. GoldenGate for non-Oracle sources is not covered but can be added to the ULA package. ODI is not covered.",
  "Existing reports: all current reports are written in PL/SQL on Oracle. The selected tool must run them from day one, and the effort to convert their queries is a decision criterion.",
  "Future target: moving the EDW from Exadata to PostgreSQL is a possibility, so pipelines should not lock the bank into Oracle.",
  "On premise: the EDW and all tooling must run fully on-premises, with no cloud services.",
  "Team: the engineering team knows SQL very well; SQL-first development is preferred. Learning curve and long-term maintenance effort are decision criteria.",
  "AI adoption: Takasbank runs a local (self-hosted) LLM and wants to use it to build, document, test and review data pipelines.",
  "Scheduling: the in-house developer scheduler is the primary scheduler for all pipelines and report runs; the selected tool is started and monitored through it rather than through its own scheduler.",
];

const COMPLIANCE: { control: string; reg: string; req: string; r: Record<ToolId, [Rating, string]> }[] = [
  { control: "Data localisation", reg: "BDDK Bilgi Sistemleri ve Elektronik Bankacılık Hizmetleri Yönetmeliği; SPK VII-128.9; KVKK Art. 9", req: "Primary and secondary systems and data kept in Türkiye; controlled cross-border transfer.", r: { odi: ["Strong", "Fully on-prem."], ipc: ["Adequate", "On-prem today; vendor pushes cloud IDMC."], dbt: ["Strong", "dbt Core local; dbt Cloud not permitted."], cdp: ["Strong", "Fully on-prem."], spark: ["Strong", "Fully on-prem."] } },
  { control: "Access control and least privilege", reg: "SPK VII-128.9 (access management); BDDK BS Yönetmeliği", req: "Central identity, role-based access, privileged access management.", r: { odi: ["Strong", "LDAP/OPSS, security profiles."], ipc: ["Strong", "LDAP, granular permissions."], dbt: ["Gap", "Relies on Exadata roles and Git; add PAM and vault."], cdp: ["Strong", "Kerberos, Ranger, Knox."], spark: ["Gap", "Must integrate Kerberos/Ranger/RBAC."] } },
  { control: "Audit logging and traceability", reg: "SPK VII-128.9; BDDK BS Yönetmeliği", req: "Who changed/ran what and when; tamper-evident logs to SIEM.", r: { odi: ["Strong", "Repository and execution logs."], ipc: ["Strong", "Repository and session logs."], dbt: ["Adequate", "Git history plus run artefacts and Exadata unified audit; ship to SIEM."], cdp: ["Strong", "Ranger central audit."], spark: ["Gap", "Engineer log pipeline."] } },
  { control: "Personal data protection and masking", reg: "KVKK Art. 12 (data security); KVKK Board technical measures guide", req: "Masking/anonymisation in non-production, dynamic masking for privileged users.", r: { odi: ["Adequate", "Via Oracle Data Redaction/VPD options."], ipc: ["Adequate", "Transformations or separate masking product."], dbt: ["Adequate", "Masking macros plus Exadata policies."], cdp: ["Strong", "Ranger tag-based masking."], spark: ["Gap", "Custom."] } },
  { control: "Encryption", reg: "BDDK BS Yönetmeliği; KVKK technical measures", req: "TLS in transit, encryption at rest, managed keys (HSM).", r: { odi: ["Strong", "TLS, TDE."], ipc: ["Strong", "TLS, secure repository."], dbt: ["Strong", "Inherits Exadata encryption."], cdp: ["Strong", "Auto-TLS, encryption zones, KMS."], spark: ["Adequate", "Configurable; manual."] } },
  { control: "Change management and SoD", reg: "SPK VII-128.9 (change management); BDDK BS Yönetmeliği", req: "Controlled promotion dev -> test -> prod; separation of developer and operator duties.", r: { odi: ["Strong", "Contexts and deployment archives."], ipc: ["Strong", "Deployment groups."], dbt: ["Strong", "Git PR approval plus CI."], cdp: ["Strong", "Separate clusters and CI."], spark: ["Adequate", "Must be designed."] } },
  { control: "Business continuity and DR", reg: "BDDK BS Yönetmeliği (secondary site); SPK VII-128.9; CPMI-IOSCO PFMI Principle 17", req: "Tested DR with defined RTO/RPO for critical reporting.", r: { odi: ["Strong", "Data Guard for repository."], ipc: ["Strong", "Standby domain."], dbt: ["Strong", "Stateless; redeploy from Git."], cdp: ["Strong", "Replication Manager, SRM."], spark: ["Adequate", "DIY."] } },
  { control: "Outsourcing and vendor support", reg: "BDDK Bankaların Destek Hizmeti Almalarına İlişkin Yönetmelik", req: "Supported products with contractual SLAs for critical services.", r: { odi: ["Strong", "Oracle support contract."], ipc: ["Adequate", "Support contract; roadmap risk."], dbt: ["Adequate", "No vendor support for Core; a company in Türkiye provides dbt support; contract it with SLAs."], cdp: ["Strong", "Cloudera subscription."], spark: ["Gap", "No vendor; buy third-party support."] } },
  { control: "Vulnerability management", reg: "SPK VII-128.9; BDDK BS Yönetmeliği; annual BS audits", req: "Timely patching, SCA of dependencies, penetration testing.", r: { odi: ["Strong", "Quarterly CPUs."], ipc: ["Adequate", "Maintenance patches."], dbt: ["Adequate", "SCA on Python dependencies."], cdp: ["Strong", "Certified patched builds."], spark: ["Adequate", "Self-managed."] } },
  { control: "Regulatory report lineage", reg: "BCBS 239 principles (good practice); PFMI disclosure", req: "Demonstrable source-to-report lineage and reconciliation.", r: { odi: ["Strong", "Repository lineage."], ipc: ["Strong", "Metadata Manager/EDC."], dbt: ["Strong", "DAG lineage plus tests."], cdp: ["Strong", "Atlas."], spark: ["Gap", "OpenLineage add-on."] } },
  { control: "Use of AI on bank code and data", reg: "KVKK Art. 12; BDDK BS Yönetmeliği (information-systems risk); internal model-risk policy", req: "LLM stays on-prem, sees no production personal data, and AI-generated changes are reviewed and auditable.", r: { odi: ["Adequate", "No built-in AI; any external use must be controlled manually."], ipc: ["Gap", "AI features require cloud IDMC."], dbt: ["Strong", "Local LLM works on code and metadata only; every change goes through PR review and CI."], cdp: ["Strong", "Models hosted on-prem; Ranger governs data access."], spark: ["Adequate", "Code review possible; controls are DIY."] } },
];

const TCO: { tool: ToolId; licence: number; infra: number; services: number; personDays: [number, number]; fte: number | string; notes: string }[] = [
  { tool: "odi", licence: 3150, infra: 300, services: 900, personDays: [2.0, 3.5], fte: 5, notes: "New ODI EE licence outside the ULA: USD 1.5M purchase and 5 years x USD 330k support; confirm that Oracle does not count Exadata cores." },
  { tool: "ipc", licence: 2600, infra: 700, services: 1100, personDays: [2.5, 4.0], fte: 5, notes: "Includes pushdown and HA options; reads GoldenGate-replicated staging instead of buying PowerExchange; IDMC migration risk." },
  { tool: "dbt", licence: 300, infra: 150, services: 700, personDays: [0.75, 1.5], fte: 4, notes: "dbt Core free; licence line is the SI support contract. Runs on Exadata with small runner VMs; local LLM speeds delivery." },
  { tool: "cdp", licence: 3500, infra: 1800, services: 1300, personDays: [3.0, 5.0], fte: 7, notes: "Cloudera on-premises, ~20 nodes per site; Exadata is still needed for the EDW, so CDP is additional cost." },
  { tool: "spark", licence: 200, infra: 1400, services: 1200, personDays: [3.0, 5.0], fte: 8, notes: "Kubernetes + object storage; optional third-party support; largest engineering team." },
];

const MIGRATION = { reports: 200, workingDays: 220, note: "Converting the PL/SQL report queries: analysis, conversion, review, parity testing and cut-over, averaged over simple and complex reports. Effort is in person-days." };

const TCO_ASSUMPTIONS: string[] = [
  "Order-of-magnitude estimates for relative comparison only - not vendor quotations. Obtain formal quotes in the RFP stage.",
  "Sizing: 30-60 TB EDW, ~400 source tables, ~1,500 mappings/models, ~200 operational reports, primary + DR site.",
  "Fully loaded FTE cost in Türkiye assumed at USD 60-90k per year.",
  "Excluded because already owned and common to all options: the Exadata EDW, Oracle Database licences and GoldenGate for Oracle sources (covered by the ULA).",
  "GoldenGate for non-Oracle sources is an add-on to the ULA package needed by every option that relies on GoldenGate; it is excluded here and should be priced in the ULA negotiation.",
  "Each cost component (licence and support, infrastructure, services) is one figure per option, set at the upper end of the estimate.",
  "ODI licence and support: USD 1,500k purchase price and USD 330k annual support from the first year, so USD 3,150k over 5 years. Obtain Oracle's written position on whether Exadata cores are counted.",
  "All options are orchestrated by the in-house developer scheduler, which is already owned and excluded from every option's cost. If it lacks calendars, dependencies, retries, alerting, audit logging or high availability, add the cost of closing those gaps.",
  "PL/SQL report conversion effort = reports to convert x person-days per report. The default assumes the whole estate of about 200 reports is converted, on top of the build and run team. Lower the report count for reports that stay in PL/SQL.",
  "Person-days per report cover analysis, conversion, review, parity testing and cut-over, averaged over simple and complex reports. dbt assumes the local LLM drafts the conversion. Replace these ranges with the conversion pilot's measured effort.",
  "Person-years = total person-days / working days per year, for staffing only. The conversion effort is not priced in money and is not added to the USD totals.",
  "This conversion effort is scored in the Migration effort category, not in the TCO category, so it is not counted twice.",
];

const RISKS: { tool: ToolId | "all"; risk: string; l: Level; i: Level; m: string }[] = [
  { tool: "dbt", risk: "No vendor support for dbt Core, while BDDK outsourcing rules expect supported products for critical services. A company in Türkiye that provides dbt support has been found, which lowers the likelihood, but third-party support must still be contracted and accepted under the outsourcing rules.", l: "Low", i: "High", m: "Contract the identified Turkish dbt support company for L2/L3 support with SLAs and assess it under the BDDK outsourcing rules; name an internal product owner; pin versions; models stay plain Oracle SQL, which keeps an exit path open." },
  { tool: "dbt", risk: "dbt-oracle adapter gaps, and roadmap uncertainty after the dbt Labs-Fivetran merger (Fusion engine has no Oracle support).", l: "Medium", i: "Medium", m: "PoC on Exadata covering incremental merge, snapshots, parallel DML and partition exchange; pin dbt Core 1.x; contribute fixes to the Oracle-maintained adapter." },
  { tool: "dbt", risk: "No stateful stream processing: S0 alerts must be SQL checks on the GoldenGate-fed ODS.", l: "Medium", i: "Medium", m: "Confirm which S0 use cases truly need sub-5-second alerts; implement them as ODS alert queries; revisit a streaming platform only if a hard requirement is confirmed." },
  { tool: "dbt", risk: "Secrets, source loading (MQ/APIs) and calendars, cross-job dependencies and alerting sit outside dbt and depend on the in-house scheduler.", l: "Medium", i: "Low", m: "Use the in-house developer scheduler as the primary scheduler, a secrets vault and Exadata external tables; keep custom loaders minimal; prove dbt build, retry and alerting through the scheduler in the PoC." },
  { tool: "dbt", risk: "Existing PL/SQL reports run beside dbt rather than inside it until they are refactored, so two patterns are operated for a while.", l: "High", i: "Low", m: "Run PL/SQL as scheduler steps with outputs declared as dbt sources; refactor reports by business priority with LLM-assisted conversion and parity tests." },
  { tool: "odi", risk: "ODI is outside the ULA and requires a USD 1.5M purchase and USD 330k annual support (USD 3.15M over 5 years); the fee could be higher if Oracle counts the Exadata target cores.", l: "Medium", i: "Medium", m: "Get a written licensing position from Oracle before the RFP; negotiate ODI into the ULA renewal." },
  { tool: "odi", risk: "Repository-based development limits use of the local LLM and slows Git/CI-CD and testing.", l: "High", i: "Medium", m: "Standardise an ODI SDK pipeline and Git integration; use the LLM for SQL expressions and SDK scripts only." },
  { tool: "odi", risk: "If the EDW moves to PostgreSQL, the Oracle-specific ODI investment (new licence, Oracle KMs, PL/SQL procedures) loses most of its value.", l: "Medium", i: "High", m: "Decide the long-term target database before buying ODI; prefer generic KMs and logical mappings over Oracle-specific code." },
  { tool: "ipc", risk: "Informatica on-prem support horizon and forced migration to cloud IDMC (conflicts with on-prem / data residency).", l: "High", i: "High", m: "Do not select for a new EDW; if retained, obtain contractual extended-support dates." },
  { tool: "ipc", risk: "Product priorities change after Salesforce acquisition of Informatica.", l: "Medium", i: "Medium", m: "Contract price caps and roadmap commitments." },
  { tool: "cdp", risk: "With Exadata as the EDW, CDP adds a second large platform and moves transformations off Exadata.", l: "High", i: "High", m: "Select CDP only if sub-second streaming is a hard requirement that justifies a second platform." },
  { tool: "cdp", risk: "Scarcity of Cloudera platform administrators in Türkiye.", l: "Medium", i: "Medium", m: "Include managed service and training in the contract; build an internal platform team." },
  { tool: "spark", risk: "No vendor support for a system critical to CCP operations (BDDK outsourcing expectations).", l: "High", i: "High", m: "Run Spark only inside a supported distribution or buy third-party support." },
  { tool: "spark", risk: "Security, lineage and monitoring must be engineered in-house.", l: "High", i: "Medium", m: "Prefer a supported platform; budget platform engineering." },
  { tool: "all", risk: "The in-house developer scheduler becomes critical-path infrastructure for EOD, regulatory and intraday runs; its calendars, dependencies, retries, alerting, audit logging and high availability are unproven for this load, and it depends on the people who built it.", l: "Medium", i: "High", m: "Prove calendars, dependencies, restart, alerting and failover with a pilot set of pipelines; name an owner and an SLA for the scheduler; keep Control-M or Airflow as a fallback only if gaps cannot be closed." },
  { tool: "all", risk: "ULA certification: GoldenGate processors deployed after certification become a licence liability.", l: "Medium", i: "High", m: "Deploy all planned GoldenGate capture/apply (including DR) before certification; track processor counts." },
  { tool: "all", risk: "GoldenGate for non-Oracle sources, and for a PostgreSQL target, is outside the ULA.", l: "High", i: "Medium", m: "Inventory non-Oracle sources; price the add-on into the ULA package before certification; Debezium is the open-source fallback." },
  { tool: "all", risk: "A future PostgreSQL move must convert the PL/SQL report estate, because PL/SQL does not run on community PostgreSQL.", l: "Medium", i: "High", m: "Refactor reports into tool-managed SQL before any move; evaluate an Oracle-compatible distribution (EDB Postgres Advanced Server) and conversion tooling such as ora2pg; keep parity tests." },
  { tool: "all", risk: "CDC load on core clearing/settlement OLTP databases.", l: "Medium", i: "High", m: "Log-based CDC only; capture from Data Guard standby where possible; performance test at peak EOD." },
  { tool: "all", risk: "AI-generated SQL with errors reaches production, or the LLM is exposed to personal data (KVKK).", l: "Medium", i: "High", m: "The LLM sees code and metadata only, never production data; all AI output goes through PR review, tests and CI; log prompts and outputs." },
  { tool: "all", risk: "KVKK exposure from production personal data in test environments.", l: "Medium", i: "High", m: "Mandatory masking/anonymisation step in the refresh pipeline; KVKK data inventory (VERBİS) alignment." },
];

const LAYERS: string[][] = [
  ["Sources", "-", "-", "Capture from Data Guard standby where possible."],
  ["Change capture", "Oracle GoldenGate (ULA, Oracle sources)", "GoldenGate non-Oracle add-on", "Feeds staging and the ODS; non-Oracle sources need the add-on to the ULA package."],
  ["File and message intake", "Exadata external tables / SQL*Loader", "Small custom loaders", "Keeps everything inside Exadata."],
  ["Operational data store", "Exadata ODS schema fed by GoldenGate", "-", "Serves S0 reports and alert queries."],
  ["ELT and transformation", "dbt Core + dbt-oracle", "ODI 14c (Option B)", "All processing inside Exadata; incremental models for S1 and S2."],
  ["Existing PL/SQL reports", "Kept running on Exadata as scheduler steps", "Refactored into dbt models", "Refactor by priority with LLM help and parity tests."],
  ["Orchestration", "In-house developer scheduler", "Control-M or Apache Airflow (fallback only if the in-house scheduler has gaps)", "Starts dbt builds and the PL/SQL steps; EOD calendars, dependencies, retries and alerting must be proven in the PoC."],
  ["EDW", "Oracle Database on Exadata (on-prem)", "PostgreSQL (future option)", "Core model plus marts; a PostgreSQL move reuses the dbt project via dbt-postgres."],
  ["AI-assisted engineering", "Local LLM via IDE assistant + dbt MCP server", "-", "Code and metadata only; output passes PR review and CI."],
  ["Governance", "dbt docs and tests + Exadata security (VPD, Redaction, unified audit)", "Enterprise catalogue", "Report-to-source lineage for SPK/BDDK reports."],
  ["Consumption", "Existing BI platform", "-", "Reads marts and ODS views on Exadata."],
];

const STACKS: string[][] = [
  ["A. dbt Core + GoldenGate on Exadata", "Option A - productivity, cost and portability", "Best fit for a SQL team and the local LLM; shortest learning curve; lowest effort to convert the PL/SQL report queries; portable to PostgreSQL; no new licence or platform.", "No vendor support for dbt Core; no stateful streaming; PL/SQL runs beside dbt until refactored."],
  ["B. ODI 14c + GoldenGate", "Option B - regulatory comfort and vendor backing", "Vendor-supported; strongest Exadata and GoldenGate integration; runs PL/SQL reports unchanged.", "New licence outside the ULA; weak AI and Git story; steep learning curve; loses value if the EDW moves to PostgreSQL."],
  ["C. Cloudera on-premises", "Not shortlisted: only if sub-second streaming is mandatory", "Only supported on-prem stream processing.", "Second large platform next to Exadata; highest cost and maintenance; PL/SQL reports must be rewritten."],
  ["D. Apache Spark (self-supported)", "Not recommended", "No licence; flexible.", "No vendor support; DIY security and lineage; outside Exadata."],
  ["E. Informatica", "Not recommended", "Mature GUI ETL.", "Roadmap risk, highest cost, no on-prem AI."],
];

const STACK_NOT_RECOMMENDED: boolean[] = [false, false, false, true, true];

const ROADMAP: string[][] = [
  ["Phase 0 - Foundations", "PoC of dbt and ODI on Exadata (EOD settlement load, SCD2, incremental merge on GoldenGate tables); inventory of the PL/SQL report estate and LLM-assisted conversion pilot with parity tests; small dbt-postgres portability test; SI support contract; GoldenGate non-Oracle add-on and ODI licence positions from Oracle; environments and security baseline.", "PoC meets volume and latency targets; conversion pilot proves parity; steering committee chooses between dbt and ODI; support model and AI controls approved by Information Security and Internal Audit."],
  ["Phase 1 - EDW core (batch)", "GoldenGate into Exadata staging; dbt core EDW for clearing, settlement and collateral; existing PL/SQL reports run as scheduler steps with outputs declared as dbt sources; first regulatory marts; CI with dbt tests.", "First SPK/BDDK reports produced from the EDW with reconciliation; all PL/SQL reports visible in dbt lineage."],
  ["Phase 2 - ODS and operational reporting", "GoldenGate-fed Exadata ODS; S0 dashboards on ODS views; S1 and S2 incremental dbt models; ODS alert queries for margin and collateral; refactor the highest-priority PL/SQL reports into dbt models.", "Prioritised operational reports retired from source systems; refactored reports pass parity tests."],
  ["Phase 3 - AI-assisted delivery at scale", "LLM templates for new models, tests, documentation and PL/SQL conversion; AI review on pull requests; metadata-grounded assistance via the dbt MCP server.", "Measured cycle-time reduction; steady PL/SQL refactoring rate; no AI-originated production incidents."],
  ["Phase 4 - Optimise", "DQ automation, lineage completeness, legacy ETL and PL/SQL decommissioning; track Oracle-specific macros to keep the PostgreSQL option open; review whether any S0 use case needs a streaming platform.", "Legacy integration decommissioned; lineage coverage for all regulatory reports; known, bounded effort for a PostgreSQL move."],
];

const SOURCES: [string, string, boolean][] = [
  ["Oracle ULA scope (GoldenGate)", "The ULA covers GoldenGate for Oracle sources only. Price GoldenGate for non-Oracle sources (and PostgreSQL) as an add-on, confirm GoldenGate for Distributed Applications and Analytics (Kafka) coverage, and plan deployments before certification.", true],
  ["Oracle Data Integrator 14c (14.1.2) licensing", "Released Dec 2024. Obtain Oracle's written position on which processors (agent hosts, Exadata target) must be licensed.", true],
  ["Informatica 10.5.x on-premises support horizon", "Informatica promotes moving on-prem estates to cloud IDMC; confirm end of standard/extended support dates with the vendor.", true],
  ["Salesforce acquisition of Informatica", "Completed Nov 2025; assess impact on on-prem product strategy.", true],
  ["dbt Core licensing and dbt Labs-Fivetran merger", "dbt Core is Apache 2.0; the newer dbt Fusion engine uses a different licence and does not yet support Oracle; merger announced Oct 2025.", true],
  ["dbt-oracle adapter", "Maintained by Oracle; check supported dbt Core version, materialisations and Exadata-specific configs.", true],
  ["dbt MCP server", "Open-source MCP server from dbt Labs; CLI and project-metadata tools work with dbt Core, other tools need dbt Cloud. Can be pointed at by an assistant using the local LLM.", true],
  ["dbt-postgres adapter", "First-party adapter maintained by dbt Labs; the basis for a future PostgreSQL EDW target.", false],
  ["PostgreSQL at EDW scale", "A 30-60 TB EDW needs a scale-out (Citus) or Oracle-compatible (EDB Postgres Advanced Server) distribution; check PL/SQL compatibility, support and ora2pg-style conversion tooling.", true],
  ["Cloudera on-premises AI features", "Hue SQL AI Assistant with private model endpoints and Cloudera AI inference on Private Cloud Data Services - confirm versions and support status.", true],
  ["Oracle AI Database (23ai / 26ai) on Exadata", "If Exadata runs 23ai or later, DBMS_VECTOR_CHAIN can call a self-hosted LLM from SQL, usable by ODI or dbt for in-pipeline AI.", true],
  ["Cloudera Private Cloud Base 7.1.9 / 7.3.x", "Confirm component versions (Kafka, Flink, NiFi, Iceberg) and support lifecycle.", true],
  ["Apache Spark 4.x", "Spark 4.0 released 2025; check Scala/Java and Kubernetes compatibility.", false],
  ["SPK Bilgi Sistemleri Yönetimi Tebliği (VII-128.9)", "Information systems management communiqué for capital-market institutions.", false],
  ["BDDK Bankaların Bilgi Sistemleri ve Elektronik Bankacılık Hizmetleri Hakkında Yönetmelik", "Information systems regulation incl. domestic primary/secondary systems.", false],
  ["KVKK - Law No. 6698 on the Protection of Personal Data", "Art. 9 amended in 2024 (cross-border transfer); Art. 12 data security.", false],
  ["CPMI-IOSCO Principles for Financial Market Infrastructures (PFMI)", "Applicable to Takasbank as CCP/CSD-related FMI (operational risk, disclosure).", false],
];

const RECOMMENDATION_HEADLINE = "Put two options to the steering committee: dbt Core or ODI 14c, both running on Exadata with the ULA-covered GoldenGate for change capture.";

const RECOMMENDATION_SUMMARY = "With one tool, the existing Exadata as the target and GoldenGate already licensed for Oracle sources, the choice narrows to the two in-database ELT tools, and the scores alone do not settle it. dbt Core leads the baseline (3.86 against 3.52 for ODI) and four of the six weighting profiles: it fits the SQL-strong team, has the shortest learning curve, makes the best use of the local LLM, converts the existing PL/SQL report queries with the least effort, keeps a later move to PostgreSQL open, needs no new licence and runs entirely on Exadata. ODI leads when vendor support and regulatory controls dominate (3.69 against 3.65 for dbt): it is vendor-supported, has the stronger access controls, audit trail and HA/DR, runs the PL/SQL reports unchanged and has the stronger standing in Turkish banking, but it needs a new licence and its value depends on staying on Oracle. Cloudera leads only when real-time comes first (3.55 against 3.26 for dbt), and with Exadata as the EDW it would add a second large platform. The steering committee should choose between Option A, dbt Core (productivity, cost and portability), and Option B, ODI (regulatory comfort and vendor backing). Option A is open only if Information Security and Internal Audit accept a contracted support model in place of vendor support.";

const RECOMMENDATION: string[] = [
  "Option A - dbt Core on Exadata: best for delivery speed, the SQL team and the local LLM, the lowest cost and conversion effort, and a later move to PostgreSQL. Its weak points are the ones regulators look at first: no vendor support for dbt Core, access control and segregation of duties built around the tool rather than in it, and a young vendor with little presence in Turkish banks.",
  "Option B - ODI 14c on Exadata: best for regulatory comfort: vendor support with SLAs, the strongest access controls, audit trail and HA/DR, native Exadata and GoldenGate integration, and PL/SQL reports that run unchanged. It needs a new licence outside the ULA (USD 1.5M purchase and USD 330k annual support), has a weaker AI and Git story and a steeper learning curve, and loses most of its value if the EDW moves to PostgreSQL.",
  "How to choose: Option A if delivery speed, AI-assisted engineering, cost and a possible PostgreSQL move weigh most, and Information Security and Internal Audit accept SLAs from the Turkish dbt support company in place of vendor support. Option B if vendor support and regulatory controls must come from the product vendor and the EDW is expected to stay on Oracle.",
  "In both options, GoldenGate (covered by the ULA for Oracle sources) replicates into Exadata staging and an operational data store, so S0 dashboards see data seconds old without another tool. Non-Oracle sources need the GoldenGate add-on, priced into the ULA package.",
  "In both options the existing PL/SQL reports keep running on Exadata from day one as scheduler or load-plan steps. Converting about 200 report queries is estimated at 150-300 person-days with dbt (about 0.7-1.4 person-years), where the local LLM drafts each model and parity tests prove the results match, against 400-700 person-days with ODI and 600-1,000 for Cloudera or Spark.",
  "Option A in practice: dbt Core with the Oracle-maintained dbt-oracle adapter runs every transformation inside Exadata. Models, tests and documentation are plain SQL and YAML in Git, generated with the local LLM and reviewed through pull requests and CI, and a later move to PostgreSQL reuses the project through dbt-postgres. Its gaps are closed without a second ETL tool: a support contract with SLAs from the Turkish dbt support company, the in-house developer scheduler, a secrets vault, and Exadata external tables for files.",
  "Option B in practice: ODI 14c agents run mappings and load plans inside Exadata through Oracle knowledge modules, and the in-house scheduler starts the load plans. Oracle must confirm the licence position (Exadata core counting) before contract award.",
  "The target architecture and roadmap are drawn for Option A; under Option B, ODI mappings and load plans take the place of dbt models in the same flow.",
  "Not shortlisted: Cloudera only if sub-second stream processing becomes a hard requirement; Informatica and stand-alone Spark are not recommended.",
];

const VALIDATE: string[] = [
  "PoC both shortlisted options on Exadata with the same workload: EOD settlement load, SCD2 snapshots, incremental merge on GoldenGate-replicated tables, and S0 and S1 latency at production volumes.",
  "Price GoldenGate for non-Oracle sources (and for a possible PostgreSQL target) as an add-on to the ULA package before certification, and get the ODI licensing position (Exadata core counting) for Option B.",
  "Inventory the PL/SQL report estate (count, size, complexity) and pilot LLM-assisted conversion of a sample of reports into dbt models with parity tests, with the same sample estimated in ODI. Replace the person-day assumptions on the TCO sheet with the measured effort.",
  "Decide how likely a move to PostgreSQL is within the tool's lifetime; if likely, run a small dbt-postgres portability test during the PoC.",
  "Confirm which real-time use cases need sub-5-second stateful alerts; that decides whether a streaming platform is ever needed.",
  "Pilot the local LLM with dbt (IDE assistant plus the dbt MCP server) and measure delivery speed and review findings.",
  "Ask Information Security and Internal Audit whether a contracted support model (SLAs from the Turkish dbt support company) is acceptable under the BDDK outsourcing regulation; this decides whether Option A is open.",
  "Put both options to the steering committee with the scores, cost and risks side by side, and record the decision and its reasons.",
];

const SCENARIO_NOTES: string[] = [
  "Baseline: dbt 3.86, ODI 3.52, Informatica 3.27. Migrating the existing PL/SQL report queries, including running the unconverted ones in the meantime, is its own category (higher score means less effort): dbt 4.3, ODI 3.3, Informatica 2.3, Cloudera 2.2, Spark 2.0, because a report SELECT becomes a dbt model almost verbatim and the local LLM drafts the conversion. Indicative effort for about 200 reports: dbt 150-300 person-days, ODI 400-700, Informatica 500-800, Cloudera and Spark 600-1,000.",
  "AI and SQL productivity first: dbt leads clearly (3.94 against 3.34 for Cloudera and 3.31 for ODI).",
  "Portability first (future PostgreSQL): dbt leads clearly (3.77 against 3.40 for Cloudera and 3.26 for ODI); ODI drops because its advantages are Oracle-specific.",
  "Modern data stack: dbt leads by the widest margin of any profile (4.11 against 3.38 for Cloudera, 3.17 for ODI and 3.13 for Spark). AI-assisted engineering and DevOps (Git, CI/CD, automated tests) carry 30% of the weight, with metadata, ecosystem momentum and maintenance effort adding more; ODI and Informatica fall behind because their repository-based, GUI-first design gives the local LLM and Git little to work with, while Cloudera and Spark gain from being code-first and open.",
  "Regulatory and vendor support first: ODI leads (3.69 against 3.65 for dbt). With security controls weighted at 17% and Exadata fit at 7%, ODI's advantage on access controls, vendor support, vendor reputation and HA/DR outweighs dbt's lead elsewhere, which is why ODI is put to the steering committee as an equal option.",
  "Real-time first: Cloudera leads (3.55 against 3.31 for Informatica, 3.26 for dbt and 3.12 for ODI) because it is the only option with its own stream processing, while ODI and dbt both depend on GoldenGate for change capture. The 0.24 lead is offset by the effort to convert the PL/SQL report queries, the learning curve and running a second platform.",
  "Licence sensitivity: even if Oracle added ODI to the ULA at no cost, ODI would score 3.57 against 3.86 for dbt in the baseline.",
  "Informatica and stand-alone Spark do not lead under any profile.",
];

const ETL_ELT: {
  title: string; intro: string; headers: string[]; whyTitle: string; why: string[]; conclusion: string;
  columns: { name: string; text: string; strengthsLabel: string; strengths: string[]; limitsLabel: string; limits: string[] }[];
  tools: { tool: ToolId; style: string; where: string; note: string }[];
} = {
  title: "ETL versus ELT: where the transformation runs",
  intro: "ETL (extract, transform, load) transforms data in a separate engine before loading it into the warehouse. ELT (extract, load, transform) loads the data into the warehouse first and transforms it there with the warehouse's own SQL engine. For an Exadata EDW this decides whether processing uses the Exadata investment or needs a second compute platform.",
  headers: ["Tool", "Style", "Where the transformation runs", "What it means for Takasbank"],
  whyTitle: "Why ELT fits Takasbank",
  why: ["The EDW target is the existing Exadata, which already has the capacity, DR and security controls, so ELT adds no compute platform to buy or protect.", "The team is SQL-strong and the reports are PL/SQL, so ELT lets existing skills and queries carry over and gives the lowest effort to convert the reports.", "GoldenGate, covered by the ULA for Oracle sources, already performs the extract and load half of ELT by landing changes in Exadata.", "ELT puts the transformation load on Exadata, so capacity must be planned: protect reporting with Database Resource Manager and schedule heavy models outside the EOD critical path."],
  conclusion: "ELT is the better fit for this EDW. ETL on a separate engine wins only where sub-second stream processing or non-SQL logic is a hard requirement.",
  columns: [
    { name: "ETL: transform before loading", text: "A dedicated engine (an integration server or a compute cluster) reads the source data, transforms it in its own memory and storage, and writes the finished result into Exadata.", strengthsLabel: "Strengths", strengths: ["Handles logic that is hard to express in SQL: complex parsing, stream processing, machine-learning steps and non-database sources.", "Keeps heavy processing off the warehouse, so it does not compete with reports for Exadata capacity.", "Scales out independently of the warehouse: engine or cluster nodes can be added as data volumes grow, without adding load to Exadata."], limitsLabel: "Limits", limits: ["A second compute platform to buy, patch, secure and operate.", "Data travels twice, from the sources into the engine and then into Exadata; JDBC loads are a common bottleneck.", "Existing PL/SQL and Oracle SQL cannot be reused and must be rewritten in the engine's own language."] },
    { name: "ELT: transform inside the warehouse", text: "Source data is first landed in Exadata staging (here by GoldenGate, external tables or small loaders), and the tool then generates SQL that Exadata runs itself, using its parallel execution and storage.", strengthsLabel: "Strengths", strengths: ["Uses the existing Exadata capacity, with no second compute platform.", "Data stays inside the database, so the existing Exadata security, encryption and audit controls apply.", "SQL and PL/SQL skills and the existing report queries carry over.", "Raw and intermediate data stays in the warehouse, which helps reconciliation and lineage."], limitsLabel: "Limits", limits: ["Transformations compete with reports and loads for Exadata CPU and I/O, so the workload has to be planned.", "Works best for set-based SQL; stateful stream processing and non-SQL logic are poor fits.", "Depends on the warehouse's SQL dialect, which matters if the EDW later moves to PostgreSQL."] },
  ],
  tools: [
    { tool: "odi", style: "ELT", where: "Inside Exadata: Knowledge Modules generate native Oracle SQL and the agent only orchestrates.", note: "Closest to the existing Oracle estate; runs the PL/SQL reports unchanged." },
    { tool: "ipc", style: "ETL (ELT optional)", where: "In the Informatica engine on separate servers; pushdown to Exadata is a separately licensed option with partial coverage.", note: "Needs its own servers, and the existing PL/SQL gains little from it." },
    { tool: "dbt", style: "ELT (transform step only)", where: "Inside Exadata: models compile to Oracle SQL; dbt has no engine and no extraction of its own.", note: "GoldenGate and external tables do the extract and load; dbt does the transform." },
    { tool: "cdp", style: "ETL on a cluster", where: "On the Cloudera cluster (Spark, Hive, Impala, Flink); results are loaded into Exadata over JDBC.", note: "A second large platform; Exadata becomes only a target." },
    { tool: "spark", style: "ETL on a cluster", where: "In Spark on Kubernetes or YARN; results are written to Exadata over JDBC.", note: "Needs its own cluster and storage; PL/SQL reports must be rewritten." },
  ],
};

const LATSRC_TITLE = "Latency classes and source systems - how each candidate covers them";
const LATSRC_NOTE = "Latency classes follow DWH Hedef Mimarisi v2. Prod Kale is never read directly; all Kale reads go through the ADG standby on sur.";
const LATSRC_LATENCY_HEADER = "Latency class";
const LATSRC_SOURCE_HEADER = "Source system";

const LATENCY_COVERAGE: Coverage[] = [
  { label: "S0 near-real-time integrated state", cells: { odi: "Needs GoldenGate (JKM GG)", ipc: "PowerExchange CDC (add-on)", dbt: "Needs GoldenGate landing", cdp: "Kafka/NiFi plumbing; Oracle CDC still needs GG", spark: "Needs Kafka + CDC producer" } },
  { label: "S1 intraday micro-batch", cells: { odi: "Load Plans on schedule; watermark", ipc: "Scheduled workflows; watermark or CDC", dbt: "Scheduled incremental runs (scheduler not decided)", cdp: "NiFi/Spark scheduled", spark: "Airflow-scheduled jobs" } },
  { label: "S2 end-of-day", cells: { odi: "Native", ipc: "Native", dbt: "Native", cdp: "Possible, round trip", spark: "Possible, round trip" }, green: ["odi", "ipc", "dbt"] },
  { label: "S3 planned file / external feeds", cells: { odi: "Native", ipc: "Native", dbt: "External tables / SQL*Loader", cdp: "NiFi native", spark: "Custom" }, green: ["odi", "ipc"], red: ["spark"] },
  { label: "S4 backfill / replay", cells: { odi: "Load Plan with load id variable", ipc: "Workflow parameters", dbt: "Full-refresh / vars with load id", cdp: "Rerun jobs", spark: "Rerun jobs" } },
];

const SOURCE_COVERAGE: Coverage[] = [
  { label: "Kale (via ADG standby on sur)", cells: { odi: "Native (dblink/JDBC, AS OF SCN)", ipc: "Native", dbt: "dblink / external means, AS OF SCN in SQL", cdp: "JDBC", spark: "JDBC partitioned read" }, green: ["ipc"] },
  { label: "ARSIV / ÇekDB (Oracle)", cells: { odi: "Native", ipc: "Native", dbt: "dblink", cdp: "JDBC", spark: "JDBC" }, green: ["odi", "ipc"] },
  { label: "BIST Replica BIDB (other institution)", cells: { odi: "Native (dblink/JDBC)", ipc: "Native", dbt: "dblink (access to be granted)", cdp: "JDBC", spark: "JDBC" }, green: ["ipc"] },
  { label: "FTP / CSV files", cells: { odi: "Native", ipc: "Native", dbt: "External tables + scheduler file watcher", cdp: "NiFi native", spark: "Custom" }, green: ["odi", "ipc"], red: ["spark"] },
  { label: "EPİAŞ web services", cells: { odi: "REST/SOAP technologies", ipc: "Native web service transformations", dbt: "Custom (PL/SQL UTL_HTTP / small service)", cdp: "NiFi native", spark: "Custom" }, red: ["spark"] },
  { label: "Postgres / MSSQL (possible)", cells: { odi: "JDBC", ipc: "Native", dbt: "Oracle Database Gateway or external loader", cdp: "JDBC", spark: "JDBC" }, green: ["ipc"] },
];

const CDC_TITLE = "Change data capture options";
const CDC_HEADERS: string[] = ["CDC option", "Mechanism", "Typical latency", "Works with", "Notes"];

const CDC_OPTIONS: string[][] = [
  ["Oracle GoldenGate for Oracle sources (covered by the ULA)", "Redo-log capture, trail files, replicat into Exadata", "Sub-second to seconds", "Every option (lands into Exadata staging/ODS); ODI natively", "Default CDC layer at no incremental licence cost. Confirm ULA coverage of GoldenGate DAA (Kafka delivery)."],
  ["Oracle GoldenGate for non-Oracle sources (ULA add-on)", "Native log capture for MSSQL, DB2, PostgreSQL and others", "Sub-second to seconds", "Every option; ODI natively", "Not covered by the ULA today but can be added to the package; also needed for a PostgreSQL EDW target. Negotiate before ULA certification."],
  ["Debezium (Oracle LogMiner connector)", "Log mining via Kafka Connect", "Seconds", "CDP, Spark, any Kafka consumer", "Open source; supported under a Cloudera subscription; duplicates GoldenGate, but also covers MSSQL, DB2 and PostgreSQL without the GoldenGate add-on."],
  ["Informatica PowerExchange CDC", "Log-based capture", "Seconds to minutes", "Informatica", "Separately licensed; duplicates GoldenGate for Oracle sources, but is an alternative to the GoldenGate non-Oracle add-on for DB2 and mainframe."],
  ["ODI journalizing", "Triggers or GoldenGate-based journals", "Minutes", "ODI", "Use the GoldenGate mode; trigger mode adds load to core OLTP."],
  ["Timestamp / incremental extraction", "Query on change columns", "Minutes to hours", "All tools", "Misses deletes; acceptable only for S1, S2 and S4."],
];
// </generated-data>

const CRITERIA_COUNT = CATS.reduce((a, c) => a + c.c.length, 0);

function migrationDays(personDays: [number, number]): [number, number] {
  return [MIGRATION.reports * personDays[0], MIGRATION.reports * personDays[1]];
}

function catScore(cat: Category, t: ToolId): number {
  return cat.c.reduce((a, cr) => a + cr.s[t][0], 0) / cat.c.length;
}

function weightedTotals(weights: Record<string, number>): Record<ToolId, number> {
  const sumW = CATS.reduce((a, c) => a + (weights[c.id] ?? 0), 0);
  const out = {} as Record<ToolId, number>;
  for (const t of TOOL_IDS) {
    const s = CATS.reduce((a, c) => a + (weights[c.id] ?? 0) * catScore(c, t), 0);
    out[t] = sumW > 0 ? s / sumW : 0;
  }
  return out;
}

function scenarioWeights(id: ScenarioId): Record<string, number> {
  const w: Record<string, number> = {};
  for (const c of CATS) w[c.id] = c.w[id];
  return w;
}

function ranked(totals: Record<ToolId, number>): ToolId[] {
  return [...TOOL_IDS].sort((a, b) => totals[b] - totals[a]);
}

function Heat({ v, bold = false }: { v: number; bold?: boolean }) {
  const theme = useHostTheme();
  const opacity = 0.05 + Math.max(0, Math.min(4, v - 1)) * 0.125;
  return (
    <div style={{ position: "relative", padding: "6px 8px", textAlign: "center", minWidth: 64 }}>
      <div style={{ position: "absolute", inset: 2, borderRadius: 4, background: theme.accent.primary, opacity }} />
      <span style={{ position: "relative", color: theme.text.primary, fontVariantNumeric: "tabular-nums", fontWeight: bold ? 600 : 400, fontSize: 13 }}>
        {v.toFixed(2)}
      </span>
    </div>
  );
}

function StatusText({ level, note }: { level: string; note?: string }) {
  const theme = useHostTheme();
  const color = level === "Strong" ? theme.category.green
    : level === "Adequate" ? theme.category.yellow
    : theme.category.red;
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, color: theme.text.primary }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: color, display: "inline-block" }} />
        {level}
      </span>
      {note ? <span style={{ color: theme.text.secondary, fontSize: 12 }}>{note}</span> : null}
    </span>
  );
}

function CoverageCell({ text, tone }: { text: string; tone?: "green" | "red" }) {
  const theme = useHostTheme();
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: theme.text.primary }}>
      <span style={{ width: 7, height: 7, borderRadius: 4, marginTop: 5, flexShrink: 0, background: tone ? theme.category[tone] : "transparent", border: tone ? "none" : `1px solid ${theme.stroke.secondary}` }} />
      {text}
    </span>
  );
}

function Bullets({ items }: { items: string[] }) {
  const theme = useHostTheme();
  return (
    <ul style={{ margin: 0, paddingLeft: 18, color: theme.text.secondary, fontSize: 13, lineHeight: "20px" }}>
      {items.map((x) => <li key={x} style={{ marginBottom: 4 }}>{x}</li>)}
    </ul>
  );
}

function Heatmap({ weights, totals, selected, onSelect }: {
  weights: Record<string, number>; totals: Record<ToolId, number>; selected: string; onSelect: (id: string) => void;
}) {
  const theme = useHostTheme();
  const sumW = CATS.reduce((a, c) => a + (weights[c.id] ?? 0), 0);
  const cell: CSSProperties = { borderBottom: `1px solid ${theme.stroke.tertiary}`, padding: 0 };
  const th: CSSProperties = { textAlign: "center", padding: "8px 6px", color: theme.text.secondary, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${theme.stroke.secondary}` };
  return (
    <div style={{ border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 8, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left", paddingLeft: 12 }}>Category (click for criteria)</th>
            <th style={th}>Weight</th>
            {TOOL_IDS.map((t) => <th key={t} style={th}>{TOOLS[t].short}</th>)}
          </tr>
        </thead>
        <tbody>
          {CATS.map((c) => {
            const isSel = c.id === selected;
            return (
              <tr key={c.id} onClick={() => onSelect(c.id)} style={{ cursor: "pointer", background: isSel ? theme.fill.secondary : "transparent" }}>
                <td style={{ ...cell, padding: "6px 12px", color: theme.text.primary, fontWeight: isSel ? 600 : 400, borderLeft: `2px solid ${isSel ? theme.accent.primary : "transparent"}` }}>{c.name}</td>
                <td style={{ ...cell, padding: "6px 8px", textAlign: "center", color: theme.text.secondary, fontVariantNumeric: "tabular-nums" }}>
                  {sumW > 0 ? `${(((weights[c.id] ?? 0) / sumW) * 100).toFixed(0)}%` : "-"}
                </td>
                {TOOL_IDS.map((t) => <td key={t} style={cell}><Heat v={catScore(c, t)} /></td>)}
              </tr>
            );
          })}
          <tr>
            <td style={{ padding: "8px 12px", fontWeight: 600, color: theme.text.primary }}>Weighted score (1-5)</td>
            <td style={{ padding: "8px", textAlign: "center", color: theme.text.secondary }}>100%</td>
            {TOOL_IDS.map((t) => <td key={t} style={{ padding: 0 }}><Heat v={totals[t]} bold /></td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CriteriaDetail({ catId }: { catId: string }) {
  const theme = useHostTheme();
  const cat = CATS.find((c) => c.id === catId) ?? CATS[0];
  return (
    <Stack gap={8}>
      <H3>{cat.name}: criterion scores and rationale</H3>
      <Text tone="secondary" size="small">{cat.d}</Text>
      <Table
        headers={["Criterion", ...TOOL_IDS.map((t) => TOOLS[t].short)]}
        rows={cat.c.map((cr) => [
          <span key="n" style={{ display: "inline-flex", flexDirection: "column", gap: 2, minWidth: 160 }}>
            <span style={{ fontWeight: 600, color: theme.text.primary }}>{cr.id} {cr.name}</span>
            <span style={{ color: theme.text.tertiary, fontSize: 12 }}>{cr.d}</span>
          </span>,
          ...TOOL_IDS.map((t) => (
            <span key={t} style={{ display: "inline-flex", flexDirection: "column", gap: 2, minWidth: 120 }}>
              <span style={{ fontWeight: 600, color: theme.text.primary, fontVariantNumeric: "tabular-nums" }}>{cr.s[t][0]} / 5</span>
              <span style={{ color: theme.text.secondary, fontSize: 12 }}>{cr.s[t][1]}</span>
            </span>
          )),
        ])}
      />
    </Stack>
  );
}

function WeightEditor({ weights, onChange, onReset }: { weights: Record<string, number>; onChange: (id: string, v: number) => void; onReset: () => void }) {
  const theme = useHostTheme();
  const sumW = CATS.reduce((a, c) => a + (weights[c.id] ?? 0), 0);
  return (
    <Card>
      <CardHeader trailing={<span style={{ color: theme.text.tertiary, fontSize: 12 }}>Raw weight sum {sumW}, normalised automatically</span>}>
        Adjust category weights
      </CardHeader>
      <CardBody>
        <Grid columns={2} gap={12}>
          {CATS.map((c) => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 120px 28px", alignItems: "center", gap: 8 }}>
              <span style={{ color: theme.text.secondary, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.name}>{c.name}</span>
              <input
                type="range" min={0} max={25} step={1} value={weights[c.id] ?? 0}
                onChange={(e: { target: { value: string } }) => onChange(c.id, Number(e.target.value))}
                style={{ width: "100%", accentColor: theme.accent.primary }}
                aria-label={`Weight for ${c.name}`}
              />
              <span style={{ color: theme.text.primary, fontSize: 12, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{weights[c.id] ?? 0}</span>
            </div>
          ))}
        </Grid>
        <div style={{ marginTop: 12 }}>
          <Pill size="sm" onClick={onReset}>Reset to Takasbank Baseline</Pill>
        </div>
      </CardBody>
    </Card>
  );
}

type FlowTier = "src" | "exa" | "tooling" | "out";
const FLOW_NODES: { id: string; lines: string[]; tier: FlowTier }[] = [
  { id: "oltp", lines: ["Core OLTP", "(Oracle)"], tier: "src" },
  { id: "nonora", lines: ["Non-Oracle sources", "(GoldenGate add-on)"], tier: "src" },
  { id: "files", lines: ["Files, SWIFT", "and MQ"], tier: "src" },
  { id: "llm", lines: ["Local LLM", "(IDE + dbt MCP)"], tier: "tooling" },
  { id: "gg", lines: ["GoldenGate", "(ULA: Oracle sources)"], tier: "src" },
  { id: "git", lines: ["Git PR, dbt tests", "and CI"], tier: "tooling" },
  { id: "sched", lines: ["In-house", "scheduler"], tier: "tooling" },
  { id: "stg", lines: ["Exadata", "staging"], tier: "exa" },
  { id: "ods", lines: ["Exadata ODS"], tier: "exa" },
  { id: "plsql", lines: ["Existing PL/SQL", "reports"], tier: "exa" },
  { id: "dbt", lines: ["dbt Core models", "(in-database ELT)"], tier: "exa" },
  { id: "edw", lines: ["Exadata core EDW", "+ marts"], tier: "exa" },
  { id: "rt", lines: ["S0 dashboards and", "alert queries"], tier: "out" },
  { id: "rep", lines: ["Operational and", "regulatory reports"], tier: "out" },
];
const FLOW_EDGES = [
  { from: "oltp", to: "gg" }, { from: "nonora", to: "gg" }, { from: "gg", to: "stg" }, { from: "gg", to: "ods" }, { from: "files", to: "stg" },
  { from: "llm", to: "git" }, { from: "git", to: "dbt" }, { from: "sched", to: "dbt" }, { from: "sched", to: "plsql" },
  { from: "stg", to: "dbt" }, { from: "ods", to: "dbt" }, { from: "ods", to: "rt" },
  { from: "plsql", to: "dbt" }, { from: "plsql", to: "rep" },
  { from: "dbt", to: "edw" }, { from: "edw", to: "rep" },
];
const NODE_W = 140;
const NODE_H = 44;

function ArchitectureDiagram() {
  const theme = useHostTheme();
  const layout = useMemo(() => computeDAGLayout({
    nodes: FLOW_NODES.map((n) => ({ id: n.id })), edges: FLOW_EDGES, direction: "horizontal",
    nodeWidth: NODE_W, nodeHeight: NODE_H, rankGap: 40, nodeGap: 14, padding: 12,
  }), []);
  const byId = new Map(FLOW_NODES.map((n) => [n.id, n]));
  const swatch = (border: string, bg: string, dashed = false): CSSProperties => ({
    width: 10, height: 10, borderRadius: 2, border: `1px ${dashed ? "dashed" : "solid"} ${border}`, background: bg, display: "inline-block",
  });
  return (
    <div style={{ overflowX: "auto", border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 8, padding: 8 }}>
      <svg width={layout.width} height={layout.height} role="img" aria-label="Target data flow: GoldenGate replicates Oracle sources (and non-Oracle sources with the add-on) into Exadata staging and ODS; existing PL/SQL reports keep running and are refactored into dbt models; dbt Core transforms inside Exadata into the core EDW and marts; the local LLM, Git CI and the scheduler support dbt">
        <defs>
          <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={theme.text.tertiary} />
          </marker>
        </defs>
        {layout.edges.map((e) => {
          const dx = (e.targetX - e.sourceX) / 2;
          return (
            <path key={`${e.from}-${e.to}`} d={`M${e.sourceX},${e.sourceY} C${e.sourceX + dx},${e.sourceY} ${e.targetX - dx},${e.targetY} ${e.targetX},${e.targetY}`}
              fill="none" stroke={theme.stroke.primary} strokeWidth={1.2} markerEnd="url(#arrow)" />
          );
        })}
        {layout.nodes.map((n) => {
          const meta = byId.get(n.id);
          if (!meta) return null;
          const isExa = meta.tier === "exa";
          const isTooling = meta.tier === "tooling";
          return (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={6}
                fill={isExa ? theme.fill.secondary : theme.bg.elevated}
                stroke={isExa ? theme.accent.primary : theme.stroke.secondary} strokeWidth={1}
                strokeDasharray={isTooling ? "4 3" : undefined} />
              {meta.lines.map((line, i) => (
                <text key={i} x={n.x + NODE_W / 2} y={n.y + NODE_H / 2 + (i - (meta.lines.length - 1) / 2) * 14} textAnchor="middle" dominantBaseline="middle"
                  fontSize={11} fill={meta.tier === "out" ? theme.text.secondary : theme.text.primary} fontWeight={meta.tier === "out" ? 400 : 600}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: "4px 4px 0", fontSize: 12, color: theme.text.tertiary }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={swatch(theme.accent.primary, theme.fill.secondary)} />
          Runs inside Exadata
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={swatch(theme.stroke.secondary, theme.bg.elevated, true)} />
          Tooling around dbt (local LLM, Git and CI, scheduler)
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={swatch(theme.stroke.secondary, theme.bg.elevated)} />
          Sources, CDC and consumers
        </span>
      </div>
    </div>
  );
}

function ToolProfile({ tool }: { tool: ToolId }) {
  const theme = useHostTheme();
  const t = TOOLS[tool];
  const rows: [string, string][] = [["Version assessed", t.version], ["Product type", t.type], ["Architecture", t.architecture], ["Execution model", t.execution], ["Licence model", t.licence]];
  const listStyle: CSSProperties = { margin: "4px 0 0", paddingLeft: 18, color: theme.text.secondary, fontSize: 13, lineHeight: "19px" };
  return (
    <Grid columns="minmax(0, 1.1fr) minmax(0, 1fr)" gap={20}>
      <Stack gap={12}>
        <H3>{t.name}</H3>
        {rows.map(([k, v]) => (
          <div key={k}>
            <Text size="small" tone="tertiary">{k}</Text>
            <Text>{v}</Text>
          </div>
        ))}
        <Grid columns={2} gap={16}>
          <div>
            <Text weight="semibold">Strengths</Text>
            <ul style={listStyle}>{t.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div>
            <Text weight="semibold">Weaknesses</Text>
            <ul style={listStyle}>{t.weaknesses.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </Grid>
        <Divider />
        <Text><Text weight="semibold">Best fit at Takasbank: </Text>{t.bestFit}</Text>
        <Text><Text weight="semibold">Not suited for: </Text>{t.notSuited}</Text>
      </Stack>
      <Stack gap={8}>
        <Text weight="semibold">{t.short} score by category (1-5, average of criteria)</Text>
        <BarChart
          horizontal
          height={640}
          yMin={0}
          yMax={5}
          categories={CATS.map((c) => c.name)}
          series={[{ name: `${t.short} category score`, data: CATS.map((c) => Number(catScore(c, tool).toFixed(2))), tone: "info" }]}
          referenceLines={[{ value: 3, label: "Adequate" }]}
        />
        <Text size="small" tone="tertiary">Value axis: category score on a 1-5 scale. Dashed line marks 3 (Adequate). Source: evaluation model, {CRITERIA_COUNT} criteria.</Text>
      </Stack>
    </Grid>
  );
}

const TABS = ["Tool profiles", "Latency and sources", "Security and regulatory", "5-year TCO", "Risks", "Target architecture"] as const;
type Tab = typeof TABS[number];

export default function TakasbankEtlEvaluation() {
  const theme = useHostTheme();
  const [storedMode, setMode] = useCanvasState<Mode>("modeV4", "baseline");
  const [custom, setCustom] = useCanvasState<Record<string, number>>("customWeightsV4", scenarioWeights("baseline"));
  const [selectedCat, setSelectedCat] = useCanvasState<string>("selectedCategoryV4", "MIGR");
  const [tab, setTab] = useCanvasState<Tab>("tab", "Tool profiles");
  const [profileTool, setProfileTool] = useCanvasState<ToolId>("profileTool", "dbt");

  const mode: Mode = storedMode === "custom" || SCENARIOS.some((s) => s.id === storedMode) ? storedMode : "baseline";
  const weights = mode === "custom" ? custom : scenarioWeights(mode);
  const totals = weightedTotals(weights);
  const order = ranked(totals);
  const leader = order[0];
  const runnerUp = order[1];

  const scenarioTotals = useMemo(() => SCENARIOS.map((s) => ({ s, totals: weightedTotals(scenarioWeights(s.id)) })), []);

  const setWeight = (id: string, v: number) => {
    setCustom({ ...weights, [id]: v });
    setMode("custom");
  };

  const modeLabel = mode === "custom" ? "Custom weights" : SCENARIOS.find((s) => s.id === mode)?.name ?? "";

  return (
    <Stack gap={28} style={{ padding: "4px 2px 32px", maxWidth: 1180 }}>
      <Stack gap={6}>
        <Text size="small" tone="tertiary">Takasbank (İstanbul Takas ve Saklama Bankası A.Ş.) · On-prem EDW programme · Internal · v{DOC_VERSION}, {DOC_DATE}</Text>
        <H1>no repo ETL/ELT tool evaluation for the on-prem enterprise data warehouse</H1>
        <Text tone="secondary">
          Oracle Data Integrator, Informatica, dbt Core, Cloudera on-premises and Apache Spark were assessed against {CRITERIA_COUNT} criteria in {CATS.length} weighted categories to select a single ETL/ELT tool. The criteria reflect Takasbank's role as a CCP and settlement bank: daily/T+1 regulatory reporting, a large intraday operational report estate already written in PL/SQL (including the effort to convert those queries), real-time margin and collateral monitoring, SPK, BDDK and KVKK controls with fully in-country, on-prem hosting, and the option of moving the EDW to PostgreSQL later.
        </Text>
      </Stack>

      <Callout tone="info" title="Decision constraints from Takasbank">
        <Bullets items={CONSTRAINTS} />
      </Callout>

      <Stack gap={14}>
        <H2>{ETL_ELT.title}</H2>
        <Text tone="secondary">{ETL_ELT.intro}</Text>
        <Grid columns="minmax(0, 1fr) minmax(0, 1fr)" gap={28} align="start">
          {ETL_ELT.columns.map((c) => (
            <Stack key={c.name} gap={8}>
              <H3>{c.name}</H3>
              <Text size="small" tone="secondary">{c.text}</Text>
              <Text size="small" weight="semibold">{c.strengthsLabel}</Text>
              <Bullets items={c.strengths} />
              <Text size="small" weight="semibold">{c.limitsLabel}</Text>
              <Bullets items={c.limits} />
            </Stack>
          ))}
        </Grid>
        <Table
          headers={ETL_ELT.headers}
          rows={ETL_ELT.tools.map((r) => [
            <span key="t" style={{ fontWeight: 600 }}>{TOOLS[r.tool].name}</span>,
            <span key="s" style={{ fontWeight: 600, fontSize: 12 }}>{r.style}</span>,
            <span key="w" style={{ fontSize: 12 }}>{r.where}</span>,
            <span key="n" style={{ fontSize: 12, color: theme.text.secondary }}>{r.note}</span>,
          ])}
        />
        <Callout tone="info" title={ETL_ELT.whyTitle}>
          <Bullets items={ETL_ELT.why} />
          <div style={{ marginTop: 8 }}>
            <Text weight="semibold">{ETL_ELT.conclusion}</Text>
          </div>
        </Callout>
      </Stack>

      <Divider />

      <Grid columns="minmax(0, 1.7fr) minmax(0, 1fr)" gap={24} align="start">
        <Stack gap={10}>
          <H2>Recommendation: two options for the steering committee</H2>
          <Text weight="semibold">{RECOMMENDATION_HEADLINE}</Text>
          <Text>{RECOMMENDATION_SUMMARY}</Text>
          <Bullets items={RECOMMENDATION} />
        </Stack>
        <Stack gap={14}>
          <Row gap={24} wrap>
            <Stat value={TOOLS[leader].short} label={`Leader · ${modeLabel}`} tone="success" />
            <Stat value={totals[leader].toFixed(2)} label="Weighted score (1-5)" />
            <Stat value={`+${(totals[leader] - totals[runnerUp]).toFixed(2)}`} label={`Margin over ${TOOLS[runnerUp].short}`} />
          </Row>
          <Callout tone="warning" title="Validate before contract award">
            <Bullets items={VALIDATE} />
          </Callout>
        </Stack>
      </Grid>

      <Divider />

      <Stack gap={14}>
        <Row align="center" wrap gap={12}>
          <H2>Scoring</H2>
          <div style={{ flex: 1 }} />
          <Text size="small" tone="tertiary">Weighting scenario</Text>
          <Row gap={6} wrap>
            {SCENARIOS.map((s) => <Pill key={s.id} active={mode === s.id} onClick={() => setMode(s.id)}>{s.name}</Pill>)}
            <Pill active={mode === "custom"} onClick={() => setMode("custom")}>Custom</Pill>
          </Row>
        </Row>
        <Text size="small" tone="secondary">
          {mode === "custom" ? "Custom weights set with the sliders below. Totals are normalised, so the weights do not need to sum to 100." : SCENARIOS.find((s) => s.id === mode)?.d}
        </Text>

        {mode === "custom" && (
          <WeightEditor
            weights={weights}
            onChange={setWeight}
            onReset={() => setCustom(scenarioWeights("baseline"))}
          />
        )}

        <Grid columns="minmax(0, 1fr) minmax(0, 1.25fr)" gap={24} align="start">
          <Stack gap={8}>
            <Text weight="semibold">Weighted score by tool ({modeLabel})</Text>
            <BarChart
              horizontal
              height={230}
              yMin={0}
              yMax={100}
              categories={order.map((t) => TOOLS[t].short)}
              series={[{ name: "Weighted score (0-100)", data: order.map((t) => Number((totals[t] * 20).toFixed(1))) }]}
            />
            <Text size="small" tone="tertiary">Value axis: weighted score on a 0-100 scale (the 1-5 weighted score times 20; category weights times category averages, divided by total weight). Source: evaluation model, {CRITERIA_COUNT} criteria.</Text>
            <Table
              headers={["Rank", "Tool", "Score", "% of max", "Best fit"]}
              columnAlign={["center", "left", "right", "right", "left"]}
              rowTone={order.map((_, i): TableRowTone | undefined => (i === 0 ? "success" : undefined))}
              rows={order.map((t, i) => [
                String(i + 1),
                TOOLS[t].name,
                totals[t].toFixed(2),
                `${((totals[t] / 5) * 100).toFixed(0)}%`,
                <span key="b" style={{ color: theme.text.secondary, fontSize: 12 }}>{TOOLS[t].bestFit}</span>,
              ])}
            />
          </Stack>
          <Stack gap={8}>
            <Text weight="semibold">Category score heatmap (1-5, darker = stronger)</Text>
            <Heatmap weights={weights} totals={totals} selected={selectedCat} onSelect={setSelectedCat} />
          </Stack>
        </Grid>

        <CriteriaDetail catId={selectedCat} />
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>Scenario sensitivity</H2>
        <Grid columns="minmax(0, 1.4fr) minmax(0, 1fr)" gap={24} align="start">
          <Stack gap={8}>
            <Text weight="semibold">Weighted score by tool and weighting scenario (1-5)</Text>
            <BarChart
              height={260}
              yMin={0}
              yMax={5}
              categories={TOOL_IDS.map((t) => TOOLS[t].short)}
              series={scenarioTotals.map(({ s, totals: tt }) => ({ name: s.name, data: TOOL_IDS.map((t) => Number(tt[t].toFixed(2))) }))}
            />
            <Text size="small" tone="tertiary">X axis: tool. Y axis: weighted score (1-5). One series per predefined weighting profile.</Text>
          </Stack>
          <Stack gap={8}>
            <Table
              headers={["Scenario", "Leader", "Runner-up", "Margin"]}
              columnAlign={["left", "left", "left", "right"]}
              rows={scenarioTotals.map(({ s, totals: tt }) => {
                const o = ranked(tt);
                return [s.name, TOOLS[o[0]].short, TOOLS[o[1]].short, (tt[o[0]] - tt[o[1]]).toFixed(2)];
              })}
            />
            <Bullets items={SCENARIO_NOTES} />
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={14}>
        <Row gap={6} wrap>
          {TABS.map((t) => <Pill key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Pill>)}
        </Row>

        {tab === "Tool profiles" ? (
          <Stack gap={14}>
            <Row gap={6} wrap>
              {TOOL_IDS.map((t) => <Pill key={t} size="sm" active={profileTool === t} onClick={() => setProfileTool(t)}>{TOOLS[t].name}</Pill>)}
            </Row>
            <ToolProfile tool={profileTool} />
          </Stack>
        ) : null}

        {tab === "Latency and sources" ? (
          <Stack gap={10}>
            <H3>{LATSRC_TITLE}</H3>
            <Text size="small" tone="tertiary">{LATSRC_NOTE}</Text>
            {[[LATSRC_LATENCY_HEADER, LATENCY_COVERAGE], [LATSRC_SOURCE_HEADER, SOURCE_COVERAGE]].map(([head, list]) => (
              <Table
                key={head as string}
                headers={[head as string, ...TOOL_IDS.map((t) => TOOLS[t].short)]}
                rows={(list as Coverage[]).map((r) => [
                  <span key="l" style={{ fontWeight: 600 }}>{r.label}</span>,
                  ...TOOL_IDS.map((t) => <CoverageCell key={t} text={r.cells[t]} tone={r.green?.includes(t) ? "green" : r.red?.includes(t) ? "red" : undefined} />),
                ])}
              />
            ))}
            <Text size="small" tone="tertiary">Green = native capability; red = must be custom-built; no marker = needs configuration or a companion product.</Text>
            <H3>{CDC_TITLE}</H3>
            <Table headers={CDC_HEADERS} rows={CDC_OPTIONS} striped />
          </Stack>
        ) : null}

        {tab === "Security and regulatory" ? (
          <Stack gap={10}>
            <H3>Control mapping: SPK VII-128.9, BDDK, KVKK, PFMI</H3>
            <Table
              headers={["Control", "Requirement", ...TOOL_IDS.map((t) => TOOLS[t].short)]}
              rowTone={[...COMPLIANCE.map((): TableRowTone | undefined => undefined), "info"]}
              rows={[
                ...COMPLIANCE.map((c) => [
                  <span key="c" style={{ display: "inline-flex", flexDirection: "column", gap: 2, minWidth: 150 }}>
                    <span style={{ fontWeight: 600 }}>{c.control}</span>
                    <span style={{ color: theme.text.tertiary, fontSize: 11 }}>{c.reg}</span>
                  </span>,
                  <span key="r" style={{ fontSize: 12, color: theme.text.secondary }}>{c.req}</span>,
                  ...TOOL_IDS.map((t) => <StatusText key={t} level={c.r[t][0]} note={c.r[t][1]} />),
                ]),
                [
                  <span key="c" style={{ fontWeight: 600 }}>{`Strong / Gap of ${COMPLIANCE.length}`}</span>,
                  "",
                  ...TOOL_IDS.map((t) => {
                    const gaps = COMPLIANCE.filter((c) => c.r[t][0] === "Gap").length;
                    const strong = COMPLIANCE.filter((c) => c.r[t][0] === "Strong").length;
                    const color = gaps >= 3 ? theme.category.red : gaps > 0 ? theme.category.yellow : theme.text.primary;
                    return <span key={t} style={{ fontWeight: 700, fontSize: 15, color }}>{`${strong} / ${gaps}`}</span>;
                  }),
                ],
              ]}
            />
            <Text size="small" tone="tertiary">Ratings cover the integration tool only. Exadata controls (TDE, Data Redaction, Database Vault, unified audit) and enterprise controls (PAM, SIEM, HSM) complement every option. Information Security and Internal Audit should confirm this mapping before the RFP.</Text>
          </Stack>
        ) : null}

        {tab === "5-year TCO" ? (
          <Stack gap={16}>
            <Grid columns="minmax(0, 1fr) minmax(0, 1fr)" gap={24} align="start">
              <Stack gap={8}>
                <Text weight="semibold">PL/SQL report conversion effort, midpoint (person-days)</Text>
                <BarChart
                  height={280}
                  categories={TCO.map((r) => TOOLS[r.tool].short)}
                  series={[{
                    name: "Person-days",
                    data: TCO.map((r) => {
                      const [lo, hi] = migrationDays(r.personDays);
                      return (lo + hi) / 2;
                    }),
                  }]}
                />
                <Text size="small" tone="tertiary">X axis: option. Y axis: person-days to convert {MIGRATION.reports} PL/SQL report queries (midpoint of the low and high estimate). Source: person-days per report times {MIGRATION.reports} reports. Analysis, conversion, review, parity testing and cut-over.</Text>
              </Stack>
              <Stack gap={8}>
                <Text weight="semibold">5-year platform TCO by cost component (USD thousands)</Text>
                <BarChart
                  stacked
                  height={280}
                  valuePrefix="$"
                  valueSuffix="k"
                  categories={TCO.map((r) => TOOLS[r.tool].short)}
                  series={[
                    { name: "Licence / subscription", data: TCO.map((r) => r.licence) },
                    { name: "Infrastructure", data: TCO.map((r) => r.infra) },
                    { name: "Implementation services", data: TCO.map((r) => r.services) },
                  ]}
                />
                <Text size="small" tone="tertiary">X axis: option. Y axis: USD thousands over 5 years, the upper end of each estimate. Licence, infrastructure and services only. Conversion effort is not included. Indicative figures, not vendor quotes.</Text>
              </Stack>
            </Grid>
            <Table
              headers={["Option", "Days / report", "Person-days", "Person-years", "Platform TCO (USD k)", "FTE", "Notes"]}
              columnAlign={["left", "right", "right", "right", "right", "right", "left"]}
              rows={TCO.map((r) => {
                const [lo, hi] = migrationDays(r.personDays);
                const years = (n: number) => (n / MIGRATION.workingDays).toFixed(1);
                const money = (n: number) => Math.round(n).toLocaleString("en-US");
                const tco = r.licence + r.infra + r.services;
                const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
                return [
                  TOOLS[r.tool].name,
                  `${r.personDays[0]} - ${r.personDays[1]}`,
                  `${fmt(lo)} - ${fmt(hi)}`,
                  `${years(lo)} - ${years(hi)}`,
                  money(tco),
                  String(r.fte),
                  <span key="n" style={{ fontSize: 12, color: theme.text.secondary }}>{r.notes}</span>,
                ];
              })}
            />
            <Text size="small" tone="tertiary">Person-years use {MIGRATION.workingDays} working days per year, for staffing. Platform TCO excludes the conversion effort, which is scored in the Migration effort category.</Text>
            <Text size="small" weight="semibold">Assumptions</Text>
            <Bullets items={TCO_ASSUMPTIONS} />
          </Stack>
        ) : null}

        {tab === "Risks" ? (
          <Stack gap={8}>
            <H3>Key risks and mitigations</H3>
            <Table
              headers={["Applies to", "Risk", "Likelihood", "Impact", "Mitigation"]}
              rowTone={RISKS.map((r): TableRowTone => {
                const sc = LEVEL_VALUE[r.l] * LEVEL_VALUE[r.i];
                return sc >= 6 ? "danger" : sc >= 3 ? "warning" : "success";
              })}
              rows={RISKS.map((r) => [
                r.tool === "all" ? "All options" : TOOLS[r.tool].short,
                <span key="r" style={{ fontSize: 13 }}>{r.risk}</span>, r.l, r.i,
                <span key="m" style={{ fontSize: 12, color: theme.text.secondary }}>{r.m}</span>,
              ])}
            />
            <Text size="small" tone="tertiary">Row marker: red = high (likelihood x impact of 6 or more on a 1-3 scale), amber = medium (3-4), green = low.</Text>
          </Stack>
        ) : null}

        {tab === "Target architecture" ? (
          <Stack gap={16}>
            <Stack gap={6}>
              <H3>Reference data flow</H3>
              <ArchitectureDiagram />
            </Stack>
            <Grid columns="minmax(0, 1fr) minmax(0, 1fr)" gap={24} align="start">
              <Stack gap={6}>
                <H3>Logical layers</H3>
                <Table headers={["Layer", "Primary", "Alternative", "Notes"]} rows={LAYERS} />
              </Stack>
              <Stack gap={6}>
                <H3>Candidate options (one tool is selected)</H3>
                <Table
                  headers={["Option", "Position", "Pros", "Cons"]}
                  rowTone={STACKS.map((s, i): TableRowTone | undefined => (i < 2 ? "success" : STACK_NOT_RECOMMENDED[i] ? "danger" : undefined))}
                  rows={STACKS}
                />
              </Stack>
            </Grid>
            <Stack gap={6}>
              <H3>Phased roadmap</H3>
              <Table headers={["Phase", "Scope", "Exit criteria"]} rows={ROADMAP} />
            </Stack>
          </Stack>
        ) : null}
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H3>Method and sources</H3>
        <Text size="small" tone="secondary">
          Each criterion is scored from 1 (poor or not applicable) to 5 (excellent, native). A category score is the average of its criteria, and the weighted total is the SUMPRODUCT of category weights and category scores divided by the total weight. TCO, learning curve, maintenance effort and migration effort (converting the existing PL/SQL report queries) are scored inversely, so a higher score means lower cost or effort. The conversion effort is shown in person-days on the TCO tab and is not included in the TCO category score. Because only one tool is selected, each tool is scored on covering the whole requirement on its own, with GoldenGate for Oracle sources (ULA) and Exadata available to every option. The same model drives the Excel workbook `output/Takasbank_ETL_Comparison.xlsx`.
        </Text>
        <Table
          headers={["Item", "Note", "Verify with vendor"]}
          columnAlign={["left", "left", "center"]}
          rows={SOURCES.map(([item, note, verify]) => [item, <span key="n" style={{ fontSize: 12, color: theme.text.secondary }}>{note}</span>, verify ? "Verify" : "-"])}
        />
      </Stack>
    </Stack>
  );
}
