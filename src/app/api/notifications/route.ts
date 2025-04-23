// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const list = await prisma.notification.findMany({
        where: { userId },
        orderBy: { notificationTime: "desc" },
    });

    return NextResponse.json(
        list.map((i) => ({
            ...i,
            notificationTime: i.notificationTime.toISOString(),
        })),
    );
}

export async function PUT(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });

    return NextResponse.json({ success: true });
}
