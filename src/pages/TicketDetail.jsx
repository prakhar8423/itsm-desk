import { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  MessageSquare,
  Activity,
  GitCommitVertical,
  Plus,
  Pencil,
  Check,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PriorityBadge, StatusBadge, CategoryBadge } from "@/components/Badges";
import { STATUSES, PRIORITIES, AGENTS } from "@/lib/constants";
import { slaState, relativeAge, formatDate, hoursOpen } from "@/lib/sla";

const ME = "Priya Nair";

function ActivityIcon({ type }) {
  if (type === "comment") return <MessageSquare className="h-3.5 w-3.5" />;
  if (type === "created") return <Plus className="h-3.5 w-3.5" />;
  return <GitCommitVertical className="h-3.5 w-3.5" />;
}

export function TicketDetail({
  ticket,
  onBack,
  onUpdate,
  onAddComment,
  onDelete,
}) {
  const [comment, setComment] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: ticket.title,
    description: ticket.description,
  });

  if (!ticket) return null;
  const sla = slaState(ticket);

  const changeStatus = (status) => {
    if (status === ticket.status) return;
    onUpdate(
      ticket.id,
      { status },
      [
        {
          type: "status",
          text: `Status changed from ${ticket.status} to ${status}`,
        },
      ]
    );
  };

  const changePriority = (priority) => {
    if (priority === ticket.priority) return;
    onUpdate(
      ticket.id,
      { priority },
      [
        {
          type: "field",
          text: `Priority changed from ${ticket.priority} to ${priority}`,
        },
      ]
    );
  };

  const changeAssignee = (assignee) => {
    if (assignee === ticket.assignee) return;
    onUpdate(
      ticket.id,
      { assignee },
      [{ type: "field", text: `Assigned to ${assignee}` }]
    );
  };

  const saveEdit = () => {
    if (!draft.title.trim()) return;
    onUpdate(
      ticket.id,
      { title: draft.title, description: draft.description },
      [{ type: "field", text: "Ticket details edited" }]
    );
    setEditing(false);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    onAddComment(ticket.id, comment.trim(), ME);
    setComment("");
  };

  const sortedActivity = [...ticket.activity].sort(
    (a, b) => new Date(b.at) - new Date(a.at)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Button>
        <div className="flex items-center gap-2">
          {!editing && (
            <Button
              variant="outline"
              onClick={() => {
                setDraft({
                  title: ticket.title,
                  description: ticket.description,
                });
                setEditing(true);
              }}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{ticket.id}</span>
                <span>·</span>
                <CategoryBadge category={ticket.category} />
              </div>
              {editing ? (
                <Input
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  className="mt-2 text-lg font-semibold"
                />
              ) : (
                <CardTitle className="text-xl leading-snug">
                  {ticket.title}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <Textarea
                    rows={5}
                    value={draft.description}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, description: e.target.value }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} className="gap-2">
                      <Check className="h-4 w-4" /> Save
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setEditing(false)}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {ticket.description || "No description provided."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4" /> Activity & comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Textarea
                  rows={3}
                  placeholder="Add a comment or work note…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={submitComment}
                    disabled={!comment.trim()}
                    className="gap-2"
                  >
                    <MessageSquare className="h-4 w-4" /> Comment
                  </Button>
                </div>
              </div>

              <div className="relative space-y-4 border-l pl-6">
                {sortedActivity.map((a) => (
                  <div key={a.id} className="relative">
                    <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground">
                      <ActivityIcon type={a.type} />
                    </span>
                    {a.type === "comment" ? (
                      <div className="rounded-lg bg-muted/60 p-3">
                        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {a.author || "User"}
                          </span>
                          <span>· {relativeAge(a.at)}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm">{a.text}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{a.text}</span>
                        <span className="text-xs">· {relativeAge(a.at)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={ticket.status} onValueChange={changeStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={ticket.priority} onValueChange={changePriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Assignee</Label>
                <Select value={ticket.assignee} onValueChange={changeAssignee}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGENTS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">SLA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Health</span>
                <span
                  className={`text-sm font-semibold ${
                    sla.level === "breached"
                      ? "text-red-600 dark:text-red-400"
                      : sla.level === "warning"
                      ? "text-amber-600 dark:text-amber-400"
                      : sla.level === "ok"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {sla.label}
                </span>
              </div>
              {sla.level !== "none" && (
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${
                      sla.level === "breached"
                        ? "bg-red-600"
                        : sla.level === "warning"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${sla.pct}%` }}
                  />
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Open for</span>
                <span>{Math.round(hoursOpen(ticket))}h</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Detail label="Requester" value={ticket.requester} />
              <Detail label="Category" value={ticket.category} />
              <Detail
                label="Created"
                value={`${formatDate(ticket.createdAt)} (${relativeAge(
                  ticket.createdAt
                )})`}
              />
              <Detail
                label="Updated"
                value={`${formatDate(ticket.updatedAt)} (${relativeAge(
                  ticket.updatedAt
                )})`}
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={ticket.status} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete ticket {ticket.id}?</DialogTitle>
            <DialogDescription>
              This permanently removes the ticket and its activity log. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(ticket.id);
                onBack();
              }}
            >
              Delete ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
