// src/app/representative/page.tsx
"use client";

import React, { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AchievementCards from "@/app/representative/_components/achievement/achievement-cards";
import CompetitionCards from "@/app/representative/_components/competition/competition-cards";
import EventCards from "@/app/representative/_components/event/event-cards";
import { MainCards } from "@/app/representative/_components/main-cards";
import { SearchCardOrDrawer } from "@/app/representative/_components/search/search-card-or-drawer";
import TeamCards from "@/app/representative/_components/team/team-cards";
import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { AchievementItem, CompetitionItem, EventItem, Tab, TeamItem } from "@/types";
import { CircularProgress } from "@heroui/react";

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

// src/app/representative/page.tsx

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

export default function RequestsPage() {
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<Tab>("requests");
    const [competitionsData, setCompetitionsData] = useState<Paged<CompetitionItem> | null>(null);
    const [isCompLoading, setIsCompLoading] = useState(false);
    const [eventsData, setEventsData] = useState<Paged<EventItem> | null>(null);
    const [isEventLoading, setIsEventLoading] = useState(false);
    const [teamData, setTeamData] = useState<Paged<TeamItem> | null>(null);
    const [isTeamLoading, setIsTeamLoading] = useState(false);
    const [achievementData, setAchievementData] = useState<Paged<AchievementItem> | null>(null);
    const [isAchievementLoading, setIsAchievementLoading] = useState(false);
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const perPage = 12;

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
        if (activeTab !== "requests") return;
        setIsCompLoading(true);
        void fetch(`/api/competitions?page=${page}&pageSize=${perPage}`)
            .then((r) => r.json())
            .then((json: Paged<CompetitionItem>) => {
                setCompetitionsData(json);
            })
            .finally(() => {
                setIsCompLoading(false);
            });
    }, [activeTab, page]);

    // load events when on "events"
    useEffect(() => {
        if (activeTab !== "events") return;
        setIsEventLoading(true);
        void fetch(`/api/events?page=${page}&pageSize=${perPage}`)
            .then((r) => r.json())
            .then((json: Paged<EventItem>) => {
                setEventsData(json);
            })
            .finally(() => {
                setIsEventLoading(false);
            });
    }, [activeTab, page]);

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

    const compPageItems = competitionsData?.items ?? [];
    const totalCompPages = competitionsData?.pagination.totalPages ?? 1;

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
            <NavbarElement activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex min-h-[100vh] w-full">
                {/* Sidebar */}
                <SearchCardOrDrawer />

                {/* Main */}
                {activeTab === "requests" && (
                    <MainCards<CompetitionItem>
                        isLoading={isCompLoading}
                        pageItems={compPageItems}
                        totalPages={totalCompPages}
                        page={page}
                        setPage={setPage}
                        renderCards={(items) => <CompetitionCards paginatedData={items} />}
                    />
                )}

                {activeTab === "events" && (
                    <MainCards<EventItem>
                        isLoading={isEventLoading}
                        pageItems={evtPageItems}
                        totalPages={totalEvtPages}
                        page={page}
                        setPage={setPage}
                        renderCards={(items) => <EventCards paginatedData={items} />}
                    />
                )}

                {activeTab === "team" && (
                    <MainCards<TeamItem>
                        isLoading={isTeamLoading}
                        pageItems={teamPageItems}
                        totalPages={totalTeamPages}
                        page={page}
                        setPage={setPage}
                        renderCards={(items) => <TeamCards paginatedData={items} />}
                    />
                )}

                {activeTab === "achievement" && (
                    <MainCards<AchievementItem>
                        isLoading={isAchievementLoading}
                        pageItems={achievementPageItems}
                        totalPages={totalAchievementPages}
                        page={page}
                        setPage={setPage}
                        renderCards={(items) => <AchievementCards paginatedData={items} />}
                    />
                )}
            </div>

            <FooterElement />
        </>
    );
}
