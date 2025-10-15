import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchFilters } from "./SearchFilters";
import { PlannerDetailsModal } from "./PlannerDetailsModal";
import { RejectReasonModal } from "./RejectReasonModal";
import { getSubmittedPlanners } from "@/data/mock-training-data";
import { TrainingPlanner } from "@/types/training-planner";
import { format } from "date-fns";
import { ArrowLeft, Eye, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApprovalListViewProps {
  onBackToDashboard: () => void;
}

interface FilterState {
  location?: string;
  joiningDateFrom?: string;
  joiningDateTo?: string;
}

export const ApprovalListView = ({ onBackToDashboard }: ApprovalListViewProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedPlanner, setSelectedPlanner] = useState<TrainingPlanner | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);

  const allPlanners = getSubmittedPlanners();
  
  // Filter planners based on search criteria
  const filteredPlanners = allPlanners.filter(planner => {
    if (filters.location && planner.employee.location.id !== filters.location) {
      return false;
    }
    
    if (filters.joiningDateFrom || filters.joiningDateTo) {
      const joiningDate = new Date(planner.employee.joiningDate);
      
      if (filters.joiningDateFrom && joiningDate < new Date(filters.joiningDateFrom)) {
        return false;
      }
      
      if (filters.joiningDateTo && joiningDate > new Date(filters.joiningDateTo)) {
        return false;
      }
    }
    
    return true;
  });

  // Sort planners
  const sortedPlanners = [...filteredPlanners].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aValue: any;
    let bValue: any;
    
    switch (sortConfig.key) {
      case 'employeeCode':
        aValue = a.employee.employeeCode;
        bValue = b.employee.employeeCode;
        break;
      case 'employeeName':
        aValue = `${a.employee.firstName} ${a.employee.lastName}`;
        bValue = `${b.employee.firstName} ${b.employee.lastName}`;
        break;
      case 'location':
        aValue = a.employee.location.name;
        bValue = b.employee.location.name;
        break;
      case 'joiningDate':
        aValue = new Date(a.employee.joiningDate);
        bValue = new Date(b.employee.joiningDate);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewDetails = (planner: TrainingPlanner) => {
    setSelectedPlanner(planner);
    setShowRejectModal(false);
    setShowDetailsModal(true);
  };

  const handleApprove = (planner: TrainingPlanner) => {
    toast({
      title: "Planner Approved",
      description: `Training planner for ${planner.employee.firstName} ${planner.employee.lastName} has been approved successfully.`,
    });
  };

  const handleReject = (planner: TrainingPlanner) => {
    // when rejecting from the list OR from details, keep selection and open reject modal
    setSelectedPlanner(planner);
    setShowDetailsModal(false); // hide details if it was open
    setShowRejectModal(true);   // show reject reason modal
  };

  const handleRejectConfirm = (reason: string) => {
    if (selectedPlanner) {
      toast({
        title: "Planner Rejected",
        description: `Training planner for ${selectedPlanner.employee.firstName} ${selectedPlanner.employee.lastName} has been rejected.`,
        variant: "destructive"
      });
    }
    setShowRejectModal(false);
    setSelectedPlanner(null); // clear after finishing
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onBackToDashboard}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {sortedPlanners.length} planners pending approval
          </Badge>
        </div>
      </div>

      {/* Search Filters */}
      <SearchFilters onFiltersChange={setFilters} />

      {/* Approval List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark/90">
                  <TableHead
                    className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                    onClick={() => handleSort('employeeCode')}
                  >
                    Employee Code
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                    onClick={() => handleSort('employeeName')}
                  >
                    Employee Name
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-white font-semibold"
                    onClick={() => handleSort('location')}
                  >
                    Location
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-ps-primary-dark/80 transition-colors text-right text-white font-semibold"
                    onClick={() => handleSort('joiningDate')}
                  >
                    Joining Date
                  </TableHead>
                  <TableHead className="text-center text-white font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlanners.map((planner) => (
                  <TableRow key={planner.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono">
                      {planner.employee.employeeCode}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {planner.employee.firstName} {planner.employee.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {planner.employee.department.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{planner.employee.location.name}</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(planner.employee.joiningDate), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleViewDetails(planner); }}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleApprove(planner); }}
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Approve</span>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleReject(planner); }}
                          className="flex items-center space-x-1"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Reject</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {sortedPlanners.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No planners found matching the selected criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedPlanner && (
        <>
          <PlannerDetailsModal
            planner={selectedPlanner}
            open={showDetailsModal}
            onClose={() => {
              // only hide the details modal; keep selection so reject modal can be shown next
              setShowDetailsModal(false);
            }}
            onApprove={handleApprove}
            onReject={handleReject}
          />

          <RejectReasonModal
            planner={selectedPlanner}
            open={showRejectModal}
            onClose={() => {
              // just close reject modal; keep selection (optional)
              setShowRejectModal(false);
            }}
            onConfirm={handleRejectConfirm}
          />
        </>
      )}
    </div>
  );
};