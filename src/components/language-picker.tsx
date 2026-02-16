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
    // Check if path starts with any language prefix (e.g., /zh, /fr)
    const langPrefixPattern = new RegExp(`^/(${Object.keys(languages).join('|')})(/|$)`);
    return path.replace(langPrefixPattern, '/') || '/';
  };

  const cleanPath = getCleanPath(currentPath);

  // Helper to construct new path
  const getLangPath = (lang: string) => {
    if (lang === defaultLang) return cleanPath;
    const prefix = `/${lang}`;
    return `${prefix}${cleanPath === '/' ? '' : cleanPath}`;
  };

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
              href={getLangPath(lang)}
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
