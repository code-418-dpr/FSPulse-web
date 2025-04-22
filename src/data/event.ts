"use server";

import prisma from "@/lib/prisma";
import { SearchRepresentativeRequestsParams } from "@/types/search";

export async function searchRepresentativeRequests(params: SearchRepresentativeRequestsParams) {
    const {
        page,
        pageSize,
        representativeId,
        query,
        disciplineId,
        minApplicationTime,
        maxApplicationTime,
        level,
        requestStatus,
    } = params;
    const requiredWhere = {
        representative: {
            some: { representativeId },
        },
    };
    const results = await prisma.event.findMany({
        where: {
            AND: [
                requiredWhere,
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
        skip: pageSize * (page - 1),
        take: pageSize,
        orderBy: { applicationTime: "desc" },
    });
    const totalItems = await prisma.event.count({ where: requiredWhere });
    return { results, totalItems, totalPages: Math.ceil(totalItems / pageSize) };
}

interface SearchRepresentativeEventsParams {
    page: number;
    pageSize: number;
    representativeId: string;
    query?: string;
    disciplineId?: string;
    minStartTime?: Date;
    maxStartTime?: Date;
    level?: EventLevel;
    minAge?: number;
    maxAge?: number;
    isOnline?: boolean;
    isTeamFormatAllowed?: boolean;
    isPersonalFormatAllowed?: boolean;
}

export async function searchRepresentativeEvents(params: SearchRepresentativeEventsParams) {
    const {
        page,
        pageSize,
        representativeId,
        query,
        disciplineId,
        minStartTime,
        maxStartTime,
        level,
        minAge,
        maxAge,
        isOnline,
        isTeamFormatAllowed,
        isPersonalFormatAllowed,
    } = params;
    const requiredWhere = {
        representative: {
            some: { representativeId },
        },
        requestStatus: RequestStatus.APPROVED,
    };
    const results = await prisma.event.findMany({
        where: {
            AND: [
                requiredWhere,
                query
                    ? {
                          OR: [
                              { name: { contains: query, mode: "insensitive" } },
                              { description: { contains: query, mode: "insensitive" } },
                          ],
                      }
                    : {},
                disciplineId ? { disciplineId } : {},
                minStartTime || maxStartTime
                    ? {
                          start: {
                              gte: minStartTime,
                          },
                          end: {
                              lte: maxStartTime,
                          },
                      }
                    : {},
                level ? { level } : {},
                minAge || maxAge
                    ? {
                          minAge: {
                              gte: minAge,
                          },
                          maxAge: {
                              lte: maxAge,
                          },
                      }
                    : {},
                isOnline ? { isOnline } : {},
                isTeamFormatAllowed
                    ? {
                          minTeamParticipantsCount: { gt: 0 },
                          maxTeamParticipantsCount: { gt: 0 },
                      }
                    : {},
                isPersonalFormatAllowed ? { isPersonalFormatAllowed } : {},
            ],
        },
        select: { id: true, name: true, cover: true, requestStatus: true, level: true, applicationTime: true },
        skip: pageSize * (page - 1),
        take: pageSize,
        orderBy: { applicationTime: "desc" },
    });
    const totalItems = await prisma.event.count({ where: requiredWhere });
    return { results, totalItems, totalPages: Math.ceil(totalItems / pageSize) };
}

export async function getRepresentativeRequestById(id: string) {
    return prisma.event.findUnique({
        where: { id },
        include: {
            representative: {
                include: {
                    representative: {
                        include: {
                            user: {
                                include: {
                                    region: true,
                                },
                            },
                        },
                    },
                },
            },
            discipline: true,
        },
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
