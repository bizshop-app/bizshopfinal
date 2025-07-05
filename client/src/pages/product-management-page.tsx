import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ProductList } from "@/components/products/product-list";
import { Store } from "@shared/schema";

export default function ProductManagementPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // Fetch user's stores
  const { data: stores, isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  // Auto-select first store if only one exists
  const storeToUse = selectedStoreId 
    ? stores?.find(s => s.id === selectedStoreId) 
    : stores?.[0];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16">
        <div className="max-w-7xl mx-auto">
          {storesLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : !stores || stores.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">No Stores Found</h2>
              <p className="text-muted-foreground mb-6">
                You need to create a store first before managing products.
              </p>
            </div>
          ) : (
            <>
              {stores.length > 1 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Select Store:</label>
                  <select 
                    className="border rounded-lg px-3 py-2"
                    value={selectedStoreId || stores[0]?.id || ""}
                    onChange={(e) => setSelectedStoreId(Number(e.target.value))}
                  >
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {storeToUse && (
                <ProductList storeId={storeToUse.id} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}