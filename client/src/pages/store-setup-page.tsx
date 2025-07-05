import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TemplateSelector } from "@/components/store/template-selector";
import { BrandingForm } from "@/components/store/branding-form";
import { Template, InsertStore } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StoreSetupPage() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("template");
  
  // Get template from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTemplate = urlParams.get('template') || 'boutique';
  
  const [storeData, setStoreData] = useState<Partial<InsertStore>>({
    name: "",
    description: "",
    template: selectedTemplate,
    primaryColor: "#3563E9",
    accentColor: "#F97316",
    fontFamily: "Inter",
  });

  // Fetch templates
  const { 
    data: templates, 
    isLoading: templatesLoading 
  } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  // Create store mutation
  const createStoreMutation = useMutation({
    mutationFn: async (store: InsertStore) => {
      const res = await apiRequest("POST", "/api/stores", store);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Store created successfully!",
        description: "Your store has been created. You can now add products.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create store",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTemplateSelect = (templateId: string) => {
    setStoreData({
      ...storeData,
      template: templateId,
    });
  };

  const handleBrandingChange = (branding: Partial<InsertStore>) => {
    setStoreData({
      ...storeData,
      ...branding,
    });
  };

  const handleSubmit = () => {
    if (!storeData.name) {
      toast({
        title: "Store name required",
        description: "Please provide a name for your store",
        variant: "destructive",
      });
      setActiveTab("branding");
      return;
    }

    createStoreMutation.mutate(storeData as InsertStore);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 pt-16 md:pt-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Set Up Your Store</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Customize your store's appearance and branding
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Store Configuration</CardTitle>
              <CardDescription>
                Choose how your store will look and feel to your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="template">Choose Template</TabsTrigger>
                  <TabsTrigger value="branding">Store Branding</TabsTrigger>
                </TabsList>

                <TabsContent value="template">
                  {templatesLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p>Loading templates...</p>
                    </div>
                  ) : (
                    <TemplateSelector
                      templates={templates || []}
                      selectedTemplate={storeData.template || ""}
                      onSelect={handleTemplateSelect}
                    />
                  )}
                </TabsContent>

                <TabsContent value="branding">
                  <BrandingForm
                    initialValues={storeData}
                    onChange={handleBrandingChange}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createStoreMutation.isPending}
                className="bg-primary hover:bg-primary-600"
              >
                {createStoreMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Store...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Store
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
