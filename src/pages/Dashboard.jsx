
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import "./Dashboard.css";
import useAssistantContext from "../hooks/useAssistantContext";

function createSignupData(days) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (days - index - 1));

    const dateSeed = Math.floor(date.getTime() / 86400000);
    const users =
      18 +
      Math.round(
        Math.sin(dateSeed * 0.57) * 5 +
        Math.cos(dateSeed * 0.23) * 4
      );

    return {
      day: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      users,
    };
  });
}

const revenueData = [
  { month: "May", revenue: 4250 },
  { month: "Jun", revenue: 5100 },
  { month: "Jul", revenue: 4850 },
  { month: "Aug", revenue: 6200 },
  { month: "Sep", revenue: 7100 },
  { month: "Oct", revenue: 8420 },
];

const planData = [
  { name: "None", value: 8200, color: "#022dba" },
  { name: "Basic", value: 3190, color: "#7128d1" },
  { name: "Premium", value: 1450, color: "#7b99f3" },
];

const formatDateInDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const expiringUsers = [
  { name: "Ananya Reddy", email: "ananya@example.com", plan: "Premium", daysRemaining: 2, date: formatDateInDays(2) },
  { name: "Rahul Kumar", email: "rahul@example.com", plan: "Basic", daysRemaining: 6, date: formatDateInDays(6) },
  { name: "Sneha Patel", email: "sneha@example.com", plan: "Premium", daysRemaining: 12, date: formatDateInDays(12) },
  { name: "Arjun Rao", email: "arjun@example.com", plan: "Basic", daysRemaining: 18, date: formatDateInDays(18) },
];

const sourceData = [
  { name: "LinkedIn", status: "Working", saved: 128 },
  { name: "Company Careers", status: "Working", saved: 84 },
  { name: "Job Board API", status: "Failed", saved: 12 },
  { name: "Tech Careers Feed", status: "Running", saved: 36 },
];

const activityData = [
  { title: "New user registered", detail: "Ananya Reddy", time: "12 min ago", type: "user" },
  { title: "Premium subscription activated", detail: "rahul@example.com", time: "35 min ago", type: "payment" },
  { title: "Job source needs attention", detail: "Job Board API", time: "1 hour ago", type: "warning" },
  { title: "Internal job published", detail: "Java Developer", time: "2 hours ago", type: "job" },
];

const totalUsers = planData.reduce((sum, item) => sum + item.value, 0);
const payingUsers = planData
  .filter((item) => item.name !== "None")
  .reduce((sum, item) => sum + item.value, 0);
const nonPayingUsers = totalUsers - payingUsers;
const conversionRate = totalUsers
  ? ((payingUsers / totalUsers) * 100).toFixed(1)
  : "0.0";
const totalRevenue = revenueData[revenueData.length - 1].revenue;
const failedPaymentCount = 2;

const formatNumber = (value) =>
  Number(value).toLocaleString("en-US");

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatCompactMoney = (value) =>
  `$${(value / 1000).toFixed(1)}k`;

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="dash-section-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function ChartToggle({ isVisible, onClick, type = "Chart" }) {
  return (
    <button
      type="button"
      className="chart-toggle-link"
      onClick={onClick}
      aria-expanded={isVisible}
    >
      {isVisible ? `Hide ${type} ↑` : `View ${type} →`}
    </button>
  );
}

function StatCard({ label, value, description, symbol, trend, tone = "" }) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className={`stat-symbol ${tone}`}>{symbol}</span>
        <span className="stat-demo">DEMO</span>
      </div>
      <p className="stat-label">{label}</p>
      <h2>{value}</h2>
      <div className="stat-card-bottom">
        <span className="stat-trend">{trend}</span>
        <span className="stat-description">{description}</span>
      </div>
    </article>
  );
}

export default function Dashboard({ onNavigate = () => {}, onAssistantContext }) {
  const [registrationPeriod, setRegistrationPeriod] = useState("30");
  const [visibleCharts, setVisibleCharts] = useState({
    signup: false,
    plan: false,
    payment: false,
    revenue: false,
  });

  const [activityFilter, setActivityFilter] = useState("All");
  const signupData = useMemo(
    () => createSignupData(Number(registrationPeriod)),
    [registrationPeriod]
  );
  const newRegistrations = signupData.reduce(
    (total, item) => total + item.users,
    0
  );
  const averageDailySignups = newRegistrations / signupData.length;
  const expiringSoon = expiringUsers.filter(
    (user) => user.daysRemaining >= 0 && user.daysRemaining <= 7
  );
  const failedSources = sourceData.filter(
    (source) => source.status === "Failed"
  );
  useAssistantContext(onAssistantContext, "Dashboard", {
    totalUsers,
    newUsers: newRegistrations,
    payingUsers,
    conversionRate,
    revenue: totalRevenue,
    failedPayments: failedPaymentCount,
    expiringSoon: expiringSoon.length,
    period: `${registrationPeriod} days`,
    plans: planData.map(({ name, value }) => ({ name, value })),
    revenueHistory: revenueData.map(({ month, revenue }) => ({ month, revenue })),
    recentActivity: activityData.map(({ title, type, time }) => ({ title, type, time })),
    sources: sourceData.map(({ name, status }) => ({ name, status })),
    signupHistory: signupData,
  });

  const attentionItems = [
    ...failedSources.map((source) => ({
      title: `${source.name} source has failed`,
      detail: "Check the connector and resume job collection.",
      action: "Review sources",
      page: "Job Sources",
      icon: AlertTriangle,
    })),
    ...(failedPaymentCount
      ? [{
          title: `${failedPaymentCount} payments need review`,
          detail: "Review failed transactions and follow up with customers.",
          action: "Review payments",
          page: "Payments",
          icon: CreditCard,
        }]
      : []),
    ...(expiringSoon.length
      ? [{
          title: `${expiringSoon.length} plans expire within 7 days`,
          detail: "Check upcoming renewals and contact these users if needed.",
          action: "View users",
          page: "Users",
          icon: CircleDollarSign,
        }]
      : []),
  ];

  const toggleChart = (name) => {
    setVisibleCharts((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const filteredActivity = useMemo(() => {
    if (activityFilter === "All") return activityData;

    return activityData.filter((item) => {
      if (activityFilter === "Users") return item.type === "user";
      if (activityFilter === "Payments") return item.type === "payment";
      if (activityFilter === "Jobs") return item.type === "job";
      return item.type === "warning";
    });
  }, [activityFilter]);

  return (
    <section className="fresh-dashboard">
      <header className="dashboard-heading">
        <div>
          <span className="dashboard-kicker">
            AIFAGEN <span>/</span> ADMINISTRATION
          </span>
          <h1>Dashboard</h1>
          <p>Monitor platform activity, subscriptions and financial performance.</p>
        </div>

        <div className="dashboard-heading-right">
          <span className="dashboard-sample-badge">
            Illustrative demo data · Not live
          </span>
          <label className="dashboard-period-control">
            <CalendarDays size={15} />
            <span>Registration period</span>
            <select
              value={registrationPeriod}
              onChange={(event) => setRegistrationPeriod(event.target.value)}
              aria-label="Registration period"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </label>
        </div>
      </header>

      {/* KPI SUMMARY */}
      <section className="dashboard-kpi-section">
        <div className="dashboard-section-intro">
          <div>
            <span className="section-eyebrow">AT A GLANCE</span>
            <h3>Platform overview</h3>
          </div>
          <span className="dashboard-demo-note">Illustrative figures</span>
        </div>

        <div className="dashboard-kpi-grid">
          <StatCard
            label="Total users"
            value={formatNumber(totalUsers)}
            description="All accounts"
            trend="Platform"
            symbol="U"
          />
          <StatCard
            label="New users"
            value={formatNumber(newRegistrations)}
            description={`Last ${registrationPeriod} days`}
            trend="Demo"
            symbol="+"
            tone="stat-symbol-blue"
          />
          <StatCard
            label="Paying users"
            value={formatNumber(payingUsers)}
            description="Basic + Premium"
            trend="Subscriptions"
            symbol="$"
          />
          <StatCard
            label="Paid conversion"
            value={`${conversionRate}%`}
            description="Of all users"
            trend="Conversion"
            symbol="%"
            tone="stat-symbol-green"
          />
          <StatCard
            label="October revenue"
            value={formatMoney(totalRevenue)}
            description="Monthly revenue"
            trend="Revenue"
            symbol="$"
          />
        </div>
      </section>

      <section className="dashboard-attention-panel" aria-labelledby="attention-title">
        <div className="attention-heading">
          <div className="attention-title-wrap">
            <span className="attention-icon"><AlertTriangle size={18} /></span>
            <div>
              <span className="section-eyebrow">OPERATIONS</span>
              <h3 id="attention-title">Needs attention</h3>
            </div>
          </div>
          <span className="attention-count">
            {attentionItems.length} items
          </span>
        </div>
        <div className="attention-list">
          {attentionItems.length ? attentionItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="attention-item" key={item.title}>
                <span className="attention-item-icon"><Icon size={17} /></span>
                <div className="attention-item-copy">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                <button
                  type="button"
                  className="attention-action"
                  onClick={() => onNavigate(item.page)}
                >
                  {item.action}
                  <ArrowRight size={14} />
                </button>
              </article>
            );
          }) : (
            <p className="attention-empty">No sample alerts to review.</p>
          )}
        </div>
        <p className="attention-demo-note">
          Alerts are based on illustrative sample records.
        </p>
      </section>

      {/* USER GROWTH */}
      <section className="user-growth-section dashboard-section">
        <div className="user-growth-header">
          <div>
            <span className="section-eyebrow">PLATFORM ACTIVITY</span>
            <h3>User growth</h3>
            <p>Track registrations and understand how your platform is growing.</p>
          </div>
          <ChartToggle
            isVisible={visibleCharts.signup}
            onClick={() => toggleChart("signup")}
            type="Graph"
          />
        </div>

        <div className="growth-summary-grid">
          <article className="growth-summary-card">
            <span>Total registered users</span>
            <strong>{formatNumber(totalUsers)}</strong>
            <small>Accounts across all plans</small>
          </article>
          <article className="growth-summary-card">
            <span>New registrations</span>
            <strong>{formatNumber(newRegistrations)}</strong>
            <small>Last {registrationPeriod} days · demo data</small>
          </article>
          {/* <article className="growth-summary-card">
            <span>Paying customers</span>
            <strong>{formatNumber(payingUsers)}</strong>
            <small>Currently on a paid plan</small>
          </article> */}
        </div>

        {visibleCharts.signup && (
          <article className="dash-panel chart-reveal">
            <SectionHeader
              title="Daily registrations"
              subtitle={`New users over the last ${registrationPeriod} days · demo data`}
            />
            <div className="signup-chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={signupData}
                  margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
                >
                  <CartesianGrid stroke="#edf0f5" vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#8992a2" }}
                    axisLine={false}
                    tickLine={false}
                    interval={registrationPeriod === "7" ? 0 : registrationPeriod === "30" ? 4 : 11}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#8992a2" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip formatter={(value) => [value, "New users"]} />
                  <ReferenceLine
                    y={averageDailySignups}
                    stroke="#8b7be8"
                    strokeDasharray="5 5"
                    label={{
                      value: `Avg ${Math.round(averageDailySignups)}`,
                      position: "insideTopRight",
                      fill: "#7665cc",
                      fontSize: 10,
                    }}
                  />
                  <Line
                    dataKey="users"
                    type="monotone"
                    stroke="#7254ed"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#fff", stroke: "#7254ed", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#7254ed", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        )}
      </section>

      {/* SUBSCRIPTIONS + CONVERSION */}
      <div className="subscription-overview-container dashboard-section">
        <section className="plan-overview-section">
          <div className="plan-overview-header">
            <div>
              <span className="section-eyebrow">SUBSCRIPTIONS</span>
              <h3>Users by plan</h3>
              <p>Distribution across subscription tiers.</p>
            </div>
            <ChartToggle
              isVisible={visibleCharts.plan}
              onClick={() => toggleChart("plan")}
              type="Chart"
            />
          </div>

          <article className="plan-counts-panel">
            <div className="panel-topline">
              <span>Total accounts</span>
              <strong>{formatNumber(totalUsers)}</strong>
            </div>

            <div className="plan-count-list">
              {planData.map((plan) => (
                <div className="plan-count-item" key={plan.name}>
                  <div className="plan-count-heading">
                    <span className="plan-count-name">
                      <i style={{ background: plan.color }} />
                      {plan.name}
                    </span>
                    <strong>{formatNumber(plan.value)}</strong>
                  </div>
                  <div className="plan-count-track">
                    <span
                      style={{
                        width: `${(plan.value / totalUsers) * 100}%`,
                        background: plan.color,
                      }}
                    />
                  </div>
                  <span className="plan-count-percent">
                    {((plan.value / totalUsers) * 100).toFixed(1)}% of users
                  </span>
                </div>
              ))}
            </div>
          </article>

          {visibleCharts.plan && (
            <article className="dash-panel plan-pie-panel chart-reveal">
              <SectionHeader
                title="Subscription distribution"
                subtitle="Share of registered users"
              />
              <div className="plan-pie-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="82%"
                      paddingAngle={3}
                      stroke="none"
                    >
                      {planData.map((plan) => (
                        <Cell key={plan.name} fill={plan.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), "Users"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="plan-pie-center">
                  <strong>{formatNumber(totalUsers)}</strong>
                  <span>Total users</span>
                </div>
              </div>
              <div className="plan-pie-legend">
                {planData.map((plan) => (
                  <div key={plan.name}>
                    <span><i style={{ background: plan.color }} />{plan.name}</span>
                    <strong>{((plan.value / totalUsers) * 100).toFixed(1)}%</strong>
                  </div>
                ))}
              </div>
            </article>
          )}
        </section>

        <div className="subscription-overview-divider" />

        <section className="conversion-overview-section">
          <div className="conversion-overview-header">
            <div>
              <span className="section-eyebrow">REVENUE INSIGHTS</span>
              <h3>Paid conversion</h3>
              <p>Understand subscription adoption.</p>
            </div>
            <ChartToggle
              isVisible={visibleCharts.payment}
              onClick={() => toggleChart("payment")}
              type="Chart"
            />
          </div>

          <article className="dash-panel conversion-panel">
            <span className="conversion-caption">Paying user conversion</span>
            <div className="conversion-value">{conversionRate}%</div>
            <p>of all registered users</p>
            <div className="conversion-track">
              <span style={{ width: `${conversionRate}%` }} />
            </div>
            <div className="conversion-details">
              <div>
                <span><i className="conversion-dot paid-dot" />Paying users</span>
                <strong>{formatNumber(payingUsers)}</strong>
              </div>
              <div>
                <span><i className="conversion-dot unpaid-dot" />Non-paying users</span>
                <strong>{formatNumber(nonPayingUsers)}</strong>
              </div>
            </div>
            <p className="conversion-footnote">
              Paying users ÷ total users × 100
            </p>
          </article>

          {visibleCharts.payment && (
            <article className="dash-panel payment-comparison-panel chart-reveal">
              <SectionHeader
                title="Payment comparison"
                subtitle="Paying vs. non-paying users"
              />
              <div className="payment-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Paying users", users: payingUsers, fill: "#9f56ee" },
                      { name: "Non-paying users", users: nonPayingUsers, fill: "#e4d9e7" },
                    ]}
                    layout="vertical"
                    margin={{ top: 8, right: 25, left: 8, bottom: 8 }}
                    barCategoryGap="38%"
                  >
                    <CartesianGrid stroke="#edf0f5" horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatNumber} tick={{ fontSize: 10, fill: "#8992a2" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={112} tick={{ fontSize: 11, fill: "#596273" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => [formatNumber(value), "Users"]} />
                    <Bar dataKey="users" radius={[0, 6, 6, 0]} barSize={26}>
                      {[
                        { fill: "#242a35" },
                        { fill: "#d9dee7" },
                      ].map((item, index) => <Cell key={index} fill={item.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          )}
        </section>
      </div>

      {/* REVENUE */}
      <section className="revenue-section dashboard-section">
        <div className="revenue-action-row">
          <div>
            <span className="section-eyebrow">FINANCIAL PERFORMANCE</span>
            <h3>Revenue overview</h3>
            <p>Monthly revenue from successful payments.</p>
          </div>
          <ChartToggle
            isVisible={visibleCharts.revenue}
            onClick={() => toggleChart("revenue")}
            type="Chart"
          />
        </div>

        <div className="revenue-summary-strip">
          <div>
            <span>October revenue</span>
            <strong>{formatMoney(totalRevenue)}</strong>
            <small>Sample monthly figure</small>
          </div>
          <div>
            <span>Paying customers</span>
            <strong>{formatNumber(payingUsers)}</strong>
            <small>Basic and Premium plans</small>
          </div>
          <div>
            <span>Conversion rate</span>
            <strong>{conversionRate}%</strong>
            <small>Registered users on paid plans</small>
          </div>
        </div>

        {visibleCharts.revenue && (
          <article className="dash-panel revenue-panel chart-reveal">
            <SectionHeader
              title="Monthly revenue"
              subtitle="Illustrative revenue in US dollars"
            />
            <div className="revenue-chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 16, right: 12, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="#edf0f5" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8992a2" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatCompactMoney} tick={{ fontSize: 11, fill: "#8992a2" }} axisLine={false} tickLine={false} width={62} />
                  <Tooltip formatter={(value) => [formatMoney(value), "Revenue"]} />
                  <Bar dataKey="revenue" fill="#536dfe" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        )}
      </section>

      {/* OPERATIONS */}
      <div className="dashboard-row operations-row dashboard-section">
        <article className="dash-panel operations-panel">
          <SectionHeader
            title="Expiring subscriptions"
            subtitle="Plans ending soon"
            action={
              <button type="button" className="text-action" onClick={() => onNavigate("Users")}>
                View users →
              </button>
            }
          />

          <div className="expiring-table">
            <div className="expiring-table-head">
              <span>USER</span><span>PLAN</span><span>ENDS</span>
            </div>
            {expiringUsers.map((user, index) => (
              <div className="expiring-table-row" key={user.email}>
                <div className="expiring-identity">
                  <span className={`user-avatar avatar-${index + 1}`}>
                    {user.name.charAt(0)}
                  </span>
                  <div className="expiring-person">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <span className={`plan-pill ${user.plan.toLowerCase()}`}>{user.plan}</span>
                <span className="expiry-date">{user.date}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="dash-panel operations-panel">
          <SectionHeader
            title="Job source health"
            subtitle="Collection status across sources"
            action={
              <button type="button" className="text-action" onClick={() => onNavigate("Job Sources")}>
                View sources →
              </button>
            }
          />

          <div className="source-list">
            {sourceData.map((source) => (
              <div className="source-list-row" key={source.name}>
                <div className="source-list-info">
                  <span className="source-icon">↗</span>
                  <div>
                    <strong>{source.name}</strong>
                    <span>{formatNumber(source.saved)} jobs saved</span>
                  </div>
                </div>
                <span className={`source-status status-${source.status.toLowerCase().replace(" ", "-")}`}>
                  <i />{source.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* RECENT ACTIVITY */}
      <section className="dash-panel recent-activity-panel dashboard-section">
        <SectionHeader
          title="Recent activity"
          subtitle="A quick look at the latest platform events"
          action={
            <button type="button" className="text-action" onClick={() => onNavigate("Audit Log")}>
              View audit log →
            </button>
          }
        />

        <div className="activity-filter-row">
          {["All", "Users", "Payments", "Jobs", "Alerts"].map((filter) => (
            <button
              type="button"
              key={filter}
              className={`activity-filter ${activityFilter === filter ? "active" : ""}`}
              onClick={() => setActivityFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="activity-list">
          {filteredActivity.length ? filteredActivity.map((activity, index) => (
            <div className="activity-item" key={`${activity.title}-${index}`}>
              <span className={`activity-marker activity-${activity.type}`}>
                {activity.type === "user" ? "U" : activity.type === "payment" ? "$" : activity.type === "warning" ? "!" : "J"}
              </span>
              <div className="activity-content">
                <strong>{activity.title}</strong>
                <span>{activity.detail}</span>
              </div>
              <time>{activity.time}</time>
            </div>
          )) : (
            <p className="activity-empty">No activity in this category.</p>
          )}
        </div>
      </section>

      <footer className="dashboard-footer">
        <span>AIFAGen Admin Portal</span>
        <span>Demo dashboard · Figures are illustrative, not live records.</span>
      </footer>
    </section>
  );
}
