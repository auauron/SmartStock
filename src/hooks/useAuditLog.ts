import { useCallback, useEffect, useMemo, useState } from "react";
import { AuditLog } from "../types";
import { InventoryServiceProxy } from "../services/inventoryService";

let cachedLogs: AuditLog[] = [];

export const clearCachedLogs = () => {
  cachedLogs = [];
};

export const useAuditLogs = () => {
  const service = useMemo(() => new InventoryServiceProxy(), []);

  const [logs, setLogs] = useState<AuditLog[]>(cachedLogs);
  const [loading, setLoading] = useState(cachedLogs.length === 0);

  const loadLogs = useCallback(
    async (force = false) => {
      if (!force && cachedLogs.length > 0 && logs.length > 0) return;

      setLoading(true);
      try {
        const data = await service.getAuditLogs();
        cachedLogs = data;
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs: ", err);
      } finally {
        setLoading(false);
      }
    },
    [service],
  );

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return { logs, loading, refresh: () => loadLogs(true) };
};
