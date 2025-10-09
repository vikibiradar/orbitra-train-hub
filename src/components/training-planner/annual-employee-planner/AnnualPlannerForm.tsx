import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Save, Send, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrainingTopicsTable } from "../new-employee-planner/TrainingTopicsTable";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Employee, TrainingPlannerTopic, PlannerStatus } from "@/types/training-planner";
import { useTrainingPlannerLookups } from "@/hooks/useTrainingPlannerApi";
const plannerFormSchema = z.object({
  trainingIncharge: z.string().min(1, "Training In-charge selection is required"),
  topics: z
    .array(
      z.object({
        topicId: z.string(),
        trainerId: z.string().min(1, "Trainer is required for submission"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        modeOfEvaluation: z.string().min(1, "Mode of evaluation is required for submission"),
        comments: z.string().optional(),
      }),
    )
    .min(1, "At least one training topic is required"),
});
type PlannerFormData = z.infer<typeof plannerFormSchema>;
interface AnnualPlannerFormProps {
  employee: Employee;
  onSave: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}
export function AnnualPlannerForm({ employee, onSave, onSubmit, onCancel }: AnnualPlannerFormProps) {
  const { toast } = useToast();
  const { data: lookups, isLoading: lookupsLoading } = useTrainingPlannerLookups();
  const [availableTopics, setAvailableTopics] = useState<any[]>([]);
  const [plannerTopics, setPlannerTopics] = useState<TrainingPlannerTopic[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const currentYear = new Date().getFullYear();
  const plannerStatus = employee.plannerStatus;
  const form = useForm<PlannerFormData>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      trainingIncharge: "",
      topics: [],
    },
  });

  // Load all available topics
  useEffect(() => {
    if (lookups?.trainingTopics) {
      setAvailableTopics(lookups.trainingTopics);
    }
  }, [lookups]);

  // Validate applicable year
  useEffect(() => {
    if (employee.applicableYear < currentYear) {
      toast({
        title: "Invalid Year",
        description: "Planner can be generated for Current year Only",
        variant: "destructive",
      });
    }
  }, [employee.applicableYear, currentYear]);
  const handleTopicsChange = (topics: TrainingPlannerTopic[]) => {
    setPlannerTopics(topics);
    setHasUnsavedChanges(true);
    const formTopics = topics.map((topic) => ({
      topicId: topic.topic.id,
      trainerId: topic.trainer?.id || "",
      startDate: topic.startDate,
      endDate: topic.endDate,
      modeOfEvaluation: topic.modeOfEvaluation || "",
      comments: topic.comments || "",
    }));
    form.setValue("topics", formTopics);
  };
  const handleSaveAsDraft = async () => {
    try {
      const values = form.getValues();

      // Validate at least one topic selected
      if (plannerTopics.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please Select Topic",
          variant: "destructive",
        });
        return;
      }

      // Mock save operation
      console.log("Saving as draft:", {
        employee,
        values,
        topics: plannerTopics,
      });
      toast({
        title: "Data saved Successfully",
        description: "Your planner has been saved as draft.",
      });
      setHasUnsavedChanges(false);
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };
  const validateForSubmission = (data: PlannerFormData): string[] => {
    const errors: string[] = [];

    // Check if topics are selected
    if (plannerTopics.length === 0) {
      errors.push("Please Select Topic");
      return errors;
    }

    // Validate each topic
    plannerTopics.forEach((topic, index) => {
      const rowNum = index + 1;
      if (!topic.trainer) {
        errors.push(`Kindly select Trainer for Row No. ${rowNum}`);
      }
      if (!topic.modeOfEvaluation) {
        errors.push(`Kindly select Mode Of Evaluation for Row No. ${rowNum}`);
      }
      if (!topic.endDate) {
        errors.push(`Kindly select End Date for Row No. ${rowNum}`);
      }

      // Date validations
      if (topic.startDate && topic.endDate) {
        const startDate = new Date(topic.startDate);
        const endDate = new Date(topic.endDate);
        if (startDate > endDate) {
          errors.push(`Start date must be less than end date for Row No. ${rowNum}`);
        }

        // Check if training is assigned for current year only
        if (employee.applicableYear < currentYear) {
          errors.push(`Cannot assign training for past years. Current year is ${currentYear}`);
        }
      }

      // Check for duplicate topics with same dates
      const duplicates = plannerTopics.filter(
        (t) =>
          t.id !== topic.id &&
          t.topic.id === topic.topic.id &&
          t.startDate === topic.startDate &&
          t.endDate === topic.endDate &&
          !t.isCancelled,
      );
      if (duplicates.length > 0) {
        errors.push(`Same topic is already added with same Date duration for Row No. ${rowNum}`);
      }
    });
    return errors;
  };
  const handleSubmitForApproval = async (data: PlannerFormData) => {
    try {
      // Validate for submission
      const validationErrors = validateForSubmission(data);
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Errors",
          description: (
            <div className="space-y-1">
              {validationErrors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          ),
          variant: "destructive",
        });
        return;
      }

      // Generate planner ID
      const plannerId = `PLNR_${employee.employeeCode}_${employee.applicableYear}`;
      console.log("Submitting for approval:", {
        plannerId,
        employee,
        data,
        topics: plannerTopics,
      });
      toast({
        title: "Planner Submitted Successfully",
        description: `Planner ${plannerId} has been submitted for approval.`,
      });
      onSubmit();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit planner. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleSave = async () => {
    try {
      const values = form.getValues();

      // Check if any changes were made
      if (!hasUnsavedChanges) {
        toast({
          title: "No Changes",
          description: "No changes were made to the planner.",
          variant: "default",
        });
        return;
      }
      console.log("Saving changes:", {
        employee,
        values,
        topics: plannerTopics,
      });
      toast({
        title: "Data Save Successfully",
        description: "Your changes have been saved.",
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Determine which buttons to show based on planner status
  const showSaveAsDraft =
    !plannerStatus || plannerStatus === PlannerStatus.DRAFT || plannerStatus === PlannerStatus.REJECTED;
  const showSave = plannerStatus === PlannerStatus.APPROVED;
  const showSendForApproval =
    !plannerStatus || plannerStatus === PlannerStatus.DRAFT || plannerStatus === PlannerStatus.REJECTED;
  return (
    <div className="space-y-6">
      {/* Employee Information Card */}
      <Card className="ps-card">
        <CardHeader>
          <CardTitle className="text-lg">Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employee.profilePicture} alt={`${employee.firstName} ${employee.lastName}`} />
              <AvatarFallback className="bg-ps-primary text-white text-lg">
                {getInitials(employee.firstName, employee.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Employee Name</Label>
                <p className="font-medium">
                  {employee.firstName} {employee.lastName}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Employee Code</Label>
                <p className="font-mono text-sm">{employee.employeeCode}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Department</Label>
                <Badge variant="outline">{employee.department.name}</Badge>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Location</Label>
                <p className="text-sm">{employee.location.name}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Joining Date</Label>
                <p className="text-sm">{format(new Date(employee.joiningDate), "dd MMM yyyy")}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Applicable Year</Label>
                <p className="text-sm font-mono">{employee.applicableYear}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForApproval)} className="space-y-6">
          {/* Training In-charge */}
          <Card className="ps-card">
            <CardHeader>
              <CardTitle className="text-lg">Planner Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="trainingIncharge"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="required">Training In-charge (TI)</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setHasUnsavedChanges(true);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Training In-charge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lookups?.trainingIncharges?.map((ti) => (
                          <SelectItem key={ti.id} value={ti.id}>
                            {ti.name} - {ti.department.name}
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the Training In-charge who will approve this planner</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Training Topics */}
          <Card className="ps-card">
            <CardHeader>
              <CardTitle className="text-lg">Training Topics</CardTitle>
            </CardHeader>
            <CardContent>
              {lookupsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading topics...</div>
              ) : availableTopics.length > 0 ? (
                <TrainingTopicsTable
                  availableTopics={availableTopics}
                  topics={plannerTopics}
                  onTopicsChange={handleTopicsChange}
                />
              ) : (
                <Alert>
                  <AlertDescription>No training topics available for the selected configuration.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Alert>
            <AlertDescription>
              <strong>Note:</strong> Topics which are "Remove" by TM should be deleted permanently from Planner. No need
              any action for that just click on Remove button and no need for approval of TI.
            </AlertDescription>
          </Alert>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {showSaveAsDraft && (
              <Button type="button" variant="outline" onClick={handleSaveAsDraft} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
            )}

            {showSave && (
              <Button type="button" variant="outline" onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}

            {showSendForApproval && (
              <Button type="submit" className="flex-1" disabled={plannerTopics.length === 0}>
                <Send className="mr-2 h-4 w-4" />
                Send for Approval
              </Button>
            )}

            <Button type="button" variant="ghost" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
