import { 
  PaintbrushVertical, 
  ShoppingCartIcon, 
  CreditCardIcon, 
  LineChartIcon, 
  SmartphoneIcon,
  HeadphonesIcon,
  Sparkles,
  Zap
} from "lucide-react";
import { ScrollAnimation } from "./scroll-animation";

export function FeaturesSection() {
  const features = [
    {
      icon: <PaintbrushVertical className="h-8 w-8" />,
      title: "Beautiful Templates",
      description: "Choose from dozens of professionally designed templates and customize them to match your brand perfectly.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ShoppingCartIcon className="h-8 w-8" />,
      title: "Smart Product Management",
      description: "Easily upload, categorize, and manage your products with our intuitive dashboard and AI assistance.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <CreditCardIcon className="h-8 w-8" />,
      title: "Secure Payments",
      description: "Integrate with popular payment gateways like Razorpay and Stripe to process payments securely.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <LineChartIcon className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Track sales, customer behavior, and inventory with detailed analytics and actionable insights.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <SmartphoneIcon className="h-8 w-8" />,
      title: "Mobile First",
      description: "All templates are fully responsive and optimized for mobile, ensuring great experience on any device.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <HeadphonesIcon className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Our dedicated support team is available to help you with any questions or issues around the clock.",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animationType="fadeInUp">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-6 py-2 text-sm font-medium text-blue-700 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Succeed Online
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              BizShop gives you all the tools to create, manage and grow your online store with cutting-edge technology.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollAnimation 
              key={index} 
              animationType="fadeInUp" 
              delay={index * 100}
            >
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover decoration */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
