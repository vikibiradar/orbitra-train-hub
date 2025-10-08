import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Save, Send } from "lucide-react";
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
import { TrainingTopicsTable } from "./TrainingTopicsTable";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Employee, PlannerTypeType, TrainingPlannerTopic } from "@/types/training-planner";
import { useTrainingPlannerLookups } from "@/hooks/useTrainingPlannerApi";

const plannerFormSchema = z.object({
  proposedFirstEvaluationDate: z.string().min(1, "Proposed 1st Evaluation Date is required"),
  trainingIncharge: z.string().min(1, "Training In-charge selection is required"),
  selectedScopes: z.array(z.string()).optional(),
  topics: z
    .array(
      z.object({
        topicId: z.string(),
        trainerId: z.string().optional(),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        modeOfEvaluation: z.string().optional(),
        comments: z.string().optional(),
      }),
    )
    .min(1, "At least one training topic is required"),
});

type PlannerFormData = z.infer<typeof plannerFormSchema>;

interface PlannerFormProps {
  employee: Employee;
  plannerType: PlannerTypeType;
  onSave: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function PlannerForm({ employee, plannerType, onSave, onSubmit, onCancel }: PlannerFormProps) {
  const { toast } = useToast();
  const { data: lookups, isLoading: lookupsLoading } = useTrainingPlannerLookups();
  const [availableTopics, setAvailableTopics] = useState<any[]>([]);
  const [plannerTopics, setPlannerTopics] = useState<TrainingPlannerTopic[]>([]);
  const [isDraft, setIsDraft] = useState(true);

  const form = useForm<PlannerFormData>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      proposedFirstEvaluationDate: "",
      trainingIncharge: "",
      selectedScopes: [],
      topics: [],
    },
  });

  // Load all available topics for general planner
  useEffect(() => {
    if (lookups?.trainingTopics) {
      // For general planners, show all available topics
      setAvailableTopics(lookups.trainingTopics);
    }
  }, [lookups, plannerType]);

  const handleTopicsChange = (topics: TrainingPlannerTopic[]) => {
    setPlannerTopics(topics);
    // Update form data
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
    setIsDraft(true);
    try {
      // Validate only basic fields for draft
      const values = form.getValues();

      // Mock save operation
      console.log("Saving as draft:", { employee, plannerType, values, topics: plannerTopics });

      toast({
        title: "Draft Saved Successfully",
        description: "Your planner has been saved as draft.",
      });

      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async (data: PlannerFormData) => {
    setIsDraft(false);
    try {
      // Generate planner ID
      const plannerId = `PLNR_${employee.employeeCode}_NEW`;

      console.log("Submitting for approval:", {
        plannerId,
        employee,
        plannerType,
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

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
                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                <p className="text-sm">{employee.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForApproval)} className="space-y-6">
          {/* Planner Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Planner Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proposed 1st Evaluation Date */}
                <FormField
                  control={form.control}
                  name="proposedFirstEvaluationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="required">Proposed 1st Evaluation Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal ps-card",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(new Date(field.value), "dd MMM yyyy") : "Select date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString().split("T")[0])}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Select the proposed date for the first evaluation</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Training In-charge */}
                <FormField
                  control={form.control}
                  name="trainingIncharge"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="required">Training In-charge (TI)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
              </div>
            </CardContent>
          </Card>

          {/* Training Topics */}
          <Card>
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
              <strong>Note:</strong> Once you click 'Save As Draft' / 'Send for Approval', the topics will be
              permanently saved. To remove a topic permanently from the grid, click 'Save As Draft' after removing it.
            </AlertDescription>
          </Alert>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button type="button" variant="outline" onClick={handleSaveAsDraft} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>

            <Button
              type="submit"
              className="flex-1"
              disabled={!form.watch("proposedFirstEvaluationDate") || plannerTopics.length === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              Send for Approval
            </Button>

            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
