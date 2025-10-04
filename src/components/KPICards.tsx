import { 
  BookOpen, 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";

const kpiData = [
  {
    title: "Total Trainings Planned",
    value: "7,101",
    change: "+12%",
    changeType: "increase" as const,
    period: "vs last quarter",
    icon: BookOpen,
    color: "bg-gradient-to-br from-blue-500 to-blue-600"
  },
  {
    title: "Active Trainings",
    value: "23",
    change: "+3",
    changeType: "increase" as const,
    period: "from yesterday",
    icon: Clock,
    color: "bg-gradient-to-br from-green-500 to-green-600"
  },
  {
    title: "Completed Reports",
    value: "67",
    change: "+15%",
    changeType: "increase" as const,
    period: "this month",
    icon: FileText,
    color: "bg-gradient-to-br from-purple-500 to-purple-600"
  },
  {
    title: "Pending Approvals",
    value: "8",
    change: "-2",
    changeType: "decrease" as const,
    period: "from yesterday",
    icon: AlertCircle,
    color: "bg-gradient-to-br from-orange-500 to-orange-600"
  },
  {
    title: "Events This Week",
    value: "15",
    change: "+5%",
    changeType: "increase" as const,
    period: "vs last week",
    icon: Calendar,
    color: "bg-gradient-to-br from-teal-500 to-teal-600"
  }
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="kpi-card p-6 hover:ps-glow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {kpi.title}
              </p>
              <p className="text-3xl font-bold text-foreground mb-1">
                {kpi.value}
              </p>
              <div className="flex items-center space-x-1">
                <TrendingUp 
                  className={`h-3 w-3 ${
                    kpi.changeType === 'increase' 
                      ? 'text-green-600' 
                      : 'text-red-600 rotate-180'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium ${
                    kpi.changeType === 'increase' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {kpi.period}
                </span>
              </div>
            </div>
            <div className={`kpi-icon ${kpi.color}`}>
              <kpi.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}