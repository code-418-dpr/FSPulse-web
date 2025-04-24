// src/data/athleteStatistics.ts
"use server";

import prisma from "@/lib/prisma";

interface LabelValue { label: string; value: number }
interface HistoryRow {
    competition: string;
    period: string;
    place: string | null;
    points: number;
}

/** 1. Общий рейтинг и место спортсмена среди всех */
export async function getAthleteOverview(
    athleteId: string
): Promise<{ rank: number; points: number }> {
    const result = await prisma.$queryRaw<
        { rank: number; points: number }[]
    >`
        SELECT sub.rank, sub.points FROM (
                                             SELECT
                                                 a.id                                              AS athlete_id,
                                                 (COALESCE(SUM(t.score),0) + COUNT(aep."eventId")) AS points,
                                                 ROW_NUMBER() OVER (
          ORDER BY (COALESCE(SUM(t.score),0) + COUNT(aep."eventId")) DESC
        )                                                 AS rank
                                             FROM "Athlete" a
                                                      LEFT JOIN "AthleteOfPersonalEvent" aep
                                                                ON aep."athleteId" = a.id
                                                      LEFT JOIN "AthleteOfTeam" aft
                                                                ON aft."athleteId" = a.id
                                                      LEFT JOIN "Team" t
                                                                ON t.id = aft."teamId"
                                             GROUP BY a.id
                                         ) sub
        WHERE sub.athlete_id = ${athleteId};
    `;
    return result[0] ?? { rank: 0, points: 0 };
}

/** 2. Участия: личные vs командные */
export async function getAthleteParticipation(
    athleteId: string
): Promise<LabelValue[]> {
    return prisma.$queryRaw<LabelValue[]>`
        SELECT label, COUNT(*)::int AS value FROM (
            SELECT 'Личные' AS label
            FROM "AthleteOfPersonalEvent" aep
            WHERE aep."athleteId" = ${athleteId}
            UNION ALL
            SELECT 'Командные' AS label
            FROM "AthleteOfTeam" aft
            WHERE aft."athleteId" = ${athleteId}
            ) sub
        GROUP BY label;
    `;
}

/** 3. Баллы по месяцам */
export async function getAthletePointsOverTime(
    athleteId: string
): Promise<LabelValue[]> {
    return prisma.$queryRaw<LabelValue[]>`
        SELECT month, SUM(points)::int AS value FROM (
            SELECT
            to_char(e."start", 'YYYY-MM') AS month,
            1                             AS points
            FROM "AthleteOfPersonalEvent" aep
            JOIN "Event" e ON e.id = aep."eventId"
            WHERE aep."athleteId" = ${athleteId}

            UNION ALL

            SELECT
            to_char(e."start", 'YYYY-MM') AS month,
            COALESCE(t.score,0)           AS points
            FROM "AthleteOfTeam" aft
            JOIN "Team" t ON t.id = aft."teamId"
            JOIN "Event" e ON e.id = t."eventId"
            WHERE aft."athleteId" = ${athleteId}
            ) sub
        GROUP BY month
        ORDER BY month;
    `;
}

/** 4. Достижения: по уровням событий + командные участия */
export async function getAthleteAchievements(
    athleteId: string
): Promise<LabelValue[]> {
    return prisma.$queryRaw<LabelValue[]>`
        SELECT title, COUNT(*)::int AS value FROM (
            SELECT 'Открытые'       AS title
            FROM "AthleteOfPersonalEvent" aep
            JOIN "Event" e ON e.id = aep."eventId"
            WHERE aep."athleteId" = ${athleteId} AND e.level = 'OPEN'

            UNION ALL

            SELECT 'Региональные'   AS title
            FROM "AthleteOfPersonalEvent" aep
            JOIN "Event" e ON e.id = aep."eventId"
            WHERE aep."athleteId" = ${athleteId} AND e.level = 'REGIONAL'

            UNION ALL

            SELECT 'Всероссийские'  AS title
            FROM "AthleteOfPersonalEvent" aep
            JOIN "Event" e ON e.id = aep."eventId"
            WHERE aep."athleteId" = ${athleteId} AND e.level = 'FEDERAL'

            UNION ALL

            SELECT 'Командные участия' AS title
            FROM "AthleteOfTeam" aft
            WHERE aft."athleteId" = ${athleteId}
            ) sub
        GROUP BY title;
    `;
}

/** 5. История участий */
export async function getAthleteParticipationHistory(
    athleteId: string
): Promise<HistoryRow[]> {
    return prisma.$queryRaw<HistoryRow[]>`
        SELECT
            e.name                                                                  AS competition,
            to_char(e."start",'DD.MM.YYYY') || '–' || to_char(e."end",'DD.MM.YYYY') AS period,
            NULL::text                                                              AS place,
                1::int                                                                  AS points
        FROM "AthleteOfPersonalEvent" aep
                 JOIN "Event" e ON e.id = aep."eventId"
        WHERE aep."athleteId" = ${athleteId}

        UNION ALL

        SELECT
            e.name                                                                  AS competition,
            to_char(e."start",'DD.MM.YYYY') || '–' || to_char(e."end",'DD.MM.YYYY') AS period,
            NULL::text                                                              AS place,
                COALESCE(t.score,0)::int                                                 AS points
        FROM "AthleteOfTeam" aft
                 JOIN "Team" t ON t.id = aft."teamId"
                 JOIN "Event" e ON e.id = t."eventId"
        WHERE aft."athleteId" = ${athleteId}

        ORDER BY period DESC;
    `;
}
