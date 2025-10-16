import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvaluationPlanner } from "@/types/evaluation";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EligibleEmployeesListProps {
  employees: EvaluationPlanner[];
  selectedEmployees: EvaluationPlanner[];
  onEmployeeSelect: (planner: EvaluationPlanner, selected: boolean) => void;
  onPlanEvaluation: () => void;
}

export function EligibleEmployeesList({
  employees,
  selectedEmployees,
  onEmployeeSelect,
  onPlanEvaluation,
}: EligibleEmployeesListProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      employees.forEach(emp => {
        if (!selectedEmployees.find(s => s.id === emp.id)) {
          onEmployeeSelect(emp, true);
        }
      });
    } else {
      employees.forEach(emp => {
        onEmployeeSelect(emp, false);
      });
    }
  };

  const handlePlanClick = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "Validation Error",
        description: "Select at least one Employee from the Grid.",
        variant: "destructive",
      });
      return;
    }
    onPlanEvaluation();
  };

  const isSelected = (plannerId: string) => {
    return selectedEmployees.some(s => s.id === plannerId);
  };

  const allSelected = employees.length > 0 && 
    employees.every(emp => isSelected(emp.id));

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Employee Code</TableHead>
                <TableHead>Employee Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead className="text-right">Topics Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No eligible employees found
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((planner) => (
                  <TableRow key={planner.id}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected(planner.id)}
                        onCheckedChange={(checked) =>
                          onEmployeeSelect(planner, checked as boolean)
                        }
                        aria-label={`Select ${planner.employee.firstName} ${planner.employee.lastName}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {planner.employee.employeeCode}
                    </TableCell>
                    <TableCell>
                      {planner.employee.firstName} {planner.employee.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{planner.employee.department.name}</Badge>
                    </TableCell>
                    <TableCell>{planner.employee.location.name}</TableCell>
                    <TableCell>
                      {new Date(planner.employee.joiningDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {planner.topicsEvaluationData.length}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="flex justify-end gap-2 px-4 pb-4">
        <Button
          onClick={handlePlanClick}
          disabled={selectedEmployees.length === 0}
          className="ps-button"
        >
          Plan Final Evaluation ({selectedEmployees.length})
        </Button>
      </div>
    </div>
  );
}
