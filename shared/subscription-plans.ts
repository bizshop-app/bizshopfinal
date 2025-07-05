export interface SubscriptionPlan {
  id: string;
  name: string;
  priceInr: number;
  priceMonthly: number;
  features: string[];
  maxProducts: number;
  maxStores: number;
  transactionFeePercent: number;
  popular?: boolean;
  paytmPlanId?: string;
  razorpayPlanId?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    priceInr: 0,
    priceMonthly: 0,
    maxProducts: 20,
    maxStores: 1,
    transactionFeePercent: 5,
    features: [
      "1 store",
      "Up to 20 products",
      "Basic storefront",
      "Email support",
      "Built with BizShop badge",
      "5% transaction fee"
    ],
    paytmPlanId: "free_plan",
    razorpayPlanId: "plan_free"
  },
  {
    id: "basic",
    name: "Basic",
    priceInr: 199,
    priceMonthly: 199,
    maxProducts: 50,
    maxStores: 1,
    transactionFeePercent: 3,
    features: [
      "1 store",
      "Up to 50 products",
      "Basic analytics",
      "Email support",
      "SSL certificate",
      "Mobile responsive",
      "3% transaction fee"
    ],
    paytmPlanId: "basic_plan",
    razorpayPlanId: "plan_basic_199"
  },
  {
    id: "premium",
    name: "Premium",
    priceInr: 499,
    priceMonthly: 499,
    maxProducts: -1,
    maxStores: 3,
    transactionFeePercent: 1,
    popular: true,
    features: [
      "3 stores",
      "Unlimited products",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "Remove BizShop branding",
      "AI content generation",
      "Payment gateway integration",
      "Only 1% transaction fee"
    ],
    paytmPlanId: "premium_plan",
    razorpayPlanId: "plan_premium_499"
  },
  {
    id: "yearly_special",
    name: "Early Bird - 1 Year Premium",
    priceInr: 1499,
    priceMonthly: 125, // Effective monthly rate
    maxProducts: -1,
    maxStores: 3,
    transactionFeePercent: 1,
    popular: true,
    features: [
      "3 stores",
      "Unlimited products",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "Remove BizShop branding",
      "AI content generation",
      "Payment gateway integration",
      "Only 1% transaction fee",
      "1 full year at ₹1,499 (Save ₹4,489!)",
      "Limited to first 250 users"
    ],
    paytmPlanId: "yearly_special_plan",
    razorpayPlanId: "plan_yearly_1499"
  }
];

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

export function canCreateStore(user: { subscriptionPlan: string; maxStores: number }, currentStoreCount: number): boolean {
  const plan = getPlanById(user.subscriptionPlan);
  if (!plan) return false;
  
  if (plan.maxStores === -1) return true; // unlimited
  return currentStoreCount < plan.maxStores;
}

export function canAddProduct(user: { subscriptionPlan: string; maxProducts: number }, currentProductCount: number): boolean {
  const plan = getPlanById(user.subscriptionPlan);
  if (!plan) return false;
  
  if (plan.maxProducts === -1) return true; // unlimited
  return currentProductCount < plan.maxProducts;
}