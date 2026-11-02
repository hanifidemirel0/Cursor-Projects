// Takasbank on-prem EDW — ETL / data-integration tool comparison.
// Desk assessment, 14 Oct 2026. Data mirrors outputs/etl-comparison/Takasbank-ETL-Tool-Comparison.xlsx
// and the vault note "ETL Tool Comparison".

import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  categoryPaletteDark,
  categoryPaletteLight,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Select,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
  useHostTheme,
  useMemo,
  type TableRowTone,
} from "cursor/canvas";

// ------------------------------------------------------------------ data

const TOOLS = ["ODI", "PowerCenter", "dbt Core", "Cloudera CDP", "Apache Spark"] as const;
type ToolIdx = 0 | 1 | 2 | 3 | 4;

const TOOL_SHAPE = [
  "Oracle Data Integrator 12c EE · ELT on Exadata · GoldenGate only for proven S0",
  "Informatica PowerCenter 10.5.x fully on-prem · PowerExchange CDC · Pushdown Optimization",
  "dbt Core + dbt-oracle · Git · external scheduler (TBD) · external tables / dblink from ADG standby / SQL*Loader",
  "CDP Private Cloud Base 7.x · NiFi, Spark, Hive/Impala, Ranger, Atlas · JDBC bridge to Exadata",
  "Spark 3.5/4.x on bank-run cluster · Airflow · custom ingestion, CDC, catalog, security",
];

type Criterion = { id: string; name: string; short: string; weight: number; ratings: number[] };
const CRITERIA: Criterion[] = [
  { id: "C1", name: "Oracle / Exadata architectural fit", short: "Exadata fit", weight: 14, ratings: [5, 3, 4.5, 1.5, 1.5] },
  { id: "C2", name: "Source connectivity and ingestion", short: "Connectivity", weight: 10, ratings: [4, 5, 3, 4, 3] },
  { id: "C3", name: "Change capture and latency classes (S0/S1/S2)", short: "CDC & latency", weight: 10, ratings: [3, 3.5, 2, 2.5, 2] },
  { id: "C4", name: "Transformation depth and data correctness", short: "Transformation", weight: 12, ratings: [4, 4, 4, 3, 3] },
  { id: "C5", name: "Orchestration, operational-report SLA and recovery", short: "Orchestration", weight: 10, ratings: [4, 4, 2.5, 3, 2] },
  { id: "C6", name: "Security, metadata, lineage and audit", short: "Security & lineage", weight: 10, ratings: [3, 4, 3.5, 4.5, 1.5] },
  { id: "C7", name: "Developer experience and change management", short: "Dev experience", weight: 8, ratings: [3, 2.5, 5, 3.5, 4] },
  { id: "C8", name: "Team fit and skills", short: "Team fit", weight: 10, ratings: [4, 3, 3.5, 1.5, 1.5] },
  { id: "C9", name: "Operating burden, HA/DR, support and roadmap risk", short: "Ops & roadmap", weight: 8, ratings: [4, 2, 3, 2, 1.5] },
  { id: "C10", name: "Five-year TCO and procurement friction", short: "TCO", weight: 8, ratings: [2, 2.5, 4.5, 1.5, 3] },
];

type Scenario = { id: string; label: string; weights: number[] };
const SCENARIOS: Scenario[] = [
  { id: "baseline", label: "Baseline (architect's weights)", weights: [14, 10, 10, 12, 10, 10, 8, 10, 8, 8] },
  { id: "cost", label: "Cost-constrained (TCO 20%)", weights: [12, 8, 8, 10, 8, 8, 8, 10, 8, 20] },
  { id: "realtime", label: "Real-time heavy (CDC 20%)", weights: [12, 10, 20, 10, 12, 8, 6, 8, 8, 6] },
  { id: "governance", label: "Governance / audit heavy (20%)", weights: [12, 8, 8, 12, 8, 20, 8, 8, 8, 8] },
  { id: "team", label: "Team-fit heavy (20%)", weights: [12, 8, 8, 10, 8, 8, 8, 20, 10, 8] },
  { id: "engineering", label: "Engineering-culture heavy (18%)", weights: [12, 8, 8, 12, 8, 8, 18, 8, 8, 10] },
];

type GateStatus = "Pass" | "Conditional" | "Fail";
type Gate = { id: string; name: string; status: GateStatus[]; note: string[] };
const GATES: Gate[] = [
  {
    id: "G1",
    name: "Fully on-premises; no data egress; no cloud control plane",
    status: ["Pass", "Conditional", "Pass", "Conditional", "Pass"],
    note: [
      "Install-only; disable OCI telemetry.",
      "Classic PowerCenter only. CDI-PC / IDMC (cloud control plane) fails even though data stays local.",
      "dbt Core passes; dbt Cloud fails; private PyPI mirror.",
      "PvC Base passes; cloud/SaaS forms fail; verify licence call-home.",
      "Self-hosted.",
    ],
  },
  {
    id: "G2",
    name: "Exadata is source and target; set-based execution inside the database",
    status: ["Pass", "Conditional", "Pass", "Fail", "Fail"],
    note: [
      "Native ELT.",
      "Needs Pushdown Optimization and proof that reject handling / restart still pass.",
      "Native pushdown.",
      "Cluster-centric; only an upstream/adjacent platform.",
      "Engine-centric; cannot be the transformation layer for an Oracle target.",
    ],
  },
  {
    id: "G3",
    name: "Supportable without a 7/24 platform team",
    status: ["Pass", "Conditional", "Conditional", "Fail", "Fail"],
    note: [
      "Oracle support + local partners; DBAs own agents and repository.",
      "Written 5-year on-prem support horizon required.",
      "Partner support contract and an internal framework owner required.",
      "Requires a cluster team the bank does not have.",
      "Requires a platform-engineering team; no vendor.",
    ],
  },
  {
    id: "G4",
    name: "Integrates with Oracle TDE/VPD/Redaction/Unified Audit, secrets, auditability",
    status: ["Pass", "Pass", "Pass", "Pass", "Conditional"],
    note: [
      "Wallet, security profiles, OEM audit.",
      "LDAP/Kerberos, audit logs; TDM already in use.",
      "Enforcement stays in Oracle; wallet/env secrets; audited service account.",
      "Ranger/Atlas/Knox strong, but a second security domain.",
      "Must be assembled by the bank.",
    ],
  },
];

type Label = "Native" | "Partial" | "Add-on" | "Custom" | "No";
type CapGroup = { group: string; rows: { name: string; cells: Label[] }[] };
const CAPS: CapGroup[] = [
  {
    group: "Connectivity and ingestion",
    rows: [
      { name: "Oracle source/target (ADG standby → DWH)", cells: ["Native", "Native", "Native", "Native", "Native"] },
      { name: "SCN-consistent multi-table extraction", cells: ["Partial", "Partial", "Partial", "Custom", "Custom"] },
      { name: "CSV ingestion with manifest, checksum, quarantine", cells: ["Native", "Native", "Partial", "Native", "Custom"] },
      { name: "FTP/SFTP polling", cells: ["Native", "Native", "Custom", "Native", "Custom"] },
      { name: "REST/SOAP web services (EPİAŞ)", cells: ["Partial", "Native", "Custom", "Native", "Custom"] },
      { name: "Postgres / MSSQL sources", cells: ["Native", "Native", "Add-on", "Native", "Native"] },
      { name: "File outputs to members / Verda", cells: ["Native", "Native", "Custom", "Native", "Partial"] },
    ],
  },
  {
    group: "Change capture and latency",
    rows: [
      { name: "Log-based Oracle CDC (S0)", cells: ["Add-on", "Add-on", "Add-on", "Add-on", "Add-on"] },
      { name: "Consume GoldenGate-landed change tables", cells: ["Native", "Partial", "Native", "Partial", "Partial"] },
      { name: "Intraday micro-batch with watermark (S1)", cells: ["Native", "Native", "Native", "Partial", "Partial"] },
      { name: "End-of-day batch driven by completion event (S2)", cells: ["Native", "Native", "Native", "Partial", "Partial"] },
      { name: "Backfill / replay with separate load id (S4)", cells: ["Native", "Native", "Native", "Partial", "Partial"] },
    ],
  },
  {
    group: "Transformation and correctness",
    rows: [
      { name: "Set-based SQL inside Exadata (pushdown)", cells: ["Native", "Add-on", "Native", "No", "No"] },
      { name: "MERGE / incremental update", cells: ["Native", "Native", "Native", "Native", "Native"] },
      { name: "SCD Type 2 history", cells: ["Native", "Native", "Native", "Partial", "Custom"] },
      { name: "Bitemporal patterns", cells: ["Custom", "Custom", "Custom", "Custom", "Custom"] },
      { name: "Data-quality rules with error tables", cells: ["Native", "Add-on", "Native", "Native", "Custom"] },
      { name: "Partition exchange / direct-path bulk load", cells: ["Native", "Partial", "Partial", "No", "No"] },
      { name: "Reuse of existing PL/SQL procedures", cells: ["Native", "Partial", "Native", "No", "No"] },
    ],
  },
  {
    group: "Orchestration and operations",
    rows: [
      { name: "Built-in scheduler / load plans with restart", cells: ["Native", "Native", "No", "Native", "No"] },
      { name: "Callable from an external scheduler (CLI/REST)", cells: ["Native", "Native", "Native", "Native", "Native"] },
      { name: "Run-time HA", cells: ["Native", "Add-on", "No", "Native", "Custom"] },
      { name: "Publication gate blocking release on red reconciliation", cells: ["Custom", "Custom", "Custom", "Custom", "Custom"] },
    ],
  },
  {
    group: "Security, metadata, lineage",
    rows: [
      { name: "Works with Oracle VPD / Redaction / TDE / Unified Audit", cells: ["Native", "Native", "Native", "Partial", "Partial"] },
      { name: "Metadata repository / catalog", cells: ["Native", "Native", "Partial", "Native", "No"] },
      { name: "Column-level lineage export for regulators", cells: ["Partial", "Add-on", "Partial", "Native", "No"] },
      { name: "Non-prod masking", cells: ["Add-on", "Native", "Add-on", "Native", "Custom"] },
    ],
  },
  {
    group: "Development and commercial",
    rows: [
      { name: "Git-native development", cells: ["Partial", "No", "Native", "Partial", "Native"] },
      { name: "Automated tests (schema, data, unit)", cells: ["Partial", "Add-on", "Native", "Partial", "Partial"] },
      { name: "Visual mapping designer", cells: ["Native", "Native", "No", "Partial", "No"] },
      { name: "Open-source core", cells: ["No", "No", "Native", "Partial", "Native"] },
      { name: "Vendor support with presence in Türkiye", cells: ["Native", "Native", "Partial", "Native", "No"] },
      { name: "Can start without procurement", cells: ["No", "No", "Native", "No", "Native"] },
      { name: "Distributed ML / lakehouse workloads", cells: ["No", "No", "No", "Native", "Native"] },
    ],
  },
];

type Fit = "Strong" | "Good" | "Fair" | "Weak" | "Poor" | "N/A";
type UseCase = { id: string; name: string; latency: string; fit: Fit[]; note: string };
const USECASES: UseCase[] = [
  { id: "UC1", name: "SWIFT legal reports — Pilot A", latency: "S2 end-of-day, T-1 · 1M msg/day · 2B rows / 170 GB → ~24M", fit: ["Strong", "Good", "Strong", "Weak", "Weak"], note: "Pure SQL summarisation on Exadata; cluster options export 170 GB for a regex job Oracle does in place." },
  { id: "UC2", name: "BISTECH SPK 13 reports — Pilot B", latency: "S2 after end-of-day signal · Kale NOMX + BIST Replica BIDB", fit: ["Strong", "Good", "Good", "Weak", "Weak"], note: "Load Plans map to the step chain; dbt needs Replica BIDB landed first." },
  { id: "UC3", name: "Fon Bilgilendirme Platformu", latency: "S1 intraday 08:00–17:45 with corrections · ~60k/day", fit: ["Good", "Good", "Good", "Fair", "Fair"], note: "Micro-batch with recompute-by-fund keys; CDC not required if a reliable change timestamp exists — verify." },
  { id: "UC4", name: "Fon İşlem Defterleri — Verda files", latency: "S1 · 9M contracts/day → 600k · files twice daily per market", fit: ["Strong", "Strong", "Fair", "Good", "Fair"], note: "File-heavy; dbt needs a file writer; NiFi delivers files well but computation belongs in Oracle." },
  { id: "UC5", name: "Intraday 'izleme' screens, Team Developer", latency: "S0/S1 raw current state", fit: ["N/A", "N/A", "N/A", "N/A", "N/A"], note: "Not an ETL problem: Active Data Guard read-only standby. GoldenGate only for a proven integrated S0 product." },
  { id: "UC6", name: "Hour-SLA regulatory outputs (SPK, MASAK, BDDK, Hazine)", latency: "S2 with hard deadline · cross-market", fit: ["Strong", "Good", "Good", "Fair", "Weak"], note: "Deadline lives in the DWH scheduler; restart and reconciliation gate decide." },
  { id: "UC7", name: "Member file deliveries", latency: "S2 / scheduled · many files to many members", fit: ["Strong", "Strong", "Fair", "Good", "Fair"], note: "As UC4: file generation and delivery proof favour ODI / PowerCenter / NiFi." },
  { id: "UC8", name: "Archive offload banka → banka_old → arşiv (HCC)", latency: "S2 yearly/monthly · retire ~3,000 backup tables", fit: ["Strong", "Fair", "Strong", "Poor", "Poor"], note: "Oracle-to-Oracle bulk with partition exchange; a lake contradicts the target." },
  { id: "UC9", name: "AI / ML feature preparation (future)", latency: "S2 batch · Oracle 23ai in-database ML", fit: ["Fair", "Fair", "Good", "Strong", "Strong"], note: "Only area where cluster options lead; no business case yet." },
];

type Risk = { who: string; risk: string; l: "Low" | "Medium" | "High"; i: "Low" | "Medium" | "High"; rule: string };
const RISKS: Risk[] = [
  { who: "ODI", risk: "Processor licence on Exadata cores exceeds budget", l: "Medium", i: "High", rule: "Quote with target-core definition; capacity-on-demand; bundle with Oracle renewal." },
  { who: "ODI", risk: "Oracle de-prioritises on-prem ODI for OCI DI", l: "Medium", i: "Medium", rule: "Lifecycle dates in contract; keep SQL/models portable; Git export." },
  { who: "PowerCenter", risk: "On-prem edition reaches end of support within DWH lifetime", l: "High", i: "High", rule: "No selection without a written 5-year commitment." },
  { who: "PowerCenter", risk: "Successor CDI-PC requires a cloud control plane", l: "High", i: "High", rule: "CDI-PC out of scope (G1)." },
  { who: "dbt Core", risk: "Framework gaps (ingestion, files, publication gate) underestimated", l: "Medium", i: "High", rule: "Scope framework explicitly in Pilot A; time-box the build." },
  { who: "dbt Core", risk: "No vendor SLA for adapter incidents", l: "Medium", i: "Medium", rule: "Partner contract; pinned versions; adapter is thin and forkable." },
  { who: "dbt Core", risk: "Code-first rejected by UG analyst culture", l: "Medium", i: "Medium", rule: "Pair UG analysts with engineers; dbt docs as the shared artefact; measure in pilot." },
  { who: "Cloudera", risk: "Second platform for 10 TB of Oracle data", l: "High", i: "High", rule: "Do not adopt as ETL; revisit only with a funded lake/AI programme." },
  { who: "Spark", risk: "Bank becomes its own platform vendor", l: "High", i: "High", rule: "Do not adopt standalone." },
  { who: "All", risk: "GoldenGate licence / ADG mode assumptions turn out false", l: "Medium", i: "High", rule: "Verify with DBA before any S0 commitment (Aktif Sorular 14.1–14.2)." },
  { who: "All", risk: "Tool purchase blocks the first business outcome", l: "High", i: "High", rule: "Start Pilot A with the no-procurement option; decide at Pilot B exit gate." },
];

const VERDICT = [
  "Lead commercial candidate — eligible on all four gates.",
  "Challenger only with a written 5-year on-prem commitment for a fully local edition.",
  "Lead no-procurement candidate; viable long term if the team sustains code-first discipline.",
  "Not for EDW/ETL — second estate for 10 TB of Oracle data. Keep on file for a funded lake/AI programme.",
  "Not as a standalone product — engine only inside a platform.",
];

// ------------------------------------------------------------------ helpers

function points(weights: number[]): number[] {
  return TOOLS.map((_, t) =>
    CRITERIA.reduce((s, c, i) => s + (weights[i] * c.ratings[t]) / 5, 0),
  );
}

function gateOutcome(t: ToolIdx): "Eligible" | "Conditional" | "Eliminated" {
  const st = GATES.map((g) => g.status[t]);
  if (st.includes("Fail")) return "Eliminated";
  if (st.includes("Conditional")) return "Conditional";
  return "Eligible";
}

function toneForOutcome(o: string): TableRowTone {
  if (o === "Eligible" || o === "Pass" || o === "Strong") return "success";
  if (o === "Conditional" || o === "Good" || o === "Fair") return "warning";
  if (o === "Eliminated" || o === "Fail" || o === "Weak" || o === "Poor") return "danger";
  return "neutral";
}

function LabelCell({ value }: { value: string }) {
  const theme = useHostTheme();
  const hues = theme.kind === "light" ? categoryPaletteLight : categoryPaletteDark;
  const color =
    value === "Native" || value === "Pass" || value === "Strong" || value === "Eligible"
      ? hues.green
      : value === "Partial" || value === "Conditional" || value === "Good" || value === "Fair" || value === "Medium"
        ? hues.yellow
        : value === "Add-on" || value === "Custom" || value === "Weak"
          ? hues.orange
          : value === "No" || value === "Fail" || value === "Poor" || value === "High" || value === "Eliminated"
            ? hues.red
            : theme.text.tertiary;
  const weight = value === "Native" || value === "Pass" || value === "Strong" || value === "Fail" || value === "Eliminated" ? "semibold" : "normal";
  return (
    <Text as="span" weight={weight} style={{ color }}>
      {value}
    </Text>
  );
}

function fmt(n: number): string {
  return n.toFixed(1);
}

// ------------------------------------------------------------------ sections

function Overview({ pts }: { pts: number[] }) {
  const theme = useHostTheme();
  const order = [...TOOLS.keys()].sort((a, b) => pts[b] - pts[a]);
  return (
    <Stack gap={20}>
      <Callout tone="info" title="How to read this">
        The decision is not “which ETL tool is best”. It is which complete, supportable, fully on-premises service moves and
        transforms Oracle-heavy data into an Exadata EDW with the team Takasbank has, while intraday operational reporting is
        served from the Active Data Guard standby. Tools that execute SQL inside Exadata (ODI, dbt, PowerCenter with pushdown)
        and platforms that move data out to a second estate (Cloudera, Spark) are two different answers.
      </Callout>

      <Grid columns="3fr 2fr" gap={20} align="start">
        <Stack gap={8}>
          <H3>Weighted score, baseline weights (points out of 100)</H3>
          <BarChart
            categories={[...TOOLS]}
            series={[{ name: "Points / 100", data: pts.map((p) => Math.round(p * 10) / 10) }]}
            horizontal
            height={220}
            yMax={100}
            showValues
            referenceLines={[{ value: 70, label: "shortlist line", tone: "neutral" }]}
          />
          <Text size="small" tone="tertiary">
            Source: architect desk assessment, 14 Oct 2026 · Σ(weight × rating ÷ 5) across 10 criteria · gates not netted in.
          </Text>
        </Stack>
        <Stack gap={8}>
          <H3>Gate outcome</H3>
          <Table
            headers={["Candidate", "Outcome", "Why"]}
            rows={TOOLS.map((name, t) => [
              name,
              <LabelCell key={name} value={gateOutcome(t as ToolIdx)} />,
              t === 0
                ? "All four gates pass"
                : t === 1
                  ? "G1/G2/G3 conditional: local edition, pushdown, support horizon"
                  : t === 2
                    ? "G3 conditional: partner support contract"
                    : "Fails G2 (Exadata pushdown) and G3 (platform team)",
            ])}
            rowTone={TOOLS.map((_, t) => toneForOutcome(gateOutcome(t as ToolIdx)))}
          />
        </Stack>
      </Grid>

      <H2>Verdicts</H2>
      <Grid columns={5} gap={12} align="stretch">
        {order.map((t, rank) => (
          <Card key={TOOLS[t]} variant={rank === 0 ? "default" : "borderless"} style={rank === 0 ? undefined : { background: theme.fill.quaternary, borderRadius: 6 }}>
            <CardHeader trailing={<Text size="small" tone="secondary">{fmt(pts[t])}</Text>}>{`#${rank + 1} ${TOOLS[t]}`}</CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small" weight="semibold">{VERDICT[t]}</Text>
                <Text size="small" tone="tertiary">{TOOL_SHAPE[t]}</Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <H2>Recommended path</H2>
      <Grid columns={2} gap={20} align="start">
        <Stack gap={6}>
          <Text><Text weight="semibold">1.</Text> Start Pilot A (SWIFT legal reports) now with the no-procurement package: dbt Core + dbt-oracle or a PL/SQL framework, Git, the selected scheduler, external tables, SCN-consistent extraction from the standby.</Text>
          <Text><Text weight="semibold">2.</Text> Run the ODI track in parallel: RFI, quote with the Exadata core definition, PoC P01–P12 on DSS with the SWIFT and BISTECH workloads.</Text>
          <Text><Text weight="semibold">3.</Text> Keep PowerCenter in the RFI only until the on-prem support horizon is answered in writing.</Text>
          <Text><Text weight="semibold">4.</Text> Close Cloudera and Spark for this programme (G2/G3); keep the Cloudera profile for a future lake/AI programme.</Text>
          <Text><Text weight="semibold">5.</Text> Decide ODI vs dbt package at the Pilot B exit gate with measured evidence; record it in the decision record.</Text>
          <Text><Text weight="semibold">6.</Text> Decide real-time separately: ADG standby verification first, GoldenGate only for a product with a proven S0 SLA and a confirmed licence.</Text>
        </Stack>
        <Callout tone="warning" title="Decision rules at the Pilot B gate">
          <Stack gap={4}>
            <Text size="small">ODI — if the quote is within budget, pushdown and restart tests pass, and the team prefers the visual/KM model after one pilot on dbt.</Text>
            <Text size="small">dbt package — if the ODI quote is disproportionate to a 10 TB estate, or the team sustained Git/test discipline through both pilots and the framework gaps proved small.</Text>
            <Text size="small">Hybrid (ODI for landing/files/orchestration, dbt for CORE/DM) only if a specific gap in the winner is proven — it doubles metadata.</Text>
          </Stack>
        </Callout>
      </Grid>
    </Stack>
  );
}

function Scorecard() {
  const [scenarioId, setScenarioId] = useCanvasState<string>("etl-scenario", "baseline");
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const pts = useMemo(() => points(scenario.weights), [scenario]);
  const leader = pts.indexOf(Math.max(...pts));
  const allScen = useMemo(() => SCENARIOS.map((s) => ({ s, p: points(s.weights) })), []);

  return (
    <Stack gap={20}>
      <Row gap={12} align="center" wrap>
        <Text weight="semibold">Weight scenario</Text>
        <Select
          value={scenarioId}
          onChange={setScenarioId}
          options={SCENARIOS.map((s) => ({ value: s.id, label: s.label }))}
          style={{ minWidth: 280 }}
        />
        <Text size="small" tone="tertiary">Ratings are fixed (0–5); only weights change. Σ weights = {scenario.weights.reduce((a, b) => a + b, 0)}.</Text>
      </Row>

      <Row gap={24} wrap>
        {TOOLS.map((name, t) => (
          <Stat key={name} value={fmt(pts[t])} label={name} tone={t === leader ? "success" : undefined} />
        ))}
      </Row>

      <H3>Ratings per criterion (0–5) — all five candidates</H3>
      <BarChart
        categories={CRITERIA.map((c) => c.short)}
        series={TOOLS.map((name, t) => ({ name, data: CRITERIA.map((c) => c.ratings[t]) }))}
        height={260}
        yMax={5}
        showValues={false}
      />
      <Text size="small" tone="tertiary">X: criterion · Y: rating (0–5) · Source: desk assessment, 14 Oct 2026; rationale per cell in the workbook sheet “Criteria Detail”.</Text>

      <H3>Scorecard — {scenario.label}</H3>
      <Table
        headers={["ID", "Criterion", "Weight %", ...TOOLS.map((t) => `${t} (rating → pts)`)]}
        rows={[
          ...CRITERIA.map((c, i) => [
            c.id,
            c.name,
            String(scenario.weights[i]),
            ...TOOLS.map((_, t) => `${c.ratings[t]} → ${fmt((scenario.weights[i] * c.ratings[t]) / 5)}`),
          ]),
          ["", "Total points / 100", String(scenario.weights.reduce((a, b) => a + b, 0)), ...pts.map((p) => fmt(p))],
        ]}
        columnAlign={["left", "left", "right", "right", "right", "right", "right", "right"]}
        striped
      />

      <H3>Sensitivity — leader under each weight scenario</H3>
      <Table
        headers={["Scenario", ...TOOLS, "Leader"]}
        rows={allScen.map(({ s, p }) => {
          const max = Math.max(...p);
          const leaders = TOOLS.filter((_, t) => Math.abs(p[t] - max) < 0.05);
          return [s.label, ...p.map((v) => fmt(v)), leaders.join(" / ")];
        })}
        columnAlign={["left", "right", "right", "right", "right", "right", "left"]}
      />
      <Callout tone="neutral">
        The ODI-versus-dbt ranking is not robust to priorities and must be settled by the pilots and the ODI quote. The order
        PowerCenter (3rd), Cloudera (4th), Spark (5th) holds under every scenario.
      </Callout>
    </Stack>
  );
}

function GatesAndCapabilities() {
  return (
    <Stack gap={20}>
      <H3>Mandatory gates (pass/fail, outside the weighted score)</H3>
      <Table
        headers={["ID", "Gate", ...TOOLS]}
        rows={GATES.map((g) => [g.id, g.name, ...g.status.map((s, t) => <LabelCell key={`${g.id}-${t}`} value={s} />)])}
        columnAlign={["left", "left", "center", "center", "center", "center", "center"]}
      />
      <Stack gap={4}>
        {GATES.map((g) => (
          <CollapsibleSection key={g.id} title={`${g.id} — conditions and evidence`} count={5}>
            <Table
              headers={["Candidate", "Status", "Condition / evidence"]}
              rows={TOOLS.map((name, t) => [name, <LabelCell key={name} value={g.status[t]} />, g.note[t]])}
              framed={false}
            />
          </CollapsibleSection>
        ))}
      </Stack>

      <Divider />

      <H3>Capability matrix</H3>
      <Text size="small" tone="tertiary">
        Native = built in and production-grade · Partial = built in with gaps · Add-on = separate licensed/installed product ·
        Custom = must be engineered by the bank · No = not available / out of scope. Supporting evidence, not separately weighted.
      </Text>
      <Row gap={24} wrap>
        {TOOLS.map((name, t) => {
          const all = CAPS.flatMap((g) => g.rows.map((r) => r.cells[t]));
          const native = all.filter((c) => c === "Native").length;
          return <Stat key={name} value={`${native}/${all.length}`} label={`${name} — native capabilities`} />;
        })}
      </Row>
      <Stack gap={4}>
        {CAPS.map((g) => (
          <CollapsibleSection key={g.group} title={g.group} count={g.rows.length} defaultOpen={g.group.startsWith("Transformation")}>
            <Table
              headers={["Capability", ...TOOLS]}
              rows={g.rows.map((r) => [r.name, ...r.cells.map((c, t) => <LabelCell key={`${r.name}-${t}`} value={c} />)])}
              columnAlign={["left", "center", "center", "center", "center", "center"]}
              framed={false}
            />
          </CollapsibleSection>
        ))}
      </Stack>
    </Stack>
  );
}

function UseCases() {
  return (
    <Stack gap={20}>
      <Callout tone="info" title="Real-time reporting is decided separately from the ETL tool">
        Raw intraday current-state screens go to the Active Data Guard read-only standby. Integrated near-real-time products,
        if any prove an SLA, need GoldenGate regardless of ETL tool. None of the five candidates is a CDC product; the
        comparison scores how well each consumes change data and runs intraday micro-batches.
      </Callout>
      <H3>Fit against Takasbank workloads</H3>
      <Table
        headers={["ID", "Workload", "Latency / facts", ...TOOLS, "Architect's comment"]}
        rows={USECASES.map((u) => [
          u.id,
          u.name,
          u.latency,
          ...u.fit.map((f, t) => <LabelCell key={`${u.id}-${t}`} value={f} />),
          u.note,
        ])}
        columnAlign={["left", "left", "left", "center", "center", "center", "center", "center", "left"]}
        striped
      />
      <H3>Latency class coverage</H3>
      <Table
        headers={["Class", ...TOOLS]}
        rows={[
          ["S0 near-real-time integrated state", "Needs GoldenGate (JKM GG)", "PowerExchange CDC (add-on)", "Needs GoldenGate landing", "Kafka/NiFi plumbing; Oracle CDC still needs GG", "Needs Kafka + CDC producer"],
          ["S1 intraday micro-batch", "Load Plans on schedule; watermark", "Scheduled workflows; watermark or CDC", "Externally scheduled incremental runs", "NiFi/Spark scheduled", "Airflow-scheduled jobs"],
          ["S2 end-of-day", "Native", "Native", "Native", "Possible, round trip", "Possible, round trip"],
          ["S3 planned file / external feeds", "Native", "Native", "External tables / SQL*Loader", "NiFi native", "Custom"],
          ["S4 backfill / replay", "Load Plan with load-id variable", "Workflow parameters", "Full-refresh / vars with load id", "Rerun jobs", "Rerun jobs"],
        ]}
      />
    </Stack>
  );
}

function RisksAndPoC() {
  return (
    <Stack gap={20}>
      <H3>Risk register (top items)</H3>
      <Table
        headers={["Candidate", "Risk", "L", "I", "Mitigation / decision rule"]}
        rows={RISKS.map((r) => [r.who, r.risk, <LabelCell key={`${r.risk}-l`} value={r.l} />, <LabelCell key={`${r.risk}-i`} value={r.i} />, r.rule])}
        columnAlign={["left", "left", "center", "center", "left"]}
        rowTone={RISKS.map((r) => (r.l === "High" && r.i === "High" ? "danger" : r.i === "High" ? "warning" : undefined))}
        striped
      />
      <H3>Proof-of-concept protocol (DSS, ADG standby as source)</H3>
      <Table
        headers={["Test", "Name", "Pass criterion", "Gate"]}
        rows={[
          ["P01", "Disconnected operation", "Full load plan runs with outbound internet blocked; no telemetry/licence calls required", "G1"],
          ["P02", "SCN-consistent extraction from standby", "Five related tables AS OF one SCN; counts and FK integrity match; no load on prod", "—"],
          ["P03", "Exadata pushdown efficiency (SWIFT 250M rows)", "≥90% of DB time inside Oracle; within window; no row-by-row movement", "G2"],
          ["P04", "Restart after partial failure", "Restart from failed step; no duplicates; no manual cleanup", "—"],
          ["P05", "Late correction and bitemporal history", "Old system version closed, new inserted; marts reflect it; replay identical", "—"],
          ["P06", "Replay / backfill from landing", "Idempotent re-run with new load id; prior publication versions preserved", "—"],
          ["P07", "Intraday micro-batch (Fon Bilgilendirme)", "15-minute freshness; only corrected funds recomputed", "—"],
          ["P08", "File-heavy workload (Fon İşlem Defterleri)", "Ledger files byte-compare with legacy output; delivery proof recorded", "—"],
          ["P09", "Security integration", "Least-privilege account; VPD/Redaction respected; secret rotation; audit export", "G4"],
          ["P10", "Lineage export", "Column-level source-to-report lineage for one SPK report, generated", "—"],
          ["P11", "Scheduler integration and end-of-day event", "Start/stop/status round trip; failure visible in the DWH scheduler within 1 minute", "—"],
          ["P12", "Operate for 10 days", "Bank DBA team runs the chain daily with the runbook, without vendor; MTTR recorded", "G3"],
        ]}
        columnAlign={["left", "left", "left", "center"]}
      />
    </Stack>
  );
}

// ------------------------------------------------------------------ root

const TABS = ["Overview", "Scorecard", "Gates & capabilities", "Use cases", "Risks & PoC"] as const;
type Tab = (typeof TABS)[number];

export default function TakasbankEtlToolComparison() {
  const [tab, setTab] = useCanvasState<Tab>("etl-tab", "Overview");
  const basePts = useMemo(() => points(SCENARIOS[0].weights), []);
  const eligible = TOOLS.filter((_, t) => gateOutcome(t as ToolIdx) !== "Eliminated").length;

  return (
    <Stack gap={20} style={{ padding: 24, maxWidth: 1400 }}>
      <Stack gap={6}>
        <H1>Takasbank on-prem EDW — ETL / data-integration tool comparison</H1>
        <Text tone="secondary">
          Oracle Data Integrator · Informatica PowerCenter · dbt Core (+ dbt-oracle) · Cloudera Data Platform · Apache Spark —
          evaluated as complete solutions for an Oracle Exadata warehouse with heavy operational and intraday reporting.
        </Text>
        <Row gap={24} wrap align="center">
          <Stat value={fmt(basePts[0])} label="ODI — leader, baseline weights" tone="success" />
          <Stat value={fmt(basePts[2])} label="dbt Core package — no-procurement option" />
          <Stat value={`${eligible} / 5`} label="candidates not eliminated by gates" />
          <Stat value="2" label="gates failed by Cloudera and Spark (G2, G3)" tone="danger" />
        </Row>
        <Text size="small" tone="tertiary">
          Desk assessment by the principal DWH architect, 14 Oct 2026 · no product installed, tested or quoted at Takasbank ·
          data mirrors Takasbank-ETL-Tool-Comparison.xlsx and the vault note “ETL Tool Comparison”.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <Pill key={t} active={t === tab} onClick={() => setTab(t)}>
            {t}
          </Pill>
        ))}
      </Row>

      {tab === "Overview" && <Overview pts={basePts} />}
      {tab === "Scorecard" && <Scorecard />}
      {tab === "Gates & capabilities" && <GatesAndCapabilities />}
      {tab === "Use cases" && <UseCases />}
      {tab === "Risks & PoC" && <RisksAndPoC />}
    </Stack>
  );
}
