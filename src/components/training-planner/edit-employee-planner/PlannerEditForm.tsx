import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnhancedTrainingPlanner } from "@/types/training-planner";
import { TopicEditTable } from "./TopicEditTable";
import { ActionButtonsContainer } from "./ActionButtonsContainer";
import { PlannerStatusIndicator } from "./PlannerStatusIndicator";
import { useTrainingPlannerLookups } from "@/hooks/useTrainingPlannerApi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plannerEditSchema = z.object({
  proposedFirstEvaluationDate: z.string().optional(),
  trainingIncharge: z.string().optional(),
});

type PlannerEditFormData = z.infer<typeof plannerEditSchema>;

interface PlannerEditFormProps {
  planner: EnhancedTrainingPlanner;
  onBack: () => void;
}

export function PlannerEditForm({ planner, onBack }: PlannerEditFormProps) {
  const [isAmendmentMode, setIsAmendmentMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<PlannerEditFormData>({
    resolver: zodResolver(plannerEditSchema),
    defaultValues: {
      proposedFirstEvaluationDate: planner.proposedFirstEvaluationDate || "",
      trainingIncharge: planner.trainingIncharge?.id || "",
    },
  });

  const { data: lookups } = useTrainingPlannerLookups();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleAmendmentToggle = () => {
    setIsAmendmentMode(!isAmendmentMode);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Planner List
      </Button>

      {/* Employee Information Card */}
      <Card className="ps-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Employee Information</span>
            <div className="flex items-center gap-2">
              <PlannerStatusIndicator status={planner.status} />
              {planner.amendmentVersion > 1 && (
                <Badge variant="outline">
                  Amendment v{planner.amendmentVersion}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={planner.employee.profilePicture} 
                alt={`${planner.employee.firstName} ${planner.employee.lastName}`} 
              />
              <AvatarFallback className="bg-ps-primary text-white text-lg">
                {getInitials(planner.employee.firstName, planner.employee.lastName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Employee Name</Label>
                <p className="font-medium">
                  {planner.employee.firstName} {planner.employee.lastName}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Employee Code</Label>
                <p className="font-mono text-sm">{planner.employee.employeeCode}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Department</Label>
                <Badge variant="outline">{planner.employee.department.name}</Badge>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Location</Label>
                <p className="text-sm">{planner.employee.location.name}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                <p className="text-sm">{planner.employee.email}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Joining Date</Label>
                <p className="text-sm">{format(new Date(planner.employee.joiningDate), "dd MMM yyyy")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planner Details Form */}
      <Card className="ps-card">
        <CardHeader>
          <CardTitle className="text-lg">Planner Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
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
                            onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select the proposed date for the first evaluation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          {lookups?.trainingIncharges
                            ?.filter(ti => ti.isActive)
                            .map((incharge) => (
                              <SelectItem key={incharge.id} value={incharge.id}>
                                {incharge.name} - {incharge.department.name}
                              </SelectItem>
                            )) || []}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the Training In-charge who will approve this planner
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Training Topics */}
      <TopicEditTable
        planner={planner}
        isAmendmentMode={isAmendmentMode}
        onTopicsChange={() => setHasUnsavedChanges(true)}
      />

      {/* Action Buttons */}
      <ActionButtonsContainer
        planner={planner}
        isAmendmentMode={isAmendmentMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onAmendmentToggle={handleAmendmentToggle}
        onSave={() => setHasUnsavedChanges(false)}
      />
    </div>
  );
}