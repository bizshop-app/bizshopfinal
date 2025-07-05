import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Plus, Grid3X3 } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                <p className="text-muted-foreground mt-2">
                  Organize your products into categories
                </p>
              </div>
              <AnimatedButton variant="bounce" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </AnimatedButton>
            </div>
          </div>

          <Card className="animate-fade-in stagger-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="h-5 w-5" />
                Product Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Grid3X3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create categories to organize your products better
                </p>
                <AnimatedButton variant="glow">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}