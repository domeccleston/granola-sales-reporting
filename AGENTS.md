# Sales Reporting Dashboard

## What this is

A reporting dashboard for a VP of Sales to monitor team email outreach activity. Shows team-level KPIs, per-rep performance, email type breakdown, open/click rates, and drill-down into individual rep email activity.

## Data sources

All data comes from two systems. Do not suggest features that require data beyond what these APIs provide.

### Attio (CRM)

Used for: reps, contacts, companies, deals, lists.

**What the API exposes:**
- People (contacts) and Companies — full CRUD
- Deals, Users, Workspaces — full CRUD
- Lists and list entries
- Tasks, Notes, Comments
- Custom objects and attributes
- Webhooks for workspace events

**What the API does NOT expose:**
- Email interaction data (sends, opens, clicks)
- Activity/interaction history (no activities API exists)
- Communication intelligence metrics (last interaction, connection strength) — these exist in the UI but are not accessible via API
- Outreach campaign or sequence data

### Nylas (Email)

Used for: email sends, open/click tracking, message content.

**What the API exposes:**
- Messages: subject, sender, recipients (to/cc/bcc), body, snippet, timestamps, read status, folders/labels, attachments, thread ID
- Threads: participants, message timestamps, subject, folder/label associations
- Folders/Labels: full CRUD, hierarchical structure
- Message tracking (production apps only):
  - Opens — via tracking pixel, delivered as `message.opened` webhook
  - Link clicks — via link rewriting, delivered as `message.link_clicked` webhook
  - Thread replies — via `thread.replied` webhook
  - Tracking data includes: IP, user agent, timestamp, last 50 events per message
- Contacts: address book read/write
- Send: send messages, schedule sends, create drafts

**What the API does NOT expose:**
- Message body is NOT returned in list requests — only `snippet` (~200 chars). Must fetch individual messages for full body.
- BCC data is only available on sent items, not received messages
- Tracking requires a production Nylas app (not sandbox)
- Links with embedded credentials are not tracked
- `search_query_native` cannot be combined with most filter parameters on Gmail/Microsoft

**Rate limits:**
- 200 requests/grant/second for most endpoints
- 10 requests/grant/second for multipart message sends
- Provider limits apply underneath (Gmail: 2,000 messages/day, Microsoft: 10,000 requests/10 min)

## Architecture decisions

- The dashboard does NOT expose "Attio" or "Nylas" as user-facing concepts. These are implementation details. The user sees reps, emails, and metrics.
- Time period filtering (7d/30d/90d) is the primary data cut — not source system.
- Email type (cold outbound, follow-up, nurture, re-engagement) is a meaningful business dimension.
- Currently uses dummy data for prototyping. When integrating real APIs, Attio provides the rep roster and Nylas provides all email activity and tracking data.

## What NOT to suggest

- Call tracking, phone metrics, or SMS — we only do email outreach
- Features requiring Attio interaction/activity data — that API doesn't exist
- Real-time open/click dashboards without webhook infrastructure — Nylas tracking is webhook-based, not poll-based
- Full email body display in list views — Nylas only returns snippets in list responses
- Features that depend on data from systems other than Attio and Nylas
