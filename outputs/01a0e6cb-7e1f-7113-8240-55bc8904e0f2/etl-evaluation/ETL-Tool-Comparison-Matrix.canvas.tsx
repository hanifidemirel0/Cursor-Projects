// Source of the Cursor canvas "ETL Tool Comparison Matrix — Takasbank".
// Live canvas: https://cursor.com/canvas/store-c51f9d48-85cf-4b41-b001-38182c25e2b0/f187495b-c946-4d33-9346-09a13473eda3
// This file is a committed copy for versioning; the canvas store serves the rendered app.
// Data mirrors ETL-Tool-Comparison-Matrix.xlsx (desk assessment, 12 Oct 2026).

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
  useHostTheme,
  useCanvasState,
  type CSSProperties,
} from "cursor/canvas";

// ---------- data (desk assessment, 12 Oct 2026; mirrors ETL-Tool-Comparison-Matrix.xlsx) ----------

const TOOLS = ["ODI", "PowerCenter", "dbt Core", "Cloudera", "Spark"] as const;
const TOOL_FULL = [
  "Oracle Data Integrator",
  "Informatica PowerCenter (fully local)",
  "dbt Core v1 + dbt-oracle",
  "Cloudera Data Platform (on premises)",
  "Apache Spark (on premises)",
];

type Criterion = { id: string; name: string; weight: number; ratings: (number | null)[] };
const CRITERIA: Criterion[] = [
  { id: "03", name: "Source integration and data movement", weight: 9.35, ratings: [4, 4, 2, 3, 2] },
  { id: "04", name: "Transformation and Exadata efficiency", weight: 11.05, ratings: [4, 3, 4, 2, 2] },
  { id: "05", name: "Data correctness, history and reconciliation", weight: 17.0, ratings: [3.5, 3, 3, 2.5, 2.5] },
  { id: "06", name: "Scheduling, operational reporting and recovery", weight: 10.2, ratings: [4, 3.5, 2.5, 2.5, 2] },
  { id: "07", name: "Security, metadata and auditability", weight: 13.6, ratings: [3, 3, 2.5, 3.5, 2] },
  { id: "08", name: "Development, testing and change management", weight: 5.95, ratings: [3, 2.5, 4, 3, 3.5] },
  { id: "09", name: "Operating model, support and lifecycle", weight: 9.35, ratings: [4, 3, 2, 2, 1.5] },
  { id: "10", name: "Five-year cost and exit effort", weight: 8.5, ratings: [null, null, null, null, null] },
  { id: "12", name: "AI integration (local only)", weight: 8.0, ratings: [2, 2, 3, 3, 3] },
  { id: "13", name: "Open-source licensing and flexibility", weight: 7.0, ratings: [2, 2, 4, 3, 4] },
];

const ASSESSED_WEIGHT = CRITERIA.filter((c) => c.ratings[0] !== null).reduce((s, c) => s + c.weight, 0);
const POINTS = TOOLS.map((_, t) =>
  CRITERIA.reduce((s, c) => s + (c.ratings[t] === null ? 0 : (c.weight * (c.ratings[t] as number)) / 5), 0),
);
const FIT = POINTS.map((p) => (p / ASSESSED_WEIGHT) * 100);
const LEADS = TOOLS.map((_, t) =>
  CRITERIA.filter((c) => c.ratings[t] !== null).filter((c) => {
    const max = Math.max(...(c.ratings.filter((r) => r !== null) as number[]));
    return c.ratings[t] === max;
  }).length,
);

type Gate = { gate: string; evidence: string; cells: string[] };
const GATES: Gate[] = [
  {
    gate: "Fully on-premises operation",
    evidence: "P01 disconnected operation",
    cells: [
      "Pending",
      "Pending — CDI-PC / IDMC control plane fails this gate; only a fully local PowerCenter offer is evaluable",
      "Pending — telemetry off, package mirror, no cloud MCP tools",
      "Pending — every optional service must be inspected, not just Base",
      "Pending — every surrounding component must be inspected",
    ],
  },
  {
    gate: "Security, support and operating acceptance",
    evidence: "P11, P12",
    cells: [
      "Pending — exact-release support, DBA/ETL responsibility split",
      "Pending — written local-product roadmap and support horizon",
      "Pending — Oracle-maintained adapter is not an incident SLA; support route required",
      "Pending — cluster team and on-call must exist",
      "Pending — bank or provider must own every component",
    ],
  },
  {
    gate: "Correctness, deadlines and recovery tests",
    evidence: "P04–P07, P09",
    cells: [
      "Pending — restart after partial commit",
      "Pending — full pushdown changes reject/recovery behaviour",
      "Pending — ingestion + tests + publication, not only dbt run",
      "Pending — cluster → Oracle handoff",
      "Pending — at-least-once sinks must not duplicate publication",
    ],
  },
];

type Label = "Built-in" | "Limited" | "Implement" | "Add-on" | "Validate" | "Out of scope" | "Open source" | "Proprietary" | "Mixed";
type Feature = { id: string; name: string; cells: Label[] };
type FeatureGroup = { group: string; features: Feature[] };
const FEATURES: FeatureGroup[] = [
  {
    group: "Connectivity and ingestion (criterion 03)",
    features: [
      { id: "F01", name: "Oracle read / write", cells: ["Built-in", "Built-in", "Limited", "Built-in", "Built-in"] },
      { id: "F02", name: "Other relational sources", cells: ["Built-in", "Built-in", "Add-on", "Built-in", "Built-in"] },
      { id: "F03", name: "File ingestion", cells: ["Built-in", "Built-in", "Limited", "Built-in", "Built-in"] },
      { id: "F04", name: "REST / API ingestion", cells: ["Implement", "Validate", "Add-on", "Add-on", "Implement"] },
      { id: "F05", name: "Oracle redo-log CDC", cells: ["Add-on", "Add-on", "Add-on", "Add-on", "Add-on"] },
    ],
  },
  {
    group: "Transformation (criterion 04; history under 05)",
    features: [
      { id: "F06", name: "Visual mapping designer", cells: ["Built-in", "Built-in", "Out of scope", "Add-on", "Out of scope"] },
      { id: "F07", name: "Exadata SQL execution (pushdown)", cells: ["Built-in", "Built-in", "Built-in", "Limited", "Limited"] },
      { id: "F08", name: "Distributed processing", cells: ["Limited", "Limited", "Limited", "Built-in", "Built-in"] },
      { id: "F09", name: "Incremental upserts", cells: ["Built-in", "Built-in", "Built-in", "Implement", "Implement"] },
      { id: "F10", name: "SCD type 2 history", cells: ["Built-in", "Built-in", "Validate", "Implement", "Implement"] },
    ],
  },
  {
    group: "Data correctness (criterion 05)",
    features: [
      { id: "F11", name: "Data quality rules", cells: ["Built-in", "Implement", "Built-in", "Implement", "Implement"] },
      { id: "F12", name: "Reject quarantine", cells: ["Built-in", "Implement", "Limited", "Implement", "Implement"] },
      { id: "F13", name: "Financial reconciliation", cells: ["Implement", "Implement", "Implement", "Implement", "Implement"] },
      { id: "F14", name: "Schema changes", cells: ["Limited", "Limited", "Limited", "Limited", "Limited"] },
      { id: "F15", name: "Backfill / late corrections", cells: ["Implement", "Implement", "Implement", "Implement", "Implement"] },
    ],
  },
  {
    group: "Orchestration and reporting (criterion 06)",
    features: [
      { id: "F16", name: "Dependency workflows", cells: ["Built-in", "Built-in", "Limited", "Add-on", "Add-on"] },
      { id: "F17", name: "Calendar / event triggers", cells: ["Limited", "Limited", "Add-on", "Add-on", "Add-on"] },
      { id: "F18", name: "Restart / checkpoint", cells: ["Built-in", "Built-in", "Implement", "Limited", "Limited"] },
      { id: "F19", name: "Stream processing", cells: ["Limited", "Limited", "Out of scope", "Built-in", "Built-in"] },
      { id: "F20", name: "Atomic report publication", cells: ["Implement", "Implement", "Implement", "Implement", "Implement"] },
    ],
  },
  {
    group: "Security and metadata (criterion 07)",
    features: [
      { id: "F21", name: "Role-based access", cells: ["Built-in", "Built-in", "Add-on", "Built-in", "Limited"] },
      { id: "F22", name: "Secret management", cells: ["Implement", "Validate", "Add-on", "Validate", "Add-on"] },
      { id: "F23", name: "Runtime audit / logs", cells: ["Built-in", "Built-in", "Built-in", "Built-in", "Limited"] },
      { id: "F24", name: "Technical dependencies", cells: ["Built-in", "Built-in", "Built-in", "Built-in", "Add-on"] },
      { id: "F25", name: "Source-to-report lineage", cells: ["Add-on", "Add-on", "Add-on", "Add-on", "Add-on"] },
    ],
  },
  {
    group: "Development and operations (criteria 08, 09)",
    features: [
      { id: "F26", name: "Git / code review", cells: ["Built-in", "Limited", "Built-in", "Limited", "Built-in"] },
      { id: "F27", name: "Environment promotion", cells: ["Built-in", "Built-in", "Implement", "Implement", "Implement"] },
      { id: "F28", name: "CLI automation", cells: ["Built-in", "Built-in", "Built-in", "Built-in", "Built-in"] },
      { id: "F29", name: "Monitoring / alerts", cells: ["Limited", "Built-in", "Add-on", "Built-in", "Limited"] },
      { id: "F30", name: "HA / disaster recovery", cells: ["Validate", "Validate", "Add-on", "Validate", "Add-on"] },
    ],
  },
  {
    group: "AI integration (criterion 12)",
    features: [
      { id: "F31", name: "Local AI-assisted development", cells: ["Implement", "Validate", "Add-on", "Validate", "Add-on"] },
      { id: "F32", name: "Call a local model endpoint", cells: ["Implement", "Implement", "Add-on", "Add-on", "Implement"] },
      { id: "F33", name: "ML feature engineering / scoring", cells: ["Implement", "Implement", "Limited", "Built-in", "Built-in"] },
      { id: "F34", name: "AI audit and repeatability", cells: ["Implement", "Implement", "Implement", "Implement", "Implement"] },
    ],
  },
  {
    group: "Open source and extensibility (criterion 13)",
    features: [
      { id: "F35", name: "Core licence / source access", cells: ["Proprietary", "Proprietary", "Open source", "Mixed", "Open source"] },
      { id: "F36", name: "Extend / replace components", cells: ["Limited", "Limited", "Built-in", "Validate", "Built-in"] },
    ],
  },
];
const COUNT_LABELS: Label[] = ["Built-in", "Limited", "Implement", "Add-on", "Validate", "Out of scope"];
const ALL_FEATURES = FEATURES.flatMap((g) => g.features).filter((f) => f.id !== "F35");
const LABEL_COUNTS = COUNT_LABELS.map((label) => TOOLS.map((_, t) => ALL_FEATURES.filter((f) => f.cells[t] === label).length));
const BANK_BUILT = TOOLS.map((_, t) => ALL_FEATURES.filter((f) => f.cells[t] === "Implement" || f.cells[t] === "Add-on").length);

type FitRow = { factor: string; cells: string[] };
const FIT_ROWS: FitRow[] = [
  { factor: "Transformation runs inside Exadata by default", cells: ["Yes", "Partly (pushdown coverage varies)", "Yes", "No (out and back)", "No (out and back)"] },
  { factor: "Needs a second compute estate", cells: ["No", "Partly (Integration Service domain)", "No (small runner)", "Yes (cluster + DR)", "Yes (cluster + DR)"] },
  { factor: "Readable / tunable by the Oracle DBA + PL/SQL team", cells: ["Yes", "Partly", "Yes (SQL)", "No", "No"] },
  { factor: "New skill profile required", cells: ["ODI/KM developer", "PC admin + developers", "Python/CI owner", "Cluster/platform team", "Distributed-systems team"] },
  { factor: "Can start Pilot A with zero procurement", cells: ["No", "No", "Yes", "No", "Engine yes, service no"] },
  { factor: "S2 batch from sur standby, SCN-consistent", cells: ["Yes", "Yes", "Yes (bank ingestion)", "Yes (+ consistency design)", "Yes (+ consistency design)"] },
  { factor: "S0 CDC without extra product", cells: ["No", "No", "No", "No", "No"] },
  { factor: "Trigger-free on prod Kale / read-only standby", cells: ["Yes if JKMs avoided", "Yes", "Yes", "Yes", "Yes"] },
  { factor: "Automic as house scheduler", cells: ["Native CLI / Load Plan", "Native CLI", "Native CLI", "Add-on / Build", "Add-on / Build"] },
  { factor: "Contractual support route exists today", cells: ["Oracle", "Informatica / partner (local roadmap unproven)", "None", "Cloudera (team does not exist)", "None"] },
  { factor: "Vendor product-direction risk", cells: ["L", "H", "M (Core v1 vs Fusion)", "L–M", "L"] },
  { factor: "Exit / migration effort", cells: ["M", "H", "L", "H", "M"] },
  { factor: "Existing bank entitlement", cells: ["None (Oracle DB only)", "TDM only — no PC rights", "n/a", "None", "n/a"] },
];
const DISPOSITION = ["Lead shortlist", "Challenger", "Conditional", "Defer", "Specialist complement"];

type Hml = "H" | "M" | "L";
type RiskRow = { theme: string; cells: Hml[] };
const RISKS: RiskRow[] = [
  { theme: "Locality gate failed by telemetry, licence checks or assistants", cells: ["L", "H", "M", "M", "M"] },
  { theme: "Hidden CDC dependency (GoldenGate / PowerExchange / connector)", cells: ["H", "H", "M", "M", "M"] },
  { theme: "Vendor discontinues or de-prioritises the on-prem product", cells: ["L", "H", "M", "L", "L"] },
  { theme: "No incident support path", cells: ["L", "M", "H", "M", "H"] },
  { theme: "Staffing gap vs team that exists", cells: ["L", "M", "M", "H", "H"] },
  { theme: "Second estate / data leaves Exadata", cells: ["L", "M", "L", "H", "H"] },
  { theme: "Correctness handoff (reject loss, duplicate publication)", cells: ["M", "H", "M", "M", "H"] },
  { theme: "In-house framework becomes unsupported product", cells: ["L", "L", "M", "M", "H"] },
  { theme: "Lock-in / exit cost", cells: ["M", "H", "L", "H", "M"] },
  { theme: "Tool purchase blocks first business result", cells: ["H", "H", "L", "H", "M"] },
];
const RISK_H = TOOLS.map((_, t) => RISKS.filter((r) => r.cells[t] === "H").length);

type PocRow = { id: string; name: string; cells: Hml[]; target: string };
const POC: PocRow[] = [
  { id: "P01", name: "Disconnected deployment and operation", cells: ["L", "H", "H", "H", "M"], target: "Gate 1" },
  { id: "P02", name: "Oracle batch extraction and consistent loading", cells: ["H", "M", "M", "M", "H"], target: "03, 05" },
  { id: "P03", name: "File and API ingestion", cells: ["M", "M", "H", "M", "H"], target: "03" },
  { id: "P04", name: "Incremental changes and deletes", cells: ["M", "M", "H", "M", "H"], target: "05" },
  { id: "P05", name: "Historical correction and schema change", cells: ["M", "M", "H", "M", "M"], target: "05" },
  { id: "P06", name: "Reconciliation and report semantics", cells: ["M", "H", "M", "H", "H"], target: "05, gate 3" },
  { id: "P07", name: "Partial failure, restart and replay", cells: ["H", "H", "M", "H", "H"], target: "06, gate 3" },
  { id: "P08", name: "Restore and disaster recovery", cells: ["M", "M", "H", "H", "H"], target: "06, 09" },
  { id: "P09", name: "Controlled report, API and file delivery", cells: ["M", "M", "M", "H", "H"], target: "06" },
  { id: "P10", name: "Concurrency, scale and cost of movement", cells: ["H", "H", "H", "H", "H"], target: "04, 10" },
  { id: "P11", name: "Security, entitlement and audit", cells: ["M", "M", "H", "M", "H"], target: "07, gate 2" },
  { id: "P12", name: "Release, upgrades, support and handover", cells: ["M", "H", "H", "H", "H"], target: "09, gate 2" },
];
const DECISIVE = [
  "Standby + file load, late correction, kill after partial commit, replay with unchanged totals",
  "Complex report mapping under no / partial / full pushdown with reject, duplicate, outage",
  "Incremental + snapshot + hard delete + failing test on local Exadata; Automic → ingestion → dbt → publish, egress blocked",
  "Only after scope justification: source → cluster → Oracle with failed worker and target outage",
  "Only for a justified workload: executor failure during JDBC writes; prove dedup and atomic visibility",
];

const CONFIDENCE = [
  { dim: "Product capability (documentation)", cells: ["Medium–high", "Medium (some pages reachable only via index)", "Medium", "Medium", "High"] },
  { dim: "Offered licensing / lifecycle", cells: ["Medium (quote required)", "Low", "Medium (open source)", "Low (bundle unpriced)", "Medium"] },
  { dim: "Bank fit / operations", cells: ["Medium", "Low", "Low (adapter support, ops ownership)", "Low (staffing)", "Low (assembled service)"] },
  { dim: "Cost", cells: ["None", "None", "None", "None", "None"] },
  { dim: "Gate status", cells: ["Pending ×3", "Pending ×3", "Pending ×3", "Pending ×3", "Pending ×3"] },
];

// ---------- small presentational helpers ----------

function Chip({ label, color, bold }: { label: string; color?: string; bold?: boolean }) {
  const theme = useHostTheme();
  const style: CSSProperties = {
    display: "inline-block",
    padding: "1px 7px",
    borderRadius: 4,
    fontSize: 12,
    lineHeight: "18px",
    fontWeight: bold ? 600 : 500,
    color: color ?? theme.text.secondary,
    background: color ? `${color}22` : theme.fill.tertiary,
    whiteSpace: "nowrap",
  };
  return <span style={style}>{label}</span>;
}

function useLabelColor() {
  const theme = useHostTheme();
  const c = theme.category;
  return (label: string): string | undefined => {
    switch (label) {
      case "Built-in":
      case "Open source":
        return c.green;
      case "Limited":
      case "Mixed":
        return c.yellow;
      case "Implement":
      case "Proprietary":
        return c.orange;
      case "Add-on":
        return c.blue;
      case "Validate":
        return c.gray;
      case "Out of scope":
        return c.red;
      default:
        return undefined;
    }
  };
}

function useHmlColor() {
  const theme = useHostTheme();
  const c = theme.category;
  return (v: string): string | undefined => (v === "H" ? c.red : v === "M" ? c.yellow : v === "L" ? c.green : undefined);
}

function useYesNoColor() {
  const theme = useHostTheme();
  const c = theme.category;
  return (v: string): string | undefined => {
    if (v.startsWith("Yes")) return c.green;
    if (v.startsWith("Partly") || v.startsWith("Engine")) return c.yellow;
    if (v.startsWith("No")) return c.orange;
    if (v === "H") return c.red;
    if (v === "M") return c.yellow;
    if (v === "L" || v === "L–M") return c.green;
    return undefined;
  };
}

function useRatingColor() {
  const theme = useHostTheme();
  const c = theme.category;
  return (r: number | null): string | undefined => (r === null ? undefined : r >= 4 ? c.green : r >= 3 ? c.yellow : c.orange);
}

function fmt(n: number, d = 1) {
  return n.toFixed(d);
}

// ---------- sections ----------

function Scorecard() {
  const theme = useHostTheme();
  const ratingColor = useRatingColor();
  const rows = CRITERIA.map((c) => [
    <Text size="small" tone="tertiary">{c.id}</Text>,
    c.name,
    fmt(c.weight, 2),
    ...c.ratings.map((r) =>
      r === null ? (
        <Text size="small" tone="tertiary" italic>unassessed</Text>
      ) : (
        <Row gap={6} align="center">
          <Chip label={fmt(r, r % 1 === 0 ? 0 : 1)} color={ratingColor(r)} bold />
          <Text size="small" tone="tertiary">{fmt((c.weight * r) / 5, 2)}</Text>
        </Row>
      ),
    ),
  ]);
  rows.push([
    "",
    <Text weight="semibold">Points earned / {fmt(ASSESSED_WEIGHT, 1)} (cost excluded)</Text>,
    "",
    ...POINTS.map((p) => <Text weight="semibold">{fmt(p, 1)}</Text>),
  ]);
  rows.push([
    "",
    <Text weight="semibold">Provisional fit / 100 (rescaled)</Text>,
    "",
    ...FIT.map((f, i) => <Text weight="bold" style={{ color: i === 0 ? theme.accent.primary : undefined }}>{fmt(f, 1)}</Text>),
  ]);
  rows.push(["", "Criteria led or tied for lead (of 9)", "", ...LEADS.map((n) => String(n))]);
  rows.push(["", "Disposition", "", ...DISPOSITION.map((d, i) => <Chip label={d} color={i === 0 ? theme.accent.primary : undefined} bold={i === 0} />)]);

  const order = FIT.map((f, i) => ({ f, i })).sort((a, b) => b.f - a.f);

  return (
    <Stack gap={16}>
      <Grid columns="minmax(0, 3fr) minmax(0, 2fr)" gap={16} align="start">
        <Stack gap={8}>
          <H3>Provisional fit / 100 by candidate (cost excluded, nine criteria rescaled from 91.5 to 100)</H3>
          <BarChart
            categories={order.map((o) => TOOLS[o.i])}
            series={[{ name: "Provisional fit (points / 100)", data: order.map((o) => Number(fmt(o.f, 1))) }]}
            horizontal
            height={200}
            yMax={100}
            showValues
            referenceLines={[{ value: 60, label: "3.0 avg", tone: "neutral" }]}
          />
          <Text size="small" tone="tertiary">
            X axis: provisional fit (points out of 100). Y axis: candidate. Source: ETL-Tool-Comparison.xlsx desk ratings, 12 Oct 2026; fit = Σ(weight × rating ÷ 5) ÷ 91.5 × 100.
          </Text>
        </Stack>
        <Stack gap={12}>
          <Row gap={16} wrap>
            <Stat value={fmt(FIT[0], 1)} label="ODI fit (lead)" />
            <Stat value={fmt(FIT[1] - FIT[2], 1)} label="PC − dbt gap (points)" tone="warning" />
            <Stat value={fmt(FIT[0] - FIT[1], 1)} label="ODI − PC gap (points)" />
          </Row>
          <Callout tone="info" title="Cost sensitivity">
            Full score = points earned + 1.7 × cost rating. To overtake ODI, PowerCenter needs a cost rating at least {fmt((POINTS[0] - POINTS[1]) / 1.7, 1)} higher than ODI's, dbt at least {fmt((POINTS[0] - POINTS[2]) / 1.7, 1)} higher; Cloudera and Spark cannot reach it within the 0–5 scale. dbt vs PowerCenter is only {fmt((POINTS[1] - POINTS[2]) / 1.7, 1)} of a cost point apart, so quotes decide that pair.
          </Callout>
        </Stack>
      </Grid>
      <H3>Matrix A — Weighted scorecard: rating (0–5) and points contributed (weight × rating ÷ 5)</H3>
      <Table
        headers={["#", "Criterion", "Weight", ...TOOLS]}
        rows={rows}
        columnAlign={["left", "left", "right", "left", "left", "left", "left", "left"]}
        striped
        stickyHeader
      />
      <Text size="small" tone="tertiary">
        Desk scale: 0 unsuitable · 1 major gaps · 2 material extra work · 3 credible documented path · 4 strong architectural fit · 5 demonstrated superiority (never awarded on paper). Chip colour: green ≥ 4, yellow 3–3.5, orange &lt; 3.
      </Text>
    </Stack>
  );
}

function Gates() {
  const theme = useHostTheme();
  return (
    <Stack gap={12}>
      <H3>Matrix B — Mandatory gates (pass / fail, outside the score; one Fail excludes the candidate)</H3>
      <Table
        headers={["Gate", ...TOOLS, "Decisive evidence"]}
        rows={GATES.map((g) => [
          <Text weight="semibold">{g.gate}</Text>,
          ...g.cells.map((c) => {
            const [status, ...rest] = c.split(" — ");
            return (
              <Stack gap={4}>
                <Chip label={status} color={theme.category.gray} />
                {rest.length > 0 && <Text size="small" tone="secondary">{rest.join(" — ")}</Text>}
              </Stack>
            );
          }),
          <Text size="small">{g.evidence}</Text>,
        ])}
        striped
      />
    </Stack>
  );
}

function Capabilities() {
  const labelColor = useLabelColor();
  return (
    <Stack gap={16}>
      <Row gap={8} wrap align="center">
        <Text size="small" tone="secondary">Legend:</Text>
        {(["Built-in", "Limited", "Implement", "Add-on", "Validate", "Out of scope"] as Label[]).map((l) => (
          <Chip key={l} label={l} color={labelColor(l)} />
        ))}
        <Text size="small" tone="tertiary">Built-in = product capability · Limited = partial · Implement = bank code/design · Add-on = another product · Validate = unproven for the offer · Out of scope = absent</Text>
      </Row>
      {FEATURES.map((g) => (
        <Stack key={g.group} gap={6}>
          <H3>{g.group}</H3>
          <Table
            headers={["#", "Feature", ...TOOLS]}
            rows={g.features.map((f) => [
              <Text size="small" tone="tertiary">{f.id}</Text>,
              f.name,
              ...f.cells.map((c) => <Chip label={c} color={labelColor(c)} />),
            ])}
          />
        </Stack>
      ))}
      <Divider />
      <H3>Label counts across F01–F34 and F36 (F35 is a licence label) — evidence only, never added to the score</H3>
      <Table
        headers={["Label", ...TOOLS]}
        rows={[
          ...COUNT_LABELS.map((l, i) => [<Chip label={l} color={labelColor(l)} />, ...LABEL_COUNTS[i].map((n) => String(n))]),
          [<Text weight="semibold">Bank-built or bought (Implement + Add-on)</Text>, ...BANK_BUILT.map((n) => <Text weight="semibold">{String(n)}</Text>)],
        ]}
        columnAlign={["left", "right", "right", "right", "right", "right"]}
      />
      <Text size="small" tone="secondary">
        The two packaged ETL products come with the most out of the box; dbt, Cloudera and Spark each shift roughly half of the features onto the bank or onto additional components. Rows marked Implement for everyone (F13, F15, F20, F34) are bank intellectual property regardless of tool and should be designed once, tool-agnostically, in PL/SQL on Exadata.
      </Text>
    </Stack>
  );
}

function FitFactors() {
  const theme = useHostTheme();
  const yn = useYesNoColor();
  return (
    <Stack gap={12}>
      <H3>Matrix D — Takasbank fit factors (against the bank's situation, not generic product merit)</H3>
      <Table
        headers={["Fit factor", ...TOOLS]}
        rows={[
          ...FIT_ROWS.map((r) => [
            r.factor,
            ...r.cells.map((c) => {
              const col = yn(c);
              return col ? <Chip label={c} color={col} /> : <Text size="small">{c}</Text>;
            }),
          ]),
          [
            <Text weight="semibold">Disposition</Text>,
            ...DISPOSITION.map((d, i) => <Chip label={d} color={i === 0 ? theme.accent.primary : undefined} bold />),
          ],
        ]}
        striped
      />
    </Stack>
  );
}

function RiskHeatMap() {
  const hml = useHmlColor();
  return (
    <Stack gap={12}>
      <Grid columns="minmax(0, 3fr) minmax(0, 2fr)" gap={16} align="start">
        <Stack gap={6}>
          <H3>Matrix E — Risk heat map (H / M / L exposure per risk theme)</H3>
          <Table
            headers={["Risk theme", ...TOOLS]}
            rows={[
              ...RISKS.map((r) => [r.theme, ...r.cells.map((c) => <Chip label={c} color={hml(c)} bold />)]),
              [<Text weight="semibold">Count of H</Text>, ...RISK_H.map((n) => <Text weight="semibold">{String(n)}</Text>)],
            ]}
            columnAlign={["left", "center", "center", "center", "center", "center"]}
            striped
          />
        </Stack>
        <Stack gap={8}>
          <H3>High-risk themes per candidate (count of H cells)</H3>
          <BarChart
            categories={[...TOOLS]}
            series={[{ name: "Count of H (of 10 themes)", data: RISK_H, tone: "danger" }]}
            height={220}
            yMax={10}
            showValues
          />
          <Text size="small" tone="tertiary">X axis: candidate. Y axis: number of risk themes rated H (of 10). Source: architect desk assessment, 12 Oct 2026.</Text>
          <Text size="small" tone="secondary">Mitigations per risk are in the Obsidian note ETL Tool Comparison, section 8.</Text>
        </Stack>
      </Grid>
    </Stack>
  );
}

function PocExposure() {
  const hml = useHmlColor();
  const hCount = TOOLS.map((_, t) => POC.filter((p) => p.cells[t] === "H").length);
  return (
    <Stack gap={12}>
      <H3>Matrix F — Proof-of-concept exposure: how decisively each P-test can move a candidate (H decisive · M material · L confirmatory)</H3>
      <Table
        headers={["Test", "Name", ...TOOLS, "Criterion / gate"]}
        rows={[
          ...POC.map((p) => [
            <Text size="small" tone="tertiary">{p.id}</Text>,
            p.name,
            ...p.cells.map((c) => <Chip label={c} color={hml(c)} bold />),
            <Text size="small">{p.target}</Text>,
          ]),
          ["", <Text weight="semibold">Count of H — run these first</Text>, ...hCount.map((n) => <Text weight="semibold">{String(n)}</Text>), ""],
        ]}
        columnAlign={["left", "left", "center", "center", "center", "center", "center", "left"]}
        striped
      />
      <H3>Decisive single-run PoC per candidate</H3>
      <Grid columns={5} gap={12} align="stretch">
        {DECISIVE.map((d, i) => (
          <Card key={TOOLS[i]}>
            <CardHeader>{TOOLS[i]}</CardHeader>
            <CardBody>
              <Text size="small">{d}</Text>
            </CardBody>
          </Card>
        ))}
      </Grid>
      <Text size="small" tone="tertiary">Tests P01–P12 are defined in the Obsidian note ETL Proof of Concept and Acceptance.</Text>
    </Stack>
  );
}

function Confidence() {
  const theme = useHostTheme();
  const c = theme.category;
  const color = (v: string) =>
    v.startsWith("High") ? c.green : v.startsWith("Medium") ? c.yellow : v.startsWith("Low") ? c.orange : v.startsWith("None") ? c.red : c.gray;
  return (
    <Stack gap={12}>
      <H3>Matrix G — Evidence confidence per dimension</H3>
      <Table
        headers={["Dimension", ...TOOLS]}
        rows={CONFIDENCE.map((r) => [
          r.dim,
          ...r.cells.map((v) => {
            const [head, ...rest] = v.split(" (");
            return (
              <Row gap={6} align="center" wrap>
                <Chip label={head} color={color(v)} />
                {rest.length > 0 && <Text size="small" tone="tertiary">({rest.join(" (")}</Text>}
              </Row>
            );
          }),
        ])}
        striped
      />
    </Stack>
  );
}

// ---------- page ----------

const TABS = ["Scorecard", "Gates", "Capabilities", "Fit factors", "Risk heat map", "PoC exposure", "Confidence"] as const;
type Tab = (typeof TABS)[number];

export default function EtlComparisonMatrix() {
  const theme = useHostTheme();
  const [tab, setTab] = useCanvasState<Tab>("etl-matrix-tab", "Scorecard");

  return (
    <Stack gap={20} style={{ padding: 24, color: theme.text.primary }}>
      <Stack gap={6}>
        <H1>full repo ETL Tool Comparison Matrix — Takasbank on-premises Exadata EDW</H1>
        <Text tone="secondary">
          {TOOL_FULL.join(" · ")}
        </Text>
        <Text size="small" tone="tertiary">
          Desk assessment from official documentation and bank notes, sources rechecked 12 October 2026. No installation, test or quote at Takasbank. All mandatory gates Pending; cost unassessed. Ratings are architect judgment, not acceptance results. Same data as ETL-Tool-Comparison-Matrix.xlsx.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <Pill key={t} active={t === tab} onClick={() => setTab(t)}>
            {t}
          </Pill>
        ))}
      </Row>

      {tab === "Scorecard" && <Scorecard />}
      {tab === "Gates" && <Gates />}
      {tab === "Capabilities" && <Capabilities />}
      {tab === "Fit factors" && <FitFactors />}
      {tab === "Risk heat map" && <RiskHeatMap />}
      {tab === "PoC exposure" && <PocExposure />}
      {tab === "Confidence" && <Confidence />}

      <Divider />
      <H2>How to update</H2>
      <Text size="small" tone="secondary">
        1. Replace desk ratings with test-supported ratings after each P-test; the workbook ETL-Tool-Comparison.xlsx stays the system of record. 2. Enter the cost rating only when comparable five-year quotes exist, then publish the full weighted score. 3. Flip gate cells from Pending to Pass/Fail with named evidence; a Fail removes the column. 4. Record the final decision in ETL Selection Decision Record.
      </Text>
    </Stack>
  );
}
