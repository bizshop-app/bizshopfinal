import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Store, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, CreditCard, Truck, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface OrderItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export default function CheckoutPage() {
  const [match, params] = useRoute("/store/:storeId/checkout");
  const storeId = params?.storeId;
  const { toast } = useToast();
  
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    notes: "",
  });

  // Get cart items from localStorage
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${storeId}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [storeId]);

  const { data: store } = useQuery<Store>({
    queryKey: [`/api/public/stores/${storeId}`],
    enabled: !!storeId,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: [`/api/public/stores/${storeId}/products`],
    enabled: !!storeId,
  });

  // Enrich cart items with product details
  const enrichedCartItems = cartItems.map(item => ({
    ...item,
    product: products?.find(p => p.id === item.productId)
  })).filter(item => item.product);

  const subtotal = enrichedCartItems.reduce((total, item) => 
    total + (item.product?.priceInr || 0) * item.quantity, 0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const createOrderMutation = useMutation({
    mutationFn: async (orderDetails: any) => {
      const res = await apiRequest("POST", `/api/public/stores/${storeId}/orders`, orderDetails);
      return await res.json();
    },
    onSuccess: (order) => {
      // Clear cart
      localStorage.removeItem(`cart_${storeId}`);
      
      // Redirect to payment
      initiatePayment(order);
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const initiatePayment = async (order: any) => {
    try {
      const res = await apiRequest("POST", "/api/razorpay/orders", {
        amount: total,
        currency: "INR",
        orderId: order.id,
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
      });
      
      const paymentOrder = await res.json();
      
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: "rzp_live_SZPKtAYuluiEb6",
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          name: store?.name || "BizShop Store",
          description: `Order from ${store?.name}`,
          order_id: paymentOrder.id,
          prefill: {
            name: orderData.customerName,
            email: orderData.customerEmail,
            contact: orderData.customerPhone,
          },
          theme: {
            color: store?.primaryColor || "#3563E9",
          },
          handler: async (response: any) => {
            try {
              await apiRequest("POST", "/api/razorpay/verify", {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderId: order.id,
              });
              
              toast({
                title: "Payment Successful!",
                description: "Your order has been placed successfully.",
              });
              
              // Send order notification to store owner
              await apiRequest("POST", "/api/send-order-notification", {
                storeOwnerEmail: store?.email || "store@bizshop.com",
                orderDetails: {
                  id: order.id,
                  customerName: orderData.customerName,
                  totalAmount: total,
                  items: enrichedCartItems.map(item => ({
                    productName: item.product?.name || "",
                    quantity: item.quantity,
                    price: item.product?.priceInr || 0
                  }))
                }
              });

              // Redirect to success page
              window.location.href = `/store/${storeId}/order-success?orderId=${order.id}`;
            } catch (error) {
              toast({
                title: "Payment Verification Failed",
                description: "Please contact support.",
                variant: "destructive",
              });
            }
          },
          modal: {
            ondismiss: () => {
              toast({
                title: "Payment Cancelled",
                description: "You can complete the payment later.",
                variant: "destructive",
              });
            },
          },
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enrichedCartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      ...orderData,
      totalAmount: total,
      items: enrichedCartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: item.product?.priceInr || 0,
      })),
    });
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/store/${storeId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              {store.logoUrl && (
                <img src={store.logoUrl} alt={store.name} className="h-8 w-8 rounded-full" />
              )}
              <h1 className="text-lg font-semibold">{store.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={orderData.customerName}
                        onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={orderData.customerEmail}
                        onChange={(e) => setOrderData({...orderData, customerEmail: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      value={orderData.customerPhone}
                      onChange={(e) => setOrderData({...orderData, customerPhone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingAddress">Shipping Address *</Label>
                    <Textarea
                      id="shippingAddress"
                      value={orderData.shippingAddress}
                      onChange={(e) => setOrderData({...orderData, shippingAddress: e.target.value})}
                      required
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={orderData.notes}
                      onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                      rows={2}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center p-4">
                <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Multiple Options</p>
              </div>
              <div className="text-center p-4">
                <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Fast Delivery</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrichedCartItems.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4">
                    <img
                      src={item.product?.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"}
                      alt={item.product?.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{((item.product?.priceInr || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-sm text-green-600">Free shipping on orders over ₹500!</p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={createOrderMutation.isPending || enrichedCartItems.length === 0}
                >
                  {createOrderMutation.isPending ? "Processing..." : "Place Order & Pay"}
                  <CreditCard className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    Powered by Razorpay • Secure Payment Gateway
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}