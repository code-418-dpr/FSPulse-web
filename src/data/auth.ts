"use server";

import bcrypt from "bcrypt";
import { ZodError } from "zod";

import { Prisma, RequestStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { AthleteSpecificData, RegistrationData, RepresentativeSpecificData } from "@/types/user";

export const registerUser = async (data: RegistrationData) => {
    try {
        return await prisma.$transaction(async (tx) => {
            // Проверка региона
            const regionExists = await tx.region.findUnique({
                where: { id: data.regionId },
            });
            if (!regionExists) throw new Error("Указанный регион не существует");

            // Проверка уникальности
            const existingUser = await tx.user.findFirst({
                where: {
                    OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
                },
            });
            if (existingUser) throw new Error("Пользователь с такими данными уже существует");

            // Создание пользователя
            const user = await tx.user.create({
                data: {
                    id: crypto.randomUUID(),
                    lastname: data.lastname,
                    firstname: data.firstname,
                    middlename: data.middlename,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    password: await bcrypt.hash(data.password, 10),
                    tg: data.tg,
                    regionId: data.regionId,
                },
            });

            // Создание специфичных данных
            if (data.role === "athlete") {
                const athleteData = data as AthleteSpecificData;
                await tx.athlete.create({
                    data: {
                        id: user.id,
                        birthDate: athleteData.birthDate,
                        address: athleteData.address,
                        sportCategoryId: athleteData.sportCategoryId,
                        github: athleteData.github,
                    },
                });
            } else {
                const repData = data as RepresentativeSpecificData;
                await tx.representative.create({
                    data: {
                        id: user.id,
                        requestStatus: RequestStatus.PENDING,
                        requestComment: repData.requestComment,
                    },
                });
            }

            return {
                id: user.id,
                email: user.email,
                role: data.role,
            };
        });
    } catch (error) {
        handleRegistrationError(error);
    }
};

const handleRegistrationError = (error: unknown) => {
    console.error("Registration error:", error);

    if (error instanceof ZodError) {
        throw new Error(error.errors.map((e) => e.message).join(", "));
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            const field = (error.meta?.target as string[])[0];
            throw new Error(`Пользователь с таким ${field} уже существует`);
        }
    }

    throw new Error(error instanceof Error ? error.message : "Ошибка регистрации");
};
