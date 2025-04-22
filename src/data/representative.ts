"use server";

import bcrypt from "bcrypt";
import { ZodError } from "zod";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

interface RepresentativeData {
    lastname: string;
    firstname: string;
    middlename: string | null;
    regionId: string;
    phone: string;
    email: string;
    password: string;
}

export const registerRepresentative = async (data: RepresentativeData) => {
    try {
        const regionExists = await prisma.region.findUnique({
            where: { id: data.regionId },
        });

        if (!regionExists) {
            throw new Error("Указанный регион не существует");
        }

        const existingUser = await prisma.representative.findFirst({
            where: {
                OR: [{ email: data.email }, { phoneNumber: data.phone }],
            },
        });

        if (existingUser) {
            throw new Error("Пользователь с таким email или телефоном уже существует");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return await prisma.representative.create({
            data: {
                lastname: data.lastname,
                firstname: data.firstname,
                middlename: data.middlename,
                email: data.email,
                phoneNumber: data.phone,
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

        throw new Error(error instanceof Error ? error.message : "Ошибка регистрации представителя");
    }
};
