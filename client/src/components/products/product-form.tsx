import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, InsertProduct } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { AIContentGenerator } from "@/components/ai-content-generator";
import { AIDescriptionGenerator } from "@/components/ai/ai-description-generator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
  storeId: number;
  productToEdit?: any; // Optional product data if editing
  onSuccess: () => void;
}

// Extended schema with validation
const productFormSchema = insertProductSchema.extend({
  priceInr: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, "Price must be at least ₹1")
  ),
  inventory: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().int().nonnegative("Inventory cannot be negative")
  ),
});

export function ProductForm({ storeId, productToEdit, onSuccess }: ProductFormProps) {
  console.log("ProductForm component rendered with storeId:", storeId, "productToEdit:", productToEdit);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Set up the form
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      storeId: storeId,
      name: productToEdit?.name ?? "",
      description: productToEdit?.description ?? "",
      priceInr: productToEdit?.priceInr ?? undefined,
      imageUrl: productToEdit?.imageUrl ?? "",
      tags: productToEdit?.tags ?? "",
      sku: productToEdit?.sku ?? "",
      compareAtPrice: productToEdit?.compareAtPrice ?? undefined,
      categoryId: productToEdit?.categoryId ?? undefined,
      inventory: productToEdit?.inventory ?? 0,
      isActive: productToEdit?.isActive ?? true,
    },
  });

  // Create or update product mutation
  const productMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      if (productToEdit) {
        // Update existing product
        const res = await apiRequest(
          "PUT",
          `/api/products/${productToEdit.id}`,
          data
        );
        return await res.json();
      } else {
        // Create new product
        const res = await apiRequest(
          "POST",
          `/api/stores/${storeId}/products`,
          data
        );
        return await res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: productToEdit ? "Product updated" : "Product created",
        description: productToEdit
          ? "Your product has been updated successfully."
          : "Your product has been added to your store.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/products`] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle file upload completion
  const handleUploadComplete = (url: string) => {
    form.setValue("imageUrl", url);
  };

  // Submit handler
  const onSubmit = (values: z.infer<typeof productFormSchema>) => {
    productMutation.mutate(values as InsertProduct);
  };

  // Category options
  const categories = [
    "Clothing",
    "Electronics",
    "Home & Garden",
    "Beauty",
    "Sports",
    "Toys",
    "Books",
    "Food",
    "Other",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{productToEdit ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          {productToEdit
            ? "Update your product details"
            : "Add a new product to your store"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter product name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceInr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <Input
                            type="number"
                            step="1"
                            min="1"
                            placeholder="0"
                            className="pl-7"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="gaming, electronics, accessories"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated tags for better searchability
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="PROD-001"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Stock Keeping Unit for inventory tracking
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product..."
                          rows={5}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* AI Content Generator */}
                <div className="mt-6">
                  <AIContentGenerator
                    productInfo={{
                      name: form.watch("name"),
                      category: form.watch("category"),
                      price: form.watch("price"),
                      description: form.watch("description"),
                      tags: form.watch("tags"),
                    }}
                    onContentGenerated={(content) => {
                      if (content.description) {
                        form.setValue("description", content.description);
                      }
                      if (content.title) {
                        form.setValue("name", content.title);
                      }
                      if (content.tags) {
                        form.setValue("tags", content.tags);
                      }
                    }}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Product</FormLabel>
                        <FormDescription>
                          Make this product visible in your store
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={Boolean(field.value)}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Product Image
                  </label>
                  <FileUpload
                    onFileSelect={setSelectedFile}
                    onUploadComplete={handleUploadComplete}
                    currentImageUrl={form.getValues("imageUrl")}
                    maxSize={5}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a product image (PNG, JPG, GIF up to 5MB)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between mt-5">
            <Button variant="outline" type="button" onClick={onSuccess}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={productMutation.isPending}
              className="bg-primary hover:bg-primary-600"
            >
              {productMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {productToEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{productToEdit ? "Update Product" : "Create Product"}</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
