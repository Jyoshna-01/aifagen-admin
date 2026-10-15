
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import "./Payments.css";
import useAssistantContext from "../hooks/useAssistantContext";

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const dateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const dateInDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

function Payments({ onAssistantContext }) {
  const [dateRange, setDateRange] = useState("30");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const [payments, setPayments] = useState([
    {
      id: "PAY-10021",
      user: "Sarah Johnson",
      email: "sarah@gmail.com",
      amount: 999,
      status: "Paid",
      method: "UPI",
      date: dateDaysAgo(1),
      refundedAmount: 0,
      refunds: [],
    },
    {
      id: "PAY-10020",
      user: "Rahul Kumar",
      email: "rahul@gmail.com",
      amount: 1499,
      status: "Paid",
      method: "Card",
      date: dateDaysAgo(2),
      refundedAmount: 0,
      refunds: [],
    },
    {
      id: "PAY-10019",
      user: "Priya Sharma",
      email: "priya@gmail.com",
      amount: 799,
      status: "Failed",
      method: "Card",
      date: dateDaysAgo(3),
      refundedAmount: 0,
      refunds: [],
      plan: "Basic",
    },
    {
      id: "PAY-10018",
      user: "Arjun Mehta",
      email: "arjun@gmail.com",
      amount: 1999,
      status: "Refunded",
      method: "UPI",
      date: dateDaysAgo(4),
      refundedAmount: 1999,
      refunds: [{ amount: 1999, reason: "Duplicate payment", date: dateDaysAgo(4) }],
    },
    {
      id: "PAY-10017",
      user: "Sneha Reddy",
      email: "sneha@gmail.com",
      amount: 999,
      status: "Paid",
      method: "Net Banking",
      date: dateDaysAgo(5),
      refundedAmount: 0,
      refunds: [],
    },
    {
      id: "PAY-10016",
      user: "Vikram Singh",
      email: "vikram@gmail.com",
      amount: 1499,
      status: "Failed",
      method: "Card",
      date: dateDaysAgo(6),
      refundedAmount: 0,
      refunds: [],
      plan: "Premium",
    },
    {
      id: "PAY-10015",
      user: "Ananya Rao",
      email: "ananya@gmail.com",
      amount: 999,
      status: "Paid",
      method: "UPI",
      date: dateDaysAgo(8),
      refundedAmount: 0,
      refunds: [],
    },
    {
      id: "PAY-10014",
      user: "Priya Sharma",
      email: "priya@gmail.com",
      amount: 799,
      status: "Paid",
      method: "Card",
      date: dateDaysAgo(34),
      refundedAmount: 0,
      refunds: [],
      plan: "Basic",
    },
    {
      id: "PAY-10013",
      user: "Vikram Singh",
      email: "vikram@gmail.com",
      amount: 1499,
      status: "Paid",
      method: "Card",
      date: dateDaysAgo(36),
      refundedAmount: 0,
      refunds: [],
      plan: "Premium",
    },
    {
      id: "PAY-10012",
      user: "Kiran Patel",
      email: "kiran@gmail.com",
      amount: 999,
      status: "Paid",
      method: "UPI",
      date: dateDaysAgo(38),
      refundedAmount: 0,
      refunds: [],
      plan: "Basic",
    },
    {
      id: "PAY-10011",
      user: "Kiran Patel",
      email: "kiran@gmail.com",
      amount: 999,
      status: "Failed",
      method: "UPI",
      date: dateDaysAgo(9),
      refundedAmount: 0,
      refunds: [],
      plan: "Basic",
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showRefund, setShowRefund] = useState(false);
  const [refundType, setRefundType] = useState("full");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundError, setRefundError] = useState("");

  const upcomingRenewals = [
    {
      name: "Ravi Kumar",
      email: "ravi@gmail.com",
      plan: "Premium",
      amount: 1499,
      renewal: dateInDays(3),
      days: 3,
    },
    {
      name: "Meena Reddy",
      email: "meena@gmail.com",
      plan: "Basic",
      amount: 999,
      renewal: dateInDays(8),
      days: 8,
    },
    {
      name: "Akhil Varma",
      email: "akhil@gmail.com",
      plan: "Pro",
      amount: 1999,
      renewal: dateInDays(16),
      days: 16,
    },
    {
      name: "Divya Rao",
      email: "divya@gmail.com",
      plan: "Premium",
      amount: 1499,
      renewal: dateInDays(24),
      days: 24,
    },
  ];

  const upcomingRenewalsInRange = upcomingRenewals.filter(
    (renewal) => renewal.days >= 0 && renewal.days <= 30
  );

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - Number(dateRange));
  cutoffDate.setHours(0, 0, 0, 0);

  const paymentsInRange = payments.filter((payment) => {
    const paymentDate = new Date(payment.date);
    return !Number.isNaN(paymentDate.getTime()) && paymentDate >= cutoffDate;
  });
  const previousPeriodStart = new Date(cutoffDate);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - Number(dateRange));
  const paymentsInPreviousRange = payments.filter((payment) => {
    const paymentDate = new Date(payment.date);
    return !Number.isNaN(paymentDate.getTime()) &&
      paymentDate >= previousPeriodStart && paymentDate < cutoffDate;
  });
  const previousCollected = paymentsInPreviousRange.reduce((total, payment) => {
    if (payment.status === "Failed") return total;
    return total + payment.amount - (payment.refundedAmount || 0);
  }, 0);

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      status === "All" || payment.status === status;

    const query = search.toLowerCase().trim();
    const paymentDate = new Date(payment.date);
    const matchesDateRange =
      !Number.isNaN(paymentDate.getTime()) && paymentDate >= cutoffDate;

    const matchesSearch =
      payment.user.toLowerCase().includes(query) ||
      payment.email.toLowerCase().includes(query) ||
      payment.id.toLowerCase().includes(query);

    return matchesDateRange && matchesStatus && matchesSearch;
  });

  const totalCollected = paymentsInRange.reduce((total, payment) => {
    if (payment.status === "Failed") return total;
    return total + payment.amount - (payment.refundedAmount || 0);
  }, 0);
  const failedPaymentCount = paymentsInRange.filter(
    (payment) => payment.status === "Failed"
  ).length;
  const totalRefunds = paymentsInRange.reduce(
    (total, payment) => total + (payment.refundedAmount || 0),
    0
  );
  useAssistantContext(onAssistantContext, "Payments", {
    payments: paymentsInRange.map(({ status, amount, refundedAmount }) => ({ status, amount, refundedAmount })),
    totalCollected,
    renewals: upcomingRenewalsInRange.map(({ plan, amount, days }) => ({ plan, amount, days })),
    previousPeriod: paymentsInPreviousRange.length
      ? { count: paymentsInPreviousRange.length, collected: previousCollected }
      : null,
    dateRange: `${dateRange} days`,
    filters: `date range ${dateRange} days; status ${status}; ${search ? "search active" : "no search"}`,
  });

  const latestPaymentByEmail = new Map();
  payments.forEach((payment) => {
    const latest = latestPaymentByEmail.get(payment.email);
    if (!latest || new Date(payment.date) > new Date(latest.date)) {
      latestPaymentByEmail.set(payment.email, payment);
    }
  });
  const failedPayers = [...latestPaymentByEmail.values()].filter(
    (payment) => payment.status === "Failed"
  );

  const openRefundModal = () => {
    setRefundType("full");
    setRefundAmount("");
    setRefundReason("");
    setRefundError("");
    setShowRefund(true);
  };

  const handleRefund = () => {
    if (!selectedPayment) return;

    const remainingAmount =
      selectedPayment.amount - (selectedPayment.refundedAmount || 0);
    const amount =
      refundType === "full" ? remainingAmount : Number(refundAmount);
    const reason = refundReason.trim();

    if (!reason) {
      setRefundError("Enter a reason before confirming the refund.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0 || amount > remainingAmount) {
      setRefundError(
        `Enter an amount greater than $0 and no more than ${formatMoney(remainingAmount)}.`
      );
      return;
    }

    const refund = { amount, reason, date: dateDaysAgo(0) };
    const updatedPayment = {
      ...selectedPayment,
      refundedAmount: (selectedPayment.refundedAmount || 0) + amount,
      refunds: [...(selectedPayment.refunds || []), refund],
    };
    updatedPayment.status =
      updatedPayment.refundedAmount >= updatedPayment.amount
        ? "Refunded"
        : "Paid";

    setPayments((previous) =>
      previous.map((payment) =>
        payment.id === selectedPayment.id ? updatedPayment : payment
      )
    );
    setSelectedPayment(updatedPayment);

    setShowRefund(false);
    setRefundError("");
  };

  const exportCsv = () => {
    const rows = [
      [
        "Payment ID",
        "User",
        "Email",
        "Amount USD",
        "Status",
        "Refunded Amount USD",
        "Refund Reasons",
        "Method",
        "Date",
      ],
      ...filteredPayments.map((payment) => [
        payment.id,
        payment.user,
        payment.email,
        payment.amount.toFixed(2),
        payment.status,
        (payment.refundedAmount || 0).toFixed(2),
        (payment.refunds || []).map((refund) => refund.reason).join("; "),
        payment.method,
        payment.date,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `aifagen-payments-${dateRange}-days.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="payments-page">
      {/* HEADER */}
      <div className="payments-header">
        <div>
          <h1>Payments</h1>
          <p>
            Monitor transactions, failed payments and upcoming renewals.
          </p>
        </div>

        <div className="payment-header-actions">
          <button className="outline-btn" onClick={exportCsv}>
            ↓ Export CSV
          </button>

          <button
            className="primary-btn"
            onClick={() => {
              setDateRange("30");
              setStatus("All");
              setSearch("");
            }}
          >
            ↻ Reset filters
          </button>
        </div>
      </div>

      <div className="payments-demo-notice" role="status">
        <AlertCircle size={16} />
        <span>
          Sample transactions only. Refund actions update this page session and
          do not trigger a real payment.
        </span>
      </div>

      {/* SUMMARY CARDS */}
      <div className="payment-summary-grid">
        <div className="payment-stat-card">
          <div className="payment-stat-top">
            <div className="payment-stat-icon collected">$</div>
            <span className="growth neutral">Last {dateRange} days</span>
          </div>

          <p>Total Collected</p>
          <h2>{formatMoney(totalCollected)}</h2>
          <span>Net of refunds · selected period</span>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-top">
            <div className="payment-stat-icon payments">#</div>
            <span className="growth neutral">Selected period</span>
          </div>

          <p>Number of Payments</p>
          <h2>{paymentsInRange.length}</h2>
          <span>Transactions in selected period</span>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-top">
            <div className="payment-stat-icon failed">!</div>
            <span className="growth danger">Needs follow-up</span>
          </div>

          <p>Failed Payments</p>
          <h2>{failedPaymentCount}</h2>
          <span>Failed in selected period</span>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-top">
            <div className="payment-stat-icon refunds">↩</div>
            <span className="growth neutral">Last {dateRange} days</span>
          </div>

          <p>Refunds</p>
          <h2>{formatMoney(totalRefunds)}</h2>
          <span>Refund amount in selected period</span>
        </div>
      </div>

      {/* ALL PAYMENTS */}
      <div className="payment-card">
        <div className="payment-card-header">
          <div>
            <h3>All Payments</h3>
            <p>View and manage all customer transactions.</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="payment-filters">
          <div className="search-wrapper">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search payment, user or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* PAYMENT TABLE */}
        <div className="payment-table-wrapper">
          <table className="payment-table">
            <thead>
              <tr>
                <th>PAYMENT ID</th>
                <th>USER</th>
                <th>AMOUNT (USD)</th>
                <th>STATUS</th>
                <th>METHOD</th>
                <th>DATE</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                >
                  <td>
                    <span className="payment-id">{payment.id}</span>
                  </td>

                  <td>
                    <div className="payment-user">
                      <div className="payment-avatar">
                        {payment.user
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>

                      <div>
                        <strong>{payment.user}</strong>
                        <small>{payment.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{formatMoney(payment.amount)}</strong>
                    {(payment.refundedAmount || 0) > 0 && (
                      <small className="payment-refund-subtext">
                        {formatMoney(payment.refundedAmount)} refunded
                      </small>
                    )}
                  </td>

                  <td>
                    <span
                      className={`payment-status ${payment.status.toLowerCase()}`}
                    >
                      <span className="status-dot"></span>
                      {payment.status}
                    </span>
                  </td>

                  <td>
                    <span className="payment-method">
                      {payment.method === "UPI" && "◉ "}
                      {payment.method === "Card" && "▣ "}
                      {payment.method === "Net Banking" && "▤ "}
                      {payment.method}
                    </span>
                  </td>

                  <td className="payment-date">{payment.date}</td>

                  <td>
                    <button
                      className="row-menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPayment(payment);
                      }}
                    >
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="payment-empty-row">
                    No payments match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing {filteredPayments.length} of {payments.length} payments
          </span>

          <div className="pagination">
            <button>‹</button>
            <button className="active-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </div>
      </div>

      {/* FAILED PAYERS + UPCOMING RENEWALS */}
      <div className="payment-bottom-grid">
        {/* FAILED PAYERS */}
        <div className="payment-card">
          <div className="payment-card-header">
            <div>
              <h3>Failed Payers</h3>
              <p>Users whose latest payment failed.</p>
            </div>

            <span className="attention-count">
              {failedPayers.length} need follow-up
            </span>
          </div>

          <div className="failed-payers-list">
            {failedPayers.map((payment) => (
              <div className="failed-payer" key={payment.email}>
                <div className="payment-avatar failed-avatar">
                  {payment.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="failed-user-info">
                  <strong>{payment.user}</strong>
                  <span>{payment.email}</span>
                </div>

                <div className="failed-details">
                  <strong>{formatMoney(payment.amount)}</strong>
                  <span>{payment.plan || "Plan not recorded"}</span>
                </div>

                <div className="failed-date">
                  <span>Failed</span>
                  <small>{payment.date}</small>
                </div>

                <a
                  className="contact-btn"
                  href={`mailto:${encodeURIComponent(payment.email)}?subject=${encodeURIComponent("Payment follow-up")}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  Contact
                </a>
              </div>
            ))}
            {failedPayers.length === 0 && (
              <p className="payment-list-empty">No users have a failed latest payment.</p>
            )}
          </div>
        </div>

        {/* UPCOMING RENEWALS */}
        <div className="payment-card">
          <div className="payment-card-header">
            <div>
              <h3>Upcoming Renewals</h3>
              <p>Plans ending within the next 30 days.</p>
            </div>

            <span className="renewal-count">
              {upcomingRenewalsInRange.length}
            </span>
          </div>

          <div className="renewals-list">
            {upcomingRenewalsInRange.map((user) => (
              <div className="renewal-item" key={user.email}>
                <div className="renewal-avatar">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="renewal-user">
                  <strong>{user.name}</strong>
                  <span>
                    {user.plan} · {formatMoney(user.amount)}
                  </span>
                </div>

                <div className="renewal-date">
                  <strong>
                    {user.days <= 7
                      ? `${user.days} days`
                      : user.renewal}
                  </strong>

                  <span>
                    {user.days <= 7 ? "ending soon" : "renewal"}
                  </span>
                </div>
              </div>
            ))}
            {upcomingRenewalsInRange.length === 0 && (
              <p className="payment-list-empty">
                No plans expire in the next 30 days.
              </p>
            )}
          </div>

          <p className="renewals-demo-note">
            Showing plans ending within the next 30 days · demo data
          </p>
        </div>
      </div>

      {/* PAYMENT DETAILS DRAWER */}
      {selectedPayment && (
        <div
          className="drawer-overlay"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="payment-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <span>Payment details</span>
                <h2>{selectedPayment.id}</h2>
              </div>

              <button onClick={() => setSelectedPayment(null)}>
                ×
              </button>
            </div>

            <div className="drawer-status">
              <span
                className={`payment-status ${selectedPayment.status.toLowerCase()}`}
              >
                <span className="status-dot"></span>
                {selectedPayment.status}
              </span>
            </div>

            <div className="drawer-amount">
              <span>Payment amount (USD)</span>
              <strong>{formatMoney(selectedPayment.amount)}</strong>
            </div>

            <div className="drawer-details">
              <div>
                <span>Customer</span>
                <strong>{selectedPayment.user}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedPayment.email}</strong>
              </div>

              <div>
                <span>Payment method</span>
                <strong>{selectedPayment.method}</strong>
              </div>

              <div>
                <span>Date</span>
                <strong>{selectedPayment.date}</strong>
              </div>
            </div>

            {selectedPayment.status === "Paid" && (
              <button
                className="refund-btn"
                onClick={openRefundModal}
              >
                ↩ Issue Refund
              </button>
            )}

            {(selectedPayment.refundedAmount || 0) > 0 && (
              <div className="drawer-refund-history">
                <h3>Refund history</h3>
                <strong>
                  {formatMoney(selectedPayment.refundedAmount)} refunded
                </strong>
                {(selectedPayment.refunds || []).map((refund, index) => (
                  <p key={`${refund.date}-${index}`}>
                    {formatMoney(refund.amount)} · {refund.date}
                    <span>{refund.reason}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {showRefund && selectedPayment && (
        <div className="modal-overlay">
          <div
            className="refund-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="refund-modal-title"
          >
            <div className="refund-modal-header">
              <div>
                <h2 id="refund-modal-title">Confirm refund</h2>
                <p>Refund payment {selectedPayment.id} · demo action only</p>
              </div>

              <button
                type="button"
                aria-label="Close refund dialog"
                onClick={() => setShowRefund(false)}
              >
                ×
              </button>
            </div>

            <div className="refund-warning">
              <span>!</span>
              <div>
                <strong>Confirm refund</strong>
                <p>
                  This only updates the sample record in this page session. No
                  money is transferred and no payment provider is contacted.
                </p>
              </div>
            </div>

            <span className="refund-field-label">Refund type</span>

            <div className="refund-options">
              <label className={`refund-option ${refundType === "full" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="refund"
                  value="full"
                  checked={refundType === "full"}
                  onChange={() => {
                    setRefundType("full");
                    setRefundError("");
                  }}
                />

                <div>
                  <strong>Full refund</strong>
                  <span>
                    {formatMoney(
                      selectedPayment.amount - (selectedPayment.refundedAmount || 0)
                    )}
                  </span>
                </div>
              </label>

              <label className={`refund-option ${refundType === "partial" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="refund"
                  value="partial"
                  checked={refundType === "partial"}
                  onChange={() => {
                    setRefundType("partial");
                    setRefundError("");
                  }}
                />

                <div>
                  <strong>Partial refund</strong>
                  <span>
                    Up to{" "}
                    {formatMoney(
                      selectedPayment.amount - (selectedPayment.refundedAmount || 0)
                    )}
                    {" "}remaining
                  </span>
                </div>
              </label>
            </div>

            {refundType === "partial" && (
              <>
                <label className="refund-field-label" htmlFor="refund-amount">
                  Partial refund amount
                </label>
                <input
                  id="refund-amount"
                  className="refund-amount-input"
                  type="number"
                  min="0.01"
                  max={
                    selectedPayment.amount -
                    (selectedPayment.refundedAmount || 0)
                  }
                  step="0.01"
                  value={refundAmount}
                  onChange={(event) => {
                    setRefundAmount(event.target.value);
                    setRefundError("");
                  }}
                  placeholder="0.00"
                />
              </>
            )}

            <label className="refund-field-label" htmlFor="refund-reason">
              Reason for refund
            </label>
            <textarea
              id="refund-reason"
              placeholder="Enter the reason for this refund..."
              rows="4"
              value={refundReason}
              onChange={(event) => {
                setRefundReason(event.target.value);
                setRefundError("");
              }}
            />

            {refundError && (
              <p className="refund-error" role="alert">
                {refundError}
              </p>
            )}

            <div className="refund-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowRefund(false);
                  setRefundError("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-refund-btn"
                onClick={handleRefund}
              >
                Confirm {refundType === "full" ? "Full" : "Partial"} Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
