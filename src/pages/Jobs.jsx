
import { useMemo, useState } from "react";
import "./Jobs.css";
import useAssistantContext from "../hooks/useAssistantContext";

const initialJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    country: "United States",
    workMode: "Hybrid",
    employmentType: "Full-time",
    area: "Software Engineering",
    salary: "$140,000 - $185,000",
    source: "Greenhouse",
    sourceUrl: "https://careers.microsoft.com/",
    postedAt: "2026-10-12T09:00:00-07:00",
    collectedAt: "2026-10-12T10:15:00-07:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: "JOB-101",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Stripe",
    location: "New York, NY",
    country: "United States",
    workMode: "On-site",
    employmentType: "Full-time",
    area: "Full Stack",
    salary: "$125,000 - $165,000",
    source: "Lever",
    sourceUrl: "https://stripe.com/jobs",
    postedAt: "2026-10-11T08:00:00-04:00",
    collectedAt: "2026-10-11T09:30:00-04:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: "JOB-102",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Airbnb",
    location: "San Francisco, CA",
    country: "United States",
    workMode: "Hybrid",
    employmentType: "Full-time",
    area: "Data Analyst",
    salary: "$95,000 - $130,000",
    source: "Company Career Page",
    sourceUrl: "https://careers.airbnb.com/",
    postedAt: "2026-10-10T10:00:00-07:00",
    collectedAt: "2026-10-12T08:30:00-07:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: "JOB-103",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Amazon",
    location: "Seattle, WA",
    country: "United States",
    workMode: "On-site",
    employmentType: "Full-time",
    area: "DevOps",
    salary: "$130,000 - $175,000",
    source: "Company Career Page",
    sourceUrl: "https://www.amazon.jobs/",
    postedAt: "2026-10-09T09:00:00-07:00",
    collectedAt: "2026-10-09T11:00:00-07:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: "JOB-104",
  },
  {
    id: 5,
    title: "Full Stack Developer",
    company: "Stripe",
    location: "Remote, United States",
    country: "United States",
    workMode: "Remote (US)",
    employmentType: "Full-time",
    area: "Full Stack",
    salary: "$125,000 - $165,000",
    source: "Greenhouse",
    sourceUrl: "https://stripe.com/jobs",
    postedAt: "2026-10-11T08:00:00-04:00",
    collectedAt: "2026-10-12T07:00:00-04:00",
    collectionStatus: "Collected",
    visible: false,
    duplicateGroup: "JOB-102",
  },
  {
    id: 6,
    title: "Machine Learning Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    country: "United States",
    workMode: "Hybrid",
    employmentType: "Full-time",
    area: "AI / ML",
    salary: "$160,000 - $230,000",
    source: "Company Career Page",
    sourceUrl: "https://jobs.netflix.com/",
    postedAt: "2026-10-12T08:00:00-07:00",
    collectedAt: "2026-10-12T09:00:00-07:00",
    collectionStatus: "Running",
    visible: true,
    duplicateGroup: null,
  },
  {
    id: 7,
    title: "Business Analyst",
    company: "Deloitte",
    location: "Chicago, IL",
    country: "United States",
    workMode: "Hybrid",
    employmentType: "Full-time",
    area: "Business Analyst",
    salary: "$85,000 - $115,000",
    source: "Company Career Page",
    sourceUrl: "https://www.deloitte.com/us/en/careers.html",
    postedAt: "2026-10-08T09:00:00-05:00",
    collectedAt: "2026-10-08T10:30:00-05:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: null,
  },
  {
    id: 8,
    title: "Network Engineer",
    company: "Cisco",
    location: "Austin, TX",
    country: "United States",
    workMode: "On-site",
    employmentType: "Full-time",
    area: "Network Engineer",
    salary: "$100,000 - $140,000",
    source: "Company Career Page",
    sourceUrl: "https://jobs.cisco.com/",
    postedAt: "2026-10-06T09:00:00-05:00",
    collectedAt: "2026-10-06T10:00:00-05:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: null,
  },
  {
    id: 9,
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    country: "United States",
    workMode: "Hybrid",
    employmentType: "Full-time",
    area: "Software Engineering",
    salary: "$145,000 - $200,000",
    source: "Company Career Page",
    sourceUrl: "https://www.google.com/about/careers/applications/",
    postedAt: "2026-10-05T09:00:00-07:00",
    collectedAt: "2026-10-05T11:00:00-07:00",
    collectionStatus: "Failed",
    visible: false,
    duplicateGroup: null,
  },
  {
    id: 10,
    title: "Data Scientist",
    company: "Uber",
    location: "New York, NY",
    country: "United States",
    workMode: "Remote (US)",
    employmentType: "Full-time",
    area: "Data Scientist",
    salary: "$120,000 - $165,000",
    source: "Lever",
    sourceUrl: "https://www.uber.com/us/en/careers/",
    postedAt: "2026-10-02T09:00:00-04:00",
    collectedAt: "2026-10-02T11:00:00-04:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: null,
  },
  {
    id: 11,
    title: "IT Support Specialist",
    company: "Adobe",
    location: "San Jose, CA",
    country: "United States",
    workMode: "On-site",
    employmentType: "Full-time",
    area: "IT Support",
    salary: "$65,000 - $90,000",
    source: "Company Career Page",
    sourceUrl: "https://careers.adobe.com/",
    postedAt: "2026-09-25T09:00:00-07:00",
    collectedAt: "2026-09-25T10:00:00-07:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: null,
  },
  {
    id: 12,
    title: "Quality Automation Engineer",
    company: "Salesforce",
    location: "Atlanta, GA",
    country: "United States",
    workMode: "Hybrid",
    employmentType: "Full-time",
    area: "Quality Automation",
    salary: "$100,000 - $135,000",
    source: "Company Career Page",
    sourceUrl: "https://careers.salesforce.com/",
    postedAt: "2026-09-20T09:00:00-04:00",
    collectedAt: "2026-09-20T10:00:00-04:00",
    collectionStatus: "Collected",
    visible: true,
    duplicateGroup: null,
  },
];

const dateFilters = [
  { label: "All dates", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 2 days", value: "2" },
  { label: "Last 4 days", value: "4" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Custom range", value: "custom" },
];

const statusOptions = [
  "Collected",
  "Running",
  "Failed",
  "Blocked",
  "Skipped",
  "Stalled",
  "No jobs",
];

function getAge(postedAt) {
  const hours = Math.max(
    0,
    Math.floor((Date.now() - new Date(postedAt).getTime()) / 3600000)
  );

  if (hours < 1) return "Less than 1 hour";
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours
    ? `${days}d ${remainingHours}h ago`
    : `${days}d ago`;
}

function getAgeHours(postedAt) {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(postedAt).getTime()) / 3600000)
  );
}

function formatDate(dateString) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

function getDuplicateCount(job, jobs) {
  if (!job.duplicateGroup) return 1;

  return jobs.filter(
    (item) => item.duplicateGroup === job.duplicateGroup
  ).length;
}

export default function Jobs({ onAssistantContext }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All sources");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [workModeFilter, setWorkModeFilter] = useState("All work modes");
  const [visibilityFilter, setVisibilityFilter] = useState("All jobs");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [dateFilter, setDateFilter] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [notice, setNotice] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const sources = useMemo(
    () => ["All sources", ...new Set(jobs.map((job) => job.source))],
    [jobs]
  );

  const locations = useMemo(
    () => ["All locations", ...new Set(jobs.map((job) => job.location))],
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const now = Date.now();

    return jobs.filter((job) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        [
          job.title,
          job.company,
          job.location,
          job.area,
          job.source,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesSource =
        sourceFilter === "All sources" || job.source === sourceFilter;

      const matchesLocation =
        locationFilter === "All locations" ||
        job.location === locationFilter;

      const matchesWorkMode =
        workModeFilter === "All work modes" ||
        job.workMode === workModeFilter;

      const matchesVisibility =
        visibilityFilter === "All jobs" ||
        (visibilityFilter === "Visible" && job.visible) ||
        (visibilityFilter === "Hidden" && !job.visible);

      const matchesStatus =
        statusFilter === "All statuses" ||
        job.collectionStatus === statusFilter;

      const postedTime = new Date(job.postedAt).getTime();
      const ageHours = (now - postedTime) / 3600000;

      let matchesDate = true;

      if (dateFilter === "today") {
        const today = new Date();
        const postedDate = new Date(job.postedAt);

        matchesDate =
          postedDate.getFullYear() === today.getFullYear() &&
          postedDate.getMonth() === today.getMonth() &&
          postedDate.getDate() === today.getDate();
      } else if (dateFilter !== "all" && dateFilter !== "custom") {
        matchesDate = ageHours <= Number(dateFilter) * 24;
      } else if (dateFilter === "custom") {
        const start = customStart
          ? new Date(`${customStart}T00:00:00`).getTime()
          : -Infinity;

        const end = customEnd
          ? new Date(`${customEnd}T23:59:59`).getTime()
          : Infinity;

        matchesDate = postedTime >= start && postedTime <= end;
      }

      const matchesDuplicate =
        !duplicatesOnly || getDuplicateCount(job, jobs) > 1;

      return (
        matchesSearch &&
        matchesSource &&
        matchesLocation &&
        matchesWorkMode &&
        matchesVisibility &&
        matchesStatus &&
        matchesDate &&
        matchesDuplicate
      );
    });
  }, [
    jobs,
    search,
    sourceFilter,
    locationFilter,
    workModeFilter,
    visibilityFilter,
    statusFilter,
    dateFilter,
    customStart,
    customEnd,
    duplicatesOnly,
  ]);

  const duplicateGroups = useMemo(() => {
    const groups = {};

    jobs.forEach((job) => {
      if (!job.duplicateGroup) return;

      if (!groups[job.duplicateGroup]) {
        groups[job.duplicateGroup] = [];
      }

      groups[job.duplicateGroup].push(job);
    });

    return Object.values(groups).filter((group) => group.length > 1);
  }, [jobs]);

  const todayCount = jobs.filter((job) => {
    const today = new Date();
    const posted = new Date(job.postedAt);

    return (
      posted.getFullYear() === today.getFullYear() &&
      posted.getMonth() === today.getMonth() &&
      posted.getDate() === today.getDate()
    );
  }).length;
  useAssistantContext(onAssistantContext, "Jobs", {
    total: jobs.length,
    filtered: filteredJobs.length,
    jobs: jobs.map((job) => ({
      title: job.title,
      company: job.company,
      location: job.location,
      source: job.source,
      visible: job.visible,
      status: job.collectionStatus,
      isRecent: (Date.now() - new Date(job.postedAt).getTime()) <= 7 * 86400000,
    })),
    filters: `source ${sourceFilter}; location ${locationFilter}; visibility ${visibilityFilter}; collection status ${statusFilter}; date ${dateFilter}${duplicatesOnly ? "; duplicates only" : ""}${search ? "; search active" : ""}`,
  });

  const stats = [
    { label: "Total jobs", value: jobs.length },
    { label: "Visible jobs", value: jobs.filter((job) => job.visible).length },
    { label: "Hidden jobs", value: jobs.filter((job) => !job.visible).length },
    { label: "Duplicate listings", value: duplicateGroups.length },
    { label: "Posted today", value: todayCount },
    {
      label: "Collection issues",
      value: jobs.filter(
        (job) =>
          !["Collected", "Running"].includes(job.collectionStatus)
      ).length,
    },
  ];

  function toggleSelection(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleAllVisible() {
    const visibleIds = filteredJobs.map((job) => job.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));

    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])]
    );
  }

  function updateVisibility(ids, visible) {
    setJobs((current) =>
      current.map((job) =>
        ids.includes(job.id) ? { ...job, visible } : job
      )
    );

    setSelectedIds([]);
    setSelectedJob((current) =>
      current && ids.includes(current.id)
        ? { ...current, visible }
        : current
    );

    setNotice(
      `${ids.length} demo job${ids.length === 1 ? "" : "s"} ${
        visible ? "shown" : "hidden"
      }.`
    );
  }

  function exportCSV() {
    const headers = [
      "Job Title",
      "Company",
      "Location",
      "Country",
      "Work Mode",
      "Employment Type",
      "Area",
      "Salary USD",
      "Source",
      "Source URL",
      "Posted At",
      "Age Hours",
      "Collected At",
      "Collection Status",
      "Visible",
      "Duplicate Group",
    ];

    const rows = filteredJobs.map((job) => [
      job.title,
      job.company,
      job.location,
      job.country,
      job.workMode,
      job.employmentType,
      job.area,
      job.salary,
      job.source,
      job.sourceUrl,
      job.postedAt,
      getAgeHours(job.postedAt),
      job.collectedAt,
      job.collectionStatus,
      job.visible ? "Yes" : "No",
      job.duplicateGroup || "",
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "aifagen-us-jobs.csv";
    link.click();

    URL.revokeObjectURL(url);
    setNotice("US jobs CSV exported.");
  }

  function refreshDemo() {
    setJobs((current) =>
      current.map((job) => ({
        ...job,
        collectedAt: new Date().toISOString(),
      }))
    );

    setNotice(
      "Demo collection timestamps refreshed. No live job sources were contacted."
    );
  }

  function resetFilters() {
    setSearch("");
    setSourceFilter("All sources");
    setLocationFilter("All locations");
    setWorkModeFilter("All work modes");
    setVisibilityFilter("All jobs");
    setStatusFilter("All statuses");
    setDateFilter("all");
    setCustomStart("");
    setCustomEnd("");
    setDuplicatesOnly(false);
  }

  return (
    <div className="jobs-page">
      <div className="jobs-page-header">
        <div>
          <p className="jobs-eyebrow">JOB MONITORING</p>
          <h1>Jobs</h1>
          <p className="jobs-subtitle">
            Monitor US job listings, source health, posting age, and duplicates.
          </p>
        </div>

        <div className="jobs-header-actions">
          <button className="jobs-secondary-btn" onClick={refreshDemo}>
            ↻ Refresh demo
          </button>
          <button className="jobs-primary-btn" onClick={exportCSV}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div className="jobs-demo-notice">
        <strong>Demo environment</strong>
        <span>
          sample listings only. Live job collection requires backend
          integrations and verified source data.
        </span>
      </div>

      {notice && (
        <div className="jobs-notice">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}

      <div className="jobs-stats-grid">
        {stats.map((stat) => (
          <div className="jobs-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="jobs-section-card">
        <div className="jobs-section-header">
          <div>
            <h2>Job listings</h2>
            <p>
              Showing {filteredJobs.length} of {jobs.length} demo listings
            </p>
          </div>

          <button
            className="jobs-text-btn"
            onClick={() => setShowFilters((current) => !current)}
          >
            {showFilters ? "Hide filters −" : "Show filters +"}
          </button>
        </div>

        {showFilters && (
          <div className="jobs-filters">
            <input
              type="search"
              placeholder="Search title, company, city, source..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="jobs-search-input"
            />

            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
            >
              {sources.map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>

            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            >
              {locations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>

            <select
              value={workModeFilter}
              onChange={(event) => setWorkModeFilter(event.target.value)}
            >
              <option>All work modes</option>
              <option>Remote (US)</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>

            <select
              value={visibilityFilter}
              onChange={(event) => setVisibilityFilter(event.target.value)}
            >
              <option>All jobs</option>
              <option>Visible</option>
              <option>Hidden</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All statuses</option>
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            >
              {dateFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            {dateFilter === "custom" && (
              <div className="jobs-custom-date-range">
                <label>
                  From
                  <input
                    type="date"
                    value={customStart}
                    onChange={(event) => setCustomStart(event.target.value)}
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    value={customEnd}
                    min={customStart || undefined}
                    onChange={(event) => setCustomEnd(event.target.value)}
                  />
                </label>
              </div>
            )}

            <label className="jobs-duplicate-filter">
              <input
                type="checkbox"
                checked={duplicatesOnly}
                onChange={(event) => setDuplicatesOnly(event.target.checked)}
              />
              Show duplicates only
            </label>

            <button className="jobs-reset-btn" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}

        {selectedIds.length > 0 && (
          <div className="jobs-bulk-toolbar">
            <span>{selectedIds.length} selected</span>
            <button
              className="jobs-secondary-btn"
              onClick={() => updateVisibility(selectedIds, true)}
            >
              Show selected
            </button>
            <button
              className="jobs-secondary-btn"
              onClick={() => updateVisibility(selectedIds, false)}
            >
              Hide selected
            </button>
            <button
              className="jobs-text-btn"
              onClick={() => setSelectedIds([])}
            >
              Clear selection
            </button>
          </div>
        )}

        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      filteredJobs.length > 0 &&
                      filteredJobs.every((job) => selectedIds.includes(job.id))
                    }
                    onChange={toggleAllVisible}
                    aria-label="Select all filtered jobs"
                  />
                </th>
                <th>Job / Company</th>
                <th>US Location</th>
                <th>Work mode</th>
                <th>Salary (USD)</th>
                <th>Source</th>
                <th>Posted / Age</th>
                <th>Collection</th>
                <th>Duplicates</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => {
                const duplicateCount = getDuplicateCount(job, jobs);

                return (
                  <tr key={job.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(job.id)}
                        onChange={() => toggleSelection(job.id)}
                        aria-label={`Select ${job.title}`}
                      />
                    </td>

                    <td>
                      <button
                        className="jobs-title-link"
                        onClick={() => setSelectedJob(job)}
                      >
                        {job.title}
                      </button>
                      <div className="jobs-company-name">{job.company}</div>
                      <div className="jobs-employment-type">
                        {job.employmentType}
                      </div>
                    </td>

                    <td>
                      <span>{job.location}</span>
                      <div className="jobs-muted-text">{job.country}</div>
                    </td>

                    <td>
                      <span className="jobs-neutral-badge">{job.workMode}</span>
                    </td>

                    <td>{job.salary || "Not provided"}</td>

                    <td>
                      <span>{job.source}</span>
                      <div>
                        <a
                          className="jobs-source-link"
                          href={job.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open source ↗
                        </a>
                      </div>
                    </td>

                    <td>
                      <div>{formatDate(job.postedAt)}</div>
                      <span className="jobs-age-badge">
                        {getAge(job.postedAt)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`jobs-status-badge ${job.collectionStatus
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {job.collectionStatus}
                      </span>
                      <div className="jobs-muted-text">
                        {formatDate(job.collectedAt)}
                      </div>
                    </td>

                    <td>
                      {duplicateCount > 1 ? (
                        <button
                          className="jobs-duplicate-badge"
                          onClick={() => setSelectedJob(job)}
                        >
                          {duplicateCount} appearances
                        </button>
                      ) : (
                        <span className="jobs-muted-text">Unique</span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`jobs-visibility-badge ${
                          job.visible ? "is-visible" : "is-hidden"
                        }`}
                      >
                        {job.visible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    <td>
                      <div className="jobs-row-actions">
                        <button
                          className="jobs-action-btn"
                          onClick={() => setSelectedJob(job)}
                        >
                          Details
                        </button>
                        <button
                          className="jobs-action-btn"
                          onClick={() =>
                            updateVisibility([job.id], !job.visible)
                          }
                        >
                          {job.visible ? "Hide" : "Show"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan="11" className="jobs-empty-state">
                    <strong>No jobs match these filters</strong>
                    <p>Try another date range, source, location, or keyword.</p>
                    <button className="jobs-reset-btn" onClick={resetFilters}>
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="jobs-section-card jobs-duplicate-section">
        <div className="jobs-section-header">
          <div>
            <h2>Duplicate monitoring</h2>
            <p>
              Listings grouped together for review. Similar titles alone do not
              prove that two jobs are duplicates.
            </p>
          </div>
          <span className="jobs-neutral-badge">
            {duplicateGroups.length} groups
          </span>
        </div>

        {duplicateGroups.length === 0 ? (
          <p className="jobs-empty-state">No duplicate groups found.</p>
        ) : (
          <div className="jobs-duplicate-list">
            {duplicateGroups.map((group) => (
              <div className="jobs-duplicate-group" key={group[0].duplicateGroup}>
                <div>
                  <strong>{group[0].title}</strong>
                  <p>
                    {group[0].company} · {group.length} recorded appearances
                  </p>
                  <span className="jobs-muted-text">
                    Group ID: {group[0].duplicateGroup}
                  </span>
                </div>

                <div className="jobs-duplicate-appearances">
                  {group.map((job) => (
                    <div key={job.id}>
                      <span>{job.source}</span>
                      <span>{formatDate(job.collectedAt)}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="jobs-secondary-btn"
                  onClick={() => setSelectedJob(group[0])}
                >
                  Review group
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <div
          className="jobs-drawer-backdrop"
          onClick={() => setSelectedJob(null)}
          role="presentation"
        >
          <aside
            className="jobs-details-drawer"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Job details"
          >
            <div className="jobs-drawer-header">
              <div>
                <p className="jobs-eyebrow">US JOB DETAILS</p>
                <h2>{selectedJob.title}</h2>
                <p>{selectedJob.company}</p>
              </div>

              <button
                className="jobs-close-btn"
                onClick={() => setSelectedJob(null)}
                aria-label="Close job details"
              >
                ×
              </button>
            </div>

            <div className="jobs-drawer-content">
              <div className="jobs-detail-grid">
                <div>
                  <span>Location</span>
                  <strong>{selectedJob.location}</strong>
                </div>
                <div>
                  <span>Work mode</span>
                  <strong>{selectedJob.workMode}</strong>
                </div>
                <div>
                  <span>Employment type</span>
                  <strong>{selectedJob.employmentType}</strong>
                </div>
                <div>
                  <span>Salary (USD)</span>
                  <strong>{selectedJob.salary || "Not provided"}</strong>
                </div>
                <div>
                  <span>Job area</span>
                  <strong>{selectedJob.area}</strong>
                </div>
                <div>
                  <span>Posting age</span>
                  <strong>{getAge(selectedJob.postedAt)}</strong>
                </div>
                <div>
                  <span>Posted at</span>
                  <strong>{formatDate(selectedJob.postedAt)}</strong>
                </div>
                <div>
                  <span>Last collected</span>
                  <strong>{formatDate(selectedJob.collectedAt)}</strong>
                </div>
                <div>
                  <span>Collection status</span>
                  <strong>{selectedJob.collectionStatus}</strong>
                </div>
                <div>
                  <span>Duplicate group</span>
                  <strong>{selectedJob.duplicateGroup || "None"}</strong>
                </div>
              </div>

              <div className="jobs-detail-section">
                <h3>Original job source</h3>
                <p>{selectedJob.source}</p>
                <a
                  href={selectedJob.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="jobs-original-url"
                >
                  {selectedJob.sourceUrl} ↗
                </a>
                <p className="jobs-muted-text">
                  Verify the specific job posting on the source site. This demo
                  uses company career-page links, not verified individual job
                  URLs.
                </p>
              </div>

              <div className="jobs-detail-section">
                <h3>Duplicate history</h3>

                {selectedJob.duplicateGroup ? (
                  jobs
                    .filter(
                      (job) =>
                        job.duplicateGroup === selectedJob.duplicateGroup
                    )
                    .map((job) => (
                      <div className="jobs-history-row" key={job.id}>
                        <div>
                          <strong>{job.source}</strong>
                          <p>{job.location}</p>
                        </div>
                        <span>{formatDate(job.collectedAt)}</span>
                      </div>
                    ))
                ) : (
                  <p>No other demo listings are assigned to this group.</p>
                )}
              </div>
            </div>

            <div className="jobs-drawer-footer">
              <button
                className="jobs-secondary-btn"
                onClick={() =>
                  updateVisibility([selectedJob.id], !selectedJob.visible)
                }
              >
                {selectedJob.visible ? "Hide listing" : "Show listing"}
              </button>

              <button
                className="jobs-primary-btn"
                onClick={() => setSelectedJob(null)}
              >
                Done
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
