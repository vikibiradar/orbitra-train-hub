import { useState } from "react";
import { ArrowLeft, Users, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { EmployeeListView } from "./EmployeeListView";
import { PlannerForm } from "./PlannerForm";
import { Employee, PlannerType, PlannerTypeType } from "@/types/training-planner";

type ViewMode = "list" | "create-general";

export function NewEmployeePlannerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPlannerType, setSelectedPlannerType] = useState<PlannerTypeType>(PlannerType.GENERAL_NEW_EMPLOYEE);

  const handleCreatePlanner = (employee: Employee, type: "general") => {
    setSelectedEmployee(employee);
    setSelectedPlannerType(PlannerType.GENERAL_NEW_EMPLOYEE);
    setViewMode("create-general");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedEmployee(null);
  };

  const handlePlannerSaved = () => {
    // Handle successful save/submit
    setViewMode("list");
    setSelectedEmployee(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <TopHeader />
          
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
              <BreadcrumbLink href="#">Training Planner</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>New Employee Planner</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Separator />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {viewMode === "list" ? "New Employee Planner" : "Create Training Planner"}
          </h2>
          <p className="text-muted-foreground">
            {viewMode === "list" 
              ? "Manage training planners for new employees" 
              : `Creating ${getPlannerTypeLabel(selectedPlannerType)} for ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`
            }
          </p>
        </div>
        
        {viewMode !== "list" && (
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {viewMode === "list" ? (
          <>
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="ps-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-ps-primary">6</div>
                  <p className="text-xs text-muted-foreground">
                    Employees awaiting planner
                  </p>
                </CardContent>
              </Card>
              
              <Card className="ps-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Draft Planners</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">3</div>
                  <p className="text-xs text-muted-foreground">
                    Planners in draft state
                  </p>
                </CardContent>
              </Card>
              
              <Card className="ps-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">2</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting TI approval
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Employee List */}
            <Card className="ps-card">
              <CardHeader>
                <CardTitle>New Employees</CardTitle>
                <CardDescription>
                  Click "Create Planner" to start creating a training plan for any employee
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <EmployeeListView onCreatePlanner={handleCreatePlanner} />
              </CardContent>
            </Card>
          </>
        ) : (
          /* Planner Creation Form */
          <Card className="ps-card">
            <CardContent className="p-6">
              <PlannerForm
                employee={selectedEmployee!}
                plannerType={selectedPlannerType}
                onSave={handlePlannerSaved}
                onSubmit={handlePlannerSaved}
                onCancel={handleBackToList}
              />
            </CardContent>
          </Card>
        )}
      </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function getPlannerTypeLabel(type: PlannerTypeType): string {
  switch (type) {
    case PlannerType.GENERAL_NEW_EMPLOYEE:
      return "General Planner";
    case PlannerType.SCOPE_NEW_EMPLOYEE:
      return "Scope-Based Planner";
    case PlannerType.GENERAL_SCOPE_NEW_EMPLOYEE:
      return "General + Scope Planner";
    default:
      return "Training Planner";
  }
}