import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import axios from "axios";

const sizeSchema = z.object({
  size: z.string().min(1, "Size is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
});

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  sizes: z.array(sizeSchema).min(1, "At least one size is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  sizes: { size: string; price: number }[];
  images: string[];
}

interface ProductFormProps {
  product?: ProductFormValues & { _id?: string };
  onSave: (product: ProductFormValues) => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      price: 0,
      category: "",
      sizes: [],
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

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
      setValue("images", [...(product?.images || []), ...imageUrls]);
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{product?._id ? "Edit Product" : "Add Product"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" {...register("price")} />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register("category")} />
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Sizes</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  placeholder="Size (e.g., S, M, L)"
                  {...register(`sizes.${index}.size`)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  {...register(`sizes.${index}.price`)}
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ size: "", price: 0 })}>
              Add Size
            </Button>
            {errors.sizes && <p className="text-red-500 text-sm">{errors.sizes.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <Input id="images" type="file" multiple onChange={handleImageUpload} />
            {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
            <div className="flex gap-2 mt-2">
              {product?.images?.map((url, index) => (
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
