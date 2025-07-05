import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Smartphone, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PaytmCheckoutProps {
  planId: string;
  planName: string;
  planPrice: number;
  planFeatures: string[];
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: any) => void;
}

export function PaytmCheckout({
  planId,
  planName,
  planPrice,
  planFeatures,
  onPaymentSuccess,
  onPaymentError
}: PaytmCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Create Paytm order
      const response = await apiRequest("POST", "/api/paytm/subscription", {
        planId,
        userId: 1 // This will be replaced with actual user ID from auth
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const { paytmParams, paytmURL } = await response.json();

      // Create a form and submit to Paytm
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paytmURL;

      // Add all Paytm parameters as hidden inputs
      Object.keys(paytmParams).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paytmParams[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error: any) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });

      if (onPaymentError) {
        onPaymentError(error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{planName}</CardTitle>
          <CardDescription>
            Complete your subscription with Paytm
          </CardDescription>
          <div className="text-3xl font-bold text-primary">
            ₹{planPrice}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-semibold">Plan Features:</h4>
            <ul className="space-y-1">
              {planFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <h4 className="font-semibold">Accepted Payment Methods:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                Cards
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                UPI
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Wallet className="h-3 w-3" />
                Paytm Wallet
              </Badge>
              <Badge variant="outline">Net Banking</Badge>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing...
              </>
            ) : (
              <>
                Pay ₹{planPrice} with Paytm
              </>
            )}
          </Button>

          {/* Demo Mode Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Demo Mode:</strong> This is a test environment. You can use Paytm's test credentials to complete the payment flow.
            </p>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Secured by Paytm. Your payment information is encrypted and secure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}