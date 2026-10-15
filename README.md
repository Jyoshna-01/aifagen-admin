# AIFAGen Labs Admin and Recruitment Portal

## 1. Project overview

The AIFAGen Labs Admin and Recruitment Portal is an internal operations interface for the AIFAGen Labs platform. It brings platform administration and recruitment workflows into one browser-based application. Admin users can inspect platform-style metrics and manage demo records, while HR users and recruiters have separate workspaces for recruitment tasks.

The portal is intended for three internal user types:

- **Admins** oversee user, payment, job, service, and feedback-management screens.
- **HR users** coordinate candidates, clients, jobs, and recruiter activity.
- **Recruiters** track candidate applications and recruitment progress.

The main workflows represented are reviewing platform and recruitment dashboards, managing users and job listings, progressing candidate records through recruitment stages, handling reviews and complaints, and inspecting administrative or moderation activity.

This repository contains a frontend prototype, not the AIFAGen platform backend. The screens demonstrate workflows using sample data and in-memory browser state. Changes are not saved to a server or shared across browser sessions.

## 2. Original admin portal modules

| Module | Purpose and available actions | Current implementation |
| --- | --- | --- |
| **Dashboard** | Shows user and plan metrics, sign-up and revenue charts, expiring subscriptions, job-source health, and recent activity. | Dashboard UI and charts are present; much of the displayed information is hardcoded or generated demo data. |
| **Users** | Search and filter user records; inspect profiles, plans, statuses, AI usage, screening, interviews and assessments; edit records and export CSV. | Client-side UI and local sample state. No user API or server-side pagination. |
| **Payments** | Review payment history, filter transactions, inspect failed payments and upcoming renewals, and open the refund flow. | Sample payment data and local UI state. A refund action does not call a payment provider or issue a real refund. |
| **Jobs** | Filter job listings, inspect collection and visibility details, perform bulk visibility actions, and export CSV. | Sample job records and browser-only state. Refresh controls update demo data; no live job feed is contacted. |
| **Internal Jobs** | Create, edit, delete, change visibility for, and export company-created job postings. | Functional frontend interactions over local sample state; not connected to a jobs service. |
| **Job Sources** | Inspect source health, job counts, collection-run history and errors; trigger refresh or retry actions. | Demo source/run data. Refresh and retry simulate results rather than invoking a collection service. |
| **AI Usage** | Review AI call totals, estimated costs, usage by feature and provider, and top users; export usage data. | Dashboard and export use local demo records and estimates; no live AI-provider usage API is connected. |
| **Audit Log** | Search, filter, inspect and export admin activity with actor, action, target, timestamps, changes and reasons. | Includes seeded sample entries and feedback moderation events held in browser state. It is not a durable or complete server audit log. |
| **Settings** | Add or remove admin entries and inspect connected-service status. | Admin entries and service checks are local demo state. Adding an entry does not provision an account, and refresh does not contact the services. |

## 3. Additional features

### HR Management

The admin navigation's **Hr** page presents HR/recruiting operations, including recruiter and client records, jobs, candidates, placements and transfers. The UI provides management and inspection flows for these records. Its data is initialized in the frontend and maintained locally; changes do not update a central system.

**Access:** Sign in with the Admin demo login and select **Hr** from the admin navigation.

**Status:** Frontend demo. This management page is separate from the HR user's role-specific workspace.

### Recruiter Management

The admin **Recruiters** page presents recruiter profiles, workload/performance information and candidate application activity. It supports viewing and filtering recruiter information, editing recruiter records, and exporting application data as CSV.

**Access:** Sign in with the Admin demo login and select **Recruiters**.

**Status:** Frontend demo backed by local sample data. Recruiter changes and exports are not connected to a backend.

### HR login and workspace

There is one shared sign-in form, not a separate HR login page. The login code matches the entered email against the demo member list, checks the demo password, and uses that member's HR role to render the HR workspace. The workspace includes candidate and client workflows, recruitment tracking, and HR-side activity such as notes and status updates.

**Access:** Use an HR demo email and password below in the shared sign-in form.

**Status:** Role-specific frontend navigation and interactions are present. The identity and role checks run in browser code; there is no server authentication or permission enforcement, and edits are held in app memory.

### Recruiter login and workspace

There is no separate recruiter sign-in page. The shared sign-in form recognizes recruiter demo members and renders the Recruiter Workspace for those accounts. The workspace provides candidate/application tracking and recruiter workflows such as recording screening, interviews, assessments, and calls.

**Access:** Use a Recruiter demo email and password below in the shared sign-in form.

**Status:** Role-specific frontend interactions are present over in-memory app data. There is no backend identity verification or server-enforced recruiter data scope.

### Feedback and Complaints management

The admin **Feedback & Complaints** section includes an overview, candidate reviews, complaints, and moderation history. Review actions include approval/publication, rejection, requesting changes, and keeping a review unpublished or unpublishing it. Complaint workflows include changing status, priority or assignment, adding private notes, and recording resolution details. Moderation activity records the action, actor, previous and new status, timestamp, and reason in the current app state.

**Access:** Sign in with the Admin demo login and use the **Feedback & Complaints** section in the admin navigation.

**Status:** Frontend moderation and complaint workflows are implemented against sample data. Records and audit events are not persisted to a backend and are lost when the app state is reset.

## 4. Technology stack

| Area | Verified technology |
| --- | --- |
| Frontend | React with JavaScript and JSX |
| Build and development server | Vite with `@vitejs/plugin-react` |
| Styling | CSS files; no CSS framework is configured in `package.json` |
| Icons | `lucide-react` |
| Charts | `recharts` |
| Navigation | React state and conditional rendering in `App.jsx`; no routing library is configured |
| Backend, database and API integrations | None found in this repository. The current app is frontend-only and uses demo data. |

The package manifest also lists `mammoth` and `pdfjs-dist`, but they are not imported by the current source files.

## 5. Installation and execution

### Prerequisites

- Node.js (an active LTS release is recommended)
- npm

### Install and start the frontend

Run these commands from the project root:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. The development server's port is not fixed in this guide; use the address Vite reports.

### Environment variables and backend

The current frontend does not read environment variables, and no `.env` template or backend/server project is present in this repository. No environment configuration or backend startup command is required for the demo.

### Production build and preview

```sh
npm run build
npm run preview
```

The build output is written to `dist/`. `npm run preview` serves that build locally; use the address printed by Vite.

### Linting and tests

```sh
npm run lint
```

There is no test script configured in `package.json`, so no project test command is currently available.

## 6. Demo login instructions

The login screen does not display demo email addresses, passwords, or credential helper boxes. Admin, HR, and Recruiter accounts use the same sign-in form. These demo credentials are verified against the checks in `src/pages/Login.jsx` and the HR/Recruiter member list in `src/data/demoData.js`.

### Admin demo login

- **Email:** `admin@aifagen.demo`
- **Password:** `Admin@123`

### HR demo login

Both HR accounts use the same demo password:

| Email | Password |
| --- | --- |
| `priya@aifagen.demo` | `Demo@123` |
| `rahul@aifagen.demo` | `Demo@123` |

### Recruiter demo login

All Recruiter accounts use the same demo password:

| Email | Password |
| --- | --- |
| `anjali@aifagen.demo` | `Demo@123` |
| `kiran@aifagen.demo` | `Demo@123` |
| `sneha@aifagen.demo` | `Demo@123` |

These are prototype credentials, not production credentials. Authentication is hardcoded in client-side code and must not be used to protect a production deployment.

## 7. Requirements and implementation status

“Implemented and verified” below refers to frontend behavior available in this repository, not a production backend workflow.

| Capability | Status | Evidence and limits |
| --- | --- | --- |
| Shared demo sign-in | **Demo/sample-data only** | `Login.jsx` compares credentials in browser code; there is no authentication API or secure credential store. |
| Admin authorization | **Partially implemented** | `App.jsx` renders admin navigation for the Admin role, but role checks are client-side and can be bypassed; no server authorization exists. |
| HR and Recruiter workspace access | **Partially implemented** | Login derives a role from the local demo member list and renders a matching workspace. No backend identity, fine-grained permissions, or server-side data scoping is present. |
| Dashboard metrics and operational records | **Demo/sample-data only** | The interface uses hardcoded, generated, or component-local records rather than live platform data. |
| Context-aware admin assistant | **Demo AI / rule-based insights** | The floating assistant summarizes the active page's in-memory data and filters. It does not call a model or modify records. |
| Responsive layouts | **Frontend behavior** | Shared layout safeguards complement page-specific breakpoints for phones, tablets, laptops, and desktop screens. Tables scroll inside their containers; navigation and dialogs adapt to smaller viewports. |
| User search, filters, profile actions and CSV export | **Implemented and verified (frontend only)** | The page filters and edits local state and creates a CSV in the browser; it does not query a user service. |
| Server-side pagination | **Not implemented** | Any pagination/filtering in the UI operates on data already loaded in the browser. |
| Payment history and renewals | **Demo/sample-data only** | Payment and renewal rows are seeded in the Payments component. |
| Refund processing | **Demo/sample-data only** | The refund flow updates local payment state; it does not call a gateway or execute a financial transaction. |
| Job visibility, bulk actions and internal job editing | **Implemented and verified (frontend only)** | Controls update local component state. Job collection and posting changes are not sent to an API. |
| Job-source refresh and retry | **Demo/sample-data only** | Simulated timers update demo source statuses and counts; there is no live source connection. |
| AI usage reporting and estimated costs | **Demo/sample-data only** | Usage values and provider/feature breakdowns are local data/estimates, not provider telemetry. |
| CSV exports | **Implemented and verified (frontend only)** | Applicable pages generate CSV files in the browser from their current local data; exports are not generated by a server. |
| Audit logging | **Partially implemented** | Sample audit records and feedback moderation events are displayed/exported. There is no central, durable, tamper-resistant audit service, and other UI actions are not comprehensively recorded. |
| Feedback moderation and complaint workflows | **Partially implemented** | Review/complaint actions and audit entries update in-memory React state; no persistence, notifications, or backend moderation service is connected. |
| Admin management | **Demo/sample-data only** | Settings can add/remove entries in local state, but does not create, authenticate, or revoke real admin accounts. |
| Connected-service status | **Demo/sample-data only** | Status cards are seeded and refresh is simulated; no health-check APIs are called. |
| Session refresh/persistence | **Not implemented** | The current user is held in React state and is not restored after a page reload; no refresh-token/session endpoint exists. |
| Database, backend APIs and production integrations | **Pending backend integration** | No backend or database project is present in the repository. |
| Automated tests | **Not implemented/configured** | `package.json` has no test script or configured test runner. |

## 8. Context-aware voice briefing assistant

The existing floating **AI** button opens a non-modal side panel on the Admin, HR, and Recruiter workspaces. The assistant follows the app's existing active page/workspace and receives a small page snapshot from each page component. Page-specific context builders in `src/services/pageContextService.js` prepare concise, deterministic briefings, metrics, attention items, recommendations, and follow-up answers from available local data.

The panel is labeled **Voice briefing demo · rule-based**. Speech is never played automatically: the admin chooses **Play briefing**. Browser SpeechSynthesis is used for speech output when available, with English voice selection where available, pause/resume, stop, replay, and spoken captions. The Web Speech API is used for voice questions only in browsers that expose it; typed questions remain available. Browser, voice-list, and microphone-permission limitations are explained in the panel. Actual support varies by browser, operating system, and secure-context/permission settings.

Dashboard, payment, job-source, AI-usage, audit, HR, recruiter, feedback, and settings values are only as reliable as the existing local demo records. Estimated AI costs are not provider billing data; connected-service statuses are not health checks; and comparisons are only described when the data snapshot contains a comparison. The assistant does not send records to external services and intentionally excludes sensitive details such as payment identifiers, audit reasons, complaint notes, and personal candidate data from its context summary.

The assistant is read-only: recommendations describe existing page actions, and it cannot change visibility, issue refunds, publish reviews, or modify any record. The UI and context/response boundary are separate so a future secure backend provider can replace local rule-based answers. No AI API key, model endpoint, or authentication mechanism is configured in this frontend.
