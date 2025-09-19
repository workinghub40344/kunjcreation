import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import axios from "axios";

interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  sizes: { size: string; price: number }[];
  images: string[];
}

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<Product>({
    name: "",
    price: 0,
    category: "",
    sizes: [],
    images: [],
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSizeChange = (index: number, field: string, value: string) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleAddSize = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, { size: "", price: 0 }] });
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "kunj-creation"); // Replace with your upload preset if you have one
        const res = await axios.post("https://api.cloudinary.com/v1_1/dm2kaeeri/image/upload", formData);
        return res.data.secure_url;
      });
      const imageUrls = await Promise.all(uploadPromises);
      setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Add Product"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Sizes</Label>
            {formData.sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Size (e.g., S, M, L)"
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={size.price}
                  onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveSize(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={handleAddSize}>
              Add Size
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <Input id="images" type="file" multiple onChange={handleImageUpload} />
            <div className="flex gap-2 mt-2">
              {formData.images.map((url, index) => (
                <img key={index} src={url} alt={`Product image ${index + 1}`} className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProductForm;
