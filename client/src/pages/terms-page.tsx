export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our service
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              These Terms and Conditions ("Terms") govern your use of BizShop's website creation and e-commerce platform 
              ("Service") operated by BizShop Technologies Pvt Ltd ("us", "we", or "our").
            </p>
            <p className="text-muted-foreground">
              Our registered office is located at 123 Tech Park, Sector 5, Gurgaon, Haryana 122001, India.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">2. Acceptance of Terms</h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-muted-foreground mb-4">
                By accessing and using our Service, you accept and agree to be bound by the terms and provisions of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-muted-foreground">
                These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">3. Contact Information</h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Email: <strong>legal@bizshop.in</strong></li>
                <li>• Phone: <strong>+91 9876543210</strong></li>
                <li>• Address: <strong>123 Tech Park, Sector 5, Gurgaon, Haryana 122001, India</strong></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Effective Date</h2>
            <p className="text-muted-foreground">
              These Terms and Conditions are effective as of December 2024 and were last updated on December 19, 2024.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}