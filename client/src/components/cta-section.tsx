import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Rocket } from "lucide-react";
import { Link } from "wouter";
import { ScrollAnimation } from "./scroll-animation";

interface CtaSectionProps {
  onSignUpClick: () => void;
}

export function CtaSection({ onSignUpClick }: CtaSectionProps) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animationType="fadeInUp">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              Ready to Launch?
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              Ready to Build Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Online Store?
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of entrepreneurs who have already built successful online stores with BizShop's powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth?mode=signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/templates">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg font-bold"
              >
                Browse Templates
              </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-sm">
              <div className="flex items-center justify-center bg-green-50 rounded-xl p-4">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-green-800 font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center justify-center bg-blue-50 rounded-xl p-4">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-blue-800 font-medium">No setup fees</span>
              </div>
              <div className="flex items-center justify-center bg-purple-50 rounded-xl p-4">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                <span className="text-purple-800 font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
