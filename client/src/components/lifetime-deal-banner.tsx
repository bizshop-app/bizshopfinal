import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface LifetimeDealBannerProps {
  onClose?: () => void;
  onPurchase?: () => void;
}

export function LifetimeDealBanner({ onClose, onPurchase }: LifetimeDealBannerProps) {
  const [spotsLeft, setSpotsLeft] = useState(7); // Mock for demo
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg sticky top-0 z-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="font-bold text-lg">Lifetime Deal</span>
              <Badge variant="secondary" className="bg-yellow-400 text-black font-bold">
                ₹1,499 Only
              </Badge>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-mono">
                  {timeLeft.hours.toString().padStart(2, '0')}:
                  {timeLeft.minutes.toString().padStart(2, '0')}:
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
              
              <Badge variant="destructive" className="bg-red-600 animate-pulse">
                Only {spotsLeft} spots left!
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm opacity-90">Save ₹1,389</div>
              <div className="text-xs line-through opacity-75">₹2,388/year</div>
            </div>
            
            <Button 
              onClick={onPurchase}
              variant="secondary" 
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
            >
              Claim Deal
            </Button>
            
            {onClose && (
              <Button 
                onClick={onClose}
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile layout */}
        <div className="md:hidden mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono">
              {timeLeft.hours.toString().padStart(2, '0')}:
              {timeLeft.minutes.toString().padStart(2, '0')}:
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
          
          <Badge variant="destructive" className="bg-red-600 animate-pulse">
            {spotsLeft} spots left!
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}