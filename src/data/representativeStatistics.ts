// src/data/representativeStatistics.ts
"use server";

import prisma from "@/lib/prisma";
import { RequestStatus } from "@/app/generated/prisma";

/** 1. Заявки по статусу */
export async function getRepRequestsByStatus(
    repId: string
): Promise<Array<{ status: RequestStatus; count: number }>> {
    return prisma.$queryRaw<Array<{ status: RequestStatus; count: number }>>`
        SELECT
            e."requestStatus" AS status,
            COUNT(*)::int        AS count
        FROM "Event" AS e
            JOIN "EventOfRepresentative" AS er
        ON er."eventId" = e."id"
        WHERE er."representativeId" = ${repId}
        GROUP BY e."requestStatus";
    `;
}

/** 2. Формат мероприятий */
export async function getRepEventsByFormat(
    repId: string
): Promise<Array<{ label: string; value: number }>> {
    return prisma.$queryRaw<Array<{ label: string; value: number }>>`
        SELECT
            CASE
                WHEN e."isPersonalFormatAllowed" THEN 'Личные'
                ELSE 'Командные'
                END AS label,
            COUNT(*)::int                 AS value
        FROM "Event" AS e
            JOIN "EventOfRepresentative" AS er
        ON er."eventId" = e."id"
        WHERE er."representativeId" = ${repId}
        GROUP BY label;
    `;
}

/** 3. Мероприятия по месяцам */
export async function getRepEventsByMonth(
    repId: string
): Promise<Array<{ month: string; count: number }>> {
    return prisma.$queryRaw<Array<{ month: string; count: number }>>`
        SELECT
            to_char(e."start", 'YYYY-MM') AS month,
            COUNT(*)::int                AS count
        FROM "Event" AS e
            JOIN "EventOfRepresentative" AS er
        ON er."eventId" = e."id"
        WHERE er."representativeId" = ${repId}
        GROUP BY month
        ORDER BY month;
    `;
}

/** 4. Рейтинг спортсменов (кол-во личных участий в событиях этого представителя) */
export async function getRepAthleteRanking(
    repId: string
): Promise<Array<{ fio: string; region: string; points: number }>> {
    return prisma.$queryRaw<Array<{ fio: string; region: string; points: number }>>`
        SELECT
            u."lastname" || ' ' || u."firstname" || ' ' || COALESCE(u."middlename", '') AS fio,
            r."name"                                                              AS region,
            COUNT(aep."eventId")::int                                              AS points
        FROM "AthleteOfPersonalEvent" AS aep
                 JOIN "EventOfRepresentative" AS er
                      ON aep."eventId" = er."eventId"
                 JOIN "User" AS u
                      ON u."id" = aep."athleteId"
                 JOIN "Region" AS r
                      ON r."id" = u."regionId"
        WHERE er."representativeId" = ${repId}
        GROUP BY u."lastname", u."firstname", u."middlename", r."name"
        ORDER BY points DESC;
    `;
}

/** 5. Рейтинг тренеров (сумма score их команд в событиях этого представителя) */
export async function getRepCoachRanking(
    repId: string
): Promise<Array<{ fio: string; region: string; points: number }>> {
    return prisma.$queryRaw<Array<{ fio: string; region: string; points: number }>>`
        SELECT
            u."lastname" || ' ' || u."firstname" || ' ' || COALESCE(u."middlename", '') AS fio,
            r."name"                                                              AS region,
            COALESCE(SUM(t."score"), 0)::int                                        AS points
        FROM "Team" AS t
                 JOIN "EventOfRepresentative" AS er
                      ON t."eventId" = er."eventId"
                 JOIN "User" AS u
                      ON u."id" = t."coachId"
                 JOIN "Region" AS r
                      ON r."id" = u."regionId"
        WHERE er."representativeId" = ${repId}
        GROUP BY u."lastname", u."firstname", u."middlename", r."name"
        ORDER BY points DESC;
    `;
}
