import { EventLevel, RequestStatus } from "./app/generated/prisma";

export type Tab = "requests" | "events" | "team" | "achievement" | "representative";

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
    name: string;
    leader: string;
    members: string[];
}
