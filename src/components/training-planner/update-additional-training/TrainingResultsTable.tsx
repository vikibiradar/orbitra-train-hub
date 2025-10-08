import { useState } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrainingPlanner } from "@/types/training-planner";
import { TrainingType } from "./AddTrainingModal";
import { format } from "date-fns";
interface TrainingResultsTableProps {
  results: TrainingPlanner[];
  onAddTraining: (planner: TrainingPlanner, type: TrainingType) => void;
}
type SortField = "employeeName" | "employeeCode" | "department" | "plannerNumber";
type SortOrder = "asc" | "desc";
export function TrainingResultsTable({
  results,
  onAddTraining
}: TrainingResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>("employeeName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const sortedResults = [...results].sort((a, b) => {
    let aValue: string;
    let bValue: string;
    switch (sortField) {
      case "employeeName":
        aValue = `${a.employee.firstName} ${a.employee.lastName}`;
        bValue = `${b.employee.firstName} ${b.employee.lastName}`;
        break;
      case "employeeCode":
        aValue = a.employee.employeeCode;
        bValue = b.employee.employeeCode;
        break;
      case "department":
        aValue = a.employee.department.name;
        bValue = b.employee.department.name;
        break;
      case "plannerNumber":
        aValue = a.plannerNumber || "";
        bValue = b.plannerNumber || "";
        break;
      default:
        return 0;
    }
    const comparison = aValue.localeCompare(bValue);
    return sortOrder === "asc" ? comparison : -comparison;
  });
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  return <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] bg-slate-200">
              <Button variant="ghost" onClick={() => handleSort("employeeName")} className="h-8 px-2 lg:px-3">
                Employee
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="bg-slate-200">
              <Button variant="ghost" onClick={() => handleSort("employeeCode")} className="h-8 px-2 lg:px-3">
                Employee Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="bg-slate-200">
              <Button variant="ghost" onClick={() => handleSort("department")} className="h-8 px-2 lg:px-3">
                Department
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="bg-slate-200">
              <Button variant="ghost" onClick={() => handleSort("plannerNumber")} className="h-8 px-2 lg:px-3">
                Planner Number
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center bg-slate-200">Status</TableHead>
            <TableHead className="text-center bg-slate-200">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map(planner => <TableRow key={planner.id} className="animate-fade-in">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={planner.employee.profilePicture} />
                    <AvatarFallback className="bg-ps-primary/10 text-ps-primary">
                      {getInitials(planner.employee.firstName, planner.employee.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {planner.employee.firstName} {planner.employee.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {planner.employee.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {planner.employee.employeeCode}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {planner.employee.department.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {planner.employee.location.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {planner.plannerNumber}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
                  {planner.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => onAddTraining(planner, "Induction")} className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Induction Training
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onAddTraining(planner, "External")} className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add External Training
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onAddTraining(planner, "Internal")} className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Internal Training
                  </Button>
                </div>
              </TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>;
}