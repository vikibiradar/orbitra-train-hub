import { useState } from "react";
import { Save, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EvaluationPlanner, EvaluationStage, PanelMemberComment } from "@/types/evaluation";
import { mockPanelMembers, canMoveToFinalEvaluation, areAllTopicsRated } from "@/data/mock-evaluation-data";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EvaluationFormProps {
  planner: EvaluationPlanner;
  onSave: () => void;
  onCancel: () => void;
}

export function EvaluationForm({ planner, onSave, onCancel }: EvaluationFormProps) {
  const { toast } = useToast();
  const [evaluationDate, setEvaluationDate] = useState<Date>(new Date());
  const [selectedPanelMembers, setSelectedPanelMembers] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [planNextEvaluation, setPlanNextEvaluation] = useState(true);
  const [nextEvaluationDate, setNextEvaluationDate] = useState<Date | undefined>(undefined);

  // Validation functions
  const validateEvaluationDate = (): string | null => {
    if (!evaluationDate) {
      return "Evaluation date is required";
    }

    const evalDate = new Date(evaluationDate);
    const today = new Date();
    
    // Get first training start date
    const firstTrainingDate = planner.topics.length > 0 
      ? new Date(planner.topics[0].startDate) 
      : today;

    if (evalDate > today) {
      return "Evaluation date cannot be in the future";
    }

    if (planner.currentEvaluationStage === EvaluationStage.FIRST) {
      if (evalDate < firstTrainingDate) {
        return "First Evaluation Date should be greater than First Training Date";
      }
    }

    if (planner.currentEvaluationStage === EvaluationStage.SECOND && planner.firstEvaluationDate) {
      const firstEvalDate = new Date(planner.firstEvaluationDate);
      if (evalDate <= firstEvalDate) {
        return "Second Evaluation Date should be greater than first Evaluation Date";
      }
    }

    if (planner.currentEvaluationStage === EvaluationStage.THIRD && planner.secondEvaluationDate) {
      const secondEvalDate = new Date(planner.secondEvaluationDate);
      if (evalDate <= secondEvalDate) {
        return "Third Evaluation Date should be greater than Second Evaluation Date";
      }
    }

    return null;
  };

  const validateNextEvaluationDate = (): string | null => {
    if (planNextEvaluation && !nextEvaluationDate) {
      if (planner.currentEvaluationStage === EvaluationStage.FIRST) {
        return "Second Evaluation Date is required";
      } else if (planner.currentEvaluationStage === EvaluationStage.SECOND) {
        return "Third Evaluation Date is required";
      }
    }

    if (planNextEvaluation && nextEvaluationDate) {
      const nextEvalDate = new Date(nextEvaluationDate);
      const currentEvalDate = new Date(evaluationDate);

      if (nextEvalDate <= currentEvalDate) {
        if (planner.currentEvaluationStage === EvaluationStage.FIRST) {
          return "Second Evaluation Date should be greater than first Evaluation Date";
        } else if (planner.currentEvaluationStage === EvaluationStage.SECOND) {
          return "Third Evaluation Date should be greater than Second Evaluation Date";
        }
      }
    }

    return null;
  };

  const validatePanelMembers = (): string | null => {
    if (selectedPanelMembers.length === 0) {
      return "Please select at least one Panel Member";
    }

    // Check if all selected panel members have comments
    for (const memberId of selectedPanelMembers) {
      if (!comments[memberId] || comments[memberId].trim() === "") {
        return "Please give at least one comment in comment box for all selected panel members";
      }
    }

    return null;
  };

  const handlePanelMemberToggle = (memberId: string) => {
    setSelectedPanelMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSaveResult = () => {
    // Validate all fields
    const dateError = validateEvaluationDate();
    if (dateError) {
      toast({
        title: "Validation Error",
        description: dateError,
        variant: "destructive"
      });
      return;
    }

    const panelError = validatePanelMembers();
    if (panelError) {
      toast({
        title: "Validation Error",
        description: panelError,
        variant: "destructive"
      });
      return;
    }

    const nextDateError = validateNextEvaluationDate();
    if (nextDateError) {
      toast({
        title: "Validation Error",
        description: nextDateError,
        variant: "destructive"
      });
      return;
    }

    // If moving to final evaluation, check additional validations
    if (!planNextEvaluation) {
      const evalDateStr = format(evaluationDate, "yyyy-MM-dd");
      const canMove = canMoveToFinalEvaluation(planner, evalDateStr);
      
      if (!canMove.canMove) {
        toast({
          title: "Cannot Move to Final Evaluation",
          description: canMove.reason,
          variant: "destructive"
        });
        return;
      }

      // Confirm moving to final evaluation
      const employeeName = `${planner.employee.firstName} ${planner.employee.lastName}`;
      const confirmed = window.confirm(
        `${employeeName} is selected for final evaluation, click OK to proceed or CANCEL to plan next evaluation.`
      );

      if (!confirmed) {
        return;
      }
    }

    // Save evaluation
    toast({
      title: "Success",
      description: "Evaluation saved successfully",
    });
    onSave();
  };

  const allTopicsRated = areAllTopicsRated(planner);

  return (
    <div className="space-y-6">
      {/* Planner Information */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <Label className="text-sm text-muted-foreground">Employee</Label>
          <p className="font-medium">{planner.employee.firstName} {planner.employee.lastName}</p>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Employee Code</Label>
          <p className="font-medium">{planner.employee.employeeCode}</p>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Department</Label>
          <p className="font-medium">{planner.employee.department.name}</p>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Planner Number</Label>
          <p className="font-medium">{planner.plannerNumber}</p>
        </div>
      </div>

      <Separator />

      {/* Current Stage */}
      <div>
        <Label className="text-lg font-semibold">Current Evaluation Stage</Label>
        <div className="mt-2">
          <Badge variant="outline" className="text-base px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
            {planner.currentEvaluationStage}
          </Badge>
        </div>
      </div>

      {/* Evaluation Date */}
      <div className="space-y-2">
        <Label htmlFor="evaluation-date" className="required">
          {planner.currentEvaluationStage} Date *
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !evaluationDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {evaluationDate ? format(evaluationDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={evaluationDate}
              onSelect={(date) => date && setEvaluationDate(date)}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Topics Training Status */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold">Training Topics Status</Label>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Topic</TableHead>
                <TableHead className="font-semibold">Trainer</TableHead>
                <TableHead className="font-semibold">Attendance</TableHead>
                <TableHead className="font-semibold">Rating</TableHead>
                <TableHead className="font-semibold">Deviation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planner.topicsEvaluationData.map((topic) => (
                <TableRow key={topic.topicId}>
                  <TableCell className="font-medium">{topic.topicName}</TableCell>
                  <TableCell>{topic.trainer}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        topic.attendance === "Yes"
                          ? "bg-green-100 text-green-800"
                          : topic.attendance === "No"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {topic.attendance || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        topic.rating && topic.rating !== "Not Rated"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {topic.rating || "Not Rated"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {topic.deviation ? (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {!allTopicsRated && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incomplete Training</AlertTitle>
          <AlertDescription>
            This employee planner cannot be taken directly for final evaluation as one or more of the planned trainings are still incomplete.
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Panel Members Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold required">Panel Members *</Label>
        <div className="space-y-4">
          {mockPanelMembers.map((member) => (
            <div key={member.id} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={member.id}
                  checked={selectedPanelMembers.includes(member.id)}
                  onCheckedChange={() => handlePanelMemberToggle(member.id)}
                />
                <Label htmlFor={member.id} className="font-medium cursor-pointer">
                  {member.name} - {member.department}
                </Label>
              </div>
              {selectedPanelMembers.includes(member.id) && (
                <Textarea
                  placeholder={`Enter comments from ${member.name}...`}
                  value={comments[member.id] || ""}
                  onChange={(e) =>
                    setComments((prev) => ({ ...prev, [member.id]: e.target.value }))
                  }
                  rows={3}
                  className="mt-2"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Next Evaluation Planning */}
      {planner.currentEvaluationStage !== EvaluationStage.THIRD && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="plan-next-eval"
              checked={planNextEvaluation}
              onCheckedChange={(checked) => setPlanNextEvaluation(checked as boolean)}
            />
            <Label htmlFor="plan-next-eval" className="font-medium cursor-pointer">
              Plan {planner.currentEvaluationStage === EvaluationStage.FIRST ? "2nd" : "3rd"} Evaluation
            </Label>
          </div>

          {planNextEvaluation && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="next-evaluation-date" className="required">
                {planner.currentEvaluationStage === EvaluationStage.FIRST ? "2nd" : "3rd"} Evaluation Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !nextEvaluationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextEvaluationDate ? format(nextEvaluationDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={nextEvaluationDate}
                    onSelect={setNextEvaluationDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveResult} className="bg-ps-primary hover:bg-ps-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Result
        </Button>
      </div>
    </div>
  );
}
