import { 
  BookOpen, 
  ClipboardCheck, 
  Users, 
  Search, 
  FileText, 
  Settings, 
  Database, 
  ShieldCheck 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

const menuItems = [
  {
    title: "Training Planner",
    icon: BookOpen,
    items: [
      "New Employee Planner",
      "Approve New Employee Planner", 
      "Edit Employee Planner",
      "Annual Employee Planner",
      "Close Annual Employee Planner",
      "Print Planner",
      "Update Additional Training"
    ]
  },
  {
    title: "Evaluations",
    icon: ClipboardCheck,
    items: [
      "Internal Evaluation Update",
      "Plan Final Evaluation",
      "Final Evaluation Update"
    ]
  },
  {
    title: "Trainer",
    icon: Users,
    items: [
      "Accept Training",
      "Training Attendance and Rating",
      "Training Materials"
    ]
  },
  {
    title: "Surprise Audit",
    icon: Search,
    items: [
      "Generate Surprise Audit",
      "Update Surprise Audit"
    ]
  },
  {
    title: "Reports",
    icon: FileText,
    items: [
      "Surprise Audit Report",
      "Training Planner Report",
      "Training Report (Training Planner/Attendance)",
      "Training Topics Report",
      "Employee Reports",
      "Trainer Report"
    ]
  },
  {
    title: "TC Control",
    icon: Settings,
    items: [
      "UnLock (Unlock Records)",
      "Employee Planner Report",
      "Additional Controls",
      "Training Material (System reference)"
    ]
  },
  {
    title: "Master",
    icon: Database,
    items: [
      "Scope",
      "Scope & Department Mapping",
      "Topic Module",
      "Training Mode",
      "Topic",
      "Trainer Mapping",
      "Access Management",
      "Topic & Scope Mapping",
      "Department & Panel Member Mapping"
    ]
  },
  {
    title: "Admin",
    icon: ShieldCheck,
    items: [
      "Manage Email Templates",
      "View Email Notification"
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar className="border-r border-ps-primary bg-ps-primary-dark text-white">
      <SidebarHeader className="p-4 border-b border-ps-primary">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-lg p-2">
            <div className="w-8 h-8 ps-gradient-bg rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">PS</span>
            </div>
          </div>
          {state !== "collapsed" && (
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white truncate">PS Training</h1>
              <p className="text-sm text-ps-primary-light truncate">Training Management System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menu, index) => (
                <Collapsible key={index} asChild defaultOpen>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={menu.title}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:bg-transparent">
                        <div className="flex items-center space-x-2 text-white hover:text-ps-primary-light">
                          <menu.icon className="h-4 w-4" />
                          {state !== "collapsed" && <span>{menu.title}</span>}
                        </div>
                        {state !== "collapsed" && <ChevronRight className="h-4 w-4 text-white transition-transform group-data-[state=open]:rotate-90" />}
                      </CollapsibleTrigger>
                    </SidebarMenuButton>
                    
                    {state !== "collapsed" && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {menu.items.map((item, itemIndex) => (
                            <SidebarMenuSubItem key={itemIndex}>
                              <SidebarMenuSubButton asChild>
                                <button className="w-full text-left text-sm text-ps-primary-light hover:bg-white/10 hover:text-white">
                                  {item}
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}