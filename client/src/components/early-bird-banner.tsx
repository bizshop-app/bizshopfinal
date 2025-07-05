import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, X, Users, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EARLY_BIRD_OFFER, calculateSavings, isOfferValid } from "@shared/early-bird-offer";

interface EarlyBirdBannerProps {
  onClose?: () => void;
  onPurchase?: () => void;
  showCloseButton?: boolean;
}

export function EarlyBirdBanner({ onClose, onPurchase, showCloseButton = true }: EarlyBirdBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const { data: offerStats } = useQuery({
    queryKey: ["/api/early-bird/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const spotsLeft = offerStats?.spotsRemaining || EARLY_BIRD_OFFER.spotsRemaining;
  const totalSpots = EARLY_BIRD_OFFER.totalSpots;
  const savings = calculateSavings();

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = EARLY_BIRD_OFFER.validUntil.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOfferValid() || spotsLeft <= 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg sticky top-0 z-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-300 animate-pulse" />
              <span className="font-bold text-lg">Early Bird Special</span>
              <Badge variant="secondary" className="bg-yellow-400 text-black font-bold">
                ₹1,499 Only
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                Save ₹{savings.toLocaleString()}
              </Badge>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  Only <span className="font-bold">{spotsLeft}</span> of {totalSpots} spots left
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <div className="flex gap-1 text-sm font-mono">
                  <span>{timeLeft.days}d</span>
                  <span>{timeLeft.hours}h</span>
                  <span>{timeLeft.minutes}m</span>
                  <span>{timeLeft.seconds}s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={onPurchase}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold"
            >
              <Zap className="h-4 w-4 mr-1" />
              Claim Now
            </Button>
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile view for stats */}
        <div className="md:hidden mt-2 flex justify-between text-sm">
          <span>{spotsLeft} of {totalSpots} spots left</span>
          <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left</span>
        </div>
      </CardContent>
    </Card>
  );
}