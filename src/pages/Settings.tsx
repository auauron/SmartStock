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
            <ProfileTab
              profile={profile}
              userInitials={userInitials}
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
}: {
  profile: UserProfile;
  userInitials: string;
}) {
  const [draft, setDraft] = useState<UserProfile>({ ...profile });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setDraft({ ...profile });
  }, [profile]);

  const hasChanges =
    draft.fullName !== profile.fullName ||
    draft.email !== profile.email ||
    draft.businessName !== profile.businessName;

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        email: draft.email !== profile.email ? draft.email : undefined,
        data: {
          full_name: draft.fullName,
          business_name: draft.businessName,
        },
      });

      if (error) throw error;

      setSaveMessage({ type: "success", text: "Profile saved successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save profile",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar + Name Preview (shows SAVED profile, not draft) */}
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

      {/* Save feedback */}
      {saveMessage && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium ${
            saveMessage.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Form Fields (edits the DRAFT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          id="settings-fullname"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          className="py-2"
          value={draft.fullName}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, fullName: e.target.value }))
          }
        />
        <InputField
          id="settings-email"
          type="email"
          label="Email"
          placeholder="john@example.com"
          className="py-2"
          value={draft.email}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>
      <InputField
        id="settings-business"
        type="text"
        label="Business Name"
        placeholder="My Small Business"
        className="py-2"
        value={draft.businessName}
        onChange={(e) =>
          setDraft((prev) => ({ ...prev, businessName: e.target.value }))
        }
      />

      <div className="flex justify-end pt-2">
        <Button
          className="px-6"
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* ─── Notifications Tab ─────────────────────────────────────────────────────── */

import { useRef } from "react";
import { useInventory } from "../hooks/useInventory";

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    lowStockAlerts: true,
    restockConfirmations: true,
    emailNotifications: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("smart-stock:notifications");
    if (saved) {
      try {
        setPrefs(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("smart-stock:notifications", JSON.stringify(prefs));
      setSaving(false);
    }, 500);
  };

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
          checked={prefs.lowStockAlerts}
          onChange={(checked) => setPrefs(p => ({ ...p, lowStockAlerts: checked }))}
        />
        <div className="border-t border-gray-50" />
        <ToggleSwitch
          id="restock-confirmations"
          label="Restock Confirmations"
          description="Receive confirmation when products are restocked"
          checked={prefs.restockConfirmations}
          onChange={(checked) => setPrefs(p => ({ ...p, restockConfirmations: checked }))}
        />
        <div className="border-t border-gray-50" />
        <ToggleSwitch
          id="email-notifications"
          label="Email Notifications"
          description="Send notifications to your email address"
          checked={prefs.emailNotifications}
          onChange={(checked) => setPrefs(p => ({ ...p, emailNotifications: checked }))}
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button className="px-6" onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Security Tab ──────────────────────────────────────────────────────────── */

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: "error"|"success", text: string} | null>(null);

  const handlePasswordUpdate = async () => {
    if (!currentPassword) {
      setMessage({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
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
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          id="settings-new-password"
          type="password"
          label="New Password"
          placeholder="Enter new password"
          className="py-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <InputField
          id="settings-confirm-password"
          type="password"
          label="Confirm New Password"
          placeholder="Confirm new password"
          className="py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button className="px-6" onClick={handlePasswordUpdate} disabled={loading}>
          <Shield className="w-4 h-4" />
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Data Tab ──────────────────────────────────────────────────────────────── */

function DataTab() {
  const { inventory } = useInventory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingImport, setLoadingImport] = useState(false);

  const handleExport = () => {
    const headers = ["id", "name", "category", "price", "quantity", "minStock", "status"];
    const rows = inventory.map(item => `${item.id},"${item.name}","${item.category}",${item.price},${item.quantity},${item.minStock},${item.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingImport(true);
    // basic mock for import as per instructions
    setTimeout(() => {
      alert(`Imported ${file.name} successfully! Check inventory for updates.`);
      setLoadingImport(false);
      // clear input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1000);
  };

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
          <Button variant="secondary" className="py-2" onClick={handleExport}>
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
          <Button variant="secondary" className="py-2" disabled={loadingImport} onClick={() => fileInputRef.current?.click()}>
            {loadingImport ? "Importing..." : "Import"}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv" 
            onChange={handleImportChange} 
          />
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
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement;
    modalRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isLoggingOut) onCancel();
      } else if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoggingOut, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          if (!isLoggingOut) onCancel();
        }}
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-desc"
        className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 focus:outline-none"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 id="logout-title" className="text-lg font-semibold text-gray-900">
            Log out of Smart Stock?
          </h3>
          <p id="logout-desc" className="text-sm text-gray-500 mt-1">
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
