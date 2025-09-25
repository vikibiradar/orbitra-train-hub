import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { ApprovalDashboard } from "./ApprovalDashboard";
import { ApprovalListView } from "./ApprovalListView";
import Footer from "@/components/Footer";
import { useState } from "react";

export const ApproveNewEmployeePlannerPage = () => {
  const [showList, setShowList] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <TopHeader />
          
          {/* Main Content */}
          <main className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-8 space-y-8">
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
    </SidebarProvider>
  );
};