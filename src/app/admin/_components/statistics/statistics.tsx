// src/app/admin/_components/statistics/statistics.tsx
"use client";

import React, { useState } from "react";

import { Column, ExportPdfButton } from "@/app/common/_components/ExportPdfButton";
import { BarChart } from "@/app/common/_components/statistics/BarChart";
import { Card } from "@/app/common/_components/statistics/Card";
import { LineChart } from "@/app/common/_components/statistics/LineChart";
import { TableContainer } from "@/app/common/_components/statistics/TableContainer";
import { Tabs as StatTabs } from "@/app/common/_components/statistics/Tabs";
import {
    adminAthleteRanking,
    adminCoachRanking,
    adminEventsByType,
    adminEventsByWeek,
    adminRepresentativeRanking,
} from "@/mocks/statistics/admin";

// src/app/admin/_components/statistics/statistics.tsx

type RankingTab = "athletes" | "coaches" | "reps";

export function Statistics() {
    const [tab, setTab] = useState<RankingTab>("athletes");

    // колонки и данные для каждой под-вкладки
    const repColumns: Column[] = [
        { key: "rank", title: "№" },
        { key: "region", title: "Регион" },
        { key: "manager", title: "Ответственный" },
        { key: "eventsCount", title: "Орг. мероприятий" },
    ];
    const repData = adminRepresentativeRanking.map((r, i) => ({
        rank: i + 1,
        region: r.region,
        manager: r.manager,
        eventsCount: r.eventsCount,
    }));

    const ratingColumns: Column[] = [
        { key: "rank", title: "№" },
        { key: "fio", title: "ФИО" },
        { key: "region", title: "Регион" },
        { key: "points", title: "Баллы" },
    ];
    const ratingData = (tab === "athletes" ? adminAthleteRanking : adminCoachRanking).map((r, i) => ({
        rank: i + 1,
        ...r,
    }));

    return (
        <div id="statistics-box" className="space-y-8">
            {/* Шапка с кнопкой экспорта */}
            <div className="flex items-center justify-between rounded bg-white p-6 shadow">
                <h2 className="text-2xl font-semibold">Статистика</h2>
                <ExportPdfButton
                    exportId="statistics-box"
                    fileName="admin-statistics.pdf"
                    label="Скачать статистику"
                    tableColumns={tab === "reps" ? repColumns : ratingColumns}
                    tableData={tab === "reps" ? repData : ratingData}
                />
            </div>

            {/* Диаграммы */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card title="Мероприятия по типу">
                    <BarChart data={adminEventsByType} />
                </Card>
                <Card title="Соревнования по неделям">
                    <LineChart data={adminEventsByWeek} />
                </Card>
            </div>

            {/* Рейтинги */}
            <div>
                <h3 className="mb-4 text-xl font-semibold">Рейтинги</h3>
                <StatTabs
                    tabs={[
                        { id: "athletes", label: "Спортсмены" },
                        { id: "coaches", label: "Тренеры" },
                        { id: "reps", label: "Представительства" },
                    ]}
                    onSelect={(id) => { setTab(id as RankingTab); }}
                />
                {tab === "reps" ? (
                    <TableContainer columns={repColumns} data={repData} />
                ) : (
                    <TableContainer columns={ratingColumns} data={ratingData} />
                )}
            </div>
        </div>
    );
}
