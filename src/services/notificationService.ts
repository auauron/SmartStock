import { supabase } from "../lib/supabaseClient";
import type { NotificationPreferences } from "../types";

export const notificationService = {
  async getPreferences(): Promise<NotificationPreferences> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("low_stock_alerts, restock_confirmations")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is 'no rows returned'
      throw error;
    }

    // Default values if no record exists yet
    if (!data) {
      return {
        lowStockAlerts: true,
        restockConfirmations: true,
      };
    }

    return {
      lowStockAlerts: data.low_stock_alerts,
      restockConfirmations: data.restock_confirmations,
    };
  },

  async updatePreferences(prefs: NotificationPreferences): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("notification_preferences")
      .upsert({
        user_id: user.id,
        low_stock_alerts: prefs.lowStockAlerts,
        restock_confirmations: prefs.restockConfirmations,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  },
};
