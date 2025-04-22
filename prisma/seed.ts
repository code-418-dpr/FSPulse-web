// prisma/seed.ts
import fs from "fs";
import path from "path";

import { PrismaClient } from "@/app/generated/prisma";

import ageGroups from "./data/age-group";
import disciplines from "./data/disciplines";
import eventRepresentatives from "./data/eventRepresentatives";
import events from "./data/events";
import regions from "./data/regions";
import representatives from "./data/representatives";

const prisma = new PrismaClient();

async function main(): Promise<void> {
    console.log("Seeding Regions...");
    for (const name of regions) {
        try {
            await prisma.region.create({ data: { name } });
            console.log(`  ✔ Region "${name}"`);
        } catch (error: unknown) {
            const e = error as { code?: string; message?: string };
            if (e.code === "P2002") console.log(`  • Region "${name}" exists, skip`);
            else console.warn(`  ! Region "${name}" skipped: ${e.message}`);
        }
    }

    console.log("Seeding Representatives...");
    for (const rep of representatives) {
        try {
            const region = await prisma.region.findUnique({ where: { name: rep.regionName } });
            if (!region) throw new Error(`Region "${rep.regionName}" not found`);

            await prisma.representative.create({
                data: {
                    lastname: rep.lastname,
                    firstname: rep.firstname,
                    middlename: rep.middlename,
                    phoneNumber: rep.phoneNumber,
                    email: rep.email,
                    password: rep.password,
                    tg: rep.tg,
                    region: { connect: { id: region.id } },
                },
            });
            console.log(`  ✔ Representative "${rep.email}"`);
        } catch (error: unknown) {
            const e = error as { code?: string; message?: string };
            if (e.code === "P2002") console.log(`  • Rep "${rep.email}" exists, skip`);
            else console.warn(`  ! Rep "${rep.email}" skipped: ${e.message}`);
        }
    }

    console.log("Seeding Disciplines...");
    for (const discipline of disciplines) {
        try {
            await prisma.discipline.create({ data: discipline });
            console.log(`  ✔ Discipline "${discipline.name}"`);
        } catch (error: unknown) {
            const e = error as { code?: string; message?: string };
            if (e.code === "P2002") console.log(`  • Discipline "${discipline.name}" exists, skip`);
            else console.warn(`  ! Discipline "${discipline.name}" skipped: ${e.message}`);
        }
    }

    console.log("Seeding AgeGroups...");
    for (const group of ageGroups) {
        try {
            await prisma.ageGroup.create({ data: group });
            console.log(`  ✔ AgeGroup "${group.name}"`);
        } catch (error: unknown) {
            const e = error as { code?: string; message?: string };
            if (e.code === "P2002") console.log(`  • AgeGroup "${group.name}" exists, skip`);
            else console.warn(`  ! AgeGroup "${group.name}" skipped: ${e.message}`);
        }
    }

    console.log("Linking AgeGroups ↔ Disciplines...");
    const disciplinesMap = Object.fromEntries(
        (await prisma.discipline.findMany({ select: { id: true, name: true } })).map(({ id, name }) => [name, id]),
    );

    const ageGroupsMap = Object.fromEntries(
        (await prisma.ageGroup.findMany({ select: { id: true, minAge: true } })).map(({ id, minAge }) => [minAge, id]),
    );

    const rawLinks: [string, number[]][] = [
        ["Программирование продуктовое", [14, 17, 16]],
        ["Программирование алгоритмическое", [12, 15, 17, 16]],
        ["Программирование робототехники", [12, 15, 17, 16]],
        ["Программирование систем информационной безопасности", [14, 17, 16]],
        ["Программирование беспилотных авиационных систем", [14, 17, 16]],
    ];

    for (const [disciplineName, ageList] of rawLinks) {
        const disciplineId = disciplinesMap[disciplineName];
        if (!disciplineId) continue;

        for (const age of ageList) {
            const ageGroupId = ageGroupsMap[age];
            if (!ageGroupId) continue;

            try {
                await prisma.ageGroupOfDiscipline.create({
                    data: { disciplineId, ageGroupId },
                });
                console.log(`  ✔ Linked "${disciplineName}" ↔ age ${age}`);
            } catch (error: unknown) {
                const e = error as { code?: string };
                if (e.code === "P2002") console.log(`  • Relation "${disciplineName}"↔${age} exists, skip`);
            }
        }
    }

    console.log("Seeding Events...");
    for (const raw of events) {
        try {
            const exists = await prisma.event.findFirst({ where: { name: raw.name } });
            if (exists) {
                console.log(`  • Event "${raw.name}" exists, skip`);
                continue;
            }

            const discipline = await prisma.discipline.findUnique({ where: { name: raw.disciplineName } });
            if (!discipline) throw new Error(`Discipline "${raw.disciplineName}" not found`);

            const cover = fs.readFileSync(path.join(__dirname, raw.coverPath));

            await prisma.event.create({
                data: {
                    name: raw.name,
                    description: raw.description,
                    cover,
                    applicationTime: new Date(raw.applicationTime),
                    startRegistration: new Date(raw.startRegistration),
                    endRegistration: new Date(raw.endRegistration),
                    start: new Date(raw.start),
                    end: new Date(raw.end),
                    minAge: raw.minAge,
                    maxAge: raw.maxAge,
                    maxParticipantsCount: raw.maxParticipantsCount,
                    discipline: { connect: { id: discipline.id } },
                    isOnline: raw.isOnline,
                    address: raw.address,
                    awards: raw.awards,
                    level: raw.level,
                    status: raw.status,
                },
            });
            console.log(`  ✔ Event "${raw.name}"`);
        } catch (error: unknown) {
            const e = error as { message?: string };
            console.warn(`  ! Event "${raw.name}" skipped: ${e.message}`);
        }
    }

    console.log("Seeding EventOfRepresentative...");
    for (const { representativeEmail, eventName } of eventRepresentatives) {
        try {
            const rep = await prisma.representative.findUnique({ where: { email: representativeEmail } });
            const evt = await prisma.event.findFirst({ where: { name: eventName } });

            if (!rep || !evt) {
                console.warn(`  • Relation "${representativeEmail}"↔"${eventName}" skipped: Rep or Event not found`);
                continue;
            }

            const exists = await prisma.eventOfRepresentative.findUnique({
                where: { representativeId_eventId: { representativeId: rep.id, eventId: evt.id } },
            });

            if (exists) {
                console.log(`  • Relation "${representativeEmail}"↔"${eventName}" already exists, skip`);
                continue;
            }

            await prisma.eventOfRepresentative.create({
                data: {
                    representative: { connect: { id: rep.id } },
                    event: { connect: { id: evt.id } },
                },
            });

            console.log(`  ✔ Linked "${representativeEmail}" → "${eventName}"`);
        } catch (error: unknown) {
            const e = error as { message?: string };
            console.warn(`  • Relation "${representativeEmail}"↔"${eventName}" skipped: ${e.message}`);
        }
    }

    console.log("✅ All data seeded.");
}

void main()
    .catch((err: unknown) => {
        const e = err as { message?: string };
        console.error("Unexpected error:", e.message);
    })
    .finally(() => void prisma.$disconnect());
