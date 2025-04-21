import bcrypt from "bcrypt";
import { ZodError } from "zod";

import { type NextRequest, NextResponse } from "next/server";

import { Prisma, SportsCategory } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

interface RegisterRequestBody {
    email: string;
    password: string;
    lastname: string;
    firstname: string;
    middlename?: string | null;
    birthDate: string;
    region: string;
    address: string;
    sportCategory: SportsCategory;
    phoneNumber: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RegisterRequestBody;
        const {
            email,
            password,
            lastname,
            firstname,
            middlename,
            birthDate,
            region,
            address,
            sportCategory,
            phoneNumber,
        } = body;
        console.log(body);
        const regionExists = await prisma.region.findUnique({
            where: { id: region },
        });
        if (!regionExists) {
            return NextResponse.json({ error: "Указанный регион не существует" }, { status: 400 });
        }
        const existingUser = await prisma.athlete.findFirst({
            where: {
                OR: [{ email }, { phoneNumber }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Пользователь с таким email или телефоном уже существует" },
                { status: 409 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.athlete.create({
            data: {
                email,
                password: hashedPassword,
                lastname,
                firstname,
                middlename: middlename ?? null,
                birthDate: new Date(birthDate),
                regionId: region,
                address,
                sportCategoryId: sportCategory,
                phoneNumber,
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors.map((e) => e.message).join(", ") }, { status: 400 });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
              const field = (error.meta?.target as string[])[0];
              return NextResponse.json(
                { error: `Пользователь с таким ${field} уже существует` },
                { status: 409 }
              );
            }
          }
        return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
    }
}
