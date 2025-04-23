import { NextResponse } from "next/server";

import { getEventSummaries } from "@/data/event";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "12", 10);

    try {
        const data = await getEventSummaries(page, pageSize);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Ошибка в /api/events:", error);
        return NextResponse.json({
            items: [],
            pagination: {
                page,
                pageSize,
                totalItems: 0,
                totalPages: 1,
            },
        });
    }
}
