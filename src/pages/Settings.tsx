import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { User, Bell, Shield, Database, LogOut } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { clearCachedProfile } from "../hooks/useProfileCache";
import { clearCachedLogs } from "../hooks/useAuditLog";
import type { UserProfile, LayoutOutletContext } from "../types";

import { ProfileTab } from "../components/settings/tabs/ProfileTab";
import { NotificationsTab } from "../components/settings/tabs/NotificationsTab";
import { SecurityTab } from "../components/settings/tabs/SecurityTab";
import { DataTab } from "../components/settings/tabs/DataTab";
import { LogoutConfirmModal } from "../components/settings/LogoutConfirmModal";

type SettingsTab = "profile" | "notifications" | "security" | "data";

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon: typeof User;
}

const tabs: TabConfig[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "data", label: "Data", icon: Database },
];

export function Settings() {
  const { profile: loadedProfile } = useOutletContext<LayoutOutletContext>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    businessName: "",
  });

  useEffect(() => {
    setProfile(loadedProfile);
  }, [loadedProfile]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setIsLoggingOut(false);
        setShowLogoutConfirm(false);
        return;
      }
      clearCachedProfile();
      clearCachedLogs();
      navigate("/", { replace: true });
    } catch {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  }, [navigate]);

  const userInitials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account and application preferences
          </p>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 cursor-pointer"
          aria-label="Log out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <nav className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer
                  ${
                    isActive
                      ? "text-emerald-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <ProfileTab profile={profile} userInitials={userInitials} />
          )}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "data" && <DataTab />}
        </div>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <LogoutConfirmModal
          isLoggingOut={isLoggingOut}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}
