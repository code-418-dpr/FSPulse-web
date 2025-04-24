import { Discipline, EventLevel, Prisma, RequestStatus } from "./app/generated/prisma";

export type Tab = "requests" | "events" | "team" | "achievement" | "representative" | "statistics";

export interface CompetitionItem {
    title: string;
    region: string;
    startDate: string;
    endDate: string;
    applicationDate: string;
    status: string;
    format: string;
    discipline: string;
    image: string;
}
export type EventItemForId = Prisma.EventGetPayload<{
    include: {
        representatives: {
            include: {
                representative: {
                    include: {
                        user: {
                            include: {
                                region: true;
                            };
                        };
                    };
                };
            };
        };
        discipline: true;
        files: true;
    };
}>;
export interface EventItem {
    id: string;
    name: string;
    cover: Uint8Array;
    requestStatus: RequestStatus;
    level: EventLevel;
    applicationTime: Date;
    startRegistration: Date;
    endRegistration: Date;
    start: Date;
    end: Date;
    discipline: Discipline;
    isOnline: boolean;
}

export interface TeamItem {
    id: string;
    lastname: string;
    firstname: string;
    middlename: string | null;
    region: string;
    birthday: string;
    status: string;
    imageBase64: string;
}

export interface AchievementItem {
    id: string;
    eventName: string;
    spot: string;
    discipline: string;
    date: string;
    region: string;
    imageBase64: string;
}

export interface TeamWithMembersItem {
    id: string;
    name: string;
    about: string;
    isReady: boolean;
    leader: string;
    members: string[];
}
