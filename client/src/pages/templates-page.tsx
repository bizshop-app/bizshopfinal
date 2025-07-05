import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates = [
    {
      id: 1,
      name: "Fashion Store",
      image: "/template-fashion.svg",
      category: "Fashion",
      color: "from-pink-400 to-rose-500",
      description: "Perfect for clothing, accessories, and fashion retailers"
    },
    {
      id: 2,
      name: "Electronics Shop", 
      image: "/template-electronics.svg",
      category: "Electronics",
      color: "from-blue-400 to-cyan-500",
      description: "Ideal for gadgets, computers, and tech products"
    },
    {
      id: 3,
      name: "Stationary Store",
      image: "/template-stationary.svg",
      category: "Stationary",
      color: "from-amber-400 to-orange-500",
      description: "Great for office supplies and educational materials"
    },
    {
      id: 4,
      name: "Jewelry Store",
      image: "/template-jewelry.svg",
      category: "Jewelry",
      color: "from-purple-400 to-pink-500",
      description: "Elegant design for jewelry and luxury items"
    },
    {
      id: 5,
      name: "Food & Drinks",
      image: "/template-food.svg",
      category: "Food",
      color: "from-green-400 to-emerald-500",
      description: "Perfect for restaurants, cafes, and food delivery"
    },
    {
      id: 6,
      name: "Sports Store",
      image: "/template-sports.svg",
      category: "Sports",
      color: "from-indigo-400 to-blue-500",
      description: "Built for sports equipment and fitness products"
    }
  ];

  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Store Templates</h1>
            <p className="text-muted-foreground">Choose the perfect template for your business</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All Templates" : category}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <Card key={template.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <Badge className={`bg-gradient-to-r ${template.color} text-white border-0`}>
                    {template.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{template.description}</p>
                <div className="flex gap-2">
                  <Link href={`/template/${template.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      View Template
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signup" className="flex-1">
                    <Button className="w-full" size="sm">
                      Use Template
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
}