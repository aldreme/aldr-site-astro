import { adminDialogAtom } from '@/store/admin-ui';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useAdminTranslation } from './AdminI18nProvider';

export function AdminDialogContainer() {
  const [dialog, setDialog] = useAtom(adminDialogAtom);
  const { t } = useAdminTranslation();
  const [promptValue, setPromptValue] = useState("");

  useEffect(() => {
    if (dialog.isOpen && dialog.type === 'prompt') {
      setPromptValue(dialog.defaultValue || "");
    }
  }, [dialog.isOpen, dialog.type, dialog.defaultValue]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (dialog.resolve) dialog.resolve(dialog.type === 'prompt' ? null : false);
      setDialog((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleCancel = () => {
    if (dialog.resolve) dialog.resolve(dialog.type === 'prompt' ? null : false);
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (dialog.resolve) {
      if (dialog.type === 'prompt') {
        dialog.resolve(promptValue);
      } else {
        dialog.resolve(true);
      }
    }
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <Modal
      isOpen={dialog.isOpen}
      onOpenChange={handleOpenChange}
      backdrop="blur"
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {dialog.title}
            </ModalHeader>
            <ModalBody>
              <p>{dialog.description}</p>
              {dialog.type === 'prompt' && (
                <Input
                  autoFocus
                  placeholder={dialog.placeholder}
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirm();
                  }}
                />
              )}
            </ModalBody>
            <ModalFooter>
              {(dialog.type === 'confirm' || dialog.type === 'prompt') && (
                <Button color="danger" variant="light" onPress={handleCancel}>
                  {t('admin.common.cancel') || 'Cancel'}
                </Button>
              )}
              <Button color="primary" onPress={handleConfirm}>
                {dialog.type === 'confirm' ? (t('admin.common.confirm') || 'Confirm') : (t('admin.common.ok') || 'OK')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
