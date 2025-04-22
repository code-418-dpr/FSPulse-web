import fs from "fs";
import path from "path";

import { createAgeGroups } from "@/data/age-group";
import { createDisciplines } from "@/data/discipline";
import { createRegions } from "@/data/region";
import { createSkills } from "@/data/skill";
import { createUsers } from "@/data/user";
import prisma from "@/lib/prisma";

import ageGroups from "./data/age-group";
import disciplineNamesAndMinAges from "./data/age-group-of-discipline";
import disciplines from "./data/discipline";
import eventRepresentatives from "./data/eventRepresentatives";
import events from "./data/events";
import regionNames from "./data/region";
import skillNames from "./data/skill";
import users from "./data/user";

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
    const mappedData = disciplineNamesAndMinAges.flatMap(([discipline, ages]) =>
        (ages as number[]).map((age) => {
            const disciplineId = disciplinesMap[discipline as string];
            const ageGroupId = ageGroupsMap[age];
            if (disciplineId && ageGroupId) {
                return {
                    disciplineId,
                    ageGroupId,
                };
            }
        }),
    );
    await prisma.ageGroupOfDiscipline.createMany({
        data: mappedData.filter((relation) => relation !== undefined),
        skipDuplicates: true,
    });

    console.log("Seeding users, athletes, representatives...");
    await createUsers(users);

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
