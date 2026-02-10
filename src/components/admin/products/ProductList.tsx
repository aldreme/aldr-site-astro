
import { supabase } from "@/lib/supabase";
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User
} from "@heroui/react";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  featured: boolean;
  images: string[];
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, category, price, featured, images")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      fetchProducts();
    }
  };

  const columns = [
    { name: "PRODUCT", uid: "name" },
    { name: "CATEGORY", uid: "category" },
    { name: "PRICE", uid: "price" },
    { name: "STATUS", uid: "featured" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = React.useCallback((product: Product, columnKey: React.Key) => {
    const cellValue = product[columnKey as keyof Product];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg", src: product.images?.[0] ?
                // Check if full URL or path
                product.images[0].startsWith('http')
                  ? product.images[0]
                  : `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${product.images[0]}`
                : ""
            }}
            description={product.slug}
            name={product.name}
          >
            {product.name}
          </User>
        );
      case "category":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{product.category}</p>
          </div>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{product.price === 0 ? "Contact" : `$${product.price}`}</p>
          </div>
        );
      case "featured":
        return (
          <Chip className="capitalize" color={product.featured ? "success" : "default"} size="sm" variant="flat">
            {product.featured ? "Featured" : "Standard"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit product">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <a href={`/admin/products/${product.id}`}>
                  <Edit className="w-4 h-4" />
                </a>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete product">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(product.id)}>
                <Trash2 className="w-4 h-4" />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">Total {products.length} products in catalog</p>
        </div>
        <Button
          as="a"
          href="/admin/products/new"
          color="primary"
          size="lg"
          radius="full"
          className="shadow-lg shadow-blue-500/20 font-semibold"
          startContent={<Plus className="w-5 h-5" />}
        >
          Add New Product
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-4xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <Table
          aria-label="Products management table"
          classNames={{
            base: "p-4",
            table: "min-h-[400px]",
            thead: "[&>tr]:first:rounded-xl",
            th: "bg-gray-50/50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400 font-semibold uppercase text-[10px] tracking-wider py-4",
            td: "py-4 border-b border-gray-50 dark:border-zinc-800/50",
          }}
          removeWrapper
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={products} isLoading={loading} loadingContent={<div>Loading catalog...</div>} emptyContent={"No products found"}>
            {(item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
