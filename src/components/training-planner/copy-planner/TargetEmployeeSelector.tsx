import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  onEmployeeSelect
}: TargetEmployeeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch all employees and planners with larger page size for client-side filtering
  const {
    data: allEmployees,
    isLoading: employeesLoading
  } = useEmployees({
    page: 1,
    pageSize: 1000
  });
  const {
    data: allPlanners,
    isLoading: plannersLoading
  } = usePlanners({
    page: 1,
    pageSize: 1000
  });
  const currentYear = new Date().getFullYear();

  // Filter employees based on employee type and business rules
  const availableEmployees = useMemo(() => {
    if (!allEmployees || !allPlanners) return [];
    return allEmployees.filter(employee => {
      // Find any planner (including drafts) for this employee
      const employeePlanners = allPlanners.filter(planner => planner.employee.id === employee.id);
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
        const hasCurrentYearPlanner = employeePlanners.some(planner => {
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
    return availableEmployees.filter(employee => employee.firstName.toLowerCase().includes(query) || employee.lastName.toLowerCase().includes(query) || employee.employeeCode.toLowerCase().includes(query) || employee.email.toLowerCase().includes(query));
  }, [availableEmployees, searchQuery]);
  const selectedEmployee = useMemo(() => {
    return availableEmployees.find(emp => emp.id === selectedEmployeeId);
  }, [availableEmployees, selectedEmployeeId]);
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  const getEmployeeDisplayText = (employee: Employee) => {
    return `${employee.firstName} ${employee.lastName} (${employee.employeeCode})`;
  };
  const isLoading = employeesLoading || plannersLoading;
  return <div className="space-y-3">
      <Label className="text-base font-semibold">
        Select Employee <span className="text-destructive">*</span>
      </Label>
      
      {/* Search Input with Dropdown */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, employee code, or email..." value={searchQuery} onChange={e => {
            setSearchQuery(e.target.value);
            if (selectedEmployee) {
              onEmployeeSelect("");
            }
          }} onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              setDropdownOpen(true);
            }
          }} className="pl-10 pr-4" />
        </div>
        
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[400px] max-h-[400px] overflow-y-auto bg-background">
            {isLoading ? <div className="p-4 text-center text-sm text-muted-foreground">
                Loading employees...
              </div> : filteredEmployees.length === 0 ? <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery ? "No employees match your search" : `No ${employeeType.toLowerCase()} employees available without a planner`}
              </div> : filteredEmployees.map(employee => <DropdownMenuItem key={employee.id} onClick={() => {
            onEmployeeSelect(employee.id);
            setSearchQuery(getEmployeeDisplayText(employee));
            setDropdownOpen(false);
          }} className="cursor-pointer">
                  <div className="flex items-center gap-3 py-1 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.profilePicture} />
                      <AvatarFallback className="text-xs bg-ps-primary text-white">
                        {getInitials(employee.firstName, employee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 flex-1">
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
                </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>;
}