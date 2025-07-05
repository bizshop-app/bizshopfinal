import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, IndianRupee, Gift, Zap, Crown } from "lucide-react";
import { Link } from "wouter";
import { ScrollAnimation } from "./scroll-animation";
import { EarlyBirdBanner } from "./early-bird-banner";

interface PricingSectionProps {
  onSignUpClick: () => void;
}

export function PricingSection({ onSignUpClick }: PricingSectionProps) {
  const [showEarlyBird, setShowEarlyBird] = useState(true);
  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: 0,
      popular: false,
      features: [
        "1 store",
        "Up to 20 products", 
        "Basic storefront",
        "Email support",
        "Built with BizShop badge"
      ]
    },
    {
      id: "basic", 
      name: "Basic",
      description: "Great for growing businesses",
      price: 199,
      popular: true,
      features: [
        "1 store",
        "Up to 50 products",
        "Custom domain support", 
        "Remove BizShop badge",
        "Basic analytics",
        "Priority support",
        "3% transaction fee"
      ]
    },
    {
      id: "premium",
      name: "Premium", 
      description: "Everything you need to scale",
      price: 499,
      popular: false,
      features: [
        "3 stores",
        "Unlimited products",
        "AI banner & content generation",
        "Advanced analytics & insights", 
        "24/7 priority support",
        "Custom integrations"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-full filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Early Bird Banner */}
        {showEarlyBird && (
          <div className="mb-8">
            <EarlyBirdBanner 
              onClose={() => setShowEarlyBird(false)}
              onPurchase={onSignUpClick}
              showCloseButton={true}
            />
          </div>
        )}

        <ScrollAnimation animationType="fadeInUp">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-full px-6 py-2 text-sm font-medium text-violet-700 mb-6 shadow-lg">
              <IndianRupee className="w-4 h-4 mr-2" />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Premium Pricing</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-violet-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your business with our powerful e-commerce platform. Start free and scale as you grow.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <ScrollAnimation 
              key={plan.id} 
              animationType="fadeInUp" 
              delay={index * 150}
            >
              <div
                className={`relative rounded-3xl transition-all duration-500 p-8 group hover:scale-105 backdrop-blur-sm ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-2 border-violet-400/50 shadow-2xl shadow-violet-500/25 ring-4 ring-violet-400/10 transform scale-105' 
                    : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-violet-500/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <span className="animate-pulse mr-2">⭐</span>
                      Most Popular
                      <span className="animate-pulse ml-2">⭐</span>
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl ${
                    plan.id === 'free' ? 'bg-gradient-to-br from-gray-500 to-gray-700 shadow-gray-500/25' :
                    plan.id === 'pro' ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/50' :
                    'bg-gradient-to-br from-purple-600 to-pink-600 shadow-purple-500/50'
                  }`}>
                    {plan.id === 'free' ? <Gift className="h-10 w-10 text-white" /> :
                     plan.id === 'pro' ? <Zap className="h-10 w-10 text-white" /> :
                     <Crown className="h-10 w-10 text-white" />}
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-3 text-gray-900">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-violet-600 bg-clip-text text-transparent">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-500 text-xl">/month</span>
                  </div>
                  <p className="text-gray-300 font-medium text-lg">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-0.5 ${
                        plan.popular ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}>
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={onSignUpClick}
                  className={`w-full font-bold text-xl py-4 rounded-2xl transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/40 transform hover:scale-105' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-violet-600 hover:to-purple-600 text-white hover:shadow-xl hover:shadow-violet-500/25'
                  }`}
                  size="lg"
                >
                  {plan.price === 0 ? '🚀 Start Free' : '✨ Get Started'}
                </Button>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Additional trust indicators */}
        <ScrollAnimation animationType="fadeInUp" delay={600}>
          <div className="text-center mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-gray-700/50">
            <h3 className="text-2xl font-bold mb-6 text-white">All plans include:</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                <span className="text-green-300 font-semibold">14-day free trial</span>
              </div>
              <div className="flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border border-blue-500/20">
                <CheckCircle className="h-6 w-6 text-blue-400 mr-3" />
                <span className="text-blue-300 font-semibold">No setup fees</span>
              </div>
              <div className="flex items-center justify-center bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-2xl p-4 border border-purple-500/20">
                <CheckCircle className="h-6 w-6 text-purple-400 mr-3" />
                <span className="text-purple-300 font-semibold">Cancel anytime</span>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}