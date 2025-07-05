import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star, Eye, Zap } from "lucide-react";
import { useState } from "react";

interface AttractiveProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  onQuickView?: (product: Product) => void;
}

export function AttractiveProductCard({ product, onAddToCart, onQuickView }: AttractiveProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const discountPercentage = Math.floor(Math.random() * 30) + 10; // Simulated discount
  const originalPrice = Math.floor((product.priceInr || 0) * 1.3);

  return (
    <Card 
      className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-red-500 text-white font-bold px-2 py-1 text-xs">
          {discountPercentage}% OFF
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className={`absolute top-3 right-3 z-10 flex flex-col space-y-2 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}>
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full p-2 shadow-lg bg-white/90 hover:bg-white"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
        {onQuickView && (
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full p-2 shadow-lg bg-white/90 hover:bg-white"
            onClick={() => onQuickView(product)}
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
        )}
      </div>

      <CardContent className="p-0">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
          <img
            src={product.imageUrl || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Features */}
          <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs px-2 py-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Fast Ship
                </Badge>
              </div>
              <div className="flex items-center space-x-1 bg-white/90 rounded px-2 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs font-medium text-gray-800 ml-1">4.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 space-y-4">
          {/* Product Name & Category */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">
                  ₹{product.priceInr?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium">
                You save ₹{(originalPrice - (product.priceInr || 0)).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stock & Urgency */}
          {product.inventory && product.inventory < 10 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800 font-medium text-center">
                🔥 Only {product.inventory} left in stock!
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
            onClick={() => onAddToCart(product.id)}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          {/* Trust Indicators */}
          <div className="flex justify-center space-x-4 pt-2 text-xs text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Secure Payment
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Free Returns
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}