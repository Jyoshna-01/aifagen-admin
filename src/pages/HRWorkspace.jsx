
import { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  UserRound,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Phone,
  Search,
  Plus,
  X,
  Eye,
  Mail,
  PhoneCall,
  ArrowRightLeft,
  ClipboardList,
  CheckCircle2,
  Clock3,
  FileText,
  TrendingUp,
  UserCheck,
  MessageSquare,
  CalendarClock,
  Filter,
} from "lucide-react";
import "./HRWorkspace.css";
import useAssistantContext from "../hooks/useAssistantContext";

const CANDIDATE_STATUSES = [
  "New",
  "Screening",
  "Shortlisted",
  "Interview",
  "Selected",
  "Offer Released",
  "Placed",
  "Rejected",
];

const JOB_STATUSES = ["Open", "On Hold", "Closed"];
const INTERVIEW_MODES = ["Online", "In-person", "Phone"];

const SPECIALIZATIONS = [
  "IT Recruitment",
  "Non-IT Recruitment",
  "Full Stack Development",
  "Java Development",
  "Data and AI",
  "Bulk Hiring",
  "General Recruitment",
];

const emptyRecruiter = {
  name: "",
  email: "",
  mobile: "",
  specialization: "",
};

const emptyCandidate = {
  name: "",
  email: "",
  mobile: "",
  skills: "",
  experience: "",
  location: "",
  client: "Unassigned",
  recruiterId: "",
  status: "New",
  source: "HR Added",
};

const emptyJob = {
  title: "",
  client: "",
  location: "",
  experience: "",
  openings: "1",
  skills: "",
  description: "",
  status: "Open",
};

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "?"
  );
}

function dateLabel(value) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: String(value).includes("T") ? "short" : undefined,
  });
}

function getCandidateHistory(candidate) {
  return Array.isArray(candidate.activityLog)
    ? candidate.activityLog
    : [];
}

/* Supports applications saved as an array or a numeric count. */
function getApplicationCount(candidate) {
  if (Array.isArray(candidate?.applications)) {
    return candidate.applications.length;
  }

  if (Number.isFinite(Number(candidate?.applicationCount))) {
    return Math.max(0, Number(candidate.applicationCount));
  }

  return 0;
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="hr-stat-card">
      <div className="hr-stat-top">
        <span>{label}</span>
        <span className="hr-stat-icon">
          <Icon size={17} />
        </span>
      </div>

      <strong className="hr-stat-value">{value}</strong>
      <span className="hr-stat-detail">{detail}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className="hr-status">{status || "New"}</span>;
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="hr-panel-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Field({ label, children, full = false }) {
  return (
    <label className={`hr-field ${full ? "hr-field-full" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="hr-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="hr-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="hr-modal-header">
          <div>
            <p className="hr-eyebrow">HR MANAGEMENT</p>
            <h2>{title}</h2>
            {subtitle && <p className="hr-subtitle">{subtitle}</p>}
          </div>

          <button
            className="hr-icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={17} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}

function ModalActions({ onCancel, submitLabel = "Save changes" }) {
  return (
    <div className="hr-modal-actions hr-field-full">
      <button
        type="button"
        className="hr-button hr-button-secondary"
        onClick={onCancel}
      >
        Cancel
      </button>

      <button type="submit" className="hr-button hr-button-primary">
        {submitLabel}
      </button>
    </div>
  );
}

export default function HRWorkspace({
  member,
  members = [],
  candidates = [],
  clients = [],
  onAddCandidate,
  onAddClient,
  onUpdateCandidate,
  onAddRecruiter,
  onAssistantContext,
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [recruiterFilter, setRecruiterFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");
  const [message, setMessage] = useState("");

  const [showRecruiterForm, setShowRecruiterForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [recruiterForm, setRecruiterForm] = useState(emptyRecruiter);
  const [candidateForm, setCandidateForm] = useState(emptyCandidate);
  const [clientForm, setClientForm] = useState({
    name: "",
    openings: "1",
    contactName: "",
    email: "",
    phone: "",
  });
  const [jobForm, setJobForm] = useState(emptyJob);

  const [interviewForm, setInterviewForm] = useState({
    candidateId: "",
    date: "",
    mode: "Online",
    interviewer: "",
    meetingLink: "",
    notes: "",
  });

  const [callForm, setCallForm] = useState({
    outcome: "Connected",
    notes: "",
    followUpDate: "",
  });

  const [noteForm, setNoteForm] = useState("");
  const [transferReason, setTransferReason] = useState("");

  // Demo-only jobs. Persist them through your backend in production.
  const [jobs, setJobs] = useState([]);

  const recruiters = useMemo(
    () => members.filter((item) => item.role === "Recruiter"),
    [members]
  );

  const hrCandidates = useMemo(
    () =>
      candidates.filter(
        (candidate) =>
          String(candidate.hrId ?? "") === String(member?.id ?? "")
      ),
    [candidates, member?.id]
  );

  const hrPlacements = hrCandidates.filter(
    (candidate) => candidate.status === "Placed"
  );

  const screeningCandidates = hrCandidates.filter((candidate) =>
    ["Screening", "Shortlisted", "Interview"].includes(candidate.status)
  );

  const upcomingInterviews = hrCandidates.filter(
    (candidate) => candidate.interview
  );

  // NEW: Overall application count across this HR account's candidates.
  const totalApplications = hrCandidates.reduce(
    (total, candidate) => total + getApplicationCount(candidate),
    0
  );

  // NEW: Applications, candidates, active pipeline and placements per recruiter.
  const recruiterWorkload = useMemo(
    () =>
      recruiters.map((recruiter) => {
        const allocated = hrCandidates.filter(
          (candidate) =>
            String(candidate.recruiterId ?? "") === String(recruiter.id)
        );

        const recruiterApplications = allocated.reduce(
          (total, candidate) => total + getApplicationCount(candidate),
          0
        );

        return {
          ...recruiter,
          total: allocated.length,
          screening: allocated.filter((candidate) =>
            ["Screening", "Shortlisted", "Interview"].includes(
              candidate.status
            )
          ).length,
          placed: allocated.filter(
            (candidate) => candidate.status === "Placed"
          ).length,
          totalApplications: recruiterApplications,
        };
      }),
    [recruiters, hrCandidates]
  );

  const visibleCandidates = useMemo(() => {
    let result = [...hrCandidates];

    if (activeTab === "Placements") {
      result = result.filter((candidate) => candidate.status === "Placed");
    }

    if (activeTab === "Interviews") {
      result = result.filter((candidate) => Boolean(candidate.interview));
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (candidate) => candidate.status === statusFilter
      );
    }

    if (recruiterFilter !== "All") {
      if (recruiterFilter === "Unassigned") {
        result = result.filter((candidate) => !candidate.recruiterId);
      } else {
        result = result.filter(
          (candidate) =>
            String(candidate.recruiterId ?? "") === String(recruiterFilter)
        );
      }
    }

    if (clientFilter !== "All") {
      if (clientFilter === "Unassigned") {
        result = result.filter(
          (candidate) =>
            !candidate.client || candidate.client === "Unassigned"
        );
      } else {
        result = result.filter(
          (candidate) => candidate.client === clientFilter
        );
      }
    }

    const term = search.trim().toLowerCase();

    if (term) {
      result = result.filter((candidate) =>
        [
          candidate.name,
          candidate.email,
          candidate.mobile,
          candidate.skills,
          candidate.client,
          candidate.status,
          candidate.location,
        ].some((value) =>
          String(value || "").toLowerCase().includes(term)
        )
      );
    }

    return result;
  }, [
    hrCandidates,
    activeTab,
    statusFilter,
    recruiterFilter,
    clientFilter,
    search,
  ]);
  useAssistantContext(onAssistantContext, "HR Workspace", {
    candidates: hrCandidates.length,
    filtered: visibleCandidates.length,
    applications: totalApplications,
    interviews: upcomingInterviews.length,
    assessments: hrCandidates.reduce((total, candidate) => total + (candidate.assessmentRecords?.length || 0), 0),
    placements: hrPlacements.length,
    active: screeningCandidates.length,
    pipelineStages: hrCandidates.reduce((counts, candidate) => {
      counts[candidate.status || "Unspecified"] = (counts[candidate.status || "Unspecified"] || 0) + 1;
      return counts;
    }, {}),
    followUps: hrCandidates.filter((candidate) => !candidate.recruiterId || !candidate.client).length,
    filters: `tab ${activeTab}; status ${statusFilter}; recruiter ${recruiterFilter}; client ${clientFilter}${search ? "; search active" : ""}`,
  }, `${activeTab} · HR Workspace`);

  const clearMessage = () => setMessage("");

  const updateCandidate = (candidateId, changes, activity = null) => {
    const existing = candidates.find(
      (candidate) => String(candidate.id) === String(candidateId)
    );

    if (!existing) {
      setMessage("Candidate could not be found.");
      return;
    }

    const updatedChanges = { ...changes };

    if (activity) {
      updatedChanges.activityLog = [
        ...getCandidateHistory(existing),
        {
          id: Date.now(),
          date: new Date().toISOString(),
          by: member?.name || "HR",
          ...activity,
        },
      ];
    }

    if (typeof onUpdateCandidate !== "function") {
      setMessage(
        "Candidate updates are not connected to the parent component."
      );
      return;
    }

    onUpdateCandidate(candidateId, updatedChanges);

    if (
      selectedCandidate &&
      String(selectedCandidate.id) === String(candidateId)
    ) {
      setSelectedCandidate((previous) => ({
        ...previous,
        ...updatedChanges,
      }));
    }
  };

  const addCandidate = (event) => {
    event.preventDefault();

    if (typeof onAddCandidate !== "function") {
      setMessage(
        "Candidate creation is not connected to the parent component."
      );
      return;
    }

    const email = candidateForm.email.trim().toLowerCase();

    if (
      candidates.some(
        (candidate) => candidate.email?.trim().toLowerCase() === email
      )
    ) {
      setMessage("A candidate with this email already exists.");
      return;
    }

    onAddCandidate({
      ...candidateForm,
      id: Date.now(),
      name: candidateForm.name.trim(),
      email,
      mobile: candidateForm.mobile.trim(),
      skills: candidateForm.skills.trim() || "Not provided",
      client: candidateForm.client || "Unassigned",
      recruiterId: candidateForm.recruiterId
        ? Number(candidateForm.recruiterId)
        : null,
      hrId: member.id,
      status: candidateForm.status || "New",
      interview: "",
      applications: [],
      applicationCount: 0,
      activityLog: [
        {
          id: Date.now(),
          date: new Date().toISOString(),
          by: member?.name || "HR",
          type: "Candidate created",
          notes: "Candidate added to the HR workspace.",
        },
      ],
    });

    setCandidateForm(emptyCandidate);
    setShowCandidateForm(false);
    setMessage("Candidate added successfully.");
  };

  const addRecruiter = (event) => {
    event.preventDefault();

    if (typeof onAddRecruiter !== "function") {
      setMessage(
        "Recruiter creation is not connected. Add the onAddRecruiter handler in App.jsx."
      );
      return;
    }

    const name = recruiterForm.name.trim();
    const email = recruiterForm.email.trim().toLowerCase();

    if (!name || !email) {
      setMessage("Recruiter name and email are required.");
      return;
    }

    if (
      members.some(
        (person) => person.email?.trim().toLowerCase() === email
      )
    ) {
      setMessage("An account with this email already exists.");
      return;
    }

    onAddRecruiter({
      name,
      email,
      mobile: recruiterForm.mobile.trim(),
      specialization: recruiterForm.specialization,
      role: "Recruiter",
      status: "Active",
      createdBy: member.id,
      createdAt: new Date().toISOString(),
    });

    setRecruiterForm(emptyRecruiter);
    setShowRecruiterForm(false);
    setMessage(
      "Recruiter creation submitted. Check the recruiter directory for the new account."
    );
  };

  const addClient = (event) => {
    event.preventDefault();

    if (typeof onAddClient !== "function") {
      setMessage(
        "Client creation is not connected to the parent component."
      );
      return;
    }

    const name = clientForm.name.trim();

    if (!name) {
      setMessage("Enter a client company name.");
      return;
    }

    if (
      clients.some(
        (client) => client.name?.trim().toLowerCase() === name.toLowerCase()
      )
    ) {
      setMessage("This client company already exists.");
      return;
    }

    onAddClient({
      id: Date.now(),
      name,
      openings: Math.max(0, Number(clientForm.openings) || 0),
      contactName: clientForm.contactName.trim(),
      email: clientForm.email.trim(),
      phone: clientForm.phone.trim(),
      createdBy: member.id,
    });

    setClientForm({
      name: "",
      openings: "1",
      contactName: "",
      email: "",
      phone: "",
    });

    setShowClientForm(false);
    setMessage("Client company added.");
  };

  const addJob = (event) => {
    event.preventDefault();

    const title = jobForm.title.trim();

    if (!title) {
      setMessage("Enter a job title.");
      return;
    }

    const newJob = {
      ...jobForm,
      id: Date.now(),
      title,
      openings: Math.max(1, Number(jobForm.openings) || 1),
      createdBy: member.id,
      createdAt: new Date().toISOString(),
    };

    setJobs((previous) => [newJob, ...previous]);
    setJobForm(emptyJob);
    setShowJobForm(false);
    setMessage("Job opening added to this session.");
  };

  const transferCandidate = (candidate) => {
    if (!candidate.recruiterId) {
      setMessage("Choose a recruiter before transferring this candidate.");
      return;
    }

    const reason = transferReason.trim();

    if (!reason) {
      setMessage("Enter a reason for the recruiter transfer.");
      return;
    }

    const recruiter = recruiters.find(
      (item) => String(item.id) === String(candidate.recruiterId)
    );

    updateCandidate(
      candidate.id,
      {
        recruiterId: Number(candidate.recruiterId),
        lastTransferReason: reason,
        lastTransferredAt: new Date().toISOString(),
      },
      {
        type: "Recruiter reassigned",
        notes: `Assigned to ${
          recruiter?.name || "selected recruiter"
        }. Reason: ${reason}`,
      }
    );

    setTransferReason("");
    setMessage("Recruiter reassignment submitted.");
  };

  const recordCall = (event) => {
    event.preventDefault();

    if (!selectedCandidate) return;

    if (!callForm.notes.trim()) {
      setMessage("Add a short call summary before saving.");
      return;
    }

    updateCandidate(
      selectedCandidate.id,
      {
        lastCallAt: new Date().toISOString(),
        lastCallOutcome: callForm.outcome,
        lastCallNotes: callForm.notes.trim(),
        followUpDate: callForm.followUpDate || "",
      },
      {
        type: "Candidate call",
        outcome: callForm.outcome,
        notes: callForm.notes.trim(),
        followUpDate: callForm.followUpDate || "",
      }
    );

    setCallForm({
      outcome: "Connected",
      notes: "",
      followUpDate: "",
    });

    setMessage("Call details saved.");
  };

  const addNote = (event) => {
    event.preventDefault();

    if (!selectedCandidate || !noteForm.trim()) return;

    updateCandidate(
      selectedCandidate.id,
      { lastHrNote: noteForm.trim() },
      {
        type: "HR note",
        notes: noteForm.trim(),
      }
    );

    setNoteForm("");
    setMessage("HR note saved.");
  };

  const saveInterview = (event) => {
    event.preventDefault();

    const candidate = hrCandidates.find(
      (item) => String(item.id) === String(interviewForm.candidateId)
    );

    if (!candidate) {
      setMessage("Select a candidate belonging to your HR workspace.");
      return;
    }

    const interviewDetails = {
      interview: interviewForm.date,
      interviewMode: interviewForm.mode,
      interviewer: interviewForm.interviewer.trim(),
      meetingLink: interviewForm.meetingLink.trim(),
      interviewNotes: interviewForm.notes.trim(),
      status: "Interview",
    };

    updateCandidate(candidate.id, interviewDetails, {
      type: "Interview scheduled",
      notes: `${interviewForm.mode} interview scheduled for ${dateLabel(
        interviewForm.date
      )}.`,
      interviewer: interviewForm.interviewer.trim(),
    });

    setInterviewForm({
      candidateId: "",
      date: "",
      mode: "Online",
      interviewer: "",
      meetingLink: "",
      notes: "",
    });

    setShowInterviewForm(false);
    setMessage("Interview details saved.");
  };

  const updateJobStatus = (jobId, status) => {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === jobId ? { ...job, status } : job
      )
    );
  };

  const openCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setTransferReason("");
    setCallForm({
      outcome: "Connected",
      notes: "",
      followUpDate: "",
    });
    setNoteForm("");
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setRecruiterFilter("All");
    setClientFilter("All");
  };

  const tabItems = [
    { name: "Overview", icon: TrendingUp },
    { name: "Candidates", icon: Users },
    { name: "Recruiters", icon: UserRound },
    { name: "Clients", icon: Building2 },
    { name: "Jobs", icon: BriefcaseBusiness },
    { name: "Interviews", icon: CalendarDays },
    { name: "Placements", icon: UserCheck },
  ];

  return (
    <div className="hr-workspace">
      <header className="hr-page-header">
        <div>
          <p className="hr-eyebrow">PEOPLE OPERATIONS</p>
          <h1>HR Workspace</h1>
          <p className="hr-subtitle">
            Welcome, {member?.name || "HR"} — manage candidates, recruiters,
            interviews and placements from one workspace.
          </p>
        </div>

        <div className="hr-header-actions">
          <span className="hr-account-chip">
            <UserCheck size={14} />
            HR ACCOUNT
          </span>

          <button
            className="hr-button hr-button-primary"
            onClick={() => setShowCandidateForm(true)}
          >
            <Plus size={15} />
            Add candidate
          </button>
        </div>
      </header>

      {message && (
        <div className="hr-alert" role="status">
          <CheckCircle2 size={17} />
          <span>{message}</span>
          <button onClick={clearMessage} aria-label="Dismiss message">
            <X size={15} />
          </button>
        </div>
      )}

      {/* DASHBOARD STATISTICS */}
      <section className="hr-stat-grid hr-stat-grid-five">
        <StatCard
          icon={Users}
          label="My candidates"
          value={hrCandidates.length}
          detail="Candidates managed by you"
        />

        <StatCard
          icon={ClipboardList}
          label="Screening / interviews"
          value={screeningCandidates.length}
          detail="Candidates currently in progress"
        />

        <StatCard
          icon={Building2}
          label="Client companies"
          value={clients.length}
          detail="Available client accounts"
        />

        <StatCard
          icon={CheckCircle2}
          label="My placements"
          value={hrPlacements.length}
          detail="Candidates marked as placed"
        />

        {/* NEW FEATURE: TOTAL APPLICATIONS */}
        <StatCard
          icon={BriefcaseBusiness}
          label="Total applications"
          value={totalApplications}
          detail="Applications across my candidates"
        />
      </section>

      <nav className="hr-tabs" aria-label="HR workspace sections">
        {tabItems.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`hr-tab ${activeTab === name ? "active" : ""}`}
            onClick={() => {
              setActiveTab(name);
              clearMessage();
            }}
          >
            <Icon size={15} />
            {name}
          </button>
        ))}
      </nav>

      {/* OVERVIEW */}
      {activeTab === "Overview" && (
        <div className="hr-overview-grid">
          <section className="hr-panel">
            <SectionHeading
              title="Hiring pipeline"
              subtitle="Candidate progress across recruitment stages"
            />

            <div className="hr-pipeline-list">
              {CANDIDATE_STATUSES.map((status) => {
                const count = hrCandidates.filter(
                  (candidate) => candidate.status === status
                ).length;

                const percentage = hrCandidates.length
                  ? (count / hrCandidates.length) * 100
                  : 0;

                return (
                  <button
                    key={status}
                    className="hr-pipeline-row"
                    onClick={() => {
                      setStatusFilter(status);
                      setActiveTab(
                        status === "Placed" ? "Placements" : "Candidates"
                      );
                    }}
                  >
                    <span>{status}</span>
                    <div className="hr-progress">
                      <span style={{ width: `${percentage}%` }} />
                    </div>
                    <strong>{count}</strong>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="hr-panel">
            <SectionHeading
              title="Recruiter workload"
              subtitle="Candidates and applications assigned to each recruiter"
              action={
                <button
                  className="hr-button hr-button-secondary"
                  onClick={() => setActiveTab("Recruiters")}
                >
                  Manage recruiters
                </button>
              }
            />

            <div className="hr-workload-list">
              {recruiterWorkload.slice(0, 7).map((recruiter) => (
                <div className="hr-workload-item" key={recruiter.id}>
                  <div className="hr-avatar">
                    {initials(recruiter.name)}
                  </div>

                  <div className="hr-workload-info">
                    <strong>{recruiter.name}</strong>
                    <span>
                      {recruiter.specialization || "General recruitment"}
                    </span>
                    <small>
                      {recruiter.totalApplications} applications ·{" "}
                      {recruiter.placed} placements
                    </small>
                  </div>

                  <span className="hr-count-pill">{recruiter.total}</span>
                </div>
              ))}

              {recruiters.length === 0 && (
                <p className="hr-empty-state">
                  No recruiters have been added yet. Add your first recruiter
                  from Recruiters.
                </p>
              )}
            </div>
          </section>

          <section className="hr-panel">
            <SectionHeading
              title="Follow-up overview"
              subtitle="Candidates needing another contact"
            />

            <div className="hr-alert-summary">
              <div className="hr-alert-number">
                <PhoneCall size={19} />
                <div>
                  <strong>
                    {
                      hrCandidates.filter(
                        (candidate) => candidate.followUpDate
                      ).length
                    }
                  </strong>
                  <span>Follow-ups scheduled</span>
                </div>
              </div>

              <div className="hr-alert-number">
                <CalendarClock size={19} />
                <div>
                  <strong>{upcomingInterviews.length}</strong>
                  <span>Interviews recorded</span>
                </div>
              </div>

              <div className="hr-alert-number">
                <BriefcaseBusiness size={19} />
                <div>
                  <strong>{totalApplications}</strong>
                  <span>Total applications</span>
                </div>
              </div>
            </div>

            <button
              className="hr-button hr-button-secondary hr-full-button"
              onClick={() => setActiveTab("Candidates")}
            >
              View candidate register
            </button>
          </section>

          <section className="hr-panel">
            <SectionHeading
              title="Upcoming interviews"
              subtitle="Interview dates recorded for your candidates"
              action={
                <button
                  className="hr-button hr-button-primary"
                  onClick={() => {
                    setInterviewForm((previous) => ({
                      ...previous,
                      candidateId: hrCandidates[0]?.id
                        ? String(hrCandidates[0].id)
                        : "",
                    }));
                    setShowInterviewForm(true);
                  }}
                >
                  <Plus size={14} />
                  Schedule
                </button>
              }
            />

            {upcomingInterviews.length === 0 ? (
              <p className="hr-empty-state">
                No interviews scheduled yet.
              </p>
            ) : (
              upcomingInterviews
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.interview) - new Date(b.interview)
                )
                .slice(0, 5)
                .map((candidate) => (
                  <button
                    className="hr-upcoming-item"
                    key={candidate.id}
                    onClick={() => openCandidate(candidate)}
                  >
                    <div className="hr-date-icon">
                      <CalendarDays size={17} />
                    </div>
                    <div>
                      <strong>{candidate.name}</strong>
                      <span>{dateLabel(candidate.interview)}</span>
                    </div>
                    <Eye size={15} />
                  </button>
                ))
            )}
          </section>
        </div>
      )}

      {/* CANDIDATES */}
      {activeTab === "Candidates" && (
        <section className="hr-panel">
          <SectionHeading
            title="Candidate management"
            subtitle="Register candidates, track progress, assign recruiters and record calls."
            action={
              <button
                className="hr-button hr-button-primary"
                onClick={() => setShowCandidateForm(true)}
              >
                <Plus size={15} />
                Add candidate
              </button>
            }
          />

          <Filters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            recruiterFilter={recruiterFilter}
            setRecruiterFilter={setRecruiterFilter}
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            recruiters={recruiters}
            clients={clients}
            onReset={resetFilters}
          />

          <CandidateTable
            candidates={visibleCandidates}
            recruiters={recruiters}
            clients={clients}
            onOpen={openCandidate}
            onUpdate={updateCandidate}
            setMessage={setMessage}
          />
        </section>
      )}

      {/* RECRUITERS */}
      {activeTab === "Recruiters" && (
        <section className="hr-panel">
          <SectionHeading
            title="Recruiter management"
            subtitle="Create recruiter records, monitor workloads, applications and placements."
            action={
              <button
                className="hr-button hr-button-primary"
                onClick={() => setShowRecruiterForm(true)}
              >
                <UserPlus size={15} />
                Add recruiter
              </button>
            }
          />

          <div className="hr-recruiter-grid">
            {recruiterWorkload.map((recruiter) => (
              <article className="hr-recruiter-card" key={recruiter.id}>
                <div className="hr-recruiter-card-top">
                  <div className="hr-avatar hr-avatar-large">
                    {initials(recruiter.name)}
                  </div>

                  <div>
                    <h3>{recruiter.name}</h3>
                    <p>
                      {recruiter.specialization || "General recruitment"}
                    </p>
                  </div>
                </div>

                <p style={{ marginTop: 12 }}>{recruiter.email}</p>
                <p>{recruiter.mobile || "No mobile number added"}</p>

                {/* UPDATED: FOUR RECRUITER METRICS */}
                <div
                  className="hr-recruiter-metrics"
                  style={{
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  }}
                >
                  <div>
                    <strong>{recruiter.total}</strong>
                    <span>Assigned candidates</span>
                  </div>

                  <div>
                    <strong>{recruiter.screening}</strong>
                    <span>In progress</span>
                  </div>

                  <div>
                    <strong>{recruiter.placed}</strong>
                    <span>Placements</span>
                  </div>

                  <div>
                    <strong>{recruiter.totalApplications}</strong>
                    <span>Applications</span>
                  </div>
                </div>

                <button
                  className="hr-button hr-button-secondary hr-full-button"
                  onClick={() => {
                    setRecruiterFilter(String(recruiter.id));
                    setActiveTab("Candidates");
                  }}
                >
                  View assigned candidates
                </button>
              </article>
            ))}

            {recruiters.length === 0 && (
              <div className="hr-empty-state">
                <UserPlus size={26} />
                <p>No recruiters registered yet.</p>
                <button
                  className="hr-button hr-button-primary"
                  onClick={() => setShowRecruiterForm(true)}
                >
                  Add your first recruiter
                </button>
              </div>
            )}
          </div>

          <div className="hr-table-heading">
            <h3>Recruiter allocation register</h3>
            <span>
              {hrCandidates.length} candidates · {totalApplications} applications
            </span>
          </div>

          <CandidateTable
            candidates={hrCandidates}
            recruiters={recruiters}
            clients={clients}
            onOpen={openCandidate}
            onUpdate={updateCandidate}
            setMessage={setMessage}
          />
        </section>
      )}

      {/* CLIENTS */}
      {activeTab === "Clients" && (
        <section className="hr-panel">
          <SectionHeading
            title="Client companies"
            subtitle="Manage hiring companies and monitor candidate allocations."
            action={
              <button
                className="hr-button hr-button-primary"
                onClick={() => setShowClientForm(true)}
              >
                <Plus size={15} />
                Add client
              </button>
            }
          />

          <div className="hr-client-grid">
            {clients.map((client) => {
              const assigned = hrCandidates.filter(
                (candidate) => candidate.client === client.name
              ).length;

              const placed = hrCandidates.filter(
                (candidate) =>
                  candidate.client === client.name &&
                  candidate.status === "Placed"
              ).length;

              const applications = hrCandidates
                .filter((candidate) => candidate.client === client.name)
                .reduce(
                  (total, candidate) =>
                    total + getApplicationCount(candidate),
                  0
                );

              return (
                <article className="hr-client-card" key={client.id}>
                  <div className="hr-client-icon">
                    <Building2 size={19} />
                  </div>

                  <h3>{client.name}</h3>
                  <p>Contact: {client.contactName || "Not provided"}</p>
                  <p>Email: {client.email || "Not provided"}</p>
                  <p>Phone: {client.phone || "Not provided"}</p>

                  <div className="hr-client-stats">
                    <div>
                      <strong>{client.openings ?? 0}</strong>
                      <span>Openings</span>
                    </div>

                    <div>
                      <strong>{assigned}</strong>
                      <span>My candidates</span>
                    </div>

                    <div>
                      <strong>{placed}</strong>
                      <span>Placements</span>
                    </div>
                  </div>

                  <div className="hr-detail-row">
                    <span>Total applications</span>
                    <strong>{applications}</strong>
                  </div>
                </article>
              );
            })}

            {clients.length === 0 && (
              <p className="hr-empty-state">
                No client companies have been added yet.
              </p>
            )}
          </div>

          <div className="hr-table-heading">
            <h3>Candidate allocations by client</h3>
          </div>

          <CandidateTable
            candidates={hrCandidates}
            recruiters={recruiters}
            clients={clients}
            onOpen={openCandidate}
            onUpdate={updateCandidate}
            setMessage={setMessage}
          />
        </section>
      )}

      {/* JOBS */}
      {activeTab === "Jobs" && (
        <section className="hr-panel">
          <SectionHeading
            title="Job openings"
            subtitle="Track client requirements, openings and skills needed."
            action={
              <button
                className="hr-button hr-button-primary"
                onClick={() => setShowJobForm(true)}
              >
                <Plus size={15} />
                Add job opening
              </button>
            }
          />

          <div className="hr-job-grid">
            {jobs.map((job) => (
              <article className="hr-job-card" key={job.id}>
                <div className="hr-job-icon">
                  <BriefcaseBusiness size={19} />
                </div>

                <StatusBadge status={job.status} />
                <h3>{job.title}</h3>
                <p>{job.client || "Client not assigned"}</p>

                <div className="hr-job-meta">
                  <span>{job.location || "Location flexible"}</span>
                  <span>{job.experience || "Experience not specified"}</span>
                  <span>{job.openings} opening(s)</span>
                </div>

                <p className="hr-job-skills">
                  <strong>Skills:</strong> {job.skills || "Not specified"}
                </p>

                <Field label="Job status">
                  <select
                    value={job.status}
                    onChange={(event) =>
                      updateJobStatus(job.id, event.target.value)
                    }
                  >
                    {JOB_STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </Field>
              </article>
            ))}

            {jobs.length === 0 && (
              <p className="hr-empty-state">
                No job openings have been added in this session. Add a job to
                begin tracking client requirements.
              </p>
            )}
          </div>
        </section>
      )}

      {/* INTERVIEWS */}
      {activeTab === "Interviews" && (
        <section className="hr-panel">
          <SectionHeading
            title="Interview schedule"
            subtitle="Schedule interviews and update candidate interview details."
            action={
              <button
                className="hr-button hr-button-primary"
                onClick={() => {
                  setInterviewForm((previous) => ({
                    ...previous,
                    candidateId: hrCandidates[0]?.id
                      ? String(hrCandidates[0].id)
                      : "",
                  }));
                  setShowInterviewForm(true);
                }}
              >
                <CalendarDays size={15} />
                Schedule interview
              </button>
            }
          />

          <Filters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            recruiterFilter={recruiterFilter}
            setRecruiterFilter={setRecruiterFilter}
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            recruiters={recruiters}
            clients={clients}
            onReset={resetFilters}
          />

          <div className="hr-table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Client</th>
                  <th>Interview date</th>
                  <th>Mode</th>
                  <th>Interviewer</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <strong>{candidate.name}</strong>
                      <small>{candidate.email}</small>
                    </td>

                    <td>{candidate.client || "Unassigned"}</td>
                    <td>{dateLabel(candidate.interview)}</td>
                    <td>{candidate.interviewMode || "Not specified"}</td>
                    <td>{candidate.interviewer || "Not assigned"}</td>

                    <td>
                      <button
                        className="hr-button hr-button-secondary hr-button-small"
                        onClick={() => {
                          setInterviewForm({
                            candidateId: String(candidate.id),
                            date: candidate.interview || "",
                            mode: candidate.interviewMode || "Online",
                            interviewer: candidate.interviewer || "",
                            meetingLink: candidate.meetingLink || "",
                            notes: candidate.interviewNotes || "",
                          });
                          setShowInterviewForm(true);
                        }}
                      >
                        Edit interview
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleCandidates.length === 0 && (
                  <tr>
                    <td colSpan={6} className="hr-empty-state">
                      No interview records match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* PLACEMENTS */}
      {activeTab === "Placements" && (
        <section className="hr-panel">
          <SectionHeading
            title="Placement tracking"
            subtitle="Review selected candidates, offer progress and completed placements."
          />

          <div className="hr-alert-summary" style={{ marginBottom: 20 }}>
            <div className="hr-alert-number">
              <CheckCircle2 size={19} />
              <div>
                <strong>{hrPlacements.length}</strong>
                <span>Placed candidates</span>
              </div>
            </div>

            <div className="hr-alert-number">
              <FileText size={19} />
              <div>
                <strong>
                  {
                    hrCandidates.filter(
                      (candidate) => candidate.status === "Offer Released"
                    ).length
                  }
                </strong>
                <span>Offers released</span>
              </div>
            </div>

            <div className="hr-alert-number">
              <BriefcaseBusiness size={19} />
              <div>
                <strong>{totalApplications}</strong>
                <span>Total applications</span>
              </div>
            </div>
          </div>

          <Filters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            recruiterFilter={recruiterFilter}
            setRecruiterFilter={setRecruiterFilter}
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            recruiters={recruiters}
            clients={clients}
            onReset={resetFilters}
          />

          <CandidateTable
            candidates={visibleCandidates}
            recruiters={recruiters}
            clients={clients}
            onOpen={openCandidate}
            onUpdate={updateCandidate}
            setMessage={setMessage}
            placementsOnly
          />
        </section>
      )}

      {/* ADD RECRUITER */}
      {showRecruiterForm && (
        <Modal
          title="Create recruiter record"
          subtitle="Register a recruiter for candidate allocation."
          onClose={() => setShowRecruiterForm(false)}
        >
          <form className="hr-form-grid" onSubmit={addRecruiter}>
            <Field label="Full name *">
              <input
                value={recruiterForm.name}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    name: event.target.value,
                  })
                }
                placeholder="Recruiter's full name"
                required
              />
            </Field>

            <Field label="Work email *">
              <input
                type="email"
                value={recruiterForm.email}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    email: event.target.value,
                  })
                }
                placeholder="recruiter@company.com"
                required
              />
            </Field>

            <Field label="Mobile number">
              <input
                type="tel"
                value={recruiterForm.mobile}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    mobile: event.target.value,
                  })
                }
                placeholder="Contact number"
              />
            </Field>

            <Field label="Specialization">
              <select
                value={recruiterForm.specialization}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    specialization: event.target.value,
                  })
                }
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Role">
              <input value="Recruiter" readOnly />
            </Field>

            <Field label="Account status">
              <input value="Active" readOnly />
            </Field>

            <p className="hr-inline-note hr-field-full">
              This form creates a recruiter record through the parent handler.
              Login credentials, authentication and permanent storage must be
              implemented by your backend.
            </p>

            <ModalActions
              onCancel={() => setShowRecruiterForm(false)}
              submitLabel="Create recruiter"
            />
          </form>
        </Modal>
      )}

      {/* ADD CANDIDATE */}
      {showCandidateForm && (
        <Modal
          title="Register candidate"
          subtitle="Create a candidate profile and optionally assign a recruiter."
          onClose={() => setShowCandidateForm(false)}
        >
          <form className="hr-form-grid" onSubmit={addCandidate}>
            <Field label="Candidate name *">
              <input
                value={candidateForm.name}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    name: event.target.value,
                  })
                }
                required
                placeholder="Full name"
              />
            </Field>

            <Field label="Email address *">
              <input
                type="email"
                value={candidateForm.email}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    email: event.target.value,
                  })
                }
                required
                placeholder="candidate@email.com"
              />
            </Field>

            <Field label="Mobile number">
              <input
                type="tel"
                value={candidateForm.mobile}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    mobile: event.target.value,
                  })
                }
                placeholder="Contact number"
              />
            </Field>

            <Field label="Skills">
              <input
                value={candidateForm.skills}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    skills: event.target.value,
                  })
                }
                placeholder="Java, React, SQL..."
              />
            </Field>

            <Field label="Experience">
              <input
                value={candidateForm.experience}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    experience: event.target.value,
                  })
                }
                placeholder="Fresher / 2 years"
              />
            </Field>

            <Field label="Location">
              <input
                value={candidateForm.location}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    location: event.target.value,
                  })
                }
                placeholder="City"
              />
            </Field>

            <Field label="Client company">
              <select
                value={candidateForm.client}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    client: event.target.value,
                  })
                }
              >
                <option value="Unassigned">Unassigned</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Assign recruiter">
              <select
                value={candidateForm.recruiterId}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    recruiterId: event.target.value,
                  })
                }
              >
                <option value="">Unassigned</option>
                {recruiters.map((recruiter) => (
                  <option key={recruiter.id} value={recruiter.id}>
                    {recruiter.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Initial status">
              <select
                value={candidateForm.status}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    status: event.target.value,
                  })
                }
              >
                {CANDIDATE_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </Field>

            <Field label="Candidate source">
              <select
                value={candidateForm.source}
                onChange={(event) =>
                  setCandidateForm({
                    ...candidateForm,
                    source: event.target.value,
                  })
                }
              >
                {[
                  "HR Added",
                  "Referral",
                  "Job Portal",
                  "LinkedIn",
                  "Recruiter Sourced",
                  "Walk-in",
                  "Other",
                ].map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </select>
            </Field>

            <ModalActions
              onCancel={() => setShowCandidateForm(false)}
              submitLabel="Add candidate"
            />
          </form>
        </Modal>
      )}

      {/* ADD CLIENT */}
      {showClientForm && (
        <Modal
          title="Add client company"
          subtitle="Register a company and its hiring contact."
          onClose={() => setShowClientForm(false)}
        >
          <form className="hr-form-grid" onSubmit={addClient}>
            <Field label="Company name *" full>
              <input
                value={clientForm.name}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    name: event.target.value,
                  })
                }
                placeholder="Company name"
                required
              />
            </Field>

            <Field label="Open positions">
              <input
                type="number"
                min="0"
                value={clientForm.openings}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    openings: event.target.value,
                  })
                }
                required
              />
            </Field>

            <Field label="Contact person">
              <input
                value={clientForm.contactName}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    contactName: event.target.value,
                  })
                }
                placeholder="Hiring manager"
              />
            </Field>

            <Field label="Contact email">
              <input
                type="email"
                value={clientForm.email}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    email: event.target.value,
                  })
                }
                placeholder="hr@company.com"
              />
            </Field>

            <Field label="Contact phone">
              <input
                type="tel"
                value={clientForm.phone}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    phone: event.target.value,
                  })
                }
                placeholder="Phone number"
              />
            </Field>

            <ModalActions
              onCancel={() => setShowClientForm(false)}
              submitLabel="Add client"
            />
          </form>
        </Modal>
      )}

      {/* ADD JOB */}
      {showJobForm && (
        <Modal
          title="Add job opening"
          subtitle="Record a new client hiring requirement."
          onClose={() => setShowJobForm(false)}
        >
          <form className="hr-form-grid" onSubmit={addJob}>
            <Field label="Job title *" full>
              <input
                value={jobForm.title}
                onChange={(event) =>
                  setJobForm({ ...jobForm, title: event.target.value })
                }
                placeholder="Java Developer"
                required
              />
            </Field>

            <Field label="Client">
              <select
                value={jobForm.client}
                onChange={(event) =>
                  setJobForm({ ...jobForm, client: event.target.value })
                }
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Location">
              <input
                value={jobForm.location}
                onChange={(event) =>
                  setJobForm({ ...jobForm, location: event.target.value })
                }
                placeholder="Hyderabad / Remote"
              />
            </Field>

            <Field label="Experience">
              <input
                value={jobForm.experience}
                onChange={(event) =>
                  setJobForm({ ...jobForm, experience: event.target.value })
                }
                placeholder="0–2 years"
              />
            </Field>

            <Field label="Number of openings">
              <input
                type="number"
                min="1"
                value={jobForm.openings}
                onChange={(event) =>
                  setJobForm({ ...jobForm, openings: event.target.value })
                }
                required
              />
            </Field>

            <Field label="Required skills" full>
              <input
                value={jobForm.skills}
                onChange={(event) =>
                  setJobForm({ ...jobForm, skills: event.target.value })
                }
                placeholder="Java, Spring Boot, MySQL"
              />
            </Field>

            <Field label="Job description" full>
              <textarea
                rows={3}
                value={jobForm.description}
                onChange={(event) =>
                  setJobForm({
                    ...jobForm,
                    description: event.target.value,
                  })
                }
                placeholder="Responsibilities and requirements"
              />
            </Field>

            <ModalActions
              onCancel={() => setShowJobForm(false)}
              submitLabel="Create job opening"
            />
          </form>
        </Modal>
      )}

      {/* SCHEDULE INTERVIEW */}
      {showInterviewForm && (
        <Modal
          title="Schedule interview"
          subtitle="Save interview details against a candidate."
          onClose={() => setShowInterviewForm(false)}
        >
          <form className="hr-form-grid" onSubmit={saveInterview}>
            <Field label="Candidate *" full>
              <select
                value={interviewForm.candidateId}
                onChange={(event) =>
                  setInterviewForm({
                    ...interviewForm,
                    candidateId: event.target.value,
                  })
                }
                required
              >
                <option value="">Select candidate</option>
                {hrCandidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} — {candidate.email}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Interview date and time *">
              <input
                type="datetime-local"
                value={interviewForm.date}
                onChange={(event) =>
                  setInterviewForm({
                    ...interviewForm,
                    date: event.target.value,
                  })
                }
                required
              />
            </Field>

            <Field label="Interview mode">
              <select
                value={interviewForm.mode}
                onChange={(event) =>
                  setInterviewForm({
                    ...interviewForm,
                    mode: event.target.value,
                  })
                }
              >
                {INTERVIEW_MODES.map((mode) => (
                  <option key={mode}>{mode}</option>
                ))}
              </select>
            </Field>

            <Field label="Interviewer">
              <input
                value={interviewForm.interviewer}
                onChange={(event) =>
                  setInterviewForm({
                    ...interviewForm,
                    interviewer: event.target.value,
                  })
                }
                placeholder="Interviewer name"
              />
            </Field>

            <Field label="Meeting link">
              <input
                type="url"
                value={interviewForm.meetingLink}
                onChange={(event) =>
                  setInterviewForm({
                    ...interviewForm,
                    meetingLink: event.target.value,
                  })
                }
                placeholder="https://..."
              />
            </Field>

            <Field label="Interview notes" full>
              <textarea
                rows={3}
                value={interviewForm.notes}
                onChange={(event) =>
                  setInterviewForm({
                    ...interviewForm,
                    notes: event.target.value,
                  })
                }
                placeholder="Round details, preparation or instructions"
              />
            </Field>

            <ModalActions
              onCancel={() => setShowInterviewForm(false)}
              submitLabel="Save interview"
            />
          </form>
        </Modal>
      )}

      {/* CANDIDATE PROFILE DRAWER */}
      {selectedCandidate && (
        <div
          className="hr-drawer-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCandidate(null);
            }
          }}
        >
          <aside
            className="hr-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Candidate profile: ${selectedCandidate.name}`}
          >
            <div className="hr-drawer-header">
              <div>
                <p className="hr-eyebrow">CANDIDATE PROFILE</p>
                <h2>{selectedCandidate.name}</h2>
                <StatusBadge status={selectedCandidate.status} />
              </div>

              <button
                className="hr-icon-button"
                onClick={() => setSelectedCandidate(null)}
                aria-label="Close candidate profile"
              >
                <X size={17} />
              </button>
            </div>

            <div className="hr-drawer-body">
              <div className="hr-profile-contact">
                <p>
                  <Mail size={15} />
                  {selectedCandidate.email || "No email"}
                </p>
                <p>
                  <Phone size={15} />
                  {selectedCandidate.mobile || "No mobile number"}
                </p>
                <p>
                  <BriefcaseBusiness size={15} />
                  {selectedCandidate.skills || "Skills not specified"}
                </p>
                <p>
                  <Building2 size={15} />
                  {selectedCandidate.client || "Unassigned"}
                </p>
              </div>

              <div className="hr-detail-section">
                <h3>Recruitment details</h3>

                <div className="hr-detail-row">
                  <span>Experience</span>
                  <strong>
                    {selectedCandidate.experience || "Not specified"}
                  </strong>
                </div>

                <div className="hr-detail-row">
                  <span>Location</span>
                  <strong>
                    {selectedCandidate.location || "Not specified"}
                  </strong>
                </div>

                <div className="hr-detail-row">
                  <span>Source</span>
                  <strong>
                    {selectedCandidate.source || "Not specified"}
                  </strong>
                </div>

                <div className="hr-detail-row">
                  <span>Interview</span>
                  <strong>{dateLabel(selectedCandidate.interview)}</strong>
                </div>

                <div className="hr-detail-row">
                  <span>Last call</span>
                  <strong>{dateLabel(selectedCandidate.lastCallAt)}</strong>
                </div>

                <div className="hr-detail-row">
                  <span>Follow-up</span>
                  <strong>{dateLabel(selectedCandidate.followUpDate)}</strong>
                </div>

                {/* NEW: APPLICATION COUNT IN CANDIDATE PROFILE */}
                <div className="hr-detail-row">
                  <span>Total applications</span>
                  <strong>{getApplicationCount(selectedCandidate)}</strong>
                </div>
              </div>

              <div className="hr-detail-section">
                <h3>Update candidate status</h3>

                <div className="hr-stack-form">
                  <select
                    value={selectedCandidate.status || "New"}
                    onChange={(event) => {
                      const nextStatus = event.target.value;

                      updateCandidate(
                        selectedCandidate.id,
                        { status: nextStatus },
                        {
                          type: "Status changed",
                          notes: `Status updated to ${nextStatus}.`,
                        }
                      );
                    }}
                  >
                    {CANDIDATE_STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="hr-detail-section">
                <h3>Assign or transfer recruiter</h3>

                <div className="hr-stack-form">
                  <select
                    value={selectedCandidate.recruiterId ?? ""}
                    onChange={(event) => {
                      const recruiterId = event.target.value;

                      setSelectedCandidate({
                        ...selectedCandidate,
                        recruiterId: recruiterId ? Number(recruiterId) : "",
                      });
                    }}
                  >
                    <option value="">Unassigned</option>
                    {recruiters.map((recruiter) => (
                      <option key={recruiter.id} value={recruiter.id}>
                        {recruiter.name}
                      </option>
                    ))}
                  </select>

                  <textarea
                    rows={2}
                    value={transferReason}
                    onChange={(event) => setTransferReason(event.target.value)}
                    placeholder="Reason for transfer or reassignment"
                  />

                  <button
                    className="hr-button hr-button-primary"
                    onClick={() => transferCandidate(selectedCandidate)}
                  >
                    <ArrowRightLeft size={15} />
                    Reassign candidate
                  </button>
                </div>
              </div>

              <div className="hr-detail-section">
                <h3>Log candidate call</h3>

                <form className="hr-stack-form" onSubmit={recordCall}>
                  <select
                    value={callForm.outcome}
                    onChange={(event) =>
                      setCallForm({
                        ...callForm,
                        outcome: event.target.value,
                      })
                    }
                  >
                    {[
                      "Connected",
                      "No answer",
                      "Call back requested",
                      "Interested",
                      "Not interested",
                      "Number unreachable",
                    ].map((outcome) => (
                      <option key={outcome}>{outcome}</option>
                    ))}
                  </select>

                  <textarea
                    rows={3}
                    value={callForm.notes}
                    onChange={(event) =>
                      setCallForm({
                        ...callForm,
                        notes: event.target.value,
                      })
                    }
                    placeholder="What happened during the call?"
                    required
                  />

                  <Field label="Next follow-up">
                    <input
                      type="datetime-local"
                      value={callForm.followUpDate}
                      onChange={(event) =>
                        setCallForm({
                          ...callForm,
                          followUpDate: event.target.value,
                        })
                      }
                    />
                  </Field>

                  <button
                    type="submit"
                    className="hr-button hr-button-primary"
                  >
                    <PhoneCall size={15} />
                    Save call log
                  </button>
                </form>
              </div>

              <div className="hr-detail-section">
                <h3>Add HR note</h3>

                <form className="hr-stack-form" onSubmit={addNote}>
                  <textarea
                    rows={3}
                    value={noteForm}
                    onChange={(event) => setNoteForm(event.target.value)}
                    placeholder="Add internal recruitment notes..."
                    required
                  />

                  <button
                    type="submit"
                    className="hr-button hr-button-secondary"
                  >
                    <MessageSquare size={15} />
                    Save note
                  </button>
                </form>
              </div>

              <div className="hr-detail-section">
                <h3>Activity history</h3>

                {getCandidateHistory(selectedCandidate)
                  .slice()
                  .reverse()
                  .map((activity) => (
                    <div className="hr-history-item" key={activity.id}>
                      <span className="hr-history-dot" />
                      <div>
                        <strong>
                          {activity.type || "Candidate update"}
                        </strong>
                        <p>{activity.notes || activity.outcome || ""}</p>
                        <small>
                          {activity.by || "HR"} · {dateLabel(activity.date)}
                        </small>
                      </div>
                    </div>
                  ))}

                {!getCandidateHistory(selectedCandidate).length && (
                  <p className="hr-empty-state">
                    No activity has been recorded for this candidate yet.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Filters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  recruiterFilter,
  setRecruiterFilter,
  clientFilter,
  setClientFilter,
  recruiters,
  clients,
  onReset,
}) {
  return (
    <div className="hr-filters">
      <div className="hr-search">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search candidate, email, skill..."
          aria-label="Search candidates"
        />
      </div>

      <label className="hr-filter-select">
        <Filter size={14} />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All statuses</option>
          {CANDIDATE_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>

      <label className="hr-filter-select">
        <UserRound size={14} />
        <select
          value={recruiterFilter}
          onChange={(event) => setRecruiterFilter(event.target.value)}
          aria-label="Filter by recruiter"
        >
          <option value="All">All recruiters</option>
          <option value="Unassigned">Unassigned</option>
          {recruiters.map((recruiter) => (
            <option key={recruiter.id} value={String(recruiter.id)}>
              {recruiter.name}
            </option>
          ))}
        </select>
      </label>

      <label className="hr-filter-select">
        <Building2 size={14} />
        <select
          value={clientFilter}
          onChange={(event) => setClientFilter(event.target.value)}
          aria-label="Filter by client"
        >
          <option value="All">All clients</option>
          <option value="Unassigned">Unassigned</option>
          {clients.map((client) => (
            <option key={client.id} value={client.name}>
              {client.name}
            </option>
          ))}
        </select>
      </label>

      <button
        className="hr-button hr-button-secondary"
        type="button"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}

function CandidateTable({
  candidates,
  recruiters,
  clients,
  onOpen,
  onUpdate,
  setMessage,
  placementsOnly = false,
}) {
  return (
    <div className="hr-table-wrap">
      <table className="hr-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Skills</th>
            <th>Client</th>
            <th>Recruiter</th>
            <th>Status</th>
            <th>Applications</th>
            <th>Follow-up</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((candidate) => {
            const recruiter = recruiters.find(
              (item) =>
                String(item.id) === String(candidate.recruiterId)
            );

            return (
              <tr key={candidate.id}>
                <td>
                  <strong>{candidate.name}</strong>
                  <small>{candidate.email}</small>
                  <small>{candidate.mobile || "No mobile number"}</small>
                </td>

                <td>{candidate.skills || "Not provided"}</td>

                <td>
                  {placementsOnly ? (
                    candidate.client || "Unassigned"
                  ) : (
                    <select
                      value={candidate.client || "Unassigned"}
                      onChange={(event) =>
                        onUpdate(
                          candidate.id,
                          { client: event.target.value },
                          {
                            type: "Client changed",
                            notes: `Client updated to ${event.target.value}.`,
                          }
                        )
                      }
                    >
                      <option value="Unassigned">Unassigned</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.name}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                <td>
                  {placementsOnly ? (
                    recruiter?.name || "Unassigned"
                  ) : (
                    <select
                      value={candidate.recruiterId ?? ""}
                      onChange={(event) => {
                        const selectedId = event.target.value;

                        const nextRecruiter = recruiters.find(
                          (item) => String(item.id) === selectedId
                        );

                        onUpdate(
                          candidate.id,
                          {
                            recruiterId: selectedId
                              ? Number(selectedId)
                              : null,
                          },
                          {
                            type: "Recruiter changed",
                            notes: `Candidate assigned to ${
                              nextRecruiter?.name || "Unassigned"
                            }.`,
                          }
                        );

                        setMessage("Recruiter allocation updated.");
                      }}
                    >
                      <option value="">Unassigned</option>
                      {recruiters.map((recruiter) => (
                        <option key={recruiter.id} value={recruiter.id}>
                          {recruiter.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                <td>
                  {placementsOnly ? (
                    <StatusBadge status={candidate.status} />
                  ) : (
                    <select
                      className="hr-stage-select"
                      value={candidate.status || "New"}
                      onChange={(event) =>
                        onUpdate(
                          candidate.id,
                          { status: event.target.value },
                          {
                            type: "Status changed",
                            notes: `Status updated to ${event.target.value}.`,
                          }
                        )
                      }
                    >
                      {CANDIDATE_STATUSES.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  )}
                </td>

                {/* NEW: APPLICATION COUNT FOR EACH CANDIDATE */}
                <td>
                  <strong>{getApplicationCount(candidate)}</strong>
                </td>

                <td>
                  {candidate.followUpDate
                    ? dateLabel(candidate.followUpDate)
                    : "Not scheduled"}
                </td>

                <td>
                  <button
                    className="hr-button hr-button-secondary hr-button-small"
                    onClick={() => onOpen(candidate)}
                  >
                    <Eye size={13} />
                    Profile
                  </button>
                </td>
              </tr>
            );
          })}

          {candidates.length === 0 && (
            <tr>
              <td colSpan={8} className="hr-empty-state">
                No candidates match this view. Try changing the filters or add
                a candidate.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
