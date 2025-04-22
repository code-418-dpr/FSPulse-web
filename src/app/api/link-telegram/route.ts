import axios from "axios";

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

interface User {
    tg: string | null;
}

interface LinkTelegramRequest {
    tg: string;
    userId: string;
}

export async function POST(req: NextRequest) {
    // Явно указываем тип данных, получаемых из запроса
    const { tg, userId }: LinkTelegramRequest = (await req.json()) as LinkTelegramRequest;

    if (!tg || !userId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
        // Сначала получаем текущий пользовательский объект
        const user: User | null = await prisma.user.findUnique({
            where: { id: userId },
            select: { tg: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Если уже привязано то же самое tg — выходим без повторной отправки
        if (user.tg === tg) {
            return NextResponse.json({ success: true });
        }

        // Иначе обновляем в БД
        await prisma.user.update({
            where: { id: userId },
            data: { tg },
        });

        // И отправляем одно сообщение в Телеграм
        const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
        if (!token) {
            return NextResponse.json({ error: "Telegram bot token missing" }, { status: 500 });
        }

        const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        console.log("Calling Telegram API:", apiUrl, "chat_id=", tg);

        await axios.post(apiUrl, {
            chat_id: tg,
            text: "✅ Ваш Telegram‑аккаунт успешно привязан!",
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        // Обрабатываем ошибку
        if (error instanceof Error) {
            console.error("❌ Ошибка при привязке Telegram или отправке сообщения:", error.message);
        } else {
            console.error("❌ Неизвестная ошибка при привязке Telegram:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
