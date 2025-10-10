import { useState, useMemo } from "react";
import { Search, MapPin, Calendar, Users, Printer, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlanners, useTrainingPlannerLookups } from "@/hooks/useTrainingPlannerApi";
import { format } from "date-fns";
import { toast } from "sonner";
import type { TrainingPlanner } from "@/types/training-planner";

export function EmployeeListView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch only approved planners
  const { data: allPlanners = [], isLoading } = usePlanners({
    filters: { status: ["Approved"] }
  });
  
  const { data: lookups } = useTrainingPlannerLookups();

  // Filter and sort planners
  const filteredAndSortedPlanners = useMemo(() => {
    let filtered = allPlanners;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (planner) =>
          planner.employee.firstName.toLowerCase().includes(term) ||
          planner.employee.lastName.toLowerCase().includes(term) ||
          planner.employee.employeeCode.toLowerCase().includes(term) ||
          planner.id.toLowerCase().includes(term)
      );
    }

    // Location filter
    if (locationFilter && locationFilter !== "all") {
      filtered = filtered.filter((planner) => planner.employee.location.id === locationFilter);
    }

    // Department filter
    if (departmentFilter && departmentFilter !== "all") {
      filtered = filtered.filter((planner) => planner.employee.department.id === departmentFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortField === "employee") {
        aVal = `${a.employee.firstName} ${a.employee.lastName}`;
        bVal = `${b.employee.firstName} ${b.employee.lastName}`;
      } else if (sortField === "id") {
        aVal = a.id;
        bVal = b.id;
      } else {
        aVal = (a as any)[sortField];
        bVal = (b as any)[sortField];
      }

      if (typeof aVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [allPlanners, searchTerm, locationFilter, departmentFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePrintPlanner = async (planner: TrainingPlanner) => {
    try {
      toast.loading("Generating print planner document...");
      
      // Simulate document generation (In real implementation, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate filename
      const filename = `PrintPlanner_${planner.id}.docx`;
      
      toast.success(`Print planner generated: ${filename}`, {
        description: "Document is ready for download",
        duration: 3000
      });
      
      // In real implementation, trigger actual file download here
      // For now, we'll just show a success message
      
    } catch (error) {
      toast.error("Failed to generate print planner", {
        description: "Please try again later"
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-4 p-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by employee name, code, or planner ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {lookups?.departments?.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            )) || []}
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full md:w-40">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {lookups?.locations?.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            )) || []}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearchTerm("");
            setLocationFilter("all");
            setDepartmentFilter("all");
          }}
          disabled={!searchTerm && locationFilter === "all" && departmentFilter === "all"}
        >
          Clear Filters
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading approved planners..."
            : `Showing ${filteredAndSortedPlanners.length} approved planners`}
        </div>
        <Badge variant="secondary" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          Approved Planners Only
        </Badge>
      </div>

      {/* Planners Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("id")}
              >
                Planner ID
                {sortField === "id" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("employee")}
              >
                Employee
                {sortField === "employee" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead>Employee Code</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Approved Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedPlanners.map((planner) => (
              <TableRow key={planner.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {planner.id}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={planner.employee.profilePicture}
                        alt={`${planner.employee.firstName} ${planner.employee.lastName}`}
                      />
                      <AvatarFallback className="bg-ps-primary text-white text-xs">
                        {getInitials(planner.employee.firstName, planner.employee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {planner.employee.firstName} {planner.employee.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{planner.employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{planner.employee.employeeCode}</TableCell>
                <TableCell className="text-sm">{planner.employee.department.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{planner.employee.location.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(planner.employee.joiningDate), "dd MMM yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {planner.approvedDate && (
                    <span className="text-sm">
                      {format(new Date(planner.approvedDate), "dd MMM yyyy")}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs gap-2"
                      onClick={() => handlePrintPlanner(planner)}
                    >
                      <Printer className="h-3 w-3" />
                      Print Planner
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAndSortedPlanners.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No approved planners found</p>
            <p className="text-sm mt-1">
              {searchTerm || locationFilter !== "all" || departmentFilter !== "all"
                ? "Try adjusting your filters"
                : "Create and approve planners to see them here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
