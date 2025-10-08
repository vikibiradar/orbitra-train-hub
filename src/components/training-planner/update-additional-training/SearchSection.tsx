import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrainingPlanner } from "@/types/training-planner";
import { mockApprovedPlanners } from "@/data/mock-training-data";

interface SearchSectionProps {
  onSearch: (results: TrainingPlanner[]) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm.trim()) {
      onSearch([]);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    // Search in approved planners by:
    // 1. Employee name (first or last)
    // 2. Employee code
    // 3. Planner number
    const results = mockApprovedPlanners.filter((planner) => {
      const employeeName = `${planner.employee.firstName} ${planner.employee.lastName}`.toLowerCase();
      const employeeCode = planner.employee.employeeCode.toLowerCase();
      const plannerNumber = planner.plannerNumber?.toLowerCase() || "";
      
      return (
        employeeName.includes(term) ||
        employeeCode.includes(term) ||
        plannerNumber.includes(term)
      );
    });

    onSearch(results);
  }, [searchTerm, onSearch]);

  return (
    <div className="space-y-4">
      <div className="flex-1">
        <Label htmlFor="search" className="text-sm font-medium mb-2">
          Search Term
        </Label>
        <Input
          id="search"
          placeholder="Enter Employee Name, Employee ID, or Planner Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <p className="text-sm text-muted-foreground">
        Only approved planners are available for additional training updates
      </p>
    </div>
  );
}
