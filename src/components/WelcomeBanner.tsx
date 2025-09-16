import { Calendar, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export function WelcomeBanner() {
  return (
    <div className="ps-hero-gradient rounded-xl p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left side - Avatar and Welcome */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            A
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, Admin!</h2>
            <p className="text-white/90 text-lg">
              Here's what's happening with your training today
            </p>
          </div>
        </div>

        {/* Right side - Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today's Tasks */}
          <Card className="bg-white/15 border-white/20 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Today's Tasks</p>
                <p className="text-white text-2xl font-bold">12</p>
                <p className="text-white/70 text-sm">Active</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Weekly Progress */}
          <Card className="bg-white/15 border-white/20 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Weekly Progress</p>
                <p className="text-white text-2xl font-bold">85%</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-300" />
                  <p className="text-green-300 text-xs">+5% from last week</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}