import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { ApprovalDashboard } from "./ApprovalDashboard";
import { ApprovalListView } from "./ApprovalListView";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export const ApproveNewEmployeePlannerPage = () => {
  const [showList, setShowList] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopHeader />
        
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            {/* Main Content */}
            <main className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-8 space-y-8">
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
                    <BreadcrumbPage>Approve New Employee Planner</BreadcrumbPage>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <Separator />

              {/* Page Header */}
              <section>
                <h1 className="heading-primary">Approve New Employee Planner</h1>
                <p className="text-muted-foreground mt-2">
                  Review and approve training planners submitted by Training Managers
                </p>
              </section>

              {!showList ? (
                <ApprovalDashboard onViewPending={() => setShowList(true)} />
              ) : (
                <ApprovalListView onBackToDashboard={() => setShowList(false)} />
              )}
            </main>
            
            <Footer />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};