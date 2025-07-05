import { ScrollAnimation } from "./scroll-animation";
import { 
  BarChart3, 
  Package, 
  Users, 
  TrendingUp,
  CheckCircle,
  Sparkles
} from "lucide-react";

export function DashboardPreviewSection() {
  const features = [
    {
      icon: <Package className="h-5 w-5" />,
      title: "Easy product management",
      description: "Add, edit, and organize products effortlessly"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Real-time sales tracking", 
      description: "Monitor your revenue and growth instantly"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Customer insights and analytics",
      description: "Understand your customers better with data"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Order and inventory management",
      description: "Keep track of orders and stock levels"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollAnimation animationType="fadeInLeft">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center bg-white border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Intuitive Dashboard
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
                  Powerful, Yet 
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Simple Dashboard
                  </span>
                </h2>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Manage your entire online business from one intuitive dashboard. Add products, process orders, track inventory, and view analytics—all in one place.
                </p>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <ScrollAnimation 
                    key={index} 
                    animationType="fadeInUp" 
                    delay={index * 100}
                  >
                    <div className="flex items-start bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto flex-shrink-0" />
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animationType="fadeInRight" delay={200}>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 hover:shadow-3xl transition-all duration-500">
                {/* Mock browser header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="bg-white rounded px-3 py-1 text-xs text-gray-500 mx-8">
                      dashboard.bizshop.app
                    </div>
                  </div>
                </div>

                {/* Mock dashboard content */}
                <div className="p-8 bg-gradient-to-br from-white to-gray-50">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gradient-to-r from-gray-900 to-blue-900 rounded w-32"></div>
                      <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-24"></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                        <div className="h-3 bg-blue-300 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-blue-600 rounded w-12"></div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                        <div className="h-3 bg-purple-300 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-purple-600 rounded w-12"></div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                        <div className="h-3 bg-green-300 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-green-600 rounded w-12"></div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg animate-bounce flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
