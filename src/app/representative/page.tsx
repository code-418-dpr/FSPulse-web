"use client";

import { useState } from "react";

import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { Card, CardBody, Chip, Image, Pagination } from "@heroui/react";

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

export default function RequestsPage() {
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

    const paginatedData = competitions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <NavbarElement />
            <div className="flex min-h-[100vh] w-full flex-col">
                <div className="container mx-auto w-[70%] flex-1 px-4 py-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedData.map((competition, index) => (
                            <Card key={index} className="transition-shadow hover:shadow-lg">
                                <CardBody className="space-y-4">
                                    <Image
                                        alt={competition.title}
                                        className="w-full rounded-xl object-cover"
                                        src={competition.image}
                                    />
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">{competition.title}</h3>
                                        <div className="grid grid-cols-2 pt-2">
                                            <Chip color="warning" variant="solid">
                                                {competition.status}
                                            </Chip>
                                            <p className="pt-1 text-right text-sm">{competition.applicationDate}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {competitions.length > itemsPerPage && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                showControls
                                page={page}
                                total={Math.ceil(competitions.length / itemsPerPage)}
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
