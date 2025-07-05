import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RazorpayCheckout } from "@/components/payment/razorpay-checkout";
import { 
  CreditCard, 
  Check, 
  Star, 
  Zap,
  Crown,
  Calendar,
  IndianRupee
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { SUBSCRIPTION_PLANS } from "@shared/subscription-plans";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "Plan Selected",
      description: "Please proceed with payment to upgrade your subscription.",
    });
  };

  // Use the shared subscription plans with additional UI metadata
  const plans = SUBSCRIPTION_PLANS.map(plan => ({
    ...plan,
    price: plan.priceInr,
    icon: plan.id === "free" ? <Star className="h-6 w-6" /> : 
          plan.id === "basic" ? <Zap className="h-6 w-6" /> : 
          <Crown className="h-6 w-6" />
  }));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getCurrentPlan = () => {
    return plans.find(plan => plan.id === user?.subscriptionPlan) || plans[0];
  };

  const handlePaymentSuccess = (paymentData: any) => {
    toast({
      title: "Subscription Updated!",
      description: "Your plan has been successfully upgraded.",
    });
    setSelectedPlan(null);
    // Refresh user data or redirect to dashboard
    window.location.reload();
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    setSelectedPlan(null);
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 pt-16 md:pt-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
            <p className="text-muted-foreground">
              Choose the perfect plan for your business needs
            </p>
          </div>

          {/* Current Plan Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {currentPlan.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{currentPlan.name} Plan</h3>
                    <p className="text-muted-foreground">
                      {formatPrice(currentPlan.price)}/month
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={user?.subscriptionStatus === "active" ? "default" : "outline"}>
                    {user?.subscriptionStatus || "trial"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Next billing: Dec 25, 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Component */}
          {selectedPlan && (
            <div className="mb-8 flex justify-center">
              <RazorpayCheckout
                planName={plans.find(p => p.id === selectedPlan)?.name || ""}
                planPrice={plans.find(p => p.id === selectedPlan)?.price || 0}
                planFeatures={plans.find(p => p.id === selectedPlan)?.features || []}
                planId={selectedPlan}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </div>
          )}

          {/* Available Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-primary/10 rounded-lg text-primary w-fit">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.price)}
                    <span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    {plan.id === user?.subscriptionPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : selectedPlan === plan.id ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedPlan(null)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleUpgrade(plan.id)}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.price > (currentPlan?.price || 0) ? "Upgrade Now" : "Switch Plan"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Billing Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">•••• •••• •••• 1234</span>
                      <Badge variant="outline" className="ml-auto">Primary</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2">
                    Update Payment Method
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Billing Address</h4>
                  <div className="p-3 border rounded-lg text-sm">
                    <p>123 Business Street</p>
                    <p>Mumbai, Maharashtra 400001</p>
                    <p>India</p>
                  </div>
                  <Button variant="outline" className="mt-2">
                    Update Address
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Billing History</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">November 2024 - Premium Plan</span>
                    <span className="font-medium">₹499</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">October 2024 - Basic Plan</span>
                    <span className="font-medium">₹199</span>
                  </div>
                </div>
                <Button variant="outline" className="mt-3">
                  View All Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}