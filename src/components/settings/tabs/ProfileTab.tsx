import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "../../ui/Button";
import { InputField } from "../../ui/InputField";
import { supabase } from "../../../lib/supabaseClient";
import type { UserProfile } from "../../../types";

interface ProfileTabProps {
  profile: UserProfile;
  userInitials: string;
}

export function ProfileTab({ profile, userInitials }: ProfileTabProps) {
  const [draft, setDraft] = useState<UserProfile>({ ...profile });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          id="settings-fullname"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          maxLength={50}
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
          maxLength={100}
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
        maxLength={50}
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
