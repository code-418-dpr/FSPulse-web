import { AgeGroup, Discipline } from "@/app/generated/prisma";

const disciplineNamesAndMinAges = [
    ["Программирование продуктовое", [14, 17, 16]],
    ["Программирование алгоритмическое", [12, 15, 17, 16]],
    ["Программирование робототехники", [12, 15, 17, 16]],
    ["Программирование систем информационной безопасности", [14, 17, 16]],
    ["Программирование беспилотных авиационных систем", [14, 17, 16]],
];

function mapDisciplinesAndAgeGroups(disciplines: Discipline[], ageGroups: AgeGroup[]) {
    const disciplinesMap = Object.fromEntries(disciplines.map((d) => [d.name, d.id]));
    const ageGroupsMap = Object.fromEntries(ageGroups.map((ag) => [ag.minAge, ag.id]));
    const mappedData = disciplineNamesAndMinAges.flatMap(([discipline, ages]) =>
        (ages as number[]).map((age) => {
            const disciplineId = disciplinesMap[discipline as string];
            const ageGroupId = ageGroupsMap[age];
            if (disciplineId && ageGroupId) {
                return {
                    disciplineId,
                    ageGroupId,
                };
            }
        }),
    );
    return mappedData.filter((relation) => relation !== undefined);
}

export default mapDisciplinesAndAgeGroups;
