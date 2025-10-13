import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrainingPlanner } from "@/types/training-planner";
import { usePlanners } from "@/hooks/useTrainingPlannerApi";
interface SourcePlannerSelectorProps {
  selectedPlanner: TrainingPlanner | null;
  onPlannerSelect: (planner: TrainingPlanner | null) => void;
}
export function SourcePlannerSelector({
  selectedPlanner,
  onPlannerSelect
}: SourcePlannerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch planners - exclude "Submitted" status (pending TI approval)
  const {
    data: allPlanners,
    isLoading
  } = usePlanners({});

  // Filter planners based on business rules
  const availablePlanners = useMemo(() => {
    if (!allPlanners) return [];
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    return allPlanners.filter(planner => {
      // Exclude planners that are "Submitted" (waiting for TI approval)
      if (planner.status === "Submitted") return false;

      // Include New Employee Planners (approved or converted to annual)
      if (planner.plannerType === 11) {
        // PlannerType.GENERAL_NEW_EMPLOYEE
        // Include if approved or if it's been converted to annual
        return planner.status === "Approved" || planner.status === "Draft";
      }

      // Include Annual Planners from current year or previous year
      if (planner.plannerType === 20) {
        // PlannerType.ANNUAL_EMPLOYEE
        const plannerYear = new Date(planner.createdDate).getFullYear();
        return (plannerYear === currentYear || plannerYear === previousYear) && planner.status === "Approved";
      }
      return false;
    });
  }, [allPlanners]);

  // Filter planners based on search query
  const filteredPlanners = useMemo(() => {
    if (!searchQuery.trim()) return availablePlanners;
    const query = searchQuery.toLowerCase();
    return availablePlanners.filter(planner => planner.plannerNumber.toLowerCase().includes(query) || planner.employee.firstName.toLowerCase().includes(query) || planner.employee.lastName.toLowerCase().includes(query) || planner.employee.employeeCode.toLowerCase().includes(query));
  }, [availablePlanners, searchQuery]);
  const getPlannerDisplayText = (planner: TrainingPlanner) => {
    const plannerTypeText = planner.plannerType === 11 ? "New Employee" : "Annual";
    return `${planner.plannerNumber} - ${planner.employee.firstName} ${planner.employee.lastName} - ${plannerTypeText}`;
  };
  const getPlannerYear = (planner: TrainingPlanner) => {
    return new Date(planner.createdDate).getFullYear();
  };
  return <div className="space-y-3">
      <Label className="text-base font-semibold">
        Source Planner <span className="text-destructive">*</span>
      </Label>
      
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by planner number, employee name, or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Planner Select Dropdown */}
      <Select value={selectedPlanner?.id || ""} onValueChange={value => {
      const planner = availablePlanners.find(p => p.id === value);
      onPlannerSelect(planner || null);
    }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Planner">
            {selectedPlanner && getPlannerDisplayText(selectedPlanner)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {isLoading ? <div className="p-4 text-center text-sm text-muted-foreground">
              Loading planners...
            </div> : filteredPlanners.length === 0 ? <div className="p-4 text-center text-sm text-muted-foreground">
              {searchQuery ? "No planners match your search" : "No planners available"}
            </div> : filteredPlanners.map(planner => <SelectItem key={planner.id} value={planner.id}>
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{planner.plannerNumber}</span>
                    <Badge variant="outline" className="text-xs">
                      {planner.plannerType === 11 ? "New Employee" : "Annual"}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getPlannerYear(planner)}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {planner.employee.firstName} {planner.employee.lastName} ({planner.employee.employeeCode})
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {planner.employee.department.name} • {planner.employee.location.name}
                  </span>
                </div>
              </SelectItem>)}
        </SelectContent>
      </Select>

      {selectedPlanner && <div className="p-3 bg-muted/30 rounded-lg text-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={selectedPlanner.status === "Approved" ? "default" : "secondary"}>
              {selectedPlanner.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Topics:</span>
            <span className="font-medium">{selectedPlanner.topics.length}</span>
          </div>
        </div>}
    </div>;
}