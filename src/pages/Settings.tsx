import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { Save, User, Bell, Shield, Database } from "lucide-react";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { ToggleSwitch } from "../components/ui/ToggleSwitch";
import type { UserProfile } from "../components/auth/DisplayProfile";
import type { LayoutOutletContext } from "../components/Layout";

export function Settings() {
  const { profile: loadedProfile } = useOutletContext<LayoutOutletContext>();
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    businessName: "",
  });

  useEffect(() => {
    setProfile(loadedProfile);
  }, [loadedProfile]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <User className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Settings
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField
                type="text"
                label="Full Name"
                placeholder="John Doe"
                className="py-2"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
            </div>
            <div>
              <InputField
                type="email"
                label="Email"
                placeholder="john@example.com"
                className="py-2"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <InputField
              type="text"
              label="Business Name"
              placeholder="My Small Business"
              className="py-2"
              value={profile.businessName}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  businessName: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Notification Settings
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <ToggleSwitch
            id="low-stock-alerts"
            label="Low Stock Alerts"
            description="Get notified when products fall below minimum stock level"
            defaultChecked
          />
          <ToggleSwitch
            id="restock-confirmations"
            label="Restock Confirmations"
            description="Receive confirmation when products are restocked"
            defaultChecked
          />
          <ToggleSwitch
            id="email-notifications"
            label="Email Notifications"
            description="Send notifications to your email address"
          />
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <InputField
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              className="py-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField
                type="password"
                label="New Password"
                placeholder="Enter new password"
                className="py-2"
              />
            </div>
            <div>
              <InputField
                type="password"
                label="Confirm New Password"
                placeholder="Confirm new password"
                className="py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Database className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Data Management
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600 mt-0.5">
                Download all your inventory data as CSV
              </p>
            </div>
            <Button variant="secondary" className="py-2">
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Import Data</p>
              <p className="text-sm text-gray-600 mt-0.5">
                Import inventory data from CSV file
              </p>
            </div>
            <Button variant="secondary" className="py-2">
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="px-6">
          <Save className="w-5 h-5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
