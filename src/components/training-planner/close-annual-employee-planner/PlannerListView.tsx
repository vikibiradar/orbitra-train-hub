import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { SearchFilters } from "./SearchFilters";
import { PlannerStatusBadge } from "./PlannerStatusBadge";
import { ClosePlannerModal } from "./ClosePlannerModal";
import { mockAnnualPlannersForClosure } from "@/data/mock-training-data";
import { toast } from "sonner";

interface FilterState {
  searchTerm?: string;
  location?: string;
  joiningDateFrom?: string;
  joiningDateTo?: string;
  applicableYear?: string;
}

export function PlannerListView() {
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedPlanner, setSelectedPlanner] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closedPlannerIds, setClosedPlannerIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("employeeCode");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter planners - exclude already closed ones
  const filteredPlanners = useMemo(() => {
    let result = mockAnnualPlannersForClosure.filter(
      planner => !closedPlannerIds.includes(planner.id)
    );

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(planner =>
        planner.employee.employeeCode.toLowerCase().includes(term) ||
        planner.employee.firstName.toLowerCase().includes(term) ||
        planner.employee.lastName.toLowerCase().includes(term)
      );
    }

    // Apply location filter
    if (filters.location) {
      result = result.filter(planner => planner.employee.location.id === filters.location);
    }

    // Apply joining date filter
    if (filters.joiningDateFrom) {
      result = result.filter(planner => 
        new Date(planner.employee.joiningDate) >= new Date(filters.joiningDateFrom!)
      );
    }

    if (filters.joiningDateTo) {
      result = result.filter(planner => 
        new Date(planner.employee.joiningDate) <= new Date(filters.joiningDateTo!)
      );
    }

    // Apply applicable year filter
    if (filters.applicableYear) {
      result = result.filter(planner => 
        planner.applicableYear.toString() === filters.applicableYear
      );
    }

    return result;
  }, [filters, closedPlannerIds]);

  // Sort planners
  const sortedPlanners = useMemo(() => {
    const sorted = [...filteredPlanners];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "employeeCode":
          aValue = a.employee.employeeCode;
          bValue = b.employee.employeeCode;
          break;
        case "employeeName":
          aValue = `${a.employee.firstName} ${a.employee.lastName}`;
          bValue = `${b.employee.firstName} ${b.employee.lastName}`;
          break;
        case "location":
          aValue = a.employee.location.name;
          bValue = b.employee.location.name;
          break;
        case "joiningDate":
          aValue = new Date(a.employee.joiningDate);
          bValue = new Date(b.employee.joiningDate);
          break;
        case "applicableYear":
          aValue = a.applicableYear;
          bValue = b.applicableYear;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredPlanners, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleClosePlanner = (planner: any) => {
    setSelectedPlanner(planner);
    setIsModalOpen(true);
  };

  const handleConfirmClose = () => {
    if (selectedPlanner) {
      setClosedPlannerIds(prev => [...prev, selectedPlanner.id]);
      toast.success(
        `Planner for ${selectedPlanner.employee.firstName} ${selectedPlanner.employee.lastName} has been closed successfully.`,
        {
          description: `Next year planner will be created for ${selectedPlanner.nextYearApplicable}`
        }
      );
      setIsModalOpen(false);
      setSelectedPlanner(null);
    }
  };

  const getReadyToCloseCount = () => {
    return sortedPlanners.filter(p => p.readyToClose).length;
  };

  return (
    <div className="space-y-4">
      {/* Summary Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-sm">
          {sortedPlanners.length} Planners Available
        </Badge>
        <Badge variant="default" className="text-sm">
          {getReadyToCloseCount()} Ready to Close
        </Badge>
      </div>

      {/* Search Filters */}
      <SearchFilters onFiltersChange={setFilters} />

      {/* Planners Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark/90">
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
                onClick={() => handleSort("employeeName")}
              >
                Employee Name
                {sortField === "employeeName" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                onClick={() => handleSort("location")}
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
              <TableHead 
                className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                onClick={() => handleSort("applicableYear")}
              >
                Applicable Year
                {sortField === "applicableYear" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-center text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlanners.map((planner) => (
              <TableRow key={planner.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-sm">{planner.employee.employeeCode}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {planner.employee.firstName} {planner.employee.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{planner.employee.email}</div>
                  </div>
                </TableCell>
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
                  <Badge variant="outline" className="text-sm">
                    {planner.applicableYear}
                  </Badge>
                </TableCell>
                <TableCell>
                  <PlannerStatusBadge readyToClose={planner.readyToClose} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button
                      variant={planner.readyToClose ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleClosePlanner(planner)}
                      disabled={!planner.readyToClose}
                      className="flex items-center space-x-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>Close Planner</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {sortedPlanners.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No planners found matching the selected criteria.</p>
          </div>
        )}
      </div>

      {/* Close Planner Modal */}
      {selectedPlanner && (
        <ClosePlannerModal
          planner={selectedPlanner}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlanner(null);
          }}
          onConfirm={handleConfirmClose}
        />
      )}
    </div>
  );
}
