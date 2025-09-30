import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { PlannerListView } from "./PlannerListView";
import { PlannerEditForm } from "./PlannerEditForm";
import { EnhancedTrainingPlanner } from "@/types/training-planner";
import Footer from "@/components/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export function EditEmployeePlannerPage() {
  const [selectedPlanner, setSelectedPlanner] = useState<EnhancedTrainingPlanner | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handlePlannerSelect = (planner: EnhancedTrainingPlanner) => {
    setSelectedPlanner(planner);
    setIsEditing(true);
  };

  const handleBack = () => {
    setSelectedPlanner(null);
    setIsEditing(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopHeader />
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1 space-y-4 p-4 md:p-6 pt-6">
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
                  <BreadcrumbPage>Edit Employee Planner</BreadcrumbPage>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <Separator />

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Edit Employee Planner
              </h1>
              <p className="text-muted-foreground">
                {isEditing 
                  ? `Editing planner for ${selectedPlanner?.employee.firstName} ${selectedPlanner?.employee.lastName}`
                  : "Select a training planner to edit"
                }
              </p>
            </div>

            {isEditing && selectedPlanner ? (
              <PlannerEditForm 
                planner={selectedPlanner}
                onBack={handleBack}
              />
            ) : (
              <PlannerListView onPlannerSelect={handlePlannerSelect} />
            )}
          </main>
        </div>
        <Footer />
      </div>
      
    </SidebarProvider>
  );
}