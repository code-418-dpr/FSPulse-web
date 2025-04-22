import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

const EXPECTED_TOKEN = process.env.API_TOKEN;

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (token !== EXPECTED_TOKEN) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "5", 10);
    const disciplineFilter = searchParams.get("discipline")?.trim();

    const skip = (page - 1) * pageSize;

    try {
        const [totalItems, events] = await prisma.$transaction([
            prisma.event.count({
                where: {
                    requestStatus: "APPROVED",
                    endRegistration: { gt: new Date() },
                    ...(disciplineFilter
                        ? {
                              discipline: {
                                  name: {
                                      contains: disciplineFilter,
                                      mode: "insensitive",
                                  },
                              },
                          }
                        : {}),
                },
            }),
            prisma.event.findMany({
                where: {
                    requestStatus: "APPROVED",
                    endRegistration: { gt: new Date() },
                    ...(disciplineFilter
                        ? {
                              discipline: {
                                  name: {
                                      contains: disciplineFilter,
                                      mode: "insensitive",
                                  },
                              },
                          }
                        : {}),
                },
                select: {
                    id: true,
                    name: true,
                    start: true,
                    endRegistration: true,
                    discipline: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: { start: "asc" },
                skip,
                take: pageSize,
            }),
        ]);

        const items = events.map((event) => ({
            id: event.id,
            name: event.name,
            start: event.start.toISOString(),
            endRegistration: event.endRegistration.toISOString(),
            discipline: event.discipline.name, // ✅ без проверки
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
    } catch (error) {
        console.error("❌ Ошибка при получении событий:", error);
        return NextResponse.json(
            {
                items: [],
                pagination: {
                    page,
                    pageSize,
                    totalItems: 0,
                    totalPages: 1,
                },
            },
            { status: 500 },
        );
    }
}
