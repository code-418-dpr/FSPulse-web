import prisma from "@/lib/prisma";

export const getAllNotifications = async (userId: string, page: number, pageSize: number) => {
    const notifications = await prisma.notification.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            notificationTime: "asc",
        },
        skip: pageSize * (page - 1),
        take: pageSize,
    });

    const totalItems = await prisma.notification.count({
        where: {
            userId: userId,
        },
    });

    return {
        notifications,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
    };
};

export const getUnreadNotifications = async (userId: string, page: number, pageSize: number) => {
    const notifications = await prisma.notification.findMany({
        where: {
            userId: userId,
            isRead: false,
        },
        orderBy: {
            notificationTime: "asc",
        },
        skip: pageSize * (page - 1),
        take: pageSize,
    });

    const totalItems = await prisma.notification.count({
        where: {
            userId: userId,
            isRead: false,
        },
    });

    return {
        notifications,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
    };
};
