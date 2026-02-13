import { supabase } from "@/lib/supabase";
import {
  Activity,
  Box,
  FileText,
  MessageSquare,
  Package,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminTranslation } from "./AdminI18nProvider";

export default function Dashboard() {
  const { t } = useAdminTranslation();
  const [stats, setStats] = useState({
    products: 0,
    partners: 0,
    rfqs: 0,
    messages: 0,
    unreadRfqs: 0,
    unreadMessages: 0,
    rfqTrend: { text: "", color: "gray" as "green" | "red" | "gray" },
    msgTrend: { text: "", color: "gray" as "green" | "red" | "gray" }
  });

  useEffect(() => {
    async function fetchStats() {
      const now = new Date();
      const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

      const [
        products,
        partners,
        rfqsTotal,
        messagesTotal,
        rfqsCurrentMonth,
        rfqsLastMonth,
        msgsCurrentMonth,
        msgsLastMonth,
        unreadRfqs,
        unreadMessages
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("partners").select("*", { count: "exact", head: true }),
        supabase.from("customer_request_for_quotes").select("*", { count: "exact", head: true }),
        supabase.from("cx_contact_messages").select("*", { count: "exact", head: true }),
        // Current Month
        supabase.from("customer_request_for_quotes").select("*", { count: "exact", head: true }).gte("created_at", firstDayCurrentMonth),
        supabase.from("cx_contact_messages").select("*", { count: "exact", head: true }).gte("created_at", firstDayCurrentMonth),
        // Previous Month
        supabase.from("customer_request_for_quotes").select("*", { count: "exact", head: true })
          .gte("created_at", firstDayLastMonth)
          .lt("created_at", firstDayCurrentMonth),
        supabase.from("cx_contact_messages").select("*", { count: "exact", head: true })
          .gte("created_at", firstDayLastMonth)
          .lt("created_at", firstDayCurrentMonth),
        // Unread
        supabase.from("customer_request_for_quotes").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("cx_contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);

      const calculateTrend = (current: number, last: number) => {
        if (last === 0) {
          return {
            text: current > 0 ? `+${current} ${t('admin.dashboard.trend.new')}` : t('admin.dashboard.trend.no_change'),
            color: (current > 0 ? "green" : "gray") as "green" | "red" | "gray"
          };
        }
        const diff = ((current - last) / last) * 100;
        return {
          text: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}% ${t('admin.dashboard.trend.from_last_month')}`,
          color: (diff > 0 ? "green" : diff < 0 ? "red" : "gray") as "green" | "red" | "gray"
        };
      };

      setStats({
        products: products.count || 0,
        partners: partners.count || 0,
        rfqs: rfqsTotal.count || 0,
        messages: messagesTotal.count || 0,
        unreadRfqs: unreadRfqs.count || 0,
        unreadMessages: unreadMessages.count || 0,
        rfqTrend: calculateTrend(rfqsCurrentMonth.count || 0, rfqsLastMonth.count || 0),
        msgTrend: calculateTrend(msgsCurrentMonth.count || 0, msgsLastMonth.count || 0)
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('admin.dashboard.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('admin.dashboard.welcome')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title={t('admin.dashboard.total_rfqs')}
          value={stats.rfqs.toLocaleString()}
          icon={FileText}
          trend={stats.rfqTrend.text}
          trendColor={stats.rfqTrend.color}
          color="orange"
          isAlert={stats.unreadRfqs > 0}
        />
        <DashboardCard
          title={t('admin.dashboard.total_messages')}
          value={stats.messages.toLocaleString()}
          icon={MessageSquare}
          trend={stats.msgTrend.text}
          trendColor={stats.msgTrend.color}
          color="violet"
          isAlert={stats.unreadMessages > 0}
        />
        <DashboardCard
          title={t('admin.dashboard.total_products')}
          value={stats.products.toLocaleString()}
          icon={Package}
          color="blue"
        />
        <DashboardCard
          title={t('admin.dashboard.total_partners')}
          value={stats.partners.toLocaleString()}
          icon={Users}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.dashboard.recent_activity')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('admin.dashboard.live_updates')}</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-gray-200 dark:text-zinc-700" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium">{t('admin.dashboard.no_activity')}</p>
            <p className="text-sm text-gray-500 mt-1">{t('admin.dashboard.activity_feed_desc')}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.dashboard.quick_actions')}</h3>
            <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <Box className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="grid gap-3">
            <a
              href="/admin/products/new"
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-gray-100 dark:border-zinc-700 group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('admin.dashboard.add_product')}</span>
              </div>
              <Activity className="w-4 h-4 text-gray-300 group-hover:text-blue-400 -rotate-90" />
            </a>
            <a
              href="/admin/partners"
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-gray-100 dark:border-zinc-700 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('admin.dashboard.manage_partners')}</span>
              </div>
              <Activity className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 -rotate-90" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: any;
  trend?: string;
  trendColor?: "green" | "red" | "gray";
  color: "blue" | "indigo" | "orange" | "violet";
  isAlert?: boolean;
}

function DashboardCard({ title, value, icon: Icon, trend, trendColor = "gray", color, isAlert }: CardProps) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
    violet: "text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400",
  };

  const trendColorMap = {
    green: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    red: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    gray: "text-gray-500 bg-gray-50 dark:bg-zinc-800 dark:text-gray-400",
  };

  return (
    <div className="relative group p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-gray-200/40 dark:hover:shadow-none transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className={cn("p-3 rounded-2xl inline-flex", colorMap[color])}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
          </div>
        </div>
        {isAlert && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>
      {trend && (
        <div className="mt-6 flex items-center gap-1.5">
          <span className={cn(
            "text-xs font-bold px-2.5 py-1 rounded-full",
            trendColorMap[trendColor]
          )}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}

// Helper for cn in this file if not imported (it is imported in components usually)
import { cn } from "@/lib/utils";
