import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Tag, Percent, Edit, Trash } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Store, DiscountCode } from "@shared/schema";

export default function DiscountsPage() {
  const { toast } = useToast();
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    usageLimit: '',
    expiresAt: '',
    isActive: true
  });

  // Fetch user's stores
  const { data: stores, isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  // Auto-select first store if only one exists
  const storeToUse = selectedStoreId 
    ? stores?.find(s => s.id === selectedStoreId) 
    : stores?.[0];

  // Fetch discount codes for selected store
  const { data: discountCodes, isLoading: discountsLoading } = useQuery<DiscountCode[]>({
    queryKey: [`/api/stores/${storeToUse?.id}/discount-codes`],
    enabled: !!storeToUse?.id,
  });

  // Create discount mutation
  const createDiscountMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/stores/${storeToUse?.id}/discount-codes`, data);
      if (!response.ok) {
        throw new Error('Failed to create discount code');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeToUse?.id}/discount-codes`] });
      toast({
        title: "Discount created!",
        description: "Your discount code has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        description: '',
        usageLimit: '',
        expiresAt: '',
        isActive: true
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create discount",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.value) {
      toast({
        title: "Missing information",
        description: "Please enter code and value.",
        variant: "destructive",
      });
      return;
    }

    const discountData = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      description: formData.description,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      isActive: formData.isActive
    };

    console.log("Creating discount:", discountData);
    createDiscountMutation.mutate(discountData);
  };

  if (storesLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50/50">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16">
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50/50">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">No Stores Found</h2>
            <p className="text-muted-foreground mb-6">
              You need to create a store first before managing discounts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Discounts</h1>
                <p className="text-muted-foreground mt-2">
                  Create and manage discount codes for your store
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <AnimatedButton 
                    variant="bounce" 
                    className="gap-2"
                    onClick={() => {
                      console.log("Create Discount button clicked");
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Create Discount
                  </AnimatedButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Discount Code</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateDiscount} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Discount Code*</Label>
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                          placeholder="SAVE20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="value">Value*</Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        placeholder={formData.type === 'percentage' ? '10' : '100'}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="10% off on all items"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="usageLimit">Usage Limit</Label>
                        <Input
                          id="usageLimit"
                          type="number"
                          value={formData.usageLimit}
                          onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiresAt">Expires At</Label>
                        <Input
                          id="expiresAt"
                          type="date"
                          value={formData.expiresAt}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createDiscountMutation.isPending}>
                        {createDiscountMutation.isPending ? 'Creating...' : 'Create Discount'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="animate-fade-in hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Discounts</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Tag className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in hover-lift stagger-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Uses</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Percent className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in hover-lift stagger-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
                    <p className="text-2xl font-bold">₹0</p>
                  </div>
                  <Tag className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="animate-fade-in stagger-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Discount Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No discount codes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create discount codes to boost sales and reward customers
                </p>
                <AnimatedButton 
                  variant="glow"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Discount
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}