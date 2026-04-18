import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "../../ui/Button";
import { ToggleSwitch } from "../../ui/ToggleSwitch";

export function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    lowStockAlerts: true,
    restockConfirmations: true,
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
          onChange={(e) =>
            setPrefs((p) => ({ ...p, lowStockAlerts: e.target.checked }))
          }
        />
        <div className="border-t border-gray-50" />
        <ToggleSwitch
          id="restock-confirmations"
          label="Restock Confirmations"
          description="Receive confirmation when products are restocked"
          checked={prefs.restockConfirmations}
          onChange={(e) =>
            setPrefs((p) => ({ ...p, restockConfirmations: e.target.checked }))
          }
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
