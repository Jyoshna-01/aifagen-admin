
import { useMemo, useState } from "react";
import {
  Users,
  Building2,
  BriefcaseBusiness,
  UserCheck,
  ArrowLeftRight,
  TrendingUp,
  Search,
  Plus,
  Download,
  X,
  ChevronRight,
  CalendarDays,
  Mail,
  MapPin,
  CheckCircle2,
  Clock3,
  CircleAlert,
  Eye,
  Edit3,
  UserPlus,
  FileText,
  Target,
  Activity,
} from "lucide-react";
import "./Hr.css";
import useAssistantContext from "../hooks/useAssistantContext";

const initialRecruiters = [
  {
    id: 1,
    name: "Sarah Mitchell",
    email: "sarah.mitchell@aifagen.com",
    phone: "+1 201-555-0134",
    status: "Active",
    specialization: "Software Engineering",
    joined: "Jan 12, 2026",
  },
  {
    id: 2,
    name: "Daniel Brooks",
    email: "daniel.brooks@aifagen.com",
    phone: "+1 201-555-0172",
    status: "Active",
    specialization: "Data & Analytics",
    joined: "Feb 03, 2026",
  },
  {
    id: 3,
    name: "Olivia Parker",
    email: "olivia.parker@aifagen.com",
    phone: "+1 201-555-0196",
    status: "Active",
    specialization: "Cloud & DevOps",
    joined: "Mar 18, 2026",
  },
  {
    id: 4,
    name: "Ethan Reed",
    email: "ethan.reed@aifagen.com",
    phone: "+1 201-555-0128",
    status: "On Leave",
    specialization: "Quality Engineering",
    joined: "Apr 06, 2026",
  },
];

const initialClients = [
  {
    id: 101,
    name: "Northstar Technologies",
    contact: "Jessica Moore",
    email: "jessica@northstar.example",
    industry: "Technology",
    location: "New York, NY",
    recruiterId: 1,
    status: "Active",
    assignedDate: "Sep 02, 2026",
    openings: 5,
  },
  {
    id: 102,
    name: "BluePeak Solutions",
    contact: "Robert Allen",
    email: "robert@bluepeak.example",
    industry: "IT Services",
    location: "Austin, TX",
    recruiterId: 2,
    status: "Active",
    assignedDate: "Sep 05, 2026",
    openings: 3,
  },
  {
    id: 103,
    name: "Vertex Cloud Group",
    contact: "Amanda Scott",
    email: "amanda@vertexcloud.example",
    industry: "Cloud Computing",
    location: "Seattle, WA",
    recruiterId: 3,
    status: "Active",
    assignedDate: "Sep 08, 2026",
    openings: 4,
  },
  {
    id: 104,
    name: "Summit Data Partners",
    contact: "Christopher Lee",
    email: "chris@summitdata.example",
    industry: "Data & Analytics",
    location: "Chicago, IL",
    recruiterId: 2,
    status: "Active",
    assignedDate: "Sep 12, 2026",
    openings: 2,
  },
  {
    id: 105,
    name: "BrightPath Digital",
    contact: "Lauren Adams",
    email: "lauren@brightpath.example",
    industry: "Digital Services",
    location: "Boston, MA",
    recruiterId: 1,
    status: "Active",
    assignedDate: "Sep 16, 2026",
    openings: 3,
  },
  {
    id: 106,
    name: "Evergreen Systems",
    contact: "Matthew Turner",
    email: "matthew@evergreen.example",
    industry: "Enterprise Software",
    location: "Denver, CO",
    recruiterId: 3,
    status: "On Hold",
    assignedDate: "Sep 19, 2026",
    openings: 0,
  },
];

const initialJobs = [
  {
    id: 201,
    title: "Senior Software Engineer",
    company: "Northstar Technologies",
    recruiterId: 1,
    openings: 2,
    status: "Open",
  },
  {
    id: 202,
    title: "Full Stack Developer",
    company: "BrightPath Digital",
    recruiterId: 1,
    openings: 1,
    status: "Interviewing",
  },
  {
    id: 203,
    title: "Data Analyst",
    company: "BluePeak Solutions",
    recruiterId: 2,
    openings: 2,
    status: "Open",
  },
  {
    id: 204,
    title: "Cloud Engineer",
    company: "Vertex Cloud Group",
    recruiterId: 3,
    openings: 2,
    status: "Open",
  },
  {
    id: 205,
    title: "DevOps Engineer",
    company: "Vertex Cloud Group",
    recruiterId: 3,
    openings: 2,
    status: "Interviewing",
  },
  {
    id: 206,
    title: "QA Automation Engineer",
    company: "Summit Data Partners",
    recruiterId: 2,
    openings: 1,
    status: "On Hold",
  },
];

const initialCandidates = [
  {
    id: 301,
    name: "Alex Morgan",
    role: "Senior Software Engineer",
    company: "Northstar Technologies",
    recruiterId: 1,
    stage: "Interview",
    updated: "Oct 12, 2026",
  },
  {
    id: 302,
    name: "Taylor Bennett",
    role: "Full Stack Developer",
    company: "BrightPath Digital",
    recruiterId: 1,
    stage: "Screening",
    updated: "Oct 11, 2026",
  },
  {
    id: 303,
    name: "Jordan Davis",
    role: "Data Analyst",
    company: "BluePeak Solutions",
    recruiterId: 2,
    stage: "Offer",
    updated: "Oct 10, 2026",
  },
  {
    id: 304,
    name: "Casey Wilson",
    role: "Cloud Engineer",
    company: "Vertex Cloud Group",
    recruiterId: 3,
    stage: "Interview",
    updated: "Oct 09, 2026",
  },
  {
    id: 305,
    name: "Riley Thompson",
    role: "DevOps Engineer",
    company: "Vertex Cloud Group",
    recruiterId: 3,
    stage: "Screening",
    updated: "Oct 08, 2026",
  },
];

const initialTransfers = [
  {
    id: 401,
    clientId: 104,
    clientName: "Summit Data Partners",
    fromId: 1,
    toId: 2,
    date: "Oct 03, 2026",
    reason: "Domain specialization and workload balancing",
    status: "Completed",
  },
  {
    id: 402,
    clientId: 106,
    clientName: "Evergreen Systems",
    fromId: 2,
    toId: 3,
    date: "Oct 06, 2026",
    reason: "Cloud hiring expertise required",
    status: "Completed",
  },
];

const initialPlacements = [
  {
    id: 501,
    candidate: "Morgan Taylor",
    role: "Software Engineer",
    company: "Northstar Technologies",
    recruiterId: 1,
    date: "Oct 02, 2026",
    status: "Joined",
    fee: 12500,
  },
  {
    id: 502,
    candidate: "Avery Brooks",
    role: "Data Analyst",
    company: "BluePeak Solutions",
    recruiterId: 2,
    date: "Sep 26, 2026",
    status: "Joined",
    fee: 9800,
  },
  {
    id: 503,
    candidate: "Cameron Price",
    role: "Cloud Engineer",
    company: "Vertex Cloud Group",
    recruiterId: 3,
    date: "Sep 18, 2026",
    status: "Joined",
    fee: 14000,
  },
];

const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "recruiters", label: "Recruiters", icon: Users },
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "transfers", label: "Transfers", icon: ArrowLeftRight },
  { id: "jobs", label: "Job openings", icon: BriefcaseBusiness },
  { id: "candidates", label: "Candidates", icon: UserCheck },
  { id: "placements", label: "Placements", icon: Target },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function getRecruiterName(recruiters, id) {
  return recruiters.find((recruiter) => recruiter.id === Number(id))?.name ||
    "Unassigned";
}

function getStatusClass(status) {
  const normalized = status.toLowerCase().replace(/\s+/g, "-");

  if (["active", "joined", "completed", "open"].includes(normalized)) {
    return "hr-status-green";
  }

  if (["interview", "interviewing", "offer"].includes(normalized)) {
    return "hr-status-blue";
  }

  if (["on-hold", "on-leave", "screening"].includes(normalized)) {
    return "hr-status-orange";
  }

  if (["inactive", "cancelled", "rejected"].includes(normalized)) {
    return "hr-status-red";
  }

  return "hr-status-neutral";
}

function StatusBadge({ status }) {
  return (
    <span className={`hr-status ${getStatusClass(status)}`}>
      <span />
      {status}
    </span>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="hr-empty">
      <FileText size={25} />
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}

function Modal({ title, description, onClose, children }) {
  return (
    <div className="hr-modal-backdrop" onClick={onClose}>
      <section
        className="hr-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="hr-modal-header">
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <button
            type="button"
            className="hr-icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default function Hr({ onAssistantContext }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [recruiters, setRecruiters] = useState(initialRecruiters);
  const [clients, setClients] = useState(initialClients);
  const [jobs] = useState(initialJobs);
  const [candidates] = useState(initialCandidates);
  const [transfers, setTransfers] = useState(initialTransfers);
  const [placements, setPlacements] = useState(initialPlacements);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [modal, setModal] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [notice, setNotice] = useState("");

  const [recruiterForm, setRecruiterForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "Software Engineering",
    status: "Active",
  });

  const [clientForm, setClientForm] = useState({
    name: "",
    contact: "",
    email: "",
    industry: "Technology",
    location: "",
    recruiterId: "",
    openings: "1",
  });

  const [transferForm, setTransferForm] = useState({
    clientId: "",
    toId: "",
    reason: "",
  });

  const [placementForm, setPlacementForm] = useState({
    candidate: "",
    role: "",
    company: "",
    recruiterId: "",
    date: "2026-10-12",
    status: "Joined",
    fee: "",
  });

  const activeClients = clients.filter((client) => client.status === "Active");
  const openJobs = jobs.filter((job) =>
    ["Open", "Interviewing"].includes(job.status)
  );
  const placedCount = placements.filter(
    (placement) => placement.status === "Joined"
  ).length;

  const totalOpenings = jobs.reduce(
    (sum, job) => sum + Number(job.openings || 0),
    0
  );

  const placementRevenue = placements
    .filter((placement) => placement.status === "Joined")
    .reduce((sum, placement) => sum + Number(placement.fee || 0), 0);

  const getRecruiterStats = (recruiterId) => {
    const assignedClients = clients.filter(
      (client) => client.recruiterId === recruiterId
    );
    const assignedJobs = jobs.filter((job) => job.recruiterId === recruiterId);
    const assignedCandidates = candidates.filter(
      (candidate) => candidate.recruiterId === recruiterId
    );
    const recruiterPlacements = placements.filter(
      (placement) => placement.recruiterId === recruiterId
    );

    return {
      clients: assignedClients.length,
      jobs: assignedJobs.length,
      candidates: assignedCandidates.length,
      placements: recruiterPlacements.filter(
        (placement) => placement.status === "Joined"
      ).length,
      activeClients: assignedClients.filter(
        (client) => client.status === "Active"
      ).length,
    };
  };

  const filteredRecruiters = useMemo(() => {
    const term = search.toLowerCase().trim();

    return recruiters.filter((recruiter) => {
      const matchesSearch =
        !term ||
        [recruiter.name, recruiter.email, recruiter.specialization].some(
          (value) => value.toLowerCase().includes(term)
        );

      const matchesStatus =
        statusFilter === "All statuses" ||
        recruiter.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [recruiters, search, statusFilter]);

  const filteredClients = useMemo(() => {
    const term = search.toLowerCase().trim();

    return clients.filter((client) => {
      const matchesSearch =
        !term ||
        [
          client.name,
          client.contact,
          client.email,
          client.industry,
          client.location,
          getRecruiterName(recruiters, client.recruiterId),
        ].some((value) => value.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All statuses" || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, recruiters, search, statusFilter]);

  const filteredTransfers = useMemo(() => {
    const term = search.toLowerCase().trim();

    return transfers.filter((transfer) => {
      const matchesSearch =
        !term ||
        [
          transfer.clientName,
          transfer.reason,
          getRecruiterName(recruiters, transfer.fromId),
          getRecruiterName(recruiters, transfer.toId),
        ].some((value) => value.toLowerCase().includes(term));

      return (
        matchesSearch &&
        (statusFilter === "All statuses" || transfer.status === statusFilter)
      );
    });
  }, [transfers, recruiters, search, statusFilter]);

  const filteredPlacements = useMemo(() => {
    const term = search.toLowerCase().trim();

    return placements.filter((placement) => {
      const matchesSearch =
        !term ||
        [
          placement.candidate,
          placement.role,
          placement.company,
          getRecruiterName(recruiters, placement.recruiterId),
        ].some((value) => value.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All statuses" || placement.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [placements, recruiters, search, statusFilter]);

  const filteredJobs = jobs.filter((job) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      [
        job.title,
        job.company,
        getRecruiterName(recruiters, job.recruiterId),
      ].some((value) => value.toLowerCase().includes(term));

    return (
      matchesSearch &&
      (statusFilter === "All statuses" || job.status === statusFilter)
    );
  });

  const filteredCandidates = candidates.filter((candidate) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      [
        candidate.name,
        candidate.role,
        candidate.company,
        getRecruiterName(recruiters, candidate.recruiterId),
      ].some((value) => value.toLowerCase().includes(term));

    return (
      matchesSearch &&
      (statusFilter === "All statuses" || candidate.stage === statusFilter)
    );
  });
  useAssistantContext(onAssistantContext, "HR", {
    recruiters: recruiters.length,
    clients: clients.length,
    candidates: candidates.length,
    pipeline: candidates.filter((candidate) => !["Placed", "Rejected"].includes(candidate.stage)).length,
    interviews: candidates.filter((candidate) => candidate.stage === "Interview").length,
    placements: placedCount,
    openings: totalOpenings,
    unassigned: candidates.filter((candidate) => !candidate.recruiterId || !candidate.clientId).length,
    pending: candidates.filter((candidate) => ["Screening", "Interviewing", "Interview"].includes(candidate.stage)).length,
    pipelineStages: candidates.reduce((counts, candidate) => {
      counts[candidate.stage] = (counts[candidate.stage] || 0) + 1;
      return counts;
    }, {}),
    filters: `tab ${activeTab}; status ${statusFilter}${search ? "; search active" : ""}`,
  });

  const resetSearch = () => {
    setSearch("");
    setStatusFilter("All statuses");
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const addRecruiter = (event) => {
    event.preventDefault();

    if (
      recruiters.some(
        (recruiter) =>
          recruiter.email.toLowerCase() === recruiterForm.email.toLowerCase()
      )
    ) {
      showNotice("A recruiter with that email already exists.");
      return;
    }

    const newRecruiter = {
      ...recruiterForm,
      id: Date.now(),
      joined: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setRecruiters((previous) => [...previous, newRecruiter]);
    setRecruiterForm({
      name: "",
      email: "",
      phone: "",
      specialization: "Software Engineering",
      status: "Active",
    });
    setModal("");
    showNotice("Recruiter added successfully.");
  };

  const addClient = (event) => {
    event.preventDefault();

    if (
      clients.some(
        (client) => client.name.toLowerCase() === clientForm.name.toLowerCase()
      )
    ) {
      showNotice("A client with that name already exists.");
      return;
    }

    const recruiterId = clientForm.recruiterId
      ? Number(clientForm.recruiterId)
      : null;

    const newClient = {
      ...clientForm,
      id: Date.now(),
      recruiterId,
      openings: Math.max(0, Number(clientForm.openings) || 0),
      status: "Active",
      assignedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setClients((previous) => [...previous, newClient]);

    if (recruiterId) {
      setTransfers((previous) => [
        {
          id: Date.now() + 1,
          clientId: newClient.id,
          clientName: newClient.name,
          fromId: null,
          toId: recruiterId,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          reason: "Initial client assignment",
          status: "Completed",
        },
        ...previous,
      ]);
    }

    setClientForm({
      name: "",
      contact: "",
      email: "",
      industry: "Technology",
      location: "",
      recruiterId: "",
      openings: "1",
    });
    setModal("");
    showNotice("Client added successfully.");
  };

  const transferClient = (event) => {
    event.preventDefault();

    const client = clients.find(
      (item) => item.id === Number(transferForm.clientId)
    );

    const newRecruiterId = Number(transferForm.toId);

    if (!client || !newRecruiterId) {
      showNotice("Select a client and a destination recruiter.");
      return;
    }

    if (client.recruiterId === newRecruiterId) {
      showNotice("This client is already assigned to that recruiter.");
      return;
    }

    const oldRecruiterId = client.recruiterId;

    setClients((previous) =>
      previous.map((item) =>
        item.id === client.id
          ? {
              ...item,
              recruiterId: newRecruiterId,
              assignedDate: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
            }
          : item
      )
    );

    setTransfers((previous) => [
      {
        id: Date.now(),
        clientId: client.id,
        clientName: client.name,
        fromId: oldRecruiterId,
        toId: newRecruiterId,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        reason: transferForm.reason.trim(),
        status: "Completed",
      },
      ...previous,
    ]);

    setTransferForm({ clientId: "", toId: "", reason: "" });
    setModal("");
    showNotice("Client transfer recorded successfully.");
  };

  const addPlacement = (event) => {
    event.preventDefault();

    if (
      !placementForm.candidate.trim() ||
      !placementForm.role.trim() ||
      !placementForm.company.trim() ||
      !placementForm.recruiterId
    ) {
      showNotice("Complete all required placement fields.");
      return;
    }

    const newPlacement = {
      ...placementForm,
      id: Date.now(),
      recruiterId: Number(placementForm.recruiterId),
      date: new Date(`${placementForm.date}T12:00:00`).toLocaleDateString(
        "en-US",
        { month: "short", day: "2-digit", year: "numeric" }
      ),
      fee: Math.max(0, Number(placementForm.fee) || 0),
    };

    setPlacements((previous) => [newPlacement, ...previous]);
    setPlacementForm({
      candidate: "",
      role: "",
      company: "",
      recruiterId: "",
      date: "2026-10-12",
      status: "Joined",
      fee: "",
    });
    setModal("");
    showNotice("Placement recorded successfully.");
  };

  const exportCSV = (rows, filename, columns) => {
    const csvRows = [
      columns.map((column) => column.label),
      ...rows.map((row) =>
        columns.map((column) => column.value(row))
      ),
    ];

    const csv = csvRows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportRecruiters = () =>
    exportCSV(
      filteredRecruiters,
      "aifagen-recruiters.csv",
      [
        { label: "Name", value: (row) => row.name },
        { label: "Email", value: (row) => row.email },
        { label: "Phone", value: (row) => row.phone },
        { label: "Specialization", value: (row) => row.specialization },
        { label: "Status", value: (row) => row.status },
        {
          label: "Assigned clients",
          value: (row) => getRecruiterStats(row.id).clients,
        },
        {
          label: "Placements",
          value: (row) => getRecruiterStats(row.id).placements,
        },
      ]
    );

  const exportClients = () =>
    exportCSV(
      filteredClients,
      "aifagen-clients.csv",
      [
        { label: "Client", value: (row) => row.name },
        { label: "Contact", value: (row) => row.contact },
        { label: "Email", value: (row) => row.email },
        { label: "Industry", value: (row) => row.industry },
        { label: "Location", value: (row) => row.location },
        {
          label: "Assigned recruiter",
          value: (row) => getRecruiterName(recruiters, row.recruiterId),
        },
        { label: "Status", value: (row) => row.status },
      ]
    );

  const exportTransfers = () =>
    exportCSV(
      filteredTransfers,
      "aifagen-client-transfers.csv",
      [
        { label: "Client", value: (row) => row.clientName },
        {
          label: "Previous recruiter",
          value: (row) =>
            row.fromId ? getRecruiterName(recruiters, row.fromId) : "Unassigned",
        },
        {
          label: "New recruiter",
          value: (row) => getRecruiterName(recruiters, row.toId),
        },
        { label: "Transfer date", value: (row) => row.date },
        { label: "Reason", value: (row) => row.reason },
        { label: "Status", value: (row) => row.status },
      ]
    );

  const exportPlacements = () =>
    exportCSV(
      filteredPlacements,
      "aifagen-placements.csv",
      [
        { label: "Candidate", value: (row) => row.candidate },
        { label: "Role", value: (row) => row.role },
        { label: "Company", value: (row) => row.company },
        {
          label: "Recruiter",
          value: (row) => getRecruiterName(recruiters, row.recruiterId),
        },
        { label: "Date", value: (row) => row.date },
        { label: "Status", value: (row) => row.status },
        { label: "Placement fee USD", value: (row) => row.fee },
      ]
    );

  const renderPageActions = () => {
    if (activeTab === "overview") {
      return (
        <button
          className="hr-primary-btn"
          onClick={() => setActiveTab("recruiters")}
        >
          <Users size={16} /> View recruiters
        </button>
      );
    }

    if (activeTab === "recruiters") {
      return (
        <>
          <button className="hr-secondary-btn" onClick={exportRecruiters}>
            <Download size={15} /> Export
          </button>
          <button
            className="hr-primary-btn"
            onClick={() => setModal("recruiter")}
          >
            <Plus size={16} /> Add recruiter
          </button>
        </>
      );
    }

    if (activeTab === "clients") {
      return (
        <>
          <button className="hr-secondary-btn" onClick={exportClients}>
            <Download size={15} /> Export
          </button>
          <button
            className="hr-primary-btn"
            onClick={() => setModal("client")}
          >
            <Plus size={16} /> Add client
          </button>
        </>
      );
    }

    if (activeTab === "transfers") {
      return (
        <>
          <button className="hr-secondary-btn" onClick={exportTransfers}>
            <Download size={15} /> Export
          </button>
          <button
            className="hr-primary-btn"
            onClick={() => setModal("transfer")}
          >
            <ArrowLeftRight size={16} /> Transfer client
          </button>
        </>
      );
    }

    if (activeTab === "placements") {
      return (
        <>
          <button className="hr-secondary-btn" onClick={exportPlacements}>
            <Download size={15} /> Export
          </button>
          <button
            className="hr-primary-btn"
            onClick={() => setModal("placement")}
          >
            <Plus size={16} /> Record placement
          </button>
        </>
      );
    }

    return null;
  };

  const pageTitle = tabs.find((tab) => tab.id === activeTab)?.label || "HR";

  return (
    <div className="hr-page">
      {notice && (
        <div className="hr-toast">
          <CheckCircle2 size={17} />
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            <X size={15} />
          </button>
        </div>
      )}

      <header className="hr-header">
        <div>
          <div className="hr-breadcrumb">
            People & Operations <span>/</span> HR Management
          </div>
          <div className="hr-title-row">
            <div className="hr-title-icon">
              <Users size={23} />
            </div>
            <div>
              <h1>HR Management</h1>
              <p>
                Manage recruiters, client ownership, hiring progress, and
                successful placements.
              </p>
            </div>
          </div>
        </div>

        <div className="hr-header-actions">{renderPageActions()}</div>
      </header>

      <nav className="hr-tabs" aria-label="HR management sections">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`hr-tab ${activeTab === id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(id);
              resetSearch();
              setSelectedRecruiter(null);
              setSelectedClient(null);
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {activeTab !== "overview" && (
        <div className="hr-list-toolbar">
          <div className="hr-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${pageTitle.toLowerCase()}...`}
              aria-label={`Search ${pageTitle.toLowerCase()}`}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option>All statuses</option>
            {(activeTab === "recruiters"
              ? ["Active", "On Leave", "Inactive"]
              : activeTab === "clients"
                ? ["Active", "On Hold", "Inactive"]
                : activeTab === "transfers"
                  ? ["Completed", "Pending", "Cancelled"]
                  : activeTab === "jobs"
                    ? ["Open", "Interviewing", "On Hold", "Closed"]
                    : activeTab === "candidates"
                      ? ["Screening", "Interview", "Offer", "Rejected", "Placed"]
                      : ["Joined", "Offer Accepted", "In Progress", "Withdrawn"]
            ).map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>

          <span className="hr-results-count">
            {activeTab === "recruiters"
              ? filteredRecruiters.length
              : activeTab === "clients"
                ? filteredClients.length
                : activeTab === "transfers"
                  ? filteredTransfers.length
                  : activeTab === "jobs"
                    ? filteredJobs.length
                    : activeTab === "candidates"
                      ? filteredCandidates.length
                      : filteredPlacements.length}{" "}
            records
          </span>
        </div>
      )}

      {activeTab === "overview" && (
        <>
          <div className="hr-metric-grid">
            <div className="hr-metric-card">
              <div className="hr-metric-top">
                <span>Total clients</span>
                <div className="hr-metric-icon">
                  <Building2 size={18} />
                </div>
              </div>
              <strong>{clients.length}</strong>
              <small>
                <span className="hr-trend">●</span> {activeClients.length} active
                clients
              </small>
            </div>

            <div className="hr-metric-card">
              <div className="hr-metric-top">
                <span>Active recruiters</span>
                <div className="hr-metric-icon">
                  <Users size={18} />
                </div>
              </div>
              <strong>
                {recruiters.filter((recruiter) => recruiter.status === "Active")
                  .length}
              </strong>
              <small>Across all recruitment teams</small>
            </div>

            <div className="hr-metric-card">
              <div className="hr-metric-top">
                <span>Open requirements</span>
                <div className="hr-metric-icon">
                  <BriefcaseBusiness size={18} />
                </div>
              </div>
              <strong>{totalOpenings}</strong>
              <small>{openJobs.length} jobs currently in progress</small>
            </div>

            <div className="hr-metric-card">
              <div className="hr-metric-top">
                <span>Successful placements</span>
                <div className="hr-metric-icon">
                  <UserCheck size={18} />
                </div>
              </div>
              <strong>{placedCount}</strong>
              <small>Recorded as joined</small>
            </div>
          </div>

          <div className="hr-overview-grid">
            <section className="hr-panel hr-recruiter-performance">
              <div className="hr-panel-heading">
                <div>
                  <h2>Recruiter performance</h2>
                  <p>Client ownership and placement results by recruiter.</p>
                </div>
                <button
                  className="hr-text-btn"
                  onClick={() => setActiveTab("recruiters")}
                >
                  View all <ChevronRight size={15} />
                </button>
              </div>

              <div className="hr-performance-list">
                {recruiters.map((recruiter) => {
                  const stats = getRecruiterStats(recruiter.id);
                  const percent = Math.min(
                    100,
                    Math.round((stats.placements / Math.max(1, placedCount)) * 100)
                  );

                  return (
                    <div className="hr-performance-item" key={recruiter.id}>
                      <div className="hr-performance-person">
                        <div className="hr-avatar">
                          {recruiter.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div className="hr-performance-name">
                          <strong>{recruiter.name}</strong>
                          <span>{recruiter.specialization}</span>
                        </div>
                        <StatusBadge status={recruiter.status} />
                      </div>

                      <div className="hr-performance-stats">
                        <div>
                          <strong>{stats.clients}</strong>
                          <span>Clients</span>
                        </div>
                        <div>
                          <strong>{stats.jobs}</strong>
                          <span>Jobs</span>
                        </div>
                        <div>
                          <strong>{stats.candidates}</strong>
                          <span>Candidates</span>
                        </div>
                        <div>
                          <strong>{stats.placements}</strong>
                          <span>Placements</span>
                        </div>
                      </div>

                      <div className="hr-performance-progress">
                        <span style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="hr-panel hr-quick-stats">
              <div className="hr-panel-heading">
                <div>
                  <h2>Recruitment snapshot</h2>
                  <p>Current activity across the hiring pipeline.</p>
                </div>
              </div>

              <div className="hr-snapshot-list">
                <div className="hr-snapshot-row">
                  <div className="hr-snapshot-icon">
                    <Building2 size={17} />
                  </div>
                  <div>
                    <strong>Client assignments</strong>
                    <span>Clients with an assigned recruiter</span>
                  </div>
                  <b>
                    {clients.filter((client) => client.recruiterId).length}
                  </b>
                </div>

                <div className="hr-snapshot-row">
                  <div className="hr-snapshot-icon">
                    <Activity size={17} />
                  </div>
                  <div>
                    <strong>Candidate pipeline</strong>
                    <span>Candidates being processed</span>
                  </div>
                  <b>{candidates.length}</b>
                </div>

                <div className="hr-snapshot-row">
                  <div className="hr-snapshot-icon">
                    <ArrowLeftRight size={17} />
                  </div>
                  <div>
                    <strong>Client transfers</strong>
                    <span>Recorded ownership changes</span>
                  </div>
                  <b>{transfers.length}</b>
                </div>

                <div className="hr-snapshot-row">
                  <div className="hr-snapshot-icon">
                    <TrendingUp size={17} />
                  </div>
                  <div>
                    <strong>Placement revenue</strong>
                    <span>Demo value for joined candidates</span>
                  </div>
                  <b>{formatCurrency(placementRevenue)}</b>
                </div>
              </div>

              <div className="hr-note">
                <CircleAlert size={16} />
                <span>
                  Metrics are calculated from the sample records shown in this
                  page.
                </span>
              </div>
            </section>
          </div>

          <div className="hr-overview-grid hr-bottom-grid">
            <section className="hr-panel">
              <div className="hr-panel-heading">
                <div>
                  <h2>Recently assigned clients</h2>
                  <p>Current recruiter ownership at a glance.</p>
                </div>
                <button
                  className="hr-text-btn"
                  onClick={() => setActiveTab("clients")}
                >
                  All clients <ChevronRight size={15} />
                </button>
              </div>

              <div className="hr-mini-table">
                {clients.slice(0, 4).map((client) => (
                  <div className="hr-mini-row" key={client.id}>
                    <div className="hr-company-mark">
                      <Building2 size={16} />
                    </div>
                    <div className="hr-mini-main">
                      <strong>{client.name}</strong>
                      <span>{client.location}</span>
                    </div>
                    <div className="hr-mini-right">
                      <strong>
                        {getRecruiterName(recruiters, client.recruiterId)}
                      </strong>
                      <StatusBadge status={client.status} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="hr-panel">
              <div className="hr-panel-heading">
                <div>
                  <h2>Latest placements</h2>
                  <p>Candidate, company, and recruiter attribution.</p>
                </div>
                <button
                  className="hr-text-btn"
                  onClick={() => setActiveTab("placements")}
                >
                  All placements <ChevronRight size={15} />
                </button>
              </div>

              <div className="hr-mini-table">
                {placements.slice(0, 4).map((placement) => (
                  <div className="hr-mini-row" key={placement.id}>
                    <div className="hr-placement-mark">
                      <UserCheck size={16} />
                    </div>
                    <div className="hr-mini-main">
                      <strong>{placement.candidate}</strong>
                      <span>
                        {placement.role} · {placement.company}
                      </span>
                    </div>
                    <div className="hr-mini-right">
                      <strong>
                        {getRecruiterName(recruiters, placement.recruiterId)}
                      </strong>
                      <span className="hr-date">{placement.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {activeTab === "recruiters" && (
        <section className="hr-panel hr-table-panel">
          <div className="hr-panel-heading">
            <div>
              <h2>Recruiter directory</h2>
              <p>
                Review assignments, workload, hiring activity, and placements.
              </p>
            </div>
          </div>

          <div className="hr-table-scroll">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Recruiter</th>
                  <th>Specialization</th>
                  <th>Assigned clients</th>
                  <th>Open jobs</th>
                  <th>Candidates</th>
                  <th>Placements</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredRecruiters.map((recruiter) => {
                  const stats = getRecruiterStats(recruiter.id);

                  return (
                    <tr key={recruiter.id}>
                      <td>
                        <div className="hr-table-person">
                          <div className="hr-avatar">
                            {recruiter.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </div>
                          <div>
                            <strong>{recruiter.name}</strong>
                            <span>{recruiter.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{recruiter.specialization}</td>
                      <td>
                        <strong>{stats.clients}</strong>
                      </td>
                      <td>{stats.jobs}</td>
                      <td>{stats.candidates}</td>
                      <td>
                        <strong>{stats.placements}</strong>
                      </td>
                      <td>
                        <StatusBadge status={recruiter.status} />
                      </td>
                      <td>
                        <button
                          className="hr-row-action"
                          onClick={() => setSelectedRecruiter(recruiter)}
                          title="View recruiter details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredRecruiters.length === 0 && (
              <EmptyState
                title="No recruiters found"
                description="Try changing the search or status filter."
              />
            )}
          </div>
        </section>
      )}

      {activeTab === "clients" && (
        <section className="hr-panel hr-table-panel">
          <div className="hr-panel-heading">
            <div>
              <h2>Client accounts</h2>
              <p>
                See each client, its assigned recruiter, hiring needs, and
                current status.
              </p>
            </div>
          </div>

          <div className="hr-table-scroll">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Client company</th>
                  <th>Primary contact</th>
                  <th>Location</th>
                  <th>Assigned recruiter</th>
                  <th>Openings</th>
                  <th>Assigned date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="hr-company-cell">
                        <div className="hr-company-mark">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <strong>{client.name}</strong>
                          <span>{client.industry}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="hr-cell-stack">
                        <strong>{client.contact}</strong>
                        <span>{client.email}</span>
                      </div>
                    </td>
                    <td>{client.location}</td>
                    <td>
                      <div className="hr-assignee">
                        <div className="hr-assignee-dot">
                          {getRecruiterName(recruiters, client.recruiterId)
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        {getRecruiterName(recruiters, client.recruiterId)}
                      </div>
                    </td>
                    <td>
                      <strong>{client.openings}</strong>
                    </td>
                    <td>{client.assignedDate}</td>
                    <td>
                      <StatusBadge status={client.status} />
                    </td>
                    <td>
                      <button
                        className="hr-row-action"
                        onClick={() => {
                          setSelectedClient(client);
                          setTransferForm({
                            clientId: String(client.id),
                            toId: "",
                            reason: "",
                          });
                        }}
                        title="View client and transfer options"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredClients.length === 0 && (
              <EmptyState
                title="No clients found"
                description="Try another search or add a client account."
              />
            )}
          </div>
        </section>
      )}

      {activeTab === "transfers" && (
        <section className="hr-panel hr-table-panel">
          <div className="hr-panel-heading">
            <div>
              <h2>Client transfer history</h2>
              <p>
                See which clients changed ownership, who handed them over, and
                why.
              </p>
            </div>
          </div>

          <div className="hr-table-scroll">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Previous recruiter</th>
                  <th />
                  <th>New recruiter</th>
                  <th>Transfer date</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.map((transfer) => (
                  <tr key={transfer.id}>
                    <td>
                      <strong>{transfer.clientName}</strong>
                    </td>
                    <td>
                      {transfer.fromId
                        ? getRecruiterName(recruiters, transfer.fromId)
                        : "Unassigned"}
                    </td>
                    <td>
                      <ArrowLeftRight size={16} className="hr-transfer-arrow" />
                    </td>
                    <td>
                      <strong>
                        {getRecruiterName(recruiters, transfer.toId)}
                      </strong>
                    </td>
                    <td>{transfer.date}</td>
                    <td className="hr-reason-cell">{transfer.reason}</td>
                    <td>
                      <StatusBadge status={transfer.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTransfers.length === 0 && (
              <EmptyState
                title="No transfers found"
                description="Client ownership changes will appear here."
              />
            )}
          </div>
        </section>
      )}

      {activeTab === "jobs" && (
        <section className="hr-panel hr-table-panel">
          <div className="hr-panel-heading">
            <div>
              <h2>Job openings</h2>
              <p>Track client requirements and their assigned recruiters.</p>
            </div>
          </div>
          <div className="hr-table-scroll">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Job title</th>
                  <th>Client company</th>
                  <th>Recruiter</th>
                  <th>Open positions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <strong>{job.title}</strong>
                    </td>
                    <td>{job.company}</td>
                    <td>
                      {getRecruiterName(recruiters, job.recruiterId)}
                    </td>
                    <td>{job.openings}</td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredJobs.length === 0 && (
              <EmptyState
                title="No job openings found"
                description="Try changing the search or status filter."
              />
            )}
          </div>
        </section>
      )}

      {activeTab === "candidates" && (
        <section className="hr-panel hr-table-panel">
          <div className="hr-panel-heading">
            <div>
              <h2>Candidate pipeline</h2>
              <p>Review candidate progress and the recruiter responsible.</p>
            </div>
          </div>
          <div className="hr-table-scroll">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role</th>
                  <th>Client company</th>
                  <th>Recruiter</th>
                  <th>Stage</th>
                  <th>Last updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="hr-table-person">
                        <div className="hr-avatar">
                          {candidate.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div>
                          <strong>{candidate.name}</strong>
                          <span>Candidate #{candidate.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{candidate.role}</td>
                    <td>{candidate.company}</td>
                    <td>
                      {getRecruiterName(recruiters, candidate.recruiterId)}
                    </td>
                    <td>
                      <StatusBadge status={candidate.stage} />
                    </td>
                    <td>{candidate.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCandidates.length === 0 && (
              <EmptyState
                title="No candidates found"
                description="Try changing the search or stage filter."
              />
            )}
          </div>
        </section>
      )}

      {activeTab === "placements" && (
        <section className="hr-panel hr-table-panel">
          <div className="hr-panel-heading">
            <div>
              <h2>Successful placements</h2>
              <p>
                Track who was placed, the hiring company, responsible recruiter,
                and recorded fee.
              </p>
            </div>
          </div>
          <div className="hr-table-scroll">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Position</th>
                  <th>Hiring company</th>
                  <th>Recruiter</th>
                  <th>Placement date</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlacements.map((placement) => (
                  <tr key={placement.id}>
                    <td>
                      <div className="hr-table-person">
                        <div className="hr-avatar">
                          {placement.candidate
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div>
                          <strong>{placement.candidate}</strong>
                          <span>Placement #{placement.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{placement.role}</td>
                    <td>{placement.company}</td>
                    <td>
                      {getRecruiterName(recruiters, placement.recruiterId)}
                    </td>
                    <td>{placement.date}</td>
                    <td>
                      <strong>{formatCurrency(placement.fee)}</strong>
                    </td>
                    <td>
                      <StatusBadge status={placement.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPlacements.length === 0 && (
              <EmptyState
                title="No placements found"
                description="Try another search or record a placement."
              />
            )}
          </div>
        </section>
      )}

      {modal === "recruiter" && (
        <Modal
          title="Add recruiter"
          description="Create a recruiter profile for the HR team."
          onClose={() => setModal("")}
        >
          <form className="hr-form" onSubmit={addRecruiter}>
            <label>
              Full name *
              <input
                required
                value={recruiterForm.name}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    name: event.target.value,
                  })
                }
                placeholder="e.g. Morgan Taylor"
              />
            </label>
            <label>
              Work email *
              <input
                required
                type="email"
                value={recruiterForm.email}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    email: event.target.value,
                  })
                }
                placeholder="name@aifagen.com"
              />
            </label>
            <label>
              Phone
              <input
                value={recruiterForm.phone}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    phone: event.target.value,
                  })
                }
                placeholder="+1 ..."
              />
            </label>
            <label>
              Specialization
              <select
                value={recruiterForm.specialization}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    specialization: event.target.value,
                  })
                }
              >
                <option>Software Engineering</option>
                <option>Data & Analytics</option>
                <option>Cloud & DevOps</option>
                <option>Quality Engineering</option>
                <option>Cybersecurity</option>
                <option>Business & Operations</option>
              </select>
            </label>
            <label>
              Status
              <select
                value={recruiterForm.status}
                onChange={(event) =>
                  setRecruiterForm({
                    ...recruiterForm,
                    status: event.target.value,
                  })
                }
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </label>
            <div className="hr-form-actions">
              <button
                type="button"
                className="hr-secondary-btn"
                onClick={() => setModal("")}
              >
                Cancel
              </button>
              <button type="submit" className="hr-primary-btn">
                <UserPlus size={15} /> Save recruiter
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "client" && (
        <Modal
          title="Add client"
          description="Add a company and assign its recruitment owner."
          onClose={() => setModal("")}
        >
          <form className="hr-form" onSubmit={addClient}>
            <label>
              Company name *
              <input
                required
                value={clientForm.name}
                onChange={(event) =>
                  setClientForm({ ...clientForm, name: event.target.value })
                }
                placeholder="Company name"
              />
            </label>
            <label>
              Primary contact *
              <input
                required
                value={clientForm.contact}
                onChange={(event) =>
                  setClientForm({ ...clientForm, contact: event.target.value })
                }
                placeholder="Contact name"
              />
            </label>
            <label>
              Contact email *
              <input
                required
                type="email"
                value={clientForm.email}
                onChange={(event) =>
                  setClientForm({ ...clientForm, email: event.target.value })
                }
                placeholder="contact@company.com"
              />
            </label>
            <label>
              Industry
              <select
                value={clientForm.industry}
                onChange={(event) =>
                  setClientForm({ ...clientForm, industry: event.target.value })
                }
              >
                <option>Technology</option>
                <option>IT Services</option>
                <option>Cloud Computing</option>
                <option>Data & Analytics</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>Digital Services</option>
                <option>Enterprise Software</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Location *
              <input
                required
                value={clientForm.location}
                onChange={(event) =>
                  setClientForm({ ...clientForm, location: event.target.value })
                }
                placeholder="e.g. New York, NY"
              />
            </label>
            <label>
              Assign recruiter
              <select
                value={clientForm.recruiterId}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    recruiterId: event.target.value,
                  })
                }
              >
                <option value="">Leave unassigned</option>
                {recruiters
                  .filter((recruiter) => recruiter.status === "Active")
                  .map((recruiter) => (
                    <option key={recruiter.id} value={recruiter.id}>
                      {recruiter.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Initial open positions
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
              />
            </label>
            <div className="hr-form-actions">
              <button
                type="button"
                className="hr-secondary-btn"
                onClick={() => setModal("")}
              >
                Cancel
              </button>
              <button type="submit" className="hr-primary-btn">
                <Plus size={15} /> Save client
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "transfer" && (
        <Modal
          title="Transfer client"
          description="Reassign a client and record the reason for the change."
          onClose={() => setModal("")}
        >
          <form className="hr-form" onSubmit={transferClient}>
            <label>
              Client *
              <select
                required
                value={transferForm.clientId}
                onChange={(event) =>
                  setTransferForm({
                    ...transferForm,
                    clientId: event.target.value,
                  })
                }
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} —{" "}
                    {getRecruiterName(recruiters, client.recruiterId)}
                  </option>
                ))}
              </select>
            </label>
            {transferForm.clientId && (
              <div className="hr-transfer-preview">
                <span>Current owner</span>
                <strong>
                  {getRecruiterName(
                    recruiters,
                    clients.find(
                      (client) => client.id === Number(transferForm.clientId)
                    )?.recruiterId
                  )}
                </strong>
              </div>
            )}
            <label>
              Transfer to *
              <select
                required
                value={transferForm.toId}
                onChange={(event) =>
                  setTransferForm({ ...transferForm, toId: event.target.value })
                }
              >
                <option value="">Select new recruiter</option>
                {recruiters
                  .filter((recruiter) => recruiter.status === "Active")
                  .map((recruiter) => (
                    <option key={recruiter.id} value={recruiter.id}>
                      {recruiter.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Reason for transfer *
              <textarea
                required
                rows="3"
                value={transferForm.reason}
                onChange={(event) =>
                  setTransferForm({
                    ...transferForm,
                    reason: event.target.value,
                  })
                }
                placeholder="Explain why this client is being reassigned..."
              />
            </label>
            <div className="hr-form-actions">
              <button
                type="button"
                className="hr-secondary-btn"
                onClick={() => setModal("")}
              >
                Cancel
              </button>
              <button type="submit" className="hr-primary-btn">
                <ArrowLeftRight size={15} /> Confirm transfer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "placement" && (
        <Modal
          title="Record placement"
          description="Record a candidate's hiring outcome and responsible recruiter."
          onClose={() => setModal("")}
        >
          <form className="hr-form" onSubmit={addPlacement}>
            <label>
              Candidate name *
              <input
                required
                value={placementForm.candidate}
                onChange={(event) =>
                  setPlacementForm({
                    ...placementForm,
                    candidate: event.target.value,
                  })
                }
                placeholder="Candidate full name"
              />
            </label>
            <label>
              Position *
              <input
                required
                value={placementForm.role}
                onChange={(event) =>
                  setPlacementForm({ ...placementForm, role: event.target.value })
                }
                placeholder="e.g. Software Engineer"
              />
            </label>
            <label>
              Hiring company *
              <input
                required
                value={placementForm.company}
                onChange={(event) =>
                  setPlacementForm({
                    ...placementForm,
                    company: event.target.value,
                  })
                }
                placeholder="Company name"
              />
            </label>
            <label>
              Responsible recruiter *
              <select
                required
                value={placementForm.recruiterId}
                onChange={(event) =>
                  setPlacementForm({
                    ...placementForm,
                    recruiterId: event.target.value,
                  })
                }
              >
                <option value="">Select recruiter</option>
                {recruiters.map((recruiter) => (
                  <option key={recruiter.id} value={recruiter.id}>
                    {recruiter.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Placement date *
              <input
                required
                type="date"
                value={placementForm.date}
                onChange={(event) =>
                  setPlacementForm({ ...placementForm, date: event.target.value })
                }
              />
            </label>
            <label>
              Status
              <select
                value={placementForm.status}
                onChange={(event) =>
                  setPlacementForm({
                    ...placementForm,
                    status: event.target.value,
                  })
                }
              >
                <option>Joined</option>
                <option>Offer Accepted</option>
                <option>In Progress</option>
                <option>Withdrawn</option>
              </select>
            </label>
            <label>
              Placement fee (USD)
              <input
                type="number"
                min="0"
                step="0.01"
                value={placementForm.fee}
                onChange={(event) =>
                  setPlacementForm({ ...placementForm, fee: event.target.value })
                }
                placeholder="0.00"
              />
            </label>
            <div className="hr-form-actions">
              <button
                type="button"
                className="hr-secondary-btn"
                onClick={() => setModal("")}
              >
                Cancel
              </button>
              <button type="submit" className="hr-primary-btn">
                <CheckCircle2 size={15} /> Save placement
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedRecruiter && (
        <div
          className="hr-drawer-backdrop"
          onClick={() => setSelectedRecruiter(null)}
        >
          <aside
            className="hr-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Recruiter details"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hr-drawer-header">
              <div>
                <span>RECRUITER PROFILE</span>
                <h2>{selectedRecruiter.name}</h2>
                <p>{selectedRecruiter.specialization}</p>
              </div>
              <button
                className="hr-icon-button"
                onClick={() => setSelectedRecruiter(null)}
                aria-label="Close recruiter details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="hr-drawer-body">
              <StatusBadge status={selectedRecruiter.status} />

              <div className="hr-drawer-contact">
                <div>
                  <Mail size={16} />
                  <span>{selectedRecruiter.email}</span>
                </div>
                <div>
                  <UserPlus size={16} />
                  <span>{selectedRecruiter.phone || "No phone provided"}</span>
                </div>
                <div>
                  <CalendarDays size={16} />
                  <span>Joined {selectedRecruiter.joined}</span>
                </div>
              </div>

              <h3>Performance summary</h3>
              <div className="hr-drawer-metrics">
                {[
                  ["Clients", getRecruiterStats(selectedRecruiter.id).clients],
                  ["Jobs", getRecruiterStats(selectedRecruiter.id).jobs],
                  [
                    "Candidates",
                    getRecruiterStats(selectedRecruiter.id).candidates,
                  ],
                  [
                    "Placements",
                    getRecruiterStats(selectedRecruiter.id).placements,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <h3>Assigned clients</h3>
              {clients.filter(
                (client) => client.recruiterId === selectedRecruiter.id
              ).length === 0 ? (
                <p className="hr-drawer-muted">No clients assigned yet.</p>
              ) : (
                clients
                  .filter(
                    (client) => client.recruiterId === selectedRecruiter.id
                  )
                  .map((client) => (
                    <div className="hr-drawer-list-item" key={client.id}>
                      <div className="hr-company-mark">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <strong>{client.name}</strong>
                        <span>{client.openings} open positions</span>
                      </div>
                      <StatusBadge status={client.status} />
                    </div>
                  ))
              )}

              <h3>Successful placements</h3>
              {placements.filter(
                (placement) =>
                  placement.recruiterId === selectedRecruiter.id &&
                  placement.status === "Joined"
              ).length === 0 ? (
                <p className="hr-drawer-muted">No joined placements recorded.</p>
              ) : (
                placements
                  .filter(
                    (placement) =>
                      placement.recruiterId === selectedRecruiter.id &&
                      placement.status === "Joined"
                  )
                  .map((placement) => (
                    <div className="hr-drawer-list-item" key={placement.id}>
                      <div className="hr-placement-mark">
                        <UserCheck size={16} />
                      </div>
                      <div>
                        <strong>{placement.candidate}</strong>
                        <span>
                          {placement.role} · {placement.company}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </aside>
        </div>
      )}

      {selectedClient && (
        <Modal
          title={selectedClient.name}
          description="Client account and recruiter ownership."
          onClose={() => setSelectedClient(null)}
        >
          <div className="hr-client-detail">
            <div className="hr-client-detail-row">
              <span>Primary contact</span>
              <strong>{selectedClient.contact}</strong>
            </div>
            <div className="hr-client-detail-row">
              <span>Email</span>
              <strong>{selectedClient.email}</strong>
            </div>
            <div className="hr-client-detail-row">
              <span>Location</span>
              <strong>{selectedClient.location}</strong>
            </div>
            <div className="hr-client-detail-row">
              <span>Industry</span>
              <strong>{selectedClient.industry}</strong>
            </div>
            <div className="hr-client-detail-row">
              <span>Current recruiter</span>
              <strong>
                {getRecruiterName(recruiters, selectedClient.recruiterId)}
              </strong>
            </div>
            <div className="hr-client-detail-row">
              <span>Open positions</span>
              <strong>{selectedClient.openings}</strong>
            </div>
            <div className="hr-client-detail-actions">
              <button
                className="hr-secondary-btn"
                onClick={() => setSelectedClient(null)}
              >
                Close
              </button>
              <button
                className="hr-primary-btn"
                onClick={() => {
                  setTransferForm({
                    clientId: String(selectedClient.id),
                    toId: "",
                    reason: "",
                  });
                  setSelectedClient(null);
                  setModal("transfer");
                }}
              >
                <ArrowLeftRight size={15} /> Transfer client
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
