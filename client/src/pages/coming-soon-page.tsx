import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, CheckCircle, Bell, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Calculate time until 2 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNotifyMe = () => {
    if (email) {
      toast({
        title: "Thank you!",
        description: "We'll notify you when live payments are ready.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary mb-4 inline-block">
            BizShop
          </Link>
          <Badge variant="outline" className="mb-4">
            <Clock className="w-3 h-3 mr-1" />
            Live Payments Coming Soon
          </Badge>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl mb-2">Payment System Launching Soon</CardTitle>
            <CardDescription className="text-base">
              Our Razorpay integration is under verification. Live payments will be available in:
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
            </div>

            {/* What's Available Now */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Available Right Now
              </h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Full platform demo and free trial</li>
                <li>• Complete store setup and customization</li>
                <li>• Product management and inventory</li>
                <li>• Test all subscription features</li>
              </ul>
            </div>

            {/* Email Notification */}
            <div className="space-y-3">
              <h3 className="font-semibold text-center">Get notified when live payments are ready</h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleNotifyMe} disabled={!email}>
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/subscription" className="flex-1">
                <Button className="w-full" size="lg">
                  Try Demo Version
                </Button>
              </Link>
              <Link href="/about" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Secure payments powered by Razorpay • SSL encrypted • 24/7 support</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}