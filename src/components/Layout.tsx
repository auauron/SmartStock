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
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Restock", path: "/restock", icon: RefreshCw },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

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
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isMounted) {
        updateProfile(user);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session?.user) {
          updateProfile(session.user);
        } else {
          setProfile(emptyProfile);
          clearCachedProfile();
        }
      }
    });

    void getInitialUser();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
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
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.fullName || "No name"}
                </p>
                {profile.businessName && (
                  <p className="text-xs font-medium text-emerald-600 truncate">
                    {profile.businessName}
                  </p>
                )}
                <p className="text-xs text-gray-500 truncate">
                  {profile.email || "No email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center cursor-pointer">
                <User className="w-4 h-4 text-emerald-700" />
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
