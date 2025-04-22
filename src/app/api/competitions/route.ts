// src/app/api/competitions/route.ts
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "12");
    const skip = (page - 1) * pageSize;

    // ToDo: Временная заглушка для получения id Representative
    const representativeId = "1609ad63-d133-4056-bc49-8d9f3e642b21";

    const [totalItems, entries] = await prisma.$transaction([
        prisma.eventOfRepresentative.count({ where: { representativeId } }),
        prisma.eventOfRepresentative.findMany({
            where: { representativeId },
            skip,
            take: pageSize,
            include: {
                event: {
                    include: { discipline: true },
                },
            },
        }),
    ]);

    const items = entries.map(({ event }) => ({
        id: event.id,
        title: event.name,
        region: event.address ?? "—",
        startDate: event.start.toISOString().split("T")[0],
        endDate: event.end.toISOString().split("T")[0],
        applicationDate: event.applicationTime.toISOString().split("T")[0],
        status: event.status,
        format: event.isOnline ? "Онлайн" : "Очно",
        discipline: event.discipline.name,
        image: "https://heroui.com/images/hero-card-complete.jpeg", // или использовать event.cover, если преобразован
    }));

    return NextResponse.json({
        items,
        pagination: {
            page,
            pageSize,
            totalItems,
            totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
        },
    });
}
