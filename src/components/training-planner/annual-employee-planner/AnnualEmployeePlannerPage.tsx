import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import Footer from "@/components/Footer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Employee } from "@/types/training-planner";
import { EmployeeListView } from "./EmployeeListView";
import { AnnualPlannerForm } from "./AnnualPlannerForm";

export function AnnualEmployeePlannerPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');

  const handleGeneratePlanner = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewMode('form');
  };

  const handleBackToList = () => {
    setSelectedEmployee(null);
    setViewMode('list');
  };

  const handleSave = () => {
    // After save, return to list
    handleBackToList();
  };

  const handleSubmit = () => {
    // After submit, return to list
    handleBackToList();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopHeader />
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <main className="flex-1 p-6 bg-background">
              {/* Breadcrumb */}
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>Training Planner</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Annual Employee Planner</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <Card className="mb-6 ps-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Annual Employee Planner</CardTitle>
                      <CardDescription>
                        Generate and manage annual training planners for employees
                      </CardDescription>
                    </div>
                    {viewMode === 'form' && (
                      <Button variant="outline" onClick={handleBackToList}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to List
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Content Area */}
              {viewMode === 'list' ? (
                <EmployeeListView onGeneratePlanner={handleGeneratePlanner} />
              ) : (
                selectedEmployee && (
                  <AnnualPlannerForm
                    employee={selectedEmployee}
                    onSave={handleSave}
                    onSubmit={handleSubmit}
                    onCancel={handleBackToList}
                  />
                )
              )}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
