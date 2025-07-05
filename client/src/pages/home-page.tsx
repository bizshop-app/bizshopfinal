import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { TemplatesSection } from "@/components/templates-section";
import { DashboardPreviewSection } from "@/components/dashboard-preview-section";
import { PricingSection } from "@/components/pricing-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const [_, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (!isLoading && isAuthenticated) {
    setTimeout(() => navigate("/dashboard"), 0);
    return null;
  }
  
  const handlePricingClick = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const handleSignUpClick = () => {
    navigate("/auth?mode=signup");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onPricingClick={handlePricingClick} onSignUpClick={handleSignUpClick} />
      <HeroSection onSignUpClick={handleSignUpClick} />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesSection />
      <DashboardPreviewSection />
      <PricingSection onSignUpClick={handleSignUpClick} />
      <CtaSection onSignUpClick={handleSignUpClick} />
      <Footer />
    </div>
  );
}
