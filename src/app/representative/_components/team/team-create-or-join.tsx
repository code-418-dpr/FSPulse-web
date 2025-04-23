"use client";

import React, { useEffect, useState } from "react";

import TeamCreateForm from "@/app/representative/_components/team/team-create-form";
import TeamJoinForm from "@/app/representative/_components/team/team-join-form";
import { TeamWithMembersItem } from "@/types";
import { CircularProgress, Pagination, Tab, Tabs } from "@heroui/react";

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

function createTeam(): TeamWithMembersItem {
    return {
        name: "Код 418",
        leader: "Евтушенко Сергей",
        members: ["Якубенко Вадим", "Коржов Антон", "Панков Егор", "Бубнов Гергий"],
    };
}

const teamsWithMembers: TeamWithMembersItem[] = Array.from({ length: 13 }, createTeam);

export default function TeamCreateOrJoin({ eventId }: { eventId: string }) {
    const [teamsData, setTeamsData] = useState<Paged<TeamWithMembersItem> | null>(null);
    const [isTeamsLoading, setIsTeamsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const teamsPageItems = teamsData?.items ?? [];
    const totalTeamsPages = teamsData?.pagination.totalPages ?? 1;

    useEffect(() => {
        const pageSize = 6;
        const totalItems = teamsWithMembers.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedItems = teamsWithMembers.slice(startIndex, endIndex);

        const pagedData: Paged<TeamWithMembersItem> = {
            items: paginatedItems,
            pagination: {
                page,
                pageSize,
                totalItems,
                totalPages,
            },
        };

        setIsTeamsLoading(true);
        setTeamsData(pagedData);
        setIsTeamsLoading(false);
    }, [page]);

    return (
        <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
            <Tab key="create" title="Создать команду">
                <TeamCreateForm eventId={eventId} />
            </Tab>
            <Tab key="join" title="Присоединиться к команде">
                <div className="container mx-auto w-full flex-1 px-3 py-4">
                    {teamsPageItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {isTeamsLoading ? (
                                <CircularProgress aria-label="Loading..." size="lg" />
                            ) : (
                                <TeamJoinForm paginatedData={teamsPageItems} />
                            )}
                        </div>
                    ) : (
                        <div className="content-center justify-center">
                            <p className="text-secondary text-2xl">Здесь пока ничего нет</p>
                        </div>
                    )}
                    {totalTeamsPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination showControls page={page} total={totalTeamsPages} onChange={setPage} />
                        </div>
                    )}
                </div>
            </Tab>
        </Tabs>
    );
}
