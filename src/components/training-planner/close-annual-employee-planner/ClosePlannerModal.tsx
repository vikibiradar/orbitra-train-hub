import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Calendar, User, MapPin, Building } from "lucide-react";
import { format } from "date-fns";

interface ClosePlannerModalProps {
  planner: any;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClosePlannerModal({ planner, open, onClose, onConfirm }: ClosePlannerModalProps) {
  const completedTopics = planner.topics.filter((t: any) => t.isCompleted || t.isCancelled).length;
  const totalTopics = planner.topics.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            Close Annual Training Planner
          </DialogTitle>
          <DialogDescription>
            Review the planner details before closing. A new planner will be created for the next applicable year.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Information */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg mb-3">Employee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Employee Name</p>
                  <p className="font-medium">
                    {planner.employee.firstName} {planner.employee.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Employee Code</p>
                  <p className="font-mono font-medium">{planner.employee.employeeCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{planner.employee.location.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Joining Date</p>
                  <p className="font-medium">
                    {format(new Date(planner.employee.joiningDate), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Planner Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Year</p>
              <p className="text-2xl font-bold">{planner.applicableYear}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Next Year</p>
              <p className="text-2xl font-bold text-primary">{planner.nextYearApplicable}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Topics Status</p>
              <p className="text-2xl font-bold">
                {completedTopics}/{totalTopics}
              </p>
            </div>
          </div>

          <Separator />

          {/* Training Topics */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Training Topics</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark/90">
                    <TableHead className="text-white font-semibold">Topic</TableHead>
                    <TableHead className="text-white font-semibold">Trainer</TableHead>
                    <TableHead className="text-white font-semibold">Duration</TableHead>
                    <TableHead className="text-center text-white font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planner.topics.map((topic: any) => (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{topic.topic.name}</div>
                          <div className="text-xs text-muted-foreground">{topic.topic.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>{topic.trainer.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(topic.startDate), "dd MMM")} -{" "}
                          {format(new Date(topic.endDate), "dd MMM yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {topic.isCancelled ? (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Cancelled
                            </Badge>
                          ) : topic.isCompleted ? (
                            <Badge variant="default" className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> By closing this planner, the employee will be moved to the next annual
              planner for year <strong>{planner.nextYearApplicable}</strong>. This action cannot be undone.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm & Close Planner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
