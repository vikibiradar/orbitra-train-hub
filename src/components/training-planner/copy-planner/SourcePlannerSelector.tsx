import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrainingPlanner } from "@/types/training-planner";
import { mockSourcePlannersForCopy } from "@/data/mock-training-data";
interface SourcePlannerSelectorProps {
  selectedPlanner: TrainingPlanner | null;
  onPlannerSelect: (planner: TrainingPlanner | null) => void;
}
export function SourcePlannerSelector({
  selectedPlanner,
  onPlannerSelect
}: SourcePlannerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Use dedicated source planners for copying (all approved with complete details)
  const availablePlanners = mockSourcePlannersForCopy;
  const isLoading = false;

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
      
      {/* Search Input with Dropdown */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by planner number, employee name, or code..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4" readOnly={!!selectedPlanner} />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[400px] max-h-[400px] overflow-y-auto bg-background">
            {isLoading ? <div className="p-4 text-center text-sm text-muted-foreground">
                Loading planners...
              </div> : filteredPlanners.length === 0 ? <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery ? "No planners match your search" : "No planners available"}
              </div> : filteredPlanners.map(planner => <DropdownMenuItem key={planner.id} onClick={() => {
            onPlannerSelect(planner);
            setSearchQuery(getPlannerDisplayText(planner));
          }} className="cursor-pointer">
                  <div className="flex flex-col gap-1 py-1 w-full">
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
                </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>;
}