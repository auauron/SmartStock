import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  RefreshCw,
  Settings,
  Bell,
  Menu,
  X,
  User,
} from "lucide-react";
import type { UserProfile, LayoutOutletContext } from "../types";
import { supabase } from "../lib/supabaseClient";
import {
  clearCachedProfile,
  readCachedProfile,
  writeCachedProfile,
} from "../hooks/useProfileCache";
import { clearCachedLogs } from "../hooks/useAuditLog";
import { clearInventoryCache } from "../hooks/useInventory";
import { useNotifications } from "../hooks/useNotifications";

export type { LayoutOutletContext };

const emptyProfile: UserProfile = {
  fullName: "",
  email: "",
  businessName: "",
};

export function Layout() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    return readCachedProfile() || emptyProfile;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => Date.now());
  const [nowTick, setNowTick] = useState(() => Date.now());
  const location = useLocation();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
  } = useNotifications();

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Restock", path: "/restock", icon: RefreshCw },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const activeNavItem =
    navigation.find((item) => isActive(item.path)) ?? navigation[0];

  const minutesSinceUpdate = Math.max(
    0,
    Math.floor((nowTick - lastUpdatedAt) / 60000),
  );
  const lastUpdatedLabel =
    minutesSinceUpdate === 0
      ? "Last updated: just now"
      : minutesSinceUpdate === 1
        ? "Last updated: 1 min ago"
        : `Last updated: ${minutesSinceUpdate} mins ago`;

  useEffect(() => {
    let isMounted = true;

    const updateProfile = (user: SupabaseUser) => {
      const nextProfile: UserProfile = {
        fullName: String(user.user_metadata?.full_name ?? ""),
        email: user.email ?? "",
        businessName: String(user.user_metadata?.business_name ?? ""),
      };

      if (isMounted) {
        setProfile(nextProfile);
        writeCachedProfile(nextProfile);
      }
    };

    const getInitialUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && isMounted) {
        updateProfile(user);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session?.user) {
          updateProfile(session.user);
        } else {
          setProfile(emptyProfile);
          clearCachedProfile();
          clearCachedLogs();
          clearInventoryCache();
        }
      }
    });

    void getInitialUser();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setLastUpdatedAt(Date.now());
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-emerald-100/70 bg-gradient-to-b from-white via-white to-emerald-50/30 shadow-[4px_0_20px_-18px_rgba(15,23,42,0.45)] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mx-3 mt-3 rounded-xl border border-emerald-100/70 bg-white/90 px-3 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src="/smartstock.png"
                    alt="Smart Stock logo"
                    className="w-8 h-8 object-contain scale-110"
                  />
                </div>
                <div className="flex flex-col min-w-0 justify-center">
                  <span
                    className="font-semibold text-gray-900 truncate leading-tight"
                    title={profile.businessName || "Smart Stock"}
                  >
                    {profile.businessName || "Smart Stock"}
                  </span>
                  {profile.businessName && (
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider leading-none mt-0.5">
                      SMART STOCK
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pt-7 pb-5">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Main Menu
            </p>
            <div className="space-y-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      active
                        ? "bg-emerald-50 text-emerald-700 shadow-sm"
                        : "text-gray-800 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-opacity ${
                        active ? "bg-emerald-500 opacity-100" : "opacity-0"
                      }`}
                    />
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        active
                          ? "text-emerald-600"
                          : "text-gray-600 group-hover:text-gray-800"
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="px-3 pb-6 pt-2">
            <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/80 cursor-pointer">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate leading-tight">
                  {profile.fullName || profile.businessName || "Account"}
                </p>
                <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                  {profile.businessName || "Smart Stock"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 border-b border-gray-100/90 bg-white/80 shadow-[0_1px_0_0_rgba(243,244,246,0.95)] backdrop-blur-lg supports-[backdrop-filter]:bg-white/65">
          <div className="relative flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1">
              <p className="hidden pl-2 text-xs font-medium text-gray-500 sm:block">
                Pages /{" "}
                <span className="text-gray-700">{activeNavItem.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="hidden text-[11px] font-medium text-gray-500 lg:block">
                {lastUpdatedLabel}
              </p>
              <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50/90 px-1.5 py-1 shadow-sm">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-white hover:text-gray-700"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden text-left">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              No new notifications
                            </p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-emerald-50/30" : ""}`}
                            >
                              <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => {
                                  if (!n.isRead) markAsRead(n.id);
                                }}
                              >
                                <p
                                  className={`text-sm ${!n.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}
                                >
                                  {n.title}
                                </p>
                                <p
                                  className={`text-xs mt-0.5 ${!n.isRead ? "text-gray-600" : "text-gray-500"}`}
                                >
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1.5 uppercase font-medium tracking-wider">
                                  {n.time.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  •{" "}
                                  {n.time.toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(n.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                aria-label="Dismiss"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet context={{ profile }} />
        </main>
      </div>
    </div>
  );
}
