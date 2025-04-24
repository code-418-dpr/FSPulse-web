"use server";

import { RequestStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export interface RepresentativeItem {
    id: string;
    region: string;
    fio: string;
    status: RequestStatus;
}

export async function getRepresentatives(params: { page?: number; pageSize?: number; requestStatus?: RequestStatus }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 12;
    const skip = (page - 1) * pageSize;

    const where = params.requestStatus ? { requestStatus: params.requestStatus } : {};

    const [representatives, totalItems] = await Promise.all([
        prisma.representative.findMany({
            where,
            skip,
            take: pageSize,
            include: {
                user: {
                    select: {
                        lastname: true,
                        firstname: true,
                        middlename: true,
                        region: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.representative.count({ where }),
    ]);

    const results: RepresentativeItem[] = representatives.map((rep) => ({
        id: rep.id,
        region: rep.user.region.name,
        fio: [rep.user.lastname, rep.user.firstname, rep.user.middlename].filter(Boolean).join(" "),
        status: rep.requestStatus,
    }));

    return {
        results,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
    };
}
export async function getRepresentativeById(id: string) {
    return prisma.representative.findUnique({
        where: { id },
        include: {
            user: {
                include: {
                    region: true,
                },
            },
        },
    });
}
export async function getRepresentativeByUserId(userId: string) {
    return prisma.representative.findMany({
        where: {
            user: {
                id: userId,
            },
        },
        include: {
            user: {
                include: {
                    region: true,
                },
            },
        },
    });
}
export async function getRepresentativesByRegionId(regionId: string) {
    return prisma.representative.findMany({
        where: {
            user: {
                regionId: regionId,
            },
        },
        include: {
            user: {
                include: {
                    region: true,
                },
            },
        },
    });
}
export async function updateRepresentativeStatus(id: string, status: "APPROVED" | "DECLINED", comment?: string) {
    return prisma.representative.update({
        where: { id },
        data: {
            requestStatus: status,
            requestComment: status === "DECLINED" ? comment : null,
        },
    });
}
