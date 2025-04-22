"use server";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

import AgeGroupCreateManyInput = Prisma.AgeGroupCreateManyInput;

export const createAgeGroups = async (ageGroups: AgeGroupCreateManyInput) => {
    return prisma.ageGroup.createManyAndReturn({ data: ageGroups, skipDuplicates: true });
};
