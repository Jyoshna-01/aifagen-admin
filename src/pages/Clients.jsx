
import { useMemo, useState } from "react";
import {
  Building2,
  Users,
  BriefcaseBusiness,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  CalendarDays,
  GraduationCap,
  BadgeIndianRupee,
  Clock3,
  UserRound,
  ChevronDown,
  ExternalLink,
  ClipboardList,
  CheckCircle2,
  CircleDot,
  FileText,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import "./Clients.css";
import useAssistantContext from "../hooks/useAssistantContext";

const initialClients = [
  {
    id: 1,
    name: "TechNova Solutions",
    industry: "Information Technology",
    website: "https://technova.example.com",
    location: "Hyderabad, Telangana",
    contactName: "Priya Reddy",
    contactRole: "HR Manager",
    email: "priya@technova.example.com",
    phone: "+91 98765 43210",
    employees: "500–1000",
    partnership: "Active",
    joined: "2026-04-12",
    notes: "Hiring for engineering, cloud, and data teams.",
  },
  {
    id: 2,
    name: "BrightPath Digital",
    industry: "Software & Consulting",
    website: "https://brightpath.example.com",
    location: "Bengaluru, Karnataka",
    contactName: "Rahul Sharma",
    contactRole: "Talent Acquisition Lead",
    email: "rahul@brightpath.example.com",
    phone: "+91 99887 66554",
    employees: "100–500",
    partnership: "Active",
    joined: "2026-05-20",
    notes: "Looking for Java and frontend developers.",
  },
  {
    id: 3,
    name: "NexGen Analytics",
    industry: "Data & Analytics",
    website: "https://nexgen.example.com",
    location: "Pune, Maharashtra",
    contactName: "Ananya Rao",
    contactRole: "Recruitment Partner",
    email: "ananya@nexgen.example.com",
    phone: "+91 91234 56780",
    employees: "50–200",
    partnership: "On Hold",
    joined: "2026-06-08",
    notes: "Data and analytics roles expected next quarter.",
  },
];

const initialOpenings = [
  {
    id: 101,
    clientId: 1,
    title: "Java Full Stack Developer",
    department: "Engineering",
    location: "Hyderabad / Hybrid",
    workType: "Full-time",
    experience: "0–2 years",
    qualification: "B.Tech, B.Sc, BCA, MCA or equivalent",
    skills: ["Java", "Spring Boot", "Angular", "MySQL", "REST API"],
    vacancies: 5,
    salaryMin: "3.5",
    salaryMax: "6.0",
    salaryUnit: "LPA",
    priority: "High",
    status: "Open",
    postedDate: "2026-10-01",
    deadline: "2026-11-15",
    description:
      "Develop and maintain web applications using Java, Spring Boot, Angular, and MySQL.",
    interviewProcess: [
      "Resume screening",
      "Online technical assessment",
      "Technical interview",
      "Managerial interview",
      "HR discussion",
    ],
    recruiter: "Ayesha Khan",
  },
  {
    id: 102,
    clientId: 1,
    title: "Cloud Support Associate",
    department: "Cloud Operations",
    location: "Hyderabad",
    workType: "Full-time",
    experience: "0–1 year",
    qualification: "Any degree; IT or Computer Science preferred",
    skills: ["Linux", "Networking", "AWS", "Troubleshooting"],
    vacancies: 3,
    salaryMin: "3.0",
    salaryMax: "4.5",
    salaryUnit: "LPA",
    priority: "Medium",
    status: "Open",
    postedDate: "2026-10-04",
    deadline: "2026-11-10",
    description:
      "Support cloud infrastructure, monitor services, and troubleshoot technical issues.",
    interviewProcess: [
      "Resume screening",
      "Technical assessment",
      "Technical interview",
      "HR discussion",
    ],
    recruiter: "Kiran Kumar",
  },
  {
    id: 103,
    clientId: 2,
    title: "Frontend Developer",
    department: "Product Engineering",
    location: "Bengaluru / Hybrid",
    workType: "Full-time",
    experience: "1–3 years",
    qualification: "B.Tech, BCA, MCA or equivalent",
    skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    vacancies: 4,
    salaryMin: "5.0",
    salaryMax: "8.0",
    salaryUnit: "LPA",
    priority: "High",
    status: "Interviewing",
    postedDate: "2026-09-25",
    deadline: "2026-10-30",
    description:
      "Build responsive interfaces and collaborate with backend developers and designers.",
    interviewProcess: [
      "Resume screening",
      "Coding round",
      "Technical interview",
      "Assignment review",
      "HR discussion",
    ],
    recruiter: "Sneha Patel",
  },
  {
    id: 104,
    clientId: 3,
    title: "Junior Data Analyst",
    department: "Analytics",
    location: "Pune",
    workType: "Full-time",
    experience: "0–2 years",
    qualification: "B.Sc, B.Com, BCA, B.Tech or related degree",
    skills: ["SQL", "Excel", "Power BI", "Data Cleaning"],
    vacancies: 2,
    salaryMin: "3.0",
    salaryMax: "5.0",
    salaryUnit: "LPA",
    priority: "Low",
    status: "On Hold",
    postedDate: "2026-09-18",
    deadline: "2026-11-30",
    description:
      "Prepare reports, validate data, and support business intelligence dashboards.",
    interviewProcess: [
      "Resume screening",
      "SQL assessment",
      "Analytics interview",
      "HR discussion",
    ],
    recruiter: "Meghana Rao",
  },
];

const emptyClient = {
  name: "",
  industry: "",
  website: "",
  location: "",
  contactName: "",
  contactRole: "",
  email: "",
  phone: "",
  employees: "",
  partnership: "Active",
  joined: new Date().toISOString().slice(0, 10),
  notes: "",
};

const emptyOpening = {
  clientId: "",
  title: "",
  department: "",
  location: "",
  workType: "Full-time",
  experience: "",
  qualification: "",
  skillsText: "",
  vacancies: 1,
  salaryMin: "",
  salaryMax: "",
  salaryUnit: "LPA",
  priority: "Medium",
  status: "Open",
  postedDate: new Date().toISOString().slice(0, 10),
  deadline: "",
  description: "",
  interviewText:
    "Resume screening\nTechnical assessment\nTechnical interview\nHR discussion",
  recruiter: "",
};

const currency = (value) =>
  value === "" || value === null || value === undefined
    ? "—"
    : `₹${value} LPA`;

function StatusBadge({ value }) {
  const className = String(value || "Open")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return <span className={`clients-status ${className}`}>{value}</span>;
}

function SectionTitle({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="clients-section-title">
      <div className="clients-section-title-main">
        <span className="clients-section-icon">
          <Icon size={19} />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export default function Clients({ onAssistantContext }) {
  const [clients, setClients] = useState(initialClients);
  const [openings, setOpenings] = useState(initialOpenings);
  const [activeTab, setActiveTab] = useState("companies");
  const [search, setSearch] = useState("");
  const [partnershipFilter, setPartnershipFilter] = useState("All");
  const [openingStatusFilter, setOpeningStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [clientForm, setClientForm] = useState(emptyClient);
  const [openingForm, setOpeningForm] = useState(emptyOpening);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const getClient = (clientId) =>
    clients.find((client) => client.id === Number(clientId));

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        !term ||
        [
          client.name,
          client.industry,
          client.location,
          client.contactName,
          client.email,
        ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesStatus =
        partnershipFilter === "All" ||
        client.partnership === partnershipFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, partnershipFilter]);

  const filteredOpenings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return openings.filter((opening) => {
      const clientName = getClient(opening.clientId)?.name || "";
      const matchesSearch =
        !term ||
        [
          opening.title,
          opening.department,
          opening.location,
          opening.recruiter,
          clientName,
          ...(opening.skills || []),
        ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesStatus =
        openingStatusFilter === "All" ||
        opening.status === openingStatusFilter;

      const matchesPriority =
        priorityFilter === "All" || opening.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [openings, clients, search, openingStatusFilter, priorityFilter]);

  const totalVacancies = openings
    .filter((opening) => opening.status !== "Closed")
    .reduce((sum, opening) => sum + Number(opening.vacancies || 0), 0);

  const activeClientCount = clients.filter(
    (client) => client.partnership === "Active"
  ).length;

  const openRoleCount = openings.filter(
    (opening) => opening.status === "Open"
  ).length;
  useAssistantContext(onAssistantContext, "Clients", {
    clients: clients.length,
    openings: totalVacancies,
    active: activeClientCount,
    filtered: activeTab === "companies" ? filteredClients.length : filteredOpenings.length,
    needsReview: clients.length - activeClientCount,
    filters: `tab ${activeTab}; partnership ${partnershipFilter}; opening status ${openingStatusFilter}; priority ${priorityFilter}${search ? "; search active" : ""}`,
  });

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const openAddClient = () => {
    setEditingId(null);
    setClientForm({
      ...emptyClient,
      joined: new Date().toISOString().slice(0, 10),
    });
    setModal("client");
  };

  const openEditClient = (client) => {
    setEditingId(client.id);
    setClientForm({ ...client });
    setModal("client");
    setSelectedClient(null);
  };

  const openAddOpening = (clientId = "") => {
    if (clients.length === 0) {
      notify("Add a company before creating a job opening.");
      return;
    }

    setEditingId(null);
    setOpeningForm({
      ...emptyOpening,
      clientId: clientId ? String(clientId) : String(clients[0].id),
      postedDate: new Date().toISOString().slice(0, 10),
    });
    setModal("opening");
    setSelectedClient(null);
  };

  const openEditOpening = (opening) => {
    setEditingId(opening.id);
    setOpeningForm({
      ...opening,
      clientId: String(opening.clientId),
      skillsText: (opening.skills || []).join(", "),
      interviewText: (opening.interviewProcess || []).join("\n"),
    });
    setModal("opening");
    setSelectedOpening(null);
  };

  const saveClient = (event) => {
    event.preventDefault();

    const duplicate = clients.some(
      (client) =>
        client.name.trim().toLowerCase() ===
          clientForm.name.trim().toLowerCase() &&
        client.id !== editingId
    );

    if (duplicate) {
      notify("A company with this name already exists.");
      return;
    }

    if (editingId) {
      setClients((previous) =>
        previous.map((client) =>
          client.id === editingId
            ? { ...clientForm, id: editingId, name: clientForm.name.trim() }
            : client
        )
      );
      notify("Company details updated.");
    } else {
      setClients((previous) => [
        ...previous,
        {
          ...clientForm,
          id: Date.now(),
          name: clientForm.name.trim(),
        },
      ]);
      notify("New company added.");
    }

    setModal(null);
  };

  const saveOpening = (event) => {
    event.preventDefault();

    if (!openingForm.clientId) {
      notify("Please select a company.");
      return;
    }

    const skills = openingForm.skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const interviewProcess = openingForm.interviewText
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean);

    const payload = {
      ...openingForm,
      clientId: Number(openingForm.clientId),
      vacancies: Math.max(1, Number(openingForm.vacancies) || 1),
      skills,
      interviewProcess,
      salaryMin: openingForm.salaryMin,
      salaryMax: openingForm.salaryMax,
    };

    delete payload.skillsText;
    delete payload.interviewText;

    if (editingId) {
      setOpenings((previous) =>
        previous.map((opening) =>
          opening.id === editingId ? { ...payload, id: editingId } : opening
        )
      );
      notify("Job opening updated.");
    } else {
      setOpenings((previous) => [
        ...previous,
        { ...payload, id: Date.now() },
      ]);
      notify("Job opening added.");
    }

    setModal(null);
  };

  const deleteClient = (clientId) => {
    setClients((previous) =>
      previous.filter((client) => client.id !== clientId)
    );
    setOpenings((previous) =>
      previous.filter((opening) => opening.clientId !== clientId)
    );
    setConfirmDelete(null);
    setSelectedClient(null);
    notify("Company and its associated openings removed.");
  };

  const deleteOpening = (openingId) => {
    setOpenings((previous) =>
      previous.filter((opening) => opening.id !== openingId)
    );
    setConfirmDelete(null);
    setSelectedOpening(null);
    notify("Job opening deleted.");
  };

  const showClientDetails = (client) => {
    setSelectedClient(client);
    setSelectedOpening(null);
  };

  const showOpeningDetails = (opening) => {
    setSelectedOpening(opening);
    setSelectedClient(null);
  };

  const downloadCSV = () => {
    const rows =
      activeTab === "companies"
        ? [
            [
              "Company",
              "Industry",
              "Location",
              "Contact",
              "Email",
              "Phone",
              "Partnership",
              "Openings",
              "Vacancies",
            ],
            ...filteredClients.map((client) => {
              const clientOpenings = openings.filter(
                (opening) => opening.clientId === client.id
              );
              return [
                client.name,
                client.industry,
                client.location,
                client.contactName,
                client.email,
                client.phone,
                client.partnership,
                clientOpenings.length,
                clientOpenings.reduce(
                  (sum, opening) => sum + Number(opening.vacancies || 0),
                  0
                ),
              ];
            }),
          ]
        : [
            [
              "Company",
              "Job Title",
              "Department",
              "Location",
              "Experience",
              "Qualification",
              "Skills",
              "Vacancies",
              "Salary",
              "Priority",
              "Status",
              "Recruiter",
              "Interview Process",
            ],
            ...filteredOpenings.map((opening) => [
              getClient(opening.clientId)?.name || "",
              opening.title,
              opening.department,
              opening.location,
              opening.experience,
              opening.qualification,
              (opening.skills || []).join(", "),
              opening.vacancies,
              `${opening.salaryMin}-${opening.salaryMax} ${opening.salaryUnit}`,
              opening.priority,
              opening.status,
              opening.recruiter,
              (opening.interviewProcess || []).join(" > "),
            ]),
          ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      activeTab === "companies" ? "client-companies.csv" : "job-openings.csv";
    link.click();
    URL.revokeObjectURL(url);
    notify("CSV export downloaded.");
  };

  const closeDetails = () => {
    setSelectedClient(null);
    setSelectedOpening(null);
  };

  return (
    <div className="clients-page">
      <div className="clients-page-heading">
        <div>
          <div className="clients-eyebrow">
            <span className="clients-eyebrow-dot" />
            HR MANAGEMENT / CLIENT RELATIONS
          </div>
          <h1>Clients & Company Openings</h1>
          <p>
            Manage partner companies, understand their hiring needs, and track
            every vacancy from requirement to interview.
          </p>
        </div>

        <div className="clients-heading-actions">
          <button className="clients-btn clients-btn-secondary" onClick={downloadCSV}>
            <FileText size={17} /> Export CSV
          </button>
          <button
            className="clients-btn clients-btn-primary"
            onClick={() =>
              activeTab === "companies" ? openAddClient() : openAddOpening()
            }
          >
            <Plus size={18} />
            {activeTab === "companies" ? "Add Company" : "Add Opening"}
          </button>
        </div>
      </div>

      <div className="clients-metrics">
        <div className="clients-metric-card">
          <div className="clients-metric-top">
            <span className="clients-metric-icon clients-icon-blue">
              <Building2 size={21} />
            </span>
            <span className="clients-metric-label">Total Companies</span>
          </div>
          <div className="clients-metric-value">{clients.length}</div>
          <div className="clients-metric-foot">
            <span className="clients-positive">
              <ArrowUpRight size={14} /> {activeClientCount} active
            </span>
            <span>partnerships</span>
          </div>
        </div>

        <div className="clients-metric-card">
          <div className="clients-metric-top">
            <span className="clients-metric-icon clients-icon-purple">
              <BriefcaseBusiness size={21} />
            </span>
            <span className="clients-metric-label">Job Openings</span>
          </div>
          <div className="clients-metric-value">{openings.length}</div>
          <div className="clients-metric-foot">
            <span className="clients-positive">{openRoleCount} open</span>
            <span>roles hiring now</span>
          </div>
        </div>

        <div className="clients-metric-card">
          <div className="clients-metric-top">
            <span className="clients-metric-icon clients-icon-orange">
              <Users size={21} />
            </span>
            <span className="clients-metric-label">Total Vacancies</span>
          </div>
          <div className="clients-metric-value">{totalVacancies}</div>
          <div className="clients-metric-foot">
            <span>Across all non-closed roles</span>
          </div>
        </div>

        <div className="clients-metric-card">
          <div className="clients-metric-top">
            <span className="clients-metric-icon clients-icon-green">
              <ClipboardList size={21} />
            </span>
            <span className="clients-metric-label">Interviewing</span>
          </div>
          <div className="clients-metric-value">
            {openings.filter((opening) => opening.status === "Interviewing").length}
          </div>
          <div className="clients-metric-foot">
            <span>Roles in interview stage</span>
          </div>
        </div>
      </div>

      <div className="clients-main-card">
        <div className="clients-tabs-bar">
          <button
            className={`clients-tab ${activeTab === "companies" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("companies");
              setSearch("");
            }}
          >
            <Building2 size={17} /> Companies
            <span>{clients.length}</span>
          </button>
          <button
            className={`clients-tab ${activeTab === "openings" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("openings");
              setSearch("");
            }}
          >
            <BriefcaseBusiness size={17} /> Job Openings
            <span>{openings.length}</span>
          </button>
        </div>

        <div className="clients-content">
          <SectionTitle
            icon={activeTab === "companies" ? Building2 : BriefcaseBusiness}
            title={activeTab === "companies" ? "Company Directory" : "Hiring Requirements"}
            subtitle={
              activeTab === "companies"
                ? "Company contacts, partnership details, and hiring activity."
                : "Skills, qualifications, vacancies, salary ranges, and interview rounds."
            }
            action={
              <span className="clients-record-count">
                {activeTab === "companies"
                  ? `${filteredClients.length} companies`
                  : `${filteredOpenings.length} openings`}
              </span>
            }
          />

          <div className="clients-toolbar">
            <div className="clients-search">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  activeTab === "companies"
                    ? "Search company, contact, email, industry..."
                    : "Search role, company, skill, recruiter..."
                }
              />
              {search && (
                <button
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="clients-clear-search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="clients-filter-control">
              <Filter size={16} />
              {activeTab === "companies" ? (
                <select
                  value={partnershipFilter}
                  onChange={(event) => setPartnershipFilter(event.target.value)}
                >
                  <option value="All">All partnerships</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Inactive">Inactive</option>
                </select>
              ) : (
                <>
                  <select
                    value={openingStatusFilter}
                    onChange={(event) => setOpeningStatusFilter(event.target.value)}
                  >
                    <option value="All">All statuses</option>
                    <option value="Open">Open</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(event) => setPriorityFilter(event.target.value)}
                  >
                    <option value="All">All priorities</option>
                    <option value="High">High priority</option>
                    <option value="Medium">Medium priority</option>
                    <option value="Low">Low priority</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {activeTab === "companies" ? (
            <div className="clients-company-grid">
              {filteredClients.map((client) => {
                const clientOpenings = openings.filter(
                  (opening) => opening.clientId === client.id
                );
                const vacancies = clientOpenings.reduce(
                  (sum, opening) => sum + Number(opening.vacancies || 0),
                  0
                );

                return (
                  <article className="clients-company-card" key={client.id}>
                    <div className="clients-company-card-top">
                      <div className="clients-company-avatar">
                        {client.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="clients-company-title">
                        <h3>{client.name}</h3>
                        <p>{client.industry || "Industry not specified"}</p>
                      </div>
                      <button
                        className="clients-icon-button"
                        title="View company details"
                        onClick={() => showClientDetails(client)}
                      >
                        <Eye size={17} />
                      </button>
                    </div>

                    <StatusBadge value={client.partnership} />

                    <div className="clients-company-info">
                      <div>
                        <MapPin size={15} />
                        <span>{client.location || "Location not added"}</span>
                      </div>
                      <div>
                        <UserRound size={15} />
                        <span>
                          {client.contactName || "Contact not added"}
                          {client.contactRole ? ` · ${client.contactRole}` : ""}
                        </span>
                      </div>
                      <div>
                        <Mail size={15} />
                        <span>{client.email || "Email not added"}</span>
                      </div>
                      <div>
                        <Phone size={15} />
                        <span>{client.phone || "Phone not added"}</span>
                      </div>
                    </div>

                    <div className="clients-company-stats">
                      <div>
                        <strong>{clientOpenings.length}</strong>
                        <span>Job roles</span>
                      </div>
                      <div>
                        <strong>{vacancies}</strong>
                        <span>Vacancies</span>
                      </div>
                      <div>
                        <strong>{client.employees || "—"}</strong>
                        <span>Employees</span>
                      </div>
                    </div>

                    <div className="clients-company-actions">
                      <button
                        className="clients-text-button"
                        onClick={() => showClientDetails(client)}
                      >
                        View details <ArrowUpRight size={15} />
                      </button>
                      <div className="clients-row-actions">
                        <button
                          className="clients-icon-button"
                          title="Add job opening"
                          onClick={() => openAddOpening(client.id)}
                        >
                          <Plus size={17} />
                        </button>
                        <button
                          className="clients-icon-button"
                          title="Edit company"
                          onClick={() => openEditClient(client)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="clients-icon-button clients-danger-icon"
                          title="Delete company"
                          onClick={() =>
                            setConfirmDelete({
                              type: "client",
                              id: client.id,
                              name: client.name,
                            })
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              {filteredClients.length === 0 && (
                <div className="clients-empty">
                  <Building2 size={32} />
                  <h3>No companies found</h3>
                  <p>Try a different search or add a new company.</p>
                  <button className="clients-btn clients-btn-primary" onClick={openAddClient}>
                    <Plus size={17} /> Add Company
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="clients-table-wrap">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Job & Company</th>
                    <th>Skills / Qualification</th>
                    <th>Experience</th>
                    <th>Vacancies</th>
                    <th>Salary Range</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpenings.map((opening) => {
                    const client = getClient(opening.clientId);

                    return (
                      <tr key={opening.id}>
                        <td>
                          <div className="clients-job-cell">
                            <strong>{opening.title}</strong>
                            <span>{client?.name || "Company removed"}</span>
                            <small>
                              <MapPin size={12} /> {opening.location}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="clients-skills-cell">
                            <div className="clients-skill-list">
                              {(opening.skills || []).slice(0, 3).map((skill) => (
                                <span className="clients-skill-chip" key={skill}>
                                  {skill}
                                </span>
                              ))}
                              {(opening.skills || []).length > 3 && (
                                <span className="clients-skill-more">
                                  +{opening.skills.length - 3}
                                </span>
                              )}
                            </div>
                            <small>{opening.qualification}</small>
                          </div>
                        </td>
                        <td>{opening.experience || "—"}</td>
                        <td>
                          <span className="clients-vacancy-number">
                            {opening.vacancies}
                          </span>
                        </td>
                        <td>
                          <div className="clients-salary">
                            <strong>
                              {currency(opening.salaryMin)} – {currency(opening.salaryMax)}
                            </strong>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`clients-priority ${String(
                              opening.priority
                            ).toLowerCase()}`}
                          >
                            {opening.priority}
                          </span>
                        </td>
                        <td>
                          <StatusBadge value={opening.status} />
                        </td>
                        <td>
                          <div className="clients-row-actions">
                            <button
                              className="clients-icon-button"
                              title="View opening details"
                              onClick={() => showOpeningDetails(opening)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="clients-icon-button"
                              title="Edit opening"
                              onClick={() => openEditOpening(opening)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="clients-icon-button clients-danger-icon"
                              title="Delete opening"
                              onClick={() =>
                                setConfirmDelete({
                                  type: "opening",
                                  id: opening.id,
                                  name: opening.title,
                                })
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredOpenings.length === 0 && (
                <div className="clients-empty">
                  <BriefcaseBusiness size={32} />
                  <h3>No job openings found</h3>
                  <p>Change the filters or create a new hiring requirement.</p>
                  <button className="clients-btn clients-btn-primary" onClick={() => openAddOpening()}>
                    <Plus size={17} /> Add Opening
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modal === "client" && (
        <div className="clients-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}>
          <div className="clients-modal clients-large-modal">
            <div className="clients-modal-header">
              <div>
                <span className="clients-modal-kicker">CLIENT MANAGEMENT</span>
                <h2>{editingId ? "Edit Company" : "Add New Company"}</h2>
                <p>Maintain company and hiring contact information.</p>
              </div>
              <button className="clients-icon-button" onClick={() => setModal(null)}>
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveClient}>
              <div className="clients-form-section">
                <h3><Building2 size={17} /> Company Information</h3>
                <div className="clients-form-grid">
                  <label className="clients-field">
                    Company name *
                    <input required value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} placeholder="e.g. ABC Technologies" />
                  </label>
                  <label className="clients-field">
                    Industry *
                    <input required value={clientForm.industry} onChange={(e) => setClientForm({ ...clientForm, industry: e.target.value })} placeholder="e.g. Information Technology" />
                  </label>
                  <label className="clients-field">
                    Company website
                    <input type="url" value={clientForm.website} onChange={(e) => setClientForm({ ...clientForm, website: e.target.value })} placeholder="https://company.com" />
                  </label>
                  <label className="clients-field">
                    Company location *
                    <input required value={clientForm.location} onChange={(e) => setClientForm({ ...clientForm, location: e.target.value })} placeholder="City, State" />
                  </label>
                  <label className="clients-field">
                    Employee size
                    <select value={clientForm.employees} onChange={(e) => setClientForm({ ...clientForm, employees: e.target.value })}>
                      <option value="">Select company size</option>
                      <option>1–50</option>
                      <option>50–200</option>
                      <option>100–500</option>
                      <option>500–1000</option>
                      <option>1000+</option>
                    </select>
                  </label>
                  <label className="clients-field">
                    Partnership status
                    <select value={clientForm.partnership} onChange={(e) => setClientForm({ ...clientForm, partnership: e.target.value })}>
                      <option>Active</option>
                      <option>On Hold</option>
                      <option>Inactive</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="clients-form-section">
                <h3><UserRound size={17} /> Hiring Contact</h3>
                <div className="clients-form-grid">
                  <label className="clients-field">
                    Contact person *
                    <input required value={clientForm.contactName} onChange={(e) => setClientForm({ ...clientForm, contactName: e.target.value })} placeholder="HR / Hiring manager name" />
                  </label>
                  <label className="clients-field">
                    Contact designation
                    <input value={clientForm.contactRole} onChange={(e) => setClientForm({ ...clientForm, contactRole: e.target.value })} placeholder="e.g. HR Manager" />
                  </label>
                  <label className="clients-field">
                    Email address *
                    <input required type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} placeholder="hr@company.com" />
                  </label>
                  <label className="clients-field">
                    Phone number
                    <input type="tel" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} placeholder="+91 ..." />
                  </label>
                  <label className="clients-field">
                    Partnership start date
                    <input type="date" value={clientForm.joined} onChange={(e) => setClientForm({ ...clientForm, joined: e.target.value })} />
                  </label>
                  <label className="clients-field clients-field-full">
                    Notes / hiring preferences
                    <textarea rows="3" value={clientForm.notes} onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })} placeholder="Preferred skills, hiring expectations, agreement notes..." />
                  </label>
                </div>
              </div>

              <div className="clients-modal-footer">
                <button type="button" className="clients-btn clients-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="clients-btn clients-btn-primary">
                  <CheckCircle2 size={17} /> {editingId ? "Save Changes" : "Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "opening" && (
        <div className="clients-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}>
          <div className="clients-modal clients-large-modal">
            <div className="clients-modal-header">
              <div>
                <span className="clients-modal-kicker">RECRUITMENT REQUIREMENT</span>
                <h2>{editingId ? "Edit Job Opening" : "Add Job Opening"}</h2>
                <p>Capture the complete requirement provided by the client.</p>
              </div>
              <button className="clients-icon-button" onClick={() => setModal(null)}>
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveOpening}>
              <div className="clients-form-section">
                <h3><BriefcaseBusiness size={17} /> Role Details</h3>
                <div className="clients-form-grid">
                  <label className="clients-field">
                    Client company *
                    <select required value={openingForm.clientId} onChange={(e) => setOpeningForm({ ...openingForm, clientId: e.target.value })}>
                      <option value="">Select company</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="clients-field">
                    Job title *
                    <input required value={openingForm.title} onChange={(e) => setOpeningForm({ ...openingForm, title: e.target.value })} placeholder="e.g. Java Developer" />
                  </label>
                  <label className="clients-field">
                    Department
                    <input value={openingForm.department} onChange={(e) => setOpeningForm({ ...openingForm, department: e.target.value })} placeholder="e.g. Engineering" />
                  </label>
                  <label className="clients-field">
                    Job location *
                    <input required value={openingForm.location} onChange={(e) => setOpeningForm({ ...openingForm, location: e.target.value })} placeholder="City / Hybrid / Remote" />
                  </label>
                  <label className="clients-field">
                    Employment type
                    <select value={openingForm.workType} onChange={(e) => setOpeningForm({ ...openingForm, workType: e.target.value })}>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Temporary</option>
                    </select>
                  </label>
                  <label className="clients-field">
                    Experience required *
                    <input required value={openingForm.experience} onChange={(e) => setOpeningForm({ ...openingForm, experience: e.target.value })} placeholder="e.g. 0–2 years" />
                  </label>
                  <label className="clients-field">
                    Vacancies *
                    <input required min="1" type="number" value={openingForm.vacancies} onChange={(e) => setOpeningForm({ ...openingForm, vacancies: e.target.value })} />
                  </label>
                  <label className="clients-field">
                    Required qualification *
                    <input required value={openingForm.qualification} onChange={(e) => setOpeningForm({ ...openingForm, qualification: e.target.value })} placeholder="e.g. B.Tech / MCA / equivalent" />
                  </label>
                  <label className="clients-field clients-field-full">
                    Required skills *
                    <input required value={openingForm.skillsText} onChange={(e) => setOpeningForm({ ...openingForm, skillsText: e.target.value })} placeholder="Java, Spring Boot, SQL, Angular (comma-separated)" />
                    <small>Separate each skill with a comma.</small>
                  </label>
                </div>
              </div>

              <div className="clients-form-section">
                <h3><BadgeIndianRupee size={17} /> Compensation & Hiring Status</h3>
                <div className="clients-form-grid">
                  <label className="clients-field">
                    Minimum salary
                    <input min="0" type="number" step="0.1" value={openingForm.salaryMin} onChange={(e) => setOpeningForm({ ...openingForm, salaryMin: e.target.value })} placeholder="e.g. 3.5" />
                  </label>
                  <label className="clients-field">
                    Maximum salary
                    <input min="0" type="number" step="0.1" value={openingForm.salaryMax} onChange={(e) => setOpeningForm({ ...openingForm, salaryMax: e.target.value })} placeholder="e.g. 6.0" />
                  </label>
                  <label className="clients-field">
                    Salary unit
                    <select value={openingForm.salaryUnit} onChange={(e) => setOpeningForm({ ...openingForm, salaryUnit: e.target.value })}>
                      <option>LPA</option>
                      <option>Monthly</option>
                      <option>Hourly</option>
                    </select>
                  </label>
                  <label className="clients-field">
                    Priority
                    <select value={openingForm.priority} onChange={(e) => setOpeningForm({ ...openingForm, priority: e.target.value })}>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </label>
                  <label className="clients-field">
                    Opening status
                    <select value={openingForm.status} onChange={(e) => setOpeningForm({ ...openingForm, status: e.target.value })}>
                      <option>Open</option>
                      <option>Interviewing</option>
                      <option>On Hold</option>
                      <option>Closed</option>
                    </select>
                  </label>
                  <label className="clients-field">
                    Assigned recruiter
                    <input value={openingForm.recruiter} onChange={(e) => setOpeningForm({ ...openingForm, recruiter: e.target.value })} placeholder="Recruiter name" />
                  </label>
                  <label className="clients-field">
                    Posted date
                    <input type="date" value={openingForm.postedDate} onChange={(e) => setOpeningForm({ ...openingForm, postedDate: e.target.value })} />
                  </label>
                  <label className="clients-field">
                    Application deadline
                    <input type="date" value={openingForm.deadline} onChange={(e) => setOpeningForm({ ...openingForm, deadline: e.target.value })} />
                  </label>
                  <label className="clients-field clients-field-full">
                    Job description
                    <textarea rows="3" value={openingForm.description} onChange={(e) => setOpeningForm({ ...openingForm, description: e.target.value })} placeholder="Responsibilities, day-to-day work, must-have requirements..." />
                  </label>
                </div>
              </div>

              <div className="clients-form-section">
                <h3><ClipboardList size={17} /> Interview Process</h3>
                <label className="clients-field">
                  Interview rounds *
                  <textarea required rows="5" value={openingForm.interviewText} onChange={(e) => setOpeningForm({ ...openingForm, interviewText: e.target.value })} placeholder={"Resume screening\nOnline assessment\nTechnical interview\nManagerial round\nHR discussion"} />
                  <small>Enter one round per line, in the order candidates will complete them.</small>
                </label>
              </div>

              <div className="clients-modal-footer">
                <button type="button" className="clients-btn clients-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="clients-btn clients-btn-primary">
                  <CheckCircle2 size={17} /> {editingId ? "Save Changes" : "Create Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(selectedClient || selectedOpening) && (
        <div className="clients-drawer-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeDetails();
        }}>
          <aside className="clients-drawer">
            <div className="clients-drawer-header">
              <div>
                <span className="clients-modal-kicker">
                  {selectedClient ? "COMPANY PROFILE" : "JOB REQUIREMENT"}
                </span>
                <h2>{selectedClient ? selectedClient.name : selectedOpening.title}</h2>
                <p>
                  {selectedClient
                    ? selectedClient.industry
                    : getClient(selectedOpening.clientId)?.name}
                </p>
              </div>
              <button className="clients-icon-button" onClick={closeDetails}>
                <X size={19} />
              </button>
            </div>

            {selectedClient && (
              <div className="clients-drawer-body">
                <div className="clients-drawer-company-banner">
                  <div className="clients-company-avatar clients-company-avatar-large">
                    {selectedClient.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <StatusBadge value={selectedClient.partnership} />
                    <p>Partner since {selectedClient.joined || "Not recorded"}</p>
                  </div>
                </div>

                <div className="clients-detail-section">
                  <h3><Building2 size={17} /> Company Details</h3>
                  <div className="clients-detail-grid">
                    <div><span>Industry</span><strong>{selectedClient.industry || "—"}</strong></div>
                    <div><span>Employee size</span><strong>{selectedClient.employees || "—"}</strong></div>
                    <div><span>Location</span><strong>{selectedClient.location || "—"}</strong></div>
                    <div><span>Website</span>
                      {selectedClient.website ? (
                        <a href={selectedClient.website} target="_blank" rel="noreferrer">
                          Visit website <ExternalLink size={13} />
                        </a>
                      ) : <strong>—</strong>}
                    </div>
                  </div>
                </div>

                <div className="clients-detail-section">
                  <h3><UserRound size={17} /> Hiring Contact</h3>
                  <div className="clients-contact-card">
                    <strong>{selectedClient.contactName || "Contact not added"}</strong>
                    <span>{selectedClient.contactRole || "Hiring contact"}</span>
                    <p><Mail size={15} /> {selectedClient.email || "—"}</p>
                    <p><Phone size={15} /> {selectedClient.phone || "—"}</p>
                  </div>
                </div>

                <div className="clients-detail-section">
                  <h3><BriefcaseBusiness size={17} /> Open Requirements</h3>
                  {openings.filter((opening) => opening.clientId === selectedClient.id).length === 0 ? (
                    <p className="clients-detail-muted">No job openings for this company yet.</p>
                  ) : (
                    openings.filter((opening) => opening.clientId === selectedClient.id).map((opening) => (
                      <button className="clients-drawer-opening" key={opening.id} onClick={() => showOpeningDetails(opening)}>
                        <span><strong>{opening.title}</strong><small>{opening.vacancies} vacancies · {opening.experience}</small></span>
                        <StatusBadge value={opening.status} />
                      </button>
                    ))
                  )}
                </div>

                <div className="clients-detail-section">
                  <h3><FileText size={17} /> Notes</h3>
                  <p className="clients-notes-box">{selectedClient.notes || "No additional notes recorded."}</p>
                </div>

                <div className="clients-drawer-actions">
                  <button className="clients-btn clients-btn-secondary" onClick={() => openEditClient(selectedClient)}>
                    <Pencil size={16} /> Edit Company
                  </button>
                  <button className="clients-btn clients-btn-primary" onClick={() => openAddOpening(selectedClient.id)}>
                    <Plus size={17} /> Add Opening
                  </button>
                </div>
              </div>
            )}

            {selectedOpening && (
              <div className="clients-drawer-body">
                <div className="clients-opening-banner">
                  <div>
                    <StatusBadge value={selectedOpening.status} />
                    <span className={`clients-priority ${String(selectedOpening.priority).toLowerCase()}`}>
                      {selectedOpening.priority} priority
                    </span>
                  </div>
                  <p>{selectedOpening.description || "No job description provided."}</p>
                </div>

                <div className="clients-detail-section">
                  <h3><BriefcaseBusiness size={17} /> Role Overview</h3>
                  <div className="clients-detail-grid">
                    <div><span>Company</span><strong>{getClient(selectedOpening.clientId)?.name || "—"}</strong></div>
                    <div><span>Department</span><strong>{selectedOpening.department || "—"}</strong></div>
                    <div><span>Location</span><strong>{selectedOpening.location || "—"}</strong></div>
                    <div><span>Employment</span><strong>{selectedOpening.workType || "—"}</strong></div>
                    <div><span>Experience</span><strong>{selectedOpening.experience || "—"}</strong></div>
                    <div><span>Vacancies</span><strong>{selectedOpening.vacancies}</strong></div>
                    <div><span>Salary range</span><strong>{currency(selectedOpening.salaryMin)} – {currency(selectedOpening.salaryMax)}</strong></div>
                    <div><span>Recruiter</span><strong>{selectedOpening.recruiter || "Unassigned"}</strong></div>
                    <div><span>Posted date</span><strong>{selectedOpening.postedDate || "—"}</strong></div>
                    <div><span>Deadline</span><strong>{selectedOpening.deadline || "Not set"}</strong></div>
                  </div>
                </div>

                <div className="clients-detail-section">
                  <h3><GraduationCap size={17} /> Qualification</h3>
                  <p className="clients-notes-box">{selectedOpening.qualification || "Not specified"}</p>
                </div>

                <div className="clients-detail-section">
                  <h3><CheckCircle2 size={17} /> Required Skills</h3>
                  <div className="clients-drawer-skills">
                    {(selectedOpening.skills || []).length ? selectedOpening.skills.map((skill) => (
                      <span className="clients-skill-chip" key={skill}>{skill}</span>
                    )) : <span className="clients-detail-muted">No skills added</span>}
                  </div>
                </div>

                <div className="clients-detail-section">
                  <h3><ClipboardList size={17} /> Interview Process</h3>
                  <div className="clients-interview-steps">
                    {(selectedOpening.interviewProcess || []).map((step, index) => (
                      <div className="clients-interview-step" key={`${step}-${index}`}>
                        <span className="clients-interview-number">{index + 1}</span>
                        <div>
                          <strong>{step}</strong>
                          <small>{index === 0 ? "Initial stage" : `Round ${index + 1}`}</small>
                        </div>
                        {index === (selectedOpening.interviewProcess || []).length - 1 ? (
                          <CheckCircle2 size={17} />
                        ) : <CircleDot size={17} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="clients-drawer-actions">
                  <button className="clients-btn clients-btn-secondary" onClick={() => openEditOpening(selectedOpening)}>
                    <Pencil size={16} /> Edit Opening
                  </button>
                  <button
                    className="clients-btn clients-btn-primary"
                    onClick={() => {
                      const updatedStatus =
                        selectedOpening.status === "Open" ? "Interviewing" :
                        selectedOpening.status === "Interviewing" ? "Closed" :
                        "Open";
                      setOpenings((previous) => previous.map((opening) =>
                        opening.id === selectedOpening.id
                          ? { ...opening, status: updatedStatus }
                          : opening
                      ));
                      setSelectedOpening({ ...selectedOpening, status: updatedStatus });
                      notify(`Opening status changed to ${updatedStatus}.`);
                    }}
                  >
                    <RefreshCwIcon /> Update Status
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {confirmDelete && (
        <div className="clients-modal-backdrop">
          <div className="clients-confirm-modal">
            <div className="clients-confirm-icon"><Trash2 size={23} /></div>
            <h2>Delete {confirmDelete.type === "client" ? "company" : "job opening"}?</h2>
            <p>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
              {confirmDelete.type === "client" && " Its associated job openings will also be removed."}
              {" "}This action cannot be undone.
            </p>
            <div className="clients-modal-footer">
              <button className="clients-btn clients-btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="clients-btn clients-btn-danger"
                onClick={() =>
                  confirmDelete.type === "client"
                    ? deleteClient(confirmDelete.id)
                    : deleteOpening(confirmDelete.id)
                }
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="clients-toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

function RefreshCwIcon() {
  return <Clock3 size={16} />;
}
