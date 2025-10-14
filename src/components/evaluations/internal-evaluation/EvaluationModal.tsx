import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EvaluationForm } from "./EvaluationForm";
import { EvaluationPlanner } from "@/types/evaluation";

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  planner: EvaluationPlanner;
  onSave: () => void;
}

export function EvaluationModal({ isOpen, onClose, planner, onSave }: EvaluationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Conduct Evaluation - {planner.currentEvaluationStage} Evaluation</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Enter evaluation details and panel member comments for {planner.employee.firstName}{" "}
            {planner.employee.lastName} (Planner #{planner.plannerNumber})
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <EvaluationForm planner={planner} onSave={onSave} onCancel={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
