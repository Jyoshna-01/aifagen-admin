# Feedback, reviews, and complaints API contracts

## Current implementation

The admin portal has no configured API client, backend URL, or server routes in
this workspace. The feedback module therefore uses fictional records from
`src/data/feedbackDemoData.js` and shared React state in `src/App.jsx`. Changes
are kept only in the current browser session and reset on refresh. The demo
banner is intentional: approving a review here does not publish it to
aifagenlabs.com.

The existing Audit Log is also a local sample-data page. Feedback moderation
events are adapted into that view and displayed in the dedicated Moderation
History section from the same in-memory event records.

## Production endpoints to implement

All admin endpoints below must require an authenticated, server-authorized
administrator. Client-side role checks are not an authorization boundary.

### Candidate reviews

- `POST /api/feedback/reviews`: accept candidate feedback and assign `Pending`
  server-side. Ignore any client-supplied approval, publication, or
  public-eligibility flags.
- `GET /api/admin/feedback/reviews`: return authorized review records with
  server-side search, status, rating, service, date, and pagination filters.
- `GET /api/admin/feedback/reviews/{reviewId}`: return the complete review and
  authorized candidate details for moderators.
- `POST /api/admin/feedback/reviews/{reviewId}/moderation`: accept a validated
  action (`approve_publish`, `approve_private`, `reject`, `request_changes`,
  or `unpublish`) and required reason where applicable. Derive the admin
  identity from the authenticated session, update approval/publication fields
  atomically, and append an immutable audit event.
- `GET /api/public/reviews`: return only an allowlisted public projection of
  records whose approval is `Approved`, publication is enabled, and
  `publicEligible` is true. Exclude candidate email, internal notes, moderation
  history, and any private metadata.

The public site must consume only `GET /api/public/reviews`; it must never
derive public reviews by filtering an admin response in the browser.

### Complaints

- `POST /api/feedback/complaints`: create a private complaint record.
- `GET /api/admin/feedback/complaints`: return complaints only to authorized
  admins/support staff, with server-side search, filtering, sorting, and
  pagination.
- `GET /api/admin/feedback/complaints/{complaintId}`: return the complaint,
  private notes, assignments, resolution, and activity timeline only to
  authorized staff.
- `PATCH /api/admin/feedback/complaints/{complaintId}`: validate assignment,
  priority, status, notes, and resolution changes; append an immutable audit
  event for each accepted change.

There must be no public complaint-list, complaint-detail, or private-note API.
Complaint text, candidate contact information, internal notes, and activity
timelines must not be included in public review responses or public website
payloads.

### Moderation audit

- `GET /api/admin/feedback/moderation-history`: return authorized review and
  complaint moderation events with search, record type, date, and status
  filters.
- Write the actor, timestamp, previous/new values, record ID/type, action, and
  reason on the server. Do not accept the actor identity or timestamp as
  authoritative client input.

## Suggested review fields

```json
{
  "id": "REV-2048",
  "candidateId": "candidate-id",
  "service": "Resume Optimization",
  "rating": 5,
  "title": "A much clearer resume",
  "body": "Candidate-submitted feedback",
  "approvalStatus": "Pending",
  "published": false,
  "publicEligible": false,
  "submittedAt": "2026-10-15T08:00:00.000Z"
}
```

The server must initialize candidate submissions as pending and non-public.
Only an authorized moderation action may approve or publish them.
