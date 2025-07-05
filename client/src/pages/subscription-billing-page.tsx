import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, Calendar, AlertCircle, CheckCircle, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SUBSCRIPTION_PLANS } from "@shared/subscription-plans";

export default function SubscriptionBillingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(user?.subscriptionPlan || "basic");
  const [autoRenewal, setAutoRenewal] = useState(user?.autoRenewal || true);
  
  const subscriptionPlans = SUBSCRIPTION_PLANS.filter(plan => plan.id !== "free");

  const upgradeSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const selectedPlanDetails = subscriptionPlans.find(p => p.id === planId);
      if (!selectedPlanDetails?.razorpayPlanId) {
        throw new Error('Invalid plan selected');
      }
      
      const res = await apiRequest("POST", "/api/razorpay/subscriptions", { 
        plan_id: selectedPlanDetails.razorpayPlanId,
        planId: planId,
        paymentMethodId: "auto" 
      });
      return await res.json();
    },
    onSuccess: (subscription) => {
      // Handle Razorpay subscription
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: "rzp_live_SZPKtAYuluiEb6",
          subscription_id: subscription.id,
          name: "BizShop",
          description: `Monthly subscription - ${selectedPlan}`,
          handler: async (response: any) => {
            toast({
              title: "Subscription Updated!",
              description: "Your subscription has been upgraded successfully.",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
          },
          theme: {
            color: "#3563E9",
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAutoRenewalMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await apiRequest("PATCH", "/api/user/subscription", { 
        autoRenewal: enabled 
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Auto-renewal Updated",
        description: `Auto-renewal has been ${autoRenewal ? "enabled" : "disabled"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const handlePlanUpgrade = () => {
    if (selectedPlan !== user?.subscriptionPlan) {
      upgradeSubscriptionMutation.mutate(selectedPlan);
    }
  };

  const handleAutoRenewalToggle = (enabled: boolean) => {
    setAutoRenewal(enabled);
    updateAutoRenewalMutation.mutate(enabled);
  };

  const currentPlan = subscriptionPlans.find(plan => plan.id === user?.subscriptionPlan);
  const trialDaysLeft = user?.trialEndsAt ? 
    Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
            <p className="text-muted-foreground">Manage your subscription plan and billing preferences</p>
          </div>

          {/* Current Status */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{currentPlan?.name}</p>
                  <p className="text-lg text-muted-foreground">₹{currentPlan?.price}/month</p>
                  <Badge variant={user?.subscriptionStatus === "active" ? "default" : "secondary"}>
                    {user?.subscriptionStatus === "trial" ? "Free Trial" : user?.subscriptionStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Billing Cycle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Monthly</p>
                  {user?.subscriptionStatus === "trial" ? (
                    <p className="text-sm text-muted-foreground">
                      Trial ends in {trialDaysLeft} days
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-green-500" />
                  Auto-Renewal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-renewal">Enable auto-renewal</Label>
                  <Switch
                    id="auto-renewal"
                    checked={autoRenewal}
                    onCheckedChange={handleAutoRenewalToggle}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Automatically renew your subscription each month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trial Warning */}
          {user?.subscriptionStatus === "trial" && trialDaysLeft <= 7 && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-900">Trial Ending Soon</h3>
                    <p className="text-sm text-orange-800">
                      Your free trial ends in {trialDaysLeft} days. Upgrade now to continue using BizShop.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose the plan that best fits your business needs
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    } ${plan.popular ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        Most Popular
                      </Badge>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">₹{plan.priceInr}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {user?.subscriptionPlan === plan.id && (
                      <Badge variant="default" className="w-full justify-center">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {selectedPlan !== user?.subscriptionPlan && (
                <div className="mt-8 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Upgrade to {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{subscriptionPlans.find(p => p.id === selectedPlan)?.priceInr}/month with auto-renewal
                      </p>
                    </div>
                    <Button 
                      onClick={handlePlanUpgrade}
                      disabled={upgradeSubscriptionMutation.isPending}
                    >
                      {upgradeSubscriptionMutation.isPending ? "Processing..." : "Upgrade Now"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Razorpay</p>
                    <p className="text-sm text-muted-foreground">Secure payment processing</p>
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}