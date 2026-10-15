
import { useMemo, useState } from "react";
import "./InternalJobs.css";
import useAssistantContext from "../hooks/useAssistantContext";

const emptyForm = {
  title: "",
  department: "",
  location: "",
  employmentType: "Full Time",
  description: "",
  skills: "",
  applyLink: "",
  visible: true,
};

const initialJobs = [
  {
    id: 1,
    title: "Java Full Stack Developer",
    department: "Engineering",
    location: "Hyderabad",
    employmentType: "Full Time",
    description:
      "We are looking for a Java Full Stack Developer to join our engineering team.",
    skills: "Java, Spring Boot, Angular, MySQL",
    applyLink: "https://aifagen.com/careers/java-developer",
    visible: true,
    createdDate: "Oct 08, 2026",
  },
  {
    id: 2,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Hyderabad",
    employmentType: "Full Time",
    description:
      "Build modern and responsive web experiences for AIFAGen users.",
    skills: "React, JavaScript, HTML, CSS",
    applyLink: "mailto:careers@aifagen.com",
    visible: true,
    createdDate: "Oct 06, 2026",
  },
  {
    id: 3,
    title: "HR Intern",
    department: "Human Resources",
    location: "Remote",
    employmentType: "Internship",
    description:
      "Support the HR team with recruitment and employee engagement activities.",
    skills: "Communication, Recruitment, MS Office",
    applyLink: "https://aifagen.com/careers/hr-intern",
    visible: false,
    createdDate: "Oct 03, 2026",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    department: "Design",
    location: "Bangalore",
    employmentType: "Full Time",
    description:
      "Design intuitive and beautiful experiences for our products.",
    skills: "Figma, UI Design, UX Research",
    applyLink: "mailto:careers@aifagen.com",
    visible: true,
    createdDate: "Sep 29, 2026",
  },
];

function getLocalDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function validateApplyLink(link) {
  const value = link.trim();

  if (!value) return true;

  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function InternalJobs({ onAssistantContext }) {
  const [form, setForm] = useState({ ...emptyForm });
  const [jobs, setJobs] = useState(initialJobs);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("All");
  const [employmentFilter, setEmploymentFilter] = useState("All");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const visibleJobs = jobs.filter((job) => job.visible).length;
  const hiddenJobs = jobs.length - visibleJobs;

  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch = [
        job.title,
        job.department,
        job.location,
        job.description,
        job.skills,
      ].some((value) => value.toLowerCase().includes(searchText));

      const matchesVisibility =
        visibilityFilter === "All" ||
        (visibilityFilter === "Visible" && job.visible) ||
        (visibilityFilter === "Hidden" && !job.visible);

      const matchesEmployment =
        employmentFilter === "All" ||
        job.employmentType === employmentFilter;

      return matchesSearch && matchesVisibility && matchesEmployment;
    });
  }, [jobs, search, visibilityFilter, employmentFilter]);
  useAssistantContext(onAssistantContext, "Internal Jobs", {
    jobs: jobs.map(({ title, department, location, description, skills, applyLink, visible }) => ({
      title, department, location, description, skills, applyLink, visible,
    })),
    filtered: filteredJobs.length,
    filters: `visibility ${visibilityFilter}; employment ${employmentFilter}${search ? "; search active" : ""}`,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      window.alert("Please enter the job title and description.");
      return;
    }

    if (!validateApplyLink(form.applyLink)) {
      window.alert(
        "Enter a valid HTTP/HTTPS URL or an email link such as mailto:careers@aifagen.com."
      );
      return;
    }

    if (editingId !== null) {
      setJobs((previous) =>
        previous.map((job) =>
          job.id === editingId
            ? {
                ...job,
                ...form,
                title: form.title.trim(),
                department: form.department.trim(),
                location: form.location.trim(),
                description: form.description.trim(),
                skills: form.skills.trim(),
                applyLink: form.applyLink.trim(),
              }
            : job
        )
      );

      window.alert("Job posting updated successfully.");
    } else {
      const newJob = {
        ...form,
        id: Date.now(),
        title: form.title.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        skills: form.skills.trim(),
        applyLink: form.applyLink.trim(),
        createdDate: getLocalDate(),
      };

      setJobs((previous) => [newJob, ...previous]);
      window.alert("Internal job created successfully.");

      setSearch("");
      setVisibilityFilter("All");
      setEmploymentFilter("All");
    }

    resetForm();
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      description: job.description,
      skills: job.skills,
      applyLink: job.applyLink,
      visible: job.visible,
    });

    setEditingId(job.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = (id) => {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === id
          ? { ...job, visible: !job.visible }
          : job
      )
    );
  };

  const confirmDelete = () => {
    if (!jobToDelete) return;

    setJobs((previous) =>
      previous.filter((job) => job.id !== jobToDelete.id)
    );

    if (editingId === jobToDelete.id) {
      resetForm();
    }

    setJobToDelete(null);
    setShowDeleteModal(false);
  };

  const exportCSV = () => {
    const headers = [
      "Job ID",
      "Title",
      "Department",
      "Location",
      "Employment Type",
      "Description",
      "Skills",
      "Apply Link",
      "Visibility",
      "Created Date",
    ];

    const rows = filteredJobs.map((job) => [
      job.id,
      job.title,
      job.department,
      job.location,
      job.employmentType,
      job.description,
      job.skills,
      job.applyLink,
      job.visible ? "Visible" : "Hidden",
      job.createdDate,
    ]);

    const escapeCSV = (value) => {
      let text = String(value ?? "");

      // Reduce spreadsheet formula injection risk for exported text.
      if (/^[\s]*[=+\-@\t\r]/.test(text)) {
        text = `'${text}`;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "aifagen-internal-jobs.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="internal-jobs-page">
      {/* HEADER */}
      <div className="internal-jobs-header">
        <div>
          <h1>Internal Jobs</h1>
          <p>
            Create and manage job openings posted directly by AIFAGen.
          </p>
        </div>

        <div className="internal-job-stats">
          <div className="mini-stat">
            <span>Total postings</span>
            <strong>{jobs.length}</strong>
          </div>

          <div className="mini-stat visible-mini">
            <span>Visible</span>
            <strong>{visibleJobs}</strong>
          </div>

          <div className="mini-stat hidden-mini">
            <span>Hidden</span>
            <strong>{hiddenJobs}</strong>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT FORM */}
      <div className="internal-form-card">
        <div className="internal-form-header">
          <div className="form-title-area">
            <div className="form-icon">{editingId !== null ? "✎" : "+"}</div>

            <div>
              <h2>
                {editingId !== null
                  ? "Edit Job Posting"
                  : "Create Internal Job"}
              </h2>
              <p>
                {editingId !== null
                  ? "Update the details of this job posting."
                  : "Add a new job opening to your careers page."}
              </p>
            </div>
          </div>

          {editingId !== null && (
            <button
              type="button"
              className="cancel-edit-top"
              onClick={resetForm}
            >
              Cancel editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="internal-job-title">
                Job Title <span>*</span>
              </label>
              <input
                id="internal-job-title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Java Full Stack Developer"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="internal-job-department">Department</label>
              <input
                id="internal-job-department"
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Engineering"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="internal-job-location">Location</label>
              <div className="input-with-icon">
                <span aria-hidden="true">📍</span>
                <input
                  id="internal-job-location"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad / Remote"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="internal-job-type">Employment Type</label>
              <select
                id="internal-job-type"
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>
          </div>

          <div className="form-field full-field">
            <label htmlFor="internal-job-description">
              Job Description <span>*</span>
            </label>
            <textarea
              id="internal-job-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities and requirements..."
              rows={6}
              required
            />
            <small>
              Give candidates enough information to understand the role.
            </small>
          </div>

          <div className="form-field full-field">
            <label htmlFor="internal-job-skills">Skills</label>
            <input
              id="internal-job-skills"
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Java, Spring Boot, React, MongoDB"
            />
            <small>Separate skills using commas.</small>
          </div>

          <div className="form-field full-field">
            <label htmlFor="internal-job-apply-link">Apply Link</label>
            <div className="input-with-icon">
              <span aria-hidden="true">🔗</span>
              <input
                id="internal-job-apply-link"
                type="text"
                name="applyLink"
                value={form.applyLink}
                onChange={handleChange}
                placeholder="https://... or mailto:careers@aifagen.com"
              />
            </div>
            <small>
              Enter an HTTP/HTTPS URL or an email link beginning with mailto:.
            </small>
          </div>

          <div className="visibility-setting">
            <div className="visibility-text">
              <strong>Visible on site</strong>
              <span>
                {form.visible
                  ? "Candidates can see and apply for this job."
                  : "This job will be saved but hidden from candidates."}
              </span>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                name="visible"
                checked={form.visible}
                onChange={handleChange}
              />
              <span className="slider" />
            </label>

            <span className="switch-label">
              {form.visible ? "Yes" : "No"}
            </span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="clear-form-btn"
              onClick={resetForm}
            >
              {editingId !== null ? "Cancel" : "Clear"}
            </button>

            <button type="submit" className="publish-job-btn">
              {editingId !== null ? "✓ Save Changes" : "＋ Publish Job"}
            </button>
          </div>
        </form>
      </div>

      {/* JOB LIST HEADER */}
      <div className="postings-section-header">
        <div>
          <h2>Your Job Postings</h2>
          <p>All internally created job openings.</p>
        </div>

        <span>{filteredJobs.length} postings</span>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="internal-job-filters">
        <input
          type="search"
          aria-label="Search internal jobs"
          placeholder="Search title, department, location or skills..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Filter job visibility"
          value={visibilityFilter}
          onChange={(event) => setVisibilityFilter(event.target.value)}
        >
          <option value="All">All visibility</option>
          <option value="Visible">Visible</option>
          <option value="Hidden">Hidden</option>
        </select>

        <select
          aria-label="Filter employment type"
          value={employmentFilter}
          onChange={(event) => setEmploymentFilter(event.target.value)}
        >
          <option value="All">All employment types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>

        <button
          type="button"
          className="clear-form-btn"
          onClick={exportCSV}
        >
          ↓ Export CSV
        </button>
      </div>

      {/* JOB LIST */}
      <div className="internal-jobs-list">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <div className="no-jobs-icon">💼</div>
            <h3>No internal jobs found</h3>
            <p>Try changing your search or filters, or create a new job.</p>
            <button
              type="button"
              className="clear-form-btn"
              onClick={() => {
                setSearch("");
                setVisibilityFilter("All");
                setEmploymentFilter("All");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              className={`internal-job-card ${
                !job.visible ? "job-is-hidden" : ""
              }`}
              key={job.id}
            >
              <div className="internal-company-logo">A</div>

              <div className="internal-job-main">
                <div className="internal-job-title-row">
                  <h3>{job.title}</h3>

                  {job.visible ? (
                    <span className="job-visible-badge">
                      <span />
                      Visible
                    </span>
                  ) : (
                    <span className="job-hidden-badge">
                      <span />
                      Hidden
                    </span>
                  )}
                </div>

                <div className="internal-job-meta">
                  <span>🏢 {job.department || "General"}</span>
                  <span>📍 {job.location || "Not specified"}</span>
                  <span>◷ {job.employmentType}</span>
                  <span>📅 {job.createdDate}</span>
                </div>

                <p className="internal-job-description">
                  {job.description}
                </p>

                <div className="skill-list">
                  {job.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .slice(0, 5)
                    .map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                </div>

                {job.applyLink && (
                  <a
                    className="internal-job-apply-link"
                    href={job.applyLink}
                    target={
                      job.applyLink.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel={
                      job.applyLink.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    onClick={(event) => event.stopPropagation()}
                  >
                    Open application link ↗
                  </a>
                )}
              </div>

              <div className="internal-job-actions">
                <button
                  type="button"
                  className="edit-job-btn"
                  onClick={() => handleEdit(job)}
                >
                  ✎ Edit
                </button>

                <button
                  type="button"
                  className={job.visible ? "hide-job-btn" : "show-job-btn"}
                  onClick={() => toggleVisibility(job.id)}
                >
                  {job.visible ? "◉ Hide" : "Show"}
                </button>

                <button
                  type="button"
                  className="delete-job-btn"
                  onClick={() => {
                    setJobToDelete(job);
                    setShowDeleteModal(true);
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE CONFIRMATION */}
      {showDeleteModal && (
        <div
          className="delete-overlay"
          onClick={() => {
            setShowDeleteModal(false);
            setJobToDelete(null);
          }}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-job-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-warning-icon">!</div>

            <h2 id="delete-job-title">Delete this job?</h2>

            <p>
              You are about to permanently delete
              <strong> "{jobToDelete?.title}"</strong>.
            </p>

            <div className="permanent-warning">
              <strong>⚠ This cannot be undone.</strong>
              <span>
                The job posting and its information will be permanently removed.
              </span>
            </div>

            <div className="delete-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDelete}
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InternalJobs;
