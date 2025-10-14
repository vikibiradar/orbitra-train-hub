import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
  ShieldCheck,
  FileText,
  GraduationCap,
  Database,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Training Planner",
    icon: BookOpen,
    items: [
      { title: "New Employee Planner", url: "/training-planner/new-employee" },
      { title: "Approve New Employee Planner", url: "/training-planner/approve-new" },
      { title: "Edit Employee Planner", url: "/training-planner/edit" },
      { title: "Annual Employee Planner", url: "/training-planner/annual" },
      { title: "Close Annual Employee Planner", url: "/training-planner/close-annual" },
      { title: "Print Planner", url: "/training-planner/print" },
      { title: "Copy Planner", url: "/training-planner/copy-planner" },
      { title: "Update Additional Training", url: "/training-planner/update-additional" },
    ],
  },
  {
    title: "Evaluations",
    icon: ClipboardCheck,
    items: [
      { title: "Internal Evaluation Update", url: "/evaluations/internal-evaluation" },
      { title: "Plan Final Evaluation", url: "/evaluations/plan-final-evaluation" },
      { title: "Final Evaluation Update", url: "/evaluations/final-evaluation" },
    ],
  },
  {
    title: "Trainer",
    icon: Users,
    items: [
      { title: "Accept Training", url: "/trainer/accept" },
      { title: "Training Attendance and Rating", url: "/trainer/attendance-rating" },
      { title: "Training Materials", url: "/trainer/materials" },
    ],
  },
  {
    title: "Surprise Audit",
    icon: ShieldCheck,
    items: [
      { title: "Generate Surprise Audit", url: "/surprise-audit/generate" },
      { title: "Update Surprise Audit", url: "/surprise-audit/update" },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    items: [
      { title: "Surprise Audit Report", url: "/reports/surprise-audit" },
      { title: "Training Planner Report", url: "/reports/training-planner" },
      { title: "Training Report", url: "/reports/training" },
      { title: "Training Topics Report", url: "/reports/training-topics" },
      { title: "Employee Reports", url: "/reports/employee" },
      { title: "Trainer Report", url: "/reports/trainer" },
    ],
  },
  {
    title: "TC Control",
    icon: Settings,
    items: [
      { title: "UnLock", url: "/tc-control/unlock" },
      { title: "Employee Planner Report", url: "/tc-control/employee-planner-report" },
      { title: "Additional Controls", url: "/tc-control/additional" },
      { title: "Training Material", url: "/tc-control/training-material" },
    ],
  },
  {
    title: "Master",
    icon: Database,
    items: [
      { title: "Scope", url: "/master/scope" },
      { title: "Scope & Department Mapping", url: "/master/scope-department" },
      { title: "Topic Module", url: "/master/topic-module" },
      { title: "Training Mode", url: "/master/training-mode" },
      { title: "Topic", url: "/master/topic" },
      { title: "Trainer Mapping", url: "/master/trainer-mapping" },
    ],
  },
  {
    title: "Access Management",
    icon: GraduationCap,
    items: [
      { title: "Topic & Scope Mapping", url: "/access-management/topic-scope" },
      { title: "Department & Panel Member Mapping", url: "/access-management/department-panel" },
    ],
  },
  {
    title: "Admin",
    icon: FileText,
    items: [
      { title: "Manage Email Templates", url: "/admin/email-templates" },
      { title: "View Email Notification", url: "/admin/email-notifications" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set());
  const collapsed = state === "collapsed";
  useEffect(() => {
    const activeGroups = new Set<string>();
    for (const group of menuItems) {
      if (group.items.some((item) => currentPath === item.url || currentPath.startsWith(item.url))) {
        activeGroups.add(group.title);
      }
    }
    setOpenGroups(activeGroups);
  }, [currentPath]);
  const isGroupActive = (group: (typeof menuItems)[0]) => {
    return group.items.some((item) => currentPath === item.url || currentPath.startsWith(item.url));
  };

  const isItemActive = (url: string) => currentPath === url;

  const toggleGroup = (groupTitle: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupTitle)) {
      newOpenGroups.delete(groupTitle);
    } else {
      newOpenGroups.add(groupTitle);
    }
    setOpenGroups(newOpenGroups);
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} bg-sidebar border-sidebar-border top-[72px] h-[calc(100svh-72px)]`}
    >
      <ScrollArea className="h-full">
        <SidebarContent className="py-4 bg-sidebar">
          <SidebarGroup>
            <SidebarMenu>
              {menuItems.map((group) => {
                const isOpen = openGroups.has(group.title);

                return (
                  <SidebarMenuItem key={group.title}>
                    <Collapsible open={isOpen} onOpenChange={() => toggleGroup(group.title)}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                          <div className="flex items-center gap-3">
                            <group.icon className="h-5 w-5" />
                            {!collapsed && <span className="font-medium">{group.title}</span>}
                          </div>
                          {!collapsed && (
                            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {group.items.map((item) => (
                              <SidebarMenuSubItem key={item.url}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={item.url}
                                    className={({ isActive }) =>
                                      `block w-full text-sm py-2 px-3 rounded-md transition-colors ${
                                        isActive
                                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                                          : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                      }`
                                    }
                                  >
                                    {item.title}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}
