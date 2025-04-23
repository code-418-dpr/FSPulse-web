"use server";

import { ZodError } from "zod";

import prisma from "@/lib/prisma";

export const getTeams = async () => {
    return prisma.team.findMany({ orderBy: { name: "asc" } });
};

export const seedTeams = async (teamNames: string[]) => {
    const existingRegions = (await prisma.team.findMany({ select: { name: true } })).map(({ name }) => name);
    return prisma.region.createManyAndReturn({
        data: teamNames.filter((name) => !existingRegions.includes(name)).map((name) => ({ name })),
        skipDuplicates: true,
    });
};

export const registerTeam = async (data: { name: string; eventId: string }) => {
    try {
        return await prisma.$transaction(async (tx) => {
            // Проверка уникальности
            const existingTeam = await tx.team.findFirst({
                where: {
                    AND: [{ name: data.name }, { eventId: data.eventId }],
                },
            });
            if (existingTeam) throw new Error("Команда с такими данными уже существует");

            // Создание команды
            const team = await tx.team.create({
                data: {
                    id: crypto.randomUUID(),
                    name: data.name,
                    eventId: data.eventId,
                },
            });

            return {
                id: team.id,
                name: team.name,
                eventId: team.eventId,
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
