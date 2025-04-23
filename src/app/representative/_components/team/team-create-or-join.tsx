"use client";

import React, { useEffect, useState } from "react";

import { MainCards } from "@/app/representative/_components/main-cards";
import TeamCreateForm from "@/app/representative/_components/team/team-create-form";
import TeamJoinForm from "@/app/representative/_components/team/team-join-form";
import { TeamWithMembersItem } from "@/types";
import { Tab, Tabs } from "@heroui/react";

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

export default function TeamCreateOrJoin() {
    const [teamsData, setTeamsData] = useState<Paged<TeamWithMembersItem> | null>(null);
    const [isTeamsLoading, setIsTeamsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const teamsPageItems = teamsData?.items ?? [];
    const totalTeamsPages = teamsData?.pagination.totalPages ?? 1;

    useEffect(() => {
        const pagedData: Paged<TeamWithMembersItem> = {
            items: teamsWithMembers,
            pagination: {
                page: 1,
                pageSize: 6,
                totalItems: teamsWithMembers.length,
                totalPages: Math.ceil(teamsWithMembers.length / 6),
            },
        };

        setIsTeamsLoading(true);
        setTeamsData(pagedData);
        setIsTeamsLoading(false);
    }, []);

    return (
        <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
            <Tab key="create" title="Создать команду">
                <TeamCreateForm />
            </Tab>
            <Tab key="join" title="Присоединиться к команде">
                <MainCards<TeamWithMembersItem>
                    isLoading={isTeamsLoading}
                    pageItems={teamsPageItems}
                    totalPages={totalTeamsPages}
                    page={page}
                    setPageAction={setPage}
                    renderCardsAction={(items) => <TeamJoinForm paginatedData={items} />}
                />
            </Tab>
        </Tabs>
    );
}
