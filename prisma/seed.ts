import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

import { createAgeGroups } from "@/data/age-group";
import { createDisciplines } from "@/data/discipline";
import { createRegions } from "@/data/region";
import { createSkills } from "@/data/skill";
import prisma from "@/lib/prisma";

import ageGroups from "./data/age-groups";
import disciplines from "./data/disciplines";
import eventRepresentatives from "./data/eventRepresentatives";
import events from "./data/events";
import regionNames from "./data/regions";
import representatives from "./data/representatives";
import skillNames from "./data/skills";

export async function main() {
    console.log("Seeding regions...");
    await createRegions(regionNames);
    console.log("Seeding skills...");
    await createSkills(skillNames);
    console.log("Seeding disciplines...");
    const createdDisciplines = await createDisciplines(disciplines);
    console.log("Seeding age groups...");
    const createdAgeGroups = await createAgeGroups(ageGroups);

    console.log("Mapping age groups to disciplines...");
    const disciplinesMap = Object.fromEntries(createdDisciplines.map((d) => [d.name, d.id]));
    const ageGroupsMap = Object.fromEntries(createdAgeGroups.map((ag) => [ag.minAge, ag.id]));
    const relations = [
        ["Программирование продуктовое", [14, 17, 16]],
        ["Программирование алгоритмическое", [12, 15, 17, 16]],
        ["Программирование робототехники", [12, 15, 17, 16]],
        ["Программирование систем информационной безопасности", [14, 17, 16]],
        ["Программирование беспилотных авиационных систем", [14, 17, 16]],
    ].flatMap(([discipline, ages]) =>
        (ages as number[]).map((age) => {
            const disciplineId = disciplinesMap[discipline as string];
            const ageGroupId = ageGroupsMap[age];
            return disciplineId && ageGroupId
                ? {
                      disciplineId,
                      ageGroupId,
                  }
                : undefined;
        }),
    );
    await prisma.ageGroupOfDiscipline.createMany({
        data: relations.filter((relation) => relation !== undefined),
        skipDuplicates: true,
    });

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
                    password: await bcrypt.hash(rep.password, 10),
                    tg: rep.tg,
                    region: { connect: { id: region.id } },
                    requestStatus: "APPROVED",
                    requestComment: null,
                },
            });
            console.log(`  ✔ Representative "${rep.email}"`);
        } catch (error: unknown) {
            const e = error as { code?: string; message?: string };
            if (e.code === "P2002") console.log(`  • Rep "${rep.email}" exists, skip`);
            else console.warn(`  ! Rep "${rep.email}" skipped: ${e.message}`);
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
                    minTeamParticipantsCount: 0,
                    maxTeamParticipantsCount: 0,
                    maxParticipantsCount: raw.maxParticipantsCount,
                    discipline: { connect: { id: discipline.id } },
                    isOnline: raw.isOnline,
                    address: raw.address,
                    awards: raw.awards,
                    level: raw.level,
                    duration: raw.duration,
                    isPersonalFormatAllowed: raw.isPersonalFormatAllowed,
                    requestStatus: raw.status,
                    requestComment: null,
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
}

void main();
