import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Store, ShoppingCart, Palette, BarChart } from "lucide-react";
import { Link } from "wouter";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">BizShop Demo</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Video Demo Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See How Easy It Is to Create Your Store
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Watch this quick demo to see how you can build a professional online store in minutes
          </p>
          
          {/* Video Player */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <p className="text-gray-600">Demo Video Coming Soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Interactive walkthrough of creating your first store
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Easy Store Setup</h3>
              </div>
              <p className="text-gray-600">
                Choose from professional templates and customize your store in minutes. No coding required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Product Management</h3>
              </div>
              <p className="text-gray-600">
                Add products, manage inventory, and organize your catalog with our intuitive tools.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Custom Branding</h3>
              </div>
              <p className="text-gray-600">
                Make it yours with custom colors, fonts, and branding elements that match your business.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">Analytics & Insights</h3>
              </div>
              <p className="text-gray-600">
                Track your sales, understand your customers, and grow your business with detailed analytics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Free Trial?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Get started today with our 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}