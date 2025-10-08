import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrainingPlanner } from "@/types/training-planner";
import { mockTrainingTopics, mockTrainers } from "@/data/mock-training-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export type TrainingType = "Induction" | "External" | "Internal";

interface AddTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  planner: TrainingPlanner;
  trainingType: TrainingType;
  onSave: () => void;
}

interface FormData {
  topicId: string;
  trainerId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  duration: string;
  remark: string;
}

const initialFormData: FormData = {
  topicId: "",
  trainerId: "",
  startDate: undefined,
  endDate: undefined,
  duration: "",
  remark: "",
};

export function AddTrainingModal({ isOpen, onClose, planner, trainingType, onSave }: AddTrainingModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = "Please Select Start Date";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Please Select End Date";
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End Date must be greater than Start Date";
    }

    if (!formData.topicId) {
      newErrors.topicId = "Please add Topic";
    }

    if (!formData.duration) {
      newErrors.duration = "Please add Duration";
    } else if (!/^\d+$/.test(formData.duration)) {
      newErrors.duration = "Please add only Numeric value in Duration";
    }

    if (!formData.trainerId) {
      newErrors.trainerId = "Please add Trainer";
    }

    if (!formData.remark.trim()) {
      newErrors.remark = "Please add Remark";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Here you would typically make an API call to save the training
    toast({
      title: "Success",
      description: "Additional Training Added Successfully",
      variant: "default",
    });

    onSave();
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Add {trainingType} Training</span>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Add additional {trainingType.toLowerCase()} training for {planner.employee.firstName}{" "}
            {planner.employee.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Employee Info Card */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Employee:</span>
                <p className="text-foreground font-medium">
                  {planner.employee.firstName} {planner.employee.lastName}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Employee Code:</span>
                <p className="text-foreground font-mono">{planner.employee.employeeCode}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Department:</span>
                <p className="text-foreground">{planner.employee.department.name}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Planner Number:</span>
                <p className="text-foreground font-mono">{planner.plannerNumber}</p>
              </div>
            </div>
          </div>

          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic">
              Training Topic <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.topicId} onValueChange={(value) => setFormData({ ...formData, topicId: value })}>
              <SelectTrigger id="topic" className={errors.topicId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select training topic" />
              </SelectTrigger>
              <SelectContent>
                {mockTrainingTopics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name} ({topic.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.topicId && <p className="text-sm text-destructive">{errors.topicId}</p>}
          </div>

          {/* Trainer Selection */}
          <div className="space-y-2">
            <Label htmlFor="trainer">
              Trainer <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.trainerId}
              onValueChange={(value) => setFormData({ ...formData, trainerId: value })}
            >
              <SelectTrigger id="trainer" className={errors.trainerId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select trainer" />
              </SelectTrigger>
              <SelectContent>
                {mockTrainers.map((trainer) => (
                  <SelectItem key={trainer.id} value={trainer.id}>
                    {trainer.name} - {trainer.department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.trainerId && <p className="text-sm text-destructive">{errors.trainerId}</p>}
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "dd/MM/yyyy") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>
                End Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "dd/MM/yyyy") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">
              Duration (hours) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="duration"
              type="text"
              placeholder="Enter duration in hours"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className={errors.duration ? "border-destructive" : ""}
            />
            {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
          </div>

          {/* Remark */}
          <div className="space-y-2">
            <Label htmlFor="remark">
              Remark <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="remark"
              placeholder="Enter remarks about the training"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              className={errors.remark ? "border-destructive" : ""}
              rows={3}
            />
            {errors.remark && <p className="text-sm text-destructive">{errors.remark}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Training</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
