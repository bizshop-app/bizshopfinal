import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, ShoppingCart, Star, Heart, Share } from "lucide-react";

export default function TemplatePreviewPage() {
  const [match, params] = useRoute("/template/:id");
  const templateId = params?.id;

  const handleUseTemplate = (templateId: string) => {
    // Navigate to store setup with selected template
    window.location.href = `/store-setup?template=${templateId}`;
  };

  const templates = {
    "1": {
      name: "Fashion Store",
      category: "Fashion",
      color: "from-pink-400 to-rose-500",
      description: "Perfect for clothing, accessories, and fashion retailers",
      features: ["Responsive Design", "Product Galleries", "Size Charts", "Wishlist", "Quick View"],
      demoProducts: [
        { name: "Summer Dress", price: "₹2,499", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop&crop=center" },
        { name: "Designer Handbag", price: "₹3,999", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center" },
        { name: "Classic Sneakers", price: "₹1,899", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center" }
      ]
    },
    "2": {
      name: "Electronics Shop",
      category: "Electronics",
      color: "from-blue-400 to-cyan-500",
      description: "Ideal for gadgets, computers, and tech products",
      features: ["Product Comparison", "Tech Specs", "Reviews", "Warranty Info", "Live Chat"],
      demoProducts: [
        { name: "Smartphone", price: "₹24,999", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center" },
        { name: "Laptop", price: "₹45,999", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&crop=center" },
        { name: "Headphones", price: "₹3,499", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center" }
      ]
    },
    "3": {
      name: "Stationary Store",
      category: "Stationary",
      color: "from-amber-400 to-orange-500",
      description: "Great for office supplies and educational materials",
      features: ["Bulk Orders", "School Supplies", "Office Sets", "Custom Printing", "Quick Reorder"],
      demoProducts: [
        { name: "Notebook Set", price: "₹299", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop&crop=center" },
        { name: "Pen Collection", price: "₹599", image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=300&h=300&fit=crop&crop=center" },
        { name: "Art Supplies", price: "₹1,299", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center" }
      ]
    },
    "4": {
      name: "Jewelry Store",
      category: "Jewelry",
      color: "from-purple-400 to-pink-500",
      description: "Elegant design for jewelry and luxury items",
      features: ["360° Product View", "Try-On AR", "Certification", "Custom Design", "Gift Wrapping"],
      demoProducts: [
        { name: "Diamond Ring", price: "₹25,999", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop&crop=center" },
        { name: "Gold Necklace", price: "₹15,999", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop&crop=center" },
        { name: "Silver Earrings", price: "₹2,999", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&h=300&fit=crop&crop=center" }
      ]
    },
    "5": {
      name: "Food & Drinks",
      category: "Food",
      color: "from-green-400 to-emerald-500",
      description: "Perfect for restaurants, cafes, and food delivery",
      features: ["Menu Display", "Online Ordering", "Delivery Tracking", "Table Booking", "Reviews"],
      demoProducts: [
        { name: "Margherita Pizza", price: "₹399", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop&crop=center" },
        { name: "Fresh Salad", price: "₹249", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop&crop=center" },
        { name: "Coffee Blend", price: "₹199", image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=300&h=300&fit=crop&crop=center" }
      ]
    },
    "6": {
      name: "Sports Store",
      category: "Sports",
      color: "from-red-400 to-orange-500",
      description: "Perfect for sports equipment and fitness gear",
      features: ["Size Guide", "Performance Stats", "Team Orders", "Expert Reviews", "Training Tips"],
      demoProducts: [
        { name: "Running Shoes", price: "₹4,999", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center" },
        { name: "Yoga Mat", price: "₹899", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop&crop=center" },
        { name: "Tennis Racket", price: "₹2,499", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop&crop=center" }
      ]
    }
  };

  const template = templates[templateId as keyof typeof templates];

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <Link href="/templates">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/templates">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Templates
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
                <Badge variant="secondary" className="mt-1">
                  {template.category}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/demo">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live Demo
                </Button>
              </Link>
              <Button onClick={() => handleUseTemplate(templateId!)}>
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Hero Section Preview */}
                <div className={`h-64 bg-gradient-to-br ${template.color} relative flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <h2 className="text-3xl font-bold mb-2">{template.name}</h2>
                    <p className="text-lg opacity-90">{template.description}</p>
                    <Button className="mt-4 bg-white text-gray-900 hover:bg-gray-100">
                      Shop Now
                    </Button>
                  </div>
                </div>

                {/* Products Section Preview */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Featured Products</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {template.demoProducts.map((product, index) => (
                      <div key={index} className="group">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="secondary" className="rounded-full p-2">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{product.price}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">4.8</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-2">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Template Features</h3>
                <ul className="space-y-2">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Template Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages:</span>
                    <span className="font-medium">10+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile Responsive:</span>
                    <span className="font-medium">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Setup Time:</span>
                    <span className="font-medium">5 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Get Started</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start your 14-day free trial and customize this template for your business.
                </p>
                <div className="space-y-3">
                  <Link href="/auth?mode=signup">
                    <Button className="w-full">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <Share className="mr-2 h-4 w-4" />
                    Share Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}