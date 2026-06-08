export const CATEGORIES = [
  "Incident",
  "Service Request",
  "Problem",
  "Change",
];

export const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const STATUSES = [
  "Open",
  "In Progress",
  "On Hold",
  "Resolved",
  "Closed",
];

export const OPEN_STATUSES = ["Open", "In Progress", "On Hold"];
export const CLOSED_STATUSES = ["Resolved", "Closed"];

export const AGENTS = [
  "Unassigned",
  "Priya Nair",
  "Marcus Webb",
  "Lena Ortiz",
  "Devon Park",
  "Sara Klein",
];

export const REQUESTERS = [
  "John Carter",
  "Amira Hassan",
  "Tom Bishop",
  "Wei Chen",
  "Grace Mwangi",
  "Olek Nowak",
];

// SLA targets in hours by priority. Tickets open past target are "breaching".
export const SLA_HOURS = {
  Critical: 4,
  High: 24,
  Medium: 72,
  Low: 168,
};

export function priorityBadgeClass(priority) {
  switch (priority) {
    case "Critical":
      return "bg-red-600 text-white hover:bg-red-600";
    case "High":
      return "bg-orange-500 text-white hover:bg-orange-500";
    case "Medium":
      return "bg-amber-400 text-amber-950 hover:bg-amber-400";
    case "Low":
      return "bg-emerald-500 text-white hover:bg-emerald-500";
    default:
      return "";
  }
}

export function statusBadgeClass(status) {
  switch (status) {
    case "Open":
      return "bg-blue-600 text-white hover:bg-blue-600";
    case "In Progress":
      return "bg-violet-600 text-white hover:bg-violet-600";
    case "On Hold":
      return "bg-zinc-500 text-white hover:bg-zinc-500";
    case "Resolved":
      return "bg-emerald-600 text-white hover:bg-emerald-600";
    case "Closed":
      return "bg-zinc-700 text-white hover:bg-zinc-700";
    default:
      return "";
  }
}

export function categoryBadgeClass(category) {
  switch (category) {
    case "Incident":
      return "border-red-400 text-red-600 dark:text-red-400";
    case "Service Request":
      return "border-blue-400 text-blue-600 dark:text-blue-400";
    case "Problem":
      return "border-orange-400 text-orange-600 dark:text-orange-400";
    case "Change":
      return "border-violet-400 text-violet-600 dark:text-violet-400";
    default:
      return "";
  }
}
