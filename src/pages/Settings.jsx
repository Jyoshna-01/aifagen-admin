
import { useState } from "react";
import "./Settings.css";
import useAssistantContext from "../hooks/useAssistantContext";

const CURRENT_ADMIN = "admin@aifagen.com";

const initialAdmins = [
  { id: 1, email: "admin@aifagen.com", dateAdded: "Sep 12, 2026", status: "Active" },
  { id: 2, email: "support@aifagen.com", dateAdded: "Sep 18, 2026", status: "Active" },
  { id: 3, email: "operations@aifagen.com", dateAdded: "Sep 25, 2026", status: "Active" },
];

const initialServices = [
  {
    id: 1,
    name: "Payment Gateway",
    description: "Processes subscriptions and customer payments.",
    status: "OK",
    icon: "↗",
  },
  {
    id: 2,
    name: "Email Service",
    description: "Sends login, payment and system notifications.",
    status: "OK",
    icon: "✉",
  },
  {
    id: 3,
    name: "Job Collection Service",
    description: "Collects job listings from configured sources.",
    status: "Needs attention",
    icon: "⌘",
    issue: "One or more job sources are not responding.",
  },
  {
    id: 4,
    name: "AI Provider",
    description: "Supports resume analysis and AI-powered job matching.",
    status: "OK",
    icon: "✳",
  },
  {
    id: 5,
    name: "File Storage",
    description: "Stores uploaded resumes and other documents.",
    status: "Needs attention",
    icon: "▤",
    issue: "Storage credentials need to be checked.",
  },
];

export default function Settings({ onAssistantContext }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [services, setServices] = useState(initialServices);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [adminToRemove, setAdminToRemove] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState("Just now");
  const [message, setMessage] = useState({ type: "", text: "" });

  const healthyServices = services.filter(
    (service) => service.status === "OK"
  ).length;

  const attentionServices = services.length - healthyServices;
  useAssistantContext(onAssistantContext, "Settings", {
    admins: admins.map(({ status }) => ({ status })),
    services: services.map(({ name, status, issue }) => ({ name, status, issue })),
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  const handleAddAdmin = (event) => {
    event.preventDefault();

    const email = newAdminEmail.trim().toLowerCase();

    if (!email) {
      setEmailError("Please enter an email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (admins.some((admin) => admin.email.toLowerCase() === email)) {
      setEmailError("This email already has admin access.");
      return;
    }

    const newAdmin = {
      id: Date.now(),
      email,
      dateAdded: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      status: "Active",
    };

    setAdmins((previous) => [...previous, newAdmin]);
    setNewAdminEmail("");
    setEmailError("");
    setShowAddModal(false);
    showMessage("success", `${email} has been added as an admin.`);
  };

  const handleRemoveAdmin = () => {
    if (!adminToRemove) return;

    if (adminToRemove.email === CURRENT_ADMIN) {
      showMessage("error", "You cannot remove your own admin account.");
      setAdminToRemove(null);
      return;
    }

    if (admins.length <= 1) {
      showMessage("error", "The last admin cannot be removed.");
      setAdminToRemove(null);
      return;
    }

    setAdmins((previous) =>
      previous.filter((admin) => admin.id !== adminToRemove.id)
    );

    showMessage(
      "success",
      `${adminToRemove.email} has been removed from admins.`
    );
    setAdminToRemove(null);
  };

  const refreshServices = () => {
    if (refreshing) return;

    setRefreshing(true);

    // Demo-only refresh: replace this with a backend health-check API.
    window.setTimeout(() => {
      setRefreshing(false);
      setLastChecked(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      showMessage(
        "success",
        "Demo service status has been refreshed. Connect a backend for live checks."
      );
    }, 800);
  };

  const closeMessage = () => setMessage({ type: "", text: "" });

  return (
    <main className="settings-page">
      <header className="settings-header">
        <div>
          <div className="settings-breadcrumb">
            Administration <span>/</span> Settings
          </div>
          <h1>Settings</h1>
          <p>
            Manage administrator access and monitor connected services.
          </p>
        </div>

        <button
          className="settings-refresh-btn"
          onClick={refreshServices}
          disabled={refreshing}
          type="button"
        >
          <span className={refreshing ? "refresh-symbol spinning" : "refresh-symbol"}>
            ↻
          </span>
          {refreshing ? "Checking..." : "Refresh status"}
        </button>
      </header>

      {message.text && (
        <div
          className={`settings-message ${message.type}`}
          role="status"
        >
          <span>{message.type === "success" ? "✓" : "!"}</span>
          <p>{message.text}</p>
          <button type="button" onClick={closeMessage} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      <section className="settings-summary">
        <article className="settings-summary-card">
          <div className="settings-summary-icon">A</div>
          <div>
            <span>Total administrators</span>
            <strong>{admins.length}</strong>
            <small>Accounts with admin access</small>
          </div>
        </article>

        <article className="settings-summary-card">
          <div className="settings-summary-icon">✓</div>
          <div>
            <span>Services healthy</span>
            <strong>{healthyServices}</strong>
            <small>Services reporting OK in demo data</small>
          </div>
        </article>

        <article className="settings-summary-card">
          <div className="settings-summary-icon warning-icon">!</div>
          <div>
            <span>Need attention</span>
            <strong>{attentionServices}</strong>
            <small>Services marked for review</small>
          </div>
        </article>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">ACCESS CONTROL</span>
            <h2>Admin accounts</h2>
            <p>Control who can access the AIFAGen administration portal.</p>
          </div>

          <button
            className="settings-primary-btn"
            type="button"
            onClick={() => {
              setEmailError("");
              setNewAdminEmail("");
              setShowAddModal(true);
            }}
          >
            <span>+</span> Add admin
          </button>
        </div>

        <div className="settings-panel">
          <div className="settings-panel-heading">
            <div>
              <h3>Administrators</h3>
              <p>
                {admins.length} account{admins.length !== 1 ? "s" : ""} with
                admin access
              </p>
            </div>
            <span className="settings-secure-label">
              <span>●</span> Admin access only
            </span>
          </div>

          <div className="settings-admin-list">
            {admins.map((admin) => {
              const isCurrentAdmin = admin.email === CURRENT_ADMIN;

              return (
                <div className="settings-admin-row" key={admin.id}>
                  <div className="settings-admin-person">
                    <div className="settings-admin-avatar">
                      {admin.email.charAt(0).toUpperCase()}
                    </div>

                    <div className="settings-admin-info">
                      <div className="settings-admin-email">
                        {admin.email}
                        {isCurrentAdmin && (
                          <span className="settings-you-label">You</span>
                        )}
                      </div>
                      <p>Added {admin.dateAdded}</p>
                    </div>
                  </div>

                  <div className="settings-admin-actions">
                    <span className="settings-active-status">
                      <span /> {admin.status}
                    </span>
                    <button
                      type="button"
                      className="settings-remove-btn"
                      disabled={isCurrentAdmin}
                      title={
                        isCurrentAdmin
                          ? "You cannot remove your own account"
                          : "Remove admin"
                      }
                      onClick={() => setAdminToRemove(admin)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="settings-note">
            <span>i</span>
            <p>
              Admin access provides access to the administration portal.
              These demo changes are stored in component state only.
            </p>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">SYSTEM MONITORING</span>
            <h2>Connected services</h2>
            <p>
              Review the sample status of services used by the AIFAGen platform.
            </p>
          </div>

          <div className="settings-service-counts">
            <span className="settings-count-ok">● {healthyServices} OK</span>
            <span className="settings-count-warning">
              ● {attentionServices} need attention
            </span>
          </div>
        </div>

        <div className="settings-panel settings-services-panel">
          {services.map((service) => {
            const isHealthy = service.status === "OK";

            return (
              <article
                className={`settings-service-row ${
                  isHealthy ? "" : "has-warning"
                }`}
                key={service.id}
              >
                <div className="settings-service-main">
                  <div className="settings-service-icon">{service.icon}</div>

                  <div className="settings-service-details">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>

                    {service.issue && (
                      <div className="settings-service-issue">
                        <span>!</span> {service.issue}
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={`settings-service-status ${
                    isHealthy ? "status-ok" : "status-warning"
                  }`}
                >
                  <span>{isHealthy ? "✓" : "!"}</span>
                  {service.status}
                </span>
              </article>
            );
          })}

          <div className="settings-services-footer">
            <span>
              <span className="settings-footer-dot" />
              Last checked: {lastChecked}
            </span>
            <button
              type="button"
              onClick={refreshServices}
              disabled={refreshing}
            >
              {refreshing ? "Checking..." : "Check again →"}
            </button>
          </div>
        </div>
      </section>

      {showAddModal && (
        <div
          className="settings-modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <section
            className="settings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-admin-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="settings-modal-top">
              <div className="settings-modal-icon">+</div>
              <button
                type="button"
                className="settings-modal-close"
                onClick={() => setShowAddModal(false)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <h2 id="add-admin-title">Add administrator</h2>
            <p className="settings-modal-description">
              Enter the email address of the person who needs admin access.
            </p>

            <form onSubmit={handleAddAdmin}>
              <label htmlFor="admin-email">Email address</label>
              <input
                id="admin-email"
                type="email"
                value={newAdminEmail}
                onChange={(event) => {
                  setNewAdminEmail(event.target.value);
                  setEmailError("");
                }}
                placeholder="name@aifagen.com"
                autoFocus
                required
              />

              {emailError && (
                <p className="settings-input-error">{emailError}</p>
              )}

              <div className="settings-modal-info">
                <span>i</span>
                The new administrator will have full portal access.
              </div>

              <div className="settings-modal-actions">
                <button
                  type="button"
                  className="settings-cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="settings-primary-btn">
                  Add administrator
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {adminToRemove && (
        <div
          className="settings-modal-overlay"
          onClick={() => setAdminToRemove(null)}
        >
          <section
            className="settings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-admin-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="settings-modal-top">
              <div className="settings-danger-icon">!</div>
              <button
                type="button"
                className="settings-modal-close"
                onClick={() => setAdminToRemove(null)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <h2 id="remove-admin-title">Remove administrator?</h2>
            <p className="settings-modal-description">
              Are you sure you want to remove admin access for this account?
            </p>

            <div className="settings-remove-email">
              {adminToRemove.email}
            </div>

            <p className="settings-warning-copy">
              This account will no longer have access to the administration
              portal.
            </p>

            <div className="settings-modal-actions">
              <button
                type="button"
                className="settings-cancel-btn"
                onClick={() => setAdminToRemove(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="settings-danger-btn"
                onClick={handleRemoveAdmin}
              >
                Remove admin
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
