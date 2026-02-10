
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

export default function RFQList() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRfq, setSelectedRfq] = useState<any>(null);

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
      alert("Error updating status: " + error.message);
    } else {
      fetchRfqs();
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
    { name: "STATUS", uid: "status" },
    { name: "SUBJECT", uid: "cx_rfq_subject" },
    { name: "REP NAME", uid: "cx_rep_name" },
    { name: "COMPANY", uid: "cx_company" },
    { name: "DELIVERY", uid: "expected_delivery_date" },
    { name: "DATE", uid: "created_at" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (rfq: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "status":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Chip className="cursor-pointer" color={STATUS_COLOR_MAP[rfq.status] || "default"} size="sm" variant="flat" endContent={<ChevronDown className="w-3 h-3" />}>
                {rfq.status ? rfq.status.toUpperCase() : "NEW"}
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
              <DropdownItem key="new" className="text-blue-600 dark:text-blue-400">New</DropdownItem>
              <DropdownItem key="read" className="text-zinc-600 dark:text-zinc-400">Read</DropdownItem>
              <DropdownItem key="responded" className="text-green-600 dark:text-green-400">Responded</DropdownItem>
              <DropdownItem key="archived" className="text-red-600 dark:text-red-400">Archived</DropdownItem>
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
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleView(rfq)}>
            <Eye className="w-4 h-4" />
          </span>
        );
      default:
        return rfq[columnKey as keyof any];
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Request For Quotes</h1>
        <p className="text-gray-500 dark:text-gray-400">Incoming product inquiries and RFQs</p>
      </div>

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
        >
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
          </TableHeader>
          <TableBody items={rfqs} isLoading={loading} loadingContent={<div>Loading RFQs...</div>} emptyContent={"No RFQs found"}>
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">RFQ Details</h3>
                <p className="text-sm font-normal text-gray-500">Inquiry ID: #{selectedRfq?.id ? String(selectedRfq.id).substring(0, 8) : "N/A"}</p>
              </ModalHeader>
              <ModalBody className="py-6">
                {selectedRfq && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRfq.cx_rfq_subject}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Received</p>
                        <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedRfq.created_at).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sender</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRfq.cx_rep_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                        <p className="font-medium text-blue-600 dark:text-blue-400">{selectedRfq.cx_email_addr}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRfq.cx_company}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expected Delivery</p>
                        <p className="font-medium text-orange-600 dark:text-orange-400">
                          {selectedRfq.expected_delivery_date
                            ? new Date(selectedRfq.expected_delivery_date).toLocaleDateString()
                            : "As soon as possible"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRfq.cx_contact_number || "N/A"}</p>
                      </div>
                    </div>

                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-blue-600/60 dark:text-blue-400/60 uppercase tracking-tight">Primary Product</p>
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{selectedRfq.cx_rfq_product}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-blue-600/60 dark:text-blue-400/60 uppercase tracking-tight">Total Quantity</p>
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{selectedRfq.quantity_needed || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {selectedRfq.cx_rfq_items && Array.isArray(selectedRfq.cx_rfq_items) && selectedRfq.cx_rfq_items.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Consolidated Items ({selectedRfq.cx_rfq_items.length})</p>
                        <div className="bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead>
                              <tr className="bg-gray-100/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                                <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">Product</th>
                                <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider text-center">Qty</th>
                                <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider text-right">Target Date</th>
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
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Message Content</p>
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
                  Close Inquiry
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  radius="full"
                  className="font-bold shadow-lg shadow-blue-500/20"
                >
                  Mark as Read
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
