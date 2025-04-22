import bcrypt from "bcrypt";

import { Prisma } from "@/app/generated/prisma";

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
];

export default users;
