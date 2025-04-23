import { NextResponse } from "next/server";

import { getUserNotifications, markUserNotificationsRead } from "@/data/notification";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const list = await getUserNotifications(userId);

    return NextResponse.json(
        list.map((i) => ({
            ...i,
            sendTime: i.sendTime.toISOString(),
        })),
    );
}

export async function PUT(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    await markUserNotificationsRead(userId);

    return NextResponse.json({ success: true });
}
