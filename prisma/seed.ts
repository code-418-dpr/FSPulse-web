// seed.ts
import bcrypt from "bcrypt";

import { Prisma, SportsCategory } from "@/app/generated/prisma";
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
import { generateTeamsAndMembers } from "./data/team";
import generateRandomUsers from "./data/user";

const INITIAL_USER_COUNT = 50;
const EVENT_COUNT = 50;

// Хелпер, который генерит только «чистого» атлета
async function generateRandomAthleteUser(): Promise<Prisma.UserCreateInput> {
    const gender = faker.person.sexType();
    const lastName = faker.person.lastName(gender);
    const firstName = faker.person.firstName(gender);
    const phoneNumber = faker.phone.number({ style: "international" });
    const email = faker.internet.email();
    const region = faker.helpers.arrayElement(regionNames);

    const birthDate = faker.date.birthdate({ min: 20, max: 50, mode: "age" });
    const address = `${faker.location.city()}, ${faker.location.streetAddress()}`;
    const sportCategory = faker.helpers.arrayElement<SportsCategory>([
        "HMS",
        "MS",
        "CMS",
        "A",
        "B",
        "C",
        "Ay",
        "By",
        "Cy",
    ]);

    return {
        lastname: lastName,
        firstname: firstName,
        phoneNumber,
        email,
        password: await bcrypt.hash(email, 10),
        region: { connect: { name: region } },
        athlete: {
            create: {
                birthDate,
                address,
                sportCategory,
            },
        },
    };
}

export async function main() {
    // 1) Регионы
    console.log("Seeding regions…");
    await seedRegions(regionNames);

    // 2) Юзеры (ATHLETE/REP/COACH)
    console.log("Seeding initial users…");
    const initialUsers = await generateRandomUsers(INITIAL_USER_COUNT);
    await seedUsers(initialUsers);

    // 3) Навыки
    console.log("Seeding skills…");
    const createdSkills = await seedSkills(skillNames);

    console.log("Mapping skills to athletes…");
    const athletes0 = await getAthletes();
    await seedSkillsOfAthletes(generateRandomSkillsOfAthletes(athletes0, createdSkills));

    // 4) Дисциплины
    console.log("Seeding disciplines…");
    const createdDisciplines = await seedDisciplines(disciplines);

    // 5) Возрастные группы
    console.log("Seeding age groups…");
    const createdAgeGroups = await seedAgeGroups(ageGroups);

    console.log("Mapping age groups to disciplines…");
    await prisma.ageGroupOfDiscipline.createMany({
        data: mapDisciplinesAndAgeGroups(createdDisciplines, createdAgeGroups),
        skipDuplicates: true,
    });

    // 6) События
    console.log("Seeding events…");
    const randomEvents = await generateRandomEvents(EVENT_COUNT);
    for (const raw of randomEvents) {
        // (ваша логика создания Event с representatives из data/event)
        await prisma.event.create({ data: raw });
    }

    // 7) Гарантируем: athletes > events
    const totalEvents = await prisma.event.count();
    let athletes = await getAthletes();
    if (athletes.length <= totalEvents) {
        const deficit = (totalEvents - athletes.length) * Math.floor(Math.random() * 10 + 1);
        console.log(`Нужно ещё ${deficit} атлетов, чтобы их было больше событий…`);
        const extra: Prisma.UserCreateInput[] = [];
        for (let i = 0; i < deficit; i++) {
            extra.push(await generateRandomAthleteUser());
        }
        await seedUsers(extra);
        athletes = await getAthletes();
    }
    console.log(`Атлетов: ${athletes.length}, событий: ${totalEvents} — OK.`);

    // 8) Генерим команды и участников
    console.log("Seeding teams and memberships…");
    await generateTeamsAndMembers();

    console.log("✅ Full seed complete!");
}

void main().catch((e: unknown) => {
    console.error("Seed error:", e);
    process.exit(1);
});
