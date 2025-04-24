"use client";

import React, { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AchievementCards from "@/app/representative/_components/achievement/achievement-cards";
import { MainCards } from "@/app/representative/_components/main-cards";
import TeamCards from "@/app/representative/_components/team/team-cards";
import CompetitionCards from "@/components/competition/competition-cards";
import CompetitionCreateForm from "@/components/competition/competition-create-form";
import EventCards from "@/components/event/event-cards";
import FooterElement from "@/components/footer";
import ModalOrDrawer from "@/components/modal-or-drawer";
import NavbarElement from "@/components/navbar";
import { SearchCardOrDrawer } from "@/components/search/search-card-or-drawer";
import { searchRepresentativeEvents, searchRepresentativeRequests } from "@/data/event";
import { useAuth } from "@/hooks/use-auth";
import { AchievementItem, EventItem, Tab, TeamItem } from "@/types";
import { RepresentativeRequestItem, SearchParams } from "@/types/search";
import { Button, CircularProgress, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

import { RequestStatus } from "../generated/prisma";

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export default function RequestsPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [searchParamsState, setSearchParamsState] = useState<SearchParams>({
        requestStatus: RequestStatus.PENDING,
    });
    const [requestsData, setRequestsData] = useState<Paged<RepresentativeRequestItem> | null>(null);
    const [isRequestsLoading, setIsRequestsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<Tab>("requests");
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

    // sync tab from URL
    useEffect(() => {
        const tab = searchParams.get("tab") as Tab | null;
        if (tab && ["requests", "events", "team"].includes(tab)) {
            setActiveTab(tab);
        } else {
            router.replace("/representative?tab=requests");
            setActiveTab("requests");
        }
    }, [pathname, router, searchParams]);
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    // load competitions when on "requests"
    useEffect(() => {
        if (activeTab !== "requests" || !user?.id) return;
        console.log(user.id);
        const loadRequests = async () => {
            setIsRequestsLoading(true);
            try {
                const params = {
                    ...searchParamsState,
                    representativeId: user.id,
                    page,
                    pageSize: perPage,
                };
                console.log("Параметры поиска: ", params);
                const result = await searchRepresentativeRequests(params);
                console.log("Результат: ", result);
                setRequestsData({
                    items: result.results,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: result.totalItems,
                        totalPages: result.totalPages,
                    },
                });
            } catch (error) {
                console.error("Error loading requests:", error);
            } finally {
                setIsRequestsLoading(false);
            }
        };

        void loadRequests();
    }, [activeTab, page, searchParamsState, user?.id]);

    // Обработчик поиска
    const handleSearch = (params: SearchParams) => {
        setSearchParamsState(params);
        setPage(1);
    };

    // load events when on "events"
    useEffect(() => {
        if (activeTab !== "events") return;

        const loadEvents = async () => {
            setIsEventLoading(true);
            try {
                const result = await searchRepresentativeEvents({
                    ...searchParamsState,
                    representativeId: user?.id,
                    page,
                    pageSize: perPage,
                });
                setEventsData({
                    items: result.results,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: result.totalItems,
                        totalPages: result.totalPages,
                    },
                });
            } catch (error) {
                console.error("Error loading events:", error);
            } finally {
                setIsEventLoading(false);
            }
        };

        void loadEvents();
    }, [activeTab, page, searchParamsState, user?.id]);

    useEffect(() => {
        if (activeTab !== "team") return;
        setIsTeamLoading(true);
        void fetch(`/api/events?page=${page}&pageSize=${perPage}`)
            .then((r) => r.json())
            .then((json: Paged<TeamItem>) => {
                setTeamData(json);
            })
            .finally(() => {
                setIsTeamLoading(false);
            });
    }, [activeTab, page]);

    useEffect(() => {
        if (activeTab !== "achievement") return;
        setIsTeamLoading(true);
        void fetch(`/api/events?page=${page}&pageSize=${perPage}`)
            .then((r) => r.json())
            .then((json: Paged<AchievementItem>) => {
                setAchievementData(json);
            })
            .finally(() => {
                setIsAchievementLoading(false);
            });
    }, [activeTab, page]);

    const compPageItems = requestsData?.items ?? [];
    const totalCompPages = requestsData?.pagination.page ?? 1;

    const evtPageItems = eventsData?.items ?? [];
    const totalEvtPages = eventsData?.pagination.totalPages ?? 1;

    const teamPageItems = teamData?.items ?? [];
    const totalTeamPages = teamData?.pagination.totalPages ?? 1;

    const achievementPageItems = achievementData?.items ?? [];
    const totalAchievementPages = achievementData?.pagination.totalPages ?? 1;

    if (isLoading) {
        return <CircularProgress aria-label="Loading..." size="lg" />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />

            <div className="flex min-h-[100vh] w-full">
                {/* Sidebar */}
                <SearchCardOrDrawer onSearchAction={handleSearch} tabType={activeTab} />

                {/* Main */}
                {activeTab === "requests" && (
                    <>
                        <MainCards<RepresentativeRequestItem>
                            isLoading={isRequestsLoading}
                            pageItems={compPageItems}
                            totalPages={totalCompPages}
                            page={page}
                            setPageAction={setPage}
                            renderCardsAction={(items) => <CompetitionCards paginatedData={items} />}
                        />
                        <div className="absolute">
                            <Button
                                className="fixed right-5 bottom-5 z-10"
                                isIconOnly
                                aria-label="Create"
                                onPress={onOpen}
                                size="lg"
                            >
                                <Icon icon="iconoir:plus" width={50} height={50} />
                            </Button>
                        </div>
                        <ModalOrDrawer label="Создание соревнования" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                            <CompetitionCreateForm />
                        </ModalOrDrawer>
                    </>
                )}

                {activeTab === "events" && (
                    <MainCards<EventItem>
                        isLoading={isEventLoading}
                        pageItems={evtPageItems}
                        totalPages={totalEvtPages}
                        page={page}
                        setPageAction={setPage}
                        renderCardsAction={(items) => <EventCards paginatedData={items} />}
                    />
                )}

                {activeTab === "team" && (
                    <MainCards<TeamItem>
                        isLoading={isTeamLoading}
                        pageItems={teamPageItems}
                        totalPages={totalTeamPages}
                        page={page}
                        setPageAction={setPage}
                        renderCardsAction={(items) => <TeamCards paginatedData={items} />}
                    />
                )}

                {activeTab === "achievement" && (
                    <MainCards<AchievementItem>
                        isLoading={isAchievementLoading}
                        pageItems={achievementPageItems}
                        totalPages={totalAchievementPages}
                        page={page}
                        setPageAction={setPage}
                        renderCardsAction={(items) => <AchievementCards paginatedData={items} />}
                    />
                )}
            </div>

            <FooterElement />
        </>
    );
}
