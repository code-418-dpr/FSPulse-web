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

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

// Stub‑данные для requests
const competitionsStub: CompetitionItem[] = Array.from(
    { length: 13 },
    (): CompetitionItem => ({
        title: "Кубок НР",
        region: "ДНР",
        startDate: "23.05.2025",
        endDate: "25.05.2025",
        applicationDate: "17.04.2025",
        status: "На рассмотрении",
        format: "Онлайн",
        discipline: "Продуктовое программирование",
        image: "https://heroui.com/images/hero-card-complete.jpeg",
    }),
);

export default function RequestsPage() {
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<Tab>("requests");
    const [eventsData, setEventsData] = useState<Paged<EventItem> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const perPage = 12;

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
        if (activeTab !== "events") return;
        setIsLoading(true);
        void fetch(`/api/events?page=${page}&pageSize=${perPage}`)
            .then((r) => r.json())
            .then((json: Paged<EventItem>) => { setEventsData(json); })
            .finally(() => { setIsLoading(false); });
    }, [activeTab, page]);

    const compPage = competitionsStub.slice((page - 1) * perPage, page * perPage);
    const evtPage = eventsData?.items ?? [];

    const totalCompPages = Math.ceil(competitionsStub.length / perPage);
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
                            <CompetitionCards paginatedData={compPage} />
                        ) : isLoading ? (
                            <p>Загрузка...</p>
                        ) : (
                            <EventCards paginatedData={evtPage} />
                        )}
                    </div>

                    {activeTab === "requests" && totalCompPages > 1 && (
                        <Pagination showControls page={page} total={totalCompPages} onChange={setPage} />
                    )}
                    {activeTab === "events" && totalEvtPages > 1 && (
                        <Pagination
                            showControls
                            page={eventsData!.pagination.page}
                            total={totalEvtPages}
                            onChange={setPage}
                        />
                    )}
                </div>
            </div>

            <FooterElement />
        </>
    );
}
