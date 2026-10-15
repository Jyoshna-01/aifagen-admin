
import { useState, useEffect, useCallback } from "react";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import Jobs from "./pages/Jobs";
import InternalJobs from "./pages/InternalJobs";
import JobSources from "./pages/JobSources";
import AIUsage from "./pages/AIUsage";
import AuditLog from "./pages/AuditLog";
import Settings from "./pages/Settings";
import Recruiters from "./pages/Recruiters";
import Hr from "./pages/Hr";
import HRWorkspace from "./pages/HRWorkspace";
import RecruiterWorkspace from "./pages/RecruiterWorkspace";
import Clients from "./pages/Clients";
import FeedbackManagement from "./pages/FeedbackManagement";

import {
  demoMembers,
  initialCandidates,
  initialClients,
} from "./data/demoData";
import {
  initialFeedbackAudit,
  initialFeedbackComplaints,
  initialFeedbackReviews,
} from "./data/feedbackDemoData";
import { Moon, Sun } from "lucide-react";
import AIAssistantPanel, { AIButton } from "./components/AIAssistant";

import "./App.css";

function ThemeToggle({ theme, onToggle, className = "" }) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      className={`appearance-toggle ${className}`.trim()}
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
    >
      <Icon size={18} />
    </button>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [activePage, setActivePage] = useState("Dashboard");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantSnapshot, setAssistantSnapshot] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme preference
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("aifagen-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  // Apply theme globally to the entire application
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("aifagen-theme", theme);
    } catch {
      // App continues if local storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) =>
      previous === "light" ? "dark" : "light"
    );
  };

  const [members] = useState(demoMembers);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [clients, setClients] = useState(initialClients);
  const [feedbackReviews, setFeedbackReviews] = useState(initialFeedbackReviews);
  const [feedbackComplaints, setFeedbackComplaints] = useState(
    initialFeedbackComplaints
  );
  const [feedbackAudit, setFeedbackAudit] = useState(initialFeedbackAudit);

  // Sidebar controls
  const toggleMenu = (forceClose) => {
    if (forceClose === false) {
      setMenuOpen(false);
    } else {
      setMenuOpen((previous) => !previous);
    }
  };

  // Page navigation and automatic sidebar close
  const handleNavigate = (page) => {
    setActivePage(page);
    setAssistantSnapshot(null);
    setMenuOpen(false);
  };

  const reportAssistantContext = useCallback((snapshot) => {
    setAssistantSnapshot(snapshot);
  }, []);

  // Login
  const handleLogin = (user) => {
    setAssistantOpen(false);
    setAssistantSnapshot(null);
    const role = String(user.role || "").toLowerCase();

    if (role === "admin") {
      setCurrentUser({ ...user, role: "admin" });
    } else {
      const matchedMember = members.find(
        (member) =>
          String(member.role || "").toLowerCase() === role &&
          (
            (
              user.email &&
              String(member.email || "").toLowerCase() ===
                String(user.email).toLowerCase()
            ) ||
            (
              user.id != null &&
              String(member.id) === String(user.id)
            )
          )
      );

      setCurrentUser(
        matchedMember
          ? { ...matchedMember, role }
          : { ...user, role }
      );
    }

    setActivePage("Dashboard");
    setMenuOpen(false);
  };

  // Logout
  const handleLogout = () => {
    setAssistantOpen(false);
    setAssistantSnapshot(null);
    setCurrentUser(null);
    setActivePage("Dashboard");
    setMenuOpen(false);
  };

  // Candidate updates
  const handleUpdateCandidate = (id, changes) => {
    setCandidates((previous) =>
      previous.map((candidate) =>
        candidate.id === id
          ? { ...candidate, ...changes }
          : candidate
      )
    );
  };

  const handleAddCandidate = (candidate) => {
    setCandidates((previous) => [
      ...previous,
      {
        ...candidate,
        id: Date.now(),
      },
    ]);
  };

  const handleAddClient = (client) => {
    setClients((previous) => [
      ...previous,
      {
        ...client,
        id: Date.now(),
      },
    ]);
  };

  const renderFeedbackPage = (section) => (
    <FeedbackManagement
      section={section}
      reviews={feedbackReviews}
      setReviews={setFeedbackReviews}
      complaints={feedbackComplaints}
      setComplaints={setFeedbackComplaints}
      audit={feedbackAudit}
      setAudit={setFeedbackAudit}
      currentUser={currentUser}
      onNavigate={handleNavigate}
      onAssistantContext={reportAssistantContext}
    />
  );

  // Admin pages
  const adminPages = {
    Dashboard: <Dashboard onNavigate={handleNavigate} onAssistantContext={reportAssistantContext} />,
    Users: <Users onAssistantContext={reportAssistantContext} />,
    Payments: <Payments onAssistantContext={reportAssistantContext} />,
    Recruiters: <Recruiters onAssistantContext={reportAssistantContext} />,
    Clients: <Clients onAssistantContext={reportAssistantContext} />,
    Hr: <Hr onAssistantContext={reportAssistantContext} />,
    
    Jobs: <Jobs onAssistantContext={reportAssistantContext} />,
    "Internal Jobs": <InternalJobs onAssistantContext={reportAssistantContext} />,
    "Job Sources": <JobSources onAssistantContext={reportAssistantContext} />,
    "AI Usage": <AIUsage onAssistantContext={reportAssistantContext} />,
    "Audit Log": <AuditLog moderationEvents={feedbackAudit} onAssistantContext={reportAssistantContext} />,
    Settings: <Settings onAssistantContext={reportAssistantContext} />,
    "Feedback Overview": renderFeedbackPage("Feedback Overview"),
    "Candidate Reviews": renderFeedbackPage("Candidate Reviews"),
    Complaints: renderFeedbackPage("Complaints"),
    "Moderation History": renderFeedbackPage("Moderation History"),
  };

  // Login screen
  if (!currentUser) {
    return (
      <div
        className={`app-container theme-${theme}`}
        data-theme={theme}
      >
        <ThemeToggle
          theme={theme}
          onToggle={toggleTheme}
          className="login-theme-toggle"
        />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  const isAdmin = currentUser.role === "admin";
  const isHR = currentUser.role === "hr";
  const isRecruiter = currentUser.role === "recruiter";
  const assistantPageId = isAdmin
    ? activePage === "Hr" ? "HR" : activePage
    : isHR ? "HR Workspace" : "Recruiter Workspace";
  const defaultAssistantTitle = isAdmin
    ? activePage === "Hr" ? "HR" : activePage
    : isHR ? "HR Workspace" : "Recruiter Workspace";
  const assistantTitle = assistantSnapshot?.pageId === assistantPageId
    ? assistantSnapshot.title
    : defaultAssistantTitle;

  const activeMember =
    members.find(
      (member) =>
        String(member.email || "").toLowerCase() ===
        String(currentUser.email || "").toLowerCase()
    ) ||
    members.find(
      (member) =>
        String(member.id) === String(currentUser.id) &&
        String(member.role || "").toLowerCase() ===
          String(currentUser.role || "").toLowerCase()
    ) ||
    currentUser;

  return (
    <div
      className={`app-container theme-${theme}`}
      data-theme={theme}
    >
      {/* TOP NAVIGATION */}
      <header className="top-navbar">
        <div className="navbar-left">
          {isAdmin ? (
            <button
              type="button"
              className="navbar-home-button"
              onClick={() => handleNavigate("Dashboard")}
              aria-label="Go to Dashboard"
              title="Go to Dashboard"
            >
              <img
                src="/aifagen-logo.jpg"
                alt="AIFAGen Labs"
                className="sidebar-logo"
              />
            </button>
          ) : (
            <img
              src="/aifagen-logo.jpg"
              alt="AIFAGen Labs"
              className="sidebar-logo"
            />
          )}
        </div>

        <div className="welcome-text">
          <span>Welcome back, {currentUser.name}!</span>
          <small>
            {isAdmin
              ? "Admin Portal"
              : isHR
                ? "HR Workspace"
                : "Recruiter Workspace"}
          </small>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="icon-button"
            aria-label="Messages"
            onClick={() => window.alert("No new messages")}
          >
            ✉
          </button>

          <span className="demo-badge">DEMO ENVIRONMENT</span>

          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          <div className="logged-in-user">
            <span>
              {activeMember?.name ||
                currentUser.name ||
                currentUser.email}
            </span>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sign out
          </button>

          {isAdmin && (
            <button
              type="button"
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label={
                menuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={menuOpen}
            >
              <span>{menuOpen ? "✕" : "☰"}</span>
            </button>
          )}
        </div>
      </header>

      {/* ADMIN WORKSPACE */}
      {isAdmin && (
        <>
          <Sidebar
            activePage={activePage}
            onNavigate={handleNavigate}
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
          />

          <main className="main-content">
            {adminPages[activePage] || (
              <Dashboard onNavigate={handleNavigate} />
            )}

            <footer className="page-footer">
              <span>© 2026 AIFAGen Admin Portal</span>
              <span>
                Demo interface · Not connected to production data
              </span>
            </footer>
          </main>
        </>
      )}

      {/* HR WORKSPACE */}
      {isHR && (
        <main className="role-main-content">
          <HRWorkspace
            member={activeMember}
            members={members}
            candidates={candidates}
            clients={clients}
            onAddCandidate={handleAddCandidate}
            onAddClient={handleAddClient}
            onUpdateCandidate={handleUpdateCandidate}
            onAssistantContext={reportAssistantContext}
          />

          <footer className="page-footer">
            <span>© 2026 AIFAGen HR Workspace</span>
            <span>Frontend demo · Sample data only</span>
          </footer>
        </main>
      )}

      {/* RECRUITER WORKSPACE */}
      {isRecruiter && (
        <main className="role-main-content">
          <RecruiterWorkspace
            member={activeMember}
            candidates={candidates}
            onUpdateCandidate={handleUpdateCandidate}
            onAssistantContext={reportAssistantContext}
          />

          <footer className="page-footer">
            <span>© 2026 AIFAGen Recruiter Workspace</span>
            <span>Frontend demo · Sample data only</span>
          </footer>
        </main>
      )}

      {/* INVALID ROLE */}
      {!isAdmin && !isHR && !isRecruiter && (
        <main className="role-main-content">
          <section className="workspace-panel">
            <h2>Workspace unavailable</h2>
            <p>
              This account does not have a recognized workspace role.
              Please sign out and use an Admin, HR, or Recruiter demo account.
            </p>
          </section>
        </main>
      )}

      {(isAdmin || isHR || isRecruiter) && (
        <>
          <AIButton
            onClick={() => setAssistantOpen((open) => !open)}
            expanded={assistantOpen}
          />
          <AIAssistantPanel
            pageId={assistantPageId}
            title={assistantTitle}
            snapshot={assistantSnapshot}
            open={assistantOpen}
            onClose={() => setAssistantOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default App;
