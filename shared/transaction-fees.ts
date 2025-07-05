import { getPlanById } from "./subscription-plans";

export function calculateTransactionFee(orderAmount: number, userSubscriptionPlan: string): number {
  const plan = getPlanById(userSubscriptionPlan);
  if (!plan) {
    // Default to free plan fee if plan not found
    return Math.round(orderAmount * 0.05);
  }
  
  return Math.round(orderAmount * (plan.transactionFeePercent / 100));
}

export function getTransactionFeePercent(userSubscriptionPlan: string): number {
  const plan = getPlanById(userSubscriptionPlan);
  if (!plan) {
    return 5; // Default to free plan fee
  }
  
  return plan.transactionFeePercent;
}

export function calculateMerchantPayout(orderAmount: number, userSubscriptionPlan: string): number {
  const fee = calculateTransactionFee(orderAmount, userSubscriptionPlan);
  return orderAmount - fee;
}