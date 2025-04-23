import React from "react";

import { NotificationType, Prisma } from "@/app/generated/prisma";
import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface NotificationListProps {
    notifications: Prisma.NotificationCreateInput[];
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Icon icon="lucide:bell-off" className="text-default-400 h-12 w-12" />
                <p className="text-default-500 mt-4 text-center">У вас нет уведомлений</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
    );
};

const NotificationItem: React.FC<{ notification: Prisma.NotificationCreateInput }> = ({ notification }) => {
    const getIconByType = (type: NotificationType) => {
        switch (type) {
            case "INFO":
                return "lucide:info";
            case "SUCCESS":
                return "lucide:check-circle";
            case "WARNING":
                return "lucide:alert-triangle";
            case "ERROR":
                return "lucide:alert-circle";
            default:
                return "lucide:bell";
        }
    };

    const getColorByType = (type: NotificationType) => {
        switch (type) {
            case "INFO":
                return "primary";
            case "SUCCESS":
                return "success";
            case "WARNING":
                return "warning";
            case "ERROR":
                return "danger";
            default:
                return "default";
        }
    };

    return (
        <div
            className={`rounded-lg p-3 ${notification.isRead ? "bg-content1/50" : "bg-content1"} border-l-4 ${
                notification.isRead ? "border-default-200" : `border-${getColorByType(notification.type)}`
            }`}
        >
            <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 rounded-full p-2 bg-${getColorByType(notification.type)}/10`}>
                    <Icon
                        icon={getIconByType(notification.type)}
                        className={`h-5 w-5 text-${getColorByType(notification.type)}`}
                    />
                </div>
                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.isRead && (
                            <Chip size="sm" color={getColorByType(notification.type)} variant="flat">
                                Новое
                            </Chip>
                        )}
                    </div>
                    <p className="text-default-500 mt-1 text-sm">{notification.content}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-default-400 text-xs">
                            {new Date(notification.sendTime as Date).toLocaleString("ru-RU", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
