import fs from "fs";
import path from "path";

import { createAgeGroups } from "@/data/age-group";
import { createDisciplines } from "@/data/discipline";
import { createRegions } from "@/data/region";
import { createSkills } from "@/data/skill";
import { createSkillsOfAthletes } from "@/data/skill-of-athlete";
import { createUsers, getAthletes } from "@/data/user";
import prisma from "@/lib/prisma";

import ageGroups from "./data/age-group";
import mapDisciplinesAndAgeGroups from "./data/age-group-of-discipline";
import disciplines from "./data/discipline";
import eventRepresentatives from "./data/eventRepresentatives";
import events from "./data/events";
import regionNames from "./data/region";
import skillNames from "./data/skill";
import generateRandomSkillsOfAthletes from "./data/skill-of-user";
import generateRandomUsers from "./data/user";

const userCount = 100;

export async function main() {
    console.log("Seeding regions...");
    await createRegions(regionNames);

    console.log("Seeding users, athletes, coaches, representatives...");
    await createUsers(await generateRandomUsers(userCount));

    console.log("Seeding skills...");
    const createdSkills = await createSkills(skillNames);

    console.log("Mapping skills to athletes...");
    const athletes = await getAthletes();
    await createSkillsOfAthletes(generateRandomSkillsOfAthletes(athletes, createdSkills));

    console.log("Seeding disciplines...");
    const createdDisciplines = await createDisciplines(disciplines);

    console.log("Seeding age groups...");
    const createdAgeGroups = await createAgeGroups(ageGroups);

    console.log("Mapping age groups to disciplines...");
    await prisma.ageGroupOfDiscipline.createMany({
        data: mapDisciplinesAndAgeGroups(createdDisciplines, createdAgeGroups),
        skipDuplicates: true,
    });

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
            const rep = await prisma.representative.findFirst({
                include: { user: true },
                where: { user: { email: representativeEmail } },
            });
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
