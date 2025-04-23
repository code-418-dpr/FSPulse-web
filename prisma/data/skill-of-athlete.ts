import { Athlete, Skill } from "@/app/generated/prisma";
import { faker } from "@faker-js/faker/locale/ru";

function generateRandomSkillsOfAthletes(athletes: Athlete[], skills: Skill[]) {
    const skillIds = skills.map((skill) => skill.id);
    const skillsOfAthletes: { athleteId: string; skillId: string; grade?: number }[] = [];
    for (const athlete of athletes) {
        for (const skillId of faker.helpers.arrayElements(skillIds)) {
            skillsOfAthletes.push({
                athleteId: athlete.id,
                skillId,
                grade: faker.number.int({ min: 0, max: 5 }),
            });
        }
    }
    return skillsOfAthletes;
}

export default generateRandomSkillsOfAthletes;
