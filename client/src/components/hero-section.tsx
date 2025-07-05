import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play, Sparkles, Zap } from "lucide-react";
import { Link } from "wouter";
import { ScrollAnimation } from "./scroll-animation";

interface HeroSectionProps {
  onSignUpClick?: () => void;
}

export function HeroSection({ onSignUpClick }: HeroSectionProps) {
  return (
    <section className="relative bg-white overflow-hidden min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollAnimation animationType="fadeInLeft">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Store Builder
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Create your online 
                  <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    store in minutes,
                  </span>
                  not months
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  BizShop gives small business owners everything they need to build a professional e-commerce website without technical knowledge.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth?mode=signup" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center bg-green-50 rounded-lg p-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-green-800 font-medium">14-day free trial</span>
                </div>
                <div className="flex items-center bg-blue-50 rounded-lg p-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-blue-800 font-medium">No credit card required</span>
                </div>
                <div className="flex items-center bg-purple-50 rounded-lg p-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                  <span className="text-purple-800 font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animationType="fadeInRight" delay={200}>
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-500">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-8 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-8 bg-gradient-to-br from-white to-gray-50">
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg"></div>
                      <div className="h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg"></div>
                      <div className="h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg"></div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-green-200 to-blue-200 rounded-full w-1/3 mt-6"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg animate-bounce flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl shadow-lg animate-pulse flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
