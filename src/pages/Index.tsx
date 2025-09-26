import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { KPICards } from "@/components/KPICards";
import { RecentEvents } from "@/components/RecentEvents";
import Footer from "@/components/Footer";

const IndexContent = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarInset className={`flex flex-col ${collapsed ? 'ml-16' : 'ml-72'}`}>
      {/* Main Content */}
      <main className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-8 mt-[72px] space-y-8">
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
    </SidebarInset>
  );
};

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <TopHeader />
        
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <IndexContent />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
