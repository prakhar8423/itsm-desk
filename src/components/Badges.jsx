import { Badge } from "@/components/ui/badge";
import {
  priorityBadgeClass,
  statusBadgeClass,
  categoryBadgeClass,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PriorityBadge({ priority, className }) {
  return (
    <Badge className={cn(priorityBadgeClass(priority), className)}>
      {priority}
    </Badge>
  );
}

export function StatusBadge({ status, className }) {
  return (
    <Badge className={cn(statusBadgeClass(status), className)}>{status}</Badge>
  );
}

export function CategoryBadge({ category, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(categoryBadgeClass(category), className)}
    >
      {category}
    </Badge>
  );
}
