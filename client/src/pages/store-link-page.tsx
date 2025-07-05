import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Store, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AttractiveProductCard } from "@/components/store/attractive-product-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Heart, Star, Share2, Copy, ArrowLeft } from "lucide-react";
import { ShareStoreModal } from "@/components/store/share-store-modal";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function StoreLinkPage() {
  const [match, params] = useRoute("/store/:storeId");
  const storeId = params?.storeId;
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<{[key: number]: number}>({});
  const [showShareModal, setShowShareModal] = useState(false);

  const { 
    data: store, 
    isLoading: storeLoading 
  } = useQuery<Store>({
    queryKey: [`/api/public/stores/${storeId}`],
    enabled: !!storeId,
  });

  const { 
    data: products, 
    isLoading: productsLoading 
  } = useQuery<Product[]>({
    queryKey: [`/api/public/stores/${storeId}/products`],
    enabled: !!storeId,
  });

  const addToCart = (productId: number) => {
    const newCart = { ...cartItems, [productId]: (cartItems[productId] || 0) + 1 };
    setCartItems(newCart);
    
    // Save to localStorage for checkout
    const cartArray = Object.entries(newCart).map(([id, quantity]) => ({
      productId: parseInt(id),
      quantity
    }));
    localStorage.setItem(`cart_${storeId}`, JSON.stringify(cartArray));
    
    toast({
      title: "Added to cart",
      description: "Product added to your cart successfully!",
    });
  };

  const shareStore = () => {
    setShowShareModal(true);
  };

  if (storeLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-muted-foreground mb-6">The store you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cartTotal = Object.keys(cartItems).reduce((total, productId) => {
    const product = products?.find(p => p.id === parseInt(productId));
    return total + (product?.priceInr || 0) * cartItems[parseInt(productId)];
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {store.logoUrl && (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
                <p className="text-sm text-muted-foreground">Premium Store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={shareStore}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Store
              </Button>
              {Object.keys(cartItems).length > 0 && (
                <Link href={`/store/${storeId}/checkout`}>
                  <Button size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart ({Object.values(cartItems).reduce((a, b) => a + b, 0)})
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Store Hero */}
      <div 
        className="h-64 relative flex items-center justify-center"
        style={{ 
          background: `linear-gradient(135deg, ${store.primaryColor || '#3563E9'}, ${store.accentColor || '#F97316'})` 
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">{store.name}</h2>
          <p className="text-xl opacity-90 mb-6">{store.description}</p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {products?.length || 0} Products
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Fast Delivery
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Secure Payment
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h2>
          <p className="text-muted-foreground">Discover our premium collection</p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.filter(p => p.isActive).map((product) => (
              <AttractiveProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl p-12 max-w-md mx-auto shadow-lg">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-muted-foreground">This store is setting up their inventory. Check back soon!</p>
            </div>
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {Object.keys(cartItems).length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-2xl border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="font-medium">Cart Total</p>
                  <p className="text-2xl font-bold text-primary">₹{cartTotal.toLocaleString()}</p>
                </div>
                <Link href={`/store/${storeId}/checkout`}>
                  <Button size="lg" className="shadow-lg">
                    Checkout
                    <ShoppingCart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Store Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {store.logoUrl && (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <h3 className="text-2xl font-bold text-gray-900">{store.name}</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{store.description}</p>
            <div className="flex justify-center space-x-4 mb-6">
              <Badge variant="outline" className="text-sm">Secure Shopping</Badge>
              <Badge variant="outline" className="text-sm">Fast Delivery</Badge>
              <Badge variant="outline" className="text-sm">24/7 Support</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by <Link href="/"><span className="text-primary font-semibold">BizShop</span></Link> • 
              Secure payments with Razorpay
            </p>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      <ShareStoreModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        storeUrl={window.location.href}
        storeName={store.name}
        storeDescription={store.description}
      />
    </div>
  );
}