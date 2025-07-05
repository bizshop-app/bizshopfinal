import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign, Loader2 } from "lucide-react";

interface StoreStatsProps {
  store: Store;
}

export function StoreStats({ store }: StoreStatsProps) {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: [`/api/stores/${store.id}/products`],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: [`/api/stores/${store.id}/orders`],
  });

  const isLoading = productsLoading || ordersLoading;

  // Sample data for the chart
  const dummyChartData = [
    { name: "Mon", sales: 0 },
    { name: "Tue", sales: 0 },
    { name: "Wed", sales: 0 },
    { name: "Thu", sales: 0 },
    { name: "Fri", sales: 0 },
    { name: "Sat", sales: 0 },
    { name: "Sun", sales: 0 },
  ];

  const stats = [
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: <Package className="h-4 w-4 text-primary" />,
      change: 0,
      trend: "neutral", // 'up', 'down', 'neutral'
    },
    {
      title: "Total Sales",
      value: `$${orders?.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2) || '0.00'}`,
      icon: <DollarSign className="h-4 w-4 text-primary" />,
      change: 0,
      trend: "neutral",
    },
    {
      title: "Orders",
      value: orders?.length || 0,
      icon: <ShoppingCart className="h-4 w-4 text-primary" />,
      change: 0,
      trend: "neutral",
    },
    {
      title: "Customers",
      value: orders ? new Set(orders.map(order => order.customerEmail)).size : 0,
      icon: <Users className="h-4 w-4 text-primary" />,
      change: 0,
      trend: "neutral",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-50">Loading</CardTitle>
              <div className="opacity-50">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="bg-primary/10 p-1 rounded-full">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change !== 0 && (
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : stat.trend === "down" ? (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  ) : null}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-green-500"
                        : stat.trend === "down"
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {stat.change > 0 ? "+" : ""}
                    {stat.change}% from last week
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Weekly sales performance for {store.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              {orders?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dummyChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--background)", 
                        borderColor: "var(--border)",
                        borderRadius: "var(--radius)"
                      }} 
                    />
                    <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No sales data yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-2">
                    Your sales chart will appear here once you receive your first orders.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
