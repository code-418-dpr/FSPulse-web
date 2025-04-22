import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

const EXPECTED_TOKEN = process.env.API_TOKEN;

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");

    // Проверка: должен быть Bearer-токен
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (token !== EXPECTED_TOKEN) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const events = await prisma.$queryRaw<
            {
                id: string;
                name: string;
                start: Date;
                endRegistration: Date;
            }[]
        >`
            SELECT id, name, "start", "endRegistration"
            FROM "Event"
            WHERE "requestStatus" = 'APPROVED'
              AND "endRegistration" > NOW()
            ORDER BY "start" ASC
        `;

        return NextResponse.json(events);
    } catch (error) {
        console.error("Ошибка при выполнении raw SQL:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
