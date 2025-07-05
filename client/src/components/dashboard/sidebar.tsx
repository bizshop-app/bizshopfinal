import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  CreditCard,
  Users,
  LogOut,
  Grid3X3,
  Tag,
  Menu,
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const menuItems = [
    { 
      icon: <Home className="h-5 w-5" />, 
      label: "Dashboard", 
      href: "/dashboard" 
    },
    { 
      icon: <ShoppingBag className="h-5 w-5" />, 
      label: "Products", 
      href: "/products" 
    },
    { 
      icon: <Grid3X3 className="h-5 w-5" />, 
      label: "Categories", 
      href: "/categories" 
    },
    { 
      icon: <Package className="h-5 w-5" />, 
      label: "Orders", 
      href: "/orders" 
    },
    { 
      icon: <Tag className="h-5 w-5" />, 
      label: "Discounts", 
      href: "/discounts" 
    },
    { 
      icon: <BarChart3 className="h-5 w-5" />, 
      label: "Analytics", 
      href: "/analytics" 
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      label: "Customers", 
      href: "/customers" 
    },
    { 
      icon: <CreditCard className="h-5 w-5" />, 
      label: "Subscriptions", 
      href: "/subscriptions" 
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: "Settings", 
      href: "/settings" 
    },
  ];

  const adminMenuItems = user?.isAdmin ? [
    { 
      icon: <Users className="h-5 w-5" />, 
      label: "Admin Panel", 
      href: "/admin" 
    },
  ] : [];

  const sidebarContent = (
    <div className="h-full flex flex-col py-4">
      <div className="px-3 py-2">
        <Link href="/" className="flex items-center mb-8">
          <img src="/logo.svg" alt="BizShop" className="w-8 h-8 mr-3" />
          <span className="text-2xl font-bold text-primary">BizShop</span>
        </Link>
        
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                location === item.href 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-gray-600"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          
          {adminMenuItems.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-3"></div>
              {adminMenuItems.map((item, index) => (
                <Link 
                  key={`admin-${index}`} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                    location === item.href 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-gray-600"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
      
      <div className="mt-auto px-3">
        {user && (
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(user.fullName || user.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.fullName || user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex-col">
        {sidebarContent}
      </div>
      
      {/* Mobile header with hamburger menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          BizShop
        </Link>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
