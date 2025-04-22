"use server";

import prisma from "@/lib/prisma";

export const createSkills = async (skillNames: string[]) => {
    return prisma.skill.createManyAndReturn({ data: skillNames.map((name) => ({ name })), skipDuplicates: true });
};
