"use server";

import prisma from "@/lib/prisma";

export const getDisciplines = async () => {
    return prisma.discipline.findMany({ orderBy: { name: "asc" } });
};

export const createDisciplines = async (disciplines: string[]) => {
    return prisma.discipline.createMany({ data: disciplines.map((name) => ({ name })) });
};
