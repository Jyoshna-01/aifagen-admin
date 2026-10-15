import { useMemo, useState } from "react";
import {
  Search, Plus, Download, X, Users as UsersIcon, UserRound, Pencil,
  Eye, Brain, ClipboardCheck, CheckCircle2, AlertCircle, Clock3,
  ChevronDown, ChevronUp, Mail, Phone, CalendarDays, BriefcaseBusiness,
  Trash2, Building2, GraduationCap, FileCheck2, Trophy, RefreshCw,
  MapPin, CircleDollarSign, ListChecks, History, UserCheck
} from "lucide-react";
import "./Users.css";
import useAssistantContext from "../hooks/useAssistantContext";

const RECRUITERS = ["Unassigned", "Alex Morgan", "Priya Sharma", "John Smith", "Sneha Reddy"];
const AREAS = [
  "DevOps", "Supply Chain", "AI / ML", "Data Scientist",
  "Data Center Technician", "Network Engineer", "Business Analyst",
  "Data Analyst", "Full Stack", "Software Engineer",
  "QualityAutomation", "IT Support", "SAP"
];
const PLANS = ["None", "Basic", "Premium"];
const STATUSES = ["Active", "Inactive", "Past due", "Cancelled"];
const SCREENING_STATUSES = ["Not Started", "In Progress", "Completed", "Passed", "Needs Review"];
const INTERVIEW_STATUSES = ["Scheduled", "In Progress", "Completed", "Cancelled", "Rescheduled"];
const INTERVIEW_RESULTS = ["Pending", "Selected", "Rejected", "On Hold", "Next Round"];
const ASSESSMENT_STATUSES = ["Not Started", "In Progress", "Passed", "Failed", "Needs Retake", "Pending Review"];

const today = new Date();
const dateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const initialUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    mobile: "9876543210",
    area: "Full Stack",
    plan: "Premium",
    status: "Active",
    joined: "2026-08-14",
    planExpires: dateOffset(6),
    recruiter: "Priya Sharma",
    notes: "Interested in full-stack development roles.",
    aiFeatures: { resume: 12, interview: 8, assessment: 5 },
    screening: {
      status: "Completed",
      score: 86,
      strengths: "Java, React, communication",
      improvements: "System design and advanced SQL",
      missingSkills: "Microservices"
    },
    recruiterHistory: [],
    interviewsAttended: [
      {
        id: 101,
        company: "Infosys",
        role: "Java Developer",
        date: dateOffset(-10),
        roundsAttended: 2,
        totalRounds: 3,
        status: "Completed",
        result: "Next Round",
        location: "Hyderabad",
        notes: "Technical round completed. Waiting for the next round."
      },
      {
        id: 102,
        company: "TCS",
        role: "Full Stack Developer",
        date: dateOffset(-4),
        roundsAttended: 1,
        totalRounds: 2,
        status: "Completed",
        result: "Pending",
        location: "Hyderabad",
        notes: "Completed the first technical interview."
      }
    ],
    assessmentRecords: [
      {
        id: 201,
        company: "Infosys",
        name: "Java Coding Assessment",
        date: dateOffset(-12),
        score: 86,
        maxScore: 100,
        status: "Passed",
        notes: "Good performance in Java fundamentals."
      },
      {
        id: 202,
        company: "TCS",
        name: "SQL and Problem Solving",
        date: dateOffset(-5),
        score: 72,
        maxScore: 100,
        status: "Pending Review",
        notes: "Result awaiting company review."
      }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    mobile: "9876543211",
    area: "DevOps",
    plan: "Basic",
    status: "Active",
    joined: "2026-09-01",
    planExpires: dateOffset(18),
    recruiter: "Alex Morgan",
    notes: "Looking for cloud and DevOps opportunities.",
    aiFeatures: { resume: 5, interview: 4, assessment: 3 },
    screening: {
      status: "In Progress",
      score: 68,
      strengths: "Linux, Git",
      improvements: "Docker and Kubernetes",
      missingSkills: "Terraform, CI/CD"
    },
    recruiterHistory: [],
    interviewsAttended: [
      {
        id: 103,
        company: "Amazon",
        role: "DevOps Engineer",
        date: dateOffset(-3),
        roundsAttended: 1,
        totalRounds: 4,
        status: "Completed",
        result: "Pending",
        location: "Hyderabad",
        notes: "Initial technical discussion completed."
      }
    ],
    assessmentRecords: [
      {
        id: 203,
        company: "Amazon",
        name: "Linux and Cloud Assessment",
        date: dateOffset(-6),
        score: 65,
        maxScore: 100,
        status: "Needs Retake",
        notes: "Improve cloud networking concepts."
      }
    ]
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    mobile: "9876543212",
    area: "Data Analyst",
    plan: "Premium",
    status: "Active",
    joined: "2026-07-20",
    planExpires: dateOffset(30),
    recruiter: "Sneha Reddy",
    notes: "Interested in SQL, analytics and reporting.",
    aiFeatures: { resume: 9, interview: 6, assessment: 7 },
    screening: {
      status: "Passed",
      score: 92,
      strengths: "SQL, Excel, Power BI",
      improvements: "Python for analytics",
      missingSkills: "Advanced statistics"
    },
    recruiterHistory: [],
    interviewsAttended: [
      {
        id: 104,
        company: "Accenture",
        role: "Data Analyst",
        date: dateOffset(-7),
        roundsAttended: 3,
        totalRounds: 3,
        status: "Completed",
        result: "Selected",
        location: "Hyderabad",
        notes: "All interview rounds completed successfully."
      }
    ],
    assessmentRecords: [
      {
        id: 204,
        company: "Accenture",
        name: "Data Analytics Assessment",
        date: dateOffset(-9),
        score: 92,
        maxScore: 100,
        status: "Passed",
        notes: "Strong SQL and analytical reasoning."
      }
    ]
  },
  {
    id: 4,
    name: "Daniel Wilson",
    email: "daniel.wilson@example.com",
    mobile: "9876543213",
    area: "Software Engineer",
    plan: "None",
    status: "Inactive",
    joined: "2026-09-20",
    planExpires: "",
    recruiter: "Unassigned",
    notes: "",
    aiFeatures: { resume: 2, interview: 1, assessment: 0 },
    screening: {
      status: "Not Started",
      score: 0,
      strengths: "",
      improvements: "",
      missingSkills: ""
    },
    recruiterHistory: [],
    interviewsAttended: [],
    assessmentRecords: []
  }
];

const emptyScreening = {
  status: "Not Started",
  score: 0,
  strengths: "",
  improvements: "",
  missingSkills: ""
};

const newUser = (id) => ({
  id,
  name: "",
  email: "",
  mobile: "",
  area: "Full Stack",
  plan: "None",
  status: "Active",
  joined: dateOffset(0),
  planExpires: "",
  recruiter: "Unassigned",
  notes: "",
  aiFeatures: { resume: 0, interview: 0, assessment: 0 },
  screening: { ...emptyScreening },
  recruiterHistory: [],
  interviewsAttended: [],
  assessmentRecords: []
});

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
};

const getAiTotal = (user) =>
  Object.values(user.aiFeatures || {}).reduce((sum, value) => sum + Number(value || 0), 0);

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const getExpiryInfo = (user) => {
  if (user.plan === "None" || !user.planExpires) {
    return { label: "No subscription", type: "neutral", days: null };
  }

  const expiry = new Date(`${user.planExpires}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const days = Math.ceil((expiry.getTime() - now.getTime()) / 86400000);

  if (days < 0) return { label: `Expired ${Math.abs(days)}d ago`, type: "danger", days };
  if (days === 0) return { label: "Expires today", type: "warning", days };
  if (days <= 7) return { label: `Expires in ${days}d`, type: "warning", days };
  if (days <= 30) return { label: `Expires in ${days}d`, type: "info", days };

  return { label: `Expires in ${days}d`, type: "success", days };
};

function StatusBadge({ children, type = "neutral" }) {
  return <span className={`u-badge u-badge-${type}`}>{children}</span>;
}

function MetricCard({ icon: Icon, label, value, note }) {
  return (
    <div className="u-metric-card">
      <div className="u-metric-top">
        <span>{label}</span>
        <span className="u-metric-icon"><Icon size={18} /></span>
      </div>
      <div className="u-metric-value">{value}</div>
      <div className="u-metric-note">{note}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="u-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function UserModal({ user, onClose, onSave, isEdit }) {
  const [form, setForm] = useState(() => ({
    ...user,
    aiFeatures: { ...(user.aiFeatures || {}) },
    screening: { ...emptyScreening, ...(user.screening || {}) }
  }));

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateAI = (key, value) => {
    setForm((prev) => ({
      ...prev,
      aiFeatures: { ...prev.aiFeatures, [key]: Math.max(0, Number(value) || 0) }
    }));
  };

  const updateScreening = (key, value) => {
    setForm((prev) => ({
      ...prev,
      screening: { ...prev.screening, [key]: value }
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onSave(form);
  };

  return (
    <div className="u-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="u-modal">
        <div className="u-modal-header">
          <div>
            <p className="u-eyebrow">{isEdit ? "EDIT PROFILE" : "NEW PROFILE"}</p>
            <h2>{isEdit ? "Update user" : "Add a user"}</h2>
            <p>Manage subscription, screening and account information.</p>
          </div>
          <button className="u-icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="u-modal-body">
            <h3 className="u-form-section-title">Personal information</h3>
            <div className="u-form-grid">
              <Field label="Full name">
                <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter full name" />
              </Field>
              <Field label="Email address">
                <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@example.com" />
              </Field>
              <Field label="Mobile number">
                <input value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="Mobile number" />
              </Field>
              <Field label="Career area">
                <select value={form.area} onChange={(e) => update("area", e.target.value)}>
                  {AREAS.map((area) => <option key={area}>{area}</option>)}
                </select>
              </Field>
              <Field label="Subscription plan">
                <select value={form.plan} onChange={(e) => update("plan", e.target.value)}>
                  {PLANS.map((plan) => <option key={plan}>{plan}</option>)}
                </select>
              </Field>
              <Field label="Account status">
                <select value={form.status} onChange={(e) => update("status", e.target.value)}>
                  {STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </Field>
              <Field label="Plan expiry date">
                <input
                  type="date"
                  value={form.planExpires || ""}
                  disabled={form.plan === "None"}
                  onChange={(e) => update("planExpires", e.target.value)}
                />
              </Field>
              <Field label="Assigned recruiter">
                <select value={form.recruiter} onChange={(e) => update("recruiter", e.target.value)}>
                  {RECRUITERS.map((recruiter) => <option key={recruiter}>{recruiter}</option>)}
                </select>
              </Field>
            </div>

            <h3 className="u-form-section-title">Screening details</h3>
            <div className="u-form-grid">
              <Field label="Screening status">
                <select value={form.screening.status} onChange={(e) => updateScreening("status", e.target.value)}>
                  {SCREENING_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </Field>
              <Field label="Screening score (%)">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.screening.score}
                  onChange={(e) => updateScreening("score", Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                />
              </Field>
              <Field label="Strengths">
                <input value={form.screening.strengths} onChange={(e) => updateScreening("strengths", e.target.value)} placeholder="Key strengths" />
              </Field>
              <Field label="Areas to improve">
                <input value={form.screening.improvements} onChange={(e) => updateScreening("improvements", e.target.value)} placeholder="Skills to improve" />
              </Field>
              <Field label="Missing skills">
                <input value={form.screening.missingSkills} onChange={(e) => updateScreening("missingSkills", e.target.value)} placeholder="Skills to develop" />
              </Field>
            </div>

            <h3 className="u-form-section-title">AI feature usage</h3>
            <div className="u-form-grid u-form-grid-three">
              <Field label="Resume actions">
                <input type="number" min="0" value={form.aiFeatures.resume} onChange={(e) => updateAI("resume", e.target.value)} />
              </Field>
              <Field label="Interview practice">
                <input type="number" min="0" value={form.aiFeatures.interview} onChange={(e) => updateAI("interview", e.target.value)} />
              </Field>
              <Field label="Assessment actions">
                <input type="number" min="0" value={form.aiFeatures.assessment} onChange={(e) => updateAI("assessment", e.target.value)} />
              </Field>
            </div>

            <Field label="Admin notes">
              <textarea rows="3" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Internal notes about this user..." />
            </Field>
          </div>

          <div className="u-modal-footer">
            <button type="button" className="u-btn u-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="u-btn u-btn-primary">
              {isEdit ? "Save changes" : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InterviewForm({ onAdd, onCancel }) {
  const [record, setRecord] = useState({
    company: "",
    role: "",
    date: dateOffset(0),
    roundsAttended: 0,
    totalRounds: 1,
    status: "Scheduled",
    result: "Pending",
    location: "",
    notes: ""
  });

  const update = (key, value) => setRecord((prev) => ({ ...prev, [key]: value }));

  return (
    <form className="u-record-form" onSubmit={(e) => {
      e.preventDefault();
      if (!record.company.trim() || !record.role.trim()) return;
      onAdd({ ...record, id: Date.now() });
    }}>
      <div className="u-record-form-title">
        <div>
          <h4>Add interview record</h4>
          <p>Record the company, position and interview progress.</p>
        </div>
        <button className="u-icon-button" type="button" onClick={onCancel}><X size={17} /></button>
      </div>

      <div className="u-form-grid">
        <Field label="Company name">
          <input required value={record.company} onChange={(e) => update("company", e.target.value)} placeholder="e.g. Infosys" />
        </Field>
        <Field label="Job role">
          <input required value={record.role} onChange={(e) => update("role", e.target.value)} placeholder="e.g. Java Developer" />
        </Field>
        <Field label="Interview date">
          <input required type="date" value={record.date} onChange={(e) => update("date", e.target.value)} />
        </Field>
        <Field label="Interview location">
          <input value={record.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Hyderabad / Online" />
        </Field>
        <Field label="Rounds attended">
          <input type="number" min="0" value={record.roundsAttended} onChange={(e) => update("roundsAttended", Math.max(0, Number(e.target.value) || 0))} />
        </Field>
        <Field label="Total rounds">
          <input type="number" min="1" value={record.totalRounds} onChange={(e) => update("totalRounds", Math.max(1, Number(e.target.value) || 1))} />
        </Field>
        <Field label="Interview status">
          <select value={record.status} onChange={(e) => update("status", e.target.value)}>
            {INTERVIEW_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
        </Field>
        <Field label="Hiring result">
          <select value={record.result} onChange={(e) => update("result", e.target.value)}>
            {INTERVIEW_RESULTS.map((result) => <option key={result}>{result}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Interview notes / feedback">
        <textarea rows="2" value={record.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Questions asked, feedback, next steps..." />
      </Field>

      <div className="u-form-actions">
        <button type="button" className="u-btn u-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="u-btn u-btn-primary"><Plus size={15} /> Add interview</button>
      </div>
    </form>
  );
}

function AssessmentForm({ onAdd, onCancel }) {
  const [record, setRecord] = useState({
    company: "",
    name: "",
    date: dateOffset(0),
    score: "",
    maxScore: 100,
    status: "Not Started",
    notes: ""
  });

  const update = (key, value) => setRecord((prev) => ({ ...prev, [key]: value }));

  return (
    <form className="u-record-form" onSubmit={(e) => {
      e.preventDefault();
      if (!record.company.trim() || !record.name.trim()) return;
      onAdd({
        ...record,
        id: Date.now(),
        score: record.score === "" ? null : Number(record.score),
        maxScore: Math.max(1, Number(record.maxScore) || 100)
      });
    }}>
      <div className="u-record-form-title">
        <div>
          <h4>Add assessment record</h4>
          <p>Track company tests, scores and assessment outcomes.</p>
        </div>
        <button className="u-icon-button" type="button" onClick={onCancel}><X size={17} /></button>
      </div>

      <div className="u-form-grid">
        <Field label="Company name">
          <input required value={record.company} onChange={(e) => update("company", e.target.value)} placeholder="e.g. TCS" />
        </Field>
        <Field label="Assessment name">
          <input required value={record.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Aptitude test" />
        </Field>
        <Field label="Assessment date">
          <input required type="date" value={record.date} onChange={(e) => update("date", e.target.value)} />
        </Field>
        <Field label="Score obtained">
          <input type="number" min="0" value={record.score} onChange={(e) => update("score", e.target.value)} placeholder="Not graded yet" />
        </Field>
        <Field label="Maximum score">
          <input type="number" min="1" value={record.maxScore} onChange={(e) => update("maxScore", e.target.value)} />
        </Field>
        <Field label="Assessment status">
          <select value={record.status} onChange={(e) => update("status", e.target.value)}>
            {ASSESSMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Assessment notes / feedback">
        <textarea rows="2" value={record.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Feedback, skills tested, areas to improve..." />
      </Field>

      <div className="u-form-actions">
        <button type="button" className="u-btn u-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="u-btn u-btn-primary"><Plus size={15} /> Add assessment</button>
      </div>
    </form>
  );
}

function RecordStatus({ status }) {
  const lower = String(status || "").toLowerCase();
  let type = "neutral";

  if (["passed", "selected", "completed"].includes(lower)) type = "success";
  else if (["failed", "rejected", "needs retake"].includes(lower)) type = "danger";
  else if (["in progress", "next round", "on hold", "pending review", "rescheduled"].includes(lower)) type = "warning";
  else if (["scheduled"].includes(lower)) type = "info";

  return <StatusBadge type={type}>{status || "Not set"}</StatusBadge>;
}

export default function Users({ onAssistantContext }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(initialUsers[0]?.id ?? null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formUser, setFormUser] = useState(null);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [showScreening, setShowScreening] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [showRecruiterHistory, setShowRecruiterHistory] = useState(false);
  const [notification, setNotification] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");

  const notify = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 2800);
  };

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.mobile, user.area, user.recruiter]
          .some((value) => String(value || "").toLowerCase().includes(query));

      return (
        matchesSearch &&
        (planFilter === "All" || user.plan === planFilter) &&
        (statusFilter === "All" || user.status === statusFilter) &&
        (areaFilter === "All" || user.area === areaFilter)
      );
    });
  }, [users, search, planFilter, statusFilter, areaFilter]);

  const selectedUser = users.find((user) => user.id === selectedId) || null;

  const allInterviews = users.flatMap((user) =>
    (user.interviewsAttended || []).map((record) => ({ ...record, userName: user.name, userId: user.id }))
  );

  const allAssessments = users.flatMap((user) =>
    (user.assessmentRecords || []).map((record) => ({ ...record, userName: user.name, userId: user.id }))
  );

  const expiringUsers = users
    .filter((user) => user.plan !== "None" && user.planExpires)
    .filter((user) => {
      const info = getExpiryInfo(user);
      return info.days !== null && info.days <= 30;
    })
    .sort((a, b) => new Date(a.planExpires) - new Date(b.planExpires));

  const metrics = {
    total: users.length,
    premium: users.filter((user) => user.plan === "Premium" && user.status === "Active").length,
    screened: users.filter((user) => ["Completed", "Passed"].includes(user.screening?.status)).length,
    interviews: allInterviews.filter((record) => record.status === "Completed").length,
    assessmentsPassed: allAssessments.filter((record) => record.status === "Passed").length,
    expiring: expiringUsers.length
  };
  const newUserCutoff = new Date();
  newUserCutoff.setDate(newUserCutoff.getDate() - 30);
  const newRegistrations = users.filter((user) => {
    const joinedDate = new Date(user.joined);
    return !Number.isNaN(joinedDate.getTime()) && joinedDate >= newUserCutoff;
  }).length;
  useAssistantContext(onAssistantContext, "Users", {
    total: users.length,
    filtered: filteredUsers.length,
    newRegistrations,
    users: users.map((user) => ({
      plan: user.plan,
      status: user.status,
      screeningStatus: user.screening?.status,
    })),
    expiringSoon: expiringUsers.filter((user) => {
      const info = getExpiryInfo(user);
      return info.days !== null && info.days <= 7;
    }).length,
    search: search ? "Search active" : "",
    filters: [
      `plan ${planFilter}`,
      `status ${statusFilter}`,
      `area ${areaFilter}`,
    ].join(", "),
  });

  const companyOptions = useMemo(() => {
    const names = new Set([
      ...allInterviews.map((record) => record.company),
      ...allAssessments.map((record) => record.company)
    ]);
    return [...names].filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [users]);

  const openAdd = () => {
    setModalMode("add");
    setFormUser(newUser(Math.max(0, ...users.map((user) => user.id)) + 1));
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setModalMode("edit");
    setFormUser(user);
    setModalOpen(true);
  };

  const saveUser = (updatedUser) => {
    setUsers((prev) => {
      const exists = prev.some((user) => user.id === updatedUser.id);
      if (exists) {
        return prev.map((user) => {
          if (user.id !== updatedUser.id) return user;

          const recruiterHistory = [...(user.recruiterHistory || [])];
          if (user.recruiter !== updatedUser.recruiter) {
            recruiterHistory.unshift({
              from: user.recruiter || "Unassigned",
              to: updatedUser.recruiter || "Unassigned",
              date: new Date().toISOString(),
              reason: "Updated from user profile"
            });
          }

          return { ...updatedUser, recruiterHistory };
        });
      }
      return [...prev, updatedUser];
    });

    setSelectedId(updatedUser.id);
    setModalOpen(false);
    notify(modalMode === "edit" ? "User updated successfully" : "User created successfully");
  };

  const deleteUser = (user) => {
    if (!window.confirm(`Delete ${user.name}'s profile? This cannot be undone.`)) return;

    setUsers((prev) => prev.filter((item) => item.id !== user.id));
    if (selectedId === user.id) {
      const remaining = users.filter((item) => item.id !== user.id);
      setSelectedId(remaining[0]?.id ?? null);
    }
    notify("User deleted");
  };

  const addInterview = (userId, record) => {
    setUsers((prev) => prev.map((user) =>
      user.id === userId
        ? { ...user, interviewsAttended: [...(user.interviewsAttended || []), record] }
        : user
    ));
    setShowInterviewForm(false);
    notify("Interview record added");
  };

  const addAssessment = (userId, record) => {
    setUsers((prev) => prev.map((user) =>
      user.id === userId
        ? { ...user, assessmentRecords: [...(user.assessmentRecords || []), record] }
        : user
    ));
    setShowAssessmentForm(false);
    notify("Assessment record added");
  };

  const removeRecord = (userId, key, recordId, label) => {
    if (!window.confirm(`Delete this ${label} record?`)) return;
    setUsers((prev) => prev.map((user) =>
      user.id === userId
        ? { ...user, [key]: (user[key] || []).filter((record) => record.id !== recordId) }
        : user
    ));
    notify(`${label} record deleted`);
  };

  const exportCSV = () => {
    const headers = [
      "ID", "Name", "Email", "Mobile", "Area", "Plan", "Plan Expiry",
      "Account Status", "Joined", "Recruiter", "Screening Status", "Screening Score",
      "Interviews Attended", "Companies Interviewed", "Assessments", "Assessments Passed",
      "AI Actions", "Notes"
    ];

    const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredUsers.map((user) => [
      user.id,
      user.name,
      user.email,
      user.mobile,
      user.area,
      user.plan,
      user.planExpires,
      user.status,
      user.joined,
      user.recruiter,
      user.screening?.status,
      user.screening?.score,
      (user.interviewsAttended || []).length,
      [...new Set((user.interviewsAttended || []).map((item) => item.company))].join("; "),
      (user.assessmentRecords || []).length,
      (user.assessmentRecords || []).filter((item) => item.status === "Passed").length,
      getAiTotal(user),
      user.notes
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "aifagen-users.csv";
    link.click();
    URL.revokeObjectURL(url);
    notify("CSV exported");
  };

  const changeRecruiter = (user, recruiter) => {
    if (recruiter === user.recruiter) return;

    const reason = window.prompt("Reason for recruiter reassignment:", "Workload balancing");
    if (reason === null) return;

    setUsers((prev) => prev.map((item) => {
      if (item.id !== user.id) return item;

      return {
        ...item,
        recruiter,
        recruiterHistory: [
          {
            from: item.recruiter || "Unassigned",
            to: recruiter,
            date: new Date().toISOString(),
            reason: reason.trim() || "Not specified"
          },
          ...(item.recruiterHistory || [])
        ]
      };
    }));

    notify("Recruiter reassigned");
  };

  const assessmentStatusForUser = (user) => {
    const records = user.assessmentRecords || [];
    if (!records.length) return "No assessments";
    if (records.some((record) => record.status === "In Progress")) return "In Progress";
    if (records.some((record) => record.status === "Needs Retake" || record.status === "Failed")) return "Needs Attention";
    if (records.every((record) => record.status === "Passed")) return "All Passed";
    if (records.some((record) => record.status === "Pending Review")) return "Pending Review";
    return "Recorded";
  };

  return (
    <div className="u-page">
      <style>{`
        .u-page{--ink:#191919;--muted:#737373;--line:#e8e8e8;--soft:#f7f7f7;--green:#18794e;--red:#b42318;--amber:#a15c00;--blue:#2356c7;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:26px;background:#fff;min-height:100%;box-sizing:border-box}
        .u-page *{box-sizing:border-box}.u-page button,.u-page input,.u-page select,.u-page textarea{font:inherit}.u-page button{cursor:pointer}.u-page input,.u-page select,.u-page textarea{width:100%;border:1px solid #dedede;border-radius:9px;padding:10px 11px;background:#fff;color:#222;outline:none}.u-page input:focus,.u-page select:focus,.u-page textarea:focus{border-color:#777;box-shadow:0 0 0 3px #1111110a}
        .u-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:24px}.u-eyebrow{font-size:10px;letter-spacing:1.5px;font-weight:800;color:#858585;margin:0 0 7px}.u-page-header h1{font-size:28px;letter-spacing:-.9px;margin:0;font-weight:750}.u-page-header p{font-size:13px;color:var(--muted);margin:8px 0 0}.u-header-actions{display:flex;gap:9px;flex-wrap:wrap}
        .u-btn{border:1px solid #e0e0e0;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 13px;font-size:12px;font-weight:650;white-space:nowrap}.u-btn-primary{background:#191919;color:#fff;border-color:#191919}.u-btn-primary:hover{background:#333}.u-btn-secondary{background:#fff;color:#222}.u-btn-secondary:hover{background:#f6f6f6}.u-btn-danger{color:#b42318;background:#fff;border-color:#f0d5d2}.u-icon-button{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #e5e5e5;background:#fff;border-radius:9px;color:#555;flex-shrink:0}.u-icon-button:hover{background:#f5f5f5;color:#111}
        .u-metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:22px}.u-metric-card{border:1px solid var(--line);border-radius:13px;padding:15px;background:#fff;min-width:0}.u-metric-top{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#686868;font-size:11px;font-weight:650}.u-metric-icon{width:31px;height:31px;border-radius:9px;background:#f4f4f4;display:flex;align-items:center;justify-content:center;color:#333}.u-metric-value{font-size:26px;font-weight:750;letter-spacing:-.8px;margin-top:12px}.u-metric-note{font-size:10px;color:#858585;margin-top:5px}
        .u-badge{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:5px 8px;font-size:10px;font-weight:700;line-height:1.2;white-space:nowrap;border:1px solid transparent}.u-badge-success{background:#edf8f1;color:#18794e;border-color:#d6efdf}.u-badge-danger{background:#fff0ef;color:#b42318;border-color:#f7d9d5}.u-badge-warning{background:#fff6e8;color:#985900;border-color:#f4e1be}.u-badge-info{background:#edf4ff;color:#2356c7;border-color:#dce8ff}.u-badge-neutral{background:#f2f2f2;color:#5d5d5d;border-color:#e7e7e7}
        .u-section{border:1px solid var(--line);border-radius:13px;background:#fff;margin-bottom:20px;overflow:hidden}.u-section-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;padding:17px 18px;border-bottom:1px solid var(--line)}.u-section-heading h2{font-size:14px;font-weight:750;margin:0}.u-section-heading p{font-size:11px;color:var(--muted);margin:5px 0 0}.u-expiry-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;padding:15px}.u-expiry-card{border:1px solid var(--line);border-radius:10px;padding:13px;display:flex;gap:10px;align-items:flex-start;cursor:pointer;text-align:left;background:#fff;color:inherit;min-width:0}.u-expiry-card:hover{border-color:#999;background:#fcfcfc}.u-expiry-avatar,.u-avatar{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:#f0f0f0;color:#222;font-size:11px;font-weight:800;flex-shrink:0}.u-expiry-name{font-size:12px;font-weight:750;overflow-wrap:anywhere}.u-expiry-meta{font-size:10px;color:#777;margin-top:5px;line-height:1.5}.u-expiry-empty{padding:22px;text-align:center;font-size:12px;color:#777}
        .u-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:15px 17px;border-bottom:1px solid var(--line)}.u-search{position:relative;flex:1;min-width:220px;max-width:360px}.u-search svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#888}.u-search input{padding-left:34px}.u-filter-row{display:flex;gap:8px;flex-wrap:wrap}.u-filter-row select{width:auto;min-width:125px;font-size:11px;padding:9px}.u-content-grid{display:grid;grid-template-columns:minmax(0,1fr) 355px;gap:18px;align-items:start}.u-table-wrap{overflow-x:auto}.u-table{width:100%;border-collapse:collapse;text-align:left;white-space:nowrap}.u-table th{font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:#818181;font-weight:750;background:#fafafa;padding:12px 14px;border-bottom:1px solid var(--line)}.u-table td{padding:13px 14px;border-bottom:1px solid #f0f0f0;font-size:11px;vertical-align:middle}.u-table tbody tr{cursor:pointer}.u-table tbody tr:hover{background:#fafafa}.u-table tbody tr.u-row-selected{background:#f4f4f4}.u-user-cell{display:flex;align-items:center;gap:9px;min-width:180px}.u-user-name{font-size:11px;font-weight:750;color:#202020}.u-user-email{font-size:10px;color:#858585;margin-top:4px}.u-table-sub{font-size:10px;color:#858585;margin-top:4px}.u-empty{padding:36px 15px;text-align:center;color:#777;font-size:12px}.u-table-footer{padding:12px 16px;display:flex;justify-content:space-between;gap:12px;align-items:center;color:#777;font-size:11px}.u-small-action{border:0;background:transparent;padding:5px;color:#555;display:inline-flex;align-items:center;justify-content:center}.u-small-action:hover{color:#111;background:#f0f0f0;border-radius:6px}
        .u-profile{border:1px solid var(--line);border-radius:13px;overflow:hidden;background:#fff;position:sticky;top:15px;max-height:calc(100vh - 30px);overflow-y:auto}.u-profile-header{padding:18px;border-bottom:1px solid var(--line)}.u-profile-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.u-profile-person{display:flex;align-items:center;gap:11px;min-width:0}.u-profile-person .u-avatar{width:46px;height:46px;border-radius:13px;font-size:13px}.u-profile-person h2{font-size:15px;letter-spacing:-.3px;margin:0;overflow-wrap:anywhere}.u-profile-person p{font-size:10px;color:#777;margin:5px 0 0;overflow-wrap:anywhere}.u-profile-actions{display:flex;gap:5px}.u-profile-badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}.u-profile-contact{display:grid;gap:9px;margin-top:15px}.u-contact-line{display:flex;align-items:flex-start;gap:8px;font-size:11px;color:#555;overflow-wrap:anywhere}.u-contact-line svg{color:#888;flex-shrink:0}.u-profile-section{padding:15px 17px;border-bottom:1px solid var(--line)}.u-profile-section:last-child{border-bottom:0}.u-profile-section-heading{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:13px}.u-profile-section-heading h3{font-size:12px;font-weight:800;margin:0;display:flex;align-items:center;gap:7px}.u-profile-section-heading button{border:0;background:transparent;color:#777;display:flex;align-items:center}.u-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.u-info-label{font-size:10px;color:#858585;margin-bottom:5px}.u-info-value{font-size:11px;font-weight:700;overflow-wrap:anywhere}.u-screening-score{display:flex;align-items:center;gap:12px;padding:11px;border:1px solid var(--line);border-radius:10px;margin-bottom:12px}.u-score-circle{width:48px;height:48px;border:4px solid #e6e6e6;border-top-color:#191919;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0}.u-screening-score strong{font-size:11px;display:block}.u-screening-score p{font-size:10px;color:#777;margin:5px 0 0}.u-detail-line{margin-top:10px}.u-detail-line strong{font-size:10px;display:block;margin-bottom:4px}.u-detail-line p{font-size:11px;color:#666;margin:0;line-height:1.55;overflow-wrap:anywhere}.u-usage-row{display:flex;justify-content:space-between;gap:12px;margin:12px 0;font-size:11px}.u-usage-track{height:5px;border-radius:99px;background:#eee;overflow:hidden;margin-top:7px}.u-usage-fill{height:100%;background:#222;border-radius:99px}.u-record-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-bottom:13px}.u-record-stat{border:1px solid var(--line);border-radius:9px;padding:9px}.u-record-stat strong{display:block;font-size:19px;letter-spacing:-.5px}.u-record-stat span{display:block;font-size:9px;color:#777;margin-top:4px}.u-record-card{border:1px solid var(--line);border-radius:10px;padding:12px;margin-top:9px}.u-record-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.u-record-company{display:flex;gap:9px;align-items:flex-start;min-width:0}.u-record-company-icon{width:31px;height:31px;display:flex;align-items:center;justify-content:center;background:#f4f4f4;border-radius:8px;flex-shrink:0}.u-record-company h4{font-size:11px;margin:1px 0 0;font-weight:800;overflow-wrap:anywhere}.u-record-company p{font-size:10px;color:#777;margin:5px 0 0;overflow-wrap:anywhere}.u-record-details{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px;padding-top:10px;border-top:1px solid #eee}.u-record-details span{display:block;color:#888;font-size:9px;margin-bottom:4px}.u-record-details strong{font-size:10px;font-weight:700;overflow-wrap:anywhere}.u-record-notes{font-size:10px;color:#666;line-height:1.55;margin:10px 0 0;overflow-wrap:anywhere}.u-record-actions{display:flex;justify-content:flex-end;margin-top:7px}.u-record-form{padding:13px;margin-top:12px;border:1px solid #ddd;border-radius:11px;background:#fafafa}.u-record-form-title{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:13px}.u-record-form-title h4{font-size:12px;margin:0}.u-record-form-title p{font-size:10px;color:#777;margin:5px 0 0}.u-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:13px}.u-form-grid-three{grid-template-columns:repeat(3,minmax(0,1fr))}.u-field{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;min-width:0}.u-field>span{font-size:10px;font-weight:700;color:#555}.u-field input,.u-field select,.u-field textarea{font-size:11px;min-width:0}.u-field textarea{resize:vertical}.u-form-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}.u-profile-empty{padding:22px 15px;text-align:center;color:#777;font-size:11px;border:1px dashed #ddd;border-radius:10px}.u-profile-empty svg{margin-bottom:8px;color:#aaa}.u-inline-select{font-size:10px!important;padding:7px!important}.u-history-item{border-left:2px solid #e5e5e5;padding:1px 0 13px 12px;position:relative}.u-history-item:before{content:"";position:absolute;left:-5px;top:4px;width:8px;height:8px;border-radius:50%;background:#777}.u-history-item p{font-size:10px;margin:0 0 5px;line-height:1.5}.u-history-item span{font-size:9px;color:#888}.u-notification{position:fixed;right:24px;bottom:24px;background:#191919;color:#fff;padding:12px 16px;border-radius:10px;font-size:12px;box-shadow:0 8px 30px #0002;z-index:10000;display:flex;align-items:center;gap:8px}
        .u-modal-backdrop{position:fixed;inset:0;background:#0007;display:flex;align-items:center;justify-content:center;padding:20px;z-index:9999}.u-modal{width:min(760px,100%);max-height:90vh;overflow-y:auto;background:#fff;border-radius:15px;box-shadow:0 24px 80px #0003}.u-modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;padding:22px;border-bottom:1px solid var(--line)}.u-modal-header h2{font-size:21px;letter-spacing:-.6px;margin:0}.u-modal-header p:not(.u-eyebrow){font-size:11px;color:#777;margin:6px 0 0}.u-modal-body{padding:20px 22px}.u-form-section-title{font-size:12px;margin:7px 0 14px;font-weight:800}.u-modal-body .u-form-section-title:not(:first-child){border-top:1px solid var(--line);padding-top:18px}.u-modal-footer{padding:15px 22px;border-top:1px solid var(--line);display:flex;justify-content:flex-end;gap:8px;background:#fcfcfc}
        @media(max-width:1400px){.u-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}.u-content-grid{grid-template-columns:minmax(0,1fr) 330px}.u-expiry-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:1050px){.u-content-grid{grid-template-columns:1fr}.u-profile{position:static;max-height:none}.u-table-wrap{max-width:100%}.u-expiry-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:650px){.u-page{padding:15px}.u-page-header{flex-direction:column}.u-page-header h1{font-size:24px}.u-header-actions{width:100%}.u-header-actions .u-btn{flex:1}.u-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.u-metric-card{padding:12px}.u-metric-value{font-size:23px}.u-expiry-grid{grid-template-columns:1fr;padding:10px}.u-toolbar{align-items:stretch}.u-search{max-width:none}.u-filter-row{display:grid;grid-template-columns:1fr 1fr}.u-filter-row select{width:100%;min-width:0}.u-section-heading{padding:14px}.u-form-grid,.u-form-grid-three{grid-template-columns:1fr}.u-modal-backdrop{padding:8px}.u-modal-header,.u-modal-body{padding:16px}.u-modal-footer{padding:12px 16px}.u-record-summary{grid-template-columns:repeat(3,minmax(0,1fr))}.u-table-footer{align-items:flex-start;flex-direction:column}}
      `}</style>

      <div className="u-page-header">
        <div>
          <p className="u-eyebrow">ADMINISTRATION / USERS</p>
          <h1>Users</h1>
          <p>Manage accounts, subscriptions, company interviews and assessments.</p>
        </div>
        <div className="u-header-actions">
          <button className="u-btn u-btn-export" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
          <button className="u-btn u-btn-user" onClick={openAdd}>
            <Plus size={16} /> Add user
          </button>
        </div>
      </div>

      <div className="u-demo-notice" role="status">
        <AlertCircle size={16} />
        <span>
          Demo user records only. Updates made here are temporary and are not
          saved to a live account service.
        </span>
      </div>

      <div className="u-metrics">
        <MetricCard icon={UsersIcon} label="Total users" value={metrics.total} note="All registered accounts" />
        <MetricCard icon={CircleDollarSign} label="Premium users" value={metrics.premium} note="Active Premium accounts" />
        <MetricCard icon={ClipboardCheck} label="Screened users" value={metrics.screened} note="Completed or passed screening" />
        <MetricCard icon={BriefcaseBusiness} label="Interviews completed" value={metrics.interviews} note="Company interviews marked completed" />
        <MetricCard icon={Trophy} label="Assessments passed" value={metrics.assessmentsPassed} note="Across all company assessments" />
        <MetricCard icon={Clock3} label="Plans expiring" value={metrics.expiring} note="Expired or expiring within 30 days" />
      </div>

      <section className="u-section">
        <div className="u-section-heading">
          <div>
            <h2><Clock3 size={15} style={{ verticalAlign: "middle", marginRight: 6 }} /> Subscription expiry tracker</h2>
            <p>Review plans that have expired or will expire in the next 30 days.</p>
          </div>
          <StatusBadge type={expiringUsers.length ? "warning" : "success"}>
            {expiringUsers.length} requiring attention
          </StatusBadge>
        </div>
        {expiringUsers.length ? (
          <div className="u-expiry-grid">
            {expiringUsers.map((user) => {
              const expiry = getExpiryInfo(user);
              return (
                <button
                  key={user.id}
                  className="u-expiry-card"
                  onClick={() => {
                    setSelectedId(user.id);
                    setShowInterviewForm(false);
                    setShowAssessmentForm(false);
                  }}
                >
                  <div className="u-expiry-avatar">{getInitials(user.name)}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="u-expiry-name">{user.name}</div>
                    <div className="u-expiry-meta">{user.plan} plan · Expires {formatDate(user.planExpires)}</div>
                    <div style={{ marginTop: 8 }}><StatusBadge type={expiry.type}>{expiry.label}</StatusBadge></div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="u-expiry-empty"><CheckCircle2 size={17} style={{ verticalAlign: "middle", marginRight: 5 }} /> No subscriptions need attention in the next 30 days.</div>
        )}
      </section>

      <section className="u-section">
        <div className="u-section-heading">
          <div>
            <h2>All users</h2>
            <p>Search and manage users, then select a profile to view their company-wise activity.</p>
          </div>
          <span style={{ fontSize: 11, color: "#777" }}>{filteredUsers.length} results</span>
        </div>

        <div className="u-toolbar">
          <div className="u-search">
            <Search size={15} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, mobile..." />
          </div>
          <div className="u-filter-row">
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} aria-label="Filter by plan">
              <option value="All">All plans</option>
              {PLANS.map((plan) => <option key={plan}>{plan}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
              <option value="All">All statuses</option>
              {STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} aria-label="Filter by area">
              <option value="All">All areas</option>
              {AREAS.map((area) => <option key={area}>{area}</option>)}
            </select>
          </div>
        </div>

        <div className="u-content-grid">
          <div className="u-table-wrap">
            <table className="u-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Account</th>
                  <th>Interviews</th>
                  <th>Assessments</th>
                  <th>Plan expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const expiry = getExpiryInfo(user);
                  const interviewCount = (user.interviewsAttended || []).length;
                  const assessmentCount = (user.assessmentRecords || []).length;

                  return (
                    <tr key={user.id} className={selectedId === user.id ? "u-row-selected" : ""} onClick={() => {
                      setSelectedId(user.id);
                      setShowInterviewForm(false);
                      setShowAssessmentForm(false);
                    }}>
                      <td>
                        <div className="u-user-cell">
                          <div className="u-avatar">{getInitials(user.name)}</div>
                          <div>
                            <div className="u-user-name">{user.name}</div>
                            <div className="u-user-email">{user.email}</div>
                            <div className="u-table-sub">{user.area}</div>
                          </div>
                        </div>
                      </td>
                      <td><StatusBadge type={user.plan === "Premium" ? "success" : user.plan === "Basic" ? "info" : "neutral"}>{user.plan}</StatusBadge></td>
                      <td><StatusBadge type={user.status === "Active" ? "success" : user.status === "Past due" ? "warning" : "neutral"}>{user.status}</StatusBadge></td>
                      <td>
                        <strong>{interviewCount}</strong>
                        <div className="u-table-sub">{interviewCount === 1 ? "company record" : "company records"}</div>
                      </td>
                      <td>
                        <strong>{assessmentCount}</strong>
                        <div className="u-table-sub">{assessmentStatusForUser(user)}</div>
                      </td>
                      <td>
                        <div>{formatDate(user.planExpires)}</div>
                        <div style={{ marginTop: 5 }}><StatusBadge type={expiry.type}>{expiry.label}</StatusBadge></div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 3 }}>
                          <button className="u-small-action" title="View profile" onClick={() => setSelectedId(user.id)}><Eye size={15} /></button>
                          <button className="u-small-action" title="Edit user" onClick={() => openEdit(user)}><Pencil size={15} /></button>
                          <button className="u-small-action" title="Delete user" onClick={() => deleteUser(user)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredUsers.length && (
                  <tr><td colSpan="7"><div className="u-empty">No users match your filters. Try changing your search.</div></td></tr>
                )}
              </tbody>
            </table>
            <div className="u-table-footer">
              <span>Showing {filteredUsers.length} of {users.length} users</span>
              <span>Company records are available in each profile</span>
            </div>
          </div>

          <aside className="u-profile">
            {selectedUser ? (
              <>
                <div className="u-profile-header">
                  <div className="u-profile-top">
                    <div className="u-profile-person">
                      <div className="u-avatar">{getInitials(selectedUser.name)}</div>
                      <div>
                        <h2>{selectedUser.name}</h2>
                        <p>User ID: USR-{String(selectedUser.id).padStart(5, "0")}</p>
                      </div>
                    </div>
                    <div className="u-profile-actions">
                      <button className="u-icon-button" title="Edit user" onClick={() => openEdit(selectedUser)}><Pencil size={15} /></button>
                      <button className="u-icon-button" title="Delete user" onClick={() => deleteUser(selectedUser)}><Trash2 size={15} /></button>
                    </div>
                  </div>

                  <div className="u-profile-badges">
                    <StatusBadge type={selectedUser.status === "Active" ? "success" : "neutral"}>{selectedUser.status}</StatusBadge>
                    <StatusBadge type={selectedUser.plan === "Premium" ? "success" : selectedUser.plan === "Basic" ? "info" : "neutral"}>{selectedUser.plan} plan</StatusBadge>
                    <StatusBadge type={getExpiryInfo(selectedUser).type}>{getExpiryInfo(selectedUser).label}</StatusBadge>
                  </div>

                  <div className="u-profile-contact">
                    <div className="u-contact-line"><Mail size={14} /> {selectedUser.email || "No email provided"}</div>
                    <div className="u-contact-line"><Phone size={14} /> {selectedUser.mobile || "No mobile provided"}</div>
                    <div className="u-contact-line"><MapPin size={14} /> {selectedUser.area}</div>
                    <div className="u-contact-line"><CalendarDays size={14} /> Joined {formatDate(selectedUser.joined)}</div>
                  </div>
                </div>

                <div className="u-profile-section">
                  <div className="u-profile-section-heading">
                    <h3><UserRound size={15} /> Account overview</h3>
                  </div>
                  <div className="u-info-grid">
                    <div><div className="u-info-label">Subscription</div><div className="u-info-value">{selectedUser.plan}</div></div>
                    <div><div className="u-info-label">Plan expiry</div><div className="u-info-value">{formatDate(selectedUser.planExpires)}</div></div>
                    <div><div className="u-info-label">Assigned recruiter</div><div className="u-info-value">{selectedUser.recruiter}</div></div>
                    <div><div className="u-info-label">Joined date</div><div className="u-info-value">{formatDate(selectedUser.joined)}</div></div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <Field label="Reassign recruiter">
                      <select
                        className="u-inline-select"
                        value={selectedUser.recruiter || "Unassigned"}
                        onChange={(e) => changeRecruiter(selectedUser, e.target.value)}
                      >
                        {RECRUITERS.map((recruiter) => <option key={recruiter}>{recruiter}</option>)}
                      </select>
                    </Field>
                  </div>
                  {selectedUser.notes && (
                    <div className="u-detail-line"><strong>Admin notes</strong><p>{selectedUser.notes}</p></div>
                  )}
                </div>

                <div className="u-profile-section">
                  <div className="u-profile-section-heading">
                    <h3><ClipboardCheck size={15} /> Screening details</h3>
                    <button onClick={() => setShowScreening((prev) => !prev)}>{showScreening ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                  </div>
                  {showScreening && (
                    <>
                      <div className="u-screening-score">
                        <div className="u-score-circle">{Number(selectedUser.screening?.score || 0)}%</div>
                        <div>
                          <strong>Screening score</strong>
                          <p><RecordStatus status={selectedUser.screening?.status} /></p>
                        </div>
                      </div>
                      {[
                        ["Strengths", selectedUser.screening?.strengths],
                        ["Areas to improve", selectedUser.screening?.improvements],
                        ["Missing skills", selectedUser.screening?.missingSkills]
                      ].map(([label, value]) => (
                        <div className="u-detail-line" key={label}>
                          <strong>{label}</strong>
                          <p>{value || "No details added yet."}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="u-profile-section">
                  <div className="u-profile-section-heading">
                    <h3><BriefcaseBusiness size={15} /> Company interview history</h3>
                    <button onClick={() => setShowInterviewForm((prev) => !prev)} title="Add interview"><Plus size={16} /></button>
                  </div>
                  <div className="u-record-summary">
                    <div className="u-record-stat"><strong>{(selectedUser.interviewsAttended || []).length}</strong><span>Companies</span></div>
                    <div className="u-record-stat"><strong>{(selectedUser.interviewsAttended || []).reduce((sum, record) => sum + Number(record.roundsAttended || 0), 0)}</strong><span>Rounds attended</span></div>
                    <div className="u-record-stat"><strong>{(selectedUser.interviewsAttended || []).filter((record) => record.result === "Selected").length}</strong><span>Selected</span></div>
                  </div>

                  {showInterviewForm && (
                    <InterviewForm
                      onAdd={(record) => addInterview(selectedUser.id, record)}
                      onCancel={() => setShowInterviewForm(false)}
                    />
                  )}

                  {(selectedUser.interviewsAttended || []).length ? (
                    [...selectedUser.interviewsAttended]
                      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
                      .map((record) => (
                        <div className="u-record-card" key={record.id}>
                          <div className="u-record-card-top">
                            <div className="u-record-company">
                              <div className="u-record-company-icon"><Building2 size={16} /></div>
                              <div>
                                <h4>{record.company}</h4>
                                <p>{record.role}</p>
                              </div>
                            </div>
                            <button className="u-small-action" title="Delete interview record" onClick={() => removeRecord(selectedUser.id, "interviewsAttended", record.id, "interview")}><Trash2 size={14} /></button>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                            <RecordStatus status={record.status} />
                            <RecordStatus status={record.result} />
                          </div>
                          <div className="u-record-details">
                            <div><span>Interview date</span><strong>{formatDate(record.date)}</strong></div>
                            <div><span>Rounds attended</span><strong>{record.roundsAttended} of {record.totalRounds}</strong></div>
                            <div><span>Location</span><strong>{record.location || "Not specified"}</strong></div>
                            <div><span>Progress</span><strong>{record.totalRounds ? Math.round((Number(record.roundsAttended || 0) / Number(record.totalRounds || 1)) * 100) : 0}%</strong></div>
                          </div>
                          {record.notes && <p className="u-record-notes">{record.notes}</p>}
                        </div>
                      ))
                  ) : (
                    <div className="u-profile-empty">
                      <BriefcaseBusiness size={19} />
                      <div>No company interviews recorded.</div>
                      <p style={{ margin: "5px 0 0" }}>Add a company interview to track rounds and results.</p>
                    </div>
                  )}
                </div>

                <div className="u-profile-section">
                  <div className="u-profile-section-heading">
                    <h3><GraduationCap size={16} /> Company assessments</h3>
                    <button onClick={() => setShowAssessmentForm((prev) => !prev)} title="Add assessment"><Plus size={16} /></button>
                  </div>
                  <div className="u-record-summary">
                    <div className="u-record-stat"><strong>{(selectedUser.assessmentRecords || []).length}</strong><span>Total tests</span></div>
                    <div className="u-record-stat"><strong>{(selectedUser.assessmentRecords || []).filter((record) => record.status === "Passed").length}</strong><span>Passed</span></div>
                    <div className="u-record-stat"><strong>{(selectedUser.assessmentRecords || []).filter((record) => record.status === "Failed" || record.status === "Needs Retake").length}</strong><span>Needs action</span></div>
                  </div>

                  {showAssessmentForm && (
                    <AssessmentForm
                      onAdd={(record) => addAssessment(selectedUser.id, record)}
                      onCancel={() => setShowAssessmentForm(false)}
                    />
                  )}

                  {(selectedUser.assessmentRecords || []).length ? (
                    [...selectedUser.assessmentRecords]
                      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
                      .map((record) => (
                        <div className="u-record-card" key={record.id}>
                          <div className="u-record-card-top">
                            <div className="u-record-company">
                              <div className="u-record-company-icon"><FileCheck2 size={16} /></div>
                              <div>
                                <h4>{record.company}</h4>
                                <p>{record.name}</p>
                              </div>
                            </div>
                            <button className="u-small-action" title="Delete assessment record" onClick={() => removeRecord(selectedUser.id, "assessmentRecords", record.id, "assessment")}><Trash2 size={14} /></button>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                            <RecordStatus status={record.status} />
                            {record.score !== null && record.score !== "" && (
                              <StatusBadge type="neutral">Score: {record.score}/{record.maxScore || 100}</StatusBadge>
                            )}
                          </div>
                          <div className="u-record-details">
                            <div><span>Assessment date</span><strong>{formatDate(record.date)}</strong></div>
                            <div><span>Score percentage</span><strong>{record.score === null || record.score === "" ? "Not graded" : `${Math.round((Number(record.score) / Number(record.maxScore || 100)) * 100)}%`}</strong></div>
                          </div>
                          {record.notes && <p className="u-record-notes">{record.notes}</p>}
                        </div>
                      ))
                  ) : (
                    <div className="u-profile-empty">
                      <FileCheck2 size={19} />
                      <div>No company assessments recorded.</div>
                      <p style={{ margin: "5px 0 0" }}>Add assessments to track scores and results.</p>
                    </div>
                  )}
                </div>

                <div className="u-profile-section">
                  <div className="u-profile-section-heading">
                    <h3><Brain size={15} /> AI usage</h3>
                    <button onClick={() => setShowAI((prev) => !prev)}>{showAI ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                  </div>
                  {showAI && (
                    <>
                      {[
                        ["Resume tools", selectedUser.aiFeatures?.resume || 0],
                        ["Interview practice", selectedUser.aiFeatures?.interview || 0],
                        ["Assessment tools", selectedUser.aiFeatures?.assessment || 0]
                      ].map(([label, value]) => (
                        <div key={label} className="u-usage-row">
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                              <span>{label}</span><strong>{value}</strong>
                            </div>
                            <div className="u-usage-track"><div className="u-usage-fill" style={{ width: `${Math.min(100, Number(value) * 5)}%` }} /></div>
                          </div>
                        </div>
                      ))}
                      <div className="u-detail-line"><strong>Total AI actions</strong><p>{getAiTotal(selectedUser)} actions recorded</p></div>
                    </>
                  )}
                </div>

                <div className="u-profile-section">
                  <div className="u-profile-section-heading">
                    <h3><History size={15} /> Recruiter history</h3>
                    <button onClick={() => setShowRecruiterHistory((prev) => !prev)}>{showRecruiterHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                  </div>
                  {showRecruiterHistory && (
                    (selectedUser.recruiterHistory || []).length ? (
                      selectedUser.recruiterHistory.map((item, index) => (
                        <div className="u-history-item" key={`${item.date}-${index}`}>
                          <p><strong>{item.from}</strong> → <strong>{item.to}</strong></p>
                          <p>{item.reason}</p>
                          <span>{new Date(item.date).toLocaleString("en-IN")}</span>
                        </div>
                      ))
                    ) : <div className="u-profile-empty">No recruiter changes recorded.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="u-profile-empty" style={{ margin: 15 }}>
                <UserCheck size={22} />
                <div>Select a user</div>
                <p style={{ margin: "5px 0 0" }}>Choose a row to view the user's details.</p>
              </div>
            )}
          </aside>
        </div>
      </section>

      {modalOpen && formUser && (
        <UserModal
          user={formUser}
          isEdit={modalMode === "edit"}
          onClose={() => setModalOpen(false)}
          onSave={saveUser}
        />
      )}

      {notification && <div className="u-notification"><CheckCircle2 size={16} /> {notification}</div>}
    </div>
  );
}