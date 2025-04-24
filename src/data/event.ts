"use server";

import { EventLevel, RequestStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { SearchRepresentativeEventRequestsParams, SearchRepresentativeEventsParams } from "@/types/search";

export async function searchRepresentativeRequests(params: SearchRepresentativeEventRequestsParams) {
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
        representatives: representativeId
            ? {
                  some: { representativeId },
              }
            : {},
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
        select: {
            id: true,
            name: true,
            cover: true,
            requestStatus: true,
            level: true,
            applicationTime: true,
            discipline: true,
        },
        skip: pageSize * (page - 1),
        take: pageSize,
        orderBy: { applicationTime: "desc" },
    });
    const totalItems = await prisma.event.count({ where: requiredWhere });
    return {
        results,
        pages: Math.ceil(results.length / pageSize),
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
    };
}

export async function searchRepresentativeEvents(params: SearchRepresentativeEventsParams) {
    const {
        page,
        pageSize,
        representativeId,
        query,
        requestStatus,
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
        representatives: representativeId
            ? {
                  some: { representativeId },
              }
            : {},
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
                requestStatus ? { requestStatus } : {},
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
        select: {
            id: true,
            name: true,
            cover: true,
            requestStatus: true,
            level: true,
            applicationTime: true,
            startRegistration: true,
            endRegistration: true,
            start: true,
            end: true,
            discipline: true,
            isOnline: true,
        },
        skip: pageSize * (page - 1),
        take: pageSize,
        orderBy: { applicationTime: "desc" },
    });
    const totalItems = await prisma.event.count({ where: requiredWhere });
    return {
        results,
        pages: Math.ceil(results.length / pageSize),
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
    };
}

export async function getRepresentativeRequestById(id: string) {
    return prisma.event.findUnique({
        where: { id },
        include: {
            representatives: {
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

export async function getEventById(id: string) {
    return prisma.event.findUnique({
        where: { id },
        include: {
            representatives: {
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
            files: true,
        },
    });
}

export interface FileData {
    name: string;
    content: Uint8Array;
    type: string;
}

export interface CompetitionRequestData {
    name: string;
    description: string;
    address: string;
    level: EventLevel;
    discipline: string;
    isOnline: boolean;
    startRegistration: Date;
    endRegistration: Date;
    start: Date;
    end: Date;
    requestStatus: RequestStatus;
    minAge: number;
    maxAge: number;
    minTeamParticipantsCount: number;
    maxTeamParticipantsCount: number;
    maxParticipantsCount: number;
    cover: Uint8Array;
    files?: FileData[]; // необязательные файлы
    representatives?: string[]; // массив id представителей
}
export const createCompetitionRequest = async (data: CompetitionRequestData) => {
    const { files = [], representatives = [], cover, ...eventData } = data;
    const minAge = eventData.minAge;
    const maxAge = eventData.maxAge;
    const maxParticipantsCount = eventData.maxParticipantsCount;
    return prisma.event.create({
        data: {
            ...eventData,
            minAge, 
            maxAge, 
            maxParticipantsCount,
            cover: Buffer.from(cover),
            level: eventData.level,
            discipline: { connect: { id: eventData.discipline } },
            isPersonalFormatAllowed: false,
            files:
                files.length > 0
                    ? {
                        create: data.files?.map((file) => ({
                            name: file.name,
                            content: Buffer.from(file.content), // Конвертируем Uint8Array в Buffer
                        })),
                      }
                    : undefined,
            representatives:
                representatives.length > 0
                    ? {
                          create: representatives.map((id) => ({
                              representative: { connect: { id } },
                          })),
                      }
                    : undefined,
            awards: [165, 145, 120, 100], // Инициализируем пустым массивом, если нужно
        },
        include: {
            discipline: true,
            files: true,
            representatives: {
                include: {
                    representative: true,
                },
            },
        },
    });
};

// —————————————————————————————————————————

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
export async function updateEventStatus(eventId: string, status: RequestStatus, comment?: string) {
    try {
        // Обновляем статус мероприятия
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                requestStatus: status,
                requestComment: status === RequestStatus.DECLINED ? comment : null,
            },
            include: {
                representatives: {
                    include: {
                        representative: {
                            select: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        // Создаем уведомления для всех представителей мероприятия
        const notifications = updatedEvent.representatives.map((rep) => ({
            userId: rep.representative.user.id,
            type: "INFO" as const,
            title: `Статус мероприятия "${updatedEvent.name}" изменен`,
            content: `Статус изменен на "${
                status === RequestStatus.APPROVED ? "Одобрено" : "Отклонено"
            }"${comment ? ` с комментарием: ${comment}` : ""}`,
        }));

        if (notifications.length > 0) {
            await prisma.notification.createMany({
                data: notifications,
            });
        }

        return updatedEvent;
    } catch (error) {
        console.error("Error updating event status:", error);
        throw new Error("Не удалось обновить статус мероприятия");
    }
}

export const setResultsForEvent = async (resultsArray: { teamId: string; score: number }[], eventId: string) => {
    // Используем транзакцию для атомарного обновления
    return prisma.$transaction(
        resultsArray.map((result) =>
            prisma.team.update({
                where: {
                    id: result.teamId,
                    eventId: eventId, // Дополнительная проверка, что команда принадлежит событию
                },
                data: {
                    score: result.score,
                },
            }),
        ),
    );
};
