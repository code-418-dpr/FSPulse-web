import bcrypt from "bcrypt";

import { Membership, Prisma, SportsCategory } from "@/app/generated/prisma";
import { faker } from "@faker-js/faker/locale/ru";

import regionNames from "./region";

const getRandomSportCategory = () => {
    const categories: SportsCategory[] = ["HMS", "MS", "CMS", "A", "B", "C", "Ay", "By", "Cy"];
    return faker.helpers.arrayElement(categories);
};

const getRandomMembership = () => {
    const memberships: Membership[] = ["MAIN", "RESERVE", "NONE"];
    return faker.helpers.arrayElement(memberships);
};

const getRandomBirthDate = () => {
    return faker.date.birthdate({ min: 20, max: 50, mode: "age" });
};

const getRandomAddress = () => {
    return `${faker.location.city()}, ${faker.location.streetAddress()}`;
};

const generateRandomUser = async () => {
    const gender = faker.person.sexType();
    const lastName = faker.person.lastName(gender);
    const firstName = faker.person.firstName(gender);
    const middleName = faker.person.middleName(gender);

    const hasMiddleName = faker.datatype.boolean({ probability: 0.8 });
    const role = faker.helpers.arrayElement(["ATHLETE", "REPRESENTATIVE", "COACH"]);

    const phoneNumber = faker.phone.number({ style: "international" });
    const email = faker.internet.email();
    const region = faker.helpers.arrayElement(regionNames);

    const baseUser: Prisma.UserCreateInput = {
        lastname: lastName,
        firstname: firstName,
        phoneNumber,
        email,
        password: await bcrypt.hash(email, 10),
        region: {
            connect: { name: region },
        },
    };

    if (hasMiddleName) {
        baseUser.middlename = middleName;
    }

    if (role === "ATHLETE") {
        baseUser.athlete = {
            create: {
                birthDate: getRandomBirthDate(),
                address: getRandomAddress(),
                sportCategory: getRandomSportCategory(),
                membership: getRandomMembership(),
            },
        };
    } else if (role === "REPRESENTATIVE") {
        const requestStatus = faker.helpers.arrayElement(["PENDING", "APPROVED", "DECLINED"]);
        baseUser.representative = {
            create: {
                requestStatus,
                requestComment: requestStatus === "DECLINED" ? faker.lorem.sentence() : null,
            },
        };
    } else {
        baseUser.coach = {
            create: {
                birthDate: getRandomBirthDate(),
                address: getRandomAddress(),
            },
        };
    }

    return baseUser;
};

async function generateRandomUsers(count: number) {
    const users: Prisma.UserCreateInput[] = [];
    for (let i = 0; i < count; i++) {
        users.push(await generateRandomUser());
    }
    return users;
}

export default generateRandomUsers;
