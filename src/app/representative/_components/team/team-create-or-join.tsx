"use client";

import React, { useEffect, useState } from "react";

import TeamCreateForm from "@/app/representative/_components/team/team-create-form";
import TeamJoinForm from "@/app/representative/_components/team/team-join-form";
import { getTeamsByEvent } from "@/data/team";
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

export default function TeamCreateOrJoin({ eventId }: { eventId: string }) {
    const [teamsData, setTeamsData] = useState<Paged<TeamWithMembersItem> | null>(null);
    const [isTeamsLoading, setIsTeamsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const teamsPageItems = teamsData?.items ?? [];
    const totalTeamsPages = teamsData?.pagination.totalPages ?? 1;

    const handleCreateValues = React.useCallback(async () => {
        const pageSize = 6;
        const teamsOnEvent = await getTeamsByEvent(eventId);

        // Объединяем тестовые данные с реальными командами
        const allTeams = teamsOnEvent.map((team) => {
            // Находим капитана (isLeader: true)
            const captain = team.athletes.find((a) => a.isLeader)?.athlete;

            // Получаем всех участников (исключая капитана)
            const members = team.athletes.filter((a) => !a.isLeader).map((a) => a.athlete);

            return {
                id: team.id,
                name: team.name,
                isReady: team.isReady,
                about: team.about ?? "",
                leader: captain
                    ? `${captain.user.lastname || "Неизвестно"} ${captain.user.firstname || ""}`
                    : "Капитан не назначен",
                members: members.map((m) => `${m.user.lastname || "Анонимный участник"} ${m.user.firstname || ""}`),
            };
        });

        const totalItems = allTeams.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedItems = allTeams.slice(startIndex, endIndex);

        const pagedData: Paged<TeamWithMembersItem> = {
            items: paginatedItems,
            pagination: {
                page,
                pageSize,
                totalItems,
                totalPages,
            },
        };

        setTeamsData(pagedData);
    }, [eventId, page]); // Зависимости функции

    useEffect(() => {
        setIsTeamsLoading(true);
        handleCreateValues()
            .catch((error: unknown) => {
                // Явное указание типа unknown
                if (error instanceof Error) {
                    console.error("Ошибка загрузки команд:", error.message);
                } else {
                    console.error("Неизвестная ошибка:", error);
                }
                setTeamsData({
                    items: [],
                    pagination: {
                        page: 1,
                        pageSize: 6,
                        totalItems: 0,
                        totalPages: 1,
                    },
                });
            })
            .finally(() => {
                setIsTeamsLoading(false);
            });
    }, [handleCreateValues]);

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
