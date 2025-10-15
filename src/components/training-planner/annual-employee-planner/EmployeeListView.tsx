import { useState, useMemo } from "react";
import { Search, ArrowUpDown, FileText, Clock, CheckCircle, XCircle, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAnnualEmployees } from "@/data/mock-training-data";
import { Employee, PlannerStatus } from "@/types/training-planner";
import { format } from "date-fns";

interface EmployeeListViewProps {
  onGeneratePlanner: (employee: Employee) => void;
}

export function EmployeeListView({ onGeneratePlanner }: EmployeeListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<'employeeCode' | 'firstName' | 'joiningDate'>('employeeCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Get unique locations and departments for filters
  const locations = useMemo(() => {
    const uniqueLocations = new Set(mockAnnualEmployees.map(emp => emp.location.name));
    return Array.from(uniqueLocations);
  }, []);

  const departments = useMemo(() => {
    const uniqueDepts = new Set(mockAnnualEmployees.map(emp => emp.department.name));
    return Array.from(uniqueDepts);
  }, []);

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = mockAnnualEmployees.filter(emp => {
      const matchesSearch = searchTerm === "" ||
        emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = locationFilter === "all" || emp.location.name === locationFilter;
      const matchesDepartment = departmentFilter === "all" || emp.department.name === departmentFilter;
      const matchesStatus = statusFilter === "all" || emp.plannerStatus === statusFilter;

      return matchesSearch && matchesLocation && matchesDepartment && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'firstName') {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, locationFilter, departmentFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: 'employeeCode' | 'firstName' | 'joiningDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case PlannerStatus.DRAFT:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Draft</Badge>;
      case PlannerStatus.SUBMITTED:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Approval Awaited</Badge>;
      case PlannerStatus.APPROVED:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved</Badge>;
      case PlannerStatus.REJECTED:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Not Scheduled</Badge>;
    }
  };

  const getActionButton = (employee: Employee) => {
    const status = employee.plannerStatus;

    if (!status || status === PlannerStatus.REJECTED) {
      return (
        <Button
          size="sm"
          onClick={() => onGeneratePlanner(employee)}
          className="flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>Generate Planner</span>
        </Button>
      );
    }

    if (status === PlannerStatus.DRAFT) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onGeneratePlanner(employee)}
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Draft</span>
        </Button>
      );
    }

    if (status === PlannerStatus.SUBMITTED) {
      return (
        <Button
          size="sm"
          variant="outline"
          disabled
          className="flex items-center space-x-2"
        >
          <Clock className="h-4 w-4" />
          <span>Approval Awaited</span>
        </Button>
      );
    }

    if (status === PlannerStatus.APPROVED) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onGeneratePlanner(employee)}
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Modify Planner</span>
        </Button>
      );
    }

    return null;
  };

  return (
    <Card className="ps-card">
      <CardContent className="p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={PlannerStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={PlannerStatus.SUBMITTED}>Approval Awaited</SelectItem>
              <SelectItem value={PlannerStatus.APPROVED}>Approved</SelectItem>
              <SelectItem value={PlannerStatus.REJECTED}>Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Employee List Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-ps-primary-dark hover:bg-ps-primary-dark/90">
                <TableHead className="text-white font-semibold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('employeeCode')}
                    className="flex items-center space-x-1 text-white hover:bg-ps-primary-dark/80"
                  >
                    <span>Employee Code</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-white font-semibold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('firstName')}
                    className="flex items-center space-x-1 text-white hover:bg-ps-primary-dark/80"
                  >
                    <span>Employee Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-white font-semibold">Department</TableHead>
                <TableHead className="text-white font-semibold">Location</TableHead>
                <TableHead className="text-white font-semibold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('joiningDate')}
                    className="flex items-center space-x-1 text-white hover:bg-ps-primary-dark/80"
                  >
                    <span>Joining Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-white font-semibold">Applicable Year</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-center text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{employee.employeeCode}</TableCell>
                    <TableCell className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.department.name}</Badge>
                    </TableCell>
                    <TableCell>{employee.location.name}</TableCell>
                    <TableCell>{format(new Date(employee.joiningDate), "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-right font-mono">{employee.applicableYear}</TableCell>
                    <TableCell>{getStatusBadge(employee.plannerStatus)}</TableCell>
                    <TableCell className="text-center">
                      {getActionButton(employee)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No employees found matching the criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredEmployees.length} of {mockAnnualEmployees.length} employees
        </div>
      </CardContent>
    </Card>
  );
}
