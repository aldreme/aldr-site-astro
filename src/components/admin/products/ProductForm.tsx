
import { supabase } from "@/lib/supabase";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea
} from "@heroui/react";
import { ArrowLeft, Save, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProductFormProps {
  initialData?: any; // Product type
  isNew?: boolean;
}

const CATEGORIES = [
  "Workstations",
  "Cleanroom Furniture",
  "Storage",
  "Process Equipment",
  "Transport",
  "Maintenance",
  "Transfer",
  "Accessories"
];

export default function ProductForm({ initialData, isNew = false }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(initialData || {
    name: "",
    slug: "",
    category: "",
    price: 0,
    featured: false,
    description: "",
    introduction: "",
    images: [],
    specs: {},
    features: [],
    application_scenarios: []
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (value: string) => {
    // Simple line-separated for now
    const features = value.split("\n").filter(line => line.trim() !== "");
    setFormData((prev: any) => ({ ...prev, features }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    // Put in folder named after slug if available, or just random folder to avoid collision
    const slug = formData.slug || 'uploads';
    const filePath = `${slug}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
    } else {
      // We store the relative path within the 'products' bucket
      // Consistent with other images
      handleChange("images", [...(formData.images || []), filePath]);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };
    if (isNew) {
      // Check slug uniqueness? Supabase will error if duplicate.
      // Ensure slug exists
      if (!payload.slug) {
        payload.slug = payload.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      }
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        alert("Error creating product: " + error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.from("products").update(payload).eq("id", formData.id);
      if (error) {
        alert("Error updating product: " + error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    window.location.href = "/admin/products";
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            as="a"
            href="/admin/products"
            variant="light"
            radius="full"
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isNew ? "Create New Product" : "Edit Product"}
            </h1>
            <p className="text-sm text-gray-500">{formData.name || "Untitled Product"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="flat"
            as="a"
            href="/admin/products"
            radius="full"
            className="font-medium"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            isLoading={loading}
            radius="full"
            className="shadow-lg shadow-blue-500/20 px-8 font-semibold"
            startContent={!loading && <Save className="w-4 h-4" />}
          >
            {isNew ? "Publish Product" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">General Information</h3>
            <div className="grid gap-6">
              <Input
                label="Product Name"
                placeholder="e.g. Cleanroom Stainless Steel Workbench"
                labelPlacement="outside"
                variant="bordered"
                classNames={{
                  base: "mb-2",
                  inputWrapper: "rounded-2xl h-12"
                }}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <Input
                label="URL Slug"
                placeholder="cleanroom-workbench"
                labelPlacement="outside"
                variant="bordered"
                classNames={{
                  base: "mb-4",
                  inputWrapper: "rounded-2xl h-12"
                }}
                description="The unique part of the product URL"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                required
              />
              <Textarea
                label="Summary"
                placeholder="Brief overview of the product for list views..."
                labelPlacement="outside"
                variant="bordered"
                classNames={{
                  base: "mb-2",
                  inputWrapper: "rounded-2xl"
                }}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <Textarea
                label="Detailed Introduction"
                placeholder="Describe the product in detail..."
                labelPlacement="outside"
                variant="bordered"
                classNames={{
                  base: "mt-2",
                  inputWrapper: "rounded-2xl"
                }}
                minRows={8}
                value={formData.introduction}
                onChange={(e) => handleChange("introduction", e.target.value)}
              />
            </div>
          </section>

          {/* Features */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Features & Highlights</h3>
            </div>
            <Textarea
              placeholder="Enter each feature on a new line..."
              labelPlacement="outside"
              variant="bordered"
              classNames={{ inputWrapper: "rounded-2xl" }}
              minRows={6}
              value={formData.features ? formData.features.join("\n") : ""}
              onChange={(e) => handleFeaturesChange(e.target.value)}
            />
          </section>
        </div>

        <div className="space-y-8">
          {/* Classification */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Classification</h3>
            <div className="space-y-4">
              <Select
                label="Category"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Select category"
                classNames={{ trigger: "rounded-2xl h-12" }}
                selectedKeys={formData.category ? [formData.category] : []}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <SelectItem key={c}>{c}</SelectItem>
                ))}
              </Select>

              <Input
                label="Base Price"
                placeholder="0.00"
                type="number"
                labelPlacement="outside"
                variant="bordered"
                classNames={{ inputWrapper: "rounded-2xl h-12" }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                value={formData.price?.toString()}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
              />

              <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 mt-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Featured Product</span>
                  <span className="text-xs text-gray-500">Showcase on homepage</span>
                </div>
                <Switch
                  isSelected={formData.featured}
                  onValueChange={(val) => handleChange("featured", val)}
                  size="sm"
                />
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Product Images</h3>

            <div className="grid gap-3">
              {formData.images && formData.images.map((img: string, i: number) => (
                <div key={i} className="group relative flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
                  <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700">
                    <img
                      src={img.startsWith("http") ? img : `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${img}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 truncate uppercase tracking-tighter">Image {i + 1}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{img}</p>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    radius="full"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newImages = [...formData.images];
                      newImages.splice(i, 1);
                      handleChange("images", newImages);
                    }}
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button
                  size="sm"
                  variant="bordered"
                  radius="lg"
                  isLoading={uploading}
                  className="font-medium h-10"
                  onPress={() => document.getElementById('image-upload')?.click()}
                >
                  Upload File
                </Button>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button
                  size="sm"
                  variant="flat"
                  radius="lg"
                  className="font-medium h-10"
                  onPress={() => {
                    const url = prompt("Enter image URL or path:");
                    if (url) handleChange("images", [...(formData.images || []), url]);
                  }}
                >
                  Add URL
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
