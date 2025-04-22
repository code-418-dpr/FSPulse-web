import prisma from "@/lib/prisma";

export interface EventSummary {
    id: string;
    name: string;
    start: string;
    status: string;
    imageBase64: string;
}

export interface PagedResult<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export async function getEventSummaries(page: number, pageSize: number): Promise<PagedResult<EventSummary>> {
    const skip = (page - 1) * pageSize;

    const [totalItems, events] = await prisma.$transaction([
        prisma.event.count(),
        prisma.event.findMany({
            skip,
            take: pageSize,
            select: { id: true, name: true, start: true, status: true, cover: true },
        }),
    ]);

    const items: EventSummary[] = events.map((e) => ({
        id: e.id,
        name: e.name,
        start: e.start.toISOString(),
        status: e.requestStatus,
        imageBase64: Buffer.from(e.cover).toString("base64"),
    }));

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    return { items, pagination: { page, pageSize, totalItems, totalPages } };
}
