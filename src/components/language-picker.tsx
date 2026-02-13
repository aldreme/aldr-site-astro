import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultLang, languages } from "@/i18n/ui";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";

interface LanguagePickerProps {
  currentLang?: string;
  currentPath?: string;
}

export function LanguagePicker({ currentLang = defaultLang, currentPath = '/' }: LanguagePickerProps) {
  // Simple logic to get clean path without locale prefix
  const getCleanPath = (path: string) => {
    // If path starts with /zh/, remove it
    if (path.startsWith('/zh/') || path === '/zh') {
      return path.replace(/^\/zh/, '') || '/';
    }
    return path;
  };

  const cleanPath = getCleanPath(currentPath);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-100 hover:bg-zinc-800 hover:text-white">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-100">
        {Object.entries(languages).map(([lang, label]) => (
          <DropdownMenuItem key={lang} className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <a
              href={lang === defaultLang ? cleanPath : `/zh${cleanPath === '/' ? '' : cleanPath}`}
              className={`w-full ${currentLang === lang ? 'font-bold text-white' : 'text-zinc-400'}`}
            >
              {label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
