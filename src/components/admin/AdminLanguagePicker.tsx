import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@heroui/react";
import { Globe } from "lucide-react";
import { useAdminTranslation } from "./AdminI18nProvider";

export function AdminLanguagePicker() {
  const { locale, setLocale } = useAdminTranslation();

  const languages = {
    en: "English",
    zh: "简体中文"
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button isIconOnly variant="light" className="text-gray-500 dark:text-gray-400">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        {Object.entries(languages).map(([lang, label]) => (
          <DropdownMenuItem
            key={lang}
            className={`cursor-pointer ${locale === lang ? 'font-bold bg-gray-100 dark:bg-zinc-800' : ''}`}
            onClick={() => setLocale(lang as 'en' | 'zh')}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
