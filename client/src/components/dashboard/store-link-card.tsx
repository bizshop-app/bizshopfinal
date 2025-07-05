import { Store } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, Share2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "wouter";

interface StoreLinkCardProps {
  store: Store;
}

export function StoreLinkCard({ store }: StoreLinkCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const storeUrl = `${window.location.origin}/store/${store.id}`;
  
  const copyStoreLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    toast({
      title: "Store link copied!",
      description: "Share this link with your customers",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareStore = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Check out ${store.name} - ${store.description}`,
        url: storeUrl,
      });
    } else {
      copyStoreLink();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Store Link</span>
          <Badge variant={store.isPublished ? "default" : "secondary"}>
            {store.isPublished ? "Live" : "Draft"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Share this link with your customers:
          </p>
          <div className="flex space-x-2">
            <Input 
              value={storeUrl}
              readOnly
              className="text-sm"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={copyStoreLink}
              className="shrink-0"
            >
              {copied ? "Copied!" : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href={`/store/${store.id}`} target="_blank">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Store
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={shareStore} className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Template</p>
              <p className="font-medium capitalize">{store.template}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">{store.isPublished ? "Published" : "Draft"}</p>
            </div>
          </div>
        </div>

        {!store.isPublished && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              Your store is in draft mode. Publish it to make it visible to customers.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}