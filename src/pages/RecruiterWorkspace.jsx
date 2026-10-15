
import { useMemo, useState } from "react";
import {
  Users,
  Search,
  CalendarDays,
  PhoneCall,
  ClipboardCheck,
  BriefcaseBusiness,
  Bell,
  UserRound,
  Mail,
  X,
  Plus,
  Eye,
  Building2,
  Clock3,
  CheckCircle2,
  FileText,
  Send,
  Target,
  MessageSquare,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import "./RecruiterWorkspace.css";
import useAssistantContext from "../hooks/useAssistantContext";

const STATUSES = [
  "New",
  "Screening",
  "Shortlisted",
  "Interview",
  "Assessment",
  "Selected",
  "Offer Released",
  "Placed",
  "Rejected",
];

const APPLICATION_STATUSES = [
  "Applied",
  "Under Review",
  "Screening",
  "Assessment",
  "Interview",
  "Selected",
  "Rejected",
  "Withdrawn",
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const toDateTimeLocal = (date = new Date()) => {
  const adjusted = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return adjusted.toISOString().slice(0, 16);
};

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalise = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

const getSkills = (candidate) => {
  const value =
    candidate?.skills ||
    candidate?.skillSet ||
    candidate?.technicalSkills ||
    "";

  if (Array.isArray(value)) return value.map(String);

  return String(value)
    .split(/[,;|]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const getJobSkills = (job) => {
  const value =
    job?.skills ||
    job?.requiredSkills ||
    job?.technologies ||
    job?.requirements ||
    "";

  if (Array.isArray(value)) return value.map(String);

  return String(value)
    .split(/[,;|]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const getJobCompany = (job) =>
  job?.company ||
  job?.companyName ||
  job?.client ||
  job?.clientName ||
  job?.organization ||
  "Company not specified";

const getJobTitle = (job) =>
  job?.title ||
  job?.jobTitle ||
  job?.role ||
  job?.position ||
  "Untitled job";

const getJobLocation = (job) =>
  job?.location || job?.city || job?.workLocation || "Location not specified";

const getJobId = (job, prefix) =>
  String(job?.id ?? job?._id ?? `${prefix}-${getJobTitle(job)}`);

const formatDate = (value) => {
  if (!value) return "Not scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: String(value).includes("T") ? "short" : undefined,
  });
};

const candidateApplications = (candidate) =>
  Array.isArray(candidate?.applications) ? candidate.applications : [];

const candidateInterviews = (candidate) =>
  Array.isArray(candidate?.interviews) ? candidate.interviews : [];

const candidateAssessments = (candidate) =>
  Array.isArray(candidate?.assessments) ? candidate.assessments : [];

const candidateScreenings = (candidate) =>
  Array.isArray(candidate?.screenings) ? candidate.screenings : [];

const candidateCalls = (candidate) =>
  Array.isArray(candidate?.callLogs) ? candidate.callLogs : [];

function StatusPill({ status }) {
  return (
    <span className="recruiter-status">
      {status || "New"}
    </span>
  );
}

function Stat({ label, value, icon: Icon, detail }) {
  return (
    <div className="recruiter-stat-card">
      <div className="rw-stat-heading">
        <span>{label}</span>
        {Icon && <Icon size={17} />}
      </div>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="rw-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="rw-modal" role="dialog" aria-modal="true">
        <header className="rw-modal-header">
          <div>
            <p className="recruiter-eyebrow">RECRUITER WORKSPACE</p>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="rw-icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function Field({ label, children, full = false }) {
  return (
    <label className={`rw-field ${full ? "rw-field-full" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ title, detail }) {
  return (
    <div className="rw-empty-state">
      <FileText size={25} />
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  );
}

export default function RecruiterWorkspace({
  member,
  candidates = [],
  jobs = [],
  internalJobs = [],
  onUpdateCandidate,
  onAssistantContext,
}) {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [profileTab, setProfileTab] = useState("Overview");
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [showScreeningForm, setShowScreeningForm] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    candidateId: "",
    applicationId: "",
    company: "",
    jobTitle: "",
    date: toDateTimeLocal(),
    mode: "Online",
    interviewer: "",
    meetingLink: "",
    notes: "",
  });

  const [assessmentForm, setAssessmentForm] = useState({
    candidateId: "",
    applicationId: "",
    company: "",
    jobTitle: "",
    assessmentName: "",
    date: toDateTimeLocal(),
    status: "Scheduled",
    instructions: "",
    link: "",
  });

  const [screeningForm, setScreeningForm] = useState({
    candidateId: "",
    applicationId: "",
    company: "",
    jobTitle: "",
    date: toDateTimeLocal(),
    result: "Pending",
    notes: "",
  });

  const [callForm, setCallForm] = useState({
    candidateId: "",
    purpose: "Candidate follow-up",
    outcome: "Connected",
    notes: "",
    followUpDate: "",
  });

  const [applicationForm, setApplicationForm] = useState({
    candidateId: "",
    jobKey: "",
    company: "",
    jobTitle: "",
    jobId: "",
    jobSource: "Jobs",
    appliedDate: todayKey(),
    status: "Applied",
    notes: "",
  });

  const allJobs = useMemo(() => {
    const publicJobs = (Array.isArray(jobs) ? jobs : []).map((job) => ({
      ...job,
      _source: "Jobs",
      _key: `public-${getJobId(job, "job")}`,
    }));

    const privateJobs = (Array.isArray(internalJobs) ? internalJobs : []).map(
      (job) => ({
        ...job,
        _source: "Internal Jobs",
        _key: `internal-${getJobId(job, "internal")}`,
      })
    );

    return [...publicJobs, ...privateJobs];
  }, [jobs, internalJobs]);

  const myCandidates = useMemo(
    () =>
      candidates.filter(
        (candidate) =>
          String(candidate.recruiterId ?? "") === String(member?.id ?? "")
      ),
    [candidates, member?.id]
  );

  const allApplications = myCandidates.flatMap((candidate) =>
    candidateApplications(candidate).map((application) => ({
      ...application,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
    }))
  );

  const allInterviews = myCandidates.flatMap((candidate) =>
    candidateInterviews(candidate).map((interview) => ({
      ...interview,
      candidateId: candidate.id,
      candidateName: candidate.name,
    }))
  );

  const allAssessments = myCandidates.flatMap((candidate) =>
    candidateAssessments(candidate).map((assessment) => ({
      ...assessment,
      candidateId: candidate.id,
      candidateName: candidate.name,
    }))
  );

  const allScreenings = myCandidates.flatMap((candidate) =>
    candidateScreenings(candidate).map((screening) => ({
      ...screening,
      candidateId: candidate.id,
      candidateName: candidate.name,
    }))
  );

  const allCalls = myCandidates.flatMap((candidate) =>
    candidateCalls(candidate).map((call) => ({
      ...call,
      candidateId: candidate.id,
      candidateName: candidate.name,
    }))
  );

  const todayCalls = allCalls.filter((call) => {
    const callDate = call.date || call.createdAt;
    return callDate && new Date(callDate).toISOString().slice(0, 10) === todayKey();
  });

  const filteredCandidates = myCandidates.filter((candidate) => {
    const matchesStatus =
      filter === "All" || candidate.status === filter;

    const term = normalise(search);
    const matchesSearch =
      !term ||
      [
        candidate.name,
        candidate.email,
        candidate.mobile,
        candidate.skills,
        candidate.client,
        candidate.status,
      ].some((value) => normalise(value).includes(term));

    return matchesStatus && matchesSearch;
  });

  const notifications = useMemo(() => {
    const items = [];

    myCandidates.forEach((candidate) => {
      candidateApplications(candidate).forEach((application) => {
        items.push({
          id: `application-${candidate.id}-${application.id}`,
          type: "Application",
          title: `Application: ${application.jobTitle || "Job"}`,
          detail: `${candidate.name} · ${application.company || "Company not specified"} · ${application.status || "Applied"}`,
          date: application.updatedAt || application.appliedDate,
          candidateId: candidate.id,
          unread: application.status === "Interview" || application.status === "Selected",
        });
      });

      candidateInterviews(candidate).forEach((interview) => {
        items.push({
          id: `interview-${candidate.id}-${interview.id}`,
          type: "Interview",
          title: `Interview ${interview.status || "scheduled"}`,
          detail: `${candidate.name} · ${interview.company || "Company not specified"} · ${interview.jobTitle || "Role not specified"}`,
          date: interview.date,
          candidateId: candidate.id,
          unread: interview.status !== "Completed",
        });
      });

      candidateAssessments(candidate).forEach((assessment) => {
        items.push({
          id: `assessment-${candidate.id}-${assessment.id}`,
          type: "Assessment",
          title: assessment.assessmentName || "Assessment update",
          detail: `${candidate.name} · ${assessment.company || "Company not specified"} · ${assessment.status || "Scheduled"}`,
          date: assessment.date,
          candidateId: candidate.id,
          unread: assessment.status === "Scheduled" || assessment.status === "Pending",
        });
      });

      candidateScreenings(candidate).forEach((screening) => {
        items.push({
          id: `screening-${candidate.id}-${screening.id}`,
          type: "Screening",
          title: "Screening update",
          detail: `${candidate.name} · ${screening.company || "Company not specified"} · ${screening.result || "Pending"}`,
          date: screening.date,
          candidateId: candidate.id,
          unread: screening.result === "Pending",
        });
      });

      candidateCalls(candidate).forEach((call) => {
        if (call.followUpDate) {
          items.push({
            id: `followup-${candidate.id}-${call.id}`,
            type: "Follow-up",
            title: "Candidate follow-up reminder",
            detail: `${candidate.name} · ${call.purpose || "Follow-up call"}`,
            date: call.followUpDate,
            candidateId: candidate.id,
            unread: new Date(call.followUpDate) >= new Date(),
          });
        }
      });
    });

    return items.sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );
  }, [myCandidates]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  useAssistantContext(onAssistantContext, "Recruiter Workspace", {
    candidates: myCandidates.length,
    filtered: filteredCandidates.length,
    applications: allApplications.length,
    interviews: allInterviews.length,
    assessments: allAssessments.length,
    screenings: allScreenings.length,
    calls: allCalls.length,
    placements: myCandidates.filter((candidate) => candidate.status === "Placed").length,
    active: myCandidates.filter((candidate) => !["Placed", "Rejected"].includes(candidate.status)).length,
    pipelineStages: myCandidates.reduce((counts, candidate) => {
      counts[candidate.status] = (counts[candidate.status] || 0) + 1;
      return counts;
    }, {}),
    followUps: unreadCount,
    filters: `tab ${activeTab}; status ${filter}${search ? "; search active" : ""}`,
  }, `${activeTab} · Recruiter Workspace`);

  const updateCandidate = (candidateId, changes) => {
    if (typeof onUpdateCandidate !== "function") {
      setMessage("Candidate updates are not connected to the parent component.");
      return;
    }

    onUpdateCandidate(candidateId, changes);

    const latest = candidates.find(
      (candidate) => String(candidate.id) === String(candidateId)
    );

    if (latest && selectedCandidate &&
        String(selectedCandidate.id) === String(candidateId)) {
      setSelectedCandidate({ ...latest, ...changes });
    }
  };

  const updateCandidateArray = (candidate, key, item) => {
    const current = Array.isArray(candidate[key]) ? candidate[key] : [];
    const updated = [...current, item];

    updateCandidate(candidate.id, {
      [key]: updated,
      lastActivityAt: new Date().toISOString(),
    });

    setSelectedCandidate((previous) =>
      previous && String(previous.id) === String(candidate.id)
        ? { ...previous, [key]: updated, lastActivityAt: new Date().toISOString() }
        : previous
    );
  };

  const getSelected = (candidateId) =>
    myCandidates.find(
      (candidate) => String(candidate.id) === String(candidateId)
    );

  const matchingJobsFor = (candidate) => {
    const candidateSkills = getSkills(candidate).map(normalise);

    return allJobs
      .map((job) => {
        const jobSkills = getJobSkills(job).map(normalise);
        const matchedSkills = candidateSkills.filter((skill) =>
          jobSkills.some(
            (required) =>
              required &&
              (required.includes(skill) || skill.includes(required))
          )
        );

        const score = jobSkills.length
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 0;

        return { ...job, matchedSkills, matchScore: score };
      })
      .filter((job) => {
        const status = normalise(job.status || "open");
        return !["closed", "filled", "cancelled", "inactive"].includes(status);
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const hasApplied = (candidate, job) =>
    candidateApplications(candidate).some(
      (application) =>
        String(application.jobKey || "") === String(job._key) ||
        (String(application.jobId || "") === String(job.id ?? job._id ?? "") &&
          application.jobSource === job._source)
    );

  const beginApplication = (candidate, job) => {
    setApplicationForm({
      candidateId: String(candidate.id),
      jobKey: job?._key || "",
      company: job ? getJobCompany(job) : candidate.client || "",
      jobTitle: job ? getJobTitle(job) : "",
      jobId: job ? String(job.id ?? job._id ?? "") : "",
      jobSource: job?._source || "Jobs",
      appliedDate: todayKey(),
      status: "Applied",
      notes: "",
    });

    setShowApplicationForm(true);
  };

  const submitApplication = (event) => {
    event.preventDefault();

    const candidate = getSelected(applicationForm.candidateId);
    if (!candidate) {
      setMessage("Select a candidate assigned to you.");
      return;
    }

    if (!applicationForm.company.trim() || !applicationForm.jobTitle.trim()) {
      setMessage("Company and job title are required.");
      return;
    }

    if (
      candidateApplications(candidate).some(
        (application) =>
          application.jobKey &&
          application.jobKey === applicationForm.jobKey
      ) &&
      applicationForm.jobKey
    ) {
      setMessage("This candidate already has an application for this job.");
      return;
    }

    const application = {
      id: makeId(),
      jobKey: applicationForm.jobKey,
      jobId: applicationForm.jobId,
      jobSource: applicationForm.jobSource,
      company: applicationForm.company.trim(),
      jobTitle: applicationForm.jobTitle.trim(),
      appliedDate: applicationForm.appliedDate || todayKey(),
      status: applicationForm.status,
      notes: applicationForm.notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recruiterId: member?.id,
      recruiterName: member?.name,
    };

    updateCandidateArray(candidate, "applications", application);
    setShowApplicationForm(false);
    setMessage(`Application recorded for ${candidate.name}.`);
  };

  const openInterviewForm = (candidate = selectedCandidate, application = null) => {
    if (!candidate) {
      setMessage("Open a candidate profile first.");
      return;
    }

    setInterviewForm({
      candidateId: String(candidate.id),
      applicationId: application?.id || "",
      company: application?.company || candidate.client || "",
      jobTitle: application?.jobTitle || "",
      date: toDateTimeLocal(),
      mode: "Online",
      interviewer: "",
      meetingLink: "",
      notes: "",
    });

    setShowInterviewForm(true);
  };

  const submitInterview = (event) => {
    event.preventDefault();

    const candidate = getSelected(interviewForm.candidateId);
    if (!candidate) return;

    if (!interviewForm.company.trim() || !interviewForm.jobTitle.trim()) {
      setMessage("Enter the company name and job title for this interview.");
      return;
    }

    const interview = {
      id: makeId(),
      applicationId: interviewForm.applicationId,
      company: interviewForm.company.trim(),
      jobTitle: interviewForm.jobTitle.trim(),
      date: interviewForm.date,
      mode: interviewForm.mode,
      interviewer: interviewForm.interviewer.trim(),
      meetingLink: interviewForm.meetingLink.trim(),
      notes: interviewForm.notes.trim(),
      status: "Scheduled",
      createdAt: new Date().toISOString(),
      recruiterId: member?.id,
    };

    updateCandidateArray(candidate, "interviews", interview);
    updateCandidate(candidate.id, { status: "Interview" });

    if (interview.applicationId) {
      const updatedApplications = candidateApplications(candidate).map((item) =>
        item.id === interview.applicationId
          ? { ...item, status: "Interview", updatedAt: new Date().toISOString() }
          : item
      );
      updateCandidate(candidate.id, { applications: updatedApplications });
    }

    setShowInterviewForm(false);
    setMessage(
      `Interview scheduled for ${candidate.name} at ${interview.company}.`
    );
  };

  const submitAssessment = (event) => {
    event.preventDefault();

    const candidate = getSelected(assessmentForm.candidateId);
    if (!candidate) return;

    if (!assessmentForm.company.trim() || !assessmentForm.assessmentName.trim()) {
      setMessage("Enter the company and assessment name.");
      return;
    }

    const assessment = {
      id: makeId(),
      applicationId: assessmentForm.applicationId,
      company: assessmentForm.company.trim(),
      jobTitle: assessmentForm.jobTitle.trim(),
      assessmentName: assessmentForm.assessmentName.trim(),
      date: assessmentForm.date,
      status: assessmentForm.status,
      instructions: assessmentForm.instructions.trim(),
      link: assessmentForm.link.trim(),
      createdAt: new Date().toISOString(),
      recruiterId: member?.id,
    };

    updateCandidateArray(candidate, "assessments", assessment);

    setShowAssessmentForm(false);
    setMessage(`Assessment recorded for ${candidate.name}.`);
  };

  const submitScreening = (event) => {
    event.preventDefault();

    const candidate = getSelected(screeningForm.candidateId);
    if (!candidate) return;

    if (!screeningForm.company.trim()) {
      setMessage("Enter the company conducting the screening.");
      return;
    }

    const screening = {
      id: makeId(),
      applicationId: screeningForm.applicationId,
      company: screeningForm.company.trim(),
      jobTitle: screeningForm.jobTitle.trim(),
      date: screeningForm.date,
      result: screeningForm.result,
      notes: screeningForm.notes.trim(),
      recruiterId: member?.id,
      createdAt: new Date().toISOString(),
    };

    updateCandidateArray(candidate, "screenings", screening);
    updateCandidate(candidate.id, { status: "Screening" });

    setShowScreeningForm(false);
    setMessage(`Screening recorded for ${candidate.name}.`);
  };

  const submitCall = (event) => {
    event.preventDefault();

    const candidate = getSelected(callForm.candidateId);
    if (!candidate) return;

    if (!callForm.notes.trim()) {
      setMessage("Add a short summary of the call.");
      return;
    }

    const call = {
      id: makeId(),
      date: new Date().toISOString(),
      purpose: callForm.purpose,
      outcome: callForm.outcome,
      notes: callForm.notes.trim(),
      followUpDate: callForm.followUpDate || "",
      recruiterId: member?.id,
      recruiterName: member?.name,
    };

    updateCandidateArray(candidate, "callLogs", call);
    setShowCallForm(false);
    setMessage(`Call logged for ${candidate.name}.`);
  };

  const updateApplicationStatus = (candidate, applicationId, status) => {
    const updated = candidateApplications(candidate).map((application) =>
      application.id === applicationId
        ? { ...application, status, updatedAt: new Date().toISOString() }
        : application
    );

    updateCandidate(candidate.id, { applications: updated });
    setSelectedCandidate((previous) =>
      previous && String(previous.id) === String(candidate.id)
        ? { ...previous, applications: updated }
        : previous
    );

    setMessage("Job application status updated.");
  };

  const openCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setProfileTab("Overview");
    setMessage("");
  };

  const tabs = [
    { label: "Overview", icon: Target },
    { label: "Candidates", icon: Users },
    { label: "Applications", icon: BriefcaseBusiness },
    { label: "Interviews", icon: CalendarDays },
    { label: "Assessments", icon: ClipboardCheck },
    { label: "Screenings", icon: Search },
    { label: "Calls", icon: PhoneCall },
    { label: "Notifications", icon: Bell },
  ];

  return (
    <div className="recruiter-workspace">
      <header className="recruiter-header">
        <div>
          <p className="recruiter-eyebrow">TALENT ACQUISITION</p>
          <h1>Recruiter Workspace</h1>
          <p>
            Welcome, {member?.name || "Recruiter"}. Manage candidate pipelines,
            job applications and interview activities.
          </p>
        </div>

        <button
          type="button"
          className="rw-notification-button"
          onClick={() => {
            setActiveTab("Notifications");
            setShowNotificationCenter(true);
          }}
          aria-label={`Notifications: ${unreadCount} pending`}
        >
          <Bell size={18} />
          Notifications
          {unreadCount > 0 && <span>{unreadCount}</span>}
        </button>
      </header>

      {message && (
        <div className="recruiter-message rw-message">
          <CheckCircle2 size={16} />
          <span>{message}</span>
          <button onClick={() => setMessage("")} aria-label="Dismiss message">
            <X size={15} />
          </button>
        </div>
      )}

      <section className="recruiter-stats">
        <Stat
          label="Assigned candidates"
          value={myCandidates.length}
          icon={Users}
          detail="Your active candidate register"
        />
        <Stat
          label="Job applications"
          value={allApplications.length}
          icon={BriefcaseBusiness}
          detail="Applications recorded for candidates"
        />
        <Stat
          label="Interviews scheduled"
          value={allInterviews.filter((item) => item.status === "Scheduled").length}
          icon={CalendarDays}
          detail="Across all assigned candidates"
        />
        <Stat
          label="Calls today"
          value={todayCalls.length}
          icon={PhoneCall}
          detail="Call logs recorded today"
        />
      </section>

      <nav className="rw-tabs" aria-label="Recruiter sections">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            type="button"
            key={label}
            className={`rw-tab ${activeTab === label ? "active" : ""}`}
            onClick={() => {
              setActiveTab(label);
              setShowNotificationCenter(false);
            }}
          >
            <Icon size={15} />
            {label}
            {label === "Notifications" && unreadCount > 0 && (
              <span className="rw-tab-count">{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* OVERVIEW */}
      {activeTab === "Overview" && (
        <div className="rw-content-grid">
          <section className="recruiter-panel rw-panel-wide">
            <div className="recruiter-panel-header">
              <div>
                <h2>My candidate pipeline</h2>
                <p>Current status of candidates assigned to you.</p>
              </div>
              <button
                className="rw-primary-button"
                onClick={() => setActiveTab("Candidates")}
              >
                View candidates <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="rw-pipeline-grid">
              {STATUSES.map((status) => {
                const count = myCandidates.filter(
                  (candidate) => candidate.status === status
                ).length;

                return (
                  <button
                    className="rw-pipeline-item"
                    key={status}
                    onClick={() => {
                      setFilter(status);
                      setActiveTab("Candidates");
                    }}
                  >
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="recruiter-panel">
            <div className="recruiter-panel-header">
              <div>
                <h2>Today's activity</h2>
                <p>Activity recorded for your candidates.</p>
              </div>
            </div>

            <div className="rw-activity-list">
              <div>
                <PhoneCall size={17} />
                <span>Calls logged today</span>
                <strong>{todayCalls.length}</strong>
              </div>
              <div>
                <CalendarDays size={17} />
                <span>Interview records</span>
                <strong>{allInterviews.length}</strong>
              </div>
              <div>
                <ClipboardCheck size={17} />
                <span>Assessments</span>
                <strong>{allAssessments.length}</strong>
              </div>
              <div>
                <Search size={17} />
                <span>Screenings</span>
                <strong>{allScreenings.length}</strong>
              </div>
            </div>

            <button
              className="rw-secondary-button rw-full-button"
              onClick={() => setActiveTab("Calls")}
            >
              View call history
            </button>
          </section>

          <section className="recruiter-panel rw-panel-wide">
            <div className="recruiter-panel-header">
              <div>
                <h2>Recent notifications</h2>
                <p>Application, interview, assessment and follow-up activity.</p>
              </div>
              <button
                className="rw-text-button"
                onClick={() => setActiveTab("Notifications")}
              >
                View all
              </button>
            </div>

            <NotificationList
              notifications={notifications.slice(0, 5)}
              onOpen={(item) => {
                const candidate = getSelected(item.candidateId);
                if (candidate) openCandidate(candidate);
              }}
            />
          </section>

          <section className="recruiter-panel">
            <div className="recruiter-panel-header">
              <div>
                <h2>Quick actions</h2>
                <p>Record work as you complete it.</p>
              </div>
            </div>

            <div className="rw-quick-actions">
              <button onClick={() => setActiveTab("Candidates")}>
                <Users size={17} /> Open candidate register
              </button>
              <button onClick={() => setActiveTab("Applications")}>
                <BriefcaseBusiness size={17} /> View job applications
              </button>
              <button
                onClick={() => {
                  setActiveTab("Interviews");
                  setShowInterviewForm(true);
                }}
              >
                <CalendarDays size={17} /> Schedule an interview
              </button>
              <button
                onClick={() => {
                  setActiveTab("Calls");
                  setShowCallForm(true);
                }}
              >
                <PhoneCall size={17} /> Log a candidate call
              </button>
            </div>
          </section>
        </div>
      )}

      {/* CANDIDATES */}
      {activeTab === "Candidates" && (
        <section className="recruiter-panel">
          <div className="recruiter-panel-header">
            <div>
              <h2>My candidates</h2>
              <p>
                Open a profile to find matching jobs, record applications,
                schedule interviews and track assessments.
              </p>
            </div>
          </div>

          <div className="rw-toolbar">
            <div className="rw-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, skills or client..."
              />
            </div>

            <label className="rw-filter">
              <Filter size={14} />
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="All">All statuses</option>
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="recruiter-table-wrapper">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Skills</th>
                  <th>Client</th>
                  <th>Applications</th>
                  <th>Interviews</th>
                  <th>Status</th>
                  <th>Profile</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <strong>{candidate.name}</strong>
                      <small>{candidate.email}</small>
                    </td>
                    <td>{getSkills(candidate).join(", ") || "Not specified"}</td>
                    <td>{candidate.client || "Unassigned"}</td>
                    <td>{candidateApplications(candidate).length}</td>
                    <td>{candidateInterviews(candidate).length}</td>
                    <td>
                      <StatusPill status={candidate.status} />
                    </td>
                    <td>
                      <button
                        className="rw-secondary-button rw-small-button"
                        onClick={() => openCandidate(candidate)}
                      >
                        <Eye size={14} /> View profile
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCandidates.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        title="No candidates found"
                        detail="Check your search and status filter, or ask HR to assign candidates to you."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* APPLICATIONS */}
      {activeTab === "Applications" && (
        <section className="recruiter-panel">
          <div className="recruiter-panel-header">
            <div>
              <h2>Candidate job applications</h2>
              <p>
                Every record identifies the candidate, company, job title,
                source and current application status.
              </p>
            </div>
            <button
              className="rw-primary-button"
              onClick={() => {
                setApplicationForm({
                  ...applicationForm,
                  candidateId: myCandidates[0]?.id
                    ? String(myCandidates[0].id)
                    : "",
                });
                setShowApplicationForm(true);
              }}
            >
              <Plus size={15} /> Record application
            </button>
          </div>

          <div className="rw-summary-strip">
            <div>
              <span>Total applications</span>
              <strong>{allApplications.length}</strong>
            </div>
            <div>
              <span>In review</span>
              <strong>
                {allApplications.filter((a) =>
                  ["Under Review", "Screening", "Assessment"].includes(a.status)
                ).length}
              </strong>
            </div>
            <div>
              <span>Interview stage</span>
              <strong>
                {allApplications.filter((a) => a.status === "Interview").length}
              </strong>
            </div>
            <div>
              <span>Selected</span>
              <strong>
                {allApplications.filter((a) => a.status === "Selected").length}
              </strong>
            </div>
          </div>

          <div className="recruiter-table-wrapper">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Company</th>
                  <th>Job title</th>
                  <th>Source</th>
                  <th>Applied on</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allApplications.map((application) => {
                  const candidate = getSelected(application.candidateId);

                  return (
                    <tr key={`${application.candidateId}-${application.id}`}>
                      <td>
                        <button
                          className="rw-table-link"
                          onClick={() => candidate && openCandidate(candidate)}
                        >
                          {application.candidateName}
                        </button>
                        <small>{application.candidateEmail}</small>
                      </td>
                      <td>{application.company}</td>
                      <td>{application.jobTitle}</td>
                      <td>{application.jobSource || "Jobs"}</td>
                      <td>{formatDate(application.appliedDate)}</td>
                      <td>
                        <select
                          value={application.status || "Applied"}
                          onChange={(event) =>
                            candidate &&
                            updateApplicationStatus(
                              candidate,
                              application.id,
                              event.target.value
                            )
                          }
                        >
                          {APPLICATION_STATUSES.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}

                {allApplications.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        title="No applications recorded"
                        detail="Open a candidate profile, review matching jobs and record the application."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* INTERVIEWS */}
      {activeTab === "Interviews" && (
        <section className="recruiter-panel">
          <div className="recruiter-panel-header">
            <div>
              <h2>Interview schedule</h2>
              <p>Company and job details are recorded for every interview.</p>
            </div>
            <button
              className="rw-primary-button"
              onClick={() => openInterviewForm()}
            >
              <Plus size={15} /> Schedule interview
            </button>
          </div>

          <div className="recruiter-table-wrapper">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Company</th>
                  <th>Job title</th>
                  <th>Date and time</th>
                  <th>Mode</th>
                  <th>Interviewer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allInterviews.map((interview) => (
                  <tr key={`${interview.candidateId}-${interview.id}`}>
                    <td>
                      <strong>{interview.candidateName}</strong>
                    </td>
                    <td>{interview.company}</td>
                    <td>{interview.jobTitle}</td>
                    <td>{formatDate(interview.date)}</td>
                    <td>{interview.mode}</td>
                    <td>{interview.interviewer || "Not specified"}</td>
                    <td>
                      <StatusPill status={interview.status} />
                    </td>
                  </tr>
                ))}
                {allInterviews.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        title="No interviews scheduled"
                        detail="Schedule an interview from a candidate profile or use the button above."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ASSESSMENTS */}
      {activeTab === "Assessments" && (
        <section className="recruiter-panel">
          <div className="recruiter-panel-header">
            <div>
              <h2>Assessments</h2>
              <p>Track company assessments, links, instructions and results.</p>
            </div>
            <button
              className="rw-primary-button"
              onClick={() => {
                setAssessmentForm((previous) => ({
                  ...previous,
                  candidateId: myCandidates[0]?.id
                    ? String(myCandidates[0].id)
                    : "",
                }));
                setShowAssessmentForm(true);
              }}
            >
              <Plus size={15} /> Add assessment
            </button>
          </div>

          <div className="recruiter-table-wrapper">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Company</th>
                  <th>Job title</th>
                  <th>Assessment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {allAssessments.map((assessment) => (
                  <tr key={`${assessment.candidateId}-${assessment.id}`}>
                    <td>{assessment.candidateName}</td>
                    <td>{assessment.company}</td>
                    <td>{assessment.jobTitle || "Not specified"}</td>
                    <td>{assessment.assessmentName}</td>
                    <td>{formatDate(assessment.date)}</td>
                    <td><StatusPill status={assessment.status} /></td>
                    <td>
                      {assessment.link ? (
                        <a href={assessment.link} target="_blank" rel="noreferrer">
                          Open assessment
                        </a>
                      ) : (
                        "No link"
                      )}
                    </td>
                  </tr>
                ))}
                {allAssessments.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        title="No assessments recorded"
                        detail="Add an assessment and associate it with the company and job."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SCREENINGS */}
      {activeTab === "Screenings" && (
        <section className="recruiter-panel">
          <div className="recruiter-panel-header">
            <div>
              <h2>Screening register</h2>
              <p>Track recruiter screenings and company screening rounds.</p>
            </div>
            <button
              className="rw-primary-button"
              onClick={() => {
                setScreeningForm((previous) => ({
                  ...previous,
                  candidateId: myCandidates[0]?.id
                    ? String(myCandidates[0].id)
                    : "",
                }));
                setShowScreeningForm(true);
              }}
            >
              <Plus size={15} /> Record screening
            </button>
          </div>

          <div className="recruiter-table-wrapper">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Company</th>
                  <th>Job title</th>
                  <th>Date</th>
                  <th>Result</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {allScreenings.map((screening) => (
                  <tr key={`${screening.candidateId}-${screening.id}`}>
                    <td>{screening.candidateName}</td>
                    <td>{screening.company}</td>
                    <td>{screening.jobTitle || "Not specified"}</td>
                    <td>{formatDate(screening.date)}</td>
                    <td><StatusPill status={screening.result} /></td>
                    <td>{screening.notes || "—"}</td>
                  </tr>
                ))}
                {allScreenings.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        title="No screening records"
                        detail="Use Record screening to save the company, job, date and outcome."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* CALLS */}
      {activeTab === "Calls" && (
        <section className="recruiter-panel">
          <div className="recruiter-panel-header">
            <div>
              <h2>Daily call register</h2>
              <p>Track calls, outcomes, notes and follow-up reminders.</p>
            </div>
            <button
              className="rw-primary-button"
              onClick={() => {
                setCallForm((previous) => ({
                  ...previous,
                  candidateId: myCandidates[0]?.id
                    ? String(myCandidates[0].id)
                    : "",
                }));
                setShowCallForm(true);
              }}
            >
              <Plus size={15} /> Log a call
            </button>
          </div>

          <div className="rw-summary-strip">
            <div>
              <span>Calls today</span>
              <strong>{todayCalls.length}</strong>
            </div>
            <div>
              <span>Total call records</span>
              <strong>{allCalls.length}</strong>
            </div>
            <div>
              <span>Connected</span>
              <strong>
                {allCalls.filter((call) => call.outcome === "Connected").length}
              </strong>
            </div>
            <div>
              <span>Follow-ups</span>
              <strong>
                {allCalls.filter((call) => Boolean(call.followUpDate)).length}
              </strong>
            </div>
          </div>

          <div className="recruiter-table-wrapper">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Date</th>
                  <th>Purpose</th>
                  <th>Outcome</th>
                  <th>Notes</th>
                  <th>Next follow-up</th>
                </tr>
              </thead>
              <tbody>
                {allCalls
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((call) => (
                    <tr key={`${call.candidateId}-${call.id}`}>
                      <td>{call.candidateName}</td>
                      <td>{formatDate(call.date)}</td>
                      <td>{call.purpose}</td>
                      <td>{call.outcome}</td>
                      <td>{call.notes}</td>
                      <td>{formatDate(call.followUpDate)}</td>
                    </tr>
                  ))}
                {allCalls.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        title="No calls recorded"
                        detail="Log each call to keep an accurate daily activity count."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* NOTIFICATIONS */}
      {activeTab === "Notifications" && (
        <section className="recruiter-panel">
          <div className="recruiter-panel-header">
            <div>
              <h2>Recruiter notifications</h2>
              <p>
                Application status changes, scheduled interviews, assessments
                and follow-up reminders recorded in candidate profiles.
              </p>
            </div>
            <span className="rw-notification-summary">
              {unreadCount} pending items
            </span>
          </div>

          <NotificationList
            notifications={notifications}
            onOpen={(item) => {
              const candidate = getSelected(item.candidateId);
              if (candidate) openCandidate(candidate);
            }}
          />
        </section>
      )}

      {/* CANDIDATE PROFILE DRAWER */}
      {selectedCandidate && (
        <div
          className="rw-drawer-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCandidate(null);
            }
          }}
        >
          <aside className="rw-drawer" role="dialog" aria-modal="true">
            <header className="rw-drawer-header">
              <div className="rw-profile-heading">
                <div className="rw-profile-avatar">
                  {String(selectedCandidate.name || "?")
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="recruiter-eyebrow">CANDIDATE PROFILE</p>
                  <h2>{selectedCandidate.name}</h2>
                  <StatusPill status={selectedCandidate.status} />
                </div>
              </div>
              <button
                className="rw-icon-button"
                onClick={() => setSelectedCandidate(null)}
                aria-label="Close profile"
              >
                <X size={18} />
              </button>
            </header>

            <div className="rw-drawer-contact">
              <p><Mail size={15} /> {selectedCandidate.email || "No email"}</p>
              <p><PhoneCall size={15} /> {selectedCandidate.mobile || "No phone"}</p>
              <p><Building2 size={15} /> {selectedCandidate.client || "Unassigned client"}</p>
            </div>

            <nav className="rw-profile-tabs">
              {["Overview", "Matching jobs", "Applications", "Activity"].map((tab) => (
                <button
                  key={tab}
                  className={profileTab === tab ? "active" : ""}
                  onClick={() => setProfileTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="rw-drawer-body">
              {profileTab === "Overview" && (
                <>
                  <section className="rw-profile-section">
                    <h3>Candidate information</h3>
                    <div className="rw-detail-row">
                      <span>Skills</span>
                      <strong>{getSkills(selectedCandidate).join(", ") || "Not provided"}</strong>
                    </div>
                    <div className="rw-detail-row">
                      <span>Experience</span>
                      <strong>{selectedCandidate.experience || "Not specified"}</strong>
                    </div>
                    <div className="rw-detail-row">
                      <span>Location</span>
                      <strong>{selectedCandidate.location || "Not specified"}</strong>
                    </div>
                    <div className="rw-detail-row">
                      <span>Resume</span>
                      <strong>
                        {selectedCandidate.resumeUrl ? (
                          <a href={selectedCandidate.resumeUrl} target="_blank" rel="noreferrer">
                            View resume
                          </a>
                        ) : (
                          "No resume link available"
                        )}
                      </strong>
                    </div>
                  </section>

                  <section className="rw-profile-section">
                    <h3>Candidate progress</h3>
                    <Field label="Update recruitment status">
                      <select
                        value={selectedCandidate.status || "New"}
                        onChange={(event) => {
                          const status = event.target.value;
                          updateCandidate(selectedCandidate.id, { status });
                          setSelectedCandidate({
                            ...selectedCandidate,
                            status,
                          });
                          setMessage("Candidate status updated.");
                        }}
                      >
                        {STATUSES.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </Field>
                  </section>

                  <section className="rw-profile-section">
                    <h3>Candidate activity counts</h3>
                    <div className="rw-mini-metrics">
                      <div><strong>{candidateApplications(selectedCandidate).length}</strong><span>Applications</span></div>
                      <div><strong>{candidateInterviews(selectedCandidate).length}</strong><span>Interviews</span></div>
                      <div><strong>{candidateAssessments(selectedCandidate).length}</strong><span>Assessments</span></div>
                      <div><strong>{candidateCalls(selectedCandidate).length}</strong><span>Calls</span></div>
                    </div>
                  </section>

                  <section className="rw-profile-section">
                    <h3>Actions</h3>
                    <div className="rw-quick-actions">
                      <button onClick={() => beginApplication(selectedCandidate)}>
                        <BriefcaseBusiness size={16} /> Record job application
                      </button>
                      <button onClick={() => openInterviewForm(selectedCandidate)}>
                        <CalendarDays size={16} /> Schedule interview
                      </button>
                      <button
                        onClick={() => {
                          setAssessmentForm({
                            candidateId: String(selectedCandidate.id),
                            applicationId: "",
                            company: selectedCandidate.client || "",
                            jobTitle: "",
                            assessmentName: "",
                            date: toDateTimeLocal(),
                            status: "Scheduled",
                            instructions: "",
                            link: "",
                          });
                          setShowAssessmentForm(true);
                        }}
                      >
                        <ClipboardCheck size={16} /> Add assessment
                      </button>
                      <button
                        onClick={() => {
                          setScreeningForm({
                            candidateId: String(selectedCandidate.id),
                            applicationId: "",
                            company: selectedCandidate.client || "",
                            jobTitle: "",
                            date: toDateTimeLocal(),
                            result: "Pending",
                            notes: "",
                          });
                          setShowScreeningForm(true);
                        }}
                      >
                        <Search size={16} /> Record screening
                      </button>
                      <button
                        onClick={() => {
                          setCallForm({
                            candidateId: String(selectedCandidate.id),
                            purpose: "Candidate follow-up",
                            outcome: "Connected",
                            notes: "",
                            followUpDate: "",
                          });
                          setShowCallForm(true);
                        }}
                      >
                        <PhoneCall size={16} /> Log a call
                      </button>
                    </div>
                  </section>
                </>
              )}

              {profileTab === "Matching jobs" && (
                <section className="rw-profile-section">
                  <h3>Jobs matching candidate skills</h3>
                  <p className="rw-muted-copy">
                    Matches are based on the candidate skills and job skills
                    available in the Jobs and Internal Jobs pages. Confirm the
                    requirements before applying.
                  </p>

                  {matchingJobsFor(selectedCandidate).map((job) => {
                    const applied = hasApplied(selectedCandidate, job);

                    return (
                      <article className="rw-match-card" key={job._key}>
                        <div className="rw-match-top">
                          <div className="rw-match-icon"><BriefcaseBusiness size={18} /></div>
                          <span className="rw-source-pill">{job._source}</span>
                        </div>
                        <h4>{getJobTitle(job)}</h4>
                        <p><Building2 size={14} /> {getJobCompany(job)}</p>
                        <p><Target size={14} /> {getJobLocation(job)}</p>
                        <div className="rw-match-score">
                          <span>Skills match</span>
                          <strong>{job.matchScore}%</strong>
                        </div>
                        <div className="rw-skill-tags">
                          {getJobSkills(job).slice(0, 6).map((skill) => (
                            <span key={skill}>{skill}</span>
                          ))}
                          {getJobSkills(job).length === 0 && (
                            <span>Skills not specified</span>
                          )}
                        </div>
                        <button
                          className={applied ? "rw-secondary-button rw-full-button" : "rw-primary-button rw-full-button"}
                          disabled={applied}
                          onClick={() => beginApplication(selectedCandidate, job)}
                        >
                          {applied ? (
                            <><CheckCircle2 size={15} /> Already applied</>
                          ) : (
                            <><Send size={15} /> Record application</>
                          )}
                        </button>
                      </article>
                    );
                  })}

                  {matchingJobsFor(selectedCandidate).length === 0 && (
                    <EmptyState
                      title="No matching jobs available"
                      detail="Check the Jobs and Internal Jobs data and ensure each job includes skills or technologies."
                    />
                  )}
                </section>
              )}

              {profileTab === "Applications" && (
                <section className="rw-profile-section">
                  <div className="rw-section-heading">
                    <h3>Application history</h3>
                    <button
                      className="rw-primary-button"
                      onClick={() => beginApplication(selectedCandidate)}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  {candidateApplications(selectedCandidate).map((application) => (
                    <article className="rw-record-card" key={application.id}>
                      <div className="rw-record-heading">
                        <div>
                          <h4>{application.jobTitle}</h4>
                          <p>{application.company}</p>
                        </div>
                        <StatusPill status={application.status} />
                      </div>
                      <p>Source: {application.jobSource || "Jobs"}</p>
                      <p>Applied: {formatDate(application.appliedDate)}</p>
                      {application.notes && <p>{application.notes}</p>}
                      <Field label="Update application status">
                        <select
                          value={application.status || "Applied"}
                          onChange={(event) =>
                            updateApplicationStatus(
                              selectedCandidate,
                              application.id,
                              event.target.value
                            )
                          }
                        >
                          {APPLICATION_STATUSES.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </Field>
                    </article>
                  ))}

                  {candidateApplications(selectedCandidate).length === 0 && (
                    <EmptyState
                      title="No applications yet"
                      detail="Open Matching jobs to record an application for this candidate."
                    />
                  )}
                </section>
              )}

              {profileTab === "Activity" && (
                <>
                  <section className="rw-profile-section">
                    <h3>Interviews</h3>
                    {candidateInterviews(selectedCandidate).map((item) => (
                      <article className="rw-record-card" key={item.id}>
                        <h4>{item.company} · {item.jobTitle}</h4>
                        <p>{formatDate(item.date)} · {item.mode}</p>
                        <p>Interviewer: {item.interviewer || "Not specified"}</p>
                        <p>Status: {item.status}</p>
                        {item.meetingLink && (
                          <a href={item.meetingLink} target="_blank" rel="noreferrer">
                            Open meeting link
                          </a>
                        )}
                      </article>
                    ))}
                  </section>

                  <section className="rw-profile-section">
                    <h3>Assessments</h3>
                    {candidateAssessments(selectedCandidate).map((item) => (
                      <article className="rw-record-card" key={item.id}>
                        <h4>{item.assessmentName}</h4>
                        <p>{item.company} · {item.jobTitle || "Role not specified"}</p>
                        <p>{formatDate(item.date)} · {item.status}</p>
                        {item.link && <a href={item.link} target="_blank" rel="noreferrer">Open assessment</a>}
                      </article>
                    ))}
                  </section>

                  <section className="rw-profile-section">
                    <h3>Screenings</h3>
                    {candidateScreenings(selectedCandidate).map((item) => (
                      <article className="rw-record-card" key={item.id}>
                        <h4>{item.company} · {item.jobTitle || "Role not specified"}</h4>
                        <p>{formatDate(item.date)} · {item.result}</p>
                        <p>{item.notes}</p>
                      </article>
                    ))}
                  </section>

                  <section className="rw-profile-section">
                    <h3>Calls</h3>
                    {candidateCalls(selectedCandidate).map((item) => (
                      <article className="rw-record-card" key={item.id}>
                        <h4>{item.purpose}</h4>
                        <p>{formatDate(item.date)} · {item.outcome}</p>
                        <p>{item.notes}</p>
                        {item.followUpDate && <p>Follow-up: {formatDate(item.followUpDate)}</p>}
                      </article>
                    ))}
                  </section>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* APPLICATION FORM */}
      {showApplicationForm && (
        <Modal
          title="Record job application"
          subtitle="Save the company, role and source for this candidate."
          onClose={() => setShowApplicationForm(false)}
        >
          <form className="rw-form-grid" onSubmit={submitApplication}>
            <Field label="Candidate *" full>
              <select
                required
                value={applicationForm.candidateId}
                onChange={(event) =>
                  setApplicationForm({ ...applicationForm, candidateId: event.target.value })
                }
              >
                <option value="">Select candidate</option>
                {myCandidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Company *">
              <input required value={applicationForm.company} onChange={(event) => setApplicationForm({ ...applicationForm, company: event.target.value })} placeholder="Company name" />
            </Field>
            <Field label="Job title *">
              <input required value={applicationForm.jobTitle} onChange={(event) => setApplicationForm({ ...applicationForm, jobTitle: event.target.value })} placeholder="Java Developer" />
            </Field>
            <Field label="Job source">
              <select value={applicationForm.jobSource} onChange={(event) => setApplicationForm({ ...applicationForm, jobSource: event.target.value })}>
                <option>Jobs</option>
                <option>Internal Jobs</option>
                <option>External source</option>
                <option>Referral</option>
                <option>Manual entry</option>
              </select>
            </Field>
            <Field label="Applied date">
              <input type="date" value={applicationForm.appliedDate} onChange={(event) => setApplicationForm({ ...applicationForm, appliedDate: event.target.value })} required />
            </Field>
            <Field label="Application status">
              <select value={applicationForm.status} onChange={(event) => setApplicationForm({ ...applicationForm, status: event.target.value })}>
                {APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </Field>
            <Field label="Notes" full>
              <textarea rows={3} value={applicationForm.notes} onChange={(event) => setApplicationForm({ ...applicationForm, notes: event.target.value })} placeholder="Application reference, portal or follow-up details" />
            </Field>
            <div className="rw-form-actions rw-field-full">
              <button type="button" className="rw-secondary-button" onClick={() => setShowApplicationForm(false)}>Cancel</button>
              <button type="submit" className="rw-primary-button"><Send size={15} /> Save application</button>
            </div>
          </form>
        </Modal>
      )}

      {/* INTERVIEW FORM */}
      {showInterviewForm && (
        <Modal
          title="Schedule interview"
          subtitle="Include the company and exact role so the interview record is unambiguous."
          onClose={() => setShowInterviewForm(false)}
        >
          <form className="rw-form-grid" onSubmit={submitInterview}>
            <Field label="Candidate *" full>
              <select required value={interviewForm.candidateId} onChange={(event) => setInterviewForm({ ...interviewForm, candidateId: event.target.value })}>
                <option value="">Select candidate</option>
                {myCandidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
              </select>
            </Field>
            <Field label="Company *">
              <input required value={interviewForm.company} onChange={(event) => setInterviewForm({ ...interviewForm, company: event.target.value })} placeholder="Interviewing company" />
            </Field>
            <Field label="Job title *">
              <input required value={interviewForm.jobTitle} onChange={(event) => setInterviewForm({ ...interviewForm, jobTitle: event.target.value })} placeholder="Role being interviewed for" />
            </Field>
            <Field label="Interview date and time *">
              <input type="datetime-local" required value={interviewForm.date} onChange={(event) => setInterviewForm({ ...interviewForm, date: event.target.value })} />
            </Field>
            <Field label="Mode">
              <select value={interviewForm.mode} onChange={(event) => setInterviewForm({ ...interviewForm, mode: event.target.value })}>
                <option>Online</option>
                <option>In-person</option>
                <option>Phone</option>
              </select>
            </Field>
            <Field label="Interviewer">
              <input value={interviewForm.interviewer} onChange={(event) => setInterviewForm({ ...interviewForm, interviewer: event.target.value })} placeholder="Interviewer name" />
            </Field>
            <Field label="Meeting link" full>
              <input type="url" value={interviewForm.meetingLink} onChange={(event) => setInterviewForm({ ...interviewForm, meetingLink: event.target.value })} placeholder="https://..." />
            </Field>
            <Field label="Notes" full>
              <textarea rows={3} value={interviewForm.notes} onChange={(event) => setInterviewForm({ ...interviewForm, notes: event.target.value })} placeholder="Round, preparation, location or instructions" />
            </Field>
            <p className="rw-form-note rw-field-full">
              This saves an interview record and creates a notification in this workspace. Email delivery requires a backend mail service.
            </p>
            <div className="rw-form-actions rw-field-full">
              <button type="button" className="rw-secondary-button" onClick={() => setShowInterviewForm(false)}>Cancel</button>
              <button type="submit" className="rw-primary-button"><CalendarDays size={15} /> Save interview</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ASSESSMENT FORM */}
      {showAssessmentForm && (
        <Modal title="Record assessment" onClose={() => setShowAssessmentForm(false)}>
          <form className="rw-form-grid" onSubmit={submitAssessment}>
            <Field label="Candidate *" full>
              <select required value={assessmentForm.candidateId} onChange={(event) => setAssessmentForm({ ...assessmentForm, candidateId: event.target.value })}>
                <option value="">Select candidate</option>
                {myCandidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
              </select>
            </Field>
            <Field label="Company *">
              <input required value={assessmentForm.company} onChange={(event) => setAssessmentForm({ ...assessmentForm, company: event.target.value })} placeholder="Company name" />
            </Field>
            <Field label="Job title">
              <input value={assessmentForm.jobTitle} onChange={(event) => setAssessmentForm({ ...assessmentForm, jobTitle: event.target.value })} placeholder="Role" />
            </Field>
            <Field label="Assessment name *">
              <input required value={assessmentForm.assessmentName} onChange={(event) => setAssessmentForm({ ...assessmentForm, assessmentName: event.target.value })} placeholder="Technical test / aptitude" />
            </Field>
            <Field label="Date and time">
              <input type="datetime-local" value={assessmentForm.date} onChange={(event) => setAssessmentForm({ ...assessmentForm, date: event.target.value })} required />
            </Field>
            <Field label="Status">
              <select value={assessmentForm.status} onChange={(event) => setAssessmentForm({ ...assessmentForm, status: event.target.value })}>
                <option>Scheduled</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Passed</option>
                <option>Failed</option>
              </select>
            </Field>
            <Field label="Assessment link" full>
              <input type="url" value={assessmentForm.link} onChange={(event) => setAssessmentForm({ ...assessmentForm, link: event.target.value })} placeholder="https://..." />
            </Field>
            <Field label="Instructions" full>
              <textarea rows={3} value={assessmentForm.instructions} onChange={(event) => setAssessmentForm({ ...assessmentForm, instructions: event.target.value })} placeholder="Deadline, duration and instructions" />
            </Field>
            <div className="rw-form-actions rw-field-full">
              <button type="button" className="rw-secondary-button" onClick={() => setShowAssessmentForm(false)}>Cancel</button>
              <button type="submit" className="rw-primary-button"><ClipboardCheck size={15} /> Save assessment</button>
            </div>
          </form>
        </Modal>
      )}

      {/* SCREENING FORM */}
      {showScreeningForm && (
        <Modal title="Record screening" onClose={() => setShowScreeningForm(false)}>
          <form className="rw-form-grid" onSubmit={submitScreening}>
            <Field label="Candidate *" full>
              <select required value={screeningForm.candidateId} onChange={(event) => setScreeningForm({ ...screeningForm, candidateId: event.target.value })}>
                <option value="">Select candidate</option>
                {myCandidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
              </select>
            </Field>
            <Field label="Company *">
              <input required value={screeningForm.company} onChange={(event) => setScreeningForm({ ...screeningForm, company: event.target.value })} placeholder="Company conducting screening" />
            </Field>
            <Field label="Job title">
              <input value={screeningForm.jobTitle} onChange={(event) => setScreeningForm({ ...screeningForm, jobTitle: event.target.value })} placeholder="Role" />
            </Field>
            <Field label="Screening date">
              <input type="datetime-local" required value={screeningForm.date} onChange={(event) => setScreeningForm({ ...screeningForm, date: event.target.value })} />
            </Field>
            <Field label="Result">
              <select value={screeningForm.result} onChange={(event) => setScreeningForm({ ...screeningForm, result: event.target.value })}>
                <option>Pending</option>
                <option>Passed</option>
                <option>Failed</option>
                <option>On Hold</option>
              </select>
            </Field>
            <Field label="Screening notes" full>
              <textarea rows={3} value={screeningForm.notes} onChange={(event) => setScreeningForm({ ...screeningForm, notes: event.target.value })} placeholder="Screening questions, feedback and next steps" />
            </Field>
            <div className="rw-form-actions rw-field-full">
              <button type="button" className="rw-secondary-button" onClick={() => setShowScreeningForm(false)}>Cancel</button>
              <button type="submit" className="rw-primary-button"><Search size={15} /> Save screening</button>
            </div>
          </form>
        </Modal>
      )}

      {/* CALL FORM */}
      {showCallForm && (
        <Modal title="Log candidate call" onClose={() => setShowCallForm(false)}>
          <form className="rw-form-grid" onSubmit={submitCall}>
            <Field label="Candidate *" full>
              <select required value={callForm.candidateId} onChange={(event) => setCallForm({ ...callForm, candidateId: event.target.value })}>
                <option value="">Select candidate</option>
                {myCandidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
              </select>
            </Field>
            <Field label="Call purpose">
              <select value={callForm.purpose} onChange={(event) => setCallForm({ ...callForm, purpose: event.target.value })}>
                <option>Candidate follow-up</option>
                <option>Job opportunity</option>
                <option>Interview confirmation</option>
                <option>Assessment reminder</option>
                <option>Document collection</option>
                <option>Offer discussion</option>
              </select>
            </Field>
            <Field label="Call outcome">
              <select value={callForm.outcome} onChange={(event) => setCallForm({ ...callForm, outcome: event.target.value })}>
                <option>Connected</option>
                <option>No answer</option>
                <option>Call back requested</option>
                <option>Interested</option>
                <option>Not interested</option>
                <option>Number unreachable</option>
              </select>
            </Field>
            <Field label="Next follow-up">
              <input type="datetime-local" value={callForm.followUpDate} onChange={(event) => setCallForm({ ...callForm, followUpDate: event.target.value })} />
            </Field>
            <Field label="Call notes *" full>
              <textarea rows={4} required value={callForm.notes} onChange={(event) => setCallForm({ ...callForm, notes: event.target.value })} placeholder="Conversation summary and next steps" />
            </Field>
            <div className="rw-form-actions rw-field-full">
              <button type="button" className="rw-secondary-button" onClick={() => setShowCallForm(false)}>Cancel</button>
              <button type="submit" className="rw-primary-button"><PhoneCall size={15} /> Save call</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function NotificationList({ notifications, onOpen }) {
  if (!notifications.length) {
    return (
      <EmptyState
        title="No notifications yet"
        detail="Application, interview, assessment and follow-up activity will appear here."
      />
    );
  }

  return (
    <div className="rw-notification-list">
      {notifications.map((item) => (
        <button
          type="button"
          className={`rw-notification-item ${item.unread ? "unread" : ""}`}
          key={item.id}
          onClick={() => onOpen?.(item)}
        >
          <span className="rw-notification-icon">
            {item.type === "Interview" ? (
              <CalendarDays size={17} />
            ) : item.type === "Assessment" ? (
              <ClipboardCheck size={17} />
            ) : item.type === "Follow-up" ? (
              <PhoneCall size={17} />
            ) : item.type === "Screening" ? (
              <Search size={17} />
            ) : (
              <BriefcaseBusiness size={17} />
            )}
          </span>
          <span className="rw-notification-copy">
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
            <small>{formatDate(item.date)}</small>
          </span>
          {item.unread && <span className="rw-unread-dot" />}
        </button>
      ))}
    </div>
  );
}
