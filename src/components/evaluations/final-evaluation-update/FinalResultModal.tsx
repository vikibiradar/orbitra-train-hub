import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { FinalEvaluationRecord, FinalEvaluationResult } from "@/types/final-evaluation";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const resultSchema = z.object({
  result: z.enum([
    FinalEvaluationResult.SATISFACTORY,
    FinalEvaluationResult.NEED_RETRAINING,
    FinalEvaluationResult.BELOW_SATISFACTORY,
  ], {
    required_error: "Please select a result",
  }),
  resultComments: z.string().min(10, "Comments must be at least 10 characters"),
});

type ResultFormData = z.infer<typeof resultSchema>;

interface FinalResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FinalEvaluationRecord;
  onSave: (updatedRecord: FinalEvaluationRecord) => void;
}

export function FinalResultModal({
  isOpen,
  onClose,
  record,
  onSave,
}: FinalResultModalProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
  });

  const selectedResult = watch("result");

  const onSubmit = (data: ResultFormData) => {
    // Validate that at least one comment exists
    if (record.panelMemberComments.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one evaluation comment has to be entered to save the final evaluation result",
        variant: "destructive",
      });
      return;
    }

    const updatedRecord: FinalEvaluationRecord = {
      ...record,
      result: data.result,
      resultComments: data.resultComments,
      isCompleted: true,
      completedDate: new Date().toISOString(),
      completedBy: "QA-001", // In real app, get from auth context
    };

    onSave(updatedRecord);

    // Determine email message based on result
    let emailMessage = "";
    if (data.result === FinalEvaluationResult.SATISFACTORY) {
      emailMessage = "Annual employee training can now be prepared for this trainee";
    } else if (
      data.result === FinalEvaluationResult.NEED_RETRAINING ||
      data.result === FinalEvaluationResult.BELOW_SATISFACTORY
    ) {
      emailMessage = "Please carry out re-trainings in discussion with the QA";
    }

    toast({
      title: "Final Evaluation Saved",
      description: `Result: ${data.result}. ${emailMessage}. Email notification sent to TM and TI.`,
    });

    onClose();
  };

  const getResultInfo = () => {
    if (selectedResult === FinalEvaluationResult.SATISFACTORY) {
      return {
        color: "text-success",
        message: "New employee planner will be closed and employee becomes Annual employee",
        emailNote: "Email will state: Annual employee training can now be prepared for this trainee",
      };
    }
    if (selectedResult === FinalEvaluationResult.BELOW_SATISFACTORY) {
      return {
        color: "text-destructive",
        message: "New employee planner will be closed and employee becomes Annual employee",
        emailNote: "Email will state: Please carry out re-trainings in discussion with the QA",
      };
    }
    if (selectedResult === FinalEvaluationResult.NEED_RETRAINING) {
      return {
        color: "text-warning",
        message: "New employee planner will NOT be closed and will be visible in Edit Employee Planner for re-training",
        emailNote: "Email will state: Please carry out re-trainings in discussion with the QA",
      };
    }
    return null;
  };

  const resultInfo = getResultInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Final Evaluation Result</DialogTitle>
          <DialogDescription>
            Record the final evaluation result for {record.employeeName} ({record.employeeCode})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Employee Details */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Employee Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Department:</span>{" "}
                  <span className="font-medium">{record.department}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  <span className="font-medium">{record.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Evaluation Date:</span>{" "}
                  <span className="font-medium">
                    {format(new Date(record.evaluationDate), "dd MMM yyyy")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>{" "}
                  <span className="font-medium">{record.evaluationTime}</span>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground">Comments Received:</span>{" "}
                <Badge variant="secondary">{record.panelMemberComments.length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Validation Alert */}
          {record.panelMemberComments.length === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                At least one evaluation comment must be entered before saving the result.
                Please add comments first.
              </AlertDescription>
            </Alert>
          )}

          {/* Result Selection */}
          <div className="space-y-2">
            <Label htmlFor="result">Final Evaluation Result *</Label>
            <Select
              onValueChange={(value) =>
                setValue("result", value as ResultFormData["result"], { shouldValidate: true })
              }
            >
              <SelectTrigger id="result">
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FinalEvaluationResult.SATISFACTORY}>
                  Satisfactory
                </SelectItem>
                <SelectItem value={FinalEvaluationResult.NEED_RETRAINING}>
                  Need re-Training
                </SelectItem>
                <SelectItem value={FinalEvaluationResult.BELOW_SATISFACTORY}>
                  Below Satisfactory
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.result && (
              <p className="text-sm text-destructive">{errors.result.message}</p>
            )}
          </div>

          {/* Result Information */}
          {resultInfo && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <p className={resultInfo.color + " font-medium"}>{resultInfo.message}</p>
                <p className="text-xs text-muted-foreground">{resultInfo.emailNote}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Result Comments */}
          <div className="space-y-2">
            <Label htmlFor="resultComments">Comments *</Label>
            <Textarea
              id="resultComments"
              placeholder="Enter detailed comments about the final evaluation result..."
              rows={5}
              {...register("resultComments")}
            />
            {errors.resultComments && (
              <p className="text-sm text-destructive">{errors.resultComments.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={record.panelMemberComments.length === 0}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
