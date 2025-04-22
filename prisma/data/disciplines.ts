import { Prisma } from "@/app/generated/prisma";

import DisciplineCreateInput = Prisma.DisciplineCreateInput;

const disciplines: DisciplineCreateInput[] = [
    {
        name: "Программирование продуктовое",
        minDuration: 12,
        maxDuration: 72,
        minTeamParticipantsCount: 3,
        maxTeamParticipantsCount: 6,
        isPersonalFormatAllowed: false,
    },
    {
        name: "Программирование алгоритмическое",
        minDuration: 4,
        maxDuration: 8,
        minTeamParticipantsCount: 2,
        maxTeamParticipantsCount: 3,
        isPersonalFormatAllowed: true,
    },
    {
        name: "Программирование систем информационной безопасности",
        minDuration: 24,
        maxDuration: 24 * 7,
        minTeamParticipantsCount: 2,
        maxTeamParticipantsCount: 7,
        isPersonalFormatAllowed: true,
    },
    {
        name: "Программирование беспилотных авиационных систем",
        minDuration: 4,
        maxDuration: 20,
        minTeamParticipantsCount: 0,
        maxTeamParticipantsCount: 0,
        isPersonalFormatAllowed: true,
    },
    {
        name: "Программирование робототехники",
        minDuration: 24,
        maxDuration: 24 * 7,
        minTeamParticipantsCount: 2,
        maxTeamParticipantsCount: 15,
        isPersonalFormatAllowed: true,
    },
];

export default disciplines;
