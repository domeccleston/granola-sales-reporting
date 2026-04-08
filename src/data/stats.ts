import type { Email, EmailType, TimePeriod } from "./types";

const PERIOD_DAYS: Record<TimePeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export function filterByPeriod(emails: Email[], period: TimePeriod): Email[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PERIOD_DAYS[period]);
  return emails.filter((e) => new Date(e.sentAt) >= cutoff);
}

export function openRate(emails: Email[]): number {
  if (emails.length === 0) return 0;
  return emails.filter((e) => e.opened).length / emails.length;
}

export function clickRate(emails: Email[]): number {
  if (emails.length === 0) return 0;
  return emails.filter((e) => e.clicked).length / emails.length;
}

export function emailsByType(emails: Email[]): Record<EmailType, number> {
  return {
    "cold-outbound": emails.filter((e) => e.type === "cold-outbound").length,
    "follow-up": emails.filter((e) => e.type === "follow-up").length,
    nurture: emails.filter((e) => e.type === "nurture").length,
    "re-engagement": emails.filter((e) => e.type === "re-engagement").length,
  };
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}
