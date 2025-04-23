"use server";

import prisma from "@/lib/prisma";

export const seedSkills = async (skillNames: string[]) => {
    const existingSkills = (await prisma.skill.findMany({ select: { name: true } })).map(({ name }) => name);
    return prisma.skill.createManyAndReturn({
        data: skillNames.filter((name) => !existingSkills.includes(name)).map((name) => ({ name })),
        skipDuplicates: true,
    });
};
