// src/hooks/use-notifications.ts
"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { Notification } from "@/types/notification";

// src/hooks/use-notifications.ts

export const useNotifications = () => {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!isAuthenticated || !user?.id) return;
        setLoading(true);

        const res = await fetch(`/api/notifications?userId=${user.id}`);
        if (res.ok) {
            const data: unknown = await res.json();
            if (Array.isArray(data)) {
                setNotifications(data as Notification[]);
            }
        }

        setLoading(false);
    }, [isAuthenticated, user]);

    useEffect(() => {
        void load();
    }, [load]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAllAsRead = useCallback(async () => {
        if (!user?.id) return;
        await fetch(`/api/notifications?userId=${user.id}`, { method: "PUT" });
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }, [user]);

    return {
        notifications,
        unreadCount,
        loading: authLoading || loading,
        markAllAsRead,
    };
};
