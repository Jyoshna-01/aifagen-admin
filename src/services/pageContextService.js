const pageDefinitions = {
  Dashboard: {
    description: "A high-level view of users, revenue, subscriptions, and job-source health.",
    questions: ["What needs attention today?", "Explain user growth", "Summarize payment health"],
  },
  Users: {
    description: "Manage user accounts, subscription plans, registration status, and screening progress.",
    questions: ["Summarize user plans", "Which filters are active?", "How many accounts need attention?"],
  },
  Payments: {
    description: "Review payment activity, failed transactions, refunds recorded in the demo data, and renewals.",
    questions: ["Summarize failed payments", "What renewals are coming up?", "How much was collected in this period?"],
  },
  Jobs: {
    description: "Review collected job listings, their visibility, sources, and collection status.",
    questions: ["How many listings are visible?", "Which job sources have listings?", "What should I review?"],
  },
  "Internal Jobs": {
    description: "Manage company-created job postings and check listing completeness and visibility.",
    questions: ["Which postings need review?", "How many listings are hidden?", "Are any fields incomplete?"],
  },
  "Job Sources": {
    description: "Monitor job collection source status, recent runs, saved jobs, and recorded errors.",
    questions: ["Which sources need attention?", "How many jobs were saved recently?", "What do the latest source errors say?"],
  },
  "AI Usage": {
    description: "Review demo AI-call estimates, cost estimates, providers, features, and high-usage accounts.",
    questions: ["Which features use the most calls?", "Which provider has the most usage?", "Are these actual provider costs?"],
  },
  "Audit Log": {
    description: "Review recorded administrative and moderation actions without exposing unnecessary personal details.",
    questions: ["What actions were recorded recently?", "Were any records changed?", "What reasons were recorded?"],
  },
  Settings: {
    description: "Review configured admin access and the displayed status of connected services.",
    questions: ["Which services need attention?", "How many admin accounts are configured?", "Are these service checks verified?"],
  },
  HR: {
    description: "Review the available HR recruitment pipeline, recruiter workload, jobs, and placements.",
    questions: ["Summarize the candidate pipeline", "How many openings are active?", "What needs follow-up?"],
  },
  Recruiters: {
    description: "Review recruiter records, workload, candidate pipelines, and applications.",
    questions: ["Summarize recruiter workload", "How many applications are recorded?", "Which recruiters are active?"],
  },
  Clients: {
    description: "Review client records, openings, and their current status.",
    questions: ["How many client openings are available?", "Which clients need attention?", "Summarize the current filters"],
  },
  "Feedback & Complaints": {
    description: "Review feedback volume, moderation status, ratings, and complaint follow-up needs.",
    questions: ["How many reviews are awaiting moderation?", "Which complaints need attention?", "Summarize feedback ratings"],
  },
  "Feedback Overview": {
    description: "Review the available feedback and complaint overview metrics.",
    questions: ["What needs attention in feedback?", "Summarize feedback ratings", "How many complaints remain open?"],
  },
  "Candidate Reviews": {
    description: "Review rating distribution and candidate-review moderation status.",
    questions: ["How many reviews are awaiting moderation?", "What is the average rating?", "What moderation states are present?"],
  },
  Complaints: {
    description: "Review complaint status and follow-up priorities without exposing complaint details.",
    questions: ["Which complaints need attention?", "How many high-priority complaints are open?", "What statuses are represented?"],
  },
  "Moderation History": {
    description: "Review recorded moderation activity and decision counts.",
    questions: ["How many moderation actions are recorded?", "Were reasons recorded?", "What moderation statuses need review?"],
  },
  "HR Workspace": {
    description: "Review the signed-in HR member's available candidate, interview, and placement pipeline.",
    questions: ["Summarize the candidate pipeline", "How many interviews are scheduled?", "What needs follow-up?"],
  },
  "Recruiter Workspace": {
    description: "Review the signed-in recruiter's assigned candidates, applications, and recorded activities.",
    questions: ["Summarize my candidate pipeline", "How many applications are recorded?", "What needs follow-up?"],
  },
};

const countBy = (records = [], key) =>
  records.reduce((counts, record) => {
    const value = record?.[key] || "Unspecified";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function buildDashboard(data) {
  const sources = asList(data.sources);
  const expiring = Number(data.expiringSoon || 0);
  const failedPayments = Number(data.failedPayments || 0);
  const failedSources = sources.filter((source) => source.status === "Failed").length;
  const revenueHistory = asList(data.revenueHistory);
  const signupHistory = asList(data.signupHistory);
  const chartComparison = signupHistory.length >= 14
    ? {
        firstWeek: signupHistory.slice(0, 7).reduce((sum, item) => sum + Number(item.users || 0), 0),
        lastWeek: signupHistory.slice(-7).reduce((sum, item) => sum + Number(item.users || 0), 0),
      }
    : null;
  const firstRevenue = revenueHistory[0];
  const latestRevenue = revenueHistory[revenueHistory.length - 1];
  return {
    summary: `${data.totalUsers ?? "Unavailable"} users are represented in this dashboard snapshot. ${data.newUsers ?? "Unavailable"} registrations are shown for the selected ${data.period || "period"}.`,
    metrics: [
      ["Total users", data.totalUsers],
      ["New registrations", data.newUsers],
      ["Paying users", data.payingUsers],
      ["Paid conversion", data.conversionRate == null ? null : `${data.conversionRate}%`],
      ["Displayed revenue", data.revenue == null ? null : `$${Number(data.revenue).toLocaleString()}`],
      ["Failed payments", data.failedPayments],
    ],
    good: data.payingUsers ? [`${data.payingUsers} users are on a paid plan.`] : [],
    attention: [
      ...(failedSources ? [`${failedSources} source(s) are marked Failed in the dashboard snapshot.`] : []),
      ...(failedPayments ? [`${failedPayments} payment(s) are marked failed.`] : []),
      ...(expiring ? [`${expiring} subscription(s) expire within seven days.`] : []),
      ...(!sources.length ? ["Job-source status data is unavailable."] : []),
    ],
    recommendations: [
      ...(failedSources ? ["Review failed connectors on Job Sources."] : []),
      ...(failedPayments ? ["Review failed transactions on Payments."] : []),
      ...(expiring ? ["Review upcoming expirations in Users or Payments."] : []),
      ...(!failedSources && !failedPayments && !expiring ? ["Continue monitoring the displayed dashboard metrics."] : []),
    ],
    facts: [
      `Plan distribution: ${asList(data.plans).map((plan) => `${plan.name}: ${Number(plan.value).toLocaleString()}`).join(", ") || "unavailable"}.`,
      "These are the existing displayed demo figures, not verified production data.",
      ...(firstRevenue && latestRevenue
        ? [`Displayed demo revenue history: ${firstRevenue.month} $${Number(firstRevenue.revenue).toLocaleString()} to ${latestRevenue.month} $${Number(latestRevenue.revenue).toLocaleString()}.`]
        : ["No historical revenue series is available."]),
      ...(asList(data.recentActivity).length
        ? [`Recent displayed activity: ${asList(data.recentActivity).slice(0, 3).map((item) => `${item.title} (${item.time})`).join("; ")}.`]
        : ["Recent activity is unavailable."]),
      ...(chartComparison
        ? [`Signup chart comparison: ${chartComparison.firstWeek} registrations in the first seven displayed days and ${chartComparison.lastWeek} in the last seven displayed days${chartComparison.lastWeek === chartComparison.firstWeek ? " (unchanged)" : chartComparison.lastWeek > chartComparison.firstWeek ? " (higher)" : " (lower)"}. The existing chart is generated demo data.`]
        : ["The selected signup window is too short for a first-week versus last-week comparison."]),
      `Signup figures are displayed for ${data.period || "the selected period"}; no historical comparison is supplied to the assistant.`,
    ],
  };
}

function buildUsers(data) {
  const users = asList(data.users);
  const plans = countBy(users, "plan");
  const statuses = countBy(users, "status");
  const pendingScreenings = users.filter((user) => !["Completed", "Passed"].includes(user.screeningStatus)).length;
  const expiring = Number(data.expiringSoon || 0);
  return {
    summary: `${data.total ?? users.length} user accounts are available; ${data.filtered ?? users.length} match the current search and filters.`,
    metrics: [["Total accounts", data.total ?? users.length], ["New registrations (30 days)", data.newRegistrations ?? "Unavailable"], ["Active", statuses.Active || 0], ["Inactive", statuses.Inactive || 0], ["Premium", plans.Premium || 0], ["Expiring soon", expiring]],
    good: [`Plan distribution in the available records: ${Object.entries(plans).map(([plan, total]) => `${plan}: ${total}`).join(", ") || "no records"}.`],
    attention: [
      ...(statuses["Past due"] ? [`${statuses["Past due"]} account(s) are past due.`] : []),
      ...(statuses.Inactive ? [`${statuses.Inactive} account(s) are inactive.`] : []),
      ...(pendingScreenings ? [`${pendingScreenings} user record(s) have screening not marked Completed or Passed.`] : []),
      ...(!users.length ? ["No user records match the current filters."] : []),
    ],
    recommendations: [data.filters ? `Current filters: ${data.filters}.` : "Review plan and status distributions; only matching records are included in the visible result count."],
    facts: [
      `Account status distribution: ${Object.entries(statuses).map(([status, total]) => `${status}: ${total}`).join(", ") || "unavailable"}.`,
      data.search ? `Current search term is active: “${data.search}”.` : "No user search term is active.",
    ],
  };
}

function buildPayments(data) {
  const payments = asList(data.payments);
  const failed = payments.filter((payment) => payment.status === "Failed").length;
  const refunds = payments.reduce((sum, payment) => sum + Number(payment.refundedAmount || 0), 0);
  const renewals = asList(data.renewals);
  const previousPeriod = data.previousPeriod;
  const comparison = previousPeriod
    ? `Previous equal-length period: ${previousPeriod.count} payment record(s), collected value $${Number(previousPeriod.collected || 0).toLocaleString()}.`
    : "No records are available for an equal-length previous-period comparison.";
  return {
    summary: `${payments.length} payment record(s) are in the selected date range. Collected value and failure counts are calculated from those records.`,
    metrics: [["Collected (displayed)", data.totalCollected == null ? null : `$${Number(data.totalCollected).toLocaleString()}`], ["Payments in range", payments.length], ["Failed", failed], ["Recorded refund amount", `$${refunds.toLocaleString()}`], ["Upcoming renewals (30 days)", renewals.length], ["Renewal value (displayed)", `$${renewals.reduce((sum, renewal) => sum + Number(renewal.amount || 0), 0).toLocaleString()}`]],
    good: [`${payments.filter((payment) => payment.status === "Paid").length} payment(s) are marked Paid.`],
    attention: [...(failed ? [`${failed} payment(s) are marked Failed.`] : []), ...(!payments.length ? ["No payment records match the current date range."] : [])],
    recommendations: [...(failed ? ["Review failed transactions in the existing Payments screen."] : []), ...(renewals.length ? ["Review the upcoming renewal list before the renewal dates."] : [])],
    facts: [comparison, "Upcoming renewal amounts are listed demo values, not collected revenue. Refund totals include only amounts recorded on payment records; the assistant does not initiate or confirm refunds."],
  };
}

function buildJobs(data) {
  const jobs = asList(data.jobs);
  const sources = countBy(jobs, "source");
  const statuses = countBy(jobs, "status");
  const incomplete = jobs.filter((job) => !job.title || !job.company || !job.location || !job.source).length;
  const visible = jobs.filter((job) => job.visible).length;
  const recent = jobs.filter((job) => job.isRecent).length;
  return {
    summary: `${data.total ?? jobs.length} job listing(s) are available; ${data.filtered ?? jobs.length} match current filters.`,
    metrics: [["Listings", data.total ?? jobs.length], ["Visible", visible], ["Hidden", jobs.length - visible], ["Recent postings", recent], ["Sources represented", Object.keys(sources).length]],
    good: [`Source distribution: ${Object.entries(sources).map(([source, total]) => `${source}: ${total}`).join(", ") || "no records"}.`],
    attention: [
      ...(incomplete ? [`${incomplete} listing(s) are missing a title, company, location, or source.`] : []),
      ...(["Failed", "Running", "Stalled"].filter((status) => statuses[status]).map((status) => `${statuses[status]} listing(s) have collection status ${status}.`)),
      ...(!jobs.length ? ["No job listings match the current filters."] : []),
    ],
    recommendations: [...(incomplete ? ["Review incomplete listing fields in Jobs."] : []), ...(jobs.some((job) => job.visible === false) ? ["Check whether hidden listings should remain hidden using the existing controls."] : []), ...(statuses.Failed ? ["Review failed collection records with their source in Jobs or Job Sources."] : [])],
    facts: [`Collection-status distribution: ${Object.entries(statuses).map(([status, total]) => `${status}: ${total}`).join(", ") || "unavailable"}.`, data.filters || "No active filters were supplied."],
  };
}

function buildInternalJobs(data) {
  const jobs = asList(data.jobs);
  const visible = jobs.filter((job) => job.visible).length;
  const incomplete = jobs.filter((job) => !job.title || !job.department || !job.location || !job.description || !job.skills || !job.applyLink).length;
  return {
    summary: `${jobs.length} internal posting(s): ${visible} visible and ${jobs.length - visible} hidden.`,
    metrics: [["Total postings", jobs.length], ["Visible", visible], ["Hidden", jobs.length - visible], ["Incomplete", incomplete]],
    good: [...(visible ? [`${visible} posting(s) are visible.`] : [])],
    attention: [...(incomplete ? [`${incomplete} posting(s) have one or more empty core fields.`] : []), ...(!jobs.length ? ["No internal postings are available."] : [])],
    recommendations: [...(incomplete ? ["Review title, department, location, description, skills, and application link for incomplete postings."] : [])],
    facts: [
      `Posting list: ${jobs.slice(0, 5).map((job) => `${job.title || "Untitled"} (${job.visible ? "visible" : "hidden"})`).join(", ") || "empty"}.`,
      data.filters || "All internal postings are considered.",
    ],
  };
}

function buildJobSources(data) {
  const sources = asList(data.sources);
  const statuses = countBy(sources, "status");
  const trouble = ["Failed", "Blocked", "Stalled", "Skipped", "No jobs"];
  const attention = sources.filter((source) => trouble.includes(source.status));
  return {
    summary: `${sources.length} job source(s) are represented. ${statuses.Working || 0} are marked Working and ${attention.length} have a status that may need review.`,
    metrics: ["Working", "No jobs", "Blocked", "Skipped", "Failed", "Stalled", "Running"].map((status) => [status, statuses[status] || 0]).concat([["New jobs saved (shown)", sources.reduce((sum, source) => sum + Number(source.newJobs || 0), 0)]]),
    good: sources.filter((source) => source.status === "Working").slice(0, 3).map((source) => `${source.name} is marked Working; last run: ${source.lastRun || "not recorded"}.`),
    attention: attention.map((source) => `${source.name}: ${source.status}${source.note ? ` — ${source.note}` : ""}; last run: ${source.lastRun || "not recorded"}.`),
    recommendations: attention.slice(0, 3).map((source) => `Review ${source.name} in Job Sources${source.status === "Failed" || source.status === "Blocked" ? " and check its recorded collection issue" : ""}.`),
    facts: [
      ...(asList(data.runs).length
        ? [`Latest recorded run: started ${data.runs[0].started || "unavailable"}, completed ${data.runs[0].completed || "unavailable"}; ${data.runs[0].jobs ?? "unavailable"} jobs recorded, ${data.runs[0].failed ?? "unavailable"} sources failed.`]
        : []),
      ...(!sources.length ? ["Source data is unavailable."] : []),
    ],
  };
}

function buildAIUsage(data) {
  const providers = asList(data.providers);
  const features = asList(data.features);
  const users = asList(data.users);
  const top = [...users].sort((a, b) => Number(b.calls || 0) - Number(a.calls || 0))[0];
  return {
    summary: `${data.calls == null ? "Unavailable" : Number(data.calls).toLocaleString()} AI calls and ${data.cost == null ? "unavailable" : `estimated $${Number(data.cost).toFixed(2)}`} are shown for the selected period.`,
    metrics: [["AI calls", data.calls], ["Estimated cost", data.cost == null ? null : `$${Number(data.cost).toFixed(2)}`], ["Active users (displayed)", data.activeUsers], ["Providers", providers.length]],
    good: [...(features.length ? [`Largest displayed feature: ${[...features].sort((a, b) => b.calls - a.calls)[0].name}.`] : [])],
    attention: [...(top ? [`Highest-usage listed account: ${top.calls} calls; account identity is omitted here.`] : []), ...(!providers.length ? ["Provider breakdown is unavailable."] : [])],
    recommendations: ["Treat costs and usage as estimates from the current demo dataset, not provider billing data."],
    facts: [
      `Selected reporting window: ${data.period || "not supplied"}.`,
      ...providers.map((provider) => `${provider.name}: ${Number(provider.calls || 0).toLocaleString()} calls; estimated cost $${Number(provider.cost || 0).toFixed(2)}.`),
      ...features.map((feature) => `${feature.name}: ${Number(feature.calls || 0).toLocaleString()} calls.`),
      ...(data.comparisonAvailable ? ["A comparison period is available in the page data."] : ["No source-backed historical comparison is available; trend changes are not asserted."]),
    ],
  };
}

function buildAudit(data) {
  const entries = asList(data.entries);
  const actions = countBy(entries, "action");
  const targetTypes = countBy(entries, "targetType");
  return {
    summary: `${data.filtered ?? entries.length} of ${data.total ?? entries.length} recorded admin or moderation action(s) match the current filters.`,
    metrics: [["Recorded entries", data.total ?? entries.length], ["Matching filters", data.filtered ?? entries.length], ["Recorded changes", data.changes ?? "Unavailable"], ["Admins represented", data.admins ?? "Unavailable"], ["Entries with recorded reasons", data.reasonsRecorded ?? "Unavailable"]],
    good: [Object.keys(actions).length ? `Recorded action types: ${Object.entries(actions).map(([action, count]) => `${action} (${count})`).join(", ")}.` : "No action records are available."],
    attention: data.filtered === 0 ? ["No audit entries match the current filters."] : [],
    recommendations: ["Use the existing filters to inspect action details and recorded reasons; no unusual activity is inferred from counts alone."],
    facts: [
      `Up to ${entries.length} matching recent entries are summarized by action and record type; sensitive record identifiers and reason text are omitted.`,
      `Recorded reason availability in matching entries: ${data.reasonsRecorded ?? 0}.`,
      Object.keys(targetTypes).length
        ? `Affected record types: ${Object.entries(targetTypes).map(([type, count]) => `${type} (${count})`).join(", ")}.`
        : "No affected record types are available in the current filtered result.",
      data.filters || "No active filters were supplied.",
    ],
  };
}

function buildSettings(data) {
  const services = asList(data.services);
  const admins = asList(data.admins);
  const issues = services.filter((service) => service.status !== "OK");
  return {
    summary: `${admins.length} admin account(s) are configured. ${services.length} connected-service status label(s) are displayed, but these checks are not backend-verified.`,
    metrics: [["Configured admins", admins.length], ["Services shown", services.length], ["Marked OK", services.length - issues.length], ["Needs attention", issues.length]],
    good: services.filter((service) => service.status === "OK").map((service) => `${service.name} is displayed as OK (unverified demo status).`),
    attention: issues.map((service) => `${service.name}: ${service.status}${service.issue ? ` — ${service.issue}` : ""}.`),
    recommendations: issues.map((service) => `Verify ${service.name} in the existing Settings workflow; the displayed status is not a live service check.`),
    facts: ["No passwords, tokens, or secret values are included. Service status is configured/displayed demo information, not verified connectivity."],
  };
}

function buildHR(data) {
  return {
    summary: `${data.candidates ?? 0} candidate(s), ${data.interviews ?? 0} at the Interview stage, and ${data.placements ?? 0} placed candidate(s) are available in this HR view.`,
    metrics: [["Candidates", data.candidates], ["In pipeline", data.pipeline], ["Candidates at interview stage", data.interviews], ["Placements", data.placements], ["Openings", data.openings]],
    good: [`${data.recruiters ?? 0} recruiter(s) and ${data.clients ?? 0} client(s) are represented in this view.`],
    attention: [...(data.unassigned ? [`${data.unassigned} candidate(s) are not assigned to a recruiter or client.`] : []), ...(data.pending ? [`${data.pending} candidate(s) are in an active screening/interview stage.`] : [])],
    recommendations: [...(data.pending ? ["Review active candidates and their next recruitment step in the existing HR workspace."] : []), ...(data.unassigned ? ["Review assignment for unassigned candidates."] : [])],
    facts: [
      `Pipeline stage distribution: ${Object.entries(data.pipelineStages || {}).map(([stage, count]) => `${stage}: ${count}`).join(", ") || "unavailable"}.`,
      data.filters || "Counts reflect the available HR workspace records only.",
    ],
  };
}

function buildRecruiters(data) {
  return {
    summary: `${data.recruiters ?? 0} recruiter record(s), ${data.candidates ?? 0} tracked candidate(s), and ${data.applications ?? 0} application(s) are represented.`,
    metrics: [["Recruiters", data.recruiters], ["Active recruiters", data.active], ["Candidates (stated total)", data.candidates], ["Loaded profiles", data.profiles], ["Applications", data.applications], ["Placements", data.placements]],
    good: [data.active ? `${data.active} recruiter(s) are marked Active.` : "No active recruiter records were reported."],
    attention: data.needsReview ? [`${data.needsReview} recruiter record(s) are inactive or need review.`] : [],
    recommendations: data.needsReview ? ["Review recruiter status and workload in the existing Recruiters page."] : [],
    facts: [
      `Pipeline stages in loaded profiles: ${Object.entries(data.pipelineStages || {}).map(([stage, count]) => `${stage}: ${count}`).join(", ") || "unavailable"}.`,
      data.filters || "Counts come from recruiter and application data currently loaded in the page.",
    ],
  };
}

function buildClients(data) {
  return {
    summary: `${data.clients ?? 0} client record(s) and ${data.openings ?? 0} associated opening(s) are available.`,
    metrics: [["Clients", data.clients], ["Openings", data.openings], ["Active clients", data.active], ["Matching records", data.filtered]],
    good: data.active ? [`${data.active} client(s) are marked active.`] : [],
    attention: data.needsReview ? [`${data.needsReview} client record(s) are inactive or need review.`] : [],
    recommendations: data.filters ? [data.filters] : [],
    facts: ["Only client and opening counts are summarized; private contact details are not included."],
  };
}

function buildFeedback(data) {
  const isReviews = data.section === "Candidate Reviews";
  const isComplaints = data.section === "Complaints";
  const isHistory = data.section === "Moderation History";
  if (isHistory) {
    return {
      summary: `${data.moderationEvents ?? 0} moderation event(s) are recorded in the current in-memory history.`,
      metrics: [["Moderation events", data.moderationEvents], ["Events with a recorded reason", data.reasonsRecorded]],
      good: [],
      attention: data.moderationEvents ? [] : ["No moderation events are available in the current history."],
      recommendations: ["Use Moderation History to inspect recorded decisions. Private reasons and personal details are not repeated here."],
      facts: ["History is available only in the current frontend session and is not server-backed."],
    };
  }
  if (isComplaints) {
    return {
      summary: `${data.complaints ?? 0} complaint(s) are represented; ${data.openComplaints ?? 0} remain open or in progress.`,
      metrics: [["Complaints", data.complaints], ["Open complaints", data.openComplaints], ["High-priority open", data.priorityComplaints]],
      good: [],
      attention: data.openComplaints ? [`${data.openComplaints} complaint(s) remain open or in progress.`] : [],
      recommendations: data.openComplaints ? ["Review open complaints through the existing complaint workflow."] : [],
      facts: [
        `Complaint status distribution: ${Object.entries(data.complaintStatuses || {}).map(([status, count]) => `${status}: ${count}`).join(", ") || "unavailable"}.`,
        "Complaint text, private notes, and personal information are intentionally omitted.",
      ],
    };
  }
  if (isReviews) {
    const reviewStatuses = countBy(asList(data.reviewStatuses), "status");
    return {
      summary: `${data.reviews ?? 0} candidate review(s) are available; ${data.pending ?? 0} await moderation.`,
      metrics: [["Reviews", data.reviews], ["Average rating", data.averageRating == null ? null : `${Number(data.averageRating).toFixed(1)} / 5`], ["Pending moderation", data.pending], ["Approved", data.approved]],
      good: data.approved ? [`${data.approved} review(s) have an approved moderation decision.`] : [],
      attention: data.pending ? [`${data.pending} review(s) await moderation.`] : [],
      recommendations: data.pending ? ["Review pending submissions and record the required moderation decision before publication."] : [],
      facts: [`Review status distribution: ${Object.entries(reviewStatuses).map(([status, count]) => `${status}: ${count}`).join(", ") || "unavailable"}.`, "Review text and personal information are intentionally omitted."],
    };
  }
  return {
    summary: `${data.reviews ?? 0} review(s) and ${data.complaints ?? 0} complaint(s) are represented in ${data.section || "Feedback & Complaints"}.`,
    metrics: [["Reviews", data.reviews], ["Average rating", data.averageRating == null ? null : `${Number(data.averageRating).toFixed(1)} / 5`], ["Pending moderation", data.pending], ["Open complaints", data.openComplaints], ["High-priority complaints", data.priorityComplaints]],
    good: data.approved ? [`${data.approved} review(s) have an approved moderation decision.`] : [],
    attention: [...(data.pending ? [`${data.pending} review(s) await moderation.`] : []), ...(data.openComplaints ? [`${data.openComplaints} complaint(s) remain open or in progress.`] : [])],
    recommendations: [...(data.pending ? ["Review pending submissions and record the required moderation decision before publication."] : []), ...(data.openComplaints ? ["Review open complaints through the existing complaint workflow."] : [])],
    facts: ["Complaint details, private notes, and personal information are intentionally omitted. No review is recommended for publication without a moderation decision."],
  };
}

function buildWorkspace(data, recruiter = false) {
  return {
    summary: `${data.candidates ?? 0} candidate(s) are available in this signed-in ${recruiter ? "recruiter" : "HR"} workspace.`,
    metrics: [["Candidates", data.candidates], ["Applications", data.applications], ["Interviews", data.interviews], ["Assessments", data.assessments], ["Screenings", data.screenings], ["Calls", data.calls], ["Placements", data.placements]],
    good: [`${data.active ?? 0} candidate(s) are in an active pipeline stage.`],
    attention: [...(data.followUps ? [`${data.followUps} candidate record(s) have follow-up items or pending activities.`] : []), ...(data.filtered === 0 ? ["No candidates match the current filter."] : [])],
    recommendations: [...(data.followUps ? ["Review the affected candidate records in the workspace; this assistant does not display candidate names or private notes."] : [])],
    facts: [
      `Pipeline stages: ${Object.entries(data.pipelineStages || {}).map(([stage, count]) => `${stage}: ${count}`).join(", ") || "unavailable"}.`,
      data.filters || "Data is limited to the signed-in member's locally available workspace records.",
    ],
  };
}

const builders = {
  Dashboard: buildDashboard,
  Users: buildUsers,
  Payments: buildPayments,
  Jobs: buildJobs,
  "Internal Jobs": buildInternalJobs,
  "Job Sources": buildJobSources,
  "AI Usage": buildAIUsage,
  "Audit Log": buildAudit,
  Settings: buildSettings,
  HR: buildHR,
  Recruiters: buildRecruiters,
  Clients: buildClients,
  "Feedback & Complaints": buildFeedback,
  "Feedback Overview": buildFeedback,
  "Candidate Reviews": buildFeedback,
  Complaints: buildFeedback,
  "Moderation History": buildFeedback,
  "HR Workspace": (data) => buildWorkspace(data),
  "Recruiter Workspace": (data) => buildWorkspace(data, true),
};

export function buildPageContext({ pageId, title = pageId, data = {}, status = "ready", error = null }) {
  const definition = pageDefinitions[pageId] || {
    description: `A page-specific summary of the available ${title} data.`,
    questions: ["Summarize this page", "What information is unavailable?", "What should I review?"],
  };
  if (status === "loading") return { pageId, title, ...definition, status, summary: "Page data is loading.", metrics: [], good: [], attention: [], recommendations: [], facts: [] };
  if (error) return { pageId, title, ...definition, status: "error", summary: "Page data could not be summarized.", metrics: [], good: [], attention: [], recommendations: [], facts: [String(error)] };
  const result = (builders[pageId] || ((value) => ({
    summary: value.summary || `Showing available information for ${title}.`,
    metrics: asList(value.metrics),
    good: asList(value.good),
    attention: asList(value.attention),
    recommendations: asList(value.recommendations),
    facts: asList(value.facts),
  })))(data);
  return { pageId, title, ...definition, ...result, status };
}

export function answerPageQuestion(context, question) {
  const query = question.trim().toLowerCase();
  if (context.status === "loading") return "The page data is still loading. Please try again in a moment.";
  if (context.status === "error") return "I could not read this page's current data. Please use the page directly or try again.";
  if (/^\s*(please\s+)?(summarize|summary|overview|brief)(\s+(this|the)\s+page)?\s*[?.!]*$/.test(query)) {
    return buildPageBriefing(context);
  }
  if (/\b(attention|urgent|today|issue|issues|problem|problems)\b/.test(query)) {
    const attention = context.attention || [];
    const recommendations = context.recommendations || [];
    if (!attention.length) return "No items were flagged by the available page data.";
    return `${attention.slice(0, 2).join(" ")} ${recommendations.slice(0, 1).join(" ")}`.trim();
  }
  const content = [
    context.summary,
    ...context.metrics.map(([label, value]) => `${label}: ${value ?? "unavailable"}`),
    ...context.good,
    ...context.attention,
    ...context.recommendations,
    ...context.facts,
  ];
  const matches = content.filter((line) => {
    const terms = query.split(/\W+/)
      .filter((term) => term.length > 3)
      .map((term) => term.endsWith("s") ? term.slice(0, -1) : term);
    return terms.some((term) => line.toLowerCase().includes(term));
  });
  if (query.includes("filter") || query.includes("search")) return context.facts.find((fact) => /filter|search/i.test(fact)) || "No active search or filter details are available in the current page context.";
  if (/\b(growth|trend|trends|increase|increased|decrease|decreased|comparison|compare)\b/.test(query)) {
    const comparisons = context.facts.filter((fact) => /comparison|history|higher|lower|unchanged/i.test(fact));
    return comparisons.length
      ? comparisons.slice(0, 2).join(" ")
      : "No historical comparison data is available for this page, so I can’t report a trend reliably.";
  }
  if (matches.length) return matches.slice(0, 2).join(" ");
  return "I can’t answer that reliably from the information currently available on this page.";
}

export function buildPageBriefing(context) {
  if (context.status === "loading") return "This page’s data is still loading, so I can’t prepare a reliable briefing yet.";
  if (context.status === "error") return "I couldn’t read this page’s data. Please check the page and try again.";

  const parts = [context.summary];
  const metricKeywords = {
    Dashboard: ["New registrations", "Paid conversion", "Displayed revenue"],
    Users: ["Total accounts", "New registrations", "Active", "Expiring soon"],
    Payments: ["Collected", "Failed", "Upcoming renewals"],
    Jobs: ["Listings", "Visible", "Hidden", "Sources represented"],
    "Internal Jobs": ["Total postings", "Visible", "Hidden", "Incomplete"],
    "Job Sources": ["Working", "Failed", "Blocked", "New jobs saved"],
    "AI Usage": ["AI calls", "Estimated cost", "Providers"],
    "Audit Log": ["Recorded entries", "Matching filters", "Recorded changes"],
    Settings: ["Configured admins", "Services shown", "Needs attention"],
    HR: ["Candidates", "In pipeline", "Interviews", "Placements"],
    Recruiters: ["Recruiters", "Candidates (stated total)", "Applications", "Placements"],
    Clients: ["Clients", "Openings", "Active clients"],
    "HR Workspace": ["Candidates", "Applications", "Interviews", "Placements"],
    "Recruiter Workspace": ["Candidates", "Applications", "Interviews", "Placements"],
  };
  const relevantMetrics = metricKeywords[context.pageId] || [];
  const facts = [...context.facts];
  const comparison = facts.find((fact) => /previous equal-length period|comparison|revenue history/i.test(fact));
  const hasData = (value) => value !== null && value !== undefined && value !== "Unavailable";

  const chosenMetrics = (context.metrics || [])
    .filter(([label, value]) => relevantMetrics.includes(label) && hasData(value))
    .slice(0, 3)
    .map(([label, value]) => `${label}: ${value}.`);
  if (chosenMetrics.length) parts.push(chosenMetrics.join(" "));
  const notableFact = facts.find((fact) =>
    /plan distribution|account status distribution|collection-status distribution|complaint status distribution|review status distribution/i.test(fact)
  );
  if (notableFact) parts.push(notableFact);
  if (comparison) parts.push(comparison);
  if (context.attention?.length) parts.push(`Needs attention: ${context.attention.slice(0, 2).join(" ")}`);
  else parts.push("No items were flagged by the available page data.");
  if (context.recommendations?.length) parts.push(`Next: ${context.recommendations.slice(0, 2).join(" ")}`);
  const unavailable = facts.find((fact) => /unavailable|not supplied|not available/i.test(fact));
  if (unavailable) parts.push(unavailable);

  return parts.join(" ");
}
