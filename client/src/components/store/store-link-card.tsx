import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Copy, 
  Share2, 
  Eye,
  QrCode,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Store } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StoreLinkCardProps {
  store: Store;
}

export function StoreLinkCard({ store }: StoreLinkCardProps) {
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const getStoreUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/store/${store.id}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Store link has been copied successfully.",
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast({
        title: "Copied to clipboard",
        description: "Store link has been copied successfully.",
      });
    }
  };

  const shareStore = async () => {
    const url = getStoreUrl();
    const shareData = {
      title: `Visit ${store.name}`,
      text: `Check out ${store.name} - ${store.description || 'Amazing products at great prices!'}`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const openStore = () => {
    window.open(getStoreUrl(), '_blank');
  };

  const generateQRCode = () => {
    const url = getStoreUrl();
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Your Store Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={store.isPublished ? "default" : "outline"}>
            {store.isPublished ? "Live" : "Draft"}
          </Badge>
          {store.customDomain && (
            <Badge variant="secondary">Custom Domain</Badge>
          )}
        </div>

        <div className="space-y-3">
          {/* Store URL */}
          <div>
            <label className="text-sm font-medium mb-2 block">Store URL</label>
            <div className="flex gap-2">
              <Input
                value={getStoreUrl()}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(getStoreUrl())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Custom Domain (if available) */}
          {store.customDomain && (
            <div>
              <label className="text-sm font-medium mb-2 block">Custom Domain</label>
              <div className="flex gap-2">
                <Input
                  value={`https://${store.customDomain}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`https://${store.customDomain}`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={openStore} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Preview Store
          </Button>
          
          <Button variant="outline" onClick={shareStore}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>QR Code for {store.name}</DialogTitle>
                <DialogDescription>
                  Customers can scan this QR code to visit your store
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={generateQRCode()}
                  alt="Store QR Code"
                  className="border rounded-lg"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(getStoreUrl())}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Store Status Warning */}
        {!store.isPublished && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your store is currently in draft mode. 
              Customers won't be able to access it until you publish it from the settings page.
            </p>
          </div>
        )}

        {/* Store Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-xs text-muted-foreground">Total Visits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-xs text-muted-foreground">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-xs text-muted-foreground">Conversions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}