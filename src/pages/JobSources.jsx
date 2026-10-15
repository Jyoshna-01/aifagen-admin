
// import { useState } from 'react';
// import DataTable from '../components/DataTable';

// export default function JobSources() {
//   const [sources, setSources] = useState([
//     { id: 1, name: 'RemoteOK', status: 'Working', jobs: 42 },
//     { id: 2, name: 'Jobicy', status: 'Working', jobs: 28 },
//     { id: 3, name: 'Adzuna', status: 'Failed', jobs: 0 }
//   ]);

//   return (
//     <>
//       <div className="page-heading">
//         <div><h1>Job Sources</h1><p>Monitor job collection sources</p></div>
//         <button className="btn primary" onClick={() => {
//           setSources(prev => prev.map(s => ({
//             ...s, status: 'Running'
//           })));
//         }}>Start refresh</button>
//       </div>

//       <section className="panel">
//         <p>
//           {sources.filter(s => s.status === 'Working').length} working ·
//           {' '}{sources.filter(s => s.status !== 'Working').length} need attention
//         </p>
//         <DataTable
//           columns={['SOURCE', 'STATUS', 'JOBS SAVED', 'ACTION']}
//           rows={sources.map(source => ({
//             id: source.id,
//             cells: [
//               source.name, source.status, source.jobs,
//               <button className="btn secondary" onClick={() =>
//                 setSources(prev => prev.map(s =>
//                   s.id === source.id ? { ...s, status: 'Running' } : s
//                 ))
//               }>Refresh</button>
//             ]
//           }))}
//         />
//       </section>
//     </>
//   );
// }


import { useMemo, useState } from "react";
import "./JobSources.css";
import useAssistantContext from "../hooks/useAssistantContext";

const initialSources = [
  {
    id: 1,
    name: "LinkedIn Jobs",
    status: "Working",
    lastRun: "Oct 9, 2026 · 12:42 AM",
    duration: "2m 18s",
    saved: 284,
    newJobs: 47,
    last24h: 812,
    note: "Collection completed successfully.",
    icon: "in",
  },
  {
    id: 2,
    name: "Indeed",
    status: "Working",
    lastRun: "Oct 9, 2026 · 12:35 AM",
    duration: "1m 46s",
    saved: 391,
    newJobs: 82,
    last24h: 1248,
    note: "All jobs collected normally.",
    icon: "id",
  },
  {
    id: 3,
    name: "Naukri",
    status: "Failed",
    lastRun: "Oct 9, 2026 · 11:58 PM",
    duration: "34s",
    saved: 0,
    newJobs: 0,
    last24h: 146,
    note: "Request failed repeatedly while collecting job listings.",
    icon: "na",
  },
  {
    id: 4,
    name: "Glassdoor",
    status: "Blocked",
    lastRun: "Oct 9, 2026 · 11:21 PM",
    duration: "12s",
    saved: 0,
    newJobs: 0,
    last24h: 92,
    note: "Source temporarily blocked the collection request.",
    icon: "gd",
  },
  {
    id: 5,
    name: "Wellfound",
    status: "No jobs",
    lastRun: "Oct 9, 2026 · 10:48 PM",
    duration: "58s",
    saved: 0,
    newJobs: 0,
    last24h: 0,
    note: "Collection completed but no matching jobs were found.",
    icon: "wf",
  },
  {
    id: 6,
    name: "Remotive",
    status: "Running",
    lastRun: "Running now",
    duration: "—",
    saved: 0,
    newJobs: 0,
    last24h: 184,
    note: "Collection is currently in progress.",
    icon: "re",
  },
  {
    id: 7,
    name: "Remote OK",
    status: "Skipped",
    lastRun: "Oct 9, 2026 · 9:12 PM",
    duration: "—",
    saved: 0,
    newJobs: 0,
    last24h: 76,
    note: "Skipped because the source was disabled for this run.",
    icon: "ro",
  },
];

const initialRuns = [
  {
    id: 1,
    started: "Oct 9, 2026 · 12:40 AM",
    completed: "12:45 AM",
    duration: "5m 12s",
    sources: 7,
    successful: 4,
    failed: 1,
    jobs: 675,
    newJobs: 129,
  },
  {
    id: 2,
    started: "Oct 8, 2026 · 11:58 PM",
    completed: "Oct 9 · 12:04 AM",
    duration: "6m 08s",
    sources: 7,
    successful: 5,
    failed: 1,
    jobs: 721,
    newJobs: 154,
  },
  {
    id: 3,
    started: "Oct 8, 2026 · 6:00 PM",
    completed: "6:06 PM",
    duration: "6m 02s",
    sources: 7,
    successful: 6,
    failed: 0,
    jobs: 812,
    newJobs: 188,
  },
  {
    id: 4,
    started: "Oct 8, 2026 · 12:00 PM",
    completed: "12:05 PM",
    duration: "5m 41s",
    sources: 7,
    successful: 6,
    failed: 1,
    jobs: 748,
    newJobs: 143,
  },
];

const problemStatuses = [
  "Failed",
  "Blocked",
  "Stalled",
  "Running",
  "No jobs",
  "Skipped",
];

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function SourceLogo({ source }) {
  return (
    <div className={`source-logo ${source.icon}`}>
      {source.icon === "in" && "in"}
      {source.icon === "id" && "i"}
      {source.icon === "na" && "N"}
      {source.icon === "gd" && "G"}
      {source.icon === "wf" && "W"}
      {source.icon === "re" && "R"}
      {source.icon === "ro" && "R"}
    </div>
  );
}

export default function JobSources({ onAssistantContext }) {
  const [sources, setSources] = useState(initialSources);
  const [runs, setRuns] = useState(initialRuns);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [showHistory, setShowHistory] = useState(true);

  const workingCount = useMemo(
    () => sources.filter((source) => source.status === "Working").length,
    [sources]
  );

  const attentionCount = sources.length - workingCount;
  useAssistantContext(onAssistantContext, "Job Sources", {
    sources: sources.map(({ name, status, lastRun, newJobs, note, saved }) => ({
      name, status, lastRun, newJobs, note, saved,
    })),
    runs: runs.slice(0, 5).map(({ started, completed, jobs, failed }) => ({ started, completed, jobs, failed })),
    refreshing: isRefreshing,
  });

  const sortedSources = useMemo(() => {
    return [...sources].sort((a, b) => {
      const aProblem = problemStatuses.includes(a.status);
      const bProblem = problemStatuses.includes(b.status);

      if (aProblem && !bProblem) return -1;
      if (!aProblem && bProblem) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [sources]);

  const handleRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    setSources((current) =>
      current.map((source) =>
        source.status === "Working"
          ? {
              ...source,
              status: "Running",
              lastRun: "Running now",
              note: "Collection is currently in progress.",
            }
          : source
      )
    );

    setTimeout(() => {
      setSources((current) =>
        current.map((source) =>
          source.status === "Running"
            ? {
                ...source,
                status: "Working",
                lastRun: "Just now",
                duration: "2m 04s",
                saved: source.saved + 31,
                newJobs: 31,
                last24h: source.last24h + 31,
                note: "Collection completed successfully.",
              }
            : source
        )
      );

      setRuns((current) => [
        {
          id: Date.now(),
          started: "Just now",
          completed: "Just now",
          duration: "2m 04s",
          sources: sources.length,
          successful: workingCount,
          failed: attentionCount,
          jobs: 31,
          newJobs: 31,
        },
        ...current,
      ]);

      setIsRefreshing(false);
    }, 2500);
  };

  const handleRetry = (id) => {
    setSources((current) =>
      current.map((source) =>
        source.id === id
          ? {
              ...source,
              status: "Running",
              lastRun: "Running now",
              note: "Retrying collection...",
            }
          : source
      )
    );

    setTimeout(() => {
      setSources((current) =>
        current.map((source) =>
          source.id === id
            ? {
                ...source,
                status: "Working",
                lastRun: "Just now",
                duration: "1m 52s",
                saved: source.saved + 24,
                newJobs: 24,
                last24h: source.last24h + 24,
                note: "Retry completed successfully.",
              }
            : source
        )
      );
    }, 1800);
  };

  return (
    <div className="job-sources-page">
      {/* PAGE HEADER */}
      <div className="sources-header">
        <div>
          <div className="breadcrumb">
            Operations <span>/</span> Job Sources
          </div>

          <h1>Job Sources</h1>

          <p>
            Monitor collection health, recent runs, and job ingestion across
            every source.
          </p>
        </div>

        <div className="header-actions">
          <button
            className={`refresh-btn ${isRefreshing ? "refreshing" : ""}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <span className={isRefreshing ? "spin" : ""}>↻</span>
            {isRefreshing ? "Refreshing..." : "Start refresh"}
          </button>
        </div>
      </div>

      {/* HEALTH BANNER */}
      <div className="health-banner">
        <div className="health-left">
          <div className="health-icon">✓</div>

          <div>
            <strong>
              {workingCount} working
              <span className="dot-separator">·</span>
              {attentionCount} need attention
            </strong>

            <p>
              {attentionCount === 0
                ? "All job sources are operating normally."
                : "Some sources require review before the next collection cycle."}
            </p>
          </div>
        </div>

        <div className="health-progress">
          <div className="progress-label">
            <span>Source health</span>
            <strong>
              {Math.round((workingCount / sources.length) * 100)}%
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${(workingCount / sources.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="source-summary">
        <div className="summary-card">
          <div className="summary-icon">◉</div>
          <div>
            <span>Total sources</span>
            <strong>{sources.length}</strong>
          </div>
        </div>

        <div className="summary-card healthy">
          <div className="summary-icon">✓</div>
          <div>
            <span>Working</span>
            <strong>{workingCount}</strong>
          </div>
        </div>

        <div className="summary-card warning">
          <div className="summary-icon">!</div>
          <div>
            <span>Need attention</span>
            <strong>{attentionCount}</strong>
          </div>
        </div>

        <div className="summary-card jobs">
          <div className="summary-icon">▣</div>
          <div>
            <span>Jobs · last 24h</span>
            <strong>
              {sources
                .reduce((total, source) => total + source.last24h, 0)
                .toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* SOURCES TABLE */}
      <section className="sources-card">
        <div className="section-heading">
          <div>
            <h2>Source health</h2>
            <p>Problem sources are automatically shown first.</p>
          </div>

          <div className="live-indicator">
            <span />
            Live monitoring
          </div>
        </div>

        <div className="table-wrapper">
          <table className="sources-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Status</th>
                <th>Last run</th>
                <th>Duration</th>
                <th>Jobs saved</th>
                <th>Last 24 hours</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {sortedSources.map((source) => (
                <tr
                  key={source.id}
                  className={
                    problemStatuses.includes(source.status)
                      ? "problem-row"
                      : ""
                  }
                  onClick={() => setSelectedSource(source)}
                >
                  <td>
                    <div className="source-cell">
                      <SourceLogo source={source} />

                      <div>
                        <strong>{source.name}</strong>
                        <span>Job collection source</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        source.status
                      )}`}
                    >
                      <span className="status-dot" />
                      {source.status}
                    </span>
                  </td>

                  <td>
                    <div className="run-time">
                      {source.lastRun}
                    </div>
                  </td>

                  <td>
                    <span className="duration">
                      {source.duration}
                    </span>
                  </td>

                  <td>
                    <div className="saved-jobs">
                      <strong>{source.saved.toLocaleString()}</strong>

                      {source.newJobs > 0 && (
                        <span>+{source.newJobs} new</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <strong className="last-24">
                      {source.last24h.toLocaleString()}
                    </strong>
                  </td>

                  <td>
                    <div className="problem-note">
                      {source.status !== "Working" &&
                        source.status !== "Running" && (
                          <span className="note-warning">!</span>
                        )}

                      <span>{source.note}</span>
                    </div>
                  </td>

                  <td>
                    <button
                      className="row-arrow"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedSource(source);
                      }}
                    >
                      →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* HISTORY */}
      <section className="history-card">
        <button
          className="history-heading"
          onClick={() => setShowHistory(!showHistory)}
        >
          <div>
            <h2>Recent collection runs</h2>
            <p>Latest activity across all job sources.</p>
          </div>

          <span className={`chevron ${showHistory ? "open" : ""}`}>
            ↓
          </span>
        </button>

        {showHistory && (
          <div className="history-content">
            {runs.map((run) => (
              <div className="history-row" key={run.id}>
                <div className="history-status">
                  <span className="history-check">✓</span>
                </div>

                <div className="history-main">
                  <strong>{run.started}</strong>
                  <span>Collection run completed</span>
                </div>

                <div className="history-stat">
                  <span>Duration</span>
                  <strong>{run.duration}</strong>
                </div>

                <div className="history-stat">
                  <span>Sources</span>
                  <strong>
                    {run.successful}/{run.sources}
                  </strong>
                </div>

                <div className="history-stat">
                  <span>Jobs saved</span>
                  <strong>{run.jobs.toLocaleString()}</strong>
                </div>

                <div className="history-new">
                  <span>New</span>
                  <strong>+{run.newJobs}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SIDE PANEL */}
      {selectedSource && (
        <div
          className="drawer-overlay"
          onClick={() => setSelectedSource(null)}
        >
          <aside
            className="source-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <span className="drawer-label">SOURCE DETAILS</span>

                <div className="drawer-source-title">
                  <SourceLogo source={selectedSource} />
                  <h2>{selectedSource.name}</h2>
                </div>
              </div>

              <button
                className="close-drawer"
                onClick={() => setSelectedSource(null)}
              >
                ×
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-status">
                <span>Status</span>

                <span
                  className={`status-badge ${getStatusClass(
                    selectedSource.status
                  )}`}
                >
                  <span className="status-dot" />
                  {selectedSource.status}
                </span>
              </div>

              <div className="drawer-section">
                <h3>Collection details</h3>

                <div className="detail-grid">
                  <div>
                    <span>Last run</span>
                    <strong>{selectedSource.lastRun}</strong>
                  </div>

                  <div>
                    <span>Duration</span>
                    <strong>{selectedSource.duration}</strong>
                  </div>

                  <div>
                    <span>Jobs saved</span>
                    <strong>
                      {selectedSource.saved.toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>New jobs</span>
                    <strong>
                      +{selectedSource.newJobs}
                    </strong>
                  </div>

                  <div>
                    <span>Last 24 hours</span>
                    <strong>
                      {selectedSource.last24h.toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Source ID</span>
                    <strong>SRC-{String(selectedSource.id).padStart(3, "0")}</strong>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <h3>Latest note</h3>

                <div
                  className={`drawer-note ${
                    selectedSource.status === "Working"
                      ? "success-note"
                      : "warning-note"
                  }`}
                >
                  <span>
                    {selectedSource.status === "Working" ? "✓" : "!"}
                  </span>

                  <p>{selectedSource.note}</p>
                </div>
              </div>

              <div className="drawer-section">
                <h3>Actions</h3>

                <button
                  className="drawer-action"
                  onClick={() => handleRetry(selectedSource.id)}
                  disabled={selectedSource.status === "Running"}
                >
                  ↻ Retry collection
                </button>

                <button className="drawer-action secondary">
                  ◷ View run history
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
