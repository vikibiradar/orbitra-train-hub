import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import tuvLogo from "@/assets/tuv-logo.png";

export function TopHeader() {
  return (
    <header className="h-16 shadow-lg shadow-blue-500/30 border-b bg-ps-primary-dark/90 backdrop-blur-sm px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <Link to="/" className="flex items-center space-x-3 ">
          <img src={tuvLogo} alt="TUV Logo" className="h-16 w-16" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white leading-tight">PS Training</h1>
            <p className="text-xs text-white leading-tight">Training Management System</p>
          </div>
        </Link>
      </div>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
            <div className="w-8 h-8 ps-gradient-bg rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-ps-primary-light">Training Manager</p>
            </div>
            <ChevronDown className="h-4 w-4 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
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
    </header>
  );
}