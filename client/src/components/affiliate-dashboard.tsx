import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  IndianRupee, 
  Copy, 
  Share2, 
  TrendingUp,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AffiliateDashboard() {
  const [affiliateCode] = useState("BIZSHOP-REF-123"); // Mock for demo
  const { toast } = useToast();

  // Mock data - in real app, fetch from API
  const affiliateStats = {
    totalEarnings: 2500,
    totalReferrals: 25,
    pendingCommissions: 800,
    thisMonthReferrals: 8
  };

  const recentReferrals = [
    { id: 1, email: "user1@example.com", status: "paid", commission: 100, date: "2025-06-15" },
    { id: 2, email: "user2@example.com", status: "pending", commission: 100, date: "2025-06-18" },
    { id: 3, email: "user3@example.com", status: "paid", commission: 100, date: "2025-06-20" },
  ];

  const copyAffiliateLink = () => {
    const link = `https://bizshop.app/?ref=${affiliateCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Your affiliate link has been copied to clipboard",
    });
  };

  const shareOnSocial = (platform: string) => {
    const link = `https://bizshop.app/?ref=${affiliateCode}`;
    const text = "Start your online store with BizShop! Easy setup, powerful features, and great support.";
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{affiliateStats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliateStats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              All time referrals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{affiliateStats.pendingCommissions}</div>
            <p className="text-xs text-muted-foreground">
              Pending commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliateStats.thisMonthReferrals}</div>
            <p className="text-xs text-muted-foreground">
              New referrals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={`https://bizshop.app/?ref=${affiliateCode}`}
              readOnly
              className="flex-1"
            />
            <Button onClick={copyAffiliateLink} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => shareOnSocial('twitter')} 
              variant="outline" 
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button 
              onClick={() => shareOnSocial('facebook')} 
              variant="outline" 
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button 
              onClick={() => shareOnSocial('linkedin')} 
              variant="outline" 
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Share your unique referral link</li>
              <li>• Earn ₹100 for every store created through your link</li>
              <li>• Get paid monthly to your bank account</li>
              <li>• Track your earnings in real-time</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReferrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>{referral.email}</TableCell>
                  <TableCell>₹{referral.commission}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={referral.status === 'paid' ? 'default' : 'secondary'}
                    >
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{referral.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}