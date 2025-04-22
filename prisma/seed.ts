import { createAgeGroups } from "@/data/age-group";
import { createDisciplines } from "@/data/discipline";
import { createRegions } from "@/data/region";
import prisma from "@/lib/prisma";

import ageGroups from "./data/age-group";
import disciplines from "./data/disciplines";
import regionNames from "./data/regions";

export async function main() {
    await createRegions(regionNames);
    const allDisciplines = await createDisciplines(disciplines);
    const allAgeGroups = await createAgeGroups(ageGroups);

    const disciplinesMap = Object.fromEntries(allDisciplines.map((d) => [d.name, d.id]));
    const ageGroupsMap = Object.fromEntries(allAgeGroups.map((ag) => [ag.minAge, ag.id]));

    const relations = [
        ["Программирование продуктовое", [14, 17, 16]],
        ["Программирование алгоритмическое", [12, 15, 17, 16]],
        ["Программирование робототехники", [12, 15, 17, 16]],
        ["Программирование систем информационной безопасности", [14, 17, 16]],
        ["Программирование беспилотных авиационных систем", [14, 17, 16]],
    ].flatMap(([discipline, ages]) =>
        (ages as number[]).map((age) => ({
            disciplineId: disciplinesMap[discipline as string],
            ageGroupId: ageGroupsMap[age],
        })),
    );

    await prisma.ageGroupOfDiscipline.createMany({
        data: relations,
        skipDuplicates: true,
    });
}

void main();
