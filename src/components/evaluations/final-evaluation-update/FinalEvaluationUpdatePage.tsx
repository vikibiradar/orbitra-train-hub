import { useState } from "react";
import { ClipboardCheck, Users, Calendar, CheckCircle2 } from "lucide-react";
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
import { FinalEvaluationList } from "./FinalEvaluationList";
import { EvaluationCommentsModal } from "./EvaluationCommentsModal";
import { FinalResultModal } from "./FinalResultModal";
import { SearchFilters } from "./SearchFilters";
import { FinalEvaluationRecord } from "@/types/final-evaluation";
import { mockFinalEvaluationRecords } from "@/data/mock-final-evaluation-records";

export function FinalEvaluationUpdatePage() {
  const [selectedRecord, setSelectedRecord] = useState<FinalEvaluationRecord | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [evaluationRecords, setEvaluationRecords] = useState<FinalEvaluationRecord[]>(
    mockFinalEvaluationRecords
  );
  const [filteredRecords, setFilteredRecords] = useState<FinalEvaluationRecord[]>(
    mockFinalEvaluationRecords
  );

  // Get statistics (based on filtered records)
  const stats = {
    total: filteredRecords.length,
    pending: filteredRecords.filter(r => !r.isCompleted).length,
    completed: filteredRecords.filter(r => r.isCompleted).length,
    satisfactory: filteredRecords.filter(r => r.result === "Satisfactory").length,
  };

  const handleFilter = (filters: { location?: string; month?: Date }) => {
    let filtered = [...evaluationRecords];

    // Filter by location
    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter(r => r.location === filters.location);
    }

    // Filter by month (evaluation date month)
    if (filters.month) {
      const filterMonth = filters.month.getMonth();
      const filterYear = filters.month.getFullYear();
      filtered = filtered.filter(r => {
        const evalDate = new Date(r.evaluationDate);
        return evalDate.getMonth() === filterMonth && evalDate.getFullYear() === filterYear;
      });
    }

    setFilteredRecords(filtered);
  };

  const handleOpenCommentsModal = (record: FinalEvaluationRecord) => {
    setSelectedRecord(record);
    setIsCommentsModalOpen(true);
  };

  const handleOpenResultModal = (record: FinalEvaluationRecord) => {
    setSelectedRecord(record);
    setIsResultModalOpen(true);
  };

  const handleCommentsSaved = (updatedRecord: FinalEvaluationRecord) => {
    const updatedRecords = evaluationRecords.map(r => (r.id === updatedRecord.id ? updatedRecord : r));
    setEvaluationRecords(updatedRecords);
    setFilteredRecords(filteredRecords.map(r => (r.id === updatedRecord.id ? updatedRecord : r)));
    setIsCommentsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleResultSaved = (updatedRecord: FinalEvaluationRecord) => {
    const updatedRecords = evaluationRecords.map(r => (r.id === updatedRecord.id ? updatedRecord : r));
    setEvaluationRecords(updatedRecords);
    setFilteredRecords(filteredRecords.map(r => (r.id === updatedRecord.id ? updatedRecord : r)));
    setIsResultModalOpen(false);
    setSelectedRecord(null);
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
                    <BreadcrumbPage>Final Evaluation Update</BreadcrumbPage>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <Separator />

              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Final Evaluation Update
                  </h2>
                  <p className="text-muted-foreground">
                    Conduct final evaluations for new employee training planners
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                {/* Search Filters */}
                <SearchFilters onFilter={handleFilter} />

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-ps-primary">{stats.total}</div>
                      <p className="text-xs text-muted-foreground">Final evaluations scheduled</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending</CardTitle>
                      <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-warning">{stats.pending}</div>
                      <p className="text-xs text-muted-foreground">Awaiting evaluation</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completed</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">{stats.completed}</div>
                      <p className="text-xs text-muted-foreground">Evaluations completed</p>
                    </CardContent>
                  </Card>

                  <Card className="ps-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Satisfactory</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{stats.satisfactory}</div>
                      <p className="text-xs text-muted-foreground">Passed final evaluation</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Evaluation List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduled Final Evaluations</CardTitle>
                    <CardDescription>
                      Add panel member comments and final evaluation results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <FinalEvaluationList
                      records={filteredRecords}
                      onOpenComments={handleOpenCommentsModal}
                      onOpenResult={handleOpenResultModal}
                    />
                  </CardContent>
                </Card>
              </div>
            </main>

            <Footer />
          </SidebarInset>
        </div>
      </div>

      {/* Evaluation Comments Modal */}
      {selectedRecord && (
        <EvaluationCommentsModal
          isOpen={isCommentsModalOpen}
          onClose={() => {
            setIsCommentsModalOpen(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
          onSave={handleCommentsSaved}
        />
      )}

      {/* Final Result Modal */}
      {selectedRecord && (
        <FinalResultModal
          isOpen={isResultModalOpen}
          onClose={() => {
            setIsResultModalOpen(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
          onSave={handleResultSaved}
        />
      )}
    </SidebarProvider>
  );
}
