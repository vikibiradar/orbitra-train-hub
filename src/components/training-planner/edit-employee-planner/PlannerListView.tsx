import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, FileText, Clock } from "lucide-react";
import { EnhancedTrainingPlanner, PlannerStatus } from "@/types/training-planner";
import { PlannerStatusIndicator } from "./PlannerStatusIndicator";
import { usePlanners } from "@/hooks/useTrainingPlannerApi";
import { format } from "date-fns";

interface PlannerListViewProps {
  onPlannerSelect: (planner: EnhancedTrainingPlanner) => void;
}

export function PlannerListView({ onPlannerSelect }: PlannerListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("createdDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: planners = [], isLoading } = usePlanners({
    filters: {
      searchTerm,
      status: [PlannerStatus.SUBMITTED, PlannerStatus.APPROVED, PlannerStatus.REJECTED, PlannerStatus.IN_PROGRESS]
    },
    sortBy: sortField,
    sortOrder
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const canEdit = (planner: any) => {
    return planner.status !== PlannerStatus.SUBMITTED && !planner.isMovedToFinalEvaluation;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 animate-spin" />
            <span>Loading planners...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Training Planners</span>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name or planner number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("plannerNumber")}
                >
                  Planner Number
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("employee")}
                >
                  Employee
                </TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("createdDate")}
                >
                  Created Date
                </TableHead>
                <TableHead>Amendment Ver.</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No training planners found
                  </TableCell>
                </TableRow>
              ) : (
                planners.map((planner: any) => (
                  <TableRow key={planner.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {planner.plannerNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {planner.employee.firstName} {planner.employee.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {planner.employee.employeeCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{planner.employee.department.name}</TableCell>
                    <TableCell>{planner.employee.location.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <PlannerStatusIndicator status={planner.status} />
                        {planner.isMovedToFinalEvaluation && (
                          <Badge variant="secondary" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Final Evaluation
                          </Badge>
                        )}
                        {planner.needsRetraining && (
                          <Badge variant="destructive" className="text-xs">
                            Re-training Required
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(planner.createdDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        v{planner.amendmentVersion || 1}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={canEdit(planner) ? "default" : "outline"}
                        disabled={!canEdit(planner)}
                        onClick={() => onPlannerSelect(planner as EnhancedTrainingPlanner)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}