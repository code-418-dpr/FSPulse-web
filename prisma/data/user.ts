import bcrypt from "bcrypt";

import { Prisma, SportsCategory } from "@/app/generated/prisma";

import regionNames from "./region";

const getRandomRegion = () => {
    return regionNames[Math.floor(Math.random() * regionNames.length)];
};

const getRandomSportCategory = () => {
    const categories: SportsCategory[] = ["HMS", "MS", "CMS", "A", "B", "C", "Ay", "By", "Cy"];
    return categories[Math.floor(Math.random() * categories.length)];
};

const getRandomBirthDate = () => {
    const start = new Date(1980, 0, 1);
    const end = new Date(2010, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const users: Prisma.UserCreateInput[] = [
    {
        lastname: "Иванов",
        firstname: "Иван",
        middlename: "Иванович",
        phoneNumber: "+79160000001",
        email: "ivanov@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@ivanov",
        region: {
            connect: { name: "Москва" },
        },
        athlete: {
            create: {
                birthDate: new Date(2003, 10, 5),
                address: "test",
                sportCategory: "CMS",
                github: "Scorpi-ON",
            },
        },
    },
    {
        lastname: "Цзы",
        firstname: "Сунь",
        phoneNumber: "+79160000003",
        email: "petrov@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@tszy",
        region: {
            connect: { name: "Алтайский край" },
        },
        athlete: {
            create: {
                birthDate: new Date(2003, 10, 5),
                address: "test",
                sportCategory: "CMS",
                github: null,
            },
        },
    },
    {
        lastname: "Станков",
        firstname: "Игорь",
        middlename: "Валентинович",
        phoneNumber: "+79160000002",
        email: "stankov@example.com",
        password: await bcrypt.hash("Testik2", 10),
        tg: "@stankov",
        region: {
            connect: { name: "Донецкая Народная Республика" },
        },
        representative: {
            create: { requestStatus: "APPROVED" },
        },
    },
    {
        lastname: "Лобанов",
        firstname: "Святослав",
        middlename: "Николаевич",
        phoneNumber: "+79160000004",
        email: "lobanov@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@lobanov",
        region: {
            connect: { name: "Ростовская область" },
        },
        representative: {
            create: { requestStatus: "APPROVED" },
        },
    },
    {
        lastname: "Кузнецов",
        firstname: "Дмитрий",
        middlename: "Сергеевич",
        phoneNumber: "+79160000005",
        email: "kuznetsov@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@kuznetsov",
        region: { connect: { name: "Донецкая Народная Республика" } },
        athlete: {
            create: {
                birthDate: getRandomBirthDate(),
                address: "ул. Гагарина, д. 15",
                sportCategory: getRandomSportCategory(),
                github: "kuznetsov-dev",
            },
        },
    },
    {
        lastname: "Смирнова",
        firstname: "Анна",
        middlename: "Владимировна",
        phoneNumber: "+79160000006",
        email: "smirnova@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@smirnova",
        region: { connect: { name: getRandomRegion() } },
        athlete: {
            create: {
                birthDate: getRandomBirthDate(),
                address: "пр. Мира, д. 20",
                sportCategory: getRandomSportCategory(),
                github: "anna-smirnova",
            },
        },
    },
    {
        lastname: "Петров",
        firstname: "Алексей",
        phoneNumber: "+79160000007",
        email: "alexey@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@alexey",
        region: { connect: { name: getRandomRegion() } },
        representative: { create: { requestStatus: "APPROVED" } },
    },
    {
        lastname: "Волкова",
        firstname: "Елена",
        middlename: "Игоревна",
        phoneNumber: "+79160000008",
        email: "volkova@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@volkova",
        region: { connect: { name: getRandomRegion() } },
        athlete: {
            create: {
                birthDate: getRandomBirthDate(),
                address: "ул. Советская, д. 30",
                sportCategory: getRandomSportCategory(),
                github: "volkova-sport",
            },
        },
    },
    {
        lastname: "Соколов",
        firstname: "Михаил",
        middlename: "Петрович",
        phoneNumber: "+79160000009",
        email: "sokolov@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@sokolov",
        region: { connect: { name: getRandomRegion() } },
        representative: {
            create: {
                requestStatus: Math.random() > 0.5 ? "APPROVED" : "PENDING",
                requestComment: Math.random() > 0.7 ? "Требуется дополнительная проверка" : null,
            },
        },
    },
    {
        lastname: "Коваленко",
        firstname: "Ольга",
        phoneNumber: "+79160000010",
        email: "kovalenko@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@kovalenko",
        region: { connect: { name: getRandomRegion() } },
        athlete: {
            create: {
                birthDate: getRandomBirthDate(),
                address: "ул. Кирова, д. 12",
                sportCategory: getRandomSportCategory(),
                github: "olga-kovalenko",
            },
        },
    },
    {
        lastname: "Новиков",
        firstname: "Артем",
        middlename: "Дмитриевич",
        phoneNumber: "+79160000011",
        email: "novikov@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@novikov",
        region: { connect: { name: getRandomRegion() } },
        athlete: {
            create: {
                birthDate: getRandomBirthDate(),
                address: "пр. Ленинградский, д. 45",
                sportCategory: getRandomSportCategory(),
                github: "novikov-code",
            },
        },
    },
    {
        lastname: "Морозова",
        firstname: "Виктория",
        phoneNumber: "+79160000012",
        email: "morozova@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@morozova",
        region: { connect: { name: getRandomRegion() } },
        representative: { create: { requestStatus: "APPROVED" } },
    },
    {
        lastname: "Федоров",
        firstname: "Сергей",
        middlename: "Александрович",
        phoneNumber: "+79160000013",
        email: "fedorov@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@fedorov",
        region: { connect: { name: getRandomRegion() } },
        athlete: {
            create: {
                birthDate: getRandomBirthDate(),
                address: "ул. Садовая, д. 8",
                sportCategory: getRandomSportCategory(),
                github: "fedorov-sergey",
            },
        },
    },
    {
        lastname: "Павлова",
        firstname: "Анастасия",
        phoneNumber: "+79160000014",
        email: "pavlova@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@pavlova",
        region: { connect: { name: getRandomRegion() } },
        representative: {
            create: {
                requestStatus: "PENDING",
                requestComment: "Новый представитель, требует проверки",
            },
        },
    },
    {
        lastname: "Григорьев",
        firstname: "Андрей",
        middlename: "Валерьевич",
        phoneNumber: "+79160000015",
        email: "grigoriev@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@grigoriev",
        region: { connect: { name: getRandomRegion() } },
        athlete: {
            create: {
                birthDate: getRandomBirthDate(),
                address: "ул. Центральная, д. 1",
                sportCategory: getRandomSportCategory(),
                github: null,
            },
        },
    },
    {
        lastname: "Белова",
        firstname: "Мария",
        phoneNumber: "+79160000016",
        email: "belova@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@belova",
        region: { connect: { name: getRandomRegion() } },
        athlete: {
            create: {
                birthDate: getRandomBirthDate(),
                address: "пр. Победы, д. 25",
                sportCategory: getRandomSportCategory(),
                github: "belova-maria",
            },
        },
    },
    {
        lastname: "Козлов",
        firstname: "Иван",
        phoneNumber: "+79160000017",
        email: "kozlov@example.com",
        password: await bcrypt.hash("Testik1", 10),
        tg: "@kozlov",
        region: { connect: { name: getRandomRegion() } },
        representative: { create: { requestStatus: "APPROVED" } },
    },
];

export default users;
