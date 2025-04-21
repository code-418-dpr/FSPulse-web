"use server";

import prisma from "@/lib/prisma";

export const getDisciplines = async () => {
    return prisma.region.findMany({ orderBy: { name: "asc" } });
};
