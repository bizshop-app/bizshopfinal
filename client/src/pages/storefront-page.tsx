import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Store, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RazorpayCheckout } from "@/components/payment/razorpay-checkout";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Star,
  Heart,
  Search,
  Filter
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
}

interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}

export default function StorefrontPage() {
  const [storeId, setStoreId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Extract store ID from URL path
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/store\/(\d+)/);
    if (match) {
      setStoreId(parseInt(match[1]));
    }
  }, []);

  // Fetch store details
  const { data: store, isLoading: storeLoading } = useQuery<Store>({
    queryKey: ["/api/public/stores", storeId],
    enabled: !!storeId,
  });

  // Fetch store owner details to check subscription plan
  const { data: storeOwner } = useQuery({
    queryKey: ["/api/stores", storeId, "owner"],
    enabled: !!storeId,
  });

  // Fetch store products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/public/stores", storeId, "products"],
    enabled: !!storeId,
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", `/api/public/stores/${storeId}/orders`, orderData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      setCart([]);
      setShowCheckout(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { productId: product.id, product, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    const orderData = {
      customerName: checkoutData.customerName,
      customerEmail: checkoutData.customerEmail,
      totalAmount: getTotalPrice(),
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      paymentDetails: paymentData,
    };
    
    placeOrderMutation.mutate(orderData);
  };

  const filteredProducts = products?.filter(product =>
    product.isActive &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (storeLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground">The store you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-primary">{store.name}</h1>
              {store.description && (
                <p className="text-sm text-muted-foreground">{store.description}</p>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="relative"
              onClick={() => setShowCheckout(true)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "This store doesn't have any products yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-gray-100 rounded-t-lg relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.5</span>
                      </div>
                    </div>

                    {product.inventory !== null && product.inventory < 10 && (
                      <Badge variant="outline" className="text-orange-600">
                        Only {product.inventory} left
                      </Badge>
                    )}

                    <Button 
                      className="w-full"
                      onClick={() => addToCart(product)}
                      disabled={product.inventory === 0}
                    >
                      {product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Review your order and complete your purchase
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Cart Items */}
            <div>
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between py-2 border-b">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)} each
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="text-right pt-3 border-t">
                  <div className="text-lg font-bold">
                    Total: {formatPrice(getTotalPrice())}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="font-medium mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={checkoutData.customerName}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={checkoutData.customerEmail}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={checkoutData.customerPhone}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="Enter your phone"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Textarea
                  id="shippingAddress"
                  value={checkoutData.shippingAddress}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>
            </div>

            {/* Payment */}
            {cart.length > 0 && checkoutData.customerName && checkoutData.customerEmail && (
              <div className="flex justify-center">
                <RazorpayCheckout
                  planName={`Order from ${store.name}`}
                  planPrice={getTotalPrice()}
                  planFeatures={cart.map(item => `${item.quantity}x ${item.product.name}`)}
                  planId={`store_${storeId}_order`}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={() => setShowCheckout(false)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckout(false)}>
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}