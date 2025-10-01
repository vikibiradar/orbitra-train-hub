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
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import tuvLogo from "@/assets/tuv-logo.png";
import "@/custom-style/CustomHeader-3.css";

export function TopHeader() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <header className="tuv-header sticky top-0 z-50 px-4 flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div 
          className="tuv-navbar-brand cursor-pointer"
          onClick={() => navigate('/')}
        >
          <motion.img
            src={tuvLogo}
            alt="TÜV SÜD ISPortal"
            style={{
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <div className="flex flex-col">
            <h1 className="tuv-brand-text font-bold leading-tight" style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
              PS Training
            </h1>
            <p className="text-[0.7rem] font-medium leading-tight" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Training Management System
            </p>
          </div>
        </div>
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