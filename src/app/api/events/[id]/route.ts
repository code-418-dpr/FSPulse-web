import { type NextRequest } from "next/server";

import prisma from "@/lib/prisma";

interface RouteParams {
    params: {
        id: string;
    };
}

const EXPECTED_TOKEN = process.env.API_TOKEN;

export async function GET(request: NextRequest, { params }: RouteParams) {
    // Correct type
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (token !== EXPECTED_TOKEN) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const eventId = params.id;

    if (!eventId) {
        return Response.json({ error: "Event ID is required" }, { status: 400 });
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
            return Response.json({ error: "Event not found" }, { status: 404 });
        }

        return Response.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
