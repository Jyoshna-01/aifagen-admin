
import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  BriefcaseBusiness,
  CalendarDays,
  Search,
  Plus,
  Pencil,
  Eye,
  X,
  FileText,
  Clock,
  TrendingUp,
  ChevronDown,
  Mail,
  Phone,
  Download,
  Filter,
  Activity,
  CircleCheck,
} from "lucide-react";
import "./Recruiters.css";
import useAssistantContext from "../hooks/useAssistantContext";

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

/*
  Sample data structure:
  Each recruiter has candidateProfiles.
  Each candidate has applications.
  Each application has a date, company, role and status.

  Connect this structure to your shared Recruiter Workspace
  data when integrating with your actual application records.
*/

const initialRecruiters = [
  {
    id: 1,
    name: "Ananya Reddy",
    email: "ananya@aifagenlabs.com",
    phone: "9876543210",
    role: "Technical Recruiter",
    team: "Technology Hiring",
    status: "Active",
    joinedDate: "2026-01-12",
    candidates: 28,
    interviews: 8,
    placed: 6,
    pending: 9,
    responsibilities:
      "Java and Spring Boot candidate sourcing, technical screening, interview coordination and candidate follow-ups.",
    description:
      "Handles technology hiring and coordinates with candidates and hiring teams throughout the recruitment process.",
    candidateProfiles: [
      {
        id: "C101",
        name: "Arjun Kumar",
        email: "arjun.kumar@example.com",
        phone: "9000000101",
        skills: "Java, Spring Boot, MySQL",
        status: "Interview",
        applications: [
          {
            id: "APP-101",
            company: "TechNova",
            role: "Java Developer",
            date: daysAgo(0),
            status: "Interview",
          },
          {
            id: "APP-102",
            company: "CloudAxis",
            role: "Backend Developer",
            date: daysAgo(0),
            status: "Applied",
          },
          {
            id: "APP-103",
            company: "InnoSoft",
            role: "Associate Engineer",
            date: daysAgo(1),
            status: "Screening",
          },
        ],
      },
      {
        id: "C102",
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "9000000102",
        skills: "Angular, JavaScript, REST API",
        status: "Screening",
        applications: [
          {
            id: "APP-104",
            company: "Bright Systems",
            role: "Frontend Developer",
            date: daysAgo(0),
            status: "Applied",
          },
          {
            id: "APP-105",
            company: "NextWave",
            role: "Full Stack Developer",
            date: daysAgo(2),
            status: "Screening",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Kiran Kumar",
    email: "kiran@aifagenlabs.com",
    phone: "9876543211",
    role: "Placement Recruiter",
    team: "Placement Operations",
    status: "Active",
    joinedDate: "2026-02-05",
    candidates: 34,
    interviews: 10,
    placed: 8,
    pending: 12,
    responsibilities:
      "Candidate placement tracking, employer coordination, offer follow-ups and placement reports.",
    description:
      "Manages placement operations and tracks candidate progress from interview to offer.",
    candidateProfiles: [
      {
        id: "C201",
        name: "Rahul Reddy",
        email: "rahul.reddy@example.com",
        phone: "9000000201",
        skills: "React, Node.js, MongoDB",
        status: "Applied",
        applications: [
          {
            id: "APP-201",
            company: "PixelWorks",
            role: "MERN Developer",
            date: daysAgo(0),
            status: "Applied",
          },
          {
            id: "APP-202",
            company: "CodeBridge",
            role: "Software Engineer",
            date: daysAgo(1),
            status: "Screening",
          },
        ],
      },
      {
        id: "C202",
        name: "Meghana Rao",
        email: "meghana.rao@example.com",
        phone: "9000000202",
        skills: "Java, SQL, Hibernate",
        status: "Placed",
        applications: [
          {
            id: "APP-203",
            company: "Apex Digital",
            role: "Junior Java Developer",
            date: daysAgo(3),
            status: "Offer",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Sneha Sharma",
    email: "sneha@aifagenlabs.com",
    phone: "9876543212",
    role: "Junior Recruiter",
    team: "Candidate Success",
    status: "Active",
    joinedDate: "2026-03-18",
    candidates: 22,
    interviews: 5,
    placed: 4,
    pending: 7,
    responsibilities:
      "Student onboarding, resume collection, candidate communication and follow-up scheduling.",
    description:
      "Supports candidates with onboarding, profile preparation and recruitment follow-ups.",
    candidateProfiles: [
      {
        id: "C301",
        name: "Divya Patel",
        email: "divya.patel@example.com",
        phone: "9000000301",
        skills: "Data Analysis, Excel, SQL",
        status: "Screening",
        applications: [
          {
            id: "APP-301",
            company: "DataSphere",
            role: "Data Analyst",
            date: daysAgo(0),
            status: "Applied",
          },
          {
            id: "APP-302",
            company: "Insight Labs",
            role: "Junior Analyst",
            date: daysAgo(4),
            status: "Screening",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Rahul Verma",
    email: "rahul@aifagenlabs.com",
    phone: "9876543213",
    role: "Technical Recruiter",
    team: "Technology Hiring",
    status: "On Leave",
    joinedDate: "2026-04-22",
    candidates: 18,
    interviews: 3,
    placed: 2,
    pending: 8,
    responsibilities:
      "Data and AI candidate sourcing, skill assessment coordination and technical interview tracking.",
    description:
      "Supports technical recruitment and candidate handovers between hiring stages.",
    candidateProfiles: [
      {
        id: "C401",
        name: "Vikram Singh",
        email: "vikram.singh@example.com",
        phone: "9000000401",
        skills: "Python, Machine Learning, SQL",
        status: "Applied",
        applications: [
          {
            id: "APP-401",
            company: "AI Horizon",
            role: "AI Associate",
            date: daysAgo(1),
            status: "Applied",
          },
        ],
      },
    ],
  },
];

const emptyRecruiter = {
  name: "",
  email: "",
  phone: "",
  role: "Technical Recruiter",
  team: "Technology Hiring",
  status: "Active",
  joinedDate: "",
  candidates: 0,
  interviews: 0,
  placed: 0,
  pending: 0,
  responsibilities: "",
  description: "",
  candidateProfiles: [],
};

const applicationStatuses = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const statusClass = (status) =>
  String(status || "Applied")
    .toLowerCase()
    .replace(/\s+/g, "-");

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="recruiter-stat-card">
      <div className="recruiter-stat-top">
        <p>{label}</p>
        <span className="recruiter-stat-icon">
          <Icon size={19} />
        </span>
      </div>
      <h2>{value}</h2>
      <span>{note}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`recruiter-status ${
        status === "Active"
          ? "status-active"
          : status === "On Leave"
          ? "status-leave"
          : statusClass(status)
      }`}
    >
      {status || "Applied"}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="recruiter-feature-empty">
      <FileText size={25} />
      <p>{message}</p>
    </div>
  );
}

function ApplicationTracker({
  recruiters,
  selectedDate,
  setSelectedDate,
  selectedRecruiterId,
  setSelectedRecruiterId,
  search,
}) {
  const allCandidates = useMemo(() => {
    return recruiters.flatMap((recruiter) =>
      (recruiter.candidateProfiles || []).map((candidate) => ({
        ...candidate,
        recruiterId: recruiter.id,
        recruiterName: recruiter.name,
      }))
    );
  }, [recruiters]);

  const allApplications = useMemo(() => {
    return allCandidates.flatMap((candidate) =>
      (candidate.applications || []).map((application) => ({
        ...application,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        recruiterId: candidate.recruiterId,
        recruiterName: candidate.recruiterName,
      }))
    );
  }, [allCandidates]);

  const applicationsToday = allApplications.filter(
    (application) => application.date === today()
  );

  const applicationsOnSelectedDate = allApplications.filter(
    (application) => application.date === selectedDate
  );

  const recruiterApplications = allApplications.filter(
    (application) =>
      selectedRecruiterId === "All" ||
      String(application.recruiterId) === String(selectedRecruiterId)
  );

  const filteredApplications = recruiterApplications.filter((application) => {
    const query = search.trim().toLowerCase();

    return (
      !query ||
      [
        application.candidateName,
        application.candidateEmail,
        application.company,
        application.role,
        application.recruiterName,
      ].some((value) => String(value || "").toLowerCase().includes(query))
    );
  });

  const candidateRows = allCandidates
    .filter(
      (candidate) =>
        selectedRecruiterId === "All" ||
        String(candidate.recruiterId) === String(selectedRecruiterId)
    )
    .filter((candidate) => {
      const query = search.trim().toLowerCase();
      return (
        !query ||
        [
          candidate.name,
          candidate.email,
          candidate.skills,
          candidate.recruiterName,
        ].some((value) => String(value || "").toLowerCase().includes(query))
      );
    })
    .map((candidate) => {
      const applications = candidate.applications || [];

      return {
        ...candidate,
        totalApplications: applications.length,
        dailyApplications: applications.filter(
          (application) => application.date === selectedDate
        ).length,
        todayApplications: applications.filter(
          (application) => application.date === today()
        ).length,
      };
    });

  const downloadCsv = () => {
    const rows = [
      [
        "Application ID",
        "Candidate",
        "Candidate Email",
        "Recruiter",
        "Company",
        "Job Role",
        "Application Date",
        "Status",
      ],
      ...filteredApplications.map((application) => [
        application.id,
        application.candidateName,
        application.candidateEmail,
        application.recruiterName,
        application.company,
        application.role,
        application.date,
        application.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `recruiter-applications-${selectedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="recruiter-application-section">
      <div className="recruiter-feature-heading">
        <div>
          <span className="recruiters-eyebrow">APPLICATION ANALYTICS</span>
          <h2>Application tracking</h2>
          <p>
            Track application totals, daily activity and each candidate's
            application history.
          </p>
        </div>
        <button className="recruiter-secondary-btn" onClick={downloadCsv}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="recruiter-application-summary">
        <div className="recruiter-application-summary-card">
          <span className="recruiter-summary-icon">
            <FileText size={19} />
          </span>
          <div>
            <p>Total applications</p>
            <h3>{allApplications.length}</h3>
            <span>Across tracked candidates</span>
          </div>
        </div>

        <div className="recruiter-application-summary-card">
          <span className="recruiter-summary-icon">
            <CalendarDays size={19} />
          </span>
          <div>
            <p>Applications today</p>
            <h3>{applicationsToday.length}</h3>
            <span>{formatDate(today())}</span>
          </div>
        </div>

        <div className="recruiter-application-summary-card">
          <span className="recruiter-summary-icon">
            <Activity size={19} />
          </span>
          <div>
            <p>Selected day</p>
            <h3>{applicationsOnSelectedDate.length}</h3>
            <span>{formatDate(selectedDate)}</span>
          </div>
        </div>

        <div className="recruiter-application-summary-card">
          <span className="recruiter-summary-icon">
            <Users size={19} />
          </span>
          <div>
            <p>Tracked candidates</p>
            <h3>{allCandidates.length}</h3>
            <span>With application records</span>
          </div>
        </div>
      </div>

      <div className="recruiter-application-filters">
        <label>
          <CalendarDays size={16} />
          <span>Application date</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>

        <label>
          <Users size={16} />
          <span>Recruiter</span>
          <select
            value={selectedRecruiterId}
            onChange={(event) => setSelectedRecruiterId(event.target.value)}
          >
            <option value="All">All recruiters</option>
            {recruiters.map((recruiter) => (
              <option key={recruiter.id} value={recruiter.id}>
                {recruiter.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="recruiter-application-table-section">
        <div className="recruiter-subsection-heading">
          <div>
            <h3>Candidate-wise applications</h3>
            <p>
              Total applications and activity on {formatDate(selectedDate)}.
            </p>
          </div>
          <span>{candidateRows.length} candidates</span>
        </div>

        <div className="recruiter-table-wrap">
          <table className="recruiter-table recruiter-application-table">
            <thead>
              <tr>
                <th>CANDIDATE</th>
                <th>RECRUITER</th>
                <th>SKILLS</th>
                <th>DAILY APPLICATIONS</th>
                <th>TODAY</th>
                <th>TOTAL APPLICATIONS</th>
              </tr>
            </thead>
            <tbody>
              {candidateRows.map((candidate) => (
                <tr key={`${candidate.recruiterId}-${candidate.id}`}>
                  <td>
                    <div className="recruiter-person">
                      <div className="recruiter-avatar">
                        {candidate.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <strong>{candidate.name}</strong>
                        <span>{candidate.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{candidate.recruiterName}</td>
                  <td>
                    <span className="recruiter-skill-text">
                      {candidate.skills || "—"}
                    </span>
                  </td>
                  <td>
                    <span className="recruiter-number-pill">
                      {candidate.dailyApplications}
                    </span>
                  </td>
                  <td>{candidate.todayApplications}</td>
                  <td>
                    <strong>{candidate.totalApplications}</strong>
                  </td>
                </tr>
              ))}

              {candidateRows.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <EmptyState message="No candidate application records match your filters." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recruiter-application-table-section">
        <div className="recruiter-subsection-heading">
          <div>
            <h3>Application activity log</h3>
            <p>
              Each application record, including company, role and submission
              date.
            </p>
          </div>
          <span>{filteredApplications.length} records</span>
        </div>

        <div className="recruiter-table-wrap">
          <table className="recruiter-table recruiter-application-table">
            <thead>
              <tr>
                <th>APPLICATION</th>
                <th>CANDIDATE</th>
                <th>RECRUITER</th>
                <th>COMPANY / ROLE</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <strong>{application.id}</strong>
                  </td>
                  <td>
                    <div className="recruiter-role-cell">
                      <strong>{application.candidateName}</strong>
                      <span>{application.candidateEmail}</span>
                    </div>
                  </td>
                  <td>{application.recruiterName}</td>
                  <td>
                    <div className="recruiter-role-cell">
                      <strong>{application.company}</strong>
                      <span>{application.role}</span>
                    </div>
                  </td>
                  <td>{formatDate(application.date)}</td>
                  <td>
                    <span
                      className={`recruiter-status recruiter-app-status status-${statusClass(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <EmptyState message="No applications found for this search." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default function Recruiters({ onAssistantContext }) {
  const [recruiters, setRecruiters] = useState(initialRecruiters);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRecruiter);

  const [activeTab, setActiveTab] = useState("directory");
  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationDate, setApplicationDate] = useState(today());
  const [applicationRecruiterId, setApplicationRecruiterId] = useState("All");

  const activeCount = recruiters.filter(
    (recruiter) => recruiter.status === "Active"
  ).length;

  const totalCandidates = recruiters.reduce(
    (total, recruiter) => total + Number(recruiter.candidates || 0),
    0
  );
  const profileCandidates = recruiters.flatMap((recruiter) => recruiter.candidateProfiles || []);
  const pipelineStages = profileCandidates.reduce((counts, candidate) => {
    counts[candidate.status || "Unspecified"] = (counts[candidate.status || "Unspecified"] || 0) + 1;
    return counts;
  }, {});

  const totalPlaced = recruiters.reduce(
    (total, recruiter) => total + Number(recruiter.placed || 0),
    0
  );

  const allApplications = recruiters.flatMap((recruiter) =>
    (recruiter.candidateProfiles || []).flatMap((candidate) =>
      (candidate.applications || []).map((application) => ({
        ...application,
        recruiterId: recruiter.id,
        recruiterName: recruiter.name,
        candidateId: candidate.id,
        candidateName: candidate.name,
      }))
    )
  );

  const totalApplications = allApplications.length;

  const applicationsToday = allApplications.filter(
    (application) => application.date === today()
  ).length;

  const recruiterApplicationCounts = useMemo(
    () =>
      recruiters.map((recruiter) => {
        const candidates = recruiter.candidateProfiles || [];
        const applications = candidates.flatMap(
          (candidate) => candidate.applications || []
        );

        return {
          ...recruiter,
          totalApplications: applications.length,
          todayApplications: applications.filter(
            (application) => application.date === today()
          ).length,
          selectedDayApplications: applications.filter(
            (application) => application.date === applicationDate
          ).length,
          trackedCandidates: candidates.length,
        };
      }),
    [recruiters, applicationDate]
  );

  const filteredRecruiters = recruiters.filter((recruiter) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch = [
      recruiter.name,
      recruiter.email,
      recruiter.role,
      recruiter.team,
    ].some((value) => String(value || "").toLowerCase().includes(searchText));

    const matchesStatus =
      statusFilter === "All" || recruiter.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  useAssistantContext(onAssistantContext, "Recruiters", {
    recruiters: recruiters.length,
    active: activeCount,
    candidates: totalCandidates,
    profiles: profileCandidates.length,
    applications: totalApplications,
    placements: totalPlaced,
    pipelineStages,
    needsReview: recruiters.length - activeCount,
    filters: `status ${statusFilter}; tab ${activeTab}${search ? "; search active" : ""}`,
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyRecruiter });
    setModalOpen(true);
  };

  const openEditModal = (recruiter) => {
    setEditingId(recruiter.id);
    setForm({
      ...emptyRecruiter,
      ...recruiter,
      candidateProfiles: recruiter.candidateProfiles || [],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...emptyRecruiter });
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const saveRecruiter = (event) => {
    event.preventDefault();

    const cleanedRecruiter = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      candidates: Number(form.candidates) || 0,
      interviews: Number(form.interviews) || 0,
      placed: Number(form.placed) || 0,
      pending: Number(form.pending) || 0,
      candidateProfiles: form.candidateProfiles || [],
    };

    if (editingId !== null) {
      const updatedRecruiter = {
        ...cleanedRecruiter,
        id: editingId,
      };

      setRecruiters((previous) =>
        previous.map((recruiter) =>
          recruiter.id === editingId ? updatedRecruiter : recruiter
        )
      );

      setSelectedRecruiter((previous) =>
        previous?.id === editingId ? updatedRecruiter : previous
      );
    } else {
      const newRecruiter = {
        ...cleanedRecruiter,
        id: Date.now(),
      };

      setRecruiters((previous) => [newRecruiter, ...previous]);
    }

    closeModal();
  };

  const openRecruiterFromTracker = (recruiterId) => {
    const recruiter = recruiters.find(
      (item) => String(item.id) === String(recruiterId)
    );

    if (recruiter) setSelectedRecruiter(recruiter);
  };

  return (
    <div className="recruiters-page">
      <div className="recruiters-page-header">
        <div>
          <span className="recruiters-eyebrow">PEOPLE MANAGEMENT</span>
          <h1>Recruiters</h1>
          <p>Manage your recruitment team, applications and candidate workload.</p>
        </div>

        <button className="recruiter-primary-btn" onClick={openAddModal}>
          <Plus size={17} />
          Add Recruiter
        </button>
      </div>

      <div className="recruiter-stats-grid">
        <StatCard
          icon={Users}
          label="Total recruiters"
          value={recruiters.length}
          note="Recruiters in directory"
        />
        <StatCard
          icon={UserCheck}
          label="Active recruiters"
          value={activeCount}
          note="Currently marked active"
        />
        <StatCard
          icon={BriefcaseBusiness}
          label="Assigned candidates"
          value={totalCandidates}
          note="Across the team"
        />
        <StatCard
          icon={CircleCheck}
          label="Candidates placed"
          value={totalPlaced}
          note="Reported placements"
        />
        <StatCard
          icon={FileText}
          label="Total applications"
          value={totalApplications}
          note="Across tracked candidates"
        />
        <StatCard
          icon={CalendarDays}
          label="Applications today"
          value={applicationsToday}
          note={formatDate(today())}
        />
      </div>

      <div className="recruiter-page-tabs">
        <button
          className={activeTab === "directory" ? "active" : ""}
          onClick={() => setActiveTab("directory")}
        >
          <Users size={16} />
          Recruiter directory
        </button>
        <button
          className={activeTab === "applications" ? "active" : ""}
          onClick={() => setActiveTab("applications")}
        >
          <FileText size={16} />
          Application tracking
          <span className="recruiter-tab-count">{totalApplications}</span>
        </button>
        <button
          className={activeTab === "workload" ? "active" : ""}
          onClick={() => setActiveTab("workload")}
        >
          <Activity size={16} />
          Recruiter workload
        </button>
      </div>

      {activeTab === "directory" && (
        <section className="recruiter-directory">
          <div className="recruiter-directory-heading">
            <div>
              <h2>Recruiter directory</h2>
              <p>View recruiter profiles and update their information.</p>
            </div>

            <span className="recruiter-count">
              {filteredRecruiters.length} recruiters
            </span>
          </div>

          <div className="recruiter-toolbar">
            <div className="recruiter-search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search name, email, role or team..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <label className="recruiter-filter-control">
              <Filter size={15} />
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={14} />
            </label>
          </div>

          <div className="recruiter-table-wrap">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>RECRUITER</th>
                  <th>ROLE / TEAM</th>
                  <th>STATUS</th>
                  <th>CANDIDATES</th>
                  <th>APPLICATIONS</th>
                  <th>TODAY</th>
                  <th>PLACED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecruiters.map((recruiter) => {
                  const metrics = recruiterApplicationCounts.find(
                    (item) => item.id === recruiter.id
                  );

                  return (
                    <tr key={recruiter.id}>
                      <td>
                        <div className="recruiter-person">
                          <div className="recruiter-avatar">
                            {recruiter.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <strong>{recruiter.name}</strong>
                            <span>{recruiter.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="recruiter-role-cell">
                          <strong>{recruiter.role}</strong>
                          <span>{recruiter.team}</span>
                        </div>
                      </td>

                      <td>
                        <StatusBadge status={recruiter.status} />
                      </td>

                      <td>
                        <strong>{recruiter.candidates}</strong>
                      </td>

                      <td>
                        <strong>{metrics?.totalApplications || 0}</strong>
                      </td>

                      <td>
                        <span className="recruiter-number-pill">
                          {metrics?.todayApplications || 0}
                        </span>
                      </td>

                      <td>
                        <strong>{recruiter.placed}</strong>
                      </td>

                      <td>
                        <div className="recruiter-actions">
                          <button
                            className="recruiter-view-btn"
                            onClick={() => setSelectedRecruiter(recruiter)}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            className="recruiter-edit-btn"
                            onClick={() => openEditModal(recruiter)}
                          >
                            <Pencil size={14} /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredRecruiters.length === 0 && (
                  <tr>
                    <td colSpan="8" className="recruiter-empty">
                      No recruiters found. Try a different search or add a
                      recruiter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "applications" && (
        <ApplicationTracker
          recruiters={recruiters}
          selectedDate={applicationDate}
          setSelectedDate={setApplicationDate}
          selectedRecruiterId={applicationRecruiterId}
          setSelectedRecruiterId={setApplicationRecruiterId}
          search={applicationSearch}
        />
      )}

      {activeTab === "workload" && (
        <section className="recruiter-workload-section">
          <div className="recruiter-feature-heading">
            <div>
              <span className="recruiters-eyebrow">TEAM PERFORMANCE</span>
              <h2>Recruiter workload</h2>
              <p>
                Compare assigned candidates, application activity and placement
                progress across the team.
              </p>
            </div>
          </div>

          <div className="recruiter-workload-grid">
            {recruiterApplicationCounts.map((recruiter) => {
              const completion =
                recruiter.candidates > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (recruiter.placed / recruiter.candidates) * 100
                      )
                    )
                  : 0;

              return (
                <article
                  className="recruiter-workload-card"
                  key={recruiter.id}
                >
                  <div className="recruiter-workload-person">
                    <div className="recruiter-avatar">
                      {recruiter.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3>{recruiter.name}</h3>
                      <p>{recruiter.role}</p>
                    </div>
                    <StatusBadge status={recruiter.status} />
                  </div>

                  <div className="recruiter-workload-metrics">
                    <div>
                      <span>Total applications</span>
                      <strong>{recruiter.totalApplications}</strong>
                    </div>
                    <div>
                      <span>Applications today</span>
                      <strong>{recruiter.todayApplications}</strong>
                    </div>
                    <div>
                      <span>Selected day</span>
                      <strong>{recruiter.selectedDayApplications}</strong>
                    </div>
                    <div>
                      <span>Tracked candidates</span>
                      <strong>{recruiter.trackedCandidates}</strong>
                    </div>
                    <div>
                      <span>Interviews</span>
                      <strong>{recruiter.interviews}</strong>
                    </div>
                    <div>
                      <span>Placed</span>
                      <strong>{recruiter.placed}</strong>
                    </div>
                  </div>

                  <div className="recruiter-workload-progress">
                    <div>
                      <span>Placement progress</span>
                      <strong>{completion}%</strong>
                    </div>
                    <div className="recruiter-progress-track">
                      <span style={{ width: `${completion}%` }} />
                    </div>
                  </div>

                  <button
                    className="recruiter-secondary-btn"
                    onClick={() => {
                      setApplicationRecruiterId(String(recruiter.id));
                      setActiveTab("applications");
                    }}
                  >
                    View application activity
                    <Eye size={15} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {selectedRecruiter && (
        <div
          className="recruiter-panel-backdrop"
          onClick={() => setSelectedRecruiter(null)}
        >
          <aside
            className="recruiter-details-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="recruiter-panel-header">
              <div>
                <span className="recruiters-eyebrow">RECRUITER PROFILE</span>
                <h2>Recruiter details</h2>
              </div>
              <button
                className="recruiter-close-btn"
                onClick={() => setSelectedRecruiter(null)}
                aria-label="Close recruiter details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="recruiter-profile-summary">
              <div className="recruiter-avatar recruiter-avatar-large">
                {selectedRecruiter.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <h2>{selectedRecruiter.name}</h2>
              <p>{selectedRecruiter.role}</p>
              <StatusBadge status={selectedRecruiter.status} />
            </div>

            <div className="recruiter-detail-section">
              <h3>Contact information</h3>
              <p>
                <strong><Mail size={14} /> Email</strong>
                <span>{selectedRecruiter.email}</span>
              </p>
              <p>
                <strong><Phone size={14} /> Phone</strong>
                <span>{selectedRecruiter.phone || "—"}</span>
              </p>
              <p>
                <strong>Team</strong>
                <span>{selectedRecruiter.team}</span>
              </p>
              <p>
                <strong><CalendarDays size={14} /> Joining date</strong>
                <span>{formatDate(selectedRecruiter.joinedDate)}</span>
              </p>
            </div>

            <div className="recruiter-detail-section">
              <h3>Work overview</h3>
              <div className="recruiter-work-grid">
                <div>
                  <span>Assigned</span>
                  <strong>{selectedRecruiter.candidates}</strong>
                </div>
                <div>
                  <span>Interviews</span>
                  <strong>{selectedRecruiter.interviews}</strong>
                </div>
                <div>
                  <span>Placed</span>
                  <strong>{selectedRecruiter.placed}</strong>
                </div>
                <div>
                  <span>Pending</span>
                  <strong>{selectedRecruiter.pending}</strong>
                </div>
              </div>
            </div>

            {(() => {
              const profiles = selectedRecruiter.candidateProfiles || [];
              const applications = profiles.flatMap((candidate) =>
                (candidate.applications || []).map((application) => ({
                  ...application,
                  candidateName: candidate.name,
                  candidateId: candidate.id,
                }))
              );
              const dailyCount = applications.filter(
                (application) => application.date === applicationDate
              ).length;

              return (
                <>
                  <div className="recruiter-detail-section">
                    <h3>Application performance</h3>
                    <div className="recruiter-work-grid">
                      <div>
                        <span>Total applications</span>
                        <strong>{applications.length}</strong>
                      </div>
                      <div>
                        <span>Applications today</span>
                        <strong>
                          {
                            applications.filter(
                              (application) => application.date === today()
                            ).length
                          }
                        </strong>
                      </div>
                      <div>
                        <span>Selected day</span>
                        <strong>{dailyCount}</strong>
                      </div>
                      <div>
                        <span>Tracked candidates</span>
                        <strong>{profiles.length}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="recruiter-detail-section">
                    <h3>Candidate application history</h3>
                    {profiles.length === 0 ? (
                      <EmptyState message="No candidate profiles assigned yet." />
                    ) : (
                      <div className="recruiter-profile-candidates">
                        {profiles.map((candidate) => {
                          const candidateApplications =
                            candidate.applications || [];

                          return (
                            <div
                              className="recruiter-profile-candidate"
                              key={candidate.id}
                            >
                              <div>
                                <strong>{candidate.name}</strong>
                                <span>
                                  {candidateApplications.length} applications
                                </span>
                              </div>
                              <StatusBadge status={candidate.status} />

                              <div className="recruiter-candidate-app-list">
                                {candidateApplications.map((application) => (
                                  <div
                                    className="recruiter-candidate-app"
                                    key={application.id}
                                  >
                                    <div>
                                      <strong>{application.company}</strong>
                                      <span>{application.role}</span>
                                    </div>
                                    <div>
                                      <span>{formatDate(application.date)}</span>
                                      <StatusBadge status={application.status} />
                                    </div>
                                  </div>
                                ))}
                                {candidateApplications.length === 0 && (
                                  <span className="recruiter-muted">
                                    No applications recorded.
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}

            <div className="recruiter-detail-section">
              <h3>Responsibilities</h3>
              <p className="recruiter-description">
                {selectedRecruiter.responsibilities ||
                  "No responsibilities added."}
              </p>
            </div>

            <div className="recruiter-detail-section">
              <h3>Work description</h3>
              <p className="recruiter-description">
                {selectedRecruiter.description ||
                  "No work description added."}
              </p>
            </div>

            <button
              className="recruiter-primary-btn recruiter-panel-edit"
              onClick={() => {
                const recruiter = selectedRecruiter;
                setSelectedRecruiter(null);
                openEditModal(recruiter);
              }}
            >
              <Pencil size={15} />
              Edit Recruiter
            </button>
          </aside>
        </div>
      )}

      {modalOpen && (
        <div
          className="recruiter-modal-backdrop"
          onClick={closeModal}
        >
          <section
            className="recruiter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recruiter-form-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="recruiter-modal-header">
              <div>
                <span className="recruiters-eyebrow">TEAM MANAGEMENT</span>
                <h2 id="recruiter-form-title">
                  {editingId !== null ? "Edit Recruiter" : "Add Recruiter"}
                </h2>
                <p>
                  {editingId !== null
                    ? "Update this recruiter's details and workload."
                    : "Enter the details for the new recruiter."}
                </p>
              </div>

              <button
                type="button"
                className="recruiter-close-btn"
                onClick={closeModal}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveRecruiter}>
              <div className="recruiter-form-grid">
                <label>
                  Full name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="Enter full name"
                    required
                  />
                </label>

                <label>
                  Email address *
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="name@company.com"
                    required
                  />
                </label>

                <label>
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="Enter phone number"
                  />
                </label>

                <label>
                  Role *
                  <select
                    name="role"
                    value={form.role}
                    onChange={updateField}
                    required
                  >
                    <option>Technical Recruiter</option>
                    <option>Placement Recruiter</option>
                    <option>Junior Recruiter</option>
                    <option>Senior Recruiter</option>
                    <option>Recruitment Manager</option>
                    <option>Recruiter</option>
                  </select>
                </label>

                <label>
                  Team *
                  <select
                    name="team"
                    value={form.team}
                    onChange={updateField}
                    required
                  >
                    <option>Technology Hiring</option>
                    <option>Placement Operations</option>
                    <option>Candidate Success</option>
                    <option>Talent Acquisition</option>
                    <option>Recruitment Operations</option>
                  </select>
                </label>

                <label>
                  Status *
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateField}
                    required
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </label>

                <label>
                  Joining date
                  <input
                    name="joinedDate"
                    type="date"
                    value={form.joinedDate}
                    onChange={updateField}
                  />
                </label>

                <label>
                  Assigned candidates
                  <input
                    name="candidates"
                    type="number"
                    min="0"
                    value={form.candidates}
                    onChange={updateField}
                  />
                </label>

                <label>
                  Interviews
                  <input
                    name="interviews"
                    type="number"
                    min="0"
                    value={form.interviews}
                    onChange={updateField}
                  />
                </label>

                <label>
                  Candidates placed
                  <input
                    name="placed"
                    type="number"
                    min="0"
                    value={form.placed}
                    onChange={updateField}
                  />
                </label>

                <label>
                  Pending candidates
                  <input
                    name="pending"
                    type="number"
                    min="0"
                    value={form.pending}
                    onChange={updateField}
                  />
                </label>

                <label className="recruiter-form-full">
                  Responsibilities
                  <textarea
                    name="responsibilities"
                    rows="3"
                    value={form.responsibilities}
                    onChange={updateField}
                    placeholder="Describe the recruiter's responsibilities"
                  />
                </label>

                <label className="recruiter-form-full">
                  Work description
                  <textarea
                    name="description"
                    rows="3"
                    value={form.description}
                    onChange={updateField}
                    placeholder="Describe their work at AIFAGen Labs"
                  />
                </label>
              </div>

              <div className="recruiter-form-footer">
                <button
                  type="button"
                  className="recruiter-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="recruiter-primary-btn">
                  {editingId !== null ? "Save Changes" : "Add Recruiter"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
