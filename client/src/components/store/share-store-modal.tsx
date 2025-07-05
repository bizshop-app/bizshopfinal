import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, MessageCircle, Mail, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeUrl: string;
  storeName: string;
  storeDescription: string;
}

export function ShareStoreModal({ isOpen, onClose, storeUrl, storeName, storeDescription }: ShareStoreModalProps) {
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = useState(`Check out ${storeName} - ${storeDescription}`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storeUrl);
    toast({
      title: "Link copied!",
      description: "Store link has been copied to clipboard",
    });
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      action: () => {
        const message = encodeURIComponent(`${customMessage}\n\n${storeUrl}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
      }
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-blue-500",
      action: () => {
        const subject = encodeURIComponent(`Check out ${storeName}`);
        const body = encodeURIComponent(`${customMessage}\n\nVisit: ${storeUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      }
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      action: () => {
        const url = encodeURIComponent(storeUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      }
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      action: () => {
        const text = encodeURIComponent(`${customMessage} ${storeUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      }
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Share Your Store
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Store URL */}
          <div className="space-y-2">
            <Label htmlFor="store-url">Store Link</Label>
            <div className="flex space-x-2">
              <Input
                id="store-url"
                value={storeUrl}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message</Label>
            <textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add a personal message..."
            />
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Label>Share via</Label>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.name}
                    variant="outline"
                    onClick={option.action}
                    className="flex items-center space-x-2 h-12"
                  >
                    <div className={`p-1 rounded ${option.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span>{option.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Direct Share */}
          <div className="pt-4 border-t">
            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: storeName,
                    text: customMessage,
                    url: storeUrl,
                  });
                } else {
                  copyToClipboard();
                }
              }}
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Store
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}