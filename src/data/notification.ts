import prisma from "@/lib/prisma";

/**
 * Возвращает все уведомления пользователя, конвертируя даты в ISO-строки
 */
export async function getNotificationsByUser(userId: string) {
    const items = await prisma.notification.findMany({
        where: { userId },
        orderBy: { sendTime: "desc" },
    });

    return items.map((i) => ({
        id: i.id,
        userId: i.userId,
        title: i.title,
        sendTime: i.sendTime.toISOString(),
        content: i.content,
        isRead: i.isRead,
        type: i.type,
    }));
}

/**
 * Помечает все непрочитанные уведомления пользователя как прочитанные
 */
export async function markNotificationsReadByUser(userId: string) {
    await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
}
