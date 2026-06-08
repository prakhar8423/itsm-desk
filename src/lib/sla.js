import { SLA_HOURS, OPEN_STATUSES } from "@/lib/constants";

export function hoursOpen(ticket) {
  const start = new Date(ticket.createdAt).getTime();
  return (Date.now() - start) / (3600 * 1000);
}

export function slaState(ticket) {
  if (!OPEN_STATUSES.includes(ticket.status)) {
    return { level: "none", label: "—", pct: 0 };
  }
  const target = SLA_HOURS[ticket.priority] || 168;
  const elapsed = hoursOpen(ticket);
  const pct = Math.min(100, Math.round((elapsed / target) * 100));
  if (elapsed >= target) return { level: "breached", label: "SLA breached", pct: 100 };
  if (elapsed >= target * 0.75)
    return { level: "warning", label: "At risk", pct };
  return { level: "ok", label: "On track", pct };
}

export function relativeAge(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
