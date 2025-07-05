import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Package, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderNotificationProps {
  storeOwnerEmail: string;
  orderDetails: {
    id: string;
    customerName: string;
    totalAmount: number;
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
    }>;
  };
  onDismiss: () => void;
}

export function OrderNotification({ storeOwnerEmail, orderDetails, onDismiss }: OrderNotificationProps) {
  const { toast } = useToast();

  useEffect(() => {
    // Send email notification to store owner
    const sendNotification = async () => {
      try {
        const response = await fetch("/api/send-order-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeOwnerEmail,
            orderDetails
          })
        });

        if (response.ok) {
          toast({
            title: "Order Notification Sent",
            description: "Store owner has been notified of the new order.",
          });
        }
      } catch (error) {
        console.error("Failed to send order notification:", error);
      }
    };

    sendNotification();
  }, [storeOwnerEmail, orderDetails, toast]);

  return (
    <Card className="fixed bottom-6 right-6 w-96 z-50 border-green-200 bg-green-50 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
              <Bell className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">New Order Received!</h3>
              <p className="text-sm text-green-700">Order #{orderDetails.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-green-700">Customer:</span>
            <span className="font-medium text-green-900">{orderDetails.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-700">Total:</span>
            <span className="font-bold text-green-900">₹{orderDetails.totalAmount.toLocaleString()}</span>
          </div>
          <div className="text-sm text-green-700">
            Items: {orderDetails.items.length} products
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="default" className="bg-green-600">
            <Package className="h-3 w-3 mr-1" />
            Ready to Process
          </Badge>
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Notification sent to {storeOwnerEmail}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}