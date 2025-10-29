import { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FinalEvaluationRecord, PanelMemberEvaluationComment } from "@/types/final-evaluation";
import { mockPanelMembers } from "@/data/mock-final-evaluation-data";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const commentSchema = z.object({
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface EvaluationCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FinalEvaluationRecord;
  onSave: (updatedRecord: FinalEvaluationRecord) => void;
}

export function EvaluationCommentsModal({
  isOpen,
  onClose,
  record,
  onSave,
}: EvaluationCommentsModalProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<PanelMemberEvaluationComment[]>(
    record.panelMemberComments
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const allPanelMemberIds = [
    record.mainPanelMember,
    ...record.otherPanelMembers,
  ].filter(Boolean);

  const onSubmit = (data: CommentFormData) => {
    // For demo, we'll add comment from the current user (simulated as main panel member)
    const panelMember = mockPanelMembers.find(pm => pm.id === record.mainPanelMember);
    
    if (!panelMember) {
      toast({
        title: "Error",
        description: "Panel member not found",
        variant: "destructive",
      });
      return;
    }

    const newComment: PanelMemberEvaluationComment = {
      panelMemberId: panelMember.id,
      panelMemberName: panelMember.name,
      comment: data.comment,
      commentDate: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    const updatedRecord = {
      ...record,
      panelMemberComments: updatedComments,
    };

    onSave(updatedRecord);
    reset();

    toast({
      title: "Comment Added",
      description: "Evaluation comment has been saved successfully",
    });
  };

  const getPanelMemberName = (id: string) => {
    const member = mockPanelMembers.find(pm => pm.id === id);
    return member?.name || "Unknown";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Evaluation Comments</DialogTitle>
          <DialogDescription>
            Add panel member comments for {record.employeeName} ({record.employeeCode})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Employee & Evaluation Details */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Evaluation Details</CardTitle>
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
              <Separator className="my-2" />
              <div>
                <span className="text-muted-foreground">Panel Members:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {allPanelMemberIds.map(id => (
                    <Badge key={id} variant="secondary">
                      {getPanelMemberName(id)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Comments */}
          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-[200px]">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments added yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 space-y-1 bg-muted/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {comment.panelMemberName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.commentDate), "dd MMM yyyy HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="comment">Add Comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter evaluation comment (minimum 10 characters)..."
                rows={4}
                {...register("comment")}
              />
              {errors.comment && (
                <p className="text-sm text-destructive">{errors.comment.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Add Comment
            </Button>
          </form>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
