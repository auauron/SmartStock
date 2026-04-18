import { useState } from "react";
import { Shield, KeyRound } from "lucide-react";
import { Button } from "../../ui/Button";
import { InputField } from "../../ui/InputField";
import { supabase } from "../../../lib/supabaseClient";

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handlePasswordUpdate = async () => {
    if (!currentPassword) {
      setMessage({
        type: "error",
        text: "Please enter your current password.",
      });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update password.",
      });
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
        <Button
          className="px-6"
          onClick={handlePasswordUpdate}
          disabled={loading}
        >
          <Shield className="w-4 h-4" />
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}
