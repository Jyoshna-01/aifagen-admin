
import { Bell } from 'lucide-react';

export default function Header({ page }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        Admin Console <span>/</span> <b>{page}</b>
      </div>

      <div className="topbar-right">
        <span className="environment">
          <i /> Demo environment
        </span>
        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
        </button>
      </div>
    </header>
  );
}
