import { useState, useEffect } from "react";
import axios from "axios";
import { 
  DollarSign, 
  Package, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/ProductForm"; // Import ProductForm

interface Order {
  _id: string;
  customerName: string;
  products: string[];
  total: number;
  status: "pending" | "processing" | "completed";
  date: string;
}

interface AdminProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  sizes: { size: string; price: number }[];
  images: string[];
  stock?: number; // Make stock optional as it's not in the Product model
}

const Admin = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setAdminProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast({
          title: "Error",
          description: "Failed to load products.",
          variant: "destructive",
        });
      }
    };
    fetchProducts();
  }, [toast]);

  // Mock data for orders
  useState<Order[]>([
    {
      _id: "ORD-001",
      customerName: "Sarah Johnson",
      products: ["Lotus Radiance Serum", "Green Leaf Face Cream"],
      total: 205,
      status: "pending",
      date: "2024-01-15"
    },
    {
      _id: "ORD-002",
      customerName: "Mike Chen",
      products: ["Herbal Botanical Elixir"],
      total: 95,
      status: "processing",
      date: "2024-01-14"
    },
    {
      _id: "ORD-003",
      customerName: "Emma Rodriguez",
      products: ["Pink Lotus Face Mask", "Refreshing Herbal Toner"],
      total: 83,
      status: "completed",
      date: "2024-01-13"
    }
  ]);

  // Handler to save a new product
  const handleSaveProduct = async (productData: Omit<AdminProduct, '_id'>) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data: newProduct } = await axios.post("/api/products", productData, config);
      setAdminProducts([...adminProducts, newProduct]);
      setIsDialogOpen(false); // Close the dialog
      toast({
        title: "Product Added",
        description: `${newProduct.name} has been successfully added.`,
      });
    } catch (error) {
      console.error("Failed to add product", error);
      toast({
        title: "Error",
        description: "Failed to add the product.",
        variant: "destructive",
      });
    }
  };

  // Stats calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const totalProducts = adminProducts.length;

  const updateOrderStatus = (orderId: string, newStatus: "pending" | "processing" | "completed") => {
    setOrders(prev => 
      prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: "Order updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order._id !== orderId));
    toast({
      title: "Order deleted",
      description: `Order ${orderId} has been removed`,
    });
  };

  const generateInvoice = (order: Order) => {
    toast({
      title: "Invoice Generated",
      description: `Invoice for order ${order._id} is being prepared`,
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      processing: "default",
      completed: "default"
    };
    
    return (
      <Badge variant={variants[status] || "default"} className={
        status === "completed" ? "bg-green-100 text-green-800" :
        status === "processing" ? "bg-blue-100 text-blue-800" :
        "bg-yellow-100 text-yellow-800"
      }>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your e-commerce operations</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${totalRevenue}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">+5 new orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">Active products</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${order.total}</div>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{order.id}</h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Customer: {order.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          Products: {order.products.join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {order.date}
                        </p>
                        <p className="font-bold text-primary mt-1">Total: ${order.total}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Select 
                          value={order.status} 
                          onValueChange={(value: "pending" | "processing" | "completed") => 
                            updateOrderStatus(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generateInvoice(order)}
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteOrder(order.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Management</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    onSave={handleSaveProduct}
                    onClose={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminProducts.map((product) => (
                  <Card key={product._id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">Category: {product.category}</p>
                        <p className="text-sm text-muted-foreground">
                          Price: ${product.sizes[0]?.price} | Stock: {product.stock || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Invoice Generator</h3>
                <p className="text-muted-foreground mb-6">
                  Generate PDF invoices for completed orders
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;