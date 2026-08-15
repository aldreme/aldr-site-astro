
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

import { useAdminTranslation } from "../AdminI18nProvider";

import { useAdminDialog } from "@/store/admin-ui";

export default function ProductList() {
  const { t } = useAdminTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const admin = useAdminDialog();

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
    if (!await admin.confirm({ title: t('admin.product_list.delete_confirm') })) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      await admin.alert("Error deleting product: " + error.message);
    } else {
      fetchProducts();
    }
  };

  const columns = [
    { name: t('admin.product_list.columns.product'), uid: "name" },
    { name: t('admin.product_list.columns.category'), uid: "category" },
    { name: t('admin.product_list.columns.price'), uid: "price" },
    { name: t('admin.product_list.columns.status'), uid: "featured" },
    { name: t('admin.product_list.columns.actions'), uid: "actions" },
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
            <p className="text-bold text-sm capitalize">{product.price === 0 ? t('admin.product_list.price.contact') : `$${product.price}`}</p>
          </div>
        );
      case "featured":
        return (
          <Chip className="capitalize" color={product.featured ? "success" : "default"} size="sm" variant="flat">
            {product.featured ? t('admin.product_list.status.featured') : t('admin.product_list.status.standard')}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Tooltip content={t('admin.product_list.tooltip.edit')}>
              <Button
                as="a"
                href={`/admin/products/${product.id}`}
                isIconOnly
                size="sm"
                variant="light"
                className="text-default-400 hover:text-default-600 active:scale-95"
                aria-label="Edit product"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content={t('admin.product_list.tooltip.delete')}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                className="text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20 active:scale-95"
                onPress={() => handleDelete(product.id)}
                aria-label="Delete product"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('admin.product_list.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('admin.product_list.subtitle').replace('{count}', products.length.toString())}</p>
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
          {t('admin.product_list.add_new')}
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-4xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <Table
          aria-label="Products management table"
          classNames={{
            base: "p-4",
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
          <TableBody items={products} isLoading={loading} loadingContent={<div>{t('admin.product_list.loading')}</div>} emptyContent={t('admin.product_list.empty')}>
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
