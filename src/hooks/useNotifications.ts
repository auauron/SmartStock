import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { notificationService } from '../services/notificationService';

export interface AppNotification {
  id: string;
  type: 'low_stock' | 'restock';
  title: string;
  message: string;
  time: Date;
  isRead: boolean;
  link?: string;
}

const POLLING_INTERVAL = 30000; // 30 seconds

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const fetchNotifications = useCallback(async () => {
    // 1. Get user preferences from Supabase
    let prefs = { lowStockAlerts: true, restockConfirmations: true };
    try {
      prefs = await notificationService.getPreferences();
    } catch (err) {
      console.error("Failed to fetch notification preferences:", err);
    }

    // 2. Get local read states
    const savedReadState = localStorage.getItem("smart-stock:read-notifications");
    let readState: Record<string, boolean> = {};
    if (savedReadState) {
      try { readState = JSON.parse(savedReadState); } catch(e) {}
    }

    // 3. Get cleared notifications
    const savedClearedState = localStorage.getItem("smart-stock:cleared-notifications");
    let clearedState: Record<string, boolean> = {};
    if (savedClearedState) {
      try { clearedState = JSON.parse(savedClearedState); } catch(e) {}
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let newNotifications: AppNotification[] = [];

    // Fetch Low Stock
    if (prefs.lowStockAlerts) {
      const { data: invData } = await supabase
        .from('inventories')
        .select('*')
        .eq('user_id', user.id);

      if (invData) {
        // Find items that are strictly under the min stock and greater than or equal to 0
        const lowStockItems = invData.filter((i: any) => i.quantity < i.min_stock);
        lowStockItems.forEach((item: any) => {
          const id = `low-stock-${item.id}`;
          if (!clearedState[id]) {
            newNotifications.push({
              id,
              type: 'low_stock',
              title: 'Low Stock Alert',
              message: `${item.name} is running low (${item.quantity} left).`,
              time: new Date(item.updated_at || item.created_at || Date.now()),
              isRead: !!readState[id],
              link: '/inventory'
            });
          }
        });
      }
    }

    // Fetch Recent Restocks (last 24 hours)
    if (prefs.restockConfirmations) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: restockData } = await supabase
        .from('restocks')
        .select(`
          id, quantity_added, restocked_at,
          inventories(name)
        `)
        .eq('user_id', user.id)
        .gte('restocked_at', yesterday.toISOString())
        .order('restocked_at', { ascending: false });

      if (restockData) {
        restockData.forEach((restock: any) => {
          const id = `restock-${restock.id}`;
          const invName = Array.isArray(restock.inventories) 
            ? restock.inventories[0]?.name 
            : restock.inventories?.name || "Unknown Item";
            
          if (!clearedState[id]) {
            newNotifications.push({
              id,
              type: 'restock',
              title: 'Restock Confirmed',
              message: `Added ${restock.quantity_added} units of ${invName}.`,
              time: new Date(restock.restocked_at),
              isRead: !!readState[id],
              link: '/restock'
            });
          }
        });
      }
    }

    // Sort by time descending (newest first)
    newNotifications.sort((a, b) => b.time.getTime() - a.time.getTime());

    setNotifications(newNotifications);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, POLLING_INTERVAL);
    
    const handleUpdate = () => {
      fetchNotifications();
    };
    
    window.addEventListener("inventory-updated", handleUpdate);
    window.addEventListener("notification-prefs-updated", handleUpdate);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("inventory-updated", handleUpdate);
      window.removeEventListener("notification-prefs-updated", handleUpdate);
    };
  }, [fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    const saved = localStorage.getItem("smart-stock:read-notifications");
    let state: Record<string, boolean> = {};
    if (saved) { try { state = JSON.parse(saved); } catch(e){} }
    state[id] = true;
    localStorage.setItem("smart-stock:read-notifications", JSON.stringify(state));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    const state: Record<string, boolean> = {};
    notifications.forEach(n => state[n.id] = true);
    // Merge with existing
    const saved = localStorage.getItem("smart-stock:read-notifications");
    let existing = {};
    if (saved) { try { existing = JSON.parse(saved); } catch(e){} }
    localStorage.setItem("smart-stock:read-notifications", JSON.stringify({ ...existing, ...state }));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const saved = localStorage.getItem("smart-stock:cleared-notifications");
    let state: Record<string, boolean> = {};
    if (saved) { try { state = JSON.parse(saved); } catch(e){} }
    state[id] = true;
    localStorage.setItem("smart-stock:cleared-notifications", JSON.stringify(state));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    refresh: fetchNotifications
  };
}
