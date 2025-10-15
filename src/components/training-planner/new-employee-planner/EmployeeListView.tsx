import { useState, useMemo } from "react";
import { Search, Filter, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Employee, EmployeeFilter } from "@/types/training-planner";
import { useEmployees, useTrainingPlannerLookups } from "@/hooks/useTrainingPlannerApi";
import { format } from "date-fns";

interface EmployeeListViewProps {
  onCreatePlanner: (employee: Employee, type: "general") => void;
}

export function EmployeeListView({ onCreatePlanner }: EmployeeListViewProps) {
  const [filters, setFilters] = useState<EmployeeFilter>({});
  const [sortField, setSortField] = useState<keyof Employee>("joiningDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: employees = [], isLoading: employeesLoading } = useEmployees({
    filters,
    sortBy: sortField,
    sortOrder: sortDirection
  });
  const { data: lookups } = useTrainingPlannerLookups();

  // Use employees directly from API hook as it handles filtering and sorting
  const filteredAndSortedEmployees = employees;

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getDaysFromJoining = (joiningDate: string) => {
    const joining = new Date(joiningDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joining.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4 p-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search employees..."
            value={filters.searchTerm || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="pl-10"
          />
        </div>
        
        <Select value={filters.location || "all"} onValueChange={(value) => 
          setFilters(prev => ({ ...prev, location: value === "all" ? undefined : value }))
        }>
          <SelectTrigger className="w-full md:w-40">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {lookups?.locations?.map(loc => (
              <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
            )) || []}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setFilters({})}
          disabled={!filters.searchTerm && (!filters.location || filters.location === "all")}
        >
          <Filter className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        {employeesLoading ? "Loading employees..." : `Showing ${filteredAndSortedEmployees.length} employees`}
      </div>

      {/* Employee Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark/90">
              <TableHead 
                className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                onClick={() => handleSort("firstName")}
              >
                Employee
                {sortField === "firstName" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                onClick={() => handleSort("employeeCode")}
              >
                Employee Code
                {sortField === "employeeCode" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                onClick={() => handleSort("location" as keyof Employee)}
              >
                Location
                {sortField === "location" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                onClick={() => handleSort("joiningDate")}
              >
                Joining Date
                {sortField === "joiningDate" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead className="text-white font-semibold">Days Since Joining</TableHead>
              <TableHead className="text-center text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedEmployees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.profilePicture} alt={`${employee.firstName} ${employee.lastName}`} />
                      <AvatarFallback className="bg-ps-primary text-white text-xs">
                        {getInitials(employee.firstName, employee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{employee.employeeCode}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{employee.location.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{format(new Date(employee.joiningDate), "dd MMM yyyy")}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getDaysFromJoining(employee.joiningDate) > 30 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {getDaysFromJoining(employee.joiningDate)} days
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => onCreatePlanner(employee, "general")}
                  >
                    Create Planner
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAndSortedEmployees.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No employees found matching the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}