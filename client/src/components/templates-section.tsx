import { Palette } from "lucide-react";
import { ScrollAnimation } from "./scroll-animation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function TemplatesSection() {
  const templates = [
    {
      name: "Fashion Store",
      image: "/template-fashion.svg",
      category: "Fashion",
      color: "from-pink-400 to-rose-500"
    },
    {
      name: "Electronics Shop", 
      image: "/template-electronics.svg",
      category: "Electronics",
      color: "from-blue-400 to-cyan-500"
    },
    {
      name: "Stationary Store",
      image: "/template-stationary.svg",
      category: "Stationary",
      color: "from-amber-400 to-orange-500"
    },
    {
      name: "Jewelry Store",
      image: "/template-jewelry.svg",
      category: "Jewelry",
      color: "from-purple-400 to-pink-500"
    },
    {
      name: "Food & Drinks",
      image: "/template-food.svg",
      category: "Food",
      color: "from-green-400 to-emerald-500"
    },
    {
      name: "Sports Store",
      image: "/template-sports.svg",
      category: "Sports",
      color: "from-indigo-400 to-blue-500"
    }
  ];

  return (
    <section id="templates" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animationType="fadeInUp">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-full px-6 py-2 text-sm font-medium text-pink-700 mb-6">
              <Palette className="w-4 h-4 mr-2" />
              Beautiful Templates
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-pink-900 to-purple-900 bg-clip-text text-transparent">
              Beautiful Templates for
              <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Every Business
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Choose from our collection of professionally designed templates, or customize any design to match your brand perfectly.
            </p>
            <Link href="/templates">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Templates
              </Button>
            </Link>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <ScrollAnimation 
              key={index} 
              animationType="fadeInUp" 
              delay={index * 100}
            >
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={template.image} 
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      ✨ View Template
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${template.color}`}></div>
                    </div>
                    <div className={`inline-flex items-center bg-gradient-to-r ${template.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {template.category}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
