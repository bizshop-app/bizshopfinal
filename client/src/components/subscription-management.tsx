import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  CreditCard, 
  Calendar, 
  IndianRupee, 
  Pause, 
  Play, 
  X, 
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

interface SubscriptionDetails {
  id: string;
  status: string;
  current_start: number;
  current_end: number;
  charge_at: number;
  plan_id: string;
  customer_id: string;
  quantity: number;
  total_count: number;
  paid_count: number;
  remaining_count: number;
  short_url: string;
}

export function SubscriptionManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [autoRenewal, setAutoRenewal] = useState(user?.autoRenewal || false);

  // Fetch subscription details
  const { 
    data: subscriptionData, 
    isLoading,
    error 
  } = useQuery<{
    subscription: SubscriptionDetails;
    userPlan: string;
    autoRenewal: boolean;
  }>({
    queryKey: ["/api/razorpay/subscription"],
    enabled: !!user?.razorpaySubscriptionId,
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async ({ cancelAtPeriodEnd }: { cancelAtPeriodEnd: boolean }) => {
      const res = await apiRequest("POST", "/api/razorpay/cancel-subscription", {
        cancelAtPeriodEnd
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/razorpay/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  // Pause subscription mutation
  const pauseMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/razorpay/pause-subscription");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/razorpay/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Subscription Paused",
        description: "Your subscription has been paused successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to pause subscription",
        variant: "destructive",
      });
    },
  });

  // Resume subscription mutation
  const resumeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/razorpay/resume-subscription");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/razorpay/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Subscription Resumed",
        description: "Your subscription has been resumed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resume subscription",
        variant: "destructive",
      });
    },
  });

  if (!user?.razorpaySubscriptionId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-4">
            You don't have an active subscription. Upgrade to access premium features.
          </p>
          <Button>
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading subscription details...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !subscriptionData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Subscription</h3>
          <p className="text-gray-600">
            Unable to load subscription details. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { subscription, userPlan } = subscriptionData;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'paused':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Details
          </CardTitle>
          <CardDescription>
            Manage your current subscription and billing settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status and Plan */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold capitalize">{userPlan} Plan</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(subscription.status)}>
                  {getStatusIcon(subscription.status)}
                  <span className="ml-1 capitalize">{subscription.status}</span>
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Subscription ID</p>
              <p className="text-sm font-mono">{subscription.id}</p>
            </div>
          </div>

          {/* Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Current Period</p>
                <p className="font-medium">
                  {formatDate(subscription.current_start)} - {formatDate(subscription.current_end)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <IndianRupee className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Next Charge</p>
                <p className="font-medium">{formatDate(subscription.charge_at)}</p>
              </div>
            </div>
          </div>

          {/* Auto Renewal Setting */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="auto-renewal" className="text-base font-medium">
                Auto Renewal
              </Label>
              <p className="text-sm text-gray-600">
                Automatically renew your subscription each month
              </p>
            </div>
            <Switch
              id="auto-renewal"
              checked={autoRenewal}
              onCheckedChange={setAutoRenewal}
            />
          </div>

          {/* Subscription Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{subscription.paid_count}</p>
              <p className="text-sm text-blue-600">Paid Cycles</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {subscription.total_count === 0 ? '∞' : subscription.remaining_count}
              </p>
              <p className="text-sm text-green-600">Remaining</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{subscription.quantity}</p>
              <p className="text-sm text-purple-600">Quantity</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {subscription.status === 'active' && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Pause className="h-4 w-4" />
                      Pause Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Pause Subscription</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to pause your subscription? You can resume it anytime.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => pauseMutation.mutate()}
                        disabled={pauseMutation.isPending}
                      >
                        {pauseMutation.isPending ? "Pausing..." : "Pause"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your subscription? This action cannot be undone.
                        Your subscription will remain active until the end of the current billing period.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => cancelMutation.mutate({ cancelAtPeriodEnd: true })}
                        disabled={cancelMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {cancelMutation.isPending ? "Cancelling..." : "Cancel Subscription"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}

            {subscription.status === 'paused' && (
              <Button 
                onClick={() => resumeMutation.mutate()}
                disabled={resumeMutation.isPending}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {resumeMutation.isPending ? "Resuming..." : "Resume Subscription"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}