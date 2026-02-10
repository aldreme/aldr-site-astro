
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";

export default function EditProductClient({ id }: { id?: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product");
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return <ProductForm initialData={product} />;
}
