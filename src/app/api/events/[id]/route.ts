import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

const EXPECTED_TOKEN = process.env.API_TOKEN;

export async function GET(request: NextRequest, context: { params: { id: string } }) {
    const authHeader = request.headers.get("authorization");
    const { params } = context;

    // Проверка заголовка Authorization
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (token !== EXPECTED_TOKEN) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const eventId = params.id;

    if (!eventId) {
        return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                id: true,
                name: true,
                start: true,
                endRegistration: true,
                requestStatus: true,
            },
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("❌ Ошибка при получении события по ID:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
