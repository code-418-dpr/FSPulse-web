import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

const EXPECTED_TOKEN = process.env.API_TOKEN;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const token = authHeader.split(" ")[1];

    if (token !== EXPECTED_TOKEN) {
        return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    const eventId = params.id;

    if (!eventId) {
        return new NextResponse(JSON.stringify({ error: "Event ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
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
            return new NextResponse(JSON.stringify({ error: "Event not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new NextResponse(JSON.stringify(event), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
