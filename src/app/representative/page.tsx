// src/app/representative/page.tsx
"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CompetitionCards from "@/app/representative/_components/competition/competition-cards";
import EventCards from "@/app/representative/_components/event/event-cards";
import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { CompetitionItem, EventItem, Tab } from "@/types";
import { Card, CardBody, CardHeader, Pagination } from "@heroui/react";

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

    const compPageItems = competitionsData?.items ?? [];
    const totalCompPages = competitionsData?.pagination.totalPages ?? 1;

    const evtPageItems = eventsData?.items ?? [];
    const totalEvtPages = eventsData?.pagination.totalPages ?? 1;

    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex min-h-[100vh] w-full">
                {/* Sidebar */}
                <div className="w-full p-4 sm:w-1/4">
                    <Card className="sticky top-4">
                        <CardHeader>Поиск</CardHeader>
                        <CardBody>
                            <p>Параметры поиска</p>
                        </CardBody>
                    </Card>
                </div>

                {/* Main */}
                <div className="container mx-auto w-full flex-1 px-4 py-8 sm:w-3/4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {activeTab === "requests" ? (
                            isCompLoading ? (
                                <p>Загрузка заявок...</p>
                            ) : (
                                <CompetitionCards paginatedData={compPageItems} />
                            )
                        ) : activeTab === "events" ? (
                            isEventLoading ? (
                                <p>Загрузка событий...</p>
                            ) : (
                                <EventCards paginatedData={evtPageItems} />
                            )
                        ) : null}
                    </div>

                    {activeTab === "requests" && totalCompPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination showControls page={page} total={totalCompPages} onChange={setPage} />
                        </div>
                    )}
                    {activeTab === "events" && totalEvtPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                showControls
                                page={eventsData!.pagination.page}
                                total={totalEvtPages}
                                onChange={setPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            <FooterElement />
        </>
    );
}
