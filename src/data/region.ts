"use server";

import prisma from "@/lib/prisma";

export const getRegions = async () => {
    return prisma.region.findMany({ orderBy: { name: "asc" } });
};

export const createRegions = async (regionNames: string[]) => {
    const existingRegions = (await prisma.region.findMany({ select: { name: true } })).map(({ name }) => name);
    return prisma.region.createManyAndReturn({
        data: regionNames.filter((name) => !existingRegions.includes(name)).map((name) => ({ name })),
        skipDuplicates: true,
    });
};
