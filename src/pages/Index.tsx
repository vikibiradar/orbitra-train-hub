import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { KPICards } from "@/components/KPICards";
import { RecentEvents } from "@/components/RecentEvents";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopHeader />
        
        <div className="flex flex-1 w-full">
        
            {/* Main Content */}
            <main className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-8 space-y-8">
              {/* Welcome Banner Section */}
              <WelcomeBanner />
              
              {/* KPI Summary Cards */}
              <section>
                <h2 className="heading-secondary mb-6">Training Overview</h2>
                <KPICards />
              </section>
              
              {/* Recent Events Section 
              <section>
                <RecentEvents />
              </section> */}
            </main>
            
            <Footer />
           
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
