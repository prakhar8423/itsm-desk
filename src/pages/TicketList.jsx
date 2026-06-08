import { useMemo, useState } from "react";
import { Search, Plus, AlertTriangle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, PRIORITIES, STATUSES } from "@/lib/constants";
import { slaState, relativeAge } from "@/lib/sla";
import { PriorityBadge, StatusBadge, CategoryBadge } from "@/components/Badges";

const ALL = "all";

function SlaPill({ ticket }) {
  const sla = slaState(ticket);
  if (sla.level === "none")
    return <span className="text-xs text-muted-foreground">—</span>;
  if (sla.level === "breached")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
        <AlertTriangle className="h-3.5 w-3.5" /> Breached
      </span>
    );
  if (sla.level === "warning")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
        <Clock className="h-3.5 w-3.5" /> {sla.pct}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
      <Clock className="h-3.5 w-3.5" /> {sla.pct}%
    </span>
  );
}

export function TicketList({ tickets, onOpenTicket, onNew }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [category, setCategory] = useState(ALL);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets
      .filter((t) => (status === ALL ? true : t.status === status))
      .filter((t) => (priority === ALL ? true : t.priority === priority))
      .filter((t) => (category === ALL ? true : t.category === category))
      .filter((t) =>
        q
          ? t.title.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q)
          : true
      );
  }, [tickets, search, status, priority, category]);

  const reset = () => {
    setSearch("");
    setStatus(ALL);
    setPriority(ALL);
    setCategory(ALL);
  };

  const anyFilter =
    search || status !== ALL || priority !== ALL || category !== ALL;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {tickets.length} tickets
          </p>
        </div>
        <Button onClick={onNew} className="gap-2">
          <Plus className="h-4 w-4" /> New ticket
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or ID…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All priorities</SelectItem>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {anyFilter && (
            <Button variant="ghost" onClick={reset}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden lg:table-cell">Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Assignee</TableHead>
              <TableHead className="hidden xl:table-cell">Updated</TableHead>
              <TableHead>SLA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <p className="text-sm text-muted-foreground">
                    No tickets match your filters.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer"
                  onClick={() => onOpenTicket(t.id)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {t.id}
                  </TableCell>
                  <TableCell className="max-w-[320px]">
                    <span className="line-clamp-1 font-medium">{t.title}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <CategoryBadge category={t.category} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={t.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell">
                    {t.assignee === "Unassigned" ? (
                      <span className="text-muted-foreground">Unassigned</span>
                    ) : (
                      t.assignee
                    )}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                    {relativeAge(t.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <SlaPill ticket={t} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
