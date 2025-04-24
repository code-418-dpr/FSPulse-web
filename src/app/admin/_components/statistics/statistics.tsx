import React, { useState } from "react";
import { Icon } from "@iconify/react";

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

type RankingTab = "athletes" | "coaches" | "reps";

export function Statistics() {
    const [tab, setTab] = useState<RankingTab>("athletes");

    // Columns and data for each sub-tab
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
            {/* Header with export button */}
            <div className="flex items-center justify-between rounded-xl border border-content3 bg-content1 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-500 dark:bg-primary-900/30">
                        <Icon icon="lucide:bar-chart-2" width={24} />
                    </div>
                    <h2 className="text-2xl font-semibold">Статистика</h2>
                </div>
                <ExportPdfButton
                    exportId="statistics-box"
                    fileName="admin-statistics.pdf"
                    label="Скачать статистику"
                    tableColumns={tab === "reps" ? repColumns : ratingColumns}
                    tableData={tab === "reps" ? repData : ratingData}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card title="Мероприятия по типу" icon="lucide:pie-chart">
                    <BarChart
                        data={adminEventsByType}
                        color="#944dee"
                    />
                </Card>
                <Card title="Соревнования по неделям" icon="lucide:line-chart">
                    <LineChart
                        data={adminEventsByWeek}
                        strokeColor="#2889f4"
                    />
                </Card>
            </div>

            {/* Rankings */}
            <Card title="Рейтинги" icon="lucide:trophy">
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
            </Card>
        </div>
    );
}