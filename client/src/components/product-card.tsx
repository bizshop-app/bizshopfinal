import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Heart, Package } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  inventory: number;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
  className?: string;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onQuickView,
  className = ""
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (product.inventory === 0) return;
    
    setIsLoading(true);
    try {
      await onAddToCart?.(product.id);
    } finally {
      setIsLoading(false);
    }
  };

  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-xl overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                onClick={() => onQuickView?.(product.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant={isWishlisted ? "default" : "secondary"}
                className={`shadow-lg ${isWishlisted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/90 hover:bg-white text-gray-900'}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.inventory <= 5 && product.inventory > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Low Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Category */}
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}

          {/* Pricing */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.compareAtPrice}</span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              product.inventory > 10 ? 'bg-green-500' : 
              product.inventory > 0 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className={`text-xs font-medium ${
              product.inventory > 10 ? 'text-green-700' : 
              product.inventory > 0 ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {product.inventory > 10 ? 'In Stock' : 
               product.inventory > 0 ? `Only ${product.inventory} left` : 'Out of stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button 
            className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            disabled={product.inventory === 0 || isLoading}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? 'Adding...' : 
             product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}