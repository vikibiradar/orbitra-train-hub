import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrainingPlanner } from "@/types/training-planner";
import { format } from "date-fns";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface PlannerDetailsModalProps {
  planner: TrainingPlanner;
  open: boolean;
  onClose: () => void;
  onApprove: (planner: TrainingPlanner) => void;
  onReject: (planner: TrainingPlanner) => void;
}

export const PlannerDetailsModal = ({ 
  planner, 
  open, 
  onClose, 
  onApprove, 
  onReject 
}: PlannerDetailsModalProps) => {
  
  const handleApprove = () => {
    onApprove(planner);
    onClose();
  };

  const handleReject = () => {
    onReject(planner);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Training Planner Details</span>
            <Badge variant="outline">{planner.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Employee Code</h4>
                <p className="font-mono">{planner.employee.employeeCode}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Employee Name</h4>
                <p>{planner.employee.firstName} {planner.employee.lastName}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Department</h4>
                <p>{planner.employee.department.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Location</h4>
                <p>{planner.employee.location.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Joining Date</h4>
                <p>{format(new Date(planner.employee.joiningDate), 'dd MMMM yyyy')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                <p>{planner.employee.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Planner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Planner Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Training In-charge</h4>
                <p>{planner.trainingIncharge?.name || 'Not assigned'}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Proposed First Evaluation</h4>
                <p>
                  {planner.proposedFirstEvaluationDate 
                    ? format(new Date(planner.proposedFirstEvaluationDate), 'dd MMMM yyyy')
                    : 'Not set'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Selected Scopes</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {planner.selectedScopes.map((scope) => (
                    <Badge key={scope.id} variant="secondary" className="text-xs">
                      {scope.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Submitted Date</h4>
                <p>
                  {planner.submittedDate 
                    ? format(new Date(planner.submittedDate), 'dd MMMM yyyy')
                    : 'Not submitted'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Training Topics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Training Topics</CardTitle>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm text-muted-foreground">
                    Orange dot indicates newly added topics
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Topic</TableHead>
                      <TableHead>Trainer</TableHead>
                      <TableHead className="text-right">Start Date</TableHead>
                      <TableHead className="text-right">End Date</TableHead>
                      <TableHead>Mode of Evaluation</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planner.topics.map((topicPlanner) => (
                      <TableRow key={topicPlanner.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {topicPlanner.isNew && (
                              <div className="w-2 h-2 bg-warning rounded-full" title="Newly added topic" />
                            )}
                            <div>
                              <div className="font-medium">{topicPlanner.topic.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {topicPlanner.topic.code}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {topicPlanner.trainer?.name || 'Not assigned'}
                            </div>
                            {topicPlanner.trainer && (
                              <div className="text-sm text-muted-foreground">
                                {topicPlanner.trainer.department.name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {format(new Date(topicPlanner.startDate), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          {format(new Date(topicPlanner.endDate), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {topicPlanner.modeOfEvaluation || 'Not set'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={topicPlanner.comments}>
                            {topicPlanner.comments || 'No comments'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={handleReject}
              className="flex items-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject</span>
            </Button>
            <Button
              onClick={handleApprove}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approve All</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};