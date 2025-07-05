import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText, Phone, Truck, RotateCcw } from "lucide-react";

export default function PoliciesPage() {
  const policies = [
    {
      title: "Contact Us",
      description: "Get in touch with our support team for any questions or assistance",
      href: "/contact",
      icon: <Phone className="h-8 w-8 text-primary" />
    },
    {
      title: "Shipping Policy", 
      description: "Information about shipping, delivery timeframes, and shipping costs",
      href: "/shipping-policy",
      icon: <Truck className="h-8 w-8 text-primary" />
    },
    {
      title: "Terms and Conditions",
      description: "Legal terms and conditions for using our platform and services",
      href: "/terms",
      icon: <FileText className="h-8 w-8 text-primary" />
    },
    {
      title: "Cancellations and Refunds",
      description: "Our policy for order cancellations, returns, and refund processes",
      href: "/cancellation-refunds", 
      icon: <RotateCcw className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Policies & Information</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Access all important policies and contact information for BizShop
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {policies.map((policy, index) => (
            <Link key={index} href={policy.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {policy.icon}
                    <div>
                      <CardTitle className="text-xl">{policy.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {policy.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-primary font-medium">
                    Click to view →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Quick Access Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Contact Us
            </Link>
            <Link href="/shipping-policy" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors">
              Shipping Policy
            </Link>
            <Link href="/terms" className="bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/90 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cancellation-refunds" className="bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors">
              Cancellations & Refunds
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}