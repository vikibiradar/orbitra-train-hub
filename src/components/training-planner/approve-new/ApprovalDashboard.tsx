import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSubmittedPlanners, mockExistingPlanners } from "@/data/mock-training-data";
import { PlannerStatus } from "@/types/training-planner";
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle 
} from "lucide-react";

interface ApprovalDashboardProps {
  onViewPending: () => void;
}

export const ApprovalDashboard = ({ onViewPending }: ApprovalDashboardProps) => {
  const submittedPlanners = getSubmittedPlanners();
  const approvedThisMonth = mockExistingPlanners.filter(p => 
    p.status === PlannerStatus.APPROVED && 
    p.approvedDate && 
    new Date(p.approvedDate).getMonth() === new Date().getMonth()
  ).length;
  
  const rejectedThisMonth = mockExistingPlanners.filter(p => 
    p.status === PlannerStatus.REJECTED && 
    p.submittedDate && 
    new Date(p.submittedDate).getMonth() === new Date().getMonth()
  ).length;

  // Calculate overdue (submitted more than 3 days ago)
  const overduePlanners = submittedPlanners.filter(p => {
    if (!p.submittedDate) return false;
    const submitDate = new Date(p.submittedDate);
    const daysDiff = (new Date().getTime() - submitDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff > 3;
  }).length;

  const kpiData = [
    {
      title: "Total Pending Approvals",
      value: submittedPlanners.length,
      change: "+2 from yesterday",
      changeType: "increase" as const,
      period: "Click to view list",
      icon: ClipboardCheck,
      color: "text-primary",
      bgColor: "bg-primary/10",
      clickable: true,
      onClick: onViewPending
    },
    {
      title: "Approved This Month",
      value: approvedThisMonth,
      change: "+3 from last month",
      changeType: "increase" as const,
      period: "Current month",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Rejected This Month",
      value: rejectedThisMonth,
      change: "Same as last month",
      changeType: "neutral" as const,
      period: "Current month",
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Overdue Approvals",
      value: overduePlanners,
      change: overduePlanners > 0 ? "Requires attention" : "All up to date",
      changeType: overduePlanners > 0 ? "decrease" as const : "neutral" as const,
      period: "> 3 days old",
      icon: AlertTriangle,
      color: overduePlanners > 0 ? "text-warning" : "text-muted-foreground",
      bgColor: overduePlanners > 0 ? "bg-warning/10" : "bg-muted/10"
    }
  ];

  return (
    <section>
      <h2 className="heading-secondary mb-6">Approval Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card 
            key={index} 
            className={`kpi-card ${kpi.clickable ? 'cursor-pointer hover:shadow-md' : ''}`}
            onClick={kpi.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {kpi.value}
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Badge 
                    variant={
                      kpi.changeType === "increase" ? "default" : 
                      kpi.changeType === "decrease" ? "destructive" : 
                      "secondary"
                    }
                    className="text-xs"
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {kpi.period}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};