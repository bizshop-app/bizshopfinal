import { ScrollAnimation } from "./scroll-animation";
import { Palette, Settings, Rocket, CheckCircle } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Choose a Template",
      description: "Browse our collection of professionally designed templates and select the one that best fits your brand.",
      icon: <Palette className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      number: 2,
      title: "Customize Your Store",
      description: "Add your products, customize colors and fonts, and make your online store uniquely yours.",
      icon: <Settings className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      number: 3,
      title: "Launch & Sell",
      description: "Publish your store and start selling to customers worldwide with secure payment processing.",
      icon: <Rocket className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animationType="fadeInUp">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-6 py-2 text-sm font-medium text-blue-700 mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              How BizShop
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get your online store up and running in three simple steps.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <ScrollAnimation 
              key={step.number} 
              animationType="fadeInUp" 
              delay={index * 200}
            >
              <div className="relative group">
                <div className={`bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden`}>
                  {/* Step number */}
                  <div className={`absolute top-6 right-6 w-12 h-12 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-lg">
                    {step.description}
                  </p>

                  {/* Hover decoration */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-r ${step.color} opacity-10 group-hover:h-full transition-all duration-500 -z-10`}></div>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2 z-10"></div>
                )}
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Call to action */}
        <ScrollAnimation animationType="fadeInUp" delay={600}>
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
                Start with a professionally designed template and customize it to fit your brand.
              </h3>
              <p className="text-gray-600 mb-6">
                No technical knowledge required. Everything is drag-and-drop simple.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center bg-green-50 rounded-xl p-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-green-800 font-medium text-lg">Ready in minutes, not hours</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}