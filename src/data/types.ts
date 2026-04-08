export type EmailType = "cold-outbound" | "follow-up" | "nurture" | "re-engagement";

export interface Email {
  id: string;
  subject: string;
  type: EmailType;
  sentAt: string;
  opened: boolean;
  clicked: boolean;
  recipientEmail: string;
  recipientName: string;
}

export interface Rep {
  id: string;
  name: string;
  avatarUrl: string;
  emails: Email[];
}

export type TimePeriod = "7d" | "30d" | "90d";
