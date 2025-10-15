import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Trash2, 
  CalendarIcon, 
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Ban
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  EnhancedTrainingPlanner, 
  EnhancedTrainingPlannerTopic, 
  TopicStatus, 
  ModeOfEvaluation 
} from "@/types/training-planner";
import { useTrainingPlannerLookups } from "@/hooks/useTrainingPlannerApi";
import { CancelTopicModal } from "./CancelTopicModal";

interface TopicEditTableProps {
  planner: EnhancedTrainingPlanner;
  isAmendmentMode: boolean;
  onTopicsChange: () => void;
}

export function TopicEditTable({ planner, isAmendmentMode, onTopicsChange }: TopicEditTableProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [newTopics, setNewTopics] = useState<EnhancedTrainingPlannerTopic[]>([]);
  const [cancellingTopicId, setCancellingTopicId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { data: lookups } = useTrainingPlannerLookups();

  const getTopicStatusIcon = (status: string) => {
    switch (status) {
      case TopicStatus.TI_APPROVED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case TopicStatus.TI_REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case TopicStatus.TRAINER_ACCEPTED:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case TopicStatus.TRAINER_REJECTED:
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case TopicStatus.CANCELLED:
        return <Ban className="h-4 w-4 text-gray-500" />;
      case TopicStatus.PENDING_TI_APPROVAL:
      case TopicStatus.PENDING_TRAINER_APPROVAL:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRowClassName = (topic: EnhancedTrainingPlannerTopic) => {
    if (topic.status === TopicStatus.CANCELLED) return "bg-gray-50 opacity-60";
    if (topic.status === TopicStatus.TI_APPROVED) return "bg-green-50";
    if (topic.status === TopicStatus.TI_REJECTED) return "bg-red-50";
    if (topic.status === TopicStatus.TRAINER_ACCEPTED) return "bg-blue-50";
    if (topic.status === TopicStatus.TRAINER_REJECTED) return "bg-orange-50";
    return "";
  };

  const canEditTopic = (topic: EnhancedTrainingPlannerTopic) => {
    if (isAmendmentMode) {
      return topic.amendmentVersion === planner.amendmentVersion;
    }
    return topic.isEditable && topic.status !== TopicStatus.CANCELLED;
  };

  const canRemoveTopic = (topic: EnhancedTrainingPlannerTopic) => {
    if (isAmendmentMode) {
      return topic.amendmentVersion === planner.amendmentVersion && topic.canRemove;
    }
    return topic.canRemove && !topic.attendanceMarked && !topic.ratingGiven;
  };

  const canCancelTopic = (topic: EnhancedTrainingPlannerTopic) => {
    return topic.canCancel && 
           topic.status === TopicStatus.TI_APPROVED && 
           !topic.attendanceMarked && 
           !topic.ratingGiven;
  };

  const handleAddTopic = () => {
    if (!selectedTopicId) {
      setValidationErrors(["Please select a topic to add"]);
      return;
    }

    const selectedTopic = lookups?.trainingTopics.find(t => t.id === selectedTopicId);
    if (!selectedTopic) return;

    // Check for duplicates
    const exists = [...planner.topics, ...newTopics].some(
      t => t.topic.id === selectedTopicId
    );

    if (exists) {
      setValidationErrors(["This topic is already added to the planner"]);
      return;
    }

    const newTopic: EnhancedTrainingPlannerTopic = {
      id: `new-${Date.now()}`,
      topic: selectedTopic,
      startDate: "",
      endDate: "",
      modeOfEvaluation: undefined,
      comments: "",
      status: TopicStatus.PENDING_TI_APPROVAL,
      isEditable: true,
      canRemove: true,
      canCancel: false,
      amendmentVersion: planner.amendmentVersion,
      isNew: true
    };

    setNewTopics([...newTopics, newTopic]);
    setSelectedTopicId("");
    setValidationErrors([]);
    onTopicsChange();
  };

  const handleRemoveTopic = (topicId: string) => {
    setNewTopics(newTopics.filter(t => t.id !== topicId));
    onTopicsChange();
  };

  const handleCancelTopic = (reason: string) => {
    if (cancellingTopicId) {
      // Handle topic cancellation logic here
      console.log(`Cancelling topic ${cancellingTopicId} with reason: ${reason}`);
      setCancellingTopicId(null);
      onTopicsChange();
    }
  };

  const handleTopicsUpdate = (topicId: string, field: string, value: any) => {
    setNewTopics(newTopics.map(topic => 
      topic.id === topicId ? { ...topic, [field]: value } : topic
    ));
    onTopicsChange();
  };

  const allTopics = [...planner.topics, ...newTopics];

  return (
    <Card className="ps-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Training Topics</span>
          {!isAmendmentMode && planner.editableState.canAmend && (
            <Badge variant="secondary">
              {allTopics.length} Topic{allTopics.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Topic Section */}
        {(!isAmendmentMode || (isAmendmentMode && planner.editableState.canAmend)) && (
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a training topic to add" />
                </SelectTrigger>
                <SelectContent>
                  {lookups?.trainingTopics
                    .filter(topic => !allTopics.some(t => t.topic.id === topic.id))
                    .map((topic) => (
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
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              {validationErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Topics Table */}
        {allTopics.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark/90">
                  <TableHead className="w-[100px] text-white font-semibold">Status</TableHead>
                  <TableHead className="w-[200px] text-white font-semibold">Topic</TableHead>
                  <TableHead className="w-[180px] text-white font-semibold">Trainer</TableHead>
                  <TableHead className="w-[140px] text-white font-semibold">Start Date</TableHead>
                  <TableHead className="w-[140px] text-white font-semibold">End Date</TableHead>
                  <TableHead className="w-[160px] text-white font-semibold">Mode of Evaluation</TableHead>
                  <TableHead className="w-[120px] text-white font-semibold">Reference Doc</TableHead>
                  <TableHead className="text-white font-semibold">Comments</TableHead>
                  <TableHead className="w-[100px] text-center text-white font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTopics.map((topic) => (
                  <TableRow key={topic.id} className={cn(getRowClassName(topic), "hover:bg-muted/50")}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTopicStatusIcon(topic.status)}
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                        >
                          {topic.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{topic.topic.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {topic.topic.module.name}
                        </div>
                        {topic.isNew && (
                          <Badge variant="secondary" className="text-xs mt-1">New</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {canEditTopic(topic) ? (
                        <Select 
                          value={topic.trainer?.id || ""} 
                          onValueChange={(value) => {
                            const trainer = lookups?.trainers?.find(t => t.id === value);
                            handleTopicsUpdate(topic.id, 'trainer', trainer);
                          }}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select Trainer" />
                          </SelectTrigger>
                          <SelectContent>
                            {lookups?.trainers
                              .filter(trainer => trainer.isActive)
                              .map((trainer) => (
                                <SelectItem key={trainer.id} value={trainer.id}>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium">{trainer.name}</span>
                                    <span className="text-xs text-muted-foreground">{trainer.department.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm">{topic.trainer?.name || "Not assigned"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {canEditTopic(topic) ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-left font-normal text-xs",
                                !topic.startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {topic.startDate 
                                ? format(new Date(topic.startDate), "dd MMM yyyy")
                                : "Select date"
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={topic.startDate ? new Date(topic.startDate) : undefined}
                              onSelect={(date) => handleTopicsUpdate(topic.id, 'startDate', date?.toISOString().split('T')[0])}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-sm">
                          {topic.startDate ? format(new Date(topic.startDate), "dd MMM yyyy") : "-"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {canEditTopic(topic) ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-left font-normal text-xs",
                                !topic.endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {topic.endDate 
                                ? format(new Date(topic.endDate), "dd MMM yyyy")
                                : "Select date"
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={topic.endDate ? new Date(topic.endDate) : undefined}
                              onSelect={(date) => handleTopicsUpdate(topic.id, 'endDate', date?.toISOString().split('T')[0])}
                              disabled={(date) => date < new Date() || (topic.startDate && date <= new Date(topic.startDate))}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-sm">
                          {topic.endDate ? format(new Date(topic.endDate), "dd MMM yyyy") : "-"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {canEditTopic(topic) ? (
                        <Select 
                          value={topic.modeOfEvaluation || ""} 
                          onValueChange={(value) => handleTopicsUpdate(topic.id, 'modeOfEvaluation', value)}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ModeOfEvaluation).map((mode) => (
                              <SelectItem key={mode} value={mode}>
                                <span className="text-xs">{mode}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm">{topic.modeOfEvaluation || "-"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {topic.referenceDocument ? (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Attached
                          </Badge>
                        ) : canEditTopic(topic) ? (
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {canEditTopic(topic) ? (
                        <Textarea
                          value={topic.comments || ""}
                          onChange={(e) => handleTopicsUpdate(topic.id, 'comments', e.target.value)}
                          placeholder="Add comments..."
                          className="text-xs min-h-[60px] resize-none"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm">{topic.comments || "-"}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {canRemoveTopic(topic) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTopic(topic.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {canCancelTopic(topic) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancellingTopicId(topic.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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

        {/* Cancel Topic Modal */}
        <CancelTopicModal
          isOpen={cancellingTopicId !== null}
          onClose={() => setCancellingTopicId(null)}
          onConfirm={handleCancelTopic}
          topicName={
            cancellingTopicId 
              ? allTopics.find(t => t.id === cancellingTopicId)?.topic.name || ""
              : ""
          }
        />
      </CardContent>
    </Card>
  );
}