import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  Settings,
  Users,
  LogOut,
  BarChart3,
  FileText,
  Building2,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar = ({ collapsed = false, onToggle = () => {} }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const location = useLocation();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle();
  };

  const navItems: NavItem[] = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { icon: <BarChart3 size={20} />, label: "Analytics", path: "/analytics" },
    { icon: <Users size={20} />, label: "Users", path: "/users" },
    { icon: <Building2 size={20} />, label: "Cuarteles", path: "/cuarteles" },
    { icon: <FileText size={20} />, label: "Reports", path: "/reports" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={`h-screen bg-background border-r transition-all duration-300 flex flex-col ${isCollapsed ? "w-[70px]" : "w-[280px]"}`}
    >
      {/* Logo and collapse button */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <div className="font-bold text-xl">AppName</div>}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className={`${isCollapsed ? "ml-auto mr-auto" : "ml-auto"}`}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <Separator />

      {/* Navigation Links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center p-2 rounded-md hover:bg-accent transition-colors ${isActive ? "bg-accent" : ""}`}
                      >
                        <span className="text-foreground">{item.icon}</span>
                        {!isCollapsed && (
                          <span className="ml-3 text-sm">{item.label}</span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* User Profile Section */}
      <div className="p-4">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}
              >
                <Avatar>
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                    alt="User"
                  />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">User Name</p>
                    <p className="text-xs text-muted-foreground truncate">
                      user@example.com
                    </p>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="flex flex-col">
                <span className="font-medium">User Name</span>
                <span className="text-xs text-muted-foreground">
                  user@example.com
                </span>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        )}

        {isCollapsed && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full mt-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
