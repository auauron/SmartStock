import { useCallback, useEffect, useMemo, useState } from "react";
import { AuditLog } from "../types";
import { InventoryServiceProxy } from "../services/inventoryService";


let cachedLogs: AuditLog[] = [];

export const useAuditLogs = () => {
    const service = useMemo(() => new InventoryServiceProxy(), []);

    const [logs, setLogs] = useState<AuditLog[]>(cachedLogs);
    const [loading, setLoading] = useState(!cachedLogs.length);

    const loadLogs = useCallback(async () => {
        try {
            const data = await service.getAuditLogs();
            cachedLogs = data;
            setLogs(data);
        } catch (err) {
            console.error('Failed to fetch logs: ', err)
        } finally {
            setLoading(false)
        }
    }, [service]);
        
    const shouldLoad = cachedLogs.length === 0;

    useEffect(() => {
        if (shouldLoad) {
            loadLogs()
        }
    }, [shouldLoad, loadLogs])
    return { logs, loading, refresh: loadLogs };
}

