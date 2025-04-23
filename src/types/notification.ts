export enum NotificationType {
    INFORMATION = "INFORMATION",
    WARNING = "WARNING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    content: string;
    notificationTime: string;
    isRead: boolean;
    type: NotificationType;
}
