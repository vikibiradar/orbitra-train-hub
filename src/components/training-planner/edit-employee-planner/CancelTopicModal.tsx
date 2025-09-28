import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ban, AlertTriangle } from "lucide-react";

interface CancelTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  topicName: string;
}

export function CancelTopicModal({
  isOpen,
  onClose,
  onConfirm,
  topicName
}: CancelTopicModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please enter reason for cancellation.");
      return;
    }

    onConfirm(reason);
    setReason("");
    setError("");
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-destructive" />
            Cancel Training Topic
          </DialogTitle>
          <DialogDescription>
            You are about to cancel the following training topic:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <span className="font-medium text-sm">{topicName}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellation-reason">
              Reason for Cancellation <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancellation-reason"
              placeholder="Please provide a detailed reason for cancelling this training topic..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              className="min-h-[100px]"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Note:</strong> Once removed from the grid, click on 'Save As Draft' / 'Save' 
              is mandatory to remove permanently.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            <Ban className="h-4 w-4 mr-2" />
            Cancel Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}