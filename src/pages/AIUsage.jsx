
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Download,
  FileSearch,
  FileText,
  Filter,
  Gauge,
  Layers3,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import "./AIUsage.css";
import useAssistantContext from "../hooks/useAssistantContext";

const features = [
  { name: "Resume Analysis", icon: FileSearch },
  { name: "Job Matching", icon: Search },
  { name: "Resume Improvement", icon: Sparkles },
  { name: "AI Career Assistant", icon: BrainCircuit },
  { name: "Cover Letter", icon: FileText },
];

const providers = ["OpenAI", "Google Gemini", "Anthropic", "Other"];

const initialUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    calls: 842,
    cost: 48.7,
    feature: "Resume Analysis",
    provider: "OpenAI",
    trend: 34,
    risk: "High",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    calls: 624,
    cost: 37.2,
    feature: "Job Matching",
    provider: "Google Gemini",
    trend: 18,
    risk: "Medium",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    calls: 518,
    cost: 31.6,
    feature: "AI Career Assistant",
    provider: "Anthropic",
    trend: 12,
    risk: "Medium",
  },
  {
    id: 4,
    name: "Daniel Wilson",
    email: "daniel.wilson@example.com",
    calls: 446,
    cost: 27.4,
    feature: "Resume Analysis",
    provider: "OpenAI",
    trend: 8,
    risk: "Normal",
  },
  {
    id: 5,
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    calls: 392,
    cost: 23.8,
    feature: "Job Matching",
    provider: "Google Gemini",
    trend: -4,
    risk: "Normal",
  },
  {
    id: 6,
    name: "Noah Anderson",
    email: "noah.anderson@example.com",
    calls: 354,
    cost: 21.4,
    feature: "Resume Improvement",
    provider: "OpenAI",
    trend: 6,
    risk: "Normal",
  },
  {
    id: 7,
    name: "Ava Thompson",
    email: "ava.thompson@example.com",
    calls: 301,
    cost: 18.9,
    feature: "Cover Letter",
    provider: "Anthropic",
    trend: 3,
    risk: "Normal",
  },
  {
    id: 8,
    name: "James Wilson",
    email: "james.wilson@example.com",
    calls: 268,
    cost: 16.2,
    feature: "AI Career Assistant",
    provider: "Google Gemini",
    trend: -2,
    risk: "Normal",
  },
];

const featureUsage = [
  { name: "Resume Analysis", calls: 4820, cost: 284.6, percentage: 42 },
  { name: "Job Matching", calls: 3260, cost: 196.4, percentage: 28 },
  { name: "Resume Improvement", calls: 2140, cost: 128.2, percentage: 19 },
  { name: "AI Career Assistant", calls: 870, cost: 74.8, percentage: 8 },
  { name: "Cover Letter", calls: 410, cost: 32.5, percentage: 3 },
];

const providerUsage = [
  { name: "OpenAI", calls: 6740, cost: 412.8, percentage: 58 },
  { name: "Google Gemini", calls: 3180, cost: 198.4, percentage: 27 },
  { name: "Anthropic", calls: 1580, cost: 105.3, percentage: 13 },
  { name: "Other", calls: 80, cost: 5, percentage: 2 },
];

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function formatMoney(value, digits = 2) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRisk(user) {
  // Demo label only. Replace with a backend-provided risk assessment.
  return user.risk || "Normal";
}

function getHistory(days) {
  const count = Number(days);
  const today = new Date();
  const result = [];

  for (let index = count - 1; index >= 0; index--) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);

    // Deterministic illustrative values, not real telemetry.
    const dayOfYear = Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 86400000
    );
    const calls = Math.round(
      250 + (Math.sin(dayOfYear * 0.55) + 1) * 120 +
      (Math.cos(dayOfYear * 0.19) + 1) * 80 +
      (index % 5) * 12
    );

    result.push({
      key: date.toISOString().slice(0, 10),
      day: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      calls,
    });
  }

  return result;
}

function StatCard({ title, value, detail, icon: Icon, trend, trendDown }) {
  return (
    <article className="ai-stat-card">
      <div className="ai-stat-top">
        <span>{title}</span>
        <span className="ai-stat-icon">
          <Icon size={18} />
        </span>
      </div>

      <strong className="ai-stat-value">{value}</strong>

      <div className="ai-stat-bottom">
        {trend && (
          <span className={trendDown ? "ai-trend-down" : "ai-trend-up"}>
            {trendDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {trend}
          </span>
        )}
        <span>{detail}</span>
      </div>
    </article>
  );
}

function UsageBar({ percentage }) {
  return (
    <div className="ai-progress-track">
      <div
        className="ai-progress-fill"
        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
      />
    </div>
  );
}

function UserDrawer({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="ai-drawer-overlay" onMouseDown={onClose}>
      <aside
        className="ai-user-drawer"
        onMouseDown={(event) => event.stopPropagation()}
        aria-label="AI usage user details"
      >
        <header className="ai-drawer-header">
          <div>
            <span className="ai-eyebrow">AI USAGE DETAILS</span>
            <div className="ai-drawer-profile">
              <div className="ai-avatar ai-avatar-large">{initials(user.name)}</div>
              <div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          <button
            className="ai-icon-button"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </header>

        <div className="ai-drawer-content">
          <div className="ai-drawer-stat-grid">
            <div>
              <span>Total AI calls</span>
              <strong>{formatNumber(user.calls)}</strong>
            </div>
            <div>
              <span>Estimated cost</span>
              <strong>{formatMoney(user.cost)}</strong>
            </div>
            <div>
              <span>Main feature</span>
              <strong>{user.feature}</strong>
            </div>
            <div>
              <span>Provider</span>
              <strong>{user.provider}</strong>
            </div>
          </div>

          <section className="ai-drawer-section">
            <h3>
              <Activity size={16} />
              Usage summary
            </h3>
            <div className="ai-detail-row">
              <span>Usage change vs previous period</span>
              <strong className={user.trend >= 0 ? "ai-trend-up" : "ai-trend-down"}>
                {user.trend > 0 ? "+" : ""}
                {user.trend}%
              </strong>
            </div>
            <div className="ai-detail-row">
              <span>Usage review label</span>
              <span className={`ai-risk ai-risk-${getRisk(user).toLowerCase()}`}>
                {getRisk(user)}
              </span>
            </div>
          </section>

          <div className="ai-disclaimer">
            <ShieldAlert size={17} />
            <p>
              User-level activity and cost values are illustrative demo data.
              Review actual request logs and your usage policy before taking
              action on an account.
            </p>
          </div>

          <button className="ai-button ai-button-dark ai-drawer-close" onClick={onClose}>
            Close details
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function AIUsage({ onAssistantContext }) {
  const [period, setPeriod] = useState("30");
  const [providerFilter, setProviderFilter] = useState("All providers");
  const [featureFilter, setFeatureFilter] = useState("All features");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const history = useMemo(() => getHistory(period), [period]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return initialUsers.filter((user) => {
      const matchesProvider =
        providerFilter === "All providers" ||
        user.provider === providerFilter;

      const matchesFeature =
        featureFilter === "All features" ||
        user.feature === featureFilter;

      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      return matchesProvider && matchesFeature && matchesSearch;
    });
  }, [providerFilter, featureFilter, search]);

  const metrics = useMemo(() => {
    const multiplier = period === "7" ? 0.28 : period === "90" ? 2.7 : 1;
    const calls = Math.round(11580 * multiplier);
    const cost = 821.5 * multiplier;

    return {
      calls,
      cost,
      average: calls ? cost / calls : 0,
      activeUsers: Math.round(3482 * multiplier),
    };
  }, [period]);
  const periodBudget = 1000 * (Number(period) / 30);
  const budgetPercent = (metrics.cost / periodBudget) * 100;
  const budgetStatus =
    budgetPercent >= 100
      ? "over"
      : budgetPercent >= 80
        ? "near"
        : "within";

  const maxCalls = Math.max(...history.map((item) => item.calls), 1);
  const peak = history.reduce(
    (max, item) => (item.calls > max.calls ? item : max),
    history[0]
  );

  const maxFeatureCalls = Math.max(...featureUsage.map((item) => item.calls), 1);
  const maxProviderCalls = Math.max(...providerUsage.map((item) => item.calls), 1);

  const estimatedTopUserCost = filteredUsers.reduce(
    (sum, user) => sum + user.cost,
    0
  );
  useAssistantContext(onAssistantContext, "AI Usage", {
    period: `${period} days`,
    calls: metrics.calls,
    cost: metrics.cost,
    activeUsers: metrics.activeUsers,
    providers: providerUsage,
    features: featureUsage,
    users: filteredUsers.map(({ calls }) => ({ calls })),
    comparisonAvailable: false,
    filters: `provider ${providerFilter}; feature ${featureFilter}${search ? "; search active" : ""}`,
  });

  function exportCsv() {
    const rows = [
      [
        "Name",
        "Email",
        "AI Calls",
        "Estimated Cost USD",
        "Main Feature",
        "Provider",
        "Usage Trend",
        "Review Label",
      ],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.calls,
        user.cost.toFixed(2),
        user.feature,
        user.provider,
        `${user.trend}%`,
        getRisk(user),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aifagen-ai-usage-${period}-days.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="ai-page">
      <header className="ai-header">
        <div>
          <div className="ai-breadcrumb">
            Operations <span>/</span> AI Usage
          </div>
          <h1>AI Usage</h1>
          <p>
            Monitor AI requests, estimated costs, feature activity, and provider
            usage.
          </p>
        </div>

        <div className="ai-header-controls">
          <div className="ai-period-selector" aria-label="Select date range">
            {[
              { label: "7 days", value: "7" },
              { label: "30 days", value: "30" },
              { label: "90 days", value: "90" },
            ].map((item) => (
              <button
                key={item.value}
                className={period === item.value ? "active" : ""}
                onClick={() => setPeriod(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button className="ai-button ai-button-dark" onClick={exportCsv}>
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </header>

      <div className="ai-demo-notice">
        <AlertIcon />
        <span>
          Demo analytics: replace sample figures with recorded backend usage
          before using this page for billing or account decisions.
        </span>
      </div>

      <section className="ai-summary-grid">
        <StatCard
          title="AI calls"
          value={formatNumber(metrics.calls)}
          detail="Estimated for selected period"
          icon={Activity}
          trend="18.4%"
        />
        <StatCard
          title="Estimated cost"
          value={formatMoney(metrics.cost)}
          detail="Illustrative provider cost"
          icon={CircleDollarSign}
          trend="9.7%"
          trendDown
        />
        <StatCard
          title="Average cost / call"
          value={formatMoney(metrics.average, 4)}
          detail="Estimated cost divided by calls"
          icon={Gauge}
          trend="3.2%"
        />
        <StatCard
          title="Active AI users"
          value={formatNumber(metrics.activeUsers)}
          detail="Illustrative active-user estimate"
          icon={Users}
          trend="11.2%"
        />
      </section>

      <section
        className={`ai-budget-notice ai-budget-${budgetStatus}`}
        role="status"
        aria-label="Illustrative AI usage budget check"
      >
        <div className="ai-budget-copy">
          <div className="ai-budget-icon">
            <ShieldAlert size={17} />
          </div>
          <div>
            <strong>
              {budgetStatus === "over"
                ? "Demo usage is over the sample budget"
                : budgetStatus === "near"
                  ? "Demo usage is approaching the sample budget"
                  : "Demo usage is within the sample budget"}
            </strong>
            <span>
              {formatMoney(metrics.cost)} estimated of {formatMoney(periodBudget)}{" "}
              illustrative budget for {period} days
            </span>
          </div>
        </div>
        <div
          className="ai-budget-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(Math.round(budgetPercent), 100)}
          aria-label="Estimated share of illustrative AI usage budget"
        >
          <span style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
        </div>
        <small>
          Sample threshold only; configure a real provider budget before using
          this as an operational alert.
        </small>
      </section>

      <section className="ai-panel ai-usage-panel">
        <div className="ai-panel-header">
          <div>
            <h2>AI calls over time</h2>
            <p>
              Daily request volume · Last {period} days
            </p>
          </div>
          <div className="ai-peak-metric">
            <span>Peak day in chart</span>
            <strong>{formatNumber(peak.calls)} calls</strong>
            <small>{peak.day}</small>
          </div>
        </div>

        <div className="ai-chart-layout">
          <div className="ai-chart-y-axis">
            {[1, 0.75, 0.5, 0.25, 0].map((fraction) => (
              <span key={fraction}>
                {formatNumber(Math.round(maxCalls * fraction))}
              </span>
            ))}
          </div>

          <div className="ai-chart">
            <div className="ai-chart-grid">
              {[0, 1, 2, 3, 4].map((line) => (
                <span key={line} />
              ))}
            </div>

            <div className="ai-chart-bars">
              {history.map((item, index) => {
                const showLabel =
                  period === "7" ||
                  index === 0 ||
                  index === history.length - 1 ||
                  index % (period === "30" ? 5 : 15) === 0;

                return (
                  <div className="ai-chart-column" key={item.key}>
                    <div
                      className="ai-chart-bar"
                      style={{
                        height: `${(item.calls / maxCalls) * 100}%`,
                      }}
                      title={`${item.day}: ${formatNumber(item.calls)} calls`}
                    />
                    {showLabel && <span>{item.day}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="ai-analytics-grid">
        <section className="ai-panel">
          <div className="ai-panel-header">
            <div>
              <h2>Usage by feature</h2>
              <p>Request volume and estimated cost per AI feature.</p>
            </div>
            <Layers3 size={19} className="ai-muted-icon" />
          </div>

          <div className="ai-feature-list">
            {featureUsage.map((feature) => {
              const Icon =
                features.find((item) => item.name === feature.name)?.icon ||
                Sparkles;

              return (
                <div className="ai-feature-item" key={feature.name}>
                  <div className="ai-feature-icon">
                    <Icon size={17} />
                  </div>

                  <div className="ai-feature-main">
                    <div className="ai-feature-title">
                      <strong>{feature.name}</strong>
                      <span>{formatNumber(feature.calls)} calls</span>
                    </div>

                    <UsageBar
                      percentage={(feature.calls / maxFeatureCalls) * 100}
                    />

                    <div className="ai-feature-footer">
                      <span>{feature.percentage}% of reported usage</span>
                      <strong>{formatMoney(feature.cost)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="ai-panel">
          <div className="ai-panel-header">
            <div>
              <h2>Usage by provider</h2>
              <p>Provider-level request volume and estimated cost.</p>
            </div>
            <BrainCircuit size={19} className="ai-muted-icon" />
          </div>

          <div className="ai-provider-list">
            {providerUsage.map((provider) => (
              <div className="ai-provider-item" key={provider.name}>
                <div className="ai-provider-logo">
                  {provider.name === "OpenAI"
                    ? "O"
                    : provider.name === "Google Gemini"
                    ? "G"
                    : provider.name === "Anthropic"
                    ? "A"
                    : "•"}
                </div>

                <div className="ai-provider-main">
                  <div className="ai-provider-title">
                    <strong>{provider.name}</strong>
                    <span className="ai-provider-status">
                      <CheckCircle2 size={12} />
                      Demo
                    </span>
                  </div>
                  <UsageBar
                    percentage={(provider.calls / maxProviderCalls) * 100}
                  />
                  <span className="ai-provider-percentage">
                    {provider.percentage}% of reported usage
                  </span>
                </div>

                <div className="ai-provider-cost">
                  <strong>{formatMoney(provider.cost)}</strong>
                  <span>{formatNumber(provider.calls)} calls</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="ai-panel ai-users-panel">
        <div className="ai-users-panel-header">
          <div>
            <h2>AI usage by user</h2>
            <p>
              Inspect the most active users and review their recorded activity.
            </p>
          </div>

          <button className="ai-button ai-button-light" onClick={exportCsv}>
            <Download size={14} />
            Export results
          </button>
        </div>

        <div className="ai-table-toolbar">
          <label className="ai-table-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email"
            />
          </label>

          <label className="ai-select-wrap">
            <Filter size={14} />
            <select
              value={featureFilter}
              onChange={(event) => setFeatureFilter(event.target.value)}
            >
              <option>All features</option>
              {features.map((feature) => (
                <option key={feature.name}>{feature.name}</option>
              ))}
            </select>
            <ChevronDown size={13} />
          </label>

          <label className="ai-select-wrap">
            <select
              value={providerFilter}
              onChange={(event) => setProviderFilter(event.target.value)}
            >
              <option>All providers</option>
              {providers.map((provider) => (
                <option key={provider}>{provider}</option>
              ))}
            </select>
            <ChevronDown size={13} />
          </label>
        </div>

        <div className="ai-table-wrap">
          <table className="ai-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>AI calls</th>
                <th>Estimated cost</th>
                <th>Main feature</th>
                <th>Provider</th>
                <th>Trend</th>
                <th>Review label</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="ai-user-cell">
                      <div className="ai-avatar">{initials(user.name)}</div>
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="ai-number-cell">{formatNumber(user.calls)}</td>
                  <td className="ai-number-cell">{formatMoney(user.cost)}</td>
                  <td>
                    <span className="ai-feature-pill">{user.feature}</span>
                  </td>
                  <td>{user.provider}</td>
                  <td>
                    <span
                      className={
                        user.trend >= 0 ? "ai-trend-up" : "ai-trend-down"
                      }
                    >
                      {user.trend > 0 ? "+" : ""}
                      {user.trend}%
                    </span>
                  </td>
                  <td>
                    <span className={`ai-risk ai-risk-${getRisk(user).toLowerCase()}`}>
                      {getRisk(user)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="ai-view-button"
                      onClick={() => setSelectedUser(user)}
                    >
                      View <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="ai-empty-row">
                    No users match the current search and filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ai-table-footer">
          <span>{filteredUsers.length} users shown</span>
          <span>
            Displayed user cost total: {formatMoney(estimatedTopUserCost)}
          </span>
        </div>
      </section>

      <section className="ai-cost-summary">
        <div>
          <span>Total estimated cost</span>
          <strong>{formatMoney(metrics.cost)}</strong>
        </div>
        <div>
          <span>Highest-volume feature</span>
          <strong>Resume Analysis</strong>
        </div>
        <div>
          <span>Highest-volume provider</span>
          <strong>OpenAI</strong>
        </div>
        <div>
          <span>Review labels</span>
          <strong>{initialUsers.filter((user) => getRisk(user) !== "Normal").length}</strong>
        </div>
      </section>

      <UserDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

function AlertIcon() {
  return <ShieldAlert size={16} />;
}
