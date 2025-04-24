// src/app/representative/page.tsx
"use client";

import React, { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AchievementCards from "@/app/representative/_components/achievement/achievement-cards";
import EventCards from "@/app/representative/_components/event/event-cards";
import { MainCards } from "@/app/representative/_components/main-cards";
import { Statistics } from "@/app/representative/_components/statistics/statistics";
import TeamCards from "@/app/representative/_components/team/team-cards";
import CompetitionCards from "@/components/competition/competition-cards";
import CompetitionCreateForm from "@/components/competition/competition-create-form";
import FooterElement from "@/components/footer";
import ModalOrDrawer from "@/components/modal-or-drawer";
import NavbarElement from "@/components/navbar";
import { SearchCardOrDrawer } from "@/components/search/search-card-or-drawer";
import { searchRepresentativeRequests } from "@/data/event";
import { useAuth } from "@/hooks/use-auth";
import { AchievementItem, EventItem, Tab, TeamItem } from "@/types";
import { RepresentativeRequestItem, SearchParams } from "@/types/search";
import { Button, CircularProgress, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

import { RequestStatus } from "../generated/prisma";

// src/app/representative/page.tsx

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export default function RepresentativePage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [searchParamsState, setSearchParamsState] = useState<SearchParams>({
        requestStatus: RequestStatus.PENDING,
    });
    const [requestsData, setRequestsData] = useState<Paged<RepresentativeRequestItem> | null>(null);
    const [isRequestsLoading, setIsRequestsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [activeTab, setActiveTab] = useState<Tab>("requests");
    const [ratingTab, setRatingTab] = useState<"athletes" | "coaches">("athletes");

    const [eventsData, setEventsData] = useState<Paged<EventItem> | null>(null);
    const [isEventLoading, setIsEventLoading] = useState(false);
    const [teamData, setTeamData] = useState<Paged<TeamItem> | null>(null);
    const [isTeamLoading, setIsTeamLoading] = useState(false);
    const [achievementData, setAchievementData] = useState<Paged<AchievementItem> | null>(null);
    const [isAchievementLoading, setIsAchievementLoading] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const perPage = 12;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const tab = searchParams.get("tab") as Tab | null;
        if (tab && ["requests", "events", "team", "achievement"].includes(tab)) {
            setActiveTab(tab);
        } else {
            router.replace("/representative?tab=requests");
            setActiveTab("requests");
        }
    }, [pathname, router, searchParams]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push("/");
    }, [isLoading, isAuthenticated, router]);

    // Загрузка данных по табам…
    useEffect(() => {
        if (activeTab !== "requests" || !user?.id) return;
        setIsRequestsLoading(true);
        (async () => {
            try {
                const params = { ...searchParamsState, representativeId: user.id, page, pageSize: perPage };
                const res = await searchRepresentativeRequests(params);
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
                setIsRequestsLoading(false);
            }
        })();
    }, [activeTab, page, searchParamsState, user?.id]);

    useEffect(() => {
        if (activeTab === "events") {
            setIsEventLoading(true);
            fetch(`/api/events?page=${page}&pageSize=${perPage}`)
                .then((r) => r.json())
                .then((json: Paged<EventItem>) => setEventsData(json))
                .finally(() => setIsEventLoading(false));
        }
    }, [activeTab, page]);

    useEffect(() => {
        if (activeTab === "team") {
            setIsTeamLoading(true);
            fetch(`/api/teams?page=${page}&pageSize=${perPage}`)
                .then((r) => r.json())
                .then((json: Paged<TeamItem>) => setTeamData(json))
                .finally(() => setIsTeamLoading(false));
        }
    }, [activeTab, page]);

    useEffect(() => {
        if (activeTab === "achievement") {
            setIsAchievementLoading(true);
            fetch(`/api/achievements?page=${page}&pageSize=${perPage}`)
                .then((r) => r.json())
                .then((json: Paged<AchievementItem>) => setAchievementData(json))
                .finally(() => setIsAchievementLoading(false));
        }
    }, [activeTab, page]);

    const handleSearch = (params: SearchParams) => {
        setSearchParamsState(params);
        setPage(1);
    };

    if (isLoading) return <CircularProgress size="lg" />;
    if (!isAuthenticated) return null;

    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />

            <div className="flex min-h-[100vh] w-full">
                {activeTab !== "achievement" && (
                    <SearchCardOrDrawer onSearchAction={handleSearch} tabType={activeTab} />
                )}

                <div className="flex-1 space-y-8 p-6">
                    {activeTab === "requests" && (
                        <>
                            <MainCards<RepresentativeRequestItem>
                                isLoading={isRequestsLoading}
                                pageItems={requestsData?.items ?? []}
                                totalPages={requestsData?.pagination.totalPages ?? 1}
                                page={page}
                                setPageAction={setPage}
                                renderCardsAction={(items) => <CompetitionCards paginatedData={items} />}
                            />
                            <Button
                                isIconOnly
                                onPress={onOpen}
                                className="fixed right-5 bottom-5 z-10"
                                aria-label="Создать"
                                size="lg"
                            >
                                <Icon icon="iconoir:plus" width={50} height={50} />
                            </Button>
                            <ModalOrDrawer label="Создание" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                                <CompetitionCreateForm />
                            </ModalOrDrawer>
                        </>
                    )}

                    {activeTab === "events" && (
                        <MainCards<EventItem>
                            isLoading={isEventLoading}
                            pageItems={eventsData?.items ?? []}
                            totalPages={eventsData?.pagination.totalPages ?? 1}
                            page={page}
                            setPageAction={setPage}
                            renderCardsAction={(items) => <EventCards paginatedData={items} />}
                        />
                    )}

                    {activeTab === "team" && (
                        <MainCards<TeamItem>
                            isLoading={isTeamLoading}
                            pageItems={teamData?.items ?? []}
                            totalPages={teamData?.pagination.totalPages ?? 1}
                            page={page}
                            setPageAction={setPage}
                            renderCardsAction={(items) => <TeamCards paginatedData={items} />}
                        />
                    )}

                    {activeTab === "achievement" && <AchievementCards paginatedData={achievementData?.items ?? []} />}

                    {activeTab === "achievement" && <Statistics />}
                </div>
            </div>

            <FooterElement />
        </>
    );
}
