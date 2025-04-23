export type Tab = "requests" | "events" | "team" | "achievement";

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
    start: string;
    status: string;
    imageBase64: string;
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
