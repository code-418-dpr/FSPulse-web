"use server";

import bcrypt from "bcrypt";
import { ZodError } from "zod";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { AthleteData } from "@/types/athlete";

export const registerAthlete = async (data: AthleteData) => {
    try {
        const regionExists = await prisma.region.findUnique({
            where: { id: data.regionId },
        });

        if (!regionExists) {
            throw new Error("Указанный регион не существует");
        }

        const existingUser = await prisma.athlete.findFirst({
            where: {
                OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
            },
        });

        if (existingUser) {
            throw new Error("Пользователь с таким email или телефоном уже существует");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return await prisma.athlete.create({
            data: {
                lastname: data.lastname,
                firstname: data.firstname,
                middlename: data.middlename,
                birthDate: data.birthDate,
                address: data.address,
                email: data.email,
                phoneNumber: data.phoneNumber,
                sportCategoryId: data.sportCategoryId,
                password: hashedPassword,
                region: {
                    connect: {
                        id: data.regionId,
                    },
                },
            },
        });
    } catch (error) {
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
    }
};

export const loginAthlete = async (credentials: { email: string; password: string }) => {
    try {
        const user = await prisma.athlete.findUnique({
            where: { email: credentials.email },
        });

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
            return {
                id: user.id,
                email: user.email,
                name: `${user.firstname} ${user.lastname}`,
                role: "athlete" as const,
            };
        }
        const representative = await prisma.representative.findUnique({
            where: { email: credentials.email },
        });

        if (representative && (await bcrypt.compare(credentials.password, representative.password))) {
            return {
                id: representative.id,
                email: representative.email,
                name: `${representative.firstname} ${representative.lastname}`,
                role: "representative" as const,
            };
        }
        throw new Error("Неверный email или пароль");
    } catch (error) {
        console.error("Login error:", error);
        throw new Error(error instanceof Error ? error.message : "Ошибка входа");
    }
};
