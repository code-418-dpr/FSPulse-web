import { seedAgeGroups } from "@/data/age-group";
import { seedDisciplines } from "@/data/discipline";
import { seedRegions } from "@/data/region";
import { seedSkills } from "@/data/skill";
import { seedSkillsOfAthletes } from "@/data/skill-of-athlete";
import { getAthletes, seedUsers } from "@/data/user";
import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker/locale/ru";

import ageGroups from "./data/age-group";
import mapDisciplinesAndAgeGroups from "./data/age-group-of-discipline";
import disciplines from "./data/discipline";
import { generateRandomEvents } from "./data/event";
import regionNames from "./data/region";
import skillNames from "./data/skill";
import generateRandomSkillsOfAthletes from "./data/skill-of-athlete";
import generateRandomUsers from "./data/user";

const USER_COUNT = 100;
const EVENT_COUNT = 1000;

export async function main() {
    console.log("Seeding regions...");
    await seedRegions(regionNames);

    console.log("Seeding users, athletes, coaches, representatives...");
    const usersData = await generateRandomUsers(USER_COUNT);
    await seedUsers(usersData);

    console.log("Seeding skills...");
    const createdSkills = await seedSkills(skillNames);

    console.log("Mapping skills to athletes...");
    const athletes = await getAthletes();
    const skillsOfAthletes = generateRandomSkillsOfAthletes(athletes, createdSkills);
    await seedSkillsOfAthletes(skillsOfAthletes);

    console.log("Seeding disciplines...");
    const createdDisciplines = await seedDisciplines(disciplines);

    console.log("Seeding age groups...");
    const createdAgeGroups = await seedAgeGroups(ageGroups);

    console.log("Mapping age groups to disciplines...");
    await prisma.ageGroupOfDiscipline.createMany({
        data: mapDisciplinesAndAgeGroups(createdDisciplines, createdAgeGroups),
        skipDuplicates: true,
    });

    console.log("Fetching representatives...");
    const reps = await prisma.representative.findMany({ select: { id: true } });
    const repIds = reps.map((r) => r.id);

    console.log("Seeding events with representatives...");
    const randomEvents = await generateRandomEvents(EVENT_COUNT);

    for (const raw of randomEvents) {
        const howMany = faker.number.int({ min: 1, max: 4 });
        const repIdsForEvent = faker.helpers.arrayElements(repIds, howMany);

        await prisma.event.create({
            data: {
                name: raw.name,
                description: raw.description,
                cover: raw.cover,
                applicationTime: raw.applicationTime,
                startRegistration: raw.startRegistration,
                endRegistration: raw.endRegistration,
                start: raw.start,
                end: raw.end,
                minAge: raw.minAge,
                maxAge: raw.maxAge,
                minTeamParticipantsCount: raw.minTeamParticipantsCount,
                maxTeamParticipantsCount: raw.maxTeamParticipantsCount,
                maxParticipantsCount: raw.maxParticipantsCount,
                isPersonalFormatAllowed: raw.isPersonalFormatAllowed,
                disciplineId: raw.disciplineId,
                isOnline: raw.isOnline,
                address: raw.address,
                awards: raw.awards,
                level: raw.level,
                requestStatus: raw.requestStatus,
                requestComment: raw.requestComment,

                representatives: {
                    create: repIdsForEvent.map((repId) => ({
                        representative: { connect: { id: repId } },
                    })),
                },
            },
        });

        console.log(`  ✔ Event "${raw.name}" linked with reps [${repIdsForEvent.join(", ")}]`);
    }

    console.log("✅ Seeding complete!");
}

void main().catch((e: unknown) => {
    console.error("Seed error:", e);
    process.exit(1);
});
