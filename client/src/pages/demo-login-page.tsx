import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2, User, Shield } from "lucide-react";

export default function DemoLoginPage() {
  const [_, navigate] = useLocation();
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const response = await apiRequest("POST", "/api/seed-demo");
      const data = await response.json();
      
      toast({
        title: "Demo Data Created",
        description: "Demo accounts and data have been set up successfully",
      });
    } catch (error) {
      // Demo data might already exist, continue anyway
      console.log("Demo data may already exist");
    }
    setIsSeeding(false);
  };

  const handleDemoLogin = async () => {
    try {
      await loginMutation.mutateAsync({ username: "demo", password: "password123" });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please create demo data first",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = async () => {
    try {
      await loginMutation.mutateAsync({ username: "admin", password: "admin123" });
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please create demo data first",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="BizShop" className="w-12 h-12 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">BizShop Demo</h1>
          </div>
          <p className="mt-2 text-gray-600">Access all features with demo accounts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>
              Set up demo data and login with pre-configured accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSeedDemo} 
              disabled={isSeeding}
              variant="outline" 
              className="w-full"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Demo Data...
                </>
              ) : (
                "Create Demo Data"
              )}
            </Button>

            <div className="space-y-3">
              <Button 
                onClick={handleDemoLogin}
                disabled={loginMutation.isPending}
                className="w-full"
              >
                <User className="mr-2 h-4 w-4" />
                {loginMutation.isPending ? "Logging in..." : "Login as Demo User"}
              </Button>

              <Button 
                onClick={handleAdminLogin}
                disabled={loginMutation.isPending}
                variant="secondary"
                className="w-full"
              >
                <Shield className="mr-2 h-4 w-4" />
                {loginMutation.isPending ? "Logging in..." : "Login as Admin"}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 text-center mb-3">
                Or create your own account
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                className="w-full"
              >
                Register New Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-sm"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}