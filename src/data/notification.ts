import prisma from "@/lib/prisma";

export async function getUserNotifications(userId: string) {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { sendTime: "desc" },
    });
}

export async function markUserNotificationsRead(userId: string) {
    await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
}
