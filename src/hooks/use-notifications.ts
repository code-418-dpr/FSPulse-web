import React from "react";

import { Notification, NotificationType } from "@/types/notification";

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: "1",
        userId: "user1",
        title: "Новая заявка",
        content: "Поступила новая заявка на участие в соревновании",
        notificationTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        isRead: false,
        type: NotificationType.INFORMATION,
    },
    {
        id: "2",
        userId: "user1",
        title: "Заявка одобрена",
        content: "Ваша заявка на участие в соревновании была одобрена",
        notificationTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: false,
        type: NotificationType.SUCCESS,
    },
    {
        id: "3",
        userId: "user1",
        title: "Изменение в расписании",
        content: "Соревнование перенесено на другую дату",
        notificationTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isRead: false,
        type: NotificationType.WARNING,
    },
    {
        id: "4",
        userId: "user1",
        title: "Ошибка в системе",
        content: "Произошла ошибка при обработке вашего запроса",
        notificationTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isRead: true,
        type: NotificationType.ERROR,
    },
    {
        id: "5",
        userId: "user1",
        title: "Обновление профиля",
        content: "Ваш профиль был успешно обновлен",
        notificationTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        isRead: true,
        type: NotificationType.INFORMATION,
    },
];

export const useNotifications = () => {
    const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);

    const unreadCount = React.useMemo(() => {
        return notifications.filter((notification) => !notification.isRead).length;
    }, [notifications]);

    // Add debounced mark all as read function to prevent multiple rapid calls
    const markAllAsRead = React.useCallback(() => {
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                isRead: true,
            })),
        );
    }, []);

    const markAsRead = React.useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
        );
    }, []);

    // Add function to mark multiple notifications as read
    const markMultipleAsRead = React.useCallback((ids: string[]) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                ids.includes(notification.id) ? { ...notification, isRead: true } : notification,
            ),
        );
    }, []);

    return {
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        markMultipleAsRead,
    };
};
