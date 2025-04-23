"use server";

import prisma from "@/lib/prisma";

export const seedSkillsOfAthletes = async (
    skillsOfAthletes: { athleteId: string; skillId: string; grade?: number }[],
) => {
    const existingSkillsOfAthletes = await prisma.skillOfAthlete.findMany();
    const existingSkillsOfAthletesUniqueKeys = existingSkillsOfAthletes.map(({ athleteId, skillId }) => ({
        athleteId,
        skillId,
    }));
    const filteredSkillsOfAthletes = skillsOfAthletes.filter(
        ({ athleteId, skillId }) => !existingSkillsOfAthletesUniqueKeys.includes({ athleteId, skillId }),
    );
    await prisma.skillOfAthlete.createMany({ data: filteredSkillsOfAthletes });
};
