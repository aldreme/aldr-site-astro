import { atom, useSetAtom } from "jotai";

export type DialogType = "alert" | "confirm" | "prompt";

export interface DialogState {
  isOpen: boolean;
  type: DialogType;
  title?: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  resolve?: (value: any) => void;
}

export const adminDialogAtom = atom<DialogState>({
  isOpen: false,
  type: "confirm",
});

export function useAdminDialog() {
  const setDialog = useSetAtom(adminDialogAtom);

  const confirm = (
    options: { title?: string; description?: string },
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: "confirm",
        title: options.title || "Confirm Action",
        description: options.description || "Are you sure you want to proceed?",
        resolve: (value: boolean) => {
          setDialog((prev) => ({ ...prev, isOpen: false }));
          resolve(value);
        },
      });
    });
  };

  const alert = (
    message: string,
    options?: { title?: string },
  ): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: "alert",
        title: options?.title || "Alert",
        description: message,
        resolve: () => {
          setDialog((prev) => ({ ...prev, isOpen: false }));
          resolve();
        },
      });
    });
  };

  const prompt = (
    message: string,
    options?: { title?: string; defaultValue?: string; placeholder?: string },
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: "prompt",
        title: options?.title || "Input Required",
        description: message,
        defaultValue: options?.defaultValue,
        placeholder: options?.placeholder,
        resolve: (value: string | null) => {
          setDialog((prev) => ({ ...prev, isOpen: false }));
          resolve(value);
        },
      });
    });
  };

  return { confirm, alert, prompt };
}
