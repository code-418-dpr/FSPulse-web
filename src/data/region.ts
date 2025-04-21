"use server";

import prisma from "@/lib/prisma";

export const getCountries = async () => {
    return prisma.region.findMany({ orderBy: { name: "asc" } });
};
