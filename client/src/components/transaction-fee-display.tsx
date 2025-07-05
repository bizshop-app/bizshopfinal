import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getTransactionFeePercent } from "@shared/transaction-fees";

interface TransactionFeeDisplayProps {
  orderAmount?: number;
  showUpgradeHint?: boolean;
  className?: string;
}

export function TransactionFeeDisplay({ 
  orderAmount = 1000, 
  showUpgradeHint = true,
  className = "" 
}: TransactionFeeDisplayProps) {
  const { user } = useAuth();
  const currentPlan = user?.subscriptionPlan || "free";
  const currentFeePercent = getTransactionFeePercent(currentPlan);
  const currentFee = Math.round(orderAmount * (currentFeePercent / 100));
  const payout = orderAmount - currentFee;

  const planFees = [
    { plan: "free", name: "Free", fee: 5, color: "bg-red-100 text-red-800" },
    { plan: "basic", name: "Basic", fee: 3, color: "bg-yellow-100 text-yellow-800" },
    { plan: "premium", name: "Premium", fee: 1, color: "bg-green-100 text-green-800" }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5" />
            Transaction Fees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {planFees.map((planInfo) => (
              <div 
                key={planInfo.plan}
                className={`p-3 rounded-lg border-2 ${
                  currentPlan === planInfo.plan 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium text-sm">{planInfo.name}</div>
                <Badge className={planInfo.color}>
                  {planInfo.fee}%
                </Badge>
                {currentPlan === planInfo.plan && (
                  <div className="text-xs text-primary mt-1">Current Plan</div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-muted-foreground mb-2">
              For an order of ₹{orderAmount.toLocaleString()}:
            </div>
            <div className="flex justify-between items-center">
              <span>Transaction Fee ({currentFeePercent}%):</span>
              <span className="font-medium text-red-600">-₹{currentFee}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <span className="font-medium">You Receive:</span>
              <span className="font-bold text-green-600">₹{payout.toLocaleString()}</span>
            </div>
          </div>

          {showUpgradeHint && currentPlan !== "premium" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900">Save on Transaction Fees</div>
                  <div className="text-blue-700">
                    Upgrade to {currentPlan === "free" ? "Basic (3%)" : "Premium (1%)"} to reduce fees and keep more of your earnings.
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}