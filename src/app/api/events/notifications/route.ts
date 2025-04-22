import { addHours } from "date-fns";

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// ✅ удалён isWithinInterval

const EXPECTED_TOKEN = process.env.API_TOKEN;

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ") || authHeader.split(" ")[1] !== EXPECTED_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const events = await prisma.event.findMany({
        where: {
            requestStatus: "APPROVED",
            endRegistration: { gt: now },
            start: { gt: now, lt: addHours(now, 24) },
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
            representative: {
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
        const tgIds: string[] = [];

        for (const team of event.teams) {
            for (const a of team.athletes) {
                const tg = a.athlete.user.tg;
                if (tg) tgIds.push(tg);
            }
        }

        for (const rep of event.representative) {
            const tg = rep.representative.user.tg;
            if (tg) tgIds.push(tg);
        }

        return {
            id: event.id,
            name: event.name,
            start: event.start,
            tgIds: Array.from(new Set(tgIds)), // ✅ уникальные ID
        };
    });

    return NextResponse.json(result);
}
