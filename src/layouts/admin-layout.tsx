
import { AdminI18nProvider, useAdminTranslation } from "@/components/admin/AdminI18nProvider";
import { AdminLanguagePicker } from "@/components/admin/AdminLanguagePicker";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { HeroUIProvider } from "@heroui/react";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Users
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

const NAV_ITEMS = [
  { name: "admin.dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "admin.products", href: "/admin/products", icon: Package },
  { name: "admin.rfqs", href: "/admin/rfqs", icon: FileText },
  { name: "admin.messages", href: "/admin/messages", icon: MessageSquare },
  { name: "admin.partners", href: "/admin/partners", icon: Users },
  { name: "admin.settings", href: "/admin/settings", icon: Settings },
];

function AdminLayoutContent({ children, currentPath: propCurrentPath }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState(propCurrentPath || (typeof window !== 'undefined' ? window.location.pathname : ''));
  const { t } = useAdminTranslation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!propCurrentPath) {
      const handleLocationChange = () => setCurrentPath(window.location.pathname);
      window.addEventListener('popstate', handleLocationChange);
      return () => window.removeEventListener('popstate', handleLocationChange);
    }
  }, [propCurrentPath]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/admin/login";
      } else {
        setUserEmail(session.user.email ?? null);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <HeroUIProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
            !isSidebarOpen && "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t('admin.console')}
              </span>
            </div>
          </div>
          <nav className="flex flex-col p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 mb-2">
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {t('admin.main_nav')}
              </p>
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href || (item.href !== "/admin" && currentPath?.startsWith(item.href));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 mr-3 transition-colors",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  )} />
                  {t(item.name)}
                </a>
              );
            })}
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            {userEmail && (
              <div className="mb-4 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-sm text-left">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">{t('admin.welcome_user')}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" title={userEmail}>
                  {userEmail}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 mb-2">
              <AdminLanguagePicker />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
              {t('admin.logout')}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 md:hidden">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold tracking-tight">{t('admin.console')}</span>
            <AdminLanguagePicker />
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 dark:bg-zinc-950 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </HeroUIProvider>
  );
}

import { AdminDialogContainer } from "@/components/admin/AdminDialogContainer";

export default function AdminLayout(props: AdminLayoutProps) {
  return (
    <AdminI18nProvider>
      <AdminLayoutContent {...props} />
      <AdminDialogContainer />
    </AdminI18nProvider>
  );
}
