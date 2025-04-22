import { EventLevel, RequestStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

interface SearchRepresentativeRequestsParams {
    query?: string;
    disciplineId?: string;
    minApplicationTime?: Date;
    maxApplicationTime?: Date;
    level?: EventLevel;
    requestStatus?: RequestStatus;
}

// eslint-disable-next-line
async function searchRepresentativeRequests(params: SearchRepresentativeRequestsParams) {
    const { query, disciplineId, minApplicationTime, maxApplicationTime, level, requestStatus } = params;
    return prisma.event.findMany({
        where: {
            AND: [
                query
                    ? {
                          OR: [
                              { name: { contains: query, mode: "insensitive" } },
                              { description: { contains: query, mode: "insensitive" } },
                          ],
                      }
                    : {},
                disciplineId ? { disciplineId } : {},
                minApplicationTime || maxApplicationTime
                    ? {
                          applicationTime: {
                              gte: minApplicationTime,
                              lte: maxApplicationTime,
                          },
                      }
                    : {},
                level ? { level } : {},
                requestStatus ? { requestStatus } : {},
            ],
        },
        select: { id: true, name: true, cover: true, requestStatus: true, level: true, applicationTime: true },
    });
}

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
            select: { id: true, name: true, start: true, requestStatus: true, cover: true },
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
