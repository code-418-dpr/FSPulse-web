// src/data/adminStatistics.ts
"use server";

import prisma from "@/lib/prisma";

// 1. Рейтинг спортсменов (сумма оценок навыков)
export async function getAthleteRanking() {
    return prisma.$queryRaw<Array<{ rank: number; fio: string; region: string; points: number }>>`
        SELECT
            ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(soa.grade),0) DESC) AS rank,
                CONCAT(u.lastname, ' ', u.firstname, ' ', COALESCE(u.middlename, '')) AS fio,
            reg.name AS region,
            COALESCE(SUM(soa.grade),0) AS points
        FROM "Athlete" a
                 JOIN "User" u
                      ON a.id = u.id
                 JOIN "Region" reg
                      ON u."regionId" = reg.id
                 LEFT JOIN "SkillOfAthlete" soa
                           ON soa."athleteId" = a.id
        GROUP BY a.id, u.lastname, u.firstname, u.middlename, reg.name;
    `;
}

// 2. Рейтинг тренеров (сумма очков команд)
export async function getCoachRanking() {
    return prisma.$queryRaw<Array<{ rank: number; fio: string; region: string; points: number }>>`
        SELECT
            ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(t.score),0) DESC) AS rank,
                CONCAT(u.lastname, ' ', u.firstname, ' ', COALESCE(u.middlename, '')) AS fio,
            reg.name AS region,
            COALESCE(SUM(t.score),0) AS points
        FROM "Coach" c
                 JOIN "User" u
                      ON c.id = u.id
                 JOIN "Region" reg
                      ON u."regionId" = reg.id
                 LEFT JOIN "Team" t
                           ON t."coachId" = c.id
        GROUP BY c.id, u.lastname, u.firstname, u.middlename, reg.name;
    `;
}

// 3. Рейтинг представительств (число организованных мероприятий)
export async function getRepresentativeRanking() {
    return prisma.$queryRaw<Array<{ rank: number; region: string; manager: string; eventsCount: number }>>`
        SELECT
            ROW_NUMBER() OVER (ORDER BY COUNT(eor."eventId") DESC) AS rank,
                reg.name AS region,
            CONCAT(u.lastname, ' ', u.firstname, ' ', COALESCE(u.middlename, '')) AS manager,
            COUNT(eor."eventId") AS "eventsCount"
        FROM "Representative" rep
                 JOIN "User" u
                      ON rep.id = u.id
                 JOIN "Region" reg
                      ON u."regionId" = reg.id
                 LEFT JOIN "EventOfRepresentative" eor
                           ON eor."representativeId" = rep.id
        GROUP BY rep.id, reg.name, u.lastname, u.firstname, u.middlename;
    `;
}

// 4. Мероприятия по типу (группировка по дисциплине)
export async function getEventsByType() {
    return prisma.$queryRaw<Array<{ type: string; count: number }>>`
    SELECT
      d.name AS type,
      COUNT(*) AS count
    FROM "Event" e
    JOIN "Discipline" d
      ON e."disciplineId" = d.id
    GROUP BY d.name
    ORDER BY d.name;
  `;
}

// 5. Соревнования по неделям (группировка по неделям начала)
export async function getEventsByWeek() {
    return prisma.$queryRaw<Array<{ week: string; count: number }>>`
    SELECT
      to_char(date_trunc('week', e."start"), 'YYYY-MM-DD') AS week,
      COUNT(*) AS count
    FROM "Event" e
    GROUP BY date_trunc('week', e."start")
    ORDER BY date_trunc('week', e."start");
  `;
}
