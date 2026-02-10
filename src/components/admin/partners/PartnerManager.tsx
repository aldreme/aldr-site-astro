
import { supabase } from "@/lib/supabase";
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
  useDisclosure,
  User
} from "@heroui/react";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website: string;
  description: string;
}

export default function PartnerManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<Partial<Partner>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    // Store in partners bucket
    const filePath = `${fileName}`; // No folders for partners generally, or use partners/filename? Migration used partners/filename. Wait, bucket is 'partners'. So path is 'filename'.

    const { error: uploadError } = await supabase.storage
      .from('partners')
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading logo: " + uploadError.message);
    } else {
      // We store the relative path within the 'partners' bucket (which is just filename if at root)
      setFormData((prev) => ({ ...prev, logo_url: filePath }));
    }
    setUploading(false);
  };

  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setPartners(data || []);
    setLoading(false);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData(partner);
    onOpen();
  };

  const handleAdd = () => {
    setEditingPartner(null);
    setFormData({});
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchPartners();
  };

  const handleSubmit = async (onClose: () => void) => {
    if (editingPartner) {
      const { error } = await supabase.from("partners").update(formData).eq("id", editingPartner.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from("partners").insert(formData);
      if (error) alert(error.message);
    }
    fetchPartners();
    onClose();
  };

  const columns = [
    { name: "PARTNER", uid: "name" },
    { name: "WEBSITE", uid: "website" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (partner: Partner, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: partner.logo_url ? (partner.logo_url.startsWith("http") ? partner.logo_url : `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/partners/${partner.logo_url}`) : "" }}
            description={partner.description}
            name={partner.name}
          >
            {partner.name}
          </User>
        );
      case "website":
        return (
          <a href={partner.website.startsWith("http") ? partner.website : `https://${partner.website}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            {partner.website}
          </a>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(partner)}>
              <Edit className="w-4 h-4" />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(partner.id)}>
              <Trash2 className="w-4 h-4" />
            </span>
          </div>
        );
      default:
        return (partner as any)[columnKey as string];
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Partners</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your global partner network</p>
        </div>
        <Button
          color="primary"
          onPress={handleAdd}
          size="lg"
          radius="full"
          className="shadow-lg shadow-blue-500/20 font-semibold"
          startContent={<Plus className="w-5 h-5" />}
        >
          Add New Partner
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-4xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <Table
          aria-label="Partners management table"
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
          <TableBody items={partners} isLoading={loading} loadingContent={<div>Loading partners...</div>} emptyContent={"No partners found"}>
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
              <ModalHeader className="flex flex-col gap-1">{editingPartner ? "Edit Partner" : "New Partner"}</ModalHeader>
              <ModalBody>
                <Input label="Name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Input label="Website" value={formData.website || ""} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Logo</label>
                  <div className="flex items-center gap-2">
                    {formData.logo_url && (
                      <div className="w-10 h-10 relative shrink-0">
                        <img
                          src={formData.logo_url.startsWith("http") ? formData.logo_url : `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/partners/${formData.logo_url}`}
                          alt=""
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    <Button size="sm" isLoading={uploading} onPress={() => document.getElementById('logo-upload')?.click()}>
                      Upload Logo
                    </Button>
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>
                  <Input label="Logo URL/Path" value={formData.logo_url || ""} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} />
                </div>
                <Input label="Description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Close</Button>
                <Button color="primary" onPress={() => handleSubmit(onClose)}>Save</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
