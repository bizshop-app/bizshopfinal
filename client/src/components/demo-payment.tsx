import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DemoPaymentProps {
  planName: string;
  planPrice: number;
  planFeatures: string[];
  planId: string;
  onPaymentSuccess?: (paymentData: any) => void;
}

export function DemoPayment({
  planName,
  planPrice,
  planFeatures,
  planId,
  onPaymentSuccess,
}: DemoPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDemoPayment = async () => {
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment - activate subscription directly
      const response = await apiRequest("POST", "/api/subscription/create", { 
        planId: planId 
      });
      
      const data = await response.json();
      
      if (data.success || data.user) {
        toast({
          title: "Demo Subscription Activated!",
          description: `Welcome to ${planName}! Your demo subscription is now active.`,
        });
        
        // Refresh user data
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        onPaymentSuccess?.(data);
      }
    } catch (error: any) {
      toast({
        title: "Demo Activation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <Clock className="h-6 w-6 text-orange-600" />
        </div>
        <CardTitle>Demo Mode</CardTitle>
        <CardDescription>
          Razorpay verification in progress. Try the demo subscription to explore all features.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{planName}</span>
            <span className="font-bold">₹{planPrice.toLocaleString()}</span>
          </div>
          
          <ul className="space-y-1 text-sm text-muted-foreground">
            {planFeatures.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleDemoPayment}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Activating Demo...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Try Demo Subscription
              </>
            )}
          </Button>

          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Razorpay verification: 1-2 business days
            </Badge>
            
            <p className="text-xs text-muted-foreground">
              Demo mode allows full access to test features. Real payments will be enabled once Razorpay approves.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}