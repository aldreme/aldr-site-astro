import { supabase } from "@/lib/supabase";
import { useAdminDialog } from "@/store/admin-ui";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure
} from "@heroui/react";
import { Copy, Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAdminTranslation } from "../AdminI18nProvider";

interface ShortUrl {
  id: string;
  slug: string;
  target_url: string;
  expired_at: string | null;
  created_at: string;
}

export default function ShortUrlManager() {
  const { t } = useAdminTranslation();
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingUrl, setEditingUrl] = useState<ShortUrl | null>(null);
  const [formData, setFormData] = useState<Partial<ShortUrl>>({});
  const [submitting, setSubmitting] = useState(false);
  const admin = useAdminDialog();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("short_urls").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setUrls(data || []);
    setLoading(false);
  };

  const handleEdit = (url: ShortUrl) => {
    setEditingUrl(url);
    setFormData({
      slug: url.slug,
      target_url: url.target_url,
      expired_at: url.expired_at ? new Date(url.expired_at).toISOString().slice(0, 16) : "",
    });
    onOpen();
  };

  const handleAdd = () => {
    setEditingUrl(null);
    setFormData({});
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (!await admin.confirm({ title: t('admin.common.confirm_delete') || "Are you sure you want to delete this short URL?" })) return;
    const { error } = await supabase.from("short_urls").delete().eq("id", id);
    if (error) await admin.alert(error.message);
    else fetchUrls();
  };

  const handleCopy = (slug: string) => {
    // Generate the relative path for the site format
    const fullUrl = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    // Simple toast or alert
    admin.alert("Copied to clipboard!");
  };

  const handleSubmit = async (onClose: () => void) => {
    setSubmitting(true);

    // Formatting the expiration date
    const payload: any = {
      target_url: formData.target_url,
    };
    if (formData.slug) payload.slug = formData.slug;
    if (formData.expired_at) payload.expired_at = new Date(formData.expired_at).toISOString();

    if (editingUrl) {
      // Direct update via Supabase Client
      const { error } = await supabase.from("short_urls").update(payload).eq("id", editingUrl.id);
      if (error) {
        await admin.alert(error.message);
      } else {
        fetchUrls();
        onClose();
      }
    } else {
      // Create via Edge Function to handle generation/collisions
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        await admin.alert("Authentication required.");
        setSubmitting(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/url_shortener`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const resData = await response.json();
        if (!response.ok) {
          await admin.alert(resData.error || "Failed to create short URL");
        } else {
          fetchUrls();
          onClose();
          // Show the new copyable link
          await admin.alert(`Created successfully!\nLink: ${window.location.origin}/s/${resData.slug}`, { title: "Success" });
        }
      } catch (err: any) {
        await admin.alert(err.message);
      }
    }

    setSubmitting(false);
  };

  const columns = [
    { name: t('admin.short_urls.columns.slug') || "Slug", uid: "slug" },
    { name: t('admin.short_urls.columns.target') || "Target URL", uid: "target_url" },
    { name: t('admin.short_urls.columns.expired_at') || "Expires At", uid: "expired_at" },
    { name: t('admin.common.actions') || "Actions", uid: "actions" },
  ];

  const renderCell = (url: ShortUrl, columnKey: React.Key) => {
    switch (columnKey) {
      case "slug":
        return <span className="font-mono text-blue-600 dark:text-blue-400">{url.slug}</span>;
      case "target_url":
        return (
          <a href={url.target_url} target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-300 hover:underline max-w-sm block truncate" title={url.target_url}>
            {url.target_url}
          </a>
        );
      case "expired_at":
        if (!url.expired_at) return <span className="text-gray-400 dark:text-zinc-500">Never</span>;

        const isExpired = new Date(url.expired_at).getTime() < Date.now();
        return (
          <span className={isExpired ? "text-red-500 font-medium" : "text-gray-700 dark:text-gray-300"}>
            {new Date(url.expired_at).toLocaleString()}
          </span>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button isIconOnly variant="light" size="sm" onPress={() => handleCopy(url.slug)} title="Copy URL">
              <Copy className="w-4 h-4 text-default-400" />
            </Button>
            <Button isIconOnly variant="light" size="sm" onPress={() => handleEdit(url)} title="Edit">
              <Edit className="w-4 h-4 text-default-400" />
            </Button>
            <Button isIconOnly variant="light" size="sm" color="danger" onPress={() => handleDelete(url.id)} title="Delete">
              <Trash2 className="w-4 h-4 text-danger" />
            </Button>
          </div>
        );
      default:
        return (url as any)[columnKey as string];
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('admin.short_urls.title') || "URL Shortener"}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('admin.short_urls.subtitle') || "Create and manage shortened links."}</p>
        </div>
        <Button
          color="primary"
          onPress={handleAdd}
          size="lg"
          radius="full"
          className="shadow-lg shadow-blue-500/20 font-semibold"
          startContent={<Plus className="w-5 h-5" />}
        >
          {t('admin.short_urls.new') || "New Short URL"}
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-4xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <Table
          aria-label="Short URLs management table"
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
            {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
          </TableHeader>
          <TableBody items={urls} isLoading={loading} loadingContent={<div>{t('admin.common.loading') || "Loading..."}</div>} emptyContent={t('admin.short_urls.empty') || "No short URLs found."}>
            {(item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingUrl ? (t('admin.short_urls.edit') || "Edit Short URL") : (t('admin.short_urls.create') || "Create Short URL")}
              </ModalHeader>
              <ModalBody>
                <Input
                  label={t('admin.short_urls.form.target_url') || "Target URL"}
                  placeholder="https://example.com/very/long/path"
                  value={formData.target_url || ""}
                  onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                  isRequired
                />
                <Input
                  label={t('admin.short_urls.form.slug') || "Custom Slug (Optional)"}
                  placeholder="Leave empty to auto-generate"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  description="A custom alias for your shortened link."
                />
                <Input
                  label={t('admin.short_urls.form.expired_at') || "Expiration Date (Optional)"}
                  type="datetime-local"
                  placeholder=" "
                  value={formData.expired_at || ""}
                  onChange={(e) => setFormData({ ...formData, expired_at: e.target.value })}
                  description="When should this link expire? Leave blank for never."
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>{t('admin.common.cancel') || "Cancel"}</Button>
                <Button color="primary" isLoading={submitting} onPress={() => handleSubmit(onClose)}>{t('admin.common.save') || "Save"}</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
