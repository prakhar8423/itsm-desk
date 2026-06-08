const now = Date.now();
const h = (n) => new Date(now - n * 3600 * 1000).toISOString();

let counter = 1042;
export function nextTicketNumber(existing) {
  const nums = existing
    .map((t) => parseInt(String(t.id).replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1041;
  return `INC-${max + 1}`;
}

export const SEED_TICKETS = [
  {
    id: "INC-1042",
    title: "Email server not responding for Sales team",
    description:
      "Multiple users in the Sales department report they cannot send or receive email. Outlook shows 'trying to connect' indefinitely.",
    category: "Incident",
    priority: "Critical",
    status: "In Progress",
    assignee: "Priya Nair",
    requester: "John Carter",
    createdAt: h(6),
    updatedAt: h(1),
    activity: [
      { id: "a1", type: "created", text: "Ticket created", at: h(6) },
      {
        id: "a2",
        type: "comment",
        text: "Confirmed the Exchange node is unreachable. Failing over to secondary.",
        author: "Priya Nair",
        at: h(2),
      },
      {
        id: "a3",
        type: "status",
        text: "Status changed from Open to In Progress",
        at: h(1),
      },
    ],
  },
  {
    id: "INC-1041",
    title: "Request: New laptop for onboarding hire",
    description:
      "New marketing analyst starts Monday. Needs a standard-issue laptop, dual monitors, and access to the design suite.",
    category: "Service Request",
    priority: "Medium",
    status: "Open",
    assignee: "Marcus Webb",
    requester: "Amira Hassan",
    createdAt: h(30),
    updatedAt: h(30),
    activity: [
      { id: "a1", type: "created", text: "Ticket created", at: h(30) },
    ],
  },
  {
    id: "INC-1040",
    title: "VPN drops every 10 minutes on remote machines",
    description:
      "Remote staff get disconnected from the corporate VPN roughly every ten minutes, breaking long-running sessions.",
    category: "Problem",
    priority: "High",
    status: "On Hold",
    assignee: "Lena Ortiz",
    requester: "Tom Bishop",
    createdAt: h(50),
    updatedAt: h(20),
    activity: [
      { id: "a1", type: "created", text: "Ticket created", at: h(50) },
      {
        id: "a2",
        type: "comment",
        text: "Waiting on the network vendor to confirm firmware patch availability.",
        author: "Lena Ortiz",
        at: h(20),
      },
      {
        id: "a3",
        type: "status",
        text: "Status changed from In Progress to On Hold",
        at: h(20),
      },
    ],
  },
  {
    id: "INC-1039",
    title: "Deploy updated payroll application to production",
    description:
      "Change request to roll out v3.2 of the payroll app. Includes DB migration. Scheduled maintenance window approved.",
    category: "Change",
    priority: "High",
    status: "Open",
    assignee: "Devon Park",
    requester: "Wei Chen",
    createdAt: h(72),
    updatedAt: h(72),
    activity: [
      { id: "a1", type: "created", text: "Ticket created", at: h(72) },
    ],
  },
  {
    id: "INC-1038",
    title: "Printer on 3rd floor jams on every job",
    description:
      "The shared HP printer near the 3rd floor kitchen jams on the first page of every print job.",
    category: "Incident",
    priority: "Low",
    status: "Resolved",
    assignee: "Sara Klein",
    requester: "Grace Mwangi",
    createdAt: h(96),
    updatedAt: h(40),
    activity: [
      { id: "a1", type: "created", text: "Ticket created", at: h(96) },
      {
        id: "a2",
        type: "comment",
        text: "Cleared a torn label stuck in the feed roller. Test prints are clean.",
        author: "Sara Klein",
        at: h(41),
      },
      {
        id: "a3",
        type: "status",
        text: "Status changed from In Progress to Resolved",
        at: h(40),
      },
    ],
  },
  {
    id: "INC-1037",
    title: "Access request: Finance shared drive",
    description:
      "Requesting read/write access to the Finance shared drive for quarterly reporting duties.",
    category: "Service Request",
    priority: "Low",
    status: "Closed",
    assignee: "Marcus Webb",
    requester: "Olek Nowak",
    createdAt: h(140),
    updatedAt: h(110),
    activity: [
      { id: "a1", type: "created", text: "Ticket created", at: h(140) },
      {
        id: "a2",
        type: "comment",
        text: "Access granted after manager approval. Closing.",
        author: "Marcus Webb",
        at: h(110),
      },
      {
        id: "a3",
        type: "status",
        text: "Status changed from Resolved to Closed",
        at: h(110),
      },
    ],
  },
  {
    id: "INC-1036",
    title: "Database CPU pegged at 100% during reports run",
    description:
      "The analytics database hits 100% CPU whenever the nightly reporting job runs, slowing all queries.",
    category: "Problem",
    priority: "Critical",
    status: "Open",
    assignee: "Unassigned",
    requester: "Wei Chen",
    createdAt: h(10),
    updatedAt: h(10),
    activity: [
      { id: "a1", type: "created", text: "Ticket created", at: h(10) },
    ],
  },
];
