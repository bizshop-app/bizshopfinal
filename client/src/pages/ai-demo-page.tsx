import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIContentGenerator } from "@/components/ai-content-generator";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Target, Lightbulb } from "lucide-react";

export default function AIDemoPage() {
  const [demoProduct, setDemoProduct] = useState({
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 12999,
    features: ["Noise Cancellation", "40Hr Battery", "Quick Charge"],
    description: "High-quality wireless headphones with active noise cancellation"
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 pt-16 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI Content Generator</h1>
                <p className="text-gray-600">Create compelling product content with artificial intelligence</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Smart Descriptions</h3>
                <p className="text-sm text-blue-700">AI generates compelling product descriptions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">SEO Titles</h3>
                <p className="text-sm text-green-700">Multiple title suggestions for better search</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <Lightbulb className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Smart Tags</h3>
                <p className="text-sm text-purple-700">Relevant tags for better discoverability</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <Sparkles className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900">Store Banners</h3>
                <p className="text-sm text-orange-700">Professional marketing content</p>
              </CardContent>
            </Card>
          </div>

          {/* Demo Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demo Product Info */}
            <Card>
              <CardHeader>
                <CardTitle>Demo Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{demoProduct.name}</h3>
                  <Badge variant="secondary" className="mt-1">{demoProduct.category}</Badge>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-primary">₹{demoProduct.price.toLocaleString('en-IN')}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {demoProduct.features.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Current Description:</h4>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{demoProduct.description}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">How AI Content Generation Works:</h4>
                  <ol className="text-sm text-yellow-700 space-y-1">
                    <li>1. Enter basic product information</li>
                    <li>2. Click generate for descriptions, titles, or tags</li>
                    <li>3. AI analyzes product context and creates content</li>
                    <li>4. Review and apply generated content to your product</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* AI Generator */}
            <AIContentGenerator
              productInfo={demoProduct}
              onContentGenerated={(content) => {
                if (content.description) {
                  setDemoProduct(prev => ({ ...prev, description: content.description! }));
                }
                if (content.title) {
                  setDemoProduct(prev => ({ ...prev, name: content.title! }));
                }
              }}
            />
          </div>

          {/* Benefits Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Benefits of AI-Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Save Time</h4>
                  <p className="text-sm text-gray-600">Generate professional product descriptions in seconds instead of hours</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Improve SEO</h4>
                  <p className="text-sm text-gray-600">AI-optimized titles and tags help customers find your products easier</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Consistent Quality</h4>
                  <p className="text-sm text-gray-600">Maintain professional tone and quality across all product listings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}