import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>BizShop Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-gray-700">
                  We collect information you provide directly to us, such as when you create an account, make a purchase,
                  or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Name and contact information</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Account credentials</li>
                  <li>Product reviews and ratings</li>
                  <li>Communications with customer support</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-gray-700">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
                <p className="text-gray-700">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>With your consent</li>
                  <li>To service providers who assist in our operations</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your personal information against unauthorized access,
                  alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments</li>
                  <li>Limited access to personal information</li>
                  <li>Secure payment processing through Stripe</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Cookies and Tracking</h2>
                <p className="text-gray-700">
                  We use cookies and similar tracking technologies to track activity on our service and collect certain information.
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Third-Party Services</h2>
                <p className="text-gray-700">
                  Our service may contain links to third-party websites or services. We are not responsible for the privacy
                  practices of these third parties. We integrate with:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Stripe for payment processing</li>
                  <li>SendGrid for email communications</li>
                  <li>Analytics services for usage tracking</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
                <p className="text-gray-700">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Lodge a complaint with supervisory authorities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Data Retention</h2>
                <p className="text-gray-700">
                  We retain your personal information for as long as necessary to provide our services,
                  comply with legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. International Transfers</h2>
                <p className="text-gray-700">
                  Your information may be transferred to and processed in countries other than your own.
                  We ensure appropriate safeguards are in place to protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our service is not directed to children under 13. We do not knowingly collect personal information
                  from children under 13. If you become aware that a child has provided us with personal information,
                  please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
                <p className="text-gray-700">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting
                  the new privacy policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at privacy@bizshop.com.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}