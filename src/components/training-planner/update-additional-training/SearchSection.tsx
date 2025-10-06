import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrainingPlanner } from "@/types/training-planner";
import { mockApprovedPlanners } from "@/data/mock-training-data";

interface SearchSectionProps {
  onSearch: (results: TrainingPlanner[]) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="text-sm font-medium mb-2">
            Search Term
          </Label>
          <Input
            id="search"
            placeholder="Enter Employee Name, Employee ID, or Planner Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={handleSearch}
            className="w-full sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Only approved planners are available for additional training updates
      </p>
    </div>
  );
}
