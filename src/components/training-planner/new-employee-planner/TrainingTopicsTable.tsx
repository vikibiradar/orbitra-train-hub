import { useState, useEffect } from "react";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  TrainingTopic,
  TrainingPlannerTopic,
  Trainer,
  ModeOfEvaluation,
  ModeOfEvaluationType
} from "@/types/training-planner";
import {
  mockTrainers,
  modeOfEvaluationOptions
} from "@/data/mock-training-data";

interface TrainingTopicsTableProps {
  availableTopics: TrainingTopic[];
  topics: TrainingPlannerTopic[];
  onTopicsChange: (topics: TrainingPlannerTopic[]) => void;
}

export function TrainingTopicsTable({ 
  availableTopics, 
  topics, 
  onTopicsChange 
}: TrainingTopicsTableProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Generate unique ID for new topic entries
  const generateTopicId = () => {
    return `topic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddTopic = () => {
    if (!selectedTopicId) return;

    const topic = availableTopics.find(t => t.id === selectedTopicId);
    if (!topic) return;

    // Check for duplicates
    const exists = topics.some(t => 
      t.topic.id === selectedTopicId && 
      !t.isRemoved
    );

    if (exists) {
      setValidationErrors(prev => ({
        ...prev,
        duplicate: "This topic has already been added to the planner."
      }));
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    const newPlannerTopic: TrainingPlannerTopic = {
      id: generateTopicId(),
      topic,
      startDate: currentDate,
      endDate: currentDate,
      isNew: true
    };

    onTopicsChange([...topics, newPlannerTopic]);
    setSelectedTopicId("");
    
    // Clear any existing errors
    setValidationErrors({});
  };

  const handleRemoveTopic = (topicId: string) => {
    onTopicsChange(topics.filter(t => t.id !== topicId));
  };

  const handleTopicUpdate = (topicId: string, field: keyof TrainingPlannerTopic, value: any) => {
    const updatedTopics = topics.map(topic => {
      if (topic.id === topicId) {
        const updated = { ...topic, [field]: value };
        
        // Validate dates
        if (field === 'startDate' || field === 'endDate') {
          const startDate = field === 'startDate' ? value : topic.startDate;
          const endDate = field === 'endDate' ? value : topic.endDate;
          
          if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setValidationErrors(prev => ({
              ...prev,
              [topicId]: "Start date must be before or equal to end date"
            }));
          } else {
            setValidationErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[topicId];
              return newErrors;
            });
          }
        }

        return updated;
      }
      return topic;
    });

    onTopicsChange(updatedTopics);
  };

  const getAvailableTrainers = (departmentId?: string): Trainer[] => {
    if (departmentId) {
      return mockTrainers.filter(trainer => 
        trainer.department.id === departmentId && trainer.isActive
      );
    }
    return mockTrainers.filter(trainer => trainer.isActive);
  };

  const validateDuplicateTopicDates = (topicId: string, startDate: string, endDate: string) => {
    const currentTopic = topics.find(t => t.id === topicId);
    if (!currentTopic) return true;

    const duplicates = topics.filter(t => 
      t.id !== topicId &&
      t.topic.id === currentTopic.topic.id &&
      t.startDate === startDate &&
      t.endDate === endDate &&
      !t.isRemoved
    );

    return duplicates.length === 0;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="space-y-4">
      {/* Add Topic Section */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a training topic to add" />
            </SelectTrigger>
            <SelectContent>
              {availableTopics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {topic.module.name} • {topic.defaultDuration}h
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleAddTopic}
          disabled={!selectedTopicId}
          className="shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Topic
        </Button>
      </div>

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {Object.values(validationErrors).map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Topics Table */}
      {topics.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px]">Topic</TableHead>
                <TableHead className="w-[180px]">Trainer</TableHead>
                <TableHead className="w-[140px]">Start Date</TableHead>
                <TableHead className="w-[140px]">End Date</TableHead>
                <TableHead className="w-[160px]">Mode of Evaluation</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead className="w-[80px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.filter(topic => !topic.isRemoved).map((plannerTopic, index) => (
                <TableRow key={plannerTopic.id} className="hover:bg-muted/50">
                  {/* Topic Name */}
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{plannerTopic.topic.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {plannerTopic.topic.module.name}
                      </div>
                      {plannerTopic.isNew && (
                        <Badge variant="secondary" className="text-xs mt-1">New</Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Trainer Selection */}
                  <TableCell>
                    <Select
                      value={plannerTopic.trainer?.id || ""}
                      onValueChange={(value) => {
                        const trainer = mockTrainers.find(t => t.id === value);
                        handleTopicUpdate(plannerTopic.id, 'trainer', trainer);
                      }}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Select Trainer" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTrainers().map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.id}>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">{trainer.name}</span>
                              <span className="text-xs text-muted-foreground">{trainer.department.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Start Date */}
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-left font-normal text-xs",
                            !plannerTopic.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {plannerTopic.startDate 
                            ? format(new Date(plannerTopic.startDate), "dd MMM yyyy")
                            : "Select date"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={plannerTopic.startDate ? new Date(plannerTopic.startDate) : undefined}
                          onSelect={(date) => 
                            handleTopicUpdate(plannerTopic.id, 'startDate', date?.toISOString().split('T')[0])
                          }
                          disabled={isDateDisabled}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                  {/* End Date */}
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-left font-normal text-xs",
                            !plannerTopic.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {plannerTopic.endDate 
                            ? format(new Date(plannerTopic.endDate), "dd MMM yyyy")
                            : "Select date"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={plannerTopic.endDate ? new Date(plannerTopic.endDate) : undefined}
                          onSelect={(date) => 
                            handleTopicUpdate(plannerTopic.id, 'endDate', date?.toISOString().split('T')[0])
                          }
                          disabled={isDateDisabled}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                  {/* Mode of Evaluation */}
                  <TableCell>
                    <Select
                      value={plannerTopic.modeOfEvaluation || ""}
                      onValueChange={(value: ModeOfEvaluationType) => 
                        handleTopicUpdate(plannerTopic.id, 'modeOfEvaluation', value)
                      }
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {modeOfEvaluationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="text-xs">{option.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Comments */}
                  <TableCell>
                    <Textarea
                      value={plannerTopic.comments || ""}
                      onChange={(e) => 
                        handleTopicUpdate(plannerTopic.id, 'comments', e.target.value)
                      }
                      placeholder="Add comments..."
                      className="text-xs min-h-[60px] resize-none"
                      rows={2}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTopic(plannerTopic.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
          <Plus className="h-8 w-8 mx-auto mb-4 opacity-50" />
          <p>No training topics added yet.</p>
          <p className="text-sm">Select topics from the dropdown above to get started.</p>
        </div>
      )}
    </div>
  );
}