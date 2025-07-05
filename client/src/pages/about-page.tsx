import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Zap, Shield, Globe, HeadphonesIcon } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            BizShop
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/subscription" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">About BizShop</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            India's leading e-commerce platform empowering businesses to create beautiful online stores 
            and reach customers across the country. Built with cutting-edge technology and designed for growth.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              To democratize e-commerce in India by providing affordable, powerful, and user-friendly 
              tools that enable every business - from small retailers to growing enterprises - to 
              succeed online.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BizShop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Lightning Fast Setup</CardTitle>
                <CardDescription>
                  Launch your online store in minutes, not days. Our intuitive platform 
                  gets you selling quickly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Built for India</CardTitle>
                <CardDescription>
                  Designed specifically for Indian businesses with local payment gateways, 
                  INR pricing, and regional preferences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security, 99.9% uptime, and robust data protection 
                  keep your business safe.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Mobile-First Design</CardTitle>
                <CardDescription>
                  Beautiful, responsive stores that work perfectly on mobile devices 
                  where most customers shop.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="w-8 h-8 text-primary mb-2" />
                <CardTitle>No Hidden Fees</CardTitle>
                <CardDescription>
                  Transparent pricing with no transaction fees, setup costs, or 
                  surprise charges. Pay only for what you use.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <HeadphonesIcon className="w-8 h-8 text-primary mb-2" />
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>
                  Dedicated customer support team available round the clock to 
                  help your business succeed.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful businesses already using BizShop to grow their online presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline">Browse Templates</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 BizShop. All rights reserved. Made with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  );
}