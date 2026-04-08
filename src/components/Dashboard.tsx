import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reps } from "../data/dummy";
import { filterByPeriod, openRate, clickRate, pct } from "../data/stats";
import type { TimePeriod } from "../data/types";

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export default function Dashboard() {
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const navigate = useNavigate();

  const repData = reps
    .map((rep) => {
      const emails = filterByPeriod(rep.emails, period);
      return { rep, emails };
    })
    .sort((a, b) => b.emails.length - a.emails.length);

  const allEmails = repData.flatMap((r) => r.emails);

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-row">
          <h1>Team outreach</h1>
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

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-value">{allEmails.length}</span>
          <span className="kpi-label">Total emails sent</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{pct(openRate(allEmails))}</span>
          <span className="kpi-label">Team open rate</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{pct(clickRate(allEmails))}</span>
          <span className="kpi-label">Team click rate</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{reps.length}</span>
          <span className="kpi-label">Active reps</span>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Rep</th>
            <th className="num">Emails sent</th>
            <th className="num">Open rate</th>
            <th className="num">Click rate</th>
          </tr>
        </thead>
        <tbody>
          {repData.map(({ rep, emails }) => (
            <tr
              key={rep.id}
              className="clickable-row"
              onClick={() => navigate(`/rep/${rep.id}`)}
            >
              <td className="rep-cell">
                <img src={rep.avatarUrl} alt="" className="avatar" />
                {rep.name}
              </td>
              <td className="num">{emails.length}</td>
              <td className="num">{pct(openRate(emails))}</td>
              <td className="num">{pct(clickRate(emails))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
