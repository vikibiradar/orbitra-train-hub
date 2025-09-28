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
import { Badge } from "@/components/ui/badge";
import { FileEdit, AlertTriangle } from "lucide-react";

interface AmendmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plannerNumber: string;
  currentVersion: number;
}

export function AmendmentModal({
  isOpen,
  onClose,
  onConfirm,
  plannerNumber,
  currentVersion
}: AmendmentModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" />
            Amendment Confirmation
          </DialogTitle>
          <DialogDescription>
            You are about to enter amendment mode for this training planner.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Planner Number:</span>
              <span className="text-sm">{plannerNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Version:</span>
              <Badge variant="outline">v{currentVersion}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Next Version:</span>
              <Badge variant="default">v{currentVersion + 1}</Badge>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium mb-1">Amendment Mode Guidelines:</p>
              <ul className="space-y-1 text-xs">
                <li>• Previously approved topics will be disabled for editing</li>
                <li>• You can only add new topics in amendment mode</li>
                <li>• New topics will require TI approval before activation</li>
                <li>• Amendment version will be incremented upon TI approval</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            <FileEdit className="h-4 w-4 mr-2" />
            Start Amendment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}