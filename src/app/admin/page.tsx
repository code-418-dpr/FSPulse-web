// src/app/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AchievementCards from "@/app/admin/_components/achievement/achievement-cards";
import EventCards from "@/app/admin/_components/event/event-cards";
import { MainCards } from "@/app/admin/_components/main-cards";
// Вынесённый компонент статистики
import { Statistics } from "@/app/admin/_components/statistics/statistics";
import TeamCards from "@/app/admin/_components/team/team-cards";
import CompetitionCards from "@/components/competition/competition-cards";
import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { SearchCardOrDrawer } from "@/components/search/search-card-or-drawer";
import { searchRepresentativeEvents, searchRepresentativeRequests } from "@/data/event";
import { getRepresentatives } from "@/data/representative";
import { useAuth } from "@/hooks/use-auth";
import { AchievementItem, EventItem, RepresentativeItem, Tab, TeamItem } from "@/types";
import { RepresentativeRequestItem, SearchParams } from "@/types/search";
import { CircularProgress } from "@heroui/react";

import { RequestStatus } from "../generated/prisma";
import { RepresentativeTableWithPagination } from "./_components/representative-table";

// src/app/admin/page.tsx

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export default function AdministratorPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [searchParamsState, setSearchParamsState] = useState<SearchParams>({
        requestStatus: RequestStatus.APPROVED,
    });
    const [representativesData, setRepresentativesData] = useState<Paged<RepresentativeItem> | null>(null);
    const [eventsData, setEventsData] = useState<Paged<EventItem> | null>(null);
    const [teamData, setTeamData] = useState<Paged<TeamItem> | null>(null);
    const [requestsData, setRequestsData] = useState<Paged<RepresentativeRequestItem> | null>(null);
    const [achievementData, setAchievementData] = useState<Paged<AchievementItem> | null>(null);
    const [isLoadingTab, setIsLoadingTab] = useState(false);
    const [page, setPage] = useState(1);

    // Основные вкладки (representative, events, team, requests, achievement, statistics)
    const [activeTab, setActiveTab] = useState<Tab | "statistics">("representative");

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const perPage = 12;

    // Синхронизация вкладок с URL
    useEffect(() => {
        const tab = searchParams.get("tab") as Tab | "statistics" | null;
        if (tab && ["representative", "events", "team", "requests", "achievement", "statistics"].includes(tab)) {
            setActiveTab(tab);
        } else {
            router.replace("/admin?tab=representative");
            setActiveTab("representative");
        }
    }, [pathname, router, searchParams]);

    // Редирект, если не аутентифицирован
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isLoading, isAuthenticated, router]);

    // Загрузка списка представительств
    useEffect(() => {
        if (activeTab !== "representative") return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const res = await getRepresentatives({
                    ...searchParamsState,
                    page,
                    pageSize: perPage,
                });
                setRepresentativesData({
                    items: res.results,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: res.totalItems,
                        totalPages: res.totalPages,
                    },
                });
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page, searchParamsState]);

    // Загрузка событий
    useEffect(() => {
        if (activeTab !== "events") return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const res = await searchRepresentativeEvents({
                    ...searchParamsState,
                    page,
                    pageSize: perPage,
                });
                setEventsData({
                    items: res.results,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: res.totalItems,
                        totalPages: res.totalPages,
                    },
                });
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page, searchParamsState]);

    // Загрузка команд
    useEffect(() => {
        if (activeTab !== "team") return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const r = await fetch(`/api/teams?page=${page}&pageSize=${perPage}`);
                const data = (await r.json()) as Paged<TeamItem>;
                setTeamData(data);
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page]);

    // Загрузка заявок
    useEffect(() => {
        if (activeTab !== "requests") return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const res = await searchRepresentativeRequests({
                    ...searchParamsState,
                    page,
                    pageSize: perPage,
                });
                setRequestsData({
                    items: res.results,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: res.totalItems,
                        totalPages: res.totalPages,
                    },
                });
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page, searchParamsState]);

    // Загрузка достижений
    useEffect(() => {
        if (activeTab !== "achievement") return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const r = await fetch(`/api/achievements?page=${page}&pageSize=${perPage}`);
                const data = (await r.json()) as Paged<AchievementItem>;
                setAchievementData(data);
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page]);

    const handleSearch = (params: SearchParams) => {
        setSearchParamsState(params);
        setPage(1);
    };

    if (isLoading) {
        return <CircularProgress size="lg" />;
    }
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />

            <div className="flex min-h-[100vh] w-full">
                <SearchCardOrDrawer onSearchAction={handleSearch} tabType={activeTab as Tab} />

                <div className="flex-1 space-y-8 p-6">
                    {activeTab === "representative" && (
                        <RepresentativeTableWithPagination
                            data={{
                                items: representativesData?.items ?? [],
                                totalPages: representativesData?.pagination.totalPages ?? 1,
                                currentPage: page,
                            }}
                            onPageChangeAction={setPage}
                        />
                    )}

                    {activeTab === "events" && (
                        <MainCards<EventItem>
                            isLoading={isLoadingTab}
                            pageItems={eventsData?.items ?? []}
                            totalPages={eventsData?.pagination.totalPages ?? 1}
                            page={page}
                            setPageAction={setPage}
                            renderCardsAction={(items) => <EventCards paginatedData={items} />}
                        />
                    )}

                    {activeTab === "team" && (
                        <MainCards<TeamItem>
                            isLoading={isLoadingTab}
                            pageItems={teamData?.items ?? []}
                            totalPages={teamData?.pagination.totalPages ?? 1}
                            page={page}
                            setPageAction={setPage}
                            renderCardsAction={(items) => <TeamCards paginatedData={items} />}
                        />
                    )}

                    {activeTab === "requests" && (
                        <MainCards<RepresentativeRequestItem>
                            isLoading={isLoadingTab}
                            pageItems={requestsData?.items ?? []}
                            totalPages={requestsData?.pagination.totalPages ?? 1}
                            page={page}
                            setPageAction={setPage}
                            renderCardsAction={(items) => <CompetitionCards paginatedData={items} />}
                        />
                    )}

                    {activeTab === "achievement" && <AchievementCards paginatedData={achievementData?.items ?? []} />}

                    {activeTab === "statistics" && <Statistics />}
                </div>
            </div>

            <FooterElement />
        </>
    );
}
