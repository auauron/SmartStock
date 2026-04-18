import { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../ui/Button";
import { ToggleSwitch } from "../../ui/ToggleSwitch";
import { notificationService } from "../../../services/notificationService";
import { notificationSubject } from "../../../services/notificationObserver";

export function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    lowStockAlerts: true,
    restockConfirmations: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const data = await notificationService.getPreferences();
        setPrefs(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPrefs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await notificationService.updatePreferences(prefs);
      notificationSubject.notify("preferences-changed");
      setStatus({
        type: "success",
        message: "Preferences updated successfully",
      });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
      setStatus({ type: "error", message: "Failed to save preferences" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-gray-100 mb-4">
          <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mt-1" />
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white p-2"
            >
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-11 bg-gray-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="pb-4 border-b border-gray-100 mb-4">
        <h3 className="text-base font-semibold text-gray-900 tracking-tight uppercase">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Configure real-time monitoring and alert thresholds
        </p>
      </div>

      <div className="space-y-5">
        {status && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border animate-in slide-in-from-top-2 duration-300 ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-red-50 text-red-700 border-red-100"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {status.message}
          </div>
        )}

        <ToggleSwitch
          id="low-stock-alerts"
          label="Low Stock Alerts"
          description="Initiate diagnostic signals when units drop below safety thresholds"
          checked={prefs.lowStockAlerts}
          onChange={(e) =>
            setPrefs((p) => ({ ...p, lowStockAlerts: e.target.checked }))
          }
        />
        <div className="border-t border-gray-100/50" />
        <ToggleSwitch
          id="restock-confirmations"
          label="Restock Confirmations"
          description="Receive automated manifests when inventory levels are replenished"
          checked={prefs.restockConfirmations}
          onChange={(e) =>
            setPrefs((p) => ({ ...p, restockConfirmations: e.target.checked }))
          }
        />
      </div>

      <div className="flex justify-end pt-8">
        <Button
          className="px-6 min-w-[160px]"
          onClick={handleSave}
          disabled={saving}
          variant="primary"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Preference</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
