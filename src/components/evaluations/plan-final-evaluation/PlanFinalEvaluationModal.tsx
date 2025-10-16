import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EvaluationPlanner } from "@/types/evaluation";
import { mockPanelMembers } from "@/data/mock-final-evaluation-data";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
const formSchema = z.object({
  evaluationDate: z.date({
    required_error: "Evaluation date is required"
  }),
  evaluationTime: z.string().min(1, "Final Evaluation Time is required."),
  mainPanelMember: z.string().min(1, "Panel member is required."),
  otherPanelMember1: z.string().optional(),
  otherPanelMember2: z.string().optional(),
  otherPanelMember3: z.string().optional(),
  otherPanelMember4: z.string().optional(),
  otherPanelMember5: z.string().optional(),
  comments: z.string().optional()
});
type FormValues = z.infer<typeof formSchema>;
interface PlanFinalEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployees: EvaluationPlanner[];
  onSave: () => void;
}

// Time slots in 12-hour format
const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"];
export function PlanFinalEvaluationModal({
  isOpen,
  onClose,
  selectedEmployees,
  onSave
}: PlanFinalEvaluationModalProps) {
  const [selectedOtherMembers, setSelectedOtherMembers] = useState<string[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      evaluationTime: "",
      mainPanelMember: "",
      otherPanelMember1: "",
      otherPanelMember2: "",
      otherPanelMember3: "",
      otherPanelMember4: "",
      otherPanelMember5: "",
      comments: ""
    }
  });
  const watchMainPanelMember = form.watch("mainPanelMember");
  const watchOtherMembers = [form.watch("otherPanelMember1"), form.watch("otherPanelMember2"), form.watch("otherPanelMember3"), form.watch("otherPanelMember4"), form.watch("otherPanelMember5")].filter(Boolean);
  const handleOtherPanelMemberChange = (index: number, value: string) => {
    const fieldName = `otherPanelMember${index + 1}` as keyof FormValues;
    form.setValue(fieldName, value);

    // Update selected members list
    const newSelectedMembers = [form.getValues("otherPanelMember1"), form.getValues("otherPanelMember2"), form.getValues("otherPanelMember3"), form.getValues("otherPanelMember4"), form.getValues("otherPanelMember5")].filter(Boolean) as string[];
    setSelectedOtherMembers(newSelectedMembers);

    // Check if main panel member is not selected but other members are
    if (!watchMainPanelMember && newSelectedMembers.length > 0) {
      // Generate comma-separated list of selected panel members
      const memberNames = newSelectedMembers.map(id => mockPanelMembers.find(m => m.id === id)?.name).filter(Boolean).join(", ");
      toast({
        title: "Comment Required",
        description: `Please give comment in commentbox for selected Panel Members: ${memberNames}`,
        variant: "default"
      });
    }
  };
  const onSubmit = (data: FormValues) => {
    // Validation: Check if at least main panel member is selected or comments provided
    if (!data.mainPanelMember && watchOtherMembers.length > 0 && !data.comments?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide comments when selecting other panel members without a main panel member.",
        variant: "destructive"
      });
      return;
    }

    // Build comma-separated list of all panel members
    const allPanelMembers = [data.mainPanelMember, data.otherPanelMember1, data.otherPanelMember2, data.otherPanelMember3, data.otherPanelMember4, data.otherPanelMember5].filter(Boolean);
    const panelMemberNames = allPanelMembers.map(id => mockPanelMembers.find(m => m.id === id)?.name).filter(Boolean).join(", ");
    console.log("Final Evaluation Plan:", {
      employees: selectedEmployees.map(e => ({
        id: e.id,
        name: `${e.employee.firstName} ${e.employee.lastName}`,
        code: e.employee.employeeCode
      })),
      evaluationDate: format(data.evaluationDate, "yyyy-MM-dd"),
      evaluationTime: data.evaluationTime,
      panelMembers: allPanelMembers,
      panelMemberNames,
      comments: data.comments
    });
    toast({
      title: "Success",
      description: `Final evaluation planned for ${selectedEmployees.length} employee(s). Email notifications sent to panel members, TM & TI.`
    });
    onSave();
  };

  // Get available panel members (exclude already selected ones)
  const getAvailablePanelMembers = (currentValue?: string) => {
    const selectedIds = [watchMainPanelMember, ...watchOtherMembers].filter(id => id && id !== currentValue);
    return mockPanelMembers.filter(member => !selectedIds.includes(member.id));
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Plan Final Evaluation</DialogTitle>
          <DialogDescription>
            Schedule final evaluation for {selectedEmployees.length} selected employee(s)
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Selected Employees Summary */}
              <div className="space-y-2">
                <FormLabel>Selected Employees</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployees.map(emp => <Badge key={emp.id} variant="secondary">
                      {emp.employee.employeeCode} - {emp.employee.firstName}{" "}
                      {emp.employee.lastName}
                    </Badge>)}
                </div>
              </div>

              {/* Evaluation Date */}
              <FormField control={form.control} name="evaluationDate" render={({
              field
            }) => <FormItem className="flex flex-col">
                    <FormLabel>Evaluation Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date()} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>} />

              {/* Evaluation Time */}
              <FormField control={form.control} name="evaluationTime" render={({
              field
            }) => <FormItem>
                    <FormLabel>Evaluation Time *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map(time => <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

              {/* Main Panel Member */}
              <FormField control={form.control} name="mainPanelMember" render={({
              field
            }) => <FormItem>
                    <FormLabel>Main Panel Member *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select main panel member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailablePanelMembers(field.value).map(member => <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.department}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

              {/* Other Panel Members */}
              <div className="space-y-4">
                <FormLabel>Other Panel Members</FormLabel>
                {[0, 1, 2, 3, 4].map(index => {
                const fieldName = `otherPanelMember${index + 1}` as keyof FormValues;
                return <FormField key={index} control={form.control} name={fieldName} render={({
                  field
                }) => <FormItem>
                          <Select onValueChange={value => handleOtherPanelMemberChange(index, value)} value={field.value as string}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={`Panel Member ${index + 1} (Optional)`} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getAvailablePanelMembers(field.value as string).map(member => <SelectItem key={member.id} value={member.id}>
                                  {member.name} - {member.department}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>} />;
              })}
              </div>

              {/* Comments */}
              <FormField control={form.control} name="comments" render={({
              field
            }) => <FormItem>
                    <FormLabel>
                      Comments
                      {!watchMainPanelMember && watchOtherMembers.length > 0 && " *"}
                    </FormLabel>
                    <FormControl>
                      
                    </FormControl>
                    {watchOtherMembers.length > 0 && <p className="text-sm text-muted-foreground">
                        Selected members: {watchOtherMembers.map(id => mockPanelMembers.find(m => m.id === id)?.name).filter(Boolean).join(", ")}
                      </p>}
                    <FormMessage />
                  </FormItem>} />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} className="ps-button">
            Save Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}