// prisma/data/team.ts
import { RequestStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker/locale/ru";

function isOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
    return aStart < bEnd && bStart < aEnd;
}

export async function generateTeamsAndMembers() {
    const events = await prisma.event.findMany({
        select: {
            id: true,
            start: true,
            end: true,
            minTeamParticipantsCount: true,
            maxTeamParticipantsCount: true,
            maxParticipantsCount: true,
        },
        orderBy: { start: "asc" },
    });

    const athletes = await prisma.athlete.findMany({ select: { id: true } });
    const athleteIds = athletes.map((a) => a.id);
    const coaches = await prisma.coach.findMany({ select: { id: true } });
    const coachIds = coaches.map((c) => c.id);

    // Расписание по атлетам
    const athleteSchedule: Record<string, { start: Date; end: Date }[]> = {};
    athleteIds.forEach((id) => (athleteSchedule[id] = []));

    const statuses: RequestStatus[] = [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.DECLINED];

    for (const ev of events) {
        let remainingSlots = ev.maxParticipantsCount;

        // Свободные атлеты без пересечения по времени
        let freeAthletes = athleteIds.filter((aid) =>
            athleteSchedule[aid].every((slot) => !isOverlap(slot.start, slot.end, ev.start, ev.end)),
        );

        // Генерируем от 1 до 10 команд на событие
        const teamsCount = faker.number.int({ min: 1, max: 10 });
        for (let t = 0; t < teamsCount; t++) {
            if (remainingSlots < ev.minTeamParticipantsCount) break;
            if (freeAthletes.length === 0) break;

            // Максимально возможный размер команды
            const maxByEvent = Math.min(ev.maxTeamParticipantsCount, remainingSlots);
            if (maxByEvent < 1) break;

            // Минимум ≥ 1, но не больше maxByEvent
            const rawMin = Math.min(ev.minTeamParticipantsCount, maxByEvent);
            const actualMin = Math.max(rawMin, 1);

            const memberCount = faker.number.int({ min: actualMin, max: maxByEvent });

            // выбираем участников
            const chosen = faker.helpers.arrayElements(freeAthletes, memberCount);
            freeAthletes = freeAthletes.filter((id) => !chosen.includes(id));

            // формируем члены команды
            const members = chosen.map((athleteId) => ({
                athleteId,
                isLeader: false,
                requestStatus: faker.helpers.arrayElement(statuses),
                requestComment: null as string | null,
            }));

            // назначаем ровно одного лидера
            const leaderIdx = faker.number.int({ min: 0, max: members.length - 1 });
            members[leaderIdx].isLeader = true;

            // комментарии для отклонённых
            members.forEach((m) => {
                if (m.requestStatus === RequestStatus.DECLINED) {
                    m.requestComment = faker.lorem.sentence();
                }
            });

            // привязываем тренера (или нет)
            const coachId = coachIds.length && faker.datatype.boolean() ? faker.helpers.arrayElement(coachIds) : null;

            // флаг готовности
            const approvedCount = members.filter((m) => m.requestStatus === RequestStatus.APPROVED).length;
            const hasLeader = members.some((m) => m.isLeader);
            const isReady = approvedCount >= ev.minTeamParticipantsCount && hasLeader && Boolean(coachId);

            // создаём команду
            const team = await prisma.team.create({
                data: {
                    name: faker.company.name(),
                    event: { connect: { id: ev.id } },
                    coach: coachId ? { connect: { id: coachId } } : undefined,
                    isReady,
                },
            });

            // привязываем участников и обновляем расписание
            for (const m of members) {
                await prisma.athleteOfTeam.create({
                    data: {
                        team: { connect: { id: team.id } },
                        athlete: { connect: { id: m.athleteId } },
                        isLeader: m.isLeader,
                        requestStatus: m.requestStatus,
                        requestComment: m.requestComment,
                    },
                });
                athleteSchedule[m.athleteId].push({ start: ev.start, end: ev.end });
            }

            remainingSlots -= members.length;
            if (remainingSlots <= 0) break;
        }
    }
}
