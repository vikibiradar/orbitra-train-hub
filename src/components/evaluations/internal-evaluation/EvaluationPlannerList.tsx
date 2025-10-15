import { useState } from "react";
import { Search, ClipboardCheck, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EvaluationPlanner, EvaluationStage } from "@/types/evaluation";
import { mockEvaluationPlanners } from "@/data/mock-evaluation-data";
import { format } from "date-fns";

interface EvaluationPlannerListProps {
  onEvaluate: (planner: EvaluationPlanner) => void;
}

export function EvaluationPlannerList({ onEvaluate }: EvaluationPlannerListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Filter planners
  const filteredPlanners = mockEvaluationPlanners.filter((planner) => {
    const matchesSearch =
      planner.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.plannerNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === "all" || planner.currentEvaluationStage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case EvaluationStage.FIRST:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case EvaluationStage.SECOND:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case EvaluationStage.THIRD:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case EvaluationStage.FINAL:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee name, code, or planner number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value={EvaluationStage.FIRST}>1st Evaluation</SelectItem>
            <SelectItem value={EvaluationStage.SECOND}>2nd Evaluation</SelectItem>
            <SelectItem value={EvaluationStage.THIRD}>3rd Evaluation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark/90">
              <TableHead className="text-white font-semibold">Planner No.</TableHead>
              <TableHead className="text-white font-semibold">Employee</TableHead>
              <TableHead className="text-white font-semibold">Department</TableHead>
              <TableHead className="text-white font-semibold">Current Stage</TableHead>
              <TableHead className="text-white font-semibold">Evaluation Date</TableHead>
              <TableHead className="text-white font-semibold">Topics</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-right text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlanners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No planners found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredPlanners.map((planner) => (
                <TableRow key={planner.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{planner.plannerNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {planner.employee.firstName} {planner.employee.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">{planner.employee.employeeCode}</span>
                    </div>
                  </TableCell>
                  <TableCell>{planner.employee.department.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStageColor(planner.currentEvaluationStage)}>
                      {planner.currentEvaluationStage}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(planner.firstEvaluationDate), "dd MMM yyyy")}</TableCell>
                  <TableCell className="text-right">{planner.topics.length}</TableCell>
                  <TableCell>
                    {planner.canEvaluate ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Ready
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Not Ready
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {planner.canEvaluate ? (
                      <Button
                        size="sm"
                        onClick={() => onEvaluate(planner)}
                        className="bg-ps-primary hover:bg-ps-primary/90"
                      >
                        <ClipboardCheck className="mr-2 h-4 w-4" />
                        Evaluate
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Not Available
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info Alert */}
      {filteredPlanners.some((p) => !p.canEvaluate) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some planners are not ready for evaluation. This may be because the first training date has not passed, or
            no topics have attendance marked as "Yes" yet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
