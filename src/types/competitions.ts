import { Prisma, RequestStatus } from "@/app/generated/prisma";

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

export type RepresentativeEventRequest = Prisma.EventGetPayload<{
    include: {
        representative: {
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
    };
}>;
