import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { DemoPayment } from "@/components/demo-payment";

interface SubscriptionPlan {
  id: string;
  name: string;
  priceInr: number;
  priceMonthly: number;
  features: string[];
  maxProducts: number;
  maxStores: number;
  popular?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: plans = [], isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription/plans"],
  });

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", "/api/subscription/create", { planId });
      return response.json();
    },
    onSuccess: (data, planId) => {
      const plan = plans.find(p => p.id === planId);
      
      if (plan?.priceInr === 0) {
        // Free plan - no payment needed
        toast({
          title: "Subscription Updated!",
          description: `You are now on the ${plan.name} plan.`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      } else {
        // Paid plan - initiate Razorpay payment
        initiatePayment(data, planId);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (orderData: any, planId: string) => {
    setIsLoading(true);
    
    try {
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error("Plan not found");

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BizShop",
        description: `${plan.name} Subscription`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await apiRequest("POST", "/api/subscription/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: planId,
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast({
                title: "Payment Successful!",
                description: `Welcome to ${plan.name}! Your subscription is now active.`,
              });
              queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            } else {
              throw new Error(verifyData.message || "Payment verification failed");
            }
          } catch (error: any) {
            toast({
              title: "Payment Verification Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.fullName || "Customer",
          email: user?.email || "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          plan_id: planId,
          plan_name: plan.name,
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan?.priceInr === 0) {
      // Free plan - activate directly
      subscribeMutation.mutate(planId);
    } else {
      // Paid plan - show demo payment options
      setSelectedPlan(planId);
    }
  };

  if (plansLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your business needs. Start selling online with powerful e-commerce tools.
        </p>
        <div className="mt-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Save up to 2 months with yearly plans
            </span>
          </div>
          <div className="inline-flex items-center space-x-2 text-sm">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3 mr-1 inline" />
              Demo mode available during Razorpay verification
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${
              user?.subscriptionPlan === plan.id ? 'ring-2 ring-green-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ₹{plan.priceInr.toLocaleString()}
                {plan.priceInr > 0 && (
                  <span className="text-base font-normal text-muted-foreground">
                    {(plan.name.includes('Yearly') || plan.name.includes('1 Year') || plan.name.includes('Early Bird')) ? '/year' : '/month'}
                  </span>
                )}
              </div>
              {(plan.name.includes('Yearly') || plan.name.includes('1 Year') || plan.name.includes('Early Bird')) && (
                <div className="text-sm text-green-600 font-medium">
                  ₹{Math.round(plan.priceInr / 12)}/month billed yearly
                </div>
              )}
              <CardDescription>
                {plan.maxStores === -1 ? 'Unlimited stores' : `${plan.maxStores} store${plan.maxStores !== 1 ? 's' : ''}`}
                {' • '}
                {plan.maxProducts === -1 ? 'Unlimited products' : `Up to ${plan.maxProducts} products`}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              {user?.subscriptionPlan === plan.id ? (
                <Button disabled className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Current Plan
                </Button>
              ) : plan.priceInr === 0 ? (
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading && selectedPlan === plan.id}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                    </>
                  )}
                </Button>
              ) : (
                <div className="w-full space-y-2">
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading && selectedPlan === plan.id}
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Live payments in 1-2 days
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPlan && plans.find(p => p.id === selectedPlan)?.priceInr !== 0 && (
        <div className="mb-8 flex justify-center">
          <DemoPayment
            planName={plans.find(p => p.id === selectedPlan)?.name || ""}
            planPrice={plans.find(p => p.id === selectedPlan)?.priceInr || 0}
            planFeatures={plans.find(p => p.id === selectedPlan)?.features || []}
            planId={selectedPlan}
            onPaymentSuccess={() => {
              setSelectedPlan(null);
              queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            }}
          />
        </div>
      )}

      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground">
          All plans include secure payment processing, SSL certificates, and 24/7 support.
        </p>
        <div className="mt-2 space-x-2">
          <Badge variant="outline">
            Secure payments powered by Razorpay
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Demo mode active
          </Badge>
        </div>
      </div>
    </div>
  );
}