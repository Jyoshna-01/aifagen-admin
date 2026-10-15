// Sidebar.jsx

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Building2,
  BriefcaseBusiness,
  CreditCard,
  Sparkles,
  ClipboardList,
  Settings,
  Menu,
  X,
  FileText,
  Database,
  UserCog,
  LogOut,
  ChevronDown,
  MessageSquareWarning,
  Star,
  Flag,
} from "lucide-react";


import "./Sidebar.css";

const feedbackPages = [
  "Feedback Overview",
  "Candidate Reviews",
  "Complaints",
  "Moderation History",
];

export default function Sidebar({
  activePage,
  onNavigate,
  menuOpen,
  toggleMenu,
}) {
  const [managementOpen, setManagementOpen] = useState(
    ["Users", "Recruiters", "Hr", "Clients"].includes(activePage)
  );

  const [jobsOpen, setJobsOpen] = useState(
    ["Jobs", "Internal Jobs", "Job Sources"].includes(activePage)
  );
  const [feedbackOpen, setFeedbackOpen] = useState(
    feedbackPages.includes(activePage)
  );

  useEffect(() => {
    if (["Users", "Recruiters", "Hr", "Clients"].includes(activePage)) {
      setManagementOpen(true);
    }
    if (["Jobs", "Internal Jobs", "Job Sources"].includes(activePage)) {
      setJobsOpen(true);
    }
    if (feedbackPages.includes(activePage)) {
      setFeedbackOpen(true);
    }
  }, [activePage]);

  
const iconItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Users", icon: Users },
  { name: "Recruiters", icon: UserRound },
  { name: "clients", icon: Building2 },
  { name: "Management", icon: UserCog },
  { name: "Payments", icon: CreditCard },
  { name: "AI Usage", icon: Sparkles },
  { name: "Audit Log", icon: ClipboardList },
  { name: "Settings", icon: Settings },
];


  const groups = [
    {
      name: "Management",
      icon: UserCog,
      open: managementOpen,
      setOpen: setManagementOpen,
      pages: [
        { name: "Users", icon: Users },
        { name: "Recruiters", icon: UserRound },
        { name: "Hr", icon: UserCog },
        { name: "Clients", icon: Building2 }
      ],
    },
    {
      name: "Jobs",
      icon: BriefcaseBusiness,
      open: jobsOpen,
      setOpen: setJobsOpen,
      pages: [
        { name: "Jobs", icon: BriefcaseBusiness },
        { name: "Internal Jobs", icon: FileText },
        { name: "Job Sources", icon: Database },
      ],
    },
    {
      name: "Feedback & Complaints",
      icon: MessageSquareWarning,
      open: feedbackOpen,
      setOpen: setFeedbackOpen,
      pages: [
        { name: "Feedback Overview", icon: MessageSquareWarning },
        { name: "Candidate Reviews", icon: Star },
        { name: "Complaints", icon: Flag },
        { name: "Moderation History", icon: ClipboardList },
      ],
    },
  ];

  
const navigate = (page) => {
  onNavigate(page);
  toggleMenu(false);
};


  const IconButton = ({ item }) => {
    const Icon = item.icon;

    return (
      <button
        key={item.name}
        type="button"
        className={`nav-item ${
          activePage === item.name ? "active" : ""
        }`}
        title={item.name}
        aria-label={item.name}
        onClick={() => navigate(item.name)}
      >
        <Icon size={19} strokeWidth={1.8} />
        <span>{item.name}</span>

        {activePage === item.name && (
          <span className="active-mark" />
        )}
      </button>
    );
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      window.alert("Connect this action to your backend logout API.");
    }
  };

  return (
    <>
      {/* <aside className="right-icon-rail">
        <button
          type="button"
          className="rail-brand"
          onClick={() => navigate("Dashboard")}
          title="AIFAGen Dashboard"
          aria-label="AIFAGen Dashboard"
        >
          <img src="/aifagen-logo.jpg" alt="AIFAGen" />
        </button>

        <div className="rail-divider" />

        <nav className="rail-icons" aria-label="Quick navigation">
          {iconItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                className={`rail-icon ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => navigate(item.name)}
                title={item.name}
                aria-label={item.name}
              >
                <Icon size={21} strokeWidth={1.8} />
              </button>
            );
          })}
        </nav>

        <div className="rail-bottom">
          <button
            type="button"
            className={`rail-icon menu-rail-button ${
              menuOpen ? "active" : ""
            }`}
            onClick={toggleMenu}
            title={menuOpen ? "Close menu" : "Open menu"}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </aside> */}

      {menuOpen && (
        <button
          className="menu-overlay"
          type="button"
          aria-label="Close navigation"
          onClick={toggleMenu}
        />
      )}

      <aside
        className={`offcanvas-menu ${menuOpen ? "open" : ""}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/aifagen-logo.jpg" alt="AIFAGen" />

            <div>
              <strong>AIFAGen</strong>
              <span>Admin Portal</span>
            </div>
          </div>

          <button
            className="close-button"
            type="button"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <p className="menu-heading">WORKSPACE</p>

        <nav className="sidebar-navigation">
          <IconButton item={iconItems[0]} />

          {groups.map((group) => {
            const GroupIcon = group.icon;

            const groupActive = group.pages.some(
              (page) => page.name === activePage
            );

            return (
              <div className="dropdown-group" key={group.name}>
                <button
                  type="button"
                  className={`nav-item group-button ${
                    groupActive ? "active" : ""
                  }`}
                  onClick={() =>
                    group.setOpen((value) => !value)
                  }
                  aria-expanded={group.open}
                >
                  <GroupIcon size={19} strokeWidth={1.8} />

                  <span>{group.name}</span>

                  <ChevronDown
                    size={16}
                    className={`dropdown-arrow ${
                      group.open ? "rotated" : ""
                    }`}
                  />
                </button>

                {group.open && (
                  <div className="dropdown-submenu">
                    {group.pages.map((page) => (
                      <IconButton
                        key={page.name}
                        item={page}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {iconItems.slice(5).map((item) => (
            <IconButton key={item.name} item={item} />
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="signout-button"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}