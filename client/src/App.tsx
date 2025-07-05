import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import StoreSetupPage from "@/pages/store-setup-page";
import ProductManagementPage from "@/pages/product-management-page";
import OrdersPage from "@/pages/orders-page";
import AnalyticsPage from "@/pages/analytics-page";
import SettingsPage from "@/pages/settings-page";
import SubscriptionsPage from "@/pages/subscriptions-page";
import StorefrontPage from "@/pages/storefront-page";
import AdminPage from "@/pages/admin-page";
import CategoriesPage from "@/pages/categories-page";
import DiscountsPage from "@/pages/discounts-page";
import VerifyEmailPage from "@/pages/verify-email-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import ResetPasswordPage from "@/pages/reset-password-page";
import CheckoutPage from "@/pages/checkout-page";
import AdminPanelPage from "@/pages/admin-panel-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import ShippingPolicyPage from "@/pages/shipping-policy-page";
import CancellationRefundsPage from "@/pages/cancellation-refunds-page";
import PoliciesPage from "@/pages/policies-page";
import ComingSoonPage from "@/pages/coming-soon-page";
import TemplatesPage from "@/pages/templates-page";
import TemplatePreviewPage from "@/pages/template-preview-page";
import DemoPage from "@/pages/demo-page";
import AIDemoPage from "@/pages/ai-demo-page";
import AffiliatePage from "@/pages/affiliate-page";
import StorePreviewPage from "@/pages/store-preview-page";
import StoreLinkPage from "@/pages/store-link-page";
import OrderSuccessPage from "@/pages/order-success-page";
import SubscriptionBillingPage from "@/pages/subscription-billing-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AdminRoute } from "./lib/admin-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/demo" component={DemoPage} />
      <Route path="/verify-email" component={VerifyEmailPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/shipping-policy" component={ShippingPolicyPage} />
      <Route path="/cancellation-refunds" component={CancellationRefundsPage} />
      <Route path="/policies" component={PoliciesPage} />
      <Route path="/coming-soon" component={ComingSoonPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/store-setup" component={StoreSetupPage} />
      <ProtectedRoute path="/products" component={ProductManagementPage} />
      <ProtectedRoute path="/categories" component={CategoriesPage} />
      <ProtectedRoute path="/discounts" component={DiscountsPage} />
      <ProtectedRoute path="/orders" component={OrdersPage} />
      <ProtectedRoute path="/analytics" component={AnalyticsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/subscriptions" component={SubscriptionBillingPage} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/template/:id" component={TemplatePreviewPage} />
      <Route path="/store/:storeId" component={StoreLinkPage} />
      <Route path="/store/:storeId/checkout" component={CheckoutPage} />
      <Route path="/store/:storeId/order-success" component={OrderSuccessPage} />
      <ProtectedRoute path="/preview/:storeId" component={StorePreviewPage} />
      <AdminRoute path="/admin" component={AdminPage} />
      <AdminRoute path="/admin-panel" component={AdminPanelPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
