import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Store, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Heart, Star, Share2 } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function StorePreviewPage() {
  const [match, params] = useRoute("/preview/:storeId");
  const storeId = params?.storeId;

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

  if (storeLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading store preview...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-muted-foreground mb-6">The store you're looking for doesn't exist or isn't published.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Badge variant="secondary">Preview Mode</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Store Header */}
      <div 
        className="h-64 relative flex items-center justify-center"
        style={{ 
          background: `linear-gradient(135deg, ${store.primaryColor}, ${store.accentColor})` 
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            {store.logoUrl && (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-16 w-16 rounded-full mr-4 border-2 border-white/20"
              />
            )}
            <h1 className="text-4xl font-bold">{store.name}</h1>
          </div>
          <p className="text-xl opacity-90 mb-6">{store.description}</p>
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Shop Now
          </Button>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Discover our curated collection</p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
                    <img
                      src={product.imageUrl || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="rounded-full p-2">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ₹{product.priceInr?.toLocaleString()}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground ml-1">4.8</span>
                      </div>
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-muted-foreground">This store hasn't added any products yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Store Info Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
            <p className="text-muted-foreground">{store.description}</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Badge variant="outline">Template: {store.template}</Badge>
              <Badge variant="outline">
                {products?.length || 0} Products
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}