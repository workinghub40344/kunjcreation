import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import ProductForm from "@/components/ProductForm";
import { Search, Edit, Trash2, PlusCircle, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  sizes: { size: string; price: number }[];
  images: string[];
}

const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleSaveProduct = async (productData: Product) => {
    console.log("Saving product:", productData);
    try {
      if (editingProduct) {
        const res = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, productData);
        setProducts(
          products.map((p) => (p._id === editingProduct._id ? res.data : p))
        );
      } else {
        const res = await axios.post("http://localhost:5000/api/products", productData);
        setProducts([...products, res.data]);
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Product Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingProduct(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sizes & Prices</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {product.sizes.map((size: Product["sizes"][number]) => (
                      <div key={size.size} className="text-sm">
                        {size.size}: ₹{size.price}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onClose={() => setEditingProduct(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSave={handleSaveProduct}
            onClose={() => setIsAddingProduct(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTab;
