
import { supabase } from "@/lib/supabase";
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea
} from "@heroui/react";
import { ArrowLeft, Plus, Save, Trash, X } from "lucide-react";
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
    tags: [],
    features: [],
    application_scenarios: [],
    specs: {},
    engineering_drawings: { ortho_projections: [], models: [] },
    policies: { warranty: "", return: "", shipping: "" }
  });

  // Safe defaults for nested objects if they are missing in initialData
  useEffect(() => {
    if (initialData) {
      setFormData((prev: any) => ({
        ...prev,
        ...initialData,
        tags: initialData.tags || [],
        features: initialData.features || [],
        application_scenarios: initialData.application_scenarios || [],
        specs: initialData.specs || {},
        engineering_drawings: initialData.engineering_drawings || { ortho_projections: [], models: [] },
        policies: initialData.policies || { warranty: "", return: "", shipping: "" }
      }));
    }
  }, [initialData]);

  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [scenarioInput, setScenarioInput] = useState("");
  const [drawingInput, setDrawingInput] = useState("");
  const [modelInput, setModelInput] = useState("");

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent: string, key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
  };

  const handleSpecsChange = (path: string[], value: any) => {
    setFormData((prev: any) => {
      const newSpecs = { ...(prev.specs || {}) };
      let current = newSpecs;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return { ...prev, specs: newSpecs };
    });
  };

  const handleFeaturesChange = (value: string) => {
    // Simple line-separated for now
    const features = value.split("\n");
    setFormData((prev: any) => ({ ...prev, features }));
  };

  const addArrayItem = (field: string, value: string, setter: (val: string) => void) => {
    if (!value.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setter("");
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: any) => {
      const newArray = [...(prev[field] || [])];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const addNestedArrayItem = (parent: string, field: string, value: string, setter: (val: string) => void) => {
    if (!value.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: [...(prev[parent]?.[field] || []), value.trim()]
      }
    }));
    setter("");
  };

  const removeNestedArrayItem = (parent: string, field: string, index: number) => {
    setFormData((prev: any) => {
      const parentObj = { ...prev[parent] };
      const newArray = [...(parentObj[field] || [])];
      newArray.splice(index, 1);
      return { ...prev, [parent]: { ...parentObj, [field]: newArray } };
    });
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

  const handleDrawingUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ortho_projections' | 'models') => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const slug = formData.slug || 'uploads';
    const filePath = `${slug}/drawings/${type}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading file: " + uploadError.message);
    } else {
      addNestedArrayItem("engineering_drawings", type, filePath, () => { });
    }
    setUploading(false);
    e.target.value = ''; // Reset input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };
    // Clean up features (remove empty lines)
    payload.features = payload.features.filter((f: string) => f.trim() !== "");

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
      {/* Header */}
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
          {/* General Information */}
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
              value={Array.isArray(formData.features) ? formData.features.join("\n") : formData.features || ""}
              onChange={(e) => handleFeaturesChange(e.target.value)}
            />
          </section>

          {/* Product Specs */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Technical Specifications</h3>

            {/* Weight & Base Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Input
                  label="Weight (kg)"
                  type="number"
                  placeholder="0"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.specs?.weight?.value || ""}
                  onChange={(e) => handleSpecsChange(["weight", "value"], parseFloat(e.target.value))}
                  classNames={{ inputWrapper: "rounded-xl" }}
                />
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-gray-500">Customizable</span>
                  <Switch size="sm" isSelected={formData.specs?.weight?.customizable || false} onValueChange={(v) => handleSpecsChange(["weight", "customizable"], v)} />
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  label="Volume (L)"
                  type="number"
                  placeholder="0"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.specs?.volume?.value || ""}
                  onChange={(e) => handleSpecsChange(["volume", "value"], parseFloat(e.target.value))}
                  classNames={{ inputWrapper: "rounded-xl" }}
                />
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-gray-500">Customizable</span>
                  <Switch size="sm" isSelected={formData.specs?.volume?.customizable || false} onValueChange={(v) => handleSpecsChange(["volume", "customizable"], v)} />
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  label="Material"
                  placeholder="e.g. 304 Stainless Steel"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.specs?.material?.value || ""}
                  onChange={(e) => handleSpecsChange(["material", "value"], e.target.value)}
                  classNames={{ inputWrapper: "rounded-xl" }}
                />
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-gray-500">Customizable</span>
                  <Switch size="sm" isSelected={formData.specs?.material?.customizable || false} onValueChange={(v) => handleSpecsChange(["material", "customizable"], v)} />
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Dimensions (cm)</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Customizable</span>
                  <Switch size="sm" isSelected={formData.specs?.dimension?.customizable || false} onValueChange={(v) => handleSpecsChange(["dimension", "customizable"], v)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label="Ext. Width" size="sm" variant="bordered" type="number" value={formData.specs?.dimension?.external?.width || ""} onChange={(e) => handleSpecsChange(["dimension", "external", "width"], parseFloat(e.target.value))} />
                <Input label="Ext. Height" size="sm" variant="bordered" type="number" value={formData.specs?.dimension?.external?.height || ""} onChange={(e) => handleSpecsChange(["dimension", "external", "height"], parseFloat(e.target.value))} />
                <Input label="Ext. Length" size="sm" variant="bordered" type="number" value={formData.specs?.dimension?.external?.length || ""} onChange={(e) => handleSpecsChange(["dimension", "external", "length"], parseFloat(e.target.value))} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label="Int. Width" size="sm" variant="bordered" type="number" value={formData.specs?.dimension?.internal?.width || ""} onChange={(e) => handleSpecsChange(["dimension", "internal", "width"], parseFloat(e.target.value))} />
                <Input label="Int. Height" size="sm" variant="bordered" type="number" value={formData.specs?.dimension?.internal?.height || ""} onChange={(e) => handleSpecsChange(["dimension", "internal", "height"], parseFloat(e.target.value))} />
                <Input label="Int. Length" size="sm" variant="bordered" type="number" value={formData.specs?.dimension?.internal?.length || ""} onChange={(e) => handleSpecsChange(["dimension", "internal", "length"], parseFloat(e.target.value))} />
              </div>
            </div>

            {/* Electrical */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Electrical</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Customizable</span>
                  <Switch size="sm" isSelected={formData.specs?.electrical?.customizable || false} onValueChange={(v) => handleSpecsChange(["electrical", "customizable"], v)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label="Voltage (Min)" size="sm" variant="bordered" type="number" value={formData.specs?.electrical?.voltage?.min || ""} onChange={(e) => handleSpecsChange(["electrical", "voltage", "min"], parseFloat(e.target.value))} />
                <Input label="Current (Min)" size="sm" variant="bordered" type="number" value={formData.specs?.electrical?.current?.min || ""} onChange={(e) => handleSpecsChange(["electrical", "current", "min"], parseFloat(e.target.value))} />
                <Input label="Power (Min)" size="sm" variant="bordered" type="number" value={formData.specs?.electrical?.power?.min || ""} onChange={(e) => handleSpecsChange(["electrical", "power", "min"], parseFloat(e.target.value))} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label="Voltage (Max)" size="sm" variant="bordered" type="number" value={formData.specs?.electrical?.voltage?.max || ""} onChange={(e) => handleSpecsChange(["electrical", "voltage", "max"], parseFloat(e.target.value))} />
                <Input label="Current (Max)" size="sm" variant="bordered" type="number" value={formData.specs?.electrical?.current?.max || ""} onChange={(e) => handleSpecsChange(["electrical", "current", "max"], parseFloat(e.target.value))} />
                <Input label="Power (Max)" size="sm" variant="bordered" type="number" value={formData.specs?.electrical?.power?.max || ""} onChange={(e) => handleSpecsChange(["electrical", "power", "max"], parseFloat(e.target.value))} />
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Operating Temperature</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Customizable</span>
                  <Switch size="sm" isSelected={formData.specs?.operating_temperature?.customizable || false} onValueChange={(v) => handleSpecsChange(["operating_temperature", "customizable"], v)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Min Temp" size="sm" variant="bordered" type="number" value={formData.specs?.operating_temperature?.min || ""} onChange={(e) => handleSpecsChange(["operating_temperature", "min"], parseFloat(e.target.value))} />
                <Input label="Max Temp" size="sm" variant="bordered" type="number" value={formData.specs?.operating_temperature?.max || ""} onChange={(e) => handleSpecsChange(["operating_temperature", "max"], parseFloat(e.target.value))} />
              </div>
            </div>

            {/* Process Technology */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Process Technology</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Customizable</span>
                  <Switch size="sm" isSelected={formData.specs?.process_technology?.customizable || false} onValueChange={(v) => handleSpecsChange(["process_technology", "customizable"], v)} />
                </div>
              </div>
              <Textarea
                placeholder="Enter each technology on a new line..."
                minRows={3}
                variant="bordered"
                classNames={{ inputWrapper: "rounded-xl" }}
                value={Array.isArray(formData.specs?.process_technology?.value) ? formData.specs?.process_technology?.value.join("\n") : ""}
                onChange={(e) => handleSpecsChange(["process_technology", "value"], e.target.value.split("\n"))}
              />
            </div>
          </section>

          {/* Details: Tags, Scenarios, Policies */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-8">
            {/* Tags */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags?.map((tag: string, i: number) => (
                  <Chip
                    key={i}
                    onClose={() => removeArrayItem("tags", i)}
                    variant="flat"
                    color="secondary"
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("tags", tagInput, setTagInput);
                    }
                  }}
                  variant="bordered"
                  size="sm"
                  classNames={{ inputWrapper: "rounded-lg" }}
                />
                <Button
                  isIconOnly
                  size="sm"
                  onClick={() => addArrayItem("tags", tagInput, setTagInput)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Application Scenarios */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Application Scenarios</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.application_scenarios?.map((item: string, i: number) => (
                  <Chip
                    key={i}
                    onClose={() => removeArrayItem("application_scenarios", i)}
                    variant="flat"
                    color="primary"
                  >
                    {item}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a scenario..."
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("application_scenarios", scenarioInput, setScenarioInput);
                    }
                  }}
                  variant="bordered"
                  size="sm"
                  classNames={{ inputWrapper: "rounded-lg" }}
                />
                <Button
                  isIconOnly
                  size="sm"
                  onClick={() => addArrayItem("application_scenarios", scenarioInput, setScenarioInput)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Policies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Warranty"
                  placeholder="e.g. 1 Year Warranty"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.policies?.warranty || ""}
                  onChange={(e) => handleNestedChange("policies", "warranty", e.target.value)}
                  classNames={{ inputWrapper: "rounded-xl" }}
                />
                <Input
                  label="Shipping"
                  placeholder="e.g. Freight"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.policies?.shipping || ""}
                  onChange={(e) => handleNestedChange("policies", "shipping", e.target.value)}
                  classNames={{ inputWrapper: "rounded-xl" }}
                />
                <Input
                  label="Return Policy"
                  placeholder="e.g. 30 Days"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.policies?.return || ""}
                  onChange={(e) => handleNestedChange("policies", "return", e.target.value)}
                  classNames={{ inputWrapper: "rounded-xl" }}
                />
              </div>
            </div>

            {/* Engineering Drawings */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Engineering Drawings</h3>

              {/* Ortho Projections */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1.5 block">Ortho Projections (URLs)</label>
                <div className="flex flex-col gap-2 mb-2">
                  {formData.engineering_drawings?.ortho_projections?.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-lg p-2">
                      <span className="text-sm flex-1 truncate">{item}</span>
                      <Button isIconOnly size="sm" variant="light" onClick={() => removeNestedArrayItem("engineering_drawings", "ortho_projections", i)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add projection URL..."
                    value={drawingInput}
                    onChange={(e) => setDrawingInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addNestedArrayItem("engineering_drawings", "ortho_projections", drawingInput, setDrawingInput);
                      }
                    }}
                    variant="bordered"
                    size="sm"
                    classNames={{ inputWrapper: "rounded-lg" }}
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => addNestedArrayItem("engineering_drawings", "ortho_projections", drawingInput, setDrawingInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    isLoading={uploading}
                    onPress={() => document.getElementById('ortho-upload')?.click()}
                  >
                    Upload
                  </Button>
                  <input
                    type="file"
                    id="ortho-upload"
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={(e) => handleDrawingUpload(e, 'ortho_projections')}
                  />
                </div>
              </div>

              {/* Models */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">3D Models (URLs)</label>
                <div className="flex flex-col gap-2 mb-2">
                  {formData.engineering_drawings?.models?.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-lg p-2">
                      <span className="text-sm flex-1 truncate">{item}</span>
                      <Button isIconOnly size="sm" variant="light" onClick={() => removeNestedArrayItem("engineering_drawings", "models", i)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add model URL..."
                    value={modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addNestedArrayItem("engineering_drawings", "models", modelInput, setModelInput);
                      }
                    }}
                    variant="bordered"
                    size="sm"
                    classNames={{ inputWrapper: "rounded-lg" }}
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => addNestedArrayItem("engineering_drawings", "models", modelInput, setModelInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    isLoading={uploading}
                    onPress={() => document.getElementById('model-upload')?.click()}
                  >
                    Upload
                  </Button>
                  <input
                    type="file"
                    id="model-upload"
                    className="hidden"
                    accept=".glb,.gltf,.obj,.fbx"
                    onChange={(e) => handleDrawingUpload(e, 'models')}
                  />
                </div>
              </div>
            </div>

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
