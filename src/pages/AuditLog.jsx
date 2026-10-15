
import { useMemo, useState } from "react";
import "./AuditLog.css";
import useAssistantContext from "../hooks/useAssistantContext";

const auditData = [
  {
    id: 1,
    date: "Oct 12, 2026",
    time: "10:48 AM",
    admin: "admin@aifagen.com",
    adminName: "System Admin",
    action: "Changed Plan",
    target: "Michael Carter",
    targetType: "User",
    before: "Basic",
    after: "Premium",
    reason: "Subscription updated after customer support review",
  },
  {
    id: 2,
    date: "Oct 12, 2026",
    time: "10:32 AM",
    admin: "admin@aifagen.com",
    adminName: "Operations",
    action: "Hidden Job",
    target: "Senior Java Developer",
    targetType: "Job",
    before: "Visible",
    after: "Hidden",
    reason: "Duplicate job listing reported by the team",
  },
  {
    id: 3,
    date: "Oct 12, 2026",
    time: "10:15 AM",
    admin: "admin@aifagen.com",
    adminName: "System Admin",
    action: "Updated Profile",
    target: "Emily Johnson",
    targetType: "User",
    before: "Location: Austin",
    after: "Location: Seattle",
    reason: "Profile information updated at the user's request",
  },
  {
    id: 4,
    date: "Oct 12, 2026",
    time: "09:54 AM",
    admin: "admin@aifagen.com",
    adminName: "Support Team",
    action: "Refunded Payment",
    target: "PAY-10482",
    targetType: "Payment",
    before: "$149.99 · Paid",
    after: "$149.99 · Refunded",
    reason: "Duplicate subscription payment",
  },
  {
    id: 5,
    date: "Oct 12, 2026",
    time: "09:38 AM",
    admin: "admin@aifagen.com",
    adminName: "System Admin",
    action: "Created Internal Job",
    target: "Frontend Engineer",
    targetType: "Internal Job",
    before: "—",
    after: "Created · Visible",
    reason: "New internal hiring requirement",
  },
  // {
  //   id: 6,
  //   date: "Oct 12, 2026",
  //   time: "09:20 AM",
  //   admin: "ops@aifagen.com",
  //   adminName: "Operations",
  //   action: "Started Source Refresh",
  //   target: "All Job Sources",
  //   targetType: "Job Sources",
  //   before: "Idle",
  //   after: "Running",
  //   reason: "Scheduled job source refresh initiated manually",
  // },
  // {
  //   id: 7,
  //   date: "Oct 12, 2026",
  //   time: "09:02 AM",
  //   admin: "admin@aifagen.com",
  //   adminName: "System Admin",
  //   action: "Changed User Status",
  //   target: "James Wilson",
  //   targetType: "User",
  //   before: "Active",
  //   after: "Inactive",
  //   reason: "Account temporarily disabled for review",
  // },
  // {
  //   id: 8,
  //   date: "Oct 12, 2026",
  //   time: "08:46 AM",
  //   admin: "support@aifagen.com",
  //   adminName: "Support Team",
  //   action: "Edited Payment",
  //   target: "PAY-10461",
  //   targetType: "Payment",
  //   before: "$99.99",
  //   after: "$79.99",
  //   reason: "Approved billing adjustment",
  // },
  // {
  //   id: 9,
  //   date: "Oct 12, 2026",
  //   time: "08:25 AM",
  //   admin: "admin@aifagen.com",
  //   adminName: "System Admin",
  //   action: "Added Admin",
  //   target: "newadmin@aifagen.com",
  //   targetType: "Admin",
  //   before: "Standard user",
  //   after: "Admin access",
  //   reason: "Operations administrator access approved",
  // },
  // {
  //   id: 10,
  //   date: "Oct 12, 2026",
  //   time: "08:10 AM",
  //   admin: "ops@aifagen.com",
  //   adminName: "Operations",
  //   action: "Showed Job",
  //   target: "React Developer",
  //   targetType: "Job",
  //   before: "Hidden",
  //   after: "Visible",
  //   reason: "Job listing reviewed and approved",
  // },
];

function getActionClass(action) {
  if (action.includes("Refund")) return "refund";
  if (action.includes("Hidden")) return "danger";
  if (action.includes("Changed")) return "change";
  if (action.includes("Created") || action.includes("Added")) {
    return "create";
  }
  if (action.includes("Started")) return "run";
  if (action.includes("Showed")) return "show";
  return "edit";
}

function getActionIcon(action) {
  if (action.includes("Refund")) return "$";
  if (action.includes("Hidden")) return "−";
  if (action.includes("Showed")) return "+";
  if (action.includes("Created") || action.includes("Added")) return "+";
  if (action.includes("Started")) return "↻";
  if (action.includes("Changed")) return "↕";
  return "✎";
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AuditLog({ moderationEvents = [], onAssistantContext }) {
  const logs = useMemo(() => {
    const feedbackLogs = moderationEvents.map((entry, index) => {
      const timestamp = new Date(entry.timestamp);
      const identitySeparator = entry.admin.lastIndexOf(" (");
      const adminName = identitySeparator < 0
        ? entry.admin
        : entry.admin.slice(0, identitySeparator);
      const admin = identitySeparator < 0
        ? "admin-session"
        : entry.admin.slice(identitySeparator + 2, -1);

      return {
        id: `feedback-${entry.id || index}`,
        date: timestamp.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        time: timestamp.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        admin,
        adminName,
        action: entry.action,
        target: entry.recordId,
        targetType: `${entry.recordType} moderation`,
        before: entry.previousStatus,
        after: entry.newStatus,
        reason: entry.reason || "—",
      };
    });

    return [...feedbackLogs, ...auditData];
  }, [moderationEvents]);

  const actionTypes = useMemo(
    () => ["All actions", ...new Set(logs.map((log) => log.action))],
    [logs]
  );
  const targetTypes = useMemo(
    () => ["All items", ...new Set(logs.map((log) => log.targetType))],
    [logs]
  );
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All actions");
  const [targetFilter, setTargetFilter] = useState("All items");
  const [adminFilter, setAdminFilter] = useState("All admins");
  const [selectedLog, setSelectedLog] = useState(null);

  const adminOptions = useMemo(
    () => [...new Set(logs.map((log) => log.admin))],
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !searchText ||
        [
          log.admin,
          log.adminName,
          log.action,
          log.target,
          log.targetType,
          log.reason,
          log.before,
          log.after,
          log.date,
        ].some((value) => value.toLowerCase().includes(searchText));

      const matchesAction =
        actionFilter === "All actions" || log.action === actionFilter;

      const matchesTarget =
        targetFilter === "All items" || log.targetType === targetFilter;

      const matchesAdmin =
        adminFilter === "All admins" || log.admin === adminFilter;

      return matchesSearch && matchesAction && matchesTarget && matchesAdmin;
    });
  }, [logs, search, actionFilter, targetFilter, adminFilter]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();

    return logs.filter((log) => {
      const logDate = new Date(log.date).toDateString();
      return logDate === today;
    }).length;
  }, [logs]);

  const changesCount = useMemo(
    () => logs.filter((log) => log.before !== "—").length,
    [logs]
  );

  const activeAdminCount = adminOptions.length;
  useAssistantContext(onAssistantContext, "Audit Log", {
    entries: filteredLogs
      .slice()
      .sort((first, second) => Date.parse(second.date) - Date.parse(first.date))
      .slice(0, 10)
      .map(({ action, targetType, reason }) => ({
        action,
        targetType,
        hasReason: Boolean(reason && reason !== "—"),
      })),
    total: logs.length,
    filtered: filteredLogs.length,
    changes: changesCount,
    admins: activeAdminCount,
    reasonsRecorded: filteredLogs.filter((log) => log.reason && log.reason !== "—").length,
    filters: `action ${actionFilter}; record type ${targetFilter}; admin ${adminFilter}${search ? "; search active" : ""}`,
  });

  const hasFilters =
    search.trim() !== "" ||
    actionFilter !== "All actions" ||
    targetFilter !== "All items" ||
    adminFilter !== "All admins";

  const clearFilters = () => {
    setSearch("");
    setActionFilter("All actions");
    setTargetFilter("All items");
    setAdminFilter("All admins");
  };

  const exportCSV = () => {
    const headers = [
      "Date",
      "Time",
      "Admin Name",
      "Admin Email",
      "Action",
      "Affected Item",
      "Item Type",
      "Before",
      "After",
      "Reason",
    ];

    const rows = filteredLogs.map((log) => [
      log.date,
      log.time,
      log.adminName,
      log.admin,
      log.action,
      log.target,
      log.targetType,
      log.before,
      log.after,
      log.reason,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "aifagen-audit-log.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="audit-page">
      <div className="audit-header">
        <div className="audit-heading">
          <div className="audit-breadcrumb">
            Operations <span>/</span> Audit Log
          </div>

          <div className="audit-title-row">
            <div className="audit-title-icon">✓</div>

            <div>
              <h1>Audit Log</h1>
              <p>
                Track administrative actions, account updates, and system
                changes in one place.
              </p>
            </div>
          </div>
        </div>

        <button className="audit-export-btn" onClick={exportCSV}>
          <span>↓</span> Export CSV
        </button>
      </div>

      <div className="audit-summary">
        <div className="audit-summary-card">
          <div className="audit-summary-icon">≡</div>
          <div className="audit-summary-content">
            <span>Total actions</span>
            <strong>{logs.length}</strong>
            <small>Recorded events</small>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="audit-summary-icon icon-blue">◷</div>
          <div className="audit-summary-content">
            <span>Today</span>
            <strong>{todayCount}</strong>
            <small>Events dated today</small>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="audit-summary-icon icon-orange">↕</div>
          <div className="audit-summary-content">
            <span>Changes recorded</span>
            <strong>{changesCount}</strong>
            <small>Before-and-after entries</small>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="audit-summary-icon icon-green">●</div>
          <div className="audit-summary-content">
            <span>Admins in log</span>
            <strong>{activeAdminCount}</strong>
            <small>Unique admin accounts</small>
          </div>
        </div>
      </div>

      <section className="audit-card">
        <div className="audit-card-heading">
          <div>
            <h2>Activity history</h2>
            <p>Search, filter, and inspect recorded administrative events.</p>
          </div>

          <span className="audit-record-count">
            {filteredLogs.length} records
          </span>
        </div>

        <div className="audit-filter-bar">
          <div className="audit-search-box">
            <span className="audit-search-icon">⌕</span>
            <input
              type="text"
              aria-label="Search audit records"
              placeholder="Search admin, action, item or reason..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                className="audit-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <select
            aria-label="Filter by action"
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
          >
            {actionTypes.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by item type"
            value={targetFilter}
            onChange={(event) => setTargetFilter(event.target.value)}
          >
            {targetTypes.map((target) => (
              <option key={target} value={target}>
                {target}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by administrator"
            value={adminFilter}
            onChange={(event) => setAdminFilter(event.target.value)}
          >
            <option value="All admins">All admins</option>
            {adminOptions.map((admin) => (
              <option key={admin} value={admin}>
                {admin}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button className="audit-clear-btn" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Administrator</th>
                <th>Action</th>
                <th>Affected item</th>
                <th>Before</th>
                <th>After</th>
                <th>Reason</th>
                <th aria-label="Details" />
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="audit-empty-state">
                      <div className="audit-empty-icon">⌕</div>
                      <strong>No audit records found</strong>
                      <span>
                        Try another search term or clear your filters.
                      </span>
                      {hasFilters && (
                        <button onClick={clearFilters}>
                          Reset filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="audit-data-row"
                  >
                    <td>
                      <div className="audit-when-cell">
                        <strong>{log.date}</strong>
                        <span>{log.time}</span>
                      </div>
                    </td>

                    <td>
                      <div className="audit-admin-cell">
                        <div className="audit-avatar">
                          {getInitials(log.adminName)}
                        </div>
                        <div className="audit-admin-info">
                          <strong>{log.adminName}</strong>
                          <span>{log.admin}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="audit-action-cell">
                        <span
                          className={`audit-action-icon ${getActionClass(
                            log.action
                          )}`}
                        >
                          {getActionIcon(log.action)}
                        </span>
                        <strong>{log.action}</strong>
                      </div>
                    </td>

                    <td>
                      <div className="audit-target-cell">
                        <strong>{log.target}</strong>
                        <span>{log.targetType}</span>
                      </div>
                    </td>

                    <td>
                      <span className="audit-before-value">{log.before}</span>
                    </td>

                    <td>
                      <span className="audit-after-value">{log.after}</span>
                    </td>

                    <td>
                      <span className="audit-reason-text">{log.reason}</span>
                    </td>

                    <td>
                      <button
                        className="audit-view-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedLog(log);
                        }}
                      >
                        View <span>↗</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="audit-table-footer">
          <span>
            Showing <strong>{filteredLogs.length}</strong> of{" "}
            <strong>{logs.length}</strong> audit records
          </span>

          <span className="audit-newest-label">
            <span /> Newest first
          </span>
        </div>
      </section>

      {selectedLog && (
        <div
          className="audit-drawer-overlay"
          onClick={() => setSelectedLog(null)}
        >
          <aside
            className="audit-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-drawer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="audit-drawer-header">
              <div>
                <span className="audit-drawer-label">AUDIT EVENT</span>
                <h2 id="audit-drawer-title">{selectedLog.action}</h2>
                <span className="audit-drawer-time">
                  {selectedLog.date} · {selectedLog.time}
                </span>
              </div>

              <button
                className="audit-close-drawer"
                onClick={() => setSelectedLog(null)}
                aria-label="Close audit details"
              >
                ×
              </button>
            </div>

            <div className="audit-drawer-body">
              <div className="audit-detail-section">
                <h3>Performed by</h3>
                <div className="audit-detail-admin">
                  <div className="audit-avatar audit-avatar-large">
                    {getInitials(selectedLog.adminName)}
                  </div>
                  <div>
                    <strong>{selectedLog.adminName}</strong>
                    <span>{selectedLog.admin}</span>
                  </div>
                </div>
              </div>

              <div className="audit-detail-section">
                <h3>Affected item</h3>
                <div className="audit-target-box">
                  <span>{selectedLog.targetType}</span>
                  <strong>{selectedLog.target}</strong>
                </div>
              </div>

              <div className="audit-detail-section">
                <h3>Change details</h3>
                <div className="audit-change-box">
                  <div className="audit-change-column">
                    <span>BEFORE</span>
                    <strong>{selectedLog.before}</strong>
                  </div>

                  <div className="audit-change-arrow">→</div>

                  <div className="audit-change-column is-after">
                    <span>AFTER</span>
                    <strong>{selectedLog.after}</strong>
                  </div>
                </div>
              </div>

              <div className="audit-detail-section">
                <h3>Reason for action</h3>
                <div className="audit-reason-box">
                  <span>“</span>
                  <p>{selectedLog.reason}</p>
                </div>
              </div>

              <div className="audit-event-id">
                <span>Audit event ID</span>
                <strong>
                  AUD-{String(selectedLog.id).padStart(6, "0")}
                </strong>
              </div>
            </div>

            <div className="audit-drawer-footer">
              <button onClick={() => setSelectedLog(null)}>Close details</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
