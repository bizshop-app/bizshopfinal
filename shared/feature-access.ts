import { User } from "./schema";

export interface FeatureAccess {
  customDomain: boolean;
  removeBranding: boolean;
  aiContent: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  storeManagers: boolean;
  maxManagers: number;
}

export function getFeatureAccess(user: User): FeatureAccess {
  const plan = user.subscriptionPlan;
  
  return {
    customDomain: ['pro', 'premium', 'lifetime'].includes(plan),
    removeBranding: ['pro', 'premium', 'lifetime'].includes(plan),
    aiContent: ['premium', 'lifetime'].includes(plan),
    prioritySupport: ['pro', 'premium', 'lifetime'].includes(plan),
    advancedAnalytics: ['premium', 'lifetime'].includes(plan),
    storeManagers: ['premium', 'lifetime'].includes(plan),
    maxManagers: plan === 'premium' || plan === 'lifetime' ? 3 : 0
  };
}

export function hasFeatureAccess(user: User, feature: keyof FeatureAccess): boolean {
  const access = getFeatureAccess(user);
  return access[feature];
}