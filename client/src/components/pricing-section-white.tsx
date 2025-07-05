import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, IndianRupee, Gift, Zap, Crown } from "lucide-react";
import { ScrollAnimation } from "./scroll-animation";
import { EarlyBirdBanner } from "./early-bird-banner";

interface PricingSectionProps {
  onSignUpClick: () => void;
}

export function PricingSectionWhite({ onSignUpClick }: PricingSectionProps) {
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
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-full px-6 py-2 text-sm font-medium text-green-700 mb-6">
              <IndianRupee className="w-4 h-4 mr-2" />
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-green-900 to-blue-900 bg-clip-text text-transparent">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that's right for your business. All plans include 14-day free trial with no commitments.
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
                className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-2 group hover:scale-105 ${
                  plan.popular 
                    ? 'border-blue-300 ring-4 ring-blue-100 transform scale-105' 
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ✨ Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.id === 'free' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                    plan.id === 'pro' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                    'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}>
                    {plan.id === 'free' ? <Gift className="h-8 w-8 text-white" /> :
                     plan.id === 'pro' ? <Zap className="h-8 w-8 text-white" /> :
                     <Crown className="h-8 w-8 text-white" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-500 text-lg">/month</span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={onSignUpClick}
                  className={`w-full font-bold text-lg py-3 rounded-2xl transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white hover:shadow-lg'
                  }`}
                  size="lg"
                >
                  {plan.price === 0 ? '🚀 Start Free' : '✨ Start Trial'}
                </Button>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}