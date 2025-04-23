// seed.ts
import { createAgeGroups } from "@/data/age-group";
import { createDisciplines } from "@/data/discipline";
import { createRegions } from "@/data/region";
import { createSkills } from "@/data/skill";
import { createSkillsOfAthletes } from "@/data/skill-of-athlete";
import { createUsers, getAthletes } from "@/data/user";
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
const EVENT_COUNT = 50;

export async function main() {
    // 1) Регионы
    console.log("Seeding regions...");
    await createRegions(regionNames);

    // 2) Пользователи (спортсмены, представители, тренеры)
    console.log("Seeding users, athletes, coaches, representatives...");
    const usersData = await generateRandomUsers(USER_COUNT);
    await createUsers(usersData);

    // 3) Навыки и распределение по спортсменам
    console.log("Seeding skills...");
    const createdSkills = await createSkills(skillNames);

    console.log("Mapping skills to athletes...");
    const athletes = await getAthletes();
    const skillsOfAthletes = generateRandomSkillsOfAthletes(athletes, createdSkills);
    await createSkillsOfAthletes(skillsOfAthletes);

    // 4) Дисциплины
    console.log("Seeding disciplines...");
    const createdDisciplines = await createDisciplines(disciplines);

    // 5) Возрастные группы и их связь с дисциплинами
    console.log("Seeding age groups...");
    const createdAgeGroups = await createAgeGroups(ageGroups);

    console.log("Mapping age groups to disciplines...");
    await prisma.ageGroupOfDiscipline.createMany({
        data: mapDisciplinesAndAgeGroups(createdDisciplines, createdAgeGroups),
        skipDuplicates: true,
    });

    // 6) Подготовка списка представителей
    console.log("Fetching representatives...");
    const reps = await prisma.representative.findMany({ select: { id: true } });
    const repIds = reps.map((r) => r.id);

    // 7) Создание событий вместе с представителями
    console.log("Seeding events with representatives...");
    const randomEvents = await generateRandomEvents(EVENT_COUNT);

    for (const raw of randomEvents) {
        // выбираем от 1 до 3 уникальных представителей
        const howMany = faker.number.int({ min: 1, max: 4 });
        const repIdsForEvent = faker.helpers.arrayElements(repIds, howMany);

        await prisma.event.create({
            data: {
                // поля события
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

                // вложенные записи EventOfRepresentative
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
