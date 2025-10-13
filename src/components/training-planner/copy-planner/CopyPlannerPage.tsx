import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SourcePlannerSelector } from "./SourcePlannerSelector";
import { EmployeeTypeSelector } from "./EmployeeTypeSelector";
import { TargetEmployeeSelector } from "./TargetEmployeeSelector";
import { PlannerTopicsDisplay } from "./PlannerTopicsDisplay";
import { TrainingPlanner, TrainingPlannerTopic } from "@/types/training-planner";
import Footer from "@/components/Footer";

export function CopyPlannerPage() {
  const { toast } = useToast();
  const [selectedSourcePlanner, setSelectedSourcePlanner] = useState<TrainingPlanner | null>(null);
  const [employeeType, setEmployeeType] = useState<"New" | "Annual" | "">("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [showPlannerDetails, setShowPlannerDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShowPlanner = () => {
    // Validation 1: Check if source planner is selected
    if (!selectedSourcePlanner) {
      toast({
        title: "Validation Error",
        description: "Please select Source Planner",
        variant: "destructive",
      });
      return;
    }

    // Validation 2: Check if employee type is selected
    if (!employeeType) {
      toast({
        title: "Validation Error",
        description: "Please select employee Type",
        variant: "destructive",
      });
      return;
    }

    // Show the planner details
    setShowPlannerDetails(true);
  };

  const handleCopyPlanner = async () => {
    // Validation 1: Check if source planner is selected
    if (!selectedSourcePlanner) {
      toast({
        title: "Validation Error",
        description: "Please select Source Planner",
        variant: "destructive",
      });
      return;
    }

    // Validation 2: Check if employee type is selected
    if (!employeeType) {
      toast({
        title: "Validation Error",
        description: "Please select employee Type",
        variant: "destructive",
      });
      return;
    }

    // Validation 3: Check if employee is selected
    if (!selectedEmployeeId) {
      toast({
        title: "Validation Error",
        description: "Please select employee",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call for copying planner
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock the copy operation
      const currentDate = new Date().toISOString().split("T")[0];
      
      // Get employee name (mock - in real scenario, fetch from selectedEmployeeId)
      const employeeName = "Selected Employee"; // Replace with actual employee name

      toast({
        title: "Success",
        description: `Planner Copied Successfully for ${employeeName}`,
      });

      // Reset form after successful copy
      setSelectedSourcePlanner(null);
      setEmployeeType("");
      setSelectedEmployeeId("");
      setShowPlannerDetails(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Problem in Copy Planner.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedSourcePlanner(null);
    setEmployeeType("");
    setSelectedEmployeeId("");
    setShowPlannerDetails(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopHeader />
        
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <main className="flex-1 space-y-6 p-6">
              {/* Breadcrumb Navigation */}
              <Breadcrumb>
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
                    <BreadcrumbPage>Copy Planner</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Copy Planner</h1>
                <p className="text-muted-foreground">
                  Copy an existing training planner to a new or annual employee
                </p>
              </div>

              {/* Selection Form */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Select Source and Target</CardTitle>
                  <CardDescription>
                    Choose the source planner to copy and the target employee
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Horizontal Grid Layout for Selectors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Source Planner Selection */}
                    <SourcePlannerSelector
                      selectedPlanner={selectedSourcePlanner}
                      onPlannerSelect={setSelectedSourcePlanner}
                    />

                    {/* Employee Type Selection */}
                    <EmployeeTypeSelector
                      employeeType={employeeType}
                      onEmployeeTypeChange={(type) => {
                        setEmployeeType(type);
                        setSelectedEmployeeId(""); // Reset employee selection when type changes
                        setShowPlannerDetails(false); // Hide planner details
                      }}
                    />

                    {/* Target Employee Selection - Only show if employee type is selected */}
                    {employeeType && (
                      <TargetEmployeeSelector
                        employeeType={employeeType}
                        selectedEmployeeId={selectedEmployeeId}
                        onEmployeeSelect={setSelectedEmployeeId}
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      onClick={handleShowPlanner}
                      disabled={!selectedSourcePlanner}
                      className="flex-1"
                      variant="outline"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Show Planner
                    </Button>

                    <Button
                      onClick={handleReset}
                      variant="ghost"
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Planner Topics Display - Only visible after clicking Show Planner */}
              {showPlannerDetails && selectedSourcePlanner && (
                <div className="space-y-4 animate-fade-in">
                  <PlannerTopicsDisplay planner={selectedSourcePlanner} />

                  {/* Copy Planner Button - Only visible when planner details are shown */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCopyPlanner}
                      disabled={isProcessing || !selectedEmployeeId}
                      className="min-w-[200px]"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {isProcessing ? "Copying..." : "Copy Planner"}
                    </Button>
                  </div>
                </div>
              )}
            </main>
            
            <Footer />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
