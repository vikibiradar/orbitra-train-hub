import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Employee } from "@/types/training-planner";
import { useEmployees, usePlanners } from "@/hooks/useTrainingPlannerApi";

interface TargetEmployeeSelectorProps {
  employeeType: "New" | "Annual";
  selectedEmployeeId: string;
  onEmployeeSelect: (employeeId: string) => void;
}

export function TargetEmployeeSelector({
  employeeType,
  selectedEmployeeId,
  onEmployeeSelect,
}: TargetEmployeeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all employees and planners
  const { data: allEmployees, isLoading: employeesLoading } = useEmployees({});
  const { data: allPlanners, isLoading: plannersLoading } = usePlanners({});

  const currentYear = new Date().getFullYear();

  // Filter employees based on employee type and business rules
  const availableEmployees = useMemo(() => {
    if (!allEmployees || !allPlanners) return [];

    return allEmployees.filter((employee) => {
      // Find any planner (including drafts) for this employee
      const employeePlanners = allPlanners.filter(
        (planner) => planner.employee.id === employee.id
      );

      if (employeeType === "New") {
        // For New employees: Show only those without ANY planner (not even draft)
        return employeePlanners.length === 0;
      } else {
        // For Annual employees: Show only those where applicable year is current year
        // and no planner exists (not even draft)
        // Mock: Check if joining year + 1 <= current year (meaning they need annual training)
        const joiningYear = new Date(employee.joiningDate).getFullYear();
        const isEligibleForAnnual = joiningYear < currentYear;
        
        // Check if they have a planner for current year
        const hasCurrentYearPlanner = employeePlanners.some((planner) => {
          const plannerYear = new Date(planner.createdDate).getFullYear();
          return plannerYear === currentYear && planner.plannerType === 20; // PlannerType.ANNUAL_EMPLOYEE
        });

        return isEligibleForAnnual && !hasCurrentYearPlanner;
      }
    });
  }, [allEmployees, allPlanners, employeeType, currentYear]);

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return availableEmployees;

    const query = searchQuery.toLowerCase();
    return availableEmployees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query) ||
        employee.employeeCode.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
    );
  }, [availableEmployees, searchQuery]);

  const selectedEmployee = useMemo(() => {
    return availableEmployees.find((emp) => emp.id === selectedEmployeeId);
  }, [availableEmployees, selectedEmployeeId]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isLoading = employeesLoading || plannersLoading;

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">
        Select Employee <span className="text-destructive">*</span>
      </Label>
      
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, employee code, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employee Select Dropdown */}
      <Select
        value={selectedEmployeeId}
        onValueChange={onEmployeeSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Employee">
            {selectedEmployee && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedEmployee.profilePicture} />
                  <AvatarFallback className="text-xs bg-ps-primary text-white">
                    {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {selectedEmployee.firstName} {selectedEmployee.lastName} ({selectedEmployee.employeeCode})
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {searchQuery
                ? "No employees match your search"
                : `No ${employeeType.toLowerCase()} employees available without a planner`}
            </div>
          ) : (
            filteredEmployees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                <div className="flex items-center gap-3 py-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={employee.profilePicture} />
                    <AvatarFallback className="text-xs bg-ps-primary text-white">
                      {getInitials(employee.firstName, employee.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {employee.employeeCode}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {employee.department.name} • {employee.location.name}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {selectedEmployee && (
        <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedEmployee.profilePicture} />
              <AvatarFallback className="bg-ps-primary text-white">
                {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </div>
              <div className="text-xs text-muted-foreground">{selectedEmployee.email}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div>
              <span className="text-muted-foreground">Department:</span>
              <div className="font-medium">{selectedEmployee.department.name}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>
              <div className="font-medium">{selectedEmployee.location.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
