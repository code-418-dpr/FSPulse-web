"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CompetitionCards from "@/app/representative/_components/competition-cards";
import EventCards from "@/app/representative/_components/event-cards";
import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { EventItem, Tab } from "@/types";
import { Pagination } from "@heroui/react";

interface PagedResponse<T> {
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
    const [activeTab, setActiveTab] = useState<Tab>("events");
    const [eventsData, setEventsData] = useState<PagedResponse<EventItem> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Синхронизируем вкладку с параметром ?tab=
    useEffect(() => {
        const tab = searchParams.get("tab") as Tab | null;
        if (tab && ["requests", "events", "team"].includes(tab)) {
            setActiveTab(tab);
        } else {
            router.replace("/representative?tab=events");
            setActiveTab("events");
        }
    }, [pathname, router, searchParams, setActiveTab]);

    // Подгружаем события при смене вкладки или страницы
    useEffect(() => {
        if (activeTab !== "events") return;

        setIsLoading(true);
        // void чтобы ESLint не жаловался на «плавающий» промис
        void fetch(`/api/events?page=${page}&pageSize=12`)
            .then((res) => res.json())
            .then((json: PagedResponse<EventItem>) => {
                setEventsData(json);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [activeTab, page]);

    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex min-h-[100vh] w-full flex-col">
                <div className="container mx-auto w-[70%] flex-1 px-4 py-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {activeTab === "requests" ? (
                            // TODO: заменить [] на реальные CompetitionItem[]
                            <CompetitionCards paginatedData={[]} />
                        ) : isLoading ? (
                            <p>Загрузка...</p>
                        ) : eventsData ? (
                            <EventCards paginatedData={eventsData.items} />
                        ) : null}
                    </div>

                    {activeTab === "events" && eventsData && eventsData.pagination.totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                showControls
                                page={eventsData.pagination.page}
                                total={eventsData.pagination.totalPages}
                                onChange={setPage}
                            />
                        </div>
                    )}
                </div>
                <FooterElement />
            </div>
        </>
    );
}
