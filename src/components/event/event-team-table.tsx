"use client";

import React, { useEffect, useState } from "react";

import { getTeamsByEvent } from "@/data/team";
import { TeamWithMembersItem } from "@/types";
import { Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

export default function TeamsOnEvent({ eventId }: { eventId: string }) {
    const [data, setData] = React.useState<TeamWithMembersItem[] | null>(null);
    const [isTeamsLoading, setIsTeamsLoading] = useState(false);
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 6;

    const pages = Math.ceil((data?.length ?? 0) / rowsPerPage) || 1;

    const handleCreateValues = React.useCallback(async () => {
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

        setData(allTeams);
    }, [eventId]); // Зависимости функции }, [eventId, page]);

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
            })
            .finally(() => {
                setIsTeamsLoading(false);
            });
    }, [handleCreateValues]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return data?.slice(start, end);
    }, [page, data]);

    return (
        <Table
            key={`table-${eventId}`}
            aria-label="Example table with client side pagination"
            bottomContent={
                isTeamsLoading ? (
                    <div key="loading-spinner" className="flex w-full justify-center">
                        <Spinner color="white" size="sm" />
                    </div>
                ) : (
                    <div key="pagination" className="flex w-full justify-center">
                        <Pagination
                            initialPage={1}
                            showControls
                            page={page}
                            total={pages}
                            onChange={(page) => {
                                setPage(page);
                            }}
                            key={`pagination-${eventId}`}
                        />
                    </div>
                )
            }
            classNames={{
                wrapper: "min-h-[222px]",
            }}
        >
            <TableHeader>
                <TableColumn key="name">Название команды</TableColumn>
                <TableColumn key="Leader">Капитан</TableColumn>
                <TableColumn key="IsReady">Готовность</TableColumn>
                <TableColumn key="CountParcipants">Кол-во участников</TableColumn>
            </TableHeader>
            <TableBody items={items}>
                {items?.map((item) => (
                    <TableRow key={`team-${item.id}`}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.leader}</TableCell>
                        <TableCell>{item.isReady ? "Готовы" : "Не готовы"}</TableCell>
                        <TableCell>{item.members.length}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
