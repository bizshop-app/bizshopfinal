export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Information about shipping and delivery for orders placed through BizShop stores
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Overview</h2>
            <p className="text-muted-foreground mb-4">
              This shipping policy applies to all orders placed through stores created on the BizShop platform. 
              Individual store owners are responsible for fulfilling orders and may have their own specific shipping policies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Shipping Responsibility</h2>
            <div className="bg-muted/50 p-6 rounded-lg mb-4">
              <h3 className="text-xl font-semibold mb-3">Store Owner Responsibility</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Each store owner is responsible for shipping their own products</li>
                <li>• Store owners set their own shipping rates and delivery timeframes</li>
                <li>• Packaging and handling of orders is managed by individual store owners</li>
                <li>• Tracking information is provided by the respective store owner</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Delivery Timeframes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">Domestic Shipping (India)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Standard Delivery: 3-7 business days</li>
                  <li>• Express Delivery: 1-3 business days</li>
                  <li>• Same Day Delivery: Available in select cities</li>
                </ul>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">International Shipping</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Standard International: 7-21 business days</li>
                  <li>• Express International: 3-7 business days</li>
                  <li>• Availability varies by store</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Shipping Costs</h2>
            <p className="text-muted-foreground mb-4">
              Shipping costs are determined by individual store owners and may vary based on:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li>• Product weight and dimensions</li>
              <li>• Delivery location and distance</li>
              <li>• Shipping method selected</li>
              <li>• Order value (some stores offer free shipping above certain amounts)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Order Processing</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold">Order Confirmation</h3>
                  <p className="text-muted-foreground">Orders are processed within 24-48 hours of payment confirmation</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold">Packaging</h3>
                  <p className="text-muted-foreground">Items are carefully packaged by the store owner</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold">Dispatch</h3>
                  <p className="text-muted-foreground">Package is handed over to the shipping carrier</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold">Tracking</h3>
                  <p className="text-muted-foreground">Tracking information is shared with the customer</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Delivery Issues</h2>
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-amber-800">What to do if your order is delayed</h3>
              <ul className="space-y-2 text-amber-700">
                <li>• Contact the store owner directly through the store's contact information</li>
                <li>• Check tracking information for updates</li>
                <li>• If the issue persists, contact BizShop support for assistance</li>
                <li>• We will help facilitate communication between you and the store owner</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Address Changes</h2>
            <p className="text-muted-foreground mb-4">
              Address changes can only be made before the order is dispatched. Contact the store owner immediately 
              if you need to change your delivery address. Once an order is shipped, address changes may not be possible.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Damaged or Lost Packages</h2>
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">Damaged Packages</h3>
                <p className="text-muted-foreground">
                  If you receive a damaged package, take photos of the damage and contact the store owner within 48 hours. 
                  Most stores will arrange for a replacement or refund.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">Lost Packages</h3>
                <p className="text-muted-foreground">
                  If your package is marked as delivered but you haven't received it, first check with neighbors 
                  and building management. If still not found, contact the store owner to initiate a claim with the shipping carrier.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-muted-foreground mb-4">
                For shipping-related inquiries:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• First contact the individual store owner for order-specific questions</li>
                <li>• For platform-related shipping issues, contact BizShop support at <strong>support@bizshop.in</strong></li>
                <li>• Phone support: <strong>+91 9876543210</strong></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Policy Updates</h2>
            <p className="text-muted-foreground">
              This shipping policy may be updated from time to time. The latest version will always be available on this page. 
              Last updated: December 2024.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}