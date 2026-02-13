
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
import { ChevronDown, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";

const STATUS_COLOR_MAP: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
  new: "primary",
  read: "secondary",
  responded: "success",
  archived: "default",
};

import { useAdminTranslation } from "../AdminI18nProvider";

export default function MessageList() {
  const { t } = useAdminTranslation();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cx_contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setMessages(data || []);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from("cx_contact_messages")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      fetchMessages();
    }
  };

  const handleView = (msg: any) => {
    setSelectedMessage(msg);
    // Mark as read if new?
    if (msg.status === 'new') {
      handleUpdateStatus(msg.id, 'read');
    }
    onOpen();
  };

  const columns = [
    { name: t('admin.messages.columns.status'), uid: "status" },
    { name: t('admin.messages.columns.name'), uid: "name" },
    { name: t('admin.messages.columns.email'), uid: "email" },
    { name: t('admin.messages.columns.company'), uid: "company" },
    { name: t('admin.messages.columns.date'), uid: "created_at" },
    { name: t('admin.product_list.columns.actions'), uid: "actions" },
  ];

  const renderCell = (msg: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "status":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Chip className="cursor-pointer" color={STATUS_COLOR_MAP[msg.status] || "default"} size="sm" variant="flat" endContent={<ChevronDown className="w-3 h-3" />}>
                {msg.status ? t(`admin.status.${msg.status}`) : t('admin.status.new')}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status Actions"
              onAction={(key) => handleUpdateStatus(msg.id, key as string)}
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
      case "name":
        return `${msg.first_name} ${msg.last_name}`;
      case "created_at":
        return new Date(msg.created_at).toLocaleDateString();
      case "actions":
        return (
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleView(msg)}>
            <Eye className="w-4 h-4" />
          </span>
        );
      default:
        return msg[columnKey as keyof any];
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('admin.messages.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('admin.messages.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-4xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <Table
          aria-label="Messages management table"
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
          <TableBody items={messages} isLoading={loading} loadingContent={<div>{t('admin.messages.loading')}</div>} emptyContent={t('admin.messages.empty')}>
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.messages.modal.title')}</h3>
              </ModalHeader>
              <ModalBody className="py-6">
                {selectedMessage && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.messages.details.sender')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedMessage.first_name} {selectedMessage.last_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.messages.details.date')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.messages.details.email')}</p>
                        <p className="font-medium text-blue-600 dark:text-blue-400">{selectedMessage.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.messages.details.phone')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedMessage.phone || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.messages.details.company')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedMessage.company || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('admin.messages.details.industry')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedMessage.industry || "N/A"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">{t('admin.messages.details.message')}</p>
                      <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-2xl text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-zinc-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  radius="full"
                  className="font-medium"
                >
                  {t('admin.messages.actions.close')}
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  radius="full"
                  className="font-bold shadow-lg shadow-blue-500/20"
                >
                  {t('admin.messages.actions.mark_read')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
