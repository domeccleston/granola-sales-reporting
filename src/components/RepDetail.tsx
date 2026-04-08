import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { reps } from "../data/dummy";
import {
  filterByPeriod,
  openRate,
  clickRate,
  emailsByType,
  pct,
} from "../data/stats";
import type { TimePeriod } from "../data/types";

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const TYPE_LABELS: Record<string, string> = {
  "cold-outbound": "Cold outbound",
  "follow-up": "Follow-up",
  nurture: "Nurture",
  "re-engagement": "Re-engagement",
};

export default function RepDetail() {
  const { repId } = useParams<{ repId: string }>();
  const [period, setPeriod] = useState<TimePeriod>("30d");

  const rep = reps.find((r) => r.id === repId);
  if (!rep) return <div className="page">Rep not found</div>;

  const emails = filterByPeriod(rep.emails, period);
  const typeBreakdown = emailsByType(emails);

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/" className="back-link">
          &larr; All reps
        </Link>
        <div className="header-row">
          <div className="rep-header">
            <img src={rep.avatarUrl} alt="" className="avatar avatar-lg" />
            <h1>{rep.name}</h1>
          </div>
          <div className="pill-group">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                className={`pill ${period === p.value ? "active" : ""}`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="kpi-grid kpi-grid-3">
        <div className="kpi-card">
          <span className="kpi-value">{emails.length}</span>
          <span className="kpi-label">Emails sent</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{pct(openRate(emails))}</span>
          <span className="kpi-label">Open rate</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{pct(clickRate(emails))}</span>
          <span className="kpi-label">Click rate</span>
        </div>
      </div>

      <section className="section">
        <h2>Emails by type</h2>
        <div className="type-bars">
          {Object.entries(typeBreakdown).map(([type, count]) => (
            <div key={type} className="type-bar-row">
              <span className="type-label">{TYPE_LABELS[type]}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  data-type={type}
                  style={{
                    width: `${emails.length ? (count / emails.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="type-count">{count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Recent emails</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Type</th>
              <th>To</th>
              <th>Sent</th>
              <th className="num">Opened</th>
              <th className="num">Clicked</th>
            </tr>
          </thead>
          <tbody>
            {emails
              .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
              .map((email) => (
                <tr key={email.id}>
                  <td>
                    <a
                      href={`mailto:${email.recipientEmail}?subject=${encodeURIComponent(email.subject)}`}
                      className="email-link"
                    >
                      {email.subject}
                    </a>
                  </td>
                  <td>
                    <span className={`badge badge-${email.type}`}>
                      {TYPE_LABELS[email.type]}
                    </span>
                  </td>
                  <td className="recipient-cell">
                    <span className="recipient-name">{email.recipientName}</span>
                    <span className="muted">{email.recipientEmail}</span>
                  </td>
                  <td className="muted">
                    {new Date(email.sentAt).toLocaleDateString()}
                  </td>
                  <td className="num">{email.opened ? "Yes" : "No"}</td>
                  <td className="num">{email.clicked ? "Yes" : "No"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
