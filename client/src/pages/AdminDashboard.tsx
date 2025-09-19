// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import React, { useState, useEffect } from "react";
// import ProductForm from "@/components/ProductForm";
// import { Search, Edit, Trash2, PlusCircle } from "lucide-react";
// import axios from "axios";

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price?: number;
//   category: string;
//   sizes: { size: string; price: number }[];
//   images: string[];
// }

// const ProductsTab = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [isAddingProduct, setIsAddingProduct] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/products");
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   const handleDeleteProduct = async (id: string) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/products/${id}`);
//       setProducts(products.filter((p) => p._id !== id));
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     }
//   };

//   const handleSaveProduct = async (productData: Product) => {
//     try {
//       if (editingProduct) {
//         const res = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, productData);
//         setProducts(
//           products.map((p) => (p._id === editingProduct._id ? res.data : p))
//         );
//       } else {
//         const res = await axios.post("http://localhost:5000/api/products", productData);
//         setProducts([...products, res.data]);
//       }
//       setEditingProduct(null);
//       setIsAddingProduct(false);
//     } catch (err) {
//       console.error("Error saving product:", err);
//     }
//   };

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold">Product Management</h2>
//         <Button onClick={() => setIsAddingProduct(true)}>
//           <PlusCircle className="mr-2 h-4 w-4" /> Add Product
//         </Button>
//       </div>

//       {/* Search bar */}
//       <div className="flex gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//           <Input
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <Card>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Image</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Sizes & Prices</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProducts.map((product) => (
//               <TableRow key={product._id}>
//                 <TableCell>
//                   <img
//                     src={product.images[0]}
//                     alt={product.name}
//                     className="w-12 h-12 object-cover rounded"
//                   />
//                 </TableCell>
//                 <TableCell className="font-medium">{product.name}</TableCell>
//                 <TableCell>
//                   <Badge variant="secondary">{product.category}</Badge>
//                 </TableCell>
//                 <TableCell>
//                   <div className="space-y-1">
//                     {product.sizes.map((size: Product["sizes"][number]) => (
//                       <div key={size.size} className="text-sm">
//                         {size.size}: ₹{size.price}
//                       </div>
//                     ))}
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => setEditingProduct(product)}
//                     >
//                       <Edit className="h-3 w-3" />
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handleDeleteProduct(product._id)}
//                       className="text-destructive hover:text-destructive"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Card>

//       {/* Edit Product Dialog */}
//       {editingProduct && (
//         <Dialog
//           open={!!editingProduct}
//           onOpenChange={() => setEditingProduct(null)}
//         >
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Edit Product</DialogTitle>
//             </DialogHeader>
//             <ProductForm
//               product={editingProduct}
//               onSave={handleSaveProduct}
//               onClose={() => setEditingProduct(null)}
//             />
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Add Product Dialog */}
//       <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New Product</DialogTitle>
//           </DialogHeader>
//           <ProductForm
//             onSave={handleSaveProduct}
//             onClose={() => setIsAddingProduct(false)}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ProductsTab;




import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import ProductForm from "@/components/ProductForm";
import { Search, Edit, Trash2, PlusCircle } from "lucide-react";
import axios from "axios";

// CORRECTED Product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  sizes: { size: string; price: number }[];
  images: string[];
}

const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const API_URL = "http://localhost:5000/api/products";

  // Helper function to get auth configuration
  const getAuthConfig = () => {
    const token = localStorage.getItem("adminToken"); // Assumes token is in localStorage
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, getAuthConfig());
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Check console for details.");
      }
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, "_id">) => {
    try {
      if (editingProduct) {
        const res = await axios.put(`${API_URL}/${editingProduct._id}`, productData, getAuthConfig());
        setProducts(products.map((p) => (p._id === editingProduct._id ? res.data : p)));
      } else {
        const res = await axios.post(API_URL, productData, getAuthConfig());
        setProducts([...products, res.data]);
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Check console for details.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Product Management</h2>
        <Button onClick={() => setIsAddingProduct(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

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
                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {product.sizes.map((size) => (
                      <div key={size.size} className="text-sm">{size.size}: ₹{size.price}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}><Edit className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product._id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editingProduct || isAddingProduct} onOpenChange={() => { setEditingProduct(null); setIsAddingProduct(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => { setEditingProduct(null); setIsAddingProduct(false); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTab;