"use server";

import prisma from "@/lib/prisma";

export const getRegions = async () => {
    return prisma.region.findMany({ orderBy: { name: "asc" } });
};

export const createRegions = async (regions: string[]) => {
    return prisma.region.createManyAndReturn({ data: regions.map((name) => ({ name })), skipDuplicates: true });
};
