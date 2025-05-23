// prisma/data/event.ts
import fs from "fs";
import path from "path";

import type { Prisma } from "@/app/generated/prisma";
import { EventLevel, RequestStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker/locale/ru";

// Тип для создания Event с nested-write
export type EventCreateInput = Prisma.EventCreateInput;

// Всегда используем один и тот же cover
const HACKATHON_COVER = fs.readFileSync(path.resolve(process.cwd(), "prisma", "covers", "hackathon.png"));

// Русские суффиксы
const eventTypes = ["Кубок", "Турнир", "Чемпионат", "Фестиваль", "Марафон"];

export async function generateRandomEventsWithReps(count: number): Promise<EventCreateInput[]> {
    // 1) Все disciplineId
    const disciplines = await prisma.discipline.findMany({ select: { id: true } });
    const disciplineIds = disciplines.map((d) => d.id);

    // 2) Все representativeId
    const reps = await prisma.representative.findMany({ select: { id: true } });
    const repIds = reps.map((r) => r.id);

    const usedNames = new Set<string>();
    const levels: EventLevel[] = [EventLevel.OPEN, EventLevel.REGIONAL, EventLevel.FEDERAL];
    const statuses: RequestStatus[] = [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.DECLINED];

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const events: EventCreateInput[] = [];

    for (let i = 0; i < count; i++) {
        // —————————————
        // Генерируем уникальное русское название
        // —————————————
        let name: string;
        do {
            const base = faker.company.name();
            const suffix = faker.helpers.arrayElement(eventTypes);
            name = `${base} ${suffix}`;
        } while (usedNames.has(name));
        usedNames.add(name);

        // —————————————
        // Генерация временных полей
        // —————————————
        const applicationTime = faker.date.soon({ days: 30 });
        const startRegistration = faker.date.between({
            from: applicationTime,
            to: new Date(applicationTime.getTime() + MS_PER_DAY * 10),
        });
        const endRegistration = faker.date.between({
            from: startRegistration,
            to: new Date(startRegistration.getTime() + MS_PER_DAY * 10),
        });
        const start = faker.date.between({
            from: endRegistration,
            to: new Date(endRegistration.getTime() + MS_PER_DAY * 30),
        });
        const end = faker.date.between({
            from: start,
            to: new Date(start.getTime() + MS_PER_DAY * 5),
        });

        // —————————————
        // Прочие поля
        // —————————————
        const minAge = faker.number.int({ min: 16, max: 30 });
        const maxAge = faker.number.int({ min: minAge + 1, max: 60 });
        const minTeamParticipantsCount = faker.number.int({ min: 0, max: 2 });
        const maxTeamParticipantsCount = faker.number.int({ min: 2, max: 5 });
        const maxParticipantsCount = faker.number.int({ min: 10, max: 100 });
        const isOnline = faker.datatype.boolean();
        const isPersonalFormatAllowed = faker.datatype.boolean();

        const address = faker.location.streetAddress();
        const awards = Array.from({ length: 3 }, () => faker.number.int({ min: 1, max: 5 }));

        const level = faker.helpers.arrayElement(levels);
        const requestStatus = faker.helpers.arrayElement(statuses);
        const requestComment = requestStatus === RequestStatus.DECLINED ? faker.lorem.sentence() : null;

        // —————————————
        // Генерируем от 1 до 5 представителей
        // —————————————
        const repCount = faker.number.int({ min: 1, max: 5 });
        const repsForEvent = faker.helpers.arrayElements(repIds, repCount);

        // —————————————
        // Собираем объект
        // —————————————
        events.push({
            name,
            description: faker.lorem.sentences({ min: 1, max: 2 }),
            cover: HACKATHON_COVER,
            applicationTime,
            startRegistration,
            endRegistration,
            start,
            end,
            minAge,
            maxAge,
            minTeamParticipantsCount,
            maxTeamParticipantsCount,
            maxParticipantsCount,
            isPersonalFormatAllowed,
            discipline: { connect: { id: faker.helpers.arrayElement(disciplineIds) } },
            isOnline,
            address,
            awards,
            level,
            requestStatus,
            requestComment,

            // nested-write для EventOfRepresentative
            representatives: {
                create: repsForEvent.map((rid) => ({
                    representative: { connect: { id: rid } },
                })),
            },
        });
    }

    return events;
}
