import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrainingPlanner } from "@/types/training-planner";
import { XCircle } from "lucide-react";

interface RejectReasonModalProps {
  planner: TrainingPlanner;
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const RejectReasonModal = ({ 
  planner, 
  open, 
  onClose, 
  onConfirm 
}: RejectReasonModalProps) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Rejection reason is required");
      return;
    }
    
    if (reason.trim().length < 10) {
      setError("Please provide a detailed reason (minimum 10 characters)");
      return;
    }

    onConfirm(reason.trim());
    setReason("");
    setError("");
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <XCircle className="h-5 w-5" />
            <span>Reject Training Planner</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Employee:</span> {planner.employee.firstName} {planner.employee.lastName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Employee Code:</span> {planner.employee.employeeCode}
            </p>
            <p className="text-sm">
              <span className="font-medium">Department:</span> {planner.employee.department.name}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Rejection <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for rejecting this training planner..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              rows={4}
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              The rejection reason will be sent to the Training Manager via email.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit}
            className="flex items-center space-x-2"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject Planner</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};