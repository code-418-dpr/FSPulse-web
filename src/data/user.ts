"use server";

import { Prisma, SportsCategory, User } from "@/app/generated/prisma";
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

export const findAthleteById = async (athleteId: string) => {
    return prisma.athlete.findUnique({
        where: {
            id: athleteId,
        },
        include: {
            user: true,
            skills: {
                include: {
                    skill: true,
                },
            },
        },
    });
};

export interface AthleteSpecificData {
    lastname: string;
    firstname: string;
    middlename?: string | null;
    email: string;
    phoneNumber: string;
    regionId: string;
    birthDate: string;
    address: string;
    about?: string | undefined | null;
    sportCategory?: SportsCategory | undefined;
}

export const alterAthleteById = async (athlete: AthleteSpecificData, athleteId: string) => {
    return prisma.athlete.update({
        where: { id: athleteId },
        data: {
            birthDate: new Date(athlete.birthDate),
            address: athlete.address,
            about: athlete.about,
            sportCategory: athlete.sportCategory,
            user: {
                update: {
                    lastname: athlete.lastname,
                    firstname: athlete.firstname,
                    middlename: athlete.middlename,
                    phoneNumber: athlete.phoneNumber,
                    email: athlete.email,
                    regionId: athlete.regionId,
                },
            },
        },
        include: {
            user: true,
        },
    });
};

/*
            skills: athlete.skills ? {
                // Удалить все текущие навыки
                deleteMany: {},
                // Добавить новые навыки
                create: athlete.skills.map(skillId => ({
                    skillId,
                    grade: 0 // или другое значение по умолчанию
                }))
            } : undefined,
 */
