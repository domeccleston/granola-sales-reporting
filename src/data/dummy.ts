import type { Rep, Email, EmailType } from "./types";

const EMAIL_TYPES: EmailType[] = ["cold-outbound", "follow-up", "nurture", "re-engagement"];

const SUBJECTS = [
  "Quick intro — saw your talk at SaaStr",
  "Following up on our chat",
  "New case study you might like",
  "Checking in — any questions?",
  "Thought of you when I saw this",
  "Re: Partnership opportunity",
  "Would love 15 min of your time",
  "Just published something relevant to your team",
  "Quick question about your stack",
  "Congrats on the funding round!",
];

const NAMES = [
  "Sarah Chen",
  "Marcus Johnson",
  "Priya Patel",
  "Alex Rivera",
  "Jordan Kim",
  "Taylor Okafor",
];

const RECIPIENTS = [
  { name: "Jamie Smith", email: "jamie.smith@acme.com" },
  { name: "Morgan Lee", email: "morgan.lee@globex.io" },
  { name: "Casey Brown", email: "casey@initech.com" },
  { name: "Riley Davis", email: "r.davis@hooli.net" },
  { name: "Avery Wilson", email: "avery.wilson@piedpiper.com" },
  { name: "Quinn Taylor", email: "qt@soylent.co" },
  { name: "Blake Anderson", email: "banderson@umbrella.org" },
  { name: "Drew Thomas", email: "drew.t@waystar.io" },
  { name: "Finley Jackson", email: "finley@massivedev.com" },
  { name: "Hayden White", email: "hwhite@lumon.com" },
  { name: "Jules Harris", email: "jules.harris@vance.co" },
  { name: "Logan Martin", email: "logan@dunder.com" },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 10) + 8);
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString();
}

function generateEmails(count: number): Email[] {
  return Array.from({ length: count }, (_, i) => {
    const opened = Math.random() > 0.35;
    const recipient = randomFrom(RECIPIENTS);
    return {
      id: `email-${i}-${Math.random().toString(36).slice(2, 8)}`,
      subject: randomFrom(SUBJECTS),
      type: randomFrom(EMAIL_TYPES),
      sentAt: randomDate(90),
      opened,
      clicked: opened && Math.random() > 0.5,
      recipientEmail: recipient.email,
      recipientName: recipient.name,
    };
  });
}

export const reps: Rep[] = NAMES.map((name, i) => ({
  id: `rep-${i}`,
  name,
  avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
  emails: generateEmails(60 + Math.floor(Math.random() * 90)),
}));
