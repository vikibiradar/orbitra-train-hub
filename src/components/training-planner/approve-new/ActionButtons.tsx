import { Button } from "@/components/ui/button";
import { TrainingPlanner } from "@/types/training-planner";
import { Eye, CheckCircle, XCircle } from "lucide-react";

interface ActionButtonsProps {
  planner: TrainingPlanner;
  onView: (planner: TrainingPlanner) => void;
  onApprove: (planner: TrainingPlanner) => void;
  onReject: (planner: TrainingPlanner) => void;
}

export const ActionButtons = ({ 
  planner, 
  onView, 
  onApprove, 
  onReject 
}: ActionButtonsProps) => {
  return (
    <div className="flex justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(planner)}
        className="flex items-center space-x-1"
      >
        <Eye className="h-3 w-3" />
        <span>View</span>
      </Button>
      
      <Button
        variant="default"
        size="sm"
        onClick={() => onApprove(planner)}
        className="flex items-center space-x-1"
      >
        <CheckCircle className="h-3 w-3" />
        <span>Approve</span>
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onReject(planner)}
        className="flex items-center space-x-1"
      >
        <XCircle className="h-3 w-3" />
        <span>Reject</span>
      </Button>
    </div>
  );
};