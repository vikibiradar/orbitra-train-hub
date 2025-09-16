import { Navigation } from "@/components/Navigation";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { KPICards } from "@/components/KPICards";
import { RecentEvents } from "@/components/RecentEvents";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-8 space-y-8">
        {/* Welcome Banner Section */}
        <WelcomeBanner />
        
        {/* KPI Summary Cards */}
        <section>
          <h2 className="heading-secondary mb-6">Training Overview</h2>
          <KPICards />
        </section>
        
        {/* Recent Events Section */}
        <section>
          <RecentEvents />
        </section>
      </main>
    </div>
  );
};

export default Index;
