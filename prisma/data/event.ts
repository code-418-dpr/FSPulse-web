// prisma/data/event.ts
import fs from "fs";
import path from "path";

import type { Prisma } from "@/app/generated/prisma";
import { EventLevel, RequestStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker/locale/ru";

// Для createMany используем соответствующий Input
export type EventCreateInput = Prisma.EventCreateManyInput;

const HACKATHON_COVER = fs.readFileSync(path.resolve(process.cwd(), "prisma", "covers", "hackathon.png"));

export async function generateRandomEvents(count: number): Promise<EventCreateInput[]> {
    // Тянем все disciplineId из базы
    const disciplines = await prisma.discipline.findMany({ select: { id: true } });
    const disciplineIds = disciplines.map((d) => d.id);

    const usedNames = new Set<string>();
    const levels: EventLevel[] = [EventLevel.OPEN, EventLevel.REGIONAL, EventLevel.FEDERAL];
    const statuses: RequestStatus[] = [RequestStatus.PENDING, RequestStatus.DECLINED, RequestStatus.APPROVED];

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const events: EventCreateInput[] = [];

    for (let i = 0; i < count; i++) {
        // Генерируем уникальное название
        let name: string;
        do {
            name = faker.company.catchPhrase() + " Cup";
        } while (usedNames.has(name));
        usedNames.add(name);

        // Генерация дат
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

        // Числовые поля и булевы
        const minAge = faker.number.int({ min: 16, max: 30 });
        const maxAge = faker.number.int({ min: minAge + 1, max: 60 });
        const minTeamParticipantsCount = faker.number.int({ min: 0, max: 2 });
        const maxTeamParticipantsCount = faker.number.int({ min: 2, max: 5 });
        const maxParticipantsCount = faker.number.int({ min: 10, max: 100 });
        const isOnline = faker.datatype.boolean();
        const isPersonalFormatAllowed = faker.datatype.boolean();

        // Адрес и награды
        const address = faker.location.streetAddress();
        const awards = Array.from({ length: 3 }, () => faker.number.int({ min: 1, max: 5 }));

        // Выбор из enum
        const level = faker.helpers.arrayElement(levels);
        const requestStatus = faker.helpers.arrayElement(statuses);
        const requestComment = requestStatus === RequestStatus.DECLINED ? faker.lorem.sentence() : null;

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
            disciplineId: faker.helpers.arrayElement(disciplineIds),
            isOnline,
            address,
            awards,
            level,
            requestStatus,
            requestComment,
        });
    }

    return events;
}
