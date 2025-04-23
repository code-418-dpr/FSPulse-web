import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

const EXPECTED_TOKEN = process.env.API_TOKEN;

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ") || authHeader.split(" ")[1] !== EXPECTED_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Добавляем 24 часа в миллисекундах

    const events = await prisma.event.findMany({
        where: {
            requestStatus: "APPROVED",
            endRegistration: { gt: now },
            start: {
                gt: now,
                lt: twentyFourHoursLater, // Используем вычисленную дату
            },
        },
        select: {
            id: true,
            name: true,
            start: true,
            teams: {
                select: {
                    athletes: {
                        select: {
                            athlete: {
                                select: {
                                    user: {
                                        select: {
                                            tg: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            representatives: {
                select: {
                    representative: {
                        select: {
                            user: {
                                select: {
                                    tg: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const result = events.map((event) => {
        const tgIds = new Set<string>(); // Используем Set для автоматического удаления дубликатов

        event.teams.forEach((team) => {
            team.athletes.forEach((a) => {
                if (a.athlete.user.tg) {
                    tgIds.add(a.athlete.user.tg);
                }
            });
        });

        event.representatives.forEach((rep) => {
            if (rep.representative.user.tg) {
                tgIds.add(rep.representative.user.tg);
            }
        });

        return {
            id: event.id,
            name: event.name,
            start: event.start,
            tgIds: Array.from(tgIds), // Конвертируем Set в массив
        };
    });

    return NextResponse.json(result);
}
