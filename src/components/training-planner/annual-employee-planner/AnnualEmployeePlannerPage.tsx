import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import Footer from "@/components/Footer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopHeader />
          
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
                <CardTitle className="text-2xl">Annual Employee Planner</CardTitle>
                <CardDescription>
                  Generate and manage annual training planners for employees
                </CardDescription>
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
    </SidebarProvider>
  );
}
