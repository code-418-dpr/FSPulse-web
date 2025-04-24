"use server";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export const getAgeGroups = async () => {
    return prisma.ageGroup.findMany({ orderBy: { maxAge: { sort: "asc", nulls: "last" } } });
};

export const seedAgeGroups = async (ageGroups: Prisma.AgeGroupCreateInput[]) => {
    const existingAgeGroups = await prisma.ageGroup.findMany({ select: { name: true, minAge: true, maxAge: true } });
    return prisma.ageGroup.createManyAndReturn({
        data: ageGroups.filter(
            ({ name, minAge, maxAge }) => !existingAgeGroups.includes({ name, minAge, maxAge: maxAge ?? null }),
        ),
        skipDuplicates: true,
    });
};

export const getAgeGroupsByDiscipline = async (disciplineId: string) => {
    return await prisma.ageGroupOfDiscipline.findMany({
        where: { disciplineId },
        include: { ageGroup: true },
    });
};
