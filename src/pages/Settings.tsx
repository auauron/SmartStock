import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import {
  Save,
  User,
  Bell,
  Shield,
  Database,
  LogOut,
  Download,
  Upload,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { ToggleSwitch } from "../components/ui/ToggleSwitch";
import { supabase } from "../lib/supabaseClient";
import { clearCachedProfile } from "../hooks/useProfileCache";
import { clearCachedLogs } from "../hooks/useAuditLog";
import type { UserProfile, LayoutOutletContext } from "../types";

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
      clearCachedProfile();
      clearCachedLogs();
      await supabase.auth.signOut();
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
            <ProfileTab
              profile={profile}
              userInitials={userInitials}
              onChange={setProfile}
            />
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

/* ─── Profile Tab ───────────────────────────────────────────────────────────── */

function ProfileTab({
  profile,
  userInitials,
  onChange,
}: {
  profile: UserProfile;
  userInitials: string;
  onChange: (p: UserProfile) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Avatar + Name Preview */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <span className="text-xl font-semibold text-emerald-700">
            {userInitials}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-gray-900 truncate">
            {profile.fullName || "Your Name"}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {profile.email || "your@email.com"}
          </p>
          {profile.businessName && (
            <p className="text-xs font-medium text-emerald-600 mt-0.5">
              {profile.businessName}
            </p>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          id="settings-fullname"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          className="py-2"
          value={profile.fullName}
          onChange={(e) =>
            onChange({ ...profile, fullName: e.target.value })
          }
        />
        <InputField
          id="settings-email"
          type="email"
          label="Email"
          placeholder="john@example.com"
          className="py-2"
          value={profile.email}
          onChange={(e) =>
            onChange({ ...profile, email: e.target.value })
          }
        />
      </div>
      <InputField
        id="settings-business"
        type="text"
        label="Business Name"
        placeholder="My Small Business"
        className="py-2"
        value={profile.businessName}
        onChange={(e) =>
          onChange({ ...profile, businessName: e.target.value })
        }
      />

      <div className="flex justify-end pt-2">
        <Button className="px-6">
          <Save className="w-4 h-4" />
          Save Profile
        </Button>
      </div>
    </div>
  );
}

/* ─── Notifications Tab ─────────────────────────────────────────────────────── */

function NotificationsTab() {
  return (
    <div className="space-y-1">
      <div className="pb-4 border-b border-gray-100 mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Choose how you want to be notified about stock changes
        </p>
      </div>

      <div className="space-y-5">
        <ToggleSwitch
          id="low-stock-alerts"
          label="Low Stock Alerts"
          description="Get notified when products fall below minimum stock level"
          defaultChecked
        />
        <div className="border-t border-gray-50" />
        <ToggleSwitch
          id="restock-confirmations"
          label="Restock Confirmations"
          description="Receive confirmation when products are restocked"
          defaultChecked
        />
        <div className="border-t border-gray-50" />
        <ToggleSwitch
          id="email-notifications"
          label="Email Notifications"
          description="Send notifications to your email address"
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button className="px-6">
          <Save className="w-4 h-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

/* ─── Security Tab ──────────────────────────────────────────────────────────── */

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-gray-400" />
          <h3 className="text-base font-semibold text-gray-900">
            Change Password
          </h3>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">
          Update your password to keep your account secure
        </p>
      </div>

      <InputField
        id="settings-current-password"
        type="password"
        label="Current Password"
        placeholder="Enter current password"
        className="py-2"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          id="settings-new-password"
          type="password"
          label="New Password"
          placeholder="Enter new password"
          className="py-2"
        />
        <InputField
          id="settings-confirm-password"
          type="password"
          label="Confirm New Password"
          placeholder="Confirm new password"
          className="py-2"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button className="px-6">
          <Shield className="w-4 h-4" />
          Update Password
        </Button>
      </div>
    </div>
  );
}

/* ─── Data Tab ──────────────────────────────────────────────────────────────── */

function DataTab() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">
          Data Management
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Export or import your inventory data
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-500">
                Download all your inventory data as CSV
              </p>
            </div>
          </div>
          <Button variant="secondary" className="py-2">
            Export
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Import Data</p>
              <p className="text-sm text-gray-500">
                Import inventory data from CSV file
              </p>
            </div>
          </div>
          <Button variant="secondary" className="py-2">
            Import
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Logout Confirm Modal ──────────────────────────────────────────────────── */

function LogoutConfirmModal({
  isLoggingOut,
  onConfirm,
  onCancel,
}: {
  isLoggingOut: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Log out of Smart Stock?
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            You will need to sign in again to access your account.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            {isLoggingOut ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Log out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
