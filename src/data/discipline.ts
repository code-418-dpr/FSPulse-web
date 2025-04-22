"use server";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

import DisciplineCreateManyInput = Prisma.DisciplineCreateManyInput;

export const getDisciplines = async () => {
    return prisma.discipline.findMany({
        orderBy: { name: "asc" },
        include: { ageGroups: { include: { ageGroup: true } } },
    });
};

export const createDisciplines = async (disciplines: DisciplineCreateManyInput) => {
    return prisma.discipline.createManyAndReturn({ data: disciplines, skipDuplicates: true });
};
