"use server";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

import AgeGroupCreateInput = Prisma.AgeGroupCreateInput;

export const createAgeGroups = async (ageGroups: AgeGroupCreateInput[]) => {
    return prisma.ageGroup.createManyAndReturn({ data: ageGroups, skipDuplicates: true });
};
