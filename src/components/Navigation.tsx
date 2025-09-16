import { useState } from "react";
import { ChevronDown, User, Settings, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Training Planner",
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
    items: [
      "Internal Evaluation Update",
      "Plan Final Evaluation",
      "Final Evaluation Update"
    ]
  },
  {
    title: "Trainer",
    items: [
      "Accept Training",
      "Training Attendance and Rating",
      "Training Materials"
    ]
  },
  {
    title: "Surprise Audit",
    items: [
      "Generate Surprise Audit",
      "Update Surprise Audit"
    ]
  },
  {
    title: "Reports",
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
    items: [
      "UnLock (Unlock Records)",
      "Employee Planner Report",
      "Additional Controls",
      "Training Material (System reference)"
    ]
  },
  {
    title: "Master",
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
    items: [
      "Manage Email Templates",
      "View Email Notification"
    ]
  }
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Brand and Menu */}
          <div className="flex items-center">
            {/* Brand/Logo */}
            <div className="flex items-center space-x-3">
              <div className="ps-hero-gradient rounded-lg p-2">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">PS</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Orbitra AI</h1>
                <p className="text-sm text-muted-foreground">PS Training</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex ml-10 space-x-1">
              {menuItems.map((menu, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="menu-item text-foreground hover:text-primary hover:bg-accent px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                    >
                      <span>{menu.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-64 bg-white border shadow-lg z-50"
                  >
                    {menu.items.map((item, itemIndex) => (
                      <DropdownMenuItem
                        key={itemIndex}
                        className="text-sm cursor-pointer hover:bg-accent hover:text-primary px-3 py-2"
                      >
                        {item}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>

          {/* Right side - User Profile */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent">
                  <div className="w-8 h-8 ps-gradient-bg rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-foreground">Admin</p>
                    <p className="text-xs text-muted-foreground">Training Manager</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <div className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
            {menuItems.map((menu, index) => (
              <div key={index} className="py-2">
                <p className="font-medium text-primary mb-2">{menu.title}</p>
                <div className="pl-4 space-y-1">
                  {menu.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      className="block w-full text-left text-sm text-muted-foreground hover:text-primary py-1"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}