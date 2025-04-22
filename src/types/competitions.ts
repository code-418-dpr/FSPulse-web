import { RequestStatus } from "@/app/generated/prisma";

export interface CompetitionItem {
    id: string;
    title: string;
    region: string;
    startDate: string; // ISO date (yyyy-mm-dd)
    endDate: string;
    applicationDate: string;
    status: RequestStatus;
    format: "Онлайн" | "Очно";
    discipline: string;
    image: string;
}
