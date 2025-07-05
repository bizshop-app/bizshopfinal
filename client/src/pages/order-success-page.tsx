import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrderSuccessPage() {
  const [match, params] = useRoute("/store/:storeId/order-success");
  const storeId = params?.storeId;
  const { toast } = useToast();
  
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  const { data: order } = useQuery({
    queryKey: [`/api/public/stores/${storeId}/orders/${orderId}`],
    enabled: !!storeId && !!orderId,
  });

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: "Order Placed Successfully!",
        text: `I just placed an order! Order #${orderId}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share your order with friends",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Badge variant="default">Confirmed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">#{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge variant="default" className="bg-green-600">Paid</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Status</p>
                <Badge variant="secondary">Processing</Badge>
              </div>
            </div>

            {order && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{order.customerEmail}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <p className="font-semibold">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Order Confirmed</p>
                  <p className="text-sm text-muted-foreground">Your order has been received and confirmed</p>
                </div>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleTimeString()}</p>
              </div>
              
              <div className="flex items-center space-x-4 opacity-50">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                  <Package className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Preparing for Shipment</p>
                  <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              
              <div className="flex items-center space-x-4 opacity-50">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                  <Truck className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Shipped</p>
                  <p className="text-sm text-muted-foreground">Your order is on the way</p>
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Order Confirmation Email</h3>
              <p className="text-sm text-blue-800">
                You'll receive a confirmation email with tracking details within 2-4 hours.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Estimated Delivery</h3>
              <p className="text-sm text-green-800">
                Your order will be delivered within 3-5 business days.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href={`/store/${storeId}`}>
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
              <Button onClick={shareOrder} variant="outline" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" />
                Share Order
              </Button>
              <Button className="w-full sm:w-auto">
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Need help? Contact support or visit our help center.</p>
          <p className="mt-2">
            Powered by <Link href="/"><span className="text-primary font-semibold">BizShop</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
}