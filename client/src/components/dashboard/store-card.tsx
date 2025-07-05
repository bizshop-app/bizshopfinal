import { Store } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Settings, Eye, BarChart3, Package } from "lucide-react";
import { Link } from "wouter";

interface StoreCardProps {
  store: Store;
  animationDelay?: number;
}

export function StoreCard({ store, animationDelay = 0 }: StoreCardProps) {
  return (
    <Card 
      className="hover-lift animate-fade-in transition-all duration-300 group"
      style={{ 
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'both'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {store.logoUrl && (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div>
              <CardTitle className="text-lg">{store.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Template: {store.template}
              </p>
            </div>
          </div>
          <Badge variant={store.isPublished ? "default" : "secondary"}>
            {store.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {store.description}
        </p>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>0 Products</span>
          </div>
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>₹0 Revenue</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/preview/${store.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Link>
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link href={`/store/${store.id}/settings`}>
            <Settings className="h-4 w-4 mr-1" />
            Manage
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}