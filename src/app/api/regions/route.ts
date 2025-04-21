import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const regions = await prisma.region.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        return NextResponse.json(regions);
    } catch (error) {
        console.error("Ошибка получения регионов:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}
