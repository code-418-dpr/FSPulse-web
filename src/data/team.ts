"use server";

import { ZodError } from "zod";

import prisma from "@/lib/prisma";

export const getTeams = async () => {
    return prisma.team.findMany({ orderBy: { name: "asc" } });
};

export const getTeamsByEvent = async (eventId: string) => {
    return prisma.team.findMany({
        where: { eventId: eventId },
        orderBy: { name: "asc" },
    });
};

export const seedTeams = async (teamNames: string[]) => {
    const existingRegions = (await prisma.team.findMany({ select: { name: true } })).map(({ name }) => name);
    return prisma.region.createManyAndReturn({
        data: teamNames.filter((name) => !existingRegions.includes(name)).map((name) => ({ name })),
        skipDuplicates: true,
    });
};

export const registerTeam = async (data: { name: string; eventId: string }, currentAthleteId: string) => {
    try {
        return await prisma.$transaction(async (tx) => {
            // Проверка уникальности
            const existingTeam = await tx.team.findFirst({
                where: {
                    AND: [{ name: data.name }, { eventId: data.eventId }],
                },
            });
            if (existingTeam) throw new Error("Команда с такими данными уже существует");

            // Проверка существования пользователя
            const athleteExists = await tx.athlete.findFirst({
                where: { id: currentAthleteId },
            });
            if (!athleteExists) {
                throw new Error("Пользователь не найден");
            }

            // Создание команды
            const team = await tx.team.create({
                data: {
                    name: data.name,
                    eventId: data.eventId,
                    athletes: {
                        create: {
                            athlete: { connect: { id: currentAthleteId } }, // Явное подключение
                            isLeader: true,
                        },
                    },
                },
                include: {
                    athletes: {
                        where: {
                            athleteId: currentAthleteId,
                        },
                        select: {
                            athleteId: true,
                            isLeader: true,
                        },
                    },
                },
            });

            return {
                id: team.id,
                name: team.name,
                eventId: team.eventId,
                athleteId: currentAthleteId,
            };
        });
    } catch (error) {
        handleTeamCreateError(error);
    }
};

const handleTeamCreateError = (error: unknown) => {
    console.error("Team create error:", error);

    if (error instanceof ZodError) {
        throw new Error(error.errors.map((e) => e.message).join(", "));
    }

    throw new Error(error instanceof Error ? error.message : "Ошибка регистрации");
};
