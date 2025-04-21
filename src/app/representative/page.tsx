"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CompetitionCards from "@/app/representative/_components/competition/competition-cards";
import EventCards from "@/app/representative/_components/event/event-cards";
import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { Card, CardBody, CardHeader, Pagination } from "@heroui/react";

// Заглушка данных (13 элементов для демонстрации пагинации)
const competitions = Array(13).fill({
    title: "Кубок НР",
    region: "ДНР",
    startDate: "23.05.2025",
    endDate: "25.05.2025",
    applicationDate: "17.04.2025",
    status: "На рассмотрении",
    format: "Онлайн",
    discipline: "Продуктовое программирование",
    image: "https://heroui.com/images/hero-card-complete.jpeg",
}) as Record<string, string>[];

// Заглушка данных (13 элементов для демонстрации пагинации)
const events = Array(13).fill({
    title: "Кубок НР",
    region: "ДНР",
    startDate: "23.05.2025",
    endDate: "25.05.2025",
    format: "Онлайн",
    discipline: "Продуктовое программирование",
    image: "https://heroui.com/images/hero-card-complete.jpeg",
}) as Record<string, string>[];

export default function RequestsPage() {
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("requests");
    const itemsPerPage = 12;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // При монтировании проверяем URL и устанавливаем активную вкладку
    useEffect(() => {
        if (!pathname.startsWith("/representative")) {
            router.push("/representative?tab=events");
            return;
        }

        const tab = searchParams.get("tab");
        if (tab && ["requests", "events", "team"].includes(tab)) {
            setActiveTab(tab);
        } else {
            // Если параметр tab отсутствует, устанавливаем по умолчанию "events"
            router.replace(`/representative?tab=events`);
            setActiveTab("events");
        }
    }, [pathname, router, searchParams]);

    const data = activeTab === "requests" ? competitions : events;

    const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex min-h-[100vh] w-full flex-col">
                <div className="grid grid-cols-4">
                    <div className="w-full ps-3">
                        <Card className="sticky top-50">
                            <CardHeader>Поиск</CardHeader>
                            <CardBody>
                                <p>Параметры поиска</p>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-span-3 container mx-auto w-[95%] flex-1 px-4 py-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activeTab === "requests" ? (
                                <CompetitionCards paginatedData={paginatedData} />
                            ) : (
                                <EventCards paginatedData={paginatedData} />
                            )}
                        </div>

                        {data.length > itemsPerPage && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    showControls
                                    page={page}
                                    total={Math.ceil(data.length / itemsPerPage)}
                                    onChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <FooterElement />
            </div>
        </>
    );
}
