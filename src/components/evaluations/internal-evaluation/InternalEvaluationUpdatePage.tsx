import { useState } from "react";
import { ClipboardCheck, Users, Calendar, AlertCircle } from "lucide-react";
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
import { EvaluationPlannerList } from "./EvaluationPlannerList";
import { EvaluationModal } from "./EvaluationModal";
import { EvaluationPlanner, EvaluationStage } from "@/types/evaluation";
import { mockEvaluationPlanners } from "@/data/mock-evaluation-data";

export function InternalEvaluationUpdatePage() {
  const [selectedPlanner, setSelectedPlanner] = useState<EvaluationPlanner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get statistics
  const stats = {
    pending1st: mockEvaluationPlanners.filter(
      (p) => p.currentEvaluationStage === EvaluationStage.FIRST && p.canEvaluate,
    ).length,
    pending2nd: mockEvaluationPlanners.filter(
      (p) => p.currentEvaluationStage === EvaluationStage.SECOND && p.canEvaluate,
    ).length,
    pending3rd: mockEvaluationPlanners.filter(
      (p) => p.currentEvaluationStage === EvaluationStage.THIRD && p.canEvaluate,
    ).length,
    total: mockEvaluationPlanners.filter((p) => p.canEvaluate).length,
  };

  const handleEvaluate = (planner: EvaluationPlanner) => {
    setSelectedPlanner(planner);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlanner(null);
  };

  const handleEvaluationSaved = () => {
    setIsModalOpen(false);
    setSelectedPlanner(null);
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
                    <BreadcrumbPage>Internal Evaluation Update</BreadcrumbPage>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <Separator />

              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Internal Evaluation Update</h2>
                  <p className="text-muted-foreground">
                    Manage and conduct internal evaluations for approved training planners
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">1st Evaluation</CardTitle>
                      <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-ps-primary">{stats.pending1st}</div>
                      <p className="text-xs text-muted-foreground">Pending first evaluation</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">2nd Evaluation</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-warning">{stats.pending2nd}</div>
                      <p className="text-xs text-muted-foreground">Pending second evaluation</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">3rd Evaluation</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{stats.pending3rd}</div>
                      <p className="text-xs text-muted-foreground">Pending third evaluation</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-destructive">{stats.total}</div>
                      <p className="text-xs text-muted-foreground">Total evaluations pending</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Planner List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Training Planners for Evaluation</CardTitle>
                    <CardDescription>Select a planner to conduct internal evaluation</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <EvaluationPlannerList onEvaluate={handleEvaluate} />
                  </CardContent>
                </Card>
              </div>
            </main>

            <Footer />
          </SidebarInset>
        </div>
      </div>

      {/* Evaluation Modal */}
      {selectedPlanner && (
        <EvaluationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          planner={selectedPlanner}
          onSave={handleEvaluationSaved}
        />
      )}
    </SidebarProvider>
  );
}
