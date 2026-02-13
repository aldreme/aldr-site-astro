
import { supabase } from "@/lib/supabase";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { ChevronDown, Eye, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

const STATUS_COLOR_MAP: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
  new: "primary",
  read: "secondary",
  responded: "success",
  archived: "default",
};

import { useAdminTranslation } from "../AdminI18nProvider";

import { useAdminDialog } from "@/store/admin-ui";

export default function RFQList() {
  const { t } = useAdminTranslation();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number> | "all">(new Set([]));
  const admin = useAdminDialog();

  useEffect(() => {
    fetchRfqs();
  }, []);

  const fetchRfqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customer_request_for_quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setRfqs(data || []);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from("customer_request_for_quotes")
      .update({ status })
      .eq("id", id);

    if (error) {
      await admin.alert("Error updating status: " + error.message);
    } else {
      fetchRfqs();
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await admin.confirm({
      title: t('admin.rfqs.delete.title') || "Delete RFQ",
      description: t('admin.rfqs.delete.description') || "Are you sure you want to delete this RFQ? This action cannot be undone."
    });

    if (confirmed) {
      const { error } = await supabase
        .from("customer_request_for_quotes")
        .delete()
        .eq("id", id);

      if (error) {
        await admin.alert("Error deleting RFQ: " + error.message);
      } else {
        fetchRfqs();
      }
    }
  };

  const handleView = (rfq: any) => {
    setSelectedRfq(rfq);
    // Mark as read if new?
    if (rfq.status === 'new') {
      handleUpdateStatus(rfq.id, 'read');
    }
    onOpen();
  };

  const columns = [
    { name: t('admin.rfqs.columns.status'), uid: "status" },
    { name: t('admin.rfqs.columns.subject'), uid: "cx_rfq_subject" },
    { name: t('admin.rfqs.columns.rep_name'), uid: "cx_rep_name" },
    { name: t('admin.rfqs.columns.company'), uid: "cx_company" },
    { name: t('admin.rfqs.columns.delivery'), uid: "expected_delivery_date" },
    { name: t('admin.rfqs.columns.date'), uid: "created_at" },
    { name: t('admin.product_list.columns.actions'), uid: "actions" },
  ];

  const renderCell = (rfq: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "status":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Chip className="cursor-pointer" color={STATUS_COLOR_MAP[rfq.status] || "default"} size="sm" variant="flat" endContent={<ChevronDown className="w-3 h-3" />}>
                {rfq.status ? t(`admin.status.${rfq.status}`) : t('admin.status.new')}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status Actions"
              onAction={(key) => handleUpdateStatus(rfq.id, key as string)}
              className="p-1"
              itemClasses={{
                base: "rounded-xl transition-all duration-200",
                title: "font-medium text-xs",
              }}
            >
              <DropdownItem key="new" className="text-blue-600 dark:text-blue-400">{t('admin.status.new')}</DropdownItem>
              <DropdownItem key="read" className="text-zinc-600 dark:text-zinc-400">{t('admin.status.read')}</DropdownItem>
              <DropdownItem key="responded" className="text-green-600 dark:text-green-400">{t('admin.status.responded')}</DropdownItem>
              <DropdownItem key="archived" className="text-red-600 dark:text-red-400">{t('admin.status.archived')}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      case "expected_delivery_date":
        return rfq.expected_delivery_date
          ? new Date(rfq.expected_delivery_date).toLocaleDateString()
          : <span className="text-gray-400">N/A</span>;
      case "created_at":
        return new Date(rfq.created_at).toLocaleDateString();
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleView(rfq)}>
              <Eye className="w-4 h-4" />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(rfq.id)}>
              <Trash className="w-4 h-4" />
            </span>
          </div>
        );
      default:
        return rfq[columnKey as keyof any];
    }
  };

  const handleBulkDelete = async () => {
    const keys = Array.from(selectedKeys === "all" ? rfqs.map((r) => r.id) : selectedKeys);
    if (keys.length === 0) return;

    const confirmed = await admin.confirm({
      title: t('admin.rfqs.bulk_delete.title') || "Bulk Delete RFQs",
      description: t('admin.rfqs.bulk_delete.description')?.replace('{count}', keys.length.toString()) || `Are you sure you want to delete ${keys.length} selected RFQs? This action cannot be undone.`
    });

    if (confirmed) {
      const { error } = await supabase
        .from("customer_request_for_quotes")
        .delete()
        .in("id", keys);

      if (error) {
        await admin.alert("Error deleting RFQs: " + error.message);
      } else {
        setSelectedKeys(new Set([]));
        fetchRfqs();
      }
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    const keys = Array.from(selectedKeys === "all" ? rfqs.map((r) => r.id) : selectedKeys);
    if (keys.length === 0) return;

    const { error } = await supabase
      .from("customer_request_for_quotes")
      .update({ status })
      .in("id", keys);

    if (error) {
      await admin.alert("Error updating status: " + error.message);
    } else {
      setSelectedKeys(new Set([]));
      fetchRfqs();
    }
  };

  const selectedCount = selectedKeys === "all" ? rfqs.length : selectedKeys.size;

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('admin.rfqs.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('admin.rfqs.subtitle')}</p>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {selectedCount} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  endContent={<ChevronDown className="w-4 h-4" />}
                >
                  Update Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Bulk Status Actions"
                onAction={(key) => handleBulkStatusUpdate(key as string)}
              >
                <DropdownItem key="new">{t('admin.status.new')}</DropdownItem>
                <DropdownItem key="read">{t('admin.status.read')}</DropdownItem>
                <DropdownItem key="responded">{t('admin.status.responded')}</DropdownItem>
                <DropdownItem key="archived">{t('admin.status.archived')}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              color="danger"
              variant="flat"
              size="sm"
              startContent={<Trash className="w-4 h-4" />}
              onPress={handleBulkDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-4xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <Table
          aria-label="RFQs management table"
          classNames={{
            base: "p-4",
            table: "min-h-[400px]",
            thead: "[&>tr]:first:rounded-xl",
            th: "bg-gray-50/50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400 font-semibold uppercase text-[10px] tracking-wider py-4",
            td: "py-4 border-b border-gray-50 dark:border-zinc-800/50",
          }}
          removeWrapper
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => setSelectedKeys(keys as Set<string | number> | "all")}
        >
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
          </TableHeader>
          <TableBody items={rfqs} isLoading={loading} loadingContent={<div>{t('admin.rfqs.loading')}</div>} emptyContent={t('admin.rfqs.empty')}>
            {(item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          base: "rounded-3xl border border-gray-100 dark:border-zinc-800",
          header: "border-b border-gray-100 dark:border-zinc-800 py-6",
          footer: "border-t border-gray-100 dark:border-zinc-800 py-4",
          closeButton: "hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.rfqs.modal.title')}</h3>
                <p className="text-sm font-normal text-gray-500">{t('admin.rfqs.modal.inquiry_id').replace('#{id}', selectedRfq?.id ? String(selectedRfq.id).substring(0, 8) : "N/A")}</p>
              </ModalHeader>
              <ModalBody className="py-6">
                {selectedRfq && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.rfqs.details.subject')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRfq.cx_rfq_subject}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.rfqs.details.date')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedRfq.created_at).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.rfqs.details.sender')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRfq.cx_rep_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.rfqs.details.email')}</p>
                        <p className="font-medium text-blue-600 dark:text-blue-400">{selectedRfq.cx_email_addr}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.rfqs.details.company')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRfq.cx_company}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.rfqs.details.delivery')}</p>
                        <p className="font-medium text-orange-600 dark:text-orange-400">
                          {selectedRfq.expected_delivery_date
                            ? new Date(selectedRfq.expected_delivery_date).toLocaleDateString()
                            : t('admin.rfqs.details.delivery_asap')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.rfqs.details.phone')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRfq.cx_contact_number || "N/A"}</p>
                      </div>
                    </div>

                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-blue-600/60 dark:text-blue-400/60 uppercase tracking-tight">{t('admin.rfqs.details.product')}</p>
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{selectedRfq.cx_rfq_product}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-blue-600/60 dark:text-blue-400/60 uppercase tracking-tight">{t('admin.rfqs.details.quantity')}</p>
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{selectedRfq.quantity_needed || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {selectedRfq.cx_rfq_items && Array.isArray(selectedRfq.cx_rfq_items) && selectedRfq.cx_rfq_items.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">{t('admin.rfqs.details.items').replace('{count}', selectedRfq.cx_rfq_items.length.toString())}</p>
                        <div className="bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead>
                              <tr className="bg-gray-100/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                                <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">{t('admin.rfqs.items.product')}</th>
                                <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider text-center">{t('admin.rfqs.items.qty')}</th>
                                <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider text-right">{t('admin.rfqs.items.target')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                              {selectedRfq.cx_rfq_items.map((item: any, idx: number) => (
                                <tr key={idx} className="hover:bg-white dark:hover:bg-zinc-800/50 transition-colors">
                                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{item.name}</td>
                                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 font-mono text-xs">{item.quantity}</td>
                                  <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-500 text-xs italic">{item.deliveryDate || 'Standard'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">{t('admin.rfqs.details.message')}</p>
                      <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-2xl text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-zinc-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                        {selectedRfq.cx_rfq_msg}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  radius="full"
                  className="font-medium"
                >
                  {t('admin.rfqs.actions.close')}
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  radius="full"
                  className="font-bold shadow-lg shadow-blue-500/20"
                >
                  {t('admin.rfqs.actions.mark_read')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div >
  );
}
