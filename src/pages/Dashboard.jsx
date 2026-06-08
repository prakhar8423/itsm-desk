import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Ticket,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  PRIORITIES,
  STATUSES,
  OPEN_STATUSES,
  CLOSED_STATUSES,
  priorityBadgeClass,
  statusBadgeClass,
} from "@/lib/constants";
import { slaState, relativeAge } from "@/lib/sla";
import { PriorityBadge, StatusBadge, CategoryBadge } from "@/components/Badges";

function StatCard({ title, value, icon: Icon, accent, sub }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-2xl font-bold leading-none">{value}</div>
          <div className="mt-1 text-sm text-muted-foreground">{title}</div>
          {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

const PRIORITY_BAR = {
  Critical: "bg-red-600",
  High: "bg-orange-500",
  Medium: "bg-amber-400",
  Low: "bg-emerald-500",
};

const STATUS_BAR = {
  Open: "bg-blue-600",
  "In Progress": "bg-violet-600",
  "On Hold": "bg-zinc-500",
  Resolved: "bg-emerald-600",
  Closed: "bg-zinc-700",
};

function BarRow({ label, count, total, colorClass, badge }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 shrink-0">{badge}</div>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${colorClass} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
        {count}
      </div>
    </div>
  );
}

export function Dashboard({ tickets, onOpenTicket }) {
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => OPEN_STATUSES.includes(t.status)).length;
    const resolved = tickets.filter((t) =>
      CLOSED_STATUSES.includes(t.status)
    ).length;
    const breaching = tickets.filter(
      (t) => slaState(t).level === "breached"
    ).length;

    const byPriority = PRIORITIES.reduce((acc, p) => {
      acc[p] = tickets.filter((t) => t.priority === p).length;
      return acc;
    }, {});
    const byStatus = STATUSES.reduce((acc, s) => {
      acc[s] = tickets.filter((t) => t.status === s).length;
      return acc;
    }, {});

    return { total, open, resolved, breaching, byPriority, byStatus };
  }, [tickets]);

  const atRisk = useMemo(
    () =>
      tickets
        .map((t) => ({ t, sla: slaState(t) }))
        .filter(({ sla }) => sla.level === "breached" || sla.level === "warning")
        .sort((a, b) => b.sla.pct - a.sla.pct)
        .slice(0, 5),
    [tickets]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your service desk activity and SLA health.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total tickets"
          value={stats.total}
          icon={Ticket}
          accent="bg-primary/10 text-primary"
        />
        <StatCard
          title="Open"
          value={stats.open}
          icon={CircleDot}
          accent="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          sub="Open · In Progress · On Hold"
        />
        <StatCard
          title="Resolved / Closed"
          value={stats.resolved}
          icon={CheckCircle2}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="SLA breached"
          value={stats.breaching}
          icon={AlertTriangle}
          accent="bg-red-500/10 text-red-600 dark:text-red-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tickets by priority</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PRIORITIES.map((p) => (
              <BarRow
                key={p}
                count={stats.byPriority[p]}
                total={stats.total}
                colorClass={PRIORITY_BAR[p]}
                badge={<PriorityBadge priority={p} />}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tickets by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {STATUSES.map((s) => (
              <BarRow
                key={s}
                count={stats.byStatus[s]}
                total={stats.total}
                colorClass={STATUS_BAR[s]}
                badge={<StatusBadge status={s} />}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SLA attention needed</CardTitle>
        </CardHeader>
        <CardContent>
          {atRisk.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              All open tickets are comfortably within SLA. Nice work.
            </p>
          ) : (
            <div className="divide-y">
              {atRisk.map(({ t, sla }) => (
                <button
                  key={t.id}
                  onClick={() => onOpenTicket(t.id)}
                  className="flex w-full items-center gap-3 py-3 text-left hover:bg-accent/50 -mx-2 px-2 rounded-md transition-colors"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      sla.level === "breached"
                        ? "bg-red-600"
                        : "bg-amber-500"
                    }`}
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {t.id}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium">
                    {t.title}
                  </span>
                  <CategoryBadge category={t.category} className="hidden md:inline-flex" />
                  <PriorityBadge priority={t.priority} />
                  <span
                    className={`w-28 text-right text-xs font-medium ${
                      sla.level === "breached"
                        ? "text-red-600 dark:text-red-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {sla.label} · {relativeAge(t.createdAt)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
