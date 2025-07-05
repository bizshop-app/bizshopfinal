import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import logoSvg from "../assets/logo.svg";

interface HeaderProps {
  onPricingClick: () => void;
  onSignUpClick: () => void;
}

export function Header({ onPricingClick, onSignUpClick }: HeaderProps) {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change header style using useEffect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerClasses = `fixed w-full z-50 transition-all duration-200 ${
    isScrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-sm'
  }`;

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <img src={logoSvg} alt="BizShop Logo" className="h-10 w-10 mr-2" />
                  <span className="text-2xl font-bold text-primary">BizShop</span>
                </div>
              </Link>
            </div>
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-8 items-center">
              <a 
                href="#features" 
                className="text-gray-600 hover:text-primary font-medium"
              >
                Features
              </a>
              <a 
                href="#templates" 
                className="text-gray-600 hover:text-primary font-medium"
              >
                Templates
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-primary font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  onPricingClick();
                }}
              >
                Pricing
              </a>
              <Link href="/demo">
                <span className="text-gray-600 hover:text-primary font-medium cursor-pointer">
                  Demo
                </span>
              </Link>
            </nav>
          </div>
          
          <div className="hidden sm:flex items-center">
            {user ? (
              <Link href="/dashboard">
                <Button variant="default" className="cursor-pointer">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <span className="px-4 py-2 text-gray-600 hover:text-primary font-medium cursor-pointer">
                    Log in
                  </span>
                </Link>
                <Button 
                  className="ml-2" 
                  onClick={onSignUpClick}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu */}
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a 
                    href="#features"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                  >
                    Features
                  </a>
                  <a 
                    href="#templates"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                  >
                    Templates
                  </a>
                  <a 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPricingClick();
                    }}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                  >
                    Pricing
                  </a>

                  
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    {user ? (
                      <Link href="/dashboard">
                        <Button className="w-full">Dashboard</Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/auth">
                          <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary cursor-pointer">
                            Log in
                          </span>
                        </Link>
                        <Button 
                          className="w-full mt-2" 
                          onClick={onSignUpClick}
                        >
                          Sign up
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
