import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

const EXPECTED_TOKEN = process.env.API_TOKEN;

export async function GET(req: NextRequest) {
    // Проверка заголовка Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    if (token !== EXPECTED_TOKEN) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Получаем параметр tg из query
    const tg = req.nextUrl.searchParams.get("tg");
    if (!tg) {
        return NextResponse.json({ error: "Telegram ID is required" }, { status: 400 });
    }

    // Поиск пользователя по tg
    const user = await prisma.user.findUnique({
        where: { tg },
        select: { id: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User with this Telegram ID not found" }, { status: 404 });
    }

    // Успешный ответ
    return NextResponse.json({ success: true, tg, userId: user.id }, { status: 200 });
}
