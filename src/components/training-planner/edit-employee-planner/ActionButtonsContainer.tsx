import { Button } from "@/components/ui/button";
import { 
  Save, 
  Send, 
  FileEdit, 
  X, 
  AlertTriangle,
  Loader2 
} from "lucide-react";
import { 
  EnhancedTrainingPlanner, 
  PlannerStatus, 
  AmendmentStatus 
} from "@/types/training-planner";
import { AmendmentModal } from "./AmendmentModal";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ActionButtonsContainerProps {
  planner: EnhancedTrainingPlanner;
  isAmendmentMode: boolean;
  hasUnsavedChanges: boolean;
  onAmendmentToggle: () => void;
  onSave: () => void;
}

export function ActionButtonsContainer({
  planner,
  isAmendmentMode,
  hasUnsavedChanges,
  onAmendmentToggle,
  onSave
}: ActionButtonsContainerProps) {
  const [showAmendmentModal, setShowAmendmentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getButtonVisibility = () => {
    const { status, editableState, currentAmendmentStatus } = planner;
    
    // Defensive check - if editableState is undefined, provide defaults
    if (!editableState) {
      console.warn('EditableState is undefined, using defaults');
      return {
        saveAsDraft: status === PlannerStatus.DRAFT,
        save: false,
        sendForApproval: status === PlannerStatus.DRAFT,
        amendment: status === PlannerStatus.APPROVED,
        close: true,
        cancel: true
      };
    }
    
    // Pending for TI Approval First Time
    if (status === PlannerStatus.SUBMITTED) {
      return {
        saveAsDraft: false,
        save: false,
        sendForApproval: false,
        amendment: false,
        close: true,
        cancel: true
      };
    }

    // TI Approved
    if (status === PlannerStatus.APPROVED && currentAmendmentStatus === AmendmentStatus.NONE) {
      return {
        saveAsDraft: false,
        save: editableState.hasUnsavedChanges,
        sendForApproval: false,
        amendment: editableState.canAmend && !planner.isMovedToFinalEvaluation,
        close: true,
        cancel: true
      };
    }

    // TI Rejected
    if (status === PlannerStatus.REJECTED) {
      return {
        saveAsDraft: true,
        save: false,
        sendForApproval: true,
        amendment: false,
        close: true,
        cancel: true
      };
    }

    // Amendment Mode
    if (isAmendmentMode) {
      return {
        saveAsDraft: false,
        save: false,
        sendForApproval: editableState.hasUnsavedChanges,
        amendment: false,
        close: !editableState.hasUnsavedChanges,
        cancel: true
      };
    }

    // Default state
    return {
      saveAsDraft: true,
      save: editableState.hasUnsavedChanges,
      sendForApproval: false,
      amendment: editableState.canAmend,
      close: true,
      cancel: true
    };
  };

  const buttonVisibility = getButtonVisibility();

  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    try {
      // Mock save as draft logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave();
      console.log("Saved as draft");
    } catch (error) {
      console.error("Error saving as draft:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Mock save logic with validation
      if (!hasUnsavedChanges) {
        alert("No changes were made to the planner.");
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave();
      console.log("Data saved successfully");
      alert("Data saved successfully");
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendForApproval = async () => {
    setIsLoading(true);
    try {
      // Mock send for approval logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Sent for approval");
      alert("Planner sent for approval successfully");
    } catch (error) {
      console.error("Error sending for approval:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmendment = () => {
    if (isAmendmentMode) {
      // Check if any amendments were made
      if (!hasUnsavedChanges) {
        alert("Please note, though you clicked on Amendment tab, there is no addition of new topics that was sent for Approval. Hence Amendment not effective.");
      }
      onAmendmentToggle();
    } else {
      setShowAmendmentModal(true);
    }
  };

  const handleAmendmentConfirm = () => {
    onAmendmentToggle();
    setShowAmendmentModal(false);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = confirm("You have unsaved changes. Are you sure you want to close?");
      if (!confirmed) return;
    }
    
    if (isAmendmentMode && !hasUnsavedChanges) {
      alert("Please note, though you clicked on Amendment tab, there is no addition of new topics that was sent for Approval. Hence Amendment not effective.");
    }
    
    // Close planner logic
    console.log("Closing planner");
  };

  return (
    <div className="space-y-4">
      {/* Amendment Mode Alert */}
      {isAmendmentMode && (
        <Alert>
          <FileEdit className="h-4 w-4" />
          <AlertDescription>
            Amendment mode is active. You can only add new topics. Previously approved topics are disabled for editing.
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Warnings */}
      {planner.isMovedToFinalEvaluation && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This planner has been moved to Final Evaluation. Some editing capabilities may be restricted.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg">
        {buttonVisibility.saveAsDraft && (
          <Button
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save as Draft
          </Button>
        )}

        {buttonVisibility.save && (
          <Button
            onClick={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        )}

        {buttonVisibility.sendForApproval && (
          <Button
            onClick={handleSendForApproval}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send for Approval
          </Button>
        )}

        {buttonVisibility.amendment && (
          <Button
            variant="secondary"
            onClick={handleAmendment}
            disabled={isLoading}
          >
            <FileEdit className="h-4 w-4 mr-2" />
            {isAmendmentMode ? "Exit Amendment" : "Amendment"}
          </Button>
        )}

        {buttonVisibility.close && (
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        )}

        {buttonVisibility.cancel && (
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Amendment Confirmation Modal */}
      <AmendmentModal
        isOpen={showAmendmentModal}
        onClose={() => setShowAmendmentModal(false)}
        onConfirm={handleAmendmentConfirm}
        plannerNumber={planner.plannerNumber || ""}
        currentVersion={planner.amendmentVersion}
      />
    </div>
  );
}