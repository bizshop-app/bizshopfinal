import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="hover:text-primary transition-colors duration-200">Features</a></li>
              <li><a href="#templates" className="hover:text-primary transition-colors duration-200">Templates</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Updates</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Guides</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-primary transition-colors duration-200">About</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Careers</a></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors duration-200">Contact Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Partners</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors duration-200">Terms & Conditions</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-primary transition-colors duration-200">Shipping Policy</Link></li>
              <li><Link href="/cancellation-refunds" className="hover:text-primary transition-colors duration-200">Cancellations & Refunds</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter signup */}
        <div className="mt-16 mb-12 border-b border-gray-800 pb-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-white text-xl font-semibold mb-4">Subscribe to our newsletter</h3>
            <p className="mb-6">Get the latest updates, news and product offers sent directly to your inbox.</p>
            <form className="flex max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary flex-grow"
              />
              <button className="bg-primary hover:bg-primary-600 text-white px-4 py-3 rounded-r-md transition-colors duration-200">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pb-6">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-2">
              <img src="/logo.svg" alt="BizShop" className="w-8 h-8 mr-3" />
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BizShop
              </Link>
            </div>
            <p className="mt-2 text-sm text-gray-500">Empower your business with our e-commerce platform</p>
          </div>
          <div className="flex space-x-5">
            <Link href="/auth?mode=signup">
              <Button size="sm" variant="outline">
                Start Free Trial
              </Button>
            </Link>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center border-t border-gray-800 pt-8 mt-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BizShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
