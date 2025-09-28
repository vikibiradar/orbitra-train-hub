import { Badge } from "@/components/ui/badge";
import { PlannerStatusType, PlannerStatus } from "@/types/training-planner";
import { CheckCircle, Clock, XCircle, AlertCircle, PlayCircle, Trophy } from "lucide-react";

interface PlannerStatusIndicatorProps {
  status: PlannerStatusType;
  size?: "sm" | "default" | "lg";
}

export function PlannerStatusIndicator({ status, size = "default" }: PlannerStatusIndicatorProps) {
  const getStatusConfig = (status: PlannerStatusType) => {
    switch (status) {
      case PlannerStatus.DRAFT:
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          className: "bg-gray-100 text-gray-700 border-gray-300"
        };
      case PlannerStatus.SUBMITTED:
        return {
          variant: "default" as const,
          icon: Clock,
          className: "bg-blue-100 text-blue-700 border-blue-300"
        };
      case PlannerStatus.APPROVED:
        return {
          variant: "default" as const,
          icon: CheckCircle,
          className: "bg-green-100 text-green-700 border-green-300"
        };
      case PlannerStatus.REJECTED:
        return {
          variant: "destructive" as const,
          icon: XCircle,
          className: "bg-red-100 text-red-700 border-red-300"
        };
      case PlannerStatus.IN_PROGRESS:
        return {
          variant: "default" as const,
          icon: PlayCircle,
          className: "bg-yellow-100 text-yellow-700 border-yellow-300"
        };
      case PlannerStatus.COMPLETED:
        return {
          variant: "default" as const,
          icon: Trophy,
          className: "bg-purple-100 text-purple-700 border-purple-300"
        };
      default:
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          className: "bg-gray-100 text-gray-700 border-gray-300"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${textSize} flex items-center gap-1`}
    >
      <Icon className={iconSize} />
      {status}
    </Badge>
  );
}