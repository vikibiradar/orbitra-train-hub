import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface PlannerStatusBadgeProps {
  readyToClose: boolean;
}

export function PlannerStatusBadge({ readyToClose }: PlannerStatusBadgeProps) {
  if (readyToClose) {
    return (
      <Badge variant="default" className="flex items-center gap-1 w-fit">
        <CheckCircle className="h-3 w-3" />
        Ready to Close
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
      <Clock className="h-3 w-3" />
      Pending Topics
    </Badge>
  );
}
