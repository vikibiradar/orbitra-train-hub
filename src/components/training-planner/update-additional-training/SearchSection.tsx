import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrainingPlanner } from "@/types/training-planner";
import { mockApprovedPlanners } from "@/data/mock-training-data";

interface SearchSectionProps {
  onSearch: (results: TrainingPlanner[]) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [plannerNumber, setPlannerNumber] = useState("");

  const hasActiveFilters = employeeName || employeeId || plannerNumber;

  useEffect(() => {
    if (!hasActiveFilters) {
      onSearch(mockApprovedPlanners);
      return;
    }

    const results = mockApprovedPlanners.filter((planner) => {
      const fullName = `${planner.employee.firstName} ${planner.employee.lastName}`.toLowerCase();
      const empCode = planner.employee.employeeCode.toLowerCase();
      const plannerNum = planner.plannerNumber?.toLowerCase() || "";
      
      const matchesName = !employeeName || fullName.includes(employeeName.toLowerCase().trim());
      const matchesId = !employeeId || empCode.includes(employeeId.toLowerCase().trim());
      const matchesPlanner = !plannerNumber || plannerNum.includes(plannerNumber.toLowerCase().trim());
      
      return matchesName && matchesId && matchesPlanner;
    });

    onSearch(results);
  }, [employeeName, employeeId, plannerNumber, onSearch, hasActiveFilters]);

  const handleClear = () => {
    setEmployeeName("");
    setEmployeeId("");
    setPlannerNumber("");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Employee Name */}
        <div className="flex-1">
          <Label htmlFor="employeeName" className="text-sm font-medium mb-2">
            Employee Name
          </Label>
          <Input
            id="employeeName"
            placeholder="Enter employee name..."
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>

        {/* Employee ID */}
        <div className="flex-1">
          <Label htmlFor="employeeId" className="text-sm font-medium mb-2">
            Employee ID
          </Label>
          <Input
            id="employeeId"
            placeholder="Enter employee ID..."
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>

        {/* Planner Number */}
        <div className="flex-1">
          <Label htmlFor="plannerNumber" className="text-sm font-medium mb-2">
            Planner Number
          </Label>
          <Input
            id="plannerNumber"
            placeholder="Enter planner number..."
            value={plannerNumber}
            onChange={(e) => setPlannerNumber(e.target.value)}
          />
        </div>
      </div>

      {/* Clear Button and Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Only approved planners are available for additional training updates
        </p>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
