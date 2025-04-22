"use server";

import prisma from "@/lib/prisma";

export const getRegions = async () => {
    return await prisma.region.findMany({ orderBy: { name: "asc" } });
};

export const createRegions = async (regions: string[]) => {
    return await prisma.region.createManyAndReturn({ data: regions.map((name) => ({ name })), skipDuplicates: true });
};
