import { useState } from "react";
import { Calendar, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import Footer from "@/components/Footer";
import { SearchFilters } from "./SearchFilters";
import { EligibleEmployeesList } from "./EligibleEmployeesList";
import { PlanFinalEvaluationModal } from "./PlanFinalEvaluationModal";
import { mockEligibleEmployees } from "@/data/mock-final-evaluation-data";
import { EvaluationPlanner } from "@/types/evaluation";

export function PlanFinalEvaluationPage() {
  const [filteredEmployees, setFilteredEmployees] = useState(mockEligibleEmployees);
  const [selectedEmployees, setSelectedEmployees] = useState<EvaluationPlanner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get statistics
  const stats = {
    eligible: mockEligibleEmployees.length,
    selected: selectedEmployees.length,
    departments: new Set(mockEligibleEmployees.map(e => e.employee.department.name)).size,
    locations: new Set(mockEligibleEmployees.map(e => e.employee.location.name)).size,
  };

  const handleFilter = (filters: {
    location?: string;
    department?: string;
    searchTerm?: string;
  }) => {
    let filtered = [...mockEligibleEmployees];

    if (filters.location) {
      filtered = filtered.filter(emp => emp.employee.location.id === filters.location);
    }

    if (filters.department) {
      filtered = filtered.filter(emp => emp.employee.department.id === filters.department);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        emp =>
          emp.employee.firstName.toLowerCase().includes(term) ||
          emp.employee.lastName.toLowerCase().includes(term) ||
          emp.employee.employeeCode.toLowerCase().includes(term)
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleEmployeeSelection = (planner: EvaluationPlanner, selected: boolean) => {
    if (selected) {
      setSelectedEmployees(prev => [...prev, planner]);
    } else {
      setSelectedEmployees(prev => prev.filter(p => p.id !== planner.id));
    }
  };

  const handlePlanEvaluation = () => {
    if (selectedEmployees.length === 0) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEvaluationPlanned = () => {
    setIsModalOpen(false);
    setSelectedEmployees([]);
    // In real app, refresh the list
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopHeader />

        <div className="flex flex-1 w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center space-x-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Evaluations</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>Plan Final Evaluation</BreadcrumbPage>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <Separator />

              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Plan Final Evaluation
                  </h2>
                  <p className="text-muted-foreground">
                    Nominate employees for final evaluation and schedule evaluation sessions
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Eligible Employees</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-ps-primary">{stats.eligible}</div>
                      <p className="text-xs text-muted-foreground">Ready for final evaluation</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Selected</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-warning">{stats.selected}</div>
                      <p className="text-xs text-muted-foreground">Employees selected</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Departments</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{stats.departments}</div>
                      <p className="text-xs text-muted-foreground">Departments involved</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Locations</CardTitle>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-destructive">{stats.locations}</div>
                      <p className="text-xs text-muted-foreground">Locations involved</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filters */}
                <SearchFilters onFilter={handleFilter} />

                {/* Employee List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Eligible Employees</CardTitle>
                    <CardDescription>
                      Select employees to nominate for final evaluation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <EligibleEmployeesList
                      employees={filteredEmployees}
                      selectedEmployees={selectedEmployees}
                      onEmployeeSelect={handleEmployeeSelection}
                      onPlanEvaluation={handlePlanEvaluation}
                    />
                  </CardContent>
                </Card>
              </div>
            </main>

            <Footer />
          </SidebarInset>
        </div>
      </div>

      {/* Plan Evaluation Modal */}
      {isModalOpen && (
        <PlanFinalEvaluationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedEmployees={selectedEmployees}
          onSave={handleEvaluationPlanned}
        />
      )}
    </SidebarProvider>
  );
}
