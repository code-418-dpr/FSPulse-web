"use server";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

import AgeGroupCreateInput = Prisma.AgeGroupCreateInput;

export const createAgeGroups = async (ageGroups: AgeGroupCreateInput[]) => {
    const existingAgeGroups = await prisma.ageGroup.findMany({ select: { name: true, minAge: true, maxAge: true } });
    return prisma.ageGroup.createManyAndReturn({
        data: ageGroups.filter(
            ({ name, minAge, maxAge }) => !existingAgeGroups.includes({ name, minAge, maxAge: maxAge ?? null }),
        ),
        skipDuplicates: true,
    });
};
