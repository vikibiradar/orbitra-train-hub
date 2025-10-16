import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EvaluationForm } from "./EvaluationForm";
import { EvaluationPlanner } from "@/types/evaluation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  planner: EvaluationPlanner;
  onSave: () => void;
}

export function EvaluationModal({ isOpen, onClose, planner, onSave }: EvaluationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base font-semibold text-center">
              Conduct Evaluation -
              <Badge variant="outline" className="px-4 py-1.5 bg-blue-100 text-blue-800 border-blue-200">
                {planner.currentEvaluationStage}
              </Badge>
            </span>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-80px)] p-4">
          <EvaluationForm planner={planner} onSave={onSave} onCancel={onClose} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
