export default function CancellationRefundsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Cancellations and Refunds</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Our policy for order cancellations, returns, and refunds on the BizShop platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Overview</h2>
            <p className="text-muted-foreground mb-4">
              Each store on the BizShop platform may have its own cancellation and refund policy. This document outlines 
              the general guidelines and BizShop's role in facilitating cancellations and refunds.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Order Cancellation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-green-800">Before Dispatch</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Orders can be cancelled within 24 hours</li>
                  <li>• Full refund will be processed</li>
                  <li>• Contact store owner immediately</li>
                  <li>• Cancellation usually processed instantly</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-amber-800">After Dispatch</h3>
                <ul className="space-y-2 text-amber-700">
                  <li>• Cancellation may not be possible</li>
                  <li>• Return process applies instead</li>
                  <li>• Contact store owner for options</li>
                  <li>• Shipping charges may apply</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Return Policy</h2>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">Return Window</h3>
                <p className="text-muted-foreground mb-3">
                  Most stores offer a return window of 7-30 days from delivery date. Check individual store policies for specific timeframes.
                </p>
                <div className="bg-muted/50 p-4 rounded">
                  <p className="text-sm font-medium">Standard Return Periods:</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Electronics: 7-14 days</li>
                    <li>• Clothing & Fashion: 15-30 days</li>
                    <li>• Home & Garden: 7-15 days</li>
                    <li>• Books & Media: 7-14 days</li>
                  </ul>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">Return Conditions</h3>
                <p className="text-muted-foreground mb-3">Items must meet the following conditions for returns:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Item must be in original condition</li>
                  <li>• Original packaging and tags intact</li>
                  <li>• No signs of use or wear</li>
                  <li>• All accessories and manuals included</li>
                  <li>• Return initiated within the allowed timeframe</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Refund Process</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold">Initiate Return</h3>
                  <p className="text-muted-foreground">Contact the store owner to request a return and receive return instructions</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold">Package Return</h3>
                  <p className="text-muted-foreground">Pack the item securely and ship it back to the store's return address</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold">Inspection</h3>
                  <p className="text-muted-foreground">Store owner inspects the returned item to verify condition</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold">Refund Processing</h3>
                  <p className="text-muted-foreground">Once approved, refund is processed within 5-7 business days</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Refund Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border text-center">
                <h3 className="font-semibold mb-2">Original Payment Method</h3>
                <p className="text-sm text-muted-foreground">Refunds processed back to the original payment method used</p>
              </div>
              <div className="bg-card p-6 rounded-lg border text-center">
                <h3 className="font-semibold mb-2">Bank Transfer</h3>
                <p className="text-sm text-muted-foreground">Direct bank transfer for cash on delivery orders</p>
              </div>
              <div className="bg-card p-6 rounded-lg border text-center">
                <h3 className="font-semibold mb-2">Store Credit</h3>
                <p className="text-sm text-muted-foreground">Some stores may offer store credit for faster processing</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Non-Returnable Items</h2>
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-red-800">Items that cannot be returned:</h3>
              <ul className="space-y-2 text-red-700">
                <li>• Perishable goods (food, flowers, etc.)</li>
                <li>• Personal care and hygiene products</li>
                <li>• Custom or personalized items</li>
                <li>• Digital downloads and software</li>
                <li>• Gift cards and vouchers</li>
                <li>• Items marked as "Final Sale"</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Defective or Wrong Items</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Special Return Process</h3>
              <p className="text-blue-700 mb-3">
                If you receive a defective, damaged, or wrong item:
              </p>
              <ul className="space-y-2 text-blue-700">
                <li>• Take photos of the issue immediately</li>
                <li>• Contact the store owner within 48 hours</li>
                <li>• Full refund or replacement provided</li>
                <li>• Return shipping costs covered by store</li>
                <li>• Expedited resolution process</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Subscription Services</h2>
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">BizShop Platform Subscriptions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 14-day free trial for new users</li>
                  <li>• Cancel anytime during trial without charges</li>
                  <li>• Monthly subscriptions can be cancelled anytime</li>
                  <li>• No refunds for partial months used</li>
                  <li>• Account remains active until end of billing cycle</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Dispute Resolution</h2>
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">If you have issues with returns or refunds:</h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. First, contact the store owner directly</li>
                  <li>2. If unresolved, contact BizShop support at <strong>support@bizshop.in</strong></li>
                  <li>3. We will mediate between you and the store owner</li>
                  <li>4. Our support team will work towards a fair resolution</li>
                  <li>5. Escalation to payment processor if needed</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-muted-foreground mb-4">
                For cancellation and refund assistance:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Email: <strong>support@bizshop.in</strong></li>
                <li>• Phone: <strong>+91 9876543210</strong></li>
                <li>• Hours: Monday-Friday, 9 AM - 6 PM IST</li>
                <li>• Response time: Within 24 hours</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Policy Updates</h2>
            <p className="text-muted-foreground">
              This cancellation and refund policy may be updated from time to time to reflect changes in our services 
              or legal requirements. The latest version will always be available on this page. 
              Last updated: December 2024.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}