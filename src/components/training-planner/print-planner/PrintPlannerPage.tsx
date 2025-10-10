import { useState } from "react";
import { ArrowLeft, Home, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopHeader } from "@/components/TopHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Footer from "@/components/Footer";
import { EmployeeListView } from "./EmployeeListView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PrintPlannerPage() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopHeader />

        <div className="flex flex-1 w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="container mx-auto p-6 space-y-6 animate-fade-in">
              {/* Breadcrumb Navigation */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Training Planner
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Print Planner</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
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
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
