import { useQuery } from "@tanstack/react-query";
import { Store } from "@shared/schema";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { StoreCard } from "@/components/dashboard/store-card";
import { StoreLinkCard } from "@/components/dashboard/store-link-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const [_, navigate] = useLocation();
  
  const { 
    data: stores, 
    isLoading, 
    error 
  } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const handleCreateStore = () => {
    navigate("/store-setup");
  };

  // Conditional rendering for loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your stores...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - handle authentication errors gracefully
  if (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to access the dashboard.</p>
            <Button onClick={() => window.location.href = "/auth"}>
              Sign In
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16">
          <div className="bg-destructive/10 p-4 rounded-md text-destructive mb-6">
            <p>Error loading stores: {errorMessage}</p>
            <Button 
              onClick={handleCreateStore}
              className="mt-4"
            >
              Create Your First Store
            </Button>
          </div>
          
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No stores state
  if (!stores || stores.length === 0) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16">
          <div className="max-w-3xl mx-auto text-center py-12 sm:py-20">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Welcome to BizShop!</h1>
            <p className="text-muted-foreground mb-8 px-4">
              You haven't created any stores yet. Get started by creating your first store.
            </p>
            <AnimatedButton 
              onClick={handleCreateStore} 
              size="lg"
              variant="bounce"
              className="bg-primary hover:bg-primary-600 w-full sm:w-auto animate-pulse-slow"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Store
            </AnimatedButton>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard with stores
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 pt-16 md:pt-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
            <Button 
              onClick={handleCreateStore}
              className="bg-primary hover:bg-primary-600 w-full sm:w-auto"
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create New Store</span>
              <span className="sm:hidden">New Store</span>
            </Button>
          </div>
          
          {/* Store selector if multiple stores */}
          {stores.length > 1 && (
            <div className="mb-6">
              {/* Store selector component would go here */}
            </div>
          )}
          
          {/* Stores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <StoreCard 
                key={store.id} 
                store={store} 
                animationDelay={index * 100}
              />
            ))}
          </div>

          {/* Quick Stats and Store Link */}
          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Quick Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Stores</h3>
                  <p className="text-2xl font-bold text-primary">{stores.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground">Published Stores</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {stores.filter(s => s.isPublished).length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground">Draft Stores</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {stores.filter(s => !s.isPublished).length}
                  </p>
                </div>
              </div>
            </div>
            
            {stores.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Featured Store</h2>
                <StoreLinkCard store={stores[0]} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
