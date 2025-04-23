"use server";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export const getDisciplines = async () => {
    return prisma.discipline.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
};

export const getDisciplinesWithAgeGroups = async () => {
    return prisma.discipline.findMany({
        orderBy: { name: "asc" },
        include: { ageGroups: { include: { ageGroup: true } } },
    });
};

export const seedDisciplines = async (disciplines: Prisma.DisciplineCreateInput[]) => {
    const existingDisciplines = (await prisma.discipline.findMany({ select: { name: true } })).map(({ name }) => name);
    return prisma.discipline.createManyAndReturn({
        data: disciplines.filter(({ name }) => !existingDisciplines.includes(name)),
        skipDuplicates: true,
    });
};
