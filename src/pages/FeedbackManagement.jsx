import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileText,
  Flag,
  MessageSquareText,
  Search,
  ShieldAlert,
  Star,
  X,
} from "lucide-react";
import {
  complaintCategories,
  complaintPriorities,
  complaintStatuses,
  feedbackServices,
  feedbackStaff,
} from "../data/feedbackDemoData";
import "./FeedbackManagement.css";
import useAssistantContext from "../hooks/useAssistantContext";

const pageTitles = {
  "Feedback Overview": "Feedback & complaints overview",
  "Candidate Reviews": "Candidate reviews",
  Complaints: "Complaints",
  "Moderation History": "Moderation history",
};

const reviewStatuses = [
  "Pending",
  "Approved",
  "Rejected",
  "Changes Requested",
  "Unpublished",
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatDate = (value) =>
  value && !Number.isNaN(new Date(value).getTime())
    ? dateFormatter.format(new Date(value))
    : "—";

const formatDateTime = (value) =>
  value && !Number.isNaN(new Date(value).getTime())
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value))
    : "—";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const slug = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const reviewIsPublished = (review) =>
  review.status === "Approved" && review.published && review.publicEligible;

function StatusBadge({ status }) {
  return <span className={`feedback-status status-${slug(status)}`}>{status}</span>;
}

function Rating({ value, compact = false }) {
  return (
    <span
      className={`feedback-rating ${compact ? "rating-compact" : ""}`}
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={compact ? 13 : 16}
          fill={index < value ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
      {!compact && <strong>{value}.0</strong>}
    </span>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone = "" }) {
  return (
    <article className="feedback-metric-card">
      <span className={`feedback-metric-icon ${tone}`}>
        <Icon size={18} />
      </span>
      <span className="feedback-metric-label">{label}</span>
      <strong className="feedback-metric-value">{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function EmptyState({ title, detail }) {
  return (
    <div className="feedback-empty-state">
      <span><FileText size={20} /></span>
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  );
}

function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  return (
    <div className="feedback-pagination">
      <span>Page {page} of {pageCount}</span>
      <div>
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          aria-label="Next page"
          disabled={page === pageCount}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ReviewPreview({ review }) {
  return (
    <div className="public-review-preview">
      <div className="public-preview-topline">
        <span>PUBLIC REVIEW PREVIEW</span>
        {reviewIsPublished(review) ? (
          <span className="preview-live"><CircleCheck size={13} /> Public</span>
        ) : (
          <span className="preview-private"><ShieldAlert size={13} /> Not public</span>
        )}
      </div>
      <Rating value={review.rating} compact />
      <h4>{review.title}</h4>
      <p>{review.body}</p>
      <div className="public-preview-byline">
        <span className="feedback-avatar">{initials(review.candidate.name)}</span>
        <span>
          <strong>{review.candidate.name}</strong>
          <small>{review.service} · {formatDate(review.submittedAt)}</small>
        </span>
      </div>
      {!reviewIsPublished(review) && (
        <small className="preview-disclaimer">
          Preview only. This review is not visible on the public website.
        </small>
      )}
    </div>
  );
}

function Overview({ reviews, complaints, audit, onNavigate }) {
  const published = reviews.filter(reviewIsPublished);
  const pending = reviews.filter((review) => review.status === "Pending");
  const rejected = reviews.filter((review) => review.status === "Rejected");
  const openComplaints = complaints.filter(
    (complaint) => ["Open", "In Progress", "Awaiting Candidate"].includes(complaint.status)
  );
  const priorityComplaints = openComplaints.filter(
    (complaint) => ["High", "Critical"].includes(complaint.priority)
  );
  const resolved = complaints.filter(
    (complaint) => ["Resolved", "Closed"].includes(complaint.status)
  );
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const distribution = Array.from({ length: 5 }, (_, index) => {
    const rating = 5 - index;
    return {
      rating,
      count: reviews.filter((review) => review.rating === rating).length,
    };
  });
  const maxRatingCount = Math.max(1, ...distribution.map((item) => item.count));
  const recentReviews = [...reviews]
    .sort((first, second) => new Date(second.submittedAt) - new Date(first.submittedAt))
    .slice(0, 4);
  const attentionItems = [
    ...pending.map((review) => ({
      id: review.id,
      type: "Review",
      title: review.title,
      detail: `${review.candidate.name} · ${formatDate(review.submittedAt)}`,
      page: "Candidate Reviews",
    })),
    ...priorityComplaints.map((complaint) => ({
      id: complaint.id,
      type: complaint.priority,
      title: complaint.subject,
      detail: `${complaint.candidate.name} · ${complaint.status}`,
      page: "Complaints",
    })),
  ].slice(0, 5);
  const recentAudit = [...audit]
    .sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp))
    .slice(0, 5);
  const complaintStatusSummary = complaintStatuses.map((status) => ({
    status,
    count: complaints.filter((complaint) => complaint.status === status).length,
  }));
  const allSubmissionCount = reviews.length;

  return (
    <div className="feedback-overview">
      <div className="feedback-demo-banner">
        <AlertCircle size={16} />
        <span>
          Demo data only. Moderation updates stay in this admin session and are
          not sent to AIFAGen Labs or a public reviews service.
        </span>
      </div>

      <div className="feedback-metric-grid">
        <MetricCard icon={MessageSquareText} label="Total feedback" value={allSubmissionCount} detail="Review submissions" />
        <MetricCard icon={Clock3} label="Pending approval" value={pending.length} detail="Awaiting moderator" tone="tone-amber" />
        <MetricCard icon={CircleCheck} label="Published reviews" value={published.length} detail="Public-eligible and approved" tone="tone-green" />
        <MetricCard icon={X} label="Rejected reviews" value={rejected.length} detail="Not shown publicly" tone="tone-red" />
        <MetricCard icon={Flag} label="Open complaints" value={openComplaints.length} detail="Active or awaiting response" tone="tone-blue" />
        <MetricCard icon={ShieldAlert} label="High priority" value={priorityComplaints.length} detail="High or critical, still open" tone="tone-red" />
        <MetricCard icon={Check} label="Resolved complaints" value={resolved.length} detail="Resolved or closed" tone="tone-green" />
        <MetricCard icon={Star} label="Average rating" value={`${averageRating.toFixed(1)} / 5`} detail="Across all submitted reviews" tone="tone-purple" />
      </div>

      <div className="feedback-overview-grid">
        <section className="feedback-panel rating-distribution-panel">
          <div className="feedback-panel-heading">
            <div><h2>Rating distribution</h2><p>Ratings from all submitted reviews</p></div>
            <strong>{averageRating.toFixed(1)} <Star size={15} fill="currentColor" /></strong>
          </div>
          {distribution.map(({ rating, count }) => (
            <div className="rating-bar-row" key={rating}>
              <span>{rating} <Star size={12} fill="currentColor" /></span>
              <div><span style={{ width: `${(count / maxRatingCount) * 100}%` }} /></div>
              <small>{count}</small>
            </div>
          ))}
        </section>

        <section className="feedback-panel complaint-summary-panel">
          <div className="feedback-panel-heading">
            <div><h2>Complaint status</h2><p>{complaints.length} private records</p></div>
            <button type="button" className="feedback-link-button" onClick={() => onNavigate("Complaints")}>
              Open complaints <ArrowRight size={14} />
            </button>
          </div>
          {complaintStatusSummary.map(({ status, count }) => (
            <div className="complaint-summary-row" key={status}>
              <StatusBadge status={status} />
              <strong>{count}</strong>
            </div>
          ))}
        </section>

        <section className="feedback-panel recent-feedback-panel">
          <div className="feedback-panel-heading">
            <div><h2>Recent feedback</h2><p>Latest candidate review submissions</p></div>
            <button type="button" className="feedback-link-button" onClick={() => onNavigate("Candidate Reviews")}>
              View reviews <ArrowRight size={14} />
            </button>
          </div>
          {recentReviews.length ? recentReviews.map((review) => (
            <div className="recent-review-row" key={review.id}>
              <div className="feedback-avatar">{initials(review.candidate.name)}</div>
              <div className="recent-review-copy">
                <strong>{review.title}</strong>
                <span>{review.candidate.name} · {review.service}</span>
              </div>
              <div className="recent-review-meta">
                <Rating value={review.rating} compact />
                <small>{formatDate(review.submittedAt)}</small>
              </div>
            </div>
          )) : <EmptyState title="No feedback yet" detail="New reviews will appear here." />}
        </section>

        <section className="feedback-panel attention-panel">
          <div className="feedback-panel-heading">
            <div><h2>Needs attention</h2><p>Pending reviews and urgent complaints</p></div>
            <span className="feedback-count-pill">{attentionItems.length}</span>
          </div>
          {attentionItems.length ? attentionItems.map((item) => (
            <button
              type="button"
              className="attention-record"
              key={item.id}
              onClick={() => onNavigate(item.page)}
            >
              <span className={`attention-type attention-${slug(item.type)}`}>{item.type}</span>
              <span className="attention-record-copy">
                <strong>{item.title}</strong>
                <small>{item.id} · {item.detail}</small>
              </span>
              <ArrowRight size={15} />
            </button>
          )) : <EmptyState title="All caught up" detail="There are no pending or urgent items." />}
        </section>

        <section className="feedback-panel recent-activity-panel">
          <div className="feedback-panel-heading">
            <div><h2>Recent moderation activity</h2><p>Review and complaint actions in this session</p></div>
            <button type="button" className="feedback-link-button" onClick={() => onNavigate("Moderation History")}>
              View history <ArrowRight size={14} />
            </button>
          </div>
          {recentAudit.length ? recentAudit.map((entry) => (
            <div className="moderation-activity-row" key={entry.id}>
              <span className={`activity-marker activity-${slug(entry.recordType)}`}>
                {entry.recordType === "Review" ? <Star size={14} /> : <Flag size={14} />}
              </span>
              <span><strong>{entry.action}</strong><small>{entry.recordId} · {entry.admin}</small></span>
              <time>{formatDate(entry.timestamp)}</time>
            </div>
          )) : <EmptyState title="No activity recorded" detail="Moderation actions will be listed here." />}
        </section>
      </div>
    </div>
  );
}

function ReviewsPage({ reviews, onSelectReview }) {
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("All ratings");
  const [service, setService] = useState("All services");
  const [status, setStatus] = useState("All statuses");
  const [dateRange, setDateRange] = useState("All time");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    const cutoff = dateRange === "All time"
      ? null
      : new Date(Date.now() - Number(dateRange) * 86400000);
    return reviews.filter((review) => {
      const matchesSearch = !query || [
        review.id,
        review.candidate.name,
        review.candidate.email,
        review.service,
        review.title,
        review.body,
      ].some((value) => value.toLowerCase().includes(query));
      const matchesRating = rating === "All ratings" || review.rating === Number(rating);
      const matchesService = service === "All services" || review.service === service;
      const matchesStatus = status === "All statuses" || review.status === status;
      const submittedAt = new Date(review.submittedAt);
      const matchesDate = !cutoff || submittedAt >= cutoff;
      return matchesSearch && matchesRating && matchesService && matchesStatus && matchesDate;
    });
  }, [reviews, search, rating, service, status, dateRange]);

  const pageCount = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const visibleReviews = filteredReviews.slice((page - 1) * pageSize, page * pageSize);

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  return (
    <section className="feedback-panel feedback-table-panel">
      <div className="feedback-panel-heading table-panel-heading">
        <div><h2>Candidate reviews</h2><p>All submissions remain unpublished until an admin approves them.</p></div>
        <span className="feedback-count-pill">{filteredReviews.length} reviews</span>
      </div>
      <div className="feedback-filter-bar">
        <label className="feedback-search">
          <Search size={16} />
          <input value={search} onChange={updateFilter(setSearch)} placeholder="Search candidate, review or ID" aria-label="Search reviews" />
        </label>
        <select value={rating} onChange={updateFilter(setRating)} aria-label="Filter by rating">
          <option>All ratings</option>
          {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
        </select>
        <select value={service} onChange={updateFilter(setService)} aria-label="Filter by service">
          <option>All services</option>
          {feedbackServices.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select value={dateRange} onChange={updateFilter(setDateRange)} aria-label="Filter by submission date">
          <option>All time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
        </select>
        <select value={status} onChange={updateFilter(setStatus)} aria-label="Filter by review status">
          <option>All statuses</option>
          {reviewStatuses.map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>
      <div className="feedback-table-scroll">
        <table className="feedback-table reviews-table">
          <thead><tr>
            <th>Review</th><th>Candidate</th><th>Service</th><th>Rating</th><th>Submitted</th><th>Approval</th><th>Publication</th><th>Action</th>
          </tr></thead>
          <tbody>
            {visibleReviews.map((review) => (
              <tr key={review.id}>
                <td className="review-summary-cell">
                  <strong>{review.id} · {review.title}</strong>
                  <span>{review.body}</span>
                </td>
                <td><strong>{review.candidate.name}</strong><small>{review.candidate.email}</small></td>
                <td>{review.service}</td>
                <td><Rating value={review.rating} compact /></td>
                <td>{formatDate(review.submittedAt)}</td>
                <td><StatusBadge status={review.status} /></td>
                <td><StatusBadge status={reviewIsPublished(review) ? "Published" : "Private"} /></td>
                <td><button type="button" className="feedback-small-button" onClick={() => onSelectReview(review)}>Review</button></td>
              </tr>
            ))}
            {!visibleReviews.length && <tr><td colSpan={8}><EmptyState title="No reviews match these filters" detail="Try changing your search or filters." /></td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}

function ReviewDrawer({ review, onClose, onAction }) {
  const [dialogAction, setDialogAction] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!review) return null;

  const requestAction = (action) => {
    setDialogAction(action);
    setReason("");
    setError("");
  };

  const confirmAction = () => {
    const needsReason = ["Rejected", "Changes Requested", "Unpublished"].includes(dialogAction);
    if (needsReason && !reason.trim()) {
      setError("Enter a reason to continue.");
      return;
    }
    onAction(review, dialogAction, reason.trim());
    setDialogAction("");
    onClose();
  };

  return (
    <div className="feedback-drawer-backdrop" onMouseDown={onClose}>
      <aside className="feedback-drawer" aria-label={`Review ${review.id}`} onMouseDown={(event) => event.stopPropagation()}>
        <header className="feedback-drawer-header">
          <div><span>Candidate review</span><h2>{review.id}</h2></div>
          <button type="button" className="feedback-icon-button" onClick={onClose} aria-label="Close review details"><X size={19} /></button>
        </header>
        <div className="feedback-drawer-content">
          <div className="drawer-candidate">
            <span className="feedback-avatar avatar-large">{initials(review.candidate.name)}</span>
            <span><strong>{review.candidate.name}</strong><small>{review.candidate.email}</small></span>
          </div>
          <div className="drawer-meta-grid">
            <div><small>Service / package</small><strong>{review.service}</strong></div>
            <div><small>Submission date</small><strong>{formatDateTime(review.submittedAt)}</strong></div>
            <div><small>Approval status</small><StatusBadge status={review.status} /></div>
            <div><small>Publication</small><StatusBadge status={reviewIsPublished(review) ? "Published" : "Private"} /></div>
          </div>
          <section className="review-full-copy">
            <Rating value={review.rating} />
            <h3>{review.title}</h3>
            <p>{review.body}</p>
          </section>
          <ReviewPreview review={review} />
          <section className="review-notes">
            <h3>Moderation notes</h3>
            {review.moderationNotes.length ? review.moderationNotes.slice().reverse().map((note, index) => (
              <div key={`${note.timestamp}-${index}`}><strong>{note.action}</strong><span>{note.reason}</span><small>{note.admin} · {formatDateTime(note.timestamp)}</small></div>
            )) : <p>No moderation actions recorded.</p>}
          </section>
        </div>
        <footer className="review-action-footer">
          <button type="button" className="feedback-action-button action-approve" onClick={() => requestAction("Approved and Published")} disabled={reviewIsPublished(review)}>
            <Check size={15} /> Approve and Publish
          </button>
          <button type="button" className="feedback-action-button" onClick={() => requestAction("Approved, Kept Unpublished")} disabled={review.status === "Approved" && !review.published}>
            Approve but Keep Unpublished
          </button>
          <div>
            <button type="button" className="feedback-action-button action-neutral" onClick={() => requestAction("Changes Requested")} disabled={review.status === "Rejected"}>Request Changes</button>
            <button type="button" className="feedback-action-button action-danger" onClick={() => requestAction("Rejected")} disabled={review.status === "Rejected"}>Reject</button>
          </div>
          {reviewIsPublished(review) && (
            <button type="button" className="feedback-action-button action-danger" onClick={() => requestAction("Unpublished")}>Unpublish public review</button>
          )}
        </footer>
      </aside>
      {dialogAction && (
        <div className="feedback-confirm-backdrop">
          <section className="feedback-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="review-confirm-title">
            <button type="button" className="feedback-confirm-close" aria-label="Close confirmation" onClick={() => setDialogAction("")}><X size={17} /></button>
            <span className="confirm-icon"><ShieldAlert size={19} /></span>
            <h3 id="review-confirm-title">{dialogAction}</h3>
            <p>
              {dialogAction === "Approved and Published"
                ? "This approves the review and marks it public-eligible in this demo session. No public website is updated."
                : dialogAction === "Approved, Kept Unpublished"
                  ? "This approves the review but keeps it private."
                  : dialogAction === "Unpublished"
                    ? "This removes the review from the public-eligible set."
                    : "This moderation decision will be recorded in the session history."}
            </p>
            <label className="feedback-form-field">
              <span>{["Rejected", "Changes Requested", "Unpublished"].includes(dialogAction) ? "Reason (required)" : "Moderation note (optional)"}</span>
              <textarea value={reason} onChange={(event) => { setReason(event.target.value); setError(""); }} rows={3} placeholder="Add context for this action" />
            </label>
            {error && <p className="feedback-form-error" role="alert">{error}</p>}
            <div className="feedback-dialog-actions">
              <button type="button" className="feedback-action-button" onClick={() => setDialogAction("")}>Cancel</button>
              <button type="button" className="feedback-action-button action-primary" onClick={confirmAction}>Confirm action</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ComplaintsPage({ complaints, onUpdateComplaint }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [priority, setPriority] = useState("All priorities");
  const [status, setStatus] = useState("All statuses");
  const [dateRange, setDateRange] = useState("All time");
  const [sort, setSort] = useState("Newest first");
  const [page, setPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const pageSize = 6;

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();
    const cutoff = dateRange === "All time" ? null : new Date(Date.now() - Number(dateRange) * 86400000);
    const results = complaints.filter((complaint) => {
      const matchesSearch = !query || [
        complaint.id, complaint.candidate.name, complaint.candidate.email,
        complaint.subject, complaint.category, complaint.description,
      ].some((value) => value.toLowerCase().includes(query));
      return matchesSearch &&
        (category === "All categories" || complaint.category === category) &&
        (priority === "All priorities" || complaint.priority === priority) &&
        (status === "All statuses" || complaint.status === status) &&
        (!cutoff || new Date(complaint.submittedAt) >= cutoff);
    });
    return results.sort((first, second) =>
      sort === "Newest first"
        ? new Date(second.submittedAt) - new Date(first.submittedAt)
        : new Date(first.submittedAt) - new Date(second.submittedAt)
    );
  }, [complaints, search, category, priority, status, dateRange, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredComplaints.length / pageSize));
  const visibleComplaints = filteredComplaints.slice((page - 1) * pageSize, page * pageSize);
  const updateFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };

  return (
    <>
      <section className="feedback-panel feedback-table-panel">
        <div className="feedback-panel-heading table-panel-heading">
          <div><h2>Complaints</h2><p>Private support records. Never displayed on the public website.</p></div>
          <span className="feedback-count-pill">{filteredComplaints.length} records</span>
        </div>
        <div className="feedback-filter-bar complaint-filter-bar">
          <label className="feedback-search"><Search size={16} /><input value={search} onChange={updateFilter(setSearch)} placeholder="Search ID, candidate or subject" aria-label="Search complaints" /></label>
          <select value={category} onChange={updateFilter(setCategory)} aria-label="Filter by category"><option>All categories</option>{complaintCategories.map((value) => <option key={value}>{value}</option>)}</select>
          <select value={priority} onChange={updateFilter(setPriority)} aria-label="Filter by priority"><option>All priorities</option>{complaintPriorities.map((value) => <option key={value}>{value}</option>)}</select>
          <select value={dateRange} onChange={updateFilter(setDateRange)} aria-label="Filter by date"><option>All time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select>
          <select value={status} onChange={updateFilter(setStatus)} aria-label="Filter by status"><option>All statuses</option>{complaintStatuses.map((value) => <option key={value}>{value}</option>)}</select>
          <label className="feedback-sort-label"><ArrowDownUp size={14} /><select value={sort} onChange={updateFilter(setSort)} aria-label="Sort complaints"><option>Newest first</option><option>Oldest first</option></select></label>
        </div>
        <div className="feedback-table-scroll">
          <table className="feedback-table complaints-table">
            <thead><tr><th>Complaint</th><th>Candidate</th><th>Category</th><th>Priority</th><th>Assigned to</th><th>Submitted</th><th>Updated</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {visibleComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td><strong>{complaint.id}</strong><small>{complaint.subject}</small></td>
                  <td><strong>{complaint.candidate.name}</strong><small>{complaint.candidate.email}</small></td>
                  <td>{complaint.category}</td>
                  <td><StatusBadge status={complaint.priority} /></td>
                  <td>{complaint.assignedTo || "Unassigned"}</td>
                  <td>{formatDate(complaint.submittedAt)}</td>
                  <td>{formatDate(complaint.updatedAt)}</td>
                  <td><StatusBadge status={complaint.status} /></td>
                  <td><button type="button" className="feedback-small-button" onClick={() => setSelectedComplaint(complaint)}>Open</button></td>
                </tr>
              ))}
              {!visibleComplaints.length && <tr><td colSpan={9}><EmptyState title="No complaints match these filters" detail="Try another search term or filter." /></td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} onChange={setPage} />
      </section>
      <ComplaintDrawer
        key={selectedComplaint?.id || "closed"}
        complaint={selectedComplaint && complaints.find((item) => item.id === selectedComplaint.id)}
        onClose={() => setSelectedComplaint(null)}
        onUpdate={onUpdateComplaint}
      />
    </>
  );
}

function ComplaintDrawer({ complaint, onClose, onUpdate }) {
  const [note, setNote] = useState("");
  const [resolution, setResolution] = useState(complaint?.resolutionDetails || "");
  const [error, setError] = useState("");

  if (!complaint) return null;

  const addNote = () => {
    const text = note.trim();
    if (!text) {
      setError("Enter a note before adding it.");
      return;
    }
    onUpdate(complaint, { type: "note", text });
    setNote("");
    setError("");
  };

  const updateStatus = (nextStatus) => {
    if (nextStatus === "Resolved" && !resolution.trim()) {
      setError("Add resolution details before resolving this complaint.");
      return;
    }
    onUpdate(complaint, {
      type: "status",
      value: nextStatus,
      resolution: nextStatus === "Resolved" ? resolution.trim() : complaint.resolutionDetails,
    });
    setError("");
  };

  return (
    <div className="feedback-drawer-backdrop" onMouseDown={onClose}>
      <aside className="feedback-drawer complaint-drawer" aria-label={`Complaint ${complaint.id}`} onMouseDown={(event) => event.stopPropagation()}>
        <header className="feedback-drawer-header">
          <div><span>Private complaint</span><h2>{complaint.id}</h2></div>
          <button type="button" className="feedback-icon-button" onClick={onClose} aria-label="Close complaint details"><X size={19} /></button>
        </header>
        <div className="feedback-drawer-content">
          <div className="complaint-drawer-title">
            <h3>{complaint.subject}</h3>
            <span className="complaint-tag-row"><StatusBadge status={complaint.priority} /><StatusBadge status={complaint.status} /></span>
          </div>
          <div className="drawer-candidate">
            <span className="feedback-avatar avatar-large">{initials(complaint.candidate.name)}</span>
            <span><strong>{complaint.candidate.name}</strong><small>{complaint.candidate.email}</small></span>
          </div>
          <div className="drawer-meta-grid">
            <div><small>Category</small><strong>{complaint.category}</strong></div>
            <div><small>Submitted</small><strong>{formatDateTime(complaint.submittedAt)}</strong></div>
            <div><small>Last updated</small><strong>{formatDateTime(complaint.updatedAt)}</strong></div>
            <div><small>Record privacy</small><strong>Admin only</strong></div>
          </div>
          <section className="complaint-private-section">
            <h3>Complaint details <span>PRIVATE</span></h3>
            <p>{complaint.description}</p>
          </section>
          <section className="complaint-controls">
            <label className="feedback-form-field"><span>Assign staff member</span>
              <select value={complaint.assignedTo} onChange={(event) => onUpdate(complaint, { type: "assignment", value: event.target.value })}>
                <option value="">Unassigned</option>{feedbackStaff.map((member) => <option key={member}>{member}</option>)}
              </select>
            </label>
            <label className="feedback-form-field"><span>Priority</span>
              <select value={complaint.priority} onChange={(event) => onUpdate(complaint, { type: "priority", value: event.target.value })}>
                {complaintPriorities.map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label className="feedback-form-field"><span>Status</span>
              <select value={complaint.status} onChange={(event) => updateStatus(event.target.value)}>
                {complaintStatuses.map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
          </section>
          <section className="complaint-private-section">
            <h3>Resolution details</h3>
            <textarea value={resolution} rows={3} onChange={(event) => setResolution(event.target.value)} placeholder="Record how this complaint was resolved" />
            <button type="button" className="feedback-action-button action-primary" onClick={() => onUpdate(complaint, { type: "resolution", text: resolution.trim() })} disabled={!resolution.trim()}>Save resolution</button>
          </section>
          <section className="complaint-private-section">
            <h3>Internal notes <span>PRIVATE</span></h3>
            <textarea value={note} rows={3} onChange={(event) => { setNote(event.target.value); setError(""); }} placeholder="Private notes for the admin/support team" />
            <button type="button" className="feedback-action-button" onClick={addNote}>Add internal note</button>
            {complaint.internalNotes.length ? complaint.internalNotes.slice().reverse().map((item) => (
              <div className="internal-note" key={item.id}><p>{item.text}</p><small>{item.author} · {formatDateTime(item.timestamp)}</small></div>
            )) : <p className="feedback-muted-copy">No internal notes recorded.</p>}
          </section>
          {error && <p className="feedback-form-error" role="alert">{error}</p>}
          <section className="complaint-private-section complaint-timeline">
            <h3>Activity timeline</h3>
            {complaint.activity.slice().reverse().map((item, index) => (
              <div className="timeline-entry" key={`${item.timestamp}-${index}`}>
                <span className="timeline-dot" />
                <div><strong>{item.action}</strong><p>{item.detail}</p><small>{item.admin} · {formatDateTime(item.timestamp)}</small></div>
              </div>
            ))}
          </section>
        </div>
      </aside>
    </div>
  );
}

function HistoryPage({ audit }) {
  const [search, setSearch] = useState("");
  const [recordType, setRecordType] = useState("All record types");
  const [status, setStatus] = useState("All statuses");
  const [dateRange, setDateRange] = useState("All time");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredAudit = useMemo(() => {
    const query = search.trim().toLowerCase();
    const cutoff = dateRange === "All time" ? null : new Date(Date.now() - Number(dateRange) * 86400000);
    return [...audit]
      .filter((entry) => {
        const matchesSearch = !query || [
          entry.recordId, entry.recordType, entry.action, entry.admin,
          entry.previousStatus, entry.newStatus, entry.reason,
        ].some((value) => value.toLowerCase().includes(query));
        return matchesSearch &&
          (recordType === "All record types" || entry.recordType === recordType) &&
          (status === "All statuses" || entry.newStatus === status || entry.previousStatus === status) &&
          (!cutoff || new Date(entry.timestamp) >= cutoff);
      })
      .sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp));
  }, [audit, search, recordType, status, dateRange]);

  const pageCount = Math.max(1, Math.ceil(filteredAudit.length / pageSize));
  const visibleAudit = filteredAudit.slice((page - 1) * pageSize, page * pageSize);
  const updateFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };

  return (
    <section className="feedback-panel feedback-table-panel">
      <div className="feedback-panel-heading table-panel-heading">
        <div><h2>Moderation history</h2><p>Audit trail for review moderation and complaint updates in this session.</p></div>
        <span className="feedback-count-pill">{filteredAudit.length} events</span>
      </div>
      <div className="feedback-filter-bar">
        <label className="feedback-search"><Search size={16} /><input value={search} onChange={updateFilter(setSearch)} placeholder="Search ID, action, admin or reason" aria-label="Search moderation history" /></label>
        <select value={recordType} onChange={updateFilter(setRecordType)} aria-label="Filter by record type"><option>All record types</option><option>Review</option><option>Complaint</option></select>
        <select value={dateRange} onChange={updateFilter(setDateRange)} aria-label="Filter by date"><option>All time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select>
        <select value={status} onChange={updateFilter(setStatus)} aria-label="Filter by status"><option>All statuses</option>{[...reviewStatuses, ...complaintStatuses, ...complaintPriorities].map((value) => <option key={value}>{value}</option>)}</select>
      </div>
      <div className="feedback-table-scroll">
        <table className="feedback-table history-table">
          <thead><tr><th>Record ID</th><th>Type</th><th>Action</th><th>Admin</th><th>Previous status</th><th>New status</th><th>Timestamp</th><th>Reason / note</th></tr></thead>
          <tbody>
            {visibleAudit.map((entry) => (
              <tr key={entry.id}>
                <td><strong>{entry.recordId}</strong></td>
                <td><StatusBadge status={entry.recordType} /></td>
                <td><strong>{entry.action}</strong></td>
                <td>{entry.admin}</td>
                <td>{entry.previousStatus}</td>
                <td><StatusBadge status={entry.newStatus} /></td>
                <td>{formatDateTime(entry.timestamp)}</td>
                <td className="history-reason">{entry.reason || "—"}</td>
              </tr>
            ))}
            {!visibleAudit.length && <tr><td colSpan={8}><EmptyState title="No history matches these filters" detail="Moderation events will appear here as actions are taken." /></td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}

export default function FeedbackManagement({
  section,
  reviews,
  setReviews,
  complaints,
  setComplaints,
  audit,
  setAudit,
  currentUser,
  onNavigate,
  onAssistantContext,
}) {
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const selectedReview = reviews.find((review) => review.id === selectedReviewId);
  const adminName = currentUser?.name || currentUser?.email || "Admin";
  const adminIdentity = currentUser?.email || "admin-session";
  const openComplaintCount = complaints.filter(
    (complaint) => ["Open", "In Progress", "Awaiting Candidate"].includes(complaint.status)
  ).length;
  const pendingReviewCount = reviews.filter((review) => review.status === "Pending").length;
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : null;
  useAssistantContext(onAssistantContext, section, {
    section,
    reviews: reviews.length,
    averageRating,
    pending: pendingReviewCount,
    approved: reviews.filter((review) => review.status === "Approved").length,
    reviewStatuses: reviews.map((review) => ({ status: review.status })),
    complaints: complaints.length,
    openComplaints: openComplaintCount,
    priorityComplaints: complaints.filter((complaint) =>
      ["Open", "In Progress", "Awaiting Candidate"].includes(complaint.status) &&
      ["High", "Critical"].includes(complaint.priority)
    ).length,
    complaintStatuses: complaints.reduce((counts, complaint) => {
      counts[complaint.status] = (counts[complaint.status] || 0) + 1;
      return counts;
    }, {}),
    moderationEvents: audit.length,
    reasonsRecorded: audit.filter((entry) => Boolean(entry.reason)).length,
  });

  const appendAudit = ({ recordId, recordType, action, previousStatus, newStatus, reason }) => {
    const timestamp = new Date().toISOString();
    setAudit((previous) => [{
      id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      recordId,
      recordType,
      action,
      admin: `${adminName} (${adminIdentity})`,
      previousStatus,
      newStatus,
      timestamp,
      reason: reason || "",
    }, ...previous]);
    return timestamp;
  };

  const handleReviewAction = (review, action, reason) => {
    const previousStatus = review.status;
    let nextStatus = action;
    let published = false;
    let approvalStatus = review.approvalStatus;
    if (action === "Approved and Published") {
      nextStatus = "Approved";
      approvalStatus = "Approved";
      published = true;
    } else if (action === "Approved, Kept Unpublished") {
      nextStatus = "Unpublished";
      approvalStatus = "Approved";
    } else if (action === "Unpublished") {
      nextStatus = "Unpublished";
      approvalStatus = "Approved";
    } else {
      approvalStatus = action;
    }
    const timestamp = new Date().toISOString();
    const publicEligible = ["Approved and Published", "Approved, Kept Unpublished"].includes(action)
      ? true
      : ["Rejected", "Changes Requested"].includes(action)
        ? false
        : review.publicEligible;
    const note = {
      action,
      reason: reason || "No additional note.",
      admin: adminName,
      timestamp,
    };
    setReviews((previous) => previous.map((item) =>
      item.id === review.id
        ? {
            ...item,
            status: nextStatus,
            approvalStatus,
            published,
            publicEligible,
            moderationNotes: [...item.moderationNotes, note],
          }
        : item
    ));
    appendAudit({
      recordId: review.id,
      recordType: "Review",
      action,
      previousStatus,
      newStatus: nextStatus,
      reason,
    });
  };

  const handleComplaintUpdate = (complaint, change) => {
    const timestamp = new Date().toISOString();
    const admin = adminName;
    let action = "";
    let previousStatus = complaint.status;
    let newStatus = complaint.status;
    let reason = "";
    let update;

    if (change.type === "status") {
      action = "Status changed";
      newStatus = change.value;
      reason = change.resolution || "";
      update = {
        status: change.value,
        ...(change.resolution ? { resolutionDetails: change.resolution } : {}),
      };
    } else if (change.type === "assignment") {
      action = "Assignment changed";
      previousStatus = complaint.assignedTo || "Unassigned";
      newStatus = change.value || "Unassigned";
      update = { assignedTo: change.value };
    } else if (change.type === "priority") {
      action = "Priority changed";
      previousStatus = complaint.priority;
      newStatus = change.value;
      update = { priority: change.value };
    } else if (change.type === "note") {
      action = "Internal note added";
      reason = change.text;
      update = {
        internalNotes: [...complaint.internalNotes, {
          id: `NOTE-${Date.now()}`,
          author: adminName,
          timestamp,
          text: change.text,
        }],
      };
    } else {
      action = "Resolution details updated";
      reason = change.text;
      update = { resolutionDetails: change.text };
    }

    setComplaints((previous) => previous.map((item) =>
      item.id === complaint.id
        ? {
            ...item,
            ...update,
            updatedAt: timestamp,
            activity: [...item.activity, {
              action,
              admin,
              timestamp,
              detail: change.type === "note" ? "Private internal note added." : `${previousStatus} → ${newStatus}`,
            }],
          }
        : item
    ));
    appendAudit({
      recordId: complaint.id,
      recordType: "Complaint",
      action,
      previousStatus,
      newStatus,
      reason,
    });
  };

  return (
    <div className="feedback-page">
      <header className="feedback-page-header">
        <div>
          <div className="feedback-breadcrumb">Operations <span>/</span> Feedback &amp; Complaints</div>
          <h1>{pageTitles[section] || pageTitles["Feedback Overview"]}</h1>
          <p>Review candidate feedback, manage private support issues, and track moderation activity.</p>
        </div>
        <span className="feedback-demo-badge"><span /> Demo session</span>
      </header>
      {section === "Feedback Overview" && (
        <Overview reviews={reviews} complaints={complaints} audit={audit} onNavigate={onNavigate} />
      )}
      {section === "Candidate Reviews" && (
        <>
          <ReviewsPage reviews={reviews} onSelectReview={(review) => setSelectedReviewId(review.id)} />
          <ReviewDrawer
            review={selectedReview}
            onClose={() => setSelectedReviewId(null)}
            onAction={handleReviewAction}
          />
        </>
      )}
      {section === "Complaints" && (
        <ComplaintsPage complaints={complaints} onUpdateComplaint={handleComplaintUpdate} />
      )}
      {section === "Moderation History" && <HistoryPage audit={audit} />}
    </div>
  );
}
