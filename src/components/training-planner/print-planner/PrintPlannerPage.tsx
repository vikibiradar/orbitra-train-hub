import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopHeader } from "@/components/TopHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/Footer";
import { EmployeeListView } from "./EmployeeListView";

export function PrintPlannerPage() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopHeader />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6 animate-fade-in">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/")}
                      className="hover:bg-muted"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Print Planner Employee List</h1>
                  <p className="text-muted-foreground mt-1">
                    Download training planner documents for approved employees
                  </p>
                </div>
              </div>

              {/* Employee List */}
              <div className="bg-card border rounded-lg shadow-sm">
                <EmployeeListView />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
