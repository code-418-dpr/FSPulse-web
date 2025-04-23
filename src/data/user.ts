"use server";

import { Prisma, User } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export const getAthletes = async () => {
    return prisma.athlete.findMany({ include: { user: true } });
};

export const seedUsers = async (users: Prisma.UserCreateInput[]) => {
    const existingAgeGroups = (await prisma.user.findMany({ select: { phoneNumber: true } })).map(
        ({ phoneNumber }) => phoneNumber,
    );
    const filteredUsers = users.filter(({ phoneNumber }) => !existingAgeGroups.includes(phoneNumber));
    const results: User[] = [];
    for (const user of filteredUsers) {
        results.push(await prisma.user.create({ data: user }));
    }
    return results;
};
