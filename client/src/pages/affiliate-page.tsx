import { Sidebar } from "@/components/dashboard/sidebar";
import { AffiliateDashboard } from "@/components/affiliate-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, IndianRupee, Gift, TrendingUp } from "lucide-react";

export default function AffiliatePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 pt-16 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Affiliate Program</h1>
                <p className="text-gray-600">Earn ₹100 for every store you refer</p>
              </div>
            </div>
          </div>

          {/* Program Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              <CardContent className="p-6 text-center">
                <IndianRupee className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 mb-2">₹100 Per Referral</h3>
                <p className="text-green-700">Earn money for every successful store creation</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Real-time Tracking</h3>
                <p className="text-blue-700">Monitor your referrals and earnings instantly</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <Gift className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Monthly Payouts</h3>
                <p className="text-purple-700">Get paid directly to your bank account</p>
              </CardContent>
            </Card>
          </div>

          {/* Affiliate Dashboard */}
          <AffiliateDashboard />
        </div>
      </div>
    </div>
  );
}