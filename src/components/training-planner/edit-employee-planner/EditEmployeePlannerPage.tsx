import { useState } from "react";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { PlannerListView } from "./PlannerListView";
import { PlannerEditForm } from "./PlannerEditForm";
import { EnhancedTrainingPlanner } from "@/types/training-planner";

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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopHeader />
          <main className="flex-1 space-y-4 p-4 md:p-6 pt-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isEditing ? "Edit Employee Planner" : "Edit Employee Planner"}
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}