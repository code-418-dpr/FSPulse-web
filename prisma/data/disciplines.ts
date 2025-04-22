import { Prisma } from "@/app/generated/prisma";

import DisciplineCreateManyInput = Prisma.DisciplineCreateManyInput;

const disciplines: DisciplineCreateManyInput = [
    {
        name: "Программирование продуктовое",
        durationLimits: [12, 72],
        teamParticipantsLimits: [3, 6],
        isPersonalFormatAllowed: false,
    },
    {
        name: "Программирование алгоритмическое",
        durationLimits: [4, 8],
        teamParticipantsLimits: [2, 3],
        isPersonalFormatAllowed: true,
    },
    {
        name: "Программирование систем информационной безопасности",
        durationLimits: [24, 24 * 7],
        teamParticipantsLimits: [2, 7],
        isPersonalFormatAllowed: true,
    },
    {
        name: "Программирование беспилотных авиационных систем",
        durationLimits: [4, 20],
        teamParticipantsLimits: [],
        isPersonalFormatAllowed: true,
    },
    {
        name: "Программирование робототехники",
        durationLimits: [24, 24 * 7],
        teamParticipantsLimits: [2, 15],
        isPersonalFormatAllowed: true,
    },
];

export default disciplines;
