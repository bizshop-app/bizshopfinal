import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./product-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  MoreVertical, 
  Trash, 
  Eye, 
  EyeOff, 
  Loader2, 
  Package,
  Search, 
  PlusCircle
} from "lucide-react";

interface ProductListProps {
  storeId: number;
}

export function ProductList({ storeId }: ProductListProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  console.log("ProductList render - isEditingProduct:", isEditingProduct, "storeId:", storeId);

  // Fetch products for the store
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: [`/api/stores/${storeId}/products`],
  });

  // Toggle product active status mutation
  const toggleProductMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/products/${id}`, { isActive });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/products`] });
      toast({
        title: "Product updated",
        description: "Product visibility has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/products`] });
      toast({
        title: "Product deleted",
        description: "Product has been removed from your store.",
      });
      setProductToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setProductToDelete(null);
    },
  });

  // Handle editing a product
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditingProduct(true);
  };

  // Handle toggling product visibility
  const handleToggleVisibility = (product: Product) => {
    toggleProductMutation.mutate({
      id: product.id,
      isActive: !product.isActive,
    });
  };

  // Filter products based on search
  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase()) ||
      (product.categoryId && product.categoryId.toString().includes(search.toLowerCase()))
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        <p>Error loading products: {(error as Error).message}</p>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Products Yet</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Start building your product catalog to showcase items to customers.
        </p>
        <Button 
          onClick={(e) => {
            e.preventDefault();
            console.log("Add Product button clicked - current state:", { isEditingProduct, currentProduct });
            console.log("Setting isEditingProduct to true");
            setIsEditingProduct(true);
            setCurrentProduct(null);
            console.log("After setting - isEditingProduct should be true");
          }}
          className="bg-primary hover:bg-primary-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
    );
  }

  // Edit product view
  if (isEditingProduct) {
    console.log("Rendering ProductForm with storeId:", storeId, "productToEdit:", currentProduct);
    return (
      <ProductForm
        storeId={storeId}
        productToEdit={currentProduct}
        onSuccess={() => {
          console.log("ProductForm onSuccess called");
          setIsEditingProduct(false);
          setCurrentProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Products ({filteredProducts?.length || 0})</h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center border rounded-md px-3 py-2 flex-1 sm:flex-initial">
            <Search className="h-5 w-5 text-muted-foreground mr-2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
          </div>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              console.log("Add Product header button clicked - state:", { isEditingProduct, currentProduct });
              setIsEditingProduct(true);
              setCurrentProduct(null);
              console.log("Header button - set isEditingProduct to true");
            }}
            className="bg-primary hover:bg-primary-600 shadow-lg"
            size="lg"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Big Call-to-Action Add Product Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to add more products?</h3>
            <p className="text-gray-600">Expand your catalog and increase sales</p>
            <p className="text-sm text-gray-500">Current editing state: {isEditingProduct ? "EDITING" : "NOT EDITING"}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={(e) => {
                e.preventDefault();
                console.log("Big Add Product button clicked - state:", { isEditingProduct, currentProduct });
                setIsEditingProduct(true);
                setCurrentProduct(null);
                console.log("Big button - set isEditingProduct to true");
              }}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Another Product
            </Button>
            <Button 
              onClick={() => setIsEditingProduct(!isEditingProduct)}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Toggle State (DEBUG)
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Inventory</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {product.categoryId ? (
                    <Badge variant="outline">Category {product.categoryId}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  ₹{product.priceInr?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell className="text-center">
                  {product.inventory !== null && product.inventory !== undefined ? (
                    product.inventory
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={product.isActive ? "default" : "secondary"}
                    className={product.isActive ? "bg-green-500" : ""}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleVisibility(product)}
                      >
                        {product.isActive ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide Product
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Show Product
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog
                        open={productToDelete?.id === product.id}
                        onOpenChange={(open) => {
                          if (!open) setProductToDelete(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setProductToDelete(product);
                            }}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Product
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this product?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete the product from your store.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                if (productToDelete) {
                                  deleteProductMutation.mutate(productToDelete.id);
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleteProductMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Floating Action Button for Add Product */}
      <button
        onClick={(e) => {
          e.preventDefault();
          console.log("Floating Add Product button clicked - state:", { isEditingProduct, currentProduct });
          setIsEditingProduct(true);
          setCurrentProduct(null);
          console.log("Floating button - set isEditingProduct to true");
        }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 z-50 flex items-center gap-2 group"
        style={{ touchAction: 'manipulation' }}
      >
        <PlusCircle className="h-6 w-6" />
        <span className="hidden group-hover:inline-block pr-2 font-medium">Add Product</span>
      </button>
    </div>
  );
}
