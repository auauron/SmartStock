import { useState, useEffect, useRef } from "react";
import { Save, Camera, X, Upload } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button } from "../../ui/Button";
import { InputField } from "../../ui/InputField";
import { Modal } from "../../ui/Modal";
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

  // Image Upload & Cropping State
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft({ ...profile });
  }, [profile]);

  const hasChanges =
    draft.fullName !== profile.fullName ||
    draft.email !== profile.email ||
    draft.businessName !== profile.businessName ||
    draft.avatarUrl !== profile.avatarUrl;

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Reset crop
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
      reader.readAsDataURL(e.target.files[0]);
      setIsCropModalOpen(true);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, // 1:1 aspect ratio
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error("Canvas is empty"));
        else resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleUpload = async () => {
    if (!completedCrop || !imgRef.current) return;

    setSaving(true);
    try {
      const blob = await getCroppedImg(imgRef.current, completedCrop);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No user found");

      const fileExt = "jpg";
      const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, blob, { upsert: true });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setDraft((prev) => ({ ...prev, avatarUrl: publicUrl }));
      setIsCropModalOpen(false);
      setSaveMessage({ type: "success", text: "Image cropped! Save profile to apply." });
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to upload image",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        email: draft.email !== profile.email ? draft.email : undefined,
        data: {
          full_name: draft.fullName,
          business_name: draft.businessName,
          avatar_url: draft.avatarUrl,
        },
      });

      if (authError) throw authError;

      // 2. Update Public Profiles table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: draft.fullName,
            business_name: draft.businessName,
            avatar_url: draft.avatarUrl,
          })
          .eq("id", user.id);

        if (profileError) throw profileError;
      }

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
      <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 overflow-hidden border-4 border-white shadow-sm">
            {draft.avatarUrl ? (
              <img src={draft.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold text-emerald-700">
                {userInitials}
              </span>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onSelectFile}
          />
        </div>
        
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {profile.fullName || "Your Name"}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {profile.email || "your@email.com"}
          </p>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Change Photo
            </button>
            {draft.avatarUrl && (
              <button 
                onClick={() => setDraft(prev => ({ ...prev, avatarUrl: "" }))}
                className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
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

      {/* Cropping Modal */}
      <Modal 
        isOpen={isCropModalOpen} 
        onClose={() => setIsCropModalOpen(false)}
        title="Crop Profile Picture"
        panelClassName="max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-auto flex justify-center bg-gray-50/50 rounded-xl p-4 border border-gray-100 shadow-inner scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                className="max-w-full m-auto"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-w-full object-contain"
                  style={{ maxHeight: '50vh' }}
                />
              </ReactCrop>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6 shrink-0">
            <Button variant="secondary" onClick={() => setIsCropModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={saving || !completedCrop}>
              {saving ? "Uploading..." : "Apply Crop"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
