import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowLeft, User, Building, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {planner.employee.profilePicture ? (
                  <img 
                    src={planner.employee.profilePicture} 
                    alt={`${planner.employee.firstName} ${planner.employee.lastName}`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-primary">
                    {getInitials(planner.employee.firstName, planner.employee.lastName)}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">
                  {planner.employee.firstName} {planner.employee.lastName}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {planner.employee.employeeCode}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Building className="h-3 w-3" />
                Department
              </div>
              <div className="font-medium">{planner.employee.department.name}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Location
              </div>
              <div className="font-medium">{planner.employee.location.name}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planner Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Planner Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="proposedFirstEvaluationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposed 1st Evaluation Date</FormLabel>
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
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trainingIncharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training In-charge</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Training In-charge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lookups?.trainingIncharges
                            .filter(ti => ti.isActive)
                            .map((incharge) => (
                              <SelectItem key={incharge.id} value={incharge.id}>
                                <div className="flex flex-col">
                                  <span>{incharge.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {incharge.department.name}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
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