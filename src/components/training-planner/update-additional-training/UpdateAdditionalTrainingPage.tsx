import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { SearchSection } from "./SearchSection";
import { TrainingResultsTable } from "./TrainingResultsTable";
import { AddTrainingModal, TrainingType } from "./AddTrainingModal";
import Footer from "@/components/Footer";
import { TrainingPlanner } from "@/types/training-planner";

export function UpdateAdditionalTrainingPage() {
  const [searchResults, setSearchResults] = useState<TrainingPlanner[]>([]);
  const [selectedPlanner, setSelectedPlanner] = useState<TrainingPlanner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainingType, setTrainingType] = useState<TrainingType>("Induction");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (results: TrainingPlanner[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleAddTraining = (planner: TrainingPlanner, type: TrainingType) => {
    setSelectedPlanner(planner);
    setTrainingType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlanner(null);
  };

  const handleTrainingSaved = () => {
    // Refresh the search results or update the UI
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
                      <BreadcrumbLink href="#">Training Planner</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>Update Additional Training</BreadcrumbPage>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <Separator />

              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Update Additional Training
                  </h2>
                  <p className="text-muted-foreground">
                    Search and add additional training for employees
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                {/* Search Section */}
                <Card className="ps-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Search Employee
                    </CardTitle>
                    <CardDescription>
                      Search by Employee Name, Employee ID, or Planner Number
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SearchSection onSearch={handleSearch} />
                  </CardContent>
                </Card>

                {/* Results Section */}
                {hasSearched && (
                  <Card className="ps-card">
                    <CardHeader>
                      <CardTitle>
                        Search Results
                        {searchResults.length > 0 && (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found)
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Click "Add Training" buttons to add additional training for the employee
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {searchResults.length > 0 ? (
                        <TrainingResultsTable 
                          results={searchResults} 
                          onAddTraining={handleAddTraining}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Search className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            No Results Found
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-md">
                            No matching planners found. Please try a different search term.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </main>
            
            <Footer />
          </SidebarInset>
        </div>
      </div>

      {/* Add Training Modal */}
      {selectedPlanner && (
        <AddTrainingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          planner={selectedPlanner}
          trainingType={trainingType}
          onSave={handleTrainingSaved}
        />
      )}
    </SidebarProvider>
  );
}
