// src/data/notification.ts
import prisma from "@/lib/prisma";

// Тип с notificationTime как ISO-строка
export interface NotificationRow {
    id: string;
    userId: string;
    title: string;
    notificationTime: string;
    content: string;
    isRead: boolean;
    type: string;
}

/**
 * Возвращает все уведомления пользователя, конвертируя даты в ISO-строки
 */
export async function getNotificationsByUser(userId: string): Promise<NotificationRow[]> {
    const items = await prisma.notification.findMany({
        where: { userId },
        orderBy: { notificationTime: "desc" },
    });

    return items.map((i) => ({
        id: i.id,
        userId: i.userId,
        title: i.title,
        notificationTime: i.notificationTime.toISOString(),
        content: i.content,
        isRead: i.isRead,
        type: i.type,
    }));
}

/**
 * Помечает все непрочитанные уведомления пользователя как прочитанные
 */
export async function markNotificationsReadByUser(userId: string): Promise<void> {
    await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
}
