import { MessageSquare, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinalEvaluationRecord, FinalEvaluationResult } from "@/types/final-evaluation";
import { format } from "date-fns";

interface FinalEvaluationListProps {
  records: FinalEvaluationRecord[];
  onOpenComments: (record: FinalEvaluationRecord) => void;
  onOpenResult: (record: FinalEvaluationRecord) => void;
}

export function FinalEvaluationList({
  records,
  onOpenComments,
  onOpenResult,
}: FinalEvaluationListProps) {
  const getResultBadge = (result?: string) => {
    if (!result || result === FinalEvaluationResult.PENDING) {
      return <Badge variant="outline">Pending</Badge>;
    }
    if (result === FinalEvaluationResult.SATISFACTORY) {
      return <Badge className="bg-success text-white">Satisfactory</Badge>;
    }
    if (result === FinalEvaluationResult.NEED_RETRAINING) {
      return <Badge className="bg-warning text-white">Need re-Training</Badge>;
    }
    if (result === FinalEvaluationResult.BELOW_SATISFACTORY) {
      return <Badge variant="destructive">Below Satisfactory</Badge>;
    }
    return <Badge variant="outline">{result}</Badge>;
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Final Evaluations Scheduled</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          No employees have been scheduled for final evaluation yet. Use Plan Final Evaluation to schedule.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Employee Code</TableHead>
            <TableHead className="text-left">Employee Name</TableHead>
            <TableHead className="text-left">Department</TableHead>
            <TableHead className="text-left">Location</TableHead>
            <TableHead className="text-left">Evaluation Date</TableHead>
            <TableHead className="text-left">Evaluation Time</TableHead>
            <TableHead className="text-left">Main Panel Member</TableHead>
            <TableHead className="text-right">Comments Count</TableHead>
            <TableHead className="text-center">Result</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-muted/50">
              <TableCell className="font-medium text-left">{record.employeeCode}</TableCell>
              <TableCell className="text-left">{record.employeeName}</TableCell>
              <TableCell className="text-left">{record.department}</TableCell>
              <TableCell className="text-left">{record.location}</TableCell>
              <TableCell className="text-left">
                {format(new Date(record.evaluationDate), "dd MMM yyyy")}
              </TableCell>
              <TableCell className="text-left">{record.evaluationTime}</TableCell>
              <TableCell className="text-left">
                {record.mainPanelMember ? `Panel-${record.mainPanelMember.slice(-3)}` : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{record.panelMemberComments.length}</Badge>
              </TableCell>
              <TableCell className="text-center">{getResultBadge(record.result)}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenComments(record)}
                    className="h-8"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comments
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onOpenResult(record)}
                    disabled={record.isCompleted}
                    className="h-8"
                  >
                    <ClipboardCheck className="h-4 w-4 mr-1" />
                    {record.isCompleted ? "Completed" : "Save Result"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
