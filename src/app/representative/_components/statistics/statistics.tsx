// src/app/representative/_components/statistics/statistics.tsx
"use client";

import React, { useState } from "react";

import { Column, ExportPdfButton } from "@/app/common/_components/ExportPdfButton";
import { BarChart } from "@/app/common/_components/statistics/BarChart";
import { Card } from "@/app/common/_components/statistics/Card";
import { LineChart } from "@/app/common/_components/statistics/LineChart";
import { PieChart } from "@/app/common/_components/statistics/PieChart";
import { TableContainer } from "@/app/common/_components/statistics/TableContainer";
import { Tabs as StatTabs } from "@/app/common/_components/statistics/Tabs";
import {
    repAthleteRanking,
    repCoachRanking,
    repEventsByFormat,
    repEventsByMonth,
    repRequestsByStatus,
} from "@/mocks/statistics/representative";

// src/app/representative/_components/statistics/statistics.tsx

type RankingTab = "athletes" | "coaches";

export function Statistics() {
    const [tab, setTab] = useState<RankingTab>("athletes");

    // Конфигурация таблицы
    const ratingColumns: Column[] = [
        { key: "rank", title: "№" },
        { key: "fio", title: "ФИО" },
        { key: "points", title: "Баллы" },
    ];
    const ratingData = (tab === "athletes" ? repAthleteRanking : repCoachRanking).map((r, i) => ({
        rank: i + 1,
        ...r,
    }));

    return (
        <div id="representative-statistics" className="space-y-8">
            {/* Header + экспорт */}
            <div className="flex items-center justify-between rounded bg-white p-6 shadow">
                <h2 className="text-2xl font-semibold">Статистика</h2>
                <ExportPdfButton
                    exportId="representative-statistics"
                    fileName="representative-stats.pdf"
                    label="Скачать статистику"
                    tableColumns={ratingColumns}
                    tableData={ratingData}
                />
            </div>

            {/* Диаграммы */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card title="Заявки по статусу">
                    <PieChart data={repRequestsByStatus} />
                </Card>
                <Card title="Формат мероприятий">
                    <BarChart data={repEventsByFormat} />
                </Card>
                <Card title="Мероприятия по месяцам">
                    <LineChart data={repEventsByMonth} />
                </Card>
            </div>

            {/* Рейтинги */}
            <div>
                <h3 className="mb-4 text-xl font-semibold">Рейтинги региона</h3>
                <StatTabs
                    tabs={[
                        { id: "athletes", label: "Спортсмены" },
                        { id: "coaches", label: "Тренеры" },
                    ]}
                    onSelect={(id) => setTab(id as RankingTab)}
                />
                <TableContainer columns={ratingColumns} data={ratingData} />
            </div>
        </div>
    );
}
